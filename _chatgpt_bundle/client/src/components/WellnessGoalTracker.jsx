import { useState } from "react";
import { 
  Target, Plus, Check, ChevronRight, Flame, Calendar,
  Trophy, Edit2, Trash2, Clock, TrendingUp, Sparkles,
  Heart, Moon, Brain, Activity, RotateCcw
} from "lucide-react";
import { useGamification } from "../context/GamificationContext.jsx";

const GOAL_TEMPLATES = [
  { title: "Meditate Daily", category: "mindfulness", target: 1, unit: "session", frequency: "daily", icon: Moon, color: "from-violet-500 to-purple-600" },
  { title: "Practice Gratitude", category: "emotional", target: 3, unit: "entries", frequency: "daily", icon: Heart, color: "from-rose-500 to-pink-600" },
  { title: "Track Mood", category: "tracking", target: 1, unit: "check-in", frequency: "daily", icon: Activity, color: "from-emerald-500 to-teal-600" },
  { title: "Weekly Journaling", category: "growth", target: 3, unit: "entries", frequency: "weekly", icon: Brain, color: "from-blue-500 to-indigo-600" },
  { title: "Self-Care Activities", category: "selfcare", target: 5, unit: "activities", frequency: "weekly", icon: Sparkles, color: "from-amber-500 to-orange-600" },
];

const INITIAL_GOALS = [
  { id: 1, title: "Morning Meditation", category: "mindfulness", target: 7, current: 5, unit: "sessions", frequency: "weekly", streak: 12, icon: Moon, color: "from-violet-500 to-purple-600" },
  { id: 2, title: "Gratitude Journaling", category: "emotional", target: 1, current: 1, unit: "entry", frequency: "daily", streak: 8, icon: Heart, color: "from-rose-500 to-pink-600" },
  { id: 3, title: "Mood Check-ins", category: "tracking", target: 21, current: 18, unit: "check-ins", frequency: "monthly", streak: 3, icon: Activity, color: "from-emerald-500 to-teal-600" },
];

export default function WellnessGoalTracker() {
  const [goals, setGoals] = useState(INITIAL_GOALS);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: "", category: "mindfulness", target: 1, unit: "times", frequency: "daily" });
  const { addXP } = useGamification();

  const incrementGoal = (goalId) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === goalId && goal.current < goal.target) {
        const newCurrent = goal.current + 1;
        const completed = newCurrent >= goal.target;
        if (completed) {
          addXP(50, `Completed: ${goal.title}`);
        } else {
          addXP(10, "Progress on goal");
        }
        return { ...goal, current: newCurrent, streak: completed ? goal.streak + 1 : goal.streak };
      }
      return goal;
    }));
  };

  const resetGoal = (goalId) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId ? { ...goal, current: 0 } : goal
    ));
  };

  const deleteGoal = (goalId) => {
    setGoals(prev => prev.filter(g => g.id !== goalId));
  };

  const addGoal = (template) => {
    const goal = {
      id: Date.now(),
      ...template,
      current: 0,
      streak: 0
    };
    setGoals(prev => [...prev, goal]);
    setShowAddGoal(false);
    addXP(15, "Created new goal");
  };

  const addCustomGoal = () => {
    if (!newGoal.title.trim()) return;
    const template = GOAL_TEMPLATES.find(t => t.category === newGoal.category);
    addGoal({
      ...newGoal,
      icon: template?.icon || Target,
      color: template?.color || "from-gray-500 to-gray-600"
    });
    setNewGoal({ title: "", category: "mindfulness", target: 1, unit: "times", frequency: "daily" });
  };

  const getProgressPercentage = (goal) => (goal.current / goal.target) * 100;

  const renderGoalCard = (goal) => {
    const Icon = goal.icon || Target;
    const progress = getProgressPercentage(goal);
    const isCompleted = progress >= 100;

    return (
      <div
        key={goal.id}
        className={`card-elevated p-4 transition-all ${isCompleted ? "ring-2 ring-emerald-500/50" : ""}`}
        data-testid={`goal-card-${goal.id}`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl bg-gradient-to-br ${goal.color} text-white`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--text)] flex items-center gap-2">
                {goal.title}
                {isCompleted && <Check className="w-4 h-4 text-emerald-500" />}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] capitalize">
                {goal.frequency} • {goal.target} {goal.unit}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => resetGoal(goal.id)}
              className="p-1.5 rounded-lg hover:bg-[var(--surface)] text-[var(--text-secondary)] transition-colors"
              aria-label="Reset goal"
              data-testid={`button-reset-${goal.id}`}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => deleteGoal(goal.id)}
              className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--text-secondary)] hover:text-red-500 transition-colors"
              aria-label="Delete goal"
              data-testid={`button-delete-${goal.id}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--text-secondary)]">
              {goal.current} / {goal.target} {goal.unit}
            </span>
            <span className={`font-medium ${isCompleted ? "text-emerald-500" : "text-[var(--primary)]"}`}>
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-3 bg-[var(--surface)] rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                isCompleted 
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500" 
                  : `bg-gradient-to-r ${goal.color}`
              }`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border)]">
          <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            <span>{goal.streak} day streak</span>
          </div>
          {!isCompleted && (
            <button
              onClick={() => incrementGoal(goal.id)}
              className="px-3 py-1.5 bg-[var(--primary)] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1"
              data-testid={`button-increment-${goal.id}`}
            >
              <Plus className="w-3.5 h-3.5" />
              Log Progress
            </button>
          )}
          {isCompleted && (
            <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-600 text-sm font-medium rounded-lg flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5" />
              Completed!
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div 
      className="card-elevated p-6"
      role="region"
      aria-label="Wellness Goal Tracker"
      data-testid="wellness-goal-tracker-container"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl text-white">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--text)]">Wellness Goals</h2>
            <p className="text-sm text-[var(--text-secondary)]">Track and achieve your wellness objectives</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddGoal(!showAddGoal)}
          className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
          data-testid="button-add-goal"
        >
          <Plus className="w-4 h-4" />
          Add Goal
        </button>
      </div>

      {showAddGoal && (
        <div className="mb-6 p-5 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
          <h3 className="font-semibold text-[var(--text)] mb-4">Create New Goal</h3>
          
          <div className="mb-4">
            <p className="text-sm text-[var(--text-secondary)] mb-3">Quick Templates</p>
            <div className="flex flex-wrap gap-2">
              {GOAL_TEMPLATES.map((template, index) => {
                const Icon = template.icon;
                return (
                  <button
                    key={index}
                    onClick={() => addGoal(template)}
                    className="px-3 py-2 rounded-lg bg-[var(--bg)] hover:bg-[var(--surface-hover)] text-sm text-[var(--text)] transition-colors flex items-center gap-2"
                    data-testid={`template-${index}`}
                  >
                    <Icon className="w-4 h-4" />
                    {template.title}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-[var(--border)] pt-4">
            <p className="text-sm text-[var(--text-secondary)] mb-3">Or Create Custom Goal</p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input
                type="text"
                placeholder="Goal title..."
                value={newGoal.title}
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                className="px-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] placeholder:text-[var(--text-secondary)]"
                data-testid="input-goal-title"
              />
              <select
                value={newGoal.category}
                onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                className="px-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-[var(--text)]"
                data-testid="select-goal-category"
              >
                <option value="mindfulness">Mindfulness</option>
                <option value="emotional">Emotional</option>
                <option value="tracking">Tracking</option>
                <option value="selfcare">Self-Care</option>
                <option value="growth">Growth</option>
              </select>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  placeholder="Target"
                  value={newGoal.target}
                  onChange={(e) => setNewGoal({ ...newGoal, target: parseInt(e.target.value) || 1 })}
                  className="w-20 px-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-[var(--text)]"
                  data-testid="input-goal-target"
                />
                <select
                  value={newGoal.frequency}
                  onChange={(e) => setNewGoal({ ...newGoal, frequency: e.target.value })}
                  className="flex-1 px-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-[var(--text)]"
                  data-testid="select-goal-frequency"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <button
                onClick={addCustomGoal}
                disabled={!newGoal.title.trim()}
                className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="button-create-goal"
              >
                Create Goal
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {goals.map(renderGoalCard)}
      </div>

      {goals.length === 0 && (
        <div className="text-center py-12">
          <Target className="w-12 h-12 text-[var(--text-secondary)] mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[var(--text)] mb-2">No Goals Yet</h3>
          <p className="text-[var(--text-secondary)] mb-4">Start by adding your first wellness goal</p>
          <button
            onClick={() => setShowAddGoal(true)}
            className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
            data-testid="button-add-first-goal"
          >
            Add Your First Goal
          </button>
        </div>
      )}

      <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-[var(--primary)]/10 to-transparent flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-5 h-5 text-[var(--primary)]" />
          <span className="text-[var(--text)]">
            <strong>{goals.filter(g => getProgressPercentage(g) >= 100).length}</strong> of{" "}
            <strong>{goals.length}</strong> goals completed this period
          </span>
        </div>
        <span className="text-sm text-[var(--text-secondary)]">
          Total streak: {goals.reduce((sum, g) => sum + g.streak, 0)} days
        </span>
      </div>
    </div>
  );
}
