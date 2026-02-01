import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Heart, Play, Pause, RotateCcw, Check, ArrowLeft } from "lucide-react";
import SEO from "../../components/SEO";
import SafetyFooter from "../../components/ui/SafetyFooter";
import { Card, CardContent } from "@/components/ui/Card.jsx";
import { Button } from "@/components/ui/Button.jsx";

const COMPASSION_PHRASES = [
  { text: "May I be kind to myself", duration: 8 },
  { text: "May I accept myself as I am", duration: 8 },
  { text: "May I forgive myself", duration: 8 },
  { text: "May I be at peace", duration: 8 },
  { text: "I am doing my best", duration: 8 },
  { text: "I am worthy of love", duration: 8 },
  { text: "This moment will pass", duration: 8 }
];

export default function CompassionBreak() {
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
            if (currentIndex < COMPASSION_PHRASES.length - 1) {
              setCurrentIndex(i => i + 1);
              return 0;
            } else {
              setIsPlaying(false);
              setCompleted(true);
              return 100;
            }
          }
          return p + (100 / (COMPASSION_PHRASES[currentIndex].duration * 10));
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

  const currentPhrase = COMPASSION_PHRASES[currentIndex];
  const totalProgress = ((currentIndex * 100) + progress) / COMPASSION_PHRASES.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-background dark:from-rose-900/10 dark:to-background">
      <SEO 
        title="Compassion Break — The Genuine Love Project"
        description="A 60-second self-compassion practice to nurture kindness toward yourself."
      />
      
      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <Link href="/tools">
          <Button variant="ghost" className="mb-8 min-h-[44px] px-4 py-2 rounded-lg" data-testid="button-back">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Tools
          </Button>
        </Link>

        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 text-sm font-medium mb-6">
            <Heart className="w-4 h-4" />
            <span>60-Second Practice</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
            Compassion Break
          </h1>
          <p className="text-muted-foreground">
            A moment of kindness toward yourself.
          </p>
        </header>

        <Card className="mb-8">
          <CardContent className="p-8">
            {completed ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Beautifully Done</h2>
                <p className="text-muted-foreground mb-6">
                  You gave yourself a moment of compassion. That matters.
                </p>
                <Button onClick={reset} variant="outline" data-testid="button-restart">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Practice Again
                </Button>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <div className="text-sm text-muted-foreground mb-2">
                    Phrase {currentIndex + 1} of {COMPASSION_PHRASES.length}
                  </div>
                  <div 
                    className="text-2xl md:text-3xl font-serif text-foreground min-h-[80px] flex items-center justify-center"
                    data-testid="text-phrase"
                  >
                    "{currentPhrase.text}"
                  </div>
                </div>

                <div className="mb-6">
                  <div className="h-2 bg-muted rounded-full overflow-hidden" role="progressbar" aria-valuenow={Math.round(totalProgress)} aria-valuemin={0} aria-valuemax={100} aria-label="Compassion break progress">
                    <div 
                      className="h-full bg-rose-400 transition-all duration-100"
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
                    aria-label={isPlaying ? "Pause compassion break" : (progress > 0 ? "Resume compassion break" : "Begin compassion break")}
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
                  <Button variant="outline" size="lg" onClick={reset} data-testid="button-reset" aria-label="Reset compassion break" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2">
                    <RotateCcw className="w-5 h-5" aria-hidden="true" />
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          Place a hand on your heart if that feels comforting.
        </p>
      </main>

      <SafetyFooter />
    </div>
  );
}
