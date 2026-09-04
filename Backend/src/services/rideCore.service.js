const rideModel = require('../models/rideCore.model');
const captainModel = require('../models/captain.model');
const mapService = require('./maps.service');
const crypto = require('crypto');
const { expiresInMinutes } = require('../utils/otp');
const { encryptOtp, hashOtp, verifyOtp } = require('../utils/otpSecure');
const pricingService = require('./pricing.service');
const fareConfigurationService = require('./fareConfiguration.service');
const paymentService = require('./payment.service');
const ALLOWED_VEHICLE_TYPES = [ 'BIKE', 'AUTO', 'CAR' ];

function rideError(message, statusCode = 400) {
    const err = new Error(message);
    err.statusCode = statusCode;
    return err;
}

function getOtp(num) {
    return crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
}

function normalizePaymentMethod(pm) {
    const s = String(pm || 'Cash').trim().toLowerCase();
    if (s === 'wallet') return 'WALLET';
    if (s === 'upi' || s === 'online') return 'UPI';
    if (s === 'qr') return 'QR';
    return 'Cash';
}
module.exports.normalizePaymentMethod = normalizePaymentMethod;

/** Re-export for backward compatibility — prefer `payment.service`. */
module.exports.settleRidePaymentIfNeeded = paymentService.settleRidePaymentIfNeeded;

async function buildFarePayload(pickup, destination, coordOpts = null, fareOpts = null) {
    if (!pickup || !destination) throw new Error('Pickup and destination are required');

    const distanceTime =
        coordOpts?.pickupCoord && coordOpts?.dropCoord
            ? await mapService.getDistanceTimeCoords(coordOpts.pickupCoord, coordOpts.dropCoord)
            : await mapService.getDistanceTime(pickup, destination);

    const distanceKm = distanceTime.distance.value / 1000;
    const durationMinutes = Math.round(distanceTime.duration.value / 60);

    if (!Number.isFinite(distanceKm) || distanceKm <= 0) {
        throw rideError('Distance must be greater than 0', 400);
    }

    const cityZone = String(fareOpts?.cityZone || '').trim();
    const requestedVehicleType = normalizeVehicleType(fareOpts?.vehicleType);

    const fare = {};
    const fareConfigurations = {};

    for (const vt of ALLOWED_VEHICLE_TYPES) {
        if (requestedVehicleType && vt !== requestedVehicleType) continue;

        const configuration = await fareConfigurationService.getActiveFareConfiguration({
            rideType: vt,
            cityZone,
        });

        if (!configuration) {
            throw rideError(
                `No active fare configuration found for ${vt} in ${cityZone}`,
                400
            );
        }

        const distanceFare = distanceKm * Number(configuration.distanceRate);
        const timeFare = durationMinutes * Number(configuration.timeRate);
        const subtotal = Math.max(
            Number(configuration.minimumFare),
            Number(configuration.baseFare) + distanceFare + timeFare
        );
        const totalBeforeTax = subtotal + Number(configuration.fees || 0);
        const taxAmount = totalBeforeTax * (Number(configuration.tax || 0) / 100);
        const total = totalBeforeTax + taxAmount;

        fare[vt] = Math.round(total * 100) / 100;
        fareConfigurations[vt] = {
            id: configuration._id,
            version: configuration.version,
            rideType: configuration.rideType,
            cityZone: configuration.cityZone,
        };
    }

    return {
        distanceKm: Math.round(distanceKm * 100) / 100,
        distanceMeters: distanceTime.distance.value,
        durationSeconds: distanceTime.duration.value,
        durationMinutes,
        fareConfigurations,
        ...fare,
    };
}

module.exports.getFare = async (pickup, destination, coordOpts = null, fareOpts = null) =>
    buildFarePayload(pickup, destination, coordOpts, fareOpts);

function normalizeVehicleType(vt) {
    const up = String(vt || '').trim().toUpperCase();
    if (up === 'MINI' || up === 'SEDAN') return 'CAR';
    return up;
}
module.exports.normalizeVehicleType = normalizeVehicleType;

module.exports.createRide = async ({
    user,
    pickupLocation,
    dropLocation,
    city,
    vehicleType,
    paymentMethod,
    price,
    distanceKm,
    fareConfigurationId,
    fareConfigurationVersion,
    customerName,
    customerPhone,
    pickupCoordinates,
    dropCoordinates,
}) => {
    /** OTP is created only when a driver accepts (see confirmRide) — shared start-ride code. */
    const ride = await rideModel.create({
        user,
        pickupLocation,
        dropLocation,
        ...(pickupCoordinates ? { pickup: { type: 'Point', coordinates: [ pickupCoordinates.lng, pickupCoordinates.lat ] } } : {}),
        ...(dropCoordinates ? { drop: { type: 'Point', coordinates: [ dropCoordinates.lng, dropCoordinates.lat ] } } : {}),
        city: city || 'Kolhapur',
        vehicleType: normalizeVehicleType(vehicleType),
        distance: distanceKm,
        price,
        fareConfigurationId,
        fareConfigurationVersion,
        status: 'searching',
        paymentMethod: normalizePaymentMethod(paymentMethod),
        paymentStatus: 'pending',
        customerName,
        customerPhone,
    });
    return { ride };
};

/** First driver wins — atomic claim while status is searching and no captain. Issues a fresh OTP for passenger + driver. */
module.exports.confirmRide = async ({ rideId, captain }) => {
    const plain = getOtp(6);
    const [ otpHash, otpCipher ] = await Promise.all([
        hashOtp(plain),
        Promise.resolve(encryptOtp(plain)),
    ]);
    const ride = await rideModel.findOneAndUpdate(
        {
            _id: rideId,
            status: 'searching',
            $or: [ { captain: null }, { captain: { $exists: false } } ],
        },
        {
            $set: {
                captain: captain._id,
                status: 'accepted',
                acceptedAt: new Date(),
                otpHash,
                otpCipher,
                otpExpiresAt: expiresInMinutes(5),
            },
        },
        { new: true }
    ).populate('user').populate('captain');

    if (!ride) {
        const exists = await rideModel.findById(rideId);
        if (!exists) throw rideError('Ride not found', 404);
        throw rideError('Ride already assigned or no longer available', 409);
    }
    return { ride, otpPlain: plain };
};

module.exports.rejectRide = async ({ rideId, captain }) => {
    const ride = await rideModel.findOne({ _id: rideId, status: 'searching' });
    if (!ride) throw rideError('Ride not found or already assigned', 409);
    await rideModel.updateOne(
        { _id: rideId },
        { $addToSet: { declinedBy: captain._id } }
    );
    return rideModel.findById(rideId).populate('user', 'name phone email').populate('captain');
};

module.exports.markArrived = async ({ rideId, captain }) => {
    const current = await rideModel.findOne({ _id: rideId, captain: captain._id })
        .populate('user')
        .populate('captain');
    if (!current) throw rideError('Ride not found', 404);
    if (current.status === 'arrived') return current;
    if (current.status !== 'accepted') throw rideError('Ride not found / not accepted', 409);
    const ride = await rideModel.findOneAndUpdate(
        { _id: rideId, captain: captain._id, status: 'accepted' },
        { status: 'arrived', arrivedAt: new Date() },
        { new: true }
    ).populate('user').populate('captain');
    if (!ride) throw rideError('Ride not found / not accepted', 409);
    return ride;
};

module.exports.startRide = async ({ rideId, otp, captain }) => {
    const ride = await rideModel.findOne({ _id: rideId, captain: captain._id })
        .populate('user')
        .populate('captain')
        .select('+otpHash');
    if (!ride) throw rideError('Ride not found', 404);
    if (ride.status !== 'arrived') throw rideError('Driver has not arrived', 409);
    const ok = await verifyOtp(String(otp || '').trim(), ride.otpHash);
    if (!ok) throw rideError('Invalid OTP', 400);
    if (ride.otpExpiresAt && ride.otpExpiresAt < new Date()) throw rideError('OTP expired — ask passenger for new code', 400);
    await rideModel.updateOne({ _id: rideId }, { status: 'started', startedAt: new Date() });
    return rideModel.findById(rideId).populate('user').populate('captain');
};

module.exports.endRide = async ({ rideId, captain }) => {
    const ride = await rideModel.findOne({ _id: rideId, captain: captain._id }).populate('user').populate('captain');
    if (!ride) throw rideError('Ride not found', 404);
    if (ride.status !== 'started') throw rideError('Ride not started', 409);

    const completedAt = new Date();
    let durationSec = null;
    if (ride.startedAt) {
        durationSec = Math.max(
            0,
            Math.round((completedAt.getTime() - new Date(ride.startedAt).getTime()) / 1000),
        );
    }

    const norm = normalizePaymentMethod(ride.paymentMethod);
    const patch = {
        status: 'completed',
        completedAt,
        ...(durationSec != null ? { duration: durationSec } : {}),
        ...(norm === 'Cash' ? { paymentStatus: 'success' } : {}),
    };
    await rideModel.updateOne({ _id: rideId }, patch);
    if (norm === 'Cash') {
        await paymentService.settleRidePaymentIfNeeded(rideId);
    }
    return rideModel.findById(rideId).populate('user', 'name phone email').populate('captain');
};

module.exports.rateRide = async ({ rideId, user, rating, comment }) => {
    const r = Number(rating);
    if (!Number.isFinite(r) || r < 1 || r > 5) throw rideError('Rating must be between 1 and 5', 400);
    const ride = await rideModel.findOne({
        _id: rideId,
        user,
        status: 'completed',
        paymentStatus: 'success',
    });
    if (!ride) throw rideError('Ride not found or payment not completed', 404);
    if (ride.rating) throw rideError('Already rated', 409);
    ride.rating = r;
    ride.ratingComment = (comment || '').slice(0, 500);
    await ride.save();
    if (ride.captain) {
        await captainModel.findByIdAndUpdate(ride.captain, { $inc: { ratingSum: r, ratingCount: 1 } });
    }
    return rideModel.findById(ride._id).populate('captain').populate('user', 'name phone email');
};
