import { useState, useEffect } from "react";
import { Zap, Trophy, Flame, Star, TrendingUp } from "lucide-react";
import { useGamification } from "../context/GamificationContext.jsx";

const LEVEL_COLORS = [
  "from-slate-500 to-slate-600",
  "from-emerald-500 to-teal-500",
  "from-blue-500 to-cyan-500",
  "from-violet-500 to-purple-500",
  "from-amber-500 to-orange-500",
  "from-rose-500 to-pink-500",
  "from-indigo-500 to-blue-500",
  "from-teal-500 to-emerald-500",
  "from-purple-500 to-violet-500",
  "from-orange-500 to-amber-500",
];

export default function XPProgressBar({ compact = false, showStats = true }) {
  const { progress, progressPercent, xpToNextLevel, currentLevelXp, levelTitle, isLoading } = useGamification();
  const [animatedPercent, setAnimatedPercent] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercent(progressPercent);
    }, 100);
    return () => clearTimeout(timer);
  }, [progressPercent]);

  const levelColor = LEVEL_COLORS[Math.min(progress.level - 1, LEVEL_COLORS.length - 1)];

  if (isLoading) {
    return (
      <div className="animate-pulse motion-reduce:animate-none">
        <div className="h-8 bg-slate-700/50 rounded-full"></div>
      </div>
    );
  }

  if (compact) {
    return (
      <div 
        className="flex items-center gap-3"
        data-testid="xp-progress-compact"
      >
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${levelColor} flex items-center justify-center text-white font-bold shadow-lg`}>
          {progress.level}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-white font-medium">{levelTitle}</span>
            <span className="text-xs text-amber-400">{currentLevelXp}/{xpToNextLevel} XP</span>
          </div>
          <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${levelColor} transition-all duration-1000 ease-out rounded-full`}
              style={{ width: `${animatedPercent}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-2xl overflow-hidden border border-slate-700/50"
      data-testid="xp-progress-bar"
    >
      <div className={`bg-gradient-to-r ${levelColor} p-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30 shadow-xl">
                <span className="text-2xl font-bold text-white">{progress.level}</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center border-2 border-white">
                <Zap className="w-3 h-3 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{levelTitle}</h3>
              <p className="text-white/80 text-sm">Level {progress.level} Wellness Warrior</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-3xl font-bold text-white">{progress.totalXp.toLocaleString()}</div>
            <p className="text-white/70 text-sm">Total XP</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Progress to Level {progress.level + 1}</span>
            <span className="text-sm font-medium text-amber-400">{currentLevelXp} / {xpToNextLevel} XP</span>
          </div>
          <div className="relative w-full bg-slate-700/50 rounded-full h-4 overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${levelColor} transition-all duration-1000 ease-out rounded-full relative`}
              style={{ width: `${animatedPercent}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse motion-reduce:animate-none"></div>
            </div>
            <div 
              className="absolute top-0 h-full w-1 bg-white/50"
              style={{ left: `${animatedPercent}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-2 text-center">
            {xpToNextLevel - currentLevelXp} XP until next level
          </p>
        </div>

        {showStats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Flame className="w-5 h-5 text-orange-400" />
              </div>
              <div className="text-2xl font-bold text-white">{progress.currentStreak}</div>
              <div className="text-xs text-slate-400">Day Streak</div>
            </div>
            
            <div className="bg-slate-800/50 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-amber-400" />
              </div>
              <div className="text-2xl font-bold text-white">{progress.longestStreak}</div>
              <div className="text-xs text-slate-400">Best Streak</div>
            </div>
            
            <div className="bg-slate-800/50 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white">{progress.totalToolsUsed}</div>
              <div className="text-xs text-slate-400">Tools Used</div>
            </div>
            
            <div className="bg-slate-800/50 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-white">{progress.totalSessionMinutes}</div>
              <div className="text-xs text-slate-400">Minutes</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
