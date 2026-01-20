import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Heart, Sparkles, Shield, Brain, Wind, Target, ChevronRight, ChevronLeft, Check, Sun, Moon, Leaf } from "lucide-react";

const STEPS = ["goals", "support", "reminders", "disclaimer"];

const GOAL_OPTIONS = [
  { id: "self_love", label: "Self Love", icon: Heart, color: "blush" },
  { id: "anxiety_relief", label: "Anxiety Relief", icon: Wind, color: "teal" },
  { id: "stress_management", label: "Stress Management", icon: Shield, color: "sage" },
  { id: "emotional_healing", label: "Emotional Healing", icon: Sparkles, color: "gold" },
  { id: "mindfulness", label: "Mindfulness", icon: Brain, color: "teal" },
  { id: "personal_growth", label: "Personal Growth", icon: Target, color: "sage" },
  { id: "better_sleep", label: "Better Sleep", icon: Moon, color: "blush" },
  { id: "confidence", label: "Build Confidence", icon: Sun, color: "gold" },
  { id: "relationships", label: "Relationships", icon: Heart, color: "blush" },
  { id: "grief_support", label: "Grief Support", icon: Leaf, color: "sage" },
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
      return apiRequest("POST", "/api/onboarding/complete", {
        goals: selectedGoals,
        supportMode,
        reminderTime: reminderTime || null,
        reminderDays,
        disclaimerAccepted,
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
    <div className="min-h-screen hero-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-2xl card-bordered" data-testid="card-onboarding">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2">
              {STEPS.map((step, i) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      i < currentStep
                        ? "bg-[var(--sage-500)] text-white"
                        : i === currentStep
                        ? "bg-[var(--teal-500)] text-white ring-2 ring-[var(--teal-200)]"
                        : "bg-[var(--sage-200)] text-[var(--sage-500)]"
                    }`}
                    data-testid={`step-indicator-${step}`}
                  >
                    {i < currentStep ? <Check className="w-5 h-5" /> : i + 1}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`w-10 h-1 rounded ${i < currentStep ? "bg-[var(--sage-500)]" : "bg-[var(--sage-200)]"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
          <h1 className="text-display-lg text-teal" data-testid="text-onboarding-title">
            {STEPS[currentStep] === "goals" && "What brings you here?"}
            {STEPS[currentStep] === "support" && "How would you like support?"}
            {STEPS[currentStep] === "reminders" && "Set up reminders"}
            {STEPS[currentStep] === "disclaimer" && "Almost there!"}
          </h1>
          <p className="text-lead mt-2" data-testid="text-onboarding-description">
            {STEPS[currentStep] === "goals" && "Select the areas you'd like to focus on"}
            {STEPS[currentStep] === "support" && "Choose your preferred support style"}
            {STEPS[currentStep] === "reminders" && "Optional: Get gentle nudges to check in"}
            {STEPS[currentStep] === "disclaimer" && "Please review and accept to continue"}
          </p>
        </div>

        <div className="space-y-6">
          {STEPS[currentStep] === "goals" && (
            <div className="grid grid-cols-2 gap-3" data-testid="section-goals">
              {GOAL_OPTIONS.map((goal) => {
                const Icon = goal.icon;
                const isSelected = selectedGoals.includes(goal.id);
                return (
                  <button
                    key={goal.id}
                    onClick={() => toggleGoal(goal.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      isSelected
                        ? `border-[var(--${goal.color}-500)] bg-[var(--${goal.color}-50)]`
                        : "border-[var(--sage-200)] hover:border-[var(--sage-400)] bg-white"
                    }`}
                    data-testid={`button-goal-${goal.id}`}
                  >
                    <div className={`icon-container icon-sm mb-2 ${isSelected ? `icon-soft-${goal.color}` : 'icon-soft-sage'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className={`font-medium text-body-sm ${isSelected ? "text-[var(--teal-700)]" : ""}`}>{goal.label}</span>
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
                  className={`w-full flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                    supportMode === mode.id
                      ? "border-[var(--teal-500)] bg-[var(--sage-50)]"
                      : "border-[var(--sage-200)] hover:border-[var(--sage-400)] bg-white"
                  }`}
                  data-testid={`option-support-${mode.id}`}
                >
                  <div className={`w-5 h-5 mt-1 rounded-full border-2 flex items-center justify-center ${
                    supportMode === mode.id ? "border-[var(--teal-500)] bg-[var(--teal-500)]" : "border-[var(--sage-400)]"
                  }`}>
                    {supportMode === mode.id && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <div>
                    <div className="text-heading-sm text-teal">{mode.label}</div>
                    <p className="text-body-sm text-[var(--sage-500)]">{mode.description}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {STEPS[currentStep] === "reminders" && (
            <div className="space-y-6" data-testid="section-reminders">
              <div className="form-group">
                <label className="form-label">Reminder time (optional)</label>
                <select
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[var(--sage-200)] bg-white focus:border-[var(--sage-500)] focus:ring-2 focus:ring-[var(--sage-200)] outline-none"
                  data-testid="select-reminder-time"
                >
                  <option value="">Select a time</option>
                  <option value="morning">Morning (8:00 AM)</option>
                  <option value="afternoon">Afternoon (2:00 PM)</option>
                  <option value="evening">Evening (7:00 PM)</option>
                </select>
              </div>

              {reminderTime && (
                <div className="form-group">
                  <label className="form-label">Which days?</label>
                  <div className="flex gap-2 flex-wrap">
                    {DAYS.map((day) => (
                      <button
                        key={day}
                        onClick={() => toggleDay(day)}
                        className={`px-4 py-2 rounded-xl text-body-sm font-medium transition-colors ${
                          reminderDays.includes(day)
                            ? "bg-[var(--teal-500)] text-white"
                            : "bg-[var(--sage-100)] hover:bg-[var(--sage-200)]"
                        }`}
                        data-testid={`button-day-${day.toLowerCase()}`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-caption">
                You can skip this step and set up reminders later in settings.
              </p>
            </div>
          )}

          {STEPS[currentStep] === "disclaimer" && (
            <div className="space-y-4" data-testid="section-disclaimer">
              <div className="p-4 bg-[var(--gold-50)] rounded-xl border border-[var(--gold-200)]">
                <h4 className="text-heading-sm text-[var(--gold-700)] mb-2">Important Notice</h4>
                <p className="text-body-sm text-[var(--gold-600)]">
                  This app provides wellness support and is not a substitute for professional mental health care.
                  If you're experiencing a mental health crisis, please contact emergency services or a crisis hotline.
                </p>
              </div>

              <label className="flex items-start gap-3 p-4 rounded-xl border border-[var(--sage-200)] cursor-pointer hover:bg-[var(--sage-50)] transition">
                <input
                  type="checkbox"
                  checked={disclaimerAccepted}
                  onChange={(e) => setDisclaimerAccepted(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded accent-[var(--teal-500)]"
                  data-testid="checkbox-disclaimer"
                />
                <span className="text-body-sm leading-relaxed">
                  I understand that this app is for wellness support only and is not a replacement for professional
                  mental health services. I agree to the{" "}
                  <a href="/terms" className="text-[var(--teal-600)] underline">Terms of Service</a>{" "}
                  and{" "}
                  <a href="/privacy" className="text-[var(--teal-600)] underline">Privacy Policy</a>.
                </span>
              </label>
            </div>
          )}

          <div className="flex justify-between pt-6 border-t border-[var(--sage-200)]">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={!canGoBack}
              className="btn-secondary-premium"
              data-testid="button-back"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>

            <Button
              onClick={handleNext}
              disabled={completeMutation.isPending}
              className="btn-premium"
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
        </div>
      </div>
    </div>
  );
}
