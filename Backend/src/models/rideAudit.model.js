const mongoose = require('mongoose');

const rideAuditSchema = new mongoose.Schema({
    ride: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ride',
        required: true,
        index: true,
    },

    actor: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        index: true,
    },

    actorType: {
        type: String,
        enum: [ 'admin', 'captain', 'user', 'system' ],
        required: true,
    },

    field: {
        type: String,
        required: true,
        maxlength: 100,
    },

    oldValue: {
        type: mongoose.Schema.Types.Mixed,
    },

    newValue: {
        type: mongoose.Schema.Types.Mixed,
    },

    route: {
        pickup: { type: String },
        drop: { type: String },
        distance: { type: Number },
    },

    fare: {
        price: { type: Number },
        chargedAmount: { type: Number },
        discountAmount: { type: Number },
        platformFee: { type: Number },
        captainNetEarning: { type: Number },
    },
}, {
    timestamps: true,
});

rideAuditSchema.index({ ride: 1, createdAt: -1 });

module.exports = mongoose.model('RideAudit', rideAuditSchema);
