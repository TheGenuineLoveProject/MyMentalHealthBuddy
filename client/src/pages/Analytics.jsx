import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, TrendingUp, TrendingDown, Calendar, Award, ArrowLeft, Minus } from "lucide-react";

export default function Analytics() {
  const { data: stats, isLoading, error, refetch } = useQuery({
    queryKey: ["/api/analytics"],
  });

  function getTrendIcon(avg) {
    if (avg >= 7) return <TrendingUp className="w-6 h-6 text-green-400" />;
    if (avg <= 4) return <TrendingDown className="w-6 h-6 text-red-400" />;
    return <Minus className="w-6 h-6 text-neutral-400" />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 bg-gradient-to-b from-neutral-900 to-neutral-950">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-neutral-800 rounded w-1/4"></div>
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
          <p className="text-red-400 mb-4">{error.message || "Failed to load analytics"}</p>
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

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-neutral-900 to-neutral-950 text-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard" className="text-neutral-400 hover:text-white transition" data-testid="link-back">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-3xl font-bold" data-testid="text-title">Analytics</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-green-900/50 to-green-800/30 p-5 rounded-xl border border-green-700/30" data-testid="card-trend">
            <div className="flex items-center gap-3 mb-3">
              {getTrendIcon(stats?.averageMood)}
              <h2 className="text-lg font-semibold">Mood Trend</h2>
            </div>
            <p className="text-2xl font-bold">
              {stats?.averageMood !== null ? (
                stats.averageMood >= 7 ? "Positive" : stats.averageMood <= 4 ? "Needs Attention" : "Stable"
              ) : "No data"}
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 p-5 rounded-xl border border-blue-700/30" data-testid="card-entries">
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="w-6 h-6 text-blue-400" />
              <h2 className="text-lg font-semibold">Total Mood Entries</h2>
            </div>
            <p className="text-4xl font-bold">{stats?.moodCount || 0}</p>
          </div>

          <div className="bg-gradient-to-br from-amber-900/50 to-amber-800/30 p-5 rounded-xl border border-amber-700/30" data-testid="card-average">
            <div className="flex items-center gap-3 mb-3">
              <Award className="w-6 h-6 text-amber-400" />
              <h2 className="text-lg font-semibold">Average Mood Rating</h2>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold">
                {stats?.averageMood !== null ? stats.averageMood : "--"}
              </span>
              <span className="text-neutral-400 mb-1">/10</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 p-5 rounded-xl border border-purple-700/30" data-testid="card-journal">
            <div className="flex items-center gap-3 mb-3">
              <BarChart3 className="w-6 h-6 text-purple-400" />
              <h2 className="text-lg font-semibold">Journal Entries</h2>
            </div>
            <p className="text-4xl font-bold">{stats?.journalCount || 0}</p>
          </div>
        </div>

        {stats?.recentMoods && stats.recentMoods.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Recent Mood History</h2>
            <div className="bg-neutral-800 rounded-xl p-4">
              <div className="flex items-end justify-between h-32 gap-2">
                {stats.recentMoods.map((mood, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full bg-blue-500 rounded-t transition-all"
                      style={{ height: `${(mood.rating / 10) * 100}%` }}
                      data-testid={`bar-mood-${idx}`}
                    ></div>
                    <span className="text-xs text-neutral-400">
                      {new Date(mood.createdAt).toLocaleDateString("en-US", { weekday: "short" })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/dashboard"
            className="inline-block px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
            data-testid="link-dashboard"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
