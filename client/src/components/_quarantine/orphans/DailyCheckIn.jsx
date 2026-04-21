import { useState } from "react";
import { Sun, Moon, Cloud, Zap, Heart, X, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

const moodOptions = [
  { id: "great", label: "Great", icon: Sparkles, color: "text-green-500" },
  { id: "good", label: "Good", icon: Sun, color: "text-yellow-500" },
  { id: "okay", label: "Okay", icon: Cloud, color: "text-blue-400" },
  { id: "low", label: "Low", icon: Moon, color: "text-purple-500" },
  { id: "struggling", label: "Struggling", icon: Zap, color: "text-red-400" }
];

const energyLevels = [1, 2, 3, 4, 5];

export default function DailyCheckIn({ onComplete, onDismiss }) {
  const [step, setStep] = useState(0);
  const [mood, setMood] = useState(null);
  const [energy, setEnergy] = useState(null);
  const [gratitude, setGratitude] = useState("");

  const handleComplete = () => {
    const checkIn = {
      mood,
      energy,
      gratitude,
      timestamp: new Date().toISOString()
    };
    onComplete?.(checkIn);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-label="Daily check-in"
    >
      <div className="bg-background rounded-2xl p-6 max-w-md w-full shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            Daily Check-In
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDismiss}
            className="min-h-[44px] min-w-[44px]"
            data-testid="button-dismiss"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex gap-2 mb-6">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className={`flex-1 h-1 rounded-full ${i <= step ? "bg-primary" : "bg-muted"}`}
            />
          ))}
        </div>

        {step === 0 && (
          <div>
            <p className="text-muted-foreground mb-4">How are you feeling right now?</p>
            <div className="grid grid-cols-5 gap-2">
              {moodOptions.map(option => (
                <button
                  key={option.id}
                  onClick={() => { setMood(option.id); setStep(1); }}
                  className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all hover:border-primary ${
                    mood === option.id ? "border-primary bg-primary/5" : "border-muted"
                  }`}
                  data-testid={`mood-${option.id}`}
                >
                  <option.icon className={`w-6 h-6 ${option.color}`} />
                  <span className="text-xs mt-1">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <p className="text-muted-foreground mb-4">What's your energy level?</p>
            <div className="flex gap-2 justify-center">
              {energyLevels.map(level => (
                <button
                  key={level}
                  onClick={() => { setEnergy(level); setStep(2); }}
                  className={`w-12 h-12 rounded-full border-2 text-lg font-medium transition-all hover:border-primary ${
                    energy === level ? "border-primary bg-primary text-primary-foreground" : "border-muted"
                  }`}
                  data-testid={`energy-${level}`}
                >
                  {level}
                </button>
              ))}
            </div>
            <p className="text-xs text-center text-muted-foreground mt-2">1 = Low, 5 = High</p>
          </div>
        )}

        {step === 2 && (
          <div>
            <p className="text-muted-foreground mb-4">One thing you're grateful for today?</p>
            <textarea
              value={gratitude}
              onChange={(e) => setGratitude(e.target.value)}
              placeholder="I'm grateful for..."
              className="w-full p-3 rounded-xl border min-h-[100px] resize-none bg-background"
              data-testid="input-gratitude"
            />
            <Button
              onClick={handleComplete}
              className="w-full mt-4 min-h-[44px]"
              data-testid="button-complete"
            >
              <Check className="w-4 h-4 mr-2" /> Complete Check-In
            </Button>
          </div>
        )}

        {step > 0 && step < 2 && (
          <Button
            variant="ghost"
            onClick={() => setStep(step - 1)}
            className="mt-4 min-h-[44px]"
          >
            Back
          </Button>
        )}
      </div>
    </div>
  );
}
