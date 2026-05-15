/**
 * Trauma-Informed Microcopy Library
 * Re-exports from the single source of truth: wellnessMicrocopy
 * 
 * This file maintains backwards compatibility for existing imports.
 * All new code should import directly from './microcopy/wellnessMicrocopy'
 */

import wellnessMicrocopyModule, {
  wellnessMicrocopy,
  ctaPrimary,
  ctaSecondary,
  emptyStates,
  successStates,
  errorStates,
  safetyFooter,
  whenToPause,
  gentleExits,
  pick,
  pickSlot,
  buildTierCopy,
  getWellnessCopy
} from './microcopy/wellnessMicrocopy';

export const microcopy = {
  permission: [
    ...wellnessMicrocopy.pacing.beginner,
    ...wellnessMicrocopy.consent.beginner
  ],

  choiceLanguage: wellnessMicrocopy.consent.beginner,

  safety: wellnessMicrocopy.safety.beginner,

  whatToExpect: wellnessMicrocopy.reassurance.intermediate,

  tierLabels: {
    beginner: ['10-second reset', 'Quick reset (10s)', '10s grounding'],
    intermediate: ['1–3 minute practice', 'Short practice (1–3 min)', 'Steady practice (1–3 min)'],
    advanced: ['3–10 minute practice', 'Deeper practice (3–10 min)', 'Longer practice (3–10 min)']
  },

  cta: {
    beginner: ctaPrimary.beginner,
    intermediate: ctaPrimary.intermediate,
    advanced: ctaPrimary.advanced
  },

  stopNotes: [
    whenToPause.quick10s,
    whenToPause.short1to3,
    whenToPause.long3to10,
    ...wellnessMicrocopy.exits.beginner
  ],

  bodyCues: wellnessMicrocopy.grounding.beginner,

  breathCues: wellnessMicrocopy.pacing.intermediate,

  groundingCues: wellnessMicrocopy.grounding.intermediate,

  emotionLanguage: {
    naming: wellnessMicrocopy.reflection.beginner,
    normalize: wellnessMicrocopy.emotionalValidation.beginner
  },

  reframeCues: wellnessMicrocopy.reflection.intermediate,

  reflectionPrompts: wellnessMicrocopy.journalingPrompts.intermediate,

  closers: wellnessMicrocopy.encouragement.beginner,

  navigation: {
    nextStep: [
      'If you want another option, try…',
      'Next gentle step: …',
      'Prefer something quieter? Try…'
    ],
    returnLinks: [
      'Back to Wellness Hub',
      'Choose another practice'
    ]
  }
};

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export function pickByRoute(route, arr, offset = 0) {
  if (!arr || arr.length === 0) return '';
  const index = (simpleHash(route) + offset) % arr.length;
  return arr[index];
}

export function getMicrocopyForRoute(route) {
  const level = 'intermediate';
  
  return {
    permission: pick(route + '-perm', wellnessMicrocopy.pacing[level]),
    whatToExpect: pick(route + '-expect', wellnessMicrocopy.reassurance[level]),
    safety: pick(route + '-safe', wellnessMicrocopy.safety[level]),
    stopNote: pick(route + '-stop', wellnessMicrocopy.exits[level]),
    bodyCue: pick(route + '-body', wellnessMicrocopy.grounding[level]),
    breathCue: pick(route + '-breath', wellnessMicrocopy.pacing[level]),
    groundingCue: pick(route + '-ground', wellnessMicrocopy.grounding[level]),
    closer: pick(route + '-close', wellnessMicrocopy.encouragement[level]),
    consent: pick(route + '-consent', wellnessMicrocopy.consent[level]),
    reflection: pick(route + '-reflect', wellnessMicrocopy.reflection[level]),
    tierLabels: {
      beginner: '10-second reset',
      intermediate: '1–3 minute practice',
      advanced: '3–10 minute practice',
      quick10s: '10-second reset',
      short1to3: '1–3 minute practice',
      long3to10: '3–10 minute practice'
    },
    cta: {
      beginner: pick(route + '-cta-b', ctaPrimary.beginner),
      intermediate: pick(route + '-cta-i', ctaPrimary.intermediate),
      advanced: pick(route + '-cta-a', ctaPrimary.advanced),
      quick10s: pick(route + '-cta-10s', ctaPrimary.beginner),
      short1to3: pick(route + '-cta-1to3', ctaPrimary.intermediate),
      long3to10: pick(route + '-cta-3to10', ctaPrimary.advanced)
    },
    navigation: {
      nextStep: 'If you want another option, try…',
      returnLink: 'Back to Wellness Hub'
    },
    disclaimerShort: safetyFooter.disclaimer,
    crisisLinkEnabled: true,
    stimulationProfile: 'practice',
    whenToPause,
    gentleExits,
    safetyFooter
  };
}

export function generateMicropySeedMap(routes) {
  const map = {};
  routes.forEach(route => {
    map[route] = getMicrocopyForRoute(route);
  });
  return map;
}

export {
  wellnessMicrocopy,
  ctaPrimary,
  ctaSecondary,
  emptyStates,
  successStates,
  errorStates,
  safetyFooter,
  whenToPause,
  gentleExits,
  pick,
  pickSlot,
  buildTierCopy,
  getWellnessCopy
};

export default microcopy;
