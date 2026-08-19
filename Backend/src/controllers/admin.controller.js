const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const { ok, fail } = require('../utils/apiResponse');
const Admin = require('../models/admin.model');
const User = require('../models/user.model');
const Captain = require('../models/captain.model');
const Ride = require('../models/rideCore.model');
const Service = require('../models/service.model');
const pricingService = require('../services/pricing.service');
const { POLICE_STATIONS, getNearestPoliceStation, fetchNearbyPoliceStations } = require('../utils/rideAllocationRules');

/** Match ride.controller payRide / COMMISSION_PERCENT default (15%). */
function commissionPct() {
    return Number(process.env.COMMISSION_PERCENT || 15) / 100;
}

const DEFAULT_ADMIN_EMAIL = String(process.env.DEFAULT_ADMIN_EMAIL || 'sm@gmail.com').toLowerCase().trim();
const DEFAULT_ADMIN_PASSWORD = String(process.env.DEFAULT_ADMIN_PASSWORD || '123456');

function adminLoginDebug (...args) {
    if (process.env.ADMIN_LOGIN_DEBUG === 'true') console.log(...args);
}

async function ensureDefaultAdmin() {
    let admin = await Admin.findOne({ email: DEFAULT_ADMIN_EMAIL }).select('+password');
    if (!admin) {
        const hashed = await Admin.hashPassword(DEFAULT_ADMIN_PASSWORD);
        admin = await Admin.create({ email: DEFAULT_ADMIN_EMAIL, password: hashed });
    }
    return admin;
}

module.exports.loginAdmin = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        adminLoginDebug('ADMIN LOGIN validation errors:', errors.array());
        return fail(res, req, 400, 'Validation failed', { errors: errors.array() });
    }

    const { email, password } = req.body;
    await ensureDefaultAdmin();

    const normalizedEmail = String(email ?? '').toLowerCase().trim();
    const normalizedPassword = String(password ?? '').trim();

    adminLoginDebug('ADMIN LOGIN attempt:', { normalizedEmail, hasPassword: !!normalizedPassword });

    // Dev-friendly default admin bypass (prevents "stuck 401" when DB state is inconsistent)
    if (normalizedEmail === DEFAULT_ADMIN_EMAIL && normalizedPassword === DEFAULT_ADMIN_PASSWORD) {
        const admin = await ensureDefaultAdmin();
        const token = admin.generateAuthToken();
        adminLoginDebug('ADMIN LOGIN success via DEFAULT bypass');
        return res.status(200).json({
            success: true,
            ok: true,
            token,
            admin: { _id: admin._id, email: admin.email },
        });
    }

    const admin = await Admin.findOne({ email: normalizedEmail }).select('+password');
    if (!admin) {
        adminLoginDebug('ADMIN LOGIN failed: admin not found for', normalizedEmail);
        return res.status(401).json({ success: false, ok: false, message: 'Admin not found for this email' });
    }

    const passwordOk = await admin.comparePassword(normalizedPassword);
    if (!passwordOk) {
        adminLoginDebug('ADMIN LOGIN failed: bad password for', normalizedEmail);
        return res.status(401).json({ success: false, ok: false, message: 'Password incorrect' });
    }

    const token = admin.generateAuthToken();
    adminLoginDebug('ADMIN LOGIN success (DB)', { id: admin._id, email: admin.email });
    return res.status(200).json({
        success: true,
        ok: true,
        token,
        admin: { _id: admin._id, email: admin.email },
    });
};

module.exports.getAnalytics = async (req, res) => {
    try {
        const [
            totalUsers,
            totalDrivers,
            totalRides,
            completedRides,
            activeDriversOnline,
            completedRideCount,
            completedWithCaptainCount,
        ] = await Promise.all([
            User.countDocuments({}),
            Captain.countDocuments({}),
            Ride.countDocuments({}),
            Ride.find({ status: 'completed' }).select('price city'),
            Captain.countDocuments({
                status: 'active',
                subscriptionStatus: 'active',
                approved: true,
                blocked: { $ne: true },
            }),
            Ride.countDocuments({ status: 'completed' }),
            Ride.countDocuments({ status: 'completed', captain: { $exists: true, $ne: null } }),
        ]);

        const totalRevenue = completedRides.reduce((sum, r) => sum + (r.price || 0), 0);

        const pct = commissionPct();
        const platformAgg = await Ride.aggregate([
            { $match: { status: 'completed' } },
            {
                $addFields: {
                    effPlatformFee: {
                        $cond: [
                            { $gt: [ { $ifNull: [ '$platformFee', 0 ] }, 0 ] },
                            '$platformFee',
                            { $multiply: [ { $ifNull: [ '$price', 0 ] }, pct ] },
                        ],
                    },
                },
            },
            { $group: { _id: null, platformIncome: { $sum: '$effPlatformFee' } } },
        ]);
        const platformIncomeTotal = Math.round(platformAgg[0]?.platformIncome || 0);

        const cityAnalytics = {
            Kolhapur: { rides: 0, drivers: 0, revenue: 0 },
            Ichalkaranji: { rides: 0, drivers: 0, revenue: 0 },
            Sangli: { rides: 0, drivers: 0, revenue: 0 },
        };

        const [ cityRideCounts, cityDriverCounts ] = await Promise.all([
            Ride.aggregate([
                { $group: { _id: '$city', rides: { $sum: 1 }, revenue: { $sum: '$price' } } }
            ]),
            Captain.aggregate([
                { $group: { _id: '$city', drivers: { $sum: 1 } } }
            ]),
        ]);

        cityRideCounts.forEach((c) => {
            const key = c._id;
            if (!cityAnalytics[key]) cityAnalytics[key] = { rides: 0, drivers: 0, revenue: 0 };
            cityAnalytics[key].rides = c.rides;
            cityAnalytics[key].revenue = c.revenue;
        });
        cityDriverCounts.forEach((c) => {
            const key = c._id;
            if (!cityAnalytics[key]) cityAnalytics[key] = { rides: 0, drivers: 0, revenue: 0 };
            cityAnalytics[key].drivers = c.drivers;
        });

        return ok(res, req, 200, 'Analytics', {
            totalUsers,
            totalDrivers,
            totalRides,
            totalRevenue,
            platformIncomeTotal,
            activeDriversOnline,
            completedRideCount,
            completedWithCaptainCount,
            cityAnalytics,
        });
    } catch (err) {
        return fail(res, req, 500, err.message || 'Analytics failed');
    }
};

module.exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({})
            .select('name email phone city createdAt blocked')
            .sort({ createdAt: -1 })
            .limit(500);
        return ok(res, req, 200, 'Users', { users });
    } catch (err) {
        return fail(res, req, 500, err.message || 'Users failed');
    }
};

module.exports.getDrivers = async (req, res) => {
    try {
        const pct = commissionPct();
        /** Must match Mongoose actual collection names (Atlas: `rides`, `drivers`). */
        const ridesColl = Ride.collection.collectionName;

        /**
         * Join drivers → rides by captain _id so ObjectId matching matches Atlas Browser.
         * Fallback: if no completed rides, show `totalEarnings` from driver document (ledger in MongoDB).
         */
        const enriched = await Captain.aggregate([
            { $sort: { createdAt: -1 } },
            { $limit: 500 },
            {
                $lookup: {
                    from: ridesColl,
                    let: { driverId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: [ '$status', 'completed' ] },
                                        {
                                            $or: [
                                                { $eq: [ '$captain', '$$driverId' ] },
                                                {
                                                    $eq: [
                                                        { $toString: '$captain' },
                                                        { $toString: '$$driverId' },
                                                    ],
                                                },
                                            ],
                                        },
                                    ],
                                },
                            },
                        },
                        {
                            $addFields: {
                                effPlatformFee: {
                                    $cond: [
                                        { $gt: [ { $ifNull: [ '$platformFee', 0 ] }, 0 ] },
                                        '$platformFee',
                                        { $multiply: [ { $ifNull: [ '$price', 0 ] }, pct ] },
                                    ],
                                },
                            },
                        },
                        {
                            $addFields: {
                                effDriverIncome: {
                                    $cond: [
                                        { $ne: [ '$captainNetEarning', null ] },
                                        '$captainNetEarning',
                                        { $subtract: [ { $ifNull: [ '$price', 0 ] }, '$effPlatformFee' ] },
                                    ],
                                },
                            },
                        },
                        {
                            $group: {
                                _id: null,
                                completedRides: { $sum: 1 },
                                driverIncome: { $sum: '$effDriverIncome' },
                                platformFromDriver: { $sum: '$effPlatformFee' },
                            },
                        },
                    ],
                    as: 'agg',
                },
            },
            {
                $addFields: {
                    st: { $arrayElemAt: [ '$agg', 0 ] },
                },
            },
            {
                $addFields: {
                    completedRides: { $ifNull: [ '$st.completedRides', 0 ] },
                    _incomeFromRides: { $round: [ { $ifNull: [ '$st.driverIncome', 0 ] }, 0 ] },
                    platformShare: { $round: [ { $ifNull: [ '$st.platformFromDriver', 0 ] }, 0 ] },
                },
            },
            {
                $addFields: {
                    driverIncome: {
                        $cond: [
                            { $gt: [ '$completedRides', 0 ] },
                            '$_incomeFromRides',
                            { $ifNull: [ '$totalEarnings', 0 ] },
                        ],
                    },
                },
            },
            {
                $addFields: {
                    effectiveSubscriptionStatus: {
                        $cond: [
                            {
                                $and: [
                                    { $eq: [ '$subscriptionStatus', 'active' ] },
                                    { $ne: [ '$subscriptionExpiresAt', null ] },
                                    { $lte: [ '$subscriptionExpiresAt', new Date() ] },
                                ],
                            },
                            'expired',
                            '$subscriptionStatus',
                        ],
                    },
                },
            },
            {
                $project: {
                    password: 0,
                    loginOtp: 0,
                    loginOtpExpiresAt: 0,
                    agg: 0,
                    st: 0,
                    _incomeFromRides: 0,
                },
            },
        ]);

        return ok(res, req, 200, 'Drivers', { drivers: enriched });
    } catch (err) {
        return fail(res, req, 500, err.message || 'Drivers failed');
    }
};

module.exports.approveDriver = async (req, res) => {
    try {
        const { id } = req.params;
        const driver = await Captain.findByIdAndUpdate(id, { approved: true }, { new: true })
            .select('name email phone city vehicleType vehicleNumber approved blocked subscriptionStatus');
        if (!driver) return fail(res, req, 404, 'Driver not found');
        return ok(res, req, 200, 'Driver approved', { driver });
    } catch (err) {
        return fail(res, req, 500, err.message || 'Approve failed');
    }
};

module.exports.rejectDriver = async (req, res) => {
    try {
        const { id } = req.params;
        const driver = await Captain.findByIdAndUpdate(id, { approved: false }, { new: true })
            .select('name email phone city vehicleType vehicleNumber approved blocked subscriptionStatus');
        if (!driver) return fail(res, req, 404, 'Driver not found');
        return ok(res, req, 200, 'Driver approval removed', { driver });
    } catch (err) {
        return fail(res, req, 500, err.message || 'Reject failed');
    }
};

const RIDE_STATUS_FILTER = [ 'searching', 'accepted', 'arrived', 'started', 'completed', 'cancelled' ];

module.exports.getRides = async (req, res) => {
    try {
        const raw = req.query?.status;
        const status = typeof raw === 'string' ? raw.trim().toLowerCase() : '';
        const filter = {};
        if (status && status !== 'all' && RIDE_STATUS_FILTER.includes(status)) {
            filter.status = status;
        }
        const rides = await Ride.find(filter)
            .select('city pickupLocation dropLocation price status createdAt completedAt paymentMethod paymentStatus user captain')
            .populate('user', 'name phone')
            .populate('captain', 'name phone vehicleNumber')
            .sort({ createdAt: -1 })
            .limit(500)
            .lean();
        return ok(res, req, 200, 'Rides', { rides, filter: status || 'all' });
    } catch (err) {
        return fail(res, req, 500, err.message || 'Rides failed');
    }
};

module.exports.getPayments = async (req, res) => {
    try {
        const rides = await Ride.find({ status: 'completed' })
            .select('price paymentMethod paymentStatus chargedAmount platformFee captainNetEarning status createdAt completedAt pickupLocation dropLocation city')
            .sort({ createdAt: -1 })
            .limit(500)
            .lean();
        const payments = rides.map((r) => ({
            _id: r._id,
            type: 'ride_fare',
            amount: r.chargedAmount != null ? r.chargedAmount : r.price,
            fare: r.price,
            paymentMode: r.paymentMethod,
            paymentStatus: r.paymentStatus || 'pending',
            platformFee: r.platformFee,
            captainNetEarning: r.captainNetEarning,
            rideStatus: r.status,
            summary: `${(r.pickupLocation || '').slice(0, 40)} → ${(r.dropLocation || '').slice(0, 40)}`,
            city: r.city,
            createdAt: r.createdAt,
            completedAt: r.completedAt,
        }));
        return ok(res, req, 200, 'Payments', { payments });
    } catch (err) {
        return fail(res, req, 500, err.message || 'Payments failed');
    }
};

module.exports.getSubscriptions = async (req, res) => {
    try {
        const SUB_PLANS = {
            BIKE: { weekly: 29, monthly: 99, yearly: 899 },
            AUTO: { weekly: 39, monthly: 149, yearly: 1199 },
            CAR: { weekly: 59, monthly: 199, yearly: 1599 },
        };
        const drivers = await Captain.find({ subscriptionStatus: { $ne: 'none' } })
            .select('name email vehicleType subscriptionStatus createdAt updatedAt')
            .sort({ updatedAt: -1 })
            .limit(500)
            .lean();
        const subs = drivers.map((d) => {
            const vtNorm = [ 'BIKE', 'AUTO', 'CAR' ].includes(d.vehicleType) ? d.vehicleType : 'AUTO';
            const vt = SUB_PLANS[vtNorm] ? vtNorm : 'AUTO';
            const weekly = SUB_PLANS[vt]?.weekly ?? SUB_PLANS.AUTO.weekly;
            return {
                _id: d._id,
                driverName: d.name,
                email: d.email,
                vehicleType: d.vehicleType,
                plan: d.subscriptionStatus,
                weeklyChargeHint: weekly,
                status: d.subscriptionStatus,
                updatedAt: d.updatedAt,
            };
        });
        return ok(res, req, 200, 'Subscriptions', { subscriptions: subs });
    } catch (err) {
        return fail(res, req, 500, err.message || 'Subscriptions failed');
    }
};

module.exports.blockDriver = async (req, res) => {
    try {
        const { id } = req.params;
        const { blocked } = req.body || {};
        if (typeof blocked !== 'boolean') return fail(res, req, 400, 'blocked boolean required');
        const driver = await Captain.findByIdAndUpdate(id, { blocked }, { new: true })
            .select('name email blocked approved');
        if (!driver) return fail(res, req, 404, 'Driver not found');
        return ok(res, req, 200, blocked ? 'Driver blocked' : 'Driver unblocked', { driver });
    } catch (err) {
        return fail(res, req, 500, err.message || 'Block driver failed');
    }
};

module.exports.blockUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { blocked } = req.body || {};
        if (typeof blocked !== 'boolean') return fail(res, req, 400, 'blocked boolean required');
        const user = await User.findByIdAndUpdate(id, { blocked }, { new: true })
            .select('name email phone blocked');
        if (!user) return fail(res, req, 404, 'User not found');
        return ok(res, req, 200, blocked ? 'User blocked' : 'User unblocked', { user });
    } catch (err) {
        return fail(res, req, 500, err.message || 'Block user failed');
    }
};

module.exports.getPricing = async (req, res) => {
    try {
        const [ rates, driverPlans, serviceAreas, svcDoc ] = await Promise.all([
            pricingService.getRates(),
            pricingService.getDriverPlansMerged(),
            pricingService.getServiceAreas(),
            pricingService.ensureServiceDoc(),
        ]);
        return ok(res, req, 200, 'Pricing', {
            rates,
            driverPlans,
            serviceAreas,
            commissionPercent: svcDoc?.commissionPercent,
            launchTrialDays: svcDoc?.launchTrialDays,
        });
    } catch (err) {
        return fail(res, req, 500, err.message || 'Pricing failed');
    }
};

module.exports.updatePricing = async (req, res) => {
    try {
        const body = req.body || {};
        let rates = body.rates;
        const driverPlans = body.driverPlans;
        if (!rates || typeof rates !== 'object') {
            const { driverPlans: _dp, rates: _r, ...rest } = body;
            if (rest.AUTO || rest.CAR || rest.BIKE) {
                rates = rest;
            } else {
                return fail(res, req, 400, 'rates object required');
            }
        }
        await pricingService.updateRates(rates);
        if (driverPlans && typeof driverPlans === 'object') {
            await pricingService.updateDriverPlans(driverPlans);
        }
        const meta = {};
        if (body.commissionPercent != null) meta.commissionPercent = Number(body.commissionPercent);
        if (Array.isArray(body.serviceAreas)) meta.serviceAreas = body.serviceAreas;
        if (body.launchTrialDays != null) meta.launchTrialDays = body.launchTrialDays;
        if (Object.keys(meta).length) {
            await pricingService.updateServiceMeta(meta);
        }
        const mergedRates = await pricingService.getRates();
        const mergedPlans = await pricingService.getDriverPlansMerged();
        const serviceAreas = await pricingService.getServiceAreas();
        const svcDoc = await pricingService.ensureServiceDoc();
        return ok(res, req, 200, 'Pricing updated', {
            rates: mergedRates,
            driverPlans: mergedPlans,
            serviceAreas,
            commissionPercent: svcDoc?.commissionPercent,
            launchTrialDays: svcDoc?.launchTrialDays,
        });
    } catch (err) {
        return fail(res, req, 500, err.message || 'Pricing update failed');
    }
};

const SERVICE_VEHICLE_TYPES = [ 'BIKE', 'AUTO', 'CAR' ];

function servicePayload (body = {}) {
    const name = String(body.name || '').trim();
    const vehicleType = String(body.vehicleType || '').trim().toUpperCase();
    const numericFields = [ 'baseFare', 'perKm', 'platformFee' ];
    const payload = { name, vehicleType };

    if (!name) return { error: 'Service name is required' };
    if (!SERVICE_VEHICLE_TYPES.includes(vehicleType)) return { error: 'vehicleType must be BIKE, AUTO, or CAR' };
    for (const field of numericFields) {
        const value = Number(body[field]);
        if (!Number.isFinite(value) || value < 0) return { error: `${field} must be a non-negative number` };
        payload[field] = value;
    }
    if (body.active !== undefined && typeof body.active !== 'boolean') return { error: 'active must be a boolean' };
    payload.active = body.active !== undefined ? body.active : true;
    return { payload };
}

/** Admin service catalogue only; deliberately excludes the global pricing/subscription document. */
module.exports.getServices = async (req, res) => {
    try {
        const services = await Service.find({ key: { $ne: 'global' }, name: { $exists: true, $ne: '' } })
            .select('key name vehicleType baseFare perKm platformFee active createdAt updatedAt')
            .sort({ createdAt: -1 })
            .lean();
        return ok(res, req, 200, 'Services', { services });
    } catch (err) {
        return fail(res, req, 500, err.message || 'Services failed');
    }
};

module.exports.createService = async (req, res) => {
    try {
        const parsed = servicePayload(req.body);
        if (parsed.error) return fail(res, req, 400, parsed.error);
        const service = await Service.create({
            key: `catalog-${new mongoose.Types.ObjectId().toString()}`,
            ...parsed.payload,
        });
        return ok(res, req, 201, 'Service created', { service });
    } catch (err) {
        return fail(res, req, 500, err.message || 'Create service failed');
    }
};

module.exports.updateService = async (req, res) => {
    try {
        const { id } = req.params;
        if (!validObjectId(id)) return fail(res, req, 400, 'Invalid service id');
        const parsed = servicePayload(req.body);
        if (parsed.error) return fail(res, req, 400, parsed.error);
        const service = await Service.findOneAndUpdate(
            { _id: id, key: { $ne: 'global' } },
            { $set: parsed.payload },
            { new: true, runValidators: true }
        ).select('key name vehicleType baseFare perKm platformFee active createdAt updatedAt');
        if (!service) return fail(res, req, 404, 'Service not found');
        return ok(res, req, 200, 'Service updated', { service });
    } catch (err) {
        return fail(res, req, 500, err.message || 'Update service failed');
    }
};

module.exports.deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        if (!validObjectId(id)) return fail(res, req, 400, 'Invalid service id');
        const service = await Service.findOneAndDelete({ _id: id, key: { $ne: 'global' } });
        if (!service) return fail(res, req, 404, 'Service not found');
        return ok(res, req, 200, 'Service deleted', { deletedId: id });
    } catch (err) {
        return fail(res, req, 500, err.message || 'Delete service failed');
    }
};

function validObjectId (id) {
    return mongoose.Types.ObjectId.isValid(String(id || ''));
}

/** Permanent removal — use only from trusted admin console. */
module.exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        if (!validObjectId(id)) return fail(res, req, 400, 'Invalid user id');
        const deleted = await User.findByIdAndDelete(id);
        if (!deleted) return fail(res, req, 404, 'User not found');
        return ok(res, req, 200, 'User deleted', { deletedId: id });
    } catch (err) {
        return fail(res, req, 500, err.message || 'Delete user failed');
    }
};

module.exports.deleteDriver = async (req, res) => {
    try {
        const { id } = req.params;
        if (!validObjectId(id)) return fail(res, req, 400, 'Invalid driver id');
        const deleted = await Captain.findByIdAndDelete(id);
        if (!deleted) return fail(res, req, 404, 'Driver not found');
        return ok(res, req, 200, 'Driver deleted', { deletedId: id });
    } catch (err) {
        return fail(res, req, 500, err.message || 'Delete driver failed');
    }
};

module.exports.deleteRide = async (req, res) => {
    try {
        const { id } = req.params;
        if (!validObjectId(id)) return fail(res, req, 400, 'Invalid ride id');
        const deleted = await Ride.findByIdAndDelete(id);
        if (!deleted) return fail(res, req, 404, 'Ride not found');
        return ok(res, req, 200, 'Ride deleted', { deletedId: id });
    } catch (err) {
        return fail(res, req, 500, err.message || 'Delete ride failed');
    }
};

const EMERGENCY_ALERTS = [
    {
        _id: 'emergency-001',
        type: 'panic_button',
        status: 'pending',
        riderName: 'Aisha Khan',
        phone: '+91 98765 43210',
        location: { lat: 16.704987, lng: 74.243257 },
        city: 'Kolhapur',
        createdAt: new Date().toISOString(),
    },
    {
        _id: 'emergency-002',
        type: 'alarm',
        status: 'acknowledged',
        riderName: 'Neha Patil',
        phone: '+91 99887 66554',
        location: { lat: 16.698298, lng: 74.21489 },
        city: 'Kolhapur',
        createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    },
];

module.exports.getEmergencyAlerts = async (req, res) => {
    try {
        return ok(res, req, 200, 'Emergency alerts', { alerts: EMERGENCY_ALERTS });
    } catch (err) {
        return fail(res, req, 500, err.message || 'Emergency alerts failed');
    }
};

module.exports.getPoliceStations = async (req, res) => {
    try {
        const city = String(req.query.city || 'Kolhapur').trim();
        const fallback = POLICE_STATIONS[city] || Object.values(POLICE_STATIONS).flat();
        const live = await fetchNearbyPoliceStations({ lat: 16.704987, lng: 74.243257 }, 15000);
        const stations = live.length ? live : fallback;
        return ok(res, req, 200, 'Police stations', { stations, city, source: live.length ? 'live' : 'fallback' });
    } catch (err) {
        return fail(res, req, 500, err.message || 'Police stations failed');
    }
};

module.exports.acknowledgeEmergencyAlert = async (req, res) => {
    try {
        const alert = EMERGENCY_ALERTS.find((item) => item._id === req.params.id);
        if (!alert) return fail(res, req, 404, 'Emergency alert not found');
        alert.status = 'acknowledged';
        return ok(res, req, 200, 'Emergency alert acknowledged', { alert });
    } catch (err) {
        return fail(res, req, 500, err.message || 'Acknowledge emergency failed');
    }
};

module.exports.resolveEmergencyAlert = async (req, res) => {
    try {
        const alert = EMERGENCY_ALERTS.find((item) => item._id === req.params.id);
        if (!alert) return fail(res, req, 404, 'Emergency alert not found');
        alert.status = 'resolved';
        const fallback = POLICE_STATIONS[alert.city] || Object.values(POLICE_STATIONS).flat();
        const live = await fetchNearbyPoliceStations(alert.location, 15000);
        const nearest = getNearestPoliceStation(alert.location, live.length ? live : fallback);
        return ok(res, req, 200, 'Emergency alert resolved', { alert, nearestPolice: nearest, source: live.length ? 'live' : 'fallback' });
    } catch (err) {
        return fail(res, req, 500, err.message || 'Resolve emergency failed');
    }
};
