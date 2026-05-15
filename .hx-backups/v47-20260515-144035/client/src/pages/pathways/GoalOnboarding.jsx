import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowRight, ArrowLeft, Check, Heart, Brain, Shield, Sparkles, Target, Sun } from "lucide-react";
import SEO from "../../components/SEO";
import { Button } from "@/components/ui/Button.jsx";
import { Card, CardContent } from "@/components/ui/Card.jsx";
import BuddyPanel from "@/components/avatar/BuddyPanel";
import { BUDDY_PANEL_COPY } from "@/content/microcopy/wellnessMicrocopy";

const GOALS = [
  { id: "self-love", label: "Build self-compassion", icon: Heart, color: "text-rose-500" },
  { id: "emotional", label: "Understand my emotions", icon: Brain, color: "text-purple-500" },
  { id: "calm", label: "Find more calm", icon: Shield, color: "text-teal-500" },
  { id: "connection", label: "Improve relationships", icon: Sparkles, color: "text-pink-500" },
  { id: "purpose", label: "Discover my purpose", icon: Target, color: "text-indigo-500" },
  { id: "healing", label: "Support my healing", icon: Sun, color: "text-amber-500" }
];

const EXPERIENCE_LEVELS = [
  { id: "new", label: "New to wellness practices", description: "Just starting out" },
  { id: "some", label: "Some experience", description: "Tried a few things" },
  { id: "regular", label: "Regular practitioner", description: "Have established habits" }
];

const TIME_PREFERENCES = [
  { id: "quick", label: "Quick practices (1-5 min)" },
  { id: "moderate", label: "Moderate sessions (5-15 min)" },
  { id: "deep", label: "Deeper work (15+ min)" }
];

export default function GoalOnboarding() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [experience, setExperience] = useState("");
  const [timePreference, setTimePreference] = useState("");

  const toggleGoal = (goalId) => {
    setSelectedGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(g => g !== goalId)
        : [...prev, goalId]
    );
  };

  const canProceed = () => {
    if (step === 1) return selectedGoals.length > 0;
    if (step === 2) return experience !== "";
    if (step === 3) return timePreference !== "";
    return true;
  };

  const handleComplete = () => {
    const preferences = { selectedGoals, experience, timePreference };
    localStorage.setItem("glp_onboarding_preferences", JSON.stringify(preferences));
    setLocation("/pathways");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <SEO 
        title="Choose Your Goals — The Genuine Love Project"
        description="Set your wellness goals to get personalized recommendations."
      />

      {/* v2.3 BuddyPanel placement — calm/88px work-surface treatment, matching
          /journal and /state. State is FIXED to "calm" — no inference from the
          user's goal/experience/time selections per BuddyPanel placement contract.
          Visual-only — no fetch, no AI, no profile/streak/paywall logic. */}
      <BuddyPanel
        state="calm"
        title={BUDDY_PANEL_COPY.onboarding.title}
        titleAs="p"
        subtitle={BUDDY_PANEL_COPY.onboarding.subtitle}
        surface="onboarding"
        size={88}
        className="w-full max-w-2xl mb-6"
        data-testid="panel-buddy-onboarding"
      />

      <Card className="w-full max-w-2xl">
        <CardContent className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex gap-2">
              {[1, 2, 3].map(s => (
                <div 
                  key={s}
                  className={`w-8 h-2 rounded-full transition-colors ${
                    s <= step ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">Step {step} of 3</span>
          </div>

          {step === 1 && (
            <div>
              <h1 className="text-2xl font-bold mb-2">What brings you here?</h1>
              <p className="text-muted-foreground mb-6">Select all that resonate with you.</p>
              
              <div className="grid gap-3 sm:grid-cols-2">
                {GOALS.map(goal => {
                  const Icon = goal.icon;
                  const isSelected = selectedGoals.includes(goal.id);
                  return (
                    <button
                      key={goal.id}
                      onClick={() => toggleGoal(goal.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${
                        isSelected 
                          ? "border-primary bg-primary/5" 
                          : "border-border hover:border-primary/50"
                      }`}
                      data-testid={`goal-${goal.id}`}
                    >
                      <Icon className={`w-5 h-5 ${goal.color}`} />
                      <span className="font-medium">{goal.label}</span>
                      {isSelected && <Check className="w-4 h-4 text-primary ml-auto" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h1 className="text-2xl font-bold mb-2">Your experience level</h1>
              <p className="text-muted-foreground mb-6">This helps us tailor recommendations.</p>
              
              <div className="grid gap-3">
                {EXPERIENCE_LEVELS.map(level => (
                  <button
                    key={level.id}
                    onClick={() => setExperience(level.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      experience === level.id 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-primary/50"
                    }`}
                    data-testid={`experience-${level.id}`}
                  >
                    <span className="font-medium block">{level.label}</span>
                    <span className="text-sm text-muted-foreground">{level.description}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h1 className="text-2xl font-bold mb-2">Time preference</h1>
              <p className="text-muted-foreground mb-6">How much time can you dedicate?</p>
              
              <div className="grid gap-3">
                {TIME_PREFERENCES.map(pref => (
                  <button
                    key={pref.id}
                    onClick={() => setTimePreference(pref.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      timePreference === pref.id 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-primary/50"
                    }`}
                    data-testid={`time-${pref.id}`}
                  >
                    <span className="font-medium">{pref.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8">
            <Button
              variant="ghost"
              onClick={() => setStep(s => s - 1)}
              disabled={step === 1}
              data-testid="button-back"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            {step < 3 ? (
              <Button
                onClick={() => setStep(s => s + 1)}
                disabled={!canProceed()}
                data-testid="button-next"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={!canProceed()}
                data-testid="button-complete"
              >
                <Check className="w-4 h-4 mr-2" />
                Complete Setup
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
