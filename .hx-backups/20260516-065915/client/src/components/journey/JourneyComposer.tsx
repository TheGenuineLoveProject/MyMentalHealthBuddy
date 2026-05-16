import { useState, useEffect } from "react";
import { 
  JOURNEY_TEMPLATES,
  TOOL_LABELS,
  createJourneyFromTemplate,
  saveJourneyFlow,
  getJourneyFlows,
  deleteJourneyFlow,
  type JourneyFlow,
  type JourneyStep
} from "@/lib/journey/journeyComposer";
import { Route, Play, Check, Trash2, ChevronRight, Clock, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function JourneyComposer() {
  const { toast } = useToast();
  const [savedJourneys, setSavedJourneys] = useState<JourneyFlow[]>([]);
  const [activeJourney, setActiveJourney] = useState<JourneyFlow | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepResponse, setStepResponse] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);

  useEffect(() => {
    setSavedJourneys(getJourneyFlows());
  }, []);

  function handleStartTemplate(templateIndex: number) {
    const journey = createJourneyFromTemplate(JOURNEY_TEMPLATES[templateIndex]);
    saveJourneyFlow(journey);
    setSavedJourneys(getJourneyFlows());
    setActiveJourney(journey);
    setCurrentStepIndex(0);
    setShowTemplates(false);
  }

  function handleContinueJourney(journey: JourneyFlow) {
    const firstIncomplete = journey.steps.findIndex(s => !s.completed);
    setActiveJourney(journey);
    setCurrentStepIndex(firstIncomplete >= 0 ? firstIncomplete : 0);
  }

  function handleCompleteStep() {
    if (!activeJourney) return;

    const updatedSteps = [...activeJourney.steps];
    updatedSteps[currentStepIndex] = {
      ...updatedSteps[currentStepIndex],
      completed: true,
      response: stepResponse,
      completedAt: new Date().toISOString()
    };

    const allComplete = updatedSteps.every(s => s.completed);
    const updatedJourney: JourneyFlow = {
      ...activeJourney,
      steps: updatedSteps,
      completedAt: allComplete ? new Date().toISOString() : undefined
    };

    saveJourneyFlow(updatedJourney);
    setSavedJourneys(getJourneyFlows());

    if (currentStepIndex < activeJourney.steps.length - 1) {
      setActiveJourney(updatedJourney);
      setCurrentStepIndex(currentStepIndex + 1);
      setStepResponse("");
    } else {
      toast({
        title: "Journey complete",
        description: `You've completed the ${activeJourney.name} journey.`
      });
      setActiveJourney(null);
    }
  }

  function handleDeleteJourney(id: string) {
    deleteJourneyFlow(id);
    setSavedJourneys(getJourneyFlows());
  }

  if (activeJourney) {
    const currentStep = activeJourney.steps[currentStepIndex];
    const toolInfo = TOOL_LABELS[currentStep.tool];
    const progress = ((currentStepIndex + 1) / activeJourney.steps.length) * 100;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">{activeJourney.name}</h2>
            <p className="text-sm opacity-70">{activeJourney.description}</p>
          </div>
          <button
            onClick={() => setActiveJourney(null)}
            className="text-sm opacity-70 hover:opacity-100"
            data-testid="button-exit-journey"
          >
            Exit
          </button>
        </div>

        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div 
            className="h-full bg-teal-500 transition-all duration-300" 
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {activeJourney.steps.map((step, idx) => (
            <div
              key={step.id}
              className={`flex-shrink-0 rounded-lg px-3 py-2 text-xs ${
                idx === currentStepIndex 
                  ? "bg-teal-500/20 border border-teal-500/30" 
                  : step.completed 
                    ? "bg-white/10 opacity-60" 
                    : "bg-white/5 opacity-40"
              }`}
            >
              {step.completed && <Check className="h-3 w-3 inline mr-1" />}
              {TOOL_LABELS[step.tool].name}
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-teal-500/20 bg-gradient-to-br from-teal-500/10 to-transparent p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10">
              {toolInfo.name}
            </span>
            {currentStep.duration && (
              <span className="flex items-center gap-1 text-xs opacity-60">
                <Clock className="h-3 w-3" />
                {currentStep.duration}
              </span>
            )}
          </div>
          <p className="font-medium">{currentStep.label}</p>
        </div>

        <textarea
          value={stepResponse}
          onChange={(e) => setStepResponse(e.target.value)}
          placeholder="Your reflection for this step..."
          className="w-full rounded-xl border border-white/10 bg-black/20 p-4 min-h-[150px]"
          data-testid="input-journey-step"
        />

        <div className="flex justify-between">
          {currentStepIndex > 0 && (
            <button
              onClick={() => setCurrentStepIndex(currentStepIndex - 1)}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
              data-testid="button-journey-previous"
            >
              Previous
            </button>
          )}
          <button
            onClick={handleCompleteStep}
            className="ml-auto flex items-center gap-2 rounded-lg bg-teal-500/20 border border-teal-500/30 px-4 py-2 text-sm hover:bg-teal-500/30"
            data-testid="button-journey-next"
          >
            {currentStepIndex === activeJourney.steps.length - 1 ? "Complete Journey" : "Next Step"}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Route className="h-5 w-5 text-teal-400" />
          <h2 className="text-xl font-semibold">Journey Composer</h2>
        </div>
        <button
          onClick={() => setShowTemplates(!showTemplates)}
          className="flex items-center gap-1 text-sm rounded-lg border border-white/10 px-3 py-1.5 hover:bg-white/5"
          data-testid="button-new-journey"
        >
          <Plus className="h-4 w-4" />
          New Journey
        </button>
      </div>

      <p className="text-sm opacity-80">
        Compose intentional sequences of reflection tools — crafted paths for deeper inquiry.
      </p>

      {showTemplates && (
        <div className="grid gap-3 sm:grid-cols-2">
          {JOURNEY_TEMPLATES.map((template, idx) => (
            <button
              key={idx}
              onClick={() => handleStartTemplate(idx)}
              className="rounded-xl border border-white/10 bg-black/10 p-4 text-left hover:bg-white/5"
              data-testid={`button-template-${idx}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{template.name}</span>
                <Play className="h-4 w-4 opacity-60" />
              </div>
              <p className="text-sm opacity-70">{template.description}</p>
              <p className="text-xs opacity-50 mt-2">{template.steps.length} steps</p>
            </button>
          ))}
        </div>
      )}

      {savedJourneys.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium opacity-70">Your Journeys</h3>
          {savedJourneys.map((journey) => {
            const completedCount = journey.steps.filter(s => s.completed).length;
            const isComplete = journey.completedAt;
            return (
              <div
                key={journey.id}
                className="rounded-xl border border-white/10 bg-black/10 p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{journey.name}</span>
                  <div className="flex items-center gap-2">
                    {isComplete && <Check className="h-4 w-4 text-green-400" />}
                    <button
                      onClick={() => handleDeleteJourney(journey.id)}
                      className="p-1 rounded hover:bg-white/10"
                      data-testid={`button-delete-journey-${journey.id}`}
                    >
                      <Trash2 className="h-4 w-4 opacity-60" />
                    </button>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden mb-2">
                  <div
                    className="h-full bg-teal-500"
                    style={{ width: `${(completedCount / journey.steps.length) * 100}%` }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs opacity-60">
                    {completedCount} / {journey.steps.length} steps
                  </span>
                  {!isComplete && (
                    <button
                      onClick={() => handleContinueJourney(journey)}
                      className="text-xs underline underline-offset-2 opacity-70 hover:opacity-100"
                      data-testid={`button-continue-${journey.id}`}
                    >
                      Continue
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {savedJourneys.length === 0 && !showTemplates && (
        <div className="rounded-xl border border-white/10 bg-black/10 p-6 text-center">
          <Route className="h-8 w-8 opacity-30 mx-auto mb-3" />
          <p className="text-sm opacity-70">No journeys started yet.</p>
          <button
            onClick={() => setShowTemplates(true)}
            className="text-sm underline underline-offset-2 opacity-70 hover:opacity-100 mt-2"
            data-testid="button-browse-templates"
          >
            Browse journey templates
          </button>
        </div>
      )}
    </div>
  );
}
