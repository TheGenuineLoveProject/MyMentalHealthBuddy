import { useState, useEffect } from "react";
import { Trophy, X, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AchievementToast({ achievement, onClose, duration = 5000 }) {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setExiting(true);
    setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, 300);
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-sm transition-all duration-300 ${
        exiting ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"
      }`}
      role="alert"
      aria-live="polite"
    >
      <div className="bg-background rounded-xl shadow-xl border overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500" />
        
        <div className="p-4 flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center flex-shrink-0">
            {achievement.icon ? (
              <span className="text-2xl">{achievement.icon}</span>
            ) : (
              <Trophy className="w-6 h-6 text-white" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-xs font-medium text-yellow-600 uppercase tracking-wide">
                Achievement Unlocked!
              </span>
            </div>
            <h3 className="font-semibold text-foreground">{achievement.title}</h3>
            <p className="text-sm text-muted-foreground">{achievement.description}</p>
            {achievement.xp && (
              <span className="inline-block mt-2 px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary font-medium">
                +{achievement.xp} XP
              </span>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="min-h-[44px] min-w-[44px] -mt-1 -mr-1"
            data-testid="button-close-achievement"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function useAchievementToast() {
  const [achievements, setAchievements] = useState([]);

  const showAchievement = (achievement) => {
    const id = Date.now();
    setAchievements(prev => [...prev, { ...achievement, id }]);
  };

  const hideAchievement = (id) => {
    setAchievements(prev => prev.filter(a => a.id !== id));
  };

  const AchievementContainer = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {achievements.map((achievement, index) => (
        <div key={achievement.id} style={{ transform: `translateY(${index * 8}px)` }}>
          <AchievementToast
            achievement={achievement}
            onClose={() => hideAchievement(achievement.id)}
          />
        </div>
      ))}
    </div>
  );

  return { showAchievement, AchievementContainer };
}
