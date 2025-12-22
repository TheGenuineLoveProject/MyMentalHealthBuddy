import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Heart, Sparkles, Shield, Brain, Wind, Target, ChevronRight, ChevronLeft, Check, Sun, Moon, Leaf } from "lucide-react";

const STEPS = ["goals", "support", "reminders", "disclaimer"];

const GOAL_OPTIONS = [
  { id: "self_love", label: "Self Love", icon: Heart },
  { id: "anxiety_relief", label: "Anxiety Relief", icon: Wind },
  { id: "stress_management", label: "Stress Management", icon: Shield },
  { id: "emotional_healing", label: "Emotional Healing", icon: Sparkles },
  { id: "mindfulness", label: "Mindfulness", icon: Brain },
  { id: "personal_growth", label: "Personal Growth", icon: Target },
  { id: "better_sleep", label: "Better Sleep", icon: Moon },
  { id: "confidence", label: "Build Confidence", icon: Sun },
  { id: "relationships", label: "Relationships", icon: Heart },
  { id: "grief_support", label: "Grief Support", icon: Leaf },
];

const SUPPORT_MODES = [
  { id: "reflection", label: "Reflection", description: "Gentle prompts to explore your thoughts and feelings" },
  { id: "coaching", label: "Coaching", description: "Goal-oriented guidance with actionable steps" },
  { id: "grounding", label: "Grounding", description: "Calming techniques for anxiety and stress" },
  { id: "cbt", label: "CBT", description: "Cognitive behavioral approaches to challenge negative thoughts" },
  { id: "general", label: "General", description: "Flexible support adapting to your needs" },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [supportMode, setSupportMode] = useState("reflection");
  const [reminderTime, setReminderTime] = useState("");
  const [reminderDays, setReminderDays] = useState<string[]>([]);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);

  const completeMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("/api/onboarding/complete", {
        method: "POST",
        body: JSON.stringify({
          goals: selectedGoals,
          supportMode,
          reminderTime: reminderTime || null,
          reminderDays,
          disclaimerAccepted,
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/onboarding/status"] });
      toast({ title: "Welcome!", description: "Your journey begins now." });
      setLocation("/dashboard");
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const canGoBack = currentStep > 0;
  const canGoForward = currentStep < STEPS.length - 1;

  const validateStep = (): boolean => {
    if (STEPS[currentStep] === "goals" && selectedGoals.length === 0) {
      toast({ title: "Please select at least one goal", variant: "destructive" });
      return false;
    }
    if (STEPS[currentStep] === "disclaimer" && !disclaimerAccepted) {
      toast({ title: "Please accept the disclaimer to continue", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (canGoForward) {
      setCurrentStep(currentStep + 1);
    } else {
      completeMutation.mutate();
    }
  };

  const handleBack = () => {
    if (canGoBack) setCurrentStep(currentStep - 1);
  };

  const toggleGoal = (goalId: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goalId) ? prev.filter((g) => g !== goalId) : [...prev, goalId]
    );
  };

  const toggleDay = (day: string) => {
    setReminderDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl" data-testid="card-onboarding">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-2">
              {STEPS.map((step, i) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      i < currentStep
                        ? "bg-green-600 text-white"
                        : i === currentStep
                        ? "bg-green-600 text-white ring-2 ring-green-200"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                    }`}
                    data-testid={`step-indicator-${step}`}
                  >
                    {i < currentStep ? <Check className="w-4 h-4" /> : i + 1}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`w-8 h-0.5 ${i < currentStep ? "bg-green-600" : "bg-gray-200 dark:bg-gray-700"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
          <CardTitle className="text-2xl text-green-700 dark:text-green-400" data-testid="text-onboarding-title">
            {STEPS[currentStep] === "goals" && "What brings you here?"}
            {STEPS[currentStep] === "support" && "How would you like support?"}
            {STEPS[currentStep] === "reminders" && "Set up reminders"}
            {STEPS[currentStep] === "disclaimer" && "Almost there!"}
          </CardTitle>
          <CardDescription data-testid="text-onboarding-description">
            {STEPS[currentStep] === "goals" && "Select the areas you'd like to focus on"}
            {STEPS[currentStep] === "support" && "Choose your preferred support style"}
            {STEPS[currentStep] === "reminders" && "Optional: Get gentle nudges to check in"}
            {STEPS[currentStep] === "disclaimer" && "Please review and accept to continue"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {STEPS[currentStep] === "goals" && (
            <div className="grid grid-cols-2 gap-3" data-testid="section-goals">
              {GOAL_OPTIONS.map((goal) => {
                const Icon = goal.icon;
                const isSelected = selectedGoals.includes(goal.id);
                return (
                  <button
                    key={goal.id}
                    onClick={() => toggleGoal(goal.id)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      isSelected
                        ? "border-green-600 bg-green-50 dark:bg-green-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-green-400"
                    }`}
                    data-testid={`button-goal-${goal.id}`}
                  >
                    <Icon className={`w-5 h-5 mb-2 ${isSelected ? "text-green-600" : "text-gray-400"}`} />
                    <span className={`font-medium ${isSelected ? "text-green-700 dark:text-green-400" : ""}`}>{goal.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {STEPS[currentStep] === "support" && (
            <div className="space-y-3" data-testid="section-support">
              {SUPPORT_MODES.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setSupportMode(mode.id)}
                  className={`w-full flex items-start space-x-3 p-4 rounded-lg border-2 text-left transition-all ${
                    supportMode === mode.id
                      ? "border-green-600 bg-green-50 dark:bg-green-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-green-400"
                  }`}
                  data-testid={`option-support-${mode.id}`}
                >
                  <div className={`w-4 h-4 mt-1 rounded-full border-2 flex items-center justify-center ${
                    supportMode === mode.id ? "border-green-600 bg-green-600" : "border-gray-400"
                  }`}>
                    {supportMode === mode.id && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <div>
                    <div className="font-medium">{mode.label}</div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{mode.description}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {STEPS[currentStep] === "reminders" && (
            <div className="space-y-6" data-testid="section-reminders">
              <div>
                <label className="block mb-2 font-medium">Reminder time (optional)</label>
                <select
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="w-full p-3 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700"
                  data-testid="select-reminder-time"
                >
                  <option value="">Select a time</option>
                  <option value="morning">Morning (8:00 AM)</option>
                  <option value="afternoon">Afternoon (2:00 PM)</option>
                  <option value="evening">Evening (7:00 PM)</option>
                </select>
              </div>

              {reminderTime && (
                <div>
                  <label className="block mb-2 font-medium">Which days?</label>
                  <div className="flex gap-2 flex-wrap">
                    {DAYS.map((day) => (
                      <button
                        key={day}
                        onClick={() => toggleDay(day)}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          reminderDays.includes(day)
                            ? "bg-green-600 text-white"
                            : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200"
                        }`}
                        data-testid={`button-day-${day.toLowerCase()}`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-sm text-gray-500">
                You can skip this step and set up reminders later in settings.
              </p>
            </div>
          )}

          {STEPS[currentStep] === "disclaimer" && (
            <div className="space-y-4" data-testid="section-disclaimer">
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-2">Important Notice</h4>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  This app provides wellness support and is not a substitute for professional mental health care.
                  If you're experiencing a mental health crisis, please contact emergency services or a crisis hotline.
                </p>
              </div>

              <label className="flex items-start space-x-3 p-4 rounded-lg border cursor-pointer">
                <input
                  type="checkbox"
                  checked={disclaimerAccepted}
                  onChange={(e) => setDisclaimerAccepted(e.target.checked)}
                  className="mt-1 w-5 h-5 accent-green-600"
                  data-testid="checkbox-disclaimer"
                />
                <span className="text-sm leading-relaxed">
                  I understand that this app is for wellness support only and is not a replacement for professional
                  mental health services. I agree to the{" "}
                  <a href="/terms" className="text-green-600 underline">Terms of Service</a>{" "}
                  and{" "}
                  <a href="/privacy" className="text-green-600 underline">Privacy Policy</a>.
                </span>
              </label>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={!canGoBack}
              data-testid="button-back"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>

            <Button
              onClick={handleNext}
              disabled={completeMutation.isPending}
              className="bg-green-600 hover:bg-green-700 text-white"
              data-testid="button-next"
            >
              {completeMutation.isPending ? (
                "Saving..."
              ) : currentStep === STEPS.length - 1 ? (
                <>Complete <Check className="w-4 h-4 ml-1" /></>
              ) : (
                <>Next <ChevronRight className="w-4 h-4 ml-1" /></>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
