const mongoose = require('mongoose');

const supportCaseSchema = new mongoose.Schema({
    caseId: {
        type: String,
        unique: true,
        index: true,
        required: true,
        trim: true,
    },

    type: {
        type: String,
        enum: ['User', 'Driver'],
        required: true,
    },

    category: {
        type: String,
        required: true,
        trim: true,
    },

    subject: {
        type: String,
        required: true,
        trim: true,
    },

    description: {
        type: String,
        default: '',
        trim: true,
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default: null,
    },

    captain: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'captain',
        default: null,
    },

    ride: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ride',
        default: null,
    },

    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'Medium',
    },

    status: {
        type: String,
        enum: ['Open', 'In Review', 'Escalated', 'Resolved'],
        default: 'Open',
    },

    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        default: null,
    },

    resolution: {
        type: String,
        default: '',
        trim: true,
    },

    resolvedAt: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
    collection: 'support_cases',
});

supportCaseSchema.index({ status: 1, createdAt: -1 });
supportCaseSchema.index({ type: 1, status: 1 });
supportCaseSchema.index({ user: 1, createdAt: -1 });
supportCaseSchema.index({ captain: 1, createdAt: -1 });
supportCaseSchema.index({ ride: 1, createdAt: -1 });

module.exports = mongoose.model('supportCase', supportCaseSchema);
