import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Link } from "wouter";
import { Check, Star, Crown, Zap, Gem, ArrowLeft, Loader2 } from "lucide-react";
import SEO from "../components/SEO";
import SafetyFooter from "../components/ui/SafetyFooter";
import PricingFAQ from "../sections/PricingFAQ.jsx";
import { TrustSignals, BeforeAfter } from "../components/benefits";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import { useToast } from "@/hooks/use-toast";
import "@/styles/glp-pane.css";

const freeTier = {
  name: "Free",
  price: "$0",
  period: "forever",
  description: "Core wellness tools with no credit card and no expiration",
  features: [
    "Mood tracking & journaling",
    "5 AI chat sessions per day",
    "Daily reflection prompts",
    "Community affirmation wall",
    "Crisis support resources",
    "Daily wisdom & insights"
  ],
  planId: null,
  icon: Star,
  popular: false,
};

const starterTier = {
  name: "Starter",
  price: "$9.99",
  period: "one-time",
  description: "A gentle step up — unlock deeper tools with a single payment, yours to keep",
  features: [
    "Everything in Free",
    "25 AI chat sessions per day",
    "Journal insights & patterns",
    "Guided reflection exercises"
  ],
  planId: "starter",
  interval: "one_time",
  icon: Zap,
  popular: false,
};

const proMonthly = {
  name: "Pro",
  price: "$12.99",
  period: "/month",
  description: "Unlimited AI sessions and the full wellness toolkit — cancel anytime",
  planId: "pro",
  interval: "monthly",
  icon: Crown,
  popular: true,
};

const proYearly = {
  name: "Pro",
  price: "$109",
  period: "/year",
  description: "Save 30% — everything in Pro, billed annually",
  planId: "pro",
  interval: "yearly",
  icon: Crown,
  popular: true,
  savings: "Save $47/year",
};

const proFeatures = [
  "Everything in Starter",
  "Unlimited AI chat sessions",
  "Advanced emotional insights",
  "Guided healing journeys",
  "Content studio access",
  "Progress analytics",
  "Priority support"
];

const eliteMonthly = {
  name: "Elite",
  price: "$29.99",
  period: "/month",
  description: "The complete experience — premium tools, early access, and personal onboarding",
  planId: "elite",
  interval: "monthly",
  icon: Gem,
  popular: false,
};

const eliteYearly = {
  name: "Elite",
  price: "$249",
  period: "/year",
  description: "Save 31% — full Elite access, billed annually",
  planId: "elite",
  interval: "yearly",
  icon: Gem,
  popular: false,
  savings: "Save $111/year",
};

const eliteFeatures = [
  "Everything in Pro",
  "Voice affirmations",
  "1-on-1 onboarding session",
  "Early access to new features",
  "Elite community access"
];

export default function Pricing() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [checkingOut, setCheckingOut] = useState(false);
  const [interval, setInterval] = useState("yearly");

  useEffect(() => {
    fetch("/api/billing/pricing-view", { method: "POST", credentials: "include" }).catch(() => {});
  }, []);

  const proTier = interval === "yearly" ? proYearly : proMonthly;
  const eliteTier = interval === "yearly" ? eliteYearly : eliteMonthly;
  const tiers = [
    freeTier,
    { ...starterTier },
    { ...proTier, features: proFeatures },
    { ...eliteTier, features: eliteFeatures },
  ];

  const startCheckout = async (plan, billingInterval) => {
    if (!user) {
      window.location.href = "/login";
      return;
    }

    setCheckingOut(true);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ plan, interval: billingInterval }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast({
          title: "Checkout unavailable",
          description: data.error || "Unable to start checkout. Please try again.",
          variant: "destructive"
        });
        setCheckingOut(false);
      }
    } catch (error) {
      toast({
        title: "Connection error",
        description: "Unable to connect to payment service. Please try again.",
        variant: "destructive"
      });
      setCheckingOut(false);
    }
  };

  return (
  <WellnessPageShell
    benefits={pickBenefits(["agency","calm","clarity","selfRespect","meaning"], 5)}
    clarity={{
      what: "A self-paced reflection tool you control.",
      why: "To support clarity, values alignment, and gentle next steps.",
      who: "For adults (18+) who want educational wellness tools (not medical care).",
      when: "Anytime you want a small reset or a thoughtful pause.",
      where: "Anywhere you can breathe and write for 1–5 minutes.",
      how: "Pick one prompt, answer briefly, stop whenever you want."
    }}
    examples={[
      { label: "Beginner", examples: ["Write one honest sentence about how you feel.", "Name one value you want to protect today."] },
      { label: "Intermediate", examples: ["Describe the situation + the need underneath it.", "Write a boundary you could try in one sentence."] },
      { label: "Advanced", examples: ["Identify a pattern and the smallest experiment to change it.", "Write a compassionate reframe and one measurable step."] }
    ]}
  >

    <div className="min-h-screen overflow-hidden relative" style={{ background: 'linear-gradient(180deg, var(--glp-paper) 0%, var(--glp-teal-50) 50%, var(--glp-paper) 100%)' }}>
      <SEO 
        title="Pricing - MyMentalHealthBuddy"
        description="Free emotional wellness companion. Optional Starter, Pro, and Elite plans. Cancel anytime."
      />
      
      <div className="absolute -top-48 -right-48 w-[600px] h-[600px] rounded-full" style={{ background: 'radial-gradient(circle, var(--glp-sage-30), transparent 70%)' }} aria-hidden="true" />
      <div className="absolute bottom-10 -left-24 w-[400px] h-[400px] rounded-full" style={{ background: 'radial-gradient(circle, var(--glp-gold-30), transparent 70%)' }} aria-hidden="true" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full opacity-50" style={{ background: 'radial-gradient(circle, var(--glp-rose-15), transparent 60%)' }} aria-hidden="true" />

      <div className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors mb-10 hover:opacity-80"
            style={{ color: 'var(--glp-sage-deep)' }}
            data-testid="link-back-home"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="text-center mb-16 animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 font-display" style={{ color: 'var(--glp-sage-deep)' }} data-testid="text-pricing-title">
              Choose What Feels <span style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-gold))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Right</span>
            </h1>
            <p className="text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--glp-sage)' }}>
              Core tools are free, always. Step up at your own pace — from a one-time Starter unlock
              to unlimited Pro or the full Elite experience. Cancel anytime, no questions asked.
            </p>

            <div className="mt-8 inline-flex items-center rounded-full p-1" style={{ background: 'var(--glp-sage-20)' }} data-testid="toggle-billing-interval">
              <button
                onClick={() => setInterval("monthly")}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${interval === "monthly" ? "shadow-md" : "opacity-70 hover:opacity-90"}`}
                style={interval === "monthly" ? { background: 'var(--glp-paper)', color: 'var(--glp-sage-deep)' } : { color: 'var(--glp-sage-deep)' }}
                data-testid="button-interval-monthly"
              >
                Monthly
              </button>
              <button
                onClick={() => setInterval("yearly")}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${interval === "yearly" ? "shadow-md" : "opacity-70 hover:opacity-90"}`}
                style={interval === "yearly" ? { background: 'var(--glp-paper)', color: 'var(--glp-sage-deep)' } : { color: 'var(--glp-sage-deep)' }}
                data-testid="button-interval-yearly"
              >
                Yearly <span style={{ color: 'var(--glp-gold-dark)' }}>Save 31%</span>
              </button>
            </div>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
            {tiers.map((tier, index) => {
              const Icon = tier.icon;
              return (
                <div 
                  key={tier.name} 
                  className="glp-pane glp-pane--bare rounded-3xl p-8 relative animate-fade-in-scale shadow-xl"
                  style={{ 
                    animationDelay: `${index * 100}ms`, 
                    background: 'var(--glp-paper)', 
                    border: tier.popular ? '2px solid var(--glp-gold)' : '1px solid var(--glp-sage-20)' 
                  }}
                  data-testid={`card-pricing-${tier.name.toLowerCase()}`}
                >
                  {tier.popular && (
                    <div
                      className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg"
                      style={{ background: '#E8913A', boxShadow: '0 6px 18px rgba(232, 145, 58, 0.42)' }}
                      data-testid="badge-most-popular"
                    >
                      Most Popular
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: tier.popular ? 'linear-gradient(135deg, var(--glp-gold), var(--glp-gold-dark))' : 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))' }}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold" style={{ color: 'var(--glp-sage-deep)' }}>{tier.name}</h2>
                  </div>
                  
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-bold" style={{ color: tier.popular ? 'var(--glp-gold)' : 'var(--glp-sage-deep)' }}>{tier.price}</span>
                    <span className="text-sm font-medium ml-1" style={{ color: 'var(--glp-sage-deep)', opacity: 0.78 }}>
                      {tier.period?.startsWith('/') ? tier.period : ` ${tier.period}`}
                    </span>
                  </div>
                  
                  <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--glp-sage-deep)', opacity: 0.82 }}>{tier.description}</p>
                  
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm" style={{ color: 'var(--glp-sage-deep)' }}>
                        <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: tier.popular ? 'var(--glp-gold-30)' : 'var(--glp-sage-20)', color: tier.popular ? 'var(--glp-gold-dark)' : 'var(--glp-sage-deep)' }}>
                          <Check className="w-3 h-3" />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  {tier.savings && (
                    <div className="mb-3 inline-block px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'var(--glp-gold-30)', color: 'var(--glp-gold-dark)' }} data-testid="badge-savings">
                      {tier.savings}
                    </div>
                  )}

                  {tier.planId ? (
                    <button 
                      onClick={() => startCheckout(tier.planId, tier.interval)}
                      disabled={checkingOut}
                      className={`w-full py-3.5 px-6 rounded-xl font-semibold transition-all ${tier.popular ? 'btn-premium hover-glow-gold' : 'btn-secondary-premium'} ${checkingOut ? 'opacity-70 cursor-not-allowed' : ''}`}
                      data-testid={`button-choose-${tier.name.toLowerCase()}`}
                    >
                      {checkingOut ? (
                        <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Redirecting to checkout...</span>
                      ) : tier.interval === "one_time" ? (
                        `Get ${tier.name} — ${tier.price}`
                      ) : (
                        `Subscribe to ${tier.name} — ${tier.price}${tier.period?.startsWith('/') ? tier.period : ` ${tier.period}`}`
                      )}
                    </button>
                  ) : (
                    <a 
                      href="/register"
                      className="block w-full py-3.5 px-6 text-center btn-secondary-premium"
                      data-testid="button-get-started"
                    >
                      Get Started Free
                    </a>
                  )}

                  {tier.planId === "pro" && (
                    <p
                      className="mt-3 text-xs text-center leading-relaxed"
                      style={{ color: '#6B7B6E' }}
                      data-testid={`text-money-back-${tier.name.toLowerCase()}`}
                    >
                      30-day money-back guarantee. No questions asked.
                    </p>
                  )}
                  {tier.planId === "elite" && (
                    <p
                      className="mt-3 text-xs text-center leading-relaxed"
                      style={{ color: '#6B7B6E' }}
                      data-testid={`text-money-back-${tier.name.toLowerCase()}`}
                    >
                      Cancel anytime. Full refund within 30 days.
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <TrustSignals variant="banner" className="mt-12" />

          <PricingFAQ className="mt-8" />

          <div className="mt-16 text-center">
            <p className="text-sm" style={{ color: 'var(--glp-sage)' }}>
              Questions? <Link href="/support" className="hover:underline" style={{ color: 'var(--glp-sage-deep)' }}>Contact support</Link>
            </p>
          </div>

          <SafetyFooter variant="compact" className="mt-12" />
        </div>
      </div>
    </div>
  </WellnessPageShell>
  );
}
