import { Link } from "wouter";
import { Lock, Sparkles, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { SEO } from "@/components/SEO";
import SafetyFooter from "@/components/ui/SafetyFooter";

const PLAN_BENEFITS = {
  plus: {
    label: "Plus",
    tagline: "Go deeper without pressure",
    includes: ["Full prompt library", "Card packs", "Gentle challenges"]
  },
  pro: {
    label: "Premium",
    tagline: "Build lasting change",
    includes: ["Identity pathways", "Audio reflections", "Creator tools"]
  }
};

export default function PlanGate({ 
  requiredPlan = "plus",
  feature = "this feature",
  children,
  fallback = null,
  showTeaser = true,
  className = ""
}) {
  const { user, isPro, isPlus } = useAuth();
  
  const hasAccess = 
    requiredPlan === "free" ||
    (requiredPlan === "plus" && (isPlus || isPro)) ||
    (requiredPlan === "pro" && isPro);

  if (hasAccess) {
    return children;
  }

  if (fallback) {
    return fallback;
  }

  if (!showTeaser) {
    return (
    <div className="min-h-screen safe-padding hero-gradient">
      <SEO title="Plan Gate — The Genuine Love Project" description="Explore plan gate tools for your wellness journey." />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Plan Gate</h1>
        <p className="text-muted-foreground mb-8">
          This page is being refined. Use the navigation to explore tools while we finish this section.
        </p>
        <SafetyFooter />
      </main>
    </div>
  );
  }

  const planInfo = PLAN_BENEFITS[requiredPlan] || PLAN_BENEFITS.plus;
  const planName = planInfo.label;
  
  return (
    <div 
      className={`relative ${className}`}
      data-testid="plan-gate"
    >
      {showTeaser && children && (
        <div className="opacity-30 blur-sm pointer-events-none select-none">
          {children}
        </div>
      )}
      
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 max-w-sm w-full text-center border border-slate-200 dark:border-slate-700">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[var(--glp-gold-30)] flex items-center justify-center">
            <Lock className="w-6 h-6 text-[var(--glp-gold)]" />
          </div>
          
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            {user ? `Upgrade to ${planName}` : "Sign up to unlock"}
          </h3>
          
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            {feature} is available with {planName}. 
            No pressure—explore at your pace.
          </p>
          
          <div className="space-y-2">
            {user ? (
              <Link
                href="/pricing"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[var(--glp-sage)] text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
                data-testid="link-upgrade"
              >
                <Sparkles className="w-4 h-4" />
                See {planName} benefits
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[var(--glp-sage)] text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
                  data-testid="link-signup"
                >
                  Start for free
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/login"
                  className="block text-sm text-[var(--glp-sage)] hover:underline"
                  data-testid="link-login"
                >
                  Already have an account? Sign in
                </Link>
              </>
            )}
          </div>
          
          <p className="text-xs text-slate-400 mt-4">
            Cancel anytime. No strings attached.
          </p>
        </div>
      </div>
    </div>
  );
}
