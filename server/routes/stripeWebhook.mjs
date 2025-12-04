// server/routes/stripeWebhook.mjs
import express from "express";
import Stripe from "stripe";
import { db } from "../db/connection.mjs";
import { users, webhookEvents, subscriptions } from "../../shared/schema.mjs";
import { eq, and } from "drizzle-orm";
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

async function findUserByStripeCustomer(customerId) {
  try {
    const existing = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.stripeCustomerId, customerId))
      .limit(1);
    
    if (existing.length > 0) {
      return existing[0].userId;
    }
    return null;
  } catch (error) {
    logger.error("Error finding user by Stripe customer", { error: error.message, customerId });
    return null;
  }
}

async function findUserByEmail(email) {
  try {
    const userRows = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    
    return userRows[0]?.id || null;
  } catch (error) {
    logger.error("Error finding user by email", { error: error.message, email });
    return null;
  }
}

async function updateUserSubscription(customerId, subscriptionData, customerEmail = null) {
  try {
    let userId = await findUserByStripeCustomer(customerId);
    
    if (!userId && customerEmail) {
      userId = await findUserByEmail(customerEmail);
    }
    
    if (!userId) {
      logger.warn("No user found for subscription update", { customerId, customerEmail });
      return null;
    }

    const existingSub = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .limit(1);

    const subscriptionValues = {
      userId,
      tier: subscriptionData.plan || "free",
      status: subscriptionData.status || "active",
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionData.subscriptionId || null,
      currentPeriodStart: subscriptionData.periodStart || null,
      currentPeriodEnd: subscriptionData.periodEnd || null,
      cancelAtPeriodEnd: subscriptionData.cancelAtPeriodEnd ? 1 : 0,
      updatedAt: new Date(),
    };

    if (existingSub.length > 0) {
      await db
        .update(subscriptions)
        .set(subscriptionValues)
        .where(eq(subscriptions.userId, userId));
      
      logger.info("Subscription updated", { userId, plan: subscriptionData.plan });
    } else {
      await db.insert(subscriptions).values({
        ...subscriptionValues,
        createdAt: new Date(),
      });
      
      logger.info("Subscription created", { userId, plan: subscriptionData.plan });
    }

    return { userId, ...subscriptionData };
  } catch (error) {
    logger.error("Failed to update subscription", { error: error.message, customerId });
    throw error;
  }
}

function getPlanFromPriceId(priceId) {
  const planMap = {
    [process.env.STRIPE_PRICE_BASIC]: "basic",
    [process.env.STRIPE_PRICE_PREMIUM]: "premium",
    [process.env.STRIPE_PRICE_PRO]: "pro",
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
        const customerEmail = session.customer_email || session.customer_details?.email;

        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          await updateUserSubscription(customerId, {
            subscriptionId: subscription.id,
            plan: getPlanFromPriceId(subscription.items.data[0]?.price.id),
            status: subscription.status,
            periodStart: new Date(subscription.current_period_start * 1000),
            periodEnd: new Date(subscription.current_period_end * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          }, customerEmail);
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
          periodStart: new Date(subscription.current_period_start * 1000),
          periodEnd: new Date(subscription.current_period_end * 1000),
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
        });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        await updateUserSubscription(subscription.customer, {
          subscriptionId: null,
          plan: "free",
          status: "canceled",
          periodStart: null,
          periodEnd: null,
          cancelAtPeriodEnd: false,
        });
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object;
        logger.info("Invoice paid", { invoiceId: invoice.id, customerId: invoice.customer });
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        logger.warn("Payment failed", { customerId: invoice.customer, invoiceId: invoice.id });
        
        if (invoice.subscription) {
          await updateUserSubscription(invoice.customer, {
            subscriptionId: invoice.subscription,
            status: "past_due",
          });
        }
        break;
      }

      default:
        logger.info("Unhandled event type", { eventType: event.type });
    }

    await markEventProcessed(event.id, event.type);

    res.json({ received: true, processed: event.type });
  } catch (error) {
    logger.error("Error processing webhook event", { eventType: event.type, error: error.message });
    res.status(500).json({ error: "Processing failed", retryable: true });
  }
});

export default router;
