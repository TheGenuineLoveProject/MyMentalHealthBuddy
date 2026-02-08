import { useState, useMemo } from "react";
import { 
  BarChart3, TrendingUp, Calendar, Clock, Target, Award,
  Heart, Brain, Moon, Flame, ChevronLeft, ChevronRight,
  Download, Share2, Sparkles, Zap, Activity
} from "lucide-react";
import { useGamification } from "../context/GamificationContext.jsx";

const MOCK_WEEKLY_DATA = [
  { day: "Mon", tools: 3, minutes: 25, mood: 7 },
  { day: "Tue", tools: 5, minutes: 42, mood: 8 },
  { day: "Wed", tools: 2, minutes: 18, mood: 6 },
  { day: "Thu", tools: 4, minutes: 35, mood: 7 },
  { day: "Fri", tools: 6, minutes: 55, mood: 9 },
  { day: "Sat", tools: 3, minutes: 28, mood: 8 },
  { day: "Sun", tools: 4, minutes: 38, mood: 8 },
];

const INSIGHTS = [
  {
    id: 1,
    type: "positive",
    title: "Mindfulness Streak",
    description: "You've practiced mindfulness 5 days in a row! This consistency is building lasting neural pathways.",
    icon: Moon,
    color: "from-violet-500 to-purple-600"
  },
  {
    id: 2,
    type: "tip",
    title: "Best Time for Practice",
    description: "Your mood scores are highest after morning sessions. Consider scheduling more AM wellness time.",
    icon: Clock,
    color: "from-amber-500 to-orange-600"
  },
  {
    id: 3,
    type: "achievement",
    title: "Emotional Growth",
    description: "Your emotional awareness has improved by 32% this month based on your journal entries.",
    icon: Heart,
    color: "from-rose-500 to-pink-600"
  }
];

const CATEGORY_STATS = [
  { name: "Mindfulness", sessions: 24, minutes: 180, color: "from-violet-400 to-purple-500", icon: Moon },
  { name: "Emotional", sessions: 18, minutes: 145, color: "from-rose-400 to-pink-500", icon: Heart },
  { name: "Tracking", sessions: 32, minutes: 95, color: "from-emerald-400 to-teal-500", icon: Target },
  { name: "Self-Care", sessions: 15, minutes: 120, color: "from-amber-400 to-orange-500", icon: Sparkles },
  { name: "Growth", sessions: 12, minutes: 88, color: "from-blue-400 to-indigo-500", icon: Brain },
  { name: "Healing", sessions: 8, minutes: 65, color: "from-cyan-400 to-blue-500", icon: Activity },
];

export default function ProgressAnalytics() {
  const [timeRange, setTimeRange] = useState("week");
  const [selectedMetric, setSelectedMetric] = useState("tools");
  const { progress } = useGamification();

  const weeklyStats = useMemo(() => {
    const totalTools = MOCK_WEEKLY_DATA.reduce((sum, d) => sum + d.tools, 0);
    const totalMinutes = MOCK_WEEKLY_DATA.reduce((sum, d) => sum + d.minutes, 0);
    const avgMood = (MOCK_WEEKLY_DATA.reduce((sum, d) => sum + d.mood, 0) / 7).toFixed(1);
    return { totalTools, totalMinutes, avgMood };
  }, []);

  const maxValue = useMemo(() => {
    return Math.max(...MOCK_WEEKLY_DATA.map(d => d[selectedMetric]));
  }, [selectedMetric]);

  const renderBarChart = () => (
    <div className="h-48 flex items-end justify-between gap-2 px-2">
      {MOCK_WEEKLY_DATA.map((day, index) => {
        const value = day[selectedMetric];
        const height = (value / maxValue) * 100;
        const colors = {
          tools: "from-violet-500 to-purple-600",
          minutes: "from-emerald-500 to-teal-600",
          mood: "from-rose-500 to-pink-600"
        };
        
        return (
          <div 
            key={day.day} 
            className="flex-1 flex flex-col items-center gap-2"
            data-testid={`bar-${day.day.toLowerCase()}`}
          >
            <div className="w-full flex flex-col items-center">
              <span className="text-xs font-medium text-[var(--text)] mb-1">
                {value}{selectedMetric === "minutes" ? "m" : ""}
              </span>
              <div 
                className={`w-full rounded-t-lg bg-gradient-to-t ${colors[selectedMetric]} transition-all duration-500`}
                style={{ height: `${Math.max(height, 8)}%` }}
              />
            </div>
            <span className="text-xs text-[var(--text-secondary)]">{day.day}</span>
          </div>
        );
      })}
    </div>
  );

  const renderStatCard = (icon, label, value, subtext, color) => {
    const Icon = icon;
    return (
      <div className="card-elevated p-4 flex items-center gap-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color} text-white`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-2xl font-bold text-[var(--text)]">{value}</p>
          <p className="text-sm text-[var(--text-secondary)]">{label}</p>
          {subtext && (
            <p className="text-xs text-emerald-500 flex items-center gap-1 mt-0.5">
              <TrendingUp className="w-3 h-3" />
              {subtext}
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div 
      className="card-elevated p-6 space-y-6"
      role="region"
      aria-label="Progress Analytics Dashboard"
      data-testid="progress-analytics-container"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl text-white">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--text)]">Progress Analytics</h2>
            <p className="text-sm text-[var(--text-secondary)]">See how you're doing over time</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 rounded-lg bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] text-sm"
            data-testid="select-time-range"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">Last 3 Months</option>
          </select>
          <button 
            className="p-2 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] transition-colors"
            data-testid="button-download-report"
            aria-label="Download report"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {renderStatCard(Target, "Tools Used", weeklyStats.totalTools, "+12% vs last week", "from-violet-500 to-purple-600")}
        {renderStatCard(Clock, "Minutes Active", weeklyStats.totalMinutes, "+8% vs last week", "from-emerald-500 to-teal-600")}
        {renderStatCard(Heart, "Avg Mood", weeklyStats.avgMood, "Stable trend", "from-rose-500 to-pink-600")}
        {renderStatCard(Flame, "Current Streak", progress?.currentStreak || 0, "Keep it up!", "from-orange-500 to-amber-600")}
      </div>

      <div className="card-elevated p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[var(--text)]">Weekly Activity</h3>
          <div className="flex gap-2">
            {[
              { key: "tools", label: "Tools", icon: Target },
              { key: "minutes", label: "Minutes", icon: Clock },
              { key: "mood", label: "Mood", icon: Heart }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setSelectedMetric(key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  selectedMetric === key
                    ? "bg-[var(--primary)] text-white"
                    : "bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
                }`}
                data-testid={`button-metric-${key}`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>
        {renderBarChart()}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card-elevated p-5">
          <h3 className="font-semibold text-[var(--text)] mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            AI Insights
          </h3>
          <div className="space-y-3">
            {INSIGHTS.map(insight => {
              const Icon = insight.icon;
              return (
                <div 
                  key={insight.id}
                  className="p-4 rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-hover)] transition-colors"
                  data-testid={`insight-${insight.id}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${insight.color} text-white`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-medium text-[var(--text)] text-sm">{insight.title}</h4>
                      <p className="text-xs text-[var(--text-secondary)] mt-1">{insight.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card-elevated p-5">
          <h3 className="font-semibold text-[var(--text)] mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-violet-500" />
            Category Breakdown
          </h3>
          <div className="space-y-3">
            {CATEGORY_STATS.map(cat => {
              const Icon = cat.icon;
              const maxSessions = Math.max(...CATEGORY_STATS.map(c => c.sessions));
              const width = (cat.sessions / maxSessions) * 100;
              
              return (
                <div 
                  key={cat.name}
                  className="space-y-1.5"
                  data-testid={`category-${cat.name.toLowerCase()}`}
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-[var(--text)]">
                      <Icon className="w-4 h-4" />
                      {cat.name}
                    </span>
                    <span className="text-[var(--text-secondary)]">
                      {cat.sessions} sessions • {cat.minutes}m
                    </span>
                  </div>
                  <div className="h-2 bg-[var(--surface)] rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${cat.color} transition-all duration-500`}
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="card-elevated p-5 bg-gradient-to-br from-[var(--primary)]/10 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[var(--primary)] rounded-xl text-white">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-[var(--text)] text-lg">Level {progress?.level || 1} Wellness Champion</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                {progress?.totalXp || 0} XP earned • Top 15% of users this week
              </p>
            </div>
          </div>
          <button 
            className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
            data-testid="button-share-progress"
          >
            <Share2 className="w-4 h-4" />
            Share Progress
          </button>
        </div>
      </div>
    </div>
  );
}
