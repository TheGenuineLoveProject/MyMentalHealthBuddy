import { useState, useEffect } from "react";
import { Trophy, Star, Flame, Heart, Brain, Target, Sparkles, Zap, Sun, Moon, Award, Crown } from "lucide-react";

const ACHIEVEMENTS = [
  {
    id: "first-mood",
    name: "Mood Tracker",
    description: "Log your first mood",
    icon: Heart,
    color: "from-pink-400 to-rose-500",
    category: "mood",
    requirement: 1,
  },
  {
    id: "mood-week",
    name: "Consistent Tracker",
    description: "Track mood for 7 days",
    icon: Flame,
    color: "from-orange-400 to-red-500",
    category: "mood",
    requirement: 7,
  },
  {
    id: "mood-month",
    name: "Mood Master",
    description: "Track mood for 30 days",
    icon: Crown,
    color: "from-amber-400 to-yellow-500",
    category: "mood",
    requirement: 30,
  },
  {
    id: "first-journal",
    name: "Journaler",
    description: "Write your first entry",
    icon: Brain,
    color: "from-purple-400 to-indigo-500",
    category: "journal",
    requirement: 1,
  },
  {
    id: "journal-ten",
    name: "Reflective Soul",
    description: "Write 10 journal entries",
    icon: Sparkles,
    color: "from-violet-400 to-purple-500",
    category: "journal",
    requirement: 10,
  },
  {
    id: "journal-fifty",
    name: "Deep Thinker",
    description: "Write 50 journal entries",
    icon: Star,
    color: "from-indigo-400 to-blue-500",
    category: "journal",
    requirement: 50,
  },
  {
    id: "first-chat",
    name: "Opening Up",
    description: "Have your first AI chat",
    icon: Zap,
    color: "from-cyan-400 to-teal-500",
    category: "chat",
    requirement: 1,
  },
  {
    id: "chat-sessions",
    name: "Seeker",
    description: "Complete 10 chat sessions",
    icon: Target,
    color: "from-emerald-400 to-green-500",
    category: "chat",
    requirement: 10,
  },
  {
    id: "first-meditation",
    name: "Zen Beginner",
    description: "Complete first meditation",
    icon: Moon,
    color: "from-blue-400 to-indigo-500",
    category: "wellness",
    requirement: 1,
  },
  {
    id: "meditation-ten",
    name: "Mindful",
    description: "Complete 10 meditations",
    icon: Sun,
    color: "from-amber-400 to-orange-500",
    category: "wellness",
    requirement: 10,
  },
  {
    id: "breathing-master",
    name: "Breathing Master",
    description: "Complete 20 breathing exercises",
    icon: Award,
    color: "from-teal-400 to-cyan-500",
    category: "wellness",
    requirement: 20,
  },
  {
    id: "selfcare-champion",
    name: "Self-Care Champion",
    description: "Earn 500 self-care points",
    icon: Trophy,
    color: "from-rose-400 to-pink-500",
    category: "wellness",
    requirement: 500,
  },
];

export default function AchievementBadges({ progress = {}, compact = false }) {
  const [achievements, setAchievements] = useState({});
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("achievements_unlocked");
    if (saved) {
      setAchievements(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const updated = { ...achievements };
    let changed = false;

    ACHIEVEMENTS.forEach((achievement) => {
      if (updated[achievement.id]) return;

      const currentProgress = progress[achievement.category] || 0;
      if (currentProgress >= achievement.requirement) {
        updated[achievement.id] = {
          unlockedAt: new Date().toISOString(),
        };
        changed = true;
      }
    });

    if (changed) {
      setAchievements(updated);
      localStorage.setItem("achievements_unlocked", JSON.stringify(updated));
    }
  }, [progress, achievements]);

  const unlockedCount = Object.keys(achievements).length;
  const totalCount = ACHIEVEMENTS.length;

  const displayAchievements = showAll ? ACHIEVEMENTS : ACHIEVEMENTS.slice(0, compact ? 4 : 6);

  if (compact) {
    return (
      <div className="card-elevated p-6" data-testid="achievements-compact">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg">
              <Trophy className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
            <div>
              <h4 className="font-display font-bold text-[var(--text)]">Achievements</h4>
              <p className="text-xs text-[var(--text-secondary)]">{unlockedCount}/{totalCount} unlocked</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {displayAchievements.map((achievement) => {
            const Icon = achievement.icon;
            const isUnlocked = achievements[achievement.id];

            return (
              <div
                key={achievement.id}
                className={`relative group ${isUnlocked ? "" : "opacity-40 grayscale"}`}
                title={`${achievement.name}: ${achievement.description}`}
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${achievement.color} flex items-center justify-center shadow-md transition-transform group-hover:scale-110`}
                >
                  <Icon className="w-6 h-6 text-white" aria-hidden="true" />
                </div>
                {isUnlocked && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                    <Star className="w-3 h-3 text-white fill-current" aria-hidden="true" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="card-elevated p-8 relative overflow-hidden" data-testid="achievements-full">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-400/10 to-yellow-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg">
              <Trophy className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-xl font-display font-bold text-[var(--text)]">
                Achievements
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                {unlockedCount} of {totalCount} unlocked
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-3xl font-bold text-[var(--primary)]">
              {Math.round((unlockedCount / totalCount) * 100)}%
            </div>
            <p className="text-xs text-[var(--text-muted)]">Complete</p>
          </div>
        </div>

        <div className="h-2 bg-[var(--surface)] rounded-full mb-6 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full transition-all duration-500"
            style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {displayAchievements.map((achievement) => {
            const Icon = achievement.icon;
            const isUnlocked = achievements[achievement.id];
            const currentProgress = progress[achievement.category] || 0;
            const progressPercent = Math.min(100, (currentProgress / achievement.requirement) * 100);

            return (
              <div
                key={achievement.id}
                className={`p-4 rounded-xl transition-all ${
                  isUnlocked
                    ? "bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20"
                    : "bg-[var(--surface)]"
                } ${isUnlocked ? "" : "opacity-60"}`}
                data-testid={`achievement-${achievement.id}`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${achievement.color} flex items-center justify-center shadow-md flex-shrink-0 ${
                      isUnlocked ? "" : "grayscale opacity-50"
                    }`}
                  >
                    <Icon className="w-6 h-6 text-white" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <h4 className="font-semibold text-[var(--text)] truncate">{achievement.name}</h4>
                      {isUnlocked && (
                        <Star className="w-4 h-4 text-amber-500 fill-current flex-shrink-0" aria-hidden="true" />
                      )}
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] mb-2">{achievement.description}</p>
                    {!isUnlocked && (
                      <div className="h-1.5 bg-[var(--bg)] rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${achievement.color} rounded-full transition-all duration-300`}
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {ACHIEVEMENTS.length > 6 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full mt-6 py-3 rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] font-medium transition-all"
            data-testid="button-show-all-achievements"
          >
            {showAll ? "Show Less" : `Show All (${ACHIEVEMENTS.length - 6} more)`}
          </button>
        )}
      </div>
    </div>
  );
}
