/*
 * TGLPMandala — renders the official Genuine Love Project sacred-geometry
 * mandala artwork (with heart center and "THE GENUINE / LOVE PROJECT" lockup).
 *
 * Now uses the canonical PNG provided by the brand owners. Component API is
 * preserved so existing call sites continue to work.
 */
import mandalaUrl from "@assets/thegenuineloveproject_logo_v2_1777438293296.png";

export default function TGLPMandala({
  size = 120,
  ariaLabel = "The Genuine Love Project",
  decorative = false,
  className = "",
}) {
  return (
    <img
      src={mandalaUrl}
      alt={decorative ? "" : ariaLabel}
      aria-hidden={decorative ? true : undefined}
      role={decorative ? "presentation" : "img"}
      draggable="false"
      loading="lazy"
      decoding="async"
      width={size}
      height={size}
      className={className}
      style={{
        width: size,
        height: size,
        objectFit: "contain",
        display: "block",
      }}
      data-testid="tglp-mandala"
    />
  );
}
