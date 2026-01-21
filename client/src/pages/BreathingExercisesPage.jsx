import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { ArrowLeft, Wind, Play, Pause, RotateCcw, Heart, Timer, Zap } from "lucide-react";

const exercises = [
  {
    id: "box",
    name: "Box Breathing",
    description: "Equal-duration breathing for balance and calm. Used by Navy SEALs for stress management.",
    pattern: { inhale: 4, hold1: 4, exhale: 4, hold2: 4 },
    benefits: ["Reduces stress", "Improves focus", "Balances nervous system", "Promotes relaxation"],
    bestFor: "Acute stress, before important events, centering yourself"
  },
  {
    id: "478",
    name: "4-7-8 Relaxation",
    description: "Dr. Andrew Weil's calming breath. Activates the parasympathetic nervous system for deep relaxation.",
    pattern: { inhale: 4, hold1: 7, exhale: 8, hold2: 0 },
    benefits: ["Promotes sleep", "Reduces anxiety", "Calms racing thoughts", "Lowers blood pressure"],
    bestFor: "Before sleep, anxiety relief, calming panic"
  },
  {
    id: "coherent",
    name: "Coherent Breathing",
    description: "5-second rhythm that synchronizes heart rate variability for optimal nervous system balance.",
    pattern: { inhale: 5, hold1: 0, exhale: 5, hold2: 0 },
    benefits: ["Heart coherence", "Emotional balance", "Stress resilience", "Mental clarity"],
    bestFor: "Daily practice, emotional regulation, building resilience"
  },
  {
    id: "calming",
    name: "Calming Breath",
    description: "Extended exhale activates the vagus nerve and signals safety to your body.",
    pattern: { inhale: 4, hold1: 2, exhale: 6, hold2: 0 },
    benefits: ["Vagus nerve activation", "Deep relaxation", "Anxiety reduction", "Promotes safety"],
    bestFor: "Anxiety, overwhelm, grounding during stress"
  },
  {
    id: "energizing",
    name: "Energizing Breath",
    description: "Shorter, more dynamic breathing pattern to increase alertness and energy.",
    pattern: { inhale: 4, hold1: 0, exhale: 2, hold2: 0 },
    benefits: ["Increases energy", "Improves alertness", "Clears mental fog", "Boosts motivation"],
    bestFor: "Morning wake-up, afternoon slump, before exercise"
  }
];

const phases = ["Inhale", "Hold", "Exhale", "Hold"];

function BreathingTimer({ exercise, onComplete }) {
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [timeLeft, setTimeLeft] = useState(exercise.pattern.inhale);
  const [cycles, setCycles] = useState(0);
  const [totalBreaths, setTotalBreaths] = useState(4);

  const phaseDurations = [
    exercise.pattern.inhale,
    exercise.pattern.hold1,
    exercise.pattern.exhale,
    exercise.pattern.hold2
  ];

  const getPhaseColor = () => {
    switch (currentPhase) {
      case 0: return "from-sky-400 to-blue-500";
      case 1: return "from-purple-400 to-violet-500";
      case 2: return "from-amber-400 to-orange-500";
      case 3: return "from-rose-400 to-pink-500";
      default: return "from-slate-400 to-gray-500";
    }
  };

  const getPhaseInstruction = () => {
    if (phaseDurations[currentPhase] === 0) return null;
    return phases[currentPhase];
  };

  const reset = useCallback(() => {
    setIsRunning(false);
    setCurrentPhase(0);
    setTimeLeft(exercise.pattern.inhale);
    setCycles(0);
  }, [exercise.pattern.inhale]);

  useEffect(() => {
    reset();
  }, [exercise, reset]);

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          let nextPhase = (currentPhase + 1) % 4;
          while (phaseDurations[nextPhase] === 0 && nextPhase !== 0) {
            nextPhase = (nextPhase + 1) % 4;
          }
          
          if (nextPhase === 0) {
            const newCycles = cycles + 1;
            setCycles(newCycles);
            if (newCycles >= totalBreaths) {
              setIsRunning(false);
              onComplete?.();
              return phaseDurations[0];
            }
          }
          
          setCurrentPhase(nextPhase);
          return phaseDurations[nextPhase];
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, currentPhase, cycles, totalBreaths, phaseDurations, onComplete]);

  const instruction = getPhaseInstruction();

  return (
    <div className="text-center">
      <div className={`relative w-64 h-64 mx-auto mb-8 rounded-full bg-gradient-to-br ${getPhaseColor()} flex items-center justify-center transition-all duration-1000`}>
        <div className="absolute inset-4 rounded-full bg-white dark:bg-slate-900 flex flex-col items-center justify-center">
          <span className="text-5xl font-bold text-slate-900 dark:text-white">{timeLeft}</span>
          <span className="text-lg text-slate-600 dark:text-slate-400 mt-2">{instruction || "..."}</span>
        </div>
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="128"
            cy="128"
            r="120"
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="8"
          />
          <circle
            cx="128"
            cy="128"
            r="120"
            fill="none"
            stroke="white"
            strokeWidth="8"
            strokeDasharray={2 * Math.PI * 120}
            strokeDashoffset={2 * Math.PI * 120 * (1 - timeLeft / phaseDurations[currentPhase])}
            className="transition-all duration-1000"
          />
        </svg>
      </div>

      <div className="flex items-center justify-center gap-4 mb-6">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium hover:from-emerald-600 hover:to-teal-600 transition-all"
          data-testid="button-toggle-breathing"
        >
          {isRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          {isRunning ? "Pause" : "Start"}
        </button>
        <button
          onClick={reset}
          className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          data-testid="button-reset-breathing"
        >
          <RotateCcw className="h-5 w-5" />
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400">
        <Timer className="h-4 w-4" />
        <span>Cycle {cycles + 1} of {totalBreaths}</span>
      </div>

      <div className="mt-6">
        <label className="text-sm text-slate-600 dark:text-slate-400 block mb-2">Number of breaths:</label>
        <div className="flex justify-center gap-2">
          {[3, 4, 5, 6, 8, 10].map((num) => (
            <button
              key={num}
              onClick={() => { setTotalBreaths(num); reset(); }}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${totalBreaths === num 
                ? "bg-emerald-500 text-white" 
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"}`}
              data-testid={`button-breaths-${num}`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function BreathingExercisesPage() {
  const [selectedExercise, setSelectedExercise] = useState(exercises[0]);
  const [completed, setCompleted] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white dark:from-slate-900 dark:to-slate-950">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-8" data-testid="link-back-home">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 text-white mb-6">
            <Wind className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Breathing Exercises</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Evidence-based breathing techniques to calm your nervous system, reduce anxiety, and restore balance.
            Your breath is a powerful tool for healing.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-4">
            <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Choose a Technique</h2>
            {exercises.map((ex) => (
              <button
                key={ex.id}
                onClick={() => { setSelectedExercise(ex); setCompleted(false); }}
                className={`w-full text-left p-4 rounded-xl transition-all ${selectedExercise.id === ex.id
                  ? "bg-gradient-to-r from-sky-500 to-blue-500 text-white shadow-lg"
                  : "bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700"}`}
                data-testid={`button-exercise-${ex.id}`}
              >
                <h3 className={`font-medium ${selectedExercise.id === ex.id ? "text-white" : "text-slate-900 dark:text-white"}`}>
                  {ex.name}
                </h3>
                <p className={`text-sm mt-1 ${selectedExercise.id === ex.id ? "text-white/80" : "text-slate-600 dark:text-slate-400"}`}>
                  {ex.pattern.inhale}-{ex.pattern.hold1 || "0"}-{ex.pattern.exhale}-{ex.pattern.hold2 || "0"}
                </p>
              </button>
            ))}
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{selectedExercise.name}</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-8">{selectedExercise.description}</p>

              {completed ? (
                <div className="text-center py-12">
                  <Heart className="h-16 w-16 text-rose-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Well Done!</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">You've completed your breathing practice.</p>
                  <button
                    onClick={() => setCompleted(false)}
                    className="px-6 py-3 rounded-full bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-colors"
                    data-testid="button-practice-again"
                  >
                    Practice Again
                  </button>
                </div>
              ) : (
                <BreathingTimer exercise={selectedExercise} onComplete={() => setCompleted(true)} />
              )}

              <div className="mt-12 grid md:grid-cols-2 gap-6">
                <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-amber-500" />
                    Benefits
                  </h3>
                  <ul className="space-y-2">
                    {selectedExercise.benefits.map((benefit, idx) => (
                      <li key={idx} className="text-slate-600 dark:text-slate-400 text-sm flex items-start gap-2">
                        <span className="text-emerald-500 mt-1">•</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Heart className="h-5 w-5 text-rose-500" />
                    Best For
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">{selectedExercise.bestFor}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center py-8 border-t border-slate-200 dark:border-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-500">
            Breathing exercises are supportive wellness tools, not a replacement for professional mental health care.
            If you experience dizziness or discomfort, return to normal breathing. Consult a healthcare provider if symptoms persist.
          </p>
        </div>
      </div>
    </div>
  );
}
