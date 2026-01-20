import { Link } from "wouter";
import { Crown, Check, ArrowLeft, Sparkles, Zap, Shield, Star, ArrowRight } from "lucide-react";
import SEO from "../components/SEO";

const PRO_FEATURES = [
  { name: "Advanced analytics", description: "Deep insights into your wellness patterns", icon: Sparkles },
  { name: "AI-powered insights", description: "Personalized recommendations and reflections", icon: Zap },
  { name: "Premium journaling", description: "Advanced prompts and guided exercises", icon: Star },
  { name: "Priority support", description: "Fast, dedicated assistance when you need it", icon: Shield },
  { name: "1000+ wellness tools", description: "Full access to our complete toolkit", icon: Crown },
];

export default function Upgrade() {
  const handleUpgrade = () => {
    window.location.href = "/api/billing/checkout?plan=pro";
  };

  return (
    <>
      <SEO 
        title="Upgrade to Pro - The Genuine Love Project"
        description="Unlock advanced analytics, AI insights, premium journaling, and 1000+ wellness tools with a Pro subscription."
      />
      <div className="min-h-screen hero-gradient overflow-hidden relative">
        <div className="decorative-orb decorative-orb-gold w-[400px] h-[400px] -top-20 -right-20 absolute" aria-hidden="true" />
        <div className="decorative-orb decorative-orb-sage w-[350px] h-[350px] bottom-20 -left-20 absolute" aria-hidden="true" />

        <div className="content-wrapper py-12 relative z-10">
          <div className="max-w-2xl mx-auto">
            <header className="mb-8">
              <Link 
                href="/dashboard" 
                className="inline-flex items-center gap-2 text-sm text-[var(--sage-600)] hover:text-[var(--teal-700)] transition mb-6"
                data-testid="link-back"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
              
              <div className="text-center">
                <div className="icon-container icon-xl icon-gradient-gold mx-auto mb-4">
                  <Crown className="w-8 h-8" />
                </div>
                <h1 className="text-display-lg text-teal mb-2" data-testid="text-upgrade-title">
                  Upgrade to <span className="text-gradient-brand">Pro</span>
                </h1>
                <p className="text-lead">Unlock your full wellness potential</p>
              </div>
            </header>

            <div className="glass-premium rounded-2xl p-8 mb-8">
              <div className="flex items-baseline justify-center gap-2 mb-6">
                <span className="text-display-xl text-gold font-bold">$19</span>
                <span className="text-body-lg text-[var(--teal-500)]">/month</span>
              </div>
              
              <ul className="space-y-4 mb-8">
                {PRO_FEATURES.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <li 
                      key={index} 
                      className="flex items-start gap-4 p-4 rounded-xl bg-white/50 border border-[var(--sage-200)]"
                      data-testid={`feature-${index}`}
                    >
                      <div className="icon-container icon-md icon-soft-sage flex-shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-heading-sm text-teal">{feature.name}</h3>
                        <p className="text-body-sm">{feature.description}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
              
              <button 
                onClick={handleUpgrade}
                className="w-full btn-premium py-4 text-lg hover-glow-gold"
                data-testid="button-upgrade"
              >
                <span className="flex items-center justify-center gap-2">
                  Upgrade Now
                  <ArrowRight className="w-5 h-5" />
                </span>
              </button>
              
              <p className="text-caption text-center mt-4">
                Cancel anytime. 7-day money-back guarantee.
              </p>
            </div>

            <div className="text-center">
              <p className="text-body-sm">
                Questions? <Link href="/crisis" className="text-[var(--sage-600)] hover:underline">Contact support</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
