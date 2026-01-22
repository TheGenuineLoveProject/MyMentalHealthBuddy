import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  BarChart3, Smile, Notebook, MessageCircle, TrendingUp, TrendingDown, Minus, 
  Settings, Heart, Sparkles, ArrowRight, Sun, Moon, Wind, Target, LogOut, 
  Brain, Compass, ChevronRight
} from "lucide-react";
import GuardianHeartPanel from "../components/GuardianHeartPanel.tsx";
import SEO from "../components/SEO";
import DailyAffirmations from "../components/DailyAffirmations.jsx";
import DailyInsight from "../components/DailyInsight.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import "../styles/brand.css";
import QuoteBlock from "../components/ui/QuoteBlock.jsx";
import { CalendarWidget, ProgressWidget, QuickActionsWidget } from "../components/ui/CRMWidgets.jsx";

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sage-50/30" role="status" aria-label="Loading dashboard">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="space-y-8 animate-pulse">
            <div className="h-12 w-64 bg-slate-100 rounded-xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="h-40 bg-slate-100 rounded-2xl" />
              ))}
            </div>
            <div className="h-32 bg-slate-100 rounded-2xl" />
          </div>
          <span className="sr-only">Loading your wellness dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sage-50/30 flex items-center justify-center p-6" role="alert">
        <div className="bg-white rounded-3xl p-10 text-center max-w-md shadow-sm border border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center mx-auto mb-5">
            <Heart className="w-8 h-8 text-rose-500" aria-hidden="true" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Unable to load dashboard</h2>
          <p className="text-slate-500 mb-6">{error.message || "Something went wrong. Please try again."}</p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 text-white font-medium shadow-lg shadow-teal-500/25 hover:shadow-xl transition-all"
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sage-50/30 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-teal-100/40 to-sage-100/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -left-32 w-80 h-80 bg-gradient-to-tr from-amber-50/40 to-rose-50/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-10">
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-50 flex items-center justify-center shadow-sm">
                <GreetingIcon className="w-7 h-7 text-amber-500" aria-hidden="true" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 tracking-tight" data-testid="text-greeting">
                  {greeting.text}, {user?.email?.split("@")[0] || "Friend"}
                </h1>
                <p className="text-slate-500 mt-0.5">Here's your wellness overview</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link 
                href="/settings" 
                className="p-3 rounded-xl bg-white border border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-700 transition-all shadow-sm" 
                data-testid="link-settings" 
                aria-label="Settings"
              >
                <Settings className="w-5 h-5" aria-hidden="true" />
              </Link>
              <button
                onClick={handleLogout}
                className="p-3 rounded-xl bg-white border border-slate-100 hover:border-rose-200 hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-all shadow-sm"
                data-testid="button-logout"
                aria-label="Logout"
              >
                <LogOut className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          </header>

          <GuardianHeartPanel name={user?.email?.split("@")[0]} />

          {/* Daily Healing Focus Card */}
          <section 
            className="mb-8 p-6 rounded-3xl relative overflow-hidden"
            style={{ 
              background: 'linear-gradient(135deg, rgba(47, 93, 93, 0.05), rgba(143, 191, 159, 0.1))',
              border: '2px solid rgba(143, 191, 159, 0.2)'
            }}
            aria-label="Daily healing focus"
            data-testid="section-daily-focus"
          >
            <div 
              className="absolute top-0 left-1/4 right-1/4 h-1 rounded-b-full"
              style={{ background: 'linear-gradient(90deg, #8fbf9f, #eac33b, #f4c7c3)' }}
            />
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #8fbf9f, #2f5d5d)' }}
                >
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Today's Healing Focus</h2>
                  <p className="text-slate-600 mt-1">
                    <em>"Embrace the present moment—it holds everything you need."</em>
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
              <div className="p-4 rounded-2xl bg-white border border-slate-100 hover:border-amber-200 hover:shadow-lg transition-all text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center" style={{ background: 'rgba(234, 195, 59, 0.15)' }}>
                  <MessageCircle className="w-6 h-6" style={{ color: '#eac33b' }} aria-hidden="true" />
                </div>
                <span className="font-semibold text-slate-700 group-hover:text-amber-600 transition-colors">Q&A Community</span>
              </div>
            </Link>
            <Link href="/crisis-resources" className="group" data-testid="link-quick-crisis" aria-label="Go to Crisis Support">
              <div className="p-4 rounded-2xl bg-white border border-slate-100 hover:border-rose-200 hover:shadow-lg transition-all text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center" style={{ background: 'rgba(244, 199, 195, 0.3)' }}>
                  <Heart className="w-6 h-6" style={{ color: '#f4c7c3' }} aria-hidden="true" />
                </div>
                <span className="font-semibold text-slate-700 group-hover:text-rose-500 transition-colors">Crisis Support</span>
              </div>
            </Link>
            <Link href="/tools" className="group" data-testid="link-quick-tools" aria-label="Go to Tools Library">
              <div className="p-4 rounded-2xl bg-white border border-slate-100 hover:border-teal-200 hover:shadow-lg transition-all text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center" style={{ background: 'rgba(47, 93, 93, 0.1)' }}>
                  <Brain className="w-6 h-6" style={{ color: '#2f5d5d' }} aria-hidden="true" />
                </div>
                <span className="font-semibold text-slate-700 group-hover:text-teal-600 transition-colors">Tools Library</span>
              </div>
            </Link>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10" aria-label="Wellness statistics">
            <article 
              className="relative overflow-hidden bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl shadow-blue-500/20"
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
              className="relative overflow-hidden bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl shadow-purple-500/20"
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
          </section>

          <Link 
            href="/today" 
            className="block mb-10 p-5 rounded-2xl bg-gradient-to-r from-sage-50 to-teal-50/50 border border-sage-200/50 hover:border-sage-300 transition-all group shadow-sm"
            data-testid="link-today"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-sm">
                  <Heart className="w-5 h-5 text-sage-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-800 group-hover:text-teal-700 transition-colors">
                    Your Space Today
                  </h2>
                  <p className="text-sm text-slate-500 mt-0.5">
                    A place to pause, notice, and reflect
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
            </div>
          </Link>

          <section aria-label="Quick actions" className="mb-10">
            <h2 className="text-lg font-semibold text-slate-800 mb-5 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" aria-hidden="true" />
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
            <h2 className="text-lg font-semibold text-slate-800 mb-5">Explore</h2>
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
                href="/wellness#habits" 
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
            </div>
          </section>

          <section className="mb-10" aria-label="Daily affirmation">
            <DailyAffirmations compact />
          </section>

          <Link 
            href="/crisis" 
            className="flex items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-rose-50 to-pink-50/50 border border-rose-200/50 hover:border-rose-300 transition-all group shadow-sm mb-10"
            data-testid="link-crisis-resources"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-sm">
                <Heart className="w-5 h-5 text-rose-500" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-semibold text-rose-700">Crisis Resources</h3>
                <p className="text-sm text-rose-600/70">24/7 support when you need it most</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-rose-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" aria-hidden="true" />
          </Link>

          {moodData.recentMoods && moodData.recentMoods.length > 0 && (
            <section className="mb-10" aria-label="Recent mood history">
              <h2 className="text-lg font-semibold text-slate-800 mb-5">Recent Moods</h2>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide" role="list">
                {moodData.recentMoods.map((mood, idx) => (
                  <div
                    key={idx}
                    className="flex-shrink-0 bg-white rounded-xl p-4 text-center min-w-[80px] border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all"
                    data-testid={`mood-entry-${idx}`}
                    role="listitem"
                  >
                    <div className="text-2xl font-bold bg-gradient-to-br from-sky-500 to-violet-500 bg-clip-text text-transparent">
                      {mood.rating}
                    </div>
                    <div className="text-xs text-slate-500 mt-1 font-medium">
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
            <h2 className="text-lg font-semibold text-slate-800">Your Wellness Hub</h2>
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
        </div>
      </div>
    </>
  );
}

function QuickAction({ href, icon: Icon, label, color, testId }) {
  const colorMap = {
    sky: { bg: 'bg-sky-50', icon: 'text-sky-600', hover: 'hover:border-sky-200' },
    violet: { bg: 'bg-violet-50', icon: 'text-violet-600', hover: 'hover:border-violet-200' },
    teal: { bg: 'bg-teal-50', icon: 'text-teal-600', hover: 'hover:border-teal-200' },
    amber: { bg: 'bg-amber-50', icon: 'text-amber-600', hover: 'hover:border-amber-200' },
  };
  const colors = colorMap[color] || colorMap.sky;

  return (
    <Link 
      href={href} 
      className={`flex flex-col items-center gap-3 p-5 rounded-xl bg-white border border-slate-100 ${colors.hover} hover:shadow-md transition-all group`}
      data-testid={testId}
    >
      <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center group-hover:scale-105 transition-transform`}>
        <Icon className={`w-6 h-6 ${colors.icon}`} aria-hidden="true" />
      </div>
      <span className="text-sm font-medium text-slate-700">{label}</span>
    </Link>
  );
}

function ExploreCard({ href, icon: Icon, title, description, color, testId }) {
  const colorMap = {
    emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600' },
    cyan: { bg: 'bg-cyan-50', icon: 'text-cyan-600' },
    orange: { bg: 'bg-orange-50', icon: 'text-orange-600' },
    violet: { bg: 'bg-violet-50', icon: 'text-violet-600' },
  };
  const colors = colorMap[color] || colorMap.emerald;

  return (
    <Link 
      href={href} 
      className="flex items-center gap-4 p-4 rounded-xl bg-white border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all group"
      data-testid={testId}
    >
      <div className={`w-11 h-11 rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-5 h-5 ${colors.icon}`} aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <h3 className="font-medium text-slate-800 group-hover:text-slate-900">{title}</h3>
        <p className="text-sm text-slate-500 truncate">{description}</p>
      </div>
      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-auto" />
    </Link>
  );
}
