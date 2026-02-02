import { useEffect, useState, useCallback } from "react";
import { useEmotion } from "@/context/EmotionContext";
import { Heart, Sparkles, Wind, Leaf, Sun, Moon, Star, Cloud, Flame, Waves } from "lucide-react";

const EMOTION_ICONS = {
  joy: Sun,
  calm: Waves,
  sad: Cloud,
  anxious: Wind,
  loved: Heart,
  hopeful: Star,
  grateful: Sparkles,
  neutral: Leaf,
  angry: Flame,
  peaceful: Moon,
  excited: Sparkles,
  tired: Moon
};

const BREATHING_PATTERNS = {
  calm: { inhale: 4, hold: 4, exhale: 4, rest: 4 },
  anxious: { inhale: 4, hold: 7, exhale: 8, rest: 2 },
  sad: { inhale: 5, hold: 3, exhale: 6, rest: 2 },
  angry: { inhale: 4, hold: 4, exhale: 8, rest: 4 },
  default: { inhale: 4, hold: 4, exhale: 4, rest: 2 }
};

export default function MoodResponder({ 
  className = "",
  showBreathing = true,
  showRecommendation = true,
  showAffirmation = true,
  compact = false
}) {
  const { currentEmotion, getAffirmation, getPractices, getColor, emotionIntensity } = useEmotion();
  const [affirmation, setAffirmation] = useState("");
  const [practices, setPractices] = useState([]);
  const [breathPhase, setBreathPhase] = useState("rest");
  const [isBreathing, setIsBreathing] = useState(false);

  const Icon = EMOTION_ICONS[currentEmotion] || Leaf;
  const color = getColor();

  useEffect(() => {
    setAffirmation(getAffirmation());
    setPractices(getPractices());
  }, [currentEmotion, getAffirmation, getPractices]);

  const refreshAffirmation = useCallback(() => {
    setAffirmation(getAffirmation());
  }, [getAffirmation]);

  useEffect(() => {
    if (!isBreathing) return;

    const pattern = BREATHING_PATTERNS[currentEmotion] || BREATHING_PATTERNS.default;
    const phases = [
      { name: "inhale", duration: pattern.inhale * 1000 },
      { name: "hold", duration: pattern.hold * 1000 },
      { name: "exhale", duration: pattern.exhale * 1000 },
      { name: "rest", duration: pattern.rest * 1000 }
    ];

    let phaseIndex = 0;
    let timeout;

    const runPhase = () => {
      setBreathPhase(phases[phaseIndex].name);
      timeout = setTimeout(() => {
        phaseIndex = (phaseIndex + 1) % phases.length;
        runPhase();
      }, phases[phaseIndex].duration);
    };

    runPhase();

    return () => clearTimeout(timeout);
  }, [isBreathing, currentEmotion]);

  const getBreathScale = () => {
    switch (breathPhase) {
      case "inhale": return "scale-125";
      case "hold": return "scale-125";
      case "exhale": return "scale-100";
      case "rest": return "scale-100";
      default: return "scale-100";
    }
  };

  const getBreathInstruction = () => {
    switch (breathPhase) {
      case "inhale": return "Breathe in...";
      case "hold": return "Hold...";
      case "exhale": return "Breathe out...";
      case "rest": return "Rest...";
      default: return "";
    }
  };

  if (compact) {
    return (
      <div 
        className={`flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r ${className}`}
        style={{ 
          background: `linear-gradient(135deg, ${color}15, ${color}05)`,
          borderColor: `${color}30`
        }}
        data-testid="mood-responder-compact"
      >
        <div 
          className="p-2 rounded-full animate-pulse"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <p className="text-sm text-muted-foreground flex-1 italic">
          "{affirmation}"
        </p>
        <button
          onClick={refreshAffirmation}
          className="p-1.5 rounded-full hover:bg-white/50 transition-colors"
          aria-label="Get new affirmation"
          data-testid="button-refresh-affirmation"
        >
          <Sparkles className="w-4 h-4 text-[#d4af37]" />
        </button>
      </div>
    );
  }

  return (
    <div 
      className={`rounded-2xl border p-6 space-y-6 ${className}`}
      style={{ 
        background: `linear-gradient(135deg, ${color}10, transparent)`,
        borderColor: `${color}30`
      }}
      data-testid="mood-responder"
    >
      <div className="flex items-center gap-4">
        <div 
          className={`relative p-4 rounded-full transition-all duration-1000 ease-in-out ${isBreathing ? getBreathScale() : ''}`}
          style={{ 
            backgroundColor: `${color}20`,
            boxShadow: `0 0 ${emotionIntensity * 30}px ${color}40`
          }}
        >
          <Icon 
            className="w-8 h-8 transition-transform" 
            style={{ color }}
            aria-hidden="true"
          />
          {isBreathing && (
            <div 
              className="absolute inset-0 rounded-full animate-ping opacity-30"
              style={{ backgroundColor: color }}
            />
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-serif font-semibold capitalize text-foreground">
            Feeling {currentEmotion}
          </h3>
          <p className="text-sm text-muted-foreground">
            Intensity: {Math.round(emotionIntensity * 100)}%
          </p>
        </div>
      </div>

      {showAffirmation && (
        <div 
          className="p-4 rounded-xl bg-white/50 dark:bg-black/20 border"
          style={{ borderColor: `${color}20` }}
          data-testid="card-affirmation"
        >
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 mt-0.5 text-[#d4af37] flex-shrink-0" />
            <div className="flex-1">
              <p className="font-serif italic text-foreground">
                "{affirmation}"
              </p>
              <button
                onClick={refreshAffirmation}
                className="mt-2 text-xs text-muted-foreground hover:text-foreground transition-colors underline"
                data-testid="button-new-affirmation"
              >
                Get another affirmation
              </button>
            </div>
          </div>
        </div>
      )}

      {showBreathing && (
        <div className="space-y-3" data-testid="section-breathing">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-foreground">Breathing Exercise</h4>
            <button
              onClick={() => setIsBreathing(!isBreathing)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                isBreathing 
                  ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                  : 'bg-[#8fbf9f]/20 text-[#2f5d5d] hover:bg-[#8fbf9f]/30'
              }`}
              data-testid="button-toggle-breathing"
            >
              {isBreathing ? 'Stop' : 'Start'}
            </button>
          </div>
          {isBreathing && (
            <div className="text-center py-4">
              <p className="text-lg font-serif text-foreground animate-pulse">
                {getBreathInstruction()}
              </p>
            </div>
          )}
        </div>
      )}

      {showRecommendation && practices.length > 0 && (
        <div className="space-y-3" data-testid="section-recommendations">
          <h4 className="text-sm font-medium text-foreground">Recommended Practices</h4>
          <div className="grid gap-2">
            {practices.map((practice, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 p-3 rounded-lg bg-white/30 dark:bg-black/10 hover:bg-white/50 dark:hover:bg-black/20 transition-colors cursor-pointer"
                data-testid={`card-practice-${index}`}
              >
                <Leaf className="w-4 h-4 text-[#8fbf9f]" />
                <span className="text-sm text-foreground">{practice}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .animate-pulse, .animate-ping {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
