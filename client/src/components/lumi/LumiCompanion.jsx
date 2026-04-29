import { useEffect, useMemo, useRef, useState } from "react";
import { useLumiBehavior } from "../../hooks/useLumiBehavior";
import { LumiAccessibleWrapper } from "./LumiAccessibleWrapper";
import { LumiCustomizerTrigger } from "./LumiCustomizerTrigger";
import { preloadImage } from "../../utils/preloadMascots";

const SIZE_PX = { sm: 48, md: 160, lg: 320 };

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
  const src = behavior.getImageSrc(theme.imageVariant);

  const [imageReady, setImageReady] = useState(false);
  const [hovered, setHovered] = useState(false);
  const mountedRef = useRef(true);

  // Preload to avoid layout shift on first paint.
  useEffect(() => {
    mountedRef.current = true;
    setImageReady(false);
    preloadImage(src)
      .then(() => {
        if (mountedRef.current) setImageReady(true);
      })
      .catch(() => {
        if (mountedRef.current) setImageReady(true); // still render, just no fade-in
      });
    return () => {
      mountedRef.current = false;
    };
  }, [src]);

  const handleActivate = () => {
    if (!interactive) return;
    actions.setEmotion("celebrate");
    if (typeof onClick === "function") onClick();
  };

  // Compose CSS class string for the <img>: base mascot class + the active
  // animation + the theme color filter + the optional .animating marker.
  const imageClassName = useMemo(() => {
    const classes = [
      "lumi-mascot",
      "lumi-mascot--png",
      behavior.animationClass,
      `lumi-theme-${theme.id}`,
    ];
    if (behavior.isAnimating) classes.push("animating");
    return classes.filter(Boolean).join(" ");
  }, [behavior.animationClass, behavior.isAnimating, theme.id]);

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

  const imgStyle = {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    opacity: imageReady ? 1 : 0,
    transform: "translateZ(0)",
    backfaceVisibility: "hidden",
    transition: "opacity 220ms ease-out, filter 220ms ease-out",
    filter:
      (theme.filter && theme.filter !== "none" ? theme.filter : "") +
      (interactive && hovered ? " drop-shadow(0 0 12px var(--lumi-amber-400, #f0a830))" : ""),
  };

  return (
    <span className={className} style={containerStyle} data-testid="lumi-companion">
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
  );
}

export default LumiCompanion;

// Example usage:
// <LumiCompanion size="lg" interactive showCustomizer />
// <LumiCompanion size="sm" /> // for header avatar
