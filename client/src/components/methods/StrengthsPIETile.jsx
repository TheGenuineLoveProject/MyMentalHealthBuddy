import { Leaf, Compass, Users, Target, Sparkles } from "lucide-react";
import { Link } from "wouter";

const PIE_COMPONENTS = [
  {
    id: "person",
    icon: Sparkles,
    name: "Person",
    description: "Your unique strengths, experiences, and inner resources.",
  },
  {
    id: "in",
    icon: Compass,
    name: "In",
    description: "The dynamic interaction between you and your world.",
  },
  {
    id: "environment",
    icon: Leaf,
    name: "Environment",
    description: "Relationships, spaces, and systems that support or stress you.",
  },
];

const STRENGTHS_EXAMPLES = [
  "Curiosity",
  "Perseverance",
  "Kindness",
  "Creativity",
  "Hope",
  "Humor",
];

export default function StrengthsPIETile({
  variant = "full",
  className = "",
  showLink = true,
}) {
  if (variant === "compact") {
    return (
      <div
        className={`p-4 rounded-xl border ${className}`}
        style={{
          background: "var(--glp-rose-10)",
          borderColor: "var(--glp-rose-20)",
        }}
        data-testid="tile-strengths-pie-compact"
      >
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "var(--glp-rose-30)" }}
          >
            <Target
              className="w-4 h-4"
              style={{ color: "var(--glp-rose)" }}
            />
          </div>
          <h3
            className="font-semibold text-sm"
            style={{ color: "var(--glp-ink)" }}
          >
            Strengths + Person-in-Environment
          </h3>
        </div>
        <p className="text-xs" style={{ color: "var(--glp-ink)", opacity: 0.7 }}>
          Building on what's already working in you and your world.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`p-6 rounded-2xl border ${className}`}
      style={{
        background: "var(--glp-rose-10)",
        borderColor: "var(--glp-rose-20)",
      }}
      data-testid="tile-strengths-pie-full"
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "var(--glp-rose-30)" }}
        >
          <Target
            className="w-5 h-5"
            style={{ color: "var(--glp-rose)" }}
          />
        </div>
        <div>
          <h3
            className="font-semibold"
            style={{ color: "var(--glp-ink)" }}
          >
            Strengths-Based + Person-in-Environment
          </h3>
          <p
            className="text-sm"
            style={{ color: "var(--glp-ink)", opacity: 0.7 }}
          >
            Social work–informed framework
          </p>
        </div>
      </div>

      <p className="text-sm mb-4" style={{ color: "var(--glp-ink)" }}>
        We focus on what's already working—your existing strengths—while
        recognizing the environmental factors that shape your experience.
      </p>

      <div className="mb-4">
        <h4
          className="font-medium text-sm mb-2"
          style={{ color: "var(--glp-ink)" }}
        >
          Person-in-Environment (PIE)
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {PIE_COMPONENTS.map((component) => {
            const Icon = component.icon;
            return (
              <div
                key={component.id}
                className="p-3 rounded-lg text-center"
                style={{ background: "var(--glp-paper)" }}
              >
                <Icon
                  className="w-5 h-5 mx-auto mb-1"
                  style={{ color: "var(--glp-rose)" }}
                />
                <span
                  className="font-medium text-sm block"
                  style={{ color: "var(--glp-ink)" }}
                >
                  {component.name}
                </span>
                <p
                  className="text-xs mt-1"
                  style={{ color: "var(--glp-ink)", opacity: 0.7 }}
                >
                  {component.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mb-4">
        <h4
          className="font-medium text-sm mb-2"
          style={{ color: "var(--glp-ink)" }}
        >
          Character Strengths We Help You Build On
        </h4>
        <div className="flex flex-wrap gap-2">
          {STRENGTHS_EXAMPLES.map((strength) => (
            <span
              key={strength}
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{
                background: "var(--glp-rose-20)",
                color: "var(--glp-ink)",
              }}
            >
              {strength}
            </span>
          ))}
        </div>
      </div>

      {showLink && (
        <Link
          href="/values"
          className="text-sm font-medium underline"
          style={{ color: "var(--glp-rose)" }}
          data-testid="link-strengths-explore"
        >
          Explore your strengths
        </Link>
      )}
    </div>
  );
}
