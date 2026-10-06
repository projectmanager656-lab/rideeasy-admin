const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
        },

        discountType: {
            type: String,
            required: true,
            enum: ['percentage', 'fixed'],
        },

        discountValue: {
            type: Number,
            required: true,
            min: 0,
        },

        minRide: {
            type: Number,
            required: true,
            min: 0,
        },

        maxDiscount: {
            type: Number,
            default: null,
            min: 0,
        },

        validFrom: {
            type: Date,
            required: true,
        },

        validUntil: {
            type: Date,
            required: true,
        },

        usageLimit: {
            type: Number,
            required: true,
            min: 1,
        },

        usedCount: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    {
        timestamps: true,
        collection: 'coupons',
    }
);

couponSchema.index({ validFrom: 1, validUntil: 1 });

module.exports = mongoose.model('Coupon', couponSchema);
