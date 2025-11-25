// server/routes/billing.mjs
import express from "express";
import Stripe from "stripe";
import { authGuard } from "../middleware/auth.mjs";
import { success, badRequest, serverError, forbidden } from "../utils/response.mjs";
import { db } from "../db/connection.mjs";
import { users } from "../shared/schema.mjs";
import { eq } from "drizzle-orm";

const router = express.Router();

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" })
  : null;

const PLANS = {
  free: {
    id: "free",
    name: "Free",
    price: 0,
    features: ["5 AI chats per day", "Basic mood tracking", "Journal entries"],
  },
  pro: {
    id: "pro",
    name: "Pro",
    price: 9.99,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    features: ["Unlimited AI chats", "Advanced analytics", "Priority support", "Export data"],
  },
  premium: {
    id: "premium",
    name: "Premium",
    price: 19.99,
    priceId: process.env.STRIPE_PREMIUM_PRICE_ID,
    features: ["Everything in Pro", "Custom themes", "Family sharing", "1-on-1 onboarding"],
  },
};

router.get("/ping", (req, res) => success(res, { route: "billing" }));

router.get("/plans", (req, res) => {
  return success(res, { 
    plans: Object.values(PLANS).map(plan => ({
      id: plan.id,
      name: plan.name,
      price: plan.price,
      features: plan.features,
    }))
  });
});

router.get("/status", authGuard, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    
    if (!user) {
      return forbidden(res, "User not found");
    }

    return success(res, {
      plan: user.subscriptionPlan || "free",
      status: user.subscriptionStatus || "active",
      currentPeriodEnd: user.subscriptionPeriodEnd || null,
    });
  } catch (err) {
    return serverError(res, err, "Failed to fetch billing status");
  }
});

router.post("/create-checkout", authGuard, async (req, res) => {
  try {
    if (!stripe) {
      return badRequest(res, "Payment processing is not configured");
    }

    const { planId } = req.body;
    
    if (!planId || !PLANS[planId] || planId === "free") {
      return badRequest(res, "Invalid plan selected");
    }

    const plan = PLANS[planId];
    
    if (!plan.priceId) {
      return badRequest(res, "This plan is not available for purchase");
    }

    const userId = req.user.id;
    const [user] = await db.select().from(users).where(eq(users.id, userId));

    if (!user) {
      return forbidden(res, "User not found");
    }

    let customerId = user.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId: String(userId) },
      });
      customerId = customer.id;

      await db.update(users)
        .set({ stripeCustomerId: customerId })
        .where(eq(users.id, userId));
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: plan.priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.APP_URL || "http://localhost:5000"}/settings?checkout=success`,
      cancel_url: `${process.env.APP_URL || "http://localhost:5000"}/settings?checkout=cancelled`,
      metadata: {
        userId: String(userId),
        planId: planId,
      },
    });

    return success(res, { 
      sessionId: session.id,
      url: session.url,
    });
  } catch (err) {
    return serverError(res, err, "Failed to create checkout session");
  }
});

router.post("/create-portal", authGuard, async (req, res) => {
  try {
    if (!stripe) {
      return badRequest(res, "Payment processing is not configured");
    }

    const userId = req.user.id;
    const [user] = await db.select().from(users).where(eq(users.id, userId));

    if (!user || !user.stripeCustomerId) {
      return badRequest(res, "No billing account found");
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.APP_URL || "http://localhost:5000"}/settings`,
    });

    return success(res, { url: session.url });
  } catch (err) {
    return serverError(res, err, "Failed to create billing portal session");
  }
});

router.post("/cancel", authGuard, async (req, res) => {
  try {
    if (!stripe) {
      return badRequest(res, "Payment processing is not configured");
    }

    const userId = req.user.id;
    const [user] = await db.select().from(users).where(eq(users.id, userId));

    if (!user || !user.stripeSubscriptionId) {
      return badRequest(res, "No active subscription found");
    }

    await stripe.subscriptions.update(user.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    return success(res, { message: "Subscription will be cancelled at the end of the billing period" });
  } catch (err) {
    return serverError(res, err, "Failed to cancel subscription");
  }
});

export default router;
