import { useState, useEffect } from "react";
import { Flame, Trophy, Star, Calendar, TrendingUp } from "lucide-react";

export default function StreakCounter({ 
  type = "mood", 
  currentStreak = 0, 
  longestStreak = 0,
  compact = false 
}) {
  const [animatedStreak, setAnimatedStreak] = useState(0);

  useEffect(() => {
    if (currentStreak === 0) {
      setAnimatedStreak(0);
      return;
    }

    let start = 0;
    const increment = currentStreak / 20;
    const timer = setInterval(() => {
      start += increment;
      if (start >= currentStreak) {
        setAnimatedStreak(currentStreak);
        clearInterval(timer);
      } else {
        setAnimatedStreak(Math.floor(start));
      }
    }, 50);

    return () => clearInterval(timer);
  }, [currentStreak]);

  const getFlameColor = (streak) => {
    if (streak >= 30) return "from-amber-400 via-orange-500 to-red-600";
    if (streak >= 14) return "from-orange-400 to-red-500";
    if (streak >= 7) return "from-yellow-400 to-orange-500";
    if (streak >= 3) return "from-amber-300 to-yellow-500";
    return "from-gray-300 to-gray-400";
  };

  const getMotivation = (streak) => {
    if (streak >= 30) return "🏆 Legendary!";
    if (streak >= 14) return "🔥 On fire!";
    if (streak >= 7) return "⭐ Great week!";
    if (streak >= 3) return "💪 Building momentum!";
    if (streak >= 1) return "🌱 Keep growing!";
    return "Start your streak today!";
  };

  const getMilestones = () => [
    { days: 3, label: "3 days", icon: Star, achieved: currentStreak >= 3 },
    { days: 7, label: "1 week", icon: Star, achieved: currentStreak >= 7 },
    { days: 14, label: "2 weeks", icon: Trophy, achieved: currentStreak >= 14 },
    { days: 30, label: "1 month", icon: Trophy, achieved: currentStreak >= 30 },
  ];

  if (compact) {
    return (
      <div 
        className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20"
        data-testid="streak-counter-compact"
      >
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getFlameColor(currentStreak)} flex items-center justify-center shadow-md`}>
          <Flame className="w-5 h-5 text-white" aria-hidden="true" />
        </div>
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-[var(--text)]">{animatedStreak}</span>
            <span className="text-sm text-[var(--text-secondary)]">day streak</span>
          </div>
          <p className="text-xs text-[var(--text-muted)]">{getMotivation(currentStreak)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card-elevated p-6 relative overflow-hidden" data-testid="streak-counter">
      <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${getFlameColor(currentStreak)} opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4`} />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getFlameColor(currentStreak)} flex items-center justify-center shadow-lg ${currentStreak >= 3 ? 'animate-pulse' : ''}`}>
              <Flame className="w-7 h-7 text-white" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-display font-bold text-[var(--text)]">
                Current Streak
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                {type === "mood" ? "Mood tracking" : type === "journal" ? "Journaling" : "Activity"}
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mb-6">
          <div className="flex items-baseline justify-center gap-2">
            <span className={`text-6xl font-bold bg-gradient-to-r ${getFlameColor(currentStreak)} bg-clip-text text-transparent`} data-testid="text-streak-count" aria-label={`${animatedStreak} day streak`}>
              {animatedStreak}
            </span>
            <span className="text-xl text-[var(--text-secondary)]">days</span>
          </div>
          <p className="text-[var(--text-muted)] mt-2" data-testid="text-streak-motivation">{getMotivation(currentStreak)}</p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-6">
          {getMilestones().map((milestone, i) => {
            const Icon = milestone.icon;
            return (
              <div
                key={i}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  milestone.achieved
                    ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md"
                    : "bg-[var(--surface)] text-[var(--text-muted)]"
                }`}
                title={milestone.label}
              >
                <Icon className="w-5 h-5" aria-hidden="true" />
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[var(--surface)] text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-[var(--text-muted)]" aria-hidden="true" />
              <span className="text-xs text-[var(--text-secondary)]">Current</span>
            </div>
            <span className="text-xl font-bold text-[var(--text)]">{currentStreak}</span>
          </div>
          <div className="p-4 rounded-xl bg-[var(--surface)] text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-[var(--text-muted)]" aria-hidden="true" />
              <span className="text-xs text-[var(--text-secondary)]">Longest</span>
            </div>
            <span className="text-xl font-bold text-[var(--text)]">{longestStreak}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-[var(--border)] text-center">
          <p className="text-xs text-[var(--text-muted)]">
            {currentStreak > 0 
              ? `Don't break the chain! Log again tomorrow.`
              : `Start tracking to begin your streak!`}
          </p>
        </div>
      </div>
    </div>
  );
}
