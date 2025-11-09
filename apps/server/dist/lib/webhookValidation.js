"use strict";
/**
 * Webhook Validation - 360° Security Enhancement
 * Validates Stripe webhook signatures for security
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateStripeWebhook = validateStripeWebhook;
exports.ensureWebhookIdempotency = ensureWebhookIdempotency;
exports.validateWebhookEventType = validateWebhookEventType;
/**
 * Stripe webhook signature validation middleware
 * Ensures webhooks are actually from Stripe
 */
function validateStripeWebhook(stripe) {
    return (req, res, next) => {
        const signature = req.headers['stripe-signature'];
        if (!signature) {
            console.error('[WEBHOOK] Missing Stripe signature header');
            return res.status(400).json({
                error: 'Missing signature',
                message: 'Stripe signature header is required'
            });
        }
        // Get webhook secret from environment
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
        if (!webhookSecret) {
            console.error('[WEBHOOK] STRIPE_WEBHOOK_SECRET not configured');
            // In development, allow webhooks without signature validation
            if (process.env.NODE_ENV !== 'production') {
                console.warn('[WEBHOOK] ⚠️  Running without signature validation (DEVELOPMENT MODE ONLY)');
                return next();
            }
            return res.status(500).json({
                error: 'Configuration error',
                message: 'Webhook secret not configured'
            });
        }
        try {
            // Verify signature
            const event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
            // Attach verified event to request
            req.body = event;
            next();
        }
        catch (err) {
            console.error('[WEBHOOK] Signature verification failed:', err);
            return res.status(400).json({
                error: 'Invalid signature',
                message: 'Webhook signature verification failed'
            });
        }
    };
}
/**
 * Idempotency middleware for webhooks
 * Prevents duplicate processing of the same webhook event
 */
const processedEvents = new Set();
function ensureWebhookIdempotency(req, res, next) {
    const event = req.body;
    if (!event || !event.id) {
        return res.status(400).json({
            error: 'Invalid event',
            message: 'Event ID is required'
        });
    }
    // Check if event already processed
    if (processedEvents.has(event.id)) {
        console.log(`[WEBHOOK] Event ${event.id} already processed (idempotent)`);
        return res.status(200).json({ received: true, processed: 'duplicate' });
    }
    // Mark as processed
    processedEvents.add(event.id);
    // Clean up old events (keep last 1000)
    if (processedEvents.size > 1000) {
        const toDelete = Array.from(processedEvents).slice(0, 100);
        toDelete.forEach(id => processedEvents.delete(id));
    }
    next();
}
/**
 * Webhook event type validation
 * Ensures we only process expected event types
 */
function validateWebhookEventType(allowedTypes) {
    return (req, res, next) => {
        const event = req.body;
        if (!event || !event.type) {
            return res.status(400).json({
                error: 'Invalid event',
                message: 'Event type is required'
            });
        }
        if (!allowedTypes.includes(event.type)) {
            console.warn(`[WEBHOOK] Received unexpected event type: ${event.type}`);
            return res.status(400).json({
                error: 'Unsupported event type',
                message: `Event type ${event.type} is not supported`
            });
        }
        next();
    };
}
