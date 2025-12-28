import { useState } from "react";
import { 
  DIALECTICAL_STEPS, 
  INQUIRY_DOMAINS,
  getRandomInquiryPrompt,
  saveDialecticalSession,
  type DialecticalStep 
} from "@/lib/inquiry/dialecticalInquiry";
import { Scale, ArrowRight, Sparkles, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function DialecticalInquiry() {
  const { toast } = useToast();
  const [topic, setTopic] = useState("");
  const [currentPhase, setCurrentPhase] = useState<DialecticalStep["phase"]>("thesis");
  const [responses, setResponses] = useState({
    thesis: "",
    antithesis: "",
    synthesis: "",
    integration: ""
  });
  const [isComplete, setIsComplete] = useState(false);

  const currentStep = DIALECTICAL_STEPS.find(s => s.phase === currentPhase)!;
  const phaseIndex = DIALECTICAL_STEPS.findIndex(s => s.phase === currentPhase);

  function handleNext() {
    if (phaseIndex < DIALECTICAL_STEPS.length - 1) {
      const nextPhase = DIALECTICAL_STEPS[phaseIndex + 1].phase;
      setCurrentPhase(nextPhase);
    } else {
      setIsComplete(true);
      saveDialecticalSession({
        topic,
        ...responses,
        timestamp: new Date().toISOString()
      });
      toast({
        title: "Inquiry complete",
        description: "Your dialectical exploration has been saved."
      });
    }
  }

  function handleRandomPrompt() {
    const prompt = getRandomInquiryPrompt();
    setTopic(prompt);
  }

  function handleReset() {
    setTopic("");
    setCurrentPhase("thesis");
    setResponses({ thesis: "", antithesis: "", synthesis: "", integration: "" });
    setIsComplete(false);
  }

  if (isComplete) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Scale className="h-5 w-5 text-purple-400" />
          <h2 className="text-xl font-semibold">Dialectical Synthesis Complete</h2>
        </div>

        <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-transparent p-5">
          <div className="text-sm opacity-60 mb-2">TOPIC</div>
          <p className="font-medium">{topic}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {DIALECTICAL_STEPS.map((step) => (
            <div key={step.phase} className="rounded-xl border border-white/10 bg-black/10 p-4">
              <div className="text-xs font-medium opacity-60 uppercase mb-2">{step.phase}</div>
              <p className="text-sm whitespace-pre-wrap">{responses[step.phase]}</p>
            </div>
          ))}
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
          data-testid="button-reset-dialectic"
        >
          <RefreshCw className="h-4 w-4" />
          Start new inquiry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Scale className="h-5 w-5 text-purple-400" />
          <h2 className="text-xl font-semibold">Dialectical Inquiry</h2>
        </div>
        <div className="text-sm opacity-60">
          Step {phaseIndex + 1} of {DIALECTICAL_STEPS.length}
        </div>
      </div>

      <p className="text-sm opacity-80">
        Explore a question through thesis, antithesis, and synthesis — 
        discovering truth by holding opposing perspectives.
      </p>

      {!topic ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm opacity-80 mb-2">What topic would you like to explore?</label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter a belief, question, or dilemma..."
              className="w-full rounded-xl border border-white/10 bg-black/20 p-3 min-h-[100px]"
              data-testid="input-dialectic-topic"
            />
          </div>
          
          <div>
            <div className="text-xs opacity-60 mb-2">Or choose a domain:</div>
            <div className="flex flex-wrap gap-2">
              {INQUIRY_DOMAINS.map((domain) => (
                <button
                  key={domain.id}
                  onClick={() => setTopic(getRandomInquiryPrompt(domain.id))}
                  className="rounded-full px-3 py-1 text-sm bg-white/5 hover:bg-white/10"
                  data-testid={`button-domain-${domain.id}`}
                >
                  {domain.name}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleRandomPrompt}
            className="flex items-center gap-2 text-sm underline underline-offset-2 opacity-70 hover:opacity-100"
            data-testid="button-random-prompt"
          >
            <Sparkles className="h-4 w-4" />
            Surprise me with a question
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl border border-white/10 bg-black/10 p-4">
            <div className="text-xs opacity-60 mb-1">TOPIC</div>
            <p className="font-medium">{topic}</p>
          </div>

          <div className="flex gap-2">
            {DIALECTICAL_STEPS.map((step, idx) => (
              <div
                key={step.phase}
                className={`flex-1 h-1 rounded-full ${
                  idx <= phaseIndex ? "bg-purple-500" : "bg-white/10"
                }`}
              />
            ))}
          </div>

          <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-transparent p-5">
            <div className="text-xs font-medium opacity-60 uppercase mb-2">{currentStep.phase}</div>
            <p className="font-medium text-lg mb-2">{currentStep.prompt}</p>
            <p className="text-sm opacity-70">{currentStep.guidance}</p>
          </div>

          <textarea
            value={responses[currentPhase]}
            onChange={(e) => setResponses({ ...responses, [currentPhase]: e.target.value })}
            placeholder="Write your response..."
            className="w-full rounded-xl border border-white/10 bg-black/20 p-4 min-h-[150px]"
            data-testid={`input-${currentPhase}`}
          />

          <div className="flex justify-between">
            {phaseIndex > 0 && (
              <button
                onClick={() => setCurrentPhase(DIALECTICAL_STEPS[phaseIndex - 1].phase)}
                className="rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
                data-testid="button-previous"
              >
                Previous
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!responses[currentPhase].trim()}
              className="ml-auto flex items-center gap-2 rounded-lg bg-purple-500/20 border border-purple-500/30 px-4 py-2 text-sm hover:bg-purple-500/30 disabled:opacity-40"
              data-testid="button-next"
            >
              {phaseIndex === DIALECTICAL_STEPS.length - 1 ? "Complete" : "Next"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
