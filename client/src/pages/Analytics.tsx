import { useState, useEffect } from "react";
import { apiGet } from "../utils/api";

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

export default function Analytics() {
  const [moodData, setMoodData] = useState<MoodEntry[]>([]);
  const [stats, setStats] = useState<MoodStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [historyData, statsData] = await Promise.all([
          apiGet<{ history: MoodEntry[] }>("/api/mood/history?limit=100"),
          apiGet<{ stats: MoodStats }>("/api/mood/stats").catch(() => ({ ok: true, stats: null })),
        ]);

        setMoodData(historyData.history || []);
        if (statsData.stats) {
          setStats(statsData.stats);
        }
      } catch (err) {
        console.error("Failed to load analytics:", err);
        setMoodData([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const getMoodEmoji = (mood: number) => {
    if (mood <= 2) return "😢";
    if (mood <= 4) return "😞";
    if (mood <= 6) return "😐";
    if (mood <= 8) return "🙂";
    return "😊";
  };

  const getMoodColor = (mood: number) => {
    if (mood <= 2) return "#dc2626";
    if (mood <= 4) return "#ea580c";
    if (mood <= 6) return "#ca8a04";
    if (mood <= 8) return "#16a34a";
    return "#059669";
  };

  const getTrendLabel = (trend: string) => {
    switch (trend) {
      case "improving": return { icon: "📈", text: "Improving", color: "#16a34a" };
      case "declining": return { icon: "📉", text: "Declining", color: "#dc2626" };
      default: return { icon: "➡️", text: "Stable", color: "#6b7280" };
    }
  };

  function StatCard({
    title,
    value,
    subtitle,
    emoji,
    color,
    testId,
  }: {
    title: string;
    value: string | number;
    subtitle?: string;
    emoji?: string;
    color?: string;
    testId?: string;
  }) {
    return (
      <div
        data-testid={testId}
        style={{
          padding: "1.5rem",
          background: "white",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
          textAlign: "center",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        {emoji && <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{emoji}</div>}
        <div style={{ fontSize: "2rem", fontWeight: 700, color: color || "#1f2937" }}>{value}</div>
        <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "#6b7280" }}>{title}</div>
        {subtitle && (
          <div style={{ fontSize: "0.8rem", color: "#9ca3af", marginTop: "0.25rem" }}>{subtitle}</div>
        )}
      </div>
    );
  }

  return (
    <div data-testid="page-analytics" style={{ maxWidth: "1000px", margin: "0 auto", padding: "2rem" }}>
      <h1
        data-testid="text-analytics-title"
        style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "0.5rem", color: "#1f2937" }}
      >
        Your Mental Health Insights
      </h1>
      <p data-testid="text-analytics-subtitle" style={{ color: "#6b7280", marginBottom: "2rem" }}>
        Understanding patterns in your mood can help you take better care of yourself.
      </p>

      {isLoading ? (
        <div data-testid="loading-analytics" style={{ padding: "3rem", textAlign: "center", color: "#6b7280" }}>
          Loading your analytics...
        </div>
      ) : moodData.length === 0 ? (
        <div
          data-testid="section-no-data"
          style={{
            padding: "3rem",
            background: "#f9fafb",
            borderRadius: "16px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📊</div>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.5rem", color: "#374151" }}>
            No mood data yet
          </h3>
          <p style={{ color: "#6b7280" }}>
            Start tracking your mood to see insights here.
          </p>
        </div>
      ) : (
        <>
          <div
            data-testid="section-stats"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "1rem",
              marginBottom: "2rem",
            }}
          >
            <StatCard
              testId="stat-average"
              title="Average Mood"
              value={stats?.average?.toFixed(1) || "0"}
              subtitle="All time"
              emoji={getMoodEmoji(stats?.average || 5)}
            />
            <StatCard
              testId="stat-highest"
              title="Highest"
              value={`${stats?.highest || 0}/10`}
              emoji="🎉"
            />
            <StatCard
              testId="stat-lowest"
              title="Lowest"
              value={`${stats?.lowest || 0}/10`}
              emoji="💪"
            />
            <StatCard
              testId="stat-total"
              title="Total Entries"
              value={stats?.total || moodData.length}
              emoji="📝"
            />
            {stats?.trend && (
              <StatCard
                testId="stat-trend"
                title="Weekly Trend"
                value={getTrendLabel(stats.trend).text}
                emoji={getTrendLabel(stats.trend).icon}
                color={getTrendLabel(stats.trend).color}
              />
            )}
          </div>

          <h2
            data-testid="text-timeline-title"
            style={{
              fontSize: "1.25rem",
              fontWeight: 600,
              marginBottom: "1rem",
              color: "#374151",
            }}
          >
            Mood Timeline
          </h2>

          <div
            data-testid="chart-mood-timeline"
            style={{
              background: "white",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              padding: "1.5rem",
              marginBottom: "2rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: "4px",
                height: "200px",
                overflowX: "auto",
              }}
            >
              {moodData.slice(0, 30).reverse().map((entry, index) => {
                const height = (Number(entry.mood) / 10) * 100;
                return (
                  <div
                    key={entry.id}
                    data-testid={`bar-mood-${index}`}
                    title={`${new Date(entry.createdAt).toLocaleDateString()}: ${entry.mood}/10`}
                    style={{
                      flex: "1 1 20px",
                      minWidth: "20px",
                      maxWidth: "40px",
                      height: `${height}%`,
                      background: getMoodColor(Number(entry.mood)),
                      borderRadius: "4px 4px 0 0",
                      cursor: "pointer",
                      transition: "opacity 0.2s",
                    }}
                  />
                );
              })}
            </div>
            <div
              style={{
                marginTop: "0.5rem",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.8rem",
                color: "#9ca3af",
              }}
            >
              <span>Older</span>
              <span>Recent</span>
            </div>
          </div>

          <h2
            data-testid="text-recent-title"
            style={{
              fontSize: "1.25rem",
              fontWeight: 600,
              marginBottom: "1rem",
              color: "#374151",
            }}
          >
            Recent Check-ins
          </h2>

          <div data-testid="list-recent-entries" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {moodData.slice(0, 10).map((entry, index) => (
              <div
                key={entry.id}
                data-testid={`row-mood-${index}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "1rem",
                  background: "white",
                  borderRadius: "10px",
                  border: "1px solid #e5e7eb",
                }}
              >
                <div style={{ fontSize: "1.5rem" }}>{getMoodEmoji(Number(entry.mood))}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: "#374151" }}>
                    Mood: {entry.mood}/10
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
                    {new Date(entry.createdAt).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                {entry.notes && (
                  <div
                    style={{
                      fontSize: "0.9rem",
                      color: "#6b7280",
                      maxWidth: "300px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {entry.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
