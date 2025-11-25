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

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving": return "📈";
      case "declining": return "📉";
      default: return "➡️";
    }
  };

  const quickActions = [
    { to: "/mood", label: "Track Mood", icon: "🎯", color: "#4f46e5" },
    { to: "/journal", label: "Write Journal", icon: "📝", color: "#059669" },
    { to: "/chat", label: "Chat with Buddy", icon: "💬", color: "#0891b2" },
    { to: "/analytics", label: "View Analytics", icon: "📊", color: "#7c3aed" },
  ];

  return (
    <div data-testid="page-dashboard" style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 
          data-testid="text-welcome"
          style={{ fontSize: "2rem", fontWeight: 700, color: "#1f2937" }}
        >
          Welcome back{user?.name ? `, ${user.name}` : ""}!
        </h1>
        <p data-testid="text-subtitle" style={{ color: "#6b7280", marginTop: "0.5rem" }}>
          Here's an overview of your mental health journey
        </p>
      </div>

      <div
        data-testid="section-quick-actions"
        style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "2rem" }}
      >
        {quickActions.map((action, index) => (
          <Link
            key={action.to}
            to={action.to}
            data-testid={`link-action-${index}`}
            style={{
              padding: "1.25rem",
              background: "white",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              textDecoration: "none",
              textAlign: "center",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{action.icon}</div>
            <div style={{ fontWeight: 600, color: action.color }}>{action.label}</div>
          </Link>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        <div
          style={{
            padding: "1.5rem",
            background: "white",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <h2
            data-testid="text-stats-title"
            style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "1rem", color: "#374151" }}
          >
            Your Mood Overview
          </h2>

          {isLoading ? (
            <div data-testid="loading-stats" style={{ color: "#6b7280", padding: "1rem" }}>
              Loading stats...
            </div>
          ) : stats && stats.total > 0 ? (
            <div data-testid="section-stats" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div style={{ padding: "1rem", background: "#f0fdf4", borderRadius: "8px", textAlign: "center" }}>
                <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "#16a34a" }}>
                  {stats.average.toFixed(1)}
                </div>
                <div style={{ fontSize: "0.85rem", color: "#4b5563" }}>Average Mood</div>
              </div>
              <div style={{ padding: "1rem", background: "#eff6ff", borderRadius: "8px", textAlign: "center" }}>
                <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "#2563eb" }}>
                  {stats.total}
                </div>
                <div style={{ fontSize: "0.85rem", color: "#4b5563" }}>Total Check-ins</div>
              </div>
              <div style={{ padding: "1rem", background: "#faf5ff", borderRadius: "8px", textAlign: "center" }}>
                <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "#7c3aed" }}>
                  {getTrendIcon(stats.trend)} {stats.trend}
                </div>
                <div style={{ fontSize: "0.85rem", color: "#4b5563" }}>Weekly Trend</div>
              </div>
              <div style={{ padding: "1rem", background: "#fefce8", borderRadius: "8px", textAlign: "center" }}>
                <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "#ca8a04" }}>
                  {stats.highest}/{stats.lowest}
                </div>
                <div style={{ fontSize: "0.85rem", color: "#4b5563" }}>High/Low</div>
              </div>
            </div>
          ) : (
            <p data-testid="text-no-stats" style={{ color: "#6b7280" }}>
              Start tracking your mood to see insights here.
            </p>
          )}
        </div>

        <div
          style={{
            padding: "1.5rem",
            background: "white",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <h2
            data-testid="text-history-title"
            style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "1rem", color: "#374151" }}
          >
            Recent Mood Entries
          </h2>

          {isLoading ? (
            <div data-testid="loading-history" style={{ color: "#6b7280", padding: "1rem" }}>
              Loading history...
            </div>
          ) : history.length === 0 ? (
            <div data-testid="text-no-history" style={{ color: "#6b7280" }}>
              <p>You haven't tracked any moods yet.</p>
              <Link
                to="/mood"
                data-testid="link-track-mood"
                style={{
                  display: "inline-block",
                  marginTop: "1rem",
                  padding: "0.75rem 1.25rem",
                  background: "#4f46e5",
                  color: "white",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Track Your First Mood
              </Link>
            </div>
          ) : (
            <ul data-testid="list-recent-moods" style={{ listStyle: "none", padding: 0 }}>
              {history.slice(0, 5).map((entry, index) => {
                const date = new Date(entry.createdAt).toLocaleDateString();
                return (
                  <li
                    key={entry.id}
                    data-testid={`item-mood-${index}`}
                    style={{
                      padding: "0.75rem",
                      marginBottom: "0.5rem",
                      borderRadius: "8px",
                      background: "#f9fafb",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: 600, color: "#374151" }}>Mood: {entry.mood}/10</span>
                      {entry.notes && (
                        <p style={{ fontSize: "0.85rem", color: "#6b7280", margin: "0.25rem 0 0 0" }}>
                          {entry.notes.slice(0, 50)}{entry.notes.length > 50 ? "..." : ""}
                        </p>
                      )}
                    </div>
                    <span style={{ fontSize: "0.75rem", color: "#9ca3af" }}>{date}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
