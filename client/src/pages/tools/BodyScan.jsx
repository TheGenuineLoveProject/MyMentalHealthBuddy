import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Activity, ArrowLeft, Play, Pause, RotateCcw, Check } from "lucide-react";
import SEO from "../../components/SEO";
import SafetyFooter from "../../components/ui/SafetyFooter";
import { Card, CardContent } from "@/components/ui/Card.jsx";
import { Button } from "@/components/ui/Button.jsx";

const BODY_SCAN_STEPS = [
  { text: "Find a comfortable position and close your eyes if that feels okay", area: "general", duration: 8 },
  { text: "Take three slow, deep breaths", area: "breath", duration: 10 },
  { text: "Bring your attention to the top of your head", area: "head", duration: 8 },
  { text: "Notice any sensations in your face—your forehead, eyes, jaw", area: "face", duration: 10 },
  { text: "Feel your neck and shoulders. Notice if you're holding tension", area: "shoulders", duration: 10 },
  { text: "Move your attention down your arms to your hands", area: "arms", duration: 8 },
  { text: "Notice your chest and the rhythm of your breathing", area: "chest", duration: 10 },
  { text: "Feel your back—upper, middle, lower", area: "back", duration: 10 },
  { text: "Notice your stomach and any sensations there", area: "stomach", duration: 8 },
  { text: "Bring awareness to your hips and pelvis", area: "hips", duration: 8 },
  { text: "Feel your thighs and knees", area: "legs", duration: 8 },
  { text: "Notice your calves, ankles, and feet", area: "feet", duration: 10 },
  { text: "Now feel your whole body as one connected whole", area: "whole", duration: 10 },
  { text: "When you're ready, gently wiggle your fingers and toes", area: "return", duration: 8 }
];

const BODY_AREAS = {
  general: "🧘",
  breath: "💨",
  head: "🧠",
  face: "😌",
  shoulders: "💪",
  arms: "🤲",
  chest: "❤️",
  back: "🦴",
  stomach: "🌀",
  hips: "🏃",
  legs: "🦵",
  feet: "🦶",
  whole: "✨",
  return: "🌟"
};

export default function BodyScan() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    let interval;
    if (isPlaying && !completed) {
      interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            if (currentIndex < BODY_SCAN_STEPS.length - 1) {
              setCurrentIndex(i => i + 1);
              return 0;
            } else {
              setIsPlaying(false);
              setCompleted(true);
              return 100;
            }
          }
          return p + (100 / (BODY_SCAN_STEPS[currentIndex].duration * 10));
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentIndex, completed]);

  const reset = () => {
    setIsPlaying(false);
    setCurrentIndex(0);
    setProgress(0);
    setCompleted(false);
  };

  const currentStep = BODY_SCAN_STEPS[currentIndex];
  const totalProgress = ((currentIndex * 100) + progress) / BODY_SCAN_STEPS.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-background dark:from-teal-900/10 dark:to-background">
      <SEO 
        title="Body Scan — The Genuine Love Project"
        description="A gentle body scan meditation to connect with your physical sensations."
      />
      
      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <Link href="/tools">
          <Button variant="ghost" className="mb-8 min-h-[44px] px-4 py-2 rounded-lg" data-testid="button-back">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Tools
          </Button>
        </Link>

        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-sm font-medium mb-6">
            <Activity className="w-4 h-4" />
            <span>5-Minute Practice</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
            Body Scan
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
            A gentle journey through your body to release tension and reconnect.
          </p>
        </header>

        <Card className="mb-8">
          <CardContent className="p-8">
            {completed ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Scan Complete</h2>
                <p className="text-muted-foreground mb-6">
                  You've reconnected with your body. Carry this awareness with you.
                </p>
                <Button onClick={reset} variant="outline" className="min-h-[44px] px-6 py-3 rounded-lg" data-testid="button-restart">
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Practice Again
                </Button>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <div className="text-5xl mb-4">{BODY_AREAS[currentStep.area]}</div>
                  <div className="text-sm text-muted-foreground mb-2">
                    Step {currentIndex + 1} of {BODY_SCAN_STEPS.length}
                  </div>
                  <div 
                    className="text-xl md:text-2xl font-medium text-foreground min-h-[80px] flex items-center justify-center"
                    data-testid="text-step"
                  >
                    {currentStep.text}
                  </div>
                </div>

                <div className="mb-6">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-teal-400 transition-all duration-100"
                      style={{ width: `${totalProgress}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-center gap-4">
                  <Button
                    size="lg"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="min-w-[120px]"
                    data-testid="button-play"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-5 h-5 mr-2" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5 mr-2" />
                        {progress > 0 ? "Resume" : "Begin"}
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="lg" onClick={reset} data-testid="button-reset">
                    <RotateCcw className="w-5 h-5" />
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          If any area feels uncomfortable, simply acknowledge it and move on. There's no right or wrong way to feel.
        </p>
      </main>

      <SafetyFooter />
    </div>
  );
}
