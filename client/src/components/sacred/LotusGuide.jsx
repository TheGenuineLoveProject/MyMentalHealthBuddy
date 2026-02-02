import { useState, useEffect, useMemo } from "react";

const LOTUS_MESSAGES = {
  morning: [
    "Good morning, beautiful soul. Today is a fresh beginning.",
    "The dawn brings new possibilities. Breathe them in.",
    "You woke up today. That alone is a gift."
  ],
  afternoon: [
    "Pause and honor how far you've come today.",
    "Your presence matters. Take a gentle breath.",
    "Midday light reminds us to keep growing."
  ],
  evening: [
    "As the day softens, so can you.",
    "Rest is not a reward—it is a right.",
    "You did enough today. You are enough."
  ],
  night: [
    "The stars witness your healing journey.",
    "Let go of what no longer serves you tonight.",
    "Sleep is sacred medicine for the soul."
  ]
};

const MOOD_COLORS = {
  calm: "#8fbf9f",
  anxious: "#f4c7c3",
  happy: "#ffd700",
  sad: "#6b8cae",
  neutral: "#9ca3af",
  hopeful: "#2f5d5d",
  grateful: "#d4af37"
};

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

export default function LotusGuide({ 
  mood = "neutral", 
  size = 120,
  showMessage = true,
  animate = true,
  onClick,
  className = ""
}) {
  const [message, setMessage] = useState("");
  const [isBlossoming, setIsBlossoming] = useState(false);

  const timeOfDay = useMemo(() => getTimeOfDay(), []);
  const petalColor = MOOD_COLORS[mood] || MOOD_COLORS.neutral;

  useEffect(() => {
    const messages = LOTUS_MESSAGES[timeOfDay];
    setMessage(messages[Math.floor(Math.random() * messages.length)]);
  }, [timeOfDay]);

  const handleClick = () => {
    setIsBlossoming(true);
    setTimeout(() => setIsBlossoming(false), 1000);
    if (onClick) onClick();
  };

  return (
    <div 
      className={`flex flex-col items-center gap-4 ${className}`}
      role="complementary"
      aria-label="Lotus wellness guide"
    >
      <button
        onClick={handleClick}
        className={`relative transition-transform duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#d4af37] rounded-full ${isBlossoming ? 'scale-110' : ''}`}
        style={{ width: size, height: size }}
        aria-label="Click lotus for wellness guidance"
        data-testid="button-lotus-guide"
      >
        <svg
          viewBox="0 0 100 100"
          className={`w-full h-full ${animate ? 'lotus-breathe' : ''}`}
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="lotusGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={petalColor} stopOpacity="0.8" />
              <stop offset="100%" stopColor={petalColor} stopOpacity="0" />
            </radialGradient>
            <linearGradient id="goldShine" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d4af37" />
              <stop offset="50%" stopColor="#ffd700" />
              <stop offset="100%" stopColor="#d4af37" />
            </linearGradient>
          </defs>

          <circle cx="50" cy="50" r="45" fill="url(#lotusGlow)" className="opacity-30" />

          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <ellipse
              key={angle}
              cx="50"
              cy="50"
              rx="12"
              ry="28"
              fill={petalColor}
              fillOpacity={0.7 - i * 0.03}
              stroke="url(#goldShine)"
              strokeWidth="0.5"
              transform={`rotate(${angle} 50 50) translate(0, -10)`}
              className={animate ? 'lotus-petal' : ''}
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}

          {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle, i) => (
            <ellipse
              key={angle}
              cx="50"
              cy="50"
              rx="8"
              ry="20"
              fill={petalColor}
              fillOpacity={0.5}
              transform={`rotate(${angle} 50 50) translate(0, -5)`}
            />
          ))}

          <circle 
            cx="50" 
            cy="50" 
            r="10" 
            fill="url(#goldShine)"
            className={animate ? 'lotus-center-glow' : ''}
          />
          <circle cx="50" cy="50" r="6" fill="#ffd700" fillOpacity="0.8" />
        </svg>
      </button>

      {showMessage && message && (
        <p 
          className="text-center text-sm md:text-base max-w-xs px-4 italic text-muted-foreground font-serif"
          role="status"
          aria-live="polite"
        >
          "{message}"
        </p>
      )}

      <style>{`
        @keyframes lotusBreathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes petalSway {
          0%, 100% { transform: rotate(var(--base-rotation)) translateY(-10px); }
          50% { transform: rotate(calc(var(--base-rotation) + 2deg)) translateY(-12px); }
        }
        @keyframes centerGlow {
          0%, 100% { filter: drop-shadow(0 0 5px #ffd700); }
          50% { filter: drop-shadow(0 0 15px #ffd700); }
        }
        .lotus-breathe { animation: lotusBreathe 4s ease-in-out infinite; }
        .lotus-petal { animation: petalSway 3s ease-in-out infinite; }
        .lotus-center-glow { animation: centerGlow 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
