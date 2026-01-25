import { useState, useEffect } from "react";
import {
  PHILOSOPHICAL_QUESTIONS,
  DOMAIN_LABELS,
  createStancePosition,
  createPhilosophicalProfile,
  savePhilosophicalProfile,
  getPhilosophicalProfile,
  getQuestionById,
  inferWorldview,
  findTensionsInPositions,
  type PhilosophicalProfile,
  type PhilosophicalQuestion,
  type StancePosition
} from "@/lib/stance/philosophicalStance";
import { MapPin, ChevronRight } from "lucide-react";
import { SEO } from "@/components/SEO";
import SafetyFooter from "@/components/ui/SafetyFooter";

export default function PhilosophicalStanceMapper() {
  const [profile, setProfile] = useState<PhilosophicalProfile | null>(null);
  const [activeQuestion, setActiveQuestion] = useState<PhilosophicalQuestion | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<PhilosophicalQuestion["domain"] | null>(null);
  const [currentPosition, setCurrentPosition] = useState(50);
  const [currentConfidence, setCurrentConfidence] = useState(50);
  const [currentReasoning, setCurrentReasoning] = useState("");

  useEffect(() => {
    const stored = getPhilosophicalProfile();
    setProfile(stored || createPhilosophicalProfile());
  }, []);

  function handleSavePosition() {
    if (!profile || !activeQuestion || !currentReasoning.trim()) return;
    
    const position = createStancePosition(
      activeQuestion.id,
      currentPosition,
      currentConfidence,
      currentReasoning
    );
    
    const existingIdx = profile.positions.findIndex(p => p.questionId === activeQuestion.id);
    const updatedPositions = existingIdx >= 0
      ? profile.positions.map((p, i) => i === existingIdx ? position : p)
      : [...profile.positions, position];
    
    const updated = { ...profile, positions: updatedPositions };
    savePhilosophicalProfile(updated);
    setProfile(updated);
    setActiveQuestion(null);
    setCurrentPosition(50);
    setCurrentConfidence(50);
    setCurrentReasoning("");
  }

  function handleSelectQuestion(question: PhilosophicalQuestion) {
    const existing = profile?.positions.find(p => p.questionId === question.id);
    if (existing) {
      setCurrentPosition(existing.position);
      setCurrentConfidence(existing.confidence);
      setCurrentReasoning(existing.reasoning);
    } else {
      setCurrentPosition(50);
      setCurrentConfidence(50);
      setCurrentReasoning("");
    }
    setActiveQuestion(question);
  }

  if (!profile) return (
    <div className="min-h-screen safe-padding hero-gradient">
      <SEO title="Philosophical Stance Mapper — The Genuine Love Project" description="Explore philosophical stance mapper tools for your wellness journey." />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Philosophical Stance Mapper</h1>
        <p className="text-muted-foreground mb-8">
          This page is being refined. Use the navigation to explore tools while we finish this section.
        </p>
        <SafetyFooter />
      </main>
    </div>
  );

  const worldview = inferWorldview(profile.positions);
  const tensions = findTensionsInPositions(profile.positions);

  const filteredQuestions = selectedDomain
    ? PHILOSOPHICAL_QUESTIONS.filter(q => q.domain === selectedDomain)
    : PHILOSOPHICAL_QUESTIONS;

  if (activeQuestion) {
    const existingPosition = profile.positions.find(p => p.questionId === activeQuestion.id);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 capitalize">
              {DOMAIN_LABELS[activeQuestion.domain].label}
            </span>
          </div>
          <button
            onClick={() => setActiveQuestion(null)}
            className="text-sm opacity-70 hover:opacity-100"
            data-testid="button-exit-question"
          >
            Back
          </button>
        </div>

        <h2 className="text-xl font-semibold">{activeQuestion.question}</h2>
        <p className="text-sm opacity-80">{activeQuestion.description}</p>

        <div className="rounded-xl border border-white/10 bg-black/10 p-4">
          <div className="flex justify-between mb-2 text-sm">
            <span className="opacity-70">{activeQuestion.poles[0]}</span>
            <span className="opacity-70">{activeQuestion.poles[1]}</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={currentPosition}
            onChange={(e) => setCurrentPosition(parseInt(e.target.value))}
            className="w-full mb-4"
            data-testid="slider-position"
          />
          
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm opacity-60">Confidence: {currentConfidence}%</span>
            <input
              type="range"
              min="0"
              max="100"
              value={currentConfidence}
              onChange={(e) => setCurrentConfidence(parseInt(e.target.value))}
              className="flex-1"
              data-testid="slider-confidence"
            />
          </div>

          <textarea
            value={currentReasoning}
            onChange={(e) => setCurrentReasoning(e.target.value)}
            placeholder="Why do you hold this position? What informs your view?"
            className="w-full rounded-lg border border-white/10 bg-black/20 p-3 min-h-[120px] text-sm mb-3"
            data-testid="input-reasoning"
          />

          <button
            onClick={handleSavePosition}
            disabled={!currentReasoning.trim()}
            className="rounded-lg bg-violet-500/20 border border-violet-500/30 px-4 py-2 text-sm disabled:opacity-40"
            data-testid="button-save-position"
          >
            {existingPosition ? "Update Position" : "Save Position"}
          </button>
        </div>

        {activeQuestion.relatedThinkers.length > 0 && (
          <div className="text-sm opacity-60">
            <span className="font-medium">Related thinkers: </span>
            {activeQuestion.relatedThinkers.join(", ")}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MapPin className="h-5 w-5 text-violet-400" />
        <h2 className="text-xl font-semibold">Philosophical Stance Mapper</h2>
      </div>

      <p className="text-sm opacity-80">
        Where do you stand on the big questions? This isn't about finding the "right" answers — 
        it's about knowing your own mind and how your positions relate.
      </p>

      {profile.positions.length >= 3 && (
        <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Your Philosophical Profile</span>
            <span className="text-sm px-2 py-0.5 rounded-full bg-white/10">{worldview}</span>
          </div>
          <p className="text-sm opacity-70">
            Based on {profile.positions.length} positions mapped.
          </p>
          {tensions.length > 0 && (
            <div className="mt-3 pt-3 border-t border-white/10">
              <span className="text-xs font-medium text-amber-400">Potential Tension:</span>
              <p className="text-xs opacity-70 mt-1">{tensions[0].tension}</p>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedDomain(null)}
          className={`rounded-lg px-3 py-1.5 text-xs ${!selectedDomain ? "bg-white/20" : "bg-white/5"}`}
          data-testid="button-domain-all"
        >
          All
        </button>
        {Object.entries(DOMAIN_LABELS).map(([id, { label }]) => (
          <button
            key={id}
            onClick={() => setSelectedDomain(id as PhilosophicalQuestion["domain"])}
            className={`rounded-lg px-3 py-1.5 text-xs ${selectedDomain === id ? "bg-white/20" : "bg-white/5"}`}
            data-testid={`button-domain-${id}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-3">
        {filteredQuestions.map(question => {
          const hasPosition = profile.positions.some(p => p.questionId === question.id);
          return (
            <button
              key={question.id}
              onClick={() => handleSelectQuestion(question)}
              className={`rounded-xl border p-4 text-left hover:bg-white/5 ${
                hasPosition ? "border-violet-500/30 bg-violet-500/5" : "border-white/10 bg-black/10"
              }`}
              data-testid={`button-question-${question.id}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium">{question.question}</h4>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 capitalize mt-1 inline-block">
                    {DOMAIN_LABELS[question.domain].label}
                  </span>
                </div>
                <ChevronRight className="h-4 w-4 opacity-40" />
              </div>
              <div className="flex justify-between mt-2 text-xs opacity-50">
                <span>{question.poles[0]}</span>
                <span>{question.poles[1]}</span>
              </div>
              {hasPosition && (
                <div className="mt-2 text-xs text-violet-400">Position recorded</div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
