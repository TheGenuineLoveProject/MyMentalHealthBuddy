import { useState, useEffect, useCallback } from "react";
import { Play, Pause, RotateCcw, Wind, Sparkles, Heart } from "lucide-react";

const BREATHING_PATTERNS = {
  calm: {
    name: "Calming Breath",
    description: "4-7-8 technique for deep relaxation",
    inhale: 4,
    hold: 7,
    exhale: 8,
    color: "from-teal-400 to-cyan-500",
    icon: Wind,
  },
  focus: {
    name: "Focus Breath",
    description: "Box breathing for mental clarity",
    inhale: 4,
    hold: 4,
    exhale: 4,
    holdAfter: 4,
    color: "from-purple-400 to-indigo-500",
    icon: Sparkles,
  },
  energy: {
    name: "Energizing Breath",
    description: "Quick pattern to boost energy",
    inhale: 3,
    hold: 0,
    exhale: 3,
    color: "from-orange-400 to-amber-500",
    icon: Heart,
  },
};

export default function BreathingExercise({ onComplete }) {
  const [selectedPattern, setSelectedPattern] = useState("calm");
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState("ready");
  const [timeLeft, setTimeLeft] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [totalCycles, setTotalCycles] = useState(3);
  const [scale, setScale] = useState(1);

  const pattern = BREATHING_PATTERNS[selectedPattern];

  const getPhaseText = () => {
    switch (phase) {
      case "inhale":
        return "Breathe In";
      case "hold":
        return "Hold";
      case "exhale":
        return "Breathe Out";
      case "holdAfter":
        return "Hold";
      case "complete":
        return "Complete!";
      default:
        return "Ready";
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case "inhale":
        return "text-teal-500";
      case "hold":
        return "text-purple-500";
      case "exhale":
        return "text-blue-500";
      case "holdAfter":
        return "text-indigo-500";
      case "complete":
        return "text-emerald-500";
      default:
        return "text-[var(--text)]";
    }
  };

  const startExercise = useCallback(() => {
    setIsActive(true);
    setPhase("inhale");
    setTimeLeft(pattern.inhale);
    setCycles(0);
    setScale(1);
  }, [pattern]);

  const resetExercise = () => {
    setIsActive(false);
    setPhase("ready");
    setTimeLeft(0);
    setCycles(0);
    setScale(1);
  };

  const togglePause = () => {
    setIsActive(!isActive);
  };

  useEffect(() => {
    if (!isActive || phase === "ready" || phase === "complete") return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (phase === "inhale") {
            if (pattern.hold > 0) {
              setPhase("hold");
              setScale(1.3);
              return pattern.hold;
            } else {
              setPhase("exhale");
              return pattern.exhale;
            }
          } else if (phase === "hold") {
            setPhase("exhale");
            return pattern.exhale;
          } else if (phase === "exhale") {
            if (pattern.holdAfter && pattern.holdAfter > 0) {
              setPhase("holdAfter");
              setScale(1);
              return pattern.holdAfter;
            } else {
              const newCycles = cycles + 1;
              setCycles(newCycles);
              if (newCycles >= totalCycles) {
                setPhase("complete");
                setIsActive(false);
                if (onComplete) onComplete(newCycles);
                return 0;
              }
              setPhase("inhale");
              return pattern.inhale;
            }
          } else if (phase === "holdAfter") {
            const newCycles = cycles + 1;
            setCycles(newCycles);
            if (newCycles >= totalCycles) {
              setPhase("complete");
              setIsActive(false);
              if (onComplete) onComplete(newCycles);
              return 0;
            }
            setPhase("inhale");
            return pattern.inhale;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, phase, pattern, cycles, totalCycles, onComplete]);

  useEffect(() => {
    if (phase === "inhale") {
      setScale(1.3);
    } else if (phase === "exhale") {
      setScale(1);
    }
  }, [phase]);

  const PatternIcon = pattern.icon;

  return (
    <div className="card-elevated p-8 text-center" data-testid="breathing-exercise" role="application" aria-label="Breathing exercise tool">
      <div className="flex items-center justify-center gap-2 mb-6">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${pattern.color} flex items-center justify-center shadow-lg`}>
          <PatternIcon className="w-5 h-5 text-white" aria-hidden="true" />
        </div>
        <h3 className="text-xl font-display font-bold text-[var(--text)]" data-testid="text-breathing-title">
          Breathing Exercise
        </h3>
      </div>

      <div className="flex justify-center gap-2 mb-6" role="tablist" aria-label="Breathing patterns">
        {Object.entries(BREATHING_PATTERNS).map(([key, p]) => (
          <button
            key={key}
            onClick={() => {
              if (!isActive) setSelectedPattern(key);
            }}
            disabled={isActive}
            role="tab"
            aria-selected={selectedPattern === key}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              selectedPattern === key
                ? `bg-gradient-to-r ${p.color} text-white shadow-md`
                : "bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
            } ${isActive ? "opacity-50 cursor-not-allowed" : ""}`}
            data-testid={`button-pattern-${key}`}
          >
            {p.name}
          </button>
        ))}
      </div>

      <p className="text-[var(--text-secondary)] text-sm mb-8" data-testid="text-pattern-description">
        {pattern.description}
      </p>

      <div className="relative w-64 h-64 mx-auto mb-8" data-testid="breathing-animation">
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-br ${pattern.color} opacity-20 transition-transform duration-1000 ease-in-out`}
          style={{ transform: `scale(${scale})` }}
        />
        <div
          className={`absolute inset-4 rounded-full bg-gradient-to-br ${pattern.color} opacity-30 transition-transform duration-1000 ease-in-out`}
          style={{ transform: `scale(${scale})` }}
        />
        <div
          className={`absolute inset-8 rounded-full bg-gradient-to-br ${pattern.color} opacity-50 transition-transform duration-1000 ease-in-out flex items-center justify-center`}
          style={{ transform: `scale(${scale})` }}
        >
          <div className="text-center">
            <p className={`text-4xl font-bold ${getPhaseColor()} mb-2`} data-testid="text-time-left" aria-live="polite">
              {phase === "ready" || phase === "complete" ? "" : timeLeft}
            </p>
            <p className={`text-lg font-semibold ${getPhaseColor()}`} data-testid="text-phase" aria-live="polite">
              {getPhaseText()}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 mb-6">
        <span className="text-[var(--text-secondary)] text-sm">Cycles:</span>
        <span className="font-bold text-[var(--text)]" data-testid="text-current-cycle">{cycles}</span>
        <span className="text-[var(--text-muted)]">/</span>
        <select
          value={totalCycles}
          onChange={(e) => setTotalCycles(Number(e.target.value))}
          disabled={isActive}
          className="bg-[var(--surface)] border border-[var(--border)] rounded-lg px-2 py-1 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          data-testid="select-cycles"
          aria-label="Number of breathing cycles"
        >
          {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-center gap-4">
        {phase === "ready" && (
          <button
            onClick={startExercise}
            className="btn-gradient px-8 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
            data-testid="button-start-breathing"
          >
            <Play className="w-5 h-5" aria-hidden="true" />
            Start
          </button>
        )}

        {(phase !== "ready" && phase !== "complete") && (
          <>
            <button
              onClick={togglePause}
              className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all ${
                isActive
                  ? "bg-amber-500 text-white hover:bg-amber-600"
                  : "bg-emerald-500 text-white hover:bg-emerald-600"
              }`}
              data-testid="button-pause-breathing"
            >
              {isActive ? (
                <>
                  <Pause className="w-5 h-5" aria-hidden="true" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" aria-hidden="true" />
                  Resume
                </>
              )}
            </button>
            <button
              onClick={resetExercise}
              className="px-6 py-3 rounded-xl font-semibold flex items-center gap-2 bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--surface-hover)] transition-all"
              data-testid="button-reset-breathing"
            >
              <RotateCcw className="w-5 h-5" aria-hidden="true" />
              Reset
            </button>
          </>
        )}

        {phase === "complete" && (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-emerald-500">
              <Sparkles className="w-6 h-6" aria-hidden="true" />
              <span className="text-lg font-semibold">Great job!</span>
            </div>
            <button
              onClick={resetExercise}
              className="btn-gradient px-8 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
              data-testid="button-restart-breathing"
            >
              <RotateCcw className="w-5 h-5" aria-hidden="true" />
              Start Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
