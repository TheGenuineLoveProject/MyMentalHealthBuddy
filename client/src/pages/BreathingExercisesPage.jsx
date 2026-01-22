import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { ArrowLeft, Wind, Play, Pause, RotateCcw, Heart, Timer, Zap, Brain, Shield, Moon, Sun, Sparkles, BookOpen } from "lucide-react";
import { useSEO } from "../hooks/useSEO";
import RelatedNextSteps from "../components/RelatedNextSteps.jsx";

const exercises = [
  {
    id: "box",
    name: "Box Breathing",
    description: "Equal-duration breathing for balance and nervous system reset. Used by Navy SEALs to maintain composure under extreme stress.",
    pattern: { inhale: 4, hold1: 4, exhale: 4, hold2: 4 },
    benefits: ["Activates parasympathetic response", "Improves focus and clarity", "Balances autonomic nervous system", "Creates predictable rhythm for safety"],
    bestFor: "Acute stress, before important events, centering yourself, anxiety management",
    polyvagalNote: "The equal rhythm creates predictability, which may help signal safety to your nervous system. The holds provide pauses that support regulation."
  },
  {
    id: "478",
    name: "4-7-8 Relaxation Breath",
    description: "Dr. Andrew Weil's powerful technique based on ancient pranayama. The extended exhale directly activates your parasympathetic nervous system.",
    pattern: { inhale: 4, hold1: 7, exhale: 8, hold2: 0 },
    benefits: ["Promotes deep sleep", "Reduces anxiety rapidly", "Calms racing thoughts", "Lowers cortisol levels"],
    bestFor: "Before sleep, acute anxiety, calming panic, breaking worry cycles",
    polyvagalNote: "The extended exhale is thought to stimulate the parasympathetic nervous system, which may help signal safety and promote rest."
  },
  {
    id: "coherent",
    name: "Coherent Breathing",
    description: "5-second rhythm scientifically shown to optimize heart rate variability (HRV), the gold standard measure of nervous system health.",
    pattern: { inhale: 5, hold1: 0, exhale: 5, hold2: 0 },
    benefits: ["Maximizes heart-brain coherence", "Emotional equilibrium", "Builds stress resilience over time", "Optimal vagal tone"],
    bestFor: "Daily practice, emotional regulation, building long-term resilience, baseline nervous system health",
    polyvagalNote: "Research by Dr. Patricia Gerbarg shows 5-7 breaths per minute creates optimal conditions for vagal stimulation and nervous system balance."
  },
  {
    id: "calming",
    name: "Extended Exhale",
    description: "The exhale is your access point to calm. By lengthening the exhale beyond the inhale, you directly activate the parasympathetic 'rest and digest' response.",
    pattern: { inhale: 4, hold1: 2, exhale: 6, hold2: 0 },
    benefits: ["Direct vagus nerve activation", "Signals safety to the brain", "Rapid anxiety reduction", "Shifts from fight-flight to rest-digest"],
    bestFor: "Anxiety relief, overwhelm, grounding during stress, returning to your window of tolerance",
    polyvagalNote: "Exhalation is controlled by the parasympathetic nervous system. Lengthening it literally tells your body: 'I am safe enough to breathe slowly.'"
  },
  {
    id: "energizing",
    name: "Energizing Breath",
    description: "Shorter, more dynamic breathing to gently increase sympathetic activation when you need alertness without anxiety.",
    pattern: { inhale: 4, hold1: 0, exhale: 2, hold2: 0 },
    benefits: ["Increases alertness naturally", "Clears mental fog", "Boosts motivation", "Gentle energy without caffeine"],
    bestFor: "Morning wake-up, afternoon slump, before exercise, when fatigue is protective avoidance",
    polyvagalNote: "Shorter exhales maintain mild sympathetic activation—the 'ready for action' state without tipping into fight-or-flight."
  },
  {
    id: "physiological",
    name: "Physiological Sigh",
    description: "A double-inhale followed by a long exhale—research from Stanford suggests this may be one of the quickest ways to reduce stress in real-time.",
    pattern: { inhale: 2, hold1: 1, exhale: 6, hold2: 0 },
    benefits: ["May quickly reduce stress", "Helps reinflate lung sacs", "Supports CO2 release", "Can help reset nervous system state"],
    bestFor: "Immediate stress relief, anxious moments, before difficult conversations, real-time regulation",
    polyvagalNote: "Research suggests the double inhale helps open alveoli in the lungs, supporting more efficient CO2 release, which may contribute to calming effects."
  }
];

const scienceOfBreathing = {
  vagusNerve: {
    title: "The Vagus Nerve Connection",
    content: "Your vagus nerve is the longest cranial nerve, running from your brainstem through your neck, heart, and into your gut. It's the 'information highway' between body and brain. Slow breathing directly stimulates this nerve, sending safety signals to your brain."
  },
  polyvagal: {
    title: "Polyvagal Theory & Breath",
    content: "According to Dr. Stephen Porges' polyvagal theory, your nervous system has three states: ventral vagal (safe/social), sympathetic (fight/flight), and dorsal vagal (freeze/shutdown). Conscious breathing is one of the few tools that can consciously shift between these states."
  },
  hrv: {
    title: "Heart Rate Variability",
    content: "HRV—the variation in time between heartbeats—is considered an important indicator of nervous system flexibility. Research suggests higher HRV may be associated with better stress resilience. Studies indicate coherent breathing at 5-7 breaths per minute may support improved HRV."
  },
  research: {
    title: "What Research Shows",
    content: "Studies demonstrate that just 5 minutes of slow, diaphragmatic breathing reduces cortisol, lowers blood pressure, decreases anxiety symptoms, and improves cognitive performance. Regular practice creates lasting changes in nervous system baseline."
  }
};

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
          <circle cx="128" cy="128" r="120" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="8" />
          <circle
            cx="128" cy="128" r="120" fill="none" stroke="white" strokeWidth="8"
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

  useSEO({
    title: "Breathing Exercises for Nervous System Regulation | The Genuine Love Project",
    description: "Evidence-based breathing techniques grounded in polyvagal theory for stress relief, anxiety reduction, and nervous system regulation. Box breathing, 4-7-8 technique, coherent breathing.",
  });

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
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Breathing for Nervous System Regulation</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Your breath is the only autonomic function you can consciously control—making it your most accessible tool for nervous system regulation. 
            These evidence-based techniques, grounded in polyvagal theory, help shift your body from stress states into calm presence.
          </p>
        </div>

        <div className="bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 rounded-2xl p-6 mb-12">
          <div className="flex items-start gap-4">
            <Brain className="h-6 w-6 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Why Breathing Works</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                <strong>Polyvagal insight:</strong> Your nervous system is constantly scanning for danger (neuroception). 
                Slow, deep breathing—especially with extended exhales—activates the ventral vagal complex, 
                signaling to your brain: "I am safe. I can rest." This isn't positive thinking; it's physiology.
              </p>
            </div>
          </div>
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
                  : "bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"}`}
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
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Beautiful Work</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">Take a moment to notice how you feel now compared to before.</p>
                  <p className="text-sm text-teal-600 dark:text-teal-400 mb-6">Each practice builds your capacity for calm. Your nervous system is learning.</p>
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

              <div className="mt-6 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl p-6">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  <Brain className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  Polyvagal Note
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">{selectedExercise.polyvagalNote}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-8 text-center flex items-center justify-center gap-2">
            <BookOpen className="h-6 w-6 text-indigo-600" />
            The Science Behind Breathwork
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {Object.values(scienceOfBreathing).map((item, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-800 rounded-xl p-6">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-3">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">{item.content}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-600" />
            Tips for Practice
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-600 dark:text-slate-400">
            <div>
              <strong className="text-slate-800 dark:text-slate-200">Build gradually:</strong> Start with 3-5 cycles. Overwhelm activates stress, not calm.
            </div>
            <div>
              <strong className="text-slate-800 dark:text-slate-200">Practice when calm:</strong> Train your nervous system during neutral times, not only during crisis.
            </div>
            <div>
              <strong className="text-slate-800 dark:text-slate-200">Consistency matters:</strong> 5 minutes daily creates more change than 30 minutes occasionally.
            </div>
          </div>
        </div>

        <RelatedNextSteps 
          steps={[
            { title: "Grounding Techniques", description: "Combine with grounding for deeper nervous system reset", path: "/grounding" },
            { title: "Meditation Guide", description: "Deepen your breath awareness practice", path: "/meditation-guide" },
            { title: "Sleep Guide", description: "Use breathwork for restorative sleep", path: "/sleep-guide" },
          ]}
          title="Continue Your Regulation Journey"
        />

        <div className="mt-12 text-center py-8 border-t border-slate-200 dark:border-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-500">
            Breathing exercises are powerful nervous system tools but not a replacement for professional mental health care.
            If you experience dizziness or discomfort, return to natural breathing. Your body's signals are always valid.
          </p>
        </div>
      </div>
    </div>
  );
}
