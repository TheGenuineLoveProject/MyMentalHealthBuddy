import { useState, useEffect } from "react";
import { Flame, Trophy, Star, Calendar, TrendingUp, Award, Target, Zap, Heart, Crown } from "lucide-react";

const ACHIEVEMENTS = [
  { id: "first-step", name: "First Step", description: "Complete your first wellness activity", icon: Star, points: 10, requirement: 1 },
  { id: "week-warrior", name: "Week Warrior", description: "Maintain a 7-day streak", icon: Flame, points: 50, requirement: 7 },
  { id: "dedicated", name: "Dedicated", description: "Complete 25 activities", icon: Target, points: 100, requirement: 25 },
  { id: "mindful-master", name: "Mindful Master", description: "Maintain a 14-day streak", icon: Award, points: 150, requirement: 14 },
  { id: "wellness-champion", name: "Wellness Champion", description: "Complete 50 activities", icon: Trophy, points: 200, requirement: 50 },
  { id: "zen-master", name: "Zen Master", description: "Maintain a 30-day streak", icon: Crown, points: 500, requirement: 30 },
  { id: "century", name: "Century Club", description: "Complete 100 activities", icon: Zap, points: 300, requirement: 100 },
  { id: "legendary", name: "Legendary", description: "Maintain a 60-day streak", icon: Heart, points: 1000, requirement: 60 },
];

const ACTIVITY_TYPES = [
  { id: "meditation", name: "Meditation", color: "from-purple-400 to-violet-500" },
  { id: "breathing", name: "Breathing", color: "from-teal-400 to-cyan-500" },
  { id: "journaling", name: "Journaling", color: "from-amber-400 to-orange-500" },
  { id: "exercise", name: "Exercise", color: "from-emerald-400 to-green-500" },
  { id: "gratitude", name: "Gratitude", color: "from-rose-400 to-pink-500" },
  { id: "mood", name: "Mood Check", color: "from-blue-400 to-indigo-500" },
];

const STORAGE_KEY = "wellness-streak-data";

export default function WellnessStreakDashboard() {
  const [stats, setStats] = useState({
    currentStreak: 0,
    longestStreak: 0,
    totalActivities: 0,
    totalPoints: 0,
    weeklyActivities: [],
    activityCounts: {},
    unlockedAchievements: [],
    lastActiveDate: null,
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      
      const today = new Date().toDateString();
      const lastActive = data.lastActiveDate ? new Date(data.lastActiveDate).toDateString() : null;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      let currentStreak = data.currentStreak || 0;
      if (lastActive && lastActive !== today && lastActive !== yesterday.toDateString()) {
        currentStreak = 0;
      }
      
      setStats({ ...data, currentStreak });
    }
  }, []);

  const saveStats = (newStats) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
    setStats(newStats);
  };

  const logActivity = (activityType) => {
    const today = new Date().toDateString();
    const todayISO = new Date().toISOString();
    
    let newStreak = stats.currentStreak;
    if (stats.lastActiveDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (stats.lastActiveDate === yesterday.toDateString()) {
        newStreak = stats.currentStreak + 1;
      } else if (!stats.lastActiveDate || stats.lastActiveDate !== today) {
        newStreak = 1;
      }
    }
    
    const newTotal = stats.totalActivities + 1;
    const newPoints = stats.totalPoints + 10;
    const longestStreak = Math.max(stats.longestStreak, newStreak);
    
    const newActivityCounts = {
      ...stats.activityCounts,
      [activityType]: (stats.activityCounts[activityType] || 0) + 1,
    };
    
    const weeklyActivities = [
      ...stats.weeklyActivities.slice(-6),
      { date: todayISO, type: activityType },
    ];
    
    const newUnlocked = checkAchievements(newStreak, newTotal, stats.unlockedAchievements);
    
    const newStats = {
      currentStreak: newStreak,
      longestStreak,
      totalActivities: newTotal,
      totalPoints: newPoints + (newUnlocked.length - stats.unlockedAchievements.length) * 50,
      weeklyActivities,
      activityCounts: newActivityCounts,
      unlockedAchievements: newUnlocked,
      lastActiveDate: today,
    };
    
    saveStats(newStats);
  };

  const checkAchievements = (streak, total, currentUnlocked) => {
    const unlocked = [...currentUnlocked];
    
    ACHIEVEMENTS.forEach((achievement) => {
      if (!unlocked.includes(achievement.id)) {
        if (achievement.id.includes("streak") || achievement.id === "week-warrior" || achievement.id === "mindful-master" || achievement.id === "zen-master" || achievement.id === "legendary") {
          if (streak >= achievement.requirement) {
            unlocked.push(achievement.id);
          }
        } else {
          if (total >= achievement.requirement) {
            unlocked.push(achievement.id);
          }
        }
      }
    });
    
    return unlocked;
  };

  const getWeekDays = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push({
        date: date.toDateString(),
        label: date.toLocaleDateString('en-US', { weekday: 'short' }),
        isToday: i === 0,
      });
    }
    return days;
  };

  const hasActivityOnDate = (dateStr) => {
    return stats.weeklyActivities.some(
      (a) => new Date(a.date).toDateString() === dateStr
    );
  };

  const level = Math.floor(stats.totalPoints / 100) + 1;
  const pointsInLevel = stats.totalPoints % 100;
  const weekDays = getWeekDays();

  return (
    <div 
      className="min-h-[500px] bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-950/30 dark:via-amber-950/30 dark:to-yellow-950/30 rounded-3xl p-6 relative overflow-hidden"
      data-testid="wellness-streak-dashboard"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-400/20 to-amber-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg">
            <Flame className="w-6 h-6 text-white" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Wellness Streaks</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Track your consistency</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-6 mb-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/80 text-sm">Current Streak</p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold">{stats.currentStreak}</span>
                <span className="text-xl">days</span>
              </div>
            </div>
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <Flame className="w-10 h-10" aria-hidden="true" />
            </div>
          </div>
          
          <div className="flex gap-1">
            {weekDays.map((day, idx) => {
              const hasActivity = hasActivityOnDate(day.date);
              return (
                <div key={idx} className="flex-1 text-center">
                  <div
                    className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-1 ${
                      hasActivity
                        ? "bg-white text-orange-500"
                        : day.isToday
                        ? "border-2 border-white/50"
                        : "bg-white/20"
                    }`}
                  >
                    {hasActivity && <Flame className="w-4 h-4" />}
                  </div>
                  <span className="text-[10px] text-white/80">{day.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 shadow-md">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-5 h-5 text-amber-500" aria-hidden="true" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Best Streak</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.longestStreak}</div>
          </div>
          
          <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 shadow-md">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-5 h-5 text-emerald-500" aria-hidden="true" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Activities</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalActivities}</div>
          </div>
          
          <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 shadow-md">
            <div className="flex items-center gap-2 mb-1">
              <Star className="w-5 h-5 text-purple-500" aria-hidden="true" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Points</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalPoints}</div>
          </div>
          
          <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 shadow-md">
            <div className="flex items-center gap-2 mb-1">
              <Crown className="w-5 h-5 text-blue-500" aria-hidden="true" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Level</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{level}</div>
            <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mt-1">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                style={{ width: `${pointsInLevel}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 mb-6 shadow-md">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" aria-hidden="true" />
            Log Activity
          </h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {ACTIVITY_TYPES.map((activity) => (
              <button
                key={activity.id}
                onClick={() => logActivity(activity.id)}
                className={`p-3 rounded-xl text-center transition-all bg-gradient-to-br ${activity.color} text-white shadow-md hover:shadow-lg hover:scale-105`}
                data-testid={`button-log-${activity.id}`}
              >
                <span className="text-xs font-medium">{activity.name}</span>
                <div className="text-[10px] opacity-80 mt-1">
                  {stats.activityCounts[activity.id] || 0}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 shadow-md">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" aria-hidden="true" />
            Achievements ({stats.unlockedAchievements.length}/{ACHIEVEMENTS.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {ACHIEVEMENTS.map((achievement) => {
              const Icon = achievement.icon;
              const isUnlocked = stats.unlockedAchievements.includes(achievement.id);
              
              return (
                <div
                  key={achievement.id}
                  className={`p-3 rounded-xl text-center transition-all ${
                    isUnlocked
                      ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-400"
                  }`}
                  data-testid={`achievement-${achievement.id}`}
                >
                  <Icon className={`w-8 h-8 mx-auto mb-2 ${isUnlocked ? "" : "opacity-30"}`} aria-hidden="true" />
                  <p className="text-xs font-semibold">{achievement.name}</p>
                  <p className="text-[10px] opacity-80 mt-1">{achievement.description}</p>
                  {isUnlocked && (
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full mt-2 inline-block">
                      +{achievement.points} pts
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 p-4 bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 rounded-xl">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-orange-600 dark:text-orange-400" aria-hidden="true" />
            <div>
              <p className="font-semibold text-orange-800 dark:text-orange-300">Keep Going!</p>
              <p className="text-sm text-orange-700 dark:text-orange-400">
                {stats.currentStreak > 0 
                  ? `You're on a ${stats.currentStreak}-day streak. Don't break the chain!`
                  : "Log your first mood or journal entry to begin."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
