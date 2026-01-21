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
    <div className="min-h-screen hero-gradient">
      <div className="content-wrapper py-8">
        <header className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-body-sm text-sage-600 hover:text-teal-700 mb-4 transition-colors" data-testid="link-back">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-4 mb-3">
            <div className="icon-container icon-xl icon-gradient-teal">
              <BarChart3 className="h-7 w-7" />
            </div>
            <h1 className="text-display-lg text-teal" data-testid="text-progress-title">
              Your Progress
            </h1>
          </div>
          <p className="text-lead max-w-2xl">
            Track your journey. Celebrate growth. Recognize patterns.
          </p>
        </header>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="card-bordered bg-gradient-to-br from-gold-50 to-blush-50">
            <div className="icon-container icon-lg icon-gradient-gold mb-3">
              <Flame className="h-5 w-5" />
            </div>
            <div className="text-heading-xl text-gold-600" data-testid="text-current-streak">{streak.current}</div>
            <p className="text-body-sm">Day Streak</p>
            <p className="text-caption mt-1">Longest: {streak.longest} days</p>
          </div>
          
          <div className="card-bordered bg-gradient-to-br from-sage-50 to-teal-50">
            <div className="icon-container icon-lg icon-gradient-sage mb-3">
              <Target className="h-5 w-5" />
            </div>
            <div className="text-heading-xl text-sage-600" data-testid="text-total-activities">{totalActivities}</div>
            <p className="text-body-sm">Total Activities</p>
            <p className="text-caption mt-1">Across all tools</p>
          </div>
          
          <div className="card-bordered bg-gradient-to-br from-teal-50 to-sage-50">
            <div className="icon-container icon-lg icon-gradient-teal mb-3">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div className="text-heading-xl text-teal flex items-center gap-2" data-testid="text-mood-trend">
              {moodTrend.direction === "up" ? "↑" : moodTrend.direction === "down" ? "↓" : "→"}
              <span className="text-lg">{moodTrend.change}</span>
            </div>
            <p className="text-body-sm">Mood Trend</p>
            <p className="text-caption mt-1">vs. last week</p>
          </div>
          
          <div className="card-bordered bg-gradient-to-br from-blush-50 to-gold-50">
            <div className="icon-container icon-lg icon-gradient-blush mb-3">
              <Calendar className="h-5 w-5" />
            </div>
            <div className="text-heading-xl text-blush-600" data-testid="text-active-days">
              {new Set(activityDates.map(d => getDayKey(new Date(d)))).size}
            </div>
            <p className="text-body-sm">Active Days</p>
            <p className="text-caption mt-1">Total unique days</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="card-bordered">
            <h3 className="text-heading-sm text-teal mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-teal-500" />
              Weekly Activity
            </h3>
            <div className="flex items-end justify-between gap-2 h-32">
              {weeklyActivity.map((day, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full bg-gradient-to-t from-sage-500 to-teal-400 rounded-t-sm transition-all"
                    style={{ height: `${(day.count / maxWeeklyCount) * 100}%`, minHeight: day.count > 0 ? "8px" : "2px" }}
                    data-testid={`bar-${day.day.toLowerCase()}`}
                  />
                  <span className="text-caption">{day.day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card-bordered">
            <h3 className="text-heading-sm text-teal mb-4 flex items-center gap-2">
              <Heart className="h-5 w-5 text-blush-500" />
              Top Themes
            </h3>
            {topThemes.length === 0 ? (
              <p className="text-body-sm">No themes tracked yet. Use tools with theme tagging.</p>
            ) : (
              <div className="space-y-3">
                {topThemes.map((theme, i) => (
                  <div key={theme.theme} className="flex items-center gap-3">
                    <span className="w-5 text-caption font-medium">{i + 1}.</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-body-sm">{theme.theme}</span>
                        <span className="text-caption">{theme.count}</span>
                      </div>
                      <div className="h-1.5 bg-sage-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blush-400 to-blush-500 rounded-full"
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

        <div className="card-bordered mb-8">
          <h3 className="text-heading-sm text-teal mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-sage-500" />
            Mood History (Last 14 Days)
          </h3>
          {moodData.length === 0 ? (
            <p className="text-body-sm">No mood data yet. Start tracking your emotional states.</p>
          ) : (
            <div className="flex items-end justify-between gap-1 h-24">
              {Array(14).fill(0).map((_, i) => {
                const date = getDayKey(new Date(Date.now() - (13 - i) * 86400000));
                const entry = moodData.find(m => getDayKey(new Date(m.date)) === date);
                const value = entry?.value || 0;
                const colors = ["bg-blush-300", "bg-gold-400", "bg-sage-300", "bg-sage-400", "bg-teal-400"];
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div 
                      className={`w-full rounded-t-sm transition-all ${value > 0 ? colors[value - 1] : "bg-sage-100"}`}
                      style={{ height: `${value > 0 ? (value / 5) * 100 : 10}%` }}
                      title={`${date}: ${value || "No data"}`}
                    />
                  </div>
                );
              })}
            </div>
          )}
          <div className="flex justify-between mt-2 text-caption">
            <span>14 days ago</span>
            <span>Today</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Link href="/guided-journaling" className="card-bordered hover:shadow-md transition-all group" data-testid="link-guided-journaling">
            <div className="icon-container icon-lg icon-soft-sage mb-3">
              <Brain className="h-5 w-5" />
            </div>
            <h4 className="text-heading-sm text-teal mb-1">Guided Journaling</h4>
            <p className="text-caption">Structured paths for healing</p>
            <ChevronRight className="h-4 w-4 mt-2 text-sage-400 group-hover:text-teal-600 transition-colors" />
          </Link>
          <Link href="/insight-cards" className="card-bordered hover:shadow-md transition-all group" data-testid="link-insight-cards">
            <div className="icon-container icon-lg icon-soft-gold mb-3">
              <Sparkles className="h-5 w-5" />
            </div>
            <h4 className="text-heading-sm text-teal mb-1">Insight Cards</h4>
            <p className="text-caption">Your wisdom library</p>
            <ChevronRight className="h-4 w-4 mt-2 text-sage-400 group-hover:text-teal-600 transition-colors" />
          </Link>
          <Link href="/ritual" className="card-bordered hover:shadow-md transition-all group" data-testid="link-daily-ritual">
            <div className="icon-container icon-lg icon-soft-blush mb-3">
              <Award className="h-5 w-5" />
            </div>
            <h4 className="text-heading-sm text-teal mb-1">Daily Ritual</h4>
            <p className="text-caption">Mirror + tiny action</p>
            <ChevronRight className="h-4 w-4 mt-2 text-sage-400 group-hover:text-teal-600 transition-colors" />
          </Link>
        </div>

        <div className="mt-8 p-4 rounded-xl bg-sage-50 border border-sage-200">
          <p className="text-body-sm text-sage-700">
            <strong className="text-teal-600">Your journey matters.</strong> Every reflection, every insight, every moment of self-awareness 
            contributes to your growth. Progress isn't always linear—and that's perfectly okay.
          </p>
        </div>
      </div>
    </div>
  );
}
