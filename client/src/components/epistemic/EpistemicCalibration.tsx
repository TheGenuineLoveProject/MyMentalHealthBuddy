import { useState, useEffect } from "react";
import {
  createPrediction,
  createBeliefAudit,
  createEpistemicProfile,
  saveEpistemicProfile,
  getEpistemicProfile,
  calculateCalibration,
  getRandomCalibrationQuestion,
  SOURCE_QUALITY_LABELS,
  EPISTEMIC_VIRTUES,
  type EpistemicProfile,
  type Prediction,
  type BeliefAudit
} from "@/lib/epistemic/epistemicCalibration";
import { Target, Plus, RefreshCw, Check, X } from "lucide-react";
import { SEO } from "@/components/SEO";
import SafetyFooter from "@/components/ui/SafetyFooter";

export default function EpistemicCalibration() {
  const [profile, setProfile] = useState<EpistemicProfile | null>(null);
  const [activeTab, setActiveTab] = useState<"predictions" | "beliefs" | "calibration">("predictions");
  const [newPrediction, setNewPrediction] = useState("");
  const [newConfidence, setNewConfidence] = useState(70);
  const [newDomain, setNewDomain] = useState<Prediction["domain"]>("personal");
  const [newTimeframe, setNewTimeframe] = useState("1 month");
  const [newBelief, setNewBelief] = useState("");
  const [newCertainty, setNewCertainty] = useState(70);
  const [newSourceQuality, setNewSourceQuality] = useState<BeliefAudit["sourceQuality"]>("trusted-source");
  const [calibrationQuestion, setCalibrationQuestion] = useState(() => getRandomCalibrationQuestion());

  useEffect(() => {
    const stored = getEpistemicProfile();
    setProfile(stored || createEpistemicProfile());
  }, []);

  function handleAddPrediction() {
    if (!profile || !newPrediction.trim()) return;
    const prediction = createPrediction(newPrediction, newConfidence, newDomain, newTimeframe);
    const updated = { ...profile, predictions: [...profile.predictions, prediction] };
    saveEpistemicProfile(updated);
    setProfile(updated);
    setNewPrediction("");
    setNewConfidence(70);
  }

  function handleResolvePrediction(predictionId: string, resolution: Prediction["resolution"]) {
    if (!profile) return;
    const updated = {
      ...profile,
      predictions: profile.predictions.map(p => 
        p.id === predictionId ? { ...p, resolution, resolvedAt: new Date().toISOString() } : p
      )
    };
    saveEpistemicProfile(updated);
    setProfile(updated);
  }

  function handleAddBeliefAudit() {
    if (!profile || !newBelief.trim()) return;
    const audit = createBeliefAudit(newBelief, newCertainty, newSourceQuality);
    const updated = { ...profile, beliefAudits: [...profile.beliefAudits, audit] };
    saveEpistemicProfile(updated);
    setProfile(updated);
    setNewBelief("");
    setNewCertainty(70);
  }

  if (!profile) return (
    <div className="min-h-screen safe-padding hero-gradient">
      <SEO title="Epistemic Calibration — The Genuine Love Project" description="Explore epistemic calibration tools for your wellness journey." />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Epistemic Calibration</h1>
        <p className="text-muted-foreground mb-8">
          This page is being refined. Use the navigation to explore tools while we finish this section.
        </p>
        <SafetyFooter />
      </main>
    </div>
  );

  const calibration = calculateCalibration(profile.predictions);
  const unresolvedPredictions = profile.predictions.filter(p => !p.resolution || p.resolution === "unresolved");
  const resolvedPredictions = profile.predictions.filter(p => p.resolution && p.resolution !== "unresolved");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Target className="h-5 w-5 text-emerald-400" />
        <h2 className="text-xl font-semibold">Epistemic Calibration</h2>
      </div>

      <p className="text-sm opacity-80">
        Track predictions and audit beliefs to calibrate your confidence with reality. 
        The goal isn't certainty — it's knowing how much you actually know.
      </p>

      <div className="flex gap-2">
        {(["predictions", "beliefs", "calibration"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-lg px-3 py-1.5 text-sm capitalize ${activeTab === tab ? "bg-white/20" : "bg-white/5"}`}
            data-testid={`button-tab-${tab}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "predictions" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-white/10 bg-black/10 p-4">
            <h3 className="font-medium mb-3">Make a Prediction</h3>
            <textarea
              value={newPrediction}
              onChange={(e) => setNewPrediction(e.target.value)}
              placeholder="I predict that..."
              className="w-full rounded-lg border border-white/10 bg-black/20 p-3 min-h-[60px] text-sm mb-3"
              data-testid="input-prediction"
            />
            <div className="flex flex-wrap gap-3 mb-3">
              <div>
                <label className="text-xs opacity-60 block mb-1">Confidence: {newConfidence}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={newConfidence}
                  onChange={(e) => setNewConfidence(parseInt(e.target.value))}
                  className="w-32"
                  data-testid="input-confidence"
                />
              </div>
              <div>
                <label className="text-xs opacity-60 block mb-1">Domain</label>
                <select
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value as Prediction["domain"])}
                  className="rounded border border-white/10 bg-black/20 px-2 py-1 text-sm"
                  data-testid="select-domain"
                >
                  <option value="personal">Personal</option>
                  <option value="professional">Professional</option>
                  <option value="world">World Events</option>
                  <option value="relationships">Relationships</option>
                  <option value="health">Health</option>
                  <option value="learning">Learning</option>
                </select>
              </div>
              <div>
                <label className="text-xs opacity-60 block mb-1">Timeframe</label>
                <input
                  type="text"
                  value={newTimeframe}
                  onChange={(e) => setNewTimeframe(e.target.value)}
                  className="rounded border border-white/10 bg-black/20 px-2 py-1 text-sm w-24"
                  data-testid="input-timeframe"
                />
              </div>
            </div>
            <button
              onClick={handleAddPrediction}
              disabled={!newPrediction.trim()}
              className="rounded-lg bg-emerald-500/20 border border-emerald-500/30 px-4 py-2 text-sm disabled:opacity-40"
              data-testid="button-add-prediction"
            >
              Record Prediction
            </button>
          </div>

          {unresolvedPredictions.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium opacity-70">Open Predictions</h3>
              {unresolvedPredictions.map(pred => (
                <div key={pred.id} className="rounded-lg border border-white/10 bg-black/10 p-3">
                  <p className="text-sm mb-2">{pred.statement}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs opacity-50">{pred.confidence}% confident • {pred.timeframe}</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleResolvePrediction(pred.id, "correct")}
                        className="p-1.5 rounded bg-green-500/20 hover:bg-green-500/30"
                        data-testid={`button-correct-${pred.id}`}
                      >
                        <Check className="h-3 w-3 text-green-400" />
                      </button>
                      <button
                        onClick={() => handleResolvePrediction(pred.id, "partial")}
                        className="p-1.5 rounded bg-yellow-500/20 hover:bg-yellow-500/30 text-xs"
                        data-testid={`button-partial-${pred.id}`}
                      >
                        ~
                      </button>
                      <button
                        onClick={() => handleResolvePrediction(pred.id, "incorrect")}
                        className="p-1.5 rounded bg-red-500/20 hover:bg-red-500/30"
                        data-testid={`button-incorrect-${pred.id}`}
                      >
                        <X className="h-3 w-3 text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "beliefs" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-transparent p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium">Calibration Prompt</span>
              <button
                onClick={() => setCalibrationQuestion(getRandomCalibrationQuestion())}
                className="p-1.5 rounded-lg hover:bg-white/10"
                data-testid="button-new-question"
              >
                <RefreshCw className="h-4 w-4 opacity-60" />
              </button>
            </div>
            <p className="text-sm italic">{calibrationQuestion}</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/10 p-4">
            <h3 className="font-medium mb-3">Audit a Belief</h3>
            <textarea
              value={newBelief}
              onChange={(e) => setNewBelief(e.target.value)}
              placeholder="I believe that..."
              className="w-full rounded-lg border border-white/10 bg-black/20 p-3 min-h-[60px] text-sm mb-3"
              data-testid="input-belief"
            />
            <div className="flex flex-wrap gap-3 mb-3">
              <div>
                <label className="text-xs opacity-60 block mb-1">Certainty: {newCertainty}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={newCertainty}
                  onChange={(e) => setNewCertainty(parseInt(e.target.value))}
                  className="w-32"
                  data-testid="input-certainty"
                />
              </div>
              <div>
                <label className="text-xs opacity-60 block mb-1">Source Quality</label>
                <select
                  value={newSourceQuality}
                  onChange={(e) => setNewSourceQuality(e.target.value as BeliefAudit["sourceQuality"])}
                  className="rounded border border-white/10 bg-black/20 px-2 py-1 text-sm"
                  data-testid="select-source"
                >
                  {Object.entries(SOURCE_QUALITY_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={handleAddBeliefAudit}
              disabled={!newBelief.trim()}
              className="rounded-lg bg-emerald-500/20 border border-emerald-500/30 px-4 py-2 text-sm disabled:opacity-40"
              data-testid="button-add-belief"
            >
              Add to Audit
            </button>
          </div>

          {profile.beliefAudits.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium opacity-70">Belief Inventory</h3>
              {profile.beliefAudits.map(audit => (
                <div key={audit.id} className="rounded-lg border border-white/10 bg-black/10 p-3">
                  <p className="text-sm mb-1">{audit.belief}</p>
                  <span className="text-xs opacity-50">
                    {audit.certainty}% certain • {SOURCE_QUALITY_LABELS[audit.sourceQuality]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "calibration" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-white/10 bg-black/10 p-4">
            <h3 className="font-medium mb-3">Your Calibration</h3>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="text-center p-3 rounded-lg bg-white/5">
                <div className="text-2xl font-bold">{calibration.brierScore}</div>
                <div className="text-xs opacity-60">Brier Score</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-white/5">
                <div className="text-2xl font-bold">{Math.round(calibration.overconfidence)}%</div>
                <div className="text-xs opacity-60">Overconfidence</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-white/5">
                <div className="text-2xl font-bold">{resolvedPredictions.length}</div>
                <div className="text-xs opacity-60">Resolved</div>
              </div>
            </div>
            {calibration.observations.map((obs, i) => (
              <p key={i} className="text-sm opacity-80 mt-3">{obs}</p>
            ))}
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium opacity-70">Epistemic Virtues</h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {EPISTEMIC_VIRTUES.map(virtue => (
                <div key={virtue.id} className="rounded-lg border border-white/10 bg-black/10 p-3">
                  <span className="font-medium text-sm">{virtue.name}</span>
                  <p className="text-xs opacity-60 mt-0.5">{virtue.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
