/*
 * LumiMascotImage — Full-color PNG of Lumi (the real illustrated mascot).
 *
 * This is the *static art* counterpart to LumiMascot.jsx. Use this when you
 * want the rich, painted look of the full-body Lumi (e.g. hero headers,
 * marketing sections, /landing-v2 splash, social cards). For interactive
 * cases that need cursor-tracking eyes, blinking, or per-emotion morphs,
 * keep using <LumiMascot/> instead.
 *
 * Animations:
 *   - .lumi-anim-float   slow vertical drift
 *   - .lumi-anim-breathe gentle scale pulse
 * Both honor prefers-reduced-motion (defined in lumi-motion.css).
 */
import lumiFullBodyPng from "@assets/mmhb_buddy_interactive_fullbody_1777349769990.png";

export default function LumiMascotImage({
  size = 280,
  animation = "float",            // "float" | "breathe" | "none"
  ariaLabel = "Lumi, your gentle companion",
  decorative = false,
  className = "",
  style = {},
  onClick,
}) {
  const animClass =
    animation === "float"   ? "lumi-anim-float"   :
    animation === "breathe" ? "lumi-anim-breathe" :
    "";
  const clickable = typeof onClick === "function";

  return (
    <img
      src={lumiFullBodyPng}
      width={size}
      height={size}
      alt={decorative ? "" : ariaLabel}
      role={decorative ? "presentation" : "img"}
      aria-hidden={decorative || undefined}
      onClick={onClick}
      className={`lumi-mascot-image ${animClass} ${className}`.trim()}
      data-testid="lumi-mascot-image"
      style={{
        display: "block",
        userSelect: "none",
        cursor: clickable ? "pointer" : "default",
        // PNG itself has no background; let it sit on whatever surface it's on.
        background: "transparent",
        objectFit: "contain",
        ...style,
      }}
      draggable={false}
    />
  );
}
