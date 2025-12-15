import Stripe from "stripe";
import db from "../db/client.mjs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function ensureStripeCustomerForUser(userId, email) {
  const found = await db.execute(
    `SELECT stripe_customer_id FROM users WHERE id = $1`,
    [userId]
  );

  const existing = found.rows?.[0]?.stripe_customer_id;
  if (existing) return existing;

  const customer = await stripe.customers.create({
    email,
    metadata: { userId },
  });

  await db.execute(
    `UPDATE users SET stripe_customer_id = $1 WHERE id = $2`,
    [customer.id, userId]
  );

  return customer.id;
}

export async function setUserSubscriptionStatusByCustomer(customerId, status, expiresAt = null) {
  await db.execute(
    `UPDATE users SET subscription_status = $1, subscription_expires_at = $2 WHERE stripe_customer_id = $3`,
    [status, expiresAt, customerId]
  );
}

export { stripe };