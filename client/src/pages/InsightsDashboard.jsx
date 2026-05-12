import { useState, lazy, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sparkles, Heart, Flower2, BookOpen, Sun, Moon, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import { Link } from "wouter";
import ReflectionInsights from "@/components/ReflectionInsights.jsx";
import EmotionAuraRing from "@/components/EmotionAuraRing.jsx";
// v5.8.35 perf: GratitudePrompt is heavy + below-the-fold here, lazy it.
const GratitudePrompt = lazy(() => import("@/components/GratitudePrompt.jsx"));
import SacredQuote from "@/components/SacredQuote.jsx";
import AffirmationDeck from "@/components/AffirmationDeck.jsx";
import "@/styles/sacred-visuals.css";

export default function InsightsDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const { data: summary, isLoading: summaryLoading, isError: summaryError, refetch: refetchSummary } = useQuery({
    queryKey: ["/api/gratitude/weekly-summary"],
    staleTime: 1000 * 60 * 5
  });

  const { data: completionStats, isLoading: statsLoading, isError: statsError, refetch: refetchStats } = useQuery({
    queryKey: ["/api/community/completion-stats"],
    staleTime: 1000 * 60 * 10
  });

  const isLoading = summaryLoading || statsLoading;
  const hasError = summaryError || statsError;

  const handleRetry = () => {
    if (summaryError) refetchSummary();
    if (statsError) refetchStats();
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Sun },
    { id: "gratitude", label: "Gratitude", icon: Heart },
    { id: "affirmations", label: "Affirmations", icon: Sparkles },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-sunrise dark:bg-sunrise" role="status" aria-busy="true" aria-label="Loading insights dashboard">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gray-200 dark:bg-gray-700" />
              <div className="space-y-2">
                <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
            <div className="flex gap-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-10 w-28 bg-gray-200 dark:bg-gray-700 rounded-xl" />
              ))}
            </div>
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
            </div>
          </div>
          <span className="sr-only">Loading your insights...</span>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-screen bg-sunrise dark:bg-sunrise flex items-center justify-center" role="alert" aria-live="assertive">
        <div className="text-center p-8 max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-rose-500" aria-hidden="true" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Unable to load insights</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Please try again in a moment.</p>
          <button
            onClick={handleRetry}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-rose-400 text-white font-medium hover:shadow-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            data-testid="button-retry"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sunrise dark:bg-sunrise">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-rose-400 flex items-center justify-center shadow-lg lotus-blossom">
              <Flower2 className="w-6 h-6 text-white" />
              <div className="absolute inset-0 rounded-2xl lotus-glow opacity-60" />
            </div>
            <div>
              <h1 className="text-3xl font-playfair font-bold text-gray-800 dark:text-white">
                Insights Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Your sacred space for reflection and growth
              </p>
            </div>
          </div>

          {completionStats?.eligibleForCelebration && (
            <Link
              href="/celebration"
              className="block mt-4 p-4 rounded-xl bg-gradient-to-r from-amber-400 to-rose-400 text-white cursor-pointer hover:shadow-lg transition-all group no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
              data-testid="link-celebration-banner"
              aria-label="Celebration unlocked — claim your self-love ritual"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl" aria-hidden="true">🎉</span>
                  <div>
                    <p className="font-semibold no-underline">Celebration Unlocked!</p>
                    <p className="text-sm opacity-90 no-underline">You've reached a milestone. Claim your self-love ritual.</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          )}
        </header>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-white dark:bg-gray-800 shadow-md text-amber-600 dark:text-amber-400"
                  : "text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800/50"
              }`}
              data-testid={`tab-${tab.id}`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <ReflectionInsights className="shadow-lg" />
              
              <div className="grid sm:grid-cols-2 gap-4">
                <QuickStatCard
                  icon={BookOpen}
                  title="Total Entries"
                  value={summary?.journalCount || 0}
                  subtitle="this week"
                  color="violet"
                />
                <QuickStatCard
                  icon={Heart}
                  title="Gratitude"
                  value={summary?.gratitudeCount || 0}
                  subtitle="reflections"
                  color="rose"
                />
              </div>
            </div>

            <div className="space-y-6">
              <SacredQuote />
              
              <div className="p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <Moon className="w-5 h-5 text-indigo-500" />
                  Emotional Aura
                </h3>
                <EmotionAuraRing size={180} />
              </div>

              <Link
                href="/community"
                className="block p-4 rounded-xl bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 cursor-pointer hover:shadow-md transition group no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2"
                data-testid="link-community"
                aria-label="Community Circle — share and receive wisdom"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-violet-800 dark:text-violet-300 no-underline">Community Circle</p>
                    <p className="text-sm text-violet-600 dark:text-violet-400 no-underline">Share and receive wisdom</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-violet-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>
          </div>
        )}

        {activeTab === "gratitude" && (
          <div className="max-w-2xl mx-auto">
            <Suspense fallback={null}><GratitudePrompt expanded /></Suspense>
          </div>
        )}

        {activeTab === "affirmations" && (
          <div className="max-w-2xl mx-auto">
            <AffirmationDeck />
          </div>
        )}
      </div>
    </div>
  );
}

function QuickStatCard({ icon: Icon, title, value, subtitle, color }) {
  const colors = {
    violet: "from-violet-500 to-purple-500",
    rose: "from-rose-500 to-pink-500",
    amber: "from-amber-500 to-orange-500"
  };

  return (
    <div className="p-5 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <span className="text-sm text-gray-600 dark:text-gray-400">{title}</span>
      </div>
      <p className="text-3xl font-bold text-gray-800 dark:text-white">{value}</p>
      <p className="text-xs text-gray-500 dark:text-gray-500">{subtitle}</p>
    </div>
  );
}
