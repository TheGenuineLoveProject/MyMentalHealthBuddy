import { useState } from "react";
import { ChevronRight, CheckCircle2, Calendar, Shield, Sparkles } from "lucide-react";

interface MicroCommitmentEngineProps {
  context?: string;
  className?: string;
  onComplete?: (commitment: CommitmentData) => void;
}

interface CommitmentData {
  nextStep: string;
  whenWhere: string;
  obstacle: string;
  ifThenPlan: string;
}

const STEP_PROMPTS = {
  nextStep: {
    title: "One Tiny Next Step",
    prompt: "What's the smallest action you could take in the next 24 hours?",
    placeholder: "e.g., Take 3 deep breaths before bed tonight",
    icon: Sparkles,
  },
  whenWhere: {
    title: "When & Where",
    prompt: "When and where will you do this?",
    placeholder: "e.g., Tonight at 10pm, in my bedroom",
    icon: Calendar,
  },
  obstacle: {
    title: "What Might Get in the Way",
    prompt: "What's one thing that might make this harder?",
    placeholder: "e.g., I might forget or get distracted",
    icon: Shield,
  },
  ifThenPlan: {
    title: "Your If-Then Plan",
    prompt: "If that happens, then I will...",
    placeholder: "e.g., Set a phone reminder for 9:55pm",
    icon: CheckCircle2,
  },
};

export function MicroCommitmentEngine({ 
  context = "general", 
  className = "",
  onComplete 
}: MicroCommitmentEngineProps) {
  const [step, setStep] = useState(0);
  const [commitment, setCommitment] = useState<CommitmentData>({
    nextStep: "",
    whenWhere: "",
    obstacle: "",
    ifThenPlan: "",
  });
  const [isComplete, setIsComplete] = useState(false);

  const steps = ["nextStep", "whenWhere", "obstacle", "ifThenPlan"] as const;
  const currentStepKey = steps[step];
  const currentPrompt = STEP_PROMPTS[currentStepKey];
  const Icon = currentPrompt.icon;

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setIsComplete(true);
      onComplete?.(commitment);
    }
  };

  const handleChange = (value: string) => {
    setCommitment({ ...commitment, [currentStepKey]: value });
  };

  if (isComplete) {
    return (
      <div className={`rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/20 p-6 ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-lg font-medium text-emerald-800 dark:text-emerald-200">
            Your Commitment
          </h3>
        </div>
        
        <div className="space-y-3 text-sm">
          <div className="p-3 rounded-lg bg-white/60 dark:bg-gray-800/60">
            <span className="font-medium text-emerald-700 dark:text-emerald-300">I will: </span>
            <span className="text-gray-700 dark:text-gray-300">{commitment.nextStep}</span>
          </div>
          <div className="p-3 rounded-lg bg-white/60 dark:bg-gray-800/60">
            <span className="font-medium text-emerald-700 dark:text-emerald-300">When/Where: </span>
            <span className="text-gray-700 dark:text-gray-300">{commitment.whenWhere}</span>
          </div>
          <div className="p-3 rounded-lg bg-white/60 dark:bg-gray-800/60">
            <span className="font-medium text-emerald-700 dark:text-emerald-300">If </span>
            <span className="text-gray-700 dark:text-gray-300">{commitment.obstacle}</span>
            <span className="font-medium text-emerald-700 dark:text-emerald-300">, then I will </span>
            <span className="text-gray-700 dark:text-gray-300">{commitment.ifThenPlan}</span>
          </div>
        </div>

        <button
          onClick={() => {
            setStep(0);
            setCommitment({ nextStep: "", whenWhere: "", obstacle: "", ifThenPlan: "" });
            setIsComplete(false);
          }}
          className="mt-4 text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
          data-testid="button-restart-commitment"
        >
          Create a new commitment
        </button>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border border-rose-200/60 dark:border-rose-800/40 bg-gradient-to-br from-rose-50/50 to-amber-50/30 dark:from-rose-900/20 dark:to-amber-900/10 p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-full bg-rose-100 dark:bg-rose-800">
          <Icon className="w-5 h-5 text-rose-600 dark:text-rose-400" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
            {currentPrompt.title}
          </h3>
          <div className="flex gap-1 mt-1">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1 w-6 rounded-full transition-colors ${
                  i <= step 
                    ? "bg-rose-400 dark:bg-rose-500" 
                    : "bg-rose-200 dark:bg-rose-800"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        {currentPrompt.prompt}
      </p>

      <textarea
        value={commitment[currentStepKey]}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={currentPrompt.placeholder}
        rows={2}
        className="w-full p-3 rounded-lg border border-rose-200 dark:border-rose-800 bg-white/80 dark:bg-gray-800/80 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-700 resize-none"
        data-testid={`input-commitment-${currentStepKey}`}
      />

      <div className="flex justify-between items-center mt-4">
        <span className="text-xs text-gray-500 dark:text-gray-500">
          Step {step + 1} of {steps.length}
        </span>
        <button
          onClick={handleNext}
          disabled={!commitment[currentStepKey].trim()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 dark:disabled:bg-rose-800 text-white text-sm font-medium transition-colors disabled:cursor-not-allowed"
          data-testid="button-next-step"
        >
          {step < steps.length - 1 ? "Next" : "Complete"}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-500 mt-4 text-center">
        Small steps lead to lasting change. You're doing great.
      </p>
    </div>
  );
}

export default MicroCommitmentEngine;
