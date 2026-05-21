import { useState, useEffect, useRef } from "react";
import { Wind, ThermometerSun, Check, RefreshCw, AlertTriangle, Heart } from 'lucide-react';

const ANGER_LEVELS = [
  { level: 1, name: "Calm", color: "bg-green-400", emoji: "😌" },
  { level: 2, name: "Annoyed", color: "bg-lime-400", emoji: "😕" },
  { level: 3, name: "Irritated", color: "bg-yellow-400", emoji: "😤" },
  { level: 4, name: "Frustrated", color: "bg-amber-400", emoji: "😠" },
  { level: 5, name: "Angry", color: "bg-orange-400", emoji: "😡" },
  { level: 6, name: "Very Angry", color: "bg-red-400", emoji: "🤬" },
  { level: 7, name: "Furious", color: "bg-red-500", emoji: "💢" },
  { level: 8, name: "Rage", color: "bg-red-600", emoji: "🔥" },
];

const COOLING_TECHNIQUES = [
  {
    id: "breathing",
    name: "Deep Breathing",
    icon: "🌬️",
    duration: 60,
    instruction: "Breathe in for 4 counts, hold for 7, exhale for 8. Repeat 4 times.",
    steps: ["Inhale slowly through your nose (4 seconds)", "Hold your breath (7 seconds)", "Exhale slowly through your mouth (8 seconds)", "Repeat 3 more times"],
  },
  {
    id: "counting",
    name: "Count to 10",
    icon: "🔢",
    duration: 30,
    instruction: "Count slowly from 1 to 10, then back down. Focus only on the numbers.",
    steps: ["1... 2... 3... 4... 5...", "6... 7... 8... 9... 10...", "10... 9... 8... 7... 6...", "5... 4... 3... 2... 1..."],
  },
  {
    id: "grounding",
    name: "Grounding",
    icon: "🌍",
    duration: 60,
    instruction: "Press your feet firmly into the ground. Feel the solid earth beneath you.",
    steps: ["Press your feet firmly down", "Notice the ground supporting you", "Take slow, deep breaths", "Feel yourself becoming more stable"],
  },
  {
    id: "cold-water",
    name: "Cold Water",
    icon: "💧",
    duration: 30,
    instruction: "Splash cold water on your face or hold something cold. This activates your calming response.",
    steps: ["Get cold water or ice", "Splash face or hold cold object", "Feel the cooling sensation", "Let the cold calm your body"],
  },
  {
    id: "walk-away",
    name: "Take Space",
    icon: "🚶",
    duration: 120,
    instruction: "Remove yourself from the situation. Walk away and return when calmer.",
    steps: ["Say 'I need a moment'", "Leave the situation calmly", "Walk or find a quiet space", "Return when you feel calmer"],
  },
  {
    id: "muscle-release",
    name: "Muscle Release",
    icon: "💪",
    duration: 45,
    instruction: "Tense all your muscles tightly for 5 seconds, then release completely.",
    steps: ["Tense all muscles (5 seconds)", "Hold the tension", "Release completely", "Feel the relaxation spread"],
  },
];

const ANGER_TRUTHS = [
  "Anger is a normal human emotion",
  "You can feel angry without acting on it",
  "Taking space isn't weakness, it's wisdom",
  "Your anger is often protecting something you care about",
  "Cooling down helps you respond rather than react",
];

export default function AngerManagement() {
  const [angerLevel, setAngerLevel] = useState(1);
  const [selectedTechnique, setSelectedTechnique] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("anger_management_data");
    if (saved) {
      const data = JSON.parse(saved);
      setSessionsCompleted(data.sessions || 0);
    }
  }, []);

  useEffect(() => {
    if (isActive && timer > 0) {
      intervalRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            completeTechnique();
            return 0;
          }
          
          const technique = selectedTechnique;
          const stepDuration = technique.duration / technique.steps.length;
          const elapsed = technique.duration - prev + 1;
          const newStep = Math.min(Math.floor(elapsed / stepDuration), technique.steps.length - 1);
          if (newStep !== currentStep) {
            setCurrentStep(newStep);
          }
          
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(intervalRef.current);
    }
  }, [isActive, timer, currentStep, selectedTechnique]);

  const startTechnique = (technique) => {
    setSelectedTechnique(technique);
    setTimer(technique.duration);
    setIsActive(true);
    setCurrentStep(0);
    setCompleted(false);
  };

  const completeTechnique = () => {
    clearInterval(intervalRef.current);
    setIsActive(false);
    setCompleted(true);
    
    const newSessions = sessionsCompleted + 1;
    setSessionsCompleted(newSessions);
    try { localStorage.setItem("anger_management_data", JSON.stringify({ sessions: newSessions })); } catch (err) { console.warn("[storage-safe-write]", err); }
  };

  const reset = () => {
    setSelectedTechnique(null);
    setIsActive(false);
    setCompleted(false);
    setTimer(0);
    setCurrentStep(0);
  };

  const levelData = ANGER_LEVELS[angerLevel - 1];
  const suggestedTechniques = angerLevel <= 3 
    ? COOLING_TECHNIQUES.slice(0, 3) 
    : angerLevel <= 5 
    ? COOLING_TECHNIQUES.slice(1, 5)
    : COOLING_TECHNIQUES.slice(2);

  return (
    <div className="card-elevated p-6 relative overflow-hidden" data-testid="anger-management">
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-orange-400/10 to-red-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg">
              <ThermometerSun className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-display font-bold text-[var(--text)]" data-testid="text-anger-title">
                Anger Management
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">Cool down techniques</p>
            </div>
          </div>
          <span className="text-sm text-[var(--text-muted)]">{sessionsCompleted} sessions</span>
        </div>

        {!selectedTechnique && !completed && (
          <div className="animate-fade-in-up">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-[var(--text-secondary)]">How angry are you feeling?</span>
                <span className="text-2xl">{levelData.emoji}</span>
              </div>
              
              <input
                type="range"
                min="1"
                max="8"
                value={angerLevel}
                onChange={(e) => setAngerLevel(parseInt(e.target.value))}
                className="w-full accent-orange-500"
                data-testid="input-anger-level"
                aria-label="Anger level"
              />
              
              <div className="flex justify-between mt-1">
                {ANGER_LEVELS.map((level) => (
                  <div
                    key={level.level}
                    className={`w-3 h-3 rounded-full ${level.level === angerLevel ? level.color + " scale-125" : "bg-[var(--surface)]"}`}
                  />
                ))}
              </div>
              
              <div className="text-center mt-2">
                <span className={`font-medium ${angerLevel >= 6 ? "text-red-500" : angerLevel >= 4 ? "text-orange-500" : "text-green-500"}`}>
                  {levelData.name}
                </span>
              </div>
            </div>

            {angerLevel >= 6 && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 mb-6">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-700 dark:text-red-300">High anger detected</p>
                    <p className="text-xs text-red-600 dark:text-red-400">
                      It's important to cool down before making decisions or speaking. Try a technique below.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <h4 className="text-sm font-medium text-[var(--text-secondary)] mb-3">
              Recommended techniques for you:
            </h4>
            <div className="space-y-2 mb-4">
              {suggestedTechniques.map((technique) => (
                <button
                  key={technique.id}
                  onClick={() => startTechnique(technique)}
                  className="w-full p-4 rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-left flex items-center gap-3 transition-colors"
                  data-testid={`button-technique-${technique.id}`}
                >
                  <span className="text-2xl">{technique.icon}</span>
                  <div className="flex-1">
                    <span className="font-medium text-[var(--text)]">{technique.name}</span>
                    <span className="text-sm text-[var(--text-muted)] block">{technique.duration}s</span>
                  </div>
                  <Wind className="w-5 h-5 text-[var(--primary)]" />
                </button>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20">
              <p className="text-sm text-amber-700 dark:text-amber-300 italic">
                <Heart className="w-4 h-4 inline mr-2" />
                {ANGER_TRUTHS[Math.floor(Math.random() * ANGER_TRUTHS.length)]}
              </p>
            </div>
          </div>
        )}

        {selectedTechnique && isActive && (
          <div className="animate-fade-in-up">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 text-white text-center mb-4">
              <span className="text-5xl block mb-3">{selectedTechnique.icon}</span>
              <h4 className="text-2xl font-bold mb-2">{selectedTechnique.name}</h4>
              <div className="text-5xl font-bold mb-3" data-testid="text-timer">{timer}s</div>
              <p className="text-white/90" data-testid="text-instruction">{selectedTechnique.instruction}</p>
            </div>

            <div className="space-y-2 mb-4">
              {selectedTechnique.steps.map((step, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl ${
                    i === currentStep
                      ? "bg-orange-100 dark:bg-orange-900/30 border-2 border-orange-400"
                      : i < currentStep
                      ? "bg-emerald-50 dark:bg-emerald-900/20"
                      : "bg-[var(--surface)]"
                  } flex items-center gap-3`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    i === currentStep
                      ? "bg-orange-400 text-white"
                      : i < currentStep
                      ? "bg-emerald-400 text-white"
                      : "bg-[var(--surface-hover)] text-[var(--text-muted)]"
                  }`}>
                    {i < currentStep ? <Check className="w-3 h-3" /> : i + 1}
                  </span>
                  <span className={`text-sm ${i === currentStep ? "text-orange-700 dark:text-orange-300 font-medium" : "text-[var(--text-muted)]"}`}>
                    {step}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={completeTechnique}
              className="w-full py-3 rounded-xl bg-emerald-500 text-white font-semibold"
              data-testid="button-complete"
            >
              I Feel Calmer
            </button>
          </div>
        )}

        {completed && (
          <div className="text-center animate-fade-in-up">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-xl">
              <Check className="w-12 h-12 text-white" />
            </div>
            <h4 className="text-2xl font-display font-bold text-[var(--text)] mb-2" data-testid="text-complete">
              Well Done!
            </h4>
            <p className="text-[var(--text-secondary)] mb-2">
              You successfully used {selectedTechnique.name}
            </p>
            <p className="text-sm text-[var(--text-muted)] mb-6">
              Taking time to cool down is a sign of emotional intelligence.
            </p>
            <div className="flex gap-3">
              <button
                onClick={reset}
                className="flex-1 py-3 rounded-xl bg-[var(--surface)] text-[var(--text)] font-medium hover:bg-[var(--surface-hover)]"
                data-testid="button-back"
              >
                Back
              </button>
              <button
                onClick={() => startTechnique(selectedTechnique)}
                className="flex-1 py-3 rounded-xl btn-gradient font-semibold flex items-center justify-center gap-2"
                data-testid="button-again"
              >
                <RefreshCw className="w-4 h-4" />
                Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
