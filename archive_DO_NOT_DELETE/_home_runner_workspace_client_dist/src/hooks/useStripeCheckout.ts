import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

const CURRENT_USER_ID = "user-1";

interface CreateCheckoutParams {
  tier: "premium" | "professional";
  mode?: "subscription" | "payment";
  successUrl?: string;
  cancelUrl?: string;
}

interface CheckoutSession {
  sessionId: string;
  url: string;
}

export function useStripeCheckout() {
  const [error, setError] = useState<string>("");

  const createSubscriptionCheckout = useMutation({
    mutationFn: async ({
      tier,
      successUrl,
      cancelUrl,
    }: CreateCheckoutParams): Promise<CheckoutSession> => {
      const baseUrl = window.location.origin;
      
      return apiRequest("/api/stripe/create-subscription-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": CURRENT_USER_ID,
        },
        body: JSON.stringify({
          tier,
          successUrl: successUrl || `${baseUrl}/billing?success=true`,
          cancelUrl: cancelUrl || `${baseUrl}/billing?canceled=true`,
        }),
      });
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (err: any) => {
      const message = err.message || "Unable to create checkout session";
      setError(message);
      console.error("Checkout error:", err);
    },
  });

  const createOneTimeCheckout = useMutation({
    mutationFn: async ({
      successUrl,
      cancelUrl,
    }: Omit<CreateCheckoutParams, "tier">): Promise<CheckoutSession> => {
      const baseUrl = window.location.origin;
      
      return apiRequest("/api/stripe/create-one-time-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": CURRENT_USER_ID,
        },
        body: JSON.stringify({
          amount: 9900,
          description: "Mental Health Support Session",
          successUrl: successUrl || `${baseUrl}/billing?success=true`,
          cancelUrl: cancelUrl || `${baseUrl}/billing?canceled=true`,
        }),
      });
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (err: any) => {
      const message = err.message || "Unable to create checkout session";
      setError(message);
      console.error("Checkout error:", err);
    },
  });

  const redirectToCheckout = (url: string) => {
    window.location.href = url;
  };

  const clearError = () => setError("");

  return {
    createSubscriptionCheckout: createSubscriptionCheckout.mutate,
    createOneTimeCheckout: createOneTimeCheckout.mutate,
    redirectToCheckout,
    isLoading:
      createSubscriptionCheckout.isPending || createOneTimeCheckout.isPending,
    error,
    clearError,
  };
}
