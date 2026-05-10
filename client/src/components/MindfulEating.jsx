import { useState, useEffect } from "react";
import { Apple, Play, Pause, Check, RefreshCw, Utensils } from 'lucide-react';

const MINDFUL_EATING_STEPS = [
  {
    id: "observe",
    name: "Observe",
    duration: 30,
    icon: "👀",
    instruction: "Look at your food. Notice the colors, shapes, and textures. Appreciate how it looks before eating.",
  },
  {
    id: "smell",
    name: "Smell",
    duration: 20,
    icon: "👃",
    instruction: "Bring the food close and inhale deeply. What aromas do you notice? Let the smell prepare your body for eating.",
  },
  {
    id: "gratitude",
    name: "Gratitude",
    duration: 20,
    icon: "🙏",
    instruction: "Take a moment to feel grateful for this nourishment. Think about everyone involved in bringing this food to you.",
  },
  {
    id: "first-bite",
    name: "First Bite",
    duration: 30,
    icon: "😋",
    instruction: "Take a small bite. Don't chew yet. Let it rest on your tongue. Notice the initial flavors and textures.",
  },
  {
    id: "chew",
    name: "Chew Slowly",
    duration: 45,
    icon: "🦷",
    instruction: "Chew slowly, at least 20-30 times. Notice how flavors change. Put your utensil down between bites.",
  },
  {
    id: "savor",
    name: "Savor",
    duration: 30,
    icon: "✨",
    instruction: "After swallowing, pause. Notice the aftertaste. How does your body feel? Are you satisfied?",
  },
];

const HUNGER_SCALE = [
  { level: 1, label: "Starving", description: "Weak, dizzy, very uncomfortable" },
  { level: 2, label: "Very Hungry", description: "Irritable, low energy, stomach growling loudly" },
  { level: 3, label: "Hungry", description: "Ready to eat, stomach growling" },
  { level: 4, label: "Slightly Hungry", description: "Beginning to feel hungry" },
  { level: 5, label: "Neutral", description: "Neither hungry nor full" },
  { level: 6, label: "Satisfied", description: "Comfortable, pleasant fullness" },
  { level: 7, label: "Full", description: "Slightly past comfortable" },
  { level: 8, label: "Very Full", description: "Uncomfortable fullness" },
  { level: 9, label: "Stuffed", description: "Very uncomfortable" },
  { level: 10, label: "Sick", description: "Painfully full" },
];

const EATING_TIPS = [
  "Eat at a table, not in front of screens",
  "Use smaller plates to help with portions",
  "Put your fork down between bites",
  "Chew each bite 20-30 times",
  "Wait 20 minutes before second helpings",
  "Drink water before meals",
  "Notice when you're 80% full and stop",
];

export default function MindfulEating() {
  const [mode, setMode] = useState("home");
  const [currentStep, setCurrentStep] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hungerBefore, setHungerBefore] = useState(5);
  const [hungerAfter, setHungerAfter] = useState(5);
  const [mealsLogged, setMealsLogged] = useState(0);
  const [showTips, setShowTips] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("mindful_eating_data");
    if (saved) {
      const data = JSON.parse(saved);
      setMealsLogged(data.meals || 0);
    }
  }, []);

  useEffect(() => {
    let interval;
    if (isPlaying && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            if (currentStep < MINDFUL_EATING_STEPS.length - 1) {
              setCurrentStep((s) => s + 1);
              return MINDFUL_EATING_STEPS[currentStep + 1].duration;
            } else {
              setIsPlaying(false);
              setMode("after");
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timer, currentStep]);

  const startExercise = () => {
    setMode("before");
  };

  const beginMindfulEating = () => {
    setMode("eating");
    setCurrentStep(0);
    setTimer(MINDFUL_EATING_STEPS[0].duration);
    setIsPlaying(true);
  };

  const completeMeal = () => {
    const newCount = mealsLogged + 1;
    setMealsLogged(newCount);
    localStorage.setItem("mindful_eating_data", JSON.stringify({ meals: newCount }));
    setMode("complete");
  };

  const reset = () => {
    setMode("home");
    setCurrentStep(0);
    setTimer(0);
    setIsPlaying(false);
    setHungerBefore(5);
    setHungerAfter(5);
  };

  const step = MINDFUL_EATING_STEPS[currentStep];
  const progress = mode === "eating" 
    ? ((currentStep + (MINDFUL_EATING_STEPS[currentStep].duration - timer) / MINDFUL_EATING_STEPS[currentStep].duration) / MINDFUL_EATING_STEPS.length) * 100
    : 0;

  return (
    <div className="card-elevated p-6 relative overflow-hidden" data-testid="mindful-eating">
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-lime-400/10 to-green-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-lime-400 to-green-500 flex items-center justify-center shadow-lg">
              <Apple className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-display font-bold text-[var(--text)]" data-testid="text-eating-title">
                Mindful Eating
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">Conscious nourishment</p>
            </div>
          </div>
          <span className="text-sm text-[var(--text-muted)]">{mealsLogged} meals</span>
        </div>

        {mode === "home" && (
          <div className="animate-fade-in-up">
            <div className="p-4 rounded-xl bg-lime-50 dark:bg-lime-900/20 mb-6">
              <p className="text-lime-700 dark:text-lime-300 text-sm">
                <Utensils className="w-4 h-4 inline mr-2" />
                Mindful eating helps you enjoy food more, eat the right amount, and improve digestion.
              </p>
            </div>

            <button
              onClick={startExercise}
              className="w-full py-4 rounded-xl btn-gradient font-semibold shadow-lg flex items-center justify-center gap-2 mb-4"
              data-testid="button-start"
            >
              <Play className="w-5 h-5" />
              Start Mindful Meal
            </button>

            <button
              onClick={() => setShowTips(!showTips)}
              className="w-full py-3 rounded-xl bg-[var(--surface)] text-[var(--text)] font-medium hover:bg-[var(--surface-hover)] flex items-center justify-center gap-2"
              data-testid="button-tips"
            >
              💡 {showTips ? "Hide Tips" : "Show Eating Tips"}
            </button>

            {showTips && (
              <div className="mt-4 p-4 rounded-xl bg-[var(--surface)] animate-fade-in-up">
                <ul className="space-y-2">
                  {EATING_TIPS.map((tip, i) => (
                    <li key={i} className="text-sm text-[var(--text-secondary)] flex items-start gap-2">
                      <span className="text-lime-500">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {mode === "before" && (
          <div className="animate-fade-in-up">
            <h4 className="font-semibold text-[var(--text)] mb-4 text-center">Before You Eat</h4>
            <p className="text-[var(--text-secondary)] text-center mb-4">
              How hungry are you right now?
            </p>
            
            <div className="mb-6">
              <input
                type="range"
                min="1"
                max="10"
                value={hungerBefore}
                onChange={(e) => setHungerBefore(parseInt(e.target.value))}
                className="w-full accent-lime-500"
                data-testid="input-hunger-before"
                aria-label="Hunger level before eating"
              />
              <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1">
                <span>Starving</span>
                <span>Neutral</span>
                <span>Very Full</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-lime-50 dark:bg-lime-900/20 mb-6 text-center">
              <span className="text-3xl block mb-2">{HUNGER_SCALE[hungerBefore - 1]?.label === "Neutral" ? "😐" : hungerBefore <= 3 ? "🤤" : hungerBefore <= 6 ? "🙂" : "😣"}</span>
              <span className="font-medium text-lime-700 dark:text-lime-300">{HUNGER_SCALE[hungerBefore - 1]?.label}</span>
              <p className="text-sm text-lime-600 dark:text-lime-400">{HUNGER_SCALE[hungerBefore - 1]?.description}</p>
            </div>

            <button
              onClick={beginMindfulEating}
              className="w-full py-4 rounded-xl btn-gradient font-semibold shadow-lg"
              data-testid="button-begin"
            >
              Begin Mindful Eating
            </button>
          </div>
        )}

        {mode === "eating" && step && (
          <div className="animate-fade-in-up">
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-[var(--text-muted)] mb-2">
                <span>Step {currentStep + 1} of {MINDFUL_EATING_STEPS.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-[var(--surface)] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-lime-400 to-green-500 transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-lime-400 to-green-500 text-white text-center mb-4">
              <span className="text-5xl block mb-3">{step.icon}</span>
              <h4 className="text-2xl font-bold mb-2" data-testid="text-step-name">{step.name}</h4>
              <div className="text-4xl font-bold mb-3" data-testid="text-timer">{timer}s</div>
              <p className="text-white/90" data-testid="text-instruction">{step.instruction}</p>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-14 h-14 rounded-full bg-gradient-to-br from-lime-400 to-green-500 text-white shadow-lg flex items-center justify-center"
                data-testid="button-play-pause"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
              </button>
            </div>

            <div className="flex justify-center gap-1 mt-4">
              {MINDFUL_EATING_STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${i < currentStep ? "bg-emerald-500" : i === currentStep ? "bg-lime-500 scale-125" : "bg-[var(--surface)]"}`}
                />
              ))}
            </div>
          </div>
        )}

        {mode === "after" && (
          <div className="animate-fade-in-up">
            <h4 className="font-semibold text-[var(--text)] mb-4 text-center">After Your Meal</h4>
            <p className="text-[var(--text-secondary)] text-center mb-4">
              How full are you now?
            </p>
            
            <div className="mb-6">
              <input
                type="range"
                min="1"
                max="10"
                value={hungerAfter}
                onChange={(e) => setHungerAfter(parseInt(e.target.value))}
                className="w-full accent-lime-500"
                data-testid="input-hunger-after"
                aria-label="Fullness level after eating"
              />
            </div>

            <div className="p-4 rounded-xl bg-lime-50 dark:bg-lime-900/20 mb-6 text-center">
              <span className="text-3xl block mb-2">{hungerAfter === 6 ? "😊" : hungerAfter <= 5 ? "😕" : hungerAfter >= 8 ? "😣" : "🙂"}</span>
              <span className="font-medium text-lime-700 dark:text-lime-300">{HUNGER_SCALE[hungerAfter - 1]?.label}</span>
              {hungerAfter === 6 && (
                <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">
                  ✨ Perfect! Satisfied but not overly full.
                </p>
              )}
            </div>

            <button
              onClick={completeMeal}
              className="w-full py-4 rounded-xl btn-gradient font-semibold shadow-lg"
              data-testid="button-complete"
            >
              Complete Meal
            </button>
          </div>
        )}

        {mode === "complete" && (
          <div className="text-center animate-fade-in-up">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-lime-400 to-green-500 flex items-center justify-center shadow-xl">
              <Check className="w-12 h-12 text-white" />
            </div>
            <h4 className="text-2xl font-display font-bold text-[var(--text)] mb-2" data-testid="text-complete">
              Mindful Meal Complete!
            </h4>
            <p className="text-[var(--text-secondary)] mb-2">
              Hunger: {hungerBefore} → Fullness: {hungerAfter}
            </p>
            <p className="text-sm text-[var(--text-muted)] mb-6">
              You've practiced mindful eating {mealsLogged} times
            </p>
            <button
              onClick={reset}
              className="btn-gradient px-8 py-4 rounded-xl font-semibold shadow-lg flex items-center gap-2 mx-auto"
              data-testid="button-restart"
            >
              <RefreshCw className="w-5 h-5" />
              New Meal
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
