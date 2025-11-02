import { loadStripe, Stripe } from "@stripe/stripe-js";

// Environment variable types
interface ImportMetaEnv {
  VITE_STRIPE_PUBLIC_KEY?: string;
  PROD?: boolean;
}

declare global {
  interface ImportMeta {
    env: ImportMetaEnv;
  }
}

// Get Stripe public key from environment
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY || "";

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
  
  if (import.meta.env.PROD && isTestKey) {
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

export const redirectToCheckout = async (checkoutUrl: string): Promise<void> => {
  if (!checkoutUrl) {
    throw new Error("No checkout URL provided");
  }
  
  // Modern Stripe.js: redirect directly to the checkout URL
  window.location.href = checkoutUrl;
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
