import { createContext, useContext, useEffect, useState } from "react";
import { Stripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { getStripe, STRIPE_CONFIG, validateStripeKey } from "@/lib/stripe";

interface StripeContextValue {
  stripe: Stripe | null;
  isLoading: boolean;
  error: Error | null;
  publicKey: string;
  isTestMode: boolean;
}

const StripeContext = createContext<StripeContextValue | undefined>(undefined);

export function StripeProvider({ children }: { children: React.ReactNode }) {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initStripe = async () => {
      try {
        if (!validateStripeKey()) {
          throw new Error("Invalid Stripe configuration");
        }

        const stripeInstance = await getStripe();
        setStripe(stripeInstance);
        setError(null);
      } catch (err) {
        console.error("Failed to initialize Stripe:", err);
        setError(
          err instanceof Error ? err : new Error("Failed to load Stripe")
        );
      } finally {
        setIsLoading(false);
      }
    };

    initStripe();
  }, []);

  const value: StripeContextValue = {
    stripe,
    isLoading,
    error,
    publicKey: STRIPE_CONFIG.publicKey,
    isTestMode: STRIPE_CONFIG.isTestMode,
  };

  return (
    <StripeContext.Provider value={value}>
      {children}
    </StripeContext.Provider>
  );
}

export function useStripe() {
  const context = useContext(StripeContext);
  if (context === undefined) {
    throw new Error("useStripe must be used within a StripeProvider");
  }
  return context;
}

export function StripeElementsWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const stripePromise = getStripe();

  return (
    <Elements
      stripe={stripePromise}
      options={{
        appearance: {
          theme: "stripe",
          variables: {
            colorPrimary: "#2563eb",
            colorBackground: "#ffffff",
            colorText: "#1f2937",
            colorDanger: "#ef4444",
            fontFamily: "system-ui, sans-serif",
            borderRadius: "0.5rem",
          },
        },
        locale: "en",
      }}
    >
      {children}
    </Elements>
  );
}
