import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "wouter";
import { ArrowLeft, Play, Pause, RotateCcw, Wind, Clock, Leaf } from "lucide-react";
import { Button } from "@/components/ui";
import { CardWrapper, CardContent } from "@/components/ui/Card";
import { Switch } from "@/components/ui/Switch";
import SEO from "@/components/SEO";
import { SafetyFooter } from "@/components/safety/SafetyFooter";
import { useReadingLevel } from "@/context/ReadingLevelContext";
import { pickSlot } from "@/content/microcopy/wellnessMicrocopy";

const PACE_OPTIONS = [
  { id: "quick", label: "60 seconds", duration: 60, cycles: 6 },
  { id: "full", label: "10 minutes", duration: 600, cycles: 60 }
];

const BREATH_TIMING = {
  normal: { inhale: 4, exhale: 6 },
  softer: { inhale: 3, exhale: 5 }
};

const REFLECTION_PROMPTS = {
  beginner: "How do you feel now?",
  intermediate: "What changed in your body during the practice?",
  advanced: "What state shift do you notice in your nervous system?"
};

const ENCOURAGEMENT = {
  beginner: [
    "You showed up. That matters.",
    "Small moments add up.",
    "You gave yourself this time."
  ],
  intermediate: [
    "Your breath is always available.",
    "You created a pause in your day.",
    "This practice builds over time."
  ],
  advanced: [
    "You've touched into regulation.",
    "Notice what carries forward.",
    "The nervous system remembers."
  ]
};

function getStorageKey() {
  return "glp:breath:history";
}

function saveSession(pace, completed) {
  try {
    const history = JSON.parse(localStorage.getItem(getStorageKey()) || "[]");
    history.push({
      pace,
      completed,
      timestamp: new Date().toISOString()
    });
    if (history.length > 100) history.shift();
    localStorage.setItem(getStorageKey(), JSON.stringify(history));
  } catch (e) {
    console.warn("Could not save breath session:", e);
  }
}

export default function BreathTool() {
  const { level } = useReadingLevel();
  const tierKey = level === "advanced" ? "advanced" : level === "intermediate" ? "intermediate" : "beginner";

  const [selectedPace, setSelectedPace] = useState(PACE_OPTIONS[0]);
  const [softerMode, setSofterMode] = useState(false);
  const [phase, setPhase] = useState("idle");
  const [breathPhase, setBreathPhase] = useState("inhale");
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [showReflection, setShowReflection] = useState(false);

  const timerRef = useRef(null);
  const breathTimerRef = useRef(null);

  const timing = softerMode ? BREATH_TIMING.softer : BREATH_TIMING.normal;
  const totalBreathCycle = timing.inhale + timing.exhale;

  const startPractice = useCallback(() => {
    setPhase("active");
    setSecondsLeft(selectedPace.duration);
    setCycleCount(0);
    setBreathPhase("inhale");
    setShowReflection(false);
  }, [selectedPace]);

  const pausePractice = useCallback(() => {
    setPhase("paused");
  }, []);

  const resumePractice = useCallback(() => {
    setPhase("active");
  }, []);

  const resetPractice = useCallback(() => {
    setPhase("idle");
    setSecondsLeft(0);
    setCycleCount(0);
    setBreathPhase("inhale");
    setShowReflection(false);
  }, []);

  const completePractice = useCallback(() => {
    setPhase("complete");
    setShowReflection(true);
    saveSession(selectedPace.id, true);
  }, [selectedPace]);

  useEffect(() => {
    if (phase !== "active") {
      if (timerRef.current) clearInterval(timerRef.current);
      if (breathTimerRef.current) clearInterval(breathTimerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          completePractice();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    let breathSecond = 0;
    breathTimerRef.current = setInterval(() => {
      breathSecond++;
      if (breathSecond <= timing.inhale) {
        setBreathPhase("inhale");
      } else if (breathSecond <= totalBreathCycle) {
        setBreathPhase("exhale");
      } else {
        breathSecond = 1;
        setBreathPhase("inhale");
        setCycleCount(prev => prev + 1);
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (breathTimerRef.current) clearInterval(breathTimerRef.current);
    };
  }, [phase, timing, totalBreathCycle, completePractice]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const circleScale = breathPhase === "inhale" ? "scale-100" : "scale-75";
  const circleTransition = breathPhase === "inhale" 
    ? `transition-transform duration-[${timing.inhale}s] ease-in-out`
    : `transition-transform duration-[${timing.exhale}s] ease-in-out`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white dark:from-gray-900 dark:to-gray-800">
      <SEO
        title="Breath Reset | The Genuine Love Project"
        description="A gentle breathing practice to help you reset and find calm. Choose your pace and begin when you're ready."
        canonicalPath="/tools/breath"
      />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link href="/tools" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6" data-testid="link-back-tools">
          <ArrowLeft className="w-4 h-4" />
          Back to Tools
        </Link>

        {/* Hero */}
        <header className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sky-100 dark:bg-sky-900/30 mb-4">
            <Wind className="w-8 h-8 text-sky-600 dark:text-sky-400" />
          </div>
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2" data-testid="heading-breath-reset">
            Breath Reset
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            A gentle reset you can stop anytime.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {pickSlot("consent", tierKey, "breath-consent")}
          </p>
        </header>

        {/* Idle State: Choose Pace */}
        {phase === "idle" && (
          <div className="space-y-6">
            <CardWrapper>
              <CardContent className="p-6">
                <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-sky-600" />
                  Choose Your Pace
                </h2>
                <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Select breathing exercise duration">
                  {PACE_OPTIONS.map(pace => (
                    <button
                      key={pace.id}
                      onClick={() => setSelectedPace(pace)}
                      className={`p-4 rounded-lg border-2 transition-all text-center min-h-[56px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                        selectedPace.id === pace.id
                          ? "border-sky-500 bg-sky-50 dark:bg-sky-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-sky-300"
                      }`}
                      data-testid={`button-pace-${pace.id}`}
                      role="radio"
                      aria-checked={selectedPace.id === pace.id}
                      aria-label={`${pace.label} breathing session`}
                    >
                      <span className="font-medium">{pace.label}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </CardWrapper>

            <CardWrapper>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-green-600" />
                    <label htmlFor="softer-mode" className="font-medium">
                      Softer Version
                    </label>
                  </div>
                  <Switch
                    id="softer-mode"
                    checked={softerMode}
                    onCheckedChange={setSofterMode}
                    data-testid="switch-softer-mode"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {softerMode 
                    ? "Gentler timing: 3s in, 5s out" 
                    : "Standard coherent breathing: 4s in, 6s out"}
                </p>
              </CardContent>
            </CardWrapper>

            <Button
              size="lg"
              className="w-full h-14 text-lg bg-sky-600 hover:bg-sky-700"
              onClick={startPractice}
              data-testid="button-begin"
            >
              <Play className="w-5 h-5 mr-2" />
              Begin gently
            </Button>

            <p className="text-center text-sm text-gray-500">
              You can pause or stop at any time.
            </p>
          </div>
        )}

        {/* Active/Paused State: Breathing Circle */}
        {(phase === "active" || phase === "paused") && (
          <div className="space-y-8">
            {/* Timer */}
            <div className="text-center">
              <span className="text-4xl font-light text-gray-700 dark:text-gray-200" data-testid="text-timer">
                {formatTime(secondsLeft)}
              </span>
              <p className="text-sm text-gray-500 mt-1">
                Cycle {cycleCount + 1}
              </p>
            </div>

            {/* Breath Circle */}
            <div className="flex justify-center">
              <div className="relative w-48 h-48 flex items-center justify-center">
                <div
                  className={`absolute inset-0 rounded-full bg-sky-200 dark:bg-sky-800/40 ${circleScale} transition-transform`}
                  style={{
                    transitionDuration: breathPhase === "inhale" ? `${timing.inhale}s` : `${timing.exhale}s`,
                    transitionTimingFunction: "ease-in-out"
                  }}
                  data-testid="breath-circle"
                />
                <span className="relative z-10 text-2xl font-medium text-sky-700 dark:text-sky-300 capitalize">
                  {breathPhase === "inhale" ? "Breathe in" : "Breathe out"}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4" role="group" aria-label="Breathing exercise controls">
              {phase === "active" ? (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={pausePractice}
                  className="h-12 px-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  data-testid="button-pause"
                  aria-label="Pause breathing exercise"
                >
                  <Pause className="w-5 h-5 mr-2" aria-hidden="true" />
                  Pause
                </Button>
              ) : (
                <Button
                  size="lg"
                  onClick={resumePractice}
                  className="h-12 px-6 bg-sky-600 hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  data-testid="button-resume"
                  aria-label="Resume breathing exercise"
                >
                  <Play className="w-5 h-5 mr-2" aria-hidden="true" />
                  Resume
                </Button>
              )}
              <Button
                variant="ghost"
                size="lg"
                onClick={resetPractice}
                className="h-12 px-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                data-testid="button-reset"
                aria-label="Stop and reset breathing exercise"
              >
                <RotateCcw className="w-5 h-5 mr-2" aria-hidden="true" />
                Stop
              </Button>
            </div>

            {/* Support Panel */}
            <CardWrapper className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  If this feels too much, stop and look around the room.
                </p>
              </CardContent>
            </CardWrapper>
          </div>
        )}

        {/* Complete State: Reflection */}
        {phase === "complete" && showReflection && (
          <div className="space-y-6">
            <CardWrapper className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-800/40 flex items-center justify-center mx-auto mb-4">
                  <Wind className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-xl font-medium text-green-800 dark:text-green-200 mb-2">
                  Practice Complete
                </h2>
                <p className="text-green-700 dark:text-green-300">
                  {ENCOURAGEMENT[tierKey][Math.floor(Math.random() * 3)]}
                </p>
              </CardContent>
            </CardWrapper>

            <CardWrapper>
              <CardContent className="p-6">
                <h3 className="font-medium mb-3">Reflection</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {REFLECTION_PROMPTS[tierKey]}
                </p>
                <p className="text-sm text-gray-500">
                  Take a moment to notice. No need to write anything down.
                </p>
              </CardContent>
            </CardWrapper>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 h-12"
                onClick={resetPractice}
                data-testid="button-practice-again"
              >
                Practice Again
              </Button>
              <Button
                asChild
                className="flex-1 h-12 bg-sky-600 hover:bg-sky-700"
              >
                <Link href="/tools" data-testid="link-back-tools-complete">
                  Back to Tools
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>

      <SafetyFooter showCrisisLink={true} />
    </div>
  );
}
