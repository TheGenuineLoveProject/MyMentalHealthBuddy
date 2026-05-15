import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { X, Sparkles, Star } from "lucide-react";
import "@/styles/sacred-visuals.css";

const ACHIEVEMENTS = {
  lotus_awakens: {
    id: "lotus_awakens",
    name: "Lotus Awakens",
    description: "You've taken your first step on the healing journey",
    icon: "🪷",
    requirement: "Complete your first journal entry",
    color: "from-pink-400 to-rose-500",
    glowColor: "shadow-pink-400/50"
  },
  inner_light: {
    id: "inner_light",
    name: "Inner Light",
    description: "Seven days of consistent reflection reveals your inner radiance",
    icon: "✨",
    requirement: "7 days of journaling",
    color: "from-amber-400 to-yellow-500",
    glowColor: "shadow-amber-400/50"
  },
  emotional_alchemist: {
    id: "emotional_alchemist",
    name: "Emotional Alchemist",
    description: "You're transforming emotions into wisdom through regular logging",
    icon: "🔮",
    requirement: "Log 3+ different emotions regularly",
    color: "from-purple-400 to-indigo-500",
    glowColor: "shadow-purple-400/50"
  },
  calm_keeper: {
    id: "calm_keeper",
    name: "Calm Keeper",
    description: "You've mastered the art of finding peace within",
    icon: "🌊",
    requirement: "Maintain mood stability for 2 weeks",
    color: "from-cyan-400 to-blue-500",
    glowColor: "shadow-cyan-400/50"
  },
  gratitude_guardian: {
    id: "gratitude_guardian",
    name: "Gratitude Guardian",
    description: "Your heart overflows with appreciation",
    icon: "💝",
    requirement: "Complete 21 gratitude entries",
    color: "from-rose-400 to-pink-500",
    glowColor: "shadow-rose-400/50"
  },
  deep_diver: {
    id: "deep_diver",
    name: "Deep Diver",
    description: "You've journeyed into the depths of self-understanding",
    icon: "🌊",
    requirement: "21 consecutive days of practice",
    color: "from-teal-400 to-emerald-500",
    glowColor: "shadow-teal-400/50"
  },
  moon_child: {
    id: "moon_child",
    name: "Moon Child",
    description: "Evening reflections have become your sacred ritual",
    icon: "🌙",
    requirement: "10 evening journal entries",
    color: "from-indigo-400 to-purple-500",
    glowColor: "shadow-indigo-400/50"
  },
  sunrise_seeker: {
    id: "sunrise_seeker",
    name: "Sunrise Seeker",
    description: "You greet each day with intention and awareness",
    icon: "🌅",
    requirement: "10 morning journal entries",
    color: "from-orange-400 to-amber-500",
    glowColor: "shadow-orange-400/50"
  }
};

export function AchievementBadge({ achievementId, size = "medium", showDetails = false, onClick }) {
  const achievement = ACHIEVEMENTS[achievementId];
  
  if (!achievement) return null;

  const sizeClasses = {
    small: "w-12 h-12",
    medium: "w-20 h-20",
    large: "w-28 h-28"
  };

  const iconSizes = {
    small: "text-xl",
    medium: "text-3xl",
    large: "text-5xl"
  };

  return (
    <div 
      className={`relative group cursor-pointer ${onClick ? "hover:scale-105 transition-transform" : ""}`}
      onClick={onClick}
      data-testid={`badge-${achievementId}`}
    >
      <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${achievement.color} flex items-center justify-center shadow-lg ${achievement.glowColor} petal-float`}>
        <span className={iconSizes[size]}>{achievement.icon}</span>
      </div>
      
      <div className="absolute -top-1 -right-1">
        <div className="w-5 h-5 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow">
          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
        </div>
      </div>

      {showDetails && (
        <div className="mt-2 text-center">
          <p className="font-medium text-sm text-gray-800 dark:text-white">
            {achievement.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {achievement.requirement}
          </p>
        </div>
      )}

      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
        {achievement.name}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
      </div>
    </div>
  );
}

export function AchievementUnlockedModal({ achievementId, onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  const achievement = ACHIEVEMENTS[achievementId];

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!achievement) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className={`relative bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-sm w-full shadow-2xl transform transition-all duration-500 ${isVisible ? "scale-100" : "scale-90"}`}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          data-testid="close-achievement-modal"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
            <span className="text-sm font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wide">
              Achievement Unlocked!
            </span>
            <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
          </div>

          <div className="flex justify-center mb-6">
            <div className={`w-28 h-28 rounded-full bg-gradient-to-br ${achievement.color} flex items-center justify-center shadow-xl ${achievement.glowColor} lotus-blossom`}>
              <span className="text-5xl">{achievement.icon}</span>
            </div>
          </div>

          <h2 className="font-playfair text-2xl font-bold text-gray-800 dark:text-white mb-2">
            {achievement.name}
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {achievement.description}
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 to-rose-100 dark:from-amber-900/30 dark:to-rose-900/30">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
              {achievement.requirement}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AchievementGrid({ achievements = [], onBadgeClick }) {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-4" data-testid="achievement-grid">
      {Object.keys(ACHIEVEMENTS).map(id => {
        const isUnlocked = achievements.includes(id);
        return (
          <div 
            key={id}
            className={`flex flex-col items-center ${!isUnlocked ? "opacity-40 grayscale" : ""}`}
          >
            <AchievementBadge 
              achievementId={id} 
              size="small"
              onClick={() => isUnlocked && onBadgeClick?.(id)}
            />
            <span className="text-xs text-center mt-1 text-gray-600 dark:text-gray-400">
              {ACHIEVEMENTS[id].name}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function AchievementsPanel() {
  const [selectedBadge, setSelectedBadge] = useState(null);
  
  const { data: userAchievements, isLoading } = useQuery({
    queryKey: ["/api/progress/achievements"],
    staleTime: 1000 * 60 * 5
  });

  const unlockedAchievements = userAchievements?.achievements || [];

  if (isLoading) {
    return (
      <div className="p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm animate-pulse">
        <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-amber-100 dark:border-gray-700 shadow-lg glow-border" data-testid="achievements-panel">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-md">
          <Star className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-playfair text-lg font-semibold text-gray-800 dark:text-white">
            Sacred Achievements
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {unlockedAchievements.length} of {Object.keys(ACHIEVEMENTS).length} unlocked
          </p>
        </div>
      </div>

      <AchievementGrid 
        achievements={unlockedAchievements} 
        onBadgeClick={setSelectedBadge}
      />

      {selectedBadge && (
        <AchievementUnlockedModal 
          achievementId={selectedBadge}
          onClose={() => setSelectedBadge(null)}
        />
      )}
    </div>
  );
}

export default AchievementBadge;
