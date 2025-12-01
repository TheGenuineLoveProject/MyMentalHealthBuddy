import { useState, useEffect } from "react";
import { apiGet } from "../utils/api";
import { BarChart3, TrendingUp, TrendingDown, Minus, Calendar, Award } from "lucide-react";

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

  const getTrendInfo = (trend: string) => {
    switch (trend) {
      case "improving": return { Icon: TrendingUp, text: "Improving", color: "#16a34a", bg: "#dcfce7" };
      case "declining": return { Icon: TrendingDown, text: "Needs attention", color: "#dc2626", bg: "#fef2f2" };
      default: return { Icon: Minus, text: "Stable", color: "#6b7280", bg: "#f3f4f6" };
    }
  };

  return (
    <div data-testid="page-analytics" className="min-h-screen" style={{ background: "var(--background)" }}>
      <div 
        className="py-12 px-6 mb-8 animate-fade-in"
        style={{ 
          background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
          borderRadius: "0 0 2rem 2rem"
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BarChart3 className="w-10 h-10 text-white" />
            <h1 
              data-testid="text-analytics-title"
              className="text-3xl font-bold text-white"
            >
              Your Mental Health Insights
            </h1>
          </div>
          <p className="text-white/90 text-lg">
            Understanding patterns in your mood helps you take better care of yourself
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-12">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="skeleton h-32 rounded-xl" data-testid={`skeleton-stat-${i}`} />
            ))}
          </div>
        ) : moodData.length === 0 ? (
          <div 
            data-testid="section-no-data"
            className="card p-8 text-center animate-fade-in"
          >
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
              No mood data yet
            </h3>
            <p style={{ color: "var(--text-secondary)" }}>
              Start tracking your mood to see beautiful insights here.
            </p>
          </div>
        ) : (
          <>
            <div 
              data-testid="section-stats"
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            >
              <div className="card p-5 text-center animate-fade-in stagger-1" data-testid="stat-average">
                <div className="text-4xl mb-2">{getMoodEmoji(stats?.average || 5)}</div>
                <div className="text-3xl font-bold" style={{ color: getMoodColor(stats?.average || 5) }}>
                  {stats?.average?.toFixed(1) || "0"}
                </div>
                <div className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  Average Mood
                </div>
              </div>
              
              <div className="card p-5 text-center animate-fade-in stagger-2" data-testid="stat-highest">
                <Award className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                <div className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
                  {stats?.highest || 0}/10
                </div>
                <div className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  Highest Mood
                </div>
              </div>
              
              <div className="card p-5 text-center animate-fade-in stagger-3" data-testid="stat-total">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                <div className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
                  {stats?.total || moodData.length}
                </div>
                <div className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  Total Entries
                </div>
              </div>
              
              {stats?.trend && (
                <div className="card p-5 text-center animate-fade-in stagger-4" data-testid="stat-trend">
                  {(() => {
                    const trendInfo = getTrendInfo(stats.trend);
                    return (
                      <>
                        <div 
                          className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center"
                          style={{ background: trendInfo.bg }}
                        >
                          <trendInfo.Icon className="w-6 h-6" style={{ color: trendInfo.color }} />
                        </div>
                        <div className="text-lg font-bold" style={{ color: trendInfo.color }}>
                          {trendInfo.text}
                        </div>
                        <div className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                          Weekly Trend
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>

            <div className="card p-6 mb-8 animate-fade-in" data-testid="chart-mood-timeline">
              <h2 
                data-testid="text-timeline-title"
                className="text-lg font-semibold mb-4"
                style={{ color: "var(--text-primary)" }}
              >
                Mood Timeline
              </h2>
              <div className="flex items-end gap-1 h-48 overflow-x-auto pb-2">
                {moodData.slice(0, 30).reverse().map((entry, index) => {
                  const height = (Number(entry.mood) / 10) * 100;
                  return (
                    <div
                      key={entry.id}
                      data-testid={`bar-mood-${index}`}
                      title={`${new Date(entry.createdAt).toLocaleDateString()}: ${entry.mood}/10`}
                      className="flex-1 min-w-5 max-w-10 rounded-t cursor-pointer transition-all hover:opacity-80"
                      style={{
                        height: `${height}%`,
                        background: getMoodColor(Number(entry.mood)),
                      }}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between text-xs mt-2" style={{ color: "var(--text-muted)" }}>
                <span>Older</span>
                <span>Recent</span>
              </div>
            </div>

            <div className="card p-6 animate-fade-in" data-testid="list-recent-entries">
              <h2 
                data-testid="text-recent-title"
                className="text-lg font-semibold mb-4"
                style={{ color: "var(--text-primary)" }}
              >
                Recent Check-ins
              </h2>
              <div className="space-y-3">
                {moodData.slice(0, 10).map((entry, index) => (
                  <div
                    key={entry.id}
                    data-testid={`row-mood-${index}`}
                    className="flex items-center gap-4 p-4 rounded-xl transition-all hover:scale-[1.01]"
                    style={{ background: "var(--background)" }}
                  >
                    <div className="text-3xl">{getMoodEmoji(Number(entry.mood))}</div>
                    <div className="flex-1">
                      <div className="font-semibold" style={{ color: "var(--text-primary)" }}>
                        Mood: {entry.mood}/10
                      </div>
                      <div className="text-sm" style={{ color: "var(--text-muted)" }}>
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
                        className="text-sm max-w-xs truncate"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {entry.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
