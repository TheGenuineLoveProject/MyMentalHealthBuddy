import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import SEO from "../../components/SEO";

export default function MeditationPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(300);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedMeditation, setSelectedMeditation] = useState(null);
  const intervalRef = useRef(null);

  const meditations = [
    { id: 1, title: "Morning Calm", duration: 300, category: "Morning", description: "Start your day with peace" },
    { id: 2, title: "Stress Relief", duration: 600, category: "Stress", description: "Release tension and worry" },
    { id: 3, title: "Body Scan", duration: 900, category: "Body", description: "Connect with your physical self" },
    { id: 4, title: "Loving Kindness", duration: 480, category: "Love", description: "Cultivate compassion" },
    { id: 5, title: "Sleep Journey", duration: 1200, category: "Sleep", description: "Drift into restful sleep" },
    { id: 6, title: "Quick Reset", duration: 180, category: "Quick", description: "A 3-minute refresh" }
  ];

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            clearInterval(intervalRef.current);
            return duration;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, duration]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const selectMeditation = (meditation) => {
    setSelectedMeditation(meditation);
    setDuration(meditation.duration);
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const progress = (currentTime / duration) * 100;

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Guided Meditation — The Genuine Love Project" />

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <header className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4" data-testid="text-page-title">
            Guided Meditation
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Find peace and clarity with our guided meditation sessions
          </p>
        </header>

        {selectedMeditation ? (
          <Card className="mb-8">
            <CardContent className="pt-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">{selectedMeditation.title}</h2>
                <p className="text-muted-foreground">{selectedMeditation.description}</p>
              </div>

              <div className="mb-6">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="min-h-[44px] min-w-[44px]"
                  onClick={() => setCurrentTime(Math.max(0, currentTime - 30))}
                  data-testid="button-skip-back"
                >
                  <SkipBack className="w-6 h-6" />
                </Button>

                <Button
                  size="lg"
                  className="w-16 h-16 rounded-full"
                  onClick={() => setIsPlaying(!isPlaying)}
                  data-testid="button-play-pause"
                >
                  {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="min-h-[44px] min-w-[44px]"
                  onClick={() => setCurrentTime(Math.min(duration, currentTime + 30))}
                  data-testid="button-skip-forward"
                >
                  <SkipForward className="w-6 h-6" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="min-h-[44px] min-w-[44px]"
                  onClick={() => setIsMuted(!isMuted)}
                  data-testid="button-mute"
                >
                  {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                </Button>
              </div>

              <div className="text-center mt-6">
                <Button
                  variant="outline"
                  onClick={() => setSelectedMeditation(null)}
                  className="min-h-[44px]"
                >
                  Choose Another
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {meditations.map(meditation => (
              <Card
                key={meditation.id}
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => selectMeditation(meditation)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                      {meditation.category}
                    </span>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatTime(meditation.duration)}
                    </span>
                  </div>
                  <h3 className="font-semibold mb-1">{meditation.title}</h3>
                  <p className="text-sm text-muted-foreground">{meditation.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
