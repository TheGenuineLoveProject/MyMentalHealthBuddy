/**
 * LumiV6 — "Living Lumi" multi-layer avatar (Section 1 of v6.0 upgrade).
 *
 * Composes four independent layers:
 *   1. BODY  — base PNG (color/pose-driven, with onError fallback)
 *   2. EYES  — CSS dot eyes (blink loop; mouse-tracking when interactive)
 *   3. MOUTH — emotion-driven shape (no mouth on calm — Hello Kitty rule)
 *   4. HEART — warm amber chest pulse (inline SVG via viewBox so geometry
 *              stays crisp at every size token)
 *
 * Standalone — does NOT replace BuddyAvatar. Renders on its own
 * `.lumiv6-*` class namespace so it cannot collide with the existing
 * `.buddy*` system. Scoped CSS in LumiV6.css.
 *
 * Crisis safety: animations gated by the `animated` prop AND the
 * `prefers-reduced-motion` media query (handled in LumiV6.css). Pass
 * `animated={false}` for any crisis-adjacent surface.
 *
 * Asset note: spec referenced `lumi-v5-*.png` but v5 PNGs aren't in the
 * repo yet — this component reads `lumi-v4-*.png` as the body layer
 * (full-body, color-tinted). When v5 lands, swap the constants below.
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
// Trauma-informed, non-clinical, supportive. Caller can override via `message`.
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

export default function LumiV6({
  colorMode = "default",
  emotion = "calm",
  pose = "default",
  size = "lg",
  interactive = true,
  animated = true,
  showMessage = false,
  message,
  className = "",
  "data-testid": testId = "lumi-v6",
}: LumiV6Props) {
  const px = SIZE_PX[size] ?? SIZE_PX.lg;
  const bodySrc = POSE_PNG[pose] || COLOR_PNG[colorMode] || FALLBACK_PNG;
  const ariaLabel = EMOTION_ARIA[emotion];
  const bubbleText = message ?? EMOTION_MESSAGE[emotion];

  // Instance-unique SVG gradient ID. Using React useId() (sanitized for SVG
  // selector safety) avoids cross-instance paint collisions when multiple
  // LumiV6 share the same testId — see architect review notes.
  const reactId = useId();
  const heartGradId = `lumiv6-heart-${reactId.replace(/:/g, "")}`;

  // Below 64px, hide the CSS face overlay — kawaii dots/mouth/heart would
  // become sub-pixel smudges. The PNG body still renders cleanly.
  const showFace = px >= 64;

  // ---------- Mouse-tracking eye offsets (interactive only) ----------
  // Stored as CSS vars on the root element so the CSS handles transform.
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
      // Normalize to ±1 within a reasonable radius (~3× avatar size).
      const radius = Math.max(rect.width, 200) * 1.5;
      const dx = Math.max(-1, Math.min(1, (e.clientX - cx) / radius));
      const dy = Math.max(-1, Math.min(1, (e.clientY - cy) / radius));
      // Max ~12% pupil drift inside the eye dot.
      root.style.setProperty("--lumiv6-eye-x", `${dx * 12}%`);
      root.style.setProperty("--lumiv6-eye-y", `${dy * 12}%`);
    };

    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, [interactive, showFace]);

  // Sleepy → closed eyes (a soft line instead of dots). Surprise → wider.
  const eyeMod =
    emotion === "sleepy" ? "lumiv6__eye--closed" :
    emotion === "surprise" ? "lumiv6__eye--wide" : "";

  // Mouth shape per emotion. Calm has NO mouth (Hello Kitty rule).
  const showMouth = emotion !== "calm";
  const mouthMod = `lumiv6__mouth--${emotion}`;

  const wrapperStyle: CSSProperties = {
    width: `${px}px`,
    height: `${px}px`,
  };

  return (
    <div
      ref={rootRef}
      className={[
        "lumiv6",
        `lumiv6--size-${size}`,
        `lumiv6--emotion-${emotion}`,
        `lumiv6--pose-${pose}`,
        animated ? "lumiv6--animated" : "lumiv6--still",
        interactive ? "lumiv6--interactive" : "",
        hovered ? "lumiv6--hovered" : "",
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
      onMouseEnter={interactive ? () => setHovered(true) : undefined}
      onMouseLeave={interactive ? () => setHovered(false) : undefined}
    >
      {/* BODY layer (PNG) */}
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

          {/* MOUTH layer (emotion-gated; no mouth on calm). */}
          {showMouth && (
            <div className={`lumiv6__mouth ${mouthMod}`} aria-hidden="true" />
          )}

          {/* HEART layer (inline SVG so geometry scales crisp at every size). */}
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
