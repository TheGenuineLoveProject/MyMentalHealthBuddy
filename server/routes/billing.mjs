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

// All billing routes require auth
router.use(requireAuth);

const checkoutSchema = z.object({
  priceId: z.string().min(1, "priceId is required."),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
});

// POST /api/billing/checkout-session
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

// (Optional) billing portal stub
router.post("/portal-session", async (req, res) => {
  try {
    const user = req.user;
    if (!user) return unauthorized(res);

    if (!stripe) {
      return serverError(res, new Error("Stripe not configured."), "Stripe not configured.");
    }

    // In real setup, you’d link Stripe customer id from DB
    return success(res, { message: "Billing portal not fully wired yet." });
  } catch (err) {
    return serverError(res, err);
  }
});

export default router;