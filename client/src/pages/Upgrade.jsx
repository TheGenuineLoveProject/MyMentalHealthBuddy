import { Link } from "wouter";
import { Crown, Check, ArrowLeft, Sparkles, Zap, Shield, Star, ArrowRight } from "lucide-react";
import SEO from "../components/SEO";
import SafetyFooter from "../components/ui/SafetyFooter";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

const PRO_FEATURES = [
  { name: "Advanced analytics", description: "Deep insights into your wellness patterns", icon: Sparkles },
  { name: "AI-powered insights", description: "Personalized recommendations and reflections", icon: Zap },
  { name: "Guided journaling", description: "Advanced prompts and guided exercises", icon: Star },
  { name: "Priority support", description: "Fast, dedicated assistance when you need it", icon: Shield },
  { name: "1000+ wellness tools", description: "Full access to our complete toolkit", icon: Crown },
];

export default function Upgrade() {
  const handleUpgrade = () => {
    window.location.href = "/api/billing/checkout?plan=pro";
  };

  return (
  <WellnessPageShell
    title="Upgrade"
    subtitle="Educational reflection tools. Choose what feels safe and supportive."
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

    <>
      <SEO 
        title="Upgrade to Pro - The Genuine Love Project"
        description="Unlock advanced analytics, AI insights, guided journaling, and 1000+ wellness tools with a Pro subscription."
      />
      <div className="min-h-screen safe-padding hero-gradient overflow-hidden relative">
        <div className="decorative-orb decorative-orb-gold w-[400px] h-[400px] -top-20 -right-20 absolute" aria-hidden="true" />
        <div className="decorative-orb decorative-orb-sage w-[350px] h-[350px] bottom-20 -left-20 absolute" aria-hidden="true" />

        <div className="container-sm px-responsive py-12 relative z-10">
          <div className="mx-auto">
            <header className="mb-8">
              <Link 
                href="/dashboard" 
                className="inline-flex items-center gap-2 text-body-sm text-secondary hover:text-brand transition focus-ring rounded-lg px-2 py-1 mb-6"
                data-testid="link-back"
              >
                <ArrowLeft className="icon-sm" />
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
                <span className="text-display-xl text-gold font-bold">$12</span>
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
                  Continue to Pro
                  <ArrowRight className="w-5 h-5" />
                </span>
              </button>
              
              <p className="text-caption text-center mt-4">
                Cancel anytime — no lock-in, no cancellation fees.
              </p>
            </div>

            <SafetyFooter variant="compact" className="mt-8" />
          </div>
        </div>
      </div>
    </>
  </WellnessPageShell>
  );
}
