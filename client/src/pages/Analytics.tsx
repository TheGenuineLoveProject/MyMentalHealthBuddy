import { useState, useEffect } from "react";

type MoodEntry = {
  id: string;
  mood: number;
  notes?: string;
  createdAt: string;
};

export default function Analytics() {
  const [moodData, setMoodData] = useState<MoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMoodData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers: Record<string, string> = {};
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const res = await fetch("/mood/history", { headers });
        const data = await res.json();

        if (data && Array.isArray(data.history)) {
          setMoodData(data.history);
        } else {
          setMoodData([]);
        }
      } catch (err) {
        console.error("Failed to load mood data:", err);
        setMoodData([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadMoodData();
  }, []);

  const calculateStats = () => {
    if (moodData.length === 0) return null;

    const moods = moodData.map((e) => Number(e.mood));
    const average = moods.reduce((a, b) => a + b, 0) / moods.length;
    const highest = Math.max(...moods);
    const lowest = Math.min(...moods);

    const lastWeekData = moodData.filter((e) => {
      const entryDate = new Date(e.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return entryDate >= weekAgo;
    });

    const weeklyAvg =
      lastWeekData.length > 0
        ? lastWeekData.map((e) => Number(e.mood)).reduce((a, b) => a + b, 0) / lastWeekData.length
        : 0;

    return {
      average: average.toFixed(1),
      highest,
      lowest,
      totalEntries: moodData.length,
      weeklyEntries: lastWeekData.length,
      weeklyAvg: weeklyAvg.toFixed(1),
    };
  };

  const getMoodEmoji = (mood: number) => {
    if (mood <= 2) return "😢";
    if (mood <= 4) return "😞";
    if (mood <= 6) return "😐";
    if (mood <= 8) return "😊";
    return "😁";
  };

  const getMoodColor = (mood: number) => {
    if (mood <= 2) return "#ef4444";
    if (mood <= 4) return "#f97316";
    if (mood <= 6) return "#eab308";
    if (mood <= 8) return "#22c55e";
    return "#10b981";
  };

  const stats = calculateStats();

  const StatCard = ({
    title,
    value,
    subtitle,
    emoji,
  }: {
    title: string;
    value: string | number;
    subtitle?: string;
    emoji?: string;
  }) => (
    <div
      style={{
        padding: "1.5rem",
        background: "white",
        borderRadius: "12px",
        border: "1px solid #e5e7eb",
        textAlign: "center",
      }}
    >
      {emoji && <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{emoji}</div>}
      <div style={{ fontSize: "2rem", fontWeight: 700, color: "#1f2937" }}>{value}</div>
      <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "#6b7280" }}>{title}</div>
      {subtitle && (
        <div style={{ fontSize: "0.8rem", color: "#9ca3af", marginTop: "0.25rem" }}>{subtitle}</div>
      )}
    </div>
  );

  return (
    <div data-testid="page-analytics" style={{ maxWidth: "1000px", margin: "0 auto", padding: "2rem" }}>
      <h1
        data-testid="text-analytics-title"
        style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "0.5rem" }}
      >
        Your Mental Health Insights
      </h1>
      <p style={{ color: "#6b7280", marginBottom: "2rem" }}>
        Understanding patterns in your mood can help you take better care of yourself.
      </p>

      {isLoading && (
        <p data-testid="text-loading" style={{ color: "#6b7280" }}>
          Loading your analytics...
        </p>
      )}

      {!isLoading && moodData.length === 0 && (
        <div
          data-testid="text-no-data"
          style={{
            padding: "3rem",
            background: "#f9fafb",
            borderRadius: "16px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📊</div>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.5rem" }}>
            No mood data yet
          </h3>
          <p style={{ color: "#6b7280" }}>
            Start tracking your mood to see insights here.
          </p>
        </div>
      )}

      {!isLoading && stats && (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "1rem",
              marginBottom: "2rem",
            }}
          >
            <StatCard
              title="Average Mood"
              value={stats.average}
              subtitle="All time"
              emoji={getMoodEmoji(Number(stats.average))}
            />
            <StatCard title="Highest" value={`${stats.highest}/10`} emoji="🎉" />
            <StatCard title="Lowest" value={`${stats.lowest}/10`} emoji="💪" />
            <StatCard title="Total Entries" value={stats.totalEntries} emoji="📝" />
            <StatCard
              title="This Week"
              value={stats.weeklyAvg}
              subtitle={`${stats.weeklyEntries} entries`}
              emoji="📅"
            />
          </div>

          <h2
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
            style={{
              background: "white",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              padding: "1.5rem",
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
            style={{
              fontSize: "1.25rem",
              fontWeight: 600,
              margin: "2rem 0 1rem",
              color: "#374151",
            }}
          >
            Recent Check-ins
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {moodData.slice(0, 10).map((entry) => (
              <div
                key={entry.id}
                data-testid={`row-mood-${entry.id}`}
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
