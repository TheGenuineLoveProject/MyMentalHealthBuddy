import { useState, useEffect } from "react";
import { Compass, Star, ChevronRight, Heart, RefreshCw } from 'lucide-react';

const VALUES_LIST = [
  { id: "authenticity", name: "Authenticity", description: "Being true to yourself" },
  { id: "adventure", name: "Adventure", description: "Seeking new experiences" },
  { id: "balance", name: "Balance", description: "Maintaining equilibrium in life" },
  { id: "compassion", name: "Compassion", description: "Caring for others' wellbeing" },
  { id: "creativity", name: "Creativity", description: "Expressing yourself uniquely" },
  { id: "curiosity", name: "Curiosity", description: "Desire to learn and explore" },
  { id: "family", name: "Family", description: "Prioritizing loved ones" },
  { id: "freedom", name: "Freedom", description: "Independence and autonomy" },
  { id: "friendship", name: "Friendship", description: "Meaningful connections" },
  { id: "growth", name: "Growth", description: "Continuous self-improvement" },
  { id: "health", name: "Health", description: "Physical and mental wellness" },
  { id: "honesty", name: "Honesty", description: "Truth and integrity" },
  { id: "humor", name: "Humor", description: "Finding joy and laughter" },
  { id: "justice", name: "Justice", description: "Fairness and equality" },
  { id: "kindness", name: "Kindness", description: "Being gentle and helpful" },
  { id: "knowledge", name: "Knowledge", description: "Understanding and wisdom" },
  { id: "love", name: "Love", description: "Deep connection and care" },
  { id: "nature", name: "Nature", description: "Connection to the natural world" },
  { id: "peace", name: "Peace", description: "Inner calm and harmony" },
  { id: "purpose", name: "Purpose", description: "Meaningful direction in life" },
  { id: "respect", name: "Respect", description: "Honoring self and others" },
  { id: "security", name: "Security", description: "Safety and stability" },
  { id: "service", name: "Service", description: "Helping others and community" },
  { id: "spirituality", name: "Spirituality", description: "Connection to something greater" },
  { id: "success", name: "Success", description: "Achievement and accomplishment" },
];

const REFLECTION_PROMPTS = [
  "How does this value show up in your daily life?",
  "What would it look like to honor this value more?",
  "When have you felt most aligned with this value?",
  "What obstacles prevent you from living this value?",
  "How can you take one small step toward this value today?",
];

export default function ValuesExplorer() {
  const [selectedValues, setSelectedValues] = useState([]);
  const [topValues, setTopValues] = useState([]);
  const [step, setStep] = useState("select");
  const [reflectionIndex, setReflectionIndex] = useState(0);
  const [reflections, setReflections] = useState({});
  const [currentReflection, setCurrentReflection] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("values_explorer_data");
    if (saved) {
      const data = JSON.parse(saved);
      setTopValues(data.topValues || []);
      setReflections(data.reflections || {});
      if (data.topValues?.length > 0) {
        setStep("review");
      }
    }
  }, []);

  const toggleValue = (valueId) => {
    setSelectedValues((prev) =>
      prev.includes(valueId)
        ? prev.filter((v) => v !== valueId)
        : prev.length < 10
        ? [...prev, valueId]
        : prev
    );
  };

  const proceedToRanking = () => {
    if (selectedValues.length >= 5) {
      setStep("rank");
    }
  };

  const moveValue = (index, direction) => {
    const newValues = [...selectedValues];
    const newIndex = index + direction;
    if (newIndex >= 0 && newIndex < newValues.length) {
      [newValues[index], newValues[newIndex]] = [newValues[newIndex], newValues[index]];
      setSelectedValues(newValues);
    }
  };

  const finishRanking = () => {
    const top5 = selectedValues.slice(0, 5);
    setTopValues(top5);
    setStep("reflect");
    setReflectionIndex(0);
    
    try {
      localStorage.setItem("values_explorer_data", JSON.stringify({
        topValues: top5,
        reflections: reflections,
      }));
    } catch (err) { console.warn("[storage-safe-write]", err); }
  };

  const saveReflection = () => {
    if (!currentReflection.trim()) return;
    
    const valueId = topValues[reflectionIndex];
    const newReflections = {
      ...reflections,
      [valueId]: currentReflection,
    };
    setReflections(newReflections);
    setCurrentReflection("");
    
    if (reflectionIndex < topValues.length - 1) {
      setReflectionIndex((i) => i + 1);
    } else {
      setStep("review");
      try {
        localStorage.setItem("values_explorer_data", JSON.stringify({
          topValues,
          reflections: newReflections,
        }));
      } catch (err) { console.warn("[storage-safe-write]", err); }
    }
  };

  const startOver = () => {
    setStep("select");
    setSelectedValues([]);
    setTopValues([]);
    setReflections({});
    setCurrentReflection("");
    try { localStorage.removeItem("values_explorer_data"); } catch (err) { console.warn("[storage-safe-write]", err); }
  };

  const getValue = (id) => VALUES_LIST.find((v) => v.id === id);

  return (
    <div className="card-elevated p-6 relative overflow-hidden" data-testid="values-explorer">
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-emerald-400/10 to-teal-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg">
              <Compass className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-display font-bold text-[var(--text)]" data-testid="text-values-title">
                Values Explorer
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">Discover what matters most</p>
            </div>
          </div>
        </div>

        {step === "select" && (
          <div className="animate-fade-in-up">
            <p className="text-[var(--text-secondary)] mb-4">
              Select 5-10 values that resonate with you:
            </p>
            <div className="grid grid-cols-2 gap-2 mb-6 max-h-64 overflow-y-auto">
              {VALUES_LIST.map((value) => (
                <button
                  key={value.id}
                  onClick={() => toggleValue(value.id)}
                  className={`p-3 rounded-xl text-left transition-all ${
                    selectedValues.includes(value.id)
                      ? "bg-emerald-100 dark:bg-emerald-900/30 border-2 border-emerald-400"
                      : "bg-[var(--surface)] hover:bg-[var(--surface-hover)] border-2 border-transparent"
                  }`}
                  data-testid={`button-value-${value.id}`}
                >
                  <span className="font-medium text-[var(--text)] block">{value.name}</span>
                  <span className="text-xs text-[var(--text-muted)]">{value.description}</span>
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--text-muted)]">
                Selected: {selectedValues.length}/10
              </span>
              <button
                onClick={proceedToRanking}
                disabled={selectedValues.length < 5}
                className="px-6 py-3 rounded-xl btn-gradient font-semibold disabled:opacity-50 flex items-center gap-2"
                data-testid="button-proceed"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === "rank" && (
          <div className="animate-fade-in-up">
            <p className="text-[var(--text-secondary)] mb-4">
              Drag to rank your values (most important at top):
            </p>
            <div className="space-y-2 mb-6">
              {selectedValues.map((valueId, index) => {
                const value = getValue(valueId);
                return (
                  <div key={valueId} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--surface)]">
                    <span className="w-8 h-8 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center font-bold">
                      {index + 1}
                    </span>
                    <span className="flex-1 font-medium text-[var(--text)]">{value?.name}</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => moveValue(index, -1)}
                        disabled={index === 0}
                        className="p-1.5 rounded-lg bg-[var(--surface-hover)] disabled:opacity-30"
                        aria-label="Move up"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveValue(index, 1)}
                        disabled={index === selectedValues.length - 1}
                        className="p-1.5 rounded-lg bg-[var(--surface-hover)] disabled:opacity-30"
                        aria-label="Move down"
                      >
                        ↓
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              onClick={finishRanking}
              className="w-full py-4 rounded-xl btn-gradient font-semibold shadow-lg"
              data-testid="button-finish-ranking"
            >
              Confirm Top 5 Values
            </button>
          </div>
        )}

        {step === "reflect" && (
          <div className="animate-fade-in-up">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5" />
                <span className="text-sm text-white/80">Value {reflectionIndex + 1} of {topValues.length}</span>
              </div>
              <h4 className="text-2xl font-bold mb-2">{getValue(topValues[reflectionIndex])?.name}</h4>
              <p className="text-white/90 italic">
                "{REFLECTION_PROMPTS[reflectionIndex % REFLECTION_PROMPTS.length]}"
              </p>
            </div>
            <textarea
              value={currentReflection}
              onChange={(e) => setCurrentReflection(e.target.value)}
              placeholder="Write your reflection..."
              className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none mb-4"
              rows={4}
              data-testid="textarea-reflection"
              aria-label="Value reflection"
            />
            <button
              onClick={saveReflection}
              disabled={!currentReflection.trim()}
              className="w-full py-4 rounded-xl btn-gradient font-semibold shadow-lg disabled:opacity-50"
              data-testid="button-save-reflection"
            >
              {reflectionIndex < topValues.length - 1 ? "Next Value" : "Complete"}
            </button>
          </div>
        )}

        {step === "review" && (
          <div className="animate-fade-in-up">
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 mb-6">
              <h4 className="font-bold text-emerald-700 dark:text-emerald-300 mb-2 flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Your Core Values
              </h4>
              <p className="text-sm text-emerald-600 dark:text-emerald-400">
                These guide your decisions and define what's meaningful to you.
              </p>
            </div>
            <div className="space-y-3 mb-6">
              {topValues.map((valueId, index) => {
                const value = getValue(valueId);
                return (
                  <div key={valueId} className="p-4 rounded-xl bg-[var(--surface)]">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-white flex items-center justify-center font-bold">
                        {index + 1}
                      </span>
                      <span className="font-bold text-[var(--text)]">{value?.name}</span>
                    </div>
                    {reflections[valueId] && (
                      <p className="text-sm text-[var(--text-secondary)] ml-11 italic">
                        "{reflections[valueId]}"
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
            <button
              onClick={startOver}
              className="w-full py-3 rounded-xl bg-[var(--surface)] text-[var(--text)] font-medium hover:bg-[var(--surface-hover)] flex items-center justify-center gap-2"
              data-testid="button-start-over"
            >
              <RefreshCw className="w-4 h-4" />
              Explore Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
