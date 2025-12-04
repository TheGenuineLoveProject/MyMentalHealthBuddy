import { useState, useEffect, useRef } from "react";
import { 
  Timer, Play, Pause, RotateCcw, Volume2, VolumeX, Plus, Minus,
  Brain, Moon, Heart, Wind, Target, Sparkles, Check
} from "lucide-react";
import { useGamification } from "../context/GamificationContext.jsx";

const PRESET_TIMERS = [
  { id: "quick", name: "Quick Reset", duration: 60, icon: Wind, color: "from-cyan-500 to-blue-600", description: "1-minute mindful pause" },
  { id: "short", name: "Short Session", duration: 300, icon: Heart, color: "from-rose-500 to-pink-600", description: "5-minute wellness break" },
  { id: "standard", name: "Standard", duration: 600, icon: Moon, color: "from-violet-500 to-purple-600", description: "10-minute practice" },
  { id: "extended", name: "Extended", duration: 900, icon: Brain, color: "from-blue-500 to-indigo-600", description: "15-minute deep session" },
  { id: "long", name: "Deep Dive", duration: 1200, icon: Sparkles, color: "from-amber-500 to-orange-600", description: "20-minute immersion" },
  { id: "marathon", name: "Marathon", duration: 1800, icon: Target, color: "from-emerald-500 to-teal-600", description: "30-minute extended practice" }
];

const AMBIENT_SOUNDS = [
  { id: "none", name: "Silence", emoji: "🔇" },
  { id: "rain", name: "Rain", emoji: "🌧️" },
  { id: "ocean", name: "Ocean Waves", emoji: "🌊" },
  { id: "forest", name: "Forest", emoji: "🌲" },
  { id: "fire", name: "Crackling Fire", emoji: "🔥" },
  { id: "birds", name: "Birds", emoji: "🐦" }
];

export default function WellnessTimer() {
  const [selectedPreset, setSelectedPreset] = useState(PRESET_TIMERS[2]);
  const [customDuration, setCustomDuration] = useState(600);
  const [timeRemaining, setTimeRemaining] = useState(600);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [selectedSound, setSelectedSound] = useState("none");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const { addXP } = useGamification();

  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsComplete(true);
            const minutes = Math.round(selectedPreset.duration / 60);
            addXP(Math.max(10, minutes * 3), `Completed ${minutes}-minute session`);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, selectedPreset, addXP]);

  const selectPreset = (preset) => {
    if (isRunning) return;
    setSelectedPreset(preset);
    setCustomDuration(preset.duration);
    setTimeRemaining(preset.duration);
    setIsComplete(false);
  };

  const adjustTime = (delta) => {
    if (isRunning) return;
    const newDuration = Math.max(60, Math.min(3600, customDuration + delta));
    setCustomDuration(newDuration);
    setTimeRemaining(newDuration);
  };

  const startTimer = () => {
    setIsRunning(true);
    setIsComplete(false);
    startTimeRef.current = Date.now();
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsComplete(false);
    setTimeRemaining(customDuration);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getProgress = () => {
    return ((customDuration - timeRemaining) / customDuration) * 100;
  };

  const Icon = selectedPreset.icon;

  return (
    <div 
      className="card-elevated p-6"
      role="region"
      aria-label="Wellness Timer"
      data-testid="wellness-timer-container"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl text-white">
            <Timer className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--text)]">Wellness Timer</h2>
            <p className="text-sm text-[var(--text-secondary)]">Timed sessions for mindful practice</p>
          </div>
        </div>
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-2 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] transition-colors"
          aria-label={soundEnabled ? "Mute" : "Unmute"}
          data-testid="button-toggle-sound"
        >
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        {PRESET_TIMERS.map(preset => {
          const PresetIcon = preset.icon;
          const isSelected = selectedPreset.id === preset.id;

          return (
            <button
              key={preset.id}
              onClick={() => selectPreset(preset)}
              disabled={isRunning}
              className={`p-3 rounded-xl text-left transition-all ${
                isSelected
                  ? `bg-gradient-to-br ${preset.color} text-white shadow-lg`
                  : "bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--text)]"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              data-testid={`preset-${preset.id}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <PresetIcon className="w-4 h-4" />
                <span className="font-medium text-sm">{preset.name}</span>
              </div>
              <p className={`text-xs ${isSelected ? "text-white/80" : "text-[var(--text-secondary)]"}`}>
                {preset.description}
              </p>
            </button>
          );
        })}
      </div>

      <div className="flex justify-center mb-6">
        <div className="relative w-72 h-72">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="var(--surface)"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#timerGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${getProgress() * 2.83} 283`}
              className="transition-all duration-1000"
            />
            <defs>
              <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {isComplete ? (
              <>
                <div className="p-4 bg-emerald-500 rounded-full text-white mb-2">
                  <Check className="w-8 h-8" />
                </div>
                <p className="text-lg font-semibold text-[var(--text)]">Complete!</p>
                <p className="text-sm text-[var(--text-secondary)]">Great session!</p>
              </>
            ) : (
              <>
                <Icon className={`w-8 h-8 mb-2 ${isRunning ? "text-[var(--primary)] animate-pulse" : "text-[var(--text-secondary)]"}`} />
                <p className="text-5xl font-bold text-[var(--text)]">{formatTime(timeRemaining)}</p>
                <p className="text-sm text-[var(--text-secondary)] mt-1">{selectedPreset.name}</p>
              </>
            )}
          </div>
        </div>
      </div>

      {!isRunning && !isComplete && (
        <div className="flex items-center justify-center gap-4 mb-6">
          <button
            onClick={() => adjustTime(-60)}
            className="p-2 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--text)] transition-colors"
            aria-label="Decrease by 1 minute"
            data-testid="button-decrease-time"
          >
            <Minus className="w-5 h-5" />
          </button>
          <span className="text-lg font-medium text-[var(--text)] w-24 text-center">
            {Math.floor(customDuration / 60)} min
          </span>
          <button
            onClick={() => adjustTime(60)}
            className="p-2 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--text)] transition-colors"
            aria-label="Increase by 1 minute"
            data-testid="button-increase-time"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="mb-6">
        <p className="text-sm text-[var(--text-secondary)] mb-3">Ambient Sound</p>
        <div className="flex flex-wrap gap-2">
          {AMBIENT_SOUNDS.map(sound => (
            <button
              key={sound.id}
              onClick={() => setSelectedSound(sound.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                selectedSound === sound.id
                  ? "bg-[var(--primary)] text-white"
                  : "bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
              }`}
              data-testid={`sound-${sound.id}`}
            >
              <span>{sound.emoji}</span>
              {sound.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        {!isRunning && !isComplete && (
          <button
            onClick={startTimer}
            className={`px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r ${selectedPreset.color} hover:opacity-90 transition-opacity flex items-center gap-2`}
            data-testid="button-start-timer"
          >
            <Play className="w-5 h-5" />
            Start Timer
          </button>
        )}
        {isRunning && (
          <button
            onClick={pauseTimer}
            className="px-8 py-3 rounded-xl font-semibold text-white bg-amber-500 hover:opacity-90 transition-opacity flex items-center gap-2"
            data-testid="button-pause-timer"
          >
            <Pause className="w-5 h-5" />
            Pause
          </button>
        )}
        {(isRunning || isComplete || timeRemaining !== customDuration) && (
          <button
            onClick={resetTimer}
            className="px-6 py-3 rounded-xl font-semibold text-[var(--text)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] transition-colors flex items-center gap-2"
            data-testid="button-reset-timer"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </button>
        )}
      </div>

      <div className="mt-6 p-4 rounded-xl bg-[var(--surface)] flex items-center justify-between">
        <div>
          <p className="text-sm text-[var(--text-secondary)]">Session XP Reward</p>
          <p className="text-lg font-bold text-[var(--text)]">
            +{Math.max(10, Math.round(customDuration / 60) * 3)} XP
          </p>
        </div>
        <Sparkles className="w-6 h-6 text-amber-500" />
      </div>
    </div>
  );
}
