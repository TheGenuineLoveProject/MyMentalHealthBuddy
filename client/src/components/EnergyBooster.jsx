import { useState, useEffect } from "react";
import { Zap, Check, Sparkles, RefreshCw, Star } from 'lucide-react';

const ENERGY_BOOSTERS = [
  {
    id: "power-pose",
    name: "Power Pose",
    duration: 120,
    emoji: "💪",
    color: "from-orange-400 to-red-500",
    instruction: "Stand tall with hands on hips, feet apart. Hold this confident stance for 2 minutes to boost testosterone and reduce cortisol.",
    steps: ["Stand with feet shoulder-width apart", "Place hands firmly on hips", "Keep chest open and chin up", "Breathe deeply and feel powerful"]
  },
  {
    id: "jumping-jacks",
    name: "Quick Cardio",
    duration: 60,
    emoji: "🏃",
    color: "from-green-400 to-emerald-500",
    instruction: "Do jumping jacks or jog in place for 1 minute to get your blood pumping and energy flowing.",
    steps: ["Start with feet together", "Jump and spread arms/legs", "Return to starting position", "Keep a steady rhythm"]
  },
  {
    id: "cold-water",
    name: "Cold Splash",
    duration: 30,
    emoji: "💧",
    color: "from-cyan-400 to-blue-500",
    instruction: "Splash cold water on your face or hold cold water in your hands for 30 seconds to activate alertness.",
    steps: ["Get cold water ready", "Take a deep breath", "Splash face or hold ice", "Feel the instant wake-up"]
  },
  {
    id: "stretch",
    name: "Energizing Stretch",
    duration: 90,
    emoji: "🧘",
    color: "from-purple-400 to-indigo-500",
    instruction: "Do a full-body stretch reaching high above your head, then bend to touch your toes. Repeat 5 times.",
    steps: ["Reach arms overhead", "Stretch to the sky", "Bend forward slowly", "Touch toes and hold"]
  },
  {
    id: "dance",
    name: "Dance Break",
    duration: 180,
    emoji: "💃",
    color: "from-pink-400 to-rose-500",
    instruction: "Put on your favorite upbeat song and dance freely for 3 minutes. Let go and have fun!",
    steps: ["Pick an upbeat song", "Start moving freely", "Don't worry about looks", "Just feel the music"]
  },
  {
    id: "breathwork",
    name: "Energizing Breath",
    duration: 60,
    emoji: "🌬️",
    color: "from-teal-400 to-cyan-500",
    instruction: "Do 20 quick, powerful breaths through your nose (like bellows breathing) to oxygenate your body.",
    steps: ["Sit comfortably upright", "Inhale sharply through nose", "Exhale sharply through nose", "20 breaths, quick rhythm"]
  },
];

export default function EnergyBooster() {
  const [selectedBooster, setSelectedBooster] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [timer, setTimer] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [todayBoosters, setTodayBoosters] = useState([]);
  const [totalEnergy, setTotalEnergy] = useState(0);

  useEffect(() => {
    const today = new Date().toDateString();
    const saved = localStorage.getItem("energy_booster_data");
    if (saved) {
      const data = JSON.parse(saved);
      if (data.date === today) {
        setTodayBoosters(data.boosters || []);
        setTotalEnergy(data.energy || 0);
      }
    }
  }, []);

  useEffect(() => {
    let interval;
    if (isActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            completeBooster();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timer]);

  const startBooster = (booster) => {
    setSelectedBooster(booster);
    setTimer(booster.duration);
    setIsActive(true);
    setCompleted(false);
  };

  const completeBooster = () => {
    setIsActive(false);
    setCompleted(true);
    
    const today = new Date().toDateString();
    const energyGained = Math.floor(selectedBooster.duration / 10);
    const newBoosters = [...todayBoosters, selectedBooster.id];
    const newEnergy = totalEnergy + energyGained;
    
    setTodayBoosters(newBoosters);
    setTotalEnergy(newEnergy);
    
    localStorage.setItem("energy_booster_data", JSON.stringify({
      date: today,
      boosters: newBoosters,
      energy: newEnergy
    }));
  };

  const reset = () => {
    setSelectedBooster(null);
    setIsActive(false);
    setTimer(0);
    setCompleted(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}:${secs.toString().padStart(2, "0")}` : `${secs}s`;
  };

  const progress = selectedBooster ? ((selectedBooster.duration - timer) / selectedBooster.duration) * 100 : 0;

  return (
    <div className="card-elevated p-6 relative overflow-hidden" data-testid="energy-booster">
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-orange-400/10 to-red-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg">
              <Zap className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-display font-bold text-[var(--text)]" data-testid="text-energy-title">
                Energy Booster
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">Quick activities to energize you</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-amber-700 dark:text-amber-300" data-testid="text-total-energy">
              {totalEnergy} energy
            </span>
          </div>
        </div>

        {!selectedBooster && (
          <div className="grid grid-cols-2 gap-3">
            {ENERGY_BOOSTERS.map((booster) => {
              const completedToday = todayBoosters.includes(booster.id);
              return (
                <button
                  key={booster.id}
                  onClick={() => startBooster(booster)}
                  className={`p-4 rounded-xl text-left transition-all ${
                    completedToday
                      ? "bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-400"
                      : `bg-gradient-to-br ${booster.color} text-white shadow-md hover:shadow-lg hover:scale-102`
                  }`}
                  data-testid={`button-booster-${booster.id}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-2xl">{booster.emoji}</span>
                    {completedToday && <Check className="w-5 h-5 text-emerald-500" />}
                  </div>
                  <span className={`font-medium block ${completedToday ? "text-[var(--text)]" : ""}`}>
                    {booster.name}
                  </span>
                  <span className={`text-xs ${completedToday ? "text-[var(--text-muted)]" : "text-white/80"}`}>
                    {formatTime(booster.duration)}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {selectedBooster && !completed && (
          <div className="animate-fade-in-up">
            <div className={`p-6 rounded-2xl bg-gradient-to-br ${selectedBooster.color} text-white mb-4`}>
              <div className="text-center mb-4">
                <span className="text-5xl block mb-3">{selectedBooster.emoji}</span>
                <h4 className="text-2xl font-bold mb-2">{selectedBooster.name}</h4>
                <div className="text-5xl font-bold" data-testid="text-timer">
                  {formatTime(timer)}
                </div>
              </div>
              
              <div className="h-2 bg-white/20 rounded-full mb-4 overflow-hidden">
                <div 
                  className="h-full bg-white transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                />
              </div>
              
              <p className="text-white/90 text-center" data-testid="text-instruction">
                {selectedBooster.instruction}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {selectedBooster.steps.map((step, i) => (
                <div 
                  key={i} 
                  className="p-3 rounded-xl bg-[var(--surface)] text-sm text-[var(--text-secondary)] flex items-start gap-2"
                >
                  <span className="w-5 h-5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center text-xs flex-shrink-0">
                    {i + 1}
                  </span>
                  {step}
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={reset}
                className="flex-1 py-3 rounded-xl bg-[var(--surface)] text-[var(--text)] font-medium hover:bg-[var(--surface-hover)] transition-colors"
                data-testid="button-cancel"
              >
                Cancel
              </button>
              <button
                onClick={completeBooster}
                className="flex-1 py-3 rounded-xl bg-emerald-500 text-white font-semibold shadow-lg"
                data-testid="button-done"
              >
                Done Early
              </button>
            </div>
          </div>
        )}

        {completed && (
          <div className="text-center animate-fade-in-up">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-xl">
              <Star className="w-12 h-12 text-white" />
            </div>
            <h4 className="text-2xl font-display font-bold text-[var(--text)] mb-2" data-testid="text-complete">
              Energy Boosted! ⚡
            </h4>
            <p className="text-[var(--text-secondary)] mb-2">
              +{Math.floor(selectedBooster.duration / 10)} energy points earned
            </p>
            <p className="text-sm text-[var(--text-muted)] mb-6">
              You completed {selectedBooster.name}
            </p>
            <button
              onClick={reset}
              className="btn-gradient px-8 py-4 rounded-xl font-semibold shadow-lg flex items-center gap-2 mx-auto"
              data-testid="button-another"
            >
              <RefreshCw className="w-5 h-5" />
              Try Another Booster
            </button>
          </div>
        )}

        {todayBoosters.length > 0 && !selectedBooster && (
          <div className="mt-6 pt-4 border-t border-[var(--border)]">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--text-muted)]">Today's boosters:</span>
              <div className="flex gap-1">
                {todayBoosters.map((id, i) => {
                  const booster = ENERGY_BOOSTERS.find(b => b.id === id);
                  return (
                    <span key={i} className="text-lg" title={booster?.name}>
                      {booster?.emoji}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
