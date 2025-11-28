// client/src/pages/Dashboard.tsx
// MyMentalHealthBuddy — Main Dashboard
// Includes: Mood overview, history, tips, GuardianHeartPanel, CodeCopilotPanel, Perplexity helper.

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet, getStoredUser } from "../utils/api";

import {
  Target,
  PenLine,
  MessageCircle,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Minus,
  Lightbulb,
  Calendar,
  Heart,
  Sparkles,
} from "lucide-react";

import GuardianHeartPanel from "../components/GuardianHeartPanel";
import CodeCopilotPanel from "../components/CodeCopilotPanel";

type MoodEntry = {
  id: string;
  mood: number;
  notes: string;
  createdAt: string;
};

type MoodStats = {
  average: number;
  total: number;
  trend: string;
  highest: number;
  lowest: number;
};

export default function Dashboard() {
  const [history, setHistory] = useState<MoodEntry[]>([]);
  const [stats, setStats] = useState<MoodStats | null>(null);
  const [isLoading, setLoading] = useState(true);
  const user = getStoredUser();

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [historyData, statsData] = await Promise.all([
          apiGet<MoodEntry[]>("/api/mood/history"),
          apiGet<MoodStats | null>("/api/mood/stats"),
        ]);
        setHistory(historyData);
        setStats(statsData);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const getTrendInfo = (trend: string) => {
    switch (trend) {
      case "improving":
        return {
          icon: <TrendingUp className="w-5 h-5" />,
          text: "Improving",
          color: "#16a34a",
          bg: "#dcfce7",
        };
      case "declining":
        return {
          icon: <TrendingDown className="w-5 h-5" />,
          text: "Needs attention",
          color: "#dc2626",
          bg: "#fee2e2",
        };
      case "stable":
        return {
          icon: <Minus className="w-5 h-5" />,
          text: "Stable",
          color: "#6b7280",
          bg: "#e5e7eb",
        };
      default:
        return {
          icon: <Minus className="w-5 h-5" />,
          text: "No data yet",
          color: "#6b7280",
          bg: "#e5e7eb",
        };
    }
  };

  const getMoodEmoji = (mood: number) => {
    if (mood >= 8) return "🌈";
    if (mood >= 6) return "😊";
    if (mood >= 4) return "😐";
    if (mood >= 2) return "😟";
    return "💔";
  };

  const quickActions = [
    {
      to: "/mood",
      label: "Track Mood",
      icon: <Target className="w-6 h-6 text-white" />,
      description: "Log how you're feeling.",
      gradient: "linear-gradient(135deg,#0ea5e9,#2563eb)",
    },
    {
      to: "/journal",
      label: "Write Journal",
      icon: <PenLine className="w-6 h-6 text-white" />,
      description: "Express your thoughts.",
      gradient: "linear-gradient(135deg,#f97316,#ea580c)",
    },
    {
      to: "/chat",
      label: "Chat with AI",
      icon: <MessageCircle className="w-6 h-6 text-white" />,
      description: "Talk to your buddy.",
      gradient: "linear-gradient(135deg,#4f46e5,#7c3aed)",
    },
    {
      to: "/analytics",
      label: "View Insights",
      icon: <BarChart3 className="w-6 h-6 text-white" />,
      description: "See your progress.",
      gradient: "linear-gradient(135deg,#14b8a6,#22c55e)",
    },
  ];

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { greeting: "Good morning", emoji: "☀️" };
    if (hour < 18) return { greeting: "Good afternoon", emoji: "🌤️" };
    return { greeting: "Good evening", emoji: "🌙" };
  };

  const dailyTips = [
    "Taking a few minutes each day to check-in with yourself can significantly improve your self-awareness.",
    "Deep breathing exercises can help reduce stress and anxiety. Try the 4-7-8 technique today.",
    "Journaling your thoughts helps process emotions and gain clarity about your feelings.",
    "Regular physical activity is one of the most effective ways to improve mental health.",
    "Connecting with loved ones, even briefly, can boost your mood significantly.",
  ];

  const randomTip = dailyTips[new Date().getDate() % dailyTips.length];
  const timeInfo = getTimeOfDay();
  const trendInfo = stats ? getTrendInfo(stats.trend) : getTrendInfo("none");

  return (
    <div
      data-testid="page-dashboard"
      className="min-h-screen animate-fade-in"
      style={{ background: "var(--background)" }}
    >
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        {/* Welcome / Guardian row */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr),minmax(0,1.3fr)]">
          {/* Left: Greeting + quick stats */}
          <section
            className="rounded-3xl p-8 text-white shadow-lg"
            style={{
              background: "linear-gradient(135deg,#667eea,#764ba2)",
              borderRadius: "2rem",
            }}
          >
            <div className="flex items-center gap-4 mb-4">
              <span className="text-4xl">{timeInfo.emoji}</span>
              <div>
                <p className="text-sm opacity-80">Welcome back</p>
                <h1 className="text-3xl font-bold">
                  {timeInfo.greeting}, {user?.name || "Friend"}.
                </h1>
              </div>
            </div>
            <p className="text-white/80 text-sm max-w-xl">
              Here&apos;s an overview of your mental health journey. You are
              allowed to grow slowly. Every step counts. 💛
            </p>
            {stats && (
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="bg-white/10 rounded-2xl p-4">
                  <p className="text-xs uppercase tracking-wide opacity-70">
                    Average Mood
                  </p>
                  <p className="mt-2 text-2xl font-bold flex items-center gap-2">
                    {stats.average.toFixed(1)}
                    <span className="text-2xl">
                      {getMoodEmoji(Math.round(stats.average))}
                    </span>
                  </p>
                </div>
                <div className="bg-white/10 rounded-2xl p-4">
                  <p className="text-xs uppercase tracking-wide opacity-70">
                    Total Check-ins
                  </p>
                  <p className="mt-2 text-2xl font-bold">{stats.total}</p>
                </div>
                <div
                  className="rounded-2xl p-4 flex items-center gap-3"
                  style={{ background: trendInfo.bg }}
                >
                  <div
                    className="rounded-full p-2"
                    style={{ background: "rgba(0,0,0,0.06)" }}
                  >
                    {trendInfo.icon}
                  </div>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: trendInfo.color }}>
                      Weekly Trend
                    </p>
                    <p className="text-sm text-slate-800">{trendInfo.text}</p>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Right: Guardian Heart + Code Copilot stack */}
          <div className="space-y-4">
            <GuardianHeartPanel />
            <CodeCopilotPanel />

            {/* Perplexity helper card */}
            <a
              href="https://www.perplexity.ai/"
              target="_blank"
              rel="noreferrer"
              className="block rounded-2xl border border-dashed border-sky-300 bg-sky-50 px-4 py-3 hover:bg-sky-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-sky-500" />
                <div>
                  <p className="text-sm font-semibold text-sky-800">
                    Research helper (Perplexity)
                  </p>
                  <p className="text-xs text-sky-700">
                    Open Perplexity in a new tab to explore ideas or evidence
                    for your healing journey.
                  </p>
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* Quick actions */}
        <section
          data-testid="section-quick-actions"
          aria-label="Quick actions"
          className="card p-6 rounded-3xl bg-white/80 shadow-sm border border-slate-100"
        >
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-slate-900">
              Choose your next step
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={action.to}
                to={action.to}
                data-testid={`link-action-${index}`}
                aria-label={`${action.label}: ${action.description}`}
                className="card p-4 text-center rounded-2xl text-white shadow-md hover:scale-[1.02] transition-transform"
                style={{
                  background: action.gradient,
                  boxShadow: "0 4px 15px rgba(0,0,0,0.18)",
                }}
              >
                <div className="flex justify-center mb-3">{action.icon}</div>
                <p className="font-semibold text-sm">{action.label}</p>
                <p className="text-xs mt-1 opacity-90">{action.description}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Stats overview */}
        <section
          className="card p-6 rounded-3xl bg-white/90 shadow-sm border border-slate-100"
          aria-labelledby="stats-title"
        >
          <div className="flex items-center gap-2 mb-4" id="stats-title">
            <Heart className="w-5 h-5 text-rose-500" />
            <h2 className="text-lg font-semibold text-slate-900">
              Your Mood Overview
            </h2>
          </div>

          {isLoading ? (
            <div
              data-testid="loading-stats"
              className="grid grid-cols-2 gap-3"
            >
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-20 rounded-xl bg-slate-200 animate-pulse"
                />
              ))}
            </div>
          ) : stats && stats.total > 0 ? (
            <div
              data-testid="section-stats"
              className="grid grid-cols-2 gap-3"
            >
              <div className="p-4 rounded-xl text-center bg-amber-50 border border-amber-200">
                <p className="text-xs font-semibold text-amber-700">
                  Average Mood
                </p>
                <p className="mt-2 text-2xl font-bold text-amber-900">
                  {stats.average.toFixed(1)}
                </p>
              </div>
              <div className="p-4 rounded-xl text-center bg-sky-50 border border-sky-200">
                <p className="text-xs font-semibold text-sky-700">
                  Total Check-ins
                </p>
                <p className="mt-2 text-2xl font-bold text-sky-900">
                  {stats.total}
                </p>
              </div>
              <div className="p-4 rounded-xl text-center bg-emerald-50 border border-emerald-200">
                <p className="text-xs font-semibold text-emerald-700">
                  High / Low
                </p>
                <p className="mt-2 text-sm text-emerald-900">
                  High: {stats.highest} · Low: {stats.lowest}
                </p>
              </div>
              <div
                className="p-4 rounded-xl text-center border"
                style={{ background: trendInfo.bg, borderColor: trendInfo.bg }}
              >
                <p
                  className="text-xs font-semibold"
                  style={{ color: trendInfo.color }}
                >
                  Weekly Trend
                </p>
                <p className="mt-2 text-sm text-slate-800">{trendInfo.text}</p>
              </div>
            </div>
          ) : (
            <div
              data-testid="text-no-stats"
              className="text-center p-8 rounded-xl bg-slate-50"
            >
              <p className="text-4xl mb-3">💛</p>
              <p className="font-medium text-slate-800 mb-1">
                Start tracking your mood to see insights here.
              </p>
              <Link
                to="/mood"
                className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Target className="w-4 h-4" />
                Track first mood
              </Link>
            </div>
          )}
        </section>

        {/* Recent history */}
        <section
          className="card p-6 rounded-3xl bg-white/90 shadow-sm border border-slate-100"
          aria-labelledby="history-title"
        >
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-primary" />
            <h2 id="history-title" className="text-lg font-semibold text-slate-900">
              Recent Mood Entries
            </h2>
          </div>

          {isLoading ? (
            <div
              data-testid="loading-history"
              className="space-y-3"
            >
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-16 rounded-xl bg-slate-200 animate-pulse"
                />
              ))}
            </div>
          ) : history.length === 0 ? (
            <div
              data-testid="text-no-history"
              className="text-center p-8 rounded-xl bg-slate-50"
            >
              <p className="text-4xl mb-3">📭</p>
              <p className="mb-2 text-slate-800 font-medium">
                You haven&apos;t tracked any moods yet.
              </p>
              <Link
                to="/mood"
                className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-full text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Target className="w-4 h-4" />
                Track first mood
              </Link>
            </div>
          ) : (
            <ul
              data-testid="list-recent-moods"
              className="space-y-3"
            >
              {history.slice(0, 10).map((entry, index) => {
                const date = new Date(entry.createdAt);
                return (
                  <li
                    key={entry.id ?? index}
                    className="p-4 rounded-xl bg-slate-50 flex justify-between items-center transition-colors hover:bg-slate-100"
                    data-testid={`item-mood-${index}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {getMoodEmoji(entry.mood)}
                      </span>
                      <div>
                        <p className="font-semibold text-slate-900">
                          Mood: {entry.mood}
                        </p>
                        {entry.notes && (
                          <p className="text-xs text-slate-600 mt-1">
                            {entry.notes.slice(0, 80)}
                            {entry.notes.length > 80 ? "…" : ""}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right text-xs text-slate-500">
                      <time dateTime={entry.createdAt}>
                        {date.toLocaleDateString("en-US", {
                          month: "short",
                          day: "2-digit",
                        })}{" "}
                        ·{" "}
                        {date.toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </time>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Daily tip */}
        <section
          className="card p-6 rounded-3xl bg-amber-50 border border-amber-200 shadow-sm"
          aria-label="Daily wellness tip"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-amber-100 border border-amber-200">
              <Lightbulb className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h3 className="font-semibold mb-1 text-amber-900">
                Daily Wellness Tip
              </h3>
              <p className="text-sm text-amber-800 leading-relaxed">
                {randomTip}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}