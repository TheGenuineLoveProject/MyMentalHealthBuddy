import { useState } from "react";
import { 
  Sparkles, Heart, Brain, Moon, Shield, Flame, 
  ChevronRight, Check, Lock, Play, Star, Trophy,
  Calendar, Clock, Target, ArrowRight, Zap
} from "lucide-react";
import { useGamification } from "../context/GamificationContext.jsx";

const JOURNEYS = [
  {
    id: "anxiety-relief",
    name: "Anxiety Relief Journey",
    description: "A 7-day program to understand and manage anxiety through evidence-based techniques",
    category: "emotional",
    difficulty: "beginner",
    durationDays: 7,
    totalXp: 500,
    isPremium: false,
    icon: Shield,
    color: "from-blue-500 to-indigo-600",
    steps: [
      { day: 1, title: "Understanding Your Anxiety", tool: "anxiety", type: "learn" },
      { day: 2, title: "Breathing for Calm", tool: "breathing", type: "practice" },
      { day: 3, title: "Grounding Techniques", tool: "bodyscan", type: "practice" },
      { day: 4, title: "Thought Patterns", tool: "cbt", type: "learn" },
      { day: 5, title: "Progressive Relaxation", tool: "pmr", type: "practice" },
      { day: 6, title: "Building Coping Skills", tool: "coping", type: "learn" },
      { day: 7, title: "Your Anxiety Toolkit", tool: "anxiety", type: "master" },
    ]
  },
  {
    id: "mindfulness-mastery",
    name: "Mindfulness Mastery",
    description: "Develop a sustainable mindfulness practice over 14 days with guided exercises",
    category: "mindfulness",
    difficulty: "intermediate",
    durationDays: 14,
    totalXp: 1000,
    isPremium: true,
    icon: Moon,
    color: "from-violet-500 to-purple-600",
    steps: [
      { day: 1, title: "Introduction to Mindfulness", tool: "meditation", type: "learn" },
      { day: 2, title: "Breath Awareness", tool: "breathing", type: "practice" },
      { day: 3, title: "Body Scanning", tool: "bodyscan", type: "practice" },
      { day: 4, title: "Mindful Walking", tool: "walking", type: "practice" },
      { day: 5, title: "Sound Meditation", tool: "sound", type: "practice" },
      { day: 6, title: "Loving-Kindness", tool: "compassion", type: "learn" },
      { day: 7, title: "Weekly Reflection", tool: "reflection", type: "reflect" },
    ]
  },
  {
    id: "emotional-resilience",
    name: "Emotional Resilience",
    description: "Build inner strength and emotional flexibility through daily practices",
    category: "emotional",
    difficulty: "intermediate",
    durationDays: 21,
    totalXp: 1500,
    isPremium: true,
    icon: Heart,
    color: "from-rose-500 to-pink-600",
    steps: [
      { day: 1, title: "Emotional Awareness", tool: "emotions", type: "learn" },
      { day: 2, title: "Self-Compassion Basics", tool: "compassion", type: "practice" },
      { day: 3, title: "Reframing Thoughts", tool: "reframing", type: "learn" },
      { day: 4, title: "Resilience Stories", tool: "resilience", type: "reflect" },
      { day: 5, title: "Gratitude Practice", tool: "gratitude", type: "practice" },
      { day: 6, title: "Values Discovery", tool: "values", type: "learn" },
      { day: 7, title: "Building Boundaries", tool: "boundaries", type: "practice" },
    ]
  },
  {
    id: "sleep-restoration",
    name: "Sleep Restoration",
    description: "Restore healthy sleep patterns with science-backed techniques",
    category: "healing",
    difficulty: "beginner",
    durationDays: 10,
    totalXp: 750,
    isPremium: true,
    icon: Moon,
    color: "from-indigo-500 to-blue-600",
    steps: [
      { day: 1, title: "Sleep Foundations", tool: "sleep", type: "learn" },
      { day: 2, title: "Evening Rituals", tool: "rituals", type: "practice" },
      { day: 3, title: "Sleep Sanctuary", tool: "sleepsanctuary", type: "practice" },
      { day: 4, title: "Calming the Mind", tool: "meditation", type: "practice" },
      { day: 5, title: "Body Relaxation", tool: "pmr", type: "practice" },
    ]
  },
  {
    id: "stress-detox",
    name: "Stress Detox Program",
    description: "A comprehensive program to identify, manage, and release chronic stress",
    category: "healing",
    difficulty: "intermediate",
    durationDays: 14,
    totalXp: 1000,
    isPremium: false,
    icon: Zap,
    color: "from-amber-500 to-orange-600",
    steps: [
      { day: 1, title: "Stress Assessment", tool: "stress", type: "learn" },
      { day: 2, title: "Breathing Reset", tool: "breathing", type: "practice" },
      { day: 3, title: "Digital Detox", tool: "detox", type: "practice" },
      { day: 4, title: "Energy Management", tool: "energy", type: "practice" },
      { day: 5, title: "Worry Containment", tool: "worry", type: "learn" },
      { day: 6, title: "Somatic Release", tool: "somatic", type: "practice" },
      { day: 7, title: "Weekly Review", tool: "reflection", type: "reflect" },
    ]
  },
  {
    id: "self-love",
    name: "Self-Love Journey",
    description: "Cultivate a deeper relationship with yourself through compassionate practices",
    category: "growth",
    difficulty: "beginner",
    durationDays: 21,
    totalXp: 1500,
    isPremium: true,
    icon: Heart,
    color: "from-pink-500 to-rose-600",
    steps: [
      { day: 1, title: "Self-Compassion Start", tool: "compassion", type: "learn" },
      { day: 2, title: "Affirmation Practice", tool: "affirmations", type: "practice" },
      { day: 3, title: "Gratitude for Self", tool: "jar", type: "practice" },
      { day: 4, title: "Setting Boundaries", tool: "boundaries", type: "learn" },
      { day: 5, title: "Values Alignment", tool: "values", type: "reflect" },
      { day: 6, title: "Creative Expression", tool: "creative", type: "practice" },
      { day: 7, title: "Self-Care Day", tool: "selfcare", type: "practice" },
    ]
  }
];

export default function HealingJourneys() {
  const [selectedJourney, setSelectedJourney] = useState(null);
  const [activeJourneys, setActiveJourneys] = useState([]);
  const [view, setView] = useState("discover");
  const { addXP } = useGamification();

  const startJourney = (journey) => {
    if (!activeJourneys.find(j => j.id === journey.id)) {
      setActiveJourneys([...activeJourneys, { 
        ...journey, 
        currentDay: 1, 
        completedSteps: [],
        startedAt: new Date().toISOString()
      }]);
      addXP(25, `Started ${journey.name}`);
    }
    setSelectedJourney(journey);
    setView("active");
  };

  const completeStep = (journeyId, day) => {
    setActiveJourneys(prev => prev.map(j => {
      if (j.id === journeyId && !j.completedSteps.includes(day)) {
        const newCompleted = [...j.completedSteps, day];
        const xpEarned = Math.floor(j.totalXp / j.durationDays);
        addXP(xpEarned, `Completed Day ${day}`);
        return { 
          ...j, 
          completedSteps: newCompleted,
          currentDay: Math.max(j.currentDay, day + 1)
        };
      }
      return j;
    }));
  };

  const getActiveJourney = (id) => activeJourneys.find(j => j.id === id);

  const renderJourneyCard = (journey) => {
    const Icon = journey.icon;
    const active = getActiveJourney(journey.id);
    const progress = active ? (active.completedSteps.length / journey.durationDays) * 100 : 0;

    return (
      <div
        key={journey.id}
        onClick={() => active ? (setSelectedJourney(journey), setView("active")) : setSelectedJourney(journey)}
        className="card-elevated p-5 cursor-pointer hover:scale-[1.02] transition-all group"
        data-testid={`card-journey-${journey.id}`}
      >
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${journey.color} text-white shadow-lg`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-[var(--text)] truncate">{journey.name}</h3>
              {journey.isPremium && (
                <span className="px-2 py-0.5 text-xs font-medium bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full">
                  Premium
                </span>
              )}
            </div>
            <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-3">
              {journey.description}
            </p>
            <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)]">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {journey.durationDays} days
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-500" />
                {journey.totalXp} XP
              </span>
              <span className="capitalize px-2 py-0.5 rounded-full bg-[var(--surface)]">
                {journey.difficulty}
              </span>
            </div>
            {active && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[var(--primary)]">Day {active.currentDay} of {journey.durationDays}</span>
                  <span className="text-[var(--text-secondary)]">{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-[var(--surface)] rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${journey.color} transition-all duration-500`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
          <ChevronRight className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--primary)] transition-colors" />
        </div>
      </div>
    );
  };

  const renderJourneyDetail = () => {
    if (!selectedJourney) return null;
    const Icon = selectedJourney.icon;
    const active = getActiveJourney(selectedJourney.id);

    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedJourney(null)}
          className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors"
          data-testid="button-back-journeys"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          Back to Journeys
        </button>

        <div className={`p-6 rounded-2xl bg-gradient-to-br ${selectedJourney.color} text-white`}>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
              <Icon className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{selectedJourney.name}</h2>
              <p className="text-white/80">{selectedJourney.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm text-white/90">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {selectedJourney.durationDays} Days
            </span>
            <span className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              {selectedJourney.totalXp} XP Total
            </span>
            <span className="capitalize flex items-center gap-2">
              <Target className="w-4 h-4" />
              {selectedJourney.difficulty}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-[var(--text)]">Journey Steps</h3>
          {selectedJourney.steps.map((step, index) => {
            const isCompleted = active?.completedSteps.includes(step.day);
            const isCurrent = active?.currentDay === step.day;
            const isLocked = active ? step.day > active.currentDay : !active;

            return (
              <div
                key={step.day}
                className={`p-4 rounded-xl border-2 transition-all ${
                  isCompleted 
                    ? "bg-emerald-500/10 border-emerald-500/30" 
                    : isCurrent
                      ? "bg-[var(--primary)]/10 border-[var(--primary)]/30"
                      : "bg-[var(--surface)] border-transparent"
                }`}
                data-testid={`step-day-${step.day}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    isCompleted 
                      ? "bg-emerald-500 text-white" 
                      : isCurrent
                        ? "bg-[var(--primary)] text-white"
                        : "bg-[var(--surface-hover)] text-[var(--text-secondary)]"
                  }`}>
                    {isCompleted ? <Check className="w-5 h-5" /> : step.day}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-[var(--text)]">{step.title}</h4>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {step.type === "learn" && "Learn & Understand"}
                      {step.type === "practice" && "Hands-on Practice"}
                      {step.type === "reflect" && "Reflection & Integration"}
                      {step.type === "master" && "Master Your Skills"}
                    </p>
                  </div>
                  {isCurrent && !isCompleted && (
                    <button
                      onClick={() => completeStep(selectedJourney.id, step.day)}
                      className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
                      data-testid={`button-complete-day-${step.day}`}
                    >
                      <Play className="w-4 h-4" />
                      Start
                    </button>
                  )}
                  {isLocked && !active && (
                    <Lock className="w-5 h-5 text-[var(--text-secondary)]" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {!active && (
          <button
            onClick={() => startJourney(selectedJourney)}
            className={`w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r ${selectedJourney.color} hover:opacity-90 transition-opacity flex items-center justify-center gap-2`}
            data-testid="button-start-journey"
          >
            <Sparkles className="w-5 h-5" />
            Start This Program
          </button>
        )}
      </div>
    );
  };

  return (
    <div 
      className="card-elevated p-6"
      role="region"
      aria-label="Healing Journeys"
      data-testid="healing-journeys-container"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl text-white">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--text)]">Healing Journeys</h2>
            <p className="text-sm text-[var(--text-secondary)]">Structured programs for lasting change</p>
          </div>
        </div>
        {activeJourneys.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={() => setView("discover")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                view === "discover" 
                  ? "bg-[var(--primary)] text-white" 
                  : "bg-[var(--surface)] text-[var(--text-secondary)]"
              }`}
              data-testid="button-view-discover"
            >
              Discover
            </button>
            <button
              onClick={() => setView("active")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                view === "active" 
                  ? "bg-[var(--primary)] text-white" 
                  : "bg-[var(--surface)] text-[var(--text-secondary)]"
              }`}
              data-testid="button-view-active"
            >
              My Journeys ({activeJourneys.length})
            </button>
          </div>
        )}
      </div>

      {selectedJourney ? (
        renderJourneyDetail()
      ) : (
        <div className="space-y-4">
          {view === "active" && activeJourneys.length > 0 ? (
            activeJourneys.map(j => renderJourneyCard(JOURNEYS.find(jj => jj.id === j.id)))
          ) : (
            <>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wide mb-3">
                  Free Journeys
                </h3>
                <div className="space-y-3">
                  {JOURNEYS.filter(j => !j.isPremium).map(renderJourneyCard)}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wide mb-3 flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500" />
                  Premium Journeys
                </h3>
                <div className="space-y-3">
                  {JOURNEYS.filter(j => j.isPremium).map(renderJourneyCard)}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
