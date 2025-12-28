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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-8 px-4">
      <div className="mx-auto max-w-2xl">
        <header className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Daily Ritual</h1>
          <p className="mt-2 text-muted-foreground">
            A gentle practice for noticing where you are — no fixing required.
          </p>
        </header>

        <div className="mb-6 flex items-center justify-center gap-2">
          {["state", "mode", "reflect", "insights", "complete"].map((s, i) => (
            <div
              key={s}
              className={`flex items-center gap-2 ${
                step === s ? "text-primary font-medium" : "text-muted-foreground"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  step === s
                    ? "bg-primary text-primary-foreground"
                    : step === "complete" || ["state", "mode", "reflect", "insights"].indexOf(step) > i
                    ? "bg-primary/20 text-primary"
                    : "bg-muted"
                }`}
              >
                {["state", "mode", "reflect", "insights"].indexOf(step) > i || step === "complete" ? (
                  <Check className="w-4 h-4" />
                ) : (
                  i + 1
                )}
              </div>
              {i < 4 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
            </div>
          ))}
        </div>

        {step === "state" && (
          <section className="space-y-6">
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-medium mb-4">Notice your state</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Where are you right now? No need to fix anything — just observe.
              </p>

              <div className="space-y-6">
                {dimensionOrder.map((dim: string) => {
                  const d = stateDimensions[dim as keyof typeof stateDimensions];
                  return (
                    <div key={dim}>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">{d.label}</span>
                        <span className="text-sm text-muted-foreground">
                          {d.options[stateValues[dim as keyof StateValues] - 1]?.label}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={5}
                        value={stateValues[dim as keyof StateValues]}
                        onChange={(e) => handleStateChange(dim, parseInt(e.target.value))}
                        className="w-full accent-primary"
                        data-testid={`slider-${dim}`}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
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
              className="w-full rounded-lg bg-primary py-3 text-primary-foreground font-medium hover:bg-primary/90"
              data-testid="button-next-mode"
            >
              Continue
            </button>
          </section>
        )}

        {step === "mode" && (
          <section className="space-y-6">
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-medium mb-4">Choose a reflection lens</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Each mode offers a different way to witness yourself. Pick what resonates.
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                {reflectionModes.map((m) => {
                  const Icon = iconMap[m.icon] || Sparkles;
                  return (
                    <button
                      key={m.id}
                      onClick={() => handleModeSelect(m.id)}
                      className={`rounded-lg border p-4 text-left transition-all hover:border-primary/50 ${
                        selectedMode === m.id ? "border-primary bg-primary/5" : ""
                      }`}
                      data-testid={`button-mode-${m.id}`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className="w-5 h-5 text-primary" />
                        <span className="font-medium">{m.name}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{m.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("state")}
                className="flex-1 rounded-lg border py-3 font-medium hover:bg-muted"
                data-testid="button-back-state"
              >
                Back
              </button>
              <button
                onClick={() => setStep("reflect")}
                className="flex-1 rounded-lg bg-primary py-3 text-primary-foreground font-medium hover:bg-primary/90"
                data-testid="button-next-reflect"
              >
                Continue
              </button>
            </div>
          </section>
        )}

        {step === "reflect" && (
          <section className="space-y-6">
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <ModeIcon className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-medium">{mode?.name}</h2>
              </div>

              {currentQuestion && (
                <div className="mb-4 p-4 rounded-lg bg-muted/50 border-l-4 border-primary">
                  <p className="text-sm italic">"{currentQuestion}"</p>
                  <button
                    onClick={handleNewQuestion}
                    className="mt-2 text-xs text-primary hover:underline"
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
                className="w-full min-h-[200px] rounded-lg border bg-transparent p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                data-testid="input-reflection"
              />

              <p className="mt-2 text-xs text-muted-foreground">{mode?.closingPrompt}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("mode")}
                className="flex-1 rounded-lg border py-3 font-medium hover:bg-muted"
                data-testid="button-back-mode"
              >
                Back
              </button>
              <button
                onClick={() => setStep("insights")}
                disabled={reflectionText.trim().length < 10}
                className="flex-1 rounded-lg bg-primary py-3 text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-50"
                data-testid="button-next-insights"
              >
                See Insights
              </button>
            </div>
          </section>
        )}

        {step === "insights" && (
          <section className="space-y-6">
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-medium mb-2">Your gentle insights</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Take what resonates. Leave what doesn't. You know yourself best.
              </p>

              {insightOutput && (
                <InsightCards
                  cards={insightOutput.cards}
                  tags={insightOutput.tags}
                />
              )}

              <div className="mt-6 p-4 rounded-lg bg-muted/50">
                <h3 className="text-sm font-medium mb-2">Today's Insight</h3>
                <p className="text-sm italic text-muted-foreground">
                  A thought you may want to sit with today.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("reflect")}
                className="flex-1 rounded-lg border py-3 font-medium hover:bg-muted"
                data-testid="button-back-reflect"
              >
                Back
              </button>
              <button
                onClick={handleComplete}
                className="flex-1 rounded-lg bg-primary py-3 text-primary-foreground font-medium hover:bg-primary/90"
                data-testid="button-complete"
              >
                Complete Ritual
              </button>
            </div>
          </section>
        )}

        {step === "complete" && (
          <section className="text-center space-y-6">
            <div className="rounded-xl border bg-card p-8 shadow-sm">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Check className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Ritual Complete</h2>
              <p className="text-muted-foreground">
                You showed up for yourself today. That matters.
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                Your reflection has been saved locally — private, on your device.
              </p>
            </div>

            <button
              onClick={() => {
                setStep("state");
                setReflectionText("");
                setStateValues({ energy: 3, clarity: 3, openness: 3, regulation: 3, presence: 3, pace: 3 });
              }}
              className="rounded-lg border px-6 py-3 font-medium hover:bg-muted"
              data-testid="button-start-new"
            >
              Start New Ritual
            </button>
          </section>
        )}

        <footer className="mt-12 text-center text-xs text-muted-foreground">
          <p>This is a reflection tool, not medical advice or diagnosis.</p>
          <p className="mt-1">You know yourself best.</p>
        </footer>
      </div>
    </div>
  );
}
