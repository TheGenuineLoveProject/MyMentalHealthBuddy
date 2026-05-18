import express from "express";
import Stripe from "stripe";
import crypto from "crypto";
import { sql } from "drizzle-orm";
import { requireAuth } from "../middleware/auth.mjs";
import db from "../db/client.mjs";
import { success, badRequest, serverError, unauthorized } from "../utils/response.mjs";
import { logger } from "../utils/logger.mjs";
import { increment } from "../utils/metrics.mjs";

const router = express.Router();
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
let stripe = null;
if (STRIPE_SECRET_KEY) {
  stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });
}

const PLANS = {
  free: { name: "Free", priceId: null, mode: null, features: ["mood_tracking", "journaling", "daily_reflection", "community_wall", "crisis_support", "daily_wisdom"] },
  starter: { name: "Starter", priceId: process.env.STRIPE_PRICE_STARTER, mode: "payment", features: ["mood_tracking", "journaling", "daily_reflection", "community_wall", "crisis_support", "daily_wisdom", "extended_ai_chat", "journal_insights", "guided_reflections"] },
  pro: { name: "Pro", priceId: process.env.STRIPE_PRICE_PRO, mode: "subscription", features: ["unlimited_ai_chat", "advanced_insights", "healing_journeys", "content_studio", "progress_analytics", "priority_support"] },
  elite: { name: "Elite", priceId: process.env.STRIPE_PRICE_ELITE, mode: "subscription", features: ["unlimited_ai_chat", "advanced_insights", "healing_journeys", "content_studio", "progress_analytics", "priority_support", "voice_affirmations", "1on1_onboarding", "early_access", "elite_community"] },
};

const PRO_INTERVAL_PRICES = {
  monthly: process.env.STRIPE_PRICE_PRO_MONTHLY || process.env.STRIPE_PRICE_PRO,
  yearly: process.env.STRIPE_PRICE_PRO_YEARLY || process.env.STRIPE_PRICE_PRO,
};

const ELITE_INTERVAL_PRICES = {
  monthly: process.env.STRIPE_PRICE_ELITE_MONTHLY || process.env.STRIPE_PRICE_ELITE,
  yearly: process.env.STRIPE_PRICE_ELITE_YEARLY || process.env.STRIPE_PRICE_ELITE,
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

router.post("/pricing-view", (req, res) => {
  const plan = req.session?.userData ? "authenticated" : "anonymous";
  increment("pricing_page_view", { plan });
  res.status(204).end();
});

router.get("/", (req, res) => {
  res.json({ ok: true, module: "billing", status: "operational", timestamp: new Date().toISOString() });
});

router.use(requireAuth);

router.post("/checkout", async (req, res) => {
  try {
    if (!req.dbUserId) return unauthorized(res);
    if (!stripe) return serverError(res, new Error("Stripe not configured"));

    const { plan = "pro", interval = "monthly", priceId: directPriceId } = req.body;

    // P2.9C: allow-list client-supplied directPriceId against known
    // STRIPE_PRICE_* env vars. Prevents arbitrary Stripe price IDs from
    // being charged via the checkout endpoint.
    if (directPriceId !== undefined && directPriceId !== null && directPriceId !== "") {
      const allowedPriceIds = new Set([
        process.env.STRIPE_PRICE_STARTER,
        process.env.STRIPE_PRICE_PRO,
        process.env.STRIPE_PRICE_PRO_MONTHLY,
        process.env.STRIPE_PRICE_PRO_YEARLY,
        process.env.STRIPE_PRICE_ELITE,
        process.env.STRIPE_PRICE_ELITE_MONTHLY,
        process.env.STRIPE_PRICE_ELITE_YEARLY,
      ].filter(Boolean));
      if (typeof directPriceId !== "string" || !allowedPriceIds.has(directPriceId)) {
        logger.warn("Checkout rejected: directPriceId not in allow-list", { userId: req.dbUserId, plan, interval });
        increment("checkout_priceid_rejected", { plan });
        return badRequest(res, "Invalid priceId");
      }
    }

    const planConfig = PLANS[plan];
    if (!planConfig) {
      return badRequest(res, `Unknown plan: ${plan}`);
    }

    let resolvedPriceId = directPriceId;

    const canonicalPriceId =
      plan === "pro"
        ? PRO_INTERVAL_PRICES[interval]
        : plan === "elite"
        ? ELITE_INTERVAL_PRICES[interval]
        : planConfig?.priceId;

    if (
      directPriceId &&
      canonicalPriceId &&
      directPriceId !== canonicalPriceId
    ) {
      logger.warn("checkout blocked: price/plan mismatch", {
        plan,
        interval,
        directPriceId,
        canonicalPriceId,
      });

      increment("checkout_priceid_plan_mismatch", {
        plan,
        interval,
      });

      return badRequest(res, "Price/plan mismatch");
    }
    if (!resolvedPriceId) {
      if (plan === "pro" && PRO_INTERVAL_PRICES[interval]) {
        resolvedPriceId = PRO_INTERVAL_PRICES[interval];
      } else if (plan === "elite" && ELITE_INTERVAL_PRICES[interval]) {
        resolvedPriceId = ELITE_INTERVAL_PRICES[interval];
      } else {
        resolvedPriceId = planConfig?.priceId;
      }
    }

    if (!resolvedPriceId) {
      return badRequest(res, `No price configured for plan: ${plan}, interval: ${interval}`);
    }

    const checkoutMode = planConfig.mode || "subscription";

    const dbUserId = req.dbUserId;
    const customerId = await getOrCreateStripeCustomer(dbUserId, req.user?.email || req.user?.claims?.email);
    const idempotencyKey = generateIdempotencyKey(dbUserId, `${plan}-${interval}`, Date.now());

    const replitDomain = process.env.REPLIT_DEV_DOMAIN || process.env.REPLIT_DOMAINS?.split(",")[0];
    const baseUrl = process.env.CORS_ORIGIN || (replitDomain ? `https://${replitDomain}` : "http://localhost:5000");
    const session = await stripe.checkout.sessions.create({
      mode: checkoutMode,
      customer: customerId,
      client_reference_id: dbUserId,
      line_items: [{ price: resolvedPriceId, quantity: 1 }],
      success_url: `${baseUrl}/dashboard?billing=success`,
      cancel_url: `${baseUrl}/account/billing?canceled=true`,
      metadata: { userId: dbUserId, plan, interval },
    }, {
      idempotencyKey,
    });

    logger.info("Checkout session created", { userId: dbUserId, plan, interval, sessionId: session.id });
    increment("checkout_initiated", { plan: `${plan}_${interval}` });
    return success(res, { url: session.url, sessionId: session.id });
  } catch (err) {
    logger.error("Checkout error", { error: err.message, userId: req.dbUserId });
    return serverError(res, err);
  }
});

router.post("/portal", async (req, res) => {
  try {
    if (!req.dbUserId) return unauthorized(res);
    if (!stripe) return serverError(res, new Error("Stripe not configured"));

    const userResult = await db.execute(sql`SELECT stripe_customer_id FROM users WHERE id = ${req.dbUserId}`);
    const customerId = userResult.rows?.[0]?.stripe_customer_id;
    if (!customerId) return badRequest(res, "Missing Stripe customer");

    const replitDomain = process.env.REPLIT_DEV_DOMAIN || process.env.REPLIT_DOMAINS?.split(",")[0];
    const baseUrl = process.env.CORS_ORIGIN || (replitDomain ? `https://${replitDomain}` : "http://localhost:5000");
    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${baseUrl}/account/billing`,
    });
    return success(res, { url: portal.url });
  } catch (err) {
    return serverError(res, err);
  }
});

router.get("/subscription-status", async (req, res) => {
  try {
    if (!req.dbUserId) return unauthorized(res);

    const userResult = await db.execute(sql`
      SELECT subscription_status, subscription_expires_at, stripe_customer_id
      FROM users WHERE id = ${req.dbUserId} LIMIT 1
    `);

    const user = userResult.rows?.[0];
    if (!user) {
      return success(res, { plan: "free", status: "none" });
    }

    const plan = user.subscription_status || "free";
    const isActive = ["starter", "pro", "elite"].includes(plan);

    let cancelAtPeriodEnd = false;
    if (["pro", "elite"].includes(plan) && stripe && user.stripe_customer_id) {
      try {
        const subs = await stripe.subscriptions.list({
          customer: user.stripe_customer_id,
          status: "active",
          limit: 1,
        });
        if (subs.data.length > 0) {
          cancelAtPeriodEnd = subs.data[0].cancel_at_period_end || false;
        }
      } catch (stripeErr) {
        logger.warn("Failed to fetch Stripe subscription details", { error: stripeErr.message });
      }
    }

    return success(res, {
      plan,
      status: isActive ? "active" : "none",
      currentPeriodEnd: user.subscription_expires_at || null,
      cancelAtPeriodEnd,
    });
  } catch (err) {
    logger.error("Subscription status error", { error: err.message });
    return serverError(res, err);
  }
});

router.get("/current-plan", async (req, res) => {
  try {
    if (!req.dbUserId) return unauthorized(res);

    const userResult = await db.execute(sql`
      SELECT subscription_status FROM users WHERE id = ${req.dbUserId} LIMIT 1
    `);

    const plan = userResult.rows?.[0]?.subscription_status || "free";
    const planConfig = PLANS[plan] || PLANS.free;

    return success(res, {
      plan,
      name: planConfig.name,
      features: planConfig.features,
      canAccessPro: ["pro", "elite"].includes(plan),
      canAccessStarter: ["starter", "pro", "elite"].includes(plan),
      canAccessElite: plan === "elite",
    });
  } catch (err) {
    logger.error("Current plan error", { error: err.message });
    return serverError(res, err);
  }
});

router.get("/invoices", async (req, res) => {
  try {
    if (!req.dbUserId) return unauthorized(res);
    if (!stripe) return success(res, { invoices: [] });

    const userResult = await db.execute(sql`SELECT stripe_customer_id FROM users WHERE id = ${req.dbUserId}`);
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
