const FareConfiguration = require('../models/fareConfiguration.model');

const ALLOWED_RIDE_TYPES = [ 'BIKE', 'AUTO', 'CAR' ];

async function getActiveFareConfiguration({ rideType, cityZone, at = new Date() }) {
    const normalizedRideType = String(rideType || '').trim().toUpperCase();
    const normalizedCityZone = String(cityZone || '').trim();

    if (!ALLOWED_RIDE_TYPES.includes(normalizedRideType)) {
        throw new Error('Invalid ride type for fare configuration');
    }

    if (!normalizedCityZone) {
        throw new Error('City / Zone is required for fare configuration');
    }

    const configuration = await FareConfiguration.findOne({
        rideType: normalizedRideType,
        cityZone: normalizedCityZone,
        status: 'ACTIVE',
        effectiveFrom: { $lte: at },
        $or: [
            { effectiveTo: null },
            { effectiveTo: { $gt: at } },
        ],
    }).sort({ version: -1 });

    return configuration;
}

module.exports = {
    getActiveFareConfiguration,
};
