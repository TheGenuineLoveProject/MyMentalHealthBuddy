import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, Smile, Notebook, MessageCircle, Settings, Heart, Sparkles, Sun, Moon, Wind, Target, LogOut, Brain, Compass, ChevronRight, Flame, BookOpen } from 'lucide-react';
import GuardianHeartPanel from "../components/GuardianHeartPanel.tsx";
import SEO from "../components/SEO";
import DailyAffirmations from "../components/DailyAffirmations.jsx";
import DailyInsight from "../components/DailyInsight.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import "../styles/brand.css";
import "../styles/sacred-visuals.css";
import QuoteBlock from "../components/ui/QuoteBlock.jsx";
import { CalendarWidget, ProgressWidget, QuickActionsWidget } from "../components/ui/CRMWidgets.jsx";
import SafetyFooter from "../components/ui/ReflectionFooter";
import NewsletterSignup from "../components/NewsletterSignup";
import MoodHistoryChart from "../components/MoodHistoryChart.jsx";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import { StreakShare } from "@/components/share/StreakShare";
import EmotionAuraRing from "../components/EmotionAuraRing";
import DataExportButton from "../components/DataExportButton";
import ProgressTracker from "../components/ProgressTracker";
import { AchievementsPanel } from "../components/AchievementBadge";
import MoodInsight from "../components/MoodInsight";
import JournalInsights from "../components/JournalInsights";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["/api/dashboard"],
  });

  function handleLogout() {
    logout();
  }

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return { text: "Good morning", icon: Sun, color: "var(--glp-gold)" };
    if (hour < 18) return { text: "Good afternoon", icon: Sun, color: "var(--glp-gold)" };
    return { text: "Good evening", icon: Moon, color: "var(--glp-sage-deep)" };
  }

  if (isLoading) {
    return (
  <WellnessPageShell
    title="Dashboard"
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

      <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, var(--glp-paper), var(--glp-teal-50))' }} role="status" aria-label="Loading dashboard">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="space-y-8 animate-pulse motion-reduce:animate-none">
            <div className="h-12 w-64 rounded-xl" style={{ background: 'var(--glp-sage-10)' }} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="h-40 rounded-2xl" style={{ background: 'var(--glp-sage-10)' }} />
              ))}
            </div>
            <div className="h-32 rounded-2xl" style={{ background: 'var(--glp-sage-10)' }} />
          </div>
          <span className="sr-only">Loading your wellness dashboard...</span>
        </div>
      </div>
    </WellnessPageShell>
    );
  }

  if (error) {
    return (
      <WellnessPageShell
        title="Dashboard Error"
        subtitle="Something went wrong"
        benefits={pickBenefits(["agency","calm","clarity"], 3)}
        clarity={{
          what: "Error loading your dashboard.",
          why: "Sometimes things need a moment.",
          who: "For you.",
          when: "Right now.",
          where: "Here.",
          how: "Try refreshing."
        }}
        examples={[]}
      >
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'linear-gradient(135deg, var(--glp-paper), var(--glp-teal-50))' }} role="alert">
        <div className="rounded-3xl p-10 text-center max-w-md shadow-sm" style={{ background: 'var(--glp-paper)', border: '1px solid var(--glp-sage-20)' }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: 'var(--glp-rose-15)' }}>
            <Heart className="w-8 h-8" style={{ color: 'var(--glp-blush)' }} aria-hidden="true" />
          </div>
          <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--glp-sage-deep)' }}>Unable to load dashboard</h2>
          <p className="mb-6" style={{ color: 'var(--glp-ink)', opacity: 0.7 }}>{error.message || "Something went wrong. Please try again."}</p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium shadow-lg hover:shadow-xl transition-all"
            style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))', boxShadow: '0 4px 16px var(--glp-sage-30)' }}
            data-testid="button-retry"
          >
            Try Again
          </button>
        </div>
      </div>
      </WellnessPageShell>
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
      <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--glp-paper), var(--glp-teal-50))' }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, var(--glp-sage-30), transparent 70%)' }} />
          <div className="absolute bottom-0 -left-32 w-80 h-80 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, var(--glp-rose-20), transparent 70%)' }} />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-10">
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm" style={{ background: 'linear-gradient(135deg, var(--glp-gold-30), var(--glp-gold-10))' }}>
                <GreetingIcon className="w-7 h-7" style={{ color: 'var(--glp-gold)' }} aria-hidden="true" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold tracking-tight" style={{ color: 'var(--glp-sage-deep)' }} data-testid="text-greeting">
                  {greeting.text}, {user?.email?.split("@")[0] || "Friend"}
                </h1>
                <p style={{ color: 'var(--glp-ink)', opacity: 0.6 }} className="mt-0.5">Here's what's available to you today</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link 
                href="/settings" 
                className="p-3 rounded-xl transition-all shadow-sm hover:shadow-md" 
                style={{ background: 'var(--glp-paper)', border: '1px solid var(--glp-sage-20)', color: 'var(--glp-ink)' }}
                data-testid="link-settings" 
                aria-label="Settings"
              >
                <Settings className="w-5 h-5" aria-hidden="true" />
              </Link>
              <button
                onClick={handleLogout}
                className="p-3 rounded-xl transition-all shadow-sm hover:shadow-md"
                style={{ background: 'var(--glp-paper)', border: '1px solid var(--glp-sage-20)', color: 'var(--glp-ink)' }}
                data-testid="button-logout"
                aria-label="Logout"
              >
                <LogOut className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          </header>

          <GuardianHeartPanel name={user?.email?.split("@")[0]} />

          {/* Streak Share Card */}
          {data?.stats?.streak > 0 && (
            <section className="mb-8" aria-label="Your wellness streak" data-testid="section-streak">
              <StreakShare 
                streakDays={data.stats.streak} 
                activityType="wellness practice"
                milestone={[7, 14, 30, 60, 90, 100, 365].includes(data.stats.streak)}
              />
            </section>
          )}

          {/* Daily Healing Focus Card */}
          <section 
            className="mb-8 p-6 rounded-3xl relative overflow-hidden"
            style={{ 
              background: 'linear-gradient(135deg, var(--glp-sage-deep-12), var(--glp-sage-10))',
              border: '2px solid var(--glp-sage-20)'
            }}
            aria-label="Daily healing focus"
            data-testid="section-daily-focus"
          >
            <div 
              className="absolute top-0 left-1/4 right-1/4 h-1 rounded-b-full"
              style={{ background: 'linear-gradient(90deg, var(--glp-sage), var(--glp-gold), var(--glp-blush))' }}
            />
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))' }}
                >
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold" style={{ color: 'var(--glp-ink)' }}>Today's Healing Intention</h2>
                  <p className="mt-1" style={{ color: 'var(--glp-sage)' }}>
                    <em>"Healing isn't about forcing change—it's about creating the conditions where change can happen naturally. Today, be gentle with yourself."</em>
                  </p>
                </div>
              </div>
              <Link href="/today">
                <button 
                  className="px-6 py-3 rounded-full font-semibold text-white transition-all hover:-translate-y-1"
                  style={{ 
                    background: 'linear-gradient(135deg, #2f5d5d, #8fbf9f)',
                    boxShadow: '0 8px 24px rgba(47, 93, 93, 0.3)'
                  }}
                  data-testid="button-start-focus"
                >
                  Begin Focus Session
                </button>
              </Link>
            </div>
          </section>

          {/* Quick Nav to CRM, Q&A, Support */}
          <section className="mb-8 grid grid-cols-3 gap-4" aria-label="Quick navigation" data-testid="section-quick-nav">
            <Link href="/community" className="group" data-testid="link-quick-community" aria-label="Go to Q&A Community">
              <div className="p-4 rounded-2xl transition-all text-center" style={{ background: 'var(--glp-paper)', border: '1px solid var(--glp-sage-15)' }}>
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center" style={{ background: 'var(--glp-gold-30)' }}>
                  <MessageCircle className="w-6 h-6" style={{ color: 'var(--glp-gold)' }} aria-hidden="true" />
                </div>
                <span className="font-semibold transition-colors" style={{ color: 'var(--glp-ink)' }}>Q&A Community</span>
              </div>
            </Link>
            <Link href="/crisis" className="group" data-testid="link-quick-crisis" aria-label="Go to Crisis Support">
              <div className="p-4 rounded-2xl transition-all text-center" style={{ background: 'var(--glp-paper)', border: '1px solid var(--glp-sage-15)' }}>
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center" style={{ background: 'var(--glp-rose-15)' }}>
                  <Heart className="w-6 h-6" style={{ color: 'var(--glp-rose)' }} aria-hidden="true" />
                </div>
                <span className="font-semibold transition-colors" style={{ color: 'var(--glp-ink)' }}>Crisis Support</span>
              </div>
            </Link>
            <Link href="/tools" className="group" data-testid="link-quick-tools" aria-label="Go to Tools Library">
              <div className="p-4 rounded-2xl transition-all text-center" style={{ background: 'var(--glp-paper)', border: '1px solid var(--glp-sage-15)' }}>
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center" style={{ background: 'var(--glp-sage-10)' }}>
                  <Brain className="w-6 h-6" style={{ color: 'var(--glp-sage-deep)' }} aria-hidden="true" />
                </div>
                <span className="font-semibold transition-colors" style={{ color: 'var(--glp-ink)' }}>Tools Library</span>
              </div>
            </Link>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10" aria-label="Wellness statistics">
            <article 
              className="relative overflow-hidden rounded-2xl p-6 text-white shadow-xl"
              style={{ background: 'linear-gradient(135deg, #74C0FC 0%, #4A90D9 100%)', boxShadow: '0 20px 25px -5px rgba(116, 192, 252, 0.25), 0 8px 10px -6px rgba(116, 192, 252, 0.2)' }}
              data-testid="card-mood-score"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                      <Smile className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <span className="font-medium opacity-90">Average Mood</span>
                  </div>
                  {moodData.trend && (
                    <span className="px-3 py-1 rounded-full bg-white/20 text-sm font-medium backdrop-blur-sm">
                      {moodData.trend === "improving" ? "↑ Up" : moodData.trend === "declining" ? "↓ Down" : "→ Stable"}
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-bold" aria-label={`Average mood score: ${moodData.averageMoodLast7Days || '--'} out of 10`}>
                    {moodData.averageMoodLast7Days !== null ? moodData.averageMoodLast7Days : "--"}
                  </span>
                  <span className="text-xl opacity-60">/10</span>
                </div>
                <p className="text-sm text-white/70 mt-2">
                  {moodData.entriesLast7Days || 0} entries this week
                </p>
              </div>
            </article>

            <article 
              className="relative overflow-hidden rounded-2xl p-6 text-white shadow-xl"
              style={{ background: 'linear-gradient(135deg, #C8B6FF 0%, #9B85DB 100%)', boxShadow: '0 20px 25px -5px rgba(200, 182, 255, 0.25), 0 8px 10px -6px rgba(200, 182, 255, 0.2)' }}
              data-testid="card-journal"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                    <Notebook className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <span className="font-medium opacity-90">Journal Entries</span>
                </div>
                <span className="text-4xl font-bold" aria-label={`${journalData.totalEntries || 0} total journal entries`}>
                  {journalData.totalEntries || 0}
                </span>
                <p className="text-sm text-white/70 mt-2">Total entries written</p>
              </div>
            </article>

            <ReflectionCard />
          </section>

          {/* Mood History Visual */}
          <section 
            className="mb-8 p-6 rounded-2xl"
            style={{ background: 'var(--glp-paper)', border: '1px solid var(--glp-sage-15)' }}
            aria-label="Your mood history"
            data-testid="section-mood-history"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2" style={{ color: 'var(--glp-ink)' }}>
                <BarChart3 className="w-4 h-4" style={{ color: 'var(--glp-sage)' }} aria-hidden="true" />
                Your Week at a Glance
              </h3>
              <Link 
                href="/analytics" 
                className="text-sm transition-colors"
                style={{ color: 'var(--glp-sage)' }}
                data-testid="link-full-analytics"
              >
                View Full Analytics →
              </Link>
            </div>
            <MoodHistoryChart />
          </section>

          {/* Emotion Aura & Export */}
          <section 
            className="mb-8 p-6 rounded-2xl"
            style={{ background: 'var(--glp-paper)', border: '1px solid var(--glp-sage-15)' }}
            aria-label="Emotion visualization and data export"
            data-testid="section-emotion-aura"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2" style={{ color: 'var(--glp-ink)' }}>
                <Heart className="w-4 h-4" style={{ color: 'var(--glp-sage)' }} aria-hidden="true" />
                Your Emotional Spectrum
              </h3>
              <DataExportButton dataType="all" />
            </div>
            <div className="flex justify-center">
              <EmotionAuraRing size={180} strokeWidth={14} />
            </div>
          </section>

          <Link 
            href="/today" 
            className="block mb-10 p-5 rounded-2xl bg-gradient-to-r from-sage-50 to-teal-50/50 border border-sage-200/50 hover:border-sage-300 transition-all group shadow-sm"
            data-testid="link-today"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-sm" style={{ background: 'var(--glp-paper)' }}>
                  <Heart className="w-5 h-5" style={{ color: 'var(--glp-sage)' }} />
                </div>
                <div>
                  <h2 className="font-semibold transition-colors" style={{ color: 'var(--glp-ink)' }}>
                    Your Space Today
                  </h2>
                  <p className="text-sm mt-0.5" style={{ color: 'var(--glp-sage)' }}>
                    A place to pause, notice, and reflect
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 transition-all" style={{ color: 'var(--glp-sage)' }} />
            </div>
          </Link>

          <section aria-label="Quick actions" className="mb-10">
            <h2 className="text-lg font-semibold mb-5 flex items-center gap-2" style={{ color: 'var(--glp-ink)' }}>
              <Sparkles className="w-5 h-5" style={{ color: 'var(--glp-gold)' }} aria-hidden="true" />
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <QuickAction 
                href="/mood" 
                icon={Smile} 
                label="Track Mood" 
                color="sky"
                testId="link-mood"
              />
              <QuickAction 
                href="/journal" 
                icon={Notebook} 
                label="Write Journal" 
                color="violet"
                testId="link-journal"
              />
              <QuickAction 
                href="/chat" 
                icon={MessageCircle} 
                label="AI Chat" 
                color="teal"
                testId="link-chat"
              />
              <QuickAction 
                href="/analytics" 
                icon={BarChart3} 
                label="Analytics" 
                color="amber"
                testId="link-analytics"
              />
            </div>
          </section>

          <section aria-label="Explore more" className="mb-10">
            <h2 className="text-lg font-semibold mb-5" style={{ color: 'var(--glp-ink)' }}>Explore</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ExploreCard 
                href="/wellness" 
                icon={Wind} 
                title="Wellness Tools" 
                description="Breathing, grounding & relaxation"
                color="emerald"
                testId="link-wellness"
              />
              <ExploreCard 
                href="/atlas" 
                icon={Compass} 
                title="Intellectual Atlas" 
                description="Explore knowledge domains"
                color="cyan"
                testId="link-atlas"
              />
              <ExploreCard 
                href="/hubs/habits" 
                icon={Target} 
                title="Daily Habits" 
                description="Build healthy routines"
                color="orange"
                testId="link-habits"
              />
              <ExploreCard 
                href="/growth-analytics" 
                icon={Brain} 
                title="Growth Analytics" 
                description="Track your progress"
                color="violet"
                testId="link-growth"
              />
              <ExploreCard 
                href="/blog" 
                icon={BookOpen} 
                title="Read the Blog" 
                description="Articles on healing & growth"
                color="emerald"
                testId="link-dashboard-blog"
              />
            </div>
          </section>

          <section className="mb-10" aria-label="Daily affirmation">
            <DailyAffirmations compact />
          </section>

          <section className="mb-10" aria-label="Progress tracking">
            <h2 className="text-lg font-semibold mb-5" style={{ color: 'var(--glp-ink)' }}>Your Progress</h2>
            <ProgressTracker />
          </section>

          <section className="mb-10" aria-label="Achievements">
            <h2 className="text-lg font-semibold mb-5" style={{ color: 'var(--glp-ink)' }}>Sacred Achievements</h2>
            <AchievementsPanel />
          </section>

          <section className="mb-10" aria-label="Mood insights">
            <h2 className="text-lg font-semibold mb-5" style={{ color: 'var(--glp-ink)' }}>Your Inner Wisdom</h2>
            <MoodInsight />
          </section>

          <section className="mb-10" aria-label="Journal insights">
            <h2 className="text-lg font-semibold mb-5" style={{ color: 'var(--glp-ink)' }}>Journal Journey</h2>
            <JournalInsights />
          </section>

          <Link 
            href="/crisis" 
            className="flex items-center justify-between p-5 rounded-2xl transition-all group shadow-sm mb-10"
            style={{ background: 'var(--glp-rose-15)', border: '1px solid var(--glp-rose)' }}
            data-testid="link-crisis-resources"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-sm" style={{ background: 'var(--glp-paper)' }}>
                <Heart className="w-5 h-5" style={{ color: 'var(--glp-rose)' }} aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-semibold" style={{ color: 'var(--glp-rose-dark)' }}>Crisis Resources</h3>
                <p className="text-sm" style={{ color: 'var(--glp-rose)', opacity: 0.8 }}>24/7 support when you need it most</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 transition-all" style={{ color: 'var(--glp-rose)' }} aria-hidden="true" />
          </Link>

          {moodData.recentMoods && moodData.recentMoods.length > 0 && (
            <section className="mb-10" aria-label="Recent mood history">
              <h2 className="text-lg font-semibold mb-5" style={{ color: 'var(--glp-ink)' }}>Recent Moods</h2>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide" role="list">
                {moodData.recentMoods.map((mood, idx) => (
                  <div
                    key={idx}
                    className="flex-shrink-0 rounded-xl p-4 text-center min-w-[80px] transition-all"
                    style={{ background: 'var(--glp-paper)', border: '1px solid var(--glp-sage-15)' }}
                    data-testid={`mood-entry-${idx}`}
                    role="listitem"
                  >
                    <div className="text-2xl font-bold" style={{ color: 'var(--glp-sage-deep)' }}>
                      {mood.rating}
                    </div>
                    <div className="text-xs mt-1 font-medium" style={{ color: 'var(--glp-sage)' }}>
                      {new Date(mood.createdAt).toLocaleDateString("en-US", { weekday: "short" })}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <DailyInsight />

          {/* CRM Widgets Section */}
          <section className="mt-8 space-y-6" aria-label="Personal wellness hub">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--glp-ink)' }}>Your Wellness Hub</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <QuickActionsWidget />
              <CalendarWidget />
              <ProgressWidget />
            </div>
            
            {/* Daily Inspiration Quote */}
            <div className="mt-6">
              <QuoteBlock variant="card" />
            </div>
          </section>

          <section className="mt-8" data-testid="section-dashboard-newsletter">
            <NewsletterSignup source="/dashboard" />
          </section>

          <SafetyFooter variant="compact" className="mt-8" />
        </div>
      </div>
    </>
  );
}

function QuickAction({ href, icon: Icon, label, color, testId }) {
  const colorMap = {
    sky: { bg: 'var(--glp-sage-10)', icon: 'var(--glp-sage-deep)' },
    violet: { bg: 'var(--glp-sage-15)', icon: 'var(--glp-sage-deep)' },
    teal: { bg: 'var(--glp-sage-10)', icon: 'var(--glp-sage)' },
    amber: { bg: 'var(--glp-gold-30)', icon: 'var(--glp-gold)' },
  };
  const colors = colorMap[color] || colorMap.sky;

  return (
    <Link 
      href={href} 
      className="flex flex-col items-center gap-3 p-5 rounded-xl hover:shadow-md transition-all group"
      style={{ background: 'var(--glp-paper)', border: '1px solid var(--glp-sage-15)' }}
      data-testid={testId}
    >
      <div className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform" style={{ background: colors.bg }}>
        <Icon className="w-6 h-6" style={{ color: colors.icon }} aria-hidden="true" />
      </div>
      <span className="text-sm font-medium" style={{ color: 'var(--glp-ink)' }}>{label}</span>
    </Link>
  );
}

function ExploreCard({ href, icon: Icon, title, description, color, testId }) {
  const colorMap = {
    emerald: { bg: 'var(--glp-sage-10)', icon: 'var(--glp-sage)' },
    cyan: { bg: 'var(--glp-sage-10)', icon: 'var(--glp-sage-deep)' },
    orange: { bg: 'var(--glp-gold-30)', icon: 'var(--glp-gold)' },
    violet: { bg: 'var(--glp-sage-15)', icon: 'var(--glp-sage-deep)' },
  };
  const colors = colorMap[color] || colorMap.emerald;

  return (
    <Link 
      href={href} 
      className="flex items-center gap-4 p-4 rounded-xl hover:shadow-sm transition-all group"
      style={{ background: 'var(--glp-paper)', border: '1px solid var(--glp-sage-15)' }}
      data-testid={testId}
    >
      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: colors.bg }}>
        <Icon className="w-5 h-5" style={{ color: colors.icon }} aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <h3 className="font-medium" style={{ color: 'var(--glp-ink)' }}>{title}</h3>
        <p className="text-sm truncate" style={{ color: 'var(--glp-sage)' }}>{description}</p>
      </div>
      <ChevronRight className="w-5 h-5 transition-all flex-shrink-0 ml-auto" style={{ color: 'var(--glp-sage)' }} />
    </Link>
  );
}

function getReflectionStreak() {
  try {
    const entries = JSON.parse(localStorage.getItem("glp_reflections") || "[]");
    if (!entries.length) return { current: 0, reflectedToday: false, totalEntries: 0 };
    const ONE_DAY = 86400000;
    const toDay = (s) => { const d = new Date(s); return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime(); };
    const days = [...new Set(entries.map((e) => toDay(e.date)))].sort((a, b) => b - a);
    const todayTs = toDay(new Date().toISOString());
    const reflectedToday = days[0] === todayTs;
    let current = 0;
    let expected = reflectedToday ? todayTs : todayTs - ONE_DAY;
    for (const ts of days) {
      if (ts === expected) { current++; expected -= ONE_DAY; }
      else if (ts < expected) break;
    }
    return { current, reflectedToday, totalEntries: entries.length };
  } catch { return { current: 0, reflectedToday: false, totalEntries: 0 }; }
}

function ReflectionCard() {
  const info = getReflectionStreak();
  const totalXp = parseInt(localStorage.getItem("glp_reflection_xp") || "0", 10);

  const flameColor = info.current >= 14 ? "from-orange-400 to-red-500"
    : info.current >= 7 ? "from-yellow-400 to-orange-500"
    : info.current >= 3 ? "from-amber-300 to-yellow-500"
    : "from-gray-300 to-gray-400";

  return (
    <Link
      href="/reflection"
      className="block rounded-2xl p-6 transition-all hover:shadow-md group"
      style={{ background: 'var(--glp-paper)', border: '1px solid var(--glp-sage-15)' }}
      data-testid="link-daily-reflection"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'var(--glp-sage-10)' }}>
          <Compass className="w-5 h-5" style={{ color: 'var(--glp-sage)' }} aria-hidden="true" />
        </div>
        <h3 className="font-semibold" style={{ color: 'var(--glp-ink)' }}>Daily Reflection</h3>
      </div>

      <p className="text-sm mb-3" style={{ color: 'var(--glp-sage)' }}>
        {info.reflectedToday
          ? "You've reflected today — beautiful."
          : "Pause, reflect, and gently check in with yourself."}
      </p>

      {(info.current > 0 || totalXp > 0) && (
        <div className="flex items-center gap-4 pt-2" style={{ borderTop: '1px solid var(--glp-sage-10)' }}>
          {info.current > 0 && (
            <div className="flex items-center gap-1.5" data-testid="text-dashboard-streak">
              <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${flameColor} flex items-center justify-center`}>
                <Flame className="w-3.5 h-3.5 text-white" aria-hidden="true" />
              </div>
              <span className="text-sm font-semibold" style={{ color: 'var(--glp-ink)' }}>{info.current}</span>
              <span className="text-xs" style={{ color: 'var(--glp-sage)' }}>day streak</span>
            </div>
          )}
          {totalXp > 0 && (
            <div className="flex items-center gap-1" data-testid="text-dashboard-xp">
              <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--glp-gold, #d4a574)' }} aria-hidden="true" />
              <span className="text-xs font-semibold" style={{ color: 'var(--glp-gold, #d4a574)' }}>{totalXp} XP</span>
            </div>
          )}
          {info.totalEntries > 0 && (
            <span className="text-xs ml-auto" style={{ color: 'var(--glp-sage)', opacity: 0.7 }} data-testid="text-dashboard-reflection-count">
              {info.totalEntries} reflection{info.totalEntries !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
