import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext.jsx";
import { apiRequest, queryClient } from "../lib/queryClient.js";

const GamificationContext = createContext(null);

const XP_PER_LEVEL = 500;
const TOOL_XP_BASE = 25;

const LEVEL_TITLES = [
  "Wellness Seeker",
  "Mindful Beginner", 
  "Inner Explorer",
  "Calm Cultivator",
  "Peace Practitioner",
  "Serenity Sage",
  "Harmony Master",
  "Enlightened Soul",
  "Wellness Champion",
  "Zen Master",
];

const TOOL_XP_MULTIPLIERS = {
  breathing: 1.2,
  meditation: 1.5,
  journaling: 1.3,
  mood_tracking: 1.0,
  crisis_support: 2.0,
  therapy_chat: 1.8,
  visualization: 1.4,
  grounding: 1.3,
  default: 1.0,
};

export function GamificationProvider({ children }) {
  const { user, token } = useAuth();
  const [progress, setProgress] = useState({
    totalXp: 0,
    level: 1,
    currentStreak: 0,
    longestStreak: 0,
    toolsUsedToday: 0,
    totalToolsUsed: 0,
    totalSessionMinutes: 0,
  });
  const [quests, setQuests] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [recentXpGain, setRecentXpGain] = useState(null);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const xpToNextLevel = XP_PER_LEVEL * progress.level;
  const currentLevelXp = progress.totalXp - (XP_PER_LEVEL * (progress.level - 1) * progress.level / 2);
  const progressPercent = Math.min((currentLevelXp / xpToNextLevel) * 100, 100);
  const levelTitle = LEVEL_TITLES[Math.min(progress.level - 1, LEVEL_TITLES.length - 1)];

  const fetchProgress = useCallback(async () => {
    if (!token) return;
    try {
      const data = await apiRequest("GET", "/api/gamification/progress");
      if (data) {
        setProgress(data);
      }
    } catch (err) {
      // Gamification not yet initialized
    }
  }, [token]);

  const fetchQuests = useCallback(async () => {
    if (!token) return;
    try {
      const data = await apiRequest("GET", "/api/gamification/quests");
      if (data?.quests) {
        setQuests(data.quests);
      }
    } catch (err) {
      // Quests not yet available
    }
  }, [token]);

  useEffect(() => {
    if (user && token) {
      setIsLoading(true);
      Promise.all([fetchProgress(), fetchQuests()])
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [user, token, fetchProgress, fetchQuests]);

  const awardXp = useCallback(async (toolName, durationSeconds = 60, metadata = {}) => {
    if (!token) return 0;

    const category = toolName.toLowerCase().includes("breath") ? "breathing"
      : toolName.toLowerCase().includes("meditat") ? "meditation"
      : toolName.toLowerCase().includes("journal") ? "journaling"
      : toolName.toLowerCase().includes("mood") ? "mood_tracking"
      : toolName.toLowerCase().includes("crisis") ? "crisis_support"
      : toolName.toLowerCase().includes("chat") || toolName.toLowerCase().includes("ai") ? "therapy_chat"
      : toolName.toLowerCase().includes("visual") ? "visualization"
      : toolName.toLowerCase().includes("ground") ? "grounding"
      : "default";

    const multiplier = TOOL_XP_MULTIPLIERS[category] || 1.0;
    const timeBonus = Math.floor(durationSeconds / 60) * 5;
    const xpEarned = Math.floor((TOOL_XP_BASE + timeBonus) * multiplier);

    try {
      const result = await apiRequest("POST", "/api/gamification/record-session", {
        toolName,
        durationSeconds,
        metadata: JSON.stringify(metadata),
      });

      if (result) {
        setRecentXpGain({ amount: result.xpEarned || xpEarned, toolName });
        setTimeout(() => setRecentXpGain(null), 3000);

        if (result.leveledUp) {
          setNewLevel(result.newLevel);
          setShowLevelUp(true);
          setTimeout(() => setShowLevelUp(false), 5000);
        }

        await fetchProgress();
        await fetchQuests();
      }

      return result?.xpEarned || xpEarned;
    } catch (err) {
      return 0;
    }
  }, [token, fetchProgress, fetchQuests]);

  const completeQuest = useCallback(async (questId) => {
    if (!token) return false;
    try {
      await apiRequest("POST", "/api/gamification/complete-quest", { questId });
      await fetchQuests();
      await fetchProgress();
      return true;
    } catch (err) {
      return false;
    }
  }, [token, fetchQuests, fetchProgress]);

  const value = {
    progress,
    quests,
    achievements,
    unlockedAchievements,
    isLoading,
    xpToNextLevel,
    currentLevelXp,
    progressPercent,
    levelTitle,
    recentXpGain,
    showLevelUp,
    newLevel,
    awardXp,
    completeQuest,
    refreshProgress: fetchProgress,
    refreshQuests: fetchQuests,
  };

  return (
    <GamificationContext.Provider value={value}>
      {children}
      
      {recentXpGain && (
        <div 
          className="fixed top-20 right-4 z-50 animate-bounce-in"
          role="status"
          aria-live="polite"
        >
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2">
            <span className="text-xl">+{recentXpGain.amount}</span>
            <span className="text-amber-100">XP</span>
          </div>
        </div>
      )}
      
      {showLevelUp && newLevel && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
          role="dialog"
          aria-labelledby="level-up-title"
        >
          <div className="bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-700 p-8 rounded-3xl shadow-2xl text-center transform animate-scale-in max-w-sm mx-4">
            <div className="text-6xl mb-4">🎉</div>
            <h2 id="level-up-title" className="text-3xl font-bold text-white mb-2">Level Up!</h2>
            <p className="text-purple-100 text-lg mb-4">You've reached Level {newLevel}</p>
            <p className="text-purple-200 text-sm">{LEVEL_TITLES[Math.min(newLevel - 1, LEVEL_TITLES.length - 1)]}</p>
            <button
              onClick={() => setShowLevelUp(false)}
              className="mt-6 px-6 py-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
              data-testid="button-dismiss-levelup"
            >
              Continue Your Journey
            </button>
          </div>
        </div>
      )}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error("useGamification must be used within a GamificationProvider");
  }
  return context;
}

export default GamificationContext;
