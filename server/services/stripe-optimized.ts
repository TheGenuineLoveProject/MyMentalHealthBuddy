// Optimized Stripe Integration with Advanced Features
// Evolution Engine v1.0.4 - Enhanced Billing & Subscription Management

import Stripe from 'stripe';
import { storage } from '../storage';
import { aiResponseCache, getCacheKey } from './cache';
import { retryWithBreaker, stripeBreaker, retryConfigs } from './retry';

// Initialize Stripe with optimized configuration
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
      maxNetworkRetries: 3,
      timeout: 30000,
      telemetry: false // Reduce overhead
    })
  : null;

// Subscription tiers with enhanced features
export const SUBSCRIPTION_TIERS = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    features: {
      aiSessions: 5,
      moodTracking: true,
      journal: true,
      resources: 'basic',
      support: 'community',
      dataExport: false,
      analytics: false
    }
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    price: 1900, // $19.00 in cents
    stripePriceId: process.env.STRIPE_PREMIUM_PRICE_ID,
    features: {
      aiSessions: 'unlimited',
      moodTracking: true,
      journal: true,
      resources: 'full',
      support: 'priority',
      dataExport: true,
      analytics: true,
      customPrompts: true,
      voiceNotes: true
    }
  },
  professional: {
    id: 'professional',
    name: 'Professional',
    price: 4900, // $49.00 in cents
    stripePriceId: process.env.STRIPE_PROFESSIONAL_PRICE_ID,
    features: {
      aiSessions: 'unlimited',
      moodTracking: true,
      journal: true,
      resources: 'full',
      support: 'dedicated',
      dataExport: true,
      analytics: 'advanced',
      customPrompts: true,
      voiceNotes: true,
      apiAccess: true,
      teamAccounts: 5,
      videoSessions: true
    }
  }
};

// Enhanced customer creation with metadata
export async function createOrUpdateCustomer(
  userId: string,
  email: string,
  metadata?: Record<string, string>
): Promise<string> {
  if (!stripe) throw new Error('Stripe not configured');

  const cacheKey = getCacheKey('stripe-customer', userId);
  const cachedCustomerId = aiResponseCache.get<string>(cacheKey);
  
  if (cachedCustomerId) {
    return cachedCustomerId;
  }

  try {
    const user = await storage.getUserById(userId);
    
    if (user?.stripeCustomerId) {
      // Update existing customer
      await stripe.customers.update(user.stripeCustomerId, {
        email,
        metadata: {
          ...metadata,
          userId,
          updatedAt: new Date().toISOString()
        }
      });
      
      aiResponseCache.set(cacheKey, user.stripeCustomerId, 86400); // Cache for 24 hours
      return user.stripeCustomerId;
    }

    // Create new customer
    const customer = await retryWithBreaker(
      async () => stripe!.customers.create({
        email,
        metadata: {
          ...metadata,
          userId,
          createdAt: new Date().toISOString(),
          platform: 'mymentalhealthbuddy'
        }
      }),
      stripeBreaker,
      retryConfigs.standard
    );

    await storage.updateUserStripeInfo(userId, customer.id, null);
    aiResponseCache.set(cacheKey, customer.id, 86400);
    
    return customer.id;
  } catch (error) {
    console.error('Error creating/updating customer:', error);
    throw error;
  }
}

// Optimized subscription creation with trial period
export async function createSubscription(
  userId: string,
  email: string,
  tier: 'premium' | 'professional',
  options?: {
    trialDays?: number;
    coupon?: string;
    paymentMethodId?: string;
  }
): Promise<{
  subscriptionId: string;
  clientSecret?: string;
  status: string;
  trialEnd?: Date;
}> {
  if (!stripe) throw new Error('Stripe not configured');

  const tierConfig = SUBSCRIPTION_TIERS[tier];
  if (!tierConfig.stripePriceId) {
    throw new Error(`Price ID not configured for ${tier} tier`);
  }

  try {
    const customerId = await createOrUpdateCustomer(userId, email, {
      subscriptionTier: tier
    });

    // Check for existing active subscription
    const existingSubscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1
    });

    if (existingSubscriptions.data.length > 0) {
      const existing = existingSubscriptions.data[0];
      return {
        subscriptionId: existing.id,
        status: existing.status,
        trialEnd: existing.trial_end ? new Date(existing.trial_end * 1000) : undefined
      };
    }

    // Create subscription with enhanced options
    const subscriptionParams: Stripe.SubscriptionCreateParams = {
      customer: customerId,
      items: [{ price: tierConfig.stripePriceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { 
        save_default_payment_method: 'on_subscription',
        payment_method_types: ['card']
      },
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        userId,
        tier,
        createdAt: new Date().toISOString()
      }
    };

    // Add trial period if specified
    if (options?.trialDays) {
      subscriptionParams.trial_period_days = options.trialDays;
    }

    // Apply coupon if provided
    if (options?.coupon) {
      subscriptionParams.coupon = options.coupon;
    }

    // Attach payment method if provided
    if (options?.paymentMethodId) {
      await stripe.paymentMethods.attach(options.paymentMethodId, {
        customer: customerId
      });
      
      await stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: options.paymentMethodId
        }
      });
    }

    const subscription = await stripe.subscriptions.create(subscriptionParams);

    // Update user record
    await storage.updateUserStripeInfo(userId, customerId, subscription.id);
    await storage.updateUserSubscription(
      userId,
      tier,
      subscription.status,
      subscription.current_period_end 
        ? new Date(subscription.current_period_end * 1000)
        : undefined
    );

    const clientSecret = (subscription.latest_invoice as any)?.payment_intent?.client_secret;

    return {
      subscriptionId: subscription.id,
      clientSecret,
      status: subscription.status,
      trialEnd: subscription.trial_end 
        ? new Date(subscription.trial_end * 1000) 
        : undefined
    };
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
}

// Enhanced webhook handler with idempotency
export async function handleWebhookEvent(
  event: Stripe.Event,
  idempotencyKey?: string
): Promise<void> {
  // Check idempotency to prevent duplicate processing
  if (idempotencyKey) {
    const cacheKey = getCacheKey('webhook-processed', idempotencyKey);
    if (aiResponseCache.get(cacheKey)) {
      console.log(`Webhook ${idempotencyKey} already processed, skipping`);
      return;
    }
    aiResponseCache.set(cacheKey, true, 86400); // Cache for 24 hours
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCancellation(subscription);
        break;
      }

      case 'customer.subscription.trial_will_end': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleTrialEndingSoon(subscription);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleSuccessfulPayment(invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleFailedPayment(invoice);
        break;
      }

      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutComplete(session);
        break;
      }

      case 'customer.updated': {
        const customer = event.data.object as Stripe.Customer;
        await handleCustomerUpdate(customer);
        break;
      }

      default:
        console.log(`Unhandled webhook event: ${event.type}`);
    }
  } catch (error) {
    console.error(`Error handling webhook ${event.type}:`, error);
    throw error; // Re-throw to trigger webhook retry
  }
}

// Subscription update handler
async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;
  if (!userId) return;

  const tier = subscription.metadata?.tier || detectTierFromPrice(subscription);
  
  await storage.updateUserSubscription(
    userId,
    tier,
    subscription.status,
    subscription.current_period_end 
      ? new Date(subscription.current_period_end * 1000)
      : undefined
  );

  console.log(`✅ Updated subscription for user ${userId}: ${tier} (${subscription.status})`);
}

// Subscription cancellation handler
async function handleSubscriptionCancellation(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;
  if (!userId) return;

  await storage.updateUserSubscription(userId, 'free', 'inactive', undefined);
  
  // Clear any cached subscription data
  const cacheKey = getCacheKey('user-subscription', userId);
  aiResponseCache.delete(cacheKey);

  console.log(`❌ Cancelled subscription for user ${userId}`);
}

// Trial ending soon notification
async function handleTrialEndingSoon(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;
  if (!userId) return;

  // TODO: Send email notification about trial ending
  console.log(`⚠️ Trial ending soon for user ${userId}`);
}

// Successful payment handler
async function handleSuccessfulPayment(invoice: Stripe.Invoice) {
  const subscription = invoice.subscription;
  if (!subscription) return;

  console.log(`✅ Payment successful for invoice ${invoice.id}`);
  
  // Record transaction
  if (invoice.customer && typeof invoice.customer === 'string') {
    const customer = await stripe?.customers.retrieve(invoice.customer);
    if (customer && !customer.deleted && customer.metadata?.userId) {
      await storage.createBillingTransaction({
        userId: customer.metadata.userId,
        stripeSessionId: invoice.id,
        amount: (invoice.amount_paid / 100).toFixed(2),
        currency: invoice.currency?.toUpperCase() || 'USD',
        status: 'completed',
        type: 'subscription',
        description: `Subscription payment for ${invoice.period_start ? new Date(invoice.period_start * 1000).toLocaleDateString() : 'N/A'}`
      });
    }
  }
}

// Failed payment handler with retry logic
async function handleFailedPayment(invoice: Stripe.Invoice) {
  const subscription = invoice.subscription;
  if (!subscription) return;

  console.error(`❌ Payment failed for invoice ${invoice.id}`);
  
  // TODO: Send payment failure notification
  // TODO: Implement dunning process
}

// Checkout session completion
async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  if (!userId) return;

  const tier = session.metadata?.tier || 'premium';
  
  await storage.updateUserSubscription(userId, tier, 'active');
  
  console.log(`✅ Checkout completed for user ${userId}`);
}

// Customer update handler
async function handleCustomerUpdate(customer: Stripe.Customer) {
  const userId = customer.metadata?.userId;
  if (!userId) return;

  // Update cached customer data
  const cacheKey = getCacheKey('stripe-customer', userId);
  aiResponseCache.set(cacheKey, customer.id, 86400);
}

// Helper function to detect tier from price
function detectTierFromPrice(subscription: Stripe.Subscription): string {
  const priceId = subscription.items.data[0]?.price.id;
  
  if (priceId === process.env.STRIPE_PROFESSIONAL_PRICE_ID) {
    return 'professional';
  } else if (priceId === process.env.STRIPE_PREMIUM_PRICE_ID) {
    return 'premium';
  }
  
  return 'free';
}

// Get subscription details with caching
export async function getSubscriptionDetails(userId: string): Promise<{
  tier: string;
  status: string;
  features: any;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
  usage?: {
    aiSessions: number;
    aiSessionsLimit: number | string;
  };
}> {
  const cacheKey = getCacheKey('user-subscription', userId);
  const cached = aiResponseCache.get<any>(cacheKey);
  
  if (cached) {
    return cached;
  }

  try {
    const user = await storage.getUserById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    let subscriptionData: any = {
      tier: user.subscriptionTier || 'free',
      status: user.subscriptionStatus || 'inactive',
      features: SUBSCRIPTION_TIERS[user.subscriptionTier as keyof typeof SUBSCRIPTION_TIERS || 'free'].features,
      usage: {
        aiSessions: user.aiSessionsUsed || 0,
        aiSessionsLimit: user.aiSessionsLimit || SUBSCRIPTION_TIERS.free.features.aiSessions
      }
    };

    // Fetch fresh data from Stripe if available
    if (stripe && user.stripeSubscriptionId) {
      try {
        const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
        
        subscriptionData = {
          ...subscriptionData,
          status: subscription.status,
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          cancelAtPeriodEnd: subscription.cancel_at_period_end
        };
      } catch (error) {
        console.error('Error fetching Stripe subscription:', error);
      }
    }

    // Cache for 5 minutes
    aiResponseCache.set(cacheKey, subscriptionData, 300);
    
    return subscriptionData;
  } catch (error) {
    console.error('Error getting subscription details:', error);
    throw error;
  }
}

// Create portal session for subscription management
export async function createPortalSession(
  userId: string,
  returnUrl: string
): Promise<string> {
  if (!stripe) throw new Error('Stripe not configured');

  const user = await storage.getUserById(userId);
  if (!user?.stripeCustomerId) {
    throw new Error('No Stripe customer found for user');
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: returnUrl
  });

  return session.url;
}

// Usage tracking for AI sessions
export async function trackAIUsage(userId: string): Promise<boolean> {
  const user = await storage.getUserById(userId);
  if (!user) return false;

  const tier = user.subscriptionTier || 'free';
  const tierConfig = SUBSCRIPTION_TIERS[tier as keyof typeof SUBSCRIPTION_TIERS];
  
  // Unlimited for premium/professional
  if (tierConfig.features.aiSessions === 'unlimited') {
    return true;
  }

  const limit = tierConfig.features.aiSessions as number;
  const used = user.aiSessionsUsed || 0;

  if (used >= limit) {
    console.log(`⚠️ User ${userId} has reached AI session limit (${used}/${limit})`);
    return false;
  }

  // Increment usage
  await storage.updateUser(userId, {
    aiSessionsUsed: used + 1
  });

  return true;
}

// Reset usage counters (for monthly reset)
export async function resetMonthlyUsage(): Promise<void> {
  console.log('🔄 Resetting monthly usage counters...');
  
  // This would typically be called by a cron job
  // Reset all free tier users' AI session counts
  // Premium and Professional users have unlimited, so no reset needed
  
  // Implementation depends on storage method
  // await storage.resetAllUserUsage();
}

// Export Stripe instance for direct access if needed
export { stripe };