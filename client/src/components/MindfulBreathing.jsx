import { useState, useEffect, useRef, useCallback } from "react";
import { 
  Wind, Play, Pause, RotateCcw, Settings, Volume2, VolumeX,
  ChevronDown, Clock, Heart, Sparkles, Check
} from "lucide-react";
import { useGamification } from "../context/GamificationContext.jsx";

const BREATHING_PATTERNS = [
  {
    id: "calm",
    name: "Calming Breath",
    description: "4-7-8 pattern for deep relaxation and stress relief",
    inhale: 4,
    hold: 7,
    exhale: 8,
    color: "from-blue-400 to-cyan-500",
    benefits: ["Reduces anxiety", "Promotes sleep", "Lowers heart rate"]
  },
  {
    id: "box",
    name: "Box Breathing",
    description: "4-4-4-4 pattern used by Navy SEALs for focus",
    inhale: 4,
    hold: 4,
    exhale: 4,
    holdAfter: 4,
    color: "from-violet-400 to-purple-500",
    benefits: ["Improves focus", "Reduces stress", "Enhances clarity"]
  },
  {
    id: "energize",
    name: "Energizing Breath",
    description: "2-0-2 pattern for a quick energy boost",
    inhale: 2,
    hold: 0,
    exhale: 2,
    color: "from-orange-400 to-red-500",
    benefits: ["Boosts energy", "Increases alertness", "Wakes you up"]
  },
  {
    id: "coherent",
    name: "Coherent Breathing",
    description: "5-5 pattern for heart-brain coherence",
    inhale: 5,
    hold: 0,
    exhale: 5,
    color: "from-emerald-400 to-teal-500",
    benefits: ["Heart coherence", "Emotional balance", "Reduces blood pressure"]
  },
  {
    id: "relax",
    name: "Deep Relaxation",
    description: "4-2-6 pattern for deep muscle relaxation",
    inhale: 4,
    hold: 2,
    exhale: 6,
    color: "from-indigo-400 to-blue-500",
    benefits: ["Muscle relaxation", "Tension release", "Deep calm"]
  }
];

export default function MindfulBreathing() {
  const [selectedPattern, setSelectedPattern] = useState(BREATHING_PATTERNS[0]);
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState("ready");
  const [countdown, setCountdown] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [targetCycles, setTargetCycles] = useState(5);
  const [showPatterns, setShowPatterns] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const { addXP } = useGamification();
  
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  const getPhaseConfig = useCallback(() => {
    const pattern = selectedPattern;
    return [
      { name: "inhale", duration: pattern.inhale, label: "Breathe In", instruction: "Fill your lungs slowly" },
      { name: "hold", duration: pattern.hold, label: "Hold", instruction: "Keep your breath steady" },
      { name: "exhale", duration: pattern.exhale, label: "Breathe Out", instruction: "Release slowly and completely" },
      ...(pattern.holdAfter ? [{ name: "holdAfter", duration: pattern.holdAfter, label: "Hold Empty", instruction: "Rest before inhaling" }] : [])
    ].filter(p => p.duration > 0);
  }, [selectedPattern]);

  const startBreathing = () => {
    setIsActive(true);
    setPhase("inhale");
    setCycles(0);
    setTotalTime(0);
    startTimeRef.current = Date.now();
    const phases = getPhaseConfig();
    setCountdown(phases[0].duration);
  };

  const pauseBreathing = () => {
    setIsActive(false);
  };

  const resetBreathing = () => {
    setIsActive(false);
    setPhase("ready");
    setCountdown(0);
    setCycles(0);
    setTotalTime(0);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    if (!isActive) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const phases = getPhaseConfig();
    let currentPhaseIndex = phases.findIndex(p => p.name === phase);
    if (currentPhaseIndex === -1) currentPhaseIndex = 0;

    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          const nextIndex = (currentPhaseIndex + 1) % phases.length;
          if (nextIndex === 0) {
            setCycles(c => {
              const newCycles = c + 1;
              if (newCycles >= targetCycles) {
                setIsActive(false);
                setPhase("complete");
                addXP(25, "Completed breathing session");
                return newCycles;
              }
              return newCycles;
            });
          }
          setPhase(phases[nextIndex].name);
          currentPhaseIndex = nextIndex;
          return phases[nextIndex].duration;
        }
        return prev - 1;
      });

      setTotalTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, phase, targetCycles, getPhaseConfig, addXP]);

  const getCurrentPhaseConfig = () => {
    const phases = getPhaseConfig();
    return phases.find(p => p.name === phase) || phases[0];
  };

  const getCircleScale = () => {
    if (!isActive) return 1;
    if (phase === "inhale") return 1.3;
    if (phase === "exhale") return 0.8;
    return 1;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div 
      className="card-elevated p-6"
      role="region"
      aria-label="Mindful Breathing Exercise"
      data-testid="mindful-breathing-container"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl text-white">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--text)]">Mindful Breathing</h2>
            <p className="text-sm text-[var(--text-secondary)]">Guided breathing for calm and focus</p>
          </div>
        </div>
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-2 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] transition-colors"
          aria-label={soundEnabled ? "Mute sounds" : "Enable sounds"}
          data-testid="button-toggle-sound"
        >
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
      </div>

      <div className="relative mb-6">
        <button
          onClick={() => setShowPatterns(!showPatterns)}
          className="w-full p-4 rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-hover)] transition-colors flex items-center justify-between"
          data-testid="button-select-pattern"
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-gradient-to-br ${selectedPattern.color} text-white`}>
              <Wind className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="font-medium text-[var(--text)]">{selectedPattern.name}</p>
              <p className="text-xs text-[var(--text-secondary)]">{selectedPattern.description}</p>
            </div>
          </div>
          <ChevronDown className={`w-5 h-5 text-[var(--text-secondary)] transition-transform ${showPatterns ? "rotate-180" : ""}`} />
        </button>

        {showPatterns && (
          <div className="absolute top-full left-0 right-0 mt-2 p-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-xl z-10 space-y-1">
            {BREATHING_PATTERNS.map(pattern => (
              <button
                key={pattern.id}
                onClick={() => {
                  setSelectedPattern(pattern);
                  setShowPatterns(false);
                  resetBreathing();
                }}
                className={`w-full p-3 rounded-lg flex items-center gap-3 transition-colors ${
                  selectedPattern.id === pattern.id
                    ? "bg-[var(--primary)]/10"
                    : "hover:bg-[var(--surface-hover)]"
                }`}
                data-testid={`pattern-${pattern.id}`}
              >
                <div className={`p-2 rounded-lg bg-gradient-to-br ${pattern.color} text-white`}>
                  <Wind className="w-4 h-4" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-[var(--text)]">{pattern.name}</p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {pattern.inhale}-{pattern.hold}-{pattern.exhale}
                    {pattern.holdAfter ? `-${pattern.holdAfter}` : ""} seconds
                  </p>
                </div>
                {selectedPattern.id === pattern.id && (
                  <Check className="w-5 h-5 text-[var(--primary)]" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-center mb-6">
        <div className="relative w-64 h-64">
          <div 
            className={`absolute inset-0 rounded-full bg-gradient-to-br ${selectedPattern.color} opacity-20 transition-transform duration-1000`}
            style={{ transform: `scale(${getCircleScale()})` }}
          />
          <div 
            className={`absolute inset-4 rounded-full bg-gradient-to-br ${selectedPattern.color} opacity-40 transition-transform duration-1000`}
            style={{ transform: `scale(${getCircleScale()})` }}
          />
          <div 
            className={`absolute inset-8 rounded-full bg-gradient-to-br ${selectedPattern.color} flex items-center justify-center transition-transform duration-1000`}
            style={{ transform: `scale(${getCircleScale()})` }}
          >
            <div className="text-center text-white">
              {phase === "ready" && (
                <>
                  <Wind className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-lg font-medium">Ready</p>
                </>
              )}
              {phase === "complete" && (
                <>
                  <Sparkles className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-lg font-medium">Complete!</p>
                </>
              )}
              {isActive && phase !== "complete" && (
                <>
                  <p className="text-4xl font-bold">{countdown}</p>
                  <p className="text-lg font-medium">{getCurrentPhaseConfig().label}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {isActive && phase !== "complete" && (
        <p className="text-center text-[var(--text-secondary)] mb-6">
          {getCurrentPhaseConfig().instruction}
        </p>
      )}

      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--surface)]">
          <Clock className="w-4 h-4 text-[var(--text-secondary)]" />
          <span className="text-[var(--text)] font-medium">{formatTime(totalTime)}</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--surface)]">
          <Heart className="w-4 h-4 text-rose-500" />
          <span className="text-[var(--text)] font-medium">{cycles} / {targetCycles} cycles</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 mb-6">
        <label className="text-sm text-[var(--text-secondary)]">Target Cycles:</label>
        <div className="flex items-center gap-2">
          {[3, 5, 10, 15].map(num => (
            <button
              key={num}
              onClick={() => setTargetCycles(num)}
              disabled={isActive}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                targetCycles === num
                  ? "bg-[var(--primary)] text-white"
                  : "bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
              } disabled:opacity-50`}
              data-testid={`button-cycles-${num}`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        {!isActive && phase !== "complete" && (
          <button
            onClick={startBreathing}
            className={`px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r ${selectedPattern.color} hover:opacity-90 transition-opacity flex items-center gap-2`}
            data-testid="button-start-breathing"
          >
            <Play className="w-5 h-5" />
            Start Breathing
          </button>
        )}
        {isActive && (
          <button
            onClick={pauseBreathing}
            className="px-8 py-3 rounded-xl font-semibold text-white bg-amber-500 hover:opacity-90 transition-opacity flex items-center gap-2"
            data-testid="button-pause-breathing"
          >
            <Pause className="w-5 h-5" />
            Pause
          </button>
        )}
        {(isActive || phase === "complete") && (
          <button
            onClick={resetBreathing}
            className="px-6 py-3 rounded-xl font-semibold text-[var(--text)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] transition-colors flex items-center gap-2"
            data-testid="button-reset-breathing"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </button>
        )}
      </div>

      <div className="mt-6 p-4 rounded-xl bg-[var(--surface)]">
        <h3 className="font-medium text-[var(--text)] mb-2">Benefits of {selectedPattern.name}</h3>
        <div className="flex flex-wrap gap-2">
          {selectedPattern.benefits.map((benefit, index) => (
            <span 
              key={index}
              className="px-3 py-1 text-sm rounded-full bg-[var(--bg)] text-[var(--text-secondary)]"
            >
              {benefit}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
