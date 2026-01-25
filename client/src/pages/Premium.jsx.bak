import { useState, useEffect, lazy, Suspense } from "react";
import { Link } from "wouter";
import { 
  Sparkles, ArrowLeft, Crown, Star, Target, BarChart3,
  Brain, Heart, Calendar, Bell, ChevronRight, Zap, Loader2
} from "lucide-react";
import SEO from "../components/SEO";
import SafetyFooter from "../components/ui/SafetyFooter";

const STRIPE_PRICING_TABLE_ID = "prctbl_1SanK5RtwDw9mKhaSKDHxmn5";
const STRIPE_PUBLISHABLE_KEY = "pk_live_51RIV9vRtwDw9mKhaldQnCVBo6Grjc2KXIjwyolZbTClMNgMGySVBrT6LayaZhBebFDUaQI0yoXoxiAjyLXLOl2b800NJXSDcQd";

const HealingJourneys = lazy(() => import("../components/HealingJourneys.jsx"));
const ProgressAnalytics = lazy(() => import("../components/ProgressAnalytics.jsx"));
const WellnessGoalTracker = lazy(() => import("../components/WellnessGoalTracker.jsx"));
const AIWellnessConcierge = lazy(() => import("../components/AIWellnessConcierge.jsx"));
const DailyWellnessPlanner = lazy(() => import("../components/DailyWellnessPlanner.jsx"));
const WellnessTimer = lazy(() => import("../components/WellnessTimer.jsx"));
const MoodVisualizer = lazy(() => import("../components/MoodVisualizer.jsx"));
const MindfulBreathing = lazy(() => import("../components/MindfulBreathing.jsx"));

const PremiumLoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[300px] rounded-2xl backdrop-blur-sm" style={{ background: 'rgba(255,255,255,0.8)' }}>
    <div className="flex flex-col items-center gap-3">
      <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--glp-sage)' }} />
      <p className="text-sm" style={{ color: 'var(--glp-sage)' }}>Loading premium feature...</p>
    </div>
  </div>
);

const PREMIUM_FEATURES = [
  {
    id: "journeys",
    name: "Healing Journeys",
    description: "Structured therapeutic programs for lasting transformation",
    icon: Sparkles,
    gradient: "linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))",
    component: HealingJourneys
  },
  {
    id: "analytics",
    name: "Progress Analytics",
    description: "Comprehensive insights into your wellness journey",
    icon: BarChart3,
    gradient: "linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))",
    component: ProgressAnalytics
  },
  {
    id: "goals",
    name: "Goal Tracker",
    description: "Set and achieve your wellness objectives",
    icon: Target,
    gradient: "linear-gradient(135deg, var(--glp-gold), var(--glp-gold-dark))",
    component: WellnessGoalTracker
  },
  {
    id: "concierge",
    name: "AI Concierge",
    description: "Personalized recommendations powered by AI",
    icon: Brain,
    gradient: "linear-gradient(135deg, var(--glp-sage-deep), var(--glp-sage))",
    component: AIWellnessConcierge
  },
  {
    id: "planner",
    name: "Daily Planner",
    description: "Plan your wellness activities for each day",
    icon: Calendar,
    gradient: "linear-gradient(135deg, var(--glp-rose), var(--glp-rose-dark))",
    component: DailyWellnessPlanner
  },
  {
    id: "timer",
    name: "Wellness Timer",
    description: "Timed sessions for mindful practice",
    icon: Bell,
    gradient: "linear-gradient(135deg, var(--glp-sage-deep), var(--glp-sage))",
    component: WellnessTimer
  },
  {
    id: "mood",
    name: "Mood Visualizer",
    description: "Explore your emotional patterns visually",
    icon: Heart,
    gradient: "linear-gradient(135deg, var(--glp-rose), var(--glp-rose-dark))",
    component: MoodVisualizer
  },
  {
    id: "breathing",
    name: "Mindful Breathing",
    description: "Advanced breathing exercises with patterns",
    icon: Zap,
    gradient: "linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))",
    component: MindfulBreathing
  }
];

function StripePricingTable() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (document.querySelector('script[src*="pricing-table.js"]')) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://js.stripe.com/v3/pricing-table.js";
    script.async = true;
    script.onload = () => setIsLoaded(true);
    document.head.appendChild(script);

    return () => {
      // Keep script loaded for subsequent visits
    };
  }, []);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--glp-sage)' }} />
          <p className="text-sm" style={{ color: 'var(--glp-sage)' }}>Loading pricing options...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="stripe-pricing-wrapper" data-testid="stripe-pricing-table">
      <stripe-pricing-table
        pricing-table-id={STRIPE_PRICING_TABLE_ID}
        publishable-key={STRIPE_PUBLISHABLE_KEY}
      />
    </div>
  );
}

export default function Premium() {
  const [activeFeature, setActiveFeature] = useState("journeys");
  const [view, setView] = useState("features");

  const ActiveComponent = PREMIUM_FEATURES.find(f => f.id === activeFeature)?.component;

  return (
    <>
      <SEO
        title="Premium Features"
        description="Unlock the full potential of your mental wellness journey with premium features including healing journeys, AI concierge, advanced analytics, and personalized recommendations."
      />

      <div className="min-h-screen hero-gradient">
        <div className="decorative-orb decorative-orb-gold w-[400px] h-[400px] -top-20 -right-20 absolute" aria-hidden="true" />
        <div className="decorative-orb decorative-orb-sage w-[350px] h-[350px] bottom-20 -left-20 absolute" aria-hidden="true" />
        <div className="decorative-orb decorative-orb-blush w-[200px] h-[200px] top-1/2 left-1/4 absolute" aria-hidden="true" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
          <header className="mb-8">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-body-sm text-[var(--sage-500)] hover:text-[var(--teal-600)] transition mb-6"
              data-testid="link-back-dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="icon-container icon-xl icon-gradient-gold">
                  <Crown className="w-7 h-7" />
                </div>
                <div>
                  <h1 className="text-display-lg text-teal" data-testid="text-premium-title">
                    Premium Features
                  </h1>
                  <p className="text-lead">Unlock your full wellness potential</p>
                </div>
              </div>
            <div className="flex gap-2">
              <button
                onClick={() => setView("features")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  view === "features"
                    ? "bg-[var(--primary)] text-white"
                    : "bg-[var(--surface)] text-[var(--text-secondary)]"
                }`}
                data-testid="button-view-features"
              >
                Features
              </button>
              <button
                onClick={() => setView("pricing")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  view === "pricing"
                    ? "bg-[var(--primary)] text-white"
                    : "bg-[var(--surface)] text-[var(--text-secondary)]"
                }`}
                data-testid="button-view-pricing"
              >
                Pricing
              </button>
            </div>
          </div>
          </header>

          {view === "pricing" ? (
            <div className="card-elevated p-6 md:p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-[var(--text)] mb-2">
                  Choose Your Wellness Journey
                </h2>
                <p className="text-[var(--text-secondary)]">
                  Select a plan that fits your mental health goals
                </p>
              </div>
              <StripePricingTable />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1 space-y-2">
                <div className="card-elevated p-4">
                  <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--glp-ink)' }}>
                    <Star className="w-5 h-5" style={{ color: 'var(--glp-gold)' }} />
                    Premium Tools
                  </h3>
                  {PREMIUM_FEATURES.map(feature => {
                    const Icon = feature.icon;
                    const isActive = activeFeature === feature.id;

                    return (
                      <button
                        key={feature.id}
                        onClick={() => setActiveFeature(feature.id)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left mb-2"
                        style={isActive
                          ? { background: feature.gradient, color: 'var(--glp-paper)' }
                          : { color: 'var(--glp-ink)' }}
                        data-testid={`feature-${feature.id}`}
                      >
                        <div className="p-2 rounded-lg" style={isActive
                          ? { background: 'rgba(255,255,255,0.2)' }
                          : { background: feature.gradient, color: 'var(--glp-paper)' }}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{feature.name}</p>
                          <p className="text-xs truncate" style={{ color: isActive ? 'rgba(255,255,255,0.8)' : 'var(--glp-sage)' }}>
                            {feature.description}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4" style={{ color: isActive ? 'var(--glp-paper)' : 'var(--glp-sage)' }} />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="lg:col-span-3">
                <Suspense fallback={<PremiumLoadingFallback />}>
                  {ActiveComponent && <ActiveComponent />}
                </Suspense>
              </div>
            </div>
          )}
          <SafetyFooter variant="compact" className="mt-12" />
        </div>
      </div>
    </>
  );
}
