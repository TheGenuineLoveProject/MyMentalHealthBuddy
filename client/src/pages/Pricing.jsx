import { useAuth } from "../context/AuthContext.jsx";
import { Link } from "wouter";
import { Check, Star, Zap, Crown, ArrowLeft } from "lucide-react";
import SEO from "../components/SEO";

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Start your journey with essential tools",
    features: ["Mood tracking", "Basic journaling", "Crisis resources", "Daily insights"],
    planId: null,
    icon: Star,
    popular: false,
  },
  {
    name: "Plus",
    price: "$9",
    period: "/month",
    description: "Unlock AI-powered reflection and deeper insights",
    features: ["Everything in Free", "AI reflections", "Weekly insights", "Export journal", "Guided programs"],
    planId: "plus",
    icon: Zap,
    popular: true,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "Full access to all premium features",
    features: ["Everything in Plus", "Advanced programs", "Voice + TTS", "Priority support", "1000+ tools"],
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
            className="inline-flex items-center gap-2 text-sm text-[#4a7a5e] hover:text-[#2D3748] transition-colors mb-8 font-medium"
            data-testid="link-back-home"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="text-center mb-12 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-bold text-[#2D3748] mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }} data-testid="text-pricing-title">
              Choose Your <span className="text-gradient-brand">Path</span>
            </h1>
            <p className="text-lg text-[#4A5568] max-w-xl mx-auto">
              Start free, upgrade when you're ready. Cancel anytime.
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3">
            {tiers.map((tier, index) => {
              const Icon = tier.icon;
              return (
                <div 
                  key={tier.name} 
                  className={`glass-premium rounded-2xl p-8 relative animate-fade-in-scale ${tier.popular ? 'ring-2 ring-[#D4AF37] shadow-xl' : ''}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                  data-testid={`card-pricing-${tier.name.toLowerCase()}`}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-[#D4AF37] to-[#C49B32] text-white text-xs font-semibold rounded-full shadow-md">
                      Most Popular
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tier.popular ? 'bg-gradient-to-br from-[#D4AF37] to-[#C49B32]' : 'bg-gradient-to-br from-[#5A8A6E] to-[#4a7a5e]'}`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#2D3748]">{tier.name}</h2>
                  </div>
                  
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className={`text-4xl font-bold ${tier.popular ? 'text-[#D4AF37]' : 'text-[#4a7a5e]'}`}>{tier.price}</span>
                    <span className="text-[#6B7280] text-sm">{tier.period}</span>
                  </div>
                  
                  <p className="text-sm text-[#6B7280] mb-6">{tier.description}</p>
                  
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm text-[#4A5568]">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${tier.popular ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'bg-[#5A8A6E]/20 text-[#5A8A6E]'}`}>
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
            <p className="text-sm text-[#6B7280]">
              Questions? <Link href="/crisis" className="text-[#4a7a5e] hover:underline">Contact support</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
