/*
 * LumiMascotImage — compatibility wrapper for static Lumi placements.
 *
 * Production artwork is rendered exclusively through the canonical
 * OfficialLumi registry. The legacy component API remains intact so
 * authentication and other existing callers do not need simultaneous
 * layout refactors.
 */
import { OfficialLumi } from "@/lumi-registry";

export default function LumiMascotImage({
  size = 280,
  animation = "float",
  ariaLabel = "Lumi, your gentle companion",
  decorative = false,
  className = "",
  style = {},
  onClick,
}) {
  const animClass =
    animation === "float" ? "lumi-anim-float" :
    animation === "breathe" ? "lumi-anim-breathe" :
    "";

  const clickable = typeof onClick === "function";

  function handleKeyDown(event) {
    if (!clickable) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick(event);
    }
  }

  return (
    <div
      role={clickable ? "button" : decorative ? undefined : "img"}
      tabIndex={clickable ? 0 : undefined}
      aria-label={clickable || !decorative ? ariaLabel : undefined}
      aria-hidden={!clickable && decorative ? true : undefined}
      onClick={onClick}
      onKeyDown={clickable ? handleKeyDown : undefined}
      className={`lumi-mascot-image ${animClass} ${className}`.trim()}
      data-testid="lumi-mascot-image"
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
        cursor: clickable ? "pointer" : "default",
        background: "transparent",
        ...style,
      }}
    >
      <OfficialLumi
        variant="LUMI_CALM_FLOAT"
        scene="compat-mascot-image"
        position="hero"
        widthPx={size}
        decorative
        motion="none"
        data-testid="lumi-mascot-image-asset"
      />
    </div>
  );
}
