import { useState, useEffect } from "react";
import {
  HORIZON_LABELS,
  EXPERIMENT_TEMPLATES,
  createLearningInquiry,
  createLearningExperiment,
  createFeedbackNote,
  createAutodidactPlan,
  saveAutodidactPlan,
  getAutodidactPlans,
  deleteAutodidactPlan,
  getRandomInquiryPrompt,
  calculateLearningMomentum,
  type LearningInquiry,
  type LearningExperiment,
  type AutodidactPlan
} from "@/lib/autodidact/autodidactForge";
import { Flame, Trash2, Beaker, RefreshCw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export default function AutodidactForge() {
  const { toast } = useToast();
  const [plans, setPlans] = useState<AutodidactPlan[]>([]);
  const [activePlan, setActivePlan] = useState<AutodidactPlan | null>(null);
  const [newIdentity, setNewIdentity] = useState("");
  const [inquiryPrompt, setInquiryPrompt] = useState(() => getRandomInquiryPrompt());
  const [newQuestion, setNewQuestion] = useState("");
  const [newHorizon, setNewHorizon] = useState<LearningInquiry["horizon"]>("short-term");
  const [showExperimentTemplates, setShowExperimentTemplates] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<string | null>(null);
  const [newHypothesis, setNewHypothesis] = useState("");

  useEffect(() => {
    setPlans(getAutodidactPlans());
  }, []);

  function handleCreatePlan() {
    if (!newIdentity.trim()) return;
    const plan = createAutodidactPlan(newIdentity);
    saveAutodidactPlan(plan);
    setActivePlan(plan);
    setPlans(getAutodidactPlans());
    setNewIdentity("");
  }

  function handleAddInquiry() {
    if (!activePlan || !newQuestion.trim()) return;
    const inquiry = createLearningInquiry(newQuestion, newHorizon);
    const updated = { ...activePlan, inquiries: [...activePlan.inquiries, inquiry] };
    saveAutodidactPlan(updated);
    setActivePlan(updated);
    setNewQuestion("");
  }

  function handleAddExperiment() {
    if (!activePlan || !selectedInquiry || !newHypothesis.trim()) return;
    const experiment = createLearningExperiment(selectedInquiry, newHypothesis);
    const updated = { ...activePlan, experiments: [...activePlan.experiments, experiment] };
    saveAutodidactPlan(updated);
    setActivePlan(updated);
    setNewHypothesis("");
    setShowExperimentTemplates(false);
    toast({ title: "Experiment added" });
  }

  function handleUpdateInquiryStatus(inquiryId: string, status: LearningInquiry["status"]) {
    if (!activePlan) return;
    const updated = {
      ...activePlan,
      inquiries: activePlan.inquiries.map(i => i.id === inquiryId ? { ...i, status } : i)
    };
    saveAutodidactPlan(updated);
    setActivePlan(updated);
  }

  function handleDeleteInquiry(inquiryId: string) {
    if (!activePlan) return;
    const updated = {
      ...activePlan,
      inquiries: activePlan.inquiries.filter(i => i.id !== inquiryId),
      experiments: activePlan.experiments.filter(e => e.inquiryId !== inquiryId)
    };
    saveAutodidactPlan(updated);
    setActivePlan(updated);
  }

  if (activePlan) {
    const momentum = calculateLearningMomentum(activePlan);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Learning Forge</h2>
            <p className="text-sm opacity-80 italic">{activePlan.identityStatement}</p>
          </div>
          <button
            onClick={() => { setPlans(getAutodidactPlans()); setActivePlan(null); }}
            className="text-sm opacity-70 hover:opacity-100"
            data-testid="button-exit-autodidact"
          >
            Exit
          </button>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/10 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm opacity-70">Learning Momentum</span>
            <span className="text-sm">{momentum}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
              style={{ width: `${momentum}%` }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-transparent p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium">Inquiry Spark</span>
            <button
              onClick={() => setInquiryPrompt(getRandomInquiryPrompt())}
              className="p-1.5 rounded-lg hover:bg-white/10"
              data-testid="button-new-inquiry-prompt"
            >
              <RefreshCw className="h-4 w-4 opacity-60" />
            </button>
          </div>
          <p className="text-sm italic">{inquiryPrompt}</p>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/10 p-4">
          <h3 className="font-medium mb-3">Add Learning Inquiry</h3>
          <input
            type="text"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="What question drives your learning?"
            className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm mb-2"
            data-testid="input-inquiry-question"
          />
          <div className="flex gap-2 mb-3">
            {(Object.keys(HORIZON_LABELS) as LearningInquiry["horizon"][]).map(h => (
              <button
                key={h}
                onClick={() => setNewHorizon(h)}
                className={`rounded px-2 py-1 text-xs ${newHorizon === h ? "bg-white/20" : "bg-white/5"}`}
                data-testid={`button-horizon-${h}`}
              >
                {HORIZON_LABELS[h].label}
              </button>
            ))}
          </div>
          <button
            onClick={handleAddInquiry}
            disabled={!newQuestion.trim()}
            className="rounded-lg bg-amber-500/20 border border-amber-500/30 px-4 py-2 text-sm disabled:opacity-40"
            data-testid="button-add-inquiry"
          >
            Add Inquiry
          </button>
        </div>

        {activePlan.inquiries.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium opacity-70">Your Inquiries</h3>
            {activePlan.inquiries.map(inquiry => {
              const experiments = activePlan.experiments.filter(e => e.inquiryId === inquiry.id);
              return (
                <div key={inquiry.id} className="rounded-xl border border-white/10 bg-black/10 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 mr-2">
                        {HORIZON_LABELS[inquiry.horizon].label}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        inquiry.status === "active" ? "bg-green-500/20 text-green-400" :
                        inquiry.status === "integrated" ? "bg-blue-500/20 text-blue-400" :
                        "bg-white/10"
                      }`}>
                        {inquiry.status}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteInquiry(inquiry.id)}
                      className="p-1 rounded hover:bg-white/10"
                      data-testid={`button-delete-inquiry-${inquiry.id}`}
                    >
                      <Trash2 className="h-4 w-4 opacity-60" />
                    </button>
                  </div>
                  <p className="font-medium mb-2">{inquiry.question}</p>
                  
                  <div className="flex gap-2 mb-2">
                    {(["exploring", "active", "integrated", "dormant"] as const).map(s => (
                      <button
                        key={s}
                        onClick={() => handleUpdateInquiryStatus(inquiry.id, s)}
                        className={`text-xs px-2 py-1 rounded ${inquiry.status === s ? "bg-white/20" : "bg-white/5"}`}
                        data-testid={`button-status-${inquiry.id}-${s}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>

                  {experiments.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <span className="text-xs opacity-60">{experiments.length} experiment(s)</span>
                    </div>
                  )}

                  <button
                    onClick={() => { setSelectedInquiry(inquiry.id); setShowExperimentTemplates(true); }}
                    className="mt-2 flex items-center gap-1 text-xs opacity-70 hover:opacity-100"
                    data-testid={`button-add-experiment-${inquiry.id}`}
                  >
                    <Beaker className="h-3 w-3" />
                    Add Experiment
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {showExperimentTemplates && selectedInquiry && (
          <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-transparent p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Beaker className="h-5 w-5 text-purple-400" />
                <span className="font-medium">Design Experiment</span>
              </div>
              <button
                onClick={() => setShowExperimentTemplates(false)}
                className="text-sm opacity-70"
                data-testid="button-close-experiment"
              >
                Cancel
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {EXPERIMENT_TEMPLATES.map((template, idx) => (
                <button
                  key={idx}
                  onClick={() => setNewHypothesis(template.description)}
                  className="rounded px-2 py-1 text-xs bg-white/5 hover:bg-white/10"
                  data-testid={`button-template-${idx}`}
                >
                  {template.name}
                </button>
              ))}
            </div>

            <textarea
              value={newHypothesis}
              onChange={(e) => setNewHypothesis(e.target.value)}
              placeholder="What's your hypothesis or approach?"
              className="w-full rounded-lg border border-white/10 bg-black/20 p-3 min-h-[80px] text-sm mb-3"
              data-testid="input-experiment-hypothesis"
            />

            <button
              onClick={handleAddExperiment}
              disabled={!newHypothesis.trim()}
              className="rounded-lg bg-purple-500/20 border border-purple-500/30 px-4 py-2 text-sm disabled:opacity-40"
              data-testid="button-create-experiment"
            >
              Create Experiment
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Flame className="h-5 w-5 text-amber-400" />
        <h2 className="text-xl font-semibold">Autodidact Forge</h2>
      </div>

      <p className="text-sm opacity-80">
        Design your own learning journey. Define inquiries, run experiments, and track your evolution 
        without grades or external validation.
      </p>

      <div className="space-y-3">
        <label className="text-sm opacity-70 block">
          Start with your learning identity statement:
        </label>
        <input
          type="text"
          value={newIdentity}
          onChange={(e) => setNewIdentity(e.target.value)}
          placeholder="I am someone who..."
          className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2"
          data-testid="input-identity"
        />
        <button
          onClick={handleCreatePlan}
          disabled={!newIdentity.trim()}
          className="rounded-lg bg-amber-500/20 border border-amber-500/30 px-4 py-2 disabled:opacity-40"
          data-testid="button-create-plan"
        >
          Begin Forging
        </button>
      </div>

      {plans.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium opacity-70">Your Learning Plans</h3>
          {plans.map(plan => (
            <div
              key={plan.id}
              className="rounded-xl border border-white/10 bg-black/10 p-4 flex items-center justify-between"
            >
              <button
                onClick={() => setActivePlan(plan)}
                className="text-left flex-1"
                data-testid={`button-open-${plan.id}`}
              >
                <span className="font-medium">{plan.identityStatement}</span>
                <p className="text-xs opacity-50">
                  {plan.inquiries.length} inquiries • {plan.experiments.length} experiments
                </p>
              </button>
              <button
                onClick={() => { deleteAutodidactPlan(plan.id); setPlans(getAutodidactPlans()); }}
                className="p-2 rounded hover:bg-white/10"
                data-testid={`button-delete-${plan.id}`}
              >
                <Trash2 className="h-4 w-4 opacity-60" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
