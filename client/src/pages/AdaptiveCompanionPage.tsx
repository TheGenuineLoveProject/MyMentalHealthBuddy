import { useState, useEffect } from "react";
import { Link } from "wouter";
import {
  Sparkles, Brain, Heart, Target, Compass, ArrowRight,
  Sun, Moon, Clock, Zap, RefreshCw, ChevronRight,
  BookOpen, Lightbulb, Shield, Users, Flame, Focus, ArrowLeft
} from "lucide-react";
import BenefitsBlock from "@/components/BenefitsBlock";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import { SEO } from "@/components/SEO";

interface UserState {
  energy: "low" | "medium" | "high";
  clarity: "foggy" | "mixed" | "clear";
  mood: "heavy" | "neutral" | "light";
  time: "morning" | "afternoon" | "evening" | "night";
  goal: string | null;
}

interface ToolRecommendation {
  id: string;
  name: string;
  route: string;
  category: string;
  icon: any;
  reason: string;
  duration: string;
  intensity: "gentle" | "moderate" | "rigorous";
}

const STORAGE_KEY = "glp_companion_profile";

const GOALS = [
  { id: "self-awareness", label: "Understand myself better", icon: Brain },
  { id: "emotional-regulation", label: "Process my emotions", icon: Heart },
  { id: "decision-making", label: "Make a decision", icon: Target },
  { id: "learning", label: "Learn something new", icon: Lightbulb },
  { id: "resilience", label: "Build inner strength", icon: Shield },
  { id: "connection", label: "Feel more connected", icon: Users },
  { id: "focus", label: "Improve my focus", icon: Focus },
  { id: "meaning", label: "Find meaning", icon: Sparkles }
];

const TOOL_DATABASE: ToolRecommendation[] = [
  { id: "belief-mapping", name: "Belief Mapping", route: "/tools", category: "reflection", icon: BookOpen, reason: "Gently explore your thought patterns", duration: "10-15 min", intensity: "gentle" },
  { id: "timed-writing", name: "Timed Writing", route: "/tools", category: "reflection", icon: Clock, reason: "Flow state writing to process thoughts", duration: "10 min", intensity: "gentle" },
  { id: "cognitive-frameworks", name: "Cognitive Frameworks", route: "/wisdom", category: "wisdom", icon: Brain, reason: "Structured mental models for clarity", duration: "15-20 min", intensity: "moderate" },
  { id: "dialectical-inquiry", name: "Dialectical Inquiry", route: "/wisdom", category: "wisdom", icon: Lightbulb, reason: "Explore truth through opposing views", duration: "20-30 min", intensity: "rigorous" },
  { id: "logic-lattice", name: "Logic Lattice Lab", route: "/advanced", category: "advanced", icon: Brain, reason: "Map your reasoning clearly", duration: "20-30 min", intensity: "rigorous" },
  { id: "values-clarification", name: "Values Clarification", route: "/advanced", category: "advanced", icon: Heart, reason: "Connect with what matters most", duration: "15-20 min", intensity: "moderate" },
  { id: "mindscape-navigator", name: "Mindscape Navigator", route: "/advanced", category: "advanced", icon: Compass, reason: "Navigate your mental landscape", duration: "15 min", intensity: "moderate" },
  { id: "deep-work", name: "Deep Work Tracker", route: "/mastery", category: "mastery", icon: Focus, reason: "Build focused work capacity", duration: "Varies", intensity: "rigorous" },
  { id: "mental-models", name: "Mental Models Library", route: "/mastery", category: "mastery", icon: Lightbulb, reason: "Powerful thinking frameworks", duration: "15-20 min", intensity: "moderate" },
  { id: "narrative-identity", name: "Narrative Identity Studio", route: "/advanced", category: "advanced", icon: BookOpen, reason: "Explore your life story", duration: "20-30 min", intensity: "moderate" },
  { id: "existential-inquiry", name: "Existential Inquiry", route: "/advanced", category: "advanced", icon: Sparkles, reason: "Deep questions about meaning", duration: "20-30 min", intensity: "rigorous" },
  { id: "attention-ecology", name: "Attention Ecology", route: "/advanced", category: "advanced", icon: Focus, reason: "Audit where your attention flows", duration: "15 min", intensity: "gentle" }
];

function getTimeOfDay(): "morning" | "afternoon" | "evening" | "night" {
  const hour = new Date().getHours();
  if (hour < 6) return "night";
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  if (hour < 22) return "evening";
  return "night";
}

function getRecommendations(state: UserState): ToolRecommendation[] {
  let recommendations: ToolRecommendation[] = [];
  
  if (state.energy === "low") {
    recommendations = TOOL_DATABASE.filter(t => t.intensity === "gentle");
  } else if (state.energy === "high" && state.clarity === "clear") {
    recommendations = TOOL_DATABASE.filter(t => t.intensity === "rigorous");
  } else {
    recommendations = TOOL_DATABASE.filter(t => t.intensity === "moderate");
  }
  
  if (state.goal) {
    const goalMatch: Record<string, string[]> = {
      "self-awareness": ["belief-mapping", "metacognition", "mindscape-navigator"],
      "emotional-regulation": ["timed-writing", "values-clarification", "narrative-identity"],
      "decision-making": ["logic-lattice", "decision-architecture", "cognitive-frameworks"],
      "learning": ["mental-models", "autodidact-forge", "dialectical-inquiry"],
      "resilience": ["existential-inquiry", "values-clarification", "mindscape-navigator"],
      "connection": ["narrative-identity", "values-clarification", "timed-writing"],
      "focus": ["deep-work", "attention-ecology", "mental-models"],
      "meaning": ["existential-inquiry", "values-clarification", "narrative-identity"]
    };
    
    const priorityIds = goalMatch[state.goal] || [];
    const priorityTools = TOOL_DATABASE.filter(t => priorityIds.includes(t.id));
    const otherTools = recommendations.filter(t => !priorityIds.includes(t.id));
    recommendations = [...priorityTools, ...otherTools];
  }
  
  return recommendations.slice(0, 4);
}

export default function AdaptiveCompanionPage() {
  const [state, setState] = useState<UserState>({
    energy: "medium",
    clarity: "mixed",
    mood: "neutral",
    time: getTimeOfDay(),
    goal: null
  });
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendations, setRecommendations] = useState<ToolRecommendation[]>([]);

  const updateState = <K extends keyof UserState>(key: K, value: UserState[K]) => {
    setState(s => ({ ...s, [key]: value }));
  };

  const generateRecommendations = () => {
    const recs = getRecommendations(state);
    setRecommendations(recs);
    setShowRecommendations(true);
  };

  const TimeIcon = state.time === "morning" ? Sun : state.time === "night" ? Moon : Clock;

  return (
  <WellnessPageShell
    title="AdaptiveCompanionPage"
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
      <SEO title="Adaptive Companion — The Genuine Love Project" description="Your personalized wellness guide that adapts to your needs." />


    <div className="min-h-screen hero-gradient">
      <div className="content-wrapper py-8">
        <div className="max-w-3xl mx-auto">
        <header className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="icon-container icon-xl icon-gradient-blush">
              <Sparkles className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-display-lg text-teal mb-4" data-testid="text-companion-title">
            Adaptive Companion
          </h1>
          <p className="text-lead max-w-2xl mx-auto" data-testid="text-companion-subtitle">
            Tell me how you're feeling, and I'll suggest tools that might serve you right now.
          </p>
        </header>

        <BenefitsBlock
          benefits={[
            "Get personalized tool suggestions based on your current state",
            "Match your energy and clarity to the right intensity level",
            "Your preferences stay local—no tracking"
          ]}
          duration="2–5 min to receive suggestions"
          control="Change your answers anytime"
          disclaimer="Educational tool finder—not clinical guidance. If you need crisis help, visit"
          crisisLink="/crisis"
          variant="minimal"
          className="mb-6"
        />

        {!showRecommendations ? (
          <div className="space-y-8">
            <div className="card-bordered">
              <div className="flex items-center gap-2 mb-4">
                <div className="icon-container icon-sm icon-soft-gold">
                  <TimeIcon className="h-4 w-4" />
                </div>
                <span className="text-body-sm">Good {state.time}!</span>
              </div>

              <div className="space-y-6">
                <div className="form-group">
                  <label className="form-label">How's your energy?</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "low", label: "Low", emoji: "🌙" },
                      { id: "medium", label: "Medium", emoji: "☀️" },
                      { id: "high", label: "High", emoji: "⚡" }
                    ].map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => updateState("energy", opt.id as any)}
                        className={`p-3 rounded-xl transition-all ${
                          state.energy === opt.id
                            ? "bg-[var(--sage-100)] border-[var(--sage-500)]"
                            : "bg-white border-[var(--sage-200)] hover:border-[var(--sage-400)]"
                        } border`}
                        data-testid={`button-energy-${opt.id}`}
                      >
                        <span className="text-lg">{opt.emoji}</span>
                        <span className="block text-caption mt-1">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Mental clarity?</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "foggy", label: "Foggy", emoji: "🌫️" },
                      { id: "mixed", label: "Mixed", emoji: "☁️" },
                      { id: "clear", label: "Clear", emoji: "✨" }
                    ].map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => updateState("clarity", opt.id as any)}
                        className={`p-3 rounded-xl transition-all ${
                          state.clarity === opt.id
                            ? "bg-[var(--teal-50)] border-[var(--teal-500)]"
                            : "bg-white border-[var(--sage-200)] hover:border-[var(--sage-400)]"
                        } border`}
                        data-testid={`button-clarity-${opt.id}`}
                      >
                        <span className="text-lg">{opt.emoji}</span>
                        <span className="block text-caption mt-1">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Emotional tone?</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "heavy", label: "Heavy", emoji: "🌧️" },
                      { id: "neutral", label: "Neutral", emoji: "🌤️" },
                      { id: "light", label: "Light", emoji: "🌈" }
                    ].map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => updateState("mood", opt.id as any)}
                        className={`p-3 rounded-xl transition-all ${
                          state.mood === opt.id
                            ? "bg-[var(--blush-50)] border-[var(--blush-500)]"
                            : "bg-white border-[var(--sage-200)] hover:border-[var(--sage-400)]"
                        } border`}
                        data-testid={`button-mood-${opt.id}`}
                      >
                        <span className="text-lg">{opt.emoji}</span>
                        <span className="block text-caption mt-1">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">What would you like to focus on?</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {GOALS.map(goal => (
                      <button
                        key={goal.id}
                        onClick={() => updateState("goal", state.goal === goal.id ? null : goal.id)}
                        className={`p-3 rounded-xl transition-all text-left ${
                          state.goal === goal.id
                            ? "bg-[var(--gold-50)] border-[var(--gold-500)]"
                            : "bg-white border-[var(--sage-200)] hover:border-[var(--sage-400)]"
                        } border`}
                        data-testid={`button-goal-${goal.id}`}
                      >
                        <goal.icon className="h-4 w-4 mb-1 text-[var(--sage-500)]" />
                        <span className="text-caption">{goal.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={generateRecommendations}
              className="btn-premium w-full py-4 text-lg flex items-center justify-center gap-2"
              data-testid="button-get-recommendations"
            >
              <Sparkles className="h-5 w-5" />
              Get Personalized Recommendations
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <button
              onClick={() => setShowRecommendations(false)}
              className="text-body-sm text-sage-500 hover:text-teal-600 flex items-center gap-1 transition"
              data-testid="button-back-state"
            >
              <RefreshCw className="h-4 w-4" />
              Update my state
            </button>

            <div className="card-bordered bg-gradient-to-br from-gold-50 via-blush-50 to-sage-50">
              <h2 className="text-heading-md text-teal mb-2 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-gold-500" />
                Recommendations for You
              </h2>
              <p className="text-body-sm">
                Based on your {state.energy} energy, {state.clarity} clarity
                {state.goal && `, and focus on ${GOALS.find(g => g.id === state.goal)?.label.toLowerCase()}`}
              </p>
            </div>

            <div className="space-y-4">
              {recommendations.map((tool, index) => (
                <Link 
                  key={tool.id} 
                  href={tool.route}
                  className="block card-bordered hover:shadow-md transition-all group"
                  data-testid={`card-recommendation-${tool.id}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="icon-container icon-md icon-soft-sage group-hover:icon-gradient-sage transition-all">
                      <tool.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-body-sm font-semibold text-teal group-hover:text-sage-600 transition-colors">{tool.name}</h3>
                        <span className="text-caption capitalize">{tool.category}</span>
                      </div>
                      <p className="text-body-sm mb-2">{tool.reason}</p>
                      <div className="flex items-center gap-4 text-caption">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {tool.duration}
                        </span>
                        <span className="capitalize">{tool.intensity}</span>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              ))}
            </div>

            <div className="card-bordered text-center">
              <p className="text-body-sm">
                Not sure where to start? 
                <Link href="/atlas" className="text-sage-600 hover:text-teal-600 underline ml-1" data-testid="link-explore-all">
                  Explore all 37 tools →
                </Link>
              </p>
            </div>
          </div>
        )}

        <div className="mt-12 text-center">
          <p className="text-caption max-w-md mx-auto">
            These suggestions are offerings based on what you've shared.
            Trust your intuition—you know what you need.
          </p>
        </div>
        </div>
      </div>
    </div>
  </WellnessPageShell>
  );
}
