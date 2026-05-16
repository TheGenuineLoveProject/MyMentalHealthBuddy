import { useEffect, useState, useId } from "react";

export default function ProgressRing({ 
  progress = 0, 
  size = 120, 
  strokeWidth = 8,
  color = "from-purple-400 to-indigo-500",
  bgColor = "var(--surface)",
  showLabel = true,
  label = "",
  sublabel = "",
  glowColor = "rgba(143, 191, 159, 0.4)",
  animated = true,
  children
}) {
  const [displayProgress, setDisplayProgress] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (displayProgress / 100) * circumference;
  const stableId = useId();
  const gradientId = `progress-gradient-${stableId}`;

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setDisplayProgress(Math.min(100, Math.max(0, progress)));
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setDisplayProgress(progress);
    }
  }, [progress, animated]);

  return (
    <div 
      className="relative inline-flex items-center justify-center" 
      data-testid="progress-ring"
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label || `Progress: ${Math.round(progress)}%`}
      style={{ filter: `drop-shadow(0 0 8px ${glowColor})` }}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
          className="opacity-20"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: getGradientColor(color, 'from') }} />
            <stop offset="100%" style={{ stopColor: getGradientColor(color, 'to') }} />
          </linearGradient>
        </defs>
      </svg>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children || (
          <>
            <span className="text-2xl font-bold text-foreground font-serif">
              {Math.round(progress)}%
            </span>
            {showLabel && label && (
              <span className="text-xs text-muted-foreground mt-1">{label}</span>
            )}
            {sublabel && (
              <span className="text-xs text-muted-foreground">{sublabel}</span>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export function HealingProgressRing({ 
  moodAverage = 0, 
  totalEntries = 0,
  streakDays = 0,
  size = 140,
  className = ""
}) {
  const progress = Math.min(100, (moodAverage / 10) * 100);
  
  const getColor = () => {
    if (moodAverage >= 7) return "from-[#8fbf9f] to-[#5a8a6e]";
    if (moodAverage >= 5) return "from-[#d4af37] to-[#b8962f]";
    if (moodAverage >= 3) return "from-[#e8b4a0] to-[#d4a090]";
    return "from-[#f4c7c3] to-[#e0b0ac]";
  };

  const getGlowColor = () => {
    if (moodAverage >= 7) return "rgba(143, 191, 159, 0.5)";
    if (moodAverage >= 5) return "rgba(212, 175, 55, 0.5)";
    return "rgba(244, 199, 195, 0.5)";
  };

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`} data-testid="healing-progress-ring">
      <ProgressRing
        progress={progress}
        size={size}
        strokeWidth={10}
        color={getColor()}
        glowColor={getGlowColor()}
      >
        <span className="font-serif text-2xl font-semibold text-foreground">
          {moodAverage > 0 ? moodAverage.toFixed(1) : "—"}
        </span>
        <span className="text-xs text-muted-foreground">avg mood</span>
      </ProgressRing>
      
      <div className="flex gap-6 text-center">
        <div>
          <div className="font-serif text-xl font-semibold text-foreground">
            {totalEntries}
          </div>
          <div className="text-xs text-muted-foreground">entries</div>
        </div>
        
        <div className="w-px bg-border" />
        
        <div>
          <div className="font-serif text-xl font-semibold text-foreground flex items-center justify-center gap-1">
            {streakDays}
            {streakDays >= 7 && <span>🔥</span>}
          </div>
          <div className="text-xs text-muted-foreground">day streak</div>
        </div>
      </div>
    </div>
  );
}

export function MilestoneRing({
  milestone,
  achieved = false,
  className = ""
}) {
  const milestones = {
    "7-days": { icon: "🌱", label: "7 Days", description: "First week complete" },
    "30-days": { icon: "🌸", label: "30 Days", description: "One month of growth" },
    "100-entries": { icon: "📖", label: "100 Entries", description: "Dedicated journaler" },
    "calm-week": { icon: "🌕", label: "Calm Week", description: "7 days of peace" },
    "joy-streak": { icon: "☀️", label: "Joy Streak", description: "Consistent positivity" },
    "first-entry": { icon: "✨", label: "First Entry", description: "Journey begun" }
  };
  
  const config = milestones[milestone] || { icon: "🏆", label: milestone, description: "" };

  return (
    <div 
      className={`relative inline-flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${className}`}
      data-testid={`milestone-${milestone}`}
      title={config.description}
      style={{
        background: achieved 
          ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(143, 191, 159, 0.1))'
          : 'transparent'
      }}
    >
      <div 
        className={`
          w-14 h-14 rounded-full flex items-center justify-center text-2xl
          transition-all duration-300
          ${achieved 
            ? 'shadow-lg' 
            : 'opacity-40 grayscale'
          }
        `}
        style={{
          background: achieved 
            ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(143, 191, 159, 0.15))'
            : 'rgba(0,0,0,0.05)',
          boxShadow: achieved 
            ? '0 0 20px rgba(212, 175, 55, 0.3), inset 0 1px 2px rgba(255,255,255,0.3)' 
            : 'none'
        }}
      >
        {config.icon}
      </div>
      <span className={`text-xs font-medium text-center ${achieved ? 'text-foreground' : 'text-muted-foreground'}`}>
        {config.label}
      </span>
    </div>
  );
}

export function MilestoneGrid({ milestones = [], className = "" }) {
  return (
    <div className={`grid grid-cols-3 sm:grid-cols-6 gap-2 ${className}`} data-testid="milestone-grid">
      {milestones.map((m) => (
        <MilestoneRing key={m.id} milestone={m.id} achieved={m.achieved} />
      ))}
    </div>
  );
}

function getGradientColor(colorClass, position) {
  if (colorClass.startsWith('from-[') || colorClass.startsWith('to-[')) {
    const match = position === 'from' 
      ? colorClass.match(/from-\[([^\]]+)\]/)
      : colorClass.match(/to-\[([^\]]+)\]/);
    if (match) return match[1];
  }

  const colorMap = {
    'from-purple-400': '#a78bfa',
    'to-indigo-500': '#6366f1',
    'from-pink-400': '#f472b6',
    'to-rose-500': '#f43f5e',
    'from-emerald-400': '#34d399',
    'to-teal-500': '#14b8a6',
    'from-amber-400': '#fbbf24',
    'to-orange-500': '#f97316',
    'from-cyan-400': '#22d3ee',
    'to-blue-500': '#3b82f6',
    'from-[#8fbf9f]': '#8fbf9f',
    'to-[#5a8a6e]': '#5a8a6e',
    'from-[#d4af37]': '#d4af37',
    'to-[#b8962f]': '#b8962f',
  };

  const parts = colorClass.split(' ');
  const target = position === 'from' 
    ? parts.find(p => p.startsWith('from-'))
    : parts.find(p => p.startsWith('to-'));
  
  return colorMap[target] || (position === 'from' ? '#8fbf9f' : '#5a8a6e');
}
