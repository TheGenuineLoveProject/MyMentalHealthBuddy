import Stripe from "stripe";
import { storage } from "../storage.js";

// Initialize Stripe with secret key (from Replit integration blueprint:javascript_stripe)
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing required Stripe secret: STRIPE_SECRET_KEY");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-11-20.acacia",
  typescript: true,
});

// Subscription tier pricing configuration
export const SUBSCRIPTION_TIERS = {
  free: {
    name: "Free",
    price: 0,
    priceId: null,
    features: [
      "5 AI therapy sessions per month",
      "Basic mood tracking",
      "Journal entries",
      "Crisis resources access",
    ],
  },
  premium: {
    name: "Premium",
    price: 2999, // $29.99 in cents
    priceId: process.env.STRIPE_PREMIUM_PRICE_ID || "price_premium_default",
    features: [
      "Unlimited AI therapy sessions",
      "Advanced mood analytics",
      "Unlimited journal entries",
      "Data export (CSV/JSON)",
      "Priority support",
    ],
  },
  professional: {
    name: "Professional",
    price: 4999, // $49.99 in cents
    priceId: process.env.STRIPE_PROFESSIONAL_PRICE_ID || "price_professional_default",
    features: [
      "Everything in Premium",
      "Professional therapist consultations",
      "Custom therapy plans",
      "Advanced insights & reports",
      "24/7 priority support",
      "HIPAA-compliant data storage",
    ],
  },
} as const;

export type SubscriptionTier = keyof typeof SUBSCRIPTION_TIERS;

export class StripeService {
  /**
   * Create or retrieve Stripe customer for a user
   */
  static async getOrCreateCustomer(userId: string): Promise<Stripe.Customer> {
    const user = await storage.getUserById(userId);
    
    if (!user) {
      throw new Error("User not found");
    }

    // Return existing customer if already created
    if (user.stripeCustomerId) {
      try {
        return await stripe.customers.retrieve(user.stripeCustomerId) as Stripe.Customer;
      } catch (error) {
        // Customer might have been deleted, create new one
        console.warn(`Stripe customer ${user.stripeCustomerId} not found, creating new one`);
      }
    }

    // Create new Stripe customer
    const customer = await stripe.customers.create({
      email: user.email || undefined,
      name: user.name || user.username,
      metadata: {
        userId: user.id,
        username: user.username,
      },
    });

    // Update user record with Stripe customer ID
    // Note: This would need a storage method - for now just return customer
    console.log(`Created Stripe customer ${customer.id} for user ${userId}`);

    return customer;
  }

  /**
   * Create subscription checkout session
   */
  static async createSubscriptionCheckout(
    userId: string,
    tier: SubscriptionTier,
    successUrl: string,
    cancelUrl: string
  ): Promise<Stripe.Checkout.Session> {
    if (tier === "free") {
      throw new Error("Cannot create checkout for free tier");
    }

    const customer = await this.getOrCreateCustomer(userId);
    const tierConfig = SUBSCRIPTION_TIERS[tier];

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      mode: "subscription",
      line_items: [
        {
          price: tierConfig.priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId,
        tier,
      },
      subscription_data: {
        metadata: {
          userId,
          tier,
        },
      },
    });

    return session;
  }

  /**
   * Create one-time payment checkout session
   */
  static async createOneTimeCheckout(
    userId: string,
    amount: number,
    description: string,
    successUrl: string,
    cancelUrl: string
  ): Promise<Stripe.Checkout.Session> {
    const customer = await this.getOrCreateCustomer(userId);

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: description,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId,
        description,
      },
    });

    return session;
  }

  /**
   * Get user's active subscriptions
   */
  static async getUserSubscriptions(userId: string): Promise<Stripe.Subscription[]> {
    const user = await storage.getUserById(userId);
    
    if (!user?.stripeCustomerId) {
      return [];
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: user.stripeCustomerId,
      status: "active",
    });

    return subscriptions.data;
  }

  /**
   * Cancel subscription
   */
  static async cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    return await stripe.subscriptions.cancel(subscriptionId);
  }

  /**
   * Get subscription details
   */
  static async getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    return await stripe.subscriptions.retrieve(subscriptionId);
  }

  /**
   * Handle webhook events and record transactions
   */
  static async handleWebhookEvent(event: Stripe.Event): Promise<void> {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await this.handleCheckoutCompleted(session);
        break;
      }
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await this.handlePaymentSucceeded(paymentIntent);
        break;
      }
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await this.handlePaymentFailed(paymentIntent);
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await this.handleSubscriptionChange(subscription);
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await this.handleSubscriptionCancelled(subscription);
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }

  private static async handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<void> {
    const userId = session.metadata?.userId;
    if (!userId) return;

    const amount = session.amount_total || 0;
    const description = session.mode === "subscription" 
      ? `Subscription: ${session.metadata?.tier || "unknown"}`
      : session.metadata?.description || "One-time payment";

    // Record transaction
    await storage.createBillingTransaction({
      userId,
      stripeSessionId: session.id,
      amount: (amount / 100).toString(),
      currency: session.currency?.toUpperCase() || "USD",
      status: "completed",
      type: session.mode || "payment",
      description,
      metadata: {
        customerId: session.customer,
        subscriptionId: session.subscription,
      },
    });

    console.log(`Checkout completed for user ${userId}: ${description}`);
  }

  private static async handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    const userId = paymentIntent.metadata?.userId;
    if (!userId) return;

    // Record successful payment
    await storage.createBillingTransaction({
      userId,
      stripeSessionId: paymentIntent.id,
      amount: (paymentIntent.amount / 100).toString(),
      currency: paymentIntent.currency.toUpperCase(),
      status: "completed",
      type: "payment",
      description: paymentIntent.description || "Payment",
      metadata: {
        paymentIntentId: paymentIntent.id,
      },
    });

    console.log(`Payment succeeded for user ${userId}: $${paymentIntent.amount / 100}`);
  }

  private static async handlePaymentFailed(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    const userId = paymentIntent.metadata?.userId;
    if (!userId) return;

    // Record failed payment
    await storage.createBillingTransaction({
      userId,
      stripeSessionId: paymentIntent.id,
      amount: (paymentIntent.amount / 100).toString(),
      currency: paymentIntent.currency.toUpperCase(),
      status: "failed",
      type: "payment",
      description: `Failed: ${paymentIntent.description || "Payment"}`,
      metadata: {
        paymentIntentId: paymentIntent.id,
        error: paymentIntent.last_payment_error?.message,
      },
    });

    console.error(`Payment failed for user ${userId}: ${paymentIntent.last_payment_error?.message}`);
  }

  private static async handleSubscriptionChange(subscription: Stripe.Subscription): Promise<void> {
    const userId = subscription.metadata?.userId;
    if (!userId) return;

    console.log(`Subscription ${subscription.status} for user ${userId}`);
    // Additional logic to update user subscription status could go here
  }

  private static async handleSubscriptionCancelled(subscription: Stripe.Subscription): Promise<void> {
    const userId = subscription.metadata?.userId;
    if (!userId) return;

    // Record cancellation
    await storage.createBillingTransaction({
      userId,
      stripeSessionId: subscription.id,
      amount: "0",
      currency: "USD",
      status: "cancelled",
      type: "subscription",
      description: "Subscription cancelled",
      metadata: {
        subscriptionId: subscription.id,
        cancelledAt: new Date().toISOString(),
      },
    });

    console.log(`Subscription cancelled for user ${userId}`);
  }
}
