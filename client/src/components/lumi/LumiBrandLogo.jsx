/*
 * LumiBrandLogo — MyMentalHealthBuddy wordmark + mini-Lumi icon mark
 * with "by The Genuine Love Project" subhead.
 *
 * variants:
 *   - "horizontal" (default): icon + wordmark + subhead inline
 *   - "stacked":              icon centered above wordmark + subhead
 *   - "icon-only":            just the icon mark (no text)
 *   - "wordmark-only":        just the text (no icon)
 */
import { useId } from "react";
import { Link } from "wouter";

function LumiIconMark({ size = 40, ariaHidden = true }) {
  const uid = useId().replace(/:/g, "");
  const idBody = `lumi-icon-body-${uid}`;
  const idHeart = `lumi-icon-heart-${uid}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={ariaHidden}
      role="img"
    >
      <defs>
        <radialGradient id={idBody} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="hsl(150, 50%, 78%)" />
          <stop offset="60%" stopColor="hsl(150, 38%, 56%)" />
          <stop offset="100%" stopColor="hsl(150, 42%, 38%)" />
        </radialGradient>
        <radialGradient id={idHeart} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(36, 100%, 70%)" />
          <stop offset="100%" stopColor="hsl(34, 88%, 42%)" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill={`url(#${idBody})`} stroke="hsl(150, 42%, 30%)" strokeWidth="1" />
      {/* Eyes */}
      <circle cx="24" cy="28" r="3.6" fill="#fff" />
      <circle cx="40" cy="28" r="3.6" fill="#fff" />
      <circle cx="24" cy="29" r="2" fill="#0e1a14" />
      <circle cx="40" cy="29" r="2" fill="#0e1a14" />
      {/* Heart */}
      <path
        d="M 32 47 C 26 41 22 41 22 36 C 22 32 26 31 32 36 C 38 31 42 32 42 36 C 42 41 38 41 32 47 Z"
        fill={`url(#${idHeart})`}
      />
    </svg>
  );
}

export default function LumiBrandLogo({
  variant = "horizontal",
  size = "md",
  showParent = true,
  href = "/",
  className = "",
  ariaLabel = "MyMentalHealthBuddy by The Genuine Love Project — go to home",
}) {
  const sizes = {
    sm: { icon: 28, title: "1rem",     sub: "0.625rem" },
    md: { icon: 40, title: "1.25rem",  sub: "0.75rem"  },
    lg: { icon: 56, title: "1.625rem", sub: "0.875rem" },
    xl: { icon: 80, title: "2.25rem",  sub: "1rem"     },
  };
  const s = sizes[size] || sizes.md;

  const inner =
    variant === "icon-only" ? (
      <LumiIconMark size={s.icon} />
    ) : variant === "wordmark-only" ? (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
        <span
          className="font-display-lumi"
          style={{ fontSize: s.title, fontWeight: 700, color: "var(--lumi-stone-900)", lineHeight: 1.05 }}
        >
          MyMentalHealthBuddy
        </span>
        {showParent && (
          <span
            className="font-body-lumi"
            style={{ fontSize: s.sub, color: "var(--lumi-stone-500)", letterSpacing: "0.02em", marginTop: 2 }}
          >
            by The Genuine Love Project
          </span>
        )}
      </div>
    ) : variant === "stacked" ? (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <LumiIconMark size={s.icon} />
        <span
          className="font-display-lumi"
          style={{ fontSize: s.title, fontWeight: 700, color: "var(--lumi-stone-900)", lineHeight: 1.05 }}
        >
          MyMentalHealthBuddy
        </span>
        {showParent && (
          <span
            className="font-body-lumi"
            style={{ fontSize: s.sub, color: "var(--lumi-stone-500)", letterSpacing: "0.02em" }}
          >
            by The Genuine Love Project
          </span>
        )}
      </div>
    ) : (
      <div style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
        <LumiIconMark size={s.icon} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            className="font-display-lumi"
            style={{ fontSize: s.title, fontWeight: 700, color: "var(--lumi-stone-900)", lineHeight: 1.05 }}
          >
            MyMentalHealthBuddy
          </span>
          {showParent && (
            <span
              className="font-body-lumi"
              style={{ fontSize: s.sub, color: "var(--lumi-stone-500)", letterSpacing: "0.02em", marginTop: 2 }}
            >
              by The Genuine Love Project
            </span>
          )}
        </div>
      </div>
    );

  if (!href) {
    return (
      <span className={`lumi-brand-logo ${className}`.trim()} aria-label={ariaLabel} data-testid="lumi-brand-logo">
        {inner}
      </span>
    );
  }
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={`lumi-brand-logo lumi-link-brand ${className}`.trim()}
      style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}
      data-testid="lumi-brand-logo"
    >
      {inner}
    </Link>
  );
}

export { LumiIconMark };
