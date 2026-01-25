import { useState } from "react";
import { LayoutWrapper } from "@/components/ui/LayoutWrapper";
import { Hero } from "@/components/ui/Hero";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Card, CardGrid } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import SafetyFooter from "@/components/ui/SafetyFooter";
import BenefitsBlock from "@/components/BenefitsBlock";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import { 
  Brain, 
  Filter, 
  Shield, 
  Heart, 
  Sparkles, 
  Pause, 
  Eye,
  ArrowRight,
  CheckCircle,
  MessageCircle,
  Activity,
  Zap,
  Hand
} from "lucide-react";

const REFINEMENT_PRACTICES = [
  {
    id: "perception-interpretation",
    title: "Separate Perception from Interpretation",
    icon: Pause,
    color: "var(--primary)",
    description: "Insert a pause between noticing and meaning-making",
    insight: "Right now, your system does this automatically: sensation → meaning → moral conclusion → body distress",
    practice: "When you notice a reaction, say internally: \"I'm noticing a reaction. I don't need to decide what it means.\"",
    benefit: "This keeps perception informational, not judgmental.",
    affirmation: "I can notice without concluding."
  },
  {
    id: "truth-to-data",
    title: "Downgrade Perception from 'Truth' to 'Data'",
    icon: Filter,
    color: "var(--secondary)",
    description: "Perceptions are data points, not absolute truths",
    insight: "Your childhood trained you to treat noticing as dangerous truth.",
    practice: "Remind yourself: Perceptions are data points. Data points are incomplete. Incomplete data does not require action.",
    benefit: "You are allowed to notice without concluding. That is refinement.",
    affirmation: "My perceptions are information, not commands."
  },
  {
    id: "insight-to-boundaries",
    title: "Move Insight into Boundaries",
    icon: Shield,
    color: "var(--accent)",
    description: "Let external boundaries do the work instead of your body",
    insight: "Your body is doing too much work: bracing, tensing, absorbing.",
    practice: "Use external boundaries: shortening time around triggering people, leaving earlier, changing topics, lowering exposure.",
    benefit: "That's not avoidance. That's skill.",
    affirmation: "My boundaries protect me so my body doesn't have to."
  },
  {
    id: "moral-reflex",
    title: "Retrain the Moral Reflex",
    icon: Heart,
    color: "var(--success)",
    description: "Release the rule that seeing equals responsibility",
    insight: "Your system learned: \"If I see something wrong and don't act, I am complicit.\" That rule was formed under abuse.",
    practice: "Practice the refined rule: \"I am responsible for my behavior, not for managing truth in others.\"",
    benefit: "Integrity ≠ intervention. Integrity ≠ endurance. Integrity ≠ suffering.",
    affirmation: "I can witness without carrying."
  },
  {
    id: "reclaim-choice",
    title: "Reclaim Choice",
    icon: Sparkles,
    color: "var(--warning)",
    description: "Refinement gives you choice back",
    insight: "You get to choose: when to engage, when to disengage, when to stay silent, when to speak, when something is not your work.",
    practice: "Remember: Silence can be wisdom. Distance can be wisdom. Rest can be integrity.",
    benefit: "Your choices are valid expressions of discernment.",
    affirmation: "I choose what I hold and what I release."
  }
];

const GROUNDING_OPTIONS = [
  { id: "overstimulated", label: "Mentally overstimulated", icon: Brain, suggestion: "Try a 5-minute digital detox or close your eyes and breathe slowly." },
  { id: "flooded", label: "Emotionally flooded", icon: Heart, suggestion: "Place a hand on your heart. You don't have to process everything right now." },
  { id: "tense", label: "Physically tense or buzzing", icon: Activity, suggestion: "Shake your hands, roll your shoulders, or take 3 slow breaths." },
  { id: "too-much", label: "Afraid of being 'too much'", icon: Eye, suggestion: "You are not too much. Your sensitivity is not a flaw — it's data about your nervous system." },
  { id: "okay", label: "I'm okay right now", icon: CheckCircle, suggestion: "That's wonderful. Take a moment to notice what 'okay' feels like in your body." }
];

export default function PerceptionRefinementPage() {
  const [activePractice, setActivePractice] = useState(null);
  const [groundingSelection, setGroundingSelection] = useState(null);
  const [practiceComplete, setPracticeComplete] = useState({});

  const handlePracticeComplete = (practiceId) => {
    setPracticeComplete(prev => ({ ...prev, [practiceId]: true }));
    setActivePractice(null);
  };

  const completedCount = Object.keys(practiceComplete).length;

  return (
  <WellnessPageShell
    title="PerceptionRefinementPage"
    subtitle="Educational reflection tools. Choose what feels safe and supportive."
    benefits={pickBenefits(["Agency","Calm","Clarity","Self-respect","Your pace"], 5)}
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

    <LayoutWrapper>
      <Hero
        title="Perception Refinement"
        subtitle="Help your insight flow without overwhelming your nervous system — filtering, not amplifying"
        variant="wellness"
        data-testid="hero-perception-refinement"
      />
      
      <SectionContainer>
        <BenefitsBlock
          benefit="Nervous system regulation, clearer perception, and reduced overwhelm"
          duration="5–10 minutes"
          control="Pause or stop anytime — you're in charge"
          disclaimer="Educational wellness support — not medical advice. If you're in crisis, visit /crisis."
          variant="minimal"
          className="mb-6"
        />
      </SectionContainer>

      <SectionContainer variant="default">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[var(--surface-elevated)] p-6 rounded-2xl border border-[var(--border-subtle)] mb-8" data-testid="section-intro">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-[var(--primary-muted)]">
                <Filter className="w-6 h-6 text-[var(--primary)]" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2" data-testid="heading-intro">
                  The work is not amplification — it's filtering
                </h2>
                <p className="text-[var(--text-secondary)] leading-relaxed mb-4" data-testid="text-intro">
                  You don't need sharper insight or to see more. You already have too much signal coming in. 
                  Refinement means keeping your awareness while giving your nervous system relief.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs px-3 py-1 rounded-full bg-[var(--surface-secondary)] text-[var(--text-muted)]">
                    Nervous system regulation
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full bg-[var(--surface-secondary)] text-[var(--text-muted)]">
                    Trauma-informed
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full bg-[var(--surface-secondary)] text-[var(--text-muted)]">
                    Boundary work
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-8" data-testid="note-what-not-needed">
            <h3 className="font-medium text-amber-800 dark:text-amber-200 mb-2 flex items-center gap-2">
              <Hand className="w-4 h-4" />
              What does not need refining
            </h3>
            <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
              <li>• You do not need sharper insight</li>
              <li>• You do not need to "see more"</li>
              <li>• You do not need to analyze people better</li>
              <li>• You do not need moral purification</li>
            </ul>
          </div>

          {completedCount > 0 && (
            <div className="flex items-center gap-2 mb-6 p-3 rounded-xl bg-[var(--success-muted)] text-[var(--success)]" data-testid="progress-indicator">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">
                {completedCount} of {REFINEMENT_PRACTICES.length} practices explored
              </span>
            </div>
          )}

          <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4" data-testid="heading-practices">
            Five Refinement Practices
          </h3>

          <div className="space-y-4 mb-12">
            {REFINEMENT_PRACTICES.map((practice, idx) => {
              const Icon = practice.icon;
              const isActive = activePractice === practice.id;
              const isComplete = practiceComplete[practice.id];

              return (
                <div
                  key={practice.id}
                  className={`rounded-2xl border transition-all ${
                    isActive 
                      ? "border-[var(--primary)] bg-[var(--surface-elevated)] shadow-lg" 
                      : "border-[var(--border-subtle)] bg-[var(--surface-primary)] hover:border-[var(--border-default)]"
                  }`}
                  data-testid={`card-practice-${practice.id}`}
                >
                  <button
                    onClick={() => setActivePractice(isActive ? null : practice.id)}
                    className="w-full p-5 flex items-center gap-4 text-left"
                    aria-expanded={isActive}
                    data-testid={`button-toggle-${practice.id}`}
                  >
                    <div 
                      className="p-3 rounded-xl flex-shrink-0"
                      style={{ backgroundColor: `${practice.color}20` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: practice.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-[var(--text-muted)]">
                          Practice {idx + 1}
                        </span>
                        {isComplete && (
                          <CheckCircle className="w-4 h-4 text-[var(--success)]" />
                        )}
                      </div>
                      <h4 className="font-semibold text-[var(--text-primary)] truncate">
                        {practice.title}
                      </h4>
                      <p className="text-sm text-[var(--text-secondary)] truncate">
                        {practice.description}
                      </p>
                    </div>
                    <ArrowRight 
                      className={`w-5 h-5 text-[var(--text-muted)] transition-transform ${isActive ? "rotate-90" : ""}`} 
                    />
                  </button>

                  {isActive && (
                    <div className="px-5 pb-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200" data-testid={`content-${practice.id}`}>
                      <div className="h-px bg-[var(--border-subtle)]" />
                      
                      <div className="bg-[var(--surface-secondary)] rounded-xl p-4">
                        <h5 className="text-sm font-medium text-[var(--text-muted)] mb-2">The Pattern</h5>
                        <p className="text-[var(--text-primary)]" data-testid={`text-insight-${practice.id}`}>
                          {practice.insight}
                        </p>
                      </div>

                      <div className="bg-[var(--primary-muted)] rounded-xl p-4">
                        <h5 className="text-sm font-medium text-[var(--primary)] mb-2 flex items-center gap-2">
                          <Zap className="w-4 h-4" />
                          Practice
                        </h5>
                        <p className="text-[var(--text-primary)] font-medium" data-testid={`text-practice-${practice.id}`}>
                          {practice.practice}
                        </p>
                      </div>

                      <p className="text-[var(--text-secondary)] italic" data-testid={`text-benefit-${practice.id}`}>
                        {practice.benefit}
                      </p>

                      <div className="bg-[var(--surface-tertiary)] rounded-xl p-4 border-l-4 border-[var(--primary)]">
                        <p className="text-[var(--text-primary)] font-medium text-center" data-testid={`text-affirmation-${practice.id}`}>
                          "{practice.affirmation}"
                        </p>
                      </div>

                      <Button
                        onClick={() => handlePracticeComplete(practice.id)}
                        variant="secondary"
                        className="w-full"
                        data-testid={`button-complete-${practice.id}`}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        I've practiced this
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="bg-[var(--surface-elevated)] rounded-2xl border border-[var(--border-subtle)] p-6 mb-8" data-testid="section-core-shift">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-[var(--primary)]" />
              The Core Shift
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <span className="text-xs font-medium text-red-600 dark:text-red-400 block mb-1">Old rule</span>
                <p className="text-red-800 dark:text-red-200 font-medium" data-testid="text-old-rule">
                  "If I see it, I must carry it."
                </p>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 block mb-1">Refined rule</span>
                <p className="text-emerald-800 dark:text-emerald-200 font-medium" data-testid="text-refined-rule">
                  "I can notice without holding."
                </p>
              </div>
            </div>
            <p className="text-sm text-[var(--text-muted)] mt-4 text-center">
              Say it often. Out loud if needed.
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-8" data-testid="note-grounding">
            <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
              Important grounding note
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
              When people who were abused for noticing truth feel overwhelmed, the mind sometimes frames insight as special, dangerous, or absolute. That framing increases suffering.
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              We keep this healthy by staying in: psychology, nervous system regulation, and choice and agency. Not destiny. Not burden. Not moral mission.
            </p>
          </div>

          <div className="bg-[var(--surface-elevated)] rounded-2xl border border-[var(--border-subtle)] p-6" data-testid="section-check-in">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2 flex items-center gap-2">
              <Heart className="w-5 h-5 text-[var(--primary)]" />
              Gentle Check-In
            </h3>
            <p className="text-[var(--text-secondary)] mb-4">
              Right now, do you feel more:
            </p>
            
            <div className="space-y-2 mb-4">
              {GROUNDING_OPTIONS.map((option) => {
                const Icon = option.icon;
                const isSelected = groundingSelection === option.id;

                return (
                  <button
                    key={option.id}
                    onClick={() => setGroundingSelection(option.id)}
                    className={`w-full p-4 rounded-xl border text-left transition-all flex items-center gap-3 ${
                      isSelected
                        ? "border-[var(--primary)] bg-[var(--primary-muted)]"
                        : "border-[var(--border-subtle)] bg-[var(--surface-primary)] hover:border-[var(--border-default)]"
                    }`}
                    data-testid={`button-grounding-${option.id}`}
                  >
                    <Icon className={`w-5 h-5 ${isSelected ? "text-[var(--primary)]" : "text-[var(--text-muted)]"}`} />
                    <span className={isSelected ? "text-[var(--primary)] font-medium" : "text-[var(--text-primary)]"}>
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {groundingSelection && (
              <div 
                className="p-4 rounded-xl bg-[var(--surface-secondary)] animate-in fade-in slide-in-from-top-2"
                data-testid="grounding-response"
              >
                <p className="text-[var(--text-primary)]">
                  {GROUNDING_OPTIONS.find(o => o.id === groundingSelection)?.suggestion}
                </p>
              </div>
            )}

            <p className="text-sm text-[var(--text-muted)] mt-4 text-center italic">
              You don't need to be refined into something else.<br />
              You need to be supported into balance.
            </p>
          </div>
        </div>
      </SectionContainer>

      <SafetyFooter />
    </LayoutWrapper>
  </WellnessPageShell>
  );
}
