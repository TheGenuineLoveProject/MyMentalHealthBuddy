import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Sparkles, ArrowLeft, Play, Pause, RotateCcw } from 'lucide-react';
import SEO from "../../components/SEO";
import SafetyFooter from "../../components/ui/SafetyFooter";
import { Card, CardContent } from "@/components/ui/Card.jsx";
import { Button } from "@/components/ui/Button.jsx";

const AWE_PROMPTS = [
  { text: "Think of the vastness of the night sky...", duration: 10 },
  { text: "Imagine all the people who came before you, whose choices led to you being here", duration: 12 },
  { text: "Consider how your heart beats without you asking it to", duration: 10 },
  { text: "Picture the intricate web of life—from the smallest microbe to the largest whale", duration: 12 },
  { text: "Feel the ground beneath you—the Earth, spinning through space", duration: 10 },
  { text: "Let yourself be amazed by the simple fact that you exist", duration: 8 }
];

export default function AweMicrodose() {
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
            if (currentIndex < AWE_PROMPTS.length - 1) {
              setCurrentIndex(i => i + 1);
              return 0;
            } else {
              setIsPlaying(false);
              setCompleted(true);
              return 100;
            }
          }
          return p + (100 / (AWE_PROMPTS[currentIndex].duration * 10));
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

  const currentPrompt = AWE_PROMPTS[currentIndex];
  const totalProgress = ((currentIndex * 100) + progress) / AWE_PROMPTS.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-background dark:from-indigo-900/10 dark:to-background">
      <SEO 
        title="Awe Microdose — The Genuine Love Project"
        description="A 60-second practice to cultivate wonder and perspective."
      />
      
      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <Link href="/tools">
          <Button variant="ghost" size="sm" className="mb-6" data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tools
          </Button>
        </Link>

        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            <span>60-Second Practice</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Awe Microdose
          </h1>
          <p className="text-muted-foreground">
            A tiny dose of wonder to shift your perspective.
          </p>
        </header>

        <Card className="mb-8">
          <CardContent className="p-8">
            {completed ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Moment of Wonder</h2>
                <p className="text-muted-foreground mb-6">
                  Awe helps us feel connected to something larger than ourselves.
                </p>
                <Button onClick={reset} variant="outline" data-testid="button-restart">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Experience Again
                </Button>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <div 
                    className="relative mx-auto w-32 h-32 mb-6"
                    style={{
                      background: `radial-gradient(circle, rgba(99, 102, 241, ${0.1 + progress/400}) 0%, transparent 70%)`
                    }}
                  >
                    <Sparkles 
                      className="absolute inset-0 m-auto w-16 h-16 text-indigo-400"
                      style={{ 
                        transform: `scale(${1 + Math.sin(progress / 20) * 0.1})`,
                        opacity: 0.5 + (progress / 200)
                      }}
                    />
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {currentIndex + 1} of {AWE_PROMPTS.length}
                  </div>
                  <div 
                    className="text-xl md:text-2xl font-serif text-foreground min-h-[80px] flex items-center justify-center italic"
                    data-testid="text-prompt"
                  >
                    {currentPrompt.text}
                  </div>
                </div>

                <div className="mb-6">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-400 transition-all duration-100"
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
          Research shows that experiencing awe can reduce stress and increase feelings of connection.
        </p>
      </main>

      <SafetyFooter />
    </div>
  );
}
