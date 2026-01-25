import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, TrendingUp, TrendingDown, Calendar, Award, ArrowLeft, Minus, RefreshCw, Sparkles } from "lucide-react";
import SEO from "../components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function Analytics() {
  const { data: stats, isLoading, error, refetch } = useQuery({
    queryKey: ["/api/analytics"],
  });

  function getTrendIcon(avg) {
    if (avg >= 7) return (
      <div className="icon-container icon-md icon-soft-sage">
        <TrendingUp className="w-5 h-5" />
      </div>
    );
    if (avg <= 4) return (
      <div className="icon-container icon-md icon-soft-blush">
        <TrendingDown className="w-5 h-5" />
      </div>
    );
    return (
      <div className="icon-container icon-md icon-soft-teal">
        <Minus className="w-5 h-5" />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 hero-premium relative overflow-hidden" role="status" aria-label="Loading analytics">
        <SEO title="Analytics - Loading" description="Loading your wellness analytics" />
        <div className="decorative-orb decorative-orb-sage w-[500px] h-[500px] -top-32 -right-32 absolute" aria-hidden="true" />
        <div className="decorative-orb decorative-orb-blush w-[350px] h-[350px] bottom-20 -left-20 absolute" aria-hidden="true" />
        <div className="content-wrapper relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              <div className="h-10 skeleton-premium w-1/3" aria-hidden="true"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="skeleton-premium-card h-36" aria-hidden="true">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 skeleton-premium rounded-xl"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 skeleton-premium w-1/2"></div>
                        <div className="h-3 skeleton-premium w-1/3"></div>
                      </div>
                    </div>
                    <div className="h-8 skeleton-premium w-1/4"></div>
                  </div>
                ))}
              </div>
            </div>
            <span className="sr-only">Loading your analytics data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 hero-gradient flex items-center justify-center" role="alert">
        <SEO title="Analytics - Error" description="Unable to load analytics" />
        <div className="card-elevated text-center p-8 max-w-md">
          <div className="icon-container icon-lg icon-soft-blush mx-auto mb-4">
            <BarChart3 className="w-8 h-8" />
          </div>
          <h2 className="text-heading-md text-teal mb-2">Unable to load analytics</h2>
          <p className="text-body-sm mb-6">{error.message || "Failed to load analytics"}</p>
          <button
            onClick={() => refetch()}
            className="btn-premium flex items-center gap-2 mx-auto"
            data-testid="button-retry"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <WellnessPageShell
      title="Analytics"
      subtitle="Track your wellness journey"
      benefits={pickBenefits(["agency","calm","clarity","selfRespect","meaning"], 5)}
      clarity={{
        what: "Wellness analytics and insights.",
        why: "To help you notice patterns and growth.",
        who: "For users tracking their wellness journey.",
        when: "Whenever you want to reflect on progress.",
        where: "Right here.",
        how: "View trends, reflect, and celebrate progress."
      }}
      examples={[
        { label: "Beginner", examples: ["Check your mood trends.", "See your journaling streak."] },
        { label: "Intermediate", examples: ["Notice patterns in your data.", "Identify growth areas."] },
        { label: "Advanced", examples: ["Use insights to set goals.", "Track long-term progress."] }
      ]}
    >
    <>
      <SEO 
        title="Analytics - The Genuine Love Project"
        description="View your wellness analytics including mood trends, journal entries, and personal growth insights."
      />
      <div className="min-h-screen p-6 hero-gradient">
        <div className="content-wrapper">
          <div className="max-w-4xl mx-auto">
            <header className="flex items-center gap-4 mb-8">
              <Link 
                href="/dashboard" 
                className="p-3 rounded-xl bg-white border border-[var(--sage-200)] text-[var(--teal-600)] hover:bg-[var(--sage-50)] transition shadow-sm" 
                data-testid="link-back" 
                aria-label="Back to dashboard"
              >
                <ArrowLeft className="w-5 h-5" aria-hidden="true" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="icon-container icon-lg icon-gradient-teal">
                  <BarChart3 className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <h1 className="text-heading-xl text-teal" data-testid="text-title">Analytics</h1>
                  <p className="text-body-sm">Your wellness insights at a glance</p>
                </div>
              </div>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8" aria-label="Analytics overview">
              <article className="card-bordered hover:shadow-lg transition-shadow" data-testid="card-trend">
                <div className="flex items-center gap-4 mb-4">
                  {getTrendIcon(stats?.averageMood)}
                  <div>
                    <h2 className="text-heading-sm text-teal">Mood Trend</h2>
                    <p className="text-body-sm">Your current wellness direction</p>
                  </div>
                </div>
                <p className="text-display-lg text-sage font-bold" aria-label={`Current mood trend: ${stats?.averageMood !== null ? (stats.averageMood >= 7 ? "Positive" : stats.averageMood <= 4 ? "Needs Attention" : "Stable") : "No data"}`}>
                  {stats?.averageMood !== null ? (
                    stats.averageMood >= 7 ? "Positive" : stats.averageMood <= 4 ? "Needs Attention" : "Stable"
                  ) : "No data"}
                </p>
              </article>

              <article className="card-bordered hover:shadow-lg transition-shadow" data-testid="card-entries">
                <div className="flex items-center gap-4 mb-4">
                  <div className="icon-container icon-md icon-soft-teal">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-heading-sm text-teal">Total Mood Entries</h2>
                    <p className="text-body-sm">Entries logged so far</p>
                  </div>
                </div>
                <p className="text-display-lg text-teal font-bold" aria-label={`${stats?.moodCount || 0} total mood entries`}>
                  {stats?.moodCount || 0}
                </p>
              </article>

              <article className="card-bordered hover:shadow-lg transition-shadow" data-testid="card-average">
                <div className="flex items-center gap-4 mb-4">
                  <div className="icon-container icon-md icon-soft-gold">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-heading-sm text-teal">Average Mood Rating</h2>
                    <p className="text-body-sm">Your overall wellness score</p>
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-display-lg text-gold font-bold" aria-label={`Average mood: ${stats?.averageMood !== null ? stats.averageMood : 'no data'} out of 10`}>
                    {stats?.averageMood !== null ? stats.averageMood : "--"}
                  </span>
                  <span className="text-heading-sm text-[var(--teal-400)]" aria-hidden="true">/10</span>
                </div>
              </article>

              <article className="card-bordered hover:shadow-lg transition-shadow" data-testid="card-journal">
                <div className="flex items-center gap-4 mb-4">
                  <div className="icon-container icon-md icon-soft-blush">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-heading-sm text-teal">Journal Entries</h2>
                    <p className="text-body-sm">Reflections written</p>
                  </div>
                </div>
                <p className="text-display-lg text-blush font-bold" aria-label={`${stats?.journalCount || 0} journal entries`}>
                  {stats?.journalCount || 0}
                </p>
              </article>
            </section>

            {stats?.recentMoods && stats.recentMoods.length > 0 && (
              <section className="mb-8" aria-label="Recent mood history chart">
                <div className="card-bordered">
                  <h2 className="text-heading-md text-teal mb-6 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-[var(--sage-500)]" />
                    Recent Mood History
                  </h2>
                  <div className="p-4 rounded-xl bg-[var(--sage-50)]" role="img" aria-label={`Bar chart showing mood ratings over ${stats.recentMoods.length} days`}>
                    <div className="flex items-end justify-between h-32 gap-2">
                      {stats.recentMoods.map((mood, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2" role="presentation">
                          <div
                            className="w-full rounded-t transition-all"
                            style={{ 
                              height: `${(mood.rating / 10) * 100}%`,
                              background: `linear-gradient(to top, var(--sage-400), var(--sage-300))`
                            }}
                            data-testid={`bar-mood-${idx}`}
                            aria-hidden="true"
                          ></div>
                          <span className="text-xs text-[var(--teal-500)]" aria-label={`${new Date(mood.createdAt).toLocaleDateString("en-US", { weekday: "long" })}: mood rating ${mood.rating}`}>
                            {new Date(mood.createdAt).toLocaleDateString("en-US", { weekday: "short" })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}

            <nav className="text-center">
              <Link
                href="/dashboard"
                className="btn-premium inline-flex items-center gap-2"
                data-testid="link-dashboard"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </>
  </WellnessPageShell>
  );
}
