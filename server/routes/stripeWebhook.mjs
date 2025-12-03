// server/routes/stripeWebhook.mjs
import express from "express";
import Stripe from "stripe";
import { db } from "../db/connection.mjs";
import { users, webhookEvents } from "../../shared/schema.mjs";
import { eq } from "drizzle-orm";
import { logger } from "../utils/logger.mjs";

const router = express.Router();

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

async function isEventProcessed(eventId) {
  try {
    const existing = await db
      .select()
      .from(webhookEvents)
      .where(eq(webhookEvents.id, eventId))
      .limit(1);
    return existing.length > 0;
  } catch (error) {
    logger.error("Error checking event idempotency", { error: error.message, eventId });
    return false;
  }
}

async function markEventProcessed(eventId, eventType) {
  try {
    await db.insert(webhookEvents).values({
      id: eventId,
      eventType: eventType,
      processedAt: new Date(),
      status: "processed",
    }).onConflictDoNothing();
  } catch (error) {
    logger.error("Error marking event processed", { error: error.message, eventId });
  }
}

async function updateUserSubscription(customerId, subscriptionData) {
  try {
    const [user] = await db
      .update(users)
      .set({
        stripeSubscriptionId: subscriptionData.subscriptionId,
        subscriptionPlan: subscriptionData.plan,
        subscriptionStatus: subscriptionData.status,
        subscriptionPeriodEnd: subscriptionData.periodEnd,
        updatedAt: new Date(),
      })
      .where(eq(users.stripeCustomerId, customerId))
      .returning();
    
    return user;
  } catch (error) {
    logger.error("Failed to update user subscription", { error: error.message, customerId });
    throw error;
  }
}

function getPlanFromPriceId(priceId) {
  const planMap = {
    [process.env.STRIPE_PRICE_BASIC]: "basic",
    [process.env.STRIPE_PRICE_PRO]: "pro",
    [process.env.STRIPE_PRICE_PREMIUM]: "premium",
  };
  return planMap[priceId] || "basic";
}

router.post("/", express.raw({ type: "application/json" }), async (req, res) => {
  if (!stripe) {
    logger.warn("Stripe not configured, webhook ignored");
    return res.status(200).json({ received: true, message: "Stripe not configured" });
  }

  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    logger.error("STRIPE_WEBHOOK_SECRET not configured");
    return res.status(500).json({ error: "Webhook not configured" });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    logger.error("Webhook signature verification failed", { error: err.message });
    return res.status(400).json({ error: "Invalid signature" });
  }

  const alreadyProcessed = await isEventProcessed(event.id);
  if (alreadyProcessed) {
    logger.info("Event already processed, skipping", { eventId: event.id });
    return res.json({ received: true, duplicate: true });
  }

  logger.info("Processing Stripe event", { eventType: event.type, eventId: event.id });

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const customerId = session.customer;
        const subscriptionId = session.subscription;

        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          await updateUserSubscription(customerId, {
            subscriptionId: subscription.id,
            plan: getPlanFromPriceId(subscription.items.data[0]?.price.id),
            status: subscription.status,
            periodEnd: new Date(subscription.current_period_end * 1000),
          });
          logger.info("Checkout completed", { customerId });
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object;
        await updateUserSubscription(subscription.customer, {
          subscriptionId: subscription.id,
          plan: getPlanFromPriceId(subscription.items.data[0]?.price.id),
          status: subscription.status,
          periodEnd: new Date(subscription.current_period_end * 1000),
        });
        logger.info("Subscription event processed", { eventType: event.type, customerId: subscription.customer });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        await updateUserSubscription(subscription.customer, {
          subscriptionId: null,
          plan: "free",
          status: "canceled",
          periodEnd: null,
        });
        logger.info("Subscription canceled", { customerId: subscription.customer });
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object;
        logger.info("Invoice paid", { invoiceId: invoice.id, customerId: invoice.customer });
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        logger.error("Payment failed", { customerId: invoice.customer });
        await updateUserSubscription(invoice.customer, {
          subscriptionId: invoice.subscription,
          plan: "basic",
          status: "past_due",
          periodEnd: null,
        });
        break;
      }

      default:
        logger.info("Unhandled event type", { eventType: event.type });
    }

    await markEventProcessed(event.id, event.type);

    res.json({ received: true, processed: event.type });
  } catch (error) {
    logger.error("Error processing event", { eventType: event.type, error: error.message });
    res.status(500).json({ error: "Processing failed", retryable: true });
  }
});

export default router;
