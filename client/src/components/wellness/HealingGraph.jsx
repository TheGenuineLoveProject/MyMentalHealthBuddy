import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, BarChart3, Calendar, Sparkles, ChevronDown, LineChart } from "lucide-react";
import { Skeleton } from "../ui/Skeleton";

const EMOTIONS = {
  Happy: { score: 8, color: "#22c55e" },
  Grateful: { score: 9, color: "#d4af37" },
  Calm: { score: 7, color: "#3b82f6" },
  Hopeful: { score: 8, color: "#8fbf9f" },
  Neutral: { score: 5, color: "#64748b" },
  Anxious: { score: 3, color: "#f59e0b" },
  Sad: { score: 2, color: "#6366f1" },
  Overwhelmed: { score: 1, color: "#8b5cf6" },
};

const TIME_RANGES = [
  { label: "7 Days", days: 7 },
  { label: "14 Days", days: 14 },
  { label: "30 Days", days: 30 },
  { label: "90 Days", days: 90 },
];

function getEmotionScore(emotion) {
  return EMOTIONS[emotion]?.score || 5;
}

function formatDate(date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function GraphSkeleton() {
  return (
    <div className="bg-softWhite dark:bg-gray-800 rounded-xl shadow-lg border border-sageGreen/20 dark:border-gray-700 overflow-hidden">
      <div className="p-4 border-b border-sageGreen/20 dark:border-gray-700 bg-gradient-to-r from-metallicGold/10 to-softWhite">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-4 gap-3 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="text-center p-3 rounded-xl bg-gray-100 dark:bg-gray-700">
              <Skeleton className="h-8 w-12 mx-auto mb-1" />
              <Skeleton className="h-3 w-16 mx-auto" />
            </div>
          ))}
        </div>
        <div className="h-32 flex items-end gap-1">
          {Array.from({ length: 14 }).map((_, i) => (
            <div 
              key={i} 
              className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-t animate-pulse motion-reduce:animate-none"
              style={{ height: `${20 + Math.random() * 60}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function EmptyGraphState() {
  return (
    <div className="text-center py-8 px-4">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-metallicGold/10 flex items-center justify-center">
        <LineChart className="w-8 h-8 text-metallicGold" />
      </div>
      <h3 className="font-serif text-lg font-semibold text-deepTeal dark:text-white mb-2">
        Track your healing journey
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs mx-auto">
        Log a few mood entries to see your wellness trends and patterns emerge.
      </p>
    </div>
  );
}

export default function HealingGraph({ className = "" }) {
  const [timeRange, setTimeRange] = useState(TIME_RANGES[0]);
  const [showDropdown, setShowDropdown] = useState(false);

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["/api/mood"],
    staleTime: 30000,
  });

  if (isLoading) {
    return (
      <div className={`healing-graph ${className}`} data-testid="healing-graph-loading">
        <GraphSkeleton />
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className={`healing-graph ${className}`} data-testid="healing-graph-empty">
        <div className="bg-softWhite dark:bg-gray-800 rounded-xl shadow-lg border border-sageGreen/20 dark:border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-sageGreen/20 dark:border-gray-700 bg-gradient-to-r from-metallicGold/10 to-softWhite">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-metallicGold" aria-hidden="true" />
              <h2 className="font-serif text-lg font-semibold text-deepTeal dark:text-white">Healing Journey</h2>
            </div>
          </div>
          <EmptyGraphState />
        </div>
      </div>
    );
  }

  const graphData = useMemo(() => {
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - timeRange.days);

    const dailyScores = {};
    const dailyCounts = {};
    const dailyEmotions = {};

    for (let i = 0; i < timeRange.days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const key = date.toDateString();
      dailyScores[key] = 0;
      dailyCounts[key] = 0;
      dailyEmotions[key] = [];
    }

    entries.forEach((entry) => {
      const entryDate = new Date(entry.createdAt);
      if (entryDate >= startDate && entryDate <= now) {
        const key = entryDate.toDateString();
        if (key in dailyScores) {
          dailyScores[key] += getEmotionScore(entry.emotion);
          dailyCounts[key] += 1;
          dailyEmotions[key].push(entry.emotion);
        }
      }
    });

    const data = Object.keys(dailyScores).map((key) => {
      const count = dailyCounts[key];
      const avgScore = count > 0 ? dailyScores[key] / count : null;
      return {
        date: new Date(key),
        dateStr: formatDate(new Date(key)),
        score: avgScore,
        count,
        emotions: dailyEmotions[key],
      };
    });

    return data.sort((a, b) => a.date - b.date);
  }, [entries, timeRange]);

  const stats = useMemo(() => {
    const validDays = graphData.filter((d) => d.score !== null);
    if (validDays.length === 0) {
      return { avg: 0, trend: 0, totalEntries: 0, activeDays: 0 };
    }

    const avg = validDays.reduce((sum, d) => sum + d.score, 0) / validDays.length;
    const totalEntries = validDays.reduce((sum, d) => sum + d.count, 0);

    const firstHalf = validDays.slice(0, Math.floor(validDays.length / 2));
    const secondHalf = validDays.slice(Math.floor(validDays.length / 2));
    const firstAvg = firstHalf.length > 0 ? firstHalf.reduce((s, d) => s + d.score, 0) / firstHalf.length : 0;
    const secondAvg = secondHalf.length > 0 ? secondHalf.reduce((s, d) => s + d.score, 0) / secondHalf.length : 0;
    const trend = secondAvg - firstAvg;

    return { avg, trend, totalEntries, activeDays: validDays.length };
  }, [graphData]);

  const maxScore = 10;
  const graphHeight = 120;

  const getBarHeight = (score) => {
    if (score === null) return 0;
    return (score / maxScore) * graphHeight;
  };

  const getBarColor = (score) => {
    if (score === null) return "#e5e7eb";
    if (score >= 7) return "#22c55e";
    if (score >= 5) return "#8fbf9f";
    if (score >= 3) return "#f59e0b";
    return "#6366f1";
  };

  const getWellnessLabel = (avg) => {
    if (avg >= 7) return { text: "Thriving", color: "#22c55e" };
    if (avg >= 5) return { text: "Growing", color: "#8fbf9f" };
    if (avg >= 3) return { text: "Healing", color: "#f59e0b" };
    return { text: "Seeking", color: "#6366f1" };
  };

  const wellnessLabel = getWellnessLabel(stats.avg);

  return (
    <div className={`healing-graph ${className}`} data-testid="healing-graph">
      <div className="bg-softWhite dark:bg-gray-800 rounded-xl shadow-lg border border-sageGreen/20 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-sageGreen/20 dark:border-gray-700 bg-gradient-to-r from-metallicGold/10 to-softWhite">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-metallicGold" aria-hidden="true" />
              <h2 className="font-serif text-lg font-semibold text-deepTeal dark:text-white">Healing Journey</h2>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                onKeyDown={(e) => e.key === "Escape" && setShowDropdown(false)}
                aria-expanded={showDropdown}
                aria-controls="time-range-menu"
                aria-haspopup="listbox"
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-softWhite border border-sageGreen/30 font-sans text-sm text-deepTeal hover:bg-sageGreen/10 transition"
                data-testid="time-range-selector"
              >
                {timeRange.label}
                <ChevronDown className="w-4 h-4" />
              </button>
              {showDropdown && (
                <div
                  id="time-range-menu"
                  role="listbox"
                  aria-label="Select time range"
                  className="absolute right-0 mt-1 w-28 bg-softWhite dark:bg-gray-700 rounded-lg shadow-lg border border-sageGreen/20 z-10"
                >
                  {TIME_RANGES.map((range) => (
                    <button
                      key={range.days}
                      role="option"
                      aria-selected={timeRange.days === range.days}
                      onClick={() => {
                        setTimeRange(range);
                        setShowDropdown(false);
                      }}
                      onKeyDown={(e) => e.key === "Escape" && setShowDropdown(false)}
                      className={`w-full px-3 py-2 text-left font-sans text-sm hover:bg-sageGreen/10 transition ${
                        timeRange.days === range.days ? "text-deepTeal font-medium" : "text-deepTeal/70"
                      }`}
                      data-testid={`range-${range.days}`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-4 gap-3 mb-6">
            <div className="text-center p-3 rounded-xl bg-sageGreen/10">
              <p className="font-sans text-2xl font-bold text-deepTeal">{stats.avg.toFixed(1)}</p>
              <p className="font-sans text-xs text-deepTeal/60">Avg Score</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-metallicGold/10">
              <p className="font-sans text-2xl font-bold text-metallicGold">{stats.totalEntries}</p>
              <p className="font-sans text-xs text-deepTeal/60">Entries</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-deepTeal/10">
              <p className="font-sans text-2xl font-bold text-deepTeal">{stats.activeDays}</p>
              <p className="font-sans text-xs text-deepTeal/60">Active Days</p>
            </div>
            <div className="text-center p-3 rounded-xl" style={{ backgroundColor: `${wellnessLabel.color}15` }}>
              <div className="flex items-center justify-center gap-1">
                {stats.trend > 0 && <TrendingUp className="w-4 h-4" style={{ color: wellnessLabel.color }} />}
                <p className="font-sans text-sm font-bold" style={{ color: wellnessLabel.color }}>
                  {wellnessLabel.text}
                </p>
              </div>
              <p className="font-sans text-xs text-deepTeal/60">Status</p>
            </div>
          </div>

          <figure
            className="relative"
            style={{ height: graphHeight + 40 }}
            aria-label={`Healing journey graph showing ${timeRange.label} of emotional wellness data`}
          >
            <figcaption className="sr-only">
              Average score: {stats.avg.toFixed(1)} out of 10. {stats.totalEntries} entries across {stats.activeDays} active days.
            </figcaption>
            <div className="absolute left-0 top-0 bottom-8 w-8 flex flex-col justify-between text-right pr-2">
              <span className="font-sans text-xs text-deepTeal/40">10</span>
              <span className="font-sans text-xs text-deepTeal/40">5</span>
              <span className="font-sans text-xs text-deepTeal/40">0</span>
            </div>

            <div className="ml-8 h-full">
              <div 
                className="flex items-end gap-1 h-full pb-8"
                style={{ height: graphHeight }}
                role="img"
                aria-label="Bar chart showing daily wellness scores"
              >
                {graphData.map((day, idx) => (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center justify-end group relative"
                    data-testid={`graph-bar-${idx}`}
                    tabIndex={day.score !== null ? 0 : -1}
                    onFocus={(e) => e.currentTarget.querySelector('.tooltip')?.classList.remove('hidden')}
                    onBlur={(e) => e.currentTarget.querySelector('.tooltip')?.classList.add('hidden')}
                    aria-label={day.score !== null ? `${day.dateStr}: Score ${day.score.toFixed(1)}, ${day.count} ${day.count === 1 ? "entry" : "entries"}` : `${day.dateStr}: No entries`}
                  >
                    <div
                      className="w-full rounded-t-sm transition-all duration-300 hover:opacity-80 focus:opacity-80"
                      style={{
                        height: getBarHeight(day.score),
                        backgroundColor: getBarColor(day.score),
                        minHeight: day.score !== null ? 4 : 0,
                      }}
                    />
                    
                    {day.score !== null && (
                      <div className="tooltip absolute bottom-full mb-2 hidden group-hover:block group-focus-within:block bg-deepTeal text-softWhite px-2 py-1 rounded text-xs font-sans whitespace-nowrap z-10">
                        <p className="font-medium">{day.dateStr}</p>
                        <p>Score: {day.score.toFixed(1)}</p>
                        <p>{day.count} {day.count === 1 ? "entry" : "entries"}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-1 text-xs font-sans text-deepTeal/40">
                <span>{graphData[0]?.dateStr}</span>
                <span>{graphData[graphData.length - 1]?.dateStr}</span>
              </div>
            </div>
          </figure>
        </div>

        {stats.totalEntries > 0 && (
          <div className="border-t border-sageGreen/20 dark:border-gray-700 p-4 bg-gradient-to-r from-sageGreen/5 to-metallicGold/5">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-metallicGold flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-sans text-sm text-deepTeal dark:text-white">
                  {stats.trend > 0.5 ? (
                    <>Your emotional wellness is <span className="font-medium text-sageGreen">improving</span>! Keep nurturing yourself.</>
                  ) : stats.trend < -0.5 ? (
                    <>It's okay to have challenging times. <span className="font-medium text-deepTeal">Every step matters</span>.</>
                  ) : (
                    <>You're maintaining <span className="font-medium text-deepTeal">steady emotional balance</span>. Well done!</>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {stats.totalEntries === 0 && (
          <div className="border-t border-sageGreen/20 dark:border-gray-700 p-6 text-center">
            <Calendar className="w-8 h-8 text-deepTeal/30 mx-auto mb-2" aria-hidden="true" />
            <p className="font-sans text-sm text-deepTeal/60 dark:text-gray-400">
              Start logging your emotions to see your healing journey unfold.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
