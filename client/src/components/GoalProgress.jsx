import { useState, useEffect } from "react";
import { Target, Plus, Check, Trash2, ChevronRight, Trophy, Star, Calendar, TrendingUp } from "lucide-react";

const GOAL_TEMPLATES = [
  { name: "Practice mindfulness daily", category: "mental", milestones: [7, 14, 30, 60, 90] },
  { name: "Journal 3 times per week", category: "emotional", milestones: [3, 9, 18, 36, 52] },
  { name: "Exercise 30 minutes daily", category: "physical", milestones: [7, 14, 30, 60, 90] },
  { name: "Sleep 8 hours nightly", category: "health", milestones: [7, 14, 30, 60, 90] },
  { name: "Practice gratitude daily", category: "mental", milestones: [7, 14, 30, 60, 90] },
  { name: "Limit screen time", category: "balance", milestones: [7, 14, 30, 60, 90] },
  { name: "Connect with a friend weekly", category: "social", milestones: [4, 8, 12, 26, 52] },
  { name: "Take breaks at work", category: "balance", milestones: [5, 10, 20, 40, 60] },
];

const CATEGORY_COLORS = {
  mental: "from-purple-400 to-indigo-500",
  emotional: "from-pink-400 to-rose-500",
  physical: "from-orange-400 to-amber-500",
  health: "from-green-400 to-emerald-500",
  social: "from-cyan-400 to-blue-500",
  balance: "from-teal-400 to-cyan-500",
};

export default function GoalProgress() {
  const [goals, setGoals] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: "", category: "mental", targetDays: 30 });
  const [selectedGoal, setSelectedGoal] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("wellness_goals");
    if (saved) {
      setGoals(JSON.parse(saved));
    }
  }, []);

  const saveGoals = (updatedGoals) => {
    setGoals(updatedGoals);
    localStorage.setItem("wellness_goals", JSON.stringify(updatedGoals));
  };

  const addGoal = () => {
    if (!newGoal.name.trim()) return;
    
    const goal = {
      id: Date.now().toString(),
      ...newGoal,
      progress: 0,
      completedDays: [],
      createdAt: new Date().toISOString(),
      milestones: [7, 14, 30, 60, 90].filter(m => m <= newGoal.targetDays),
    };
    
    saveGoals([...goals, goal]);
    setNewGoal({ name: "", category: "mental", targetDays: 30 });
    setShowAdd(false);
  };

  const useTemplate = (template) => {
    setNewGoal({
      name: template.name,
      category: template.category,
      targetDays: Math.max(...template.milestones),
    });
  };

  const markToday = (goalId) => {
    const today = new Date().toISOString().split("T")[0];
    const updatedGoals = goals.map(g => {
      if (g.id === goalId) {
        const alreadyDone = g.completedDays.includes(today);
        const newCompleted = alreadyDone 
          ? g.completedDays.filter(d => d !== today)
          : [...g.completedDays, today];
        return {
          ...g,
          completedDays: newCompleted,
          progress: Math.round((newCompleted.length / g.targetDays) * 100),
        };
      }
      return g;
    });
    saveGoals(updatedGoals);
  };

  const deleteGoal = (goalId) => {
    saveGoals(goals.filter(g => g.id !== goalId));
    if (selectedGoal?.id === goalId) setSelectedGoal(null);
  };

  const isCompletedToday = (goal) => {
    const today = new Date().toISOString().split("T")[0];
    return goal.completedDays.includes(today);
  };

  const getStreak = (goal) => {
    const sortedDays = [...goal.completedDays].sort().reverse();
    if (sortedDays.length === 0) return 0;
    
    const today = new Date();
    let streak = 0;
    let checkDate = new Date(today);
    
    for (let i = 0; i < sortedDays.length; i++) {
      const dateStr = checkDate.toISOString().split("T")[0];
      if (sortedDays.includes(dateStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (i === 0) {
        checkDate.setDate(checkDate.getDate() - 1);
        const yesterdayStr = checkDate.toISOString().split("T")[0];
        if (sortedDays.includes(yesterdayStr)) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      } else {
        break;
      }
    }
    return streak;
  };

  const getNextMilestone = (goal) => {
    return goal.milestones.find(m => goal.completedDays.length < m) || goal.targetDays;
  };

  return (
    <div className="card-elevated p-6 relative overflow-hidden" data-testid="goal-progress">
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-amber-400/10 to-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
              <Target className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-display font-bold text-[var(--text)]" data-testid="text-goal-title">
                Goal Progress
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">Track your wellness journey</p>
            </div>
          </div>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="p-2 rounded-xl bg-[var(--primary)] text-white shadow-md hover:shadow-lg transition-all"
            data-testid="button-add-goal"
            aria-label="Add goal"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {showAdd && (
          <div className="mb-6 p-4 rounded-xl bg-[var(--surface)] animate-fade-in-up">
            <h4 className="font-semibold text-[var(--text)] mb-3">New Goal</h4>
            
            <div className="mb-3">
              <label className="text-sm text-[var(--text-secondary)] mb-1 block">Quick templates:</label>
              <div className="flex flex-wrap gap-2">
                {GOAL_TEMPLATES.slice(0, 4).map((template, i) => (
                  <button
                    key={i}
                    onClick={() => useTemplate(template)}
                    className="px-3 py-1 rounded-full text-xs bg-[var(--bg)] text-[var(--text-secondary)] hover:bg-[var(--primary)] hover:text-white transition-colors"
                    data-testid={`button-template-${i}`}
                  >
                    {template.name}
                  </button>
                ))}
              </div>
            </div>

            <input
              type="text"
              value={newGoal.name}
              onChange={(e) => setNewGoal(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter your goal..."
              className="w-full px-4 py-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] mb-3"
              data-testid="input-goal-name"
              aria-label="Goal name"
            />

            <div className="grid grid-cols-2 gap-3 mb-3">
              <select
                value={newGoal.category}
                onChange={(e) => setNewGoal(prev => ({ ...prev, category: e.target.value }))}
                className="px-4 py-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                data-testid="select-category"
                aria-label="Goal category"
              >
                <option value="mental">Mental</option>
                <option value="emotional">Emotional</option>
                <option value="physical">Physical</option>
                <option value="health">Health</option>
                <option value="social">Social</option>
                <option value="balance">Balance</option>
              </select>
              <select
                value={newGoal.targetDays}
                onChange={(e) => setNewGoal(prev => ({ ...prev, targetDays: Number(e.target.value) }))}
                className="px-4 py-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                data-testid="select-target"
                aria-label="Target days"
              >
                <option value={7}>7 days</option>
                <option value={14}>14 days</option>
                <option value={30}>30 days</option>
                <option value={60}>60 days</option>
                <option value={90}>90 days</option>
              </select>
            </div>

            <button
              onClick={addGoal}
              disabled={!newGoal.name.trim()}
              className="w-full btn-gradient py-3 rounded-xl font-semibold disabled:opacity-50"
              data-testid="button-create-goal"
            >
              Create Goal
            </button>
          </div>
        )}

        {goals.length === 0 && !showAdd && (
          <div className="text-center py-8">
            <Target className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-3" />
            <p className="text-[var(--text-secondary)]">No goals yet.</p>
            <p className="text-sm text-[var(--text-muted)]">Add a goal to start tracking your progress!</p>
          </div>
        )}

        <div className="space-y-3">
          {goals.map((goal) => {
            const streak = getStreak(goal);
            const nextMilestone = getNextMilestone(goal);
            const color = CATEGORY_COLORS[goal.category];
            const todayDone = isCompletedToday(goal);
            
            return (
              <div
                key={goal.id}
                className="p-4 rounded-xl bg-[var(--surface)] transition-all"
                data-testid={`goal-${goal.id}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3 flex-1">
                    <button
                      onClick={() => markToday(goal.id)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                        todayDone
                          ? `bg-gradient-to-br ${color} text-white shadow-md`
                          : "bg-[var(--bg)] text-[var(--text-muted)] hover:text-[var(--primary)]"
                      }`}
                      data-testid={`button-mark-${goal.id}`}
                      aria-label={todayDone ? "Unmark today" : "Mark today as complete"}
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-[var(--text)] truncate">{goal.name}</h4>
                      <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                        <span className="capitalize">{goal.category}</span>
                        {streak > 0 && (
                          <span className="flex items-center gap-1 text-amber-500">
                            <TrendingUp className="w-3 h-3" />
                            {streak} day streak
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedGoal(selectedGoal?.id === goal.id ? null : goal)}
                      className="p-2 rounded-lg hover:bg-[var(--bg)] transition-colors"
                      data-testid={`button-details-${goal.id}`}
                      aria-label="View details"
                    >
                      <ChevronRight className={`w-4 h-4 text-[var(--text-muted)] transition-transform ${selectedGoal?.id === goal.id ? "rotate-90" : ""}`} />
                    </button>
                    <button
                      onClick={() => deleteGoal(goal.id)}
                      className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-[var(--text-muted)] hover:text-red-500 transition-colors"
                      data-testid={`button-delete-${goal.id}`}
                      aria-label="Delete goal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="h-2 bg-[var(--bg)] rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full bg-gradient-to-r ${color} transition-all duration-500`}
                    style={{ width: `${Math.min(goal.progress, 100)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--text-muted)]">
                    {goal.completedDays.length} / {goal.targetDays} days
                  </span>
                  <span className={`font-medium bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
                    {goal.progress}%
                  </span>
                </div>

                {selectedGoal?.id === goal.id && (
                  <div className="mt-4 pt-4 border-t border-[var(--border)] animate-fade-in-up">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex-1 p-3 rounded-xl bg-[var(--bg)] text-center">
                        <Calendar className="w-5 h-5 text-[var(--primary)] mx-auto mb-1" />
                        <div className="text-lg font-bold text-[var(--text)]">{goal.completedDays.length}</div>
                        <div className="text-xs text-[var(--text-muted)]">Days Done</div>
                      </div>
                      <div className="flex-1 p-3 rounded-xl bg-[var(--bg)] text-center">
                        <TrendingUp className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                        <div className="text-lg font-bold text-[var(--text)]">{streak}</div>
                        <div className="text-xs text-[var(--text-muted)]">Current Streak</div>
                      </div>
                      <div className="flex-1 p-3 rounded-xl bg-[var(--bg)] text-center">
                        <Trophy className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                        <div className="text-lg font-bold text-[var(--text)]">{nextMilestone}</div>
                        <div className="text-xs text-[var(--text-muted)]">Next Milestone</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[var(--text-muted)]">Milestones:</span>
                      {goal.milestones.map((m) => (
                        <div
                          key={m}
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                            goal.completedDays.length >= m
                              ? `bg-gradient-to-br ${color} text-white`
                              : "bg-[var(--bg)] text-[var(--text-muted)]"
                          }`}
                        >
                          {goal.completedDays.length >= m ? <Star className="w-4 h-4" /> : m}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
