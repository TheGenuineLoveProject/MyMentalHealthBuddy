import { Brain, RefreshCw, Eye, ArrowRight, Shield } from "lucide-react";
import { Link } from "wouter";

const NLP_TECHNIQUES = [
  {
    id: "reframing",
    icon: RefreshCw,
    name: "Reframing",
    description: "Shifting perspective to see situations differently.",
  },
  {
    id: "anchoring",
    icon: Shield,
    name: "Resource Anchoring",
    description: "Connecting positive states to accessible cues.",
  },
  {
    id: "future-pacing",
    icon: ArrowRight,
    name: "Future Pacing",
    description: "Imagining successful outcomes to build confidence.",
  },
  {
    id: "awareness",
    icon: Eye,
    name: "Language Awareness",
    description: "Noticing how words shape your experience.",
  },
];

const ETHICS_GUARDRAILS = [
  "No hypnosis or trance induction",
  "No embedded commands",
  "No coercive persuasion",
  "Full transparency about methods",
  "Opt-out available at every step",
];

export default function NLPTile({
  variant = "full",
  className = "",
  showLink = true,
}) {
  if (variant === "compact") {
    return (
      <section
        className={`p-4 rounded-xl border bg-[hsl(var(--amber-50))] dark:bg-[hsl(var(--amber-900))] border-[hsl(var(--amber-200))] dark:border-[hsl(var(--amber-700))] ${className}`}
        data-testid="tile-nlp-compact"
        aria-labelledby="nlp-compact-title"
      >
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-[hsl(var(--amber-100))] dark:bg-[hsl(var(--amber-800))]"
            aria-hidden="true"
          >
            <Brain
              className="w-4 h-4 text-[hsl(var(--amber-600))] dark:text-[hsl(var(--amber-300))]"
              aria-hidden="true"
            />
          </div>
          <h3
            id="nlp-compact-title"
            className="font-semibold text-sm text-foreground"
            data-testid="text-nlp-title"
          >
            Ethical NLP Patterns
          </h3>
        </div>
        <p className="text-xs text-muted-foreground" data-testid="text-nlp-description">
          Language-based tools for reframing and awareness—used ethically.
        </p>
      </section>
    );
  }

  return (
    <section
      className={`p-6 rounded-2xl border bg-[hsl(var(--amber-50))] dark:bg-[hsl(var(--amber-900))] border-[hsl(var(--amber-200))] dark:border-[hsl(var(--amber-700))] ${className}`}
      data-testid="tile-nlp-full"
      aria-labelledby="nlp-full-title"
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-[hsl(var(--amber-100))] dark:bg-[hsl(var(--amber-800))]"
          aria-hidden="true"
        >
          <Brain
            className="w-5 h-5 text-[hsl(var(--amber-600))] dark:text-[hsl(var(--amber-300))]"
            aria-hidden="true"
          />
        </div>
        <div>
          <h3
            id="nlp-full-title"
            className="font-semibold text-foreground"
            data-testid="text-nlp-title"
          >
            Ethical NLP Patterns
          </h3>
          <p className="text-sm text-muted-foreground" data-testid="text-nlp-subtitle">
            Language-based self-awareness tools
          </p>
        </div>
      </div>

      <p className="text-sm mb-4 text-foreground" data-testid="text-nlp-body">
        We use selected NLP techniques to help you notice and shift language
        patterns—always transparently and with your consent.
      </p>

      <ul
        className="grid grid-cols-2 gap-3 mb-4"
        aria-label="NLP techniques"
        data-testid="list-nlp-techniques"
      >
        {NLP_TECHNIQUES.map((technique) => {
          const Icon = technique.icon;
          return (
            <li
              key={technique.id}
              className="p-3 rounded-lg bg-background dark:bg-[hsl(var(--amber-800))]"
              data-testid={`item-technique-${technique.id}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon
                  className="w-4 h-4 text-[hsl(var(--amber-600))] dark:text-[hsl(var(--amber-300))]"
                  aria-hidden="true"
                />
                <span
                  className="font-medium text-sm text-foreground"
                  data-testid={`text-technique-name-${technique.id}`}
                >
                  {technique.name}
                </span>
              </div>
              <p
                className="text-xs text-muted-foreground"
                data-testid={`text-technique-desc-${technique.id}`}
              >
                {technique.description}
              </p>
            </li>
          );
        })}
      </ul>

      <div
        className="p-3 rounded-lg mb-4 bg-background dark:bg-[hsl(var(--amber-800))] border border-[hsl(var(--amber-200))] dark:border-[hsl(var(--amber-700))]"
        data-testid="section-ethics-guardrails"
      >
        <div className="flex items-center gap-2 mb-2">
          <Shield
            className="w-4 h-4 text-[hsl(var(--sage-600))] dark:text-[hsl(var(--sage-300))]"
            aria-hidden="true"
          />
          <span
            className="font-medium text-sm text-foreground"
            data-testid="text-guardrails-heading"
          >
            Our Ethics Guardrails
          </span>
        </div>
        <ul
          className="space-y-1"
          aria-label="Ethics guardrails"
          data-testid="list-guardrails"
        >
          {ETHICS_GUARDRAILS.map((guardrail, idx) => (
            <li
              key={idx}
              className="text-xs flex items-start gap-2 text-muted-foreground"
              data-testid={`item-guardrail-${idx}`}
            >
              <span className="text-[hsl(var(--sage-600))] dark:text-[hsl(var(--sage-300))]" aria-hidden="true">•</span>
              {guardrail}
            </li>
          ))}
        </ul>
      </div>

      {showLink && (
        <Link
          href="/about/approach"
          className="text-sm font-medium underline text-[hsl(var(--amber-600))] dark:text-[hsl(var(--amber-300))] hover:text-[hsl(var(--amber-700))] dark:hover:text-[hsl(var(--amber-200))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--amber-500))] focus-visible:ring-offset-2 rounded"
          data-testid="link-nlp-learn-more"
        >
          Learn about our ethical approach
        </Link>
      )}
    </section>
  );
}
