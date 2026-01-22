/**
 * ============================================================================
 * GLOWING CARD COMPONENT
 * ============================================================================
 * 
 * Soft glowing hover cards with healing visual effects.
 * Uses Dusty Rose, Deep Teal, and Sage Green for emotional resonance.
 * 
 * 🌸 Visual Energy: Hover bloom, soft glow, emotional depth
 * ============================================================================
 */

import "../styles/healing-animations.css";

export default function GlowingCard({
  children,
  variant = "sage",
  className = "",
  hover = true,
  glow = true,
  padding = "p-6",
  rounded = "rounded-2xl",
  onClick,
  testId,
}) {
  const variants = {
    sage: {
      background: 'rgba(143, 191, 159, 0.08)',
      border: 'rgba(143, 191, 159, 0.15)',
      glow: 'rgba(143, 191, 159, 0.25)',
      hoverBg: 'rgba(143, 191, 159, 0.12)',
    },
    rose: {
      background: 'rgba(244, 199, 195, 0.1)',
      border: 'rgba(244, 199, 195, 0.18)',
      glow: 'rgba(244, 199, 195, 0.3)',
      hoverBg: 'rgba(244, 199, 195, 0.15)',
    },
    teal: {
      background: 'rgba(47, 93, 93, 0.06)',
      border: 'rgba(47, 93, 93, 0.12)',
      glow: 'rgba(47, 93, 93, 0.2)',
      hoverBg: 'rgba(47, 93, 93, 0.1)',
    },
    gold: {
      background: 'rgba(234, 195, 59, 0.08)',
      border: 'rgba(234, 195, 59, 0.15)',
      glow: 'rgba(234, 195, 59, 0.3)',
      hoverBg: 'rgba(234, 195, 59, 0.12)',
    },
    white: {
      background: 'rgba(255, 255, 255, 0.7)',
      border: 'rgba(143, 191, 159, 0.1)',
      glow: 'rgba(143, 191, 159, 0.2)',
      hoverBg: 'rgba(255, 255, 255, 0.85)',
    },
    glass: {
      background: 'rgba(255, 255, 255, 0.5)',
      border: 'rgba(255, 255, 255, 0.3)',
      glow: 'rgba(143, 191, 159, 0.15)',
      hoverBg: 'rgba(255, 255, 255, 0.65)',
    },
  };

  const style = variants[variant] || variants.sage;

  return (
    <div
      className={`
        group relative transition-all duration-400 
        ${padding} ${rounded} ${className}
        ${hover ? 'cursor-pointer' : ''}
      `}
      style={{
        background: style.background,
        border: `1px solid ${style.border}`,
        backdropFilter: 'blur(8px)',
      }}
      onClick={onClick}
      data-testid={testId}
      data-component="GlowingCard"
      data-variant={variant}
    >
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Hover Background Transition */}
      {hover && (
        <div 
          className="absolute inset-0 rounded-inherit opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
          style={{ 
            background: style.hoverBg,
            borderRadius: 'inherit',
          }}
        />
      )}

      {/* Soft Glow Effect on Hover */}
      {glow && (
        <div 
          className="absolute inset-0 rounded-inherit opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ 
            boxShadow: `0 8px 40px ${style.glow}, 0 0 0 1px ${style.border}`,
            borderRadius: 'inherit',
          }}
        />
      )}

      {/* Subtle lift on hover */}
      <style>{`
        [data-component="GlowingCard"]:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}

export function GlowingCardGrid({ 
  children, 
  columns = 3, 
  gap = "gap-6",
  className = "",
}) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div 
      className={`grid ${gridCols[columns] || gridCols[3]} ${gap} ${className}`}
      data-component="GlowingCardGrid"
    >
      {children}
    </div>
  );
}
