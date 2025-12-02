import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, Smile, Notebook, MessageCircle, TrendingUp, TrendingDown, Minus, Settings, Heart } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import GuardianHeartPanel from "../components/GuardianHeartPanel.tsx";

export default function Dashboard() {
  const { user } = useAuth();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["/api/dashboard"],
  });

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }

  function getTrendIcon(trend) {
    const label = trend === "improving" ? "Mood improving" : trend === "declining" ? "Mood declining" : "Mood stable";
    if (trend === "improving") return <><TrendingUp className="w-5 h-5 text-green-400" aria-hidden="true" /><span className="sr-only">{label}</span></>;
    if (trend === "declining") return <><TrendingDown className="w-5 h-5 text-red-400" aria-hidden="true" /><span className="sr-only">{label}</span></>;
    return <><Minus className="w-5 h-5 text-neutral-400" aria-hidden="true" /><span className="sr-only">{label}</span></>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 bg-gradient-to-b from-neutral-900 to-neutral-950" role="status" aria-label="Loading dashboard">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-neutral-800 rounded w-1/3" aria-hidden="true"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-neutral-800 rounded-xl" aria-hidden="true"></div>
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
      <div className="min-h-screen p-6 bg-gradient-to-b from-neutral-900 to-neutral-950 flex items-center justify-center" role="alert">
        <div className="text-center text-white">
          <p className="text-red-400 mb-4">{error.message || "Failed to load dashboard"}</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
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

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-neutral-900 to-neutral-950 text-white">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold" data-testid="text-greeting">
              {getGreeting()}, {user?.email?.split("@")[0] || "Friend"}
            </h1>
            <p className="text-neutral-400 mt-1">Here's your wellness overview</p>
          </div>
          <Link href="/settings" className="p-2 text-neutral-400 hover:text-white transition rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" data-testid="link-settings" aria-label="Settings">
            <Settings className="w-6 h-6" aria-hidden="true" />
          </Link>
        </header>

        <GuardianHeartPanel name={user?.email?.split("@")[0]} />

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8" aria-label="Wellness statistics">
          <article className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 p-5 rounded-xl border border-blue-700/30" data-testid="card-mood-score">
            <div className="flex items-center gap-3 mb-3">
              <Smile className="w-6 h-6 text-blue-400" aria-hidden="true" />
              <h2 className="text-lg font-semibold">Average Mood</h2>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold" aria-label={`Average mood score: ${moodData.averageMoodLast7Days !== null ? moodData.averageMoodLast7Days : 'no data'} out of 10`}>
                {moodData.averageMoodLast7Days !== null ? moodData.averageMoodLast7Days : "--"}
              </span>
              <span className="text-neutral-400 mb-1" aria-hidden="true">/10</span>
              {moodData.trend && getTrendIcon(moodData.trend)}
            </div>
            <p className="text-sm text-neutral-400 mt-2">
              {moodData.entriesLast7Days || 0} entries this week
            </p>
          </article>

          <article className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 p-5 rounded-xl border border-purple-700/30" data-testid="card-journal">
            <div className="flex items-center gap-3 mb-3">
              <Notebook className="w-6 h-6 text-purple-400" aria-hidden="true" />
              <h2 className="text-lg font-semibold">Journal Entries</h2>
            </div>
            <span className="text-4xl font-bold" aria-label={`${journalData.totalEntries || 0} total journal entries`}>{journalData.totalEntries || 0}</span>
            <p className="text-sm text-neutral-400 mt-2">Total entries</p>
          </article>
        </section>

        <nav aria-label="Quick actions">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/mood" className="group focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-xl" data-testid="link-mood">
              <div className="bg-neutral-800 p-4 rounded-xl text-center hover:bg-neutral-700 transition group-hover:ring-2 ring-blue-500/50">
                <Smile className="w-8 h-8 mx-auto mb-2 text-blue-400" aria-hidden="true" />
                <span className="text-sm">Track Mood</span>
              </div>
            </Link>

            <Link href="/journal" className="group focus:outline-none focus:ring-2 focus:ring-purple-400 rounded-xl" data-testid="link-journal">
              <div className="bg-neutral-800 p-4 rounded-xl text-center hover:bg-neutral-700 transition group-hover:ring-2 ring-purple-500/50">
                <Notebook className="w-8 h-8 mx-auto mb-2 text-purple-400" aria-hidden="true" />
                <span className="text-sm">Write Journal</span>
              </div>
            </Link>

            <Link href="/chat" className="group focus:outline-none focus:ring-2 focus:ring-green-400 rounded-xl" data-testid="link-chat">
              <div className="bg-neutral-800 p-4 rounded-xl text-center hover:bg-neutral-700 transition group-hover:ring-2 ring-green-500/50">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 text-green-400" aria-hidden="true" />
                <span className="text-sm">AI Chat</span>
              </div>
            </Link>

            <Link href="/analytics" className="group focus:outline-none focus:ring-2 focus:ring-amber-400 rounded-xl" data-testid="link-analytics">
              <div className="bg-neutral-800 p-4 rounded-xl text-center hover:bg-neutral-700 transition group-hover:ring-2 ring-amber-500/50">
                <BarChart3 className="w-8 h-8 mx-auto mb-2 text-amber-400" aria-hidden="true" />
                <span className="text-sm">Analytics</span>
              </div>
            </Link>
          </div>
        </nav>

        <div className="mt-6 p-4 bg-red-900/20 border border-red-800/50 rounded-xl">
          <Link href="/crisis" className="flex items-center justify-between group focus:outline-none" data-testid="link-crisis-resources">
            <div className="flex items-center gap-3">
              <Heart className="w-6 h-6 text-red-400" aria-hidden="true" />
              <div>
                <h3 className="font-medium text-red-200">Crisis Resources</h3>
                <p className="text-sm text-red-300/70">24/7 support hotlines and help</p>
              </div>
            </div>
            <span className="text-red-400 group-hover:text-red-300 transition">View &rarr;</span>
          </Link>
        </div>

        {moodData.recentMoods && moodData.recentMoods.length > 0 && (
          <section className="mt-8" aria-label="Recent mood history">
            <h2 className="text-xl font-semibold mb-4">Recent Moods</h2>
            <div className="flex gap-2 overflow-x-auto pb-2" role="list" aria-label="Mood entries from recent days">
              {moodData.recentMoods.map((mood, idx) => (
                <div
                  key={idx}
                  className="flex-shrink-0 bg-neutral-800 p-3 rounded-lg text-center min-w-[80px]"
                  data-testid={`mood-entry-${idx}`}
                  role="listitem"
                  aria-label={`Mood rating ${mood.rating} on ${new Date(mood.createdAt).toLocaleDateString("en-US", { weekday: "long" })}`}
                >
                  <div className="text-2xl font-bold text-blue-400" aria-hidden="true">{mood.rating}</div>
                  <div className="text-xs text-neutral-400" aria-hidden="true">
                    {new Date(mood.createdAt).toLocaleDateString("en-US", { weekday: "short" })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
