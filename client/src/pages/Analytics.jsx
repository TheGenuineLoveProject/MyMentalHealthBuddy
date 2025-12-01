import { useEffect, useState } from "react";
import { BarChart3, TrendingUp, TrendingDown, Calendar, Award } from "lucide-react";

export default function Analytics() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const res = await fetch("/api/analytics");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Analytics load failed:", err);
      }
    }

    loadAnalytics();
  }, []);

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Loading analytics...
      </div>
    );
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Analytics</h1>

      <div className="grid grid-cols-1 gap-4">

        {/* Mood Trend */}
        <div className="bg-neutral-800 p-5 rounded-xl">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6" />
            <h2 className="text-xl font-semibold">Mood Trend</h2>
          </div>
          <p className="mt-3 text-2xl">{stats.moodTrend}</p>
        </div>

        {/* Mood History */}
        <div className="bg-neutral-800 p-5 rounded-xl">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6" />
            <h2 className="text-xl font-semibold">Entries This Month</h2>
          </div>
          <p className="mt-3 text-2xl">{stats.entriesThisMonth}</p>
        </div>

        {/* Mood Rating Average */}
        <div className="bg-neutral-800 p-5 rounded-xl">
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6" />
            <h2 className="text-xl font-semibold">Average Mood Rating</h2>
          </div>
          <p className="mt-3 text-2xl">{stats.averageMood}/10</p>
        </div>

        {/* Mood Graph Placeholder */}
        <div className="bg-neutral-800 p-5 rounded-xl">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-6 h-6" />
            <h2 className="text-xl font-semibold">Mood Graph</h2>
          </div>

          <p className="mt-3 opacity-70">
            (Graph rendering will be added in next upgrade.)
          </p>
        </div>
      </div>
    </div>
  );
}