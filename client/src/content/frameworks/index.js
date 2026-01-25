/**
 * Frameworks Index
 * Social work-informed, trauma-informed content frameworks
 */

export { default as mi, miPrinciples, miMicroPatterns, miReflectivePrompts, miUpgradeCtas } from './motivationalInterviewing.js';
export { default as nlp, nlpPatterns, affirmationTemplates, reflectionCards } from './nlpPatterns.js';
export { default as alignment, twelvePhases, pathwayMetadata } from './twelvePhaseAlignment.js';
export { default as microcopy, wellnessMicrocopy, getMicrocopy, getRandomMicrocopy, getMicrocopySet } from './wellnessMicrocopy.js';
export { benefitTokens, getPresetBenefits, assembleBenefitLine } from './benefitTokens.js';

export const frameworksMetadata = {
  version: '1.1.0',
  lastUpdated: '2026-01-25',
  description: 'Social work-informed frameworks for trauma-informed wellness support'
};
