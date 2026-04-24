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
      className={`buddy buddy--${v.state} buddy--motion-${v.motion} buddy--expr-${v.expression} ${className}`}
      style={styleVars}
      role="img"
      aria-label={ariaLabel}
      data-testid={testId}
      data-state={v.state}
      // v1.9 — full BuddyOutput contract surfaced as data-attributes so any
      // downstream observer (a11y tool, e2e test, hardware adapter polling
      // the DOM, telemetry probe) can read the canonical contract without
      // re-deriving it from CSS classes or color values.
      data-safety-mode={v.safetyMode}
      data-motion={v.motion}
      data-expression={v.expression}
      // v1.9 gap-fix — eyeColor / heartColor / heartPulse were exposed only
      // as CSS variables (--buddy-eye-color, etc.), which a hardware adapter
      // or e2e probe cannot read without computed-style introspection. Mirror
      // them as data-attributes so the canonical 8-field BuddyOutput contract
      // is fully readable from the DOM. CSS variables remain authoritative
      // for paint; data-attributes are the read-only mirror for observers.
      data-eye-color={v.eyeColor}
      data-heart-color={v.heartColor}
      data-heart-pulse={v.heartPulse}
    >
      <svg
        viewBox="0 0 200 240"
        xmlns="http://www.w3.org/2000/svg"
        className="buddy__svg"
        aria-hidden="true"
        focusable="false"
      >
        {/* v1.10 visual polish — gradients, depth, warmer companion feel.
            All gradient stops with stop-color="var(--buddy-...)" inherit
            the same canonical CSS vars (no new vars introduced). */}
        <defs>
          <radialGradient id="buddyHeadShine" cx="50%" cy="32%" r="70%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="65%" stopColor="#f4f7f5" />
            <stop offset="100%" stopColor="#e6ebe8" />
          </radialGradient>
          <radialGradient id="buddyBodyShine" cx="50%" cy="38%" r="75%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="70%" stopColor="#f1f5f3" />
            <stop offset="100%" stopColor="#e2e8e4" />
          </radialGradient>
          <radialGradient id="buddyFaceShine" cx="50%" cy="35%" r="85%">
            <stop offset="0%" stopColor="#1c2322" />
            <stop offset="60%" stopColor="#0e1413" />
            <stop offset="100%" stopColor="#050807" />
          </radialGradient>
          <radialGradient id="buddyChestPlate" cx="50%" cy="40%" r="80%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#eaefec" />
          </radialGradient>
          <radialGradient id="buddyHeartHalo">
            <stop offset="0%" stopColor="var(--buddy-heart-color)" stopOpacity="0.55" />
            <stop offset="55%" stopColor="var(--buddy-heart-color)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--buddy-heart-color)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="buddyAntennaGlow">
            <stop offset="0%" stopColor="var(--buddy-eye-color)" stopOpacity="0.65" />
            <stop offset="100%" stopColor="var(--buddy-eye-color)" stopOpacity="0" />
          </radialGradient>
          {/* v1.11 ambient aura — soft heart-color halo behind the whole
              figure makes Buddy feel "alive" and warm at any render size,
              and shifts color with state via var(--buddy-heart-color). */}
          <radialGradient id="buddyAura" cx="50%" cy="55%" r="58%">
            <stop offset="0%" stopColor="var(--buddy-heart-color)" stopOpacity="0.20" />
            <stop offset="55%" stopColor="var(--buddy-heart-color)" stopOpacity="0.06" />
            <stop offset="100%" stopColor="var(--buddy-heart-color)" stopOpacity="0" />
          </radialGradient>
          {/* v1.12 floor glow — soft pool of light beneath Buddy so the
              figure reads as gently floating rather than sitting flat. */}
          <radialGradient id="buddyFloorGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--buddy-heart-color)" stopOpacity="0.32" />
            <stop offset="55%" stopColor="var(--buddy-heart-color)" stopOpacity="0.12" />
            <stop offset="100%" stopColor="var(--buddy-heart-color)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient aura — sits behind everything; gives a soft "alive" glow
            that follows the heart color so it adapts per state. Decorative. */}
        <ellipse cx="100" cy="130" rx="98" ry="118" fill="url(#buddyAura)" aria-hidden="true" />

        {/* Antenna with soft glow tip + base mount */}
        <g className="buddy__antenna">
          {/* Base mount where antenna meets head */}
          <rect x="94" y="20" width="12" height="6" rx="2" fill="#cdd5d2" />
          <line x1="100" y1="22" x2="100" y2="9" stroke="#b8c0bd" strokeWidth="3" strokeLinecap="round" />
          <line x1="100" y1="22" x2="100" y2="9" stroke="#dde3e0" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="100" cy="7" r="11" fill="url(#buddyAntennaGlow)" />
          <circle cx="100" cy="7" r="4.5" fill="var(--buddy-eye-color)" />
          <circle cx="99" cy="5.5" r="1.6" fill="#ffffff" opacity="0.95" />
        </g>

        {/* BODY first (renders behind head + collar so they appear seated on top).
            Wider than head + softer rounding makes the silhouette read as
            "rounded body with a screen-head" instead of two stacked boxes.
            v1.11: body extended UP so it overlaps the head bottom and
            forms natural "shoulders" that rise to meet the head sides. */}
        <g className="buddy__body">
          {/* Arms — rounded, behind body so they emerge naturally */}
          <rect x="22" y="142" width="18" height="68" rx="9" fill="#dde3e0" className="buddy__arm buddy__arm--left" />
          <rect x="160" y="142" width="18" height="68" rx="9" fill="#dde3e0" className="buddy__arm buddy__arm--right" />
          {/* Hand caps */}
          <circle cx="31" cy="208" r="8" fill="#e6ebe8" />
          <circle cx="169" cy="208" r="8" fill="#e6ebe8" />
          <circle cx="31" cy="208" r="8" fill="none" stroke="#d3dad6" strokeWidth="0.8" />
          <circle cx="169" cy="208" r="8" fill="none" stroke="#d3dad6" strokeWidth="0.8" />

          {/* Body shell — wider than head, softer corners, raised to fuse
              with head bottom under the collar. */}
          <rect
            x="34"
            y="118"
            width="132"
            height="110"
            rx="36"
            ry="36"
            fill="url(#buddyBodyShine)"
            stroke="#d3dad6"
            strokeWidth="1.4"
          />

          {/* Chest plate — bigger, two-tone with soft ring */}
          <ellipse cx="100" cy="180" rx="38" ry="38" fill="url(#buddyChestPlate)" />
          <ellipse cx="100" cy="180" rx="38" ry="38" fill="none" stroke="#dee3e0" strokeWidth="1.2" opacity="0.8" />

          {/* Heart — bigger, with multi-layer halo. v1.7: explicit
              aria-hidden so this decorative pulse never reaches AT. */}
          <g className="buddy__heart" transform="translate(100 180)" aria-hidden="true">
            <g className="buddy__heart-glow">
              <circle r="34" fill="url(#buddyHeartHalo)" />
              <circle r="24" fill="var(--buddy-heart-color)" opacity="0.16" />
              <circle r="15" fill="var(--buddy-heart-color)" opacity="0.30" />
            </g>
            <path
              d="M 0 10 C -14 -6 -22 -2 -22 -11 C -22 -20 -14 -22 0 -11 C 14 -22 22 -20 22 -11 C 22 -2 14 -6 0 10 Z"
              fill="var(--buddy-heart-color)"
              className="buddy__heart-shape"
            />
            {/* Soft top-left highlight on heart for dimensionality */}
            <ellipse cx="-8" cy="-12" rx="4.5" ry="2.8" fill="#ffffff" opacity="0.45" transform="rotate(-30 -8 -12)" />
            <circle r="3.4" cx="-1" cy="-6" fill="#fffbe6" className="buddy__heart-core" opacity="0.92" />
          </g>
        </g>

        {/* Neck collar — wide chunky band that bridges head ↔ body so they
            visually fuse instead of reading as two stacked rectangles. */}
        <g>
          <rect x="74" y="116" width="52" height="16" rx="5" fill="#cdd5d2" />
          <rect x="76" y="118" width="48" height="3" rx="1.5" fill="#b6beba" opacity="0.75" />
          <rect x="76" y="127" width="48" height="2.5" rx="1.2" fill="#b6beba" opacity="0.55" />
        </g>

        {/* HEAD — sits on top of the collar/body, slightly narrower so the
            silhouette tapers naturally. */}
        <g className="buddy__head">
          {/* Side ears — softer, integrated */}
          <rect x="36" y="58" width="12" height="28" rx="6" fill="#dde3e0" />
          <rect x="152" y="58" width="12" height="28" rx="6" fill="#dde3e0" />
          <rect x="38" y="62" width="3" height="20" rx="1.5" fill="#c4ccc8" opacity="0.7" />
          <rect x="159" y="62" width="3" height="20" rx="1.5" fill="#c4ccc8" opacity="0.7" />

          {/* Head shell with radial highlight */}
          <rect
            x="46"
            y="22"
            width="108"
            height="100"
            rx="24"
            ry="24"
            fill="url(#buddyHeadShine)"
            stroke="#d3dad6"
            strokeWidth="1.4"
          />

          {/* Face screen with inner gradient + bezel */}
          <rect
            x="58"
            y="40"
            width="84"
            height="64"
            rx="16"
            ry="16"
            fill="url(#buddyFaceShine)"
          />
          {/* Screen bezel highlight */}
          <rect
            x="58"
            y="40"
            width="84"
            height="64"
            rx="16"
            ry="16"
            fill="none"
            stroke="#ffffff"
            strokeWidth="0.8"
            opacity="0.08"
          />
          {/* Screen sheen — top arc */}
          <path
            d="M 62 48 Q 100 44 138 48 L 138 58 Q 100 53 62 58 Z"
            fill="#ffffff"
            opacity="0.05"
          />

          {/* Eyes — bigger, with white highlight for life. v1.7: aria-hidden
              on decorative inner pieces is technically redundant (parent
              SVG is aria-hidden) but it's defensive in case a future
              refactor un-hides the SVG. */}
          <g className="buddy__eyes" aria-hidden="true">
            <circle cx="80" cy="72" r="10" fill="var(--buddy-eye-color)" className="buddy__eye buddy__eye--left" />
            <circle cx="120" cy="72" r="10" fill="var(--buddy-eye-color)" className="buddy__eye buddy__eye--right" />
            {/* Highlight specks — give the eyes life and depth */}
            <circle cx="83.5" cy="68.5" r="2.6" fill="#ffffff" opacity="0.95" />
            <circle cx="123.5" cy="68.5" r="2.6" fill="#ffffff" opacity="0.95" />
            {/* Tiny secondary glints */}
            <circle cx="77" cy="75" r="1" fill="#ffffff" opacity="0.6" />
            <circle cx="117" cy="75" r="1" fill="#ffffff" opacity="0.6" />
          </g>

          {/* Cheek blush — soft tinted dots add warmth & character.
              Uses eye-color so it tints with state. Decorative. */}
          <ellipse cx="68" cy="86" rx="5" ry="3" fill="var(--buddy-eye-color)" opacity="0.20" />
          <ellipse cx="132" cy="86" rx="5" ry="3" fill="var(--buddy-eye-color)" opacity="0.20" />

          {/* Subtle smile (varies by state via CSS) */}
          <path
            d="M 82 92 Q 100 100 118 92"
            stroke="var(--buddy-eye-color)"
            strokeWidth="2.4"
            strokeLinecap="round"
            fill="none"
            className="buddy__mouth"
            opacity="0.65"
          />
        </g>

        {/* Floor glow — soft pool of state-tinted light beneath Buddy.
            Sits between the figure and the dark shadow so Buddy reads as
            gently floating on a warm halo rather than sitting flat. */}
        <ellipse cx="100" cy="232" rx="62" ry="10" fill="url(#buddyFloorGlow)" aria-hidden="true" />

        {/* Base / shadow — v1.7 explicit aria-hidden for defensive a11y. */}
        <ellipse cx="100" cy="234" rx="58" ry="6" fill="#0a0f0e" opacity="0.13" className="buddy__shadow" aria-hidden="true" />
      </svg>
    </div>
  );
}
