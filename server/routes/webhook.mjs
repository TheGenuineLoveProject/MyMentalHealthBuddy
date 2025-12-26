import { Router } from "express";
import express from "express";
import Stripe from "stripe";
import { db } from "../db/client.mjs";
import { webhookEvents } from "../db/schema/index.ts"; // adjust import style if needed
import { eq } from "drizzle-orm";

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function isProcessed(eventId) {
  const rows = await db.select().from(webhookEvents).where(eq(webhookEvents.id, eventId));
  return rows.length > 0;
}

async function markProcessed(event) {
  await db.insert(webhookEvents).values({
    id: event.id,
    eventType: event.type,
    status: "processed",
    processedAt: new Date(),
  });
}

// IMPORTANT: raw body ONLY for stripe
router.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Idempotency
    if (await isProcessed(event.id)) {
      return res.json({ received: true, duplicate: true });
    }

    // Handle events safely (retry-safe)
    try {
      switch (event.type) {
        case "checkout.session.completed":
        case "customer.subscription.created":
        case "customer.subscription.updated":
        case "customer.subscription.deleted":
        case "invoice.paid":
        case "invoice.payment_failed":
          // TODO: call your billing service handler
          break;
        default:
          break;
      }

      await markProcessed(event);
      return res.json({ received: true });
    } catch (e) {
      // Do NOT mark processed on failure; Stripe will retry.
      return res.status(500).json({ error: "Webhook handler failed" });
    }
  }
);

export default router;