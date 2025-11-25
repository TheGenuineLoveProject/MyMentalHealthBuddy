import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet, getStoredUser } from "../utils/api";

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
      case "improving": return { icon: "📈", text: "Improving", color: "#16a34a", bg: "#f0fdf4" };
      case "declining": return { icon: "📉", text: "Needs attention", color: "#dc2626", bg: "#fef2f2" };
      default: return { icon: "➡️", text: "Stable", color: "#6b7280", bg: "#f9fafb" };
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
      icon: "🎯", 
      description: "Log how you're feeling",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
    },
    { 
      to: "/journal", 
      label: "Write Journal", 
      icon: "📝", 
      description: "Express your thoughts",
      gradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)" 
    },
    { 
      to: "/chat", 
      label: "Chat with AI", 
      icon: "💬", 
      description: "Talk to your buddy",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" 
    },
    { 
      to: "/analytics", 
      label: "View Insights", 
      icon: "📊", 
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

  const timeInfo = getTimeOfDay();

  return (
    <div 
      data-testid="page-dashboard" 
      className="animate-fade-in"
      style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}
    >
      <div 
        className="card animate-slide-up"
        style={{ 
          padding: "2rem",
          marginBottom: "2rem",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          borderRadius: "20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
          <span style={{ fontSize: "2.5rem" }}>{timeInfo.emoji}</span>
          <div>
            <div style={{ fontSize: "0.9rem", opacity: 0.9 }}>{timeInfo.greeting}</div>
            <h1 
              data-testid="text-welcome"
              style={{ fontSize: "1.75rem", fontWeight: 700 }}
            >
              {user?.name || "Friend"}!
            </h1>
          </div>
        </div>
        <p data-testid="text-subtitle" style={{ opacity: 0.9, marginTop: "0.5rem" }}>
          Here's an overview of your mental health journey
        </p>
      </div>

      <div
        data-testid="section-quick-actions"
        style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
          gap: "1rem", 
          marginBottom: "2rem" 
        }}
      >
        {quickActions.map((action, index) => (
          <Link
            key={action.to}
            to={action.to}
            data-testid={`link-action-${index}`}
            className="card animate-slide-up"
            style={{
              padding: "1.5rem",
              textDecoration: "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              animationDelay: `${index * 0.1}s`,
              opacity: 0,
              animationFillMode: "forwards",
            }}
          >
            <div 
              style={{ 
                width: "60px",
                height: "60px",
                borderRadius: "16px",
                background: action.gradient,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.75rem",
                marginBottom: "0.75rem",
                boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
              }}
            >
              {action.icon}
            </div>
            <div style={{ fontWeight: 600, color: "#1f2937", fontSize: "1rem" }}>
              {action.label}
            </div>
            <div style={{ fontSize: "0.8rem", color: "#6b7280", marginTop: "0.25rem" }}>
              {action.description}
            </div>
          </Link>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "1.5rem" }}>
        <div
          className="card animate-slide-up stagger-3"
          style={{
            padding: "1.5rem",
            opacity: 0,
            animationFillMode: "forwards",
          }}
        >
          <h2
            data-testid="text-stats-title"
            style={{ 
              fontSize: "1.2rem", 
              fontWeight: 600, 
              marginBottom: "1.25rem", 
              color: "#374151",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span>📈</span> Your Mood Overview
          </h2>

          {isLoading ? (
            <div data-testid="loading-stats" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              {[1,2,3,4].map(i => (
                <div key={i} className="skeleton" style={{ height: "80px", borderRadius: "12px" }} />
              ))}
            </div>
          ) : stats && stats.total > 0 ? (
            <div data-testid="section-stats" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div style={{ 
                padding: "1rem", 
                background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)", 
                borderRadius: "12px", 
                textAlign: "center" 
              }}>
                <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "#16a34a" }}>
                  {stats.average.toFixed(1)}
                </div>
                <div style={{ fontSize: "0.8rem", color: "#4b5563", fontWeight: 500 }}>Average Mood</div>
              </div>
              <div style={{ 
                padding: "1rem", 
                background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)", 
                borderRadius: "12px", 
                textAlign: "center" 
              }}>
                <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "#2563eb" }}>
                  {stats.total}
                </div>
                <div style={{ fontSize: "0.8rem", color: "#4b5563", fontWeight: 500 }}>Total Check-ins</div>
              </div>
              <div style={{ 
                padding: "1rem", 
                background: getTrendInfo(stats.trend).bg, 
                borderRadius: "12px", 
                textAlign: "center" 
              }}>
                <div style={{ 
                  fontSize: "1.5rem", 
                  fontWeight: 700, 
                  color: getTrendInfo(stats.trend).color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.25rem",
                }}>
                  {getTrendInfo(stats.trend).icon} {getTrendInfo(stats.trend).text}
                </div>
                <div style={{ fontSize: "0.8rem", color: "#4b5563", fontWeight: 500 }}>Weekly Trend</div>
              </div>
              <div style={{ 
                padding: "1rem", 
                background: "linear-gradient(135deg, #fefce8 0%, #fef9c3 100%)", 
                borderRadius: "12px", 
                textAlign: "center" 
              }}>
                <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "#ca8a04" }}>
                  {stats.highest}/{stats.lowest}
                </div>
                <div style={{ fontSize: "0.8rem", color: "#4b5563", fontWeight: 500 }}>High/Low</div>
              </div>
            </div>
          ) : (
            <div 
              data-testid="text-no-stats" 
              style={{ 
                textAlign: "center", 
                padding: "2rem",
                background: "#f9fafb",
                borderRadius: "12px",
              }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🎯</div>
              <p style={{ color: "#6b7280", marginBottom: "1rem" }}>
                Start tracking your mood to see insights here
              </p>
              <Link
                to="/mood"
                style={{
                  display: "inline-block",
                  padding: "0.75rem 1.5rem",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  borderRadius: "10px",
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                }}
              >
                Track First Mood
              </Link>
            </div>
          )}
        </div>

        <div
          className="card animate-slide-up stagger-4"
          style={{
            padding: "1.5rem",
            opacity: 0,
            animationFillMode: "forwards",
          }}
        >
          <h2
            data-testid="text-history-title"
            style={{ 
              fontSize: "1.2rem", 
              fontWeight: 600, 
              marginBottom: "1.25rem", 
              color: "#374151",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span>📋</span> Recent Mood Entries
          </h2>

          {isLoading ? (
            <div data-testid="loading-history">
              {[1,2,3].map(i => (
                <div key={i} className="skeleton" style={{ height: "60px", marginBottom: "0.5rem", borderRadius: "10px" }} />
              ))}
            </div>
          ) : history.length === 0 ? (
            <div data-testid="text-no-history" style={{ 
              textAlign: "center", 
              padding: "2rem",
              background: "#f9fafb",
              borderRadius: "12px",
            }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>📝</div>
              <p style={{ color: "#6b7280", marginBottom: "1rem" }}>You haven't tracked any moods yet</p>
              <Link
                to="/mood"
                data-testid="link-track-mood"
                style={{
                  display: "inline-block",
                  padding: "0.75rem 1.5rem",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  borderRadius: "10px",
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                }}
              >
                Track Your First Mood
              </Link>
            </div>
          ) : (
            <ul data-testid="list-recent-moods" style={{ listStyle: "none", padding: 0 }}>
              {history.slice(0, 5).map((entry, index) => {
                const date = new Date(entry.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });
                return (
                  <li
                    key={entry.id}
                    data-testid={`item-mood-${index}`}
                    style={{
                      padding: "0.875rem",
                      marginBottom: "0.5rem",
                      borderRadius: "10px",
                      background: "#f9fafb",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      transition: "background 0.2s ease",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <span style={{ fontSize: "1.5rem" }}>{getMoodEmoji(entry.mood)}</span>
                      <div>
                        <span style={{ fontWeight: 600, color: "#374151" }}>
                          Mood: {entry.mood}/10
                        </span>
                        {entry.notes && (
                          <p style={{ fontSize: "0.8rem", color: "#6b7280", margin: "0.2rem 0 0 0" }}>
                            {entry.notes.slice(0, 40)}{entry.notes.length > 40 ? "..." : ""}
                          </p>
                        )}
                      </div>
                    </div>
                    <span style={{ fontSize: "0.75rem", color: "#9ca3af" }}>{date}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <div
        className="card animate-slide-up stagger-5"
        style={{
          marginTop: "1.5rem",
          padding: "1.5rem",
          background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
          border: "1px solid #fbbf24",
          opacity: 0,
          animationFillMode: "forwards",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ fontSize: "2rem" }}>💡</div>
          <div>
            <h3 style={{ fontWeight: 600, color: "#92400e", marginBottom: "0.25rem" }}>
              Daily Tip
            </h3>
            <p style={{ color: "#a16207", fontSize: "0.95rem" }}>
              Taking a few minutes each day to check in with yourself can significantly improve your self-awareness and emotional well-being.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
