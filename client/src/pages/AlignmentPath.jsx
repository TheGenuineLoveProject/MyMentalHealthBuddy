/**
 * AlignmentPath.jsx
 * The 12-Phase Self-Alignment Path™ Page
 * 
 * Educational, reflective, non-religious, non-clinical
 * Optional pathway with opt-out at every step
 */

import { useState } from 'react';
import { Link } from 'wouter';
import { 
  Brain, Heart, Compass, Zap, ChevronRight, ChevronDown,
  Clock, BookOpen, ArrowLeft, Check, Circle
} from 'lucide-react';
import { twelvePhases, pathwayMetadata, getProgress } from '@/content/frameworks/twelvePhaseAlignment.js';
import BenefitsBlock from '@/components/BenefitsBlock';
import { CrisisNotice } from '@/components/PersistentDisclaimer';
import PageTemplate from '@/components/PageTemplate';
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

const domainIcons = {
  Mind: Brain,
  Body: Heart,
  Values: Compass,
  Action: Zap
};

const domainColors = {
  Mind: 'var(--sage-500)',
  Body: 'var(--teal-500)',
  Values: 'var(--rose-500)',
  Action: 'var(--amber-500)'
};

function PhaseCard({ phase, isExpanded, onToggle, isCompleted, onComplete }) {
  const Icon = domainIcons[phase.domain] || Circle;
  const color = domainColors[phase.domain];

  return (
  <WellnessPageShell
    title="AlignmentPath"
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

    <div 
      className={`
        bg-background dark:bg-[hsl(var(--gray-900))] rounded-xl border transition-all duration-300
        ${isExpanded ? 'border-[hsl(var(--sage-300))] dark:border-[hsl(var(--sage-600))] shadow-lg' : 'border-[hsl(var(--sage-200))] dark:border-[hsl(var(--sage-700))] hover:border-[hsl(var(--sage-300))] dark:hover:border-[hsl(var(--sage-600))]'}
      `}
      data-testid={`phase-card-${phase.number}`}
    >
      <button
        onClick={onToggle}
        className="w-full p-5 flex items-center gap-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--sage-500))] focus-visible:ring-inset rounded-xl"
        aria-expanded={isExpanded}
        data-testid={`button-toggle-phase-${phase.number}`}
      >
        <div 
          className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-[hsl(var(--sage-100))] dark:bg-[hsl(var(--sage-800))]"
        >
          {isCompleted ? (
            <Check className="w-6 h-6 text-[hsl(var(--sage-600))] dark:text-[hsl(var(--sage-300))]" />
          ) : (
            <Icon className="w-6 h-6 text-[hsl(var(--sage-600))] dark:text-[hsl(var(--sage-300))]" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Phase {phase.number} · {phase.domain}
            </span>
          </div>
          <h3 className="font-serif text-lg font-semibold text-foreground">
            {phase.name}
          </h3>
          <p className="text-sm text-muted-foreground italic">
            "{phase.tagline}"
          </p>
        </div>

        <div className="flex-shrink-0">
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="px-5 pb-5 border-t border-[hsl(var(--sage-100))] dark:border-[hsl(var(--sage-800))]">
          <div className="pt-4 space-y-4">
            <p className="text-foreground">
              {phase.description}
            </p>

            <div className="bg-[hsl(var(--sage-50))] dark:bg-[hsl(var(--sage-900))] rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[hsl(var(--sage-600))] dark:text-[hsl(var(--sage-300))]" />
                Reflection Question
              </h4>
              <p className="text-[hsl(var(--sage-700))] dark:text-[hsl(var(--sage-300))] italic">
                {phase.reflection}
              </p>
            </div>

            <div className="bg-[hsl(var(--sage-50))] dark:bg-[hsl(var(--sage-900))] rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-2">
                Practice
              </h4>
              <p className="text-foreground">
                {phase.practice}
              </p>
              <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{phase.estimatedTime}</span>
              </div>
            </div>

            {phase.example && (
              <div className="bg-[hsl(var(--teal-50))] dark:bg-[hsl(var(--teal-900))] rounded-lg p-4 border border-[hsl(var(--teal-100))] dark:border-[hsl(var(--teal-700))]">
                <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                  <span className="text-sm">💡</span>
                  Real-Life Example
                </h4>
                <p className="text-[hsl(var(--teal-700))] dark:text-[hsl(var(--teal-300))] italic" data-testid={`text-example-${phase.number}`}>
                  "{phase.example}"
                </p>
              </div>
            )}

            {phase.tinyAction && (
              <div className="bg-[hsl(var(--amber-50))] dark:bg-[hsl(var(--amber-900))] rounded-lg p-4 border border-[hsl(var(--amber-100))] dark:border-[hsl(var(--amber-700))]">
                <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                  <span className="text-sm">⚡</span>
                  Tiny Action (30-90 seconds)
                </h4>
                <p className="text-[hsl(var(--amber-700))] dark:text-[hsl(var(--amber-300))] font-medium" data-testid={`text-tiny-action-${phase.number}`}>
                  {phase.tinyAction}
                </p>
              </div>
            )}

            <div>
              <h4 className="font-medium text-foreground mb-2">
                Journal Prompts
              </h4>
              <ul className="space-y-2">
                {phase.journalPrompts.map((prompt, i) => (
                  <li key={i} className="flex items-start gap-2 text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--sage-400))] dark:bg-[hsl(var(--sage-500))] mt-2 flex-shrink-0" />
                    {prompt}
                  </li>
                ))}
              </ul>
            </div>

            {phase.coreValues && (
              <div>
                <h4 className="font-medium text-foreground mb-2">
                  Core Values to Explore
                </h4>
                <div className="flex flex-wrap gap-2">
                  {phase.coreValues.slice(0, 12).map((value, i) => (
                    <span 
                      key={i}
                      className="px-2 py-1 bg-[hsl(var(--rose-50))] dark:bg-[hsl(var(--rose-900))] text-[hsl(var(--rose-700))] dark:text-[hsl(var(--rose-300))] text-sm rounded-full"
                    >
                      {value}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {phase.suggestedSkills && (
              <div>
                <h4 className="font-medium text-foreground mb-2">
                  Skills to Consider
                </h4>
                <div className="flex flex-wrap gap-2">
                  {phase.suggestedSkills.map((skill, i) => (
                    <span 
                      key={i}
                      className="px-2 py-1 bg-[hsl(var(--amber-50))] dark:bg-[hsl(var(--amber-900))] text-[hsl(var(--amber-700))] dark:text-[hsl(var(--amber-300))] text-sm rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 flex items-center justify-between border-t border-[hsl(var(--sage-100))] dark:border-[hsl(var(--sage-800))]">
              <p className="text-xs text-muted-foreground">
                {phase.canSkip && "You can skip this phase if it doesn't feel right."}
              </p>
              <button
                onClick={() => onComplete(phase.number)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${isCompleted 
                    ? 'bg-[hsl(var(--sage-100))] dark:bg-[hsl(var(--sage-800))] text-[hsl(var(--sage-700))] dark:text-[hsl(var(--sage-300))]' 
                    : 'bg-[hsl(var(--sage-600))] hover:bg-[hsl(var(--sage-700))] text-white'
                  }
                `}
                data-testid={`button-complete-phase-${phase.number}`}
              >
                {isCompleted ? 'Completed' : 'Mark as Explored'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AlignmentPath() {
  const [expandedPhase, setExpandedPhase] = useState(null);
  const [completedPhases, setCompletedPhases] = useState(() => {
    const stored = localStorage.getItem('glp_alignment_progress');
    return stored ? JSON.parse(stored) : [];
  });

  const progress = getProgress(completedPhases);

  const handleToggle = (phaseNumber) => {
    setExpandedPhase(expandedPhase === phaseNumber ? null : phaseNumber);
  };

  const handleComplete = (phaseNumber) => {
    const updated = completedPhases.includes(phaseNumber)
      ? completedPhases.filter(p => p !== phaseNumber)
      : [...completedPhases, phaseNumber];
    
    setCompletedPhases(updated);
    localStorage.setItem('glp_alignment_progress', JSON.stringify(updated));
  };

  return (
    <PageTemplate
      title="The 12-Phase Self-Alignment Path"
      subtitle={pathwayMetadata.tagline}
      showCrisis
    >
      <div className="max-w-3xl mx-auto">
        <Link 
          href="/tools"
          className="inline-flex items-center gap-2 text-[hsl(var(--sage-600))] dark:text-[hsl(var(--sage-400))] hover:text-[hsl(var(--sage-700))] dark:hover:text-[hsl(var(--sage-300))] mb-6"
          data-testid="link-back-tools"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tools
        </Link>

        <BenefitsBlock
          benefit="Self-understanding, values clarity, gentle transformation"
          duration="Self-paced (weeks to months)"
          control="Skip any phase, go in any order, stop anytime"
          disclaimer="Educational self-reflection, not therapy or treatment"
          variant="card"
          className="mb-8"
        />

        <div className="bg-[hsl(var(--amber-50))] dark:bg-[hsl(var(--amber-900))] border border-[hsl(var(--amber-200))] dark:border-[hsl(var(--amber-700))] rounded-lg p-4 mb-8">
          <p className="text-sm text-[hsl(var(--amber-800))] dark:text-[hsl(var(--amber-200))]">
            <strong>About this pathway:</strong> {pathwayMetadata.description}
          </p>
        </div>

        {progress.completed > 0 && (
          <div className="mb-8 p-4 bg-[hsl(var(--sage-50))] dark:bg-[hsl(var(--sage-900))] rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[hsl(var(--sage-700))] dark:text-[hsl(var(--sage-300))]">
                Your Progress
              </span>
              <span className="text-sm text-[hsl(var(--sage-600))] dark:text-[hsl(var(--sage-400))]">
                {progress.completed} of {progress.total} phases explored
              </span>
            </div>
            <div className="h-2 bg-[hsl(var(--sage-200))] dark:bg-[hsl(var(--sage-800))] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[hsl(var(--sage-500))] rounded-full transition-all duration-500"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>
        )}

        <div className="space-y-4 mb-12">
          {twelvePhases.map((phase) => (
            <PhaseCard
              key={phase.number}
              phase={phase}
              isExpanded={expandedPhase === phase.number}
              onToggle={() => handleToggle(phase.number)}
              isCompleted={completedPhases.includes(phase.number)}
              onComplete={handleComplete}
            />
          ))}
        </div>

        <CrisisNotice className="mb-8" />
      </div>
    </PageTemplate>
  </WellnessPageShell>
  );
}
