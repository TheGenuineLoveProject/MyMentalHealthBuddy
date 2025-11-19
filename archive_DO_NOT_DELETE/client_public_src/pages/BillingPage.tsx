import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { 
  CreditCard, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  DollarSign,
  ArrowUpCircle,
  Sparkles,
  Zap,
  Crown
} from "lucide-react";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";
import { StripeStatus } from "@/components/stripe/StripeStatus";
import type { SelectBillingTransaction } from "@shared/schema";
import { SkeletonCard, SkeletonTable } from "@/components/LoadingStates";

const CURRENT_USER_ID = "user-1";

interface SubscriptionTier {
  name: string;
  price: number;
  priceId: string | null;
  features: string[];
}

interface SubscriptionTiers {
  free: SubscriptionTier;
  premium: SubscriptionTier;
  professional: SubscriptionTier;
}

export default function BillingPage() {
  const [selectedTier, setSelectedTier] = useState<"premium" | "professional" | null>(null);

  const { data: tiers, isLoading: tiersLoading } = useQuery<SubscriptionTiers>({
    queryKey: ["/api/stripe/tiers"],
  });

  const { data: transactions, isLoading: transactionsLoading } = useQuery<SelectBillingTransaction[]>({
    queryKey: ["/api/transactions", CURRENT_USER_ID],
    retry: 1,
  });

  const { createSubscriptionCheckout, isLoading: checkoutLoading, error, clearError } = useStripeCheckout();

  const handleUpgrade = (tier: "premium" | "professional") => {
    setSelectedTier(tier);
    clearError();
    createSubscriptionCheckout({ tier });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-gray-600" />;
      default:
        return <Clock className="h-4 w-4 text-blue-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      completed: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
      pending: "bg-yellow-100 text-yellow-800",
      cancelled: "bg-gray-100 text-gray-800",
    };
    return (
      <span className={`px-2 py-1 text-xs rounded-full font-medium capitalize ${colors[status] || "bg-blue-100 text-blue-800"}`}>
        {status}
      </span>
    );
  };

  const getTierIcon = (tier: string) => {
    switch (tier.toLowerCase()) {
      case "free":
        return <Sparkles className="h-5 w-5" />;
      case "premium":
        return <Zap className="h-5 w-5" />;
      case "professional":
        return <Crown className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Billing & Subscriptions</h1>
        <p className="text-gray-600">
          Manage your subscription plan and view transaction history
        </p>
        <div className="mt-4">
          <StripeStatus />
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg" data-testid="alert-checkout-error">
          {error}
        </div>
      )}

      {/* Subscription Tiers */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Choose Your Plan</h2>
        {tiersLoading ? (
          <SkeletonCard count={3} />
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {tiers && Object.entries(tiers).map(([key, tier]) => {
              const tierKey = key as keyof SubscriptionTiers;
              const isPopular = tierKey === "professional";
              
              return (
                <div 
                  key={key} 
                  className={`relative bg-white border-2 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow ${
                    isPopular ? "border-blue-500" : "border-gray-200"
                  }`}
                  data-testid={`card-subscription-${key}`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 mb-4">
                    {getTierIcon(key)}
                    <h3 className="text-xl font-bold capitalize">{tier.name}</h3>
                  </div>
                  
                  <div className="text-3xl font-bold mb-6">
                    ${(tier.price / 100).toFixed(2)}
                    <span className="text-sm font-normal text-gray-500">/month</span>
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    {tier.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {tierKey === "free" ? (
                    <button 
                      className="w-full py-2 px-4 bg-gray-200 text-gray-600 rounded-md font-medium cursor-not-allowed"
                      disabled
                      data-testid="button-current-plan"
                    >
                      Current Plan
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpgrade(tierKey)}
                      disabled={checkoutLoading && selectedTier === tierKey}
                      className={`w-full py-2 px-4 rounded-md font-medium transition-colors flex items-center justify-center gap-2 ${
                        isPopular 
                          ? "bg-blue-500 hover:bg-blue-600 text-white" 
                          : "bg-gray-800 hover:bg-gray-900 text-white"
                      } ${checkoutLoading && selectedTier === tierKey ? "opacity-50 cursor-not-allowed" : ""}`}
                      data-testid={`button-upgrade-${key}`}
                    >
                      {checkoutLoading && selectedTier === tierKey ? (
                        "Processing..."
                      ) : (
                        <>
                          <ArrowUpCircle className="h-4 w-4" />
                          Upgrade to {tier.name}
                        </>
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <hr className="my-8 border-gray-300" />

      {/* Transaction History */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Transaction History</h2>
        {transactionsLoading ? (
          <SkeletonTable rows={5} cols={3} />
        ) : transactions && transactions.length > 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden" data-testid="card-transaction-history">
            <div className="divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  data-testid={`row-transaction-${transaction.id}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-gray-100 rounded-full">
                      {getStatusIcon(transaction.status)}
                    </div>
                    <div>
                      <p className="font-medium" data-testid={`text-description-${transaction.id}`}>
                        {transaction.description}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </p>
                        {getStatusBadge(transaction.status)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p 
                      className={`text-lg font-semibold ${
                        transaction.status === "completed" ? "text-green-600" : "text-gray-900"
                      }`}
                      data-testid={`text-amount-${transaction.id}`}
                    >
                      {transaction.status === "failed" ? "-" : ""}
                      {transaction.currency} ${parseFloat(transaction.amount).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {transaction.type}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg flex items-start gap-3">
            <DollarSign className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900">No transactions yet</p>
              <p className="text-blue-700 text-sm">Upgrade to a premium plan to get started!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
