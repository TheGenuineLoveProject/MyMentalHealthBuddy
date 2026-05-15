import { useState, useEffect } from "react";
import {
  DECISION_FRAMEWORKS,
  createDecisionFrame,
  createDecisionOption,
  saveDecisionFrame,
  getDecisionFrames,
  deleteDecisionFrame,
  getRandomPremortemPrompt,
  scoreOption
} from "@/lib/decision/decisionArchitecture";
import { Scale, Plus, Trash2, RefreshCw, ThumbsUp, ThumbsDown } from "lucide-react";

export default function DecisionArchitecture() {
  const [frames, setFrames] = useState([]);
  const [activeFrame, setActiveFrame] = useState(null);
  const [newQuestion, setNewQuestion] = useState("");
  const [newOptionLabel, setNewOptionLabel] = useState("");
  const [premortemPrompt, setPremortemPrompt] = useState(() => getRandomPremortemPrompt());
  const [showFrameworks, setShowFrameworks] = useState(false);

  useEffect(() => {
    setFrames(getDecisionFrames());
  }, []);

  function handleCreateFrame() {
    if (!newQuestion.trim()) return;
    const frame = createDecisionFrame(newQuestion);
    saveDecisionFrame(frame);
    setActiveFrame(frame);
    setFrames(getDecisionFrames());
    setNewQuestion("");
  }

  function handleAddOption() {
    if (!activeFrame || !newOptionLabel.trim()) return;
    const option = createDecisionOption(newOptionLabel);
    const updated = { ...activeFrame, options: [...activeFrame.options, option] };
    saveDecisionFrame(updated);
    setActiveFrame(updated);
    setNewOptionLabel("");
  }

  function handleUpdateOption(optionId, updates) {
    if (!activeFrame) return;
    const updated = {
      ...activeFrame,
      options: activeFrame.options.map(o => o.id === optionId ? { ...o, ...updates } : o)
    };
    saveDecisionFrame(updated);
    setActiveFrame(updated);
  }

  function handleAddProCon(optionId, type, value) {
    if (!activeFrame || !value.trim()) return;
    const option = activeFrame.options.find(o => o.id === optionId);
    if (!option) return;
    const updated = {
      ...activeFrame,
      options: activeFrame.options.map(o => 
        o.id === optionId ? { ...o, [type]: [...o[type], value] } : o
      )
    };
    saveDecisionFrame(updated);
    setActiveFrame(updated);
  }

  function handleUpdateFrame(updates) {
    if (!activeFrame) return;
    const updated = { ...activeFrame, ...updates };
    saveDecisionFrame(updated);
    setActiveFrame(updated);
  }

  if (activeFrame) {
    return (
      <div className="space-y-6" role="main" aria-label={`Decision analysis: ${activeFrame.question}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">{activeFrame.question}</h2>
            <p className="text-sm opacity-60">{activeFrame.options.length} options</p>
          </div>
          <button
            onClick={() => { setFrames(getDecisionFrames()); setActiveFrame(null); }}
            className="text-sm opacity-70 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-2 py-1"
            aria-label="Exit decision analysis and return to list"
            data-testid="button-exit-decision"
          >
            Exit
          </button>
        </div>

        <div className="flex gap-2">
          <label htmlFor="option-label" className="sr-only">Add an option to consider</label>
          <input
            id="option-label"
            type="text"
            value={newOptionLabel}
            onChange={(e) => setNewOptionLabel(e.target.value)}
            placeholder="Add an option to consider..."
            className="flex-1 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            data-testid="input-option-label"
          />
          <button
            onClick={handleAddOption}
            disabled={!newOptionLabel.trim()}
            className="rounded-lg bg-indigo-500/20 border border-indigo-500/30 px-4 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label="Add option"
            data-testid="button-add-option"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div role="list" aria-label="Decision options">
          {activeFrame.options.map(option => {
            const score = scoreOption(option, activeFrame.criteria);
            return (
              <div key={option.id} className="rounded-xl border border-white/10 bg-black/10 p-4 mb-4" role="listitem">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium">{option.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs opacity-50">Score: {score}%</span>
                    <label htmlFor={`reversibility-${option.id}`} className="sr-only">Reversibility level</label>
                    <select
                      id={`reversibility-${option.id}`}
                      value={option.reversibility}
                      onChange={(e) => handleUpdateOption(option.id, { reversibility: e.target.value })}
                      className="rounded border border-white/10 bg-black/20 px-2 py-1 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                      data-testid={`select-reversibility-${option.id}`}
                    >
                      <option value="easy">Easy to reverse</option>
                      <option value="moderate">Moderate</option>
                      <option value="difficult">Difficult</option>
                      <option value="irreversible">Irreversible</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <div className="flex items-center gap-1 mb-2 text-sm">
                      <ThumbsUp className="h-3 w-3 text-green-400" aria-hidden="true" />
                      <span className="opacity-70">Benefits</span>
                    </div>
                    <div className="space-y-1" role="list" aria-label={`Benefits for ${option.label}`}>
                      {option.pros.map((pro, i) => (
                        <div key={i} className="text-sm px-2 py-1 rounded bg-green-500/10" role="listitem">{pro}</div>
                      ))}
                    </div>
                    <label htmlFor={`pro-input-${option.id}`} className="sr-only">Add a benefit</label>
                    <input
                      id={`pro-input-${option.id}`}
                      type="text"
                      placeholder="Add benefit..."
                      className="w-full mt-2 rounded border border-white/10 bg-black/20 px-2 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && e.currentTarget.value) {
                          handleAddProCon(option.id, "pros", e.currentTarget.value);
                          e.currentTarget.value = "";
                        }
                      }}
                      data-testid={`input-pro-${option.id}`}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1 mb-2 text-sm">
                      <ThumbsDown className="h-3 w-3 text-red-400" aria-hidden="true" />
                      <span className="opacity-70">Drawbacks</span>
                    </div>
                    <div className="space-y-1" role="list" aria-label={`Drawbacks for ${option.label}`}>
                      {option.cons.map((con, i) => (
                        <div key={i} className="text-sm px-2 py-1 rounded bg-red-500/10" role="listitem">{con}</div>
                      ))}
                    </div>
                    <label htmlFor={`con-input-${option.id}`} className="sr-only">Add a drawback</label>
                    <input
                      id={`con-input-${option.id}`}
                      type="text"
                      placeholder="Add drawback..."
                      className="w-full mt-2 rounded border border-white/10 bg-black/20 px-2 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && e.currentTarget.value) {
                          handleAddProCon(option.id, "cons", e.currentTarget.value);
                          e.currentTarget.value = "";
                        }
                      }}
                      data-testid={`input-con-${option.id}`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-transparent p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium">Pre-Mortem Analysis</span>
            <button
              onClick={() => setPremortemPrompt(getRandomPremortemPrompt())}
              className="p-1.5 rounded-lg hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              aria-label="Get a new pre-mortem prompt"
              data-testid="button-new-premortem"
            >
              <RefreshCw className="h-4 w-4 opacity-60" aria-hidden="true" />
            </button>
          </div>
          <p className="text-sm italic mb-3">{premortemPrompt}</p>
          <label htmlFor="premortem-notes" className="sr-only">Pre-mortem analysis notes</label>
          <textarea
            id="premortem-notes"
            value={activeFrame.premortemNotes}
            onChange={(e) => handleUpdateFrame({ premortemNotes: e.target.value })}
            placeholder="What could go wrong? What are you not seeing?"
            className="w-full rounded-lg border border-white/10 bg-black/20 p-3 min-h-[100px] text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            data-testid="input-premortem"
          />
        </div>

        <button
          onClick={() => setShowFrameworks(!showFrameworks)}
          className="text-sm opacity-70 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-2 py-1"
          aria-expanded={showFrameworks}
          data-testid="button-toggle-frameworks"
        >
          {showFrameworks ? "Hide" : "Show"} Decision Frameworks
        </button>

        {showFrameworks && (
          <div className="grid gap-3 sm:grid-cols-2" role="list" aria-label="Decision frameworks">
            {DECISION_FRAMEWORKS.map(fw => (
              <div key={fw.id} className="rounded-xl border border-white/10 bg-black/10 p-4" role="listitem">
                <h4 className="font-medium">{fw.name}</h4>
                <p className="text-sm opacity-70 mt-1">{fw.description}</p>
                <p className="text-xs opacity-50 mt-2 italic">{fw.prompt}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6" role="main" aria-label="Decision Architecture - Structure complex decisions">
      <div className="flex items-center gap-2">
        <Scale className="h-5 w-5 text-indigo-400" aria-hidden="true" />
        <h2 className="text-xl font-semibold">Decision Architecture</h2>
      </div>

      <p className="text-sm opacity-80">
        Structure complex decisions with options, trade-offs, and pre-mortem analysis. 
        Not to find the "right" answer, but to think more clearly.
      </p>

      <div className="flex gap-2">
        <label htmlFor="decision-question" className="sr-only">What decision are you facing?</label>
        <input
          id="decision-question"
          type="text"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder="What decision are you facing?"
          className="flex-1 rounded-lg border border-white/10 bg-black/20 px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          data-testid="input-decision-question"
        />
        <button
          onClick={handleCreateFrame}
          disabled={!newQuestion.trim()}
          className="rounded-lg bg-indigo-500/20 border border-indigo-500/30 px-4 py-2 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          aria-label="Create decision frame"
          data-testid="button-create-decision"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {frames.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium opacity-70">Your Decisions</h3>
          <div role="list" aria-label="Your saved decisions">
            {frames.map(frame => (
              <div
                key={frame.id}
                className="rounded-xl border border-white/10 bg-black/10 p-4 flex items-center justify-between mb-3"
                role="listitem"
              >
                <button
                  onClick={() => setActiveFrame(frame)}
                  className="text-left flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded p-1"
                  aria-label={`Open decision: ${frame.question}`}
                  data-testid={`button-open-${frame.id}`}
                >
                  <span className="font-medium">{frame.question}</span>
                  <p className="text-xs opacity-50">{frame.options.length} options</p>
                </button>
                <button
                  onClick={() => { deleteDecisionFrame(frame.id); setFrames(getDecisionFrames()); }}
                  className="p-2 rounded hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                  aria-label={`Delete decision: ${frame.question}`}
                  data-testid={`button-delete-${frame.id}`}
                >
                  <Trash2 className="h-4 w-4 opacity-60" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
