import { useState, useEffect } from "react";
import { Lightbulb, ArrowRight, RefreshCw, Save, History, Sparkles, ChevronDown, Check } from "lucide-react";

const REFRAMING_EXAMPLES = [
  {
    negative: "I'm such a failure",
    reframed: "I'm learning and growing from my experiences",
    category: "self-worth"
  },
  {
    negative: "Everything always goes wrong",
    reframed: "I face challenges, but I've overcome difficulties before",
    category: "catastrophizing"
  },
  {
    negative: "Nobody cares about me",
    reframed: "Some people may not show it, but there are those who value me",
    category: "relationships"
  },
  {
    negative: "I can't do anything right",
    reframed: "I have strengths, and I'm capable of improvement",
    category: "abilities"
  },
  {
    negative: "This situation is hopeless",
    reframed: "This is difficult, but situations can change",
    category: "hopelessness"
  },
];

const COGNITIVE_DISTORTIONS = [
  { name: "All-or-Nothing", description: "Seeing things in black and white" },
  { name: "Catastrophizing", description: "Expecting the worst outcome" },
  { name: "Mind Reading", description: "Assuming what others think" },
  { name: "Fortune Telling", description: "Predicting negative futures" },
  { name: "Emotional Reasoning", description: "Feelings = facts" },
  { name: "Should Statements", description: "Rigid expectations of self/others" },
];

const REFRAMING_PROMPTS = [
  "What would you tell a friend in this situation?",
  "What evidence contradicts this thought?",
  "Is there another way to look at this?",
  "What's a more balanced perspective?",
  "How will this matter in 5 years?",
];

export default function PositiveReframing() {
  const [negativeThought, setNegativeThought] = useState("");
  const [reframedThought, setReframedThought] = useState("");
  const [currentPrompt, setCurrentPrompt] = useState(REFRAMING_PROMPTS[0]);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedHistory = localStorage.getItem("reframing_history");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const getNewPrompt = () => {
    const available = REFRAMING_PROMPTS.filter(p => p !== currentPrompt);
    setCurrentPrompt(available[Math.floor(Math.random() * available.length)]);
  };

  const saveReframe = () => {
    if (!negativeThought.trim() || !reframedThought.trim()) return;
    
    const entry = {
      negative: negativeThought,
      reframed: reframedThought,
      date: new Date().toISOString(),
      id: Date.now().toString(),
    };
    
    const newHistory = [entry, ...history].slice(0, 50);
    setHistory(newHistory);
    try { localStorage.setItem("reframing_history", JSON.stringify(newHistory)); } catch (err) { console.warn("[storage-safe-write]", err); }
    
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setNegativeThought("");
      setReframedThought("");
    }, 1500);
  };

  const useExample = (example) => {
    setNegativeThought(example.negative);
    setReframedThought(example.reframed);
    setShowExample(false);
  };

  return (
    <div className="card-elevated p-6 relative overflow-hidden" data-testid="positive-reframing">
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-amber-400/10 to-yellow-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg">
              <Lightbulb className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-display font-bold text-[var(--text)]" data-testid="text-reframing-title">
                Positive Reframing
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">Transform negative thoughts</p>
            </div>
          </div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`p-2 rounded-xl transition-colors ${showHistory ? "bg-[var(--primary)] text-white" : "bg-[var(--surface)] text-[var(--text-muted)]"}`}
            data-testid="button-history"
            aria-label="View history"
          >
            <History className="w-5 h-5" />
          </button>
        </div>

        {!showHistory ? (
          <>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-[var(--text-secondary)]">
                  Negative thought I'm having:
                </label>
                <button
                  onClick={() => setShowExample(!showExample)}
                  className="text-xs text-[var(--primary)] hover:underline"
                  data-testid="button-show-examples"
                >
                  See examples
                </button>
              </div>
              <textarea
                value={negativeThought}
                onChange={(e) => setNegativeThought(e.target.value)}
                placeholder="Write the negative thought that's bothering you..."
                className="w-full px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
                rows={3}
                data-testid="textarea-negative"
                aria-label="Negative thought"
              />
            </div>

            {showExample && (
              <div className="mb-6 p-4 rounded-xl bg-[var(--surface)] animate-fade-in-up">
                <h4 className="text-sm font-medium text-[var(--text-secondary)] mb-3">
                  Example Reframes:
                </h4>
                <div className="space-y-2">
                  {REFRAMING_EXAMPLES.map((ex, i) => (
                    <button
                      key={i}
                      onClick={() => useExample(ex)}
                      className="w-full p-3 rounded-lg bg-[var(--bg)] hover:bg-[var(--surface-hover)] text-left transition-colors"
                      data-testid={`button-example-${i}`}
                    >
                      <p className="text-sm text-red-500 line-through">{ex.negative}</p>
                      <p className="text-sm text-emerald-600 dark:text-emerald-400">→ {ex.reframed}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-center gap-2 py-4">
              <ArrowRight className="w-6 h-6 text-[var(--primary)]" />
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-[var(--text-secondary)]">
                  A more balanced perspective:
                </label>
                <button
                  onClick={getNewPrompt}
                  className="text-xs text-[var(--primary)] flex items-center gap-1 hover:underline"
                  data-testid="button-new-prompt"
                >
                  <RefreshCw className="w-3 h-3" />
                  New prompt
                </button>
              </div>
              
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 mb-3">
                <p className="text-sm text-amber-700 dark:text-amber-300 italic" data-testid="text-prompt">
                  💡 {currentPrompt}
                </p>
              </div>
              
              <textarea
                value={reframedThought}
                onChange={(e) => setReframedThought(e.target.value)}
                placeholder="Write a more balanced, compassionate perspective..."
                className="w-full px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
                rows={3}
                data-testid="textarea-reframed"
                aria-label="Reframed thought"
              />
            </div>

            <button
              onClick={saveReframe}
              disabled={!negativeThought.trim() || !reframedThought.trim()}
              className={`w-full py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                saved
                  ? "bg-emerald-500 text-white"
                  : "btn-gradient shadow-lg hover:shadow-xl disabled:opacity-50"
              }`}
              data-testid="button-save"
            >
              {saved ? (
                <>
                  <Check className="w-5 h-5" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Reframe
                </>
              )}
            </button>

            <div className="mt-6 pt-4 border-t border-[var(--border)]">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="w-full flex items-center justify-between text-sm text-[var(--text-secondary)]"
                data-testid="button-toggle-distortions"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Common Cognitive Distortions
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="animate-fade-in-up">
            <h4 className="font-semibold text-[var(--text)] mb-4">Reframing History</h4>
            
            {history.length === 0 ? (
              <div className="text-center py-8">
                <Lightbulb className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-3" />
                <p className="text-[var(--text-secondary)]">No reframes saved yet.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {history.map((entry) => (
                  <div key={entry.id} className="p-4 rounded-xl bg-[var(--surface)]">
                    <p className="text-sm text-red-500 mb-2">{entry.negative}</p>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400">↓ {entry.reframed}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-2">
                      {new Date(entry.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setShowHistory(false)}
              className="w-full mt-4 py-3 rounded-xl bg-[var(--surface)] text-[var(--text)] font-medium hover:bg-[var(--surface-hover)] transition-colors"
              data-testid="button-back"
            >
              Back to Reframing
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
