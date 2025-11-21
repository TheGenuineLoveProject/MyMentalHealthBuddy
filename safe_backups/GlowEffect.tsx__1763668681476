/**
 * Glow Effect Component
 * 
 * Adds therapeutic glow effects to enhance visual hierarchy
 * and create calming ambient lighting
 */

import { useReducedMotion } from '@/design-system/microInteractions';
import { useMemo } from 'react';

/**
 * Deterministic Pseudo-Random Number Generator (PRNG)
 * Uses mulberry32 algorithm for SSR-safe random number generation
 */
function createSeededRandom(seed: number) {
  let state = seed;
  return function() {
    state = (state + 0x6D2B79F5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Create deterministic seed from string
 */
function createSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

interface GlowEffectProps {
  color?: 'serenity' | 'empowerment' | 'focus' | 'recovery' | 'custom';
  customColor?: string;
  intensity?: 'subtle' | 'moderate' | 'strong';
  pulse?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function GlowEffect({
  color = 'serenity',
  customColor,
  intensity = 'moderate',
  pulse = false,
  children,
  className = '',
}: GlowEffectProps) {
  const reducedMotion = useReducedMotion();

  // Therapeutic glow colors
  const glowColors = {
    serenity: 'rgba(14, 165, 233, 0.3)',
    empowerment: 'rgba(239, 107, 66, 0.3)',
    focus: 'rgba(64, 73, 87, 0.2)',
    recovery: 'rgba(169, 114, 206, 0.3)',
    custom: customColor || 'rgba(14, 165, 233, 0.3)',
  };

  // Intensity configurations
  const glowIntensity = {
    subtle: '8px',
    moderate: '16px',
    strong: '24px',
  };

  const glowStyle = {
    boxShadow: `0 0 ${glowIntensity[intensity]} ${glowColors[color]}, 
                0 0 ${parseInt(glowIntensity[intensity]) * 2}px ${glowColors[color]}`,
  };

  const pulseAnimation = pulse && !reducedMotion ? 'glow-pulse 3s ease-in-out infinite' : 'none';

  return (
    <div
      className={`relative ${className}`}
      style={{
        ...glowStyle,
        animation: pulseAnimation,
      }}
    >
      {children}
    </div>
  );
}

// Global styles injected once
if (typeof document !== 'undefined') {
  const styleId = 'glow-animations';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.innerHTML = `
      @keyframes glow-pulse {
        0%, 100% { filter: brightness(1); }
        50% { filter: brightness(1.15); }
      }
      @keyframes ambient-float {
        0%, 100% {
          transform: translate(-50%, -50%) scale(1);
          opacity: 0.6;
        }
        50% {
          transform: translate(-50%, -45%) scale(1.1);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

/**
 * Ambient Light Spots
 * Creates soft light spots for depth and atmosphere
 */
export function AmbientLightSpots({
  scene = 'serenity',
  count = 3,
}: {
  scene?: 'serenity' | 'empowerment' | 'focus' | 'recovery';
  count?: number;
}) {
  const reducedMotion = useReducedMotion();

  const lightColors = {
    serenity: 'hsla(199, 89%, 48%, 0.15)',
    empowerment: 'hsla(16, 90%, 58%, 0.15)',
    focus: 'hsla(215, 14%, 34%, 0.08)',
    recovery: 'hsla(271, 81%, 56%, 0.15)',
  };

  // Generate deterministic lights for SSR safety
  const lights = useMemo(() => {
    const seed = createSeed(`${scene}-lights-${count}`);
    const random = createSeededRandom(seed);
    
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      size: random() * 300 + 200, // 200-500px
      x: (100 / (count + 1)) * (i + 1),
      y: random() * 60 + 20, // 20-80%
      blur: random() * 100 + 100, // 100-200px
      duration: random() * 10 + 15, // 15-25s
      delay: random() * -10,
    }));
  }, [scene, count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {lights.map((light) => (
        <div
          key={light.id}
          className="absolute rounded-full"
          style={{
            width: `${light.size}px`,
            height: `${light.size}px`,
            left: `${light.x}%`,
            top: `${light.y}%`,
            background: `radial-gradient(circle, ${lightColors[scene]} 0%, transparent 70%)`,
            filter: `blur(${light.blur}px)`,
            transform: 'translate(-50%, -50%)',
            animation: reducedMotion
              ? 'none'
              : `ambient-float ${light.duration}s ease-in-out infinite`,
            animationDelay: `${light.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
