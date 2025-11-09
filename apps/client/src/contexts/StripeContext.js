import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { getStripe, STRIPE_CONFIG, validateStripeKey } from "@/lib/stripe";
const StripeContext = createContext(undefined);
export function StripeProvider({ children }) {
    const [stripe, setStripe] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const initStripe = async () => {
            try {
                if (!validateStripeKey()) {
                    throw new Error("Invalid Stripe configuration");
                }
                const stripeInstance = await getStripe();
                setStripe(stripeInstance);
                setError(null);
            }
            catch (err) {
                console.error("Failed to initialize Stripe:", err);
                setError(err instanceof Error ? err : new Error("Failed to load Stripe"));
            }
            finally {
                setIsLoading(false);
            }
        };
        initStripe();
    }, []);
    const value = {
        stripe,
        isLoading,
        error,
        publicKey: STRIPE_CONFIG.publicKey,
        isTestMode: STRIPE_CONFIG.isTestMode,
    };
    return (_jsx(StripeContext.Provider, { value: value, children: children }));
}
export function useStripe() {
    const context = useContext(StripeContext);
    if (context === undefined) {
        throw new Error("useStripe must be used within a StripeProvider");
    }
    return context;
}
export function StripeElementsWrapper({ children, }) {
    const stripePromise = getStripe();
    return (_jsx(Elements, { stripe: stripePromise, options: {
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
        }, children: children }));
}
