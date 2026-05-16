/**
 * ============================================================================
 * SACRED PATTERN - Animated SVG Background Overlay
 * ============================================================================
 * 
 * A fixed, animated sacred geometry pattern that pulses gently
 * behind the main content for a healing visual atmosphere.
 * 
 * 🌀 Visual Energy: Divine geometry, pulsing symmetry, subtle presence
 * ============================================================================
 */

import { useEffect, useState } from "react";
import "../styles/healing-animations.css";

export default function SacredPattern({
  opacity = 0.08,
  color = "rgba(143, 191, 159, 0.15)",
  size = "80vmin",
  animated = true,
  variant = "flowerOfLife",
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const patterns = {
    flowerOfLife: (
      <g>
        {/* Central circle */}
        <circle cx="50" cy="50" r="15" />
        {/* First ring - 6 circles */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => {
          const x = 50 + 15 * Math.cos((angle * Math.PI) / 180);
          const y = 50 + 15 * Math.sin((angle * Math.PI) / 180);
          return <circle key={`ring1-${i}`} cx={x} cy={y} r="15" />;
        })}
        {/* Outer containing circle */}
        <circle cx="50" cy="50" r="32" />
      </g>
    ),
    triangle: (
      <g>
        <circle cx="50" cy="50" r="30" />
        <circle cx="50" cy="50" r="20" />
        <circle cx="50" cy="50" r="10" />
        <polygon points="50,20 80,70 20,70" />
      </g>
    ),
    metatron: (
      <g>
        <circle cx="50" cy="50" r="8" />
        {[0, 60, 120, 180, 240, 300].map((angle, i) => {
          const x = 50 + 25 * Math.cos((angle * Math.PI) / 180);
          const y = 50 + 25 * Math.sin((angle * Math.PI) / 180);
          return (
            <g key={`meta-${i}`}>
              <circle cx={x} cy={y} r="8" />
              <line x1="50" y1="50" x2={x} y2={y} />
            </g>
          );
        })}
        <circle cx="50" cy="50" r="35" />
      </g>
    ),
    vesicaPiscis: (
      <g>
        <circle cx="40" cy="50" r="20" />
        <circle cx="60" cy="50" r="20" />
        <circle cx="50" cy="50" r="30" opacity="0.5" />
      </g>
    ),
  };

  return (
    <div 
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ 
        zIndex: -1,
        opacity: mounted ? opacity : 0,
        transition: 'opacity 2s ease-out',
      }}
      aria-hidden="true"
      data-component="SacredPattern"
      data-variant={variant}
    >
      {/* Animated SVG */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        style={{
          position: 'absolute',
          width: size,
          height: size,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fill: 'none',
          stroke: color,
          strokeWidth: '0.5',
          animation: animated ? 'breathingAura 6s ease-in-out infinite' : 'none',
        }}
      >
        {patterns[variant] || patterns.flowerOfLife}
      </svg>

      {/* Secondary pattern - offset */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        style={{
          position: 'absolute',
          width: `calc(${size} * 1.5)`,
          height: `calc(${size} * 1.5)`,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) rotate(30deg)',
          fill: 'none',
          stroke: color,
          strokeWidth: '0.3',
          opacity: 0.5,
          animation: animated ? 'breathingAura 8s ease-in-out infinite reverse' : 'none',
        }}
      >
        {patterns[variant] || patterns.flowerOfLife}
      </svg>
    </div>
  );
}
