import { useState, useEffect, lazy, Suspense } from "react";
import { Link } from "wouter";
import { 
  Sparkles, Wind, Moon, Target, Heart, 
  ChevronDown, ChevronUp, ArrowLeft,
  Sun, Trophy, Lightbulb, Brain, Eye,
  Calendar, Bell, Bed, Zap, Users, Activity,
  Shield, Compass, Flame, Clock, Apple, Smartphone, ThermometerSun,
  Music, Gift, Star, Gamepad2, Smile, BookOpen, Sunrise, Droplets,
  Timer, Footprints, Palette, Award, Loader2
} from "lucide-react";
import SEO from "../components/SEO";
import { useGamification } from "../context/GamificationContext.jsx";

const BreathingExercise = lazy(() => import("../components/BreathingExercise.jsx"));
const MeditationTimer = lazy(() => import("../components/MeditationTimer.jsx"));
const HabitTracker = lazy(() => import("../components/HabitTracker.jsx"));
const SelfCareChecklist = lazy(() => import("../components/SelfCareChecklist.jsx"));
const DailyAffirmations = lazy(() => import("../components/DailyAffirmations.jsx"));
const GratitudePrompt = lazy(() => import("../components/GratitudePrompt.jsx"));
const AchievementBadges = lazy(() => import("../components/AchievementBadges.jsx"));
const WellnessScore = lazy(() => import("../components/WellnessScore.jsx"));
const SleepTracker = lazy(() => import("../components/SleepTracker.jsx"));
const AnxietyRelief = lazy(() => import("../components/AnxietyRelief.jsx"));
const PositiveVisualization = lazy(() => import("../components/PositiveVisualization.jsx"));
const EmotionWheel = lazy(() => import("../components/EmotionWheel.jsx"));
const CopingStrategies = lazy(() => import("../components/CopingStrategies.jsx"));
const GoalProgress = lazy(() => import("../components/GoalProgress.jsx"));
const MindfulnessBell = lazy(() => import("../components/MindfulnessBell.jsx"));
const WeeklyReflection = lazy(() => import("../components/WeeklyReflection.jsx"));
const SocialConnection = lazy(() => import("../components/SocialConnection.jsx"));
const BodyScanMeditation = lazy(() => import("../components/BodyScanMeditation.jsx"));
const PositiveReframing = lazy(() => import("../components/PositiveReframing.jsx"));
const EnergyBooster = lazy(() => import("../components/EnergyBooster.jsx"));
const ProgressiveMuscleRelaxation = lazy(() => import("../components/ProgressiveMuscleRelaxation.jsx"));
const SelfCompassion = lazy(() => import("../components/SelfCompassion.jsx"));
const WorryTimeScheduler = lazy(() => import("../components/WorryTimeScheduler.jsx"));
const ValuesExplorer = lazy(() => import("../components/ValuesExplorer.jsx"));
const StressMonitor = lazy(() => import("../components/StressMonitor.jsx"));
const MotivationBooster = lazy(() => import("../components/MotivationBooster.jsx"));
const BoundaryBuilder = lazy(() => import("../components/BoundaryBuilder.jsx"));
const MindfulEating = lazy(() => import("../components/MindfulEating.jsx"));
const DigitalDetox = lazy(() => import("../components/DigitalDetox.jsx"));
const AngerManagement = lazy(() => import("../components/AngerManagement.jsx"));
const CBTThoughtDiary = lazy(() => import("../components/CBTThoughtDiary.jsx"));
const SoundHealingPlayer = lazy(() => import("../components/SoundHealingPlayer.jsx"));
const AffirmationCards = lazy(() => import("../components/AffirmationCards.jsx"));
const GratitudeJar = lazy(() => import("../components/GratitudeJar.jsx"));
const EmotionalIntelligenceQuiz = lazy(() => import("../components/EmotionalIntelligenceQuiz.jsx"));
const SelfCareBingo = lazy(() => import("../components/SelfCareBingo.jsx"));
const MindfulnessChallenges = lazy(() => import("../components/MindfulnessChallenges.jsx"));
const WellnessStreakDashboard = lazy(() => import("../components/WellnessStreakDashboard.jsx"));
const CrisisStabilizer = lazy(() => import("../components/CrisisStabilizer.jsx"));
const SomaticRelease = lazy(() => import("../components/SomaticRelease.jsx"));
const SleepSanctuary = lazy(() => import("../components/SleepSanctuary.jsx"));
const MorningEveningRituals = lazy(() => import("../components/MorningEveningRituals.jsx"));
const LaughterTherapy = lazy(() => import("../components/LaughterTherapy.jsx"));
const ResilienceStories = lazy(() => import("../components/ResilienceStories.jsx"));
const XPProgressBar = lazy(() => import("../components/XPProgressBar.jsx"));
const QuestPanel = lazy(() => import("../components/QuestPanel.jsx"));
const FocusTimer = lazy(() => import("../components/FocusTimer.jsx"));
const HydrationTracker = lazy(() => import("../components/HydrationTracker.jsx"));
const PowerNap = lazy(() => import("../components/PowerNap.jsx"));
const MindfulWalking = lazy(() => import("../components/MindfulWalking.jsx"));
const CreativeExpression = lazy(() => import("../components/CreativeExpression.jsx"));
const AchievementSystem = lazy(() => import("../components/AchievementSystem.jsx"));

const ToolLoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[200px] rounded-2xl backdrop-blur-sm" style={{ background: 'var(--glp-paper)', opacity: 0.95 }}>
    <div className="flex flex-col items-center gap-3">
      <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--glp-sage)' }} />
      <p className="text-sm" style={{ color: 'var(--glp-sage)' }}>Loading wellness tool...</p>
    </div>
  </div>
);

const TOOL_CATEGORIES = {
  mindfulness: {
    name: "Mindfulness & Relaxation",
    icon: Moon,
    tools: [
      { id: "breathing", name: "Breathing Exercise", icon: Wind, color: "from-teal-400 to-cyan-500" },
      { id: "meditation", name: "Meditation Timer", icon: Moon, color: "from-indigo-400 to-purple-500" },
      { id: "visualization", name: "Guided Visualization", icon: Sparkles, color: "from-amber-400 to-yellow-500" },
      { id: "bell", name: "Mindfulness Bell", icon: Bell, color: "from-violet-400 to-purple-500" },
      { id: "bodyscan", name: "Body Scan", icon: Heart, color: "from-pink-400 to-rose-500" },
      { id: "pmr", name: "Muscle Relaxation", icon: Activity, color: "from-violet-400 to-purple-500" },
      { id: "sound", name: "Sound Healing", icon: Music, color: "from-indigo-400 to-purple-500" },
      { id: "walking", name: "Mindful Walking", icon: Footprints, color: "from-emerald-400 to-teal-500" },
    ],
  },
  emotional: {
    name: "Emotional Wellness",
    icon: Heart,
    tools: [
      { id: "emotions", name: "Emotion Wheel", icon: Heart, color: "from-pink-400 to-rose-500" },
      { id: "anxiety", name: "Anxiety Relief", icon: Zap, color: "from-orange-400 to-red-500" },
      { id: "anger", name: "Anger Management", icon: ThermometerSun, color: "from-red-400 to-orange-500" },
      { id: "coping", name: "Coping Strategies", icon: Brain, color: "from-purple-400 to-indigo-500" },
      { id: "reframing", name: "Positive Reframing", icon: Lightbulb, color: "from-amber-400 to-yellow-500" },
      { id: "compassion", name: "Self-Compassion", icon: Heart, color: "from-rose-400 to-pink-500" },
      { id: "affirmations", name: "Daily Affirmations", icon: Sun, color: "from-amber-400 to-orange-500" },
      { id: "cbt", name: "CBT Thought Diary", icon: Brain, color: "from-violet-400 to-purple-500" },
      { id: "eq", name: "EQ Assessment", icon: Brain, color: "from-indigo-400 to-blue-500" },
    ],
  },
  tracking: {
    name: "Tracking & Progress",
    icon: Target,
    tools: [
      { id: "habits", name: "Habit Tracker", icon: Target, color: "from-emerald-400 to-teal-500" },
      { id: "goals", name: "Goal Progress", icon: Trophy, color: "from-amber-400 to-orange-500" },
      { id: "sleep", name: "Sleep Tracker", icon: Bed, color: "from-indigo-400 to-purple-500" },
      { id: "stress", name: "Stress Monitor", icon: Activity, color: "from-blue-400 to-indigo-500" },
      { id: "reflection", name: "Weekly Reflection", icon: Calendar, color: "from-blue-400 to-indigo-500" },
      { id: "worry", name: "Worry Time", icon: Clock, color: "from-sage-400 to-sage-500" },
      { id: "streaks", name: "Wellness Streaks", icon: Flame, color: "from-orange-400 to-amber-500" },
      { id: "challenges", name: "Challenges", icon: Target, color: "from-emerald-400 to-teal-500" },
      { id: "focus", name: "Focus Timer", icon: Timer, color: "from-rose-400 to-orange-500" },
    ],
  },
  selfcare: {
    name: "Self-Care & Lifestyle",
    icon: Sparkles,
    tools: [
      { id: "selfcare", name: "Self-Care Checklist", icon: Heart, color: "from-pink-400 to-rose-500" },
      { id: "gratitude", name: "Gratitude Journal", icon: Lightbulb, color: "from-rose-400 to-pink-500" },
      { id: "energy", name: "Energy Booster", icon: Activity, color: "from-orange-400 to-red-500" },
      { id: "social", name: "Social Connection", icon: Users, color: "from-cyan-400 to-blue-500" },
      { id: "eating", name: "Mindful Eating", icon: Apple, color: "from-lime-400 to-green-500" },
      { id: "detox", name: "Digital Detox", icon: Smartphone, color: "from-sky-400 to-blue-500" },
      { id: "bingo", name: "Self-Care Bingo", icon: Gamepad2, color: "from-pink-400 to-rose-500" },
      { id: "hydration", name: "Hydration Tracker", icon: Droplets, color: "from-cyan-400 to-blue-500" },
      { id: "powernap", name: "Power Nap", icon: Moon, color: "from-indigo-400 to-purple-500" },
    ],
  },
  growth: {
    name: "Personal Growth",
    icon: Compass,
    tools: [
      { id: "values", name: "Values Explorer", icon: Compass, color: "from-emerald-400 to-teal-500" },
      { id: "motivation", name: "Motivation Booster", icon: Flame, color: "from-amber-400 to-orange-500" },
      { id: "boundaries", name: "Boundary Builder", icon: Shield, color: "from-violet-400 to-purple-500" },
      { id: "cards", name: "Affirmation Cards", icon: Star, color: "from-rose-400 to-pink-500" },
      { id: "jar", name: "Gratitude Jar", icon: Gift, color: "from-amber-400 to-orange-500" },
      { id: "resilience", name: "Resilience Stories", icon: BookOpen, color: "from-rose-400 to-pink-500" },
      { id: "creative", name: "Creative Expression", icon: Palette, color: "from-pink-400 to-purple-500" },
      { id: "achievements", name: "Achievement System", icon: Award, color: "from-amber-400 to-yellow-500" },
    ],
  },
  healing: {
    name: "Healing & Recovery",
    icon: Heart,
    tools: [
      { id: "crisis", name: "Crisis Stabilizer", icon: Shield, color: "from-rose-500 to-pink-600" },
      { id: "somatic", name: "Somatic Release", icon: Activity, color: "from-violet-400 to-purple-500" },
      { id: "sleepsanctuary", name: "Sleep Sanctuary", icon: Moon, color: "from-indigo-500 to-purple-600" },
      { id: "rituals", name: "Morning/Evening Rituals", icon: Sunrise, color: "from-amber-400 to-orange-500" },
      { id: "laughter", name: "Laughter Therapy", icon: Smile, color: "from-yellow-400 to-orange-500" },
    ],
  },
};

const ALL_TOOLS = Object.values(TOOL_CATEGORIES).flatMap(cat => cat.tools);

export default function Wellness() {
  const [activeTool, setActiveTool] = useState("breathing");
  const [activeCategory, setActiveCategory] = useState("mindfulness");
  const [expandedSections, setExpandedSections] = useState({
    tools: true,
    progress: true,
  });

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && ALL_TOOLS.find((t) => t.id === hash)) {
      setActiveTool(hash);
      for (const [catKey, cat] of Object.entries(TOOL_CATEGORIES)) {
        if (cat.tools.find(t => t.id === hash)) {
          setActiveCategory(catKey);
          break;
        }
      }
    }
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
      case "visualization":
        return <PositiveVisualization />;
      case "bell":
        return <MindfulnessBell />;
      case "bodyscan":
        return <BodyScanMeditation />;
      case "pmr":
        return <ProgressiveMuscleRelaxation />;
      case "emotions":
        return <EmotionWheel />;
      case "anxiety":
        return <AnxietyRelief />;
      case "anger":
        return <AngerManagement />;
      case "coping":
        return <CopingStrategies />;
      case "reframing":
        return <PositiveReframing />;
      case "compassion":
        return <SelfCompassion />;
      case "affirmations":
        return <DailyAffirmations />;
      case "habits":
        return <HabitTracker />;
      case "goals":
        return <GoalProgress />;
      case "sleep":
        return <SleepTracker />;
      case "stress":
        return <StressMonitor />;
      case "reflection":
        return <WeeklyReflection />;
      case "worry":
        return <WorryTimeScheduler />;
      case "selfcare":
        return <SelfCareChecklist />;
      case "gratitude":
        return <GratitudePrompt />;
      case "energy":
        return <EnergyBooster />;
      case "social":
        return <SocialConnection />;
      case "eating":
        return <MindfulEating />;
      case "detox":
        return <DigitalDetox />;
      case "values":
        return <ValuesExplorer />;
      case "motivation":
        return <MotivationBooster />;
      case "boundaries":
        return <BoundaryBuilder />;
      case "cbt":
        return <CBTThoughtDiary />;
      case "sound":
        return <SoundHealingPlayer />;
      case "cards":
        return <AffirmationCards />;
      case "jar":
        return <GratitudeJar />;
      case "eq":
        return <EmotionalIntelligenceQuiz />;
      case "bingo":
        return <SelfCareBingo />;
      case "challenges":
        return <MindfulnessChallenges />;
      case "streaks":
        return <WellnessStreakDashboard />;
      case "crisis":
        return <CrisisStabilizer />;
      case "somatic":
        return <SomaticRelease />;
      case "sleepsanctuary":
        return <SleepSanctuary />;
      case "rituals":
        return <MorningEveningRituals />;
      case "laughter":
        return <LaughterTherapy />;
      case "resilience":
        return <ResilienceStories />;
      case "focus":
        return <FocusTimer />;
      case "hydration":
        return <HydrationTracker />;
      case "powernap":
        return <PowerNap />;
      case "walking":
        return <MindfulWalking />;
      case "creative":
        return <CreativeExpression />;
      case "achievements":
        return <AchievementSystem />;
      default:
        return <BreathingExercise />;
    }
  };

  const activeCategoryData = TOOL_CATEGORIES[activeCategory];
  const activeToolData = ALL_TOOLS.find(t => t.id === activeTool);

  return (
    <>
      <SEO
        title="Wellness Toolkit"
        description="Access comprehensive wellness tools including breathing exercises, meditation, anxiety relief, emotion tracking, habit building, and self-care resources to support your mental health journey."
      />

      <div className="min-h-screen hero-gradient">
        <div className="decorative-orb decorative-orb-sage w-[400px] h-[400px] -top-20 -left-20 absolute" aria-hidden="true" />
        <div className="decorative-orb decorative-orb-blush w-[350px] h-[350px] bottom-20 -right-20 absolute" aria-hidden="true" />
        <div className="decorative-orb decorative-orb-gold w-[200px] h-[200px] top-1/2 right-1/4 absolute" aria-hidden="true" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
          <header className="mb-8">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-body-sm text-[var(--sage-500)] hover:text-[var(--teal-600)] transition mb-6"
              data-testid="link-back-dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <div className="flex items-center gap-4">
              <div className="icon-container icon-xl icon-gradient-blush">
                <Heart className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-display-lg text-teal" data-testid="text-wellness-title">
                  Wellness Toolkit
                </h1>
                <p className="text-lead">Your comprehensive self-improvement sanctuary</p>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <div className="card-elevated p-4">
                <h3 className="font-semibold text-[var(--text)] mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[var(--primary)]" />
                  Wellness Tools
                </h3>

                {Object.entries(TOOL_CATEGORIES).map(([catKey, category]) => {
                  const CatIcon = category.icon;
                  const isActive = activeCategory === catKey;
                  
                  return (
                    <div key={catKey} className="mb-3">
                      <button
                        onClick={() => setActiveCategory(catKey)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                          isActive
                            ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                            : "hover:bg-[var(--surface-hover)] text-[var(--text-secondary)]"
                        }`}
                        data-testid={`button-category-${catKey}`}
                      >
                        <div className="flex items-center gap-2">
                          <CatIcon className="w-4 h-4" />
                          <span className="text-sm font-medium">{category.name}</span>
                        </div>
                        {isActive ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronUp className="w-4 h-4 rotate-90" />
                        )}
                      </button>

                      {isActive && (
                        <div className="mt-2 ml-2 space-y-1 animate-fade-in-up">
                          {category.tools.map((tool) => {
                            const ToolIcon = tool.icon;
                            const isToolActive = activeTool === tool.id;
                            
                            return (
                              <button
                                key={tool.id}
                                onClick={() => setActiveTool(tool.id)}
                                className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition-all ${
                                  isToolActive
                                    ? `bg-gradient-to-r ${tool.color} text-white shadow-md`
                                    : "hover:bg-[var(--surface)] text-[var(--text-secondary)]"
                                }`}
                                data-testid={`button-tool-${tool.id}`}
                              >
                                <ToolIcon className="w-4 h-4" />
                                <span className="text-sm">{tool.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="card-elevated p-4">
                <button
                  onClick={() => toggleSection("progress")}
                  className="w-full flex items-center justify-between mb-3"
                  data-testid="button-toggle-progress"
                >
                  <h3 className="font-semibold text-[var(--text)] flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    Progress Overview
                  </h3>
                  {expandedSections.progress ? (
                    <ChevronUp className="w-4 h-4 text-[var(--text-muted)]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />
                  )}
                </button>

                {expandedSections.progress && (
                  <div className="space-y-3 animate-fade-in-up">
                    <Suspense fallback={<ToolLoadingFallback />}>
                      <WellnessScore 
                        score={75} 
                        showDetails={false}
                      />
                      <AchievementBadges compact />
                    </Suspense>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="mb-4 flex items-center gap-3">
                {activeToolData && (
                  <>
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${activeToolData.color} flex items-center justify-center shadow-md`}>
                      <activeToolData.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="font-display font-bold text-xl text-[var(--text)]" data-testid="text-active-tool">
                        {activeToolData.name}
                      </h2>
                      <p className="text-sm text-[var(--text-secondary)]">
                        {activeCategoryData.name}
                      </p>
                    </div>
                  </>
                )}
              </div>

              <div className="animate-fade-in-up" data-testid="tool-container">
                <Suspense fallback={<ToolLoadingFallback />}>
                  {renderActiveTool()}
                </Suspense>
              </div>

              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
                <Link 
                  href="/mood" 
                  className="p-4 rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-hover)] transition-all text-center group"
                  data-testid="link-mood"
                >
                  <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                    <Sun className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-[var(--text)]">Track Mood</span>
                </Link>
                <Link 
                  href="/journal" 
                  className="p-4 rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-hover)] transition-all text-center group"
                  data-testid="link-journal"
                >
                  <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                    <Lightbulb className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-[var(--text)]">Write Journal</span>
                </Link>
                <Link 
                  href="/chat" 
                  className="p-4 rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-hover)] transition-all text-center group"
                  data-testid="link-chat"
                >
                  <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-[var(--text)]">Talk to Buddy</span>
                </Link>
                <Link 
                  href="/crisis" 
                  className="p-4 rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-hover)] transition-all text-center group"
                  data-testid="link-crisis"
                >
                  <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-gradient-to-br from-red-400 to-rose-500 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-[var(--text)]">Crisis Help</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-[var(--text-muted)]">
              💡 Tip: Consistent practice yields the best results. Try using at least one tool daily.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
