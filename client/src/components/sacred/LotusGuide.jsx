import { useState, useEffect, useMemo, useCallback, useRef, useId } from "react";
import { Volume2, VolumeX } from "lucide-react";

const VOICE_AFFIRMATIONS = [
  "You are worthy of love and healing.",
  "Take a deep breath. You are safe in this moment.",
  "Your feelings are valid. Honor them gently.",
  "Each step forward is progress, no matter how small.",
  "You are stronger than you know.",
  "Peace begins within. Let it flow through you.",
  "You deserve compassion, especially from yourself."
];

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

const TRIGGER_MESSAGES = {
  "low-mood": [
    "I notice you're going through something difficult. This feeling is temporary.",
    "Even in darkness, healing continues. You are not alone.",
    "Difficult moments are part of the journey. Would you like a grounding exercise?"
  ],
  "streak-7": [
    "🌱 One week of showing up for yourself! You've earned the 7-Day badge.",
    "Seven days of dedication. Your consistency is beautiful."
  ],
  "streak-30": [
    "🌸 A full month of healing practice! You're truly dedicated to your growth.",
    "Thirty days of self-love. What an incredible achievement."
  ],
  "mood-improvement": [
    "Beautiful! Your spirit is shining today. What's bringing you joy?",
    "I see the light in you growing stronger. Keep nurturing it."
  ],
  "first-entry": [
    "✨ Your healing journey has begun. Welcome, brave soul.",
    "Every journey starts with a single step. You've taken yours."
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

const GLOW_STYLES = {
  default: "0 0 30px rgba(143, 191, 159, 0.4)",
  golden: "0 0 40px rgba(212, 175, 55, 0.6), 0 0 80px rgba(255, 215, 0, 0.3)",
  "soft-rose": "0 0 30px rgba(244, 199, 195, 0.5)",
  "sage-pulse": "0 0 35px rgba(143, 191, 159, 0.6)",
  "golden-pulse": "0 0 50px rgba(212, 175, 55, 0.7), 0 0 100px rgba(255, 215, 0, 0.4)"
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
  trigger = null,
  glowStyle = "default",
  floating = false,
  position = "bottom-right",
  enableVoice = true,
  onTriggerAction,
  onClick,
  className = ""
}) {
  const [message, setMessage] = useState("");
  const [isBlossoming, setIsBlossoming] = useState(false);
  const [currentGlow, setCurrentGlow] = useState(glowStyle);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(enableVoice);
  const speechRef = useRef(null);
  const gradientId = useId();

  const timeOfDay = useMemo(() => getTimeOfDay(), []);
  const petalColor = MOOD_COLORS[mood] || MOOD_COLORS.neutral;

  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const speakAffirmation = useCallback((text) => {
    if (!voiceEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text || VOICE_AFFIRMATIONS[Math.floor(Math.random() * VOICE_AFFIRMATIONS.length)]);
    utterance.rate = 0.85;
    utterance.pitch = 1.0;
    utterance.volume = 0.8;
    
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Victoria'));
    if (preferredVoice) utterance.voice = preferredVoice;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [voiceEnabled]);

  useEffect(() => {
    let triggerTimer = null;
    
    if (trigger && TRIGGER_MESSAGES[trigger]) {
      const triggerMsgs = TRIGGER_MESSAGES[trigger];
      const selectedMessage = triggerMsgs[Math.floor(Math.random() * triggerMsgs.length)];
      setMessage(selectedMessage);
      
      if (trigger === "streak-7" || trigger === "streak-30" || trigger === "mood-improvement") {
        setCurrentGlow("golden-pulse");
        setIsBlossoming(true);
        triggerTimer = setTimeout(() => {
          setIsBlossoming(false);
          setCurrentGlow(glowStyle);
        }, 3000);
      } else if (trigger === "low-mood") {
        setCurrentGlow("soft-rose");
      }
    } else {
      const messages = LOTUS_MESSAGES[timeOfDay];
      setMessage(messages[Math.floor(Math.random() * messages.length)]);
    }
    
    return () => {
      if (triggerTimer) clearTimeout(triggerTimer);
    };
  }, [trigger, timeOfDay, glowStyle]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleClick = useCallback(() => {
    setIsBlossoming(true);
    setTimeout(() => setIsBlossoming(false), 1000);
    
    if (voiceEnabled) {
      speakAffirmation(message);
    }
    
    if (trigger && onTriggerAction) {
      onTriggerAction(trigger);
    }
    if (onClick) onClick();
  }, [trigger, onTriggerAction, onClick, voiceEnabled, speakAffirmation, message]);

  const toggleVoice = useCallback((e) => {
    e.stopPropagation();
    if (isSpeaking && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    setVoiceEnabled(prev => !prev);
  }, [isSpeaking]);

  const positionClasses = {
    "bottom-right": "fixed bottom-6 right-6",
    "bottom-left": "fixed bottom-6 left-6",
    "top-right": "fixed top-24 right-6",
    "top-left": "fixed top-24 left-6"
  };

  const floatingClass = floating ? positionClasses[position] : '';
  const shouldAnimate = animate && !prefersReducedMotion;

  return (
    <div 
      className={`flex flex-col items-center gap-4 z-50 ${floatingClass} ${floating ? 'lotus-float' : ''} ${className}`}
      role="complementary"
      aria-label="Lotus wellness guide"
      data-testid="lotus-guide-container"
    >
      <div className="relative">
        <button
          onClick={handleClick}
          className={`relative transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#d4af37] rounded-full ${isBlossoming ? 'scale-110' : ''} ${isSpeaking ? 'speaking-glow' : ''}`}
          style={{ 
            width: size, 
            height: size,
            filter: `drop-shadow(${GLOW_STYLES[currentGlow] || GLOW_STYLES.default})`
          }}
          aria-label="Click lotus for wellness guidance"
          data-testid="button-lotus-guide"
        >
          <svg
            viewBox="0 0 100 100"
            className={`w-full h-full ${shouldAnimate ? 'lotus-breathe' : ''}`}
            aria-hidden="true"
          >
            <defs>
              <radialGradient id={`lotusGlow-${gradientId}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={petalColor} stopOpacity="0.8" />
                <stop offset="100%" stopColor={petalColor} stopOpacity="0" />
              </radialGradient>
              <linearGradient id={`goldShine-${gradientId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d4af37" />
                <stop offset="50%" stopColor="#ffd700" />
                <stop offset="100%" stopColor="#d4af37" />
              </linearGradient>
            </defs>

            <circle cx="50" cy="50" r="45" fill={`url(#lotusGlow-${gradientId})`} className="opacity-30" />

            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <ellipse
                key={angle}
                cx="50"
                cy="50"
                rx="12"
                ry="28"
                fill={petalColor}
                fillOpacity={0.7 - i * 0.03}
                stroke={`url(#goldShine-${gradientId})`}
                strokeWidth="0.5"
                transform={`rotate(${angle} 50 50) translate(0, -10)`}
                className={shouldAnimate ? 'lotus-petal' : ''}
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
              fill={`url(#goldShine-${gradientId})`}
              className={shouldAnimate ? 'lotus-center-glow' : ''}
            />
            <circle cx="50" cy="50" r="6" fill="#ffd700" fillOpacity="0.8" />
          </svg>
        </button>

        {enableVoice && (
          <button
            onClick={toggleVoice}
            className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-card/90 border border-border/50 shadow-md transition-all hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]"
            aria-label={voiceEnabled ? "Disable voice affirmations" : "Enable voice affirmations"}
            data-testid="button-toggle-voice"
          >
            {voiceEnabled ? (
              <Volume2 className={`w-4 h-4 ${isSpeaking ? 'text-[#d4af37]' : 'text-muted-foreground'}`} />
            ) : (
              <VolumeX className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        )}
      </div>

      {showMessage && message && (
        <div 
          className={`text-center max-w-xs px-4 ${floating ? 'bg-card/90 backdrop-blur-sm rounded-xl p-3 border border-border/50 shadow-lg' : ''}`}
          role="status"
          aria-live="polite"
        >
          <p className="text-sm md:text-base italic text-muted-foreground font-serif">
            "{message}"
          </p>
        </div>
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
        @keyframes lotusFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes speakingPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(212, 175, 55, 0.4); }
          50% { box-shadow: 0 0 40px rgba(212, 175, 55, 0.8); }
        }
        .lotus-breathe { animation: lotusBreathe 4s ease-in-out infinite; }
        .lotus-petal { animation: petalSway 3s ease-in-out infinite; }
        .lotus-center-glow { animation: centerGlow 2s ease-in-out infinite; }
        .lotus-float { animation: lotusFloat 6s ease-in-out infinite; }
        .speaking-glow { animation: speakingPulse 1.5s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .lotus-breathe, .lotus-petal, .lotus-center-glow, .lotus-float, .speaking-glow {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

export { LOTUS_MESSAGES, TRIGGER_MESSAGES, MOOD_COLORS, VOICE_AFFIRMATIONS };
