import { Heart, MessageCircle, Sparkles, Users } from "lucide-react";
import { Link } from "wouter";

const MI_PRINCIPLES = [
  {
    id: "partnership",
    icon: Users,
    name: "Partnership",
    description: "Collaboration over confrontation—we explore together.",
  },
  {
    id: "acceptance",
    icon: Heart,
    name: "Acceptance",
    description: "Unconditional regard for your autonomy and choices.",
  },
  {
    id: "compassion",
    icon: Sparkles,
    name: "Compassion",
    description: "Active promotion of your welfare and wellbeing.",
  },
  {
    id: "evocation",
    icon: MessageCircle,
    name: "Evocation",
    description: "Drawing out your own wisdom and motivation.",
  },
];

export default function MITile({
  variant = "full",
  className = "",
  showLink = true,
}) {
  if (variant === "compact") {
    return (
      <section
        className={`p-4 rounded-xl border bg-[hsl(var(--sage-50))] dark:bg-[hsl(var(--sage-900))] border-[hsl(var(--sage-200))] dark:border-[hsl(var(--sage-700))] ${className}`}
        data-testid="tile-mi-compact"
        aria-labelledby="mi-compact-title"
      >
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-[hsl(var(--sage-100))] dark:bg-[hsl(var(--sage-800))]"
            aria-hidden="true"
          >
            <MessageCircle
              className="w-4 h-4 text-[hsl(var(--sage-600))] dark:text-[hsl(var(--sage-300))]"
              aria-hidden="true"
            />
          </div>
          <h3
            id="mi-compact-title"
            className="font-semibold text-sm text-foreground"
            data-testid="text-mi-title"
          >
            Motivational Interviewing
          </h3>
        </div>
        <p className="text-xs text-muted-foreground" data-testid="text-mi-description">
          Supporting your natural motivation for positive change through
          partnership and acceptance.
        </p>
      </section>
    );
  }

  return (
    <section
      className={`p-6 rounded-2xl border bg-[hsl(var(--sage-50))] dark:bg-[hsl(var(--sage-900))] border-[hsl(var(--sage-200))] dark:border-[hsl(var(--sage-700))] ${className}`}
      data-testid="tile-mi-full"
      aria-labelledby="mi-full-title"
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-[hsl(var(--sage-100))] dark:bg-[hsl(var(--sage-800))]"
          aria-hidden="true"
        >
          <MessageCircle
            className="w-5 h-5 text-[hsl(var(--sage-600))] dark:text-[hsl(var(--sage-300))]"
            aria-hidden="true"
          />
        </div>
        <div>
          <h3
            id="mi-full-title"
            className="font-semibold text-foreground"
            data-testid="text-mi-title"
          >
            Motivational Interviewing Approach
          </h3>
          <p className="text-sm text-muted-foreground" data-testid="text-mi-subtitle">
            Evidence-based communication style
          </p>
        </div>
      </div>

      <p className="text-sm mb-4 text-foreground" data-testid="text-mi-body">
        Our prompts and reflections use MI principles to support your natural
        motivation for positive change—never pushing, always inviting.
      </p>

      <ul
        className="grid grid-cols-2 gap-3 mb-4"
        aria-label="Motivational Interviewing principles"
        data-testid="list-mi-principles"
      >
        {MI_PRINCIPLES.map((principle) => {
          const Icon = principle.icon;
          return (
            <li
              key={principle.id}
              className="p-3 rounded-lg bg-background dark:bg-[hsl(var(--sage-800))]"
              data-testid={`item-principle-${principle.id}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon
                  className="w-4 h-4 text-[hsl(var(--sage-600))] dark:text-[hsl(var(--sage-300))]"
                  aria-hidden="true"
                />
                <span
                  className="font-medium text-sm text-foreground"
                  data-testid={`text-principle-name-${principle.id}`}
                >
                  {principle.name}
                </span>
              </div>
              <p
                className="text-xs text-muted-foreground"
                data-testid={`text-principle-desc-${principle.id}`}
              >
                {principle.description}
              </p>
            </li>
          );
        })}
      </ul>

      {showLink && (
        <Link
          href="/about/approach"
          className="text-sm font-medium underline text-[hsl(var(--sage-600))] dark:text-[hsl(var(--sage-300))] hover:text-[hsl(var(--sage-700))] dark:hover:text-[hsl(var(--sage-200))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--sage-500))] focus-visible:ring-offset-2 rounded"
          data-testid="link-mi-learn-more"
        >
          Learn about our approach
        </Link>
      )}
    </section>
  );
}
