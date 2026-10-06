const mongoose = require('mongoose');

const rideEasySupportSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            default: 'RideEasy Support',
        },
        phone: {
            type: String,
            default: '',
            trim: true,
        },
        description: {
            type: String,
            default: 'RideEasy emergency and customer support',
            trim: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        collection: 'rideeasy_support',
    }
);

module.exports = mongoose.model('RideEasySupport', rideEasySupportSchema);
