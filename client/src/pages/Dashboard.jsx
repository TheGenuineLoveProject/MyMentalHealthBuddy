import { useState, useEffect } from "react";
import { BarChart3, Heart, Smile, Notebook } from "lucide-react";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/dashboard");
        const data = await res.json();
        setSummary(data);
      } catch (err) {
        console.error("Dashboard load failed:", err);
      }
    }
    load();
  }, []);

  if (!summary) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4">
        <div className="bg-neutral-800 p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <Smile className="w-6 h-6" />
            <h2 className="text-xl font-semibold">Mood Score</h2>
          </div>
          <p className="text-3xl mt-3">{summary.moodScore}/10</p>
        </div>

        <div className="bg-neutral-800 p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <Notebook className="w-6 h-6" />
            <h2 className="text-xl font-semibold">Journal Entries</h2>
          </div>
          <p className="text-3xl mt-3">{summary.journalCount}</p>
        </div>

        <div className="bg-neutral-800 p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <Heart className="w-6 h-6" />
            <h2 className="text-xl font-semibold">Health Score</h2>
          </div>
          <p className="text-3xl mt-3">{summary.healthScore}</p>
        </div>

        <div className="bg-neutral-800 p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-6 h-6" />
            <h2 className="text-xl font-semibold">Analytics Overview</h2>
          </div>
          <p className="text-lg mt-3">
            {summary.analyticsScore} / 100
          </p>
        </div>
      </div>
    </div>
  );
}