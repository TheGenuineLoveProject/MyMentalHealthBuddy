import { useState, useEffect, useMemo } from "react";
import { Link } from "wouter";
import { ArrowLeft, TrendingUp, Flame, Target, Calendar, Award, BarChart3, Heart, Brain, Sparkles, ChevronRight } from "lucide-react";

const STORAGE_KEYS = {
  mood: "glp_mood_entries",
  journal: "glp_journal_entries",
  dailyRitual: "glp_daily_ritual",
  insightCards: "glp_insight_cards",
  guidedJournaling: "glp_guided_journaling",
  wisdomPractices: "glp_wisdom_practices",
  knowledgeSynthesis: "glp_knowledge_synthesis"
};

interface MoodEntry {
  date: string;
  value: number;
  note?: string;
}

interface StreakData {
  current: number;
  longest: number;
  lastActive: string;
}

interface ThemeCount {
  theme: string;
  count: number;
}

const loadJSON = (key: string, defaultValue: any = null) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const getDayKey = (date: Date) => date.toISOString().split("T")[0];

const calculateStreak = (dates: string[]): StreakData => {
  if (dates.length === 0) return { current: 0, longest: 0, lastActive: "" };
  
  const sortedDates = [...new Set(dates.map(d => getDayKey(new Date(d))))].sort().reverse();
  const today = getDayKey(new Date());
  const yesterday = getDayKey(new Date(Date.now() - 86400000));
  
  let current = 0;
  let longest = 0;
  let tempStreak = 0;
  
  if (sortedDates[0] === today || sortedDates[0] === yesterday) {
    for (let i = 0; i < sortedDates.length; i++) {
      const expected = getDayKey(new Date(Date.now() - i * 86400000));
      if (sortedDates[i] === expected) {
        current++;
      } else {
        break;
      }
    }
  }
  
  for (let i = 0; i < sortedDates.length; i++) {
    if (i === 0 || getDayKey(new Date(new Date(sortedDates[i-1]).getTime() - 86400000)) === sortedDates[i]) {
      tempStreak++;
      longest = Math.max(longest, tempStreak);
    } else {
      tempStreak = 1;
    }
  }
  
  return { current, longest, lastActive: sortedDates[0] || "" };
};

export default function ProgressDashboardPage() {
  const [moodData, setMoodData] = useState<MoodEntry[]>([]);
  const [activityDates, setActivityDates] = useState<string[]>([]);
  const [topThemes, setTopThemes] = useState<ThemeCount[]>([]);
  const [totalActivities, setTotalActivities] = useState(0);

  useEffect(() => {
    const moods = loadJSON(STORAGE_KEYS.mood, []);
    setMoodData(Array.isArray(moods) ? moods : []);
    
    const allDates: string[] = [];
    let activities = 0;
    const themeCounts: Record<string, number> = {};
    
    Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
      const data = loadJSON(key);
      if (!data) return;
      
      if (Array.isArray(data)) {
        data.forEach((item: any) => {
          if (item.date) allDates.push(item.date);
          if (item.theme) themeCounts[item.theme] = (themeCounts[item.theme] || 0) + 1;
        });
        activities += data.length;
      } else if (typeof data === "object") {
        if (data.entries) activities += data.entries.length;
        if (data.cards) {
          activities += data.cards.length;
          data.cards.forEach((c: any) => {
            if (c.theme) themeCounts[c.theme] = (themeCounts[c.theme] || 0) + 1;
            if (c.date) allDates.push(c.date);
          });
        }
        if (data.completedPaths) activities += data.completedPaths.length;
        if (data.contemplations) activities += data.contemplations.length;
        if (data.gratitudeEntries) activities += data.gratitudeEntries.length;
        if (data.meditations) activities += data.meditations.length;
      }
    });
    
    setActivityDates(allDates);
    setTotalActivities(activities);
    
    const sortedThemes = Object.entries(themeCounts)
      .map(([theme, count]) => ({ theme, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    setTopThemes(sortedThemes);
  }, []);

  const streak = useMemo(() => calculateStreak(activityDates), [activityDates]);

  const moodTrend = useMemo(() => {
    if (moodData.length < 2) return { direction: "stable", change: 0 };
    const recent = moodData.slice(-7);
    const older = moodData.slice(-14, -7);
    if (older.length === 0) return { direction: "stable", change: 0 };
    
    const recentAvg = recent.reduce((s, m) => s + (m.value || 3), 0) / recent.length;
    const olderAvg = older.reduce((s, m) => s + (m.value || 3), 0) / older.length;
    const change = recentAvg - olderAvg;
    
    return {
      direction: change > 0.3 ? "up" : change < -0.3 ? "down" : "stable",
      change: Math.abs(change).toFixed(1)
    };
  }, [moodData]);

  const weeklyActivity = useMemo(() => {
    const days = Array(7).fill(0).map((_, i) => {
      const date = new Date(Date.now() - (6 - i) * 86400000);
      return { day: date.toLocaleDateString("en", { weekday: "short" }), count: 0, date: getDayKey(date) };
    });
    
    activityDates.forEach(d => {
      const dayKey = getDayKey(new Date(d));
      const dayData = days.find(day => day.date === dayKey);
      if (dayData) dayData.count++;
    });
    
    return days;
  }, [activityDates]);

  const maxWeeklyCount = Math.max(...weeklyActivity.map(d => d.count), 1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <header className="mb-8">
          <Link href="/dashboard">
            <a className="inline-flex items-center gap-2 text-sm opacity-60 hover:opacity-100 mb-4" data-testid="link-back">
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </a>
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="h-10 w-10 text-violet-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent" data-testid="text-progress-title">
              Your Progress
            </h1>
          </div>
          <p className="text-lg opacity-70">
            Track your journey. Celebrate growth. Recognize patterns.
          </p>
        </header>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/20">
            <Flame className="h-8 w-8 text-orange-400 mb-3" />
            <div className="text-3xl font-bold" data-testid="text-current-streak">{streak.current}</div>
            <p className="text-sm opacity-60">Day Streak</p>
            <p className="text-xs opacity-40 mt-1">Longest: {streak.longest} days</p>
          </div>
          
          <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/20">
            <Target className="h-8 w-8 text-emerald-400 mb-3" />
            <div className="text-3xl font-bold" data-testid="text-total-activities">{totalActivities}</div>
            <p className="text-sm opacity-60">Total Activities</p>
            <p className="text-xs opacity-40 mt-1">Across all tools</p>
          </div>
          
          <div className="p-5 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/20">
            <TrendingUp className="h-8 w-8 text-blue-400 mb-3" />
            <div className="text-3xl font-bold flex items-center gap-2" data-testid="text-mood-trend">
              {moodTrend.direction === "up" ? "↑" : moodTrend.direction === "down" ? "↓" : "→"}
              <span className="text-lg">{moodTrend.change}</span>
            </div>
            <p className="text-sm opacity-60">Mood Trend</p>
            <p className="text-xs opacity-40 mt-1">vs. last week</p>
          </div>
          
          <div className="p-5 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20">
            <Calendar className="h-8 w-8 text-purple-400 mb-3" />
            <div className="text-3xl font-bold" data-testid="text-active-days">
              {new Set(activityDates.map(d => getDayKey(new Date(d)))).size}
            </div>
            <p className="text-sm opacity-60">Active Days</p>
            <p className="text-xs opacity-40 mt-1">Total unique days</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-cyan-400" />
              Weekly Activity
            </h3>
            <div className="flex items-end justify-between gap-2 h-32">
              {weeklyActivity.map((day, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-t-sm transition-all"
                    style={{ height: `${(day.count / maxWeeklyCount) * 100}%`, minHeight: day.count > 0 ? "8px" : "2px" }}
                    data-testid={`bar-${day.day.toLowerCase()}`}
                  />
                  <span className="text-xs opacity-50">{day.day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Heart className="h-5 w-5 text-rose-400" />
              Top Themes
            </h3>
            {topThemes.length === 0 ? (
              <p className="text-sm opacity-50">No themes tracked yet. Use tools with theme tagging.</p>
            ) : (
              <div className="space-y-3">
                {topThemes.map((theme, i) => (
                  <div key={theme.theme} className="flex items-center gap-3">
                    <span className="w-5 text-sm opacity-40">{i + 1}.</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">{theme.theme}</span>
                        <span className="text-xs opacity-50">{theme.count}</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-rose-400 to-pink-400 rounded-full"
                          style={{ width: `${(theme.count / topThemes[0].count) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-6 rounded-xl bg-white/5 border border-white/10 mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-400" />
            Mood History (Last 14 Days)
          </h3>
          {moodData.length === 0 ? (
            <p className="text-sm opacity-50">No mood data yet. Start tracking your emotional states.</p>
          ) : (
            <div className="flex items-end justify-between gap-1 h-24">
              {Array(14).fill(0).map((_, i) => {
                const date = getDayKey(new Date(Date.now() - (13 - i) * 86400000));
                const entry = moodData.find(m => getDayKey(new Date(m.date)) === date);
                const value = entry?.value || 0;
                const colors = ["bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-lime-400", "bg-emerald-400"];
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div 
                      className={`w-full rounded-t-sm transition-all ${value > 0 ? colors[value - 1] : "bg-white/10"}`}
                      style={{ height: `${value > 0 ? (value / 5) * 100 : 10}%` }}
                      title={`${date}: ${value || "No data"}`}
                    />
                  </div>
                );
              })}
            </div>
          )}
          <div className="flex justify-between mt-2 text-xs opacity-40">
            <span>14 days ago</span>
            <span>Today</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Link href="/guided-journaling">
            <a className="p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group" data-testid="link-guided-journaling">
              <Brain className="h-8 w-8 text-emerald-400 mb-3" />
              <h4 className="font-semibold mb-1">Guided Journaling</h4>
              <p className="text-sm opacity-60">Structured paths for healing</p>
              <ChevronRight className="h-4 w-4 mt-2 opacity-40 group-hover:opacity-100 transition-opacity" />
            </a>
          </Link>
          <Link href="/insight-cards">
            <a className="p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group" data-testid="link-insight-cards">
              <Sparkles className="h-8 w-8 text-amber-400 mb-3" />
              <h4 className="font-semibold mb-1">Insight Cards</h4>
              <p className="text-sm opacity-60">Your wisdom library</p>
              <ChevronRight className="h-4 w-4 mt-2 opacity-40 group-hover:opacity-100 transition-opacity" />
            </a>
          </Link>
          <Link href="/daily-ritual">
            <a className="p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group" data-testid="link-daily-ritual">
              <Award className="h-8 w-8 text-violet-400 mb-3" />
              <h4 className="font-semibold mb-1">Daily Ritual</h4>
              <p className="text-sm opacity-60">Mirror + tiny action</p>
              <ChevronRight className="h-4 w-4 mt-2 opacity-40 group-hover:opacity-100 transition-opacity" />
            </a>
          </Link>
        </div>

        <div className="mt-8 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <p className="text-sm text-emerald-200/80">
            <strong>Your journey matters.</strong> Every reflection, every insight, every moment of self-awareness 
            contributes to your growth. Progress isn't always linear—and that's perfectly okay.
          </p>
        </div>
      </div>
    </div>
  );
}
