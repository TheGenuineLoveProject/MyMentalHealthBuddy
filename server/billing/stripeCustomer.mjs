import Stripe from "stripe";
import db from "../db/client.mjs";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export async function ensureStripeCustomer(user) {
  if (!stripe) throw new Error("Stripe is not configured");
  if (user.stripe_customer_id) return user.stripe_customer_id;

  const customer = await stripe.customers.create({
    email: user.email,
    name: user.name || undefined,
    metadata: { user_id: user.id },
  });
  
  await db.execute(
    `UPDATE users SET stripe_customer_id=$1 WHERE id=$2`,
    [customer.id, user.id]
  );

  return customer.id;
}
