// server/routes/stripeWebhook.mjs
import express from "express";
import Stripe from "stripe";
import { db } from "../db/connection.mjs";
import { users, webhookEvents } from "../../shared/schema.mjs";
import { eq } from "drizzle-orm";

const router = express.Router();

// Initialize Stripe only if key is available
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

// Database-backed idempotency check
async function isEventProcessed(eventId) {
  try {
    const existing = await db
      .select()
      .from(webhookEvents)
      .where(eq(webhookEvents.id, eventId))
      .limit(1);
    return existing.length > 0;
  } catch (error) {
    console.error("Error checking event idempotency:", error);
    return false;
  }
}

// Mark event as processed
async function markEventProcessed(eventId, eventType) {
  try {
    await db.insert(webhookEvents).values({
      id: eventId,
      eventType: eventType,
      processedAt: new Date(),
      status: "processed",
    }).onConflictDoNothing();
  } catch (error) {
    console.error("Error marking event processed:", error);
  }
}

// Helper to update user subscription
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
    console.error("Failed to update user subscription:", error);
    throw error;
  }
}

// Map Stripe price IDs to plan names
function getPlanFromPriceId(priceId) {
  const planMap = {
    [process.env.STRIPE_PRICE_BASIC]: "basic",
    [process.env.STRIPE_PRICE_PRO]: "pro",
    [process.env.STRIPE_PRICE_PREMIUM]: "premium",
  };
  return planMap[priceId] || "basic";
}

// Webhook endpoint
router.post("/", express.raw({ type: "application/json" }), async (req, res) => {
  // Check if Stripe is configured
  if (!stripe) {
    console.warn("Stripe not configured, webhook ignored");
    return res.status(200).json({ received: true, message: "Stripe not configured" });
  }

  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET not configured");
    return res.status(500).json({ error: "Webhook not configured" });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).json({ error: "Invalid signature" });
  }

  // Database-backed idempotency check
  const alreadyProcessed = await isEventProcessed(event.id);
  if (alreadyProcessed) {
    console.log(`Event ${event.id} already processed, skipping`);
    return res.json({ received: true, duplicate: true });
  }

  console.log(`Processing Stripe event: ${event.type} (${event.id})`);

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
          console.log(`Checkout completed for customer ${customerId}`);
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
        console.log(`Subscription ${event.type} for customer ${subscription.customer}`);
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
        console.log(`Subscription canceled for customer ${subscription.customer}`);
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object;
        console.log(`Invoice paid: ${invoice.id} for customer ${invoice.customer}`);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        console.error(`Payment failed for customer ${invoice.customer}`);
        await updateUserSubscription(invoice.customer, {
          subscriptionId: invoice.subscription,
          plan: "basic",
          status: "past_due",
          periodEnd: null,
        });
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Mark event as processed in database
    await markEventProcessed(event.id, event.type);

    res.json({ received: true, processed: event.type });
  } catch (error) {
    console.error(`Error processing event ${event.type}:`, error);
    res.status(500).json({ error: "Processing failed", retryable: true });
  }
});

export default router;
