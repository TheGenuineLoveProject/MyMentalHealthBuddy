import { useEffect, useMemo, useRef, useState } from "react";
import { useLumiBehavior } from "../../hooks/useLumiBehavior";
import { LumiAccessibleWrapper } from "./LumiAccessibleWrapper";
import { LumiCustomizerTrigger } from "./LumiCustomizerTrigger";
import { preloadImage } from "../../utils/preloadMascots";
import { TIME_STATES } from "../../data/lumiEmotions";
import { MASCOT_ASSETS } from "../../data/lumiAssets";

const SIZE_PX = { sm: 48, md: 160, lg: 320 };

const BANNER_GREETINGS = {
  morning: "Good morning. Lumi is here with you.",
  midday:  "Hello. Lumi is ready when you are.",
  evening: "Good evening. Time to unwind.",
  night:   "Rest well. Lumi is nearby.",
};

function currentTimeStateKey(now = new Date()) {
  const h = now.getHours();
  for (const [key, cfg] of Object.entries(TIME_STATES)) {
    const { hourStart, hourEnd } = cfg;
    if (hourStart < hourEnd) {
      if (h >= hourStart && h < hourEnd) return key;
    } else if (h >= hourStart || h < hourEnd) {
      return key;
    }
  }
  return "midday";
}

/**
 * LumiCompanion
 * --------------
 * The canonical Lumi mascot display surface. Owns:
 *   - emotion + theme via useLumiBehavior
 *   - PNG src resolution + preload (no layout shift)
 *   - animation class application
 *   - aria/keyboard via LumiAccessibleWrapper
 *   - optional theme-customizer affordance
 *
 * Props:
 *   - size            'sm' | 'md' | 'lg'   pixel preset (default 'md')
 *   - interactive     boolean              click handler + hover glow + focus ring
 *   - showCustomizer  boolean              renders the palette trigger beside Lumi
 *   - onClick         function             optional click handler when interactive
 *   - className       string               passthrough on the outer wrapper
 *   - lockImage          string   optional MASCOT_ASSETS key to pin the visible
 *                                 artwork (e.g. 'default' for the canonical sage
 *                                 hero). Pass undefined (the default) to use the
 *                                 time/emotion-driven variant from useLumiBehavior.
 *   - lockAnimationClass string   optional CSS class to pin the animation
 *                                 (e.g. 'lumi-breathe'). Overrides the
 *                                 behavior-driven class. Default: undefined =
 *                                 follow the emotion state machine.
 *   - ignoreThemeFilter  boolean  when true, the user's saved theme filter
 *                                 (hue-rotate, saturate, etc.) is NOT applied
 *                                 to the displayed image. Use for canonical
 *                                 marketing surfaces that must always show the
 *                                 brand-pure sage Lumi. Default false.
 *
 * Together, lockImage + lockAnimationClass + ignoreThemeFilter let a single
 * call site (e.g. the home hero) support intention "canonical sage, breathing"
 * regardless of clock hour, sleep state, saved theme, or emotion changes,
 * while every other consumer continues to use the full behavior pipeline.
 *
 * Works with or without auth — useLumiBehavior writes guest stats to
 * localStorage and reads them back on next mount.
 */
export function LumiCompanion({
  size = "md",
  interactive = false,
  showCustomizer = false,
  onClick,
  className = "",
  lockImage,
  lockAnimationClass,
  ignoreThemeFilter = false,
}) {
  const {
    behavior,
    emotion,
    theme,
    isSleeping,
    actions,
  } = useLumiBehavior();

  const px =
    typeof size === "number" && size > 0
      ? size
      : SIZE_PX[size] || SIZE_PX.md;
  // When `lockImage` is set, pin the displayed PNG to that MASCOT_ASSETS key
  // (e.g. 'default' for the canonical sage hero). The emotion state machine,
  // theme tinting, animation class, and banner greeting still operate from
  // useLumiBehavior — only the bitmap is overridden. Falls back to the
  // behavior-driven src when the key is unknown so a typo can't blank Lumi.
  const lockedSrc =
    lockImage && MASCOT_ASSETS[lockImage] ? MASCOT_ASSETS[lockImage] : null;
  const src = lockedSrc || behavior.getImageSrc(theme.imageVariant);

  // Visibility gate: when `lockImage` is set (canonical-lock surfaces like
  // the home hero), bypass the preload promise entirely and render at full
  // opacity from the first paint. The lock branch always points at a
  // bundled MASCOT_ASSETS bitmap, so there is no upside to gating its
  // render on a network round-trip — and a hung/403'd preload promise
  // would otherwise pin the hero invisible (the original bug).
  //
  // For non-locked surfaces we keep the soft fade-in for layout-shift
  // protection, but add a 1500ms watchdog so even a never-firing
  // onload/onerror (rare proxy/CSP edge) cannot strand opacity at 0.
  const lockBypass = Boolean(lockedSrc);
  const [imageReady, setImageReady] = useState(lockBypass);
  const [hovered, setHovered] = useState(false);
  const [timeKey, setTimeKey] = useState(() => currentTimeStateKey());
  const mountedRef = useRef(true);

  // Preload to avoid layout shift on first paint (skipped when locked).
  useEffect(() => {
    mountedRef.current = true;
    if (lockBypass) {
      setImageReady(true);
      return () => {
        mountedRef.current = false;
      };
    }
    setImageReady(false);
    const watchdog = setTimeout(() => {
      if (mountedRef.current) setImageReady(true);
    }, 1500);
    preloadImage(src)
      .then(() => {
        if (mountedRef.current) setImageReady(true);
      })
      .catch(() => {
        if (mountedRef.current) setImageReady(true); // still render, just no fade-in
      });
    return () => {
      mountedRef.current = false;
      clearTimeout(watchdog);
    };
  }, [src, lockBypass]);

  // Re-evaluate the time-of-day banner once a minute so a long-open tab
  // crosses morning→midday→evening→night boundaries without a reload.
  // Only relevant when a banner is actually shown (size md/lg), so we skip
  // the interval entirely otherwise to avoid wakeups.
  const wantsBanner = size === "md" || size === "lg";
  useEffect(() => {
    if (!wantsBanner) return undefined;
    const id = setInterval(() => {
      const next = currentTimeStateKey();
      setTimeKey((prev) => (prev === next ? prev : next));
    }, 60 * 1000);
    return () => clearInterval(id);
  }, [wantsBanner]);

  const bannerText = wantsBanner
    ? (BANNER_GREETINGS[timeKey] || BANNER_GREETINGS.midday)
    : null;

  const handleActivate = () => {
    if (!interactive) return;
    actions.setEmotion("celebrate");
    if (typeof onClick === "function") onClick();
  };

  // Compose CSS class string for the <img>: base mascot class + the active
  // animation + the theme color filter + the optional .animating marker.
  // When `lockAnimationClass` is provided, it replaces the behavior-driven
  // class (e.g. forcing 'lumi-breathe' on the marketing hero so a night-time
  // 'lumi-dim' / 'lumi-snooze' transition can't override it).
  const effectiveAnimationClass = lockAnimationClass || behavior.animationClass;
  const imageClassName = useMemo(() => {
    const classes = [
      "lumi-mascot",
      "lumi-mascot--png",
      effectiveAnimationClass,
      `lumi-theme-${theme.id}`,
    ];
    // Suppress the .animating marker when an external class is locked so we
    // don't accidentally promote a will-change layer for a static loop.
    if (behavior.isAnimating && !lockAnimationClass) classes.push("animating");
    return classes.filter(Boolean).join(" ");
  }, [effectiveAnimationClass, behavior.isAnimating, theme.id, lockAnimationClass]);

  const containerStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: showCustomizer ? 8 : 0,
  };

  // Reserve the image box BEFORE the PNG resolves so the surrounding layout
  // doesn't shift on first paint. Uses an aspect-ratio placeholder.
  const placeholderStyle = {
    width: px,
    height: px,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "transparent",
    transition: "opacity 220ms ease-out",
  };

  // Filter composition:
  //   - Normally: theme.filter + optional hover drop-shadow.
  //   - When ignoreThemeFilter: explicitly emit `none` (plus hover) so the
  //     inline style defeats the body-level `body.lumi-theme-X .lumi-mascot`
  //     CSS cascade. Without this, a saved non-sage theme would still
  //     hue-shift the locked artwork via the body class on a marketing hero.
  const hoverGlow = interactive && hovered
    ? " drop-shadow(0 0 12px var(--lumi-amber-400, #f0a830))"
    : "";
  // `filter: none` is a single-keyword value and cannot be chained with
  // filter functions like drop-shadow(). When ignoreThemeFilter is true and
  // there is no hover glow, emit the bare `none` keyword; once a hover glow
  // is added, omit the keyword and emit only the drop-shadow (which itself
  // implies "no theme tint" because nothing else is being applied).
  const composedFilter = ignoreThemeFilter
    ? (hoverGlow.trim() || "none")
    : ((theme.filter && theme.filter !== "none" ? theme.filter : "") + hoverGlow);

  const imgStyle = {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    opacity: imageReady ? 1 : 0,
    transform: "translateZ(0)",
    backfaceVisibility: "hidden",
    transition: "opacity 220ms ease-out, filter 220ms ease-out",
    filter: composedFilter,
  };

  // The mascot+customizer row ALWAYS uses containerStyle so its `gap`
  // (which separates the mascot from the customizer trigger) is preserved
  // in both layout modes. The outer wrapper only adds column-flex when a
  // banner is shown; otherwise it stays a transparent inline span so the
  // single-row layout is byte-identical to the pre-banner implementation.
  const outerWrapperStyle = bannerText
    ? {
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
      }
    : undefined;

  const mascotRowStyle = containerStyle;

  const bannerStyle = {
    fontFamily:
      "var(--font-display-lumi, var(--font-serif, 'Fraunces', Georgia, serif))",
    fontSize: size === "lg" ? "1.125rem" : "1rem",
    lineHeight: 1.4,
    color: "var(--lumi-sage-700, #2f5443)",
    textAlign: "center",
    margin: 0,
    padding: "0 8px",
    letterSpacing: "0.005em",
    maxWidth: 360,
  };

  return (
    <span className={className} style={outerWrapperStyle} data-testid="lumi-companion">
      {bannerText && (
        <span
          style={bannerStyle}
          data-testid="text-lumi-greeting"
          data-time-state={timeKey}
          aria-live="polite"
        >
          {bannerText}
        </span>
      )}
      <span style={mascotRowStyle}>
        <LumiAccessibleWrapper
          emotion={emotion}
          theme={theme.id}
          size={px}
          interactive={interactive}
          onActivate={handleActivate}
        >
          <span
            style={placeholderStyle}
            onMouseEnter={() => interactive && setHovered(true)}
            onMouseLeave={() => interactive && setHovered(false)}
            data-loading={!imageReady ? "true" : "false"}
          >
            <img
              src={src}
              alt=""
              aria-hidden="true"
              draggable={false}
              width={px}
              height={px}
              className={imageClassName}
              style={imgStyle}
              data-emotion={emotion}
              data-theme={theme.id}
              data-sleeping={isSleeping ? "true" : "false"}
              data-testid={`img-lumi-companion-${size}`}
              onLoad={() => setImageReady(true)}
            />
          </span>
        </LumiAccessibleWrapper>
        {showCustomizer && <LumiCustomizerTrigger />}
      </span>
    </span>
  );
}

export default LumiCompanion;

// Example usage:
// <LumiCompanion size="lg" interactive showCustomizer />
// <LumiCompanion size="sm" /> // for header avatar
