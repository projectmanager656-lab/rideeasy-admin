const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
    {
        action: {
            type: String,
            required: true,
        },
        actor: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
        },
        actorType: {
            type: String,
            required: true,
        },
        targetType: {
            type: String,
            required: true,
        },
        targetId: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
        },
        details: {
            type: mongoose.Schema.Types.Mixed,
        },
    },
    {
        timestamps: true,
        collection: 'auditlogs',
    }
);

module.exports = mongoose.model('AuditLog', auditLogSchema);
