import { useState } from "react";
import { 
  TEMPORAL_LENSES,
  getIntegrationPrompt,
  saveTemporalIntegration,
  type TemporalLens 
} from "@/lib/temporal/temporalReflection";
import { Clock, History, Eye, Telescope, Layers } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LENS_ICONS: Record<TemporalLens["id"], typeof Clock> = {
  past: History,
  present: Eye,
  future: Telescope,
};

export default function TemporalReflection() {
  const { toast } = useToast();
  const [topic, setTopic] = useState("");
  const [currentLens, setCurrentLens] = useState<TemporalLens["id"] | "integration">("past");
  const [responses, setResponses] = useState({
    past: "",
    present: "",
    future: "",
    integration: ""
  });
  const [isComplete, setIsComplete] = useState(false);
  const [integrationPrompt] = useState(getIntegrationPrompt);

  const lensOrder: (TemporalLens["id"] | "integration")[] = ["past", "present", "future", "integration"];
  const currentIndex = lensOrder.indexOf(currentLens);
  
  const currentLensData = currentLens !== "integration" 
    ? TEMPORAL_LENSES.find(l => l.id === currentLens)!
    : null;

  function handleNext() {
    if (currentIndex < lensOrder.length - 1) {
      setCurrentLens(lensOrder[currentIndex + 1]);
    } else {
      setIsComplete(true);
      saveTemporalIntegration({
        topic,
        ...responses,
        timestamp: new Date().toISOString()
      });
      toast({
        title: "Temporal integration complete",
        description: "Your reflection across time has been saved."
      });
    }
  }

  function handleReset() {
    setTopic("");
    setCurrentLens("past");
    setResponses({ past: "", present: "", future: "", integration: "" });
    setIsComplete(false);
  }

  if (isComplete) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-cyan-400" />
          <h2 className="text-xl font-semibold">Temporal Integration Complete</h2>
        </div>

        <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-transparent p-5">
          <div className="text-sm opacity-60 mb-2">TOPIC</div>
          <p className="font-medium">{topic}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {TEMPORAL_LENSES.map((lens) => {
            const Icon = LENS_ICONS[lens.id];
            return (
              <div key={lens.id} className="rounded-xl border border-white/10 bg-black/10 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="h-4 w-4 opacity-70" />
                  <span className="text-xs font-medium opacity-60 uppercase">{lens.name}</span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{responses[lens.id]}</p>
              </div>
            );
          })}
        </div>

        <div className="rounded-2xl border border-white/20 bg-gradient-to-br from-white/10 to-transparent p-5">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="h-4 w-4 opacity-70" />
            <span className="text-xs font-medium opacity-60 uppercase">Integration</span>
          </div>
          <p className="text-sm whitespace-pre-wrap">{responses.integration}</p>
        </div>

        <button
          onClick={handleReset}
          className="rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
          data-testid="button-reset-temporal"
        >
          Start new reflection
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-cyan-400" />
          <h2 className="text-xl font-semibold">Temporal Reflection</h2>
        </div>
        <div className="text-sm opacity-60">
          {currentIndex + 1} of {lensOrder.length}
        </div>
      </div>

      <p className="text-sm opacity-80">
        Explore a theme across time — past, present, and future — 
        then integrate the perspectives into a unified understanding.
      </p>

      {!topic ? (
        <div className="space-y-4">
          <label className="block text-sm opacity-80 mb-2">What theme would you like to explore across time?</label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="A relationship, a fear, a goal, a pattern..."
            className="w-full rounded-xl border border-white/10 bg-black/20 p-3 min-h-[100px]"
            data-testid="input-temporal-topic"
          />
          <button
            onClick={() => setTopic(topic)}
            disabled={!topic.trim()}
            className="rounded-lg bg-cyan-500/20 border border-cyan-500/30 px-4 py-2 text-sm hover:bg-cyan-500/30 disabled:opacity-40"
            data-testid="button-start-temporal"
          >
            Begin temporal exploration
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl border border-white/10 bg-black/10 p-4">
            <div className="text-xs opacity-60 mb-1">TOPIC</div>
            <p className="font-medium">{topic}</p>
          </div>

          <div className="flex gap-1">
            {lensOrder.map((lens, idx) => {
              const Icon = lens !== "integration" ? LENS_ICONS[lens] : Layers;
              return (
                <div
                  key={lens}
                  className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs ${
                    idx === currentIndex 
                      ? "bg-cyan-500/20 font-medium" 
                      : idx < currentIndex 
                        ? "bg-white/10 opacity-70" 
                        : "bg-white/5 opacity-40"
                  }`}
                >
                  <Icon className="h-3 w-3" />
                  <span className="hidden sm:inline">
                    {lens === "integration" ? "Integrate" : TEMPORAL_LENSES.find(l => l.id === lens)?.name}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-transparent p-5">
            {currentLensData ? (
              <>
                <div className="flex items-center gap-2 mb-2">
                  {(() => { const Icon = LENS_ICONS[currentLensData.id]; return <Icon className="h-5 w-5" />; })()}
                  <span className="font-medium">{currentLensData.name}</span>
                </div>
                <p className="text-sm opacity-80 mb-3">{currentLensData.description}</p>
                <p className="text-sm italic">
                  {currentLensData.questions[Math.floor(Math.random() * currentLensData.questions.length)]}
                </p>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <Layers className="h-5 w-5" />
                  <span className="font-medium">Integration</span>
                </div>
                <p className="text-sm opacity-80 mb-3">
                  You've explored past, present, and future. Now weave them together.
                </p>
                <p className="text-sm italic">{integrationPrompt}</p>
              </>
            )}
          </div>

          <textarea
            value={responses[currentLens as keyof typeof responses]}
            onChange={(e) => setResponses({ ...responses, [currentLens]: e.target.value })}
            placeholder="Write your reflection..."
            className="w-full rounded-xl border border-white/10 bg-black/20 p-4 min-h-[150px]"
            data-testid={`input-temporal-${currentLens}`}
          />

          <div className="flex justify-between">
            {currentIndex > 0 && (
              <button
                onClick={() => setCurrentLens(lensOrder[currentIndex - 1])}
                className="rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
                data-testid="button-temporal-previous"
              >
                Previous
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!responses[currentLens as keyof typeof responses].trim()}
              className="ml-auto rounded-lg bg-cyan-500/20 border border-cyan-500/30 px-4 py-2 text-sm hover:bg-cyan-500/30 disabled:opacity-40"
              data-testid="button-temporal-next"
            >
              {currentIndex === lensOrder.length - 1 ? "Complete" : "Next"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
