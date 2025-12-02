import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, Smile, Notebook, MessageCircle, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

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
    if (trend === "improving") return <TrendingUp className="w-5 h-5 text-green-400" />;
    if (trend === "declining") return <TrendingDown className="w-5 h-5 text-red-400" />;
    return <Minus className="w-5 h-5 text-neutral-400" />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 bg-gradient-to-b from-neutral-900 to-neutral-950">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-neutral-800 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-neutral-800 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 bg-gradient-to-b from-neutral-900 to-neutral-950 flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-red-400 mb-4">{error.message || "Failed to load dashboard"}</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold" data-testid="text-greeting">
            {getGreeting()}, {user?.email?.split("@")[0] || "Friend"}
          </h1>
          <p className="text-neutral-400 mt-1">Here's your wellness overview</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 p-5 rounded-xl border border-blue-700/30" data-testid="card-mood-score">
            <div className="flex items-center gap-3 mb-3">
              <Smile className="w-6 h-6 text-blue-400" />
              <h2 className="text-lg font-semibold">Average Mood</h2>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold">
                {moodData.averageMoodLast7Days !== null ? moodData.averageMoodLast7Days : "--"}
              </span>
              <span className="text-neutral-400 mb-1">/10</span>
              {moodData.trend && getTrendIcon(moodData.trend)}
            </div>
            <p className="text-sm text-neutral-400 mt-2">
              {moodData.entriesLast7Days || 0} entries this week
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 p-5 rounded-xl border border-purple-700/30" data-testid="card-journal">
            <div className="flex items-center gap-3 mb-3">
              <Notebook className="w-6 h-6 text-purple-400" />
              <h2 className="text-lg font-semibold">Journal Entries</h2>
            </div>
            <span className="text-4xl font-bold">{journalData.totalEntries || 0}</span>
            <p className="text-sm text-neutral-400 mt-2">Total entries</p>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/mood" className="group" data-testid="link-mood">
            <div className="bg-neutral-800 p-4 rounded-xl text-center hover:bg-neutral-700 transition group-hover:ring-2 ring-blue-500/50">
              <Smile className="w-8 h-8 mx-auto mb-2 text-blue-400" />
              <span className="text-sm">Track Mood</span>
            </div>
          </Link>

          <Link href="/journal" className="group" data-testid="link-journal">
            <div className="bg-neutral-800 p-4 rounded-xl text-center hover:bg-neutral-700 transition group-hover:ring-2 ring-purple-500/50">
              <Notebook className="w-8 h-8 mx-auto mb-2 text-purple-400" />
              <span className="text-sm">Write Journal</span>
            </div>
          </Link>

          <Link href="/chat" className="group" data-testid="link-chat">
            <div className="bg-neutral-800 p-4 rounded-xl text-center hover:bg-neutral-700 transition group-hover:ring-2 ring-green-500/50">
              <MessageCircle className="w-8 h-8 mx-auto mb-2 text-green-400" />
              <span className="text-sm">AI Chat</span>
            </div>
          </Link>

          <Link href="/analytics" className="group" data-testid="link-analytics">
            <div className="bg-neutral-800 p-4 rounded-xl text-center hover:bg-neutral-700 transition group-hover:ring-2 ring-amber-500/50">
              <BarChart3 className="w-8 h-8 mx-auto mb-2 text-amber-400" />
              <span className="text-sm">Analytics</span>
            </div>
          </Link>
        </div>

        {moodData.recentMoods && moodData.recentMoods.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Recent Moods</h2>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {moodData.recentMoods.map((mood, idx) => (
                <div
                  key={idx}
                  className="flex-shrink-0 bg-neutral-800 p-3 rounded-lg text-center min-w-[80px]"
                  data-testid={`mood-entry-${idx}`}
                >
                  <div className="text-2xl font-bold text-blue-400">{mood.rating}</div>
                  <div className="text-xs text-neutral-400">
                    {new Date(mood.createdAt).toLocaleDateString("en-US", { weekday: "short" })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
