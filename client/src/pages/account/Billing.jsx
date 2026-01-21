import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { CreditCard, ArrowLeft, CheckCircle, Crown, Zap, Star, ExternalLink, RefreshCw } from "lucide-react";
import SEO from "../../components/SEO";
import { useAuth } from "../../context/AuthContext.jsx";

const PLAN_DETAILS = {
  free: { name: "Free", icon: Star, color: "sage" },
  plus: { name: "Plus", icon: Zap, color: "gold" },
  pro: { name: "Pro", icon: Crown, color: "teal" },
};

export default function Billing() {
  const { user } = useAuth();

  const { data: billing, isLoading, error, refetch } = useQuery({
    queryKey: ["/api/billing/status"],
    enabled: !!user,
  });

  const currentPlan = PLAN_DETAILS[billing?.plan || "free"];
  const PlanIcon = currentPlan.icon;

  const handleManageSubscription = async () => {
    try {
      const res = await fetch("/api/billing/portal", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error("Portal error:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen hero-gradient p-6">
        <SEO title="Billing - Loading" description="Loading billing information" />
        <div className="max-w-2xl mx-auto">
          <div className="space-y-6">
            <div className="h-8 bg-sage-100 rounded-xl w-1/4 animate-pulse"></div>
            <div className="h-48 bg-white/50 rounded-2xl animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen hero-gradient p-6 flex items-center justify-center">
        <SEO title="Billing - Error" description="Unable to load billing" />
        <div className="card-elevated text-center p-8 max-w-md">
          <div className="icon-container icon-lg icon-soft-blush mx-auto mb-4">
            <CreditCard className="w-8 h-8" />
          </div>
          <h2 className="text-heading-md text-teal mb-2">Unable to load billing</h2>
          <p className="text-body-sm text-sage-600 mb-6">{error.message}</p>
          <button onClick={() => refetch()} className="btn-premium flex items-center gap-2 mx-auto" data-testid="button-retry">
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Billing - The Genuine Love Project"
        description="Manage your subscription and billing information."
      />
      <div className="min-h-screen hero-gradient">
        <div className="decorative-orb decorative-orb-gold w-[400px] h-[400px] -top-20 -right-20 absolute" aria-hidden="true" />
        <div className="decorative-orb decorative-orb-sage w-[300px] h-[300px] bottom-20 -left-20 absolute" aria-hidden="true" />
        
        <div className="relative z-10 max-w-2xl mx-auto px-6 py-8">
          <Link 
            href="/settings" 
            className="inline-flex items-center gap-2 text-sm text-sage-600 hover:text-teal transition-colors mb-6 font-medium"
            data-testid="link-back-settings"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Settings
          </Link>

          <div className="mb-8">
            <h1 className="text-heading-lg text-teal font-display mb-2" data-testid="text-billing-title">
              Billing & Subscription
            </h1>
            <p className="text-body-md text-sage-600">
              Manage your plan and payment details
            </p>
          </div>

          <div className="glass-premium rounded-2xl p-8 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={`icon-container icon-lg icon-soft-${currentPlan.color}`}>
                  <PlanIcon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-heading-md text-teal font-display">
                    {currentPlan.name} Plan
                  </h2>
                  <p className="text-body-sm text-sage-500">
                    {billing?.plan === "free" ? "Upgrade to unlock more features" : "Active subscription"}
                  </p>
                </div>
              </div>
              {billing?.plan !== "free" && (
                <div className="flex items-center gap-2 text-sm text-sage-500">
                  <CheckCircle className="w-4 h-4 text-sage-400" />
                  Active
                </div>
              )}
            </div>

            {billing?.plan === "free" ? (
              <Link 
                href="/pricing" 
                className="btn-premium w-full flex items-center justify-center gap-2"
                data-testid="link-upgrade"
              >
                <Zap className="w-4 h-4" />
                Upgrade Your Plan
              </Link>
            ) : (
              <button
                onClick={handleManageSubscription}
                className="btn-secondary-premium w-full flex items-center justify-center gap-2"
                data-testid="button-manage-subscription"
              >
                <ExternalLink className="w-4 h-4" />
                Manage Subscription
              </button>
            )}
          </div>

          <div className="card card-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-container icon-md icon-soft-teal">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="text-heading-sm text-teal">Payment Method</h3>
            </div>
            {billing?.paymentMethod ? (
              <div className="flex items-center justify-between">
                <span className="text-body-md text-sage-700">
                  •••• •••• •••• {billing.paymentMethod.last4}
                </span>
                <span className="text-body-sm text-sage-500 uppercase">
                  {billing.paymentMethod.brand}
                </span>
              </div>
            ) : (
              <p className="text-body-sm text-sage-500">
                No payment method on file
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
