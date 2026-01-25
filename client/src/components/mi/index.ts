/**
 * MI (Motivational Interviewing) Components Module
 * Educational tools based on social work best practices
 * 
 * Usage: Import components for trauma-informed engagement
 * Note: These are educational tools, not therapy
 */

export { MIPromptCard } from './MIPromptCard';
export { MicroCommitmentEngine } from './MicroCommitmentEngine';
export { ReframingToolkit } from './ReframingToolkit';
export { ReadinessScale } from './ReadinessScale';

export {
  MI_STEPS,
  MI_AFFIRMATIONS,
  READINESS_RESPONSES,
  SAFE_OUTCOME_LANGUAGE,
  getRandomMIPrompt,
  getRandomAffirmation,
  getReadinessResponse,
  wrapOutcome,
} from '@/lib/miPatterns';

export type { MIStep, ReadinessResponse } from '@/lib/miPatterns';
