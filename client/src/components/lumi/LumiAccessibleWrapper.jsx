import { useEffect, useId, useMemo, useRef, useState } from "react";
import { EMOTION_CONFIG } from "../../data/lumiEmotions";
import { LUMI_THEMES, DEFAULT_THEME } from "../../data/lumiThemes";
import { useReducedMotion } from "../a11y/ReducedMotionProvider";

/**
 * LumiAccessibleWrapper
 * ----------------------
 * Wraps any Lumi visual (typically an <img> or animated SVG) with the
 * accessibility scaffolding the mascot needs to be a good citizen of the
 * page:
 *
 *  - aria-live="polite" announcement region that re-reads every time the
 *    emotion changes (so screen-reader users hear "Lumi is celebrating",
 *    "Lumi is listening", etc. without the announcement interrupting).
 *  - role="img" + aria-label composed from the emotion config + theme name.
 *  - Optional keyboard focus (when `interactive`) with a visible focus ring
 *    that does NOT depend on the rest of the design system being loaded.
 *  - Honors the global ReducedMotionProvider — adds `.lumi-reduced-motion`
 *    locally as belt-and-suspenders so even unwrapped Lumis nest correctly.
 *
 * Children are expected to render the actual mascot image. The wrapper
 * never injects markup that would visually shift layout.
 *
 * Props:
 *   - emotion        (string)  required key into EMOTION_CONFIG
 *   - theme          (string)  optional theme id into LUMI_THEMES (default: 'sage')
 *   - alt            (string)  optional override for the aria-label
 *   - size           (number)  optional pixel size (drives wrapper box)
 *   - interactive    (bool)    if true: tabIndex=0, role=button, focus ring
 *   - onActivate     (fn)      called on Enter/Space/click when interactive
 *   - className      (string)  passthrough
 *   - children       (node)    the actual mascot image / SVG
 */
export function LumiAccessibleWrapper({
  emotion = "idle",
  theme: themeId = DEFAULT_THEME,
  alt,
  size,
  interactive = false,
  onActivate,
  className = "",
  children,
  ...rest
}) {
  const { prefersReducedMotion } = useReducedMotion();
  const liveRegionId = useId();
  const previousEmotionRef = useRef(emotion);
  const [announcement, setAnnouncement] = useState("");

  const emotionCfg = EMOTION_CONFIG[emotion] || EMOTION_CONFIG.idle;
  const theme = useMemo(
    () => LUMI_THEMES.find((t) => t.id === themeId) || LUMI_THEMES[0],
    [themeId]
  );

  // Compose the announcement: "Lumi is [state]. Your [color] mental health
  // companion." The label in EMOTION_CONFIG already starts with "Lumi is",
  // so we strip the "Lumi is " prefix when present to avoid duplication.
  const stateText = useMemo(() => {
    const raw = emotionCfg.label || `Lumi is ${emotion}`;
    return raw.replace(/^Lumi is\s+/i, "").trim();
  }, [emotionCfg.label, emotion]);

  const composedAriaLabel = useMemo(() => {
    if (alt) return alt;
    return `Lumi is ${stateText}. Your ${theme.name} mental health companion.`;
  }, [alt, stateText, theme.name]);

  // Only push to the live region when the emotion actually changes, so the
  // screen reader doesn't repeat itself on theme/size re-renders.
  useEffect(() => {
    if (previousEmotionRef.current === emotion) return;
    previousEmotionRef.current = emotion;
    // Briefly clear then set — some assistive tech debounces identical text.
    setAnnouncement("");
    const id = setTimeout(() => {
      setAnnouncement(`Lumi is ${stateText}.`);
    }, 50);
    return () => clearTimeout(id);
  }, [emotion, stateText]);

  const handleKeyDown = (e) => {
    if (!interactive || typeof onActivate !== "function") return;
    if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
      e.preventDefault();
      onActivate(e);
    }
  };

  const handleClick = (e) => {
    if (!interactive || typeof onActivate !== "function") return;
    onActivate(e);
  };

  const wrapperStyle = {
    display: "inline-block",
    position: "relative",
    lineHeight: 0,
    outline: "none",
    borderRadius: 16,
    transition: "box-shadow 160ms ease-out",
    ...(typeof size === "number" ? { width: size, height: size } : null),
  };

  const focusableProps = interactive
    ? {
        tabIndex: 0,
        role: "button",
        "aria-pressed": undefined,
        onKeyDown: handleKeyDown,
        onClick: handleClick,
        onFocus: (e) => {
          e.currentTarget.style.boxShadow =
            "0 0 0 3px var(--lumi-amber-400, #f0a830)";
        },
        onBlur: (e) => {
          e.currentTarget.style.boxShadow = "";
        },
      }
    : { role: "img" };

  return (
    <span
      className={[
        "lumi-a11y-wrapper",
        prefersReducedMotion ? "lumi-reduced-motion" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={wrapperStyle}
      aria-label={composedAriaLabel}
      data-lumi-emotion={emotion}
      data-lumi-theme={themeId}
      data-testid="lumi-a11y-wrapper"
      {...focusableProps}
      {...rest}
    >
      {children}
      <span
        id={liveRegionId}
        aria-live="polite"
        aria-atomic="true"
        // Visually hidden but readable by AT.
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0,0,0,0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        {announcement}
      </span>
    </span>
  );
}

export default LumiAccessibleWrapper;

// ── Verification checklist ─────────────────────────────────────────────
// [ ] Screen reader reads emotion state changes
// [ ] Tab focus shows visible focus ring
// [ ] prefers-reduced-motion disables animations
// [ ] No layout shift on image load
