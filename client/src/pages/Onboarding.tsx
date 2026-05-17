import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Heart, Sparkles, Shield, Brain, Wind, Target, ChevronRight, ChevronLeft, Check, Sun, Moon, Leaf, Flower2, Users } from 'lucide-react';
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import { deriveGovernance } from "@/governance/interactions/deriveGovernance";
import { buildGovernanceAttrs } from "@/governance/interactions/buildGovernanceAttrs";
import { HEALING_FLOW_PROTECTION_RULES } from "@/governance/interactions/HealingFlowProtectionRules";

// HX-OS Interaction Governance — onboarding goal-selections that correlate
// with vulnerability per MMHB v7.4 BHCE. Pure enum lookup over the existing
// GOAL_OPTIONS list — no rewrite of onboarding step/copy/visuals.
const VULNERABLE_GOAL_IDS = new Set<string>([
  "grief_support",
  "anxiety_relief",
  "emotional_healing",
  "stress_management",
]);

// Per HealingFlowProtectionRules.protectedHealingFlows — onboarding configures
// "companion_support" + "reflection" surfaces (both in the 8-flow protected
// list). Pinned constant.
  HEALING_FLOW_PROTECTION_RULES.isProtected("companion_support") ||
  HEALING_FLOW_PROTECTION_RULES.isProtected("reflection");

const STEPS = ["intro", "goals", "support", "reminders", "disclaimer"];

const INTRO_SLIDES = [
  {
    icon: Heart,
    title: "Welcome to Your Private Space",
    description: "You've created your account. Here's a quick look at what's available — use what feels useful, skip the rest.",
    color: "#f4c7c3"
  },
  {
    icon: Flower2,
    title: "A Safe, Private Space",
    description: "This is a private, judgment-free space where you can reflect, journal, and check in with yourself at your own pace.",
    color: "#8fbf9f"
  },
  {
    icon: Users,
    title: "You're Not Alone",
    description: "A quiet community of people using these tools in their own way. Share anonymously if you'd like — or just read.",
    color: "#eac33b"
  }
];

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
  const [introSlide, setIntroSlide] = useState(0);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [supportMode, setSupportMode] = useState("reflection");
  const [reminderTime, setReminderTime] = useState("");
  const [reminderDays, setReminderDays] = useState<string[]>([]);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);

  const { data: authData, isLoading: authLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  useEffect(() => {
    if (!authLoading && !authData) {
      window.location.href = "/login";
    }
  }, [authLoading, authData]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-[var(--sage-600)]">Loading...</div>
      </div>
    );
  }

  if (!authData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4">Please sign in to continue</p>
          <a href="/login" className="btn btn-gradient">Sign In</a>
        </div>
      </div>
    );
  }

  const handleIntroNext = () => {
    if (introSlide < INTRO_SLIDES.length - 1) {
      setIntroSlide(introSlide + 1);
    } else {
      setCurrentStep(1);
    }
  };

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

  // HX-OS Interaction Governance — Runtime Enforcement (v5.8.125, Onboarding iter 7).
  // Passive observation only. No fetch, no AI, no UI mutation, no behavior change,
  // no step/copy/animation/route change. /onboarding has no free-text input — the
  // crisisDetected memo is pinned `false` for attr-contract uniformity. Vulnerability
  // is derived from goal selections (read-only lookup over existing GOAL_OPTIONS).
  const crisisDetected = useMemo(() => false, []);

  const vulnerableState = useMemo(
    () => selectedGoals.some((g) => VULNERABLE_GOAL_IDS.has(g)),
    [selectedGoals],
  );

  const governance = useMemo(
    () =>
      deriveGovernance({
        route: "/onboarding",
        healingFlow: true,
        crisisDetected,
        vulnerable: vulnerableState,
        escalation: true,
      }),
    [crisisDetected, vulnerableState],
  );

  const governanceAttrs = useMemo(
    () =>
      buildGovernanceAttrs({
        surface: "onboarding",
        healingFlow: true,
        crisisDetected,
        vulnerable: vulnerableState,
        overrideState: governance.overrideState,
        monetizationGate: governance.monetizationGate,
      }),
    [crisisDetected, vulnerableState, governance],
  );

  return (
  <WellnessPageShell
    title="Onboarding"
    subtitle="Educational reflection tools. Choose what feels safe and supportive."
    benefits={pickBenefits(["agency","calm","clarity","selfRespect","meaning"], 5)}
    clarity={{
      what: "A self-paced reflection tool you control.",
      why: "To support clarity, values alignment, and gentle next steps.",
      who: "For adults (18+) who want educational wellness tools (not medical care).",
      when: "Anytime you want a small reset or a thoughtful pause.",
      where: "Anywhere you can breathe and write for 1–5 minutes.",
      how: "Pick one prompt, answer briefly, stop whenever you want."
    }}
    examples={[
      { label: "Beginner", examples: ["Write one honest sentence about how you feel.", "Name one value you want to protect today."] },
      { label: "Intermediate", examples: ["Describe the situation + the need underneath it.", "Write a boundary you could try in one sentence."] },
      { label: "Advanced", examples: ["Identify a pattern and the smallest experiment to change it.", "Write a compassionate reframe and one measurable step."] }
    ]}
  >

    <div
      className="min-h-screen v28-paper-bg flex items-center justify-center p-4"
      {...governanceAttrs}
    >
      <div className="w-full max-w-2xl card-bordered" data-testid="card-onboarding">
        {/* Intro Carousel */}
        {STEPS[currentStep] === "intro" && (
          <div className="text-center py-8" data-testid="section-intro-carousel">
            {/* Carousel Slide */}
            <div className="mb-8">
              <div 
                className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
                style={{ 
                  background: `linear-gradient(135deg, ${INTRO_SLIDES[introSlide].color}, rgba(47, 93, 93, 0.2))`,
                  animation: 'pulse 3s ease-in-out infinite'
                }}
              >
                {(() => {
                  const Icon = INTRO_SLIDES[introSlide].icon;
                  return <Icon className="w-12 h-12 text-white" />;
                })()}
              </div>
              <h1 className="text-display-lg text-teal mb-4" data-testid="text-intro-title">
                {INTRO_SLIDES[introSlide].title}
              </h1>
              <p className="text-lead max-w-md mx-auto" data-testid="text-intro-description">
                {INTRO_SLIDES[introSlide].description}
              </p>
            </div>

            {/* Carousel Dots */}
            <div className="flex justify-center gap-3 mb-8">
              {INTRO_SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIntroSlide(i)}
                  className={`transition-all ${
                    i === introSlide 
                      ? "w-8 h-3 rounded-full bg-[var(--sage-500)]" 
                      : "w-3 h-3 rounded-full bg-[var(--sage-200)] hover:bg-[var(--sage-300)]"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                  data-testid={`button-intro-dot-${i}`}
                />
              ))}
            </div>

            {/* Carousel Navigation */}
            <div className="flex justify-center gap-4">
              <Button
                onClick={handleIntroNext}
                className="px-8"
                data-testid="button-intro-next"
              >
                {introSlide < INTRO_SLIDES.length - 1 ? "Next" : "Get Started"}
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
            <button
              onClick={() => setCurrentStep(1)}
              className="mt-4 text-sm text-[var(--sage-500)] hover:text-[var(--teal-500)] transition-colors"
              data-testid="button-skip-intro"
            >
              Skip Introduction
            </button>
          </div>
        )}

        {/* Regular Steps (Goals, Support, Reminders, Disclaimer) */}
        {STEPS[currentStep] !== "intro" && (
          <>
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <div className="flex items-center gap-2">
                  {STEPS.filter(s => s !== "intro").map((step, i) => (
                    <div key={step} className="flex items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                          i < currentStep - 1
                            ? "bg-[var(--sage-500)] text-white"
                            : i === currentStep - 1
                            ? "bg-[var(--teal-500)] text-white ring-2 ring-[var(--teal-200)]"
                            : "bg-[var(--sage-200)] text-[var(--sage-500)]"
                        }`}
                        data-testid={`step-indicator-${step}`}
                      >
                        {i < currentStep - 1 ? <Check className="w-5 h-5" /> : i + 1}
                      </div>
                      {i < STEPS.length - 2 && (
                        <div className={`w-10 h-1 rounded ${i < currentStep - 1 ? "bg-[var(--sage-500)]" : "bg-[var(--sage-200)]"}`} />
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
          </>
        )}

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
  </WellnessPageShell>
  );
}
