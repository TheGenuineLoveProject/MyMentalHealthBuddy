import { useState, useEffect, useRef } from "react";
import { Moon, Play, Pause, RotateCcw, Volume2, VolumeX, Coffee, Sparkles, Clock, Zap } from "lucide-react";
import { useGamification } from "../context/GamificationContext.jsx";

const NAP_PRESETS = [
  { 
    name: "Power Nap", 
    duration: 10, 
    description: "Quick energy boost", 
    icon: "⚡",
    benefits: ["Increased alertness", "Improved mood", "Enhanced creativity"],
    color: "from-amber-500 to-orange-500"
  },
  { 
    name: "Recovery Nap", 
    duration: 20, 
    description: "Optimal restoration", 
    icon: "🔋",
    benefits: ["Memory consolidation", "Better focus", "Stress reduction"],
    color: "from-violet-500 to-purple-500"
  },
  { 
    name: "Deep Rest", 
    duration: 30, 
    description: "Full recharge", 
    icon: "🌙",
    benefits: ["Physical recovery", "Emotional balance", "Enhanced learning"],
    color: "from-indigo-500 to-blue-500"
  },
  { 
    name: "NASA Nap", 
    duration: 26, 
    description: "Astronaut approved", 
    icon: "🚀",
    benefits: ["34% more alert", "Improved reaction", "Better judgment"],
    color: "from-slate-500 to-gray-600"
  },
];

const AMBIENT_OPTIONS = [
  { id: "silence", name: "Silence", emoji: "🔇" },
  { id: "rain", name: "Gentle Rain", emoji: "🌧️" },
  { id: "ocean", name: "Ocean Waves", emoji: "🌊" },
  { id: "forest", name: "Forest", emoji: "🌲" },
  { id: "whitenoise", name: "White Noise", emoji: "📻" },
];

const WAKE_SOUNDS = [
  { id: "gentle", name: "Gentle Chime", emoji: "🔔" },
  { id: "birds", name: "Birds Singing", emoji: "🐦" },
  { id: "sunrise", name: "Sunrise Melody", emoji: "🌅" },
  { id: "nature", name: "Nature Sounds", emoji: "🌿" },
];

export default function PowerNap() {
  const { recordSession } = useGamification();
  const [selectedPreset, setSelectedPreset] = useState(NAP_PRESETS[0]);
  const [timeLeft, setTimeLeft] = useState(NAP_PRESETS[0].duration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [ambientSound, setAmbientSound] = useState("rain");
  const [wakeSound, setWakeSound] = useState("gentle");
  const [isMuted, setIsMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [napCount, setNapCount] = useState(0);
  const startTimeRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("nap_count");
    if (saved) {
      const data = JSON.parse(saved);
      if (data.date === new Date().toDateString()) {
        setNapCount(data.count);
      }
    }
  }, []);

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      handleComplete();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleComplete = async () => {
    setIsRunning(false);
    setIsComplete(true);
    
    const newCount = napCount + 1;
    setNapCount(newCount);
    localStorage.setItem("nap_count", JSON.stringify({
      date: new Date().toDateString(),
      count: newCount,
    }));

    await recordSession("power_nap", selectedPreset.duration * 60, {
      preset: selectedPreset.name,
      napCount: newCount,
    });
  };

  const handleStart = () => {
    startTimeRef.current = Date.now();
    setIsRunning(true);
    setIsComplete(false);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsComplete(false);
    setTimeLeft(selectedPreset.duration * 60);
  };

  const handlePresetChange = (preset) => {
    setSelectedPreset(preset);
    setTimeLeft(preset.duration * 60);
    setIsRunning(false);
    setIsComplete(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercent = ((selectedPreset.duration * 60 - timeLeft) / (selectedPreset.duration * 60)) * 100;

  return (
    <div className="space-y-6" data-testid="power-nap">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full mb-4">
          <Moon className="w-5 h-5 text-indigo-400" />
          <span className="text-indigo-300 font-medium">Power Nap</span>
        </div>
        <h2 className="text-2xl font-bold text-[var(--text)]">Strategic Rest</h2>
        <p className="text-[var(--text-secondary)] mt-2">
          Research-based nap durations to help you rest well
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {NAP_PRESETS.map((preset) => (
          <button
            key={preset.name}
            onClick={() => handlePresetChange(preset)}
            className={`p-4 rounded-xl transition-all text-left ${
              selectedPreset.name === preset.name
                ? `bg-gradient-to-br ${preset.color} text-white shadow-lg`
                : "bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--text)]"
            }`}
            data-testid={`button-preset-${preset.name.toLowerCase().replace(/\s+/g, "-")}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{preset.icon}</span>
              <span className="font-semibold">{preset.name}</span>
            </div>
            <p className={`text-sm ${selectedPreset.name === preset.name ? "text-white/80" : "text-[var(--text-secondary)]"}`}>
              {preset.duration} minutes - {preset.description}
            </p>
          </button>
        ))}
      </div>

      <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-2xl p-8 border border-indigo-500/20">
        {isComplete ? (
          <div className="text-center py-8 animate-fade-in-up">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/25">
              <Coffee className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Rise & Shine!</h3>
            <p className="text-indigo-300 mb-6">
              Your {selectedPreset.name.toLowerCase()} is complete. You should feel refreshed!
            </p>
            <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
              <h4 className="font-semibold text-white mb-3">Post-Nap Tips</h4>
              <ul className="text-sm text-slate-300 space-y-2 text-left">
                <li className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 mt-0.5" />
                  Expose yourself to bright light to feel more alert
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 mt-0.5" />
                  Do some light stretching to activate your body
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 mt-0.5" />
                  Have a glass of water to rehydrate
                </li>
              </ul>
            </div>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
              data-testid="button-start-new"
            >
              Start New Nap
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${selectedPreset.color} mb-4`}>
                <span className="text-xl">{selectedPreset.icon}</span>
                <span className="text-white font-medium">{selectedPreset.name}</span>
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
                    stroke="url(#napGradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 88}`}
                    strokeDashoffset={`${2 * Math.PI * 88 * (1 - progressPercent / 100)}`}
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="napGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="var(--glp-indigo)" />
                      <stop offset="100%" stopColor="var(--glp-purple-light)" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-bold text-white" data-testid="text-time-display">
                    {formatTime(timeLeft)}
                  </span>
                  <span className="text-sm text-indigo-300 mt-1">remaining</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 mb-6">
                {!isRunning ? (
                  <button
                    onClick={handleStart}
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg hover:shadow-indigo-500/25 transition-all"
                    data-testid="button-start-nap"
                    aria-label="Start nap"
                  >
                    <Play className="w-8 h-8 ml-1" />
                  </button>
                ) : (
                  <button
                    onClick={handlePause}
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg hover:shadow-amber-500/25 transition-all"
                    data-testid="button-pause-nap"
                    aria-label="Pause nap"
                  >
                    <Pause className="w-8 h-8" />
                  </button>
                )}
                <button
                  onClick={handleReset}
                  className="w-12 h-12 rounded-full bg-slate-700/50 flex items-center justify-center text-slate-300 hover:bg-slate-600/50 transition-all"
                  data-testid="button-reset-nap"
                  aria-label="Reset nap"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    isMuted ? "bg-slate-700/50 text-slate-400" : "bg-indigo-600/30 text-indigo-400"
                  }`}
                  data-testid="button-mute"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="bg-slate-800/30 rounded-xl p-4 mb-4">
              <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                Benefits of {selectedPreset.name}
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {selectedPreset.benefits.map((benefit, index) => (
                  <li key={index} className="text-sm text-slate-300 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => setShowSettings(!showSettings)}
              className="w-full py-2 text-sm text-indigo-300 hover:text-indigo-200 transition-colors"
              data-testid="button-toggle-settings"
            >
              {showSettings ? "Hide" : "Show"} Sound Settings
            </button>

            {showSettings && (
              <div className="mt-4 space-y-4 animate-fade-in-up">
                <div>
                  <h4 className="text-sm font-medium text-slate-300 mb-2">Ambient Sound</h4>
                  <div className="flex flex-wrap gap-2">
                    {AMBIENT_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setAmbientSound(option.id)}
                        className={`px-3 py-2 rounded-lg text-sm transition-all ${
                          ambientSound === option.id
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50"
                        }`}
                        data-testid={`button-ambient-${option.id}`}
                      >
                        {option.emoji} {option.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-300 mb-2">Wake-Up Sound</h4>
                  <div className="flex flex-wrap gap-2">
                    {WAKE_SOUNDS.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setWakeSound(option.id)}
                        className={`px-3 py-2 rounded-lg text-sm transition-all ${
                          wakeSound === option.id
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50"
                        }`}
                        data-testid={`button-wake-${option.id}`}
                      >
                        {option.emoji} {option.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[var(--surface)] rounded-xl p-4 text-center">
          <Clock className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
          <div className="text-xl font-bold text-[var(--text)]" data-testid="text-nap-count">
            {napCount}
          </div>
          <div className="text-sm text-[var(--text-secondary)]">Naps Today</div>
        </div>
        <div className="bg-[var(--surface)] rounded-xl p-4 text-center">
          <Moon className="w-6 h-6 text-violet-400 mx-auto mb-2" />
          <div className="text-xl font-bold text-[var(--text)]">
            {napCount * selectedPreset.duration}m
          </div>
          <div className="text-sm text-[var(--text-secondary)]">Rest Time</div>
        </div>
        <div className="bg-[var(--surface)] rounded-xl p-4 text-center">
          <Zap className="w-6 h-6 text-amber-400 mx-auto mb-2" />
          <div className="text-xl font-bold text-[var(--text)]">
            +{napCount * 35}
          </div>
          <div className="text-sm text-[var(--text-secondary)]">XP Earned</div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 rounded-xl p-4 border border-indigo-500/20">
        <h4 className="font-medium text-indigo-300 mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Napping Science
        </h4>
        <p className="text-sm text-[var(--text-secondary)]">
          A NASA study found that a 26-minute nap improved pilot performance by 34% and alertness by 54%. 
          The key is to avoid entering deep sleep (which happens after 30 minutes) to prevent grogginess.
        </p>
      </div>
    </div>
  );
}
