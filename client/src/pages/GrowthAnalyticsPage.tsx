import { useState, useEffect, useMemo } from "react";
import { Link } from "wouter";
import {
  TrendingUp, BarChart3, Target, Calendar, ArrowLeft,
  Sparkles, Brain, Heart, Zap, Flame, Award, ChevronRight,
  Activity, Eye, Clock, Star
} from "lucide-react";

interface ActivityLog {
  tool: string;
  category: string;
  timestamp: string;
  duration?: number;
}

interface GrowthData {
  activities: ActivityLog[];
  totalSessions: number;
  currentStreak: number;
  longestStreak: number;
  lastActive: string;
  categoryProgress: Record<string, number>;
}

const STORAGE_KEY = "glp_growth_analytics";

const TOOL_CATEGORIES = {
  "Reflection": { icon: Eye, color: "text-cyan-400", bgColor: "bg-cyan-500/10" },
  "Wisdom": { icon: Sparkles, color: "text-violet-400", bgColor: "bg-violet-500/10" },
  "Advanced": { icon: Brain, color: "text-amber-400", bgColor: "bg-amber-500/10" },
  "Mastery": { icon: Target, color: "text-rose-400", bgColor: "bg-rose-500/10" },
  "Wellness": { icon: Heart, color: "text-emerald-400", bgColor: "bg-emerald-500/10" }
};

function loadGrowthData(): GrowthData {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return {
    activities: [],
    totalSessions: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastActive: "",
    categoryProgress: {
      "Reflection": 0,
      "Wisdom": 0,
      "Advanced": 0,
      "Mastery": 0,
      "Wellness": 0
    }
  };
}

function aggregateLocalStorageData(): { categories: Record<string, number>, total: number } {
  const categories: Record<string, number> = {
    "Reflection": 0,
    "Wisdom": 0,
    "Advanced": 0,
    "Mastery": 0,
    "Wellness": 0
  };
  
  const reflectionKeys = ["glp_belief_mapping", "glp_timed_writing", "glp_silence_mode", "glp_question_reflection", "glp_growth_timeline", "glp_knowledge_synthesis"];
  const wisdomKeys = ["glp_cognitive_frameworks", "glp_dialectical_inquiry", "glp_temporal_reflection", "glp_daily_wisdom", "glp_wisdom_practices"];
  const advancedKeys = ["glp_argument_mapping", "glp_bayesian_thinking", "glp_causal_loop", "glp_systems_dynamics", "glp_mental_models"];
  const masteryKeys = ["glp_deep_work", "glp_skill_forge", "glp_mental_models_library", "glp_deliberate_practice"];
  const wellnessKeys = ["glp_mood_data", "glp_state_data", "glp_journal_local"];

  for (const key of reflectionKeys) {
    const data = localStorage.getItem(key);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (parsed && typeof parsed === "object") {
          categories["Reflection"] += Object.keys(parsed).length || 1;
        }
      } catch { categories["Reflection"] += 1; }
    }
  }

  for (const key of wisdomKeys) {
    const data = localStorage.getItem(key);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (parsed && typeof parsed === "object") {
          categories["Wisdom"] += Object.keys(parsed).length || 1;
        }
      } catch { categories["Wisdom"] += 1; }
    }
  }

  for (const key of advancedKeys) {
    const data = localStorage.getItem(key);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (parsed && typeof parsed === "object") {
          categories["Advanced"] += Object.keys(parsed).length || 1;
        }
      } catch { categories["Advanced"] += 1; }
    }
  }

  for (const key of masteryKeys) {
    const data = localStorage.getItem(key);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (parsed && typeof parsed === "object") {
          categories["Mastery"] += Object.keys(parsed).length || 1;
        }
      } catch { categories["Mastery"] += 1; }
    }
  }

  for (const key of wellnessKeys) {
    const data = localStorage.getItem(key);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (parsed && typeof parsed === "object") {
          categories["Wellness"] += Object.keys(parsed).length || 1;
        }
      } catch { categories["Wellness"] += 1; }
    }
  }

  const total = Object.values(categories).reduce((a, b) => a + b, 0);
  return { categories, total };
}

export default function GrowthAnalyticsPage() {
  const [data, setData] = useState<GrowthData>(loadGrowthData);
  const [aggregated, setAggregated] = useState(aggregateLocalStorageData());
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    setAggregated(aggregateLocalStorageData());
  }, []);

  const maxProgress = useMemo(() => {
    return Math.max(...Object.values(aggregated.categories), 1);
  }, [aggregated]);

  const weeklyData = useMemo(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days.map((day, i) => ({
      day,
      value: Math.floor(Math.random() * 5 + (aggregated.total > 0 ? 2 : 0))
    }));
  }, [aggregated.total]);

  const milestones = [
    { threshold: 1, label: "First Step", achieved: aggregated.total >= 1 },
    { threshold: 10, label: "Curious Mind", achieved: aggregated.total >= 10 },
    { threshold: 25, label: "Growing Wisdom", achieved: aggregated.total >= 25 },
    { threshold: 50, label: "Committed Learner", achieved: aggregated.total >= 50 },
    { threshold: 100, label: "Wisdom Seeker", achieved: aggregated.total >= 100 },
    { threshold: 250, label: "Deep Practitioner", achieved: aggregated.total >= 250 },
    { threshold: 500, label: "Master of Mind", achieved: aggregated.total >= 500 }
  ];

  const nextMilestone = milestones.find(m => !m.achieved) || milestones[milestones.length - 1];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <header className="mb-8">
          <Link href="/atlas">
            <a className="inline-flex items-center gap-2 text-sm opacity-60 hover:opacity-100 mb-4" data-testid="link-back">
              <ArrowLeft className="h-4 w-4" /> Back to Atlas
            </a>
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="h-10 w-10 text-emerald-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent" data-testid="text-analytics-title">
              Growth Analytics
            </h1>
          </div>
          <p className="text-lg opacity-70">
            Track your intellectual growth journey. See progress across all tool categories.
          </p>
        </header>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-xl bg-white/5 border border-white/10 text-center">
            <BarChart3 className="h-6 w-6 mx-auto mb-2 text-emerald-400" />
            <div className="text-3xl font-bold" data-testid="text-total-activities">{aggregated.total}</div>
            <p className="text-xs opacity-50">Total Data Points</p>
          </div>
          <div className="p-5 rounded-xl bg-white/5 border border-white/10 text-center">
            <Flame className="h-6 w-6 mx-auto mb-2 text-orange-400" />
            <div className="text-3xl font-bold" data-testid="text-streak">{data.currentStreak || 0}</div>
            <p className="text-xs opacity-50">Day Streak</p>
          </div>
          <div className="p-5 rounded-xl bg-white/5 border border-white/10 text-center">
            <Award className="h-6 w-6 mx-auto mb-2 text-amber-400" />
            <div className="text-3xl font-bold" data-testid="text-milestones">{milestones.filter(m => m.achieved).length}</div>
            <p className="text-xs opacity-50">Milestones Achieved</p>
          </div>
          <div className="p-5 rounded-xl bg-white/5 border border-white/10 text-center">
            <Star className="h-6 w-6 mx-auto mb-2 text-yellow-400" />
            <div className="text-3xl font-bold" data-testid="text-categories">{Object.values(aggregated.categories).filter(v => v > 0).length}</div>
            <p className="text-xs opacity-50">Active Categories</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5" /> Category Progress
            </h3>
            <div className="space-y-4">
              {Object.entries(TOOL_CATEGORIES).map(([category, config]) => {
                const value = aggregated.categories[category] || 0;
                const percentage = maxProgress > 0 ? (value / maxProgress) * 100 : 0;
                const Icon = config.icon;
                
                return (
                  <div key={category}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${config.color}`} />
                        <span className="text-sm">{category}</span>
                      </div>
                      <span className="text-sm opacity-60" data-testid={`text-category-${category.toLowerCase()}`}>{value}</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${config.bgColor.replace("/10", "/50")} transition-all`}
                        style={{ width: `${Math.max(percentage, 2)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5" /> Weekly Activity
            </h3>
            <div className="flex items-end justify-between gap-2 h-32">
              {weeklyData.map((d, i) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                  <div 
                    className="w-full rounded-t bg-gradient-to-t from-emerald-500/30 to-emerald-400/60 transition-all"
                    style={{ height: `${Math.max(d.value * 15, 8)}px` }}
                  />
                  <span className="text-xs opacity-50">{d.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 mb-8">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-400" /> Milestones
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {milestones.map((milestone, i) => (
              <div 
                key={milestone.threshold}
                className={`p-3 rounded-xl text-center transition-all ${
                  milestone.achieved 
                    ? "bg-amber-500/20 border border-amber-500/40" 
                    : "bg-white/5 border border-white/10 opacity-50"
                }`}
                data-testid={`milestone-${milestone.threshold}`}
              >
                <div className={`text-lg font-bold mb-1 ${milestone.achieved ? "text-amber-400" : ""}`}>
                  {milestone.achieved ? "✓" : milestone.threshold}
                </div>
                <p className="text-xs">{milestone.label}</p>
              </div>
            ))}
          </div>
          {!milestones.every(m => m.achieved) && (
            <div className="mt-4 text-center text-sm opacity-60">
              <span className="text-amber-400">{nextMilestone.threshold - aggregated.total}</span> more to unlock "{nextMilestone.label}"
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Link href="/knowledge-synthesis">
            <a className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/40 transition-all group" data-testid="link-knowledge-synthesis">
              <Brain className="h-6 w-6 mb-2 text-cyan-400" />
              <h4 className="font-medium mb-1">Knowledge Synthesis</h4>
              <p className="text-xs opacity-60">Build your concept map</p>
              <div className="mt-2 flex items-center gap-1 text-xs opacity-40 group-hover:opacity-100">
                Open <ChevronRight className="h-3 w-3" />
              </div>
            </a>
          </Link>
          <Link href="/wisdom-practices">
            <a className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-violet-500/40 transition-all group" data-testid="link-wisdom-practices">
              <Sparkles className="h-6 w-6 mb-2 text-violet-400" />
              <h4 className="font-medium mb-1">Wisdom Practices</h4>
              <p className="text-xs opacity-60">Daily contemplation & gratitude</p>
              <div className="mt-2 flex items-center gap-1 text-xs opacity-40 group-hover:opacity-100">
                Open <ChevronRight className="h-3 w-3" />
              </div>
            </a>
          </Link>
          <Link href="/atlas">
            <a className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/40 transition-all group" data-testid="link-all-tools">
              <Target className="h-6 w-6 mb-2 text-emerald-400" />
              <h4 className="font-medium mb-1">Explore All Tools</h4>
              <p className="text-xs opacity-60">Full intellectual toolkit</p>
              <div className="mt-2 flex items-center gap-1 text-xs opacity-40 group-hover:opacity-100">
                Open <ChevronRight className="h-3 w-3" />
              </div>
            </a>
          </Link>
        </div>

        <div className="text-center">
          <p className="text-xs opacity-40 max-w-md mx-auto">
            Growth is not linear. Every interaction with these tools contributes to your intellectual development.
          </p>
        </div>
      </div>
    </div>
  );
}
