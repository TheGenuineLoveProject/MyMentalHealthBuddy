import express from "express";
import Stripe from "stripe";
import { sql } from "drizzle-orm";
import db from "../db/client.mjs";
import { logger } from "../utils/logger.mjs";

const router = express.Router();

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" })
  : null;

function getPlanFromPriceId(priceId) {
  const planMap = {
    [process.env.STRIPE_PRICE_BASIC]: "basic",
    [process.env.STRIPE_PRICE_PREMIUM]: "premium",
    [process.env.STRIPE_PRICE_PRO]: "pro",
  };
  return planMap[priceId] || "basic";
}

async function isEventProcessed(eventId) {
  try {
    const result = await db.execute(sql`SELECT id FROM webhook_events WHERE id = ${eventId} LIMIT 1`);
    return result.rows?.length > 0;
  } catch (error) {
    logger.error("Error checking event idempotency", { error: error.message, eventId });
    return false;
  }
}

async function markEventProcessed(eventId, eventType) {
  try {
    await db.execute(sql`
      INSERT INTO webhook_events (id, event_type, processed_at, status)
      VALUES (${eventId}, ${eventType}, NOW(), 'processed')
      ON CONFLICT (id) DO NOTHING
    `);
  } catch (error) {
    logger.error("Error marking event processed", { error: error.message, eventId });
  }
}

async function updateUserSubscription(customerId, subscriptionData, customerEmail = null) {
  try {
    let userId = null;

    const subResult = await db.execute(sql`SELECT user_id FROM subscriptions WHERE stripe_customer_id = ${customerId} LIMIT 1`);
    if (subResult.rows?.length > 0) {
      userId = subResult.rows[0].user_id;
    }

    if (!userId && customerEmail) {
      const userResult = await db.execute(sql`SELECT id FROM users WHERE email = ${customerEmail} LIMIT 1`);
      if (userResult.rows?.length > 0) {
        userId = userResult.rows[0].id;
      }
    }

    if (!userId) {
      logger.warn("No user found for subscription update", { customerId, customerEmail });
      return null;
    }

    const existingResult = await db.execute(sql`SELECT id FROM subscriptions WHERE user_id = ${userId} LIMIT 1`);

    if (existingResult.rows?.length > 0) {
      await db.execute(sql`
        UPDATE subscriptions
        SET tier = ${subscriptionData.plan || "free"}, 
            status = ${subscriptionData.status || "active"}, 
            stripe_customer_id = ${customerId}, 
            stripe_subscription_id = ${subscriptionData.subscriptionId || null},
            current_period_start = ${subscriptionData.periodStart || null}, 
            current_period_end = ${subscriptionData.periodEnd || null}, 
            cancel_at_period_end = ${subscriptionData.cancelAtPeriodEnd ? true : false},
            updated_at = NOW()
        WHERE user_id = ${userId}
      `);
      logger.info("Subscription updated", { userId, plan: subscriptionData.plan });
    } else {
      await db.execute(sql`
        INSERT INTO subscriptions (id, user_id, tier, status, stripe_customer_id, stripe_subscription_id,
         current_period_start, current_period_end, cancel_at_period_end, created_at, updated_at)
         VALUES (gen_random_uuid(), ${userId}, ${subscriptionData.plan || "free"}, ${subscriptionData.status || "active"}, 
                 ${customerId}, ${subscriptionData.subscriptionId || null}, ${subscriptionData.periodStart || null}, 
                 ${subscriptionData.periodEnd || null}, ${subscriptionData.cancelAtPeriodEnd ? true : false}, NOW(), NOW())
      `);
      logger.info("Subscription created", { userId, plan: subscriptionData.plan });
    }

    return { userId, ...subscriptionData };
  } catch (error) {
    logger.error("Failed to update subscription", { error: error.message, customerId });
    throw error;
  }
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
          await updateUserSubscription(
            customerId,
            {
              subscriptionId: subscription.id,
              plan: getPlanFromPriceId(subscription.items.data[0]?.price.id),
              status: subscription.status,
              periodStart: new Date(subscription.current_period_start * 1000),
              periodEnd: new Date(subscription.current_period_end * 1000),
              cancelAtPeriodEnd: subscription.cancel_at_period_end,
            },
            customerEmail
          );
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
