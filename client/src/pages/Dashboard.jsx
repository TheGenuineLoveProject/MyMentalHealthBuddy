import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, Smile, Notebook, MessageCircle, TrendingUp, TrendingDown, Minus, Settings, Heart, Sparkles, ArrowRight, Sun, Moon, Wind, Target, LogOut, Brain, Compass } from "lucide-react";
import GuardianHeartPanel from "../components/GuardianHeartPanel.tsx";
import SEO from "../components/SEO";
import DailyAffirmations from "../components/DailyAffirmations.jsx";
import DailyInsight from "../components/DailyInsight.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import "../styles/brand.css";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["/api/dashboard"],
  });

  function handleLogout() {
    logout();
    setLocation("/login");
  }

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return { text: "Good morning", icon: Sun, color: "text-amber-400" };
    if (hour < 18) return { text: "Good afternoon", icon: Sun, color: "text-orange-400" };
    return { text: "Good evening", icon: Moon, color: "text-indigo-400" };
  }

  function getTrendIcon(trend) {
    if (trend === "improving") return (
      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10 text-green-400 text-sm font-medium">
        <TrendingUp className="w-4 h-4" aria-hidden="true" />
        <span>Improving</span>
      </div>
    );
    if (trend === "declining") return (
      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/10 text-red-400 text-sm font-medium">
        <TrendingDown className="w-4 h-4" aria-hidden="true" />
        <span>Declining</span>
      </div>
    );
    return (
      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-neutral-500/10 text-neutral-400 text-sm font-medium">
        <Minus className="w-4 h-4" aria-hidden="true" />
        <span>Stable</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 bg-gradient-mesh" role="status" aria-label="Loading dashboard">
        <div className="max-w-5xl mx-auto">
          <div className="space-y-6">
            <div className="skeleton h-12 w-1/3 rounded-xl"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="skeleton-card"></div>
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="skeleton h-28 rounded-xl"></div>
              ))}
            </div>
          </div>
          <span className="sr-only">Loading your wellness dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 bg-gradient-mesh flex items-center justify-center" role="alert">
        <div className="card-elevated p-8 text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-[var(--accent-rose-soft)] flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-[var(--accent-rose)]" aria-hidden="true" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Unable to load dashboard</h2>
          <p className="text-[var(--text-secondary)] mb-6">{error.message || "Something went wrong. Please try again."}</p>
          <button
            onClick={() => refetch()}
            className="btn btn-primary"
            data-testid="button-retry"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const moodData = data?.moodSummary || {};
  const journalData = data?.journalSummary || {};
  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;

  return (
    <>
      <SEO 
        title="Dashboard"
        description="View your wellness overview, mood trends, and journal entries. Track your mental health journey with The Genuine Love Project."
      />
      <div className="min-h-screen p-6 hero-gradient">
        <div className="max-w-5xl mx-auto">
          <header className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="icon-container icon-xl icon-gradient-sage">
                <GreetingIcon className="w-7 h-7" aria-hidden="true" />
              </div>
              <div>
                <h1 className="text-display-lg text-teal" data-testid="text-greeting">
                  {greeting.text}, {user?.email?.split("@")[0] || "Friend"}
                </h1>
                <p className="text-lead">Here's your wellness overview</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link 
                href="/settings" 
                className="p-3 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text)] hover:border-[var(--primary-light)] transition shadow-sm" 
                data-testid="link-settings" 
                aria-label="Settings"
              >
                <Settings className="w-5 h-5" aria-hidden="true" />
              </Link>
              <button
                onClick={handleLogout}
                className="p-3 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--accent-rose)] hover:border-[var(--accent-rose)] transition shadow-sm"
                data-testid="button-logout"
                aria-label="Logout"
              >
                <LogOut className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          </header>

          <GuardianHeartPanel name={user?.email?.split("@")[0]} />

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8" aria-label="Wellness statistics">
            <article 
              className="stat-card bg-gradient-to-br from-[var(--accent-sky)] to-blue-600 text-white shadow-lg"
              data-testid="card-mood-score"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                    <Smile className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <h2 className="text-lg font-semibold opacity-90">Average Mood</h2>
                </div>
                {moodData.trend && (
                  <div className="px-3 py-1.5 rounded-full bg-white/20 text-sm font-medium backdrop-blur-sm">
                    {moodData.trend === "improving" ? "↑ Improving" : moodData.trend === "declining" ? "↓ Declining" : "→ Stable"}
                  </div>
                )}
              </div>
              <div className="flex items-baseline gap-2">
                <span 
                  className="stat-value" 
                  aria-label={`Average mood score: ${moodData.averageMoodLast7Days !== null ? moodData.averageMoodLast7Days : 'no data'} out of 10`}
                >
                  {moodData.averageMoodLast7Days !== null ? moodData.averageMoodLast7Days : "--"}
                </span>
                <span className="text-2xl opacity-70">/10</span>
              </div>
              <p className="stat-label text-white/70 mt-3">
                {moodData.entriesLast7Days || 0} entries this week
              </p>
            </article>

            <article 
              className="stat-card bg-gradient-to-br from-[var(--primary)] to-purple-600 text-white shadow-lg"
              data-testid="card-journal"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <Notebook className="w-6 h-6" aria-hidden="true" />
                </div>
                <h2 className="text-lg font-semibold opacity-90">Journal Entries</h2>
              </div>
              <span 
                className="stat-value" 
                aria-label={`${journalData.totalEntries || 0} total journal entries`}
              >
                {journalData.totalEntries || 0}
              </span>
              <p className="stat-label text-white/70 mt-3">Total entries written</p>
            </article>
          </section>

          {/* Your Space Today - Primary Entry Point */}
          <Link 
            href="/today" 
            className="block mb-8 p-6 rounded-2xl bg-gradient-to-br from-[var(--glp-sage)]/10 to-[var(--glp-sage)]/5 border border-[var(--glp-sage)]/20 hover:border-[var(--glp-sage)]/40 transition-all group"
            data-testid="link-today"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium text-[var(--glp-ink)] group-hover:text-[var(--glp-sage-deep)] transition-colors">
                  Your Space Today
                </h2>
                <p className="text-sm text-[var(--glp-ink)]/50 mt-1">
                  A place to pause, notice, and reflect — only if it feels supportive.
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-[var(--glp-ink)]/30 group-hover:text-[var(--glp-sage-deep)] group-hover:translate-x-1 transition-all" />
            </div>
          </Link>

          <nav aria-label="Quick actions" className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[var(--primary)]" aria-hidden="true" />
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/mood" className="quick-action group" data-testid="link-mood">
                <div className="quick-action-icon bg-[var(--accent-sky-soft)]">
                  <Smile className="w-6 h-6 text-[var(--accent-sky)]" aria-hidden="true" />
                </div>
                <span className="font-medium">Track Mood</span>
                <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--primary)] group-hover:translate-x-1 transition-all mt-1" aria-hidden="true" />
              </Link>

              <Link href="/journal" className="quick-action group" data-testid="link-journal">
                <div className="quick-action-icon bg-[var(--primary-soft)]">
                  <Notebook className="w-6 h-6 text-[var(--primary)]" aria-hidden="true" />
                </div>
                <span className="font-medium">Write Journal</span>
                <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--primary)] group-hover:translate-x-1 transition-all mt-1" aria-hidden="true" />
              </Link>

              <Link href="/chat" className="quick-action group" data-testid="link-chat">
                <div className="quick-action-icon bg-[var(--accent-teal-soft)]">
                  <MessageCircle className="w-6 h-6 text-[var(--accent-teal)]" aria-hidden="true" />
                </div>
                <span className="font-medium">AI Chat</span>
                <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--primary)] group-hover:translate-x-1 transition-all mt-1" aria-hidden="true" />
              </Link>

              <Link href="/analytics" className="quick-action group" data-testid="link-analytics">
                <div className="quick-action-icon bg-[var(--accent-amber-soft)]">
                  <BarChart3 className="w-6 h-6 text-[var(--accent-amber)]" aria-hidden="true" />
                </div>
                <span className="font-medium">Analytics</span>
                <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--primary)] group-hover:translate-x-1 transition-all mt-1" aria-hidden="true" />
              </Link>

              <Link href="/wellness" className="quick-action group" data-testid="link-wellness">
                <div className="quick-action-icon bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30">
                  <Wind className="w-6 h-6 text-emerald-500" aria-hidden="true" />
                </div>
                <span className="font-medium">Wellness Tools</span>
                <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-emerald-500 group-hover:translate-x-1 transition-all mt-1" aria-hidden="true" />
              </Link>

              <Link href="/wellness#habits" className="quick-action group" data-testid="link-habits">
                <div className="quick-action-icon bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30">
                  <Target className="w-6 h-6 text-orange-500" aria-hidden="true" />
                </div>
                <span className="font-medium">Daily Habits</span>
                <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-orange-500 group-hover:translate-x-1 transition-all mt-1" aria-hidden="true" />
              </Link>

              <Link href="/atlas" className="quick-action group" data-testid="link-atlas">
                <div className="quick-action-icon bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30">
                  <Compass className="w-6 h-6 text-cyan-500" aria-hidden="true" />
                </div>
                <span className="font-medium">Intellectual Atlas</span>
                <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-cyan-500 group-hover:translate-x-1 transition-all mt-1" aria-hidden="true" />
              </Link>

              <Link href="/growth-analytics" className="quick-action group" data-testid="link-growth">
                <div className="quick-action-icon bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30">
                  <Brain className="w-6 h-6 text-violet-500" aria-hidden="true" />
                </div>
                <span className="font-medium">Growth Analytics</span>
                <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-violet-500 group-hover:translate-x-1 transition-all mt-1" aria-hidden="true" />
              </Link>
            </div>
          </nav>

          <section className="mb-8" aria-label="Daily affirmation">
            <DailyAffirmations compact />
          </section>

          <div className="card-elevated p-5 bg-gradient-to-r from-[var(--accent-rose-soft)] to-transparent border-[var(--accent-rose)]/30 mb-8">
            <Link href="/crisis" className="flex items-center justify-between group" data-testid="link-crisis-resources">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--accent-rose-soft)] flex items-center justify-center">
                  <Heart className="w-6 h-6 text-[var(--accent-rose)]" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--accent-rose)]">Crisis Resources</h3>
                  <p className="text-sm text-[var(--text-secondary)]">24/7 support hotlines and help when you need it most</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-[var(--accent-rose)] group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Link>
          </div>

          {moodData.recentMoods && moodData.recentMoods.length > 0 && (
            <section className="mb-8" aria-label="Recent mood history">
              <h2 className="text-xl font-semibold mb-4">Recent Moods</h2>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide" role="list" aria-label="Mood entries from recent days">
                {moodData.recentMoods.map((mood, idx) => (
                  <div
                    key={idx}
                    className="flex-shrink-0 card p-4 text-center min-w-[90px] hover:scale-105 transition-transform"
                    data-testid={`mood-entry-${idx}`}
                    role="listitem"
                    aria-label={`Mood rating ${mood.rating} on ${new Date(mood.createdAt).toLocaleDateString("en-US", { weekday: "long" })}`}
                  >
                    <div 
                      className="text-3xl font-bold bg-gradient-to-br from-[var(--accent-sky)] to-[var(--primary)] bg-clip-text text-transparent" 
                      aria-hidden="true"
                    >
                      {mood.rating}
                    </div>
                    <div className="text-xs text-[var(--text-secondary)] mt-1 font-medium" aria-hidden="true">
                      {new Date(mood.createdAt).toLocaleDateString("en-US", { weekday: "short" })}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <DailyInsight />
        </div>
      </div>
    </>
  );
}
