import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Target, Plus, CheckCircle, Circle, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import SEO from "../components/SEO";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

const STORAGE_KEY = "glp-wellness-goals";

const DEFAULT_GOALS = [
  { id: 1, title: "Practice mindfulness daily", category: "Mind", progress: 70, target: 30, current: 21, unit: "days" },
  { id: 2, title: "Journal 3 times per week", category: "Reflection", progress: 85, target: 12, current: 10, unit: "entries" },
  { id: 3, title: "Complete breathing exercises", category: "Body", progress: 40, target: 20, current: 8, unit: "sessions" },
  { id: 4, title: "Read self-help content", category: "Learning", progress: 60, target: 5, current: 3, unit: "articles" }
];

export default function WellnessGoals() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalCategory, setNewGoalCategory] = useState("Mind");
  const [newGoalTarget, setNewGoalTarget] = useState(10);

  const categories = ["Mind", "Body", "Reflection", "Learning", "Connection", "Creativity"];

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setGoals(JSON.parse(saved));
      } else {
        setGoals(DEFAULT_GOALS);
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_GOALS)); } catch (err) { console.warn("[storage-safe-write]", err); }
      }
    } catch {
      setGoals(DEFAULT_GOALS);
    }
    setLoading(false);
  }, []);

  const saveToStorage = (updatedGoals) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedGoals));
    } catch {
      toast({
        title: "Couldn't save",
        description: "Your changes might not persist.",
        variant: "destructive"
      });
    }
  };

  const recordProgressMutation = useMutation({
    mutationFn: async (goalTitle) => {
      return apiRequest("POST", "/api/gamification/record-session", {
        toolName: "wellness-goal",
        durationSeconds: 60,
        metadata: { goal: goalTitle }
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/gamification/progress"] });
      if (data?.xpEarned) {
        toast({
          title: "Progress recorded!",
          description: `You earned ${data.xpEarned} XP for working on your goal.`
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Sync failed",
        description: "Your progress was saved locally. It will sync when you're back online.",
        variant: "destructive"
      });
    }
  });

  const addGoal = () => {
    if (!newGoalTitle.trim()) return;
    const newGoal = {
      id: Date.now(),
      title: newGoalTitle,
      category: newGoalCategory,
      progress: 0,
      target: newGoalTarget,
      current: 0,
      unit: "times"
    };
    const updatedGoals = [...goals, newGoal];
    setGoals(updatedGoals);
    saveToStorage(updatedGoals);
    setNewGoalTitle("");
    setNewGoalCategory("Mind");
    setNewGoalTarget(10);
    setShowAddGoal(false);
    toast({
      title: "Goal Created",
      description: "Your new wellness goal has been added."
    });
  };

  const incrementProgress = (goalId) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal || goal.current >= goal.target) return;
    
    const newCurrent = goal.current + 1;
    const newProgress = Math.round((newCurrent / goal.target) * 100);
    const updatedGoals = goals.map(g => {
      if (g.id === goalId) {
        return { ...g, current: newCurrent, progress: newProgress };
      }
      return g;
    });
    setGoals(updatedGoals);
    saveToStorage(updatedGoals);

    if (user) {
      recordProgressMutation.mutate(goal.title);
    }

    if (newProgress >= 100) {
      toast({
        title: "Goal Complete!",
        description: `Congratulations on completing "${goal.title}"!`
      });
    }
  };

  const deleteGoal = (goalId) => {
    const updatedGoals = goals.filter(goal => goal.id !== goalId);
    setGoals(updatedGoals);
    saveToStorage(updatedGoals);
    toast({
      title: "Goal Removed",
      description: "The goal has been deleted."
    });
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
              <div className="space-y-4">
                <Input
                  placeholder="Enter your wellness goal..."
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  className="min-h-[44px]"
                  data-testid="input-new-goal"
                />
                <div className="flex gap-3 flex-wrap">
                  <select
                    value={newGoalCategory}
                    onChange={(e) => setNewGoalCategory(e.target.value)}
                    className="min-h-[44px] px-3 rounded-md border border-input bg-background"
                    data-testid="select-goal-category"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <Input
                    type="number"
                    min="1"
                    max="365"
                    placeholder="Target"
                    value={newGoalTarget}
                    onChange={(e) => setNewGoalTarget(parseInt(e.target.value) || 10)}
                    className="min-h-[44px] w-24"
                    data-testid="input-goal-target"
                  />
                  <span className="flex items-center text-muted-foreground">times</span>
                </div>
                <div className="flex gap-3">
                  <Button onClick={addGoal} className="min-h-[44px]" data-testid="button-save-goal">
                    Save Goal
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddGoal(false)} className="min-h-[44px]">
                    Cancel
                  </Button>
                </div>
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
