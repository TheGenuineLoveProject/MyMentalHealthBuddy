import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet, getStoredUser } from "../utils/api";
import { Target, PenLine, MessageCircle, BarChart3, TrendingUp, TrendingDown, Minus, Lightbulb, Calendar, Heart } from "lucide-react";

type MoodEntry = {
  id: string;
  mood: number;
  notes?: string;
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
  const [isLoading, setIsLoading] = useState(true);
  const user = getStoredUser();

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [historyData, statsData] = await Promise.all([
          apiGet<{ history: MoodEntry[] }>("/api/mood/history"),
          apiGet<{ stats: MoodStats }>("/api/mood/stats").catch(() => ({ ok: true, stats: null })),
        ]);

        setHistory(historyData.history || []);
        if (statsData.stats) {
          setStats(statsData.stats);
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const getTrendInfo = (trend: string) => {
    switch (trend) {
      case "improving": return { icon: <TrendingUp className="w-5 h-5" />, text: "Improving", color: "#16a34a", bg: "#f0fdf4" };
      case "declining": return { icon: <TrendingDown className="w-5 h-5" />, text: "Needs attention", color: "#dc2626", bg: "#fef2f2" };
      default: return { icon: <Minus className="w-5 h-5" />, text: "Stable", color: "#6b7280", bg: "#f9fafb" };
    }
  };

  const getMoodEmoji = (mood: number) => {
    if (mood <= 2) return "😢";
    if (mood <= 4) return "😞";
    if (mood <= 6) return "😐";
    if (mood <= 8) return "🙂";
    return "😊";
  };

  const quickActions = [
    { 
      to: "/mood", 
      label: "Track Mood", 
      icon: <Target className="w-6 h-6 text-white" />, 
      description: "Log how you're feeling",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
    },
    { 
      to: "/journal", 
      label: "Write Journal", 
      icon: <PenLine className="w-6 h-6 text-white" />, 
      description: "Express your thoughts",
      gradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)" 
    },
    { 
      to: "/chat", 
      label: "Chat with AI", 
      icon: <MessageCircle className="w-6 h-6 text-white" />, 
      description: "Talk to your buddy",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" 
    },
    { 
      to: "/analytics", 
      label: "View Insights", 
      icon: <BarChart3 className="w-6 h-6 text-white" />, 
      description: "See your progress",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" 
    },
  ];

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { greeting: "Good morning", emoji: "🌅" };
    if (hour < 17) return { greeting: "Good afternoon", emoji: "☀️" };
    if (hour < 21) return { greeting: "Good evening", emoji: "🌆" };
    return { greeting: "Good night", emoji: "🌙" };
  };

  const dailyTips = [
    "Taking a few minutes each day to check in with yourself can significantly improve your self-awareness.",
    "Deep breathing exercises can help reduce stress and anxiety. Try the 4-7-8 technique today.",
    "Journaling your thoughts helps process emotions and gain clarity about your feelings.",
    "Regular physical activity is one of the most effective ways to improve mental health.",
    "Connecting with loved ones, even briefly, can boost your mood significantly.",
  ];

  const randomTip = dailyTips[new Date().getDate() % dailyTips.length];
  const timeInfo = getTimeOfDay();

  return (
    <div 
      data-testid="page-dashboard" 
      className="min-h-screen animate-fade-in"
      style={{ background: "var(--background)" }}
    >
      <div 
        className="py-10 px-6 mb-8"
        style={{ 
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: "0 0 2rem 2rem"
        }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-3">
            <span className="text-4xl animate-float">{timeInfo.emoji}</span>
            <div>
              <p className="text-white/80 text-sm font-medium">{timeInfo.greeting}</p>
              <h1 
                data-testid="text-welcome"
                className="text-3xl font-bold text-white"
              >
                {user?.name || "Friend"}!
              </h1>
            </div>
          </div>
          <p 
            data-testid="text-subtitle" 
            className="text-white/90 text-lg ml-16"
          >
            Here's an overview of your mental health journey
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-12">
        <section
          data-testid="section-quick-actions"
          aria-label="Quick actions"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {quickActions.map((action, index) => (
            <Link
              key={action.to}
              to={action.to}
              data-testid={`link-action-${index}`}
              aria-label={`${action.label}: ${action.description}`}
              className="card p-5 text-center transition-all hover:scale-[1.02] animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div 
                className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center"
                style={{ 
                  background: action.gradient,
                  boxShadow: "0 4px 15px rgba(0,0,0,0.15)"
                }}
              >
                {action.icon}
              </div>
              <div className="font-semibold" style={{ color: "var(--text-primary)" }}>
                {action.label}
              </div>
              <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                {action.description}
              </div>
            </Link>
          ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <section
            className="card p-6 animate-fade-in stagger-2"
            aria-labelledby="stats-title"
          >
            <h2
              id="stats-title"
              data-testid="text-stats-title"
              className="flex items-center gap-2 text-lg font-semibold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              <Heart className="w-5 h-5" style={{ color: "var(--primary)" }} />
              Your Mood Overview
            </h2>

            {isLoading ? (
              <div data-testid="loading-stats" className="grid grid-cols-2 gap-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="skeleton h-20 rounded-xl" />
                ))}
              </div>
            ) : stats && stats.total > 0 ? (
              <div data-testid="section-stats" className="grid grid-cols-2 gap-3">
                <div 
                  className="p-4 rounded-xl text-center"
                  style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)" }}
                >
                  <div className="text-2xl font-bold" style={{ color: "#16a34a" }}>
                    {stats.average.toFixed(1)}
                  </div>
                  <div className="text-xs font-medium mt-1" style={{ color: "#4b5563" }}>
                    Average Mood
                  </div>
                </div>
                <div 
                  className="p-4 rounded-xl text-center"
                  style={{ background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)" }}
                >
                  <div className="text-2xl font-bold" style={{ color: "#2563eb" }}>
                    {stats.total}
                  </div>
                  <div className="text-xs font-medium mt-1" style={{ color: "#4b5563" }}>
                    Total Check-ins
                  </div>
                </div>
                <div 
                  className="p-4 rounded-xl text-center"
                  style={{ background: getTrendInfo(stats.trend).bg }}
                >
                  <div 
                    className="flex items-center justify-center gap-1 text-lg font-bold"
                    style={{ color: getTrendInfo(stats.trend).color }}
                  >
                    {getTrendInfo(stats.trend).icon}
                    <span className="text-sm">{getTrendInfo(stats.trend).text}</span>
                  </div>
                  <div className="text-xs font-medium mt-1" style={{ color: "#4b5563" }}>
                    Weekly Trend
                  </div>
                </div>
                <div 
                  className="p-4 rounded-xl text-center"
                  style={{ background: "linear-gradient(135deg, #fefce8 0%, #fef9c3 100%)" }}
                >
                  <div className="text-2xl font-bold" style={{ color: "#ca8a04" }}>
                    {stats.highest}/{stats.lowest}
                  </div>
                  <div className="text-xs font-medium mt-1" style={{ color: "#4b5563" }}>
                    High/Low
                  </div>
                </div>
              </div>
            ) : (
              <div 
                data-testid="text-no-stats" 
                className="text-center p-8 rounded-xl"
                style={{ background: "var(--background)" }}
              >
                <div className="text-4xl mb-3">🎯</div>
                <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
                  Start tracking your mood to see insights here
                </p>
                <Link
                  to="/mood"
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <Target className="w-4 h-4" />
                  Track First Mood
                </Link>
              </div>
            )}
          </section>

          <section
            className="card p-6 animate-fade-in stagger-3"
            aria-labelledby="history-title"
          >
            <h2
              id="history-title"
              data-testid="text-history-title"
              className="flex items-center gap-2 text-lg font-semibold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              <Calendar className="w-5 h-5" style={{ color: "var(--primary)" }} />
              Recent Mood Entries
            </h2>

            {isLoading ? (
              <div data-testid="loading-history" className="space-y-3">
                {[1,2,3].map(i => (
                  <div key={i} className="skeleton h-16 rounded-xl" />
                ))}
              </div>
            ) : history.length === 0 ? (
              <div 
                data-testid="text-no-history" 
                className="text-center p-8 rounded-xl"
                style={{ background: "var(--background)" }}
              >
                <div className="text-4xl mb-3">📝</div>
                <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
                  You haven't tracked any moods yet
                </p>
                <Link
                  to="/mood"
                  data-testid="link-track-mood"
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <Target className="w-4 h-4" />
                  Track Your First Mood
                </Link>
              </div>
            ) : (
              <ul 
                data-testid="list-recent-moods" 
                className="space-y-3"
                aria-label="Recent mood entries"
              >
                {history.slice(0, 5).map((entry, index) => {
                  const date = new Date(entry.createdAt);
                  return (
                    <li
                      key={entry.id}
                      data-testid={`item-mood-${index}`}
                      className="p-4 rounded-xl flex justify-between items-center transition-colors"
                      style={{ background: "var(--background)" }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                        <div>
                          <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
                            Mood: {entry.mood}/10
                          </span>
                          {entry.notes && (
                            <p className="text-xs mt-0.5 line-clamp-1" style={{ color: "var(--text-muted)" }}>
                              {entry.notes.slice(0, 40)}{entry.notes.length > 40 ? "..." : ""}
                            </p>
                          )}
                        </div>
                      </div>
                      <time 
                        className="text-xs"
                        style={{ color: "var(--text-muted)" }}
                        dateTime={entry.createdAt}
                      >
                        {date.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </time>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>

        <section
          className="card p-6 animate-fade-in stagger-4"
          style={{
            background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
            border: "1px solid #fbbf24",
          }}
          aria-labelledby="tip-title"
        >
          <div className="flex items-start gap-4">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(234, 179, 8, 0.3)" }}
            >
              <Lightbulb className="w-6 h-6" style={{ color: "#92400e" }} />
            </div>
            <div>
              <h3 
                id="tip-title"
                className="font-semibold mb-1"
                style={{ color: "#92400e" }}
              >
                Daily Wellness Tip
              </h3>
              <p style={{ color: "#a16207", lineHeight: 1.6 }}>
                {randomTip}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
