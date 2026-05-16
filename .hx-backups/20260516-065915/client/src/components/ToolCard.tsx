/**
 * ToolCard — clickable card linking to a wellness tool, anchored by a
 * category-tinted Lumi avatar on the left and title/description on the right.
 *
 * Category → colorMode mapping is gentle and trauma-informed; falls back
 * to "default" sage for any unrecognized category. Always routes through
 * wouter so client navigation stays intact.
 */
import { Link } from "wouter";
import BuddyAvatar, {
  type BuddyColorMode,
  type BuddyState,
} from "@/components/avatar/BuddyAvatar";

export type ToolCategory =
  | "anxiety"
  | "depression"
  | "sleep"
  | "focus"
  | "gratitude"
  | "breathing"
  | "crisis"
  | "social"
  | "selfesteem";

const CATEGORY_TO_COLOR: Record<ToolCategory, BuddyColorMode> = {
  anxiety:    "blue",
  depression: "purple",
  sleep:      "sleep",
  focus:      "blue",
  gratitude:  "pink",
  breathing:  "blue",
  crisis:     "purple",
  social:     "orange",
  selfesteem: "pink",
};

// Per-category avatar state — kept emotionally safe (never alarming).
// Crisis category intentionally uses calm/steady presence.
const CATEGORY_TO_STATE: Record<ToolCategory, BuddyState> = {
  anxiety:    "calm",
  depression: "sad",
  sleep:      "calm",
  focus:      "calm",
  gratitude:  "encouraged",
  breathing:  "calm",
  crisis:     "crisis",
  social:     "encouraged",
  selfesteem: "encouraged",
};

export interface ToolCardProps {
  title: string;
  description: string;
  category?: ToolCategory;
  href: string;
  colorMode?: BuddyColorMode;
  className?: string;
  "data-testid"?: string;
}

export default function ToolCard({
  title,
  description,
  category,
  href,
  colorMode,
  className = "",
  "data-testid": testId,
}: ToolCardProps) {
  const resolvedColor: BuddyColorMode =
    colorMode ?? (category ? CATEGORY_TO_COLOR[category] : "default");
  const resolvedState: BuddyState = category
    ? CATEGORY_TO_STATE[category]
    : "calm";
  const slug =
    testId ??
    `card-tool-${title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`;

  return (
    <Link
      href={href}
      className={className}
      data-testid={slug}
      aria-label={`${title} — ${description}`}
      style={{
        display: "flex",
        gap: "0.875rem",
        alignItems: "flex-start",
        padding: "1rem 1.125rem",
        borderRadius: "0.875rem",
        background: "var(--surface-1, #ffffff)",
        border: "1px solid var(--border, #e5e7eb)",
        textDecoration: "none",
        color: "inherit",
        transition: "transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease",
        boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 6px 16px rgba(15, 23, 42, 0.08)";
        e.currentTarget.style.borderColor = "var(--glp-sage-30, #c8d9c8)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 1px 2px rgba(15, 23, 42, 0.04)";
        e.currentTarget.style.borderColor = "var(--border, #e5e7eb)";
      }}
    >
      <div style={{ flexShrink: 0, alignSelf: "flex-start" }}>
        <BuddyAvatar
          state={resolvedState}
          colorMode={resolvedColor}
          size="sm"
          data-testid={`${slug}-avatar`}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", minWidth: 0 }}>
        <h3
          style={{
            margin: 0,
            fontSize: "1rem",
            fontWeight: 600,
            color: "var(--glp-ink-100, #1a1917)",
          }}
          data-testid={`${slug}-title`}
        >
          {title}
        </h3>
        <p
          style={{
            margin: 0,
            fontSize: "0.875rem",
            color: "var(--text-2, #4a4540)",
            lineHeight: 1.5,
          }}
          data-testid={`${slug}-description`}
        >
          {description}
        </p>
      </div>
    </Link>
  );
}
