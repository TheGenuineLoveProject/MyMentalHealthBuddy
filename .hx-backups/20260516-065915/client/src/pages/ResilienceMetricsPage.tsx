import { useState, useEffect } from "react";
import { Link } from "wouter";
import { TrendingUp, BarChart3, Calendar, Target, Award, Flame, Brain, Heart, Lightbulb, Shield, Clock, ArrowRight, Sparkles, Activity, Zap } from 'lucide-react';
import BenefitsBlock from "@/components/BenefitsBlock";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import { SEO } from "@/components/SEO";

interface GrowthMetric {
  category: string;
  dimension: string;
  score: number;
  trend: "up" | "stable" | "down";
  lastUpdated: string;
}

interface MilestoneEvent {
  id: string;
  type: "streak" | "completion" | "insight" | "breakthrough";
  title: string;
  description: string;
  date: string;
  category: string;
}

interface ResilienceProfile {
  metrics: GrowthMetric[];
  milestones: MilestoneEvent[];
  weeklyReflections: number;
  totalToolsUsed: number;
  longestStreak: number;
  currentStreak: number;
  lastActive: string;
}

const STORAGE_KEY = "glp_resilience_profile";

const GROWTH_DIMENSIONS = [
  { id: "self-awareness", name: "Self-Awareness", icon: Brain, category: "inner", description: "Understanding your thoughts, emotions, and patterns" },
  { id: "emotional-regulation", name: "Emotional Regulation", icon: Heart, category: "inner", description: "Managing emotions with skill and compassion" },
  { id: "critical-thinking", name: "Critical Thinking", icon: Lightbulb, category: "cognitive", description: "Analyzing information and making sound judgments" },
  { id: "wisdom-integration", name: "Wisdom Integration", icon: Sparkles, category: "cognitive", description: "Synthesizing knowledge into practical wisdom" },
  { id: "resilience", name: "Resilience", icon: Shield, category: "strength", description: "Bouncing back from challenges with grace" },
  { id: "focus-mastery", name: "Focus & Mastery", icon: Target, category: "strength", description: "Sustained attention and deliberate practice" }
];

const SAMPLE_MILESTONES: MilestoneEvent[] = [
  {
    id: "m1",
    type: "streak",
    title: "7-Day Reflection Streak",
    description: "You've reflected consistently for a week",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    category: "consistency"
  },
  {
    id: "m2",
    type: "completion",
    title: "Logic Lattice Explorer",
    description: "Completed your first argument map",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    category: "advanced"
  },
  {
    id: "m3",
    type: "insight",
    title: "Deep Insight Moment",
    description: "Recorded a breakthrough realization in your journal",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
    category: "wisdom"
  }
];

function loadProfile(): ResilienceProfile {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  
  return {
    metrics: GROWTH_DIMENSIONS.map(dim => ({
      category: dim.category,
      dimension: dim.id,
      score: Math.floor(Math.random() * 30) + 40,
      trend: ["up", "stable", "down"][Math.floor(Math.random() * 3)] as any,
      lastUpdated: new Date().toISOString()
    })),
    milestones: SAMPLE_MILESTONES,
    weeklyReflections: 12,
    totalToolsUsed: 15,
    longestStreak: 14,
    currentStreak: 5,
    lastActive: new Date().toISOString()
  };
}

function saveProfile(profile: ResilienceProfile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

function formatTimeAgo(timestamp: string): string {
  const days = Math.floor((Date.now() - new Date(timestamp).getTime()) / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return `${Math.floor(days / 7)} weeks ago`;
}

export default function ResilienceMetricsPage() {
  const [profile, setProfile] = useState<ResilienceProfile>(loadProfile);
  const [activeView, setActiveView] = useState<"overview" | "dimensions" | "milestones">("overview");

  useEffect(() => {
    const updated = { ...profile, lastActive: new Date().toISOString() };
    saveProfile(updated);
  }, []);

  const overallScore = Math.round(
    profile.metrics.reduce((sum, m) => sum + m.score, 0) / profile.metrics.length
  );

  const getMetricIcon = (dimensionId: string) => {
    const dim = GROWTH_DIMENSIONS.find(d => d.id === dimensionId);
    return dim ? dim.icon : Activity;
  };

  const getMetricName = (dimensionId: string) => {
    const dim = GROWTH_DIMENSIONS.find(d => d.id === dimensionId);
    return dim ? dim.name : dimensionId;
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up": return "text-emerald-400";
      case "down": return "text-rose-400";
      default: return "text-amber-400";
    }
  };

  const getMilestoneIcon = (type: string) => {
    switch (type) {
      case "streak": return Flame;
      case "completion": return Award;
      case "insight": return Lightbulb;
      case "breakthrough": return Sparkles;
      default: return Award;
    }
  };

  return (
  <WellnessPageShell
    title="ResilienceMetricsPage"
    subtitle="Educational reflection tools. Choose what feels safe and supportive."
    benefits={pickBenefits(["agency","calm","clarity","selfRespect","meaning"], 5)}
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
      <SEO title="Resilience Metrics — The Genuine Love Project" description="Track and build your resilience over time." />


    <div className="min-h-screen v28-paper-bg">
      <div className="content-wrapper py-8">
        <div className="max-w-5xl mx-auto">
        <header className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="icon-container icon-xl icon-gradient-sage">
              <TrendingUp className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-display-lg text-teal mb-4" data-testid="text-resilience-title">
            Resilience Metrics
          </h1>
          <p className="text-lead max-w-2xl mx-auto" data-testid="text-resilience-subtitle">
            Track your growth across all dimensions. These metrics reflect your journey,
            not a destination.
          </p>
        </header>

        <BenefitsBlock
          benefit="Track your growth journey across emotional, cognitive, and relational dimensions"
          duration="2–5 minutes to review"
          control="Your metrics, your pace — no comparison, no pressure"
          disclaimer="Educational wellness support — not therapy. If you're in crisis, visit /crisis."
          variant="minimal"
          className="mb-6"
        />

        <div className="flex justify-center gap-2 mb-8">
          {[
            { id: "overview", label: "Overview", icon: BarChart3 },
            { id: "dimensions", label: "Dimensions", icon: Activity },
            { id: "milestones", label: "Milestones", icon: Award }
          ].map(view => (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeView === view.id ? "bg-[var(--sage-100)] text-[var(--teal-700)]" : "hover:bg-[var(--sage-50)] text-[var(--sage-600)]"
              }`}
              data-testid={`tab-${view.id}`}
            >
              <view.icon className="h-4 w-4" />
              {view.label}
            </button>
          ))}
        </div>

        {activeView === "overview" && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="card-bordered bg-[var(--sage-50)]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="icon-container icon-sm icon-soft-sage">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <span className="text-body-sm">Overall Score</span>
                </div>
                <div className="text-display-sm text-teal" data-testid="text-overall-score">{overallScore}</div>
                <p className="text-caption mt-1">Out of 100</p>
              </div>

              <div className="card-bordered">
                <div className="flex items-center gap-2 mb-2">
                  <div className="icon-container icon-sm icon-soft-gold">
                    <Flame className="h-4 w-4" />
                  </div>
                  <span className="text-body-sm">Current Streak</span>
                </div>
                <div className="text-display-sm text-teal" data-testid="text-current-streak">{profile.currentStreak}</div>
                <p className="text-caption mt-1">Days active</p>
              </div>

              <div className="card-bordered">
                <div className="flex items-center gap-2 mb-2">
                  <div className="icon-container icon-sm icon-soft-blush">
                    <Target className="h-4 w-4" />
                  </div>
                  <span className="text-body-sm">Tools Used</span>
                </div>
                <div className="text-display-sm text-teal" data-testid="text-tools-used">{profile.totalToolsUsed}</div>
                <p className="text-caption mt-1">Of 37 available</p>
              </div>

              <div className="card-bordered">
                <div className="flex items-center gap-2 mb-2">
                  <div className="icon-container icon-sm icon-soft-teal">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <span className="text-body-sm">Weekly Reflections</span>
                </div>
                <div className="text-display-sm text-teal" data-testid="text-weekly-reflections">{profile.weeklyReflections}</div>
                <p className="text-caption mt-1">This month</p>
              </div>
            </div>

            <div className="card-bordered">
              <h2 className="text-heading-md text-teal mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5 text-sage-500" />
                Growth Summary
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {profile.metrics.map(metric => {
                  const MetricIcon = getMetricIcon(metric.dimension);
                  return (
                    <div key={metric.dimension} className="p-4 rounded-xl bg-sage-50 border border-sage-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <MetricIcon className="h-4 w-4 text-sage-500" />
                          <span className="text-sm font-medium">{getMetricName(metric.dimension)}</span>
                        </div>
                        <span className={`text-xs ${getTrendColor(metric.trend)}`}>
                          {metric.trend === "up" ? "↑" : metric.trend === "down" ? "↓" : "→"}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-sage-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-sage-400 to-teal-500"
                          style={{ width: `${metric.score}%` }}
                        />
                      </div>
                      <span className="text-caption mt-1">{metric.score}/100</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeView === "dimensions" && (
          <div className="space-y-4">
            {GROWTH_DIMENSIONS.map(dim => {
              const metric = profile.metrics.find(m => m.dimension === dim.id);
              const DimIcon = dim.icon;
              
              return (
                <div key={dim.id} className="card-bordered">
                  <div className="flex items-start gap-4">
                    <div className="icon-container icon-lg icon-soft-sage">
                      <DimIcon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-heading-sm text-teal">{dim.name}</h3>
                        {metric && (
                          <span className={`text-body-sm ${getTrendColor(metric.trend)}`}>
                            {metric.score}/100 {metric.trend === "up" ? "↑" : metric.trend === "down" ? "↓" : "→"}
                          </span>
                        )}
                      </div>
                      <p className="text-body-sm mb-3">{dim.description}</p>
                      {metric && (
                        <div className="w-full h-3 bg-sage-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-sage-400 to-teal-500 transition-all duration-500"
                            style={{ width: `${metric.score}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeView === "milestones" && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-gradient-to-r from-gold-50 to-blush-50 border border-gold-200 flex items-center gap-4">
              <div className="icon-container icon-md icon-soft-gold">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-body-sm font-medium text-teal">Your Journey Milestones</h3>
                <p className="text-caption">Each milestone marks a meaningful moment in your growth</p>
              </div>
            </div>

            {profile.milestones.length === 0 ? (
              <div className="text-center py-12">
                <Award className="h-12 w-12 mx-auto mb-4 text-sage-300" />
                <p className="text-body-sm">No milestones yet. Keep exploring the tools to earn your first!</p>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-sage-200" />
                
                {profile.milestones.map(milestone => {
                  const MilestoneIcon = getMilestoneIcon(milestone.type);
                  
                  return (
                    <div key={milestone.id} className="relative pl-16 pb-6 last:pb-0">
                      <div className="absolute left-4 w-4 h-4 rounded-full bg-gold-100 border-2 border-gold-400" />
                      
                      <div className="card-bordered" data-testid={`card-milestone-${milestone.id}`}>
                        <div className="flex items-center gap-3 mb-2">
                          <MilestoneIcon className="h-5 w-5 text-gold-500" />
                          <span className="text-body-sm font-medium text-teal">{milestone.title}</span>
                        </div>
                        <p className="text-body-sm mb-2">{milestone.description}</p>
                        <div className="flex items-center gap-2 text-caption">
                          <Clock className="h-3 w-3" />
                          {formatTimeAgo(milestone.date)}
                          <span className="mx-1">•</span>
                          <span className="capitalize">{milestone.category}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <div className="mt-12 grid md:grid-cols-2 gap-4">
          <Link 
            href="/atlas"
            className="card-bordered hover:shadow-md transition-all flex items-center justify-between group"
            data-testid="link-atlas"
          >
            <div className="flex items-center gap-3">
              <Target className="h-5 w-5 text-sage-500" />
              <span className="text-body-sm text-teal">Explore More Tools</span>
            </div>
            <ArrowRight className="h-4 w-4 text-sage-400 group-hover:translate-x-1 group-hover:text-teal-600 transition-all" />
          </Link>
          <Link 
            href="/strategy-maps"
            className="card-bordered hover:shadow-md transition-all flex items-center justify-between group"
            data-testid="link-strategy-maps"
          >
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5 text-gold-500" />
              <span className="text-body-sm text-teal">Continue a Learning Path</span>
            </div>
            <ArrowRight className="h-4 w-4 text-sage-400 group-hover:translate-x-1 group-hover:text-teal-600 transition-all" />
          </Link>
        </div>

        <div className="mt-8 text-center">
          <p className="text-caption max-w-md mx-auto">
            These metrics are invitations for reflection, not grades. Your growth is unique,
            non-linear, and always valid.
          </p>
        </div>
        </div>
      </div>
    </div>
  </WellnessPageShell>
  );
}
