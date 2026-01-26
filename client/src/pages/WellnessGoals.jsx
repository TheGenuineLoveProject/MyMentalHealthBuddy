import { useState } from "react";
import { Target, Plus, CheckCircle, Circle, Trash2, Edit2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import SEO from "../components/SEO";

export default function WellnessGoals() {
  const [goals, setGoals] = useState([
    { id: 1, title: "Practice mindfulness daily", category: "Mind", progress: 70, target: 30, current: 21, unit: "days" },
    { id: 2, title: "Journal 3 times per week", category: "Reflection", progress: 85, target: 12, current: 10, unit: "entries" },
    { id: 3, title: "Complete breathing exercises", category: "Body", progress: 40, target: 20, current: 8, unit: "sessions" },
    { id: 4, title: "Read self-help content", category: "Learning", progress: 60, target: 5, current: 3, unit: "articles" }
  ]);

  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState("");

  const categories = ["Mind", "Body", "Reflection", "Learning", "Connection", "Creativity"];

  const addGoal = () => {
    if (!newGoalTitle.trim()) return;
    const newGoal = {
      id: Date.now(),
      title: newGoalTitle,
      category: "Mind",
      progress: 0,
      target: 10,
      current: 0,
      unit: "times"
    };
    setGoals([...goals, newGoal]);
    setNewGoalTitle("");
    setShowAddGoal(false);
  };

  const incrementProgress = (goalId) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId && goal.current < goal.target) {
        const newCurrent = goal.current + 1;
        return { ...goal, current: newCurrent, progress: Math.round((newCurrent / goal.target) * 100) };
      }
      return goal;
    }));
  };

  const deleteGoal = (goalId) => {
    setGoals(goals.filter(goal => goal.id !== goalId));
  };

  const getCategoryColor = (category) => {
    const colors = {
      Mind: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
      Body: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
      Reflection: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
      Learning: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
      Connection: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
      Creativity: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
    };
    return colors[category] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Wellness Goals — The Genuine Love Project" />

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold" data-testid="text-page-title">Wellness Goals</h1>
                <p className="text-muted-foreground">Track your personal growth journey</p>
              </div>
            </div>
            <Button
              onClick={() => setShowAddGoal(true)}
              className="min-h-[44px]"
              data-testid="button-add-goal"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Goal
            </Button>
          </div>
        </header>

        {showAddGoal && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <Input
                  placeholder="Enter your wellness goal..."
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  className="min-h-[44px] flex-1"
                  data-testid="input-new-goal"
                />
                <Button onClick={addGoal} className="min-h-[44px]" data-testid="button-save-goal">
                  Save
                </Button>
                <Button variant="outline" onClick={() => setShowAddGoal(false)} className="min-h-[44px]">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <p className="text-3xl font-bold text-primary">{goals.length}</p>
              <p className="text-sm text-muted-foreground">Active Goals</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <p className="text-3xl font-bold text-green-600">{goals.filter(g => g.progress >= 100).length}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <p className="text-3xl font-bold">{Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length)}%</p>
              <p className="text-sm text-muted-foreground">Avg Progress</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <p className="text-3xl font-bold text-amber-600">{goals.filter(g => g.progress > 0 && g.progress < 100).length}</p>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {goals.map(goal => (
            <Card key={goal.id} className={goal.progress >= 100 ? "border-green-500/50" : ""}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => incrementProgress(goal.id)}
                    className="mt-1"
                    data-testid={`check-goal-${goal.id}`}
                    disabled={goal.progress >= 100}
                  >
                    {goal.progress >= 100 ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <Circle className="w-6 h-6 text-muted-foreground hover:text-primary" />
                    )}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{goal.title}</h3>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${getCategoryColor(goal.category)}`}>
                        {goal.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-sm text-muted-foreground">
                        {goal.current} / {goal.target} {goal.unit}
                      </span>
                      <span className="text-sm font-medium text-primary">{goal.progress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${goal.progress >= 100 ? "bg-green-500" : "bg-primary"}`}
                        style={{ width: `${Math.min(100, goal.progress)}%` }}
                      />
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="min-h-[44px] min-w-[44px] text-muted-foreground hover:text-destructive"
                    onClick={() => deleteGoal(goal.id)}
                    data-testid={`delete-goal-${goal.id}`}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {goals.length === 0 && (
          <div className="text-center py-12">
            <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No goals yet. Start your wellness journey!</p>
            <Button onClick={() => setShowAddGoal(true)} className="min-h-[44px]">
              <Plus className="w-4 h-4 mr-2" /> Create Your First Goal
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
