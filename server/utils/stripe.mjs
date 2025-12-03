// server/utils/stripe.mjs
import Stripe from "stripe";
import { logger } from "./logger.mjs";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
const APP_BASE_URL = process.env.APP_BASE_URL || "http://localhost:5173";

let stripe = null;

if (STRIPE_SECRET_KEY) {
  stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16"
  });
} else {
  logger.warn("STRIPE_SECRET_KEY not set. Billing is disabled");
}

export function getStripeClient() {
  if (!stripe) {
    throw new Error("Stripe client not configured (missing STRIPE_SECRET_KEY).");
  }
  return stripe;
}

export async function createSubscriptionCheckoutSession({
  userId,
  priceId,
  successPath = "/billing/success",
  cancelPath = "/billing/cancel"
}) {
  const client = getStripeClient();

  const session = await client.checkout.sessions.create({
    mode: "subscription",
    line_items: [
      {
        price: priceId,
        quantity: 1
      }
    ],
    success_url: `${APP_BASE_URL}${successPath}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${APP_BASE_URL}${cancelPath}`,
    metadata: { userId }
  });

  return session;
}

export function constructStripeWebhookEvent(rawBody, signature) {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
  const client = getStripeClient();

  if (!endpointSecret) {
    throw new Error("STRIPE_WEBHOOK_SECRET not set");
  }

  return client.webhooks.constructEvent(rawBody, signature, endpointSecret);
}
