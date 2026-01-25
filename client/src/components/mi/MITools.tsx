/**
 * Motivational Interviewing Tools Component Library
 * Reusable UI components for MI-informed interactions
 * 
 * Usage: Educational reflection tools - not clinical interventions
 */

import { useState } from "react";
import { Scale, MessageCircle, Heart, Sparkles, ChevronRight } from "lucide-react";

interface RulerProps {
  label: string;
  description?: string;
  value: number;
  onChange: (value: number) => void;
  lowLabel?: string;
  highLabel?: string;
  followUpThreshold?: number;
  followUpText?: string;
  className?: string;
}

export function ImportanceRuler({
  label = "Importance",
  description = "How important is this change to you right now?",
  value,
  onChange,
  lowLabel = "Not at all",
  highLabel = "Extremely",
  followUpThreshold = 7,
  followUpText = "This matters to you. What makes it so important?",
  className = ""
}: RulerProps) {
  return (
    <div className={`p-5 rounded-xl border border-[hsl(var(--sage-200))] dark:border-[hsl(var(--sage-700))] bg-background ${className}`} data-testid="card-importance-ruler">
      <div className="flex items-center gap-2 mb-3">
        <Scale className="w-5 h-5 text-[hsl(var(--sage-500))]" aria-hidden="true" />
        <h3 className="font-semibold text-foreground">{label}</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      <div className="mb-2">
        <input
          type="range"
          min="0"
          max="10"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full accent-[hsl(var(--sage-500))]"
          aria-label={label}
          data-testid="slider-importance"
        />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{lowLabel}</span>
        <span className="font-semibold text-lg text-foreground">{value}</span>
        <span>{highLabel}</span>
      </div>
      {value >= followUpThreshold && followUpText && (
        <p className="mt-3 text-sm text-[hsl(var(--sage-600))] dark:text-[hsl(var(--sage-400))]">
          {followUpText}
        </p>
      )}
    </div>
  );
}

export function ConfidenceRuler({
  label = "Confidence",
  description = "How confident are you that you could make this change?",
  value,
  onChange,
  lowLabel = "Not at all",
  highLabel = "Very confident",
  followUpThreshold = 7,
  followUpText = "You believe in yourself. What gives you that confidence?",
  className = ""
}: RulerProps) {
  return (
    <div className={`p-5 rounded-xl border border-[hsl(var(--sage-200))] dark:border-[hsl(var(--sage-700))] bg-background ${className}`} data-testid="card-confidence-ruler">
      <div className="flex items-center gap-2 mb-3">
        <Scale className="w-5 h-5 text-[hsl(var(--sage-500))]" aria-hidden="true" />
        <h3 className="font-semibold text-foreground">{label}</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      <div className="mb-2">
        <input
          type="range"
          min="0"
          max="10"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full accent-[hsl(var(--sage-500))]"
          aria-label={label}
          data-testid="slider-confidence"
        />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{lowLabel}</span>
        <span className="font-semibold text-lg text-foreground">{value}</span>
        <span>{highLabel}</span>
      </div>
      {value >= followUpThreshold && followUpText && (
        <p className="mt-3 text-sm text-[hsl(var(--sage-600))] dark:text-[hsl(var(--sage-400))]">
          {followUpText}
        </p>
      )}
    </div>
  );
}

interface OARSStepProps {
  type: "open" | "affirm" | "reflect" | "summarize";
  isActive?: boolean;
  isComplete?: boolean;
  onClick?: () => void;
}

const OARS_CONFIG = {
  open: {
    icon: MessageCircle,
    label: "Open Question",
    description: "Explore what matters",
    color: "text-blue-500"
  },
  affirm: {
    icon: Heart,
    label: "Affirmation",
    description: "Acknowledge your strength",
    color: "text-rose-500"
  },
  reflect: {
    icon: Sparkles,
    label: "Reflection",
    description: "Deepen understanding",
    color: "text-amber-500"
  },
  summarize: {
    icon: ChevronRight,
    label: "Summary",
    description: "Capture insights",
    color: "text-emerald-500"
  }
};

export function OARSStep({ type, isActive = false, isComplete = false, onClick }: OARSStepProps) {
  const config = OARS_CONFIG[type];
  const Icon = config.icon;
  
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 p-3 rounded-lg transition-all w-full text-left ${
        isActive 
          ? "bg-[hsl(var(--sage-100))] dark:bg-[hsl(var(--sage-800))] ring-2 ring-[hsl(var(--sage-400))]" 
          : isComplete
            ? "bg-[hsl(var(--sage-50))] dark:bg-[hsl(var(--sage-900))]/50"
            : "hover:bg-[hsl(var(--sage-50))] dark:hover:bg-[hsl(var(--sage-900))]/30"
      }`}
      data-testid={`button-oars-${type}`}
    >
      <div className={`p-2 rounded-full ${isComplete ? "bg-[hsl(var(--sage-200))]" : "bg-[hsl(var(--sage-100))] dark:bg-[hsl(var(--sage-800))]"}`}>
        <Icon className={`w-4 h-4 ${config.color}`} aria-hidden="true" />
      </div>
      <div>
        <p className={`text-sm font-medium ${isComplete ? "text-muted-foreground line-through" : "text-foreground"}`}>
          {config.label}
        </p>
        <p className="text-xs text-muted-foreground">{config.description}</p>
      </div>
      {isComplete && (
        <span className="ml-auto text-xs text-[hsl(var(--sage-500))]">Done</span>
      )}
    </button>
  );
}

interface OARSFlowProps {
  onComplete?: () => void;
  className?: string;
}

export function OARSFlow({ onComplete, className = "" }: OARSFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  const steps: Array<"open" | "affirm" | "reflect" | "summarize"> = ["open", "affirm", "reflect", "summarize"];
  
  const handleStepClick = (index: number) => {
    setCurrentStep(index);
  };
  
  const handleComplete = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else if (completedSteps.length === steps.length - 1) {
      onComplete?.();
    }
  };
  
  return (
    <div className={`rounded-xl border border-[hsl(var(--sage-200))] dark:border-[hsl(var(--sage-700))] bg-background p-5 ${className}`} data-testid="section-oars-flow">
      <h3 className="font-semibold text-foreground mb-4">Reflection Flow (OARS)</h3>
      <p className="text-sm text-muted-foreground mb-4">
        A gentle 4-step process to explore what matters and find your next step.
      </p>
      <div className="space-y-2 mb-4">
        {steps.map((step, index) => (
          <OARSStep
            key={step}
            type={step}
            isActive={currentStep === index}
            isComplete={completedSteps.includes(index)}
            onClick={() => handleStepClick(index)}
          />
        ))}
      </div>
      <button
        onClick={handleComplete}
        className="w-full py-2 px-4 rounded-lg bg-[hsl(var(--sage-500))] text-white font-medium hover:bg-[hsl(var(--sage-600))] transition-colors"
        data-testid="button-complete-step"
      >
        {currentStep === steps.length - 1 ? "Complete Flow" : "Next Step"}
      </button>
    </div>
  );
}

interface ChangeTalkPromptProps {
  prompts?: string[];
  className?: string;
}

const DEFAULT_CHANGE_PROMPTS = [
  "What makes you want this?",
  "Why now?",
  "What would be different if this changed?",
  "What's one small sign of progress you'd notice?",
  "What strengths do you already have that could help?"
];

export function ChangeTalkPrompts({ prompts = DEFAULT_CHANGE_PROMPTS, className = "" }: ChangeTalkPromptProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % prompts.length);
  };
  
  return (
    <div className={`rounded-xl border border-[hsl(var(--sage-200))] dark:border-[hsl(var(--sage-700))] bg-background p-5 ${className}`} data-testid="card-change-talk">
      <div className="flex items-center gap-2 mb-3">
        <MessageCircle className="w-5 h-5 text-[hsl(var(--sage-500))]" aria-hidden="true" />
        <h3 className="font-semibold text-foreground">Reflection Prompt</h3>
      </div>
      <p className="text-lg text-foreground mb-4 min-h-[3rem]">
        {prompts[currentIndex]}
      </p>
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">
          {currentIndex + 1} of {prompts.length}
        </span>
        <button
          onClick={handleNext}
          className="text-sm text-[hsl(var(--sage-600))] hover:text-[hsl(var(--sage-700))] dark:text-[hsl(var(--sage-400))] dark:hover:text-[hsl(var(--sage-300))] font-medium"
          data-testid="button-next-prompt"
        >
          Next prompt →
        </button>
      </div>
    </div>
  );
}

export function MicroCommitmentCard({ className = "" }: { className?: string }) {
  const [step, setStep] = useState("");
  const [when, setWhen] = useState("");
  const [obstacle, setObstacle] = useState("");
  
  return (
    <div className={`rounded-xl border border-[hsl(var(--sage-200))] dark:border-[hsl(var(--sage-700))] bg-background p-5 ${className}`} data-testid="card-micro-commitment">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-5 h-5 text-[hsl(var(--sage-500))]" aria-hidden="true" />
        <h3 className="font-semibold text-foreground">One Tiny Next Step</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Small actions build momentum. What's one thing you could do?
      </p>
      <div className="space-y-3">
        <div>
          <label htmlFor="tiny-step" className="block text-xs font-medium text-muted-foreground mb-1">
            My tiny next step:
          </label>
          <input
            id="tiny-step"
            type="text"
            value={step}
            onChange={(e) => setStep(e.target.value)}
            placeholder="e.g., Take 3 deep breaths before responding"
            className="w-full p-2 rounded-lg border border-[hsl(var(--sage-300))] dark:border-[hsl(var(--sage-600))] bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--sage-400))]"
            data-testid="input-tiny-step"
          />
        </div>
        <div>
          <label htmlFor="when-where" className="block text-xs font-medium text-muted-foreground mb-1">
            When/where will I do it?
          </label>
          <input
            id="when-where"
            type="text"
            value={when}
            onChange={(e) => setWhen(e.target.value)}
            placeholder="e.g., Tomorrow morning when I wake up"
            className="w-full p-2 rounded-lg border border-[hsl(var(--sage-300))] dark:border-[hsl(var(--sage-600))] bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--sage-400))]"
            data-testid="input-when-where"
          />
        </div>
        <div>
          <label htmlFor="if-then" className="block text-xs font-medium text-muted-foreground mb-1">
            If ___ gets in the way, I'll ___:
          </label>
          <input
            id="if-then"
            type="text"
            value={obstacle}
            onChange={(e) => setObstacle(e.target.value)}
            placeholder="e.g., If I forget, I'll set a phone reminder"
            className="w-full p-2 rounded-lg border border-[hsl(var(--sage-300))] dark:border-[hsl(var(--sage-600))] bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--sage-400))]"
            data-testid="input-if-then"
          />
        </div>
      </div>
    </div>
  );
}
