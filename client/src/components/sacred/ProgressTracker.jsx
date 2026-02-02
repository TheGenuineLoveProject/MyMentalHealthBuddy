import { useState, useEffect, useMemo } from "react";
import { Flame, Star, Award, Trophy, Heart, Sparkles } from "lucide-react";

const MILESTONE_CONFIG = [
  { days: 7, icon: Flame, label: "7-Day Spark", color: "#ff6b35", glow: "rgba(255, 107, 53, 0.5)" },
  { days: 14, icon: Star, label: "14-Day Star", color: "#ffd700", glow: "rgba(255, 215, 0, 0.5)" },
  { days: 30, icon: Award, label: "30-Day Champion", color: "#8fbf9f", glow: "rgba(143, 191, 159, 0.5)" },
  { days: 60, icon: Trophy, label: "60-Day Master", color: "#d4af37", glow: "rgba(212, 175, 55, 0.5)" },
  { days: 100, icon: Heart, label: "100-Day Healer", color: "#e8a5b3", glow: "rgba(232, 165, 179, 0.5)" }
];

export default function ProgressTracker({ 
  streakDays = 0, 
  totalEntries = 0,
  onMilestoneReached,
  showFloatingBadge = true,
  className = ""
}) {
  const [celebratingMilestone, setCelebratingMilestone] = useState(null);
  const [shownMilestones, setShownMilestones] = useState(new Set());

  const currentMilestone = useMemo(() => {
    return MILESTONE_CONFIG.filter(m => streakDays >= m.days).pop() || null;
  }, [streakDays]);

  const nextMilestone = useMemo(() => {
    return MILESTONE_CONFIG.find(m => streakDays < m.days) || null;
  }, [streakDays]);

  const progressToNext = useMemo(() => {
    if (!nextMilestone) return 100;
    const prevDays = currentMilestone?.days || 0;
    return Math.round(((streakDays - prevDays) / (nextMilestone.days - prevDays)) * 100);
  }, [streakDays, currentMilestone, nextMilestone]);

  useEffect(() => {
    const newlyReached = MILESTONE_CONFIG.find(
      m => streakDays === m.days && !shownMilestones.has(m.days)
    );
    
    if (newlyReached) {
      setCelebratingMilestone(newlyReached);
      setShownMilestones(prev => new Set([...prev, newlyReached.days]));
      onMilestoneReached?.(newlyReached);
      
      const timer = setTimeout(() => setCelebratingMilestone(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [streakDays, shownMilestones, onMilestoneReached]);

  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  return (
    <div className={`relative ${className}`} data-testid="progress-tracker">
      <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="p-3 rounded-full bg-gradient-to-br from-[#8fbf9f] to-[#2f5d5d]"
              style={{
                boxShadow: streakDays >= 7 ? `0 0 20px ${currentMilestone?.glow || 'rgba(143, 191, 159, 0.4)'}` : 'none'
              }}
            >
              <Flame 
                className={`w-6 h-6 text-white ${streakDays >= 7 && !prefersReducedMotion ? 'animate-pulse' : ''}`} 
              />
            </div>
            <div>
              <p className="text-2xl font-bold font-serif text-foreground">
                {streakDays} {streakDays === 1 ? 'Day' : 'Days'}
              </p>
              <p className="text-sm text-muted-foreground">Current Streak</p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-lg font-semibold text-foreground">{totalEntries}</p>
            <p className="text-sm text-muted-foreground">Total Entries</p>
          </div>
        </div>

        {nextMilestone && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">
                Next: {nextMilestone.label}
              </span>
              <span className="text-sm font-medium" style={{ color: nextMilestone.color }}>
                {nextMilestone.days - streakDays} days to go
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ 
                  width: `${progressToNext}%`,
                  background: `linear-gradient(90deg, ${nextMilestone.color}, ${nextMilestone.color}80)`
                }}
              />
            </div>
          </div>
        )}

        <div className="flex gap-2 mt-6 justify-center">
          {MILESTONE_CONFIG.map((milestone) => {
            const IconComponent = milestone.icon;
            const isEarned = streakDays >= milestone.days;
            
            return (
              <div
                key={milestone.days}
                className={`p-2 rounded-full transition-all duration-300 ${
                  isEarned ? 'scale-100' : 'scale-90 opacity-40'
                }`}
                style={{
                  background: isEarned ? milestone.color : 'var(--muted)',
                  boxShadow: isEarned ? `0 0 15px ${milestone.glow}` : 'none'
                }}
                title={milestone.label}
                data-testid={`badge-${milestone.days}`}
              >
                <IconComponent 
                  className="w-5 h-5" 
                  style={{ color: isEarned ? 'white' : 'var(--muted-foreground)' }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {showFloatingBadge && celebratingMilestone && !prefersReducedMotion && (() => {
        const CelebrationIcon = celebratingMilestone.icon;
        return (
          <div 
            className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
            data-testid="milestone-celebration"
          >
            <div 
              className="milestone-celebrate p-8 rounded-3xl bg-card/95 backdrop-blur-xl border-2 shadow-2xl"
              style={{ 
                borderColor: celebratingMilestone.color,
                boxShadow: `0 0 60px ${celebratingMilestone.glow}`
              }}
            >
              <div className="flex flex-col items-center gap-4">
                <div 
                  className="p-6 rounded-full"
                  style={{ background: celebratingMilestone.color }}
                >
                  <CelebrationIcon className="w-12 h-12 text-white" />
                </div>
                <Sparkles className="w-8 h-8 text-[#d4af37] sparkle-animation" />
                <h3 className="text-2xl font-bold font-serif text-foreground">
                  {celebratingMilestone.label}
                </h3>
                <p className="text-muted-foreground text-center max-w-xs">
                  You've maintained your healing practice for {celebratingMilestone.days} days!
                </p>
              </div>
            </div>
          </div>
        );
      })()}

      <style>{`
        @keyframes celebrateIn {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes sparkle {
          0%, 100% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.2); }
        }
        .milestone-celebrate {
          animation: celebrateIn 0.5s ease-out forwards;
        }
        .sparkle-animation {
          animation: sparkle 2s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .milestone-celebrate,
          .sparkle-animation {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

export { MILESTONE_CONFIG };
