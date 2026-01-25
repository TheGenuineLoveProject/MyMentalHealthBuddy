import { useReadingLevel } from '../context/ReadingLevelContext';
import { pickSlot, wellnessMicrocopy } from '../content/microcopy/wellnessMicrocopy';
import { SEO } from "@/components/SEO";
import SafetyFooter from "@/components/ui/SafetyFooter";

const READING_LEVEL_MAP = {
  beginner: 'beginner',
  intermediate: 'intermediate',
  advanced: 'advanced',
  standard: 'intermediate',
  deep: 'advanced'
};

export function pickMicrocopy(slot, level = 'intermediate', seed = '') {
  const normalizedLevel = READING_LEVEL_MAP[level] || 'intermediate';
  return pickSlot(slot, normalizedLevel, seed);
}

export default function Microcopy({ 
  slot, 
  seed = '', 
  level = null,
  as: Component = 'span',
  className = '',
  ...props 
}) {
  const { readingLevel } = useReadingLevel();
  const effectiveLevel = READING_LEVEL_MAP[level || readingLevel] || 'intermediate';
  const text = pickSlot(slot, effectiveLevel, seed);
  
  if (!text) return (
    <div className="min-h-screen safe-padding hero-gradient">
      <SEO title="Microcopy — The Genuine Love Project" description="Explore microcopy tools for your wellness journey." />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Microcopy</h1>
        <p className="text-muted-foreground mb-8">
          This page is being refined. Use the navigation to explore tools while we finish this section.
        </p>
        <SafetyFooter />
      </main>
    </div>
  );
  
  return (
    <Component 
      className={className} 
      data-testid={`microcopy-${slot}`}
      {...props}
    >
      {text}
    </Component>
  );
}

export const SLOT_PAGE_MAPPING = {
  hero: ['consent', 'pacing'],
  practiceCard: ['ctaPrimary', 'consent'],
  journalEntry: ['journalingPrompts', 'encouragement', 'successStates'],
  formSubmit: ['ctaPrimary', 'emotionalValidation'],
  formCancel: ['ctaSecondary'],
  emptyState: ['emptyStates', 'encouragement'],
  successToast: ['successStates'],
  errorToast: ['errorStates'],
  safetyFooter: ['safety'],
  tierSelector: ['tierSelectors'],
  exitPrompt: ['ctaSecondary', 'pacing']
};

export { wellnessMicrocopy, pickSlot };
