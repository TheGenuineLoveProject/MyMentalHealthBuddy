/**
 * Practice Content Loader
 * Utilities for loading and accessing wellness practice content
 */

import corePractices from './core-practices.json';

export type ReadingLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Practice {
  id: string;
  title: Record<ReadingLevel, string>;
  description: Record<ReadingLevel, string>;
  evidenceBasis: string;
  consent: {
    intro: string;
    midPractice: string;
    closing: string;
  };
  pacing: {
    options: string[];
    reminder: string;
  };
  examples: Array<{
    title: string;
    scenario: string;
    readingLevel: string;
  }>;
  practices: {
    quick: {
      duration: string;
      title: string;
      steps: Record<ReadingLevel, string[]>;
      whenToPause: string;
    };
    extended: {
      duration: string;
      title: string;
      steps: Record<ReadingLevel, string[]>;
      reflection: string[];
      whenToPause: string;
    };
  };
  alternatives: string[];
  safetyDisclaimer: string;
  crisisResources: {
    text: string;
    resources: Array<{
      name: string;
      contact: string;
      region: string;
    }>;
    reminder: string;
  };
  tags: string[];
}

export interface PracticesData {
  meta: {
    version: string;
    created: string;
    author: string;
    license: string;
    disclaimer: string;
  };
  practices: Practice[];
}

/**
 * Get all practices
 */
export function getAllPractices(): Practice[] {
  return (corePractices as PracticesData).practices;
}

/**
 * Get a practice by ID
 */
export function getPracticeById(id: string): Practice | undefined {
  return getAllPractices().find(p => p.id === id);
}

/**
 * Get practices by tag
 */
export function getPracticesByTag(tag: string): Practice[] {
  return getAllPractices().filter(p => p.tags.includes(tag));
}

/**
 * Get practice title for a specific reading level
 */
export function getPracticeTitle(practice: Practice, level: ReadingLevel): string {
  return practice.title[level] || practice.title.intermediate;
}

/**
 * Get practice description for a specific reading level
 */
export function getPracticeDescription(practice: Practice, level: ReadingLevel): string {
  return practice.description[level] || practice.description.intermediate;
}

/**
 * Get quick practice steps for a specific reading level
 */
export function getQuickPracticeSteps(practice: Practice, level: ReadingLevel): string[] {
  return practice.practices.quick.steps[level] || practice.practices.quick.steps.intermediate;
}

/**
 * Get extended practice steps for a specific reading level
 */
export function getExtendedPracticeSteps(practice: Practice, level: ReadingLevel): string[] {
  return practice.practices.extended.steps[level] || practice.practices.extended.steps.intermediate;
}

/**
 * Get example for a specific reading level
 */
export function getExampleForLevel(practice: Practice, level: ReadingLevel): Practice['examples'][0] | undefined {
  return practice.examples.find(ex => ex.readingLevel === level) || practice.examples[0];
}

/**
 * Get crisis resources
 */
export function getCrisisResources(practice: Practice) {
  return practice.crisisResources;
}

/**
 * Get safety disclaimer
 */
export function getSafetyDisclaimer(practice: Practice): string {
  return practice.safetyDisclaimer;
}

/**
 * Build complete practice content for display
 */
export function buildPracticeContent(practiceId: string, level: ReadingLevel) {
  const practice = getPracticeById(practiceId);
  if (!practice) return null;

  return {
    id: practice.id,
    title: getPracticeTitle(practice, level),
    description: getPracticeDescription(practice, level),
    evidenceBasis: practice.evidenceBasis,
    consent: practice.consent,
    pacing: practice.pacing,
    example: getExampleForLevel(practice, level),
    quickPractice: {
      duration: practice.practices.quick.duration,
      title: practice.practices.quick.title,
      steps: getQuickPracticeSteps(practice, level),
      whenToPause: practice.practices.quick.whenToPause,
    },
    extendedPractice: {
      duration: practice.practices.extended.duration,
      title: practice.practices.extended.title,
      steps: getExtendedPracticeSteps(practice, level),
      reflection: practice.practices.extended.reflection,
      whenToPause: practice.practices.extended.whenToPause,
    },
    alternatives: practice.alternatives,
    safetyDisclaimer: practice.safetyDisclaimer,
    crisisResources: practice.crisisResources,
    tags: practice.tags,
  };
}

/**
 * Get metadata about the content
 */
export function getContentMeta() {
  return (corePractices as PracticesData).meta;
}
