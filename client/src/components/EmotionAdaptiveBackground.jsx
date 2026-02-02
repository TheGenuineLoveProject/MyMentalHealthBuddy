import { useMemo } from "react";

const MOOD_GRADIENTS = {
  happy: {
    gradient: "linear-gradient(135deg, rgba(255, 223, 186, 0.3) 0%, rgba(255, 182, 193, 0.2) 50%, rgba(255, 250, 240, 0.3) 100%)",
    glow: "rgba(255, 200, 150, 0.15)"
  },
  great: {
    gradient: "linear-gradient(135deg, rgba(255, 223, 186, 0.3) 0%, rgba(255, 182, 193, 0.2) 50%, rgba(255, 250, 240, 0.3) 100%)",
    glow: "rgba(255, 200, 150, 0.15)"
  },
  grateful: {
    gradient: "linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(255, 215, 0, 0.1) 50%, rgba(255, 250, 240, 0.2) 100%)",
    glow: "rgba(212, 175, 55, 0.1)"
  },
  calm: {
    gradient: "linear-gradient(135deg, rgba(143, 191, 159, 0.2) 0%, rgba(255, 255, 255, 0.3) 50%, rgba(240, 248, 245, 0.3) 100%)",
    glow: "rgba(143, 191, 159, 0.15)"
  },
  hopeful: {
    gradient: "linear-gradient(135deg, rgba(47, 93, 93, 0.15) 0%, rgba(143, 191, 159, 0.1) 50%, rgba(240, 255, 250, 0.2) 100%)",
    glow: "rgba(47, 93, 93, 0.1)"
  },
  neutral: {
    gradient: "linear-gradient(135deg, rgba(240, 240, 240, 0.5) 0%, rgba(250, 250, 250, 0.3) 100%)",
    glow: "transparent"
  },
  okay: {
    gradient: "linear-gradient(135deg, rgba(240, 240, 240, 0.5) 0%, rgba(250, 250, 250, 0.3) 100%)",
    glow: "transparent"
  },
  good: {
    gradient: "linear-gradient(135deg, rgba(200, 230, 200, 0.3) 0%, rgba(240, 250, 240, 0.3) 100%)",
    glow: "rgba(143, 191, 159, 0.1)"
  },
  anxious: {
    gradient: "linear-gradient(135deg, rgba(180, 140, 140, 0.15) 0%, rgba(255, 245, 245, 0.2) 50%, rgba(255, 250, 250, 0.3) 100%)",
    glow: "rgba(180, 140, 140, 0.1)"
  },
  sad: {
    gradient: "linear-gradient(135deg, rgba(147, 165, 180, 0.2) 0%, rgba(200, 220, 240, 0.15) 50%, rgba(240, 248, 255, 0.3) 100%)",
    glow: "rgba(147, 165, 180, 0.15)"
  },
  low: {
    gradient: "linear-gradient(135deg, rgba(180, 180, 190, 0.2) 0%, rgba(220, 225, 235, 0.15) 100%)",
    glow: "rgba(147, 165, 180, 0.1)"
  },
  struggling: {
    gradient: "linear-gradient(135deg, rgba(190, 170, 170, 0.2) 0%, rgba(230, 220, 220, 0.15) 100%)",
    glow: "rgba(180, 150, 150, 0.1)"
  },
  angry: {
    gradient: "linear-gradient(135deg, rgba(190, 120, 120, 0.15) 0%, rgba(255, 240, 240, 0.2) 50%, rgba(255, 250, 250, 0.25) 100%)",
    glow: "rgba(190, 120, 120, 0.1)"
  },
  default: {
    gradient: "linear-gradient(135deg, rgba(250, 248, 244, 0.8) 0%, rgba(255, 255, 255, 0.5) 100%)",
    glow: "transparent"
  }
};

export default function EmotionAdaptiveBackground({ 
  mood = "default", 
  children, 
  className = "",
  intensity = "medium"
}) {
  const moodStyle = useMemo(() => {
    const normalizedMood = mood?.toLowerCase() || "default";
    const moodConfig = MOOD_GRADIENTS[normalizedMood] || MOOD_GRADIENTS.default;
    
    const opacityMultiplier = intensity === "light" ? 0.5 : intensity === "strong" ? 1.5 : 1;
    
    return {
      background: moodConfig.gradient,
      "--mood-glow": moodConfig.glow
    };
  }, [mood, intensity]);

  return (
    <div 
      className={`relative transition-all duration-700 ease-in-out ${className}`}
      style={moodStyle}
      data-mood={mood?.toLowerCase() || "default"}
      data-testid="emotion-adaptive-background"
    >
      <div 
        className="absolute inset-0 pointer-events-none motion-reduce:hidden"
        style={{
          background: `radial-gradient(ellipse at 30% 20%, var(--mood-glow) 0%, transparent 50%),
                       radial-gradient(ellipse at 70% 80%, var(--mood-glow) 0%, transparent 50%)`,
          animation: "gentleFloat 8s ease-in-out infinite"
        }}
        aria-hidden="true"
      />
      <div className="relative z-10">
        {children}
      </div>
      <style>{`
        @keyframes gentleFloat {
          0%, 100% { opacity: 0.8; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
}

export function LotusDivider({ className = "" }) {
  return (
    <div 
      className={`flex items-center justify-center py-6 ${className}`}
      data-testid="lotus-divider"
      role="separator"
    >
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--glp-gold)]/30 to-transparent" aria-hidden="true" />
      <div 
        className="mx-4 relative"
        style={{
          filter: "drop-shadow(0 0 8px rgba(212, 175, 55, 0.4))"
        }}
      >
        <svg 
          width="32" 
          height="32" 
          viewBox="0 0 64 64" 
          className="text-[var(--glp-gold)]"
          aria-hidden="true"
        >
          <g fill="currentColor" opacity="0.8">
            <ellipse cx="32" cy="48" rx="8" ry="12" transform="rotate(0 32 32)" />
            <ellipse cx="32" cy="48" rx="8" ry="12" transform="rotate(30 32 32)" opacity="0.9" />
            <ellipse cx="32" cy="48" rx="8" ry="12" transform="rotate(60 32 32)" opacity="0.8" />
            <ellipse cx="32" cy="48" rx="8" ry="12" transform="rotate(90 32 32)" opacity="0.7" />
            <ellipse cx="32" cy="48" rx="8" ry="12" transform="rotate(120 32 32)" opacity="0.8" />
            <ellipse cx="32" cy="48" rx="8" ry="12" transform="rotate(150 32 32)" opacity="0.9" />
            <circle cx="32" cy="32" r="6" opacity="1" />
          </g>
        </svg>
      </div>
      <div className="flex-1 h-px bg-gradient-to-r from-[var(--glp-gold)]/30 via-transparent to-transparent" aria-hidden="true" />
    </div>
  );
}

export function SacredGlow({ 
  children, 
  color = "gold", 
  intensity = "medium",
  className = "" 
}) {
  const glowColors = {
    gold: "rgba(212, 175, 55, 0.3)",
    sage: "rgba(143, 191, 159, 0.3)",
    teal: "rgba(47, 93, 93, 0.3)",
    rose: "rgba(180, 140, 140, 0.3)"
  };

  const glowIntensity = {
    light: "0 0 15px",
    medium: "0 0 25px",
    strong: "0 0 40px"
  };

  return (
    <div 
      className={`relative ${className}`}
      style={{
        filter: `drop-shadow(${glowIntensity[intensity]} ${glowColors[color]})`
      }}
      data-testid="sacred-glow"
    >
      {children}
    </div>
  );
}
