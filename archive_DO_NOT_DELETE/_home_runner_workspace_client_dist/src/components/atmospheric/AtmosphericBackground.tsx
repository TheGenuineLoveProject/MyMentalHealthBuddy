/**
 * Atmospheric Background Component
 * 
 * Creates immersive ambient visual scenes using therapeutic gradients,
 * subtle animations, and particle effects for emotional engagement
 * 
 * Based on environmental psychology principles:
 * - Blue-green gradients: Stress reduction (Küller et al. 2009)
 * - Gentle motion: Parasympathetic activation
 * - Depth perception: Spatial comfort (Gibson 1979)
 */

import { useReducedMotion } from '@/design-system/microInteractions';
import { foundational } from '@shared/design-system/tokens';
import { useMemo } from 'react';

/**
 * Deterministic Pseudo-Random Number Generator (PRNG)
 * Uses mulberry32 algorithm for SSR-safe random number generation
 * Same seed always produces same sequence (prevents hydration mismatch)
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
 * Converts scene/intensity strings to numeric seed
 */
function createSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

interface AtmosphericBackgroundProps {
  scene?: 'serenity' | 'empowerment' | 'focus' | 'recovery' | 'default';
  intensity?: 'subtle' | 'moderate' | 'immersive';
  showParticles?: boolean;
  className?: string;
}

export function AtmosphericBackground({
  scene = 'default',
  intensity = 'moderate',
  showParticles = true,
  className = '',
}: AtmosphericBackgroundProps) {
  const reducedMotion = useReducedMotion();

  // Therapeutic gradient configurations
  const gradients = {
    serenity: {
      from: 'hsl(205, 100%, 97%)',
      via: 'hsl(199, 89%, 95%)',
      to: 'hsl(142, 69%, 96%)',
      accent: 'hsla(199, 89%, 48%, 0.1)',
    },
    empowerment: {
      from: 'hsl(24, 100%, 97%)',
      via: 'hsl(16, 90%, 95%)',
      to: 'hsl(45, 93%, 95%)',
      accent: 'hsla(16, 90%, 58%, 0.1)',
    },
    focus: {
      from: 'hsl(210, 20%, 98%)',
      via: 'hsl(220, 14%, 96%)',
      to: 'hsl(216, 12%, 94%)',
      accent: 'hsla(215, 14%, 34%, 0.05)',
    },
    recovery: {
      from: 'hsl(270, 100%, 98%)',
      via: 'hsl(271, 81%, 95%)',
      to: 'hsl(199, 89%, 97%)',
      accent: 'hsla(271, 81%, 56%, 0.1)',
    },
    default: {
      from: 'hsl(210, 20%, 98%)',
      via: 'hsl(205, 100%, 97%)',
      to: 'hsl(220, 14%, 96%)',
      accent: 'hsla(199, 89%, 48%, 0.08)',
    },
  };

  const currentGradient = gradients[scene];
  
  // Animation configuration based on reduced motion preference
  const animationStyle = reducedMotion
    ? {}
    : {
        animation: 'breathe 8s ease-in-out infinite',
      };

  return (
    <div
      className={`fixed inset-0 -z-10 overflow-hidden ${className}`}
      aria-hidden="true"
      style={{ 
        contain: 'strict',
      }}
    >
      {/* Base gradient layer */}
      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          background: `linear-gradient(135deg, ${currentGradient.from} 0%, ${currentGradient.via} 50%, ${currentGradient.to} 100%)`,
          willChange: 'opacity',
        }}
      />

      {/* Animated accent gradient overlay */}
      {!reducedMotion && (
        <div
          className="absolute inset-0 opacity-70"
          style={{
            ...animationStyle,
            background: `radial-gradient(ellipse at top, ${currentGradient.accent} 0%, transparent 60%)`,
            willChange: 'transform, opacity',
          }}
        />
      )}

      {/* Floating particles */}
      {showParticles && !reducedMotion && (
        <ParticleField scene={scene} intensity={intensity} />
      )}

      {/* Subtle grain texture overlay for depth */}
      <div
        className="absolute inset-0 opacity-[0.015] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

    </div>
  );
}

// Global styles injected once (not on every render)
// CLS-optimized: GPU-accelerated transforms only, no layout-affecting properties
if (typeof document !== 'undefined') {
  const styleId = 'atmospheric-animations';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.innerHTML = `
      @keyframes breathe {
        0%, 100% { opacity: 0.7; transform: scale3d(1, 1, 1); }
        50% { opacity: 1; transform: scale3d(1.02, 1.02, 1); }
      }
      @keyframes float {
        0%, 100% { transform: translate3d(0, 0, 0) scale3d(1, 1, 1); }
        25% { transform: translate3d(10px, -20px, 0) scale3d(1.1, 1.1, 1); }
        50% { transform: translate3d(-10px, -40px, 0) scale3d(0.9, 0.9, 1); }
        75% { transform: translate3d(15px, -60px, 0) scale3d(1.05, 1.05, 1); }
      }
      @keyframes wave {
        0%, 100% { transform: translate3d(0, 0, 0) scaleX(1); }
        50% { transform: translate3d(-5%, 0, 0) scaleX(1.05); }
      }
    `;
    document.head.appendChild(style);
  }
}

/**
 * Particle Field Component
 * Creates ambient floating particles for depth and movement
 * Uses useMemo to prevent SSR hydration mismatch
 */
function ParticleField({
  scene,
  intensity,
}: {
  scene: string;
  intensity: string;
}) {
  // Determine particle count based on intensity
  const particleCount = {
    subtle: 8,
    moderate: 15,
    immersive: 25,
  }[intensity] || 15;

  // Generate deterministic particles for SSR safety
  const particles = useMemo(() => {
    const seed = createSeed(`${scene}-${intensity}-particles`);
    const random = createSeededRandom(seed);
    
    return Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      size: random() * 4 + 2, // 2-6px
      x: random() * 100,
      y: random() * 100,
      duration: random() * 20 + 15, // 15-35s
      delay: random() * -20, // Stagger start times
      opacity: random() * 0.3 + 0.1, // 0.1-0.4
    }));
  }, [scene, intensity, particleCount]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-br from-white/40 to-white/10 blur-sm"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            opacity: particle.opacity,
            animation: `float ${particle.duration}s ease-in-out infinite`,
            animationDelay: `${particle.delay}s`,
            willChange: 'transform',
          }}
        />
      ))}
    </div>
  );
}

/**
 * Decorative Wave Element
 * Adds subtle organic shapes for visual interest
 */
export function DecorativeWave({
  position = 'top',
  scene = 'serenity',
  className = '',
}: {
  position?: 'top' | 'bottom';
  scene?: 'serenity' | 'empowerment' | 'focus' | 'recovery';
  className?: string;
}) {
  const reducedMotion = useReducedMotion();

  const colors = {
    serenity: 'hsla(199, 89%, 48%, 0.08)',
    empowerment: 'hsla(16, 90%, 58%, 0.08)',
    focus: 'hsla(215, 14%, 34%, 0.05)',
    recovery: 'hsla(271, 81%, 56%, 0.08)',
  };

  const animationStyle = reducedMotion
    ? {}
    : {
        animation: 'wave 12s ease-in-out infinite',
      };

  return (
    <div
      className={`absolute ${
        position === 'top' ? 'top-0' : 'bottom-0'
      } left-0 right-0 h-32 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
      style={{ contain: 'layout' }}
    >
      <svg
        className="absolute w-full h-full"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        style={{
          ...animationStyle,
          transform: position === 'bottom' ? 'scaleY(-1)' : 'none',
          willChange: 'transform',
        }}
      >
        <path
          fill={colors[scene]}
          d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
      </svg>
    </div>
  );
}
