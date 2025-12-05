import { useState, useEffect, lazy, Suspense } from "react";
import { Link } from "wouter";
import { 
  Sparkles, ArrowLeft, Crown, Star, Target, BarChart3,
  Brain, Heart, Calendar, Bell, ChevronRight, Zap, Loader2
} from "lucide-react";
import SEO from "../components/SEO.jsx";

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
  <div className="flex items-center justify-center min-h-[300px] bg-white/80 dark:bg-gray-800/80 rounded-2xl backdrop-blur-sm">
    <div className="flex flex-col items-center gap-3">
      <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
      <p className="text-sm text-gray-500 dark:text-gray-400">Loading premium feature...</p>
    </div>
  </div>
);

const PREMIUM_FEATURES = [
  {
    id: "journeys",
    name: "Healing Journeys",
    description: "Structured therapeutic programs for lasting transformation",
    icon: Sparkles,
    color: "from-violet-500 to-purple-600",
    component: HealingJourneys
  },
  {
    id: "analytics",
    name: "Progress Analytics",
    description: "Comprehensive insights into your wellness journey",
    icon: BarChart3,
    color: "from-emerald-500 to-teal-600",
    component: ProgressAnalytics
  },
  {
    id: "goals",
    name: "Goal Tracker",
    description: "Set and achieve your wellness objectives",
    icon: Target,
    color: "from-amber-500 to-orange-600",
    component: WellnessGoalTracker
  },
  {
    id: "concierge",
    name: "AI Concierge",
    description: "Personalized recommendations powered by AI",
    icon: Brain,
    color: "from-blue-500 to-indigo-600",
    component: AIWellnessConcierge
  },
  {
    id: "planner",
    name: "Daily Planner",
    description: "Plan your wellness activities for each day",
    icon: Calendar,
    color: "from-rose-500 to-pink-600",
    component: DailyWellnessPlanner
  },
  {
    id: "timer",
    name: "Wellness Timer",
    description: "Timed sessions for mindful practice",
    icon: Bell,
    color: "from-indigo-500 to-purple-600",
    component: WellnessTimer
  },
  {
    id: "mood",
    name: "Mood Visualizer",
    description: "Explore your emotional patterns visually",
    icon: Heart,
    color: "from-pink-500 to-rose-600",
    component: MoodVisualizer
  },
  {
    id: "breathing",
    name: "Mindful Breathing",
    description: "Advanced breathing exercises with patterns",
    icon: Zap,
    color: "from-cyan-500 to-blue-600",
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
          <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading pricing options...</p>
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

      <div className="min-h-screen bg-[var(--bg)]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--primary)]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-[var(--accent-rose)]/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/dashboard"
              className="p-2 rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--text)] transition-all"
              data-testid="link-back-dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex-1">
              <h1 className="text-3xl font-display font-bold text-[var(--text)] flex items-center gap-3" data-testid="text-premium-title">
                <Crown className="w-8 h-8 text-amber-500" />
                Premium Features
              </h1>
              <p className="text-[var(--text-secondary)]">
                Unlock your full wellness potential
              </p>
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
                  <h3 className="font-semibold text-[var(--text)] mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500" />
                    Premium Tools
                  </h3>
                  {PREMIUM_FEATURES.map(feature => {
                    const Icon = feature.icon;
                    const isActive = activeFeature === feature.id;

                    return (
                      <button
                        key={feature.id}
                        onClick={() => setActiveFeature(feature.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left mb-2 ${
                          isActive
                            ? `bg-gradient-to-r ${feature.color} text-white`
                            : "hover:bg-[var(--surface)] text-[var(--text)]"
                        }`}
                        data-testid={`feature-${feature.id}`}
                      >
                        <div className={`p-2 rounded-lg ${
                          isActive ? "bg-white/20" : `bg-gradient-to-br ${feature.color} text-white`
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{feature.name}</p>
                          <p className={`text-xs truncate ${isActive ? "text-white/80" : "text-[var(--text-secondary)]"}`}>
                            {feature.description}
                          </p>
                        </div>
                        <ChevronRight className={`w-4 h-4 ${isActive ? "text-white" : "text-[var(--text-secondary)]"}`} />
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
        </div>
      </div>
    </>
  );
}
