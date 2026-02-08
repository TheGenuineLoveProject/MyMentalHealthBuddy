import express from "express";
import Stripe from "stripe";
import crypto from "crypto";
import { sql } from "drizzle-orm";
import { requireAuth } from "../middleware/auth.mjs";
import db from "../db/client.mjs";
import { success, badRequest, serverError, unauthorized } from "../utils/response.mjs";
import { logger } from "../utils/logger.mjs";

const router = express.Router();
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
let stripe = null;
if (STRIPE_SECRET_KEY) {
  stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });
}

const PLANS = {
  free: { name: "Free", priceId: null, features: ["mood_tracking", "journaling", "basic_tools"] },
  pro: { name: "Pro", priceId: process.env.STRIPE_PRICE_PRO, features: ["ai_therapy", "advanced_tools", "analytics", "healing_journeys"] },
  team: { name: "Team", priceId: process.env.STRIPE_PRICE_TEAM, features: ["all_pro", "team_dashboard", "admin_controls", "priority_support"] },
};

const PRO_INTERVAL_PRICES = {
  monthly: process.env.STRIPE_PRICE_PRO_MONTHLY || process.env.STRIPE_PRICE_PRO,
  yearly: process.env.STRIPE_PRICE_PRO_YEARLY || process.env.STRIPE_PRICE_PRO,
};

function generateIdempotencyKey(userId, plan, timestamp) {
  const data = `${userId}-${plan}-${Math.floor(timestamp / 60000)}`;
  return crypto.createHash("sha256").update(data).digest("hex").substring(0, 32);
}

async function getOrCreateStripeCustomer(userId, email) {
  const userResult = await db.execute(sql`SELECT stripe_customer_id, email FROM users WHERE id = ${userId}`);
  const existingCustomerId = userResult.rows?.[0]?.stripe_customer_id;
  const userEmail = email || userResult.rows?.[0]?.email;

  if (existingCustomerId) {
    return existingCustomerId;
  }

  const customer = await stripe.customers.create({
    email: userEmail,
    metadata: { userId },
  });

  await db.execute(sql`UPDATE users SET stripe_customer_id = ${customer.id} WHERE id = ${userId}`);
  logger.info("Created Stripe customer", { userId, customerId: customer.id });

  return customer.id;
}

router.use(requireAuth);

router.get("/plans", async (req, res) => {
  return success(res, {
    plans: Object.entries(PLANS).map(([key, plan]) => ({
      id: key,
      name: plan.name,
      features: plan.features,
      hasPriceId: !!plan.priceId,
    })),
  });
});

router.post("/checkout", async (req, res) => {
  try {
    if (!req.user) return unauthorized(res);
    if (!stripe) return serverError(res, new Error("Stripe not configured"));

    const { plan = "pro", interval = "monthly", priceId: directPriceId } = req.body;

    let resolvedPriceId = directPriceId;
    if (!resolvedPriceId) {
      if (plan === "pro" && PRO_INTERVAL_PRICES[interval]) {
        resolvedPriceId = PRO_INTERVAL_PRICES[interval];
      } else {
        const planConfig = PLANS[plan];
        resolvedPriceId = planConfig?.priceId;
      }
    }

    if (!resolvedPriceId) {
      return badRequest(res, `No price configured for plan: ${plan}, interval: ${interval}`);
    }

    const customerId = await getOrCreateStripeCustomer(req.user.id, req.user.email);
    const idempotencyKey = generateIdempotencyKey(req.user.id, `${plan}-${interval}`, Date.now());

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      client_reference_id: req.user.id,
      line_items: [{ price: resolvedPriceId, quantity: 1 }],
      success_url: `${process.env.CORS_ORIGIN || ""}/dashboard?billing=success`,
      cancel_url: `${process.env.CORS_ORIGIN || ""}/account/billing?canceled=true`,
      metadata: { userId: req.user.id, plan, interval },
    }, {
      idempotencyKey,
    });

    logger.info("Checkout session created", { userId: req.user.id, plan, interval, sessionId: session.id });
    return success(res, { url: session.url, sessionId: session.id });
  } catch (err) {
    logger.error("Checkout error", { error: err.message, userId: req.user?.id });
    return serverError(res, err);
  }
});

router.post("/portal", async (req, res) => {
  try {
    if (!req.user) return unauthorized(res);
    if (!stripe) return serverError(res, new Error("Stripe not configured"));

    const userResult = await db.execute(sql`SELECT stripe_customer_id FROM users WHERE id = ${req.user.id}`);
    const customerId = userResult.rows?.[0]?.stripe_customer_id;
    if (!customerId) return badRequest(res, "Missing Stripe customer");

    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.CORS_ORIGIN || ""}/dashboard`,
    });
    return success(res, { url: portal.url });
  } catch (err) {
    return serverError(res, err);
  }
});

router.get("/subscription-status", async (req, res) => {
  try {
    if (!req.user) return unauthorized(res);

    const subResult = await db.execute(sql`
      SELECT tier, status, current_period_end, cancel_at_period_end 
      FROM subscriptions WHERE user_id = ${req.user.id} LIMIT 1
    `);

    if (subResult.rows?.length > 0) {
      const sub = subResult.rows[0];
      return success(res, {
        plan: sub.tier || "free",
        status: sub.status || "active",
        currentPeriodEnd: sub.current_period_end,
        cancelAtPeriodEnd: sub.cancel_at_period_end || false,
      });
    }

    return success(res, { plan: "free", status: "none" });
  } catch (err) {
    logger.error("Subscription status error", { error: err.message });
    return serverError(res, err);
  }
});

router.get("/current-plan", async (req, res) => {
  try {
    if (!req.user) return unauthorized(res);

    const subResult = await db.execute(sql`
      SELECT tier, status FROM subscriptions 
      WHERE user_id = ${req.user.id} AND status IN ('active', 'trialing') LIMIT 1
    `);

    const plan = subResult.rows?.[0]?.tier || "free";
    const planConfig = PLANS[plan] || PLANS.free;

    return success(res, {
      plan,
      name: planConfig.name,
      features: planConfig.features,
      canAccessPro: ["pro", "team", "enterprise"].includes(plan),
      canAccessTeam: ["team", "enterprise"].includes(plan),
    });
  } catch (err) {
    logger.error("Current plan error", { error: err.message });
    return serverError(res, err);
  }
});

router.get("/invoices", async (req, res) => {
  try {
    if (!req.user) return unauthorized(res);
    if (!stripe) return success(res, { invoices: [] });

    const userResult = await db.execute(sql`SELECT stripe_customer_id FROM users WHERE id = ${req.user.id}`);
    const customerId = userResult.rows?.[0]?.stripe_customer_id;
    
    if (!customerId) {
      return success(res, { invoices: [] });
    }

    const invoices = await stripe.invoices.list({
      customer: customerId,
      limit: 20,
    });

    const formatted = invoices.data.map(inv => ({
      id: inv.id,
      date: inv.created ? new Date(inv.created * 1000).toISOString() : null,
      description: inv.lines?.data?.[0]?.description || "Subscription",
      amount: (inv.amount_paid || 0) / 100,
      status: inv.status,
      invoicePdf: inv.invoice_pdf,
      hostedUrl: inv.hosted_invoice_url,
    }));

    return success(res, { invoices: formatted });
  } catch (err) {
    logger.error("Invoices error", { error: err.message });
    return serverError(res, err);
  }
});

export default router;
