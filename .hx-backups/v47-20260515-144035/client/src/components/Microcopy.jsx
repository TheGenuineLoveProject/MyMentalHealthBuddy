import { useReadingLevel } from '../context/ReadingLevelContext';
import { pickSlot, wellnessMicrocopy } from '../content/microcopy/wellnessMicrocopy';

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
  
  if (!text) return null;
  
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
