import { useState, useEffect, useRef } from "react";
import { Clock, Play, Pause, RotateCcw, Coffee, Brain, Zap, CheckCircle, Settings, Volume2, VolumeX } from "lucide-react";
import { useGamification } from "../context/GamificationContext.jsx";

const PRESETS = [
  { name: "Pomodoro Classic", work: 25, break: 5, longBreak: 15, sessions: 4, icon: "🍅" },
  { name: "Deep Focus", work: 50, break: 10, longBreak: 20, sessions: 3, icon: "🧠" },
  { name: "Quick Sprint", work: 15, break: 3, longBreak: 10, sessions: 6, icon: "⚡" },
  { name: "Gentle Flow", work: 20, break: 5, longBreak: 15, sessions: 4, icon: "🌊" },
];

const AMBIENT_SOUNDS = [
  { id: "none", name: "Silent", emoji: "🔇" },
  { id: "rain", name: "Rain", emoji: "🌧️" },
  { id: "forest", name: "Forest", emoji: "🌲" },
  { id: "cafe", name: "Café", emoji: "☕" },
  { id: "ocean", name: "Ocean", emoji: "🌊" },
];

export default function FocusTimer() {
  const { recordSession } = useGamification();
  const [selectedPreset, setSelectedPreset] = useState(PRESETS[0]);
  const [timeLeft, setTimeLeft] = useState(PRESETS[0].work * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [isLongBreak, setIsLongBreak] = useState(false);
  const [currentSession, setCurrentSession] = useState(1);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [totalFocusTime, setTotalFocusTime] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedSound, setSelectedSound] = useState("none");
  const [isMuted, setIsMuted] = useState(false);
  const [intention, setIntention] = useState("");
  const startTimeRef = useRef(null);

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        if (!isBreak && !isLongBreak) {
          setTotalFocusTime((prev) => prev + 1);
        }
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    
    if (!isBreak && !isLongBreak) {
      const newCompleted = completedSessions + 1;
      setCompletedSessions(newCompleted);
      
      if (newCompleted % selectedPreset.sessions === 0) {
        setIsLongBreak(true);
        setTimeLeft(selectedPreset.longBreak * 60);
      } else {
        setIsBreak(true);
        setTimeLeft(selectedPreset.break * 60);
      }
      setCurrentSession(currentSession + 1);
    } else {
      setIsBreak(false);
      setIsLongBreak(false);
      setTimeLeft(selectedPreset.work * 60);
    }
  };

  const handleStart = () => {
    if (!isRunning) {
      startTimeRef.current = Date.now();
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsBreak(false);
    setIsLongBreak(false);
    setTimeLeft(selectedPreset.work * 60);
    setCurrentSession(1);
  };

  const handlePresetChange = (preset) => {
    setSelectedPreset(preset);
    setTimeLeft(preset.work * 60);
    setIsRunning(false);
    setIsBreak(false);
    setIsLongBreak(false);
    setCurrentSession(1);
  };

  const handleSaveSession = async () => {
    if (totalFocusTime > 0) {
      await recordSession("focus_timer", totalFocusTime, {
        preset: selectedPreset.name,
        sessionsCompleted: completedSessions,
        intention,
      });
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercent = () => {
    const total = isLongBreak 
      ? selectedPreset.longBreak * 60 
      : isBreak 
        ? selectedPreset.break * 60 
        : selectedPreset.work * 60;
    return ((total - timeLeft) / total) * 100;
  };

  const getStatusColor = () => {
    if (isLongBreak) return "from-emerald-500 to-teal-500";
    if (isBreak) return "from-blue-500 to-cyan-500";
    return "from-rose-500 to-orange-500";
  };

  const getStatusText = () => {
    if (isLongBreak) return "Long Break";
    if (isBreak) return "Short Break";
    return "Focus Time";
  };

  return (
    <div className="space-y-6" data-testid="focus-timer">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-500/20 to-orange-500/20 rounded-full mb-4">
          <Clock className="w-5 h-5 text-rose-400" />
          <span className="text-rose-300 font-medium">Focus Timer</span>
        </div>
        <h2 className="text-2xl font-bold text-[var(--text)]">Deep Work Sessions</h2>
        <p className="text-[var(--text-secondary)] mt-2">
          Structured focus periods with mindful breaks
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {PRESETS.map((preset) => (
          <button
            key={preset.name}
            onClick={() => handlePresetChange(preset)}
            className={`p-3 rounded-xl transition-all ${
              selectedPreset.name === preset.name
                ? "bg-gradient-to-br from-rose-500 to-orange-500 text-white shadow-lg"
                : "bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--text)]"
            }`}
            data-testid={`button-preset-${preset.name.toLowerCase().replace(/\s+/g, "-")}`}
          >
            <span className="text-2xl block mb-1">{preset.icon}</span>
            <span className="text-sm font-medium block">{preset.name}</span>
            <span className="text-xs opacity-70">{preset.work}m / {preset.break}m</span>
          </button>
        ))}
      </div>

      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-8 border border-slate-700/50">
        <div className="text-center mb-6">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${getStatusColor()} mb-4`}>
            {isBreak || isLongBreak ? (
              <Coffee className="w-4 h-4 text-white" />
            ) : (
              <Brain className="w-4 h-4 text-white" />
            )}
            <span className="text-white font-medium">{getStatusText()}</span>
          </div>
          
          <div className="relative w-48 h-48 mx-auto mb-6">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-slate-700/50"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="url(#timerGradient)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 88}`}
                strokeDashoffset={`${2 * Math.PI * 88 * (1 - progressPercent() / 100)}`}
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={isBreak || isLongBreak ? "#10B981" : "#F43F5E"} />
                  <stop offset="100%" stopColor={isBreak || isLongBreak ? "#14B8A6" : "#F97316"} />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold text-white" data-testid="text-time-display">
                {formatTime(timeLeft)}
              </span>
              <span className="text-sm text-slate-400 mt-1">
                Session {currentSession}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mb-6">
            {!isRunning ? (
              <button
                onClick={handleStart}
                className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center text-white shadow-lg hover:shadow-rose-500/25 transition-all"
                data-testid="button-start-timer"
                aria-label="Start timer"
              >
                <Play className="w-8 h-8 ml-1" />
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg hover:shadow-amber-500/25 transition-all"
                data-testid="button-pause-timer"
                aria-label="Pause timer"
              >
                <Pause className="w-8 h-8" />
              </button>
            )}
            <button
              onClick={handleReset}
              className="w-12 h-12 rounded-full bg-slate-700/50 flex items-center justify-center text-slate-300 hover:bg-slate-600/50 transition-all"
              data-testid="button-reset-timer"
              aria-label="Reset timer"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="w-12 h-12 rounded-full bg-slate-700/50 flex items-center justify-center text-slate-300 hover:bg-slate-600/50 transition-all"
              data-testid="button-settings"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-2">
            {Array.from({ length: selectedPreset.sessions }).map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all ${
                  i < completedSessions
                    ? "bg-gradient-to-r from-emerald-400 to-teal-400"
                    : i === completedSessions && !isBreak && !isLongBreak
                      ? "bg-gradient-to-r from-rose-400 to-orange-400 animate-pulse"
                      : "bg-slate-600"
                }`}
                aria-label={`Session ${i + 1} ${i < completedSessions ? "completed" : "pending"}`}
              />
            ))}
          </div>
        </div>

        {showSettings && (
          <div className="border-t border-slate-700/50 pt-6 mt-6 animate-fade-in-up">
            <h3 className="font-semibold text-white mb-4">Ambient Sound</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {AMBIENT_SOUNDS.map((sound) => (
                <button
                  key={sound.id}
                  onClick={() => setSelectedSound(sound.id)}
                  className={`px-4 py-2 rounded-full transition-all ${
                    selectedSound === sound.id
                      ? "bg-violet-600 text-white"
                      : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50"
                  }`}
                  data-testid={`button-sound-${sound.id}`}
                >
                  <span className="mr-2">{sound.emoji}</span>
                  {sound.name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-2 rounded-lg ${isMuted ? "bg-slate-700/50" : "bg-violet-600/30"}`}
                data-testid="button-mute"
              >
                {isMuted ? <VolumeX className="w-5 h-5 text-slate-400" /> : <Volume2 className="w-5 h-5 text-violet-400" />}
              </button>
              <input
                type="text"
                value={intention}
                onChange={(e) => setIntention(e.target.value)}
                placeholder="Set your intention for this session..."
                className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2 text-white placeholder-slate-500"
                data-testid="input-intention"
              />
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[var(--surface)] rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-rose-400" data-testid="text-completed-sessions">
            {completedSessions}
          </div>
          <div className="text-sm text-[var(--text-secondary)]">Sessions</div>
        </div>
        <div className="bg-[var(--surface)] rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-emerald-400" data-testid="text-total-focus">
            {Math.floor(totalFocusTime / 60)}m
          </div>
          <div className="text-sm text-[var(--text-secondary)]">Focus Time</div>
        </div>
        <div className="bg-[var(--surface)] rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-amber-400">
            <Zap className="w-6 h-6 inline" />
          </div>
          <div className="text-sm text-[var(--text-secondary)]">+{completedSessions * 30} XP</div>
        </div>
      </div>

      {completedSessions > 0 && (
        <button
          onClick={handleSaveSession}
          className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
          data-testid="button-save-session"
        >
          <CheckCircle className="w-5 h-5" />
          Save Progress & Earn XP
        </button>
      )}
    </div>
  );
}
