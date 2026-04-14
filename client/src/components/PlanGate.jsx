import { Link } from "wouter";
import { Sparkles, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { PLAN_HIERARCHY } from "../config/featureAccess";

const PLAN_LABELS = {
  starter: "Starter",
  pro: "Pro",
  elite: "Elite",
};

export default function PlanGate({ 
  requiredPlan = "pro",
  feature = "this feature",
  children,
  fallback = null,
  showTeaser = true,
  className = ""
}) {
  const { user, isPro } = useAuth();
  
  const userPlan = user?.subscriptionStatus || (isPro ? "pro" : "free");
  const userLevel = PLAN_HIERARCHY.indexOf(userPlan);
  const requiredLevel = PLAN_HIERARCHY.indexOf(requiredPlan);
  const hasAccess = requiredPlan === "free" || userLevel >= requiredLevel;

  if (hasAccess) {
    return children;
  }

  if (fallback) {
    return fallback;
  }

  if (!showTeaser) {
    return null;
  }

  const planLabel = PLAN_LABELS[requiredPlan] || "Pro";

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
            <Sparkles className="w-6 h-6 text-[var(--glp-gold)]" />
          </div>
          
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            {user ? `This is a ${planLabel} feature` : "Sign up to explore"}
          </h3>
          
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            {feature} is part of {planLabel}. 
            Your free tools — journaling, mood tracking, reflection — are always available.
          </p>
          
          <div className="space-y-2">
            {user ? (
              <Link
                href="/pricing"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[var(--glp-sage)] text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
                data-testid="link-upgrade"
              >
                <Sparkles className="w-4 h-4" />
                View Plans
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <a
                  href="/login"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[var(--glp-sage)] text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
                  data-testid="link-signup"
                >
                  Start for free
                  <ArrowRight className="w-4 h-4" />
                </a>
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
            No obligation. Cancel anytime, no questions asked.
          </p>
        </div>
      </div>
    </div>
  );
}
