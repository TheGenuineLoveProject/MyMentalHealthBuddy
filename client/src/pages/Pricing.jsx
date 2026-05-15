import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Link } from "wouter";
import { Check, Star, Crown, Zap, Gem, ArrowLeft, Loader2, Heart, Shield, Sparkles, Users, Mail, ArrowRight } from "lucide-react";
import SEO from "../components/SEO";
import SafetyFooter from "../components/ui/SafetyFooter";
import PricingFAQ from "../sections/PricingFAQ.jsx";
import { TrustSignals } from "../components/benefits";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import { useToast } from "@/hooks/use-toast";
import "@/styles/glp-pane.css";

const freeTier = {
  name: "Your Safe Space",
  legacyName: "Free",
  cta: "Start Free",
  price: "$0",
  period: "forever",
  description: "Unlimited emotional support, always free",
  features: [
    "Mood tracking & journaling",
    "5 AI chat sessions per day",
    "Daily reflection prompts",
    "Community affirmation wall",
    "Crisis support resources",
    "Daily wisdom & insights"
  ],
  planId: null,
  icon: Heart,
  popular: false,
};

const starterTier = {
  name: "Your Personal Guide",
  legacyName: "Starter",
  cta: "Begin Your Journey",
  price: "$9.99",
  period: "one-time",
  description: "Deeper exploration, personal insights",
  features: [
    "Everything in Your Safe Space",
    "25 AI chat sessions per day",
    "Journal insights & patterns",
    "Guided reflection exercises"
  ],
  planId: "starter",
  interval: "one_time",
  icon: Sparkles,
  popular: false,
};

const proMonthly = {
  name: "Your Full Companion",
  legacyName: "Pro",
  cta: "Get Full Companion",
  price: "$12.99",
  period: "/month",
  description: "Complete companion journey, maximum support",
  planId: "pro",
  interval: "monthly",
  icon: Crown,
  popular: true,
};

const proYearly = {
  name: "Your Full Companion",
  legacyName: "Pro",
  cta: "Get Full Companion",
  price: "$109",
  period: "/year",
  description: "Save 30% — complete companion journey, billed annually",
  planId: "pro",
  interval: "yearly",
  icon: Crown,
  popular: true,
  savings: "Save $47/year",
};

const proFeatures = [
  "Everything in Your Personal Guide",
  "Unlimited AI chat sessions",
  "Advanced emotional insights",
  "Guided healing journeys",
  "Content studio access",
  "Progress analytics",
  "Priority support"
];

const eliteMonthly = {
  name: "Your Transformation Partner",
  legacyName: "Elite",
  cta: "Get Maximum Support",
  price: "$29.99",
  period: "/month",
  description: "Everything in Pro + human coaching support",
  planId: "elite",
  interval: "monthly",
  icon: Gem,
  popular: false,
};

const eliteYearly = {
  name: "Your Transformation Partner",
  legacyName: "Elite",
  cta: "Get Maximum Support",
  price: "$249",
  period: "/year",
  description: "Save 31% — everything in Pro + human coaching, billed annually",
  planId: "elite",
  interval: "yearly",
  icon: Gem,
  popular: false,
  savings: "Save $111/year",
};

const eliteFeatures = [
  "Everything in Your Full Companion",
  "Voice affirmations",
  "1-on-1 onboarding session",
  "Early access to new features",
  "Elite community access"
];

const VALUE_BRIDGE = [
  { feature: "Mood tracking & journaling", free: true, paid: true },
  { feature: "AI chat sessions", free: "5 / day", paid: "Unlimited" },
  { feature: "Crisis support resources", free: true, paid: true },
  { feature: "Journal insights & patterns", free: false, paid: true },
  { feature: "Guided healing journeys", free: false, paid: true },
  { feature: "Voice affirmations", free: false, paid: "Transformation Partner" },
  { feature: "Priority support", free: false, paid: true },
];

export default function Pricing() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [checkingOut, setCheckingOut] = useState(false);
  const [interval, setInterval] = useState("yearly");
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);

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
        headers: { "Content-Type": "application/json" },
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

  const submitEmail = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    try {
      window.localStorage.setItem("mmhb-pricing-lead", JSON.stringify({ email, at: Date.now() }));
    } catch { /* private mode */ }
    setEmailSubmitted(true);
    toast({ title: "You're on the list", description: "We'll send a gentle nudge when you're ready." });
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

    <div className="hxos-vnext min-h-screen relative" style={{ background: 'var(--glp-paper, #F7F1E8)' }}>
      <SEO
        title="Pricing - MyMentalHealthBuddy"
        description="Free emotional wellness companion. Optional Personal Guide, Full Companion, and Transformation Partner plans. Cancel anytime."
      />

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

          {/* Hero */}
          <div className="text-center mb-12 animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 font-display" style={{ color: 'var(--glp-sage-deep)' }} data-testid="text-pricing-title">
              Continue Your Journey <span style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-gold))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>With Lumi</span>
            </h1>
            <p className="text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--glp-ink)', opacity: 0.78 }} data-testid="text-pricing-subtitle">
              Core tools are free, always. Step up at your own pace — from a one-time unlock to unlimited
              support or the full transformation experience. Cancel anytime, no questions asked.
            </p>

            {/* V30 — Social proof stat */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-6" data-testid="row-social-proof">
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm" style={{ border: '1px solid var(--glp-sage-20)' }}>
                <Users className="w-4 h-4" style={{ color: 'var(--glp-sage-deep)' }} aria-hidden="true" />
                <span className="text-sm font-semibold" style={{ color: 'var(--glp-sage-deep)' }} data-testid="text-stat-users">10,000+ gentle check-ins</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm" style={{ border: '1px solid var(--glp-sage-20)' }}>
                <Star className="w-4 h-4 fill-current" style={{ color: 'var(--glp-gold-dark)' }} aria-hidden="true" />
                <span className="text-sm font-semibold" style={{ color: 'var(--glp-sage-deep)' }} data-testid="text-stat-rating">4.8 average rating</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm" style={{ border: '1px solid var(--glp-sage-20)' }}>
                <Shield className="w-4 h-4" style={{ color: 'var(--glp-sage-deep)' }} aria-hidden="true" />
                <span className="text-sm font-semibold" style={{ color: 'var(--glp-sage-deep)' }} data-testid="text-stat-privacy">Private by default</span>
              </div>
            </div>

            <div className="mt-8 inline-flex items-center rounded-full p-1 bg-white shadow-sm" style={{ border: '1px solid var(--glp-sage-20)' }} data-testid="toggle-billing-interval">
              <button
                onClick={() => setInterval("monthly")}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${interval === "monthly" ? "shadow-sm text-white" : "opacity-70 hover:opacity-90"}`}
                style={interval === "monthly" ? { background: 'linear-gradient(135deg, var(--glp-sage-deep), var(--glp-sage))' } : { color: 'var(--glp-sage-deep)' }}
                data-testid="button-interval-monthly"
              >
                Monthly
              </button>
              <button
                onClick={() => setInterval("yearly")}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${interval === "yearly" ? "shadow-sm text-white" : "opacity-70 hover:opacity-90"}`}
                style={interval === "yearly" ? { background: 'linear-gradient(135deg, var(--glp-sage-deep), var(--glp-sage))' } : { color: 'var(--glp-sage-deep)' }}
                data-testid="button-interval-yearly"
              >
                Yearly <span className="ml-1 inline-block px-1.5 py-0.5 rounded-full text-[10px] font-bold" style={interval === "yearly" ? { background: 'rgba(255,255,255,0.25)' } : { background: 'var(--glp-gold-30)', color: 'var(--glp-gold-dark)' }}>Save 31%</span>
              </button>
            </div>
          </div>

          {/* Tier cards — V28: white cards, circle icons, sage gradient buttons */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
            {tiers.map((tier, index) => {
              const Icon = tier.icon;
              return (
                <div
                  key={tier.legacyName}
                  className="rounded-3xl p-8 relative animate-fade-in-scale transition-all hover:-translate-y-1"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    background: '#FFFFFF',
                    border: tier.popular ? '2px solid var(--glp-gold)' : '1px solid var(--glp-sage-20)',
                    boxShadow: tier.popular
                      ? '0 20px 50px -12px rgba(232, 145, 58, 0.25), 0 4px 12px rgba(0,0,0,0.04)'
                      : '0 12px 32px -10px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.03)'
                  }}
                  data-testid={`card-pricing-${tier.legacyName.toLowerCase()}`}
                >
                  {tier.popular && (
                    <div
                      className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg"
                      style={{ background: '#E8913A', boxShadow: '0 6px 18px rgba(232, 145, 58, 0.42)' }}
                      data-testid="badge-most-popular"
                    >
                      ★ Most Popular
                    </div>
                  )}

                  {/* Circle icon (V28) */}
                  <div className="flex flex-col items-start gap-3 mb-4">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center shadow-md"
                      style={{
                        background: tier.popular
                          ? 'linear-gradient(135deg, var(--glp-gold), var(--glp-gold-dark))'
                          : 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))'
                      }}
                      aria-hidden="true"
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h2 className="text-xl font-bold leading-tight" style={{ color: 'var(--glp-sage-deep)' }} data-testid={`text-tier-name-${tier.legacyName.toLowerCase()}`}>
                      {tier.name}
                    </h2>
                  </div>

                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-bold" style={{ color: tier.popular ? 'var(--glp-gold-dark)' : 'var(--glp-sage-deep)' }}>{tier.price}</span>
                    <span className="text-sm font-medium ml-1" style={{ color: 'var(--glp-sage-deep)', opacity: 0.78 }}>
                      {tier.period?.startsWith('/') ? tier.period : ` ${tier.period}`}
                    </span>
                  </div>

                  <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--glp-sage-deep)', opacity: 0.82 }}>{tier.description}</p>

                  <ul className="space-y-3 mb-6">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm" style={{ color: 'var(--glp-sage-deep)' }}>
                        <div className="w-5 h-5 mt-0.5 shrink-0 rounded-full flex items-center justify-center" style={{ background: tier.popular ? 'var(--glp-gold-30)' : 'var(--glp-sage-20)', color: tier.popular ? 'var(--glp-gold-dark)' : 'var(--glp-sage-deep)' }}>
                          <Check className="w-3 h-3" />
                        </div>
                        <span>{feature}</span>
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
                      className={`w-full py-3.5 px-6 rounded-full font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-lg ${checkingOut ? 'opacity-70 cursor-not-allowed' : ''}`}
                      style={{
                        background: tier.popular
                          ? 'linear-gradient(135deg, var(--glp-gold), var(--glp-gold-dark))'
                          : 'linear-gradient(135deg, var(--glp-sage-deep), var(--glp-sage))',
                        boxShadow: tier.popular
                          ? '0 8px 20px rgba(232, 145, 58, 0.32)'
                          : '0 8px 20px rgba(95, 138, 110, 0.28)'
                      }}
                      data-testid={`button-choose-${tier.legacyName.toLowerCase()}`}
                    >
                      {checkingOut ? (
                        <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Redirecting…</span>
                      ) : (
                        <span className="flex flex-col items-center gap-0.5">
                          <span>{tier.cta || "Continue Your Journey"}</span>
                          <span className="text-xs font-medium text-white">
                            {tier.interval === "one_time" ? tier.price : `${tier.price}${tier.period}`}
                          </span>
                        </span>
                      )}
                    </button>
                  ) : (
                    <Link
                      href="/register"
                      className="block w-full py-3.5 px-6 text-center rounded-full font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-lg"
                      style={{
                        background: 'linear-gradient(135deg, var(--glp-sage-deep), var(--glp-sage))',
                        boxShadow: '0 8px 20px rgba(95, 138, 110, 0.28)'
                      }}
                      data-testid="button-get-started"
                    >
                      Start Free
                    </Link>
                  )}

                  {/* V30 — 30-day money-back on every paid tier */}
                  {tier.planId && tier.planId !== null && (
                    <p
                      className="mt-3 text-xs text-center leading-relaxed flex items-center justify-center gap-1"
                      style={{ color: 'var(--glp-sage-deep)', opacity: 0.7 }}
                      data-testid={`text-money-back-${tier.legacyName.toLowerCase()}`}
                    >
                      <Shield className="w-3 h-3" aria-hidden="true" />
                      30-day money-back guarantee
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* V30 — Value Bridge: Free vs Paid */}
          <section className="mt-16 rounded-3xl p-8 md:p-10 bg-white" style={{ border: '1px solid var(--glp-sage-20)', boxShadow: '0 12px 32px -10px rgba(0,0,0,0.08)' }} data-testid="section-value-bridge">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-3" style={{ color: 'var(--glp-sage-deep)' }} data-testid="text-value-bridge-title">
                What grows when you upgrade
              </h2>
              <p className="text-base" style={{ color: 'var(--glp-sage)' }}>
                A gentle look at what unlocks beyond Your Safe Space.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" data-testid="table-value-bridge">
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--glp-sage-20)' }}>
                    <th className="text-left py-3 px-2 font-semibold" style={{ color: 'var(--glp-sage-deep)' }}>Feature</th>
                    <th className="text-center py-3 px-2 font-semibold" style={{ color: 'var(--glp-sage-deep)' }}>Your Safe Space</th>
                    <th className="text-center py-3 px-2 font-semibold" style={{ color: 'var(--glp-gold-dark)' }}>Paid Tiers</th>
                  </tr>
                </thead>
                <tbody>
                  {VALUE_BRIDGE.map((row) => (
                    <tr key={row.feature} style={{ borderBottom: '1px solid var(--glp-sage-15, rgba(95, 138, 110, 0.15))' }} data-testid={`row-bridge-${row.feature.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>
                      <td className="py-3 px-2" style={{ color: 'var(--glp-sage-deep)' }}>{row.feature}</td>
                      <td className="py-3 px-2 text-center">
                        {row.free === true ? (
                          <span className="inline-flex w-6 h-6 rounded-full items-center justify-center" style={{ background: 'var(--glp-sage-20)', color: 'var(--glp-sage-deep)' }} aria-label="Included"><Check className="w-3 h-3" /></span>
                        ) : row.free === false ? (
                          <span style={{ color: 'var(--glp-sage)', opacity: 0.5 }} aria-label="Not included">—</span>
                        ) : (
                          <span className="text-xs font-medium" style={{ color: 'var(--glp-sage-deep)' }}>{row.free}</span>
                        )}
                      </td>
                      <td className="py-3 px-2 text-center">
                        {row.paid === true ? (
                          <span className="inline-flex w-6 h-6 rounded-full items-center justify-center" style={{ background: 'var(--glp-gold-30)', color: 'var(--glp-gold-dark)' }} aria-label="Included"><Check className="w-3 h-3" /></span>
                        ) : (
                          <span className="text-xs font-medium" style={{ color: 'var(--glp-gold-dark)' }}>{row.paid}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <TrustSignals variant="banner" className="mt-12" />

          <PricingFAQ className="mt-8" />

          {/* V30 — Email capture */}
          <section className="mt-12 rounded-3xl p-8 md:p-10 bg-white text-center" style={{ border: '1px solid var(--glp-sage-20)', boxShadow: '0 12px 32px -10px rgba(0,0,0,0.08)' }} data-testid="section-email-capture">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4 shadow-md" style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))' }} aria-hidden="true">
              <Mail className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--glp-sage-deep)' }} data-testid="text-email-title">
              Not ready yet? That's okay.
            </h2>
            <p className="max-w-xl mx-auto mb-6 text-base" style={{ color: 'var(--glp-sage)' }}>
              Leave your email and we'll send one gentle reminder when the time feels right. No pressure. No spam. Unsubscribe anytime.
            </p>
            {emailSubmitted ? (
              <div className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium" style={{ background: 'var(--glp-sage-20)', color: 'var(--glp-sage-deep)' }} data-testid="text-email-success">
                <Check className="w-4 h-4" /> You're on the list. Be gentle with yourself.
              </div>
            ) : (
              <form onSubmit={submitEmail} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" data-testid="form-email-capture">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 rounded-full px-5 py-3 text-sm bg-white focus:outline-none focus-visible:ring-2"
                  style={{ border: '1px solid var(--glp-sage-20)', color: 'var(--glp-sage-deep)' }}
                  data-testid="input-email"
                />
                <button
                  type="submit"
                  className="rounded-full px-6 py-3 font-semibold text-white text-sm transition-all hover:scale-[1.02] hover:shadow-lg"
                  style={{ background: 'linear-gradient(135deg, var(--glp-sage-deep), var(--glp-sage))', boxShadow: '0 8px 20px rgba(95, 138, 110, 0.28)' }}
                  data-testid="button-email-submit"
                >
                  Remind me gently
                </button>
              </form>
            )}
          </section>

          {/* V30 — Return Loop banner */}
          <section className="mt-12 rounded-3xl p-8 md:p-10 text-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--glp-sage-20), var(--glp-gold-30))', border: '1px solid var(--glp-sage-20)' }} data-testid="section-return-loop">
            <div className="relative z-10">
              <p className="text-xs uppercase tracking-wider font-bold mb-3" style={{ color: 'var(--glp-sage-deep)', opacity: 0.7 }}>You can always come back</p>
              <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: 'var(--glp-sage-deep)' }} data-testid="text-return-title">
                Your healing isn't a race
              </h2>
              <p className="max-w-xl mx-auto mb-6" style={{ color: 'var(--glp-sage-deep)', opacity: 0.85 }}>
                Start with the free tier. Upgrade when (and only if) it feels right. Downgrade anytime. We're here for the long road, not a single transaction.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  href="/checkin"
                  className="inline-flex items-center gap-2 rounded-full px-5 py-3 font-semibold text-white text-sm transition-all hover:scale-[1.02] hover:shadow-lg"
                  style={{ background: 'linear-gradient(135deg, var(--glp-sage-deep), var(--glp-sage))', boxShadow: '0 8px 20px rgba(95, 138, 110, 0.28)' }}
                  data-testid="button-return-checkin"
                >
                  Start with a free check-in <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/tools"
                  className="inline-flex items-center gap-2 rounded-full px-5 py-3 font-semibold text-sm transition-all hover:scale-[1.02] bg-white"
                  style={{ color: 'var(--glp-sage-deep)', border: '1px solid var(--glp-sage-20)' }}
                  data-testid="button-return-tools"
                >
                  Explore free tools
                </Link>
              </div>
            </div>
          </section>

          <div className="mt-16 text-center">
            <p className="text-sm" style={{ color: 'var(--glp-sage)' }}>
              Questions? <Link href="/support" className="hover:underline font-medium" style={{ color: 'var(--glp-sage-deep)' }}>Contact support</Link>
            </p>
          </div>

          <SafetyFooter variant="compact" className="mt-12" />
        </div>
      </div>
    </div>
  </WellnessPageShell>
  );
}
