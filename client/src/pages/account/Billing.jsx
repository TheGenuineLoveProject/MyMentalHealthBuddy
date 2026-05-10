import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { CreditCard, ArrowLeft, Check, Crown, Zap, Star, Download, Calendar, Shield, Sparkles, Loader2, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/Button";
import { useSEO } from "@/hooks/useSEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/context/AuthContext";
import { getProFeatures, getFreeFeatures } from "@/config/featureAccess";

const PRO_PLAN = {
  id: "pro",
  name: "Pro",
  monthly: { price: "$12.99", period: "/month", savings: null },
  yearly: { price: "$109", period: "/year", savings: "Save $47/year" },
  icon: Zap,
  features: [
    "Unlimited AI chat sessions",
    "All wellness tools unlocked",
    "Advanced insights & analytics",
    "Healing journey access",
    "Priority support",
  ],
};

const FREE_PLAN = {
  id: "free",
  name: "Free",
  price: "$0",
  period: "forever",
  icon: Star,
  features: [
    "Basic mood tracking",
    "Journal entries",
    "Daily reflection",
    "Community access",
  ],
};

const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  } catch {
    return "N/A";
  }
};

const formatAmount = (amount) => {
  if (!amount && amount !== 0) return "$0.00";
  return `$${Number(amount).toFixed(2)}`;
};

export default function Billing() {
  useSEO({
    title: "Billing & Subscription",
    description: "Manage your subscription plan and view your billing history.",
    noIndex: true
  });
  
  const { toast } = useToast();
  const { subscriptionStatus, isPro, isLoading: authLoading } = useAuth();
  const [location] = useLocation();
  const [upgrading, setUpgrading] = useState(false);
  const [billingInterval, setBillingInterval] = useState("monthly");

  const { data: subscriptionData, isLoading: subLoading } = useQuery({
    queryKey: ["/api/billing/subscription-status"],
  });

  const { data: invoicesData, isLoading: invoicesLoading } = useQuery({
    queryKey: ["/api/billing/invoices"],
  });

  const currentPlan = subscriptionStatus || subscriptionData?.plan || "free";
  const isActive = isPro || subscriptionData?.status === "active" || subscriptionData?.status === "trialing";
  const invoices = invoicesData?.invoices || [];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("canceled") === "true") {
      toast({
        title: "Checkout canceled",
        description: "No worries — you can upgrade whenever you're ready.",
      });
      window.history.replaceState({}, "", "/account/billing");
    }
  }, []);

  const checkoutMutation = useMutation({
    mutationFn: (interval) => apiRequest("POST", "/api/billing/checkout", { plan: "pro", interval: interval || billingInterval }),
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error) => {
      toast({
        title: "Unable to start checkout",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
      setUpgrading(false);
    },
  });

  const portalMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/billing/portal"),
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error) => {
      toast({
        title: "Unable to open billing portal",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleUpgrade = (interval) => {
    setUpgrading(true);
    checkoutMutation.mutate(interval || billingInterval);
  };

  const handleOpenPortal = () => {
    portalMutation.mutate();
  };

  const handleDownloadInvoice = (invoiceUrl) => {
    if (invoiceUrl) {
      window.open(invoiceUrl, "_blank");
    } else {
      handleOpenPortal();
    }
  };

  return (
  <WellnessPageShell
    title="Billing"
    subtitle="Your subscription and payment details."
    benefits={pickBenefits(["agency","calm","clarity","selfRespect","meaning"], 5)}
    clarity={{
      what: "Manage your subscription plan.",
      why: "To keep your wellness tools accessible.",
      who: "For adults (18+) using this platform.",
      when: "Anytime you want to review or change your plan.",
      where: "Right here — secure payments handled by Stripe.",
      how: "Choose your plan, and Stripe handles the rest safely."
    }}
    examples={[]}
  >

    <div className="min-h-screen hero-gradient">
      <div className="content-wrapper py-8">
        <div className="max-w-3xl mx-auto">
          <header className="mb-8">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-body-sm text-[var(--sage-500)] hover:text-[var(--teal-600)] mb-4 transition" data-testid="link-back">
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Link>
            <div className="flex items-center gap-3">
              <div className="icon-container icon-xl icon-gradient-gold">
                <CreditCard className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-display-lg text-teal" data-testid="text-page-title">Billing & Subscription</h1>
                <p className="text-lead">Manage your plan and payment details</p>
              </div>
            </div>
          </header>

          <div className="space-y-8">

            {subLoading ? (
              <div className="card-bordered flex items-center justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-[var(--sage-500)]" />
              </div>
            ) : currentPlan !== "free" && isActive ? (
              <section className="card-bordered bg-gradient-to-r from-[var(--sage-50)] to-[var(--gold-50)]" data-testid="section-current-plan">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="icon-container icon-xl icon-soft-gold">
                      <Crown className="h-7 w-7" />
                    </div>
                    <div>
                      <h2 className="text-heading-lg text-teal capitalize">{currentPlan} Plan</h2>
                      <p className="text-body-sm text-[var(--sage-600)]">
                        {subscriptionData?.cancelAtPeriodEnd
                          ? `Cancels on ${formatDate(subscriptionData?.currentPeriodEnd)}`
                          : `Renews on ${formatDate(subscriptionData?.currentPeriodEnd)}`
                        }
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleOpenPortal}
                    disabled={portalMutation.isPending}
                    data-testid="button-manage-subscription"
                  >
                    {portalMutation.isPending ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Loading...</>
                    ) : (
                      <><ExternalLink className="h-4 w-4 mr-2" />Manage Subscription</>
                    )}
                  </Button>
                </div>
              </section>
            ) : (
              <section className="card-bordered" data-testid="section-current-plan">
                <div className="flex items-center gap-4 mb-2">
                  <div className="icon-container icon-xl icon-soft-sage">
                    <Star className="h-7 w-7" />
                  </div>
                  <div>
                    <h2 className="text-heading-lg text-teal">Free Plan</h2>
                    <p className="text-body-sm text-[var(--sage-600)]">Core tools are always free — no expiration, no pressure to upgrade, no features taken away</p>
                  </div>
                </div>
              </section>
            )}

            <section data-testid="section-plans">
              <h2 className="text-heading-md text-teal mb-4">
                {currentPlan === "free" ? "Compare Plans" : "Your Plan"}
              </h2>

              {currentPlan === "free" && (
                <div className="flex items-center justify-center gap-1 mb-6 p-1 rounded-full bg-[var(--sage-100)] w-fit mx-auto" data-testid="toggle-billing-interval">
                  <button
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${billingInterval === "monthly" ? "bg-white shadow-sm text-[var(--teal-700)]" : "text-[var(--sage-600)] hover:text-[var(--sage-800)]"}`}
                    onClick={() => setBillingInterval("monthly")}
                    data-testid="button-interval-monthly"
                  >
                    Monthly
                  </button>
                  <button
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${billingInterval === "yearly" ? "bg-white shadow-sm text-[var(--teal-700)]" : "text-[var(--sage-600)] hover:text-[var(--sage-800)]"}`}
                    onClick={() => setBillingInterval("yearly")}
                    data-testid="button-interval-yearly"
                  >
                    Annual
                    <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-gradient-to-r from-[var(--gold-500)] to-[var(--gold-400)] text-white leading-none">
                      BEST VALUE
                    </span>
                  </button>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">

                <div className={`card-bordered relative transition-all ${currentPlan === "free" ? 'ring-2 ring-[var(--sage-400)]' : ''}`} data-testid="plan-free">
                  <div className="text-center mb-4 pt-2">
                    <div className={`icon-container icon-lg mx-auto mb-3 ${currentPlan === "free" ? 'icon-soft-teal' : 'icon-soft-sage'}`}>
                      <Star className="h-6 w-6" />
                    </div>
                    <h3 className="text-heading-sm text-teal">{FREE_PLAN.name}</h3>
                    <p className="text-display-md text-teal">{FREE_PLAN.price}</p>
                    <p className="text-caption">{FREE_PLAN.period}</p>
                  </div>
                  <ul className="space-y-2 mb-4">
                    {FREE_PLAN.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-body-sm">
                        <Check className="h-4 w-4 text-[var(--sage-500)]" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  {currentPlan === "free" && (
                    <div className="text-center">
                      <span className="text-body-sm text-[var(--sage-600)] font-medium">Current Plan</span>
                    </div>
                  )}
                </div>

                <div className={`card-bordered relative transition-all ${currentPlan !== "free" && isActive ? 'ring-2 ring-[var(--teal-500)] bg-[var(--sage-50)]' : 'hover:border-[var(--teal-400)]'}`} data-testid="plan-pro">
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-[var(--gold-500)] to-[var(--gold-400)] text-white text-caption font-medium">
                    {currentPlan !== "free" && isActive ? "Your Plan" : "Recommended"}
                  </span>
                  <div className="text-center mb-4 pt-4">
                    <div className="icon-container icon-lg mx-auto mb-3 icon-soft-gold">
                      <Zap className="h-6 w-6" />
                    </div>
                    <h3 className="text-heading-sm text-teal">{PRO_PLAN.name}</h3>
                    <p className="text-display-md text-teal">
                      {PRO_PLAN[billingInterval].price}
                    </p>
                    <p className="text-caption">
                      {PRO_PLAN[billingInterval].period}
                      {PRO_PLAN[billingInterval].savings && (
                        <span className="ml-2 text-[var(--gold-600)] font-medium">{PRO_PLAN[billingInterval].savings}</span>
                      )}
                    </p>
                    {billingInterval === "yearly" && (
                      <p className="text-caption text-[var(--sage-500)] mt-1">
                        That's just $8.25/month
                      </p>
                    )}
                  </div>
                  <ul className="space-y-2 mb-4">
                    {PRO_PLAN.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-body-sm">
                        <Check className="h-4 w-4 text-[var(--gold-500)]" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  {currentPlan === "free" ? (
                    <Button 
                      className="w-full btn-premium"
                      disabled={upgrading}
                      onClick={() => handleUpgrade(billingInterval)}
                      data-testid="button-upgrade-pro"
                    >
                      {upgrading ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Redirecting to checkout...</>
                      ) : (
                        <><Sparkles className="w-4 h-4 mr-2" />Subscribe to Pro — {PRO_PLAN[billingInterval].price}{PRO_PLAN[billingInterval].period}</>
                      )}
                    </Button>
                  ) : isActive ? (
                    <Button 
                      className="w-full"
                      variant="outline"
                      onClick={handleOpenPortal}
                      disabled={portalMutation.isPending}
                      data-testid="button-manage-subscription-plan"
                    >
                      {portalMutation.isPending ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Loading...</>
                      ) : (
                        <><ExternalLink className="w-4 h-4 mr-2" />Manage Subscription</>
                      )}
                    </Button>
                  ) : (
                    <Button 
                      className="w-full btn-premium"
                      disabled={upgrading}
                      onClick={() => handleUpgrade(billingInterval)}
                      data-testid="button-resubscribe"
                    >
                      {upgrading ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</>
                      ) : (
                        'Resubscribe'
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </section>

            <section className="card-bordered" data-testid="section-invoices">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-heading-md text-teal flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-[var(--sage-500)]" />
                  Payment History
                </h2>
                {currentPlan !== "free" && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="btn-secondary-premium" 
                    onClick={handleOpenPortal}
                    disabled={portalMutation.isPending}
                    data-testid="button-view-all-invoices"
                  >
                    {portalMutation.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <ExternalLink className="h-4 w-4 mr-2" />
                    )}
                    Stripe Portal
                  </Button>
                )}
              </div>
              <div className="space-y-3">
                {invoicesLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-6 w-6 animate-spin text-[var(--sage-500)]" />
                  </div>
                ) : invoices.length === 0 ? (
                  <div className="text-center p-6 text-caption">
                    No invoices yet. Your payment history will appear here after your first payment.
                  </div>
                ) : (
                  invoices.map(invoice => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 rounded-xl bg-[var(--sage-50)]" data-testid={`invoice-${invoice.id}`}>
                      <div className="flex items-center gap-4">
                        <div className="icon-container icon-sm icon-soft-sage">
                          <CreditCard className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-body-sm font-medium">{invoice.description || "Subscription"}</p>
                          <p className="text-caption">{formatDate(invoice.date)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-body-sm font-medium">{formatAmount(invoice.amount)}</span>
                        <span className={`px-2 py-1 rounded-full text-caption ${
                          invoice.status === "paid" 
                            ? "bg-[var(--sage-200)] text-[var(--sage-700)]"
                            : "bg-amber-100 text-amber-700"
                        }`}>
                          {invoice.status === "paid" ? "Paid" : invoice.status}
                        </span>
                        {(invoice.invoicePdf || invoice.hostedUrl) && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDownloadInvoice(invoice.invoicePdf || invoice.hostedUrl)}
                            data-testid={`button-download-${invoice.id}`}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="card-bordered" data-testid="section-payment-security">
              <div className="flex items-center gap-3 mb-4">
                <div className="icon-container icon-md icon-soft-teal">
                  <Shield className="h-5 w-5" />
                </div>
                <h2 className="text-heading-md text-teal">Payment Security</h2>
              </div>
              <p className="text-body-sm text-[var(--sage-600)] mb-2">
                All payments are securely processed by Stripe. We never store your card details on our servers.
              </p>
              <p className="text-body-sm text-[var(--sage-600)] mb-4">
                Pro subscriptions can be canceled anytime from this page — no hidden fees, no lock-in, no cancellation hoops. If you cancel, you keep full access through the end of your paid period, and your free tools never go away.
              </p>
              {currentPlan !== "free" && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleOpenPortal}
                  disabled={portalMutation.isPending}
                  data-testid="button-update-payment"
                >
                  {portalMutation.isPending ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Loading...</>
                  ) : (
                    <><ExternalLink className="h-4 w-4 mr-2" />Manage Payment Method</>
                  )}
                </Button>
              )}
            </section>

            <div className="text-center py-4">
              <p className="text-caption flex items-center justify-center gap-1">
                <Sparkles className="h-4 w-4 text-[var(--gold-500)]" />
                Questions? Contact our support team
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </WellnessPageShell>
  );
}
