import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, RotateCcw, VolumeX, Moon, Sun, Waves, CloudRain, Wind, Trees } from 'lucide-react';
import ZenScape from "./zen/ZenScape";

const AMBIENT_SOUNDS = [
  { id: "silence", name: "Silence", icon: VolumeX, color: "from-slate-400 to-gray-500" },
  { id: "rain", name: "Rain", icon: CloudRain, color: "from-blue-400 to-indigo-500" },
  { id: "ocean", name: "Ocean", icon: Waves, color: "from-cyan-400 to-teal-500" },
  { id: "forest", name: "Forest", icon: Trees, color: "from-green-400 to-emerald-500" },
  { id: "wind", name: "Wind", icon: Wind, color: "from-purple-400 to-indigo-500" },
];

const DURATION_OPTIONS = [
  { minutes: 1, label: "1 min" },
  { minutes: 3, label: "3 min" },
  { minutes: 5, label: "5 min" },
  { minutes: 10, label: "10 min" },
  { minutes: 15, label: "15 min" },
  { minutes: 20, label: "20 min" },
];

export default function MeditationTimer({ onComplete }) {
  const [duration, setDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isActive, setIsActive] = useState(false);
  const [selectedSound, setSelectedSound] = useState("silence");
  const [phase, setPhase] = useState("setup");
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("meditation_sessions");
    if (saved) {
      setSessionsCompleted(parseInt(saved, 10));
    }
  }, []);

  useEffect(() => {
    if (phase === "setup") {
      setTimeLeft(duration * 60);
    }
  }, [duration, phase]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsActive(false);
            setPhase("complete");
            const newCount = sessionsCompleted + 1;
            setSessionsCompleted(newCount);
            localStorage.setItem("meditation_sessions", newCount.toString());
            if (onComplete) onComplete(duration);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft, duration, sessionsCompleted, onComplete]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const startMeditation = useCallback(() => {
    setPhase("active");
    setIsActive(true);
  }, []);

  const togglePause = () => {
    setIsActive(!isActive);
  };

  const resetMeditation = () => {
    setIsActive(false);
    setPhase("setup");
    setTimeLeft(duration * 60);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const progress = phase === "setup" ? 0 : ((duration * 60 - timeLeft) / (duration * 60)) * 100;
  const sound = AMBIENT_SOUNDS.find((s) => s.id === selectedSound);
  const SoundIcon = sound?.icon || VolumeX;

  return (
    <ZenScape
      buddyState={isActive ? "encouraged" : phase === "complete" ? "celebrate" : "calm"}
      buddySize={150}
      buddyLabel={
        phase === "complete"
          ? "We did it. Honor what you just gave yourself."
          : isActive
          ? "Sitting with you. Breath by breath."
          : "Ready when you are. We'll go at your pace."
      }
    >
    <div className="card-elevated p-8 relative overflow-hidden" data-testid="meditation-timer">
      <div className={`absolute inset-0 bg-gradient-to-br ${sound?.color || "from-purple-400/10 to-indigo-500/10"} opacity-10`} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-purple-500/20 rounded-full blur-3xl -translate-y-1/2" />

      <div className="relative z-10">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-lg">
            <Moon className="w-6 h-6 text-white" aria-hidden="true" />
          </div>
          <h3 className="text-xl font-display font-bold text-[var(--text)]">
            Meditation Timer
          </h3>
        </div>

        {phase === "setup" && (
          <>
            <div className="mb-8">
              <p className="text-sm text-[var(--text-secondary)] mb-3 text-center">Duration</p>
              <div className="flex flex-wrap justify-center gap-2">
                {DURATION_OPTIONS.map((opt) => (
                  <button
                    key={opt.minutes}
                    onClick={() => setDuration(opt.minutes)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      duration === opt.minutes
                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
                        : "bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
                    }`}
                    data-testid={`button-duration-${opt.minutes}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <p className="text-sm text-[var(--text-secondary)] mb-3 text-center">Ambient Sound</p>
              <div className="flex flex-wrap justify-center gap-2">
                {AMBIENT_SOUNDS.map((s) => {
                  const Icon = s.icon;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSelectedSound(s.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        selectedSound === s.id
                          ? `bg-gradient-to-r ${s.color} text-white shadow-md`
                          : "bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
                      }`}
                      data-testid={`button-sound-${s.id}`}
                    >
                      <Icon className="w-4 h-4" aria-hidden="true" />
                      {s.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={startMeditation}
              className="w-full btn-gradient py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
              data-testid="button-start-meditation"
            >
              <Play className="w-6 h-6" aria-hidden="true" />
              Begin Meditation
            </button>
          </>
        )}

        {phase === "active" && (
          <>
            <div className="relative w-64 h-64 mx-auto mb-8">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  fill="none"
                  stroke="var(--surface)"
                  strokeWidth="8"
                />
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 120}
                  strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--glp-indigo-light)" />
                    <stop offset="100%" stopColor="var(--glp-purple-light)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-5xl font-bold text-[var(--text)] font-display" data-testid="text-timer" aria-live="polite">
                  {formatTime(timeLeft)}
                </p>
                <div className="flex items-center gap-2 mt-2 text-[var(--text-secondary)]">
                  <SoundIcon className="w-4 h-4" aria-hidden="true" />
                  <span className="text-sm" data-testid="text-sound-name">{sound?.name}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={togglePause}
                className={`px-8 py-4 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg ${
                  isActive
                    ? "bg-amber-500 text-white hover:bg-amber-600"
                    : "bg-emerald-500 text-white hover:bg-emerald-600"
                }`}
                data-testid="button-pause-meditation"
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
                onClick={resetMeditation}
                className="px-6 py-4 rounded-xl font-semibold flex items-center gap-2 bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--surface-hover)] transition-all"
                data-testid="button-reset-meditation"
              >
                <RotateCcw className="w-5 h-5" aria-hidden="true" />
                End
              </button>
            </div>

            <p className="text-center text-[var(--text-muted)] mt-6 text-sm">
              Breathe deeply. Let your thoughts come and go.
            </p>
          </>
        )}

        {phase === "complete" && (
          <div className="text-center animate-fade-in-up">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-xl">
              <Sun className="w-12 h-12 text-white" aria-hidden="true" />
            </div>
            <h4 className="text-2xl font-display font-bold text-[var(--text)] mb-2" data-testid="text-session-complete">
              Session Complete
            </h4>
            <p className="text-[var(--text-secondary)] mb-2" data-testid="text-session-duration">
              {duration} minutes of mindfulness
            </p>
            <p className="text-sm text-[var(--primary)] font-medium mb-6" data-testid="text-total-sessions">
              Total sessions: {sessionsCompleted}
            </p>
            <button
              onClick={resetMeditation}
              className="btn-gradient px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 mx-auto shadow-lg hover:shadow-xl transition-all"
              data-testid="button-restart-meditation"
            >
              <RotateCcw className="w-5 h-5" aria-hidden="true" />
              New Session
            </button>
          </div>
        )}

        {sessionsCompleted > 0 && phase === "setup" && (
          <div className="mt-6 pt-6 border-t border-[var(--border)] text-center">
            <p className="text-sm text-[var(--text-muted)]">
              🧘 You've completed <span className="font-semibold text-[var(--primary)]">{sessionsCompleted}</span> meditation session{sessionsCompleted !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>
    </div>
    </ZenScape>
  );
}
