const AuditLog = require('../models/auditLog.model');

async function recordAuditLog({
    action,
    actor = null,
    actorType = 'system',
    targetType,
    targetId = null,
    details = {},
}) {
    return AuditLog.create({
        action,
        actor,
        actorType,
        targetType,
        targetId,
        details,
    });
}

module.exports = {
    recordAuditLog,
};
