import { useState } from "react";
import { RefreshCw, ArrowRight, Shield, Sparkles } from "lucide-react";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import { SEO } from "@/components/SEO";

const REFRAME_TEMPLATES = [
  {
    id: "learning",
    pattern: "I'm learning what doesn't work yet.",
    category: "Growth mindset",
  },
  {
    id: "becoming",
    pattern: "I'm becoming someone who [positive behavior] in tiny ways.",
    category: "Identity shift",
  },
  {
    id: "observable",
    pattern: "What does this mean in one observable behavior today?",
    category: "Precision question",
  },
  {
    id: "compassion",
    pattern: "What would I say to a friend in this situation?",
    category: "Self-compassion",
  },
  {
    id: "environment",
    pattern: "What in my environment made this harder?",
    category: "Context awareness",
  },
];

const GUARDRAILS = [
  "No \"subconscious reprogramming\" claims",
  "No hypnosis or trance techniques",
  "No guarantees or promises",
  "Just language clarity + actionable steps",
  "Educational purposes only",
];

export default function ReframePage() {
  const [inputThought, setInputThought] = useState("");
  const [reframes, setReframes] = useState([]);
  const [nextStep, setNextStep] = useState("");
  const [hasGenerated, setHasGenerated] = useState(false);

  const generateReframes = () => {
    if (!inputThought.trim()) return;

    const generatedReframes = [
      `Maybe this is: ${inputThought.replace(/I'm|I am|I/gi, "a moment where I'm")} — and moments pass.`,
      `What if: ${inputThought.replace(/can't|won't|never/gi, "haven't yet")}`,
      `A friend might say: "It makes sense you feel this way, and you can take one small step."`,
    ];

    const generatedStep = "Choose one kind thing you can do in the next 2 minutes.";

    setReframes(generatedReframes);
    setNextStep(generatedStep);
    setHasGenerated(true);
  };

  const handleReset = () => {
    setInputThought("");
    setReframes([]);
    setNextStep("");
    setHasGenerated(false);
  };

  return (
    <WellnessPageShell
      title="Reframe Tool"
      subtitle="Shift harsh self-talk into something gentler and more actionable."
      benefits={pickBenefits(["agency","calm","clarity","selfRespect","meaning"], 5)}
      clarity={{
        what: "A way of shifting harsh self-talk so your mind can find better options.",
        why: "Words shape what you notice and what you attempt. Gentler words open new paths.",
        who: "Anyone stuck in harsh inner criticism or hopeless thoughts.",
        when: "When your mind says 'I can't,' 'I'm broken,' or 'it's hopeless.'",
        where: "Anywhere you can breathe and write for 1–5 minutes.",
        how: "Notice the harsh phrase, see 3 reframes, pick one observable step."
      }}
      examples={[
        { label: "Beginner", examples: ["Write one honest sentence about how you feel.", "Name one value you want to protect today."] },
        { label: "Intermediate", examples: ["Describe the situation + the need underneath it.", "Write a boundary you could try in one sentence."] },
        { label: "Advanced", examples: ["Identify a pattern and the smallest experiment to change it.", "Write a compassionate reframe and one measurable step."] }
      ]}
    >
      <SEO title="Reframe Tool — The Genuine Love Project" description="Shift harsh self-talk into gentler, more actionable perspectives. Educational cognitive reframing exercises." />

      <div className="space-y-6">
        <section
          className="p-5 rounded-xl border border-border bg-card"
          aria-labelledby="reframe-input-heading"
          data-testid="section-reframe-input"
        >
          <h2
            id="reframe-input-heading"
            className="text-base font-semibold text-foreground mb-4 flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            What did your mind say?
          </h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="thought-input" className="sr-only">
                Enter the harsh thought
              </label>
              <textarea
                id="thought-input"
                value={inputThought}
                onChange={(e) => setInputThought(e.target.value)}
                placeholder="e.g., I am failing at everything or I will never get better"
                className="w-full p-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none text-sm"
                rows={3}
                data-testid="input-thought"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={generateReframes}
                disabled={!inputThought.trim()}
                className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-white bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-colors text-sm"
                data-testid="button-generate-reframes"
              >
                Generate Reframes
              </button>
              {hasGenerated && (
                <button
                  onClick={handleReset}
                  className="px-4 py-2.5 rounded-xl font-medium border border-border text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-colors text-sm"
                  data-testid="button-reset"
                >
                  Start Over
                </button>
              )}
            </div>
          </div>
        </section>

        {hasGenerated && (
          <section
            className="p-5 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30"
            aria-labelledby="reframes-heading"
            data-testid="section-reframes-output"
          >
            <h2
              id="reframes-heading"
              className="text-base font-semibold text-foreground mb-4 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-300" />
              3 Gentler Perspectives
            </h2>

            <ul className="space-y-3 mb-5" data-testid="list-reframes">
              {reframes.map((reframe, idx) => (
                <li
                  key={idx}
                  className="p-3 rounded-lg bg-card border border-border"
                  data-testid={`item-reframe-${idx}`}
                >
                  <p className="text-sm text-foreground" data-testid={`text-reframe-${idx}`}>
                    {reframe}
                  </p>
                </li>
              ))}
            </ul>

            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-start gap-3">
                <ArrowRight className="w-4 h-4 text-emerald-600 dark:text-emerald-300 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    One Observable Next Step
                  </span>
                  <p className="text-sm text-foreground mt-1" data-testid="text-next-step">
                    {nextStep}
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mt-3 italic">
              Pause or stop anytime—only do what feels safe.
            </p>
          </section>
        )}

        <section
          className="p-4 rounded-xl border border-border bg-card"
          data-testid="section-reframe-templates"
        >
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Reframe Templates
          </h3>
          <ul className="space-y-2" data-testid="list-templates">
            {REFRAME_TEMPLATES.map((template) => (
              <li
                key={template.id}
                className="flex items-start gap-2 text-sm"
                data-testid={`item-template-${template.id}`}
              >
                <span className="text-primary mt-0.5">•</span>
                <div>
                  <span className="text-muted-foreground">{template.category}:</span>{" "}
                  <span className="text-foreground italic">{template.pattern}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section
          className="p-4 rounded-xl border border-border bg-card"
          data-testid="section-guardrails"
        >
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">
              Our Ethics Guardrails
            </h3>
          </div>
          <ul className="space-y-1" data-testid="list-guardrails">
            {GUARDRAILS.map((guardrail, idx) => (
              <li
                key={idx}
                className="text-xs flex items-start gap-2 text-muted-foreground"
                data-testid={`item-guardrail-${idx}`}
              >
                <span className="text-primary">•</span>
                {guardrail}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </WellnessPageShell>
  );
}
