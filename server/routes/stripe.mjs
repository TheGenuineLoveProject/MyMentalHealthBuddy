import * as schema from '../shared/schema.mjs';
import { Router } from "express";
import Stripe from "stripe";

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Basic test endpoint to fetch product prices
router.get("/prices", async (req, res) => {
  try {
    const prices = await stripe.prices.list({ active: true });
    res.json(prices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;