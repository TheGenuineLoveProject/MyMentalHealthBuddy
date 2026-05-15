import { Leaf, Compass, Sparkles, Target } from "lucide-react";
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
      <section
        className={`p-4 rounded-xl border bg-[hsl(var(--rose-50))] dark:bg-[hsl(var(--rose-900))] border-[hsl(var(--rose-200))] dark:border-[hsl(var(--rose-700))] ${className}`}
        data-testid="tile-strengths-pie-compact"
        aria-labelledby="strengths-compact-title"
      >
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-[hsl(var(--rose-100))] dark:bg-[hsl(var(--rose-800))]"
            aria-hidden="true"
          >
            <Target
              className="w-4 h-4 text-[hsl(var(--rose-600))] dark:text-[hsl(var(--rose-300))]"
              aria-hidden="true"
            />
          </div>
          <h3
            id="strengths-compact-title"
            className="font-semibold text-sm text-foreground"
            data-testid="text-strengths-title"
          >
            Strengths + Person-in-Environment
          </h3>
        </div>
        <p className="text-xs text-muted-foreground" data-testid="text-strengths-description">
          Building on what's already working in you and your world.
        </p>
      </section>
    );
  }

  return (
    <section
      className={`p-6 rounded-2xl border bg-[hsl(var(--rose-50))] dark:bg-[hsl(var(--rose-900))] border-[hsl(var(--rose-200))] dark:border-[hsl(var(--rose-700))] ${className}`}
      data-testid="tile-strengths-pie-full"
      aria-labelledby="strengths-full-title"
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-[hsl(var(--rose-100))] dark:bg-[hsl(var(--rose-800))]"
          aria-hidden="true"
        >
          <Target
            className="w-5 h-5 text-[hsl(var(--rose-600))] dark:text-[hsl(var(--rose-300))]"
            aria-hidden="true"
          />
        </div>
        <div>
          <h3
            id="strengths-full-title"
            className="font-semibold text-foreground"
            data-testid="text-strengths-title"
          >
            Strengths-Based + Person-in-Environment
          </h3>
          <p className="text-sm text-muted-foreground" data-testid="text-strengths-subtitle">
            Social work–informed framework
          </p>
        </div>
      </div>

      <p className="text-sm mb-4 text-foreground" data-testid="text-strengths-body">
        We focus on what's already working—your existing strengths—while
        recognizing the environmental factors that shape your experience.
      </p>

      <div className="mb-4">
        <h4
          className="font-medium text-sm mb-2 text-foreground"
          data-testid="text-pie-heading"
        >
          Person-in-Environment (PIE)
        </h4>
        <ul
          className="grid grid-cols-3 gap-2"
          aria-label="Person-in-Environment components"
          data-testid="list-pie-components"
        >
          {PIE_COMPONENTS.map((component) => {
            const Icon = component.icon;
            return (
              <li
                key={component.id}
                className="p-3 rounded-lg text-center bg-background dark:bg-[hsl(var(--rose-800))]"
                data-testid={`item-pie-${component.id}`}
              >
                <Icon
                  className="w-5 h-5 mx-auto mb-1 text-[hsl(var(--rose-600))] dark:text-[hsl(var(--rose-300))]"
                  aria-hidden="true"
                />
                <span
                  className="font-medium text-sm block text-foreground"
                  data-testid={`text-pie-name-${component.id}`}
                >
                  {component.name}
                </span>
                <p
                  className="text-xs mt-1 text-muted-foreground"
                  data-testid={`text-pie-desc-${component.id}`}
                >
                  {component.description}
                </p>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mb-4">
        <h4
          className="font-medium text-sm mb-2 text-foreground"
          data-testid="text-strengths-heading"
        >
          Character Strengths We Help You Build On
        </h4>
        <ul
          className="flex flex-wrap gap-2"
          aria-label="Character strengths"
          data-testid="list-strengths"
        >
          {STRENGTHS_EXAMPLES.map((strength) => (
            <li
              key={strength}
              className="px-3 py-1 rounded-full text-xs font-medium bg-[hsl(var(--rose-100))] dark:bg-[hsl(var(--rose-800))] text-foreground"
              data-testid={`item-strength-${strength.toLowerCase()}`}
            >
              {strength}
            </li>
          ))}
        </ul>
      </div>

      {showLink && (
        <Link
          href="/values"
          className="text-sm font-medium underline text-[hsl(var(--rose-600))] dark:text-[hsl(var(--rose-300))] hover:text-[hsl(var(--rose-700))] dark:hover:text-[hsl(var(--rose-200))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--rose-500))] focus-visible:ring-offset-2 rounded"
          data-testid="link-strengths-explore"
        >
          Explore your strengths
        </Link>
      )}
    </section>
  );
}
