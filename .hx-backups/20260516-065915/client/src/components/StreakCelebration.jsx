import { useState, useEffect } from "react";
import { Flame, X, Trophy, Star, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

const milestones = [7, 14, 21, 30, 60, 90, 100, 180, 365];

export default function StreakCelebration({ streakDays, onClose }) {
  const [show, setShow] = useState(false);
  const [confetti, setConfetti] = useState([]);

  const isMilestone = milestones.includes(streakDays);
  
  const getMessage = () => {
    if (streakDays >= 365) return "One Year Champion! Incredible dedication!";
    if (streakDays >= 180) return "Half Year Hero! You're unstoppable!";
    if (streakDays >= 100) return "Century Milestone! 100 days strong!";
    if (streakDays >= 90) return "90 Days! A true commitment to yourself!";
    if (streakDays >= 60) return "60 Days! You're building lasting habits!";
    if (streakDays >= 30) return "One Month! Amazing consistency!";
    if (streakDays >= 21) return "21 Days! A new habit is forming!";
    if (streakDays >= 14) return "Two Weeks! Keep the momentum!";
    if (streakDays >= 7) return "One Week! Great start!";
    return `${streakDays} day streak! Keep going!`;
  };

  useEffect(() => {
    if (isMilestone) {
      setShow(true);
      const particles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 2
      }));
      setConfetti(particles);
    }
  }, [isMilestone, streakDays]);

  const handleClose = () => {
    setShow(false);
    onClose?.();
  };

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      role="dialog"
      aria-label="Streak celebration"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {confetti.map(particle => (
          <div
            key={particle.id}
            className="absolute w-3 h-3 rounded-full animate-bounce"
            style={{
              left: `${particle.x}%`,
              top: "-20px",
              backgroundColor: ["#FFD700", "#FF6B6B", "#4ECDC4", "#A855F7", "#F97316"][particle.id % 5],
              animation: `fall ${particle.duration}s ease-in ${particle.delay}s forwards`
            }}
          />
        ))}
      </div>

      <div className="bg-background rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl text-center relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="absolute top-4 right-4 min-h-[44px] min-w-[44px]"
          data-testid="button-close"
        >
          <X className="w-5 h-5" />
        </Button>

        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center mx-auto mb-6">
          <Flame className="w-10 h-10 text-white" />
        </div>

        <div className="flex items-center justify-center gap-2 mb-4">
          <Star className="w-6 h-6 text-yellow-500" />
          <span className="text-5xl font-bold text-primary">{streakDays}</span>
          <Star className="w-6 h-6 text-yellow-500" />
        </div>

        <h2 className="text-2xl font-bold mb-2">Day Streak!</h2>
        <p className="text-muted-foreground mb-6">{getMessage()}</p>

        <div className="flex items-center justify-center gap-2 p-3 bg-primary/10 rounded-xl mb-6">
          <Trophy className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium">Milestone Achieved!</span>
        </div>

        <Button onClick={handleClose} className="w-full min-h-[44px]" data-testid="button-continue">
          <Sparkles className="w-4 h-4 mr-2" /> Keep It Going!
        </Button>
      </div>

      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
