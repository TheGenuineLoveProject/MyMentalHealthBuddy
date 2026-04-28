/*
 * TGLPMandala — Sacred-geometry mandala with heart center for The Genuine
 * Love Project (parent brand). Pure SVG; sage + amber + terracotta palette.
 */
import { useId } from "react";

export default function TGLPMandala({
  size = 120,
  ariaLabel = "The Genuine Love Project",
  decorative = false,
  className = "",
}) {
  const cx = 100;
  const cy = 100;
  const uid = useId().replace(/:/g, "");
  const idBg = `tglp-bg-${uid}`;
  const idHeart = `tglp-heart-${uid}`;

  // Generate 12 outer-ring petals
  const petals = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * 360;
    return (
      <ellipse
        key={`p-${i}`}
        cx={cx}
        cy={cy - 70}
        rx="6"
        ry="22"
        fill="hsl(36, 90%, 56%)"
        opacity="0.85"
        transform={`rotate(${angle} ${cx} ${cy})`}
      />
    );
  });

  // 6 inner-ring petals (sage)
  const innerPetals = Array.from({ length: 6 }, (_, i) => {
    const angle = (i / 6) * 360 + 30;
    return (
      <path
        key={`ip-${i}`}
        d={`M ${cx} ${cy - 50} Q ${cx + 14} ${cy - 30} ${cx} ${cy - 8} Q ${cx - 14} ${cy - 30} ${cx} ${cy - 50} Z`}
        fill="hsl(150, 38%, 48%)"
        opacity="0.85"
        transform={`rotate(${angle} ${cx} ${cy})`}
      />
    );
  });

  // 8 small terracotta dots in middle ring
  const dots = Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * 2 * Math.PI;
    const r = 60;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    return <circle key={`d-${i}`} cx={x} cy={y} r="3" fill="hsl(14, 60%, 52%)" />;
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      role={decorative ? "presentation" : "img"}
      aria-label={decorative ? undefined : ariaLabel}
      aria-hidden={decorative}
      className={className}
      data-testid="tglp-mandala"
    >
      <defs>
        <radialGradient id={idBg} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(36, 80%, 96%)" />
          <stop offset="100%" stopColor="hsl(36, 60%, 88%)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={idHeart} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(14, 70%, 62%)" />
          <stop offset="100%" stopColor="hsl(14, 60%, 42%)" />
        </radialGradient>
      </defs>

      {/* Soft background glow */}
      <circle cx={cx} cy={cy} r="95" fill={`url(#${idBg})`} />

      {/* Outer geometric ring */}
      <circle cx={cx} cy={cy} r="92" fill="none" stroke="hsl(150, 30%, 38%)" strokeWidth="0.8" opacity="0.4" />
      <circle cx={cx} cy={cy} r="78" fill="none" stroke="hsl(36, 70%, 48%)"  strokeWidth="0.8" opacity="0.5" />

      {petals}
      {dots}
      {innerPetals}

      {/* Inner sacred ring */}
      <circle cx={cx} cy={cy} r="34" fill="hsl(36, 80%, 92%)" stroke="hsl(150, 30%, 38%)" strokeWidth="1" opacity="0.9" />

      {/* Heart center */}
      <path
        d={`M ${cx} ${cy + 8}
           C ${cx - 16} ${cy - 14} ${cx - 28} ${cy + 0} ${cx} ${cy + 22}
           C ${cx + 28} ${cy + 0} ${cx + 16} ${cy - 14} ${cx} ${cy + 8} Z`}
        fill={`url(#${idHeart})`}
        stroke="hsl(14, 50%, 32%)"
        strokeWidth="0.8"
      />
    </svg>
  );
}
