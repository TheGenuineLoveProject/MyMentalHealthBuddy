import { useState, useEffect, useCallback } from "react";
import { Heart, Eye, Ear, Hand, Wind, Sparkles, RefreshCw, Check, AlertCircle } from "lucide-react";

const GROUNDING_TECHNIQUES = {
  "5-4-3-2-1": {
    name: "5-4-3-2-1 Grounding",
    description: "Use your senses to anchor yourself in the present moment",
    icon: Sparkles,
    color: "from-purple-400 to-indigo-500",
    steps: [
      { count: 5, sense: "SEE", icon: Eye, prompt: "Name 5 things you can see around you", examples: ["a lamp", "window", "plant", "book", "clock"] },
      { count: 4, sense: "TOUCH", icon: Hand, prompt: "Name 4 things you can physically feel", examples: ["chair", "fabric", "floor", "your breath"] },
      { count: 3, sense: "HEAR", icon: Ear, prompt: "Name 3 things you can hear right now", examples: ["birds", "fan", "traffic", "silence"] },
      { count: 2, sense: "SMELL", icon: Wind, prompt: "Name 2 things you can smell", examples: ["coffee", "fresh air", "soap"] },
      { count: 1, sense: "TASTE", icon: Heart, prompt: "Name 1 thing you can taste", examples: ["water", "mint", "coffee"] },
    ],
  },
  "box-breathing": {
    name: "Box Breathing",
    description: "A calming technique used by Navy SEALs",
    icon: Wind,
    color: "from-cyan-400 to-blue-500",
    duration: { inhale: 4, hold1: 4, exhale: 4, hold2: 4 },
  },
  "body-scan": {
    name: "Quick Body Scan",
    description: "Release tension from head to toe",
    icon: Heart,
    color: "from-pink-400 to-rose-500",
    areas: [
      { name: "Forehead & Eyes", instruction: "Relax your forehead, unclench your jaw" },
      { name: "Shoulders & Neck", instruction: "Drop your shoulders away from your ears" },
      { name: "Chest & Heart", instruction: "Take a deep breath, feel your chest expand" },
      { name: "Stomach & Core", instruction: "Soften your belly, release any tension" },
      { name: "Hands & Arms", instruction: "Unclench your fists, let arms hang loose" },
      { name: "Legs & Feet", instruction: "Feel grounded, connected to the earth" },
    ],
  },
};

const AFFIRMATIONS = [
  "This feeling will pass. I am safe right now.",
  "I am stronger than my anxiety.",
  "I can handle this moment.",
  "My thoughts are not facts.",
  "I choose peace over worry.",
  "I am in control of my breathing.",
  "This is temporary. I will get through this.",
  "I am doing the best I can.",
];

export default function AnxietyRelief() {
  const [technique, setTechnique] = useState("5-4-3-2-1");
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState({});
  const [isActive, setIsActive] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [breathPhase, setBreathPhase] = useState("ready");
  const [breathTimer, setBreathTimer] = useState(0);
  const [affirmation, setAffirmation] = useState(AFFIRMATIONS[0]);
  const [anxietyLevel, setAnxietyLevel] = useState({ before: 5, after: null });

  const currentTechnique = GROUNDING_TECHNIQUES[technique];
  const TechniqueIcon = currentTechnique.icon;

  useEffect(() => {
    if (technique === "box-breathing" && isActive) {
      const duration = currentTechnique.duration;
      const phases = ["inhale", "hold1", "exhale", "hold2"];
      let phaseIndex = 0;
      let timer = duration[phases[0]];

      const interval = setInterval(() => {
        timer--;
        setBreathTimer(timer);

        if (timer <= 0) {
          phaseIndex = (phaseIndex + 1) % 4;
          if (phaseIndex === 0) {
            setCurrentStep(prev => prev + 1);
            if (currentStep >= 3) {
              setCompleted(true);
              setIsActive(false);
              clearInterval(interval);
              return;
            }
          }
          timer = duration[phases[phaseIndex]];
          setBreathPhase(phases[phaseIndex]);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [technique, isActive, currentStep]);

  const startExercise = () => {
    setIsActive(true);
    setCurrentStep(0);
    setResponses({});
    setCompleted(false);
    setBreathPhase("inhale");
    setBreathTimer(4);
    setAffirmation(AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)]);
  };

  const handleResponse = (response) => {
    const steps = currentTechnique.steps;
    const newResponses = { ...responses, [currentStep]: response };
    setResponses(newResponses);

    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setCompleted(true);
      setIsActive(false);
    }
  };

  const nextBodyArea = () => {
    const areas = currentTechnique.areas;
    if (currentStep < areas.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setCompleted(true);
      setIsActive(false);
    }
  };

  const reset = () => {
    setIsActive(false);
    setCurrentStep(0);
    setResponses({});
    setCompleted(false);
    setBreathPhase("ready");
    setAnxietyLevel({ before: 5, after: null });
  };

  const getBreathInstruction = () => {
    switch (breathPhase) {
      case "inhale": return "Breathe In";
      case "hold1": return "Hold";
      case "exhale": return "Breathe Out";
      case "hold2": return "Hold";
      default: return "Ready";
    }
  };

  return (
    <div className="card-elevated p-6 relative overflow-hidden" data-testid="anxiety-relief">
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-purple-400/10 to-pink-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${currentTechnique.color} flex items-center justify-center shadow-lg`}>
            <TechniqueIcon className="w-6 h-6 text-white" aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-display font-bold text-[var(--text)]" data-testid="text-anxiety-title">
              Anxiety Relief Toolkit
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">Grounding exercises for calm</p>
          </div>
        </div>

        {!isActive && !completed && (
          <>
            <div className="grid grid-cols-3 gap-2 mb-6">
              {Object.entries(GROUNDING_TECHNIQUES).map(([key, tech]) => {
                const Icon = tech.icon;
                return (
                  <button
                    key={key}
                    onClick={() => setTechnique(key)}
                    className={`p-3 rounded-xl text-center transition-all ${
                      technique === key
                        ? `bg-gradient-to-br ${tech.color} text-white shadow-lg`
                        : "bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
                    }`}
                    data-testid={`button-technique-${key}`}
                    aria-pressed={technique === key}
                  >
                    <Icon className="w-5 h-5 mx-auto mb-1" aria-hidden="true" />
                    <span className="text-xs font-medium">{tech.name.split(" ")[0]}</span>
                  </button>
                );
              })}
            </div>

            <div className="p-4 rounded-xl bg-[var(--surface)] mb-6">
              <h4 className="font-semibold text-[var(--text)] mb-1">{currentTechnique.name}</h4>
              <p className="text-sm text-[var(--text-secondary)]">{currentTechnique.description}</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                How anxious do you feel right now? (1-10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={anxietyLevel.before}
                onChange={(e) => setAnxietyLevel(prev => ({ ...prev, before: Number(e.target.value) }))}
                className="w-full h-3 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #10b981 0%, #f59e0b 50%, #ef4444 100%)`
                }}
                data-testid="slider-anxiety-before"
                aria-label="Anxiety level before"
              />
              <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1">
                <span>Calm</span>
                <span className="font-bold text-[var(--text)]">{anxietyLevel.before}</span>
                <span>Very Anxious</span>
              </div>
            </div>

            <button
              onClick={startExercise}
              className="w-full btn-gradient py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              data-testid="button-start-exercise"
            >
              Start Exercise
            </button>
          </>
        )}

        {isActive && technique === "5-4-3-2-1" && (
          <div className="animate-fade-in-up">
            {(() => {
              const step = currentTechnique.steps[currentStep];
              const StepIcon = step.icon;
              return (
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center shadow-xl">
                    <StepIcon className="w-10 h-10 text-white" aria-hidden="true" />
                  </div>
                  <div className="text-6xl font-bold text-[var(--primary)] mb-2" data-testid="text-step-count">
                    {step.count}
                  </div>
                  <div className="text-xl font-display font-bold text-[var(--text)] mb-2">
                    {step.sense}
                  </div>
                  <p className="text-[var(--text-secondary)] mb-6" data-testid="text-step-prompt">
                    {step.prompt}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center mb-6">
                    {step.examples.map((example, i) => (
                      <span key={i} className="px-3 py-1 rounded-full bg-[var(--surface)] text-sm text-[var(--text-muted)]">
                        {example}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => handleResponse(true)}
                    className="btn-gradient px-8 py-4 rounded-xl font-semibold shadow-lg"
                    data-testid="button-next-sense"
                  >
                    I've named {step.count} →
                  </button>
                </div>
              );
            })()}
          </div>
        )}

        {isActive && technique === "box-breathing" && (
          <div className="text-center animate-fade-in-up">
            <div 
              className={`w-48 h-48 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${currentTechnique.color} flex items-center justify-center shadow-xl transition-transform duration-1000 ${
                breathPhase === "inhale" ? "scale-110" : breathPhase === "exhale" ? "scale-90" : "scale-100"
              }`}
            >
              <div className="text-center text-white">
                <div className="text-5xl font-bold" data-testid="text-breath-timer">{breathTimer}</div>
                <div className="text-lg font-medium" data-testid="text-breath-phase">{getBreathInstruction()}</div>
              </div>
            </div>
            <p className="text-[var(--text-secondary)] mb-4">Cycle {currentStep + 1} of 4</p>
            <div className="flex justify-center gap-2">
              {[0, 1, 2, 3].map(i => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${i <= currentStep ? "bg-[var(--primary)]" : "bg-[var(--surface)]"}`}
                />
              ))}
            </div>
          </div>
        )}

        {isActive && technique === "body-scan" && (
          <div className="text-center animate-fade-in-up">
            {(() => {
              const area = currentTechnique.areas[currentStep];
              return (
                <>
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow-xl">
                    <Heart className="w-10 h-10 text-white" aria-hidden="true" />
                  </div>
                  <div className="text-2xl font-display font-bold text-[var(--text)] mb-2" data-testid="text-body-area">
                    {area.name}
                  </div>
                  <p className="text-[var(--text-secondary)] mb-6" data-testid="text-body-instruction">
                    {area.instruction}
                  </p>
                  <p className="text-sm text-[var(--text-muted)] mb-6">
                    Take a few deep breaths and focus on this area...
                  </p>
                  <button
                    onClick={nextBodyArea}
                    className="btn-gradient px-8 py-4 rounded-xl font-semibold shadow-lg"
                    data-testid="button-next-area"
                  >
                    {currentStep < currentTechnique.areas.length - 1 ? "Next Area →" : "Complete"}
                  </button>
                  <div className="flex justify-center gap-2 mt-4">
                    {currentTechnique.areas.map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${i <= currentStep ? "bg-[var(--primary)]" : "bg-[var(--surface)]"}`}
                      />
                    ))}
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {completed && (
          <div className="text-center animate-fade-in-up">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-xl">
              <Check className="w-12 h-12 text-white" aria-hidden="true" />
            </div>
            <h4 className="text-2xl font-display font-bold text-[var(--text)] mb-2" data-testid="text-complete">
              Well Done!
            </h4>
            <p className="text-[var(--text-secondary)] mb-6">
              You've completed the {currentTechnique.name} exercise.
            </p>
            
            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 mb-6">
              <p className="text-[var(--text)] italic">"{affirmation}"</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                How do you feel now? (1-10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={anxietyLevel.after || anxietyLevel.before}
                onChange={(e) => setAnxietyLevel(prev => ({ ...prev, after: Number(e.target.value) }))}
                className="w-full h-3 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #10b981 0%, #f59e0b 50%, #ef4444 100%)`
                }}
                data-testid="slider-anxiety-after"
                aria-label="Anxiety level after"
              />
              {anxietyLevel.after && anxietyLevel.after < anxietyLevel.before && (
                <p className="text-sm text-emerald-500 mt-2">
                  Great! Your anxiety decreased by {anxietyLevel.before - anxietyLevel.after} points
                </p>
              )}
            </div>

            <button
              onClick={reset}
              className="btn-gradient px-8 py-4 rounded-xl font-semibold shadow-lg flex items-center gap-2 mx-auto"
              data-testid="button-restart"
            >
              <RefreshCw className="w-5 h-5" aria-hidden="true" />
              Try Another Exercise
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
