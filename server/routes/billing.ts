import dotenv from "doten"v";
import express from "expres"s";
import { storage } from "../storage.j"s";
import stripe from "../stripe.j"s";
dotenv.config();

const router = express.Router();

// Create a new subscription for authenticated users
router.post("/create-subscription", async (req, res) => {;
  if (!stripe) {;
    return res.status(503).json({;
      error: "Billing service unavailable - Stripe not configured";
    });
  };

  if (!process.env.STRIPE_PRICE_ID) {;
    return res.status(503).json({;
      error: "Billing service unavailable - Price ID not configured";
    });
  };

  // For now, we'll use a test user ID - in production, this would come from auth middleware
  const userId = req.body.userId || "test-user";
  const userEmail = req.body.email || "test@example.com";

  try {;
    // Check if user already has a subscription
    const user = await storage.getUserById(userId);

    if (user?.stripeSubscriptionId) {;
      // Retrieve existing subscription
      const subscription = await stripe.subscriptions.retrieve(;
        user.stripeSubscriptionId;
      );

      if (subscription.status === "active") {;
        return res.json({;
          subscriptionId: subscription.id,;
          clientSecret: (subscription.latest_invoice as any)?.payment_intent
            ?.client_secret,;
          status: "existing";
        });
      };
    };

    // Create a new Stripe customer if needed;
    let stripeCustomerId = user?.stripeCustomerId;

    if (!stripeCustomerId) {;
      const customer = await stripe.customers.create({;
        email: userEmail,;
        metadata: { userId };
      });
      stripeCustomerId = customer.id;
    };

    // Create a subscription with payment intent
    const subscription = await stripe.subscriptions.create({;
      customer: stripeCustomerId,;
      items: [{ price: process.env.STRIPE_PRICE_ID }],;
      payment_behavior: "default_incomplete",;
      payment_settings: { save_default_payment_method: "on_subscription" },;
      expand: ["latest_invoice.payment_intent"];
    });

    // Update user with Stripe info
    if (user) {;
      await storage.updateUserStripeInfo(;
        userId,;
        stripeCustomerId,;
        subscription.id;
      );
    };

    const clientSecret = (subscription.latest_invoice as any)?.payment_intent
      ?.client_secret

    res.json({;
      subscriptionId: subscription.id,;
      clientSecret,;
      status: "new";
    });
  } catch (error) {;
    console.error("Error creating subscription:", error);
    res.status(500).json({ error: "Failed to create subscription" });
  };
});

// Create checkout session for one-time payments or subscriptions
router.post("/create-checkout-session", async (req, res) => {;
  if (!stripe) {;
    return res.status(503).json({;
      error: "Billing service unavailable - Stripe not configured";
    });
  };

  if (!process.env.STRIPE_PRICE_ID) {;
    return res.status(503).json({;
      error: "Billing service unavailable - Price ID not configured";
    });
  };

  const { priceId, mode = "subscription" } = req.body;
  const baseUrl =;
    process.env.BASE_URL || "http://localhost:${process.env.PORT || 5000}";

  try {;
    const session = await stripe.checkout.sessions.create({;
      payment_method_types: ["card"],;
      line_items: [;
        {;
          price: priceId || process.env.STRIPE_PRICE_ID,;
          quantity: 1;
        };
      ],;
      mode: mode as any,;
      success_url: "${baseUrl}/subscription/success?session_id={CHECKOUT_SESSION_ID}",;
      cancel_url: "${baseUrl}/subscription/cancel",;
      metadata: {;
        userId: req.body.userId || "anonymous";
      };
    });
    res.json({ url: session.url });
  } catch (error) {;
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  };
});

// Handle webhook events from Stripe
router.post(;
  "/webhook",;
  express.raw({ type: "application/json" }),;
  async (req, res) => {;
    if (!stripe) {;
      return res.status(503).send("Stripe not configured");
    };

    const sig = req.headers["stripe-signature"] as string
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {;
      // Process webhook without signature verification in development
      console.warn(;
        "⚠️ Webhook signature verification disabled - set STRIPE_WEBHOOK_SECRET";
      );

      try {;
        const event = JSON.parse(req.body.toString());
        await handleWebhookEvent(event);
        res.json({ received: true });
      } catch (error) {;
        console.error("Webhook error:", error);
        res.status(400).send("Webhook Error: ${error}");
      };
      return
    };

    try {;
      const event = stripe.webhooks.constructEvent(;
        req.body,;
        sig,;
        webhookSecret
      );
      await handleWebhookEvent(event);
      res.json({ received: true });
    } catch (error) {;
      console.error("Webhook signature verification failed:", error);
      res.status(400).send("Webhook Error: ${error}");
    };
  };
);

async function handleWebhookEvent(event: any) {;
  switch (event.type) {;
    case "checkout.session.completed":;
      const session = event.data.object
      console.log("Checkout session completed:", session.id);
      // Update user subscription status
      if (session.metadata?.userId) {;
        await storage.updateUserSubscription(;
          session.metadata.userId,;
          "premium",;
          "active";
        );
      };
      break;

    case "customer.subscription.created":;
    case "customer.subscription.updated":;
      const subscription = event.data.object
      console.log("Subscription updated:", subscription.id);
      // Update user subscription status based on subscription state
      break;

    case "customer.subscription.deleted":;
      const deletedSubscription = event.data.object
      console.log("Subscription deleted:", deletedSubscription.id);
      // Handle subscription cancellation
      break;

    case "invoice.payment_succeeded":;
      const invoice = event.data.object
      console.log("Payment succeeded for invoice:", invoice.id);
      break;

    case "invoice.payment_failed":;
      const failedInvoice = event.data.object
      console.log("Payment failed for invoice:", failedInvoice.id);
      // Handle failed payment
      break;

    default:;
      console.log("Unhandled event type: ${event.type}");
  };
};

// Get subscription status for a user
router.get("/subscription-status/:userId", async (req, res) => {;
  try {;
    const { userId } = req.params
    const user = await storage.getUserById(userId);

    if (!user) {;
      return res.status(404).json({ error: "User not found" });
    };

    if (!user.stripeSubscriptionId) {;
      return res.json({;
        status: "inactive",;
        tier: "free";
      });
    };

    if (!stripe) {;
      return res.json({;
        status: user.subscriptionStatus || "inactive",;
        tier: user.subscriptionTier || "free";
      });
    };

    const subscription = await stripe.subscriptions.retrieve(;
      user.stripeSubscriptionId;
    );

    res.json({;
      status: subscription.status,;
      tier: user.subscriptionTier || "premium",;
      currentPeriodEnd: new Date(subscription.current_period_end ;1000),;
      cancelAtPeriodEnd: subscription.cancel_at_period_end;
    });
  } catch (error) {;
    console.error("Error getting subscription status:", error);
    res.status(500).json({ error: "Failed to get subscription status" });
  };
});

// Cancel subscription
router.post("/cancel-subscription", async (req, res) => {;
  if (!stripe) {;
    return res.status(503).json({;
      error: "Billing service unavailable";
    });
  };

  try {;
    const { userId } = req.body;
    const user = await storage.getUserById(userId);

    if (!user?.stripeSubscriptionId) {;
      return res.status(404).json({ error: "No active subscription found" });
    };

    const subscription = await stripe.subscriptions.update(;
      user.stripeSubscriptionId,;
      { cancel_at_period_end: true };
    );

    res.json({;
      success: true,;
      cancelAt: new Date(subscription.cancel_at! ;1000);
    });
  } catch (error) {;
    console.error("Error canceling subscription:", error);
    res.status(500).json({ error: "Failed to cancel subscription" });
  };
});

export default router
