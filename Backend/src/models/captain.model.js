const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { signPayload } = require('../config/jwt.config');

const captainSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 2 },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    gender: { type: String, enum: [ 'male', 'female', 'other' ], default: 'other' },
    password: { type: String, required: true, select: false },
    socketId: { type: String },
    vehicleType: { type: String, required: true, enum: [ 'BIKE', 'AUTO', 'CAR' ] },
    vehicleNumber: { type: String, required: true, minlength: 3 },
    /** Passenger can pay this UPI id directly (optional). */
    upiId: { type: String, default: '' },
    /** Optional data URL or HTTPS image URL for driver payment QR. */
    paymentQrUrl: { type: String, default: '' },
    /** Payout / settlement (optional at signup; same shape as passenger users). */
    bankDetails: {
        accountHolderName: { type: String, default: '' },
        accountNumber: { type: String, default: '' },
        ifscCode: { type: String, default: '' },
        upiId: { type: String, default: '' },
        verified: { type: Boolean, default: false },
        verifiedAt: { type: Date, default: null },
    },
    license: { type: String, required: true, minlength: 5 },
    city: { type: String, required: true, enum: [ 'Kolhapur', 'Ichalkaranji', 'Sangli' ], default: 'Kolhapur' },
    /** Mirrors active socket presence; used with status for ride matching. */
    isOnline: { type: Boolean, default: false },
    status: { type: String, enum: [ 'active', 'inactive' ], default: 'inactive' }, // online/offline
    approved: { type: Boolean, default: false },

    // Driver verification
    verificationStatus: {
        type: String,
        enum: [ 'PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'EXPIRED', 'RE_UPLOAD_REQUIRED' ],
        default: 'PENDING',
    },
    rejected: { type: Boolean, default: false },
    rejectionReason: { type: String, default: '' },
    rejectionCategory: { type: String, default: '' },

    // Verification evidence
    driverPhotoUrl: { type: String, default: '' },

    documents: [{
        documentType: {
            type: String,
            enum: [
                'DRIVING_LICENSE',
                'VEHICLE_RC',
                'VEHICLE_INSURANCE',
                'DRIVER_PHOTO',
                'OTHER'
            ],
            default: 'OTHER',
        },
        title: { type: String, default: '' },
        documentUrl: { type: String, default: '' },
        status: {
            type: String,
            enum: [
                'PENDING',
                'UNDER_REVIEW',
                'APPROVED',
                'REJECTED',
                'EXPIRED',
                'RE_UPLOAD_REQUIRED'
            ],
            default: 'PENDING',
        },
        expiryDate: { type: Date, default: null },
        rejectionReason: { type: String, default: '' },
        uploadedAt: { type: Date, default: null },
        updatedAt: { type: Date, default: null },
    }],

    blocked: { type: Boolean, default: false },
    subscriptionStatus: { type: String, enum: [ 'active', 'expired', 'none' ], default: 'none' },
    /** weekly | monthly | yearly — last purchased plan */
    subscriptionPlan: { type: String, default: null },
    subscriptionStartedAt: { type: Date },
    subscriptionExpiresAt: { type: Date },
    location: {
        type: { type: String, enum: [ 'Point' ], default: 'Point' },
        coordinates: { type: [ Number ], default: [ 0, 0 ] }, // [lng, lat]
    },
    lastLocationUpdatedAt: { type: Date },
    walletBalance: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    ratingSum: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    driverCancelCount: { type: Number, default: 0 },
    lastCancelWarningAt: { type: Date },
    loginOtp: { type: String, select: false },
    loginOtpExpiresAt: { type: Date, select: false },
}, { timestamps: true, collection: 'drivers' });

captainSchema.index({ location: '2dsphere' });

captainSchema.virtual('averageRating').get(function () {
    if (!this.ratingCount) return 0;
    return Math.round((this.ratingSum / this.ratingCount) * 10) / 10;
});
captainSchema.set('toJSON', { virtuals: true });
captainSchema.set('toObject', { virtuals: true });

captainSchema.methods.generateAuthToken = function () {
    return signPayload({ _id: this._id, role: 'captain' });
};

captainSchema.methods.comparePassword = async function (password) {
    try {
        if (password == null || typeof password !== 'string' || !this.password) return false;
        return await bcrypt.compare(password, this.password);
    } catch (err) {
        console.error('[captain] comparePassword error:', err.message);
        return false;
    }
};

captainSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
};

module.exports = mongoose.model('captain', captainSchema);