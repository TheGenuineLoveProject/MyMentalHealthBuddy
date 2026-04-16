import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { LayoutWrapper } from "@/components/ui/LayoutWrapper";
import { Hero } from "@/components/ui/Hero";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import SafetyFooter from "@/components/ui/SafetyFooter";
import BenefitsBlock from "@/components/BenefitsBlock";
import ClarityCard from "@/components/content/ClarityCard";
import ExamplesAccordion from "@/components/content/ExamplesAccordion";
import { Layers, ArrowUp, ArrowDown, Check, TrendingUp, MessageCircle, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import { SEO } from "@/components/SEO";
import { MIPromptCard } from "@/components/mi/MIPromptCard";

const COHERENCE_CLARITY = {
  what: "A 10-level emotional awareness scale to track your inner state across body, mind, and heart dimensions.",
  who: "Anyone wanting to build emotional awareness, track mood patterns, or learn to shift emotional states.",
  when: "Daily check-ins, when feeling off, or when you want to consciously shift your emotional state.",
  why: "Naming your emotional state is the first step to understanding and influencing it. Tracking reveals patterns.",
  howSteps: [
    "Select your current emotional level (1-10)",
    "Rate your body, mind, and heart states",
    "Review the suggested shifts for your level",
    "Log your check-in to track patterns over time"
  ],
  whereLinkText: "Explore emotional intelligence",
  whereHref: "/emotional-intelligence"
};

const COHERENCE_EXAMPLES = [
  {
    level: "beginner",
    title: "Naming your current state",
    situation: "You feel 'off' but can't pinpoint what's wrong.",
    action: "Use the Coherence Ladder to identify your level. Perhaps it's a 4 (Frustration) with a tense body and scattered mind.",
    result: "Naming it precisely ('I'm frustrated and my body is tense') creates clarity and opens options."
  },
  {
    level: "intermediate",
    title: "Using shift suggestions",
    situation: "You're at level 3 (Worry/Overwhelm) before an important meeting.",
    action: "Review the suggestions: 'Name what you're feeling without judgment' and 'This feeling is temporary.'",
    result: "The suggestions help you move from overwhelm toward a more resourceful state."
  },
  {
    level: "advanced",
    title: "Tracking patterns over time",
    situation: "You want to understand your emotional patterns better.",
    action: "Log check-ins daily for 2 weeks. Notice: What times/situations correlate with lower states? What helps you shift up?",
    result: "You identify triggers and effective responses, building emotional self-mastery."
  }
];

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

const BODY_STATES = ["Tense", "Tired", "Neutral", "Relaxed", "Energized"];
const MIND_STATES = ["Scattered", "Foggy", "Neutral", "Clear", "Focused"];
const HEART_STATES = ["Closed", "Guarded", "Neutral", "Open", "Expansive"];

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
  const [bodyState, setBodyState] = useState("");
  const [mindState, setMindState] = useState("");
  const [heartState, setHeartState] = useState("");
  const [note, setNote] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["/api/wellness-tools/coherence"],
  });

  const createMutation = useMutation({
    mutationFn: (data) => apiRequest("POST", "/api/wellness-tools/coherence", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wellness-tools/coherence"] });
      setSelectedLevel(null);
      setBodyState("");
      setMindState("");
      setHeartState("");
      setNote("");
      toast({ title: "Check-in logged", description: "Your coherence state has been recorded." });
    },
    onError: () => {
      toast({ title: "Error", description: "Could not save check-in. Please try again.", variant: "destructive" });
    },
  });

  const handleLogLevel = () => {
    if (!selectedLevel) {
      toast({ title: "Select a level", description: "Please select your current emotional level.", variant: "destructive" });
      return;
    }
    createMutation.mutate({
      alignmentLevel: selectedLevel,
      bodyState: bodyState || null,
      mindState: mindState || null,
      heartState: heartState || null,
      integrationNotes: note || null,
    });
  };

  const recentEntries = entries.slice(0, 7);
  const averageLevel = recentEntries.length > 0
    ? Math.round(recentEntries.reduce((sum, e) => sum + (e.alignmentLevel || 0), 0) / recentEntries.length * 10) / 10
    : null;

  const levelInfo = selectedLevel ? COHERENCE_LEVELS.find(l => l.level === selectedLevel) : null;
  const suggestions = selectedLevel ? SHIFT_SUGGESTIONS[selectedLevel] || [] : [];

  return (
  <WellnessPageShell
    title="CoherenceLadderPage"
    subtitle="Educational reflection tools. Choose what feels safe and supportive."
    benefits={pickBenefits(["agency","calm","clarity","selfRespect","meaning"], 5)}
    clarity={{
      what: "A self-paced reflection tool you control.",
      why: "To support clarity, values alignment, and gentle next steps.",
      who: "For adults (18+) who want educational wellness tools (not medical care).",
      when: "Anytime you want a small reset or a thoughtful pause.",
      where: "Anywhere you can breathe and write for 1–5 minutes.",
      how: "Pick one prompt, answer briefly, stop whenever you want."
    }}
    examples={[
      { label: "Beginner", examples: ["Write one honest sentence about how you feel.", "Name one value you want to protect today."] },
      { label: "Intermediate", examples: ["Describe the situation + the need underneath it.", "Write a boundary you could try in one sentence."] },
      { label: "Advanced", examples: ["Identify a pattern and the smallest experiment to change it.", "Write a compassionate reframe and one measurable step."] }
    ]}
  >
      <SEO title="Coherence Ladder — MyMentalHealthBuddy" description="Step-by-step guidance for emotional regulation." />


    <LayoutWrapper>
      <Hero
        title="Coherence Ladder"
        subtitle="Check in with how you're feeling — there's no wrong answer, just awareness"
        variant="wellness"
        data-testid="hero-coherence"
      />
      
      <SectionContainer>
        <BenefitsBlock
          benefit="Emotional awareness, gentle insight, and next-step clarity"
          duration="2–5 minutes"
          control="You define where you are — no judgment"
          disclaimer="Educational wellness support — not medical advice. If you're in crisis, visit /crisis."
          variant="minimal"
          className="mb-6"
        />

        <ClarityCard {...COHERENCE_CLARITY} variant="compact" className="mb-6" />

        <ExamplesAccordion 
          examples={COHERENCE_EXAMPLES} 
          title="See how others use the Coherence Ladder"
          className="mb-8"
        />
      </SectionContainer>

      <SectionContainer variant="default">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[var(--surface-elevated)] p-6 rounded-2xl border border-[var(--border-subtle)] mb-8" data-testid="section-intro">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-[var(--primary-muted)]">
                <Layers className="w-6 h-6 text-[var(--primary)]" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2" data-testid="heading-intro">
                  Understanding your emotional state
                </h2>
                <p className="text-[var(--text-secondary)] leading-relaxed" data-testid="text-intro">
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
                <span className="text-[var(--text-secondary)]" data-testid="label-average">Your 7-day average</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-semibold text-[var(--text-primary)]" data-testid="value-average">{averageLevel}</span>
                <span className="text-sm text-[var(--text-muted)]">/ 10</span>
              </div>
            </div>
          )}

          <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4" data-testid="heading-where">
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
                  aria-pressed={isSelected}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
                      style={{ backgroundColor: level.color }}
                    >
                      {level.level}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-[var(--text-primary)]" data-testid={`text-level-label-${level.level}`}>{level.label}</p>
                      <p className="text-sm text-[var(--text-secondary)]" data-testid={`text-level-desc-${level.level}`}>{level.description}</p>
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
                  <span className="font-medium" data-testid="text-selected-level">You selected: {levelInfo?.label}</span>
                </div>

                {suggestions.length > 0 && (
                  <div className="p-4 bg-[var(--surface-secondary)] rounded-lg">
                    <p className="text-sm font-medium text-[var(--text-secondary)] mb-2" data-testid="label-suggestions">
                      <MessageCircle className="w-4 h-4 inline mr-2" />
                      Gentle suggestions:
                    </p>
                    <ul className="space-y-1" data-testid="list-suggestions">
                      {suggestions.map((suggestion, idx) => (
                        <li key={idx} className="text-sm text-[var(--text-secondary)]" data-testid={`text-suggestion-${idx}`}>
                          • {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2" data-testid="label-body-state">Body</label>
                    <select
                      value={bodyState}
                      onChange={(e) => setBodyState(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--surface-primary)] text-[var(--text-primary)]"
                      data-testid="select-body-state"
                    >
                      <option value="">Select...</option>
                      {BODY_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2" data-testid="label-mind-state">Mind</label>
                    <select
                      value={mindState}
                      onChange={(e) => setMindState(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--surface-primary)] text-[var(--text-primary)]"
                      data-testid="select-mind-state"
                    >
                      <option value="">Select...</option>
                      {MIND_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2" data-testid="label-heart-state">Heart</label>
                    <select
                      value={heartState}
                      onChange={(e) => setHeartState(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--surface-primary)] text-[var(--text-primary)]"
                      data-testid="select-heart-state"
                    >
                      <option value="">Select...</option>
                      {HEART_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2" htmlFor="integration-notes" data-testid="label-notes">
                    Notes (optional)
                  </label>
                  <textarea
                    id="integration-notes"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Any notes or context? (you can skip this)"
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border-default)] bg-[var(--surface-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
                    data-testid="textarea-note"
                  />
                </div>

                <Button
                  onClick={handleLogLevel}
                  disabled={createMutation.isPending}
                  data-testid="button-log"
                >
                  {createMutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin motion-reduce:animate-none" />
                      Saving...
                    </span>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Log This Check-In
                    </>
                  )}
                </Button>
              </div>
            </Card>
          )}

          {recentEntries.length > 0 && (
            <div className="mt-8" data-testid="section-history">
              <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4" data-testid="heading-history">
                Recent check-ins
              </h3>
              <div className="grid gap-2">
                {recentEntries.map((entry, idx) => {
                  const level = COHERENCE_LEVELS.find(l => l.level === entry.alignmentLevel);
                  const prevEntry = recentEntries[idx + 1];
                  const trend = prevEntry ? (entry.alignmentLevel || 0) - (prevEntry.alignmentLevel || 0) : 0;
                  
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
                          data-testid={`badge-level-${entry.id}`}
                        >
                          {entry.alignmentLevel}
                        </div>
                        <span className="text-[var(--text-primary)]" data-testid={`text-level-${entry.id}`}>
                          {level?.label || `Level ${entry.alignmentLevel}`}
                        </span>
                        {entry.integrationNotes && (
                          <span className="text-sm text-[var(--text-muted)]" data-testid={`text-notes-${entry.id}`}>— {entry.integrationNotes}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        {trend !== 0 && (
                          <span className={`flex items-center text-sm ${trend > 0 ? "text-[var(--success)]" : "text-[var(--error)]"}`} data-testid={`trend-${entry.id}`}>
                            {trend > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                            {Math.abs(trend)}
                          </span>
                        )}
                        <span className="text-sm text-[var(--text-muted)]" data-testid={`date-${entry.id}`}>
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
              <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin motion-reduce:animate-none mx-auto" />
              <p className="text-sm text-[var(--text-muted)] mt-2">Loading your check-ins...</p>
            </div>
          )}
        </div>
      </SectionContainer>

      <MIPromptCard context="mood" className="mt-8 mb-6" />

      <SafetyFooter />
    </LayoutWrapper>
  </WellnessPageShell>
  );
}
