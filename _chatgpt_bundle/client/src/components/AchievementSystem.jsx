import { useState, useEffect } from "react";
import { Trophy, Star, Target, Flame, Heart, Brain, Moon, Zap, Award, Lock, CheckCircle, Sparkles } from "lucide-react";
import { useGamification } from "../context/GamificationContext.jsx";

const ACHIEVEMENT_CATEGORIES = {
  consistency: {
    name: "Consistency",
    icon: Flame,
    color: "from-orange-500 to-amber-500",
    achievements: [
      { id: "streak_3", name: "Getting Started", description: "Maintain a 3-day streak", requirement: 3, type: "streak", xp: 50, icon: "🔥" },
      { id: "streak_7", name: "Week Warrior", description: "Maintain a 7-day streak", requirement: 7, type: "streak", xp: 100, icon: "💪" },
      { id: "streak_30", name: "Monthly Master", description: "Maintain a 30-day streak", requirement: 30, type: "streak", xp: 300, icon: "🏆" },
      { id: "streak_100", name: "Century Champion", description: "Maintain a 100-day streak", requirement: 100, type: "streak", xp: 1000, icon: "👑" },
    ],
  },
  exploration: {
    name: "Exploration",
    icon: Star,
    color: "from-violet-500 to-purple-500",
    achievements: [
      { id: "tools_5", name: "Curious Mind", description: "Try 5 different wellness tools", requirement: 5, type: "unique_tools", xp: 75, icon: "🔍" },
      { id: "tools_15", name: "Explorer", description: "Try 15 different wellness tools", requirement: 15, type: "unique_tools", xp: 150, icon: "🧭" },
      { id: "tools_30", name: "Wellness Adventurer", description: "Try 30 different wellness tools", requirement: 30, type: "unique_tools", xp: 400, icon: "🗺️" },
      { id: "tools_all", name: "Tool Master", description: "Try every wellness tool", requirement: 42, type: "unique_tools", xp: 1000, icon: "⭐" },
    ],
  },
  dedication: {
    name: "Dedication",
    icon: Target,
    color: "from-emerald-500 to-teal-500",
    achievements: [
      { id: "sessions_10", name: "Committed", description: "Complete 10 tool sessions", requirement: 10, type: "total_sessions", xp: 50, icon: "📝" },
      { id: "sessions_50", name: "Dedicated", description: "Complete 50 tool sessions", requirement: 50, type: "total_sessions", xp: 200, icon: "📚" },
      { id: "sessions_200", name: "Devoted", description: "Complete 200 tool sessions", requirement: 200, type: "total_sessions", xp: 500, icon: "🎯" },
      { id: "sessions_500", name: "Wellness Warrior", description: "Complete 500 tool sessions", requirement: 500, type: "total_sessions", xp: 1500, icon: "⚔️" },
    ],
  },
  mindfulness: {
    name: "Mindfulness",
    icon: Brain,
    color: "from-cyan-500 to-blue-500",
    achievements: [
      { id: "meditation_60", name: "Inner Peace", description: "Meditate for 60 minutes total", requirement: 60, type: "meditation_minutes", xp: 100, icon: "🧘" },
      { id: "meditation_300", name: "Zen Master", description: "Meditate for 5 hours total", requirement: 300, type: "meditation_minutes", xp: 300, icon: "☯️" },
      { id: "breathing_30", name: "Breath Aware", description: "Complete 30 breathing exercises", requirement: 30, type: "breathing_sessions", xp: 150, icon: "🌬️" },
      { id: "focus_120", name: "Deep Focus", description: "Complete 2 hours of focus sessions", requirement: 120, type: "focus_minutes", xp: 200, icon: "🎯" },
    ],
  },
  emotional: {
    name: "Emotional Growth",
    icon: Heart,
    color: "from-rose-500 to-pink-500",
    achievements: [
      { id: "mood_30", name: "Self-Aware", description: "Log your mood 30 times", requirement: 30, type: "mood_logs", xp: 100, icon: "😊" },
      { id: "journal_20", name: "Reflective", description: "Write 20 journal entries", requirement: 20, type: "journal_entries", xp: 150, icon: "📔" },
      { id: "gratitude_50", name: "Grateful Heart", description: "Log 50 gratitude moments", requirement: 50, type: "gratitude_entries", xp: 200, icon: "🙏" },
      { id: "affirmations_100", name: "Positive Mind", description: "Practice 100 affirmations", requirement: 100, type: "affirmation_sessions", xp: 250, icon: "✨" },
    ],
  },
  mastery: {
    name: "Mastery",
    icon: Award,
    color: "from-amber-500 to-yellow-500",
    achievements: [
      { id: "level_5", name: "Rising Star", description: "Reach Level 5", requirement: 5, type: "level", xp: 100, icon: "⭐" },
      { id: "level_10", name: "Wellness Pro", description: "Reach Level 10", requirement: 10, type: "level", xp: 250, icon: "🌟" },
      { id: "level_25", name: "Elite Achiever", description: "Reach Level 25", requirement: 25, type: "level", xp: 750, icon: "💫" },
      { id: "level_50", name: "Legendary", description: "Reach Level 50", requirement: 50, type: "level", xp: 2000, icon: "👑" },
      { id: "xp_1000", name: "XP Hunter", description: "Earn 1,000 XP", requirement: 1000, type: "total_xp", xp: 100, icon: "💎" },
      { id: "xp_10000", name: "XP Champion", description: "Earn 10,000 XP", requirement: 10000, type: "total_xp", xp: 500, icon: "💰" },
    ],
  },
};

const ALL_ACHIEVEMENTS = Object.values(ACHIEVEMENT_CATEGORIES).flatMap(cat => cat.achievements);

export default function AchievementSystem() {
  const { progress } = useGamification();
  const [selectedCategory, setSelectedCategory] = useState("consistency");
  const [earnedAchievements, setEarnedAchievements] = useState([]);
  const [recentlyUnlocked, setRecentlyUnlocked] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("earned_achievements");
    if (saved) {
      setEarnedAchievements(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const newEarned = [];
    
    ALL_ACHIEVEMENTS.forEach(achievement => {
      if (earnedAchievements.includes(achievement.id)) return;
      
      let currentValue = 0;
      switch (achievement.type) {
        case "streak":
          currentValue = progress.currentStreak;
          break;
        case "total_sessions":
          currentValue = progress.totalToolsUsed;
          break;
        case "level":
          currentValue = progress.level;
          break;
        case "total_xp":
          currentValue = progress.totalXp;
          break;
        default:
          currentValue = 0;
      }
      
      if (currentValue >= achievement.requirement) {
        newEarned.push(achievement.id);
      }
    });

    if (newEarned.length > 0) {
      const updated = [...earnedAchievements, ...newEarned];
      setEarnedAchievements(updated);
      localStorage.setItem("earned_achievements", JSON.stringify(updated));
      
      const lastUnlocked = ALL_ACHIEVEMENTS.find(a => a.id === newEarned[newEarned.length - 1]);
      setRecentlyUnlocked(lastUnlocked);
      setTimeout(() => setRecentlyUnlocked(null), 5000);
    }
  }, [progress, earnedAchievements]);

  const getProgress = (achievement) => {
    let currentValue = 0;
    switch (achievement.type) {
      case "streak":
        currentValue = progress.currentStreak;
        break;
      case "total_sessions":
        currentValue = progress.totalToolsUsed;
        break;
      case "level":
        currentValue = progress.level;
        break;
      case "total_xp":
        currentValue = progress.totalXp;
        break;
      default:
        currentValue = 0;
    }
    return Math.min(currentValue / achievement.requirement, 1);
  };

  const totalEarned = earnedAchievements.length;
  const totalAchievements = ALL_ACHIEVEMENTS.length;
  const totalXpFromAchievements = ALL_ACHIEVEMENTS
    .filter(a => earnedAchievements.includes(a.id))
    .reduce((sum, a) => sum + a.xp, 0);

  const category = ACHIEVEMENT_CATEGORIES[selectedCategory];
  const CategoryIcon = category.icon;

  return (
    <div className="space-y-6" data-testid="achievement-system">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-full mb-4">
          <Trophy className="w-5 h-5 text-amber-400" />
          <span className="text-amber-300 font-medium">Achievements</span>
        </div>
        <h2 className="text-2xl font-bold text-[var(--text)]">Your Accomplishments</h2>
        <p className="text-[var(--text-secondary)] mt-2">
          Track your wellness journey milestones
        </p>
      </div>

      {recentlyUnlocked && (
        <div className="bg-gradient-to-r from-amber-500 to-yellow-500 rounded-xl p-4 animate-bounce-in shadow-lg shadow-amber-500/25">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-3xl">
              {recentlyUnlocked.icon}
            </div>
            <div className="flex-1">
              <p className="text-amber-100 text-sm">Achievement Unlocked!</p>
              <h3 className="text-xl font-bold text-white">{recentlyUnlocked.name}</h3>
              <p className="text-amber-100 text-sm">+{recentlyUnlocked.xp} XP</p>
            </div>
            <Sparkles className="w-8 h-8 text-white animate-pulse" />
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-amber-900/30 to-yellow-900/30 rounded-xl p-4 text-center border border-amber-500/20">
          <Trophy className="w-8 h-8 text-amber-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white" data-testid="text-earned-count">
            {totalEarned}/{totalAchievements}
          </div>
          <div className="text-sm text-amber-300">Achievements</div>
        </div>
        <div className="bg-gradient-to-br from-violet-900/30 to-purple-900/30 rounded-xl p-4 text-center border border-violet-500/20">
          <Star className="w-8 h-8 text-violet-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">
            {Math.round((totalEarned / totalAchievements) * 100)}%
          </div>
          <div className="text-sm text-violet-300">Completion</div>
        </div>
        <div className="bg-gradient-to-br from-emerald-900/30 to-teal-900/30 rounded-xl p-4 text-center border border-emerald-500/20">
          <Zap className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white" data-testid="text-achievement-xp">
            {totalXpFromAchievements}
          </div>
          <div className="text-sm text-emerald-300">XP Earned</div>
        </div>
      </div>

      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
        {Object.entries(ACHIEVEMENT_CATEGORIES).map(([key, cat]) => {
          const CatIcon = cat.icon;
          const earnedInCategory = cat.achievements.filter(a => earnedAchievements.includes(a.id)).length;
          
          return (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`flex-shrink-0 px-4 py-3 rounded-xl transition-all flex items-center gap-2 ${
                selectedCategory === key
                  ? `bg-gradient-to-r ${cat.color} text-white shadow-lg`
                  : "bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
              }`}
              data-testid={`button-category-${key}`}
            >
              <CatIcon className="w-5 h-5" />
              <span className="font-medium">{cat.name}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                selectedCategory === key ? "bg-white/20" : "bg-slate-700/50"
              }`}>
                {earnedInCategory}/{cat.achievements.length}
              </span>
            </button>
          );
        })}
      </div>

      <div className={`bg-gradient-to-br ${category.color.replace("from-", "from-").replace("to-", "to-")}/10 rounded-2xl p-6 border border-opacity-20`}>
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center`}>
            <CategoryIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{category.name}</h3>
            <p className="text-slate-400 text-sm">
              {category.achievements.filter(a => earnedAchievements.includes(a.id)).length} of {category.achievements.length} unlocked
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {category.achievements.map((achievement) => {
            const isEarned = earnedAchievements.includes(achievement.id);
            const progressValue = getProgress(achievement);
            
            return (
              <div
                key={achievement.id}
                className={`p-4 rounded-xl transition-all ${
                  isEarned
                    ? "bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border border-emerald-500/30"
                    : "bg-slate-800/30 border border-slate-700/50"
                }`}
                data-testid={`achievement-${achievement.id}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${
                    isEarned
                      ? "bg-gradient-to-br from-emerald-500/30 to-teal-500/30"
                      : "bg-slate-700/50 grayscale"
                  }`}>
                    {isEarned ? achievement.icon : <Lock className="w-6 h-6 text-slate-500" />}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`font-semibold ${isEarned ? "text-emerald-300" : "text-white"}`}>
                        {achievement.name}
                      </h4>
                      <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                        isEarned
                          ? "bg-emerald-600/30 text-emerald-300"
                          : "bg-amber-600/30 text-amber-300"
                      }`}>
                        +{achievement.xp} XP
                      </span>
                    </div>
                    <p className={`text-sm ${isEarned ? "text-emerald-400/70" : "text-slate-400"}`}>
                      {achievement.description}
                    </p>
                    
                    {!isEarned && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-slate-500">Progress</span>
                          <span className="text-slate-400">
                            {Math.floor(progressValue * achievement.requirement)}/{achievement.requirement}
                          </span>
                        </div>
                        <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${category.color} transition-all duration-500`}
                            style={{ width: `${progressValue * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                    
                    {isEarned && (
                      <div className="flex items-center gap-2 mt-2 text-emerald-400">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm">Unlocked</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
