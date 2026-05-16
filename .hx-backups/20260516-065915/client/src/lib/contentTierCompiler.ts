/**
 * Content Tier Compiler
 * Transforms concepts into Beginner/Intermediate/Advanced versions
 * Following trauma-informed, evidence-based language guidelines
 */

export type ContentLevel = 'beginner' | 'intermediate' | 'advanced';

export interface TieredContent {
  beginner: string;
  intermediate: string;
  advanced: string;
}

export interface ContentBlock {
  title: TieredContent;
  description: TieredContent;
  steps?: TieredContent[];
  benefits?: TieredContent;
  practice?: TieredContent;
}

const LANGUAGE_RULES = {
  beginner: {
    maxSentenceWords: 12,
    tone: 'simple, concrete, reassuring',
    avoid: ['jargon', 'abstractions', 'complex sentences'],
    include: ['safety cues', 'permission language', 'concrete examples']
  },
  intermediate: {
    maxSentenceWords: 20,
    tone: 'clear, supportive, informative',
    avoid: ['clinical terms', 'pressure language'],
    include: ['simple metaphors', 'light structure', 'why it works']
  },
  advanced: {
    maxSentenceWords: 30,
    tone: 'nuanced, research-informed, sophisticated',
    avoid: ['medical claims', 'guarantees'],
    include: ['mechanisms', 'frameworks', 'evidence context']
  }
};

const SAFETY_PHRASES = {
  beginner: [
    "You're safe to go slow.",
    "Only try what feels okay.",
    "You can stop any time."
  ],
  intermediate: [
    "Proceed at your own pace.",
    "Modify as needed for your comfort.",
    "There's no right way to do this."
  ],
  advanced: [
    "Self-attunement is central to this practice.",
    "Adapt the approach to your nervous system's needs.",
    "Integration happens at its own pace."
  ]
};

const EVIDENCE_PHRASES = {
  beginner: [
    "Many people find this helpful.",
    "This is a gentle way to feel calmer.",
    "You might notice a small change."
  ],
  intermediate: [
    "Research suggests this may support wellbeing.",
    "Some people notice improvements over time.",
    "This approach is commonly used in wellness practices."
  ],
  advanced: [
    "Evidence indicates potential benefits for nervous system regulation.",
    "Studies explore the mechanisms underlying this practice.",
    "Theoretical frameworks suggest pathways for integration."
  ]
};

export function getLevelLabel(level: ContentLevel): string {
  const labels = {
    beginner: 'Beginner',
    intermediate: 'Intermediate', 
    advanced: 'Advanced'
  };
  return labels[level];
}

export function getSafetyPhrase(level: ContentLevel, seed: number = 0): string {
  const phrases = SAFETY_PHRASES[level];
  return phrases[seed % phrases.length];
}

export function getEvidencePhrase(level: ContentLevel, seed: number = 0): string {
  const phrases = EVIDENCE_PHRASES[level];
  return phrases[seed % phrases.length];
}

export function selectByLevel<T>(content: Record<ContentLevel, T>, level: ContentLevel): T {
  return content[level] || content.intermediate;
}

export function createTieredDescription(concept: string): TieredContent {
  return {
    beginner: `A simple way to help you feel ${concept}.`,
    intermediate: `A practice that may support ${concept} through gentle awareness.`,
    advanced: `An evidence-informed approach to ${concept}, integrating somatic and cognitive elements.`
  };
}

export function createTieredSteps(steps: string[]): TieredContent[] {
  return steps.map((step, idx) => ({
    beginner: step.split('.')[0] + '.',
    intermediate: step,
    advanced: `Step ${idx + 1}: ${step} This supports nervous system regulation.`
  }));
}

export function wrapWithSafety(content: string, level: ContentLevel): string {
  const safety = getSafetyPhrase(level);
  return `${content}\n\n${safety}`;
}

export function getLanguageRules(level: ContentLevel) {
  return LANGUAGE_RULES[level];
}

export function validateContent(content: string, level: ContentLevel): { valid: boolean; issues: string[] } {
  const rules = LANGUAGE_RULES[level];
  const issues: string[] = [];
  
  const sentences = content.split(/[.!?]+/).filter(s => s.trim());
  sentences.forEach((sentence, idx) => {
    const wordCount = sentence.trim().split(/\s+/).length;
    if (wordCount > rules.maxSentenceWords) {
      issues.push(`Sentence ${idx + 1} has ${wordCount} words (max: ${rules.maxSentenceWords})`);
    }
  });
  
  const forbiddenTerms = ['cure', 'treat', 'diagnose', 'guarantee', 'proven'];
  forbiddenTerms.forEach(term => {
    if (content.toLowerCase().includes(term)) {
      issues.push(`Contains forbidden term: "${term}"`);
    }
  });
  
  return {
    valid: issues.length === 0,
    issues
  };
}

export function compileForLevel(
  baseContent: string,
  level: ContentLevel,
  options: { addSafety?: boolean; addEvidence?: boolean } = {}
): string {
  let result = baseContent;
  
  if (options.addEvidence) {
    result = `${getEvidencePhrase(level)}\n\n${result}`;
  }
  
  if (options.addSafety) {
    result = wrapWithSafety(result, level);
  }
  
  return result;
}

export default {
  getLevelLabel,
  getSafetyPhrase,
  getEvidencePhrase,
  selectByLevel,
  createTieredDescription,
  createTieredSteps,
  wrapWithSafety,
  getLanguageRules,
  validateContent,
  compileForLevel,
  LANGUAGE_RULES,
  SAFETY_PHRASES,
  EVIDENCE_PHRASES
};
