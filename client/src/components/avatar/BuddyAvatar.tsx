/**
 * BuddyAvatar.tsx — MMHB Buddy Engine visual.
 * PURE VISUAL COMPONENT. No fetch, no AI, no business logic.
 *
 * v1.15 "screen-face robot" redesign — visually inspired by the friendly
 * white desktop-companion robot reference (square white head with a glossy
 * dark face screen, soft green crescent eyes, red dot-matrix heart on a
 * white chest plate, chunky rounded arm pads at the sides, and a round
 * disc base with a status LED). All shape changes are additive — the
 * three canonical CSS variables, the data-* contract mirror, the
 * 200×240 viewBox, and every state-class hook still drive paint.
 *
 * Style still lives in BuddyAvatar.css (sibling) — keyframes are state-
 * class scoped (.buddy--<state>) so adding new states later is additive.
 *
 * Hard contracts (locked, do not change):
 *   - viewBox 200×240
 *   - 3 canonical CSS vars only (--buddy-eye-color / --buddy-heart-color /
 *     --buddy-heart-pulse)
 *   - 8 data-* fields surfaced on root
 *   - .buddy--crisis CSS rule untouched (crisis must stay steady & green)
 *   - .buddy__antenna circle:nth-of-type(1) preserved (CSS targets it for
 *     the breathing halo on non-steady states)
 *   - .buddy__heart-shape, .buddy__heart-glow, .buddy__heart-core,
 *     .buddy__eye class hooks preserved (CSS animations target them)
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

/**
 * Dot-matrix heart layout — 7 columns × 6 rows. Each entry is 1 (dot
 * present) or 0 (gap). Reads top-to-bottom; produces the classic
 * pixel-LED heart silhouette seen on small companion robots:
 *
 *   . # # . # # .
 *   # # # # # # #
 *   # # # # # # #
 *   . # # # # # .
 *   . . # # # . .
 *   . . . # . . .
 */
const HEART_DOT_GRID: ReadonlyArray<ReadonlyArray<0 | 1>> = [
  [0, 1, 1, 0, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 0, 0],
  [0, 0, 0, 1, 0, 0, 0],
];

const DOT_SPACING = 5;     // px between dot centers in user space
const DOT_RADIUS = 2;      // px radius of each LED dot
const HEART_CX = 100;      // center x of heart on chest plate
const HEART_CY = 178;      // center y of heart on chest plate
const HEART_COLS = 7;
const HEART_ROWS = 6;

// Pre-compute dot positions once — pure data, no per-render cost.
const HEART_DOTS: ReadonlyArray<{ cx: number; cy: number }> = (() => {
  const dots: { cx: number; cy: number }[] = [];
  const xOffset = HEART_CX - ((HEART_COLS - 1) * DOT_SPACING) / 2;
  const yOffset = HEART_CY - ((HEART_ROWS - 1) * DOT_SPACING) / 2;
  for (let r = 0; r < HEART_ROWS; r++) {
    for (let c = 0; c < HEART_COLS; c++) {
      if (HEART_DOT_GRID[r][c] === 1) {
        dots.push({ cx: xOffset + c * DOT_SPACING, cy: yOffset + r * DOT_SPACING });
      }
    }
  }
  return dots;
})();

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
        <defs>
          {/* Head shell — clean white with cool shadow on the bottom edge
              so the dome reads as a 3D shape, not a flat rectangle. */}
          <radialGradient id="buddyHeadShine" cx="48%" cy="28%" r="78%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="55%" stopColor="#fafcfb" />
            <stop offset="85%" stopColor="#dfe6e2" />
            <stop offset="100%" stopColor="#bcc6c0" />
          </radialGradient>
          {/* Body shell — same family but slightly cooler so the body
              reads as a separate "torso" volume from the head. */}
          <radialGradient id="buddyBodyShine" cx="50%" cy="32%" r="82%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="55%" stopColor="#f4f8f6" />
            <stop offset="88%" stopColor="#d4ddd8" />
            <stop offset="100%" stopColor="#aab4ae" />
          </radialGradient>
          {/* Face screen — deep glassy black with a subtle teal core so
              the screen feels lit, not painted on. */}
          <radialGradient id="buddyFaceShine" cx="50%" cy="40%" r="92%">
            <stop offset="0%" stopColor="#1a2422" />
            <stop offset="55%" stopColor="#0a1211" />
            <stop offset="100%" stopColor="#020605" />
          </radialGradient>
          <radialGradient id="buddyChestPlate" cx="50%" cy="36%" r="86%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#f0f4f1" />
            <stop offset="100%" stopColor="#cdd5d0" />
          </radialGradient>
          {/* Heart halo — visibly opaque enough to actually glow. */}
          <radialGradient id="buddyHeartHalo">
            <stop offset="0%" stopColor="var(--buddy-heart-color)" stopOpacity="0.78" />
            <stop offset="38%" stopColor="var(--buddy-heart-color)" stopOpacity="0.42" />
            <stop offset="72%" stopColor="var(--buddy-heart-color)" stopOpacity="0.16" />
            <stop offset="100%" stopColor="var(--buddy-heart-color)" stopOpacity="0" />
          </radialGradient>
          {/* Antenna glow — kept for the .buddy__antenna nth-of-type(1)
              CSS hook (subtle status pip on top of the head). */}
          <radialGradient id="buddyAntennaGlow">
            <stop offset="0%" stopColor="var(--buddy-eye-color)" stopOpacity="0.95" />
            <stop offset="55%" stopColor="var(--buddy-eye-color)" stopOpacity="0.30" />
            <stop offset="100%" stopColor="var(--buddy-eye-color)" stopOpacity="0" />
          </radialGradient>
          {/* Ambient aura — soft state-tinted halo around Buddy. */}
          <radialGradient id="buddyAura" cx="50%" cy="55%" r="62%">
            <stop offset="0%" stopColor="var(--buddy-heart-color)" stopOpacity="0.55" />
            <stop offset="55%" stopColor="var(--buddy-heart-color)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--buddy-heart-color)" stopOpacity="0" />
          </radialGradient>
          {/* Floor pool — tinted disc beneath the base. */}
          <radialGradient id="buddyFloorGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--buddy-heart-color)" stopOpacity="0.65" />
            <stop offset="55%" stopColor="var(--buddy-heart-color)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--buddy-heart-color)" stopOpacity="0" />
          </radialGradient>
          {/* Status LED on the disc base — small bright pip. */}
          <radialGradient id="buddyChestLed">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="40%" stopColor="var(--buddy-heart-color)" stopOpacity="0.95" />
            <stop offset="100%" stopColor="var(--buddy-heart-color)" stopOpacity="0" />
          </radialGradient>
          {/* Face screen sheen — subtle horizontal glassy reflection. */}
          <linearGradient id="buddyScreenSheen" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.20" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          {/* Disc base — slight gradient so the base reads as a 3D puck. */}
          <radialGradient id="buddyBase" cx="50%" cy="38%" r="80%">
            <stop offset="0%" stopColor="#fafcfb" />
            <stop offset="60%" stopColor="#dde3e0" />
            <stop offset="100%" stopColor="#9aa39e" />
          </radialGradient>
        </defs>

        {/* Ambient state-tinted aura — sits behind everything. */}
        <ellipse className="buddy__aura" cx="100" cy="128" rx="106" ry="124" fill="url(#buddyAura)" aria-hidden="true" />

        {/* Antenna — kept minimal (small status pip on top of head) so the
            .buddy__antenna circle:nth-of-type(1) animation hook remains
            valid. The first <circle> below MUST stay first; CSS targets it
            for the breathing halo on non-steady states. */}
        <g className="buddy__antenna">
          <rect x="94" y="18" width="12" height="6" rx="2" fill="#bdc6c1" />
          <rect x="94" y="18" width="12" height="2" rx="1" fill="#9aa39e" opacity="0.6" />
          <line x1="100" y1="18" x2="100" y2="11" stroke="#9aa39e" strokeWidth="2.4" strokeLinecap="round" />
          <line x1="100" y1="18" x2="100" y2="11" stroke="#dde3e0" strokeWidth="1.2" strokeLinecap="round" />
          {/* outer halo (CSS-animated) */}
          <circle cx="100" cy="9" r="9" fill="url(#buddyAntennaGlow)" />
          <circle cx="100" cy="9" r="4" fill="var(--buddy-eye-color)" opacity="0.45" />
          <circle cx="100" cy="9" r="2.6" fill="var(--buddy-eye-color)" />
          <circle cx="99.4" cy="8" r="1.1" fill="#ffffff" opacity="0.95" />
        </g>

        {/* DISC BASE — round puck Buddy "sits" on, with a tiny green
            status LED at the front. Drawn first so the body sits on top. */}
        <g className="buddy__base" aria-hidden="true">
          <ellipse cx="100" cy="226" rx="64" ry="11" fill="url(#buddyBase)" stroke="#9ba59f" strokeWidth="1.2" />
          <ellipse cx="100" cy="222" rx="62" ry="9" fill="none" stroke="#ffffff" strokeWidth="0.8" opacity="0.55" />
          {/* Front-facing status LED on the base */}
          <circle cx="100" cy="232" r="3" fill="url(#buddyChestLed)" />
          <circle cx="100" cy="232" r="1.2" fill="#ffffff" opacity="0.95" />
        </g>

        {/* BODY — square white chassis with rounded corners; arm pads on
            the sides as chunky rounded buttons (matching the reference). */}
        <g className="buddy__body">
          {/* Arm pads — short, chunky, more like side bumpers than long
              arms (per reference photo). */}
          <rect x="22" y="158" width="22" height="48" rx="11" fill="#dde3e0" stroke="#9aa39e" strokeWidth="1.2" className="buddy__arm buddy__arm--left" />
          <rect x="156" y="158" width="22" height="48" rx="11" fill="#dde3e0" stroke="#9aa39e" strokeWidth="1.2" className="buddy__arm buddy__arm--right" />
          {/* Pad highlights for dimensional read */}
          <ellipse cx="29" cy="166" rx="4" ry="2.2" fill="#ffffff" opacity="0.7" />
          <ellipse cx="171" cy="166" rx="4" ry="2.2" fill="#ffffff" opacity="0.7" />
          <line x1="33" y1="180" x2="33" y2="194" stroke="#ffffff" strokeWidth="1.2" opacity="0.35" />
          <line x1="167" y1="180" x2="167" y2="194" stroke="#ffffff" strokeWidth="1.2" opacity="0.35" />

          {/* Body shell — square per reference (rx 22, was 36). */}
          <rect
            x="36"
            y="128"
            width="128"
            height="92"
            rx="22"
            ry="22"
            fill="url(#buddyBodyShine)"
            stroke="#9ba59f"
            strokeWidth="2"
          />

          {/* Subtle plate seam at top of body for character */}
          <line x1="50" y1="146" x2="150" y2="146" stroke="#c8d0cb" strokeWidth="0.7" opacity="0.55" />

          {/* Chest plate — a darker recessed area where the dot-matrix
              heart and speaker grille live. */}
          <rect x="68" y="156" width="64" height="56" rx="10" fill="url(#buddyChestPlate)" stroke="#bdc6c1" strokeWidth="1.2" />
          {/* Inner bezel ring for depth */}
          <rect x="71" y="159" width="58" height="50" rx="8" fill="none" stroke="#d6ddd8" strokeWidth="0.8" opacity="0.8" />

          {/* Heart halo — soft glow under the dot-matrix; sits behind the
              dots so the dots themselves stay crisp. */}
          <g className="buddy__heart-glow" aria-hidden="true">
            <circle cx={HEART_CX} cy={HEART_CY} r="28" fill="url(#buddyHeartHalo)" />
            <circle cx={HEART_CX} cy={HEART_CY} r="20" fill="var(--buddy-heart-color)" opacity="0.16" />
          </g>

          {/* Heart — DOT-MATRIX (LED-style) per reference photo. The whole
              dot grid is wrapped in a single .buddy__heart-shape group so
              the existing CSS heartbeat animation pulses all dots together
              as one organism. */}
          <g className="buddy__heart-shape" aria-hidden="true">
            {HEART_DOTS.map((d, i) => (
              <circle
                key={i}
                cx={d.cx}
                cy={d.cy}
                r={DOT_RADIUS}
                fill="var(--buddy-heart-color)"
              />
            ))}
            {/* Center bright "core" dot — gives the matrix a brighter heart
                of light. Keeps the .buddy__heart-core class so the existing
                CSS pulse rule still drives it. */}
            <circle
              className="buddy__heart-core"
              cx={HEART_CX}
              cy={HEART_CY - 3}
              r={DOT_RADIUS + 0.4}
              fill="#fffbe6"
              opacity="0.9"
            />
          </g>

          {/* Speaker / mic grille slot — small dark rectangle below the
              heart, per reference photo. Decorative. */}
          <rect x="92" y="200" width="16" height="4" rx="1.2" fill="#1a1a1a" opacity="0.85" aria-hidden="true" />
          <line x1="94" y1="202" x2="106" y2="202" stroke="#3a3a3a" strokeWidth="0.4" opacity="0.6" />
        </g>

        {/* Neck collar — chunky band that bridges head ↔ body so they
            visually fuse instead of reading as two stacked rectangles. */}
        <g aria-hidden="true">
          <rect x="78" y="120" width="44" height="14" rx="4" fill="#bdc6c1" stroke="#9aa39e" strokeWidth="0.8" />
          <rect x="80" y="123" width="40" height="2.2" rx="1" fill="#9aa39e" opacity="0.7" />
          <rect x="80" y="129" width="40" height="2" rx="1" fill="#9aa39e" opacity="0.5" />
        </g>

        {/* HEAD — wider square per reference. Sits on top of the collar. */}
        <g className="buddy__head">
          {/* Head shell — square white per reference (rx 18, was 24). */}
          <rect
            x="36"
            y="34"
            width="128"
            height="92"
            rx="18"
            ry="18"
            fill="url(#buddyHeadShine)"
            stroke="#9ba59f"
            strokeWidth="2"
          />
          {/* Soft top dome highlight crescent — lit-from-above feel */}
          <path
            d="M 48 42 Q 100 36 152 42 Q 152 50 100 48 Q 48 50 48 42 Z"
            fill="#ffffff"
            opacity="0.55"
          />

          {/* Face SCREEN — large dark glossy panel filling most of the head,
              per reference. Slightly inset on all sides. */}
          <rect
            x="48"
            y="48"
            width="104"
            height="64"
            rx="14"
            ry="14"
            fill="url(#buddyFaceShine)"
          />
          {/* Screen bezel highlight */}
          <rect
            x="48"
            y="48"
            width="104"
            height="64"
            rx="14"
            ry="14"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1"
            opacity="0.14"
          />
          {/* Glassy reflection arc across the top of the screen */}
          <path
            d="M 54 56 Q 100 50 146 56 L 146 70 Q 100 62 54 70 Z"
            fill="url(#buddyScreenSheen)"
          />

          {/* Camera lens dot — small dark pip at the top center of the
              screen (per reference photo). Decorative. */}
          <g aria-hidden="true">
            <circle cx="100" cy="58" r="2.4" fill="#0a0a0a" />
            <circle cx="100.8" cy="57.4" r="0.8" fill="#3a3a3a" />
          </g>

          {/* EYES — soft green CRESCENTS per reference (◡ ◡), not round
              dots. Filled crescent shape via two arcs. The .buddy__eye
              class hook is preserved so the existing blink keyframe still
              squashes the eye vertically without surgery. */}
          <g className="buddy__eyes" aria-hidden="true">
            {/* Left eye crescent */}
            <path
              d="M 70 78 Q 84 92 98 78 Q 84 86 70 78 Z"
              fill="var(--buddy-eye-color)"
              className="buddy__eye buddy__eye--left"
            />
            {/* Right eye crescent */}
            <path
              d="M 102 78 Q 116 92 130 78 Q 116 86 102 78 Z"
              fill="var(--buddy-eye-color)"
              className="buddy__eye buddy__eye--right"
            />
            {/* Soft outer bloom under each crescent — adds the gentle
                "glowing LED" feel from the reference. */}
            <ellipse cx="84" cy="84" rx="14" ry="3" fill="var(--buddy-eye-color)" opacity="0.22" />
            <ellipse cx="116" cy="84" rx="14" ry="3" fill="var(--buddy-eye-color)" opacity="0.22" />
            {/* Tiny highlight specks on the upper edge of each crescent */}
            <ellipse cx="80" cy="82" rx="3" ry="1.1" fill="#ffffff" opacity="0.7" />
            <ellipse cx="120" cy="82" rx="3" ry="1.1" fill="#ffffff" opacity="0.7" />
          </g>
        </g>

        {/* Floor glow — soft pool of state-tinted light beneath the disc. */}
        <ellipse className="buddy__floor" cx="100" cy="236" rx="74" ry="9" fill="url(#buddyFloorGlow)" aria-hidden="true" />

        {/* Hard contact shadow under the disc base. */}
        <ellipse cx="100" cy="237" rx="58" ry="4" fill="#0a0f0e" opacity="0.18" className="buddy__shadow" aria-hidden="true" />
      </svg>
    </div>
  );
}
