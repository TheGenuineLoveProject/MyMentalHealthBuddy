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
      <div
        className={`p-4 rounded-xl border ${className}`}
        style={{
          background: "var(--glp-sage-10)",
          borderColor: "var(--glp-sage-20)",
        }}
        data-testid="tile-mi-compact"
      >
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "var(--glp-sage-30)" }}
          >
            <MessageCircle
              className="w-4 h-4"
              style={{ color: "var(--glp-sage-deep)" }}
            />
          </div>
          <h3
            className="font-semibold text-sm"
            style={{ color: "var(--glp-ink)" }}
          >
            Motivational Interviewing
          </h3>
        </div>
        <p className="text-xs" style={{ color: "var(--glp-ink)", opacity: 0.7 }}>
          Supporting your natural motivation for positive change through
          partnership and acceptance.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`p-6 rounded-2xl border ${className}`}
      style={{
        background: "var(--glp-sage-10)",
        borderColor: "var(--glp-sage-20)",
      }}
      data-testid="tile-mi-full"
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "var(--glp-sage-30)" }}
        >
          <MessageCircle
            className="w-5 h-5"
            style={{ color: "var(--glp-sage-deep)" }}
          />
        </div>
        <div>
          <h3
            className="font-semibold"
            style={{ color: "var(--glp-ink)" }}
          >
            Motivational Interviewing Approach
          </h3>
          <p
            className="text-sm"
            style={{ color: "var(--glp-ink)", opacity: 0.7 }}
          >
            Evidence-based communication style
          </p>
        </div>
      </div>

      <p className="text-sm mb-4" style={{ color: "var(--glp-ink)" }}>
        Our prompts and reflections use MI principles to support your natural
        motivation for positive change—never pushing, always inviting.
      </p>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {MI_PRINCIPLES.map((principle) => {
          const Icon = principle.icon;
          return (
            <div
              key={principle.id}
              className="p-3 rounded-lg"
              style={{ background: "var(--glp-paper)" }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon
                  className="w-4 h-4"
                  style={{ color: "var(--glp-sage-deep)" }}
                />
                <span
                  className="font-medium text-sm"
                  style={{ color: "var(--glp-ink)" }}
                >
                  {principle.name}
                </span>
              </div>
              <p
                className="text-xs"
                style={{ color: "var(--glp-ink)", opacity: 0.7 }}
              >
                {principle.description}
              </p>
            </div>
          );
        })}
      </div>

      {showLink && (
        <Link
          href="/about/approach"
          className="text-sm font-medium underline"
          style={{ color: "var(--glp-sage-deep)" }}
          data-testid="link-mi-learn-more"
        >
          Learn about our approach
        </Link>
      )}
    </div>
  );
}
