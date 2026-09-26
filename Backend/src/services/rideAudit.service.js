const RideAudit = require('../models/rideAudit.model');

const snapshotRouteFare = (ride) => ({
    route: {
        pickup: ride.pickupLocation || ride.pickup || '',
        drop: ride.dropLocation || ride.drop || '',
        distance: Number.isFinite(Number(ride.distance)) ? Number(ride.distance) : null,
    },
    fare: {
        price: Number.isFinite(Number(ride.price)) ? Number(ride.price) : null,
        chargedAmount: Number.isFinite(Number(ride.chargedAmount)) ? Number(ride.chargedAmount) : null,
        discountAmount: Number.isFinite(Number(ride.discountAmount)) ? Number(ride.discountAmount) : null,
        platformFee: Number.isFinite(Number(ride.platformFee)) ? Number(ride.platformFee) : null,
        captainNetEarning: Number.isFinite(Number(ride.captainNetEarning))
            ? Number(ride.captainNetEarning)
            : null,
    },
});

const recordRideAudit = async ({
    ride,
    actor,
    actorType,
    field,
    oldValue,
    newValue,
}) => {
    if (!ride?._id || !field || !actorType) return;

    const snapshot = snapshotRouteFare(ride);

    await RideAudit.create({
        ride: ride._id,
        actor: actor || undefined,
        actorType,
        field,
        oldValue,
        newValue,
        ...snapshot,
    });
};

module.exports = {
    recordRideAudit,
    snapshotRouteFare,
};
