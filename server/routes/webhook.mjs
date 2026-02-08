import { Router } from "express";
import express from "express";
import Stripe from "stripe";
import { db } from "../db/client.mjs";
import { users, webhookEvents } from "../../shared/schema.mjs";
import { eq } from "drizzle-orm";
import { logger } from "../utils/logger.mjs";

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Check if event has already been processed (durable idempotency)
 */
async function isProcessed(eventId) {
  try {
    const rows = await db.select().from(webhookEvents).where(eq(webhookEvents.id, eventId));
    return rows.length > 0;
  } catch (err) {
    logger.error("Idempotency check failed", { error: err.message, eventId });
    return false; // Allow retry on DB error
  }
}

/**
 * Mark event as processed (durable persistence)
 */
async function markProcessed(event) {
  try {
    await db.insert(webhookEvents).values({
      id: event.id,
      eventType: event.type,
      status: "processed",
      processedAt: new Date(),
    });
  } catch (err) {
    // Log but don't fail - duplicate insert is acceptable
    logger.warn("Failed to mark event processed", { error: err.message, eventId: event.id });
  }
}

// IMPORTANT: raw body ONLY for stripe signature verification
router.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    // Validate webhook signature
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      logger.error("Stripe webhook signature verification failed", { error: err.message });
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Durable idempotency check
    if (await isProcessed(event.id)) {
      return res.json({ received: true, duplicate: true });
    }

    // Handle events safely (retry-safe)
    try {
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object;
          if (session.customer && session.subscription) {
            await db
              .update(users)
              .set({
                stripeCustomerId: session.customer,
                subscriptionStatus: "pro",
                updatedAt: new Date(),
              })
              .where(eq(users.email, session.customer_email));
            logger.info("Subscription activated via checkout", { customer: session.customer, status: "pro" });
          }
          break;
        }

        case "customer.subscription.created":
        case "customer.subscription.updated": {
          const subscription = event.data.object;
          if (subscription.customer) {
            const isActive = ["active", "trialing"].includes(subscription.status);
            const canonicalStatus = isActive ? "pro" : "free";
            await db
              .update(users)
              .set({
                subscriptionStatus: canonicalStatus,
                subscriptionExpiresAt: new Date(subscription.current_period_end * 1000),
                updatedAt: new Date(),
              })
              .where(eq(users.stripeCustomerId, subscription.customer));
            logger.info("Subscription status synced", { customer: subscription.customer, stripeStatus: subscription.status, canonicalStatus });
          }
          break;
        }

        case "customer.subscription.deleted": {
          const subscription = event.data.object;
          if (subscription.customer) {
            await db
              .update(users)
              .set({
                subscriptionStatus: "free",
                subscriptionExpiresAt: new Date(),
                updatedAt: new Date(),
              })
              .where(eq(users.stripeCustomerId, subscription.customer));
            logger.info("Subscription deleted, reverted to free", { customer: subscription.customer });
          }
          break;
        }

        case "invoice.paid": {
          const invoice = event.data.object;
          if (invoice.customer) {
            await db
              .update(users)
              .set({
                subscriptionStatus: "pro",
                updatedAt: new Date(),
              })
              .where(eq(users.stripeCustomerId, invoice.customer));
            logger.info("Invoice paid, confirmed pro", { customer: invoice.customer });
          }
          break;
        }

        case "invoice.payment_failed": {
          const invoice = event.data.object;
          if (invoice.customer) {
            await db
              .update(users)
              .set({
                subscriptionStatus: "free",
                updatedAt: new Date(),
              })
              .where(eq(users.stripeCustomerId, invoice.customer));
            logger.info("Invoice payment failed, reverted to free", { customer: invoice.customer });
          }
          break;
        }

        default:
          logger.info("Unhandled Stripe event type", { type: event.type });
      }

      // Mark as processed ONLY after successful handling
      await markProcessed(event);
      return res.json({ received: true });
    } catch (e) {
      logger.error("Webhook handler failed", { error: e.message, eventType: event.type });
      // Do NOT mark processed on failure; Stripe will retry.
      return res.status(500).json({ error: "Webhook handler failed" });
    }
  }
);

export default router;
