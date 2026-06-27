import { useState, useMemo } from "react";
import { Heart, TrendingUp, ChevronLeft, ChevronRight, Sun, Cloud, CloudRain, Zap, Moon, Sparkles } from 'lucide-react';

const MOCK_MOOD_DATA = [
  { date: "2025-12-01", score: 7, emotion: "content", note: "Good day at work" },
  { date: "2025-12-02", score: 8, emotion: "happy", note: "Had a great workout" },
  { date: "2025-12-03", score: 5, emotion: "anxious", note: "Stressful meeting" },
  { date: "2025-12-04", score: 6, emotion: "neutral", note: "Regular day" },
  { date: "2025-12-05", score: 9, emotion: "joyful", note: "Wonderful time with friends" },
  { date: "2025-12-06", score: 7, emotion: "content", note: "Relaxing weekend" },
  { date: "2025-12-07", score: 8, emotion: "grateful", note: "Meditation helped" },
  { date: "2025-12-08", score: 4, emotion: "sad", note: "Feeling low" },
  { date: "2025-12-09", score: 6, emotion: "calm", note: "Better after journaling" },
  { date: "2025-12-10", score: 7, emotion: "hopeful", note: "Good progress" },
  { date: "2025-12-11", score: 8, emotion: "happy", note: "Achieved goal" },
  { date: "2025-12-12", score: 9, emotion: "joyful", note: "Best day this month" },
  { date: "2025-12-13", score: 7, emotion: "peaceful", note: "Mindful morning" },
  { date: "2025-12-14", score: 6, emotion: "content", note: "Steady day" }
];

const EMOTION_COLORS = {
  joyful: { bg: "from-amber-400 to-yellow-500", text: "text-amber-600", icon: Sun },
  happy: { bg: "from-emerald-400 to-green-500", text: "text-emerald-600", icon: Sparkles },
  content: { bg: "from-blue-400 to-cyan-500", text: "text-blue-600", icon: Cloud },
  grateful: { bg: "from-rose-400 to-pink-500", text: "text-rose-600", icon: Heart },
  peaceful: { bg: "from-violet-400 to-purple-500", text: "text-violet-600", icon: Moon },
  hopeful: { bg: "from-teal-400 to-cyan-500", text: "text-teal-600", icon: TrendingUp },
  calm: { bg: "from-indigo-400 to-blue-500", text: "text-indigo-600", icon: Cloud },
  neutral: { bg: "from-gray-400 to-slate-500", text: "text-gray-600", icon: Cloud },
  anxious: { bg: "from-orange-400 to-red-500", text: "text-orange-600", icon: Zap },
  sad: { bg: "from-slate-400 to-gray-500", text: "text-slate-600", icon: CloudRain }
};

export default function MoodVisualizer() {
  const [view, setView] = useState("calendar");
  const [selectedWeek, setSelectedWeek] = useState(0);

  const weeklyData = useMemo(() => {
    const weeks = [];
    for (let i = 0; i < MOCK_MOOD_DATA.length; i += 7) {
      weeks.push(MOCK_MOOD_DATA.slice(i, i + 7));
    }
    return weeks;
  }, []);

  const currentWeek = weeklyData[selectedWeek] || [];

  const stats = useMemo(() => {
    const scores = MOCK_MOOD_DATA.map(d => d.score);
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    const emotionCounts = MOCK_MOOD_DATA.reduce((acc, d) => {
      acc[d.emotion] = (acc[d.emotion] || 0) + 1;
      return acc;
    }, {});
    const topEmotion = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])[0];
    
    return {
      average: avg.toFixed(1),
      highest: Math.max(...scores),
      lowest: Math.min(...scores),
      topEmotion: topEmotion ? topEmotion[0] : "neutral",
      trend: scores[scores.length - 1] > scores[0] ? "up" : "down"
    };
  }, []);

  const getMoodColor = (score) => {
    if (score >= 8) return "bg-emerald-500";
    if (score >= 6) return "bg-blue-500";
    if (score >= 4) return "bg-amber-500";
    return "bg-red-500";
  };

  const getMoodSize = (score) => {
    const base = 8;
    return base + (score * 2);
  };

  const renderCalendarView = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setSelectedWeek(Math.max(0, selectedWeek - 1))}
          disabled={selectedWeek === 0}
          className="p-2 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--text)] disabled:opacity-50 transition-colors"
          data-testid="button-prev-week"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-[var(--text)] font-medium">
          Week {selectedWeek + 1}
        </span>
        <button
          onClick={() => setSelectedWeek(Math.min(weeklyData.length - 1, selectedWeek + 1))}
          disabled={selectedWeek >= weeklyData.length - 1}
          className="p-2 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--text)] disabled:opacity-50 transition-colors"
          data-testid="button-next-week"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
          <div key={i} className="text-center text-xs text-[var(--text-secondary)] font-medium py-2">
            {day}
          </div>
        ))}
        {currentWeek.map((day, index) => {
          const emotion = EMOTION_COLORS[day.emotion] || EMOTION_COLORS.neutral;
          const Icon = emotion.icon;
          
          return (
            <div
              key={index}
              className="aspect-square rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-hover)] transition-all cursor-pointer p-2 flex flex-col items-center justify-center group"
              data-testid={`day-${index}`}
            >
              <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${emotion.bg} flex items-center justify-center text-white mb-1`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-[var(--text)]">{day.score}</span>
              <span className="text-xs text-[var(--text-secondary)] capitalize truncate w-full text-center">
                {day.emotion}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderBubbleView = () => (
    <div className="relative h-64 flex items-end justify-around p-4 bg-[var(--surface)] rounded-xl">
      {MOCK_MOOD_DATA.slice(-14).map((day, index) => {
        const emotion = EMOTION_COLORS[day.emotion] || EMOTION_COLORS.neutral;
        const size = getMoodSize(day.score);
        
        return (
          <div
            key={index}
            className="flex flex-col items-center"
            data-testid={`bubble-${index}`}
          >
            <div
              className={`rounded-full bg-gradient-to-br ${emotion.bg} transition-all hover:scale-110 cursor-pointer flex items-center justify-center text-white font-bold`}
              style={{ 
                width: `${size * 4}px`, 
                height: `${size * 4}px`,
                marginBottom: `${(10 - day.score) * 8}px`
              }}
            >
              {day.score}
            </div>
            <span className="text-xs text-[var(--text-secondary)] mt-1">
              {new Date(day.date).getDate()}
            </span>
          </div>
        );
      })}
    </div>
  );

  const renderWaveView = () => {
    const points = MOCK_MOOD_DATA.slice(-14).map((d, i) => ({
      x: (i / 13) * 100,
      y: 100 - (d.score * 10)
    }));

    const pathD = points.reduce((path, point, i) => {
      if (i === 0) return `M ${point.x} ${point.y}`;
      const prevPoint = points[i - 1];
      const cpX = (prevPoint.x + point.x) / 2;
      return `${path} C ${cpX} ${prevPoint.y}, ${cpX} ${point.y}, ${point.x} ${point.y}`;
    }, "");

    return (
      <div className="relative h-64 bg-[var(--surface)] rounded-xl p-4">
        <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d={`${pathD} L 100 100 L 0 100 Z`}
            fill="url(#waveGradient)"
          />
          <path
            d={pathD}
            fill="none"
            stroke="var(--primary)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {points.map((point, i) => (
            <circle
              key={i}
              cx={point.x}
              cy={point.y}
              r="2"
              fill="var(--primary)"
              className="cursor-pointer hover:r-3"
            />
          ))}
        </svg>
        <div className="absolute bottom-2 left-0 right-0 flex justify-between px-4 text-xs text-[var(--text-secondary)]">
          <span>14 days ago</span>
          <span>Today</span>
        </div>
      </div>
    );
  };

  return (
    <div 
      className="card-elevated p-6"
      role="region"
      aria-label="Mood Visualizer"
      data-testid="mood-visualizer-container"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl text-white">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--text)]">Mood Visualizer</h2>
            <p className="text-sm text-[var(--text-secondary)]">Explore your emotional patterns</p>
          </div>
        </div>
        <div className="flex gap-2">
          {["calendar", "bubble", "wave"].map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                view === v
                  ? "bg-[var(--primary)] text-white"
                  : "bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
              }`}
              data-testid={`view-${v}`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-[var(--surface)] text-center">
          <p className="text-3xl font-bold text-[var(--text)]">{stats.average}</p>
          <p className="text-xs text-[var(--text-secondary)]">Average Mood</p>
        </div>
        <div className="p-4 rounded-xl bg-[var(--surface)] text-center">
          <p className="text-3xl font-bold text-emerald-500">{stats.highest}</p>
          <p className="text-xs text-[var(--text-secondary)]">Highest</p>
        </div>
        <div className="p-4 rounded-xl bg-[var(--surface)] text-center">
          <p className="text-3xl font-bold text-amber-500">{stats.lowest}</p>
          <p className="text-xs text-[var(--text-secondary)]">Lowest</p>
        </div>
        <div className="p-4 rounded-xl bg-[var(--surface)] text-center">
          <p className="text-lg font-bold text-[var(--text)] capitalize">{stats.topEmotion}</p>
          <p className="text-xs text-[var(--text-secondary)]">Most Frequent</p>
        </div>
      </div>

      {view === "calendar" && renderCalendarView()}
      {view === "bubble" && renderBubbleView()}
      {view === "wave" && renderWaveView()}

      <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-[var(--primary)]/10 to-transparent">
        <div className="flex items-center gap-3">
          <TrendingUp className={`w-5 h-5 ${stats.trend === "up" ? "text-emerald-500" : "text-amber-500"}`} />
          <div>
            <p className="font-medium text-[var(--text)]">
              {stats.trend === "up" ? "Your mood is trending upward!" : "Room for growth"}
            </p>
            <p className="text-sm text-[var(--text-secondary)]">
              {stats.trend === "up" 
                ? "Keep up the great wellness practices!"
                : "Try exploring new wellness tools to boost your mood."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
