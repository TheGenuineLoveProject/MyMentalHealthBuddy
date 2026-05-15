import { useState } from "react";
import { Link } from "wouter";
import { Crown, ArrowLeft, Sparkles, Zap, Shield, Star, ArrowRight, Loader2 } from 'lucide-react';
import SEO from "../components/SEO";
import SafetyFooter from "../components/ui/SafetyFooter";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import { useToast } from "@/hooks/use-toast";

const PRO_FEATURES = [
  { name: "Advanced analytics", description: "Deep insights into your wellness patterns", icon: Sparkles },
  { name: "AI-powered insights", description: "Personalized recommendations and reflections", icon: Zap },
  { name: "Guided journaling", description: "Advanced prompts and guided exercises", icon: Star },
  { name: "Priority support", description: "Fast, dedicated assistance when you need it", icon: Shield },
  { name: "1000+ wellness tools", description: "Full access to our complete toolkit", icon: Crown },
];

export default function Upgrade() {
  const [upgrading, setUpgrading] = useState(false);
  const { toast } = useToast();

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ plan: "pro", interval: "monthly" }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast({
          title: "Checkout unavailable",
          description: data.error || "Unable to start checkout. Please try again.",
          variant: "destructive",
        });
        setUpgrading(false);
      }
    } catch (error) {
      toast({
        title: "Connection error",
        description: "Unable to connect to payment service. Please try again.",
        variant: "destructive",
      });
      setUpgrading(false);
    }
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
        description="Pro adds unlimited AI sessions, deeper insights, and additional wellness tools. Cancel anytime."
      />
      <div className="min-h-screen safe-padding v28-paper-bg overflow-hidden relative">
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
                <p className="text-lead">More tools, if you want them</p>
              </div>
            </header>

            <div className="v28-card rounded-2xl p-8 mb-8">
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
                disabled={upgrading}
                className={`w-full btn-premium py-4 text-lg hover-glow-gold ${upgrading ? 'opacity-70 cursor-not-allowed' : ''}`}
                data-testid="button-upgrade"
              >
                <span className="flex items-center justify-center gap-2">
                  {upgrading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" />Redirecting to checkout...</>
                  ) : (
                    <>Subscribe to Pro — $12/month<ArrowRight className="w-5 h-5" /></>
                  )}
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
