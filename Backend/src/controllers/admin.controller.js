const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const { ok, fail } = require('../utils/apiResponse');
const Admin = require('../models/admin.model');
const User = require('../models/user.model');
const Captain = require('../models/captain.model');
const Ride = require('../models/rideCore.model');
const Service = require('../models/service.model');
const FareConfiguration = require('../models/fareConfiguration.model');
const PaymentRecord = require('../models/paymentRecord.model');
const AuditLog = require('../models/auditLog.model');
const SupportCase = require('../models/supportCase.model');
const pricingService = require('../services/pricing.service');
const { recordAuditLog } = require('../services/auditLog.service');
const { POLICE_STATIONS, getNearestPoliceStation, fetchNearbyPoliceStations } = require('../utils/rideAllocationRules');

const FARE_CONFIG_ALLOWED_ROLES = ['SUPER_ADMIN'];

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
        admin = await Admin.create({
            email: DEFAULT_ADMIN_EMAIL,
            password: hashed,
            role: 'SUPER_ADMIN',
        });
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
    if (
        process.env.DEFAULT_ADMIN_PASSWORD &&
        normalizedEmail === DEFAULT_ADMIN_EMAIL &&
        normalizedPassword === DEFAULT_ADMIN_PASSWORD
    ) {
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

module.exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return fail(res, req, 400, 'Current password and new password are required');
        }

        if (String(newPassword).length < 6) {
            return fail(res, req, 400, 'New password must be at least 6 characters');
        }

        const adminId = req.admin?._id || req.user?._id;

        if (!adminId) {
            return fail(res, req, 401, 'Admin authentication required');
        }

        const admin = await Admin.findById(adminId).select('+password');

        if (!admin) {
            return fail(res, req, 404, 'Admin not found');
        }

        const currentPasswordValid = await admin.comparePassword(String(currentPassword));

        if (!currentPasswordValid) {
            return fail(res, req, 400, 'Current password is incorrect');
        }

        const samePassword = await admin.comparePassword(String(newPassword));

        if (samePassword) {
            return fail(res, req, 400, 'New password must be different from current password');
        }

        admin.password = await Admin.hashPassword(String(newPassword));
        await admin.save();

        return ok(res, req, 200, 'Password changed successfully');
    } catch (err) {
        return fail(res, req, 500, err.message || 'Password change failed');
    }
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
        const ridesColl = Ride.collection.collectionName;

        const enriched = await Captain.aggregate([
            { $sort: { createdAt: -1 } },
            { $limit: 500 },

            // Completed rides / earnings
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
                                        {
                                            $multiply: [
                                                { $ifNull: [ '$price', 0 ] },
                                                pct,
                                            ],
                                        },
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
                                        {
                                            $subtract: [
                                                { $ifNull: [ '$price', 0 ] },
                                                '$effPlatformFee',
                                            ],
                                        },
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

            // Active rides -> BUSY
            {
                $lookup: {
                    from: ridesColl,
                    let: { driverId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                status: {
                                    $in: [ 'accepted', 'arrived', 'started' ],
                                },
                                $expr: {
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
                            },
                        },
                        { $limit: 1 },
                    ],
                    as: 'activeRides',
                },
            },

            // Completed ride statistics
            {
                $addFields: {
                    st: { $arrayElemAt: [ '$agg', 0 ] },
                },
            },
            {
                $addFields: {
                    completedRides: {
                        $ifNull: [ '$st.completedRides', 0 ],
                    },
                    _incomeFromRides: {
                        $round: [
                            { $ifNull: [ '$st.driverIncome', 0 ] },
                            0,
                        ],
                    },
                    platformShare: {
                        $round: [
                            { $ifNull: [ '$st.platformFromDriver', 0 ] },
                            0,
                        ],
                    },
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

            // Subscription status
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

            // Live status
            {
                $addFields: {
                    isBusy: {
                        $gt: [
                            { $size: '$activeRides' },
                            0,
                        ],
                    },
                },
            },
            {
                $addFields: {
                    liveStatus: {
                        $cond: [
                            '$isBusy',
                            'BUSY',
                            {
                                $cond: [
                                    { $eq: [ '$isOnline', true ] },
                                    'ONLINE',
                                    'OFFLINE',
                                ],
                            },
                        ],
                    },
                },
            },

            // Remove sensitive/internal fields
            {
                $project: {
                    password: 0,
                    loginOtp: 0,
                    loginOtpExpiresAt: 0,
                    agg: 0,
                    st: 0,
                    activeRides: 0,
                    _incomeFromRides: 0,
                },
            },
        ]);

        return ok(res, req, 200, 'Drivers', {
            drivers: enriched,
        });
    } catch (err) {
        return fail(
            res,
            req,
            500,
            err.message || 'Drivers failed'
        );
    }
};

module.exports.approveDriver = async (req, res) => {
    try {
        const { id } = req.params;
        const driver = await Captain.findByIdAndUpdate(
            id,
            {
                approved: true,
                verificationStatus: 'APPROVED',
                rejected: false,
                rejectionReason: '',
                rejectionCategory: '',
            },
            { new: true }
        ).select(
            'name email phone city vehicleType vehicleNumber approved blocked subscriptionStatus verificationStatus rejected rejectionReason rejectionCategory updatedAt'
        );
        if (!driver) return fail(res, req, 404, 'Driver not found');

        await recordAuditLog({
            action: 'DRIVER_APPROVED',
            actor: req.admin?._id || req.user?._id || null,
            actorType: 'admin',
            targetType: 'Driver',
            targetId: driver._id,
            details: {
                driverName: driver.name,
                verificationStatus: driver.verificationStatus,
            },
        });

        return ok(res, req, 200, 'Driver approved', { driver });
    } catch (err) {
        return fail(res, req, 500, err.message || 'Approve failed');
    }
};

module.exports.rejectDriver = async (req, res) => {
    try {
        const { id } = req.params;
        const reason = String(req.body?.reason || '').trim();
        const category = String(req.body?.category || '').trim();

        const update = {
            approved: false,
            verificationStatus: 'REJECTED',
            rejected: true,
            ...(reason ? { rejectionReason: reason } : {}),
            ...(category ? { rejectionCategory: category } : {}),
        };

        const driver = await Captain.findByIdAndUpdate(
            id,
            update,
            { new: true }
        ).select(
            'name email phone city vehicleType vehicleNumber approved blocked subscriptionStatus verificationStatus rejected rejectionReason rejectionCategory updatedAt'
        );

        if (!driver) {
            return fail(res, req, 404, 'Driver not found');
        }

        await recordAuditLog({
            action: 'DRIVER_REJECTED',
            actor: req.admin?._id || req.user?._id || null,
            actorType: 'admin',
            targetType: 'Driver',
            targetId: driver._id,
            details: {
                driverName: driver.name,
                reason,
                category,
                verificationStatus: driver.verificationStatus,
            },
        });

        return ok(res, req, 200, 'Driver verification rejected', { driver });
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
           .select(
    'city pickup drop pickupLocation dropLocation vehicleType distance price status createdAt acceptedAt arrivedAt otpVerificationStatus otpVerifiedAt otpVerificationFailedAt otpVerificationFailureReason startedAt completedAt paymentMethod paymentStatus chargedAmount discountAmount platformFee captainNetEarning cancellationFee cancelledBy cancelledAt cancellationReason duration rating ratingComment captainPassengerRating compliments tipAmount matchingAttempts user captain'
) 
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

module.exports.getRideAudit = async (req, res) => {
    try {
        const { id } = req.params;

        if (!validObjectId(id)) {
            return fail(res, req, 400, 'Invalid ride id');
        }

        const RideAudit = require('../models/rideAudit.model');

        const audit = await RideAudit.find({ ride: id })
            .sort({ createdAt: -1 })
            .limit(500)
            .lean();

        return ok(res, req, 200, 'Ride audit', { audit });
    } catch (err) {
        return fail(res, req, 500, err.message || 'Ride audit failed');
    }
};

module.exports.getPayments = async (req, res) => {
    try {
        const payments = await PaymentRecord.find()
            .populate(
                'rideId',
                'pickupLocation dropLocation status createdAt completedAt price chargedAmount discountAmount paymentStatus platformFee captainNetEarning'
            )
            .populate('userId', 'name phone email')
            .populate('driverId', 'name phone email')
            .sort({ createdAt: -1 })
            .limit(500)
            .lean();

        const transactions = payments.map((payment) => {
            const ride = payment.rideId || null;

            const expectedAmount =
                ride?.chargedAmount != null
                    ? Number(ride.chargedAmount)
                    : ride?.price != null
                        ? Math.max(
                            0,
                            Number(ride.price) -
                                Number(ride.discountAmount || 0)
                        )
                        : null;

            const paidAmount =
                payment.amount != null
                    ? Number(payment.amount)
                    : null;

            let reconciliationResult = 'UNABLE_TO_RECONCILE';

            if (expectedAmount != null && paidAmount != null) {
                reconciliationResult =
                    expectedAmount === paidAmount
                        ? 'MATCHED'
                        : 'MISMATCH';
            }

            let settlementStatus = 'NOT_SETTLED';

            if (ride?.captainNetEarning != null) {
                settlementStatus = 'SETTLED';
            } else if (payment.paymentStatus === 'success') {
                settlementStatus = 'PENDING';
            }

            return {
                _id: payment._id,
                rideId: ride?._id || null,
                ride,
                payer: payment.userId || null,
                driver: payment.driverId || null,

                expectedAmount,
                paidAmount,

                amount: payment.amount,

                paymentMode: payment.paymentMode,
                paymentStatus: payment.paymentStatus,
                paymentType: payment.paymentType,

                settlementStatus,
                reconciliationResult,

                driverEarning:
                    ride?.captainNetEarning != null
                        ? Number(ride.captainNetEarning)
                        : null,

                platformFee:
                    ride?.platformFee != null
                        ? Number(ride.platformFee)
                        : null,

                providerReference: payment.externalRef || null,
                webhookEventId: payment.webhookEventId || null,

                createdAt: payment.createdAt,
                updatedAt: payment.updatedAt,
            };
        });

        return ok(res, req, 200, 'Payments', {
            payments: transactions,
        });
    } catch (err) {
        return fail(
            res,
            req,
            500,
            err.message || 'Payments failed'
        );
    }
};

module.exports.getPayment = async (req, res) => {
    try {
        const payment = await PaymentRecord.findById(req.params.id)
            .populate('rideId', 'pickupLocation dropLocation status createdAt acceptedAt completedAt vehicleType price chargedAmount')
            .populate('userId', 'name phone email')
            .populate('driverId', 'name phone email')
            .lean();

        if (!payment) {
            return fail(res, req, 404, 'Payment transaction not found');
        }

        const ride = payment.rideId || null;

        const expectedAmount =
            ride?.chargedAmount != null
                ? Number(ride.chargedAmount)
                : ride?.price != null
                    ? Math.max(
                        0,
                        Number(ride.price) -
                            Number(ride.discountAmount || 0)
                    )
                    : null;

        const paidAmount =
            payment.amount != null
                ? Number(payment.amount)
                : null;

        let reconciliationResult = 'UNABLE_TO_RECONCILE';

        if (expectedAmount != null && paidAmount != null) {
            reconciliationResult =
                expectedAmount === paidAmount
                    ? 'MATCHED'
                    : 'MISMATCH';
        }

        let settlementStatus = 'NOT_SETTLED';

        if (ride?.captainNetEarning != null) {
            settlementStatus = 'SETTLED';
        } else if (payment.paymentStatus === 'success') {
            settlementStatus = 'PENDING';
        }

        const transaction = {
            _id: payment._id,
            rideId: ride?._id || null,
            ride,
            payer: payment.userId || null,
            driver: payment.driverId || null,

            expectedAmount,
            paidAmount,

            amount: payment.amount,

            paymentMode: payment.paymentMode,
            paymentStatus: payment.paymentStatus,
            paymentType: payment.paymentType,

            settlementStatus,
            reconciliationResult,

            driverEarning:
                ride?.captainNetEarning != null
                    ? Number(ride.captainNetEarning)
                    : null,

            platformFee:
                ride?.platformFee != null
                    ? Number(ride.platformFee)
                    : null,

            providerReference: payment.externalRef || null,
            webhookEventId: payment.webhookEventId || null,

            createdAt: payment.createdAt,
            updatedAt: payment.updatedAt,
        };

        return ok(res, req, 200, 'Payment transaction', { transaction });
    } catch (err) {
        return fail(res, req, 500, err.message || 'Payment transaction failed');
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

        await recordAuditLog({
            action: blocked ? 'DRIVER_BLOCKED' : 'DRIVER_UNBLOCKED',
            actor: req.admin?._id || req.user?._id || null,
            actorType: 'admin',
            targetType: 'Driver',
            targetId: driver._id,
            details: {
                driverName: driver.name,
                blocked: driver.blocked,
            },
        });

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

        await recordAuditLog({
            action: blocked ? 'USER_BLOCKED' : 'USER_UNBLOCKED',
            actor: req.admin?._id || req.user?._id || null,
            actorType: 'admin',
            targetType: 'User',
            targetId: user._id,
            details: {
                userName: user.name,
                blocked: user.blocked,
            },
        });

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
module.exports.getFareConfigurations = async (req, res) => {
    try {
        const configurations = await FareConfiguration.find()
            .sort({
                rideType: 1,
                cityZone: 1,
                version: -1,
            })
            .populate('changedBy', 'email')
            .lean();

        return ok(res, req, 200, 'Fare configurations', {
            configurations,
        });
    } catch (err) {
        return fail(
            res,
            req,
            500,
            err.message || 'Failed to load fare configurations'
        );
    }
};
module.exports.createFareConfiguration = async (req, res) => {
    if (!FARE_CONFIG_ALLOWED_ROLES.includes(req.admin?.role)) {
        return fail(res, req, 403, 'Forbidden: insufficient permissions');
    }
    try {
        const {
            rideType,
            cityZone,
            baseFare,
            distanceRate,
            timeRate,
            minimumFare,
            fees,
            tax,
            effectiveFrom,            effectiveTo,
        } = req.body;

        const values = {
            baseFare,
            distanceRate,
            timeRate,
            minimumFare,
            fees,
            tax,
        };

        for (const [field, value] of Object.entries(values)) {
            if (value === undefined || value === null || value === '') {
                return fail(res, req, 400, `${field} is required`);
            }

            const number = Number(value);

            if (!Number.isFinite(number)) {
                return fail(res, req, 400, `${field} must be a valid number`);
            }

            if (number < 0) {
                return fail(res, req, 400, `${field} cannot be negative`);
            }
        }

        if (!rideType || !['BIKE', 'AUTO', 'CAR'].includes(String(rideType).toUpperCase())) {
            return fail(res, req, 400, 'Valid ride type is required');
        }

        if (!cityZone || !String(cityZone).trim()) {
            return fail(res, req, 400, 'City/zone is required');
        }

        const from = new Date(effectiveFrom);

        if (!effectiveFrom || Number.isNaN(from.getTime())) {
            return fail(res, req, 400, 'Valid effective-from date is required');
        }

        let to = null;

        if (effectiveTo) {
            to = new Date(effectiveTo);

            if (Number.isNaN(to.getTime())) {
                return fail(res, req, 400, 'Invalid effective-to date');
            }

            if (to <= from) {
                return fail(
                    res,
                    req,
                    400,
                    'Effective-to must be after effective-from'
                );
            }
        }

        const normalizedRideType = String(rideType).toUpperCase();
        const normalizedCityZone = String(cityZone).trim();

        const overlapping = await FareConfiguration.findOne({
            rideType: normalizedRideType,
            cityZone: normalizedCityZone,
            status: 'ACTIVE',
            effectiveFrom: { $lt: to || new Date('9999-12-31') },
            $or: [
                { effectiveTo: null },
                { effectiveTo: { $gt: from } },
            ],
        }).lean();

        if (overlapping) {
            return fail(
                res,
                req,
                409,
                'Effective period overlaps an active fare configuration'
            );
        }

        const latest = await FareConfiguration.findOne({
            rideType: normalizedRideType,
            cityZone: normalizedCityZone,
        })
            .sort({ version: -1 })
            .select('version')
            .lean();

        const version = latest ? Number(latest.version) + 1 : 1;

        const configuration = await FareConfiguration.create({
            rideType: normalizedRideType,
            cityZone: normalizedCityZone,
            version,
            baseFare: Number(baseFare),
            distanceRate: Number(distanceRate),
            timeRate: Number(timeRate),
            minimumFare: Number(minimumFare),
            fees: Number(fees),
            tax: Number(tax),
            effectiveFrom: from,
            effectiveTo: to,
            status: 'DRAFT',
            changedBy: req.admin._id,
        });

        return ok(
            res,
            req,
            201,
            'Fare configuration created',
            { configuration }
        );
    } catch (err) {
        return fail(
            res,
            req,
            500,
            err.message || 'Failed to create fare configuration'
        );
    }
};
module.exports.updateFareConfiguration = async (req, res) => {
    try {
        const existing = await FareConfiguration.findById(req.params.id);

        if (!existing) {
            return fail(res, req, 404, 'Fare configuration not found');
        }

        // Historical versions must remain auditable.
        if (existing.status !== 'DRAFT') {
            return fail(
                res,
                req,
                409,
                'Only draft fare configurations can be edited'
            );
        }

        const allowedFields = [
            'rideType',
            'cityZone',
            'baseFare',
            'distanceRate',
            'timeRate',
            'minimumFare',
            'fees',
            'registrationFee',
            'minimumWalletBalance',
            'tax',
            'effectiveFrom',
            'effectiveTo',
        ];

        const updates = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        const numericFields = [
            'baseFare',
            'distanceRate',
            'timeRate',
            'minimumFare',
            'fees',
            'registrationFee',
            'minimumWalletBalance',
            'tax',
        ];

        for (const field of numericFields) {
            if (updates[field] === undefined) continue;

            const value = Number(updates[field]);

            if (!Number.isFinite(value)) {
                return fail(res, req, 400, `${field} must be a valid number`);
            }

            if (value < 0) {
                return fail(res, req, 400, `${field} cannot be negative`);
            }

            updates[field] = value;
        }

        if (updates.rideType !== undefined) {
            updates.rideType = String(updates.rideType).toUpperCase();

            if (!['BIKE', 'AUTO', 'CAR'].includes(updates.rideType)) {
                return fail(res, req, 400, 'Invalid ride type');
            }
        }

        if (updates.cityZone !== undefined) {
            updates.cityZone = String(updates.cityZone).trim();

            if (!updates.cityZone) {
                return fail(res, req, 400, 'City/zone is required');
            }
        }

        if (updates.effectiveFrom !== undefined) {
            updates.effectiveFrom = new Date(updates.effectiveFrom);

            if (Number.isNaN(updates.effectiveFrom.getTime())) {
                return fail(res, req, 400, 'Invalid effective-from date');
            }
        }

        if (updates.effectiveTo !== undefined && updates.effectiveTo !== null && updates.effectiveTo !== '') {
            updates.effectiveTo = new Date(updates.effectiveTo);

            if (Number.isNaN(updates.effectiveTo.getTime())) {
                return fail(res, req, 400, 'Invalid effective-to date');
            }
        } else if (updates.effectiveTo !== undefined) {
            updates.effectiveTo = null;
        }

        const effectiveFrom =
            updates.effectiveFrom || existing.effectiveFrom;

        const effectiveTo =
            updates.effectiveTo !== undefined
                ? updates.effectiveTo
                : existing.effectiveTo;

        if (effectiveTo && effectiveTo <= effectiveFrom) {
            return fail(
                res,
                req,
                400,
                'Effective-to must be after effective-from'
            );
        }

        const configuration = await FareConfiguration.findByIdAndUpdate(
            req.params.id,
            {
                $set: updates,
            },
            {
                new: true,
                runValidators: true,
            }
        );

        return ok(
            res,
            req,
            200,
            'Fare configuration updated',
            { configuration }
        );
    } catch (err) {
        return fail(
            res,
            req,
            500,
            err.message || 'Failed to update fare configuration'
        );
    }
};
module.exports.updateFareConfigurationStatus = async (req, res) => {
    if (!FARE_CONFIG_ALLOWED_ROLES.includes(req.admin?.role)) {
        return fail(res, req, 403, 'Forbidden: insufficient permissions');
    }
    try {
        const { status } = req.body;

        if (!['ACTIVE', 'INACTIVE'].includes(status)) {
            return fail(res, req, 400, 'Status must be ACTIVE or INACTIVE');
        }

        const configuration = await FareConfiguration.findById(req.params.id);

        if (!configuration) {
            return fail(res, req, 404, 'Fare configuration not found');
        }

        if (status === 'ACTIVE') {
            const overlapping = await FareConfiguration.findOne({
                _id: { $ne: configuration._id },
                rideType: configuration.rideType,
                cityZone: configuration.cityZone,
                status: 'ACTIVE',
                effectiveFrom: {
                    $lt: configuration.effectiveTo || new Date('9999-12-31'),
                },
                $or: [
                    { effectiveTo: null },
                    { effectiveTo: { $gt: configuration.effectiveFrom } },
                ],
            }).lean();

            if (overlapping) {
                return fail(
                    res,
                    req,
                    409,
                    'Cannot activate: effective period overlaps another active configuration'
                );
            }
        }

        configuration.status = status;
        configuration.changedBy = req.admin._id;

        await configuration.save();

        return ok(
            res,
            req,
            200,
            `Fare configuration ${status.toLowerCase()}`,
            { configuration }
        );
    } catch (err) {
        return fail(
            res,
            req,
            500,
            err.message || 'Failed to update fare configuration status'
        );
    }
};
module.exports.getFareConfigurationHistory = async (req, res) => {
    try {
        const configuration = await FareConfiguration.findById(req.params.id)
            .select('rideType cityZone')
            .lean();

        if (!configuration) {
            return fail(res, req, 404, 'Fare configuration not found');
        }

        const history = await FareConfiguration.find({
            rideType: configuration.rideType,
            cityZone: configuration.cityZone,
        })
            .sort({ version: -1 })
            .populate('changedBy', 'email')
            .lean();

        return ok(res, req, 200, 'Fare configuration history', {
            history,
        });
    } catch (err) {
        return fail(
            res,
            req,
            500,
            err.message || 'Failed to load fare configuration history'
        );
    }
};
module.exports.createFareConfiguration = async (req, res) => {
    if (!FARE_CONFIG_ALLOWED_ROLES.includes(req.admin?.role)) {
        return fail(res, req, 403, 'Forbidden: insufficient permissions');
    }

    try {
        const {
            rideType,
            cityZone,
            baseFare,
            distanceRate,
            timeRate,
            minimumFare,
            fees,
            registrationFee,
            minimumWalletBalance,
            tax,
            effectiveFrom,
            effectiveTo,
        } = req.body;

        const values = {
            baseFare,
            distanceRate,
            timeRate,
            minimumFare,
            fees,
            registrationFee,
            minimumWalletBalance,
            tax,
        };

        for (const [field, value] of Object.entries(values)) {
            if (value === undefined || value === null || value === '') {
                return fail(res, req, 400, `${field} is required`);
            }

            const number = Number(value);

            if (!Number.isFinite(number)) {
                return fail(res, req, 400, `${field} must be a valid number`);
            }

            if (number < 0) {
                return fail(res, req, 400, `${field} cannot be negative`);
            }
        }

        if (!rideType || !['BIKE', 'AUTO', 'CAR'].includes(String(rideType).toUpperCase())) {
            return fail(res, req, 400, 'Invalid ride type');
        }

        if (!cityZone || !String(cityZone).trim()) {
            return fail(res, req, 400, 'City / Zone is required');
        }

        const fromDate = new Date(effectiveFrom);

        if (!effectiveFrom || Number.isNaN(fromDate.getTime())) {
            return fail(res, req, 400, 'Effective From is required and must be a valid date');
        }

        let toDate = null;

        if (effectiveTo) {
            toDate = new Date(effectiveTo);

            if (Number.isNaN(toDate.getTime())) {
                return fail(res, req, 400, 'Effective To must be a valid date');
            }

            if (toDate <= fromDate) {
                return fail(res, req, 400, 'Effective To must be after Effective From');
            }
        }

        const normalizedRideType = String(rideType).toUpperCase();
        const normalizedCityZone = String(cityZone).trim();

        const overlappingActive = await FareConfiguration.findOne({
            rideType: normalizedRideType,
            cityZone: normalizedCityZone,
            status: 'ACTIVE',
            effectiveFrom: { $lt: toDate || new Date('9999-12-31') },
            $or: [
                { effectiveTo: null },
                { effectiveTo: { $gt: fromDate } },
            ],
        });

        if (overlappingActive) {
            return fail(
                res,
                req,
                409,
                'An active fare configuration already exists for this ride type and city / zone during the selected period'
            );
        }

        const latest = await FareConfiguration.findOne({
            rideType: normalizedRideType,
            cityZone: normalizedCityZone,
        }).sort({ version: -1 });

        const version = latest ? latest.version + 1 : 1;

        const configuration = await FareConfiguration.create({
            rideType: normalizedRideType,
            cityZone: normalizedCityZone,
            version,
            baseFare: Number(baseFare),
            distanceRate: Number(distanceRate),
            timeRate: Number(timeRate),
            minimumFare: Number(minimumFare),
            fees: Number(fees),
            registrationFee: Number(registrationFee),
            minimumWalletBalance: Number(minimumWalletBalance),
            tax: Number(tax),
            effectiveFrom: fromDate,
            effectiveTo: toDate,
            status: 'DRAFT',
            changedBy: req.admin._id,
        });

        return ok(
            res,
            req,
            201,
            'Fare configuration created successfully',
            { configuration }
        );
    } catch (err) {
        return fail(
            res,
            req,
            500,
            err.message || 'Failed to create fare configuration'
        );
    }
};


const AppSettings = require('../models/appSettings.model');

module.exports.getAppSettings = async (req, res) => {
    try {
        let settings = await AppSettings.findOne();

        if (!settings) {
            settings = await AppSettings.create({});
        }

        return ok(
            res,
            req,
            200,
            'App settings fetched successfully',
            { settings }
        );
    } catch (err) {
        return fail(
            res,
            req,
            500,
            err.message || 'Failed to fetch app settings'
        );
    }
};

module.exports.updateAppSettings = async (req, res) => {
    try {
        const {
            maintenanceMode,
            rideBookingEnabled,
            driverRegistrationEnabled,
        } = req.body;

        const updates = {};

        if (typeof maintenanceMode === 'boolean') {
            updates.maintenanceMode = maintenanceMode;
        }

        if (typeof rideBookingEnabled === 'boolean') {
            updates.rideBookingEnabled = rideBookingEnabled;
        }

        if (typeof driverRegistrationEnabled === 'boolean') {
            updates.driverRegistrationEnabled = driverRegistrationEnabled;
        }

        let settings = await AppSettings.findOne();

        if (!settings) {
            settings = await AppSettings.create(updates);
        } else {
            Object.assign(settings, updates);
            await settings.save();
        }

        return ok(
            res,
            req,
            200,
            'App settings updated successfully',
            { settings }
        );
    } catch (err) {
        return fail(
            res,
            req,
            500,
            err.message || 'Failed to update app settings'
        );
    }
};

module.exports.getAuditLogs = async (req, res) => {
    try {
        const { action, actorType, targetType, limit = 100 } = req.query;

        const query = {};

        if (action) {
            query.action = action;
        }

        if (actorType) {
            query.actorType = actorType;
        }

        if (targetType) {
            query.targetType = targetType;
        }

        const logs = await AuditLog.find(query)
            .sort({ createdAt: -1 })
            .limit(Math.min(Number(limit) || 100, 500))
            .lean();

        return ok(res, req, 200, 'Audit logs', { logs });
    } catch (err) {
        return fail(
            res,
            req,
            500,
            err.message || 'Audit logs failed'
        );
    }
};

module.exports.getSupportCases = async (req, res) => {
    try {
        const {
            type,
            status,
            priority,
            search,
        } = req.query;

        const query = {};

        if (type) query.type = type;
        if (status) query.status = status;
        if (priority) query.priority = priority;

        if (search) {
            const searchRegex = new RegExp(String(search).trim(), 'i');
            query.$or = [
                { caseId: searchRegex },
                { category: searchRegex },
                { subject: searchRegex },
                { description: searchRegex },
            ];
        }

        const cases = await SupportCase.find(query)
            .populate('user', 'name phone email')
            .populate('captain', 'name phone vehicleNumber')
            .populate('ride', 'status pickup destination price')
            .populate('assignedTo', 'email role')
            .sort({ createdAt: -1 })
            .lean();

        return ok(res, req, 200, 'Support cases', {
            cases,
            total: cases.length,
        });
    } catch (err) {
        return fail(
            res,
            req,
            500,
            err.message || 'Failed to fetch support cases'
        );
    }
};

module.exports.getSupportCase = async (req, res) => {
    try {
        const supportCase = await SupportCase.findById(req.params.id)
            .populate('user', 'name phone email')
            .populate('captain', 'name phone vehicleNumber')
            .populate('ride', 'status pickup destination price')
            .populate('assignedTo', 'email role')
            .lean();

        if (!supportCase) {
            return fail(res, req, 404, 'Support case not found');
        }

        return ok(res, req, 200, 'Support case', {
            case: supportCase,
        });
    } catch (err) {
        return fail(
            res,
            req,
            500,
            err.message || 'Failed to fetch support case'
        );
    }
};

module.exports.createSupportCase = async (req, res) => {
    try {
        const {
            caseId,
            type,
            category,
            subject,
            description,
            user,
            captain,
            ride,
            priority,
        } = req.body;

        if (!type || !category || !subject) {
            return fail(
                res,
                req,
                400,
                'Type, category and subject are required'
            );
        }

        const generatedCaseId =
            caseId ||
            `SUP-${Date.now().toString().slice(-8)}`;

        const supportCase = await SupportCase.create({
            caseId: generatedCaseId,
            type,
            category,
            subject,
            description: description || '',
            user: user || null,
            captain: captain || null,
            ride: ride || null,
            priority: priority || 'Medium',
        });

        await recordAuditLog({
            action: 'SUPPORT_CASE_CREATED',
            actor: req.admin?._id || null,
            actorType: 'admin',
            targetType: 'support_case',
            targetId: supportCase._id,
            details: {
                caseId: supportCase.caseId,
                type: supportCase.type,
                category: supportCase.category,
            },
        });

        return ok(
            res,
            req,
            201,
            'Support case created successfully',
            { case: supportCase }
        );
    } catch (err) {
        if (err.code === 11000) {
            return fail(res, req, 409, 'Support case ID already exists');
        }

        return fail(
            res,
            req,
            500,
            err.message || 'Failed to create support case'
        );
    }
};

module.exports.updateSupportCase = async (req, res) => {
    try {
        const {
            status,
            priority,
            assignedTo,
            resolution,
        } = req.body;

        const supportCase = await SupportCase.findById(req.params.id);

        if (!supportCase) {
            return fail(res, req, 404, 'Support case not found');
        }

        if (status !== undefined) {
            supportCase.status = status;
        }

        if (priority !== undefined) {
            supportCase.priority = priority;
        }

        if (assignedTo !== undefined) {
            supportCase.assignedTo = assignedTo || null;
        }

        if (resolution !== undefined) {
            supportCase.resolution = String(resolution);
        }

        if (status === 'Resolved') {
            supportCase.resolvedAt = new Date();
        } else if (status !== undefined && status !== 'Resolved') {
            supportCase.resolvedAt = null;
        }

        await supportCase.save();

        await recordAuditLog({
            action: 'SUPPORT_CASE_UPDATED',
            actor: req.admin?._id || null,
            actorType: 'admin',
            targetType: 'support_case',
            targetId: supportCase._id,
            details: {
                caseId: supportCase.caseId,
                status: supportCase.status,
                priority: supportCase.priority,
            },
        });

        return ok(
            res,
            req,
            200,
            'Support case updated successfully',
            { case: supportCase }
        );
    } catch (err) {
        return fail(
            res,
            req,
            500,
            err.message || 'Failed to update support case'
        );
    }
};
