import { useState, useEffect } from "react";
import { Award, X, ArrowUp, Sparkles, Gift } from "lucide-react";
import { Button } from "@/components/ui/Button";

const levelRewards = {
  5: { title: "Novice Seeker", reward: "Unlock Breathing Exercises", color: "from-green-400 to-emerald-500" },
  10: { title: "Growing Spirit", reward: "Unlock Journal Prompts", color: "from-blue-400 to-cyan-500" },
  15: { title: "Mindful Explorer", reward: "Unlock Meditation Library", color: "from-purple-400 to-violet-500" },
  20: { title: "Heart Warrior", reward: "Unlock AI Companion", color: "from-pink-400 to-rose-500" },
  25: { title: "Wisdom Walker", reward: "Unlock Premium Tools", color: "from-amber-400 to-orange-500" },
  30: { title: "Soul Guardian", reward: "Unlock Community Features", color: "from-teal-400 to-cyan-500" },
  40: { title: "Light Bearer", reward: "Unlock Advanced Insights", color: "from-indigo-400 to-purple-500" },
  50: { title: "Master Healer", reward: "Unlock All Features", color: "from-yellow-400 to-amber-500" }
};

export default function LevelUpModal({ newLevel, xpGained, onClose }) {
  const [show, setShow] = useState(true);
  
  const levelInfo = levelRewards[newLevel] || {
    title: `Level ${newLevel}`,
    reward: "Keep growing!",
    color: "from-primary to-primary/80"
  };

  const handleClose = () => {
    setShow(false);
    onClose?.();
  };

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      role="dialog"
      aria-label="Level up notification"
    >
      <div className="bg-background rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl text-center relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${levelInfo.color} opacity-10`} />
        
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="absolute top-4 right-4 min-h-[44px] min-w-[44px] z-10"
          data-testid="button-close"
        >
          <X className="w-5 h-5" />
        </Button>

        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center mx-auto mb-6 shadow-lg">
            <ArrowUp className="w-12 h-12 text-white" />
          </div>

          <div className="flex items-center justify-center gap-1 mb-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-medium text-yellow-600 uppercase tracking-wide">Level Up!</span>
            <Sparkles className="w-5 h-5 text-yellow-500" />
          </div>

          <h2 className="text-4xl font-bold mb-2">Level {newLevel}</h2>
          <p className="text-lg font-medium text-primary mb-1">{levelInfo.title}</p>
          <p className="text-sm text-muted-foreground mb-6">+{xpGained} XP earned</p>

          <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl mb-6">
            <div className="flex items-center justify-center gap-2">
              <Gift className="w-5 h-5 text-primary" />
              <span className="font-medium">{levelInfo.reward}</span>
            </div>
          </div>

          <Button onClick={handleClose} className="w-full min-h-[44px]" data-testid="button-continue">
            <Award className="w-4 h-4 mr-2" /> Awesome!
          </Button>
        </div>
      </div>
    </div>
  );
}
