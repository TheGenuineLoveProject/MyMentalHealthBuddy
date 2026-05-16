import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Waves, ArrowLeft, Play, Pause, RotateCcw, Check } from "lucide-react";
import SEO from "../../components/SEO";
import SafetyFooter from "../../components/ui/SafetyFooter";
import { Card, CardContent } from "@/components/ui/Card.jsx";
import { Button } from "@/components/ui/Button.jsx";

const URGE_SURF_STEPS = [
  { text: "Notice the urge without acting on it", duration: 10 },
  { text: "Observe where you feel it in your body", duration: 10 },
  { text: "Watch its intensity—is it rising or falling?", duration: 10 },
  { text: "Remember: urges are like waves—they rise and fall", duration: 10 },
  { text: "Breathe slowly as you ride this wave", duration: 10 },
  { text: "The urge is peaking... stay with it", duration: 15 },
  { text: "It's beginning to subside", duration: 10 },
  { text: "You're riding through it", duration: 10 },
  { text: "Notice how it feels now", duration: 10 }
];

export default function UrgeSurf() {
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
            if (currentIndex < URGE_SURF_STEPS.length - 1) {
              setCurrentIndex(i => i + 1);
              return 0;
            } else {
              setIsPlaying(false);
              setCompleted(true);
              return 100;
            }
          }
          return p + (100 / (URGE_SURF_STEPS[currentIndex].duration * 10));
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

  const currentStep = URGE_SURF_STEPS[currentIndex];
  const totalProgress = ((currentIndex * 100) + progress) / URGE_SURF_STEPS.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-background dark:from-cyan-900/10 dark:to-background">
      <SEO 
        title="Urge Surf — MyMentalHealthBuddy"
        description="A mindful practice for riding through difficult urges without acting on them."
      />
      
      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <Link href="/tools">
          <Button variant="ghost" size="sm" className="mb-6" data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tools
          </Button>
        </Link>

        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 text-sm mb-4">
            <Waves className="w-4 h-4" />
            <span>Mindful Practice</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Urge Surf
          </h1>
          <p className="text-muted-foreground">
            Learn to ride the wave of an urge without being swept away by it.
          </p>
        </header>

        <Card className="mb-8">
          <CardContent className="p-8">
            {completed ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
                </div>
                <h2 className="text-xl font-semibold mb-2">You Surfed the Urge</h2>
                <p className="text-muted-foreground mb-6">
                  Every time you ride through an urge, you strengthen your ability to do it again.
                </p>
                <Button onClick={reset} variant="outline" data-testid="button-restart">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Practice Again
                </Button>
              </div>
            ) : (
              <>
                <div className="relative mb-8">
                  <div 
                    className="h-32 flex items-center justify-center overflow-hidden"
                    style={{
                      background: `linear-gradient(180deg, 
                        transparent 0%, 
                        rgba(6, 182, 212, ${0.1 + (progress / 500)}) 50%, 
                        transparent 100%)`
                    }}
                  >
                    <Waves 
                      className="w-24 h-24 text-cyan-400 dark:text-cyan-600"
                      style={{ 
                        transform: `translateY(${Math.sin(progress / 10) * 10}px)`,
                        opacity: 0.3 + (progress / 200)
                      }}
                    />
                  </div>
                </div>

                <div className="text-center mb-8">
                  <div className="text-sm text-muted-foreground mb-2">
                    Step {currentIndex + 1} of {URGE_SURF_STEPS.length}
                  </div>
                  <div 
                    className="text-xl md:text-2xl font-medium text-foreground min-h-[60px] flex items-center justify-center"
                    data-testid="text-step"
                  >
                    {currentStep.text}
                  </div>
                </div>

                <div className="mb-6">
                  <div className="h-2 bg-muted rounded-full overflow-hidden" role="progressbar" aria-valuenow={Math.round(totalProgress)} aria-valuemin={0} aria-valuemax={100} aria-label="Urge surf progress">
                    <div 
                      className="h-full bg-cyan-400 transition-all duration-100"
                      style={{ width: `${totalProgress}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-center gap-4" role="group" aria-label="Playback controls">
                  <Button
                    size="lg"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="min-w-[120px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    data-testid="button-play"
                    aria-label={isPlaying ? "Pause urge surf" : (progress > 0 ? "Resume urge surf" : "Begin urge surf")}
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-5 h-5 mr-2" aria-hidden="true" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5 mr-2" aria-hidden="true" />
                        {progress > 0 ? "Resume" : "Begin"}
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="lg" onClick={reset} data-testid="button-reset" aria-label="Reset urge surf" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2">
                    <RotateCcw className="w-5 h-5" aria-hidden="true" />
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground space-y-2">
          <p>Urges typically peak within 20-30 minutes, then naturally subside.</p>
          <p>If you're experiencing crisis-level urges, please reach out for support.</p>
        </div>
      </main>

      <SafetyFooter />
    </div>
  );
}
