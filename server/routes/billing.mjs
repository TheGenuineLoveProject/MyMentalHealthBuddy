// server/routes/billing.mjs

import express from "express";
import Stripe from "stripe";
import { z } from "zod";

import {
  success,
  badRequest,
  serverError,
  unauthorized,
} from "../utils/response.mjs";
import { requireAuth } from "../middleware/auth.mjs";

const router = express.Router();

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";

let stripe = null;
if (STRIPE_SECRET_KEY) {
  stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: "2024-06-20",
  });
}

router.use(requireAuth);

const checkoutSchema = z.object({
  priceId: z.string().min(1, "priceId is required."),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
});

router.post("/checkout-session", async (req, res) => {
  try {
    const user = req.user;
    if (!user) return unauthorized(res);

    if (!stripe) {
      return serverError(res, new Error("Stripe not configured."), "Stripe not configured.");
    }

    const parseResult = checkoutSchema.safeParse(req.body);
    if (!parseResult.success) {
      const errors = parseResult.error.flatten();
      return badRequest(res, "Validation failed.", errors);
    }

    const { priceId, successUrl, cancelUrl } = parseResult.data;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: user.email,
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return success(res, { url: session.url }, "Checkout session created.");
  } catch (err) {
    return serverError(res, err);
  }
});

router.post("/portal-session", async (req, res) => {
  try {
    const user = req.user;
    if (!user) return unauthorized(res);

    if (!stripe) {
      return serverError(res, new Error("Stripe not configured."), "Stripe not configured.");
    }

    const { returnUrl } = req.body;
    
    if (!returnUrl) {
      return badRequest(res, "returnUrl is required.");
    }

    let customers;
    try {
      customers = await stripe.customers.list({
        email: user.email,
        limit: 1,
      });
    } catch (err) {
      return serverError(res, err, "Failed to look up customer.");
    }

    if (!customers.data.length) {
      return badRequest(res, "No billing account found. Please subscribe to a plan first.");
    }

    const customerId = customers.data[0].id;

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return success(res, { url: portalSession.url }, "Billing portal session created.");
  } catch (err) {
    return serverError(res, err);
  }
});

router.get("/subscription-status", async (req, res) => {
  try {
    const user = req.user;
    if (!user) return unauthorized(res);

    if (!stripe) {
      return success(res, { 
        plan: "free", 
        status: "active",
        message: "Billing not configured" 
      });
    }

    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1,
      expand: ["data.subscriptions"],
    });

    if (!customers.data.length) {
      return success(res, { plan: "free", status: "none" });
    }

    const customer = customers.data[0];
    const subscription = customer.subscriptions?.data[0];

    if (!subscription) {
      return success(res, { plan: "free", status: "none" });
    }

    const planMap = {
      [process.env.STRIPE_PRICE_BASIC]: "basic",
      [process.env.STRIPE_PRICE_PREMIUM]: "premium",
      [process.env.STRIPE_PRICE_PRO]: "pro",
    };

    const priceId = subscription.items.data[0]?.price.id;
    const plan = (priceId && planMap[priceId]) || "basic";

    return success(res, {
      plan,
      status: subscription.status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    });
  } catch (err) {
    return serverError(res, err);
  }
});

export default router;
