/**
 * LumiV6 — "Living Lumi" multi-layer avatar (Section 1 of v6.0 upgrade,
 * extended in V7 "Expressive Soul" — additive only).
 *
 * Composes four independent layers:
 *   1. BODY  — base PNG (color/pose-driven, with onError fallback)
 *   2. EYES  — CSS dot eyes (blink loop; mouse-tracking when interactive)
 *   3. MOUTH — emotion-driven shape (calm = no mouth — Hello Kitty rule
 *              preserved unless mouthExpression overrides it)
 *   4. HEART — warm amber chest pulse (inline SVG via viewBox so geometry
 *              stays crisp at every size token); pulse rate driven per
 *              emotion via --lumiv6-heart-period CSS var
 *
 * V7 additions (all backward-compatible — every existing caller works
 * unchanged):
 *   - 5 new mouth shapes: worried · excited · loving · focused · breathing
 *   - 2 new eye variants: soft · happy (wide already shipped in V6)
 *   - 5 body postures: upright · curious · leaning · relaxed · bouncy
 *     applied to a dedicated wrapper between root and body img so they
 *     compose with the body's own breathing keyframes
 *   - 600ms emotion-morph transitions (mouth/eye geometry crossfade) with
 *     a 100ms eye-blink beat at the start of the morph (spec section 3.1)
 *   - Per-emotion heart rate (Hz → ms period inline CSS var)
 *   - mouthExpression / eyeExpression / posture / heartHz props, each
 *     optional; when absent, derived from emotion via EMOTION_DERIVATION
 *
 * Standalone — does NOT replace BuddyAvatar. Renders on its own
 * `.lumiv6-*` class namespace so it cannot collide with the existing
 * `.buddy*` system. Scoped CSS in LumiV6.css.
 *
 * Crisis safety: animations gated by the `animated` prop AND the
 * `prefers-reduced-motion` media query (handled in LumiV6.css). Pass
 * `animated={false}` for any crisis-adjacent surface.
 */
import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import "./LumiV6.css";

export type LumiV6ColorMode =
  | "default"
  | "yellow"
  | "pink"
  | "blue"
  | "purple"
  | "sleep"
  | "orange";

export type LumiV6Emotion =
  | "joy"
  | "love"
  | "calm"
  | "greeting"
  | "empathy"
  | "sleepy"
  | "surprise";

export type LumiV6Pose =
  | "default"
  | "waving"
  | "meditating"
  | "celebrating"
  | "hugging"
  | "thinking"
  | "listening";

export type LumiV6Size = "sm" | "md" | "lg" | "xl" | "md-header";

/**
 * V7 expression / posture types. Each is independently overridable via
 * the matching prop; left undefined, the value is derived from emotion
 * via EMOTION_DERIVATION below.
 */
export type LumiV6MouthExpression =
  | "joy"
  | "love"
  | "greeting"
  | "empathy"
  | "sleepy"
  | "surprise"
  | "worried"
  | "excited"
  | "loving"
  | "focused"
  | "breathing";

export type LumiV6EyeExpression =
  | "default"
  | "wide"
  | "soft"
  | "happy"
  | "closed";

export type LumiV6Posture =
  | "upright"
  | "curious"
  | "leaning"
  | "relaxed"
  | "bouncy";

export interface LumiV6Props {
  colorMode?: LumiV6ColorMode;
  emotion?: LumiV6Emotion;
  pose?: LumiV6Pose;
  size?: LumiV6Size;
  /** Track cursor with eyes + add hover bounce. Default true. */
  interactive?: boolean;
  /** Master switch for breathing, blink, heart-pulse loops. Default true. */
  animated?: boolean;
  /** Show speech bubble above the avatar. Default false. */
  showMessage?: boolean;
  /** Speech bubble text override. Defaults to a per-emotion line. */
  message?: string;
  /** V7: explicit mouth shape. When undefined, derived from emotion. */
  mouthExpression?: LumiV6MouthExpression;
  /** V7: explicit eye variant. When undefined, derived from emotion. */
  eyeExpression?: LumiV6EyeExpression;
  /** V7: explicit body posture. When undefined, derived from emotion. */
  posture?: LumiV6Posture;
  /** V7: explicit heart-pulse frequency (Hz). When undefined, derived from emotion. */
  heartHz?: number;
  className?: string;
  "data-testid"?: string;
}

// ---------- Asset map ----------
// Pose has highest priority; falls through to colorMode.
const COLOR_PNG: Record<LumiV6ColorMode, string> = {
  default: "/brand/lumi-v4-ultimate.png",
  yellow:  "/brand/lumi-v4-yellow.png",
  pink:    "/brand/lumi-v4-pink.png",
  blue:    "/brand/lumi-v4-blue.png",
  purple:  "/brand/lumi-v4-purple.png",
  sleep:   "/brand/lumi-v4-sleep.png",
  orange:  "/brand/lumi-v4-orange.png",
};
const POSE_PNG: Partial<Record<LumiV6Pose, string>> = {
  waving:      "/brand/lumi-action-waving.png",
  meditating:  "/brand/lumi-body-meditating.png",
  celebrating: "/brand/lumi-body-celebrating.png",
  hugging:     "/brand/lumi-body-hugging.png",
  // thinking + listening have no dedicated artwork yet — fall through
  // to colorMode and let the emotion layer carry the affect.
};
const FALLBACK_PNG = "/brand/lumi-v4-ultimate.png";

// ---------- Default speech bubble copy ----------
const EMOTION_MESSAGE: Record<LumiV6Emotion, string> = {
  joy:      "Yay! That's wonderful.",
  love:     "I'm here for you.",
  calm:     "Take a slow breath with me.",
  greeting: "Hi there — glad you're here.",
  empathy:  "I hear you. That sounds heavy.",
  sleepy:   "Resting is healing too.",
  surprise: "Oh! Tell me more.",
};

// ---------- Aria labels (a11y) ----------
const EMOTION_ARIA: Record<LumiV6Emotion, string> = {
  joy:      "Lumi is feeling joyful.",
  love:     "Lumi is sending warmth.",
  calm:     "Lumi is calm and present.",
  greeting: "Lumi is greeting you.",
  empathy:  "Lumi is listening with care.",
  sleepy:   "Lumi is resting.",
  surprise: "Lumi looks gently surprised.",
};

// ---------- Size token → pixel map ----------
const SIZE_PX: Record<LumiV6Size, number> = {
  sm: 48,
  "md-header": 56,
  md: 96,
  lg: 160,
  xl: 240,
};

/**
 * V7 emotion → expression derivation table (spec section 2.2).
 *
 * Each emotion maps to a coordinated mouth + eye + posture + heart-rate
 * triple. Caller-supplied props override individual fields. Mirrors
 * `TOY_EMOTION_SEED` in `lumiToySpec.ts` so the screen avatar and the
 * physical toy stay in lockstep.
 */
const EMOTION_DERIVATION: Record<
  LumiV6Emotion,
  {
    mouth: LumiV6MouthExpression;
    eye: LumiV6EyeExpression;
    posture: LumiV6Posture;
    heartHz: number;
  }
> = {
  greeting: { mouth: "greeting",  eye: "default", posture: "upright",  heartHz: 0.5   },
  joy:      { mouth: "excited",   eye: "happy",   posture: "bouncy",   heartHz: 1.0   },
  love:     { mouth: "loving",    eye: "soft",    posture: "relaxed",  heartHz: 0.5   },
  calm:     { mouth: "breathing", eye: "soft",    posture: "relaxed",  heartHz: 0.25  },
  empathy:  { mouth: "worried",   eye: "soft",    posture: "leaning",  heartHz: 0.35  },
  sleepy:   { mouth: "sleepy",    eye: "soft",    posture: "relaxed",  heartHz: 0.125 },
  surprise: { mouth: "surprise",  eye: "wide",    posture: "curious",  heartHz: 1.5   },
};

export default function LumiV6({
  colorMode = "default",
  emotion = "calm",
  pose = "default",
  size = "lg",
  interactive = true,
  animated = true,
  showMessage = false,
  message,
  mouthExpression,
  eyeExpression,
  posture,
  heartHz,
  className = "",
  "data-testid": testId = "lumi-v6",
}: LumiV6Props) {
  const px = SIZE_PX[size] ?? SIZE_PX.lg;
  const bodySrc = POSE_PNG[pose] || COLOR_PNG[colorMode] || FALLBACK_PNG;
  const ariaLabel = EMOTION_ARIA[emotion];
  const bubbleText = message ?? EMOTION_MESSAGE[emotion];

  // V7 derivation — explicit prop wins, otherwise look up emotion.
  const derived = EMOTION_DERIVATION[emotion];
  const resolvedMouth: LumiV6MouthExpression = mouthExpression ?? derived.mouth;
  const resolvedEye: LumiV6EyeExpression = eyeExpression ?? derived.eye;
  const resolvedPosture: LumiV6Posture = posture ?? derived.posture;
  const resolvedHeartHz = heartHz ?? derived.heartHz;
  // Convert Hz → ms period for the heart-pulse CSS var.
  const heartPeriodMs = Math.max(120, Math.round(1000 / Math.max(0.05, resolvedHeartHz)));

  // Sleepy stays a closed-eye special case for backward-compat visual fidelity:
  // the old "sleepy = closed slit" reading is more recognisable than the new
  // "soft" eye for that single emotion. Explicit eyeExpression still wins.
  const finalEye: LumiV6EyeExpression =
    eyeExpression ?? (emotion === "sleepy" ? "closed" : resolvedEye);

  // Backward-compat: emotion="calm" with NO explicit mouthExpression keeps the
  // legacy "Hello Kitty" no-mouth render. Setting mouthExpression="breathing"
  // (or anything else) opts in to the V7 visible mouth.
  const showMouth = mouthExpression !== undefined || emotion !== "calm";

  // Instance-unique SVG gradient ID.
  const reactId = useId();
  const heartGradId = `lumiv6-heart-${reactId.replace(/:/g, "")}`;

  // Below 64px, hide the CSS face overlay.
  const showFace = px >= 64;

  // ---------- Mouse-tracking eye offsets (interactive only) ----------
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!interactive || !showFace) return;
    const root = rootRef.current;
    if (!root) return;

    const handler = (e: MouseEvent) => {
      const rect = root.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const radius = Math.max(rect.width, 200) * 1.5;
      const dx = Math.max(-1, Math.min(1, (e.clientX - cx) / radius));
      const dy = Math.max(-1, Math.min(1, (e.clientY - cy) / radius));
      root.style.setProperty("--lumiv6-eye-x", `${dx * 12}%`);
      root.style.setProperty("--lumiv6-eye-y", `${dy * 12}%`);
    };

    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, [interactive, showFace]);

  // ---------- V7 emotion-morph transition window ----------
  // When emotion / colorMode / mouth / eye / posture changes, briefly hold a
  // `lumiv6--transitioning` class so CSS can run the 100ms eye-blink + 600ms
  // geometry morph (spec section 3). Skip on first render — no need to morph
  // into the initial state.
  const [isTransitioning, setIsTransitioning] = useState(false);
  const firstRenderRef = useRef(true);
  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    if (!animated) return;
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 600);
    return () => clearTimeout(timer);
  }, [emotion, colorMode, resolvedMouth, finalEye, resolvedPosture, animated]);

  const eyeMod = finalEye === "default" ? "" : `lumiv6__eye--${finalEye}`;
  const mouthMod = `lumiv6__mouth--${resolvedMouth}`;

  const wrapperStyle: CSSProperties & Record<`--${string}`, string> = {
    width: `${px}px`,
    height: `${px}px`,
    "--lumiv6-heart-period": `${heartPeriodMs}ms`,
  };

  return (
    <div
      ref={rootRef}
      className={[
        "lumiv6",
        `lumiv6--size-${size}`,
        `lumiv6--emotion-${emotion}`,
        `lumiv6--pose-${pose}`,
        `lumiv6--posture-${resolvedPosture}`,
        animated ? "lumiv6--animated" : "lumiv6--still",
        interactive ? "lumiv6--interactive" : "",
        hovered ? "lumiv6--hovered" : "",
        isTransitioning ? "lumiv6--transitioning" : "",
        className,
      ].filter(Boolean).join(" ")}
      style={wrapperStyle}
      role="img"
      aria-label={ariaLabel}
      data-testid={testId}
      data-emotion={emotion}
      data-pose={pose}
      data-color-mode={colorMode}
      data-size={size}
      data-animated={animated}
      data-interactive={interactive}
      data-mouth={resolvedMouth}
      data-eye={finalEye}
      data-posture={resolvedPosture}
      data-heart-hz={resolvedHeartHz}
      onMouseEnter={interactive ? () => setHovered(true) : undefined}
      onMouseLeave={interactive ? () => setHovered(false) : undefined}
    >
      {/* POSTURE wrapper — body img lives inside so posture transforms
          compose with the body's breathing keyframes without conflict. */}
      <div className="lumiv6__posture" aria-hidden="true">
        <img
          className="lumiv6__body"
          src={bodySrc}
          alt=""
          aria-hidden="true"
          draggable={false}
          onError={(e) => {
            const img = e.currentTarget;
            if (!img.src.endsWith(FALLBACK_PNG)) img.src = FALLBACK_PNG;
          }}
        />
      </div>

      {showFace && (
        <>
          {/* Soft face-pad — mutes the underlying PNG face until faceless
              v5 PNGs ship. Cream radial blur, never reads as a sticker. */}
          <div className="lumiv6__face-pad" aria-hidden="true" />

          {/* EYES layer (2 dots; pupils drift via CSS vars when interactive). */}
          <div className={`lumiv6__eye lumiv6__eye--left ${eyeMod}`} aria-hidden="true">
            <span className="lumiv6__pupil" />
          </div>
          <div className={`lumiv6__eye lumiv6__eye--right ${eyeMod}`} aria-hidden="true">
            <span className="lumiv6__pupil" />
          </div>

          {/* MOUTH layer (emotion-gated; calm with no override stays mouth-less). */}
          {showMouth && (
            <div className={`lumiv6__mouth ${mouthMod}`} aria-hidden="true" />
          )}

          {/* HEART layer — pulse period driven by --lumiv6-heart-period CSS var. */}
          <div className="lumiv6__heart" aria-hidden="true">
            <div className="lumiv6__heart-glow" />
            <svg
              className="lumiv6__heart-svg"
              viewBox="0 0 100 90"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
            >
              <defs>
                <radialGradient id={heartGradId} cx="35%" cy="30%" r="75%">
                  <stop offset="0%"   stopColor="#FFD27A" />
                  <stop offset="55%"  stopColor="#FFB347" />
                  <stop offset="100%" stopColor="#FF8C42" />
                </radialGradient>
              </defs>
              <path
                d="M50 86 C 22 64 4 44 4 24 C 4 11 14 2 26 2 C 36 2 45 9 50 19 C 55 9 64 2 74 2 C 86 2 96 11 96 24 C 96 44 78 64 50 86 Z"
                fill={`url(#${heartGradId})`}
              />
            </svg>
          </div>
        </>
      )}

      {/* Speech bubble — opt-in, sits above the avatar with a tail. */}
      {showMessage && (
        <div
          className="lumiv6__bubble"
          role="status"
          aria-live="polite"
          data-testid={`${testId}-bubble`}
        >
          <span className="lumiv6__bubble-text">{bubbleText}</span>
          <span className="lumiv6__bubble-tail" aria-hidden="true" />
        </div>
      )}
    </div>
  );
}
