import Stripe from "stripe";
export declare const stripe: Stripe;
export declare const SUBSCRIPTION_TIERS: {
    readonly free: {
        readonly name: "Free";
        readonly price: 0;
        readonly priceId: null;
        readonly features: readonly ["5 AI therapy sessions per month", "Basic mood tracking", "Journal entries", "Crisis resources access"];
    };
    readonly premium: {
        readonly name: "Premium";
        readonly price: 2999;
        readonly priceId: string;
        readonly features: readonly ["Unlimited AI therapy sessions", "Advanced mood analytics", "Unlimited journal entries", "Data export (CSV/JSON)", "Priority support"];
    };
    readonly professional: {
        readonly name: "Professional";
        readonly price: 4999;
        readonly priceId: string;
        readonly features: readonly ["Everything in Premium", "Professional therapist consultations", "Custom therapy plans", "Advanced insights & reports", "24/7 priority support", "HIPAA-compliant data storage"];
    };
};
export type SubscriptionTier = keyof typeof SUBSCRIPTION_TIERS;
export declare class StripeService {
    /**
     * Create or retrieve Stripe customer for a user
     */
    static getOrCreateCustomer(userId: string): Promise<Stripe.Customer>;
    /**
     * Create subscription checkout session
     */
    static createSubscriptionCheckout(userId: string, tier: SubscriptionTier, successUrl: string, cancelUrl: string): Promise<Stripe.Checkout.Session>;
    /**
     * Create one-time payment checkout session
     */
    static createOneTimeCheckout(userId: string, amount: number, description: string, successUrl: string, cancelUrl: string): Promise<Stripe.Checkout.Session>;
    /**
     * Get user's active subscriptions
     */
    static getUserSubscriptions(userId: string): Promise<Stripe.Subscription[]>;
    /**
     * Cancel subscription
     */
    static cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription>;
    /**
     * Get subscription details
     */
    static getSubscription(subscriptionId: string): Promise<Stripe.Subscription>;
    /**
     * Handle webhook events and record transactions
     */
    static handleWebhookEvent(event: Stripe.Event): Promise<void>;
    private static handleCheckoutCompleted;
    private static handlePaymentSucceeded;
    private static handlePaymentFailed;
    private static handleSubscriptionChange;
    private static handleSubscriptionCancelled;
}
