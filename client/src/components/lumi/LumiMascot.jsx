/*
 * LumiMascot — renders the official MMHB Lumi character artwork.
 *
 * Previously this was a hand-built SVG approximation; it now uses the canonical
 * PNG provided by the brand owners. Component API is preserved so every existing
 * call site (Header, Home, DesignSystemV2 showcase, etc.) keeps working.
 *
 * Props:
 *   emotion       — one of VALID_EMOTIONS. Stored on data-emotion for future
 *                   per-emotion artwork swaps + CSS hooks. Currently every
 *                   emotion renders the canonical pose.
 *   size          — pixel width/height for the mascot box.
 *   trackCursor   — kept for API compatibility (no-op with the PNG body).
 *   interactive   — when true, click / Enter / Space triggers an onEmote pulse.
 *   onEmote       — callback invoked with "celebration" on activate.
 *   ariaLabel     — accessible label.
 *   className     — extra classes appended to the wrapper.
 */
import { useCallback, useState } from "react";
import lumiArtworkUrl from "@assets/mmhb_buddy_interactive_fullbody_1777438293296.png";
import "./LumiMascot.css";

const VALID_EMOTIONS = [
  "neutral", "listening", "empathy", "joy", "concern",
  "reflection", "celebration", "sleepy", "surprise", "comfort",
];

export default function LumiMascot({
  emotion = "neutral",
  size = 220,
  trackCursor: _trackCursor = true, // accepted for API compat; PNG body has no per-eye control
  interactive = true,
  onEmote,
  ariaLabel = "Lumi, your gentle companion",
  className = "",
}) {
  const safeEmotion = VALID_EMOTIONS.includes(emotion) ? emotion : "neutral";
  const [flash, setFlash] = useState(false);

  const handleClick = useCallback(() => {
    if (!interactive) return;
    setFlash(true);
    onEmote?.("celebration");
    window.setTimeout(() => setFlash(false), 700);
  }, [interactive, onEmote]);

  const handleKey = useCallback(
    (e) => {
      if (!interactive) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick();
      }
    },
    [interactive, handleClick]
  );

  // Compact instances (logo badges, ≤80px) get reduced motion amplitudes so
  // the breathing scale + float don't overflow tight container clip regions.
  const compact = size <= 80;

  return (
    <div
      className={`lumi-mascot lumi-mascot--png ${className}`.trim()}
      data-emotion={safeEmotion}
      data-flash={flash ? "true" : "false"}
      data-compact={compact ? "true" : "false"}
      style={{ width: size, height: size, "--lumi-size": `${size}px` }}
      role={interactive ? "button" : "img"}
      tabIndex={interactive ? 0 : -1}
      aria-label={ariaLabel}
      aria-pressed={interactive ? flash : undefined}
      onClick={handleClick}
      onKeyDown={handleKey}
      data-testid="lumi-mascot"
    >
      <img
        src={lumiArtworkUrl}
        alt=""
        aria-hidden="true"
        draggable="false"
        loading="lazy"
        decoding="async"
        width={size}
        height={size}
        className="lumi-mascot__img"
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
      <span className="lumi-mascot__heart-glow" aria-hidden="true" />
    </div>
  );
}

export { VALID_EMOTIONS };
