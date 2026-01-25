import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { LayoutWrapper } from "@/components/ui/LayoutWrapper";
import { Hero } from "@/components/ui/Hero";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Card, CardGrid } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import SafetyFooter from "@/components/ui/SafetyFooter";
import BenefitsBlock from "@/components/BenefitsBlock";
import ClarityCard from "@/components/content/ClarityCard";
import ExamplesAccordion from "@/components/content/ExamplesAccordion";
import { Activity, Clock, Heart, Wind, Zap, Play, Check, TrendingUp, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import { SEO } from "@/components/SEO";

const MOVEMENT_CLARITY = {
  what: "Quick, gentle movement breaks to release tension, boost energy, and support your nervous system throughout the day.",
  who: "Anyone who sits for long periods, experiences physical tension, or needs quick energy boosts.",
  when: "Every 60-90 minutes during work, when you notice stiffness, or when energy dips.",
  why: "Brief movement activates your vagus nerve, releases tension, and breaks stress hormone cycles—without requiring a workout.",
  howSteps: [
    "Choose a movement snack that fits your current energy",
    "Start the timer and follow the simple instructions",
    "Rate your energy before and after to notice the shift",
    "Log your movement to track your body care patterns"
  ],
  whereLinkText: "Explore breathing exercises",
  whereHref: "/breathing-exercises"
};

const MOVEMENT_EXAMPLES = [
  {
    level: "beginner",
    title: "Breaking up a long sitting session",
    situation: "You've been at your desk for 2 hours and notice your shoulders are tight.",
    action: "Do the 30-second Shoulder Rolls movement snack—no need to leave your chair.",
    result: "Tension releases, blood flows, and you return to work feeling refreshed."
  },
  {
    level: "intermediate",
    title: "Using movement for an energy dip",
    situation: "It's 3pm and your energy is crashing. You want to avoid more caffeine.",
    action: "Do Stand & Stretch for 60 seconds, followed by 5 Deep Breaths.",
    result: "Your body wakes up naturally and you have sustained energy through the afternoon."
  },
  {
    level: "advanced",
    title: "Building movement snacks into your routine",
    situation: "You want to make regular movement breaks automatic.",
    action: "Set hourly reminders and track your movements, noticing energy patterns over a week.",
    result: "Movement becomes habitual, and you notice overall improvements in energy and reduced tension."
  }
];

const MOVEMENT_SNACKS = [
  { id: "shoulders", name: "Shoulder Rolls", duration: 30, description: "Gently roll shoulders forward, then backward", icon: Activity },
  { id: "breathing", name: "Deep Breaths", duration: 60, description: "5 slow, deep breaths with awareness", icon: Wind },
  { id: "stretch", name: "Gentle Stretch", duration: 45, description: "Reach arms overhead, lean side to side", icon: Zap },
  { id: "neck", name: "Neck Release", duration: 30, description: "Slowly tilt head to each shoulder", icon: Heart },
  { id: "hands", name: "Hand Circles", duration: 20, description: "Rotate wrists and wiggle fingers", icon: Activity },
  { id: "standing", name: "Stand & Stretch", duration: 60, description: "Stand up, stretch in any way that feels good", icon: Play },
];

export default function MovementSnacksPage() {
  const [activeSnack, setActiveSnack] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [note, setNote] = useState("");
  const [energyBefore, setEnergyBefore] = useState(5);
  const [energyAfter, setEnergyAfter] = useState(5);
  const intervalRef = useRef(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ["/api/wellness-tools/movement"],
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      return apiRequest("/api/wellness-tools/movement", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wellness-tools/movement"] });
      setActiveSnack(null);
      setTimer(0);
      setNote("");
      setEnergyBefore(5);
      setEnergyAfter(5);
      toast({ title: "Movement logged", description: "Great job taking a moment for your body!" });
    },
    onError: () => {
      toast({ title: "Error", description: "Could not log movement. Please try again.", variant: "destructive" });
    },
  });

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleStartSnack = (snack) => {
    setActiveSnack(snack);
    setTimer(snack.duration);
    setIsRunning(true);
    
    intervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleLogSnack = () => {
    if (!activeSnack) return;
    createMutation.mutate({
      movementType: activeSnack.id,
      durationSeconds: activeSnack.duration,
      energyBefore: energyBefore,
      energyAfter: energyAfter,
      notes: note || null,
    });
  };

  const todayLogs = logs.filter((log) => {
    const logDate = new Date(log.createdAt).toDateString();
    return logDate === new Date().toDateString();
  });

  const totalMinutesToday = Math.round(todayLogs.reduce((sum, log) => sum + (log.durationSeconds || 0), 0) / 60);

  return (
    <WellnessPageShell
      title="Movement Snacks"
      subtitle="Brief, gentle movements to reconnect with your body"
      benefits={pickBenefits(["Agency","Calm","Body awareness"], 3)}
      clarity={{
        what: "Quick movement exercises for body awareness.",
        why: "To reconnect with your body and release tension.",
        who: "For anyone wanting gentle movement breaks.",
        when: "Anytime you need a body reset.",
        where: "Right here, right now.",
        how: "Choose a movement, follow the guide, stop when ready."
      }}
      examples={[]}
    >
      <SEO title="Movement Snacks — The Genuine Love Project" description="Quick movement breaks for body wellness." />

    <LayoutWrapper>
      <Hero
        title="Movement Snacks"
        subtitle="Brief, gentle movements to reconnect with your body — no equipment needed"
        variant="wellness"
        data-testid="hero-movement"
      />
      
      <SectionContainer>
        <BenefitsBlock
          benefit="Body awareness, gentle energy, and grounding"
          duration="20–60 seconds per snack"
          control="Choose what feels right, skip what doesn't"
          disclaimer="Educational wellness support — not medical advice. If you're in crisis, visit /crisis."
          variant="minimal"
          className="mb-6"
        />

        <ClarityCard {...MOVEMENT_CLARITY} variant="compact" className="mb-6" />

        <ExamplesAccordion 
          examples={MOVEMENT_EXAMPLES} 
          title="See how others use movement snacks"
          className="mb-8"
        />
      </SectionContainer>

      <SectionContainer variant="default">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[var(--surface-elevated)] p-6 rounded-2xl border border-[var(--border-subtle)] mb-8" data-testid="section-intro">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-[var(--primary-muted)]">
                <Activity className="w-6 h-6 text-[var(--primary)]" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2" data-testid="heading-intro">
                  Small movements, big benefits
                </h2>
                <p className="text-[var(--text-secondary)] leading-relaxed" data-testid="text-intro">
                  Movement snacks are brief moments of gentle activity throughout your day. They may help release tension, 
                  improve circulation, and reconnect you with your body. No special equipment or space needed — 
                  just a few seconds of intentional movement.
                </p>
              </div>
            </div>
          </div>

          {todayLogs.length > 0 && (
            <div className="grid grid-cols-2 gap-4 mb-8" data-testid="section-stats">
              <div className="p-4 bg-[var(--surface-elevated)] rounded-xl border border-[var(--border-subtle)]">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-[var(--text-muted)]" />
                  <div>
                    <p className="text-sm text-[var(--text-muted)]" data-testid="label-today-snacks">Today's snacks</p>
                    <p className="text-2xl font-semibold text-[var(--text-primary)]" data-testid="value-today-snacks">{todayLogs.length}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-[var(--surface-elevated)] rounded-xl border border-[var(--border-subtle)]">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-[var(--text-muted)]" />
                  <div>
                    <p className="text-sm text-[var(--text-muted)]" data-testid="label-minutes-today">Minutes today</p>
                    <p className="text-2xl font-semibold text-[var(--text-primary)]" data-testid="value-minutes-today">{totalMinutesToday}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSnack ? (
            <div className="p-8 bg-[var(--surface-elevated)] rounded-2xl border border-[var(--border-subtle)] text-center mb-8" data-testid="section-active-snack">
              <h3 className="text-2xl font-semibold text-[var(--text-primary)] mb-2" data-testid="heading-active-snack">
                {activeSnack.name}
              </h3>
              <p className="text-[var(--text-secondary)] mb-6" data-testid="text-active-description">
                {activeSnack.description}
              </p>
              
              {isRunning ? (
                <div className="mb-6">
                  <div className="text-5xl font-bold text-[var(--primary)] mb-2" data-testid="timer-display">
                    {timer}s
                  </div>
                  <p className="text-sm text-[var(--text-muted)]" data-testid="text-timer-hint">Take your time, breathe...</p>
                </div>
              ) : timer === 0 && (
                <div className="mb-6">
                  <Check className="w-16 h-16 text-[var(--success)] mx-auto mb-4" />
                  <p className="text-lg text-[var(--text-primary)]" data-testid="text-complete">Well done!</p>
                </div>
              )}

              {!isRunning && timer === 0 && (
                <div className="space-y-4 text-left">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2" htmlFor="energy-before" data-testid="label-energy-before">
                        Energy before (1-10)
                      </label>
                      <input
                        id="energy-before"
                        type="range"
                        min="1"
                        max="10"
                        value={energyBefore}
                        onChange={(e) => setEnergyBefore(parseInt(e.target.value))}
                        className="w-full"
                        data-testid="input-energy-before"
                      />
                      <p className="text-center text-sm text-[var(--text-muted)]" data-testid="value-energy-before">{energyBefore}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2" htmlFor="energy-after" data-testid="label-energy-after">
                        Energy after (1-10)
                      </label>
                      <input
                        id="energy-after"
                        type="range"
                        min="1"
                        max="10"
                        value={energyAfter}
                        onChange={(e) => setEnergyAfter(parseInt(e.target.value))}
                        className="w-full"
                        data-testid="input-energy-after"
                      />
                      <p className="text-center text-sm text-[var(--text-muted)]" data-testid="value-energy-after">{energyAfter}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2" htmlFor="note" data-testid="label-note">
                      Notes (optional)
                    </label>
                    <textarea
                      id="note"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="How do you feel? (you can skip this)"
                      rows={2}
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border-default)] bg-[var(--surface-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
                      data-testid="textarea-note"
                    />
                  </div>
                  <div className="flex gap-3 justify-center">
                    <Button onClick={handleLogSnack} disabled={createMutation.isPending} data-testid="button-log">
                      {createMutation.isPending ? (
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Saving...
                        </span>
                      ) : (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Log Movement
                        </>
                      )}
                    </Button>
                    <Button variant="secondary" onClick={() => { setActiveSnack(null); setTimer(0); }} data-testid="button-skip">
                      Skip
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4" data-testid="heading-choose">
                Choose a movement snack
              </h3>

              <CardGrid columns={2}>
                {MOVEMENT_SNACKS.map((snack) => {
                  const Icon = snack.icon;
                  return (
                    <Card
                      key={snack.id}
                      className="cursor-pointer hover:border-[var(--primary)] transition-all"
                      onClick={() => handleStartSnack(snack)}
                      data-testid={`card-snack-${snack.id}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-[var(--primary-muted)]">
                          <Icon className="w-6 h-6 text-[var(--primary)]" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-[var(--text-primary)]" data-testid={`heading-snack-${snack.id}`}>{snack.name}</h4>
                            <span className="flex items-center gap-1 text-sm text-[var(--text-muted)]" data-testid={`duration-snack-${snack.id}`}>
                              <Clock className="w-3 h-3" />
                              {snack.duration}s
                            </span>
                          </div>
                          <p className="text-sm text-[var(--text-secondary)]" data-testid={`description-snack-${snack.id}`}>{snack.description}</p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </CardGrid>
            </>
          )}

          {logs.length > 0 && !activeSnack && (
            <div className="mt-12" data-testid="section-history">
              <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4" data-testid="heading-history">
                Recent movement
              </h3>
              <div className="grid gap-2">
                {logs.slice(0, 10).map((log) => {
                  const snack = MOVEMENT_SNACKS.find(s => s.id === log.movementType);
                  return (
                    <div
                      key={log.id}
                      className="flex items-center justify-between p-3 bg-[var(--surface-elevated)] rounded-lg border border-[var(--border-subtle)]"
                      data-testid={`log-${log.id}`}
                    >
                      <div className="flex items-center gap-3">
                        <Check className="w-4 h-4 text-[var(--success)]" />
                        <span className="text-[var(--text-primary)]" data-testid={`text-log-name-${log.id}`}>
                          {snack?.name || log.movementType}
                        </span>
                        {log.notes && (
                          <span className="text-sm text-[var(--text-muted)]" data-testid={`text-log-notes-${log.id}`}>— {log.notes}</span>
                        )}
                        {(log.energyBefore || log.energyAfter) && (
                          <span className="text-xs px-2 py-1 bg-[var(--surface-secondary)] rounded-full text-[var(--text-muted)]" data-testid={`text-log-energy-${log.id}`}>
                            Energy: {log.energyBefore} → {log.energyAfter}
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-[var(--text-muted)]" data-testid={`text-log-date-${log.id}`}>
                        {new Date(log.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {isLoading && (
            <div className="text-center py-8" data-testid="loading-state">
              <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-[var(--text-muted)] mt-2">Loading your movement logs...</p>
            </div>
          )}
        </div>
      </SectionContainer>

      <SafetyFooter />
    </LayoutWrapper>
  </WellnessPageShell>
  );
}
