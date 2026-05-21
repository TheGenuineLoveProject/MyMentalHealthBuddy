import { useState, useEffect } from "react";
import { Sparkles, Check, RotateCcw, Trophy, Heart, Brain, Users, Dumbbell } from 'lucide-react';

const SELF_CARE_CATEGORIES = {
  physical: {
    name: "Physical",
    icon: Dumbbell,
    color: "from-orange-400 to-red-500",
    items: [
      { id: "stretch", text: "Stretch or move for 10 minutes", points: 10 },
      { id: "water", text: "Drink 8 glasses of water", points: 10 },
      { id: "walk", text: "Go for a walk outside", points: 15 },
      { id: "sleep", text: "Get 7-8 hours of sleep", points: 20 },
      { id: "healthy-meal", text: "Eat a nutritious meal", points: 10 },
    ],
  },
  mental: {
    name: "Mental",
    icon: Brain,
    color: "from-purple-400 to-indigo-500",
    items: [
      { id: "meditate", text: "Meditate for 5+ minutes", points: 15 },
      { id: "journal", text: "Write in your journal", points: 10 },
      { id: "read", text: "Read something enjoyable", points: 10 },
      { id: "unplug", text: "Take a break from screens", points: 15 },
      { id: "learn", text: "Learn something new", points: 15 },
    ],
  },
  emotional: {
    name: "Emotional",
    icon: Heart,
    color: "from-pink-400 to-rose-500",
    items: [
      { id: "gratitude", text: "Practice gratitude", points: 10 },
      { id: "cry", text: "Allow yourself to feel", points: 10 },
      { id: "affirmation", text: "Say a positive affirmation", points: 5 },
      { id: "boundaries", text: "Set a healthy boundary", points: 20 },
      { id: "forgive", text: "Practice self-compassion", points: 15 },
    ],
  },
  social: {
    name: "Social",
    icon: Users,
    color: "from-teal-400 to-cyan-500",
    items: [
      { id: "call", text: "Call or text a loved one", points: 15 },
      { id: "help", text: "Help someone else", points: 20 },
      { id: "laugh", text: "Share a laugh with someone", points: 10 },
      { id: "listen", text: "Actively listen to someone", points: 15 },
      { id: "quality-time", text: "Spend quality time with others", points: 20 },
    ],
  },
};

export default function SelfCareChecklist() {
  const [completed, setCompleted] = useState({});
  const [totalPoints, setTotalPoints] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem("selfcare_date");
    const savedCompleted = localStorage.getItem("selfcare_completed");
    const savedStreak = localStorage.getItem("selfcare_streak");
    const savedPoints = localStorage.getItem("selfcare_total_points");

    if (savedStreak) setStreak(parseInt(savedStreak, 10));
    if (savedPoints) setTotalPoints(parseInt(savedPoints, 10));

    if (savedDate === today && savedCompleted) {
      setCompleted(JSON.parse(savedCompleted));
    } else if (savedDate && savedDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (savedDate === yesterday.toDateString() && savedCompleted) {
        const prevCompleted = JSON.parse(savedCompleted);
        const prevCount = Object.values(prevCompleted).filter(Boolean).length;
        if (prevCount >= 5) {
          const newStreak = streak + 1;
          setStreak(newStreak);
          try { localStorage.setItem("selfcare_streak", newStreak.toString()); } catch (err) { console.warn("[storage-safe-write]", err); }
        } else {
          setStreak(0);
          localStorage.setItem("selfcare_streak", "0");
        }
      } else {
        setStreak(0);
        try { localStorage.setItem("selfcare_streak", "0"); } catch (err) { console.warn("[storage-safe-write]", err); }
      }
      localStorage.setItem("selfcare_date", today);
      localStorage.setItem("selfcare_completed", JSON.stringify({}));
    } else {
      try { localStorage.setItem("selfcare_date", today); } catch (err) { console.warn("[storage-safe-write]", err); }
    }
  }, []);

  const toggleItem = (itemId, points) => {
    const wasCompleted = completed[itemId];
    const updated = { ...completed, [itemId]: !wasCompleted };
    setCompleted(updated);
    try { localStorage.setItem("selfcare_completed", JSON.stringify(updated)); } catch (err) { console.warn("[storage-safe-write]", err); }

    const pointChange = wasCompleted ? -points : points;
    const newTotal = totalPoints + pointChange;
    setTotalPoints(newTotal);
    try { localStorage.setItem("selfcare_total_points", newTotal.toString()); } catch (err) { console.warn("[storage-safe-write]", err); }
  };

  const resetToday = () => {
    setCompleted({});
    try { localStorage.setItem("selfcare_completed", JSON.stringify({})); } catch (err) { console.warn("[storage-safe-write]", err); }
  };

  const completedCount = Object.values(completed).filter(Boolean).length;
  const totalItems = Object.values(SELF_CARE_CATEGORIES).reduce(
    (sum, cat) => sum + cat.items.length,
    0
  );
  const todayPoints = Object.entries(completed).reduce((sum, [id, done]) => {
    if (!done) return sum;
    for (const cat of Object.values(SELF_CARE_CATEGORIES)) {
      const item = cat.items.find((i) => i.id === id);
      if (item) return sum + item.points;
    }
    return sum;
  }, 0);

  const getLevel = (points) => {
    if (points >= 1000) return { name: "Wellness Champion", icon: "🏆" };
    if (points >= 500) return { name: "Self-Care Pro", icon: "⭐" };
    if (points >= 200) return { name: "Mindful Explorer", icon: "🌟" };
    if (points >= 50) return { name: "Wellness Beginner", icon: "🌱" };
    return { name: "Getting Started", icon: "✨" };
  };

  const level = getLevel(totalPoints);

  return (
    <div className="card-elevated p-8 relative overflow-hidden" data-testid="selfcare-checklist">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-pink-400/10 to-rose-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-xl font-display font-bold text-[var(--text)]">
                Self-Care Checklist
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                {completedCount} of {totalItems} activities
              </p>
            </div>
          </div>

          <button
            onClick={resetToday}
            className="p-2 rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--text-muted)] transition-all"
            aria-label="Reset today's progress"
            data-testid="button-reset-selfcare"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-5 h-5 text-amber-500" aria-hidden="true" />
              <span className="text-sm text-[var(--text-secondary)]">Total Points</span>
            </div>
            <p className="text-2xl font-bold text-[var(--text)]">{totalPoints}</p>
            <p className="text-xs text-[var(--text-muted)]">{level.icon} {level.name}</p>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-emerald-500" aria-hidden="true" />
              <span className="text-sm text-[var(--text-secondary)]">Today</span>
            </div>
            <p className="text-2xl font-bold text-[var(--text)]">+{todayPoints}</p>
            {streak > 0 && (
              <p className="text-xs text-[var(--text-muted)]">🔥 {streak} day streak</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {Object.entries(SELF_CARE_CATEGORIES).map(([key, category]) => {
            const Icon = category.icon;
            const categoryCompleted = category.items.filter((i) => completed[i.id]).length;

            return (
              <div key={key}>
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                    <Icon className="w-4 h-4 text-white" aria-hidden="true" />
                  </div>
                  <span className="font-medium text-[var(--text)]">{category.name}</span>
                  <span className="text-sm text-[var(--text-muted)]">
                    ({categoryCompleted}/{category.items.length})
                  </span>
                </div>

                <div className="space-y-2 pl-10">
                  {category.items.map((item) => {
                    const isCompleted = completed[item.id];
                    return (
                      <button
                        key={item.id}
                        onClick={() => toggleItem(item.id, item.points)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                          isCompleted
                            ? "bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20"
                            : "bg-[var(--surface)] hover:bg-[var(--surface-hover)]"
                        }`}
                        data-testid={`button-selfcare-${item.id}`}
                      >
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                            isCompleted
                              ? "bg-emerald-500 text-white"
                              : "border-2 border-[var(--border)]"
                          }`}
                        >
                          {isCompleted && <Check className="w-4 h-4" />}
                        </div>
                        <span
                          className={`flex-1 text-sm ${
                            isCompleted
                              ? "text-emerald-600 dark:text-emerald-400 line-through"
                              : "text-[var(--text)]"
                          }`}
                        >
                          {item.text}
                        </span>
                        <span className={`text-xs font-medium ${isCompleted ? "text-emerald-500" : "text-[var(--text-muted)]"}`}>
                          +{item.points}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-6 border-t border-[var(--border)] text-center">
          <p className="text-sm text-[var(--text-muted)]">
            💪 Complete at least 5 activities daily to maintain your streak!
          </p>
        </div>
      </div>
    </div>
  );
}
