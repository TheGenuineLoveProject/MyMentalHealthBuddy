import express from "express";
import { z } from "zod";
import Stripe from "stripe";
import { requireAuth } from "../middleware/auth.mjs";
import db from "../db/client.mjs";
import { success, badRequest, serverError, unauthorized } from "../utils/response.mjs";

const router = express.Router();
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
let stripe = null;
if (STRIPE_SECRET_KEY) {
  stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });
}

router.use(requireAuth);

router.post("/checkout", async (req, res) => {
  try {
    if (!req.user) return unauthorized(res);
    if (!stripe) return serverError(res, new Error("Stripe not configured"));

    const userResult = await db.execute(`SELECT stripe_customer_id FROM users WHERE id = $1`, [req.user.id]);
    const customerId = userResult.rows?.[0]?.stripe_customer_id;
    if (!customerId) return badRequest(res, "Missing Stripe customer");

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: process.env.STRIPE_PRICE_PRO, quantity: 1 }],
      success_url: `${process.env.CORS_ORIGIN || ""}/dashboard?billing=success`,
      cancel_url: `${process.env.CORS_ORIGIN || ""}/dashboard?billing=cancel`,
    });
    return success(res, { url: session.url });
  } catch (err) {
    return serverError(res, err);
  }
});

router.post("/portal", async (req, res) => {
  try {
    if (!req.user) return unauthorized(res);
    if (!stripe) return serverError(res, new Error("Stripe not configured"));

    const userResult = await db.execute(`SELECT stripe_customer_id FROM users WHERE id = $1`, [req.user.id]);
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
    if (!stripe) return success(res, { plan: "free", status: "active" });

    const customers = await stripe.customers.list({ email: req.user.email, limit: 1, expand: ["data.subscriptions"] });
    if (!customers.data.length) return success(res, { plan: "free", status: "none" });

    const subscription = customers.data[0].subscriptions?.data[0];
    if (!subscription) return success(res, { plan: "free", status: "none" });

    const planMap = {
      [process.env.STRIPE_PRICE_BASIC]: "basic",
      [process.env.STRIPE_PRICE_PREMIUM]: "premium",
      [process.env.STRIPE_PRICE_PRO]: "pro",
    };
    const priceId = subscription.items.data[0]?.price.id;
    return success(res, {
      plan: planMap[priceId] || "basic",
      status: subscription.status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    });
  } catch (err) {
    return serverError(res, err);
  }
});

export default router;
