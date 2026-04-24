/**
 * BuddyAvatar.tsx — MMHB Buddy Engine visual.
 * PURE VISUAL COMPONENT. No fetch, no AI, no business logic.
 *
 * Renders a white robot body, black face screen, green eyes, glowing heart.
 * State drives eye color, heart color/pulse, and body micro-motion.
 *
 * Styling lives in BuddyAvatar.css (sibling file) — keyframes are state-class
 * scoped (.buddy--<state>) so adding new states later is additive only.
 */

import "./BuddyAvatar.css";
import {
  type BuddyState,
  getBuddyVisualOutput,
} from "@/lib/avatarState";

export interface BuddyAvatarProps {
  state?: BuddyState;
  size?: number;
  className?: string;
  "data-testid"?: string;
}

/**
 * MMHB Buddy Engine v1.7 — accessibility-first aria-label vocabulary.
 *
 * State-specific phrasing chosen so a screen-reader user gets a clear,
 * calm understanding of what Buddy is doing right now WITHOUT exposing
 * private chat content. Wording is consent-based and trauma-informed:
 * never alarmist, never clinical.
 */
const BUDDY_ARIA_LABEL: Record<BuddyState, string> = {
  calm: "Buddy avatar showing calm support mode",
  sad: "Buddy avatar showing gentle support mode",
  anxious: "Buddy avatar showing anxious breathing support mode",
  overwhelmed: "Buddy avatar showing grounding support mode",
  encouraged: "Buddy avatar showing encouraging support mode",
  crisis: "Buddy avatar showing crisis-safe support mode",
  celebrate: "Buddy avatar showing celebrating support mode",
};

export default function BuddyAvatar({
  state = "calm",
  size = 160,
  className = "",
  "data-testid": testId = "buddy-avatar",
}: BuddyAvatarProps) {
  const v = getBuddyVisualOutput(state);
  // v1.7 — fall back to v.label only if the state slips past the mapper
  // (e.g., a future state added in avatarState.ts before this map is
  // updated). Keeps screen readers from going silent.
  const ariaLabel = BUDDY_ARIA_LABEL[v.state] ?? `MMHB Buddy: ${v.label}`;

  const styleVars: React.CSSProperties & Record<`--${string}`, string> = {
    width: `${size}px`,
    height: `${size}px`,
    "--buddy-eye-color": v.eyeColor,
    "--buddy-heart-color": v.heartColor,
    "--buddy-heart-pulse": `${v.heartPulse}ms`,
  };

  return (
    <div
      className={`buddy buddy--${v.state} buddy--motion-${v.motion} ${className}`}
      style={styleVars}
      role="img"
      aria-label={ariaLabel}
      data-testid={testId}
      data-state={v.state}
    >
      <svg
        viewBox="0 0 200 240"
        xmlns="http://www.w3.org/2000/svg"
        className="buddy__svg"
        aria-hidden="true"
        focusable="false"
      >
        {/* Antenna */}
        <g className="buddy__antenna">
          <line x1="100" y1="22" x2="100" y2="6" stroke="#cdd5d2" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="100" cy="5" r="4" fill="var(--buddy-eye-color)" />
        </g>

        {/* Head */}
        <g className="buddy__head">
          <rect
            x="44"
            y="22"
            width="112"
            height="92"
            rx="22"
            ry="22"
            fill="#ffffff"
            stroke="#d8dedb"
            strokeWidth="1.2"
          />
          {/* Face screen (black) */}
          <rect
            x="58"
            y="40"
            width="84"
            height="58"
            rx="14"
            ry="14"
            fill="#0a0f0e"
          />
          {/* Eyes — green by default, recolored per state. v1.7: aria-hidden
              on decorative inner pieces is technically redundant (parent
              SVG is aria-hidden) but it's defensive in case a future
              refactor un-hides the SVG. */}
          <g className="buddy__eyes" aria-hidden="true">
            <circle cx="82" cy="69" r="7.5" fill="var(--buddy-eye-color)" className="buddy__eye buddy__eye--left" />
            <circle cx="118" cy="69" r="7.5" fill="var(--buddy-eye-color)" className="buddy__eye buddy__eye--right" />
          </g>
          {/* Subtle smile (varies by state via CSS) */}
          <path
            d="M 80 88 Q 100 96 120 88"
            stroke="var(--buddy-eye-color)"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
            className="buddy__mouth"
            opacity="0.55"
          />
          {/* Side ears */}
          <rect x="36" y="56" width="10" height="22" rx="4" fill="#e2e7e4" />
          <rect x="154" y="56" width="10" height="22" rx="4" fill="#e2e7e4" />
        </g>

        {/* Neck */}
        <rect x="92" y="114" width="16" height="10" rx="3" fill="#cdd5d2" />

        {/* Body */}
        <g className="buddy__body">
          <rect
            x="48"
            y="124"
            width="104"
            height="96"
            rx="26"
            ry="26"
            fill="#ffffff"
            stroke="#d8dedb"
            strokeWidth="1.2"
          />
          {/* Chest plate cutout */}
          <ellipse cx="100" cy="172" rx="30" ry="34" fill="#f4f6f5" />

          {/* Heart — glowing, pulse cadence is state-driven. v1.7: explicit
              aria-hidden so this decorative pulse never reaches AT. */}
          <g className="buddy__heart" transform="translate(100 172)" aria-hidden="true">
            <g className="buddy__heart-glow">
              <circle r="20" fill="var(--buddy-heart-color)" opacity="0.18" />
              <circle r="13" fill="var(--buddy-heart-color)" opacity="0.32" />
            </g>
            <path
              d="M 0 6 C -10 -6 -16 -2 -16 -8 C -16 -14 -10 -16 0 -8 C 10 -16 16 -14 16 -8 C 16 -2 10 -6 0 6 Z"
              fill="var(--buddy-heart-color)"
              className="buddy__heart-shape"
            />
            <circle r="2.6" fill="#fffbe6" className="buddy__heart-core" />
          </g>

          {/* Arms */}
          <rect x="32" y="138" width="14" height="56" rx="7" fill="#e2e7e4" className="buddy__arm buddy__arm--left" />
          <rect x="154" y="138" width="14" height="56" rx="7" fill="#e2e7e4" className="buddy__arm buddy__arm--right" />
        </g>

        {/* Base / shadow — v1.7 explicit aria-hidden for defensive a11y. */}
        <ellipse cx="100" cy="228" rx="46" ry="6" fill="#0a0f0e" opacity="0.10" className="buddy__shadow" aria-hidden="true" />
      </svg>
    </div>
  );
}
