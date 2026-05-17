import { useState, useRef, useEffect, useMemo } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import SEO from "../../components/SEO";
import { MonetizationBoundaryValidator } from "@/governance/interactions/MonetizationBoundaryValidator";
import { CrisisOverrideEngine } from "@/governance/interactions/CrisisOverrideEngine";
import { HEALING_FLOW_PROTECTION_RULES } from "@/governance/interactions/HealingFlowProtectionRules";

// HX-OS Interaction Governance — Runtime Enforcement (v5.8.127, Meditation iter 9).
// Compile-time pin: "meditation" is a registered protected healing flow.
const MEDITATION_IS_HEALING_FLOW =
  HEALING_FLOW_PROTECTION_RULES.isProtected("meditation");

// Categories that signal an emotional-regulation vulnerable state on this surface.
// "Stress" and "Sleep" sessions are reached most often when the user is dysregulated;
// observability only — does NOT branch UI, pacing, or recommendation behavior.
const VULNERABLE_MEDITATION_CATEGORIES = new Set(["Stress", "Sleep"]);

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

  // HX-OS Interaction Governance — passive derivations.
  // No text input exists on this surface → crisisDetected is always-false by
  // construction (same pattern as AtlasDashboard iter 3). Vulnerable signal
  // derives from selected meditation category only. Observability only — does
  // NOT branch pacing, audio, timing, recommendations, or any UI.
  const crisisDetected = false;

  const vulnerableState = useMemo(
    () =>
      selectedMeditation !== null &&
      VULNERABLE_MEDITATION_CATEGORIES.has(selectedMeditation.category),
    [selectedMeditation],
  );

  const overrideState = useMemo(
    () =>
      CrisisOverrideEngine.getOverrideState({
        crisisDetected,
        escalationRequired: MEDITATION_IS_HEALING_FLOW || vulnerableState,
      }),
    [vulnerableState],
  );

  const monetizationGate = useMemo(
    () =>
      MonetizationBoundaryValidator.validate({
        route: "/tools/meditation",
        action: "any-business-action",
        emotionalState: {
          crisisDetected,
          isVulnerable: vulnerableState,
        },
      }),
    [vulnerableState],
  );

  return (
    <div
      className="min-h-screen bg-background"
      data-meditation-governed="true"
      data-healing-flow={MEDITATION_IS_HEALING_FLOW ? "true" : "false"}
      data-crisis-active={crisisDetected ? "true" : "false"}
      data-vulnerable={vulnerableState ? "true" : "false"}
      data-monetization-suspended={overrideState.monetizationSuspended ? "true" : "false"}
      data-monetization-allowed={monetizationGate.allowed ? "true" : "false"}
      data-conversion-disabled={overrideState.conversionDisabled ? "true" : "false"}
      data-paywalls-blocked={overrideState.paywallsBlocked ? "true" : "false"}
      data-upgrade-prompts-blocked={overrideState.upgradePromptsBlocked ? "true" : "false"}
      data-analytics-restricted={overrideState.analyticsRestricted ? "true" : "false"}
    >
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
                <div className="h-2 bg-muted rounded-full overflow-hidden" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} aria-label="Meditation progress">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                  <span aria-label="Current time">{formatTime(currentTime)}</span>
                  <span aria-label="Total duration">{formatTime(duration)}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4" role="group" aria-label="Playback controls">
                <Button
                  variant="ghost"
                  size="icon"
                  className="min-h-[44px] min-w-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  onClick={() => setCurrentTime(Math.max(0, currentTime - 30))}
                  data-testid="button-skip-back"
                  aria-label="Skip back 30 seconds"
                >
                  <SkipBack className="w-6 h-6" aria-hidden="true" />
                </Button>

                <Button
                  size="lg"
                  className="w-16 h-16 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  onClick={() => setIsPlaying(!isPlaying)}
                  data-testid="button-play-pause"
                  aria-label={isPlaying ? "Pause meditation" : "Play meditation"}
                >
                  {isPlaying ? <Pause className="w-8 h-8" aria-hidden="true" /> : <Play className="w-8 h-8 ml-1" aria-hidden="true" />}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="min-h-[44px] min-w-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  onClick={() => setCurrentTime(Math.min(duration, currentTime + 30))}
                  data-testid="button-skip-forward"
                  aria-label="Skip forward 30 seconds"
                >
                  <SkipForward className="w-6 h-6" aria-hidden="true" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="min-h-[44px] min-w-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  onClick={() => setIsMuted(!isMuted)}
                  data-testid="button-mute"
                  aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                  aria-pressed={isMuted}
                >
                  {isMuted ? <VolumeX className="w-6 h-6" aria-hidden="true" /> : <Volume2 className="w-6 h-6" aria-hidden="true" />}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" role="list" aria-label="Available meditations">
            {meditations.map(meditation => (
              <Card
                key={meditation.id}
                className="cursor-pointer hover:border-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                onClick={() => selectMeditation(meditation)}
                role="listitem"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && selectMeditation(meditation)}
                aria-label={`${meditation.title}: ${meditation.description}. Duration: ${formatTime(meditation.duration)}`}
                data-testid={`card-meditation-${meditation.id}`}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                      {meditation.category}
                    </span>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="w-4 h-4" aria-hidden="true" />
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
