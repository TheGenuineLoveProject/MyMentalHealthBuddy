import { useState } from "react";
import { ChevronRight, RefreshCw, Sparkles } from "lucide-react";
import { MI_STEPS, getRandomMIPrompt } from "@/lib/miPatterns";

interface MIPromptCardProps {
  context?: "journal" | "mood" | "values" | "reflection" | "general";
  showAllSteps?: boolean;
  className?: string;
}

export function MIPromptCard({ 
  context = "general", 
  showAllSteps = false,
  className = "" 
}: MIPromptCardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [prompt, setPrompt] = useState(() => getRandomMIPrompt(MI_STEPS[0].type));

  const handleNext = () => {
    if (currentStep < MI_STEPS.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setPrompt(getRandomMIPrompt(MI_STEPS[nextStep].type));
    }
  };

  const handleRefresh = () => {
    setPrompt(getRandomMIPrompt(MI_STEPS[currentStep].type));
  };

  const step = MI_STEPS[currentStep];

  if (showAllSteps) {
    return (
      <div className={`rounded-xl border border-[hsl(var(--sage-200))] dark:border-[hsl(var(--sage-700))] bg-background p-6 ${className}`}>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[hsl(var(--sage-500))]" aria-hidden="true" />
          Reflection Flow
        </h3>
        <div className="space-y-4">
          {MI_STEPS.map((s, i) => (
            <div 
              key={s.type}
              className="p-3 rounded-lg bg-[hsl(var(--sage-50))] dark:bg-[hsl(var(--sage-900))]/30 border border-[hsl(var(--sage-100))] dark:border-[hsl(var(--sage-800))]"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-[hsl(var(--sage-600))] dark:text-[hsl(var(--sage-400))] uppercase tracking-wide">
                  {i + 1}. {s.label}
                </span>
              </div>
              <p className="text-sm text-foreground">{s.template}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border border-[hsl(var(--sage-200))] dark:border-[hsl(var(--sage-700))] bg-background ${className}`} data-testid="mi-prompt-card">
      <div className="p-4 pb-3 border-b border-[hsl(var(--sage-100))] dark:border-[hsl(var(--sage-800))]">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[hsl(var(--sage-500))]" aria-hidden="true" />
            Supportive Prompt
          </h3>
          <span className="text-xs text-muted-foreground">
            Step {currentStep + 1} of {MI_STEPS.length}
          </span>
        </div>
      </div>
      <div className="p-4 space-y-4">
        <div className="p-4 rounded-lg bg-[hsl(var(--sage-50))] dark:bg-[hsl(var(--sage-900))]/30 border border-[hsl(var(--sage-100))] dark:border-[hsl(var(--sage-800))]">
          <span className="text-xs font-medium text-[hsl(var(--sage-600))] dark:text-[hsl(var(--sage-400))] uppercase tracking-wide block mb-2">
            {step.label}
          </span>
          <p className="text-foreground leading-relaxed">{prompt}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex items-center px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-[hsl(var(--sage-100))] dark:hover:bg-[hsl(var(--sage-800))]"
            data-testid="button-refresh-prompt"
          >
            <RefreshCw className="w-4 h-4 mr-1" aria-hidden="true" />
            Different prompt
          </button>
          
          {currentStep < MI_STEPS.length - 1 && (
            <button
              type="button"
              onClick={handleNext}
              className="ml-auto inline-flex items-center px-3 py-1.5 text-sm border border-[hsl(var(--sage-300))] dark:border-[hsl(var(--sage-600))] rounded-lg hover:bg-[hsl(var(--sage-50))] dark:hover:bg-[hsl(var(--sage-800))] transition-colors"
              data-testid="button-next-step"
            >
              Next step
              <ChevronRight className="w-4 h-4 ml-1" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default MIPromptCard;
