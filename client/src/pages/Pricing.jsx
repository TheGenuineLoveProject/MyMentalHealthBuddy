import { useAuth } from "../context/AuthContext.jsx";
import { Link } from "wouter";
import { Check, Star, Zap, Crown, ArrowLeft } from "lucide-react";
import SEO from "../components/SEO";
import SafetyFooter from "../components/ui/SafetyFooter";
import { TrustSignals, BeforeAfter } from "../components/benefits";

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Begin your healing journey with foundational tools—no credit card required",
    features: [
      "Daily mood & energy tracking",
      "Basic guided journaling",
      "Breathing & grounding exercises",
      "Crisis support resources",
      "Daily affirmations & insights"
    ],
    planId: null,
    icon: Star,
    popular: false,
  },
  {
    name: "Plus",
    price: "$9",
    period: "/month",
    description: "Unlock your AI companion and personalized healing insights",
    features: [
      "Everything in Free",
      "Unlimited AI companion chat",
      "Personalized weekly reflections",
      "Export journal to PDF",
      "Guided wellness programs",
      "Advanced emotion tracking"
    ],
    planId: "plus",
    icon: Zap,
    popular: true,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "Complete access to our entire healing ecosystem",
    features: [
      "Everything in Plus",
      "100+ premium wellness tools",
      "Voice journaling with AI insights",
      "Trauma-informed programs",
      "Priority 24/7 support",
      "Personalized wellness pathways"
    ],
    planId: "pro",
    icon: Crown,
    popular: false,
  },
];

export default function Pricing() {
  const { user } = useAuth();

  const startCheckout = async (planId) => {
    if (!user) {
      window.location.href = "/login";
      return;
    }

    const res = await fetch("/api/billing/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ planId }),
    });

    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else alert(data.error || "Checkout failed");
  };

  return (
    <div className="min-h-screen overflow-hidden relative" style={{ background: 'linear-gradient(180deg, var(--glp-paper) 0%, var(--glp-teal-50) 50%, var(--glp-paper) 100%)' }}>
      <SEO 
        title="Pricing - The Genuine Love Project"
        description="Choose your plan and start your wellness journey. Free, Plus, and Pro options available."
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
              Invest in Your <span style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-gold))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Healing</span>
            </h1>
            <p className="text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--glp-sage)' }}>
              Your mental health is worth prioritizing. Start free and upgrade when you're ready for deeper support. 
              Cancel anytime—no questions asked.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {tiers.map((tier, index) => {
              const Icon = tier.icon;
              return (
                <div 
                  key={tier.name} 
                  className="rounded-3xl p-8 relative animate-fade-in-scale shadow-xl"
                  style={{ 
                    animationDelay: `${index * 100}ms`, 
                    background: 'var(--glp-paper)', 
                    border: tier.popular ? '2px solid var(--glp-gold)' : '1px solid var(--glp-sage-20)' 
                  }}
                  data-testid={`card-pricing-${tier.name.toLowerCase()}`}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 text-white text-xs font-semibold rounded-full shadow-md" style={{ background: 'linear-gradient(90deg, var(--glp-gold), var(--glp-gold-dark))' }}>
                      Most Popular
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: tier.popular ? 'linear-gradient(135deg, var(--glp-gold), var(--glp-gold-dark))' : 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))' }}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold" style={{ color: 'var(--glp-sage-deep)' }}>{tier.name}</h2>
                  </div>
                  
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-bold" style={{ color: tier.popular ? 'var(--glp-gold)' : 'var(--glp-sage-deep)' }}>{tier.price}</span>
                    <span className="text-sm" style={{ color: 'var(--glp-sage)' }}>{tier.period}</span>
                  </div>
                  
                  <p className="text-sm mb-6" style={{ color: 'var(--glp-sage)' }}>{tier.description}</p>
                  
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
                  
                  {tier.planId ? (
                    <button 
                      onClick={() => startCheckout(tier.planId)}
                      className={`w-full py-3.5 px-6 rounded-xl font-semibold transition-all ${tier.popular ? 'btn-premium hover-glow-gold' : 'btn-secondary-premium'}`}
                      data-testid={`button-choose-${tier.name.toLowerCase()}`}
                    >
                      Choose {tier.name}
                    </button>
                  ) : (
                    <Link 
                      href="/register"
                      className="block w-full py-3.5 px-6 text-center btn-secondary-premium"
                      data-testid="button-get-started"
                    >
                      Get Started Free
                    </Link>
                  )}
                </div>
              );
            })}
          </div>

          <TrustSignals variant="banner" className="mt-12" />

          <div className="mt-16 text-center">
            <p className="text-sm" style={{ color: 'var(--glp-sage)' }}>
              Questions? <Link href="/support" className="hover:underline" style={{ color: 'var(--glp-sage-deep)' }}>Contact support</Link>
            </p>
          </div>

          <SafetyFooter variant="compact" className="mt-12" />
        </div>
      </div>
    </div>
  );
}
