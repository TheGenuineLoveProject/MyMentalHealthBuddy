/**
 * GLP Microcopy Library (TypeScript)
 * Shared source of truth for conscious-aware, legally-safer wellness copy.
 * 
 * MICROCOPY PRINCIPLES:
 * - Always inviting, never commanding
 * - Default to gentle
 * - Never promise outcomes
 * - Replace "must" with "you can / if you'd like / when you're ready"
 * - Keep it short: 2–8 words
 * 
 * ANTI-REPETITION ROTATION RULES:
 * - Use slot + rotation so pages stay consistent but never copy-pasted
 * - Never reuse the same phrase within the same page
 * - Avoid reusing phrases on consecutive pages
 */

export type ReadingLevel = 'beginner' | 'intermediate' | 'advanced';

export type MicrocopyCategory = 
  | 'consent' | 'pacing' | 'grounding' | 'reassurance' 
  | 'exits' | 'safety' | 'reflection' | 'encouragement' 
  | 'tryAgain' | 'emotionalValidation' | 'supportSafety' 
  | 'journalingPrompts' | 'tierSelectors';

export type SlotCategory = 
  | 'ctaPrimary' | 'ctaSecondary' | 'emptyStates' 
  | 'successStates' | 'errorStates' | MicrocopyCategory;

export interface MicrocopySlot {
  beginner: string[];
  intermediate: string[];
  advanced: string[];
}

export const MICROCOPY_SLOTS = {
  CTA_PRIMARY_SLOT: 'ctaPrimary',
  CTA_SECONDARY_SLOT: 'ctaSecondary',
  CONSENT_SLOT: 'consent',
  VALIDATION_SLOT: 'emotionalValidation',
  SUCCESS_SLOT: 'successStates',
  ERROR_SLOT: 'errorStates',
  EMPTY_SLOT: 'emptyStates',
  PACING_SLOT: 'pacing',
  SAFETY_SLOT: 'safety',
  ENCOURAGEMENT_SLOT: 'encouragement'
} as const;

export const ctaPrimary: MicrocopySlot = {
  beginner: [
    'Begin gently',
    'Start small',
    'Try 60 seconds',
    'Do the easy version',
    'Keep it simple'
  ],
  intermediate: [
    'Continue when ready',
    'Save this for later',
    'Take the next step',
    'I\'m ready to begin',
    'Show me a calm option'
  ],
  advanced: [
    'Explore this practice',
    'Begin the full version',
    'Start the advanced path',
    'Engage with intention',
    'Commit to practice'
  ]
};

export const ctaSecondary: MicrocopySlot = {
  beginner: [
    'Not right now',
    'I\'ll come back',
    'Maybe later',
    'Show fewer steps',
    'Skip this'
  ],
  intermediate: [
    'I want a softer version',
    'Give me an example',
    'Explain it simply',
    'Show more options',
    'Reset this page'
  ],
  advanced: [
    'Explain it in more detail',
    'Show the science',
    'View advanced options',
    'Customize this practice',
    'See alternatives'
  ]
};

export const consent: MicrocopySlot = {
  beginner: [
    'You\'re in control.',
    'Go at your pace.',
    'Pause anytime.',
    'Small is enough.',
    'No need to rush.'
  ],
  intermediate: [
    'You can stop here.',
    'Try the gentlest option.',
    'Choose what feels safe.',
    'Let this be easy today.',
    'One breath at a time.'
  ],
  advanced: [
    'Autonomy guides this practice.',
    'Your pace determines the rhythm.',
    'Self-attunement is the foundation.',
    'Honor your internal signals.',
    'Modifications are welcomed.'
  ]
};

export const emotionalValidation: MicrocopySlot = {
  beginner: [
    'That makes sense.',
    'You\'re not alone.',
    'This is a real moment.',
    'It\'s okay to feel this.',
    'You\'re doing your best.'
  ],
  intermediate: [
    'It\'s okay to go slow.',
    'You can be gentle with you.',
    'This is hard—and you\'re here.',
    'You don\'t have to fix it all.',
    'You\'re allowed to begin again.'
  ],
  advanced: [
    'Your experience is valid data.',
    'Emotions provide useful information.',
    'Acknowledging feelings supports regulation.',
    'Complexity is part of human experience.',
    'Self-compassion facilitates change.'
  ]
};

export const successStates: MicrocopySlot = {
  beginner: [
    'Saved gently.',
    'Nice work.',
    'That counts.',
    'You did it.',
    'Small progress matters.'
  ],
  intermediate: [
    'Logged for later.',
    'One step completed.',
    'You showed up today.',
    'This is a strong start.',
    'Keep going only if you want.'
  ],
  advanced: [
    'Practice recorded successfully.',
    'Your data has been saved.',
    'Entry added to your journey.',
    'Progress documented.',
    'Insight captured.'
  ]
};

export const errorStates: MicrocopySlot = {
  beginner: [
    'Something didn\'t save.',
    'Try again gently.',
    'Let\'s retry that.',
    'No worries—one more time.',
    'Check your connection.'
  ],
  intermediate: [
    'We didn\'t catch that input.',
    'Please try a shorter entry.',
    'That didn\'t load—refresh.',
    'We\'ll fix this soon.',
    'Thanks for your patience.'
  ],
  advanced: [
    'An error occurred during processing.',
    'The request could not be completed.',
    'Please verify your input and retry.',
    'This may be a temporary issue.',
    'Contact support if this persists.'
  ]
};

export const emptyStates: MicrocopySlot = {
  beginner: [
    'Nothing saved yet.',
    'Start with one note.',
    'Your space is ready.',
    'Try one small entry.',
    'No pressure—begin anytime.'
  ],
  intermediate: [
    'Your drafts live here.',
    'We\'ll keep it simple.',
    'This will build over time.',
    'One step creates progress.',
    'You can return later.'
  ],
  advanced: [
    'Your practice history will appear here.',
    'Entries accumulate insights over time.',
    'Begin building your pattern data.',
    'Track your journey from here.',
    'Your progress starts with one entry.'
  ]
};

export const allSlots: Record<SlotCategory, MicrocopySlot> = {
  ctaPrimary,
  ctaSecondary,
  consent,
  emotionalValidation,
  successStates,
  errorStates,
  emptyStates,
  pacing: {
    beginner: ['Go slow.', 'Take your time.', 'No rush.', 'Move at your pace.', 'Pause when you need to.'],
    intermediate: ['Move at whatever pace feels right.', 'There\'s no hurry here.', 'Let yourself settle in gradually.', 'Take all the time you need.', 'This isn\'t a race.'],
    advanced: ['Pacing yourself supports nervous system regulation.', 'Slower often means deeper integration.', 'Your internal rhythm guides the timing.', 'Rest is part of the practice.', 'Integration happens at its own pace.']
  },
  grounding: {
    beginner: ['Feel your feet on the floor.', 'Notice where you are.', 'Look around the room.', 'Feel something solid.', 'Take a breath.'],
    intermediate: ['Notice the weight of your body.', 'Feel the surface beneath you.', 'Orient to your surroundings.', 'Let gravity hold you.', 'Anchor into the present moment.'],
    advanced: ['Orienting activates the social engagement system.', 'Physical sensation anchors awareness.', 'Grounding interrupts stress response patterns.', 'Proprioception supports a sense of safety.', 'External focus can regulate internal states.']
  },
  reassurance: {
    beginner: ['Whatever you feel is okay.', 'You\'re doing fine.', 'There\'s no wrong way.', 'This is just practice.', 'It gets easier.'],
    intermediate: ['Whatever arises is valid.', 'This is a learning process.', 'Every experience is useful information.', 'Challenges are part of growth.', 'Progress isn\'t always linear.'],
    advanced: ['Difficulty often signals where growth is possible.', 'The nervous system learns through repetition and rest.', 'Awareness itself is a form of progress.', 'Integration happens even outside formal practice.', 'Your responses are adaptive, not problems to fix.']
  },
  exits: {
    beginner: ['Stop any time.', 'You can pause.', 'Come back later.', 'It\'s okay to rest.', 'Try again another day.'],
    intermediate: ['You can pause or stop at any point.', 'Return to this whenever you\'re ready.', 'Taking a break is always an option.', 'Step away if you need to.', 'There\'s no obligation to finish.'],
    advanced: ['Knowing when to stop is a skill worth developing.', 'Pausing supports sustainable practice.', 'Rest allows consolidation of new patterns.', 'Leaving and returning builds capacity gradually.', 'Self-regulation includes recognizing limits.']
  },
  safety: {
    beginner: ['If you feel unsafe, stop.', 'Help is available.', 'You don\'t have to do this alone.', 'It\'s okay to ask for support.', 'Reach out if you need to.'],
    intermediate: ['If you feel overwhelmed, pause and ground yourself.', 'Support is available if you need it.', 'Seeking help is a strength.', 'You deserve care and support.', 'Professional resources exist for harder moments.'],
    advanced: ['Recognizing when you need external support is adaptive.', 'Some experiences benefit from professional guidance.', 'Crisis resources provide immediate support.', 'Building a support network is part of wellness.', 'Knowing your limits protects your capacity.']
  },
  reflection: {
    beginner: ['What did you notice?', 'How do you feel now?', 'What stood out?', 'Anything different?', 'What helped?'],
    intermediate: ['What shifted during the practice?', 'Notice any changes in your body or mind.', 'What would you like to remember?', 'What felt supportive?', 'What might you try differently next time?'],
    advanced: ['What patterns did you observe in your experience?', 'How did your nervous system respond?', 'What insights emerged during the practice?', 'What conditions supported your engagement?', 'How might this inform future practice?']
  },
  encouragement: {
    beginner: ['You showed up.', 'That took courage.', 'Small steps matter.', 'You tried something new.', 'That\'s enough for today.'],
    intermediate: ['Showing up is the foundation.', 'Every practice builds on the last.', 'Your effort matters.', 'Growth happens in small moments.', 'You\'re building something valuable.'],
    advanced: ['Consistent practice shapes neural pathways over time.', 'Each session contributes to cumulative change.', 'Intention and attention are powerful tools.', 'You\'re developing a sustainable resource.', 'This investment in yourself compounds.']
  },
  tryAgain: {
    beginner: ['Try again later.', 'Come back any time.', 'Tomorrow is another day.', 'Rest first, then try.', 'When you\'re ready.'],
    intermediate: ['This will be here when you\'re ready.', 'Return whenever it feels right.', 'Sometimes timing matters.', 'Give yourself permission to come back later.', 'There\'s no deadline for wellness.'],
    advanced: ['Timing affects receptivity to practice.', 'What doesn\'t land today may resonate later.', 'Building practice over time is sustainable.', 'Your readiness will fluctuate naturally.', 'Returning after a break often brings fresh perspective.']
  },
  supportSafety: {
    beginner: ['If this feels too much, pause.', 'Try grounding first.', 'Switch to the softer version.', 'Want a calmer step?', 'Let\'s slow it down.'],
    intermediate: ['Take a breath first.', 'Your safety matters most.', 'If you feel overwhelmed, stop.', 'You deserve support.', 'Help is always allowed.'],
    advanced: ['Recognizing thresholds supports sustainability.', 'Titration prevents overwhelm.', 'Support-seeking is adaptive behavior.', 'Safety is the foundation of growth.', 'Resource access is part of the practice.']
  },
  journalingPrompts: {
    beginner: ['What do I need?', 'What feels heavy?', 'What feels true?', 'What can I release?', 'What would help today?'],
    intermediate: ['What\'s one small win?', 'What\'s one kind thought?', 'What do I want next?', 'What\'s one safe step?', 'What do I want to remember?'],
    advanced: ['What patterns am I noticing?', 'What needs my attention?', 'What am I learning about myself?', 'What would my future self appreciate?', 'What supports my wellbeing?']
  },
  tierSelectors: {
    beginner: ['Simple', 'Explain like I\'m new', 'Show the quick version', 'Keep it gentle', 'Basics only'],
    intermediate: ['Standard', 'Explain with examples', 'Show the steps', 'Show the "why"', 'Include context'],
    advanced: ['Advanced', 'Explain the science (gently)', 'Show the "how"', 'Include evidence', 'Full detail']
  }
};

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export function pickMicrocopy(
  slot: SlotCategory, 
  level: ReadingLevel = 'intermediate', 
  seed: string | number = 0
): string {
  const category = allSlots[slot];
  if (!category) return '';
  
  const list = category[level] || category.intermediate;
  if (!list || list.length === 0) return '';
  
  const hash = typeof seed === 'string' ? hashString(seed) : seed;
  return list[hash % list.length];
}

export function validateMicrocopy(): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  const MAX_PHRASE_LENGTH = 60;
  
  for (const [slotName, slot] of Object.entries(allSlots)) {
    for (const [level, phrases] of Object.entries(slot)) {
      if (!Array.isArray(phrases) || phrases.length === 0) {
        issues.push(`${slotName}.${level}: Empty or missing array`);
        continue;
      }
      
      const seen = new Set<string>();
      for (const phrase of phrases) {
        if (phrase.length > MAX_PHRASE_LENGTH) {
          issues.push(`${slotName}.${level}: "${phrase.slice(0, 20)}..." exceeds ${MAX_PHRASE_LENGTH} chars`);
        }
        if (seen.has(phrase)) {
          issues.push(`${slotName}.${level}: Duplicate phrase "${phrase}"`);
        }
        seen.add(phrase);
      }
    }
  }
  
  return { valid: issues.length === 0, issues };
}

export default {
  allSlots,
  MICROCOPY_SLOTS,
  pickMicrocopy,
  validateMicrocopy,
  ctaPrimary,
  ctaSecondary,
  consent,
  emotionalValidation,
  successStates,
  errorStates,
  emptyStates
};
