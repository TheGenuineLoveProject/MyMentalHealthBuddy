import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { LayoutWrapper } from "@/components/ui/LayoutWrapper";
import { Hero } from "@/components/ui/Hero";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Card, CardGrid } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import SafetyFooter from "@/components/ui/SafetyFooter";
import { Activity, Clock, Heart, Wind, Zap, Play, Check, TrendingUp, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
      toast({ title: "Movement logged", description: "Great job taking a moment for your body!" });
    },
  });

  const handleStartSnack = (snack) => {
    setActiveSnack(snack);
    setTimer(snack.duration);
    setIsRunning(true);
    
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
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
      notes: note || null,
      completedAt: new Date().toISOString(),
    });
  };

  const todayLogs = logs.filter((log) => {
    const logDate = new Date(log.createdAt).toDateString();
    return logDate === new Date().toDateString();
  });

  const totalMinutesToday = Math.round(todayLogs.reduce((sum, log) => sum + (log.durationSeconds || 0), 0) / 60);

  return (
    <LayoutWrapper>
      <Hero
        title="Movement Snacks"
        subtitle="Brief, gentle movements to reconnect with your body — no equipment needed"
        variant="wellness"
        data-testid="hero-movement"
      />

      <SectionContainer variant="default">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[var(--surface-elevated)] p-6 rounded-2xl border border-[var(--border-subtle)] mb-8" data-testid="section-intro">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-[var(--primary-muted)]">
                <Activity className="w-6 h-6 text-[var(--primary)]" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                  Small movements, big benefits
                </h2>
                <p className="text-[var(--text-secondary)] leading-relaxed">
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
                    <p className="text-sm text-[var(--text-muted)]">Today's snacks</p>
                    <p className="text-2xl font-semibold text-[var(--text-primary)]">{todayLogs.length}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-[var(--surface-elevated)] rounded-xl border border-[var(--border-subtle)]">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-[var(--text-muted)]" />
                  <div>
                    <p className="text-sm text-[var(--text-muted)]">Minutes today</p>
                    <p className="text-2xl font-semibold text-[var(--text-primary)]">{totalMinutesToday}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSnack ? (
            <div className="p-8 bg-[var(--surface-elevated)] rounded-2xl border border-[var(--border-subtle)] text-center mb-8" data-testid="section-active-snack">
              <h3 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">
                {activeSnack.name}
              </h3>
              <p className="text-[var(--text-secondary)] mb-6">
                {activeSnack.description}
              </p>
              
              {isRunning ? (
                <div className="mb-6">
                  <div className="text-5xl font-bold text-[var(--primary)] mb-2" data-testid="timer-display">
                    {timer}s
                  </div>
                  <p className="text-sm text-[var(--text-muted)]">Take your time, breathe...</p>
                </div>
              ) : timer === 0 && (
                <div className="mb-6">
                  <Check className="w-16 h-16 text-[var(--success)] mx-auto mb-4" />
                  <p className="text-lg text-[var(--text-primary)]">Well done!</p>
                </div>
              )}

              {!isRunning && timer === 0 && (
                <div className="space-y-4">
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Optional: How do you feel? (you can skip this)"
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border-default)] bg-[var(--surface-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
                    data-testid="textarea-note"
                  />
                  <div className="flex gap-3 justify-center">
                    <Button onClick={handleLogSnack} disabled={createMutation.isPending} data-testid="button-log">
                      <Check className="w-4 h-4 mr-2" />
                      Log Movement
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
              <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">
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
                            <h4 className="font-medium text-[var(--text-primary)]">{snack.name}</h4>
                            <span className="flex items-center gap-1 text-sm text-[var(--text-muted)]">
                              <Clock className="w-3 h-3" />
                              {snack.duration}s
                            </span>
                          </div>
                          <p className="text-sm text-[var(--text-secondary)]">{snack.description}</p>
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
              <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">
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
                        <span className="text-[var(--text-primary)]">
                          {snack?.name || log.movementType}
                        </span>
                        {log.notes && (
                          <span className="text-sm text-[var(--text-muted)]">— {log.notes}</span>
                        )}
                      </div>
                      <span className="text-sm text-[var(--text-muted)]">
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
            </div>
          )}
        </div>
      </SectionContainer>

      <SafetyFooter />
    </LayoutWrapper>
  );
}
