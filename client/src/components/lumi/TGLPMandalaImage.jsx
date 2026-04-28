/*
 * TGLPMandalaImage — Real PNG of the Genuine Love Project mandala emblem.
 *
 * Sibling to TGLPMandala.jsx (the SVG). Use this when you want the painted,
 * full-color sacred-geometry version (parent-brand splashes, footer credit
 * panels, social cards). For inline scaling at small sizes, prefer the SVG.
 */
import mandalaPng from "@assets/thegenuineloveproject_logo_v2_1777349686685.png";

export default function TGLPMandalaImage({
  size = 200,
  ariaLabel = "The Genuine Love Project",
  decorative = false,
  className = "",
  style = {},
  rounded = false,
}) {
  return (
    <img
      src={mandalaPng}
      width={size}
      height={size}
      alt={decorative ? "" : ariaLabel}
      role={decorative ? "presentation" : "img"}
      aria-hidden={decorative || undefined}
      className={`tglp-mandala-image ${className}`.trim()}
      data-testid="tglp-mandala-image"
      style={{
        display: "block",
        objectFit: "contain",
        userSelect: "none",
        borderRadius: rounded ? "var(--lumi-radius-lg, 16px)" : 0,
        ...style,
      }}
      draggable={false}
    />
  );
}
