import { loadStripe, Stripe } from "@stripe/stripe-js";

// Get Stripe public key from environment
const stripePublicKey = (import.meta.env as any).VITE_STRIPE_PUBLIC_KEY || "";

// Load Stripe singleton
export const stripePromise = loadStripe(stripePublicKey);

export const getStripe = async (): Promise<Stripe | null> => {
  return stripePromise;
};

export const validateStripeKey = (): boolean => {
  const isTestKey = stripePublicKey.startsWith("pk_test_");
  const isLiveKey = stripePublicKey.startsWith("pk_live_");
  
  if (!isTestKey && !isLiveKey) {
    console.error("Invalid Stripe public key format");
    return false;
  }
  
  if ((import.meta.env as any).PROD && isTestKey) {
    console.warn("Using Stripe test key in production environment");
  }
  
  return true;
};

export const STRIPE_CONFIG = {
  publicKey: stripePublicKey,
  isTestMode: stripePublicKey.startsWith("pk_test_"),
  isLiveMode: stripePublicKey.startsWith("pk_live_"),
} as const;

export type StripeCheckoutMode = "subscription" | "payment";

export interface CreateCheckoutSessionParams {
  priceId?: string;
  tier?: "premium" | "professional";
  mode: StripeCheckoutMode;
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
  metadata?: Record<string, string>;
}

export interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
}

export const redirectToCheckout = async (sessionId: string): Promise<void> => {
  const stripe = await getStripe();
  if (!stripe) {
    throw new Error("Failed to load Stripe");
  }

  const { error } = await stripe.redirectToCheckout({ sessionId });
  
  if (error) {
    throw new Error(error.message || "Failed to redirect to checkout");
  }
};

export const formatPrice = (amountInCents: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amountInCents / 100);
};

export const getStripeEnvironmentInfo = () => {
  return {
    environment: STRIPE_CONFIG.isTestMode ? "test" : "live",
    publicKey: STRIPE_CONFIG.publicKey.substring(0, 20) + "...",
    isConfigured: !!stripePublicKey,
    isValid: validateStripeKey(),
  };
};
