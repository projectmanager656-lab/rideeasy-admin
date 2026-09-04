const mongoose = require('mongoose');

const fareConfigurationSchema = new mongoose.Schema({
    rideType: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
        enum: ['BIKE', 'AUTO', 'CAR'],
    },

    cityZone: {
        type: String,
        required: true,
        trim: true,
    },

    version: {
        type: Number,
        required: true,
        min: 1,
    },

    baseFare: {
        type: Number,
        required: true,
        min: 0,
    },

    distanceRate: {
        type: Number,
        required: true,
        min: 0,
    },

    timeRate: {
        type: Number,
        required: true,
        min: 0,
    },

    minimumFare: {
        type: Number,
        required: true,
        min: 0,
    },

    fees: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
    },

    tax: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
    },

    effectiveFrom: {
        type: Date,
        required: true,
    },

    effectiveTo: {
        type: Date,
        default: null,
    },

    status: {
        type: String,
        enum: ['DRAFT', 'ACTIVE', 'INACTIVE'],
        default: 'DRAFT',
    },

    changedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true,
    },

}, {
    timestamps: true,
    collection: 'fare_configurations',
});

fareConfigurationSchema.index({
    rideType: 1,
    cityZone: 1,
    version: 1,
});

fareConfigurationSchema.index({
    rideType: 1,
    cityZone: 1,
    effectiveFrom: 1,
    effectiveTo: 1,
});

module.exports = mongoose.model(
    'FareConfiguration',
    fareConfigurationSchema
);
