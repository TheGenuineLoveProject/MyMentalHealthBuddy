import { useState } from "react";
import { Smile, Frown, Meh, Sun, Cloud, CloudRain, Zap, Heart } from "lucide-react";

const MOOD_LEVELS = [
  { value: 1, label: "Very Low", icon: CloudRain, color: "from-slate-400 to-gray-500", emoji: "😢" },
  { value: 2, label: "Low", icon: Cloud, color: "from-blue-400 to-indigo-500", emoji: "😔" },
  { value: 3, label: "Slightly Low", icon: Cloud, color: "from-indigo-400 to-purple-500", emoji: "😕" },
  { value: 4, label: "Below Average", icon: Meh, color: "from-purple-400 to-violet-500", emoji: "😐" },
  { value: 5, label: "Neutral", icon: Meh, color: "from-amber-400 to-yellow-500", emoji: "😌" },
  { value: 6, label: "Above Average", icon: Smile, color: "from-lime-400 to-green-500", emoji: "🙂" },
  { value: 7, label: "Good", icon: Smile, color: "from-green-400 to-emerald-500", emoji: "😊" },
  { value: 8, label: "Very Good", icon: Sun, color: "from-emerald-400 to-teal-500", emoji: "😄" },
  { value: 9, label: "Great", icon: Zap, color: "from-teal-400 to-cyan-500", emoji: "🤩" },
  { value: 10, label: "Excellent", icon: Heart, color: "from-pink-400 to-rose-500", emoji: "🥰" },
];

export default function MoodMeter({ value = 5, onChange, size = "md", showLabels = true }) {
  const [hoverValue, setHoverValue] = useState(null);
  
  const displayValue = hoverValue || value;
  const currentMood = MOOD_LEVELS.find((m) => m.value === displayValue) || MOOD_LEVELS[4];
  const Icon = currentMood.icon;

  const sizeClasses = {
    sm: {
      container: "p-4",
      icon: "w-10 h-10",
      iconInner: "w-5 h-5",
      button: "w-6 h-6",
      text: "text-xs",
      label: "text-sm",
    },
    md: {
      container: "p-6",
      icon: "w-16 h-16",
      iconInner: "w-8 h-8",
      button: "w-8 h-8",
      text: "text-sm",
      label: "text-lg",
    },
    lg: {
      container: "p-8",
      icon: "w-24 h-24",
      iconInner: "w-12 h-12",
      button: "w-10 h-10",
      text: "text-base",
      label: "text-2xl",
    },
  };

  const sizes = sizeClasses[size];

  return (
    <div className={`${sizes.container} text-center`} data-testid="mood-meter">
      <div 
        className={`${sizes.icon} rounded-2xl bg-gradient-to-br ${currentMood.color} flex items-center justify-center mx-auto mb-4 shadow-lg transition-all duration-300`}
        aria-hidden="true"
      >
        <Icon className={`${sizes.iconInner} text-white`} />
      </div>

      {showLabels && (
        <div className="mb-4">
          <div className={`font-display font-bold text-[var(--text)] ${sizes.label}`}>
            {currentMood.emoji} {currentMood.label}
          </div>
          <div className={`text-[var(--text-muted)] ${sizes.text}`}>
            {displayValue}/10
          </div>
        </div>
      )}

      <div className="flex items-center justify-center gap-1">
        {MOOD_LEVELS.map((mood) => {
          const isSelected = value === mood.value;
          const isHovered = hoverValue === mood.value;
          
          return (
            <button
              key={mood.value}
              onMouseEnter={() => setHoverValue(mood.value)}
              onMouseLeave={() => setHoverValue(null)}
              onClick={() => onChange?.(mood.value)}
              className={`${sizes.button} rounded-full transition-all duration-200 flex items-center justify-center text-lg ${
                isSelected
                  ? `bg-gradient-to-br ${mood.color} shadow-md scale-125 z-10`
                  : isHovered
                  ? `bg-gradient-to-br ${mood.color} opacity-70 scale-110`
                  : "bg-[var(--surface)] hover:bg-[var(--surface-hover)]"
              }`}
              aria-label={`Rate mood as ${mood.label} (${mood.value}/10)`}
              data-testid={`mood-level-${mood.value}`}
            >
              {isSelected || isHovered ? (
                <span className="text-white text-xs font-bold">{mood.value}</span>
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="flex justify-between mt-2 px-1">
        <span className={`${sizes.text} text-[var(--text-muted)]`}>Low</span>
        <span className={`${sizes.text} text-[var(--text-muted)]`}>High</span>
      </div>
    </div>
  );
}
