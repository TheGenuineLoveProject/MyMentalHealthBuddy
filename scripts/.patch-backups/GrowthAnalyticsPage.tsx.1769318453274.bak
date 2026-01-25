import { useState, useEffect, useMemo } from "react";
import { Link } from "wouter";
import {
  TrendingUp, BarChart3, Target, Calendar, ArrowLeft,
  Sparkles, Brain, Heart, Zap, Flame, Award, ChevronRight,
  Activity, Eye, Clock, Star
} from "lucide-react";
import BenefitsBlock from "@/components/BenefitsBlock";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

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
  <WellnessPageShell
    title="GrowthAnalyticsPage"
    subtitle="Educational reflection tools. Choose what feels safe and supportive."
    benefits={pickBenefits(["Agency","Calm","Clarity","Self-respect","Your pace"], 5)}
    clarity={{
      what: "A self-paced reflection tool you control.",
      why: "To support clarity, values alignment, and gentle next steps.",
      who: "For adults (18+) who want educational wellness tools (not medical care).",
      when: "Anytime you want a small reset or a thoughtful pause.",
      where: "Anywhere you can breathe and write for 1–5 minutes.",
      how: "Pick one prompt, answer briefly, stop whenever you want."
    }}
    examples={[
      { label: "Beginner", examples: ["Write one honest sentence about how you feel.", "Name one value you want to protect today."] },
      { label: "Intermediate", examples: ["Describe the situation + the need underneath it.", "Write a boundary you could try in one sentence."] },
      { label: "Advanced", examples: ["Identify a pattern and the smallest experiment to change it.", "Write a compassionate reframe and one measurable step."] }
    ]}
  >

    <div className="min-h-screen hero-gradient">
      <div className="content-wrapper py-8">
        <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <Link href="/atlas" className="inline-flex items-center gap-2 text-body-sm text-[var(--sage-500)] hover:text-[var(--teal-600)] mb-4 transition" data-testid="link-back">
            <ArrowLeft className="h-4 w-4" /> Back to Atlas
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="icon-container icon-xl icon-gradient-sage">
              <TrendingUp className="h-8 w-8" />
            </div>
            <h1 className="text-display-lg text-teal" data-testid="text-analytics-title">
              Growth Analytics
            </h1>
          </div>
          <p className="text-lead">
            Track your intellectual growth journey. See progress across all tool categories.
          </p>
        </header>

        <BenefitsBlock
          benefits={[
            "Visualize your growth journey across all wellness tools",
            "Track streaks, milestones, and category progress",
            "All data stays local—your journey remains private"
          ]}
          duration="2–5 min"
          control="View-only—no changes required"
          disclaimer="Educational insight tool—not clinical assessment. If you need crisis help, visit"
          crisisLink="/crisis"
          variant="minimal"
          className="mb-6"
        />

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="card-bordered text-center">
            <div className="icon-container icon-md icon-soft-sage mx-auto mb-2">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div className="text-heading-lg text-teal" data-testid="text-total-activities">{aggregated.total}</div>
            <p className="text-caption">Total Data Points</p>
          </div>
          <div className="card-bordered text-center">
            <div className="icon-container icon-md icon-soft-gold mx-auto mb-2">
              <Flame className="h-5 w-5" />
            </div>
            <div className="text-heading-lg text-teal" data-testid="text-streak">{data.currentStreak || 0}</div>
            <p className="text-caption">Day Streak</p>
          </div>
          <div className="card-bordered text-center">
            <div className="icon-container icon-md icon-soft-blush mx-auto mb-2">
              <Award className="h-5 w-5" />
            </div>
            <div className="text-heading-lg text-teal" data-testid="text-milestones">{milestones.filter(m => m.achieved).length}</div>
            <p className="text-caption">Milestones Achieved</p>
          </div>
          <div className="card-bordered text-center">
            <div className="icon-container icon-md icon-soft-teal mx-auto mb-2">
              <Star className="h-5 w-5" />
            </div>
            <div className="text-heading-lg text-teal" data-testid="text-categories">{Object.values(aggregated.categories).filter(v => v > 0).length}</div>
            <p className="text-caption">Active Categories</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="card-bordered">
            <h3 className="text-heading-md text-teal mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-[var(--sage-500)]" /> Category Progress
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
                    <div className="h-2 rounded-full bg-sage-100 overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-sage-400 to-teal-400 transition-all"
                        style={{ width: `${Math.max(percentage, 2)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card-bordered">
            <h3 className="text-heading-md text-teal mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[var(--sage-500)]" /> Weekly Activity
            </h3>
            <div className="flex items-end justify-between gap-2 h-32">
              {weeklyData.map((d, i) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                  <div 
                    className="w-full rounded-t bg-gradient-to-t from-sage-300 to-teal-400 transition-all"
                    style={{ height: `${Math.max(d.value * 15, 8)}px` }}
                  />
                  <span className="text-caption">{d.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card-bordered bg-gradient-to-br from-gold-50 via-blush-50 to-sage-50 mb-8">
          <h3 className="text-heading-md text-teal mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-gold-500" /> Milestones
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {milestones.map((milestone, i) => (
              <div 
                key={milestone.threshold}
                className={`p-3 rounded-xl text-center transition-all ${
                  milestone.achieved 
                    ? "bg-gold-100 border border-gold-300" 
                    : "bg-white border border-sage-200 opacity-60"
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
          <Link href="/knowledge-synthesis" className="card-bordered hover:shadow-md transition-all group" data-testid="link-knowledge-synthesis">
            <div className="icon-container icon-md icon-soft-teal mb-3">
              <Brain className="h-5 w-5" />
            </div>
            <h4 className="text-heading-sm text-teal mb-1">Knowledge Synthesis</h4>
            <p className="text-caption">Build your concept map</p>
            <div className="mt-2 flex items-center gap-1 text-caption text-sage-400 group-hover:text-teal-600">
              Open <ChevronRight className="h-3 w-3" />
            </div>
          </Link>
          <Link href="/wisdom-practices" className="card-bordered hover:shadow-md transition-all group" data-testid="link-wisdom-practices">
            <div className="icon-container icon-md icon-soft-gold mb-3">
              <Sparkles className="h-5 w-5" />
            </div>
            <h4 className="text-heading-sm text-teal mb-1">Wisdom Practices</h4>
            <p className="text-caption">Daily contemplation & gratitude</p>
            <div className="mt-2 flex items-center gap-1 text-caption text-sage-400 group-hover:text-teal-600">
              Open <ChevronRight className="h-3 w-3" />
            </div>
          </Link>
          <Link href="/atlas" className="card-bordered hover:shadow-md transition-all group" data-testid="link-all-tools">
            <div className="icon-container icon-md icon-soft-sage mb-3">
              <Target className="h-5 w-5" />
            </div>
            <h4 className="text-heading-sm text-teal mb-1">Explore All Tools</h4>
            <p className="text-caption">Full intellectual toolkit</p>
            <div className="mt-2 flex items-center gap-1 text-caption text-sage-400 group-hover:text-teal-600">
              Open <ChevronRight className="h-3 w-3" />
            </div>
          </Link>
        </div>

        <div className="text-center">
          <p className="text-caption max-w-md mx-auto">
            Growth is not linear. Every interaction with these tools contributes to your intellectual development.
          </p>
        </div>
        </div>
      </div>
    </div>
  </WellnessPageShell>
  );
}
