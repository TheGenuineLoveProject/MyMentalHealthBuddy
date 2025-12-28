import { useState } from "react";
import { 
  COGNITIVE_BIASES, 
  ABSTRACTION_LADDER,
  getRandomBiases,
  saveMetaCognitionSession,
  type CognitiveBias
} from "@/lib/metacognition/metacognitionStudio";
import { Eye, Brain, Layers, AlertTriangle, ChevronRight, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type StudioMode = "bias-check" | "assumption-audit" | "abstraction-ladder";

const CATEGORY_COLORS: Record<CognitiveBias["category"], string> = {
  perception: "text-blue-400",
  memory: "text-purple-400",
  judgment: "text-amber-400",
  social: "text-green-400",
  self: "text-pink-400"
};

export default function MetaCognitionStudio() {
  const { toast } = useToast();
  const [mode, setMode] = useState<StudioMode>("bias-check");
  const [selectedBiases, setSelectedBiases] = useState<CognitiveBias[]>(() => getRandomBiases(3));
  const [biasResponses, setBiasResponses] = useState<Record<string, string>>({});
  const [abstractionResponses, setAbstractionResponses] = useState<Record<string, string>>({});
  const [topic, setTopic] = useState("");
  const [currentAbstractionLevel, setCurrentAbstractionLevel] = useState(0);
  const [assumptionStatement, setAssumptionStatement] = useState("");
  const [assumptionEvidence, setAssumptionEvidence] = useState("");
  const [assumptionCounter, setAssumptionCounter] = useState("");
  const [assumptionConfidence, setAssumptionConfidence] = useState(50);

  function handleRefreshBiases() {
    setSelectedBiases(getRandomBiases(3));
    setBiasResponses({});
  }

  function handleSaveBiasCheck() {
    saveMetaCognitionSession({
      id: `meta_${Date.now()}`,
      type: "bias-check",
      topic: topic || "General reflection",
      responses: biasResponses,
      insights: "",
      timestamp: new Date().toISOString()
    });
    toast({ title: "Bias check saved" });
    setBiasResponses({});
    setTopic("");
  }

  function handleSaveAssumptionAudit() {
    saveMetaCognitionSession({
      id: `meta_${Date.now()}`,
      type: "assumption-audit",
      topic: assumptionStatement,
      responses: {
        evidence: assumptionEvidence,
        counterEvidence: assumptionCounter,
        confidence: assumptionConfidence.toString()
      },
      insights: "",
      timestamp: new Date().toISOString()
    });
    toast({ title: "Assumption audit saved" });
    setAssumptionStatement("");
    setAssumptionEvidence("");
    setAssumptionCounter("");
    setAssumptionConfidence(50);
  }

  function handleSaveAbstractionLadder() {
    saveMetaCognitionSession({
      id: `meta_${Date.now()}`,
      type: "abstraction-ladder",
      topic: topic,
      responses: abstractionResponses,
      insights: "",
      timestamp: new Date().toISOString()
    });
    toast({ title: "Abstraction exploration saved" });
    setAbstractionResponses({});
    setTopic("");
    setCurrentAbstractionLevel(0);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Eye className="h-5 w-5 text-indigo-400" />
        <h2 className="text-xl font-semibold">Meta-Cognition Studio</h2>
      </div>

      <p className="text-sm opacity-80">
        Tools for examining how you think — not to fix anything, but to see more clearly.
      </p>

      <div className="flex gap-2">
        {[
          { id: "bias-check" as const, label: "Bias Spotter", icon: AlertTriangle },
          { id: "assumption-audit" as const, label: "Assumption Audit", icon: Brain },
          { id: "abstraction-ladder" as const, label: "Abstraction Ladder", icon: Layers }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setMode(id)}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
              mode === id ? "bg-white/20 font-medium" : "bg-white/5 opacity-70 hover:opacity-100"
            }`}
            data-testid={`button-mode-${id}`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {mode === "bias-check" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm opacity-70">Check for these biases:</span>
            <button
              onClick={handleRefreshBiases}
              className="flex items-center gap-1 text-sm opacity-70 hover:opacity-100"
              data-testid="button-refresh-biases"
            >
              <RefreshCw className="h-3 w-3" />
              New set
            </button>
          </div>

          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="What situation or belief are you examining? (optional)"
            className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm"
            data-testid="input-bias-topic"
          />

          {selectedBiases.map((bias) => (
            <div key={bias.id} className="rounded-xl border border-white/10 bg-black/10 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{bias.name}</span>
                <span className={`text-xs ${CATEGORY_COLORS[bias.category]}`}>
                  {bias.category}
                </span>
              </div>
              <p className="text-sm opacity-70 mb-3">{bias.description}</p>
              <p className="text-sm italic mb-3">{bias.question}</p>
              <textarea
                value={biasResponses[bias.id] || ""}
                onChange={(e) => setBiasResponses({ ...biasResponses, [bias.id]: e.target.value })}
                placeholder="Your reflection..."
                className="w-full rounded-lg border border-white/10 bg-black/20 p-3 min-h-[80px] text-sm"
                data-testid={`input-bias-${bias.id}`}
              />
              <p className="text-xs opacity-50 mt-2">Antidote: {bias.antidote}</p>
            </div>
          ))}

          <button
            onClick={handleSaveBiasCheck}
            disabled={Object.keys(biasResponses).length === 0}
            className="rounded-lg bg-indigo-500/20 border border-indigo-500/30 px-4 py-2 text-sm hover:bg-indigo-500/30 disabled:opacity-40"
            data-testid="button-save-bias-check"
          >
            Save bias check
          </button>
        </div>
      )}

      {mode === "assumption-audit" && (
        <div className="space-y-4">
          <p className="text-sm opacity-70">
            Examine a belief or assumption you hold. What supports it? What challenges it?
          </p>

          <div className="rounded-xl border border-white/10 bg-black/10 p-4 space-y-4">
            <div>
              <label className="text-sm opacity-70 block mb-2">The assumption or belief:</label>
              <input
                type="text"
                value={assumptionStatement}
                onChange={(e) => setAssumptionStatement(e.target.value)}
                placeholder="I believe that..."
                className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2"
                data-testid="input-assumption-statement"
              />
            </div>

            <div>
              <label className="text-sm opacity-70 block mb-2">Evidence supporting this:</label>
              <textarea
                value={assumptionEvidence}
                onChange={(e) => setAssumptionEvidence(e.target.value)}
                placeholder="What supports this belief?"
                className="w-full rounded-lg border border-white/10 bg-black/20 p-3 min-h-[80px]"
                data-testid="input-assumption-evidence"
              />
            </div>

            <div>
              <label className="text-sm opacity-70 block mb-2">Evidence that might challenge this:</label>
              <textarea
                value={assumptionCounter}
                onChange={(e) => setAssumptionCounter(e.target.value)}
                placeholder="What might contradict this belief?"
                className="w-full rounded-lg border border-white/10 bg-black/20 p-3 min-h-[80px]"
                data-testid="input-assumption-counter"
              />
            </div>

            <div>
              <label className="text-sm opacity-70 block mb-2">
                Confidence level: {assumptionConfidence}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={assumptionConfidence}
                onChange={(e) => setAssumptionConfidence(parseInt(e.target.value))}
                className="w-full"
                data-testid="input-assumption-confidence"
              />
              <div className="flex justify-between text-xs opacity-50 mt-1">
                <span>Very uncertain</span>
                <span>Very confident</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleSaveAssumptionAudit}
            disabled={!assumptionStatement.trim()}
            className="rounded-lg bg-indigo-500/20 border border-indigo-500/30 px-4 py-2 text-sm hover:bg-indigo-500/30 disabled:opacity-40"
            data-testid="button-save-assumption"
          >
            Save assumption audit
          </button>
        </div>
      )}

      {mode === "abstraction-ladder" && (
        <div className="space-y-4">
          <p className="text-sm opacity-70">
            Climb the ladder of abstraction — from concrete details to paradigm-level understanding.
          </p>

          {!topic ? (
            <div className="space-y-3">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="What situation or experience do you want to explore?"
                className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2"
                data-testid="input-abstraction-topic"
              />
              <button
                onClick={() => topic && setCurrentAbstractionLevel(0)}
                disabled={!topic.trim()}
                className="rounded-lg bg-indigo-500/20 border border-indigo-500/30 px-4 py-2 text-sm disabled:opacity-40"
                data-testid="button-start-abstraction"
              >
                Begin climbing
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex gap-1">
                {ABSTRACTION_LADDER.map((level, idx) => (
                  <div
                    key={level.level}
                    className={`flex-1 h-2 rounded-full ${
                      idx <= currentAbstractionLevel ? "bg-indigo-500" : "bg-white/10"
                    }`}
                  />
                ))}
              </div>

              <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-transparent p-5">
                <div className="text-xs font-medium opacity-60 uppercase mb-2">
                  {ABSTRACTION_LADDER[currentAbstractionLevel].label}
                </div>
                <p className="text-sm opacity-80 mb-2">
                  {ABSTRACTION_LADDER[currentAbstractionLevel].description}
                </p>
                <p className="font-medium">
                  {ABSTRACTION_LADDER[currentAbstractionLevel].prompt}
                </p>
              </div>

              <textarea
                value={abstractionResponses[ABSTRACTION_LADDER[currentAbstractionLevel].level] || ""}
                onChange={(e) => setAbstractionResponses({
                  ...abstractionResponses,
                  [ABSTRACTION_LADDER[currentAbstractionLevel].level]: e.target.value
                })}
                placeholder="Your reflection at this level..."
                className="w-full rounded-xl border border-white/10 bg-black/20 p-4 min-h-[120px]"
                data-testid={`input-abstraction-${ABSTRACTION_LADDER[currentAbstractionLevel].level}`}
              />

              <div className="flex justify-between">
                {currentAbstractionLevel > 0 && (
                  <button
                    onClick={() => setCurrentAbstractionLevel(currentAbstractionLevel - 1)}
                    className="rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
                    data-testid="button-abstraction-down"
                  >
                    Descend
                  </button>
                )}
                <button
                  onClick={() => {
                    if (currentAbstractionLevel < ABSTRACTION_LADDER.length - 1) {
                      setCurrentAbstractionLevel(currentAbstractionLevel + 1);
                    } else {
                      handleSaveAbstractionLadder();
                    }
                  }}
                  className="ml-auto flex items-center gap-2 rounded-lg bg-indigo-500/20 border border-indigo-500/30 px-4 py-2 text-sm hover:bg-indigo-500/30"
                  data-testid="button-abstraction-up"
                >
                  {currentAbstractionLevel < ABSTRACTION_LADDER.length - 1 ? (
                    <>Climb <ChevronRight className="h-4 w-4" /></>
                  ) : (
                    "Complete"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
