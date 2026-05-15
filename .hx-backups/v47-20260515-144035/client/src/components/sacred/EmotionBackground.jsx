import { useState, useEffect, useMemo } from "react";

const EMOTION_GRADIENTS = {
  joy: {
    colors: ["#ffd700", "#ffb347", "#fff4cc"],
    direction: "135deg"
  },
  calm: {
    colors: ["#8fbf9f", "#a8d5ba", "#e8f5e9"],
    direction: "180deg"
  },
  sad: {
    colors: ["#6b8cae", "#8fa8c8", "#b8c9dc"],
    direction: "225deg"
  },
  anxious: {
    colors: ["#f4c7c3", "#e8b4b0", "#fce4e1"],
    direction: "90deg"
  },
  loved: {
    colors: ["#e8a5b3", "#f4c7d4", "#ffeef2"],
    direction: "45deg"
  },
  hopeful: {
    colors: ["#2f5d5d", "#4a7a7a", "#8fbf9f"],
    direction: "160deg"
  },
  grateful: {
    colors: ["#d4af37", "#e8c766", "#fff4cc"],
    direction: "120deg"
  },
  neutral: {
    colors: ["#f5f5f5", "#e8e8e8", "#ffffff"],
    direction: "180deg"
  }
};

export default function EmotionBackground({ 
  emotion = "neutral", 
  children,
  breathe = true,
  intensity = 0.3,
  className = ""
}) {
  const [currentGradient, setCurrentGradient] = useState(EMOTION_GRADIENTS.neutral);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const newGradient = EMOTION_GRADIENTS[emotion] || EMOTION_GRADIENTS.neutral;
    
    if (newGradient !== currentGradient) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setCurrentGradient(newGradient);
        setIsTransitioning(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [emotion, currentGradient]);

  const gradientStyle = useMemo(() => {
    const { colors, direction } = currentGradient;
    return {
      background: `linear-gradient(${direction}, ${colors[0]}${Math.round(intensity * 255).toString(16).padStart(2, '0')}, ${colors[1]}${Math.round(intensity * 0.7 * 255).toString(16).padStart(2, '0')}, ${colors[2]}${Math.round(intensity * 0.4 * 255).toString(16).padStart(2, '0')})`
    };
  }, [currentGradient, intensity]);

  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  return (
    <div 
      className={`fixed inset-0 -z-10 transition-all duration-1000 ${className}`}
      style={gradientStyle}
      aria-hidden="true"
      data-testid="emotion-background"
    >
      {breathe && !prefersReducedMotion && (
        <div 
          className="absolute inset-0 emotion-breathe"
          style={{
            background: `radial-gradient(ellipse at center, ${currentGradient.colors[0]}20 0%, transparent 70%)`
          }}
        />
      )}
      
      <style>{`
        @keyframes emotionBreathe {
          0%, 100% { 
            opacity: 0.3; 
            transform: scale(1);
          }
          50% { 
            opacity: 0.6; 
            transform: scale(1.05);
          }
        }
        .emotion-breathe {
          animation: emotionBreathe 8s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .emotion-breathe {
            animation: none;
          }
        }
      `}</style>
      
      {children}
    </div>
  );
}

export function useEmotionFromMood(moodValue) {
  if (moodValue >= 8) return "joy";
  if (moodValue >= 6) return "hopeful";
  if (moodValue >= 4) return "calm";
  if (moodValue >= 2) return "anxious";
  return "sad";
}

export { EMOTION_GRADIENTS };
