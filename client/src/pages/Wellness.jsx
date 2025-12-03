import { useState, useEffect } from "react";
import { Link } from "wouter";
import { 
  Sparkles, Wind, Moon, Target, Heart, 
  ChevronDown, ChevronUp, ArrowLeft,
  Sun, Trophy, Lightbulb
} from "lucide-react";
import SEO from "../components/SEO.jsx";
import BreathingExercise from "../components/BreathingExercise.jsx";
import MeditationTimer from "../components/MeditationTimer.jsx";
import HabitTracker from "../components/HabitTracker.jsx";
import SelfCareChecklist from "../components/SelfCareChecklist.jsx";
import DailyAffirmations from "../components/DailyAffirmations.jsx";
import GratitudePrompt from "../components/GratitudePrompt.jsx";
import AchievementBadges from "../components/AchievementBadges.jsx";
import WellnessScore from "../components/WellnessScore.jsx";

const TOOLS = [
  { id: "breathing", name: "Breathing Exercise", icon: Wind, color: "from-teal-400 to-cyan-500" },
  { id: "meditation", name: "Meditation Timer", icon: Moon, color: "from-indigo-400 to-purple-500" },
  { id: "habits", name: "Habit Tracker", icon: Target, color: "from-emerald-400 to-teal-500" },
  { id: "selfcare", name: "Self-Care Checklist", icon: Heart, color: "from-pink-400 to-rose-500" },
  { id: "affirmations", name: "Daily Affirmations", icon: Sun, color: "from-amber-400 to-orange-500" },
  { id: "gratitude", name: "Gratitude Journal", icon: Lightbulb, color: "from-rose-400 to-pink-500" },
];

export default function Wellness() {
  const [activeTool, setActiveTool] = useState("breathing");
  const [expandedSections, setExpandedSections] = useState({
    tools: true,
    progress: true,
  });
  const [progress, setProgress] = useState({
    mood: 0,
    journal: 0,
    wellness: 0,
    chat: 0,
  });

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && TOOLS.find((t) => t.id === hash)) {
      setActiveTool(hash);
    }

    const meditationSessions = parseInt(localStorage.getItem("meditation_sessions") || "0", 10);
    const selfcarePoints = parseInt(localStorage.getItem("selfcare_total_points") || "0", 10);
    
    setProgress({
      mood: 0,
      journal: 0,
      wellness: meditationSessions + Math.floor(selfcarePoints / 50),
      chat: 0,
    });
  }, []);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const renderActiveTool = () => {
    switch (activeTool) {
      case "breathing":
        return <BreathingExercise />;
      case "meditation":
        return <MeditationTimer />;
      case "habits":
        return <HabitTracker />;
      case "selfcare":
        return <SelfCareChecklist />;
      case "affirmations":
        return <DailyAffirmations />;
      case "gratitude":
        return <GratitudePrompt />;
      default:
        return <BreathingExercise />;
    }
  };

  return (
    <>
      <SEO
        title="Wellness Tools"
        description="Access breathing exercises, meditation timers, habit tracking, and self-care tools to support your mental wellness journey."
      />

      <div className="min-h-screen bg-[var(--bg)]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--accent-teal)]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[var(--primary)]/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/dashboard"
              className="p-2 rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--text)] transition-all"
              data-testid="link-back-dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-display font-bold text-[var(--text)]">
                Wellness Tools
              </h1>
              <p className="text-[var(--text-secondary)]">
                Nurture your mind, body, and spirit
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex flex-wrap gap-2 mb-4">
                {TOOLS.map((tool) => {
                  const Icon = tool.icon;
                  const isActive = activeTool === tool.id;

                  return (
                    <button
                      key={tool.id}
                      onClick={() => setActiveTool(tool.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                        isActive
                          ? `bg-gradient-to-r ${tool.color} text-white shadow-md`
                          : "bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
                      }`}
                      data-testid={`tab-${tool.id}`}
                    >
                      <Icon className="w-4 h-4" aria-hidden="true" />
                      <span className="hidden sm:inline">{tool.name}</span>
                    </button>
                  );
                })}
              </div>

              <div className="animate-fade-in-up">
                {renderActiveTool()}
              </div>
            </div>

            <div className="space-y-6">
              <div className="card-elevated overflow-hidden">
                <button
                  onClick={() => toggleSection("progress")}
                  className="w-full flex items-center justify-between p-4 hover:bg-[var(--surface-hover)] transition-colors"
                  data-testid="toggle-progress"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" aria-hidden="true" />
                    </div>
                    <span className="font-display font-bold text-[var(--text)]">Your Progress</span>
                  </div>
                  {expandedSections.progress ? (
                    <ChevronUp className="w-5 h-5 text-[var(--text-muted)]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[var(--text-muted)]" />
                  )}
                </button>

                {expandedSections.progress && (
                  <div className="p-4 pt-0 space-y-4 animate-fade-in-up">
                    <AchievementBadges progress={progress} compact />
                  </div>
                )}
              </div>

              <div className="card-elevated p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-[var(--text)]">Daily Goal</h4>
                    <p className="text-xs text-[var(--text-secondary)]">Complete 3 activities</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { name: "Breathing exercise", done: false },
                    { name: "5 min meditation", done: false },
                    { name: "Track a habit", done: false },
                  ].map((goal, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-xl bg-[var(--surface)]"
                    >
                      <div className={`w-5 h-5 rounded-full border-2 ${
                        goal.done 
                          ? "bg-emerald-500 border-emerald-500" 
                          : "border-[var(--border)]"
                      }`} />
                      <span className={goal.done ? "text-[var(--text-muted)] line-through" : "text-[var(--text)]"}>
                        {goal.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <DailyAffirmations compact />

              <div className="card-elevated p-6">
                <h4 className="font-display font-bold text-[var(--text)] mb-4">
                  Wellness Tips
                </h4>
                <div className="space-y-3 text-sm text-[var(--text-secondary)]">
                  <p>🌅 Start your day with 5 deep breaths</p>
                  <p>💧 Stay hydrated throughout the day</p>
                  <p>🚶 Take short walking breaks</p>
                  <p>😴 Aim for 7-8 hours of sleep</p>
                  <p>🌿 Spend time in nature when possible</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
