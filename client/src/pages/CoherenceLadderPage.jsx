import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { LayoutWrapper } from "@/components/ui/LayoutWrapper";
import { Hero } from "@/components/ui/Hero";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import SafetyFooter from "@/components/ui/SafetyFooter";
import { Layers, ArrowUp, ArrowDown, Star, Check, TrendingUp, MessageCircle, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const COHERENCE_LEVELS = [
  { level: 10, label: "Joy / Appreciation", description: "Deep gratitude, love, or excitement", color: "var(--success)" },
  { level: 9, label: "Passion / Enthusiasm", description: "Eagerness, positive anticipation", color: "var(--success)" },
  { level: 8, label: "Optimism / Belief", description: "Things are working out, trust in the process", color: "var(--success)" },
  { level: 7, label: "Contentment", description: "Feeling okay, at ease, satisfied", color: "var(--primary)" },
  { level: 6, label: "Hopefulness", description: "Things could get better, openness", color: "var(--primary)" },
  { level: 5, label: "Boredom / Neutrality", description: "Neither good nor bad, just... meh", color: "var(--text-muted)" },
  { level: 4, label: "Frustration / Irritation", description: "Something isn't working, mild annoyance", color: "var(--warning)" },
  { level: 3, label: "Worry / Overwhelm", description: "Anxious thoughts, feeling swamped", color: "var(--warning)" },
  { level: 2, label: "Discouragement", description: "Doubt, disappointment, low motivation", color: "var(--error)" },
  { level: 1, label: "Fear / Grief / Depression", description: "Deep sadness, powerlessness, despair", color: "var(--error)" },
];

const SHIFT_SUGGESTIONS = {
  1: ["If you can, take 3 slow breaths", "You don't have to fix this right now", "Would it help to talk to someone?"],
  2: ["Notice one thing around you — just observe it", "What's one small thing within your control?"],
  3: ["Name what you're feeling without judgment", "Take a brief break if you can", "This feeling is temporary"],
  4: ["What would help you feel even slightly better?", "Is there a boundary you could set?"],
  5: ["What's one thing you're looking forward to?", "What would add a bit of interest to your day?"],
  6: ["What evidence do you have that things could work out?", "What's gone well recently?"],
  7: ["What are you grateful for in this moment?", "Savor this feeling for a moment"],
  8: ["What else is possible?", "How can you build on this momentum?"],
  9: ["How can you share this energy?", "What inspired action feels right?"],
  10: ["Anchor this feeling — what helped you get here?", "How can you return to this state?"],
};

export default function CoherenceLadderPage() {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [note, setNote] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["/api/wellness-tools/coherence"],
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      return apiRequest("/api/wellness-tools/coherence", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wellness-tools/coherence"] });
      setSelectedLevel(null);
      setNote("");
      toast({ title: "Level logged", description: "Your emotional state has been recorded." });
    },
  });

  const handleLogLevel = () => {
    if (!selectedLevel) return;
    createMutation.mutate({
      currentLevel: selectedLevel,
      notes: note || null,
      loggedAt: new Date().toISOString(),
    });
  };

  const recentEntries = entries.slice(0, 7);
  const averageLevel = recentEntries.length > 0
    ? Math.round(recentEntries.reduce((sum, e) => sum + e.currentLevel, 0) / recentEntries.length * 10) / 10
    : null;

  const levelInfo = selectedLevel ? COHERENCE_LEVELS.find(l => l.level === selectedLevel) : null;
  const suggestions = selectedLevel ? SHIFT_SUGGESTIONS[selectedLevel] || [] : [];

  return (
    <LayoutWrapper>
      <Hero
        title="Coherence Ladder"
        subtitle="Check in with how you're feeling — there's no wrong answer, just awareness"
        variant="wellness"
        data-testid="hero-coherence"
      />

      <SectionContainer variant="default">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[var(--surface-elevated)] p-6 rounded-2xl border border-[var(--border-subtle)] mb-8" data-testid="section-intro">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-[var(--primary-muted)]">
                <Layers className="w-6 h-6 text-[var(--primary)]" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                  Understanding your emotional state
                </h2>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  The coherence ladder is a simple way to check in with your emotional state. There's no goal to always be at the top — 
                  it's about awareness and gentle movement. Sometimes just naming where you are can bring relief. 
                  Small shifts often feel more sustainable than big jumps.
                </p>
              </div>
            </div>
          </div>

          {averageLevel !== null && (
            <div className="flex items-center justify-between p-4 bg-[var(--surface-elevated)] rounded-xl border border-[var(--border-subtle)] mb-8" data-testid="section-average">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-[var(--primary)]" />
                <span className="text-[var(--text-secondary)]">Your 7-day average</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-semibold text-[var(--text-primary)]">{averageLevel}</span>
                <span className="text-sm text-[var(--text-muted)]">/ 10</span>
              </div>
            </div>
          )}

          <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">
            Where are you right now?
          </h3>

          <div className="space-y-2 mb-8" data-testid="ladder-levels">
            {COHERENCE_LEVELS.map((level) => {
              const isSelected = selectedLevel === level.level;
              return (
                <button
                  key={level.level}
                  onClick={() => setSelectedLevel(level.level)}
                  className={`w-full p-4 rounded-xl border transition-all text-left ${
                    isSelected
                      ? "border-[var(--primary)] bg-[var(--primary-muted)] ring-2 ring-[var(--primary)]"
                      : "border-[var(--border-subtle)] bg-[var(--surface-elevated)] hover:border-[var(--border-default)]"
                  }`}
                  data-testid={`level-${level.level}`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
                      style={{ backgroundColor: level.color }}
                    >
                      {level.level}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-[var(--text-primary)]">{level.label}</p>
                      <p className="text-sm text-[var(--text-secondary)]">{level.description}</p>
                    </div>
                    {isSelected && <Check className="w-5 h-5 text-[var(--primary)]" />}
                  </div>
                </button>
              );
            })}
          </div>

          {selectedLevel && (
            <Card className="mb-8" data-testid="section-selected">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[var(--text-primary)]">
                  <Sparkles className="w-5 h-5 text-[var(--primary)]" />
                  <span className="font-medium">You selected: {levelInfo?.label}</span>
                </div>

                {suggestions.length > 0 && (
                  <div className="p-4 bg-[var(--surface-secondary)] rounded-lg">
                    <p className="text-sm font-medium text-[var(--text-secondary)] mb-2">
                      <MessageCircle className="w-4 h-4 inline mr-2" />
                      Gentle suggestions:
                    </p>
                    <ul className="space-y-1">
                      {suggestions.map((suggestion, idx) => (
                        <li key={idx} className="text-sm text-[var(--text-secondary)]">
                          • {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Optional: Any notes or context? (you can skip this)"
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border-default)] bg-[var(--surface-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
                  data-testid="textarea-note"
                />

                <Button
                  onClick={handleLogLevel}
                  disabled={createMutation.isPending}
                  data-testid="button-log"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Log This Check-In
                </Button>
              </div>
            </Card>
          )}

          {recentEntries.length > 0 && (
            <div className="mt-8" data-testid="section-history">
              <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">
                Recent check-ins
              </h3>
              <div className="grid gap-2">
                {recentEntries.map((entry) => {
                  const level = COHERENCE_LEVELS.find(l => l.level === entry.currentLevel);
                  const prevEntry = entries.find(e => new Date(e.createdAt) < new Date(entry.createdAt));
                  const trend = prevEntry ? entry.currentLevel - prevEntry.currentLevel : 0;
                  
                  return (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between p-3 bg-[var(--surface-elevated)] rounded-lg border border-[var(--border-subtle)]"
                      data-testid={`entry-${entry.id}`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm"
                          style={{ backgroundColor: level?.color || "var(--text-muted)" }}
                        >
                          {entry.currentLevel}
                        </div>
                        <span className="text-[var(--text-primary)]">
                          {level?.label || `Level ${entry.currentLevel}`}
                        </span>
                        {entry.notes && (
                          <span className="text-sm text-[var(--text-muted)]">— {entry.notes}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        {trend !== 0 && (
                          <span className={`flex items-center text-sm ${trend > 0 ? "text-[var(--success)]" : "text-[var(--error)]"}`}>
                            {trend > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                            {Math.abs(trend)}
                          </span>
                        )}
                        <span className="text-sm text-[var(--text-muted)]">
                          {new Date(entry.createdAt).toLocaleDateString()}
                        </span>
                      </div>
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
