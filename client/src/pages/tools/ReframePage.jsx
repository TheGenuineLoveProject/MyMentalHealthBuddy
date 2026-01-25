import { useState } from "react";
import { RefreshCw, ArrowRight, Shield, Sparkles } from "lucide-react";
import PageTemplate from "@/components/PageTemplate";
import BenefitsBlock from "@/components/BenefitsBlock";
import ClarityCard from "@/components/content/ClarityCard";
import ExamplesAccordion from "@/components/content/ExamplesAccordion";
import { CrisisNotice } from "@/components/PersistentDisclaimer";
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

const EXAMPLES = [
  {
    level: "beginner",
    title: "Simple reframe (30 seconds)",
    situation: "Your mind says: \"I'm failing.\"",
    action: "Reframe: \"I'm learning what doesn't work yet.\" Next step: Do the smallest version for 2 minutes.",
    result: "Shift from self-judgment to learning orientation.",
  },
  {
    level: "intermediate",
    title: "Identity statement (2 minutes)",
    situation: "Your mind says: \"I never follow through.\"",
    action: "Reframe: \"I'm becoming someone who follows through in tiny ways.\" Next step: Open journal and write one sentence.",
    result: "Identity shift that allows for growth.",
  },
  {
    level: "advanced",
    title: "Precision question (3 minutes)",
    situation: "Your mind says: \"I need to be better.\"",
    action: "Precision question: \"What does 'better' mean in one observable behavior today?\" Answer: \"Drink water before coffee.\"",
    result: "Vague self-criticism becomes specific, doable action.",
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
    title="ReframePage"
    subtitle="Educational reflection tools. Choose what feels safe and supportive."
    benefits={pickBenefits(["Agency","Calm","Clarity","Self-respect","Your pace"], 5)}
    clarity={{
      what: "A self-paced reflection tool you control.",
      why: "To support clarity, values alignment, and gentle next steps.",
      who: "For adults (18+) who want educational wellness tools (not medical care).",
      when: "Anytime you want a small reset or a thoughtful pause.",
      where: "Anywhere you can breathe and write for 1–5 minutes.",
      how: "Pick one prompt, answer briefly, stop whenever you want."
    }}
    examples={[
      { label: "Beginner", examples: ["Write one honest sentence about how you feel.", "Name one value you want to protect today."] },
      { label: "Intermediate", examples: ["Describe the situation + the need underneath it.", "Write a boundary you could try in one sentence."] },
      { label: "Advanced", examples: ["Identify a pattern and the smallest experiment to change it.", "Write a compassionate reframe and one measurable step."] }
    ]}
  >
      <SEO title="Reframe — The Genuine Love Project" description="Tools for shifting perspective on challenges." />


    <PageTemplate
      title="Reframe Tool"
      description="Shift harsh self-talk into something gentler and more actionable."
    >
      <div className="max-w-2xl mx-auto space-y-8">
        <BenefitsBlock
          benefits={[
            "Turn harsh thoughts into gentler perspectives",
            "Find one observable next step",
            "Practice self-compassion through language"
          ]}
          control="Pause or stop anytime—only do what feels safe."
          crisisLink="/crisis"
        />

        <ClarityCard
          what="A way of shifting harsh self-talk so your mind can find better options."
          who="Anyone stuck in harsh inner criticism or hopeless thoughts."
          when="When your mind says 'I can't,' 'I'm broken,' or 'it's hopeless.'"
          why="Words shape what you notice and what you attempt. Gentler words open new paths."
          howSteps={[
            "Notice the harsh phrase your mind is saying",
            "See 3 alternative reframes",
            "Pick one observable step to try"
          ]}
          whereLinkText="View in System Map"
          whereHref="/system-map"
        />

        <section
          className="p-6 rounded-2xl border bg-background dark:bg-[hsl(var(--gray-900))] border-[hsl(var(--gray-200))] dark:border-[hsl(var(--gray-700))]"
          aria-labelledby="reframe-input-heading"
          data-testid="section-reframe-input"
        >
          <h2
            id="reframe-input-heading"
            className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2"
          >
            <RefreshCw className="w-5 h-5 text-[hsl(var(--amber-600))] dark:text-[hsl(var(--amber-300))]" />
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
                placeholder="e.g., &quot;I'm failing at everything&quot; or &quot;I'll never get better&quot;"
                className="w-full p-4 rounded-xl border bg-background dark:bg-[hsl(var(--gray-800))] border-[hsl(var(--gray-300))] dark:border-[hsl(var(--gray-600))] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[hsl(var(--amber-500))] resize-none"
                rows={3}
                data-testid="input-thought"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={generateReframes}
                disabled={!inputThought.trim()}
                className="flex-1 px-4 py-3 rounded-xl font-medium text-white bg-[hsl(var(--amber-600))] hover:bg-[hsl(var(--amber-700))] disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--amber-500))] focus-visible:ring-offset-2 transition-colors"
                data-testid="button-generate-reframes"
              >
                Generate Reframes
              </button>
              {hasGenerated && (
                <button
                  onClick={handleReset}
                  className="px-4 py-3 rounded-xl font-medium border border-[hsl(var(--gray-300))] dark:border-[hsl(var(--gray-600))] text-foreground hover:bg-[hsl(var(--gray-100))] dark:hover:bg-[hsl(var(--gray-800))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--gray-500))] focus-visible:ring-offset-2 transition-colors"
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
            className="p-6 rounded-2xl border bg-[hsl(var(--amber-50))] dark:bg-[hsl(var(--amber-900))] border-[hsl(var(--amber-200))] dark:border-[hsl(var(--amber-700))]"
            aria-labelledby="reframes-heading"
            data-testid="section-reframes-output"
          >
            <h2
              id="reframes-heading"
              className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5 text-[hsl(var(--amber-600))] dark:text-[hsl(var(--amber-300))]" />
              3 Gentler Perspectives
            </h2>

            <ul className="space-y-3 mb-6" data-testid="list-reframes">
              {reframes.map((reframe, idx) => (
                <li
                  key={idx}
                  className="p-4 rounded-xl bg-background dark:bg-[hsl(var(--amber-800))] border border-[hsl(var(--amber-200))] dark:border-[hsl(var(--amber-700))]"
                  data-testid={`item-reframe-${idx}`}
                >
                  <p className="text-sm text-foreground" data-testid={`text-reframe-${idx}`}>
                    {reframe}
                  </p>
                </li>
              ))}
            </ul>

            <div className="p-4 rounded-xl bg-[hsl(var(--sage-100))] dark:bg-[hsl(var(--sage-800))] border border-[hsl(var(--sage-200))] dark:border-[hsl(var(--sage-700))]">
              <div className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-[hsl(var(--sage-600))] dark:text-[hsl(var(--sage-300))] shrink-0 mt-0.5" />
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

            <p className="text-xs text-muted-foreground mt-4 italic">
              Pause or stop anytime—only do what feels safe.
            </p>
          </section>
        )}

        <section
          className="p-4 rounded-xl bg-[hsl(var(--gray-50))] dark:bg-[hsl(var(--gray-800))] border border-[hsl(var(--gray-200))] dark:border-[hsl(var(--gray-700))]"
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
                <span className="text-[hsl(var(--amber-600))] dark:text-[hsl(var(--amber-300))]">•</span>
                <div>
                  <span className="text-muted-foreground">{template.category}:</span>{" "}
                  <span className="text-foreground italic">{template.pattern}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <ExamplesAccordion
          title="See examples at each level"
          examples={EXAMPLES}
        />

        <section
          className="p-4 rounded-xl bg-background dark:bg-[hsl(var(--gray-900))] border border-[hsl(var(--gray-200))] dark:border-[hsl(var(--gray-700))]"
          data-testid="section-guardrails"
        >
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-[hsl(var(--sage-600))] dark:text-[hsl(var(--sage-300))]" />
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
                <span className="text-[hsl(var(--sage-600))] dark:text-[hsl(var(--sage-300))]">•</span>
                {guardrail}
              </li>
            ))}
          </ul>
        </section>

        <CrisisNotice />
      </div>
    </PageTemplate>
  </WellnessPageShell>
  );
}
