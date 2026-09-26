const mongoose = require('mongoose');

const webhookEventSchema = new mongoose.Schema(
    {
        provider: {
            type: String,
            required: true,
            enum: ['razorpay'],
        },
        eventId: {
            type: String,
            required: true,
            maxlength: 200,
        },
        eventType: {
            type: String,
            maxlength: 200,
        },
        processedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
        collection: 'webhook_events',
    }
);

webhookEventSchema.index(
    { provider: 1, eventId: 1 },
    { unique: true }
);

module.exports = mongoose.model('WebhookEvent', webhookEventSchema);
