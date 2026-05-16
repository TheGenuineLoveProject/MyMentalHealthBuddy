import { useState, useEffect } from "react";
import { Droplets, Plus, Minus, Target, TrendingUp, Bell, CheckCircle, Award } from "lucide-react";
import { useGamification } from "../context/GamificationContext.jsx";

const GLASS_SIZES = [
  { ml: 250, label: "Small Glass", icon: "🥛" },
  { ml: 350, label: "Medium Glass", icon: "🥤" },
  { ml: 500, label: "Large Glass", icon: "🧋" },
  { ml: 750, label: "Bottle", icon: "🍶" },
];

const HYDRATION_TIPS = [
  "Start your day with a glass of water to kickstart metabolism",
  "Set hourly reminders to maintain consistent hydration",
  "Eat water-rich foods like cucumbers and watermelon",
  "Drink a glass of water before each meal",
  "Keep a water bottle visible on your desk",
  "Add lemon or cucumber for natural flavor",
  "Match each caffeinated drink with a glass of water",
  "Drink water when you feel hungry - sometimes it's thirst",
];

const ACHIEVEMENTS = [
  { id: "first_glass", name: "First Sip", description: "Log your first glass", target: 1, icon: "💧" },
  { id: "half_way", name: "Halfway There", description: "Reach 50% of daily goal", target: 50, icon: "🌊" },
  { id: "goal_reached", name: "Hydration Hero", description: "Reach your daily goal", target: 100, icon: "🏆" },
  { id: "overachiever", name: "Super Hydrated", description: "Exceed goal by 20%", target: 120, icon: "⭐" },
];

export default function HydrationTracker() {
  const { recordSession } = useGamification();
  const [dailyGoal, setDailyGoal] = useState(2000);
  const [currentIntake, setCurrentIntake] = useState(0);
  const [selectedSize, setSelectedSize] = useState(GLASS_SIZES[1]);
  const [history, setHistory] = useState([]);
  const [showTip, setShowTip] = useState(true);
  const [currentTip, setCurrentTip] = useState(HYDRATION_TIPS[0]);
  const [earnedAchievements, setEarnedAchievements] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("hydration_data");
    if (saved) {
      const data = JSON.parse(saved);
      const today = new Date().toDateString();
      if (data.date === today) {
        setCurrentIntake(data.intake);
        setHistory(data.history || []);
        setEarnedAchievements(data.achievements || []);
      }
    }
    setCurrentTip(HYDRATION_TIPS[Math.floor(Math.random() * HYDRATION_TIPS.length)]);
  }, []);

  useEffect(() => {
    localStorage.setItem("hydration_data", JSON.stringify({
      date: new Date().toDateString(),
      intake: currentIntake,
      history,
      achievements: earnedAchievements,
    }));
  }, [currentIntake, history, earnedAchievements]);

  const addWater = (ml) => {
    const newIntake = currentIntake + ml;
    setCurrentIntake(newIntake);
    setHistory([...history, { ml, time: new Date().toLocaleTimeString(), timestamp: Date.now() }]);
    
    checkAchievements(newIntake);
  };

  const removeLastEntry = () => {
    if (history.length > 0) {
      const lastEntry = history[history.length - 1];
      setCurrentIntake(Math.max(0, currentIntake - lastEntry.ml));
      setHistory(history.slice(0, -1));
    }
  };

  const checkAchievements = (intake) => {
    const percent = (intake / dailyGoal) * 100;
    const newAchievements = [...earnedAchievements];

    if (!earnedAchievements.includes("first_glass") && intake > 0) {
      newAchievements.push("first_glass");
    }
    if (!earnedAchievements.includes("half_way") && percent >= 50) {
      newAchievements.push("half_way");
    }
    if (!earnedAchievements.includes("goal_reached") && percent >= 100) {
      newAchievements.push("goal_reached");
      recordSession("hydration_tracker", 60, { goal: dailyGoal, intake });
    }
    if (!earnedAchievements.includes("overachiever") && percent >= 120) {
      newAchievements.push("overachiever");
    }

    setEarnedAchievements(newAchievements);
  };

  const progressPercent = Math.min((currentIntake / dailyGoal) * 100, 100);
  const glassesCount = Math.ceil(currentIntake / 250);

  return (
    <div className="space-y-6" data-testid="hydration-tracker">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full mb-4">
          <Droplets className="w-5 h-5 text-cyan-400" />
          <span className="text-cyan-300 font-medium">Hydration Tracker</span>
        </div>
        <h2 className="text-2xl font-bold text-[var(--text)]">Stay Hydrated</h2>
        <p className="text-[var(--text-secondary)] mt-2">
          Track your water intake for optimal wellness
        </p>
      </div>

      <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 rounded-2xl p-6 border border-cyan-500/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white">Today's Progress</h3>
            <p className="text-cyan-300 text-sm">{currentIntake}ml of {dailyGoal}ml goal</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-cyan-400" data-testid="text-progress-percent">
              {progressPercent.toFixed(0)}%
            </div>
            <p className="text-xs text-slate-400">{glassesCount} glasses</p>
          </div>
        </div>

        <div className="relative h-8 bg-slate-800/50 rounded-full overflow-hidden mb-6">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-medium text-white drop-shadow">
              {currentIntake}ml / {dailyGoal}ml
            </span>
          </div>
        </div>

        <div className="flex justify-center mb-6">
          <div className="relative w-32 h-48">
            <svg viewBox="0 0 100 150" className="w-full h-full">
              <path
                d="M15 30 Q15 10 30 10 L70 10 Q85 10 85 30 L85 130 Q85 145 70 145 L30 145 Q15 145 15 130 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="text-slate-600"
              />
              <clipPath id="glassClip">
                <path d="M17 32 Q17 14 32 14 L68 14 Q83 14 83 32 L83 128 Q83 141 68 141 L32 141 Q17 141 17 128 Z" />
              </clipPath>
              <rect
                x="17"
                y={14 + (127 * (1 - progressPercent / 100))}
                width="66"
                height={127 * (progressPercent / 100)}
                fill="url(#waterGradient)"
                clipPath="url(#glassClip)"
                className="transition-all duration-500"
              />
              <defs>
                <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="var(--glp-cyan)" />
                  <stop offset="100%" stopColor="var(--glp-info)" />
                </linearGradient>
              </defs>
            </svg>
            {progressPercent >= 100 && (
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce">
                <Award className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-4">
          {GLASS_SIZES.map((size) => (
            <button
              key={size.ml}
              onClick={() => setSelectedSize(size)}
              className={`p-3 rounded-xl transition-all ${
                selectedSize.ml === size.ml
                  ? "bg-cyan-600 text-white shadow-lg"
                  : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50"
              }`}
              data-testid={`button-size-${size.ml}`}
            >
              <span className="text-xl block">{size.icon}</span>
              <span className="text-xs">{size.ml}ml</span>
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => addWater(selectedSize.ml)}
            className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
            data-testid="button-add-water"
          >
            <Plus className="w-5 h-5" />
            Add {selectedSize.ml}ml
          </button>
          <button
            onClick={removeLastEntry}
            disabled={history.length === 0}
            className="px-4 py-3 bg-slate-700/50 text-slate-300 rounded-xl hover:bg-slate-600/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="button-undo"
            aria-label="Undo last entry"
          >
            <Minus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[var(--surface)] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5 text-violet-400" />
            <h3 className="font-semibold text-[var(--text)]">Daily Goal</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDailyGoal(Math.max(1000, dailyGoal - 250))}
              className="p-2 bg-slate-700/50 rounded-lg hover:bg-slate-600/50"
              data-testid="button-decrease-goal"
            >
              <Minus className="w-4 h-4 text-slate-300" />
            </button>
            <span className="flex-1 text-center text-lg font-bold text-[var(--text)]" data-testid="text-daily-goal">
              {dailyGoal}ml
            </span>
            <button
              onClick={() => setDailyGoal(Math.min(4000, dailyGoal + 250))}
              className="p-2 bg-slate-700/50 rounded-lg hover:bg-slate-600/50"
              data-testid="button-increase-goal"
            >
              <Plus className="w-4 h-4 text-slate-300" />
            </button>
          </div>
        </div>

        <div className="bg-[var(--surface)] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <h3 className="font-semibold text-[var(--text)]">Today's Stats</h3>
          </div>
          <div className="text-sm text-[var(--text-secondary)]">
            <p>{history.length} entries logged</p>
            <p>Last: {history.length > 0 ? history[history.length - 1].time : "No entries yet"}</p>
          </div>
        </div>
      </div>

      <div className="bg-[var(--surface)] rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-amber-400" />
          <h3 className="font-semibold text-[var(--text)]">Today's Achievements</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ACHIEVEMENTS.map((achievement) => {
            const isEarned = earnedAchievements.includes(achievement.id);
            return (
              <div
                key={achievement.id}
                className={`p-3 rounded-xl text-center transition-all ${
                  isEarned
                    ? "bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30"
                    : "bg-slate-800/30 opacity-50"
                }`}
                data-testid={`achievement-${achievement.id}`}
              >
                <span className="text-2xl block mb-1">{achievement.icon}</span>
                <span className={`text-xs font-medium ${isEarned ? "text-amber-300" : "text-slate-500"}`}>
                  {achievement.name}
                </span>
                {isEarned && <CheckCircle className="w-4 h-4 text-emerald-400 mx-auto mt-1" />}
              </div>
            );
          })}
        </div>
      </div>

      {showTip && (
        <div className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 rounded-xl p-4 border border-cyan-500/20">
          <div className="flex items-start gap-3">
            <Bell className="w-5 h-5 text-cyan-400 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-cyan-300 mb-1">Hydration Tip</h4>
              <p className="text-sm text-[var(--text-secondary)]" data-testid="text-hydration-tip">{currentTip}</p>
            </div>
            <button
              onClick={() => setShowTip(false)}
              className="text-slate-500 hover:text-slate-400"
              aria-label="Dismiss tip"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="bg-[var(--surface)] rounded-xl p-4">
          <h3 className="font-semibold text-[var(--text)] mb-3">Today's Log</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {history.slice().reverse().map((entry, index) => (
              <div
                key={entry.timestamp}
                className="flex items-center justify-between py-2 px-3 bg-slate-800/30 rounded-lg"
                data-testid={`log-entry-${index}`}
              >
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-cyan-400" />
                  <span className="text-[var(--text)]">{entry.ml}ml</span>
                </div>
                <span className="text-sm text-[var(--text-secondary)]">{entry.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
