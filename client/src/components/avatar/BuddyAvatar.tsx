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

/**
 * Lumi v4 color variants — public-served PNGs in /brand/.
 * `default` is the canonical sage hero pose (lumi-v4-ultimate.png).
 * Additional palette options let surfaces opt into a tinted Lumi
 * (e.g. sleep slot uses the curled-up Zzz pose).
 */
export type BuddyColorMode =
  | "default"
  | "yellow"
  | "pink"
  | "blue"
  | "purple"
  | "sleep"
  | "orange";

const COLOR_MODE_SRC: Record<BuddyColorMode, string> = {
  default: "/brand/lumi-v4-ultimate.png",
  yellow:  "/brand/lumi-v4-yellow.png",
  pink:    "/brand/lumi-v4-pink.png",
  blue:    "/brand/lumi-v4-blue.png",
  purple:  "/brand/lumi-v4-purple.png",
  sleep:   "/brand/lumi-v4-sleep.png",
  orange:  "/brand/lumi-v4-orange.png",
};

/**
 * Style variants — sanrio/squishmallow-inspired alt artwork. When set
 * (and not "default"), overrides colorMode artwork.
 */
export type BuddyStyle =
  | "default"
  | "pompompurin"
  | "cinnamoroll"
  | "chiikawa"
  | "jellycat"
  | "squishmallow";

const STYLE_SRC: Record<Exclude<BuddyStyle, "default">, string> = {
  pompompurin:  "/brand/lumi-style-pompompurin.png",
  cinnamoroll:  "/brand/lumi-style-cinnamoroll.png",
  chiikawa:     "/brand/lumi-style-chiikawa.png",
  jellycat:     "/brand/lumi-style-jellycat.png",
  squishmallow: "/brand/lumi-style-squishmallow.png",
};

/**
 * Pose variants — action/body artwork. When set (and not "default"),
 * overrides both style and colorMode. Pose has highest priority.
 */
export type BuddyPose =
  | "default"
  | "eating"
  | "dancing"
  | "waving"
  | "meditating"
  | "celebrating"
  | "hugging";

// Pose source map — uses the canonical filename per asset (action vs body).
const POSE_SRC: Record<Exclude<BuddyPose, "default">, string> = {
  eating:      "/brand/lumi-action-eating.png",
  dancing:     "/brand/lumi-action-dancing.png",
  waving:      "/brand/lumi-action-waving.png",
  meditating:  "/brand/lumi-body-meditating.png",
  celebrating: "/brand/lumi-body-celebrating.png",
  hugging:     "/brand/lumi-body-hugging.png",
};

/**
 * Size token shorthand. Numeric `size` still accepted for fine-grained
 * control. Tokens map to common UI scales used across the platform:
 *   sm  →  32px (header logos, chat bubble avatars)
 *   md  →  64px (cards, modals)
 *   lg  → 128px (hero sections, onboarding)
 *   xl  → 208px (landing hero LumiCompanion)
 */
export type BuddySizeToken = "sm" | "md" | "lg" | "xl";

const SIZE_TOKEN_PX: Record<BuddySizeToken, number> = {
  sm: 32,
  md: 64,
  lg: 128,
  xl: 208,
};

export interface BuddyAvatarProps {
  state?: BuddyState;
  /** Numeric pixel size OR a size token ("sm" | "md" | "lg" | "xl"). */
  size?: number | BuddySizeToken;
  className?: string;
  /**
   * Color variant for Lumi artwork. Defaults to "default" (canonical
   * sage hero pose). Palette options swap the rendered PNG only —
   * the visual contract (state classes, data-attrs, eye/heart vars)
   * remains driven by `state`.
   *
   * Resolution priority: pose > style > colorMode.
   */
  colorMode?: BuddyColorMode;
  /** Style variant (sanrio/squishmallow). Overrides colorMode when not "default". */
  style?: BuddyStyle;
  /** Pose variant (action/body). Highest priority — overrides style and colorMode. */
  pose?: BuddyPose;
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
  colorMode = "default",
  style: styleVariant = "default",
  pose = "default",
  "data-testid": testId = "buddy-avatar",
}: BuddyAvatarProps) {
  const v = getBuddyVisualOutput(state);
  // Resolution priority: pose > style > colorMode. Falls through to the
  // canonical sage Lumi when nothing is overridden.
  const lumiArtworkUrl =
    (pose !== "default" && POSE_SRC[pose]) ||
    (styleVariant !== "default" && STYLE_SRC[styleVariant]) ||
    COLOR_MODE_SRC[colorMode] ||
    COLOR_MODE_SRC.default;
  // Resolve size token → px (numeric size passes through unchanged).
  const sizePx =
    typeof size === "number" ? size : (SIZE_TOKEN_PX[size] ?? 160);
  // v1.7 — fall back to v.label only if the state slips past the mapper
  // (e.g., a future state added in avatarState.ts before this map is
  // updated). Keeps screen readers from going silent.
  const ariaLabel = BUDDY_ARIA_LABEL[v.state] ?? `MMHB Buddy: ${v.label}`;

  const styleVars: React.CSSProperties & Record<`--${string}`, string> = {
    width: `${sizePx}px`,
    height: `${sizePx}px`,
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
      data-color-mode={colorMode}
      data-style={styleVariant}
      data-pose={pose}
    >
      <img
        src={lumiArtworkUrl}
        alt=""
        aria-hidden="true"
        draggable={false}
        onError={(e) => {
          // Graceful fallback if a v4 variant is missing — falls back to the
          // canonical sage Lumi so the avatar never renders as a broken image.
          const img = e.currentTarget;
          if (img.src.indexOf("/brand/lumi-v4-ultimate.png") === -1) {
            img.src = "/brand/lumi-v4-ultimate.png";
          }
        }}
        className={`buddy__svg ${v.motion === 'steady' ? '' : 'lumi-breathe'}`.trim()}
        style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
      />
    </div>
  );
}
