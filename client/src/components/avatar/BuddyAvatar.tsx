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

import { useEffect, useRef } from "react";
import "./BuddyAvatar.css";
import {
  type BuddyState,
  getBuddyVisualOutput,
} from "@/lib/avatarState";
import { useLumiAudio } from "@/hooks/useLumiAudio.js";

/**
 * Lumi v4 color variants — public-served PNGs in /brand/.
 * `default` is the canonical V17 official sage Lumi (avatar-floating-nobg.png).
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

// v5.8.19 — All non-default color tints redirected to the canonical official
// V17 sage Lumi (avatar-floating-nobg). The legacy lumi-v4-* tinted PNGs were
// off-brand (purple/pink/yellow/orange/blue palettes that broke the V17
// visual contract) and have been deleted from disk. The colorMode prop API
// is preserved for backward compat with 20+ call sites; resolution now
// always lands on the official artwork. `sleep` maps to avatar-breathing
// (the official "rest" pose).
const COLOR_MODE_SRC: Record<BuddyColorMode, string> = {
  default: "/brand/v17/avatar-floating-nobg.png",
  yellow:  "/brand/v17/avatar-floating-nobg.png",
  pink:    "/brand/v17/avatar-heart-nobg.png",
  blue:    "/brand/v17/avatar-breathing-nobg.png",
  purple:  "/brand/v17/avatar-floating-nobg.png",
  sleep:   "/brand/v17/avatar-breathing-nobg.png",
  orange:  "/brand/v17/avatar-floating-nobg.png",
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

// v5.8.19 — All sanrio/squishmallow style variants redirected to the official
// V17 sage Lumi. The legacy lumi-style-* alt-character PNGs were off-brand
// (third-party-character-inspired artwork that diluted the canonical Lumi
// identity) and have been deleted from disk. The style prop API is preserved
// for backward compat; all values now resolve to the official artwork.
const STYLE_SRC: Record<Exclude<BuddyStyle, "default">, string> = {
  pompompurin:  "/brand/v17/avatar-floating-nobg.png",
  cinnamoroll:  "/brand/v17/avatar-floating-nobg.png",
  chiikawa:     "/brand/v17/avatar-floating-nobg.png",
  jellycat:     "/brand/v17/avatar-floating-nobg.png",
  squishmallow: "/brand/v17/avatar-floating-nobg.png",
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
  | "hugging"
  | "listening"
  | "pointing"
  | "presenting"
  | "running"
  | "sleeping"
  | "thinking"
  | "writing";

// Pose source map — uses the canonical filename per asset (action vs body).
// Poses without dedicated PNGs (listening, pointing, presenting, running,
// sleeping, thinking, writing) point at the canonical fallback URL directly
// so the network sees zero 404s. data-pose still surfaces the requested pose
// for downstream observers / e2e tests / future asset rollouts.
const FALLBACK_LUMI = "/brand/v17/avatar-floating-nobg.png";

// V17 PNGs ship a same-name `.webp` sibling (~14–22 KB vs 263–365 KB).
// v4 themes don't, so we only emit a <source> when we know the webp exists.
const V17_WEBP_PREFIX = "/brand/v17/";
function pickWebp(pngUrl: string): string | null {
  if (pngUrl.startsWith(V17_WEBP_PREFIX) && pngUrl.endsWith(".png")) {
    return pngUrl.slice(0, -4) + ".webp";
  }
  return null;
}
const POSE_SRC: Record<Exclude<BuddyPose, "default">, string> = {
  eating:      "/brand/v17/avatar-floating-nobg.png",
  dancing:     "/brand/v17/avatar-floating-nobg.png",
  waving:      "/brand/v17/avatar-floating-nobg.png",
  meditating:  "/brand/v17/avatar-breathing-nobg.png",
  celebrating: "/brand/v17/avatar-heart-nobg.png",
  hugging:     "/brand/v17/avatar-heart-nobg.png",
  // Below: declared in the union for type safety; PNGs ship later. Point at
  // the canonical fallback now so we don't generate 404 noise.
  listening:   FALLBACK_LUMI,
  pointing:    FALLBACK_LUMI,
  presenting:  FALLBACK_LUMI,
  running:     FALLBACK_LUMI,
  sleeping:    FALLBACK_LUMI,
  thinking:    FALLBACK_LUMI,
  writing:     FALLBACK_LUMI,
};

/**
 * Size token shorthand. Numeric `size` still accepted for fine-grained
 * control. Tokens map to common UI scales used across the platform:
 *   sm  →  32px (header logos, chat bubble avatars)
 *   md  →  64px (cards, modals)
 *   lg  → 128px (hero sections, onboarding)
 *   xl  → 208px (landing hero LumiCompanion)
 */
export type BuddySizeToken = "sm" | "md-header" | "md" | "lg" | "xl";

const SIZE_TOKEN_PX: Record<BuddySizeToken, number> = {
  sm: 32,
  "md-header": 44,
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
  /**
   * V6 cuteness overlay. When true, renders the kawaii face system on top
   * of the PNG: soft face-pad to mute existing PNG features, CSS dot eyes,
   * emotion-gated mouth (no mouth in calm/default per the Hello Kitty
   * "less face = more cute" principle), and warm amber heart pulse.
   *
   * Default false — strictly opt-in and backward compatible. When true,
   * adds a `buddy--v6` root class so CSS can scope the overlay rules.
   *
   * Faceless V5 PNGs ship later. Until then, the soft face-pad does its
   * best to obscure the PNG face beneath the new CSS face. Per user spec.
   */
  overlay?: boolean;
  /**
   * Crisis-stillness opt-out (defense-in-depth). When false, forces
   * motion="steady" regardless of incoming state — every animation
   * (breathe, blink, heart pulse, V6 layers) is suppressed. Use on
   * crisis-adjacent surfaces (ErrorBoundary, crisis page) so even if
   * state drift sends a non-crisis state, the avatar stays still.
   * Default true (preserves existing behavior).
   */
  animated?: boolean;
  /**
   * Image loading strategy. Defaults to "lazy" (safe for the dozens of
   * off-screen avatar instances across the app). Set to "eager" at
   * above-the-fold call sites (header logo, login/register hero) to avoid
   * delaying LCP. "auto" leaves it up to the browser.
   */
  imageLoading?: "lazy" | "eager" | "auto";
  /** Above-the-fold hint for the browser fetch scheduler. */
  fetchPriority?: "high" | "low" | "auto";
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
  overlay = false,
  animated = true,
  imageLoading = "lazy",
  fetchPriority = "auto",
  "data-testid": testId = "buddy-avatar",
}: BuddyAvatarProps) {
  // Defense-in-depth: animated={false} hard-pins motion to "steady" so
  // every animation gate (.buddy--motion-steady selectors + breathe class
  // below) collapses to stillness regardless of the resolved state.
  const effectiveMotion = animated ? undefined : "steady";
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

  // V6 mouth is emotion-gated. Per the "Hello Kitty principle" (less face =
  // more cute, user projects own emotion), no mouth on calm/default. We
  // only render a mouth when the emotional content benefits from it.
  const v6ShowMouth =
    overlay && (v.state === "celebrate" || v.state === "encouraged" || v.state === "sad");
  // Auto-disable overlay below ~48px — the kawaii dots / mouth / heart
  // would render as sub-pixel smudges and degrade the cute factor. The
  // PNG-only render at sm reads cleaner and is what chat bubble avatars
  // were tuned for. Caller can still pass overlay=true; we just skip
  // the layer at tiny sizes.
  const showV6Overlay = overlay && sizePx >= 48;

  // ---------- V14: universal Voice + Expression Sync ----------
  // Wire the same three audio cues that LumiV6 has (entrance pop, heartbeat,
  // chime) into BuddyAvatar so EVERY avatar surface in the app — header,
  // footer, chat bubbles, tool cards, celebration overlays — shares the
  // same gentle voice. All gating is done by the hook + module coordinator:
  //   - Default OFF (lumi:audio:enabled localStorage)
  //   - prefers-reduced-motion → silent no-op at hook + kernel
  //   - animated=false (crisis surfaces) → no audio path executes
  //   - tryPop() is sessionStorage-gated app-wide (one pop per session
  //     across header + hero + footer + chat + tools)
  //   - claimHeart() is single-owner (only one heartbeat plays even when
  //     N avatars mount; first claim wins, releases on unmount)
  //   - tryChime() shares a 2s module-scoped debounce window
  // Tiny avatars (<48px — chat bubble badges, footer logos) skip the
  // heartbeat claim so they don't grab ownership from the visible hero.
  const rootRef = useRef<HTMLDivElement>(null);
  const lumiAudio = useLumiAudio();

  // 1) Entrance pop on first viewport intersection (any avatar can fire it;
  //    sessionStorage gate ensures it happens at most once per session).
  useEffect(() => {
    if (!animated || !lumiAudio.effective) return;
    const root = rootRef.current;
    if (!root) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          lumiAudio.tryPop();
          obs.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(root);
    return () => obs.disconnect();
  }, [animated, lumiAudio.effective, lumiAudio]);

  // 2) Heartbeat — only avatars rendered at >=96px try to claim ownership.
  //    This keeps tiny header / chat-bubble / footer avatars silent while
  //    the visible hero / tool / celebration Lumi drives the cadence.
  useEffect(() => {
    if (!animated || !lumiAudio.effective) return;
    if (sizePx < 96) return;
    const token = lumiAudio.claimHeart(v.heartPulse);
    if (!token) return; // another avatar already owns the beat
    return () => lumiAudio.releaseHeart(token);
  }, [animated, lumiAudio.effective, sizePx, v.heartPulse, lumiAudio]);

  // 3) Whisper chime on pointer-down. Module-scoped 2s debounce in the lib
  //    means rapid taps across multiple avatars still yield at most one
  //    chime per 2 seconds. Hover is intentionally NOT wired (too noisy
  //    on landing pages where the cursor naturally crosses Lumi).
  const handleAudioPointerDown = () => {
    if (!animated || !lumiAudio.effective) return;
    lumiAudio.tryChime();
  };

  return (
    <div
      ref={rootRef}
      onPointerDown={handleAudioPointerDown}
      className={`buddy buddy--${v.state} buddy--motion-${effectiveMotion ?? v.motion} buddy--expr-${v.expression} ${showV6Overlay ? "buddy--v6" : ""} ${className}`.trim()}
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
      data-motion={effectiveMotion ?? v.motion}
      data-expression={v.expression}
      data-eye-color={v.eyeColor}
      data-heart-color={v.heartColor}
      data-heart-pulse={v.heartPulse}
      data-color-mode={colorMode}
      data-style={styleVariant}
      data-pose={pose}
      data-overlay={showV6Overlay ? "v6" : overlay ? "v6-suppressed" : "off"}
    >
      <picture style={{ width: '100%', height: '100%', display: 'block' }}>
        {pickWebp(lumiArtworkUrl) && (
          <source srcSet={pickWebp(lumiArtworkUrl) as string} type="image/webp" />
        )}
        <img
          src={lumiArtworkUrl}
          alt=""
          aria-hidden="true"
          draggable={false}
          decoding="async"
          loading={imageLoading === "auto" ? undefined : imageLoading}
          {...(fetchPriority !== "auto" ? { fetchPriority } as any : {})}
          onError={(e) => {
            // Graceful fallback if a v4 variant is missing — falls back to the
            // canonical sage Lumi so the avatar never renders as a broken image.
            const img = e.currentTarget;
            if (img.src.indexOf(FALLBACK_LUMI) === -1) {
              img.src = FALLBACK_LUMI;
            }
          }}
          className={`buddy__svg ${(effectiveMotion ?? v.motion) === 'steady' ? '' : 'lumi-breathe'}`.trim()}
          style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
        />
      </picture>

      {/* V6 cuteness overlay — opt-in. Position % values are tuned to the
          v4 PNG body region. Face pad sits over the upper-mid third to
          mute the underlying PNG face; new CSS face draws on top.
          Heart uses inline SVG (viewBox) so the shape scales correctly
          at every size token instead of relying on a brittle CSS path(). */}
      {showV6Overlay && (
        <div className="buddy__v6" aria-hidden="true" data-testid={`${testId}-v6`}>
          <div className="buddy__v6-face-pad" />
          <div className="buddy__v6-eye buddy__v6-eye--left" />
          <div className="buddy__v6-eye buddy__v6-eye--right" />
          {v6ShowMouth && <div className="buddy__v6-mouth" />}
          <div className="buddy__v6-heart">
            <div className="buddy__v6-heart-glow" />
            <svg
              className="buddy__v6-heart-svg"
              viewBox="0 0 100 90"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
            >
              <defs>
                <radialGradient id={`v6HeartGrad-${testId}`} cx="35%" cy="30%" r="75%">
                  <stop offset="0%"   stopColor="#FFD27A" />
                  <stop offset="55%"  stopColor="#FFB347" />
                  <stop offset="100%" stopColor="#FF8C42" />
                </radialGradient>
              </defs>
              <path
                d="M50 86 C 22 64 4 44 4 24 C 4 11 14 2 26 2 C 36 2 45 9 50 19 C 55 9 64 2 74 2 C 86 2 96 11 96 24 C 96 44 78 64 50 86 Z"
                fill={`url(#v6HeartGrad-${testId})`}
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
