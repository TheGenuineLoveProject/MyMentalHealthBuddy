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
    <div 
      className={`
        bg-white rounded-xl border transition-all duration-300
        ${isExpanded ? 'border-[var(--sage-300)] shadow-lg' : 'border-[var(--sage-200)] hover:border-[var(--sage-300)]'}
      `}
      data-testid={`phase-card-${phase.number}`}
    >
      <button
        onClick={onToggle}
        className="w-full p-5 flex items-center gap-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sage-500)] focus-visible:ring-inset rounded-xl"
        aria-expanded={isExpanded}
        data-testid={`button-toggle-phase-${phase.number}`}
      >
        <div 
          className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `color-mix(in srgb, ${color} 15%, white)` }}
        >
          {isCompleted ? (
            <Check className="w-6 h-6" style={{ color }} />
          ) : (
            <Icon className="w-6 h-6" style={{ color }} />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wide">
              Phase {phase.number} · {phase.domain}
            </span>
          </div>
          <h3 className="font-serif text-lg font-semibold text-[var(--neutral-900)]">
            {phase.name}
          </h3>
          <p className="text-sm text-[var(--neutral-600)] italic">
            "{phase.tagline}"
          </p>
        </div>

        <div className="flex-shrink-0">
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-[var(--neutral-400)]" />
          ) : (
            <ChevronRight className="w-5 h-5 text-[var(--neutral-400)]" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="px-5 pb-5 border-t border-[var(--sage-100)]">
          <div className="pt-4 space-y-4">
            <p className="text-[var(--neutral-700)]">
              {phase.description}
            </p>

            <div className="bg-[var(--cream-50)] rounded-lg p-4">
              <h4 className="font-medium text-[var(--neutral-800)] mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[var(--sage-600)]" />
                Reflection Question
              </h4>
              <p className="text-[var(--sage-700)] italic">
                {phase.reflection}
              </p>
            </div>

            <div className="bg-[var(--sage-50)] rounded-lg p-4">
              <h4 className="font-medium text-[var(--neutral-800)] mb-2">
                Practice
              </h4>
              <p className="text-[var(--neutral-700)]">
                {phase.practice}
              </p>
              <div className="mt-2 flex items-center gap-2 text-xs text-[var(--neutral-500)]">
                <Clock className="w-3 h-3" />
                <span>{phase.estimatedTime}</span>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-[var(--neutral-800)] mb-2">
                Journal Prompts
              </h4>
              <ul className="space-y-2">
                {phase.journalPrompts.map((prompt, i) => (
                  <li key={i} className="flex items-start gap-2 text-[var(--neutral-600)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--sage-400)] mt-2 flex-shrink-0" />
                    {prompt}
                  </li>
                ))}
              </ul>
            </div>

            {phase.coreValues && (
              <div>
                <h4 className="font-medium text-[var(--neutral-800)] mb-2">
                  Core Values to Explore
                </h4>
                <div className="flex flex-wrap gap-2">
                  {phase.coreValues.slice(0, 12).map((value, i) => (
                    <span 
                      key={i}
                      className="px-2 py-1 bg-[var(--rose-50)] text-[var(--rose-700)] text-sm rounded-full"
                    >
                      {value}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {phase.suggestedSkills && (
              <div>
                <h4 className="font-medium text-[var(--neutral-800)] mb-2">
                  Skills to Consider
                </h4>
                <div className="flex flex-wrap gap-2">
                  {phase.suggestedSkills.map((skill, i) => (
                    <span 
                      key={i}
                      className="px-2 py-1 bg-[var(--amber-50)] text-[var(--amber-700)] text-sm rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 flex items-center justify-between border-t border-[var(--sage-100)]">
              <p className="text-xs text-[var(--neutral-500)]">
                {phase.canSkip && "You can skip this phase if it doesn't feel right."}
              </p>
              <button
                onClick={() => onComplete(phase.number)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${isCompleted 
                    ? 'bg-[var(--sage-100)] text-[var(--sage-700)]' 
                    : 'bg-[var(--sage-600)] hover:bg-[var(--sage-700)] text-white'
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
          className="inline-flex items-center gap-2 text-[var(--sage-600)] hover:text-[var(--sage-700)] mb-6"
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

        <div className="bg-[var(--amber-50)] border border-[var(--amber-200)] rounded-lg p-4 mb-8">
          <p className="text-sm text-[var(--amber-800)]">
            <strong>About this pathway:</strong> {pathwayMetadata.description}
          </p>
        </div>

        {progress.completed > 0 && (
          <div className="mb-8 p-4 bg-[var(--sage-50)] rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[var(--sage-700)]">
                Your Progress
              </span>
              <span className="text-sm text-[var(--sage-600)]">
                {progress.completed} of {progress.total} phases explored
              </span>
            </div>
            <div className="h-2 bg-[var(--sage-200)] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[var(--sage-500)] rounded-full transition-all duration-500"
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
  );
}
