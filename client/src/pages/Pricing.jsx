import { useAuth } from "../context/AuthContext.jsx";
import { Link } from "wouter";
import { Check, Star, Zap, Crown, ArrowLeft } from "lucide-react";
import SEO from "../components/SEO";

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
      "Unlimited AI therapy chat",
      "Personalized weekly reflections",
      "Export journal to PDF",
      "Guided healing programs",
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
      "1000+ premium wellness tools",
      "Voice journaling with AI analysis",
      "Trauma-informed programs",
      "Priority 24/7 support",
      "Custom healing pathways"
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
    <div className="min-h-screen hero-gradient overflow-hidden relative">
      <SEO 
        title="Pricing - The Genuine Love Project"
        description="Choose your plan and start your wellness journey. Free, Plus, and Pro options available."
      />
      
      <div className="decorative-orb decorative-orb-sage w-[500px] h-[500px] -top-40 -right-40 absolute" aria-hidden="true" />
      <div className="decorative-orb decorative-orb-gold w-[300px] h-[300px] bottom-20 -left-20 absolute" aria-hidden="true" />

      <div className="relative z-10 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm text-sage-600 hover:text-teal transition-colors mb-8 font-medium"
            data-testid="link-back-home"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="text-center mb-12 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-bold text-teal mb-4 font-display" data-testid="text-pricing-title">
              Invest in Your <span className="text-gradient-brand">Healing</span>
            </h1>
            <p className="text-lg text-sage-600 max-w-2xl mx-auto">
              Your mental health is worth prioritizing. Start free and upgrade when you're ready for deeper support. 
              Every plan includes access to trauma-informed tools designed with care. Cancel anytime—no questions asked.
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3">
            {tiers.map((tier, index) => {
              const Icon = tier.icon;
              return (
                <div 
                  key={tier.name} 
                  className={`glass-premium rounded-2xl p-8 relative animate-fade-in-scale ${tier.popular ? 'ring-2 ring-gold-500 shadow-xl' : ''}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                  data-testid={`card-pricing-${tier.name.toLowerCase()}`}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-gold-500 to-gold-600 text-white text-xs font-semibold rounded-full shadow-md">
                      Most Popular
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tier.popular ? 'bg-gradient-to-br from-gold-500 to-gold-600' : 'bg-gradient-to-br from-sage-500 to-sage-600'}`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-teal">{tier.name}</h2>
                  </div>
                  
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className={`text-4xl font-bold ${tier.popular ? 'text-gold-500' : 'text-sage-600'}`}>{tier.price}</span>
                    <span className="text-sage-400 text-sm">{tier.period}</span>
                  </div>
                  
                  <p className="text-sm text-sage-400 mb-6">{tier.description}</p>
                  
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm text-sage-600">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${tier.popular ? 'bg-gold-100 text-gold-600' : 'bg-sage-100 text-sage-600'}`}>
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

          <div className="mt-16 text-center">
            <p className="text-sm text-sage-400">
              Questions? <Link href="/crisis" className="text-sage-600 hover:underline">Contact support</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
