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
      <div
        className={`p-4 rounded-xl border ${className}`}
        style={{
          background: "var(--glp-gold-10)",
          borderColor: "var(--glp-gold-20)",
        }}
        data-testid="tile-nlp-compact"
      >
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "var(--glp-gold-30)" }}
          >
            <Brain
              className="w-4 h-4"
              style={{ color: "var(--glp-gold)" }}
            />
          </div>
          <h3
            className="font-semibold text-sm"
            style={{ color: "var(--glp-ink)" }}
          >
            Ethical NLP Patterns
          </h3>
        </div>
        <p className="text-xs" style={{ color: "var(--glp-ink)", opacity: 0.7 }}>
          Language-based tools for reframing and awareness—used ethically.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`p-6 rounded-2xl border ${className}`}
      style={{
        background: "var(--glp-gold-10)",
        borderColor: "var(--glp-gold-20)",
      }}
      data-testid="tile-nlp-full"
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "var(--glp-gold-30)" }}
        >
          <Brain
            className="w-5 h-5"
            style={{ color: "var(--glp-gold)" }}
          />
        </div>
        <div>
          <h3
            className="font-semibold"
            style={{ color: "var(--glp-ink)" }}
          >
            Ethical NLP Patterns
          </h3>
          <p
            className="text-sm"
            style={{ color: "var(--glp-ink)", opacity: 0.7 }}
          >
            Language-based self-awareness tools
          </p>
        </div>
      </div>

      <p className="text-sm mb-4" style={{ color: "var(--glp-ink)" }}>
        We use selected NLP techniques to help you notice and shift language
        patterns—always transparently and with your consent.
      </p>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {NLP_TECHNIQUES.map((technique) => {
          const Icon = technique.icon;
          return (
            <div
              key={technique.id}
              className="p-3 rounded-lg"
              style={{ background: "var(--glp-paper)" }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon
                  className="w-4 h-4"
                  style={{ color: "var(--glp-gold)" }}
                />
                <span
                  className="font-medium text-sm"
                  style={{ color: "var(--glp-ink)" }}
                >
                  {technique.name}
                </span>
              </div>
              <p
                className="text-xs"
                style={{ color: "var(--glp-ink)", opacity: 0.7 }}
              >
                {technique.description}
              </p>
            </div>
          );
        })}
      </div>

      <div
        className="p-3 rounded-lg mb-4"
        style={{ background: "var(--glp-paper)", border: "1px solid var(--glp-gold-20)" }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Shield
            className="w-4 h-4"
            style={{ color: "var(--glp-sage-deep)" }}
          />
          <span
            className="font-medium text-sm"
            style={{ color: "var(--glp-ink)" }}
          >
            Our Ethics Guardrails
          </span>
        </div>
        <ul className="space-y-1">
          {ETHICS_GUARDRAILS.map((guardrail, idx) => (
            <li
              key={idx}
              className="text-xs flex items-start gap-2"
              style={{ color: "var(--glp-ink)", opacity: 0.8 }}
            >
              <span style={{ color: "var(--glp-sage-deep)" }}>•</span>
              {guardrail}
            </li>
          ))}
        </ul>
      </div>

      {showLink && (
        <Link
          href="/about/approach"
          className="text-sm font-medium underline"
          style={{ color: "var(--glp-gold)" }}
          data-testid="link-nlp-learn-more"
        >
          Learn about our ethical approach
        </Link>
      )}
    </div>
  );
}
