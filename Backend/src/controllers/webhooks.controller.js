const crypto = require('crypto');
const PaymentRecord = require('../models/paymentRecord.model');
const WebhookEvent = require('../models/webhookEvent.model');

/** Body must be raw Buffer (mount with express.raw before express.json) */
module.exports.razorpayWebhook = async (req, res) => {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) {
        console.warn('RAZORPAY_WEBHOOK_SECRET not set');
        return res.status(501).json({ message: 'Webhook not configured' });
    }

    const sig = req.headers['x-razorpay-signature'];
    const body = req.body;
    if (!Buffer.isBuffer(body)) {
        return res.status(400).json({ message: 'Expected raw body' });
    }

    const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');
    if (!sig || sig !== expected) {
        return res.status(400).json({ message: 'Invalid signature' });
    }

    let payload;
    try {
        payload = JSON.parse(body.toString('utf8'));
    } catch {
        return res.status(400).json({ message: 'Invalid JSON' });
    }

    const webhookEventId = String(
        req.headers['x-razorpay-event-id'] ||
        payload.id ||
        ''
    ).trim();

    if (!webhookEventId) {
        return res.status(400).json({ message: 'Missing webhook event ID' });
    }

    try {
        await WebhookEvent.create({
            provider: 'razorpay',
            eventId: webhookEventId,
            eventType: payload.event,
        });
    } catch (error) {
        if (error?.code === 11000) {
            const existingEvent = await WebhookEvent.findOne({
                provider: 'razorpay',
                eventId: webhookEventId,
            }).lean();

            return res.status(200).json({
                received: true,
                duplicate: true,
                webhookEventId,
                processedAt: existingEvent?.processedAt || null,
            });
        }

        console.error('Razorpay webhook event registration failed:', error);
        return res.status(500).json({ message: 'Webhook processing failed' });
    }

    // Financial record creation can safely happen after this point.
    // The unique webhook event record prevents the same event from
    // being processed more than once.
    return res.json({
        received: true,
        duplicate: false,
        webhookEventId,
    });
};
