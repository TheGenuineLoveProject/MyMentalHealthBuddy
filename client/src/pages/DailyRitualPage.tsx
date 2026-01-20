import { useState, useMemo } from "react";
import { reflectionModes, getRandomQuestion } from "@/lib/reflectionModes";

const stateDimensions = {
  energy: {
    label: "Energy",
    options: [
      { value: 1, label: "Depleted" },
      { value: 2, label: "Low" },
      { value: 3, label: "Neutral" },
      { value: 4, label: "Steady" },
      { value: 5, label: "Wired" },
    ],
  },
  clarity: {
    label: "Clarity",
    options: [
      { value: 1, label: "Foggy" },
      { value: 2, label: "Scattered" },
      { value: 3, label: "Mixed" },
      { value: 4, label: "Clear" },
      { value: 5, label: "Sharp" },
    ],
  },
  openness: {
    label: "Openness",
    options: [
      { value: 1, label: "Closed" },
      { value: 2, label: "Guarded" },
      { value: 3, label: "Selective" },
      { value: 4, label: "Receptive" },
      { value: 5, label: "Expansive" },
    ],
  },
  regulation: {
    label: "Regulation",
    options: [
      { value: 1, label: "Reactive" },
      { value: 2, label: "Unstable" },
      { value: 3, label: "Variable" },
      { value: 4, label: "Stable" },
      { value: 5, label: "Grounded" },
    ],
  },
  presence: {
    label: "Presence",
    options: [
      { value: 1, label: "Distant" },
      { value: 2, label: "Distracted" },
      { value: 3, label: "Partial" },
      { value: 4, label: "Engaged" },
      { value: 5, label: "Absorbed" },
    ],
  },
  pace: {
    label: "Pace",
    options: [
      { value: 1, label: "Rushed" },
      { value: 2, label: "Hurried" },
      { value: 3, label: "Moderate" },
      { value: 4, label: "Unhurried" },
      { value: 5, label: "Still" },
    ],
  },
};

const dimensionOrder = ["energy", "clarity", "openness", "regulation", "presence", "pace"];

import { buildInsightCards } from "@/lib/insights/insightEngine";
import InsightCards from "@/components/insights/InsightCards";
import { BookOpen, Heart, Network, Sun, Moon, Compass, ChevronRight, Check, Sparkles } from "lucide-react";

const STORAGE_KEY = "glp_daily_ritual";

const iconMap: Record<string, typeof BookOpen> = {
  BookOpen,
  Heart,
  Network,
  Sun,
  Moon,
  Compass,
};

type RitualStep = "state" | "mode" | "reflect" | "insights" | "complete";

interface StateValues {
  energy: number;
  clarity: number;
  openness: number;
  regulation: number;
  presence: number;
  pace: number;
}

export default function DailyRitualPage() {
  const [step, setStep] = useState<RitualStep>("state");
  const [stateValues, setStateValues] = useState<StateValues>({
    energy: 3,
    clarity: 3,
    openness: 3,
    regulation: 3,
    presence: 3,
    pace: 3,
  });
  const [selectedMode, setSelectedMode] = useState("narrative");
  const [reflectionText, setReflectionText] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);

  const insightOutput = useMemo(() => {
    if (reflectionText.trim().length < 10) return null;
    return buildInsightCards(reflectionText);
  }, [reflectionText]);

  const handleStateChange = (dimension: string, value: number) => {
    setStateValues((prev) => ({ ...prev, [dimension]: value }));
  };

  const handleModeSelect = (modeId: string) => {
    setSelectedMode(modeId);
    setCurrentQuestion(getRandomQuestion(modeId));
  };

  const handleNewQuestion = () => {
    setCurrentQuestion(getRandomQuestion(selectedMode));
  };

  const saveToLocal = () => {
    const ritual = {
      date: new Date().toISOString().split("T")[0],
      state: stateValues,
      mode: selectedMode,
      reflection: reflectionText,
      insightTags: insightOutput?.tags || [],
      savedAt: new Date().toISOString(),
    };
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    existing.push(ritual);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  };

  const handleComplete = () => {
    saveToLocal();
    setStep("complete");
  };

  const mode = reflectionModes.find((m) => m.id === selectedMode);
  const ModeIcon = mode ? iconMap[mode.icon] || Sparkles : Sparkles;

  return (
    <div className="min-h-screen hero-gradient">
      <div className="content-wrapper py-8">
        <div className="mx-auto max-w-2xl">
        <header className="mb-8 text-center">
          <div className="icon-container icon-xl icon-gradient-blush mx-auto mb-4">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="text-display-lg text-teal" data-testid="text-page-title">Daily Ritual</h1>
          <p className="text-lead mt-2">
            A gentle practice for noticing where you are — no fixing required.
          </p>
        </header>

        <div className="mb-6 flex items-center justify-center gap-2">
          {["state", "mode", "reflect", "insights", "complete"].map((s, i) => (
            <div
              key={s}
              className={`flex items-center gap-2 ${
                step === s ? "text-[var(--teal-600)] font-medium" : "text-[var(--sage-400)]"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all ${
                  step === s
                    ? "bg-[var(--sage-500)] text-white"
                    : step === "complete" || ["state", "mode", "reflect", "insights"].indexOf(step) > i
                    ? "bg-[var(--sage-200)] text-[var(--sage-600)]"
                    : "bg-[var(--sage-100)] text-[var(--sage-400)]"
                }`}
              >
                {["state", "mode", "reflect", "insights"].indexOf(step) > i || step === "complete" ? (
                  <Check className="w-4 h-4" />
                ) : (
                  i + 1
                )}
              </div>
              {i < 4 && <ChevronRight className="w-4 h-4 text-[var(--sage-300)]" />}
            </div>
          ))}
        </div>

        {step === "state" && (
          <section className="space-y-6">
            <div className="card-bordered">
              <h2 className="text-heading-md text-teal mb-4">Notice your state</h2>
              <p className="text-body-sm mb-6">
                Where are you right now? No need to fix anything — just observe.
              </p>

              <div className="space-y-6">
                {dimensionOrder.map((dim: string) => {
                  const d = stateDimensions[dim as keyof typeof stateDimensions];
                  return (
                    <div key={dim}>
                      <div className="flex justify-between mb-2">
                        <span className="text-heading-sm text-teal">{d.label}</span>
                        <span className="text-body-sm text-[var(--sage-600)]">
                          {d.options[stateValues[dim as keyof StateValues] - 1]?.label}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={5}
                        value={stateValues[dim as keyof StateValues]}
                        onChange={(e) => handleStateChange(dim, parseInt(e.target.value))}
                        className="w-full accent-[var(--sage-500)]"
                        data-testid={`slider-${dim}`}
                      />
                      <div className="flex justify-between text-caption mt-1">
                        <span>{d.options[0].label}</span>
                        <span>{d.options[4].label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => setStep("mode")}
              className="btn-premium w-full"
              data-testid="button-next-mode"
            >
              Continue
            </button>
          </section>
        )}

        {step === "mode" && (
          <section className="space-y-6">
            <div className="card-bordered">
              <h2 className="text-heading-md text-teal mb-4">Choose a reflection lens</h2>
              <p className="text-body-sm mb-6">
                Each mode offers a different way to witness yourself. Pick what resonates.
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                {reflectionModes.map((m) => {
                  const Icon = iconMap[m.icon] || Sparkles;
                  return (
                    <button
                      key={m.id}
                      onClick={() => handleModeSelect(m.id)}
                      className={`rounded-xl border p-4 text-left transition-all hover:border-[var(--sage-400)] hover:shadow-md ${
                        selectedMode === m.id ? "border-[var(--sage-500)] bg-[var(--sage-50)]" : "border-[var(--sage-200)] bg-white"
                      }`}
                      data-testid={`button-mode-${m.id}`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="icon-container icon-sm icon-soft-teal">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-heading-sm text-teal">{m.name}</span>
                      </div>
                      <p className="text-caption">{m.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("state")}
                className="btn-secondary-premium flex-1"
                data-testid="button-back-state"
              >
                Back
              </button>
              <button
                onClick={() => setStep("reflect")}
                className="btn-premium flex-1"
                data-testid="button-next-reflect"
              >
                Continue
              </button>
            </div>
          </section>
        )}

        {step === "reflect" && (
          <section className="space-y-6">
            <div className="card-bordered">
              <div className="flex items-center gap-3 mb-4">
                <div className="icon-container icon-md icon-gradient-sage">
                  <ModeIcon className="w-5 h-5" />
                </div>
                <h2 className="text-heading-md text-teal">{mode?.name}</h2>
              </div>

              {currentQuestion && (
                <div className="mb-4 p-4 rounded-xl bg-[var(--sage-50)] border-l-4 border-[var(--sage-500)]">
                  <p className="text-body-sm italic text-[var(--teal-700)]">"{currentQuestion}"</p>
                  <button
                    onClick={handleNewQuestion}
                    className="mt-2 text-caption text-[var(--sage-600)] hover:text-[var(--teal-600)] hover:underline transition"
                    data-testid="button-new-question"
                  >
                    Try a different question
                  </button>
                </div>
              )}

              <textarea
                value={reflectionText}
                onChange={(e) => setReflectionText(e.target.value)}
                placeholder="Write whatever comes up... no one will judge."
                className="input-premium w-full min-h-[200px] resize-none"
                data-testid="input-reflection"
              />

              <p className="mt-2 text-caption">{mode?.closingPrompt}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("mode")}
                className="btn-secondary-premium flex-1"
                data-testid="button-back-mode"
              >
                Back
              </button>
              <button
                onClick={() => setStep("insights")}
                disabled={reflectionText.trim().length < 10}
                className="btn-premium flex-1 disabled:opacity-50"
                data-testid="button-next-insights"
              >
                See Insights
              </button>
            </div>
          </section>
        )}

        {step === "insights" && (
          <section className="space-y-6">
            <div className="card-bordered">
              <h2 className="text-heading-md text-teal mb-2">Your gentle insights</h2>
              <p className="text-body-sm mb-4">
                Take what resonates. Leave what doesn't. You know yourself best.
              </p>

              {insightOutput && (
                <InsightCards
                  cards={insightOutput.cards}
                  tags={insightOutput.tags}
                />
              )}

              <div className="mt-6 p-4 rounded-xl bg-[var(--sage-50)] border border-[var(--sage-200)]">
                <h3 className="text-heading-sm text-teal mb-2">Today's Insight</h3>
                <p className="text-body-sm italic">
                  A thought you may want to sit with today.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("reflect")}
                className="btn-secondary-premium flex-1"
                data-testid="button-back-reflect"
              >
                Back
              </button>
              <button
                onClick={handleComplete}
                className="btn-premium flex-1"
                data-testid="button-complete"
              >
                Complete Ritual
              </button>
            </div>
          </section>
        )}

        {step === "complete" && (
          <section className="text-center space-y-6">
            <div className="card-bordered py-8">
              <div className="icon-container icon-xl icon-gradient-sage mx-auto mb-4">
                <Check className="w-8 h-8" />
              </div>
              <h2 className="text-heading-lg text-teal mb-2">Ritual Complete</h2>
              <p className="text-body-sm">
                You showed up for yourself today. That matters.
              </p>
              <p className="mt-4 text-caption">
                Your reflection has been saved locally — private, on your device.
              </p>
            </div>

            <button
              onClick={() => {
                setStep("state");
                setReflectionText("");
                setStateValues({ energy: 3, clarity: 3, openness: 3, regulation: 3, presence: 3, pace: 3 });
              }}
              className="btn-secondary-premium"
              data-testid="button-start-new"
            >
              Start New Ritual
            </button>
          </section>
        )}

        <footer className="mt-12 text-center">
          <p className="text-caption">This is a reflection tool, not medical advice or diagnosis.</p>
          <p className="text-caption mt-1">You know yourself best.</p>
        </footer>
        </div>
      </div>
    </div>
  );
}
