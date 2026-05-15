import { useState, useEffect } from "react";
import { Target, Plus, Check, Trash2, Flame, TrendingUp, Calendar } from "lucide-react";

const DEFAULT_HABITS = [
  { id: "1", name: "Morning meditation", icon: "🧘", color: "from-purple-400 to-indigo-500" },
  { id: "2", name: "Exercise", icon: "💪", color: "from-orange-400 to-red-500" },
  { id: "3", name: "Drink water", icon: "💧", color: "from-cyan-400 to-blue-500" },
  { id: "4", name: "Read 10 pages", icon: "📚", color: "from-emerald-400 to-teal-500" },
  { id: "5", name: "Gratitude journal", icon: "✨", color: "from-amber-400 to-orange-500" },
];

export default function HabitTracker() {
  const [habits, setHabits] = useState([]);
  const [completedToday, setCompletedToday] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHabit, setNewHabit] = useState({ name: "", icon: "✨" });
  const [streaks, setStreaks] = useState({});

  useEffect(() => {
    const savedHabits = localStorage.getItem("wellness_habits");
    const savedCompleted = localStorage.getItem("habits_completed_today");
    const savedStreaks = localStorage.getItem("habit_streaks");
    const lastDate = localStorage.getItem("habits_last_date");
    const today = new Date().toDateString();

    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    } else {
      setHabits(DEFAULT_HABITS);
      localStorage.setItem("wellness_habits", JSON.stringify(DEFAULT_HABITS));
    }

    if (savedStreaks) {
      setStreaks(JSON.parse(savedStreaks));
    }

    if (lastDate === today && savedCompleted) {
      setCompletedToday(JSON.parse(savedCompleted));
    } else {
      localStorage.setItem("habits_last_date", today);
      localStorage.setItem("habits_completed_today", JSON.stringify({}));
    }
  }, []);

  const toggleHabit = (habitId) => {
    const wasCompleted = completedToday[habitId];
    const updated = {
      ...completedToday,
      [habitId]: !wasCompleted,
    };
    setCompletedToday(updated);
    localStorage.setItem("habits_completed_today", JSON.stringify(updated));

    const newStreaks = { ...streaks };
    if (!wasCompleted) {
      newStreaks[habitId] = (newStreaks[habitId] || 0) + 1;
    } else {
      newStreaks[habitId] = Math.max(0, (newStreaks[habitId] || 0) - 1);
    }
    setStreaks(newStreaks);
    localStorage.setItem("habit_streaks", JSON.stringify(newStreaks));
  };

  const addHabit = () => {
    if (!newHabit.name.trim()) return;

    const habit = {
      id: Date.now().toString(),
      name: newHabit.name.trim(),
      icon: newHabit.icon || "✨",
      color: "from-purple-400 to-pink-500",
    };

    const updated = [...habits, habit];
    setHabits(updated);
    localStorage.setItem("wellness_habits", JSON.stringify(updated));
    setNewHabit({ name: "", icon: "✨" });
    setShowAddForm(false);
  };

  const removeHabit = (habitId) => {
    const updated = habits.filter((h) => h.id !== habitId);
    setHabits(updated);
    localStorage.setItem("wellness_habits", JSON.stringify(updated));

    const updatedCompleted = { ...completedToday };
    delete updatedCompleted[habitId];
    setCompletedToday(updatedCompleted);
    localStorage.setItem("habits_completed_today", JSON.stringify(updatedCompleted));
  };

  const completedCount = Object.values(completedToday).filter(Boolean).length;
  const progressPercent = habits.length > 0 ? (completedCount / habits.length) * 100 : 0;

  const EMOJI_OPTIONS = ["✨", "🧘", "💪", "💧", "📚", "🎯", "💤", "🥗", "🌿", "🎨", "🎵", "💼"];

  return (
    <div className="card-elevated p-8 relative overflow-hidden" data-testid="habit-tracker">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-400/10 to-teal-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg">
              <Target className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-xl font-display font-bold text-[var(--text)]">
                Daily Habits
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                {completedCount} of {habits.length} completed
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="p-2 rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--text)] transition-all"
            aria-label="Add new habit"
            data-testid="button-add-habit"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-[var(--text-secondary)]">Today's Progress</span>
            <span className="font-semibold text-[var(--text)]">{Math.round(progressPercent)}%</span>
          </div>
          <div className="h-3 bg-[var(--surface)] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {showAddForm && (
          <div className="mb-6 p-4 bg-[var(--surface)] rounded-xl animate-fade-in-up">
            <div className="flex gap-3 mb-3">
              <div className="flex flex-wrap gap-2">
                {EMOJI_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setNewHabit({ ...newHabit, icon: emoji })}
                    className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all ${
                      newHabit.icon === emoji
                        ? "bg-[var(--primary)] ring-2 ring-[var(--primary)]"
                        : "bg-[var(--bg)] hover:bg-[var(--surface-hover)]"
                    }`}
                    data-testid={`button-emoji-${emoji}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newHabit.name}
                onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                placeholder="Enter habit name..."
                className="flex-1 px-4 py-3 rounded-xl border-2 border-[var(--border)] bg-[var(--bg)] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)]"
                data-testid="input-habit-name"
                aria-label="New habit name"
              />
              <button
                onClick={addHabit}
                disabled={!newHabit.name.trim()}
                className="btn-gradient px-5 py-3 rounded-xl font-semibold disabled:opacity-50"
                data-testid="button-save-habit"
              >
                Add
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {habits.map((habit) => {
            const isCompleted = completedToday[habit.id];
            const streak = streaks[habit.id] || 0;

            return (
              <div
                key={habit.id}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                  isCompleted
                    ? "bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20"
                    : "bg-[var(--surface)] hover:bg-[var(--surface-hover)]"
                }`}
                data-testid={`habit-item-${habit.id}`}
              >
                <button
                  onClick={() => toggleHabit(habit.id)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${
                    isCompleted
                      ? `bg-gradient-to-br ${habit.color} text-white shadow-md`
                      : "bg-[var(--bg)] border-2 border-[var(--border)]"
                  }`}
                  aria-label={isCompleted ? `Mark ${habit.name} as incomplete` : `Mark ${habit.name} as complete`}
                  data-testid={`button-toggle-${habit.id}`}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : habit.icon}
                </button>

                <div className="flex-1">
                  <p className={`font-medium ${isCompleted ? "text-emerald-600 dark:text-emerald-400 line-through" : "text-[var(--text)]"}`}>
                    {habit.name}
                  </p>
                  {streak > 0 && (
                    <div className="flex items-center gap-1 text-sm text-[var(--text-secondary)]">
                      <Flame className="w-4 h-4 text-orange-500" aria-hidden="true" />
                      <span>{streak} day streak</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => removeHabit(habit.id)}
                  className="p-2 rounded-lg text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                  aria-label={`Remove ${habit.name}`}
                  data-testid={`button-remove-${habit.id}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {habits.length === 0 && (
          <div className="text-center py-8">
            <p className="text-[var(--text-muted)] mb-4">No habits yet. Add your first habit!</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-gradient px-5 py-3 rounded-xl font-semibold inline-flex items-center gap-2"
              data-testid="button-add-first-habit"
            >
              <Plus className="w-5 h-5" />
              Add Habit
            </button>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-[var(--border)] flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2 text-[var(--text-secondary)]">
            <Calendar className="w-4 h-4" aria-hidden="true" />
            <span>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}</span>
          </div>
          <div className="flex items-center gap-2 text-[var(--text-secondary)]">
            <TrendingUp className="w-4 h-4 text-emerald-500" aria-hidden="true" />
            <span>Keep building momentum!</span>
          </div>
        </div>
      </div>
    </div>
  );
}
