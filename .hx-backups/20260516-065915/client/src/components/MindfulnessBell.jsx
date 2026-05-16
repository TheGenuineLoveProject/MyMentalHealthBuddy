import { useState, useEffect, useRef } from "react";
import { Bell, Play, Pause, Settings, Volume2, VolumeX, Clock, RefreshCw } from "lucide-react";

const BELL_SOUNDS = [
  { id: "singing-bowl", name: "Singing Bowl", emoji: "🎵" },
  { id: "temple-bell", name: "Temple Bell", emoji: "🔔" },
  { id: "chime", name: "Wind Chime", emoji: "🎐" },
  { id: "gong", name: "Meditation Gong", emoji: "🥁" },
];

const INTERVAL_OPTIONS = [
  { value: 5, label: "5 min" },
  { value: 10, label: "10 min" },
  { value: 15, label: "15 min" },
  { value: 20, label: "20 min" },
  { value: 30, label: "30 min" },
  { value: 45, label: "45 min" },
  { value: 60, label: "1 hour" },
];

const PROMPTS = [
  "Take a deep breath and notice how you feel.",
  "Pause. What are you grateful for right now?",
  "Check in with your body. Any tension to release?",
  "Smile softly. You are doing your best.",
  "Notice five things around you. Be present.",
  "Let go of what you cannot control.",
  "How can you be kind to yourself right now?",
  "This moment is enough. You are enough.",
  "Breathe in calm, breathe out stress.",
  "What emotion are you feeling? Simply notice it.",
];

export default function MindfulnessBell() {
  const [isActive, setIsActive] = useState(false);
  const [interval, setIntervalMinutes] = useState(15);
  const [sound, setSound] = useState(BELL_SOUNDS[0]);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [timeUntilBell, setTimeUntilBell] = useState(null);
  const [lastPrompt, setLastPrompt] = useState(null);
  const [bellCount, setBellCount] = useState(0);
  const [showPrompt, setShowPrompt] = useState(false);
  
  const timerRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("mindfulness_bell_settings");
    if (saved) {
      const settings = JSON.parse(saved);
      setIntervalMinutes(settings.interval || 15);
      setVolume(settings.volume || 0.7);
      setSound(BELL_SOUNDS.find(s => s.id === settings.soundId) || BELL_SOUNDS[0]);
    }
    
    const savedCount = localStorage.getItem("mindfulness_bell_count");
    if (savedCount) {
      const data = JSON.parse(savedCount);
      const today = new Date().toDateString();
      if (data.date === today) {
        setBellCount(data.count);
      }
    }
  }, []);

  const saveSettings = () => {
    localStorage.setItem("mindfulness_bell_settings", JSON.stringify({
      interval: interval,
      volume,
      soundId: sound.id,
    }));
  };

  useEffect(() => {
    saveSettings();
  }, [interval, volume, sound]);

  useEffect(() => {
    if (isActive) {
      setTimeUntilBell(interval * 60);
      
      const countdown = setInterval(() => {
        setTimeUntilBell(prev => {
          if (prev <= 1) {
            playBell();
            return interval * 60;
          }
          return prev - 1;
        });
      }, 1000);

      timerRef.current = countdown;
      return () => clearInterval(countdown);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setTimeUntilBell(null);
    }
  }, [isActive, interval]);

  const playBell = () => {
    if (!isMuted) {
      const audio = new Audio();
      audio.volume = volume;
      audio.play().catch(() => {});
    }

    const prompt = PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
    setLastPrompt(prompt);
    setShowPrompt(true);

    const newCount = bellCount + 1;
    setBellCount(newCount);
    localStorage.setItem("mindfulness_bell_count", JSON.stringify({
      date: new Date().toDateString(),
      count: newCount,
    }));

    setTimeout(() => setShowPrompt(false), 10000);
  };

  const formatTime = (seconds) => {
    if (!seconds) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleActive = () => {
    setIsActive(!isActive);
    if (!isActive) {
      setShowPrompt(false);
    }
  };

  const testBell = () => {
    playBell();
  };

  return (
    <div className="card-elevated p-6 relative overflow-hidden" data-testid="mindfulness-bell">
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-violet-400/10 to-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center shadow-lg ${isActive ? "animate-pulse" : ""}`}>
              <Bell className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-display font-bold text-[var(--text)]" data-testid="text-bell-title">
                Mindfulness Bell
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                {isActive ? "Reminding you to pause" : "Interval reminders for presence"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-xl transition-colors ${showSettings ? "bg-[var(--primary)] text-white" : "bg-[var(--surface)] text-[var(--text-muted)]"}`}
            data-testid="button-settings"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {showPrompt && lastPrompt && (
          <div className="mb-6 p-6 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-500 text-white text-center animate-fade-in-up">
            <Bell className="w-10 h-10 mx-auto mb-3 animate-bounce" />
            <p className="text-xl font-medium leading-relaxed" data-testid="text-prompt">
              {lastPrompt}
            </p>
          </div>
        )}

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-[var(--surface)] mb-4">
            {isActive ? (
              <div className="text-center">
                <Clock className="w-8 h-8 text-[var(--primary)] mx-auto mb-1" />
                <span className="text-2xl font-bold text-[var(--text)]" data-testid="text-countdown">
                  {formatTime(timeUntilBell)}
                </span>
                <span className="text-xs text-[var(--text-muted)] block">until bell</span>
              </div>
            ) : (
              <div className="text-center">
                <Bell className="w-10 h-10 text-[var(--text-muted)]" />
                <span className="text-sm text-[var(--text-muted)] block mt-1">Ready</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-4xl">{sound.emoji}</span>
            <span className="text-lg text-[var(--text)]">Every {interval} minutes</span>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={toggleActive}
              className={`w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-all ${
                isActive
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-gradient-to-br from-violet-400 to-purple-500 text-white hover:shadow-2xl"
              }`}
              data-testid="button-toggle"
              aria-label={isActive ? "Stop" : "Start"}
            >
              {isActive ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
            </button>
          </div>
        </div>

        {showSettings && (
          <div className="p-4 rounded-xl bg-[var(--surface)] mb-4 animate-fade-in-up">
            <h4 className="font-semibold text-[var(--text)] mb-4">Settings</h4>

            <div className="mb-4">
              <label className="text-sm text-[var(--text-secondary)] mb-2 block">Bell Interval</label>
              <div className="flex flex-wrap gap-2">
                {INTERVAL_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setIntervalMinutes(opt.value)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      interval === opt.value
                        ? "bg-[var(--primary)] text-white"
                        : "bg-[var(--bg)] text-[var(--text-secondary)] hover:bg-[var(--primary)]/10"
                    }`}
                    data-testid={`button-interval-${opt.value}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="text-sm text-[var(--text-secondary)] mb-2 block">Bell Sound</label>
              <div className="grid grid-cols-2 gap-2">
                {BELL_SOUNDS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSound(s)}
                    className={`p-3 rounded-xl text-left transition-all ${
                      sound.id === s.id
                        ? "bg-[var(--primary)] text-white"
                        : "bg-[var(--bg)] text-[var(--text-secondary)] hover:bg-[var(--primary)]/10"
                    }`}
                    data-testid={`button-sound-${s.id}`}
                  >
                    <span className="text-xl mr-2">{s.emoji}</span>
                    <span className="text-sm">{s.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-[var(--text-secondary)]">Volume</label>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1"
                  data-testid="button-mute"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5 text-[var(--text-muted)]" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-[var(--primary)]" />
                  )}
                </button>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                disabled={isMuted}
                className="w-full h-2 rounded-full appearance-none bg-[var(--bg)] cursor-pointer"
                data-testid="slider-volume"
                aria-label="Volume"
              />
            </div>

            <button
              onClick={testBell}
              className="w-full py-2 rounded-xl bg-[var(--bg)] text-[var(--text-secondary)] hover:bg-[var(--primary)] hover:text-white transition-colors flex items-center justify-center gap-2"
              data-testid="button-test"
            >
              <RefreshCw className="w-4 h-4" />
              Test Bell
            </button>
          </div>
        )}

        <div className="pt-4 border-t border-[var(--border)] text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-[var(--text-muted)]">
            <Bell className="w-4 h-4" />
            <span>Today's mindful moments: <strong className="text-[var(--primary)]">{bellCount}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
