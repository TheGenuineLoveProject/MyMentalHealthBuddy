import * as schema from "../../server/shared/schema.mjs";
import express from "express";
import Stripe from "stripe";
import { db } from '../db/connection.mjs';
// billing.mjs

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /api/billing/create-checkout-session
router.post("/create-checkout-session", async (req, res) => {
  try {
    const { priceId } = req.body;
    if (!priceId) return res.status(400).json({ error: "Missing priceId" });

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: "https://your-app.com/success",
      cancel_url: "https://your-app.com/cancel",
    });

    return res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe Error:", err);
    return res.status(500).json({
      error: "Failed to create checkout session.",
      details: err.message,
    });
  }
});

export default router;
