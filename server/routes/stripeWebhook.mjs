// server/routes/stripeWebhook.mjs
import express from "express";
import Stripe from "stripe";
import { db } from "../db/connection.mjs";
import { users } from "../shared/schema.mjs";
import { eq } from "drizzle-orm";

const router = express.Router();

// Initialize Stripe only if key is available
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

// Idempotency tracking (in production, use Redis or database)
const processedEvents = new Set();
const PROCESSED_EVENTS_MAX = 10000;

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

  // Idempotency check - prevent duplicate processing
  if (processedEvents.has(event.id)) {
    console.log(`Event ${event.id} already processed, skipping`);
    return res.json({ received: true, duplicate: true });
  }

  // Add to processed set (with cleanup for memory management)
  if (processedEvents.size >= PROCESSED_EVENTS_MAX) {
    const firstItem = processedEvents.values().next().value;
    processedEvents.delete(firstItem);
  }
  processedEvents.add(event.id);

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
        // Can add billing history tracking here
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        console.error(`Payment failed for customer ${invoice.customer}`);
        // Can add notification/email logic here
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

    res.json({ received: true, processed: event.type });
  } catch (error) {
    console.error(`Error processing event ${event.type}:`, error);
    // Remove from processed set so it can be retried
    processedEvents.delete(event.id);
    res.status(500).json({ error: "Processing failed", retryable: true });
  }
});

export default router;
