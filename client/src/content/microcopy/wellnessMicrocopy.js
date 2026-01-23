/**
 * Wellness Microcopy Library
 * Single source of truth for conscious-aware, legally-safer wellness copy.
 * 
 * COPY SAFETY RULES:
 * - Never: "cures", "treats", "heals", "guarantees", "clinically proven"
 * - Allowed: "may help", "some people find", "often used for", "you might notice"
 * - Always: choice language, consent cues, pause/stop options
 */

export const wellnessMicrocopy = {
  consent: {
    beginner: [
      'Only if it feels okay.',
      'You choose what to try.',
      'Skip anything that doesn\'t fit.',
      'It\'s always your choice.',
      'Try what feels right for you.'
    ],
    standard: [
      'Participate at your own comfort level.',
      'Modify or skip anything that doesn\'t work for you.',
      'Your body knows what it needs.',
      'There\'s no right way to do this.',
      'Honor what feels true for you.'
    ],
    deep: [
      'Autonomy is central to this practice.',
      'Adapt instructions to suit your needs.',
      'Self-attunement guides the process.',
      'You are the expert on your own experience.',
      'Modifications are encouraged based on your body\'s signals.'
    ]
  },

  pacing: {
    beginner: [
      'Go slow.',
      'Take your time.',
      'No rush.',
      'Move at your pace.',
      'Pause when you need to.'
    ],
    standard: [
      'Move at whatever pace feels right.',
      'There\'s no hurry here.',
      'Let yourself settle in gradually.',
      'Take all the time you need.',
      'This isn\'t a race.'
    ],
    deep: [
      'Pacing yourself supports nervous system regulation.',
      'Slower often means deeper integration.',
      'Your internal rhythm guides the timing.',
      'Rest is part of the practice.',
      'Integration happens at its own pace.'
    ]
  },

  grounding: {
    beginner: [
      'Feel your feet on the floor.',
      'Notice where you are.',
      'Look around the room.',
      'Feel something solid.',
      'Take a breath.'
    ],
    standard: [
      'Notice the weight of your body where you sit or stand.',
      'Feel the surface beneath you.',
      'Orient to your surroundings.',
      'Let gravity hold you.',
      'Anchor into the present moment.'
    ],
    deep: [
      'Orienting to your environment activates the social engagement system.',
      'Physical sensation anchors awareness in the present.',
      'Grounding interrupts stress response patterns.',
      'Proprioception supports a sense of safety.',
      'External focus can regulate internal states.'
    ]
  },

  reassurance: {
    beginner: [
      'Whatever you feel is okay.',
      'You\'re doing fine.',
      'There\'s no wrong way.',
      'This is just practice.',
      'It gets easier.'
    ],
    standard: [
      'Whatever arises is valid.',
      'This is a learning process.',
      'Every experience is useful information.',
      'Challenges are part of growth.',
      'Progress isn\'t always linear.'
    ],
    deep: [
      'Difficulty with a practice often signals where growth is possible.',
      'The nervous system learns through repetition and rest.',
      'Awareness itself is a form of progress.',
      'Integration happens even outside formal practice.',
      'Your responses are adaptive, not problems to fix.'
    ]
  },

  exits: {
    beginner: [
      'Stop any time.',
      'You can pause.',
      'Come back later.',
      'It\'s okay to rest.',
      'Try again another day.'
    ],
    standard: [
      'You can pause or stop at any point.',
      'Return to this whenever you\'re ready.',
      'Taking a break is always an option.',
      'Step away if you need to.',
      'There\'s no obligation to finish.'
    ],
    deep: [
      'Knowing when to stop is a skill worth developing.',
      'Pausing supports sustainable practice.',
      'Rest allows consolidation of new patterns.',
      'Leaving and returning builds capacity gradually.',
      'Self-regulation includes recognizing limits.'
    ]
  },

  safety: {
    beginner: [
      'If you feel unsafe, stop.',
      'Help is available.',
      'You don\'t have to do this alone.',
      'It\'s okay to ask for support.',
      'Reach out if you need to.'
    ],
    standard: [
      'If you feel overwhelmed, pause and ground yourself.',
      'Support is available if you need it.',
      'Seeking help is a strength.',
      'You deserve care and support.',
      'Professional resources exist for harder moments.'
    ],
    deep: [
      'Recognizing when you need external support is adaptive.',
      'Some experiences benefit from professional guidance.',
      'Crisis resources provide immediate support.',
      'Building a support network is part of wellness.',
      'Knowing your limits protects your capacity.'
    ]
  },

  reflection: {
    beginner: [
      'What did you notice?',
      'How do you feel now?',
      'What stood out?',
      'Anything different?',
      'What helped?'
    ],
    standard: [
      'What shifted during the practice?',
      'Notice any changes in your body or mind.',
      'What would you like to remember?',
      'What felt supportive?',
      'What might you try differently next time?'
    ],
    deep: [
      'What patterns did you observe in your experience?',
      'How did your nervous system respond?',
      'What insights emerged during the practice?',
      'What conditions supported your engagement?',
      'How might this inform future practice?'
    ]
  },

  encouragement: {
    beginner: [
      'You showed up.',
      'That took courage.',
      'Small steps matter.',
      'You tried something new.',
      'That\'s enough for today.'
    ],
    standard: [
      'Showing up is the foundation.',
      'Every practice builds on the last.',
      'Your effort matters.',
      'Growth happens in small moments.',
      'You\'re building something valuable.'
    ],
    deep: [
      'Consistent practice shapes neural pathways over time.',
      'Each session contributes to cumulative change.',
      'Intention and attention are powerful tools.',
      'You\'re developing a sustainable resource.',
      'This investment in yourself compounds.'
    ]
  },

  tryAgain: {
    beginner: [
      'Try again later.',
      'Come back any time.',
      'Tomorrow is another day.',
      'Rest first, then try.',
      'When you\'re ready.'
    ],
    standard: [
      'This will be here when you\'re ready.',
      'Return whenever it feels right.',
      'Sometimes timing matters.',
      'Give yourself permission to come back later.',
      'There\'s no deadline for wellness.'
    ],
    deep: [
      'Timing affects receptivity to practice.',
      'What doesn\'t land today may resonate later.',
      'Building practice over time is sustainable.',
      'Your readiness will fluctuate naturally.',
      'Returning after a break often brings fresh perspective.'
    ]
  }
};

export const safetyFooter = {
  disclaimer: 'Educational support — not medical advice.',
  emergency: 'If you feel unsafe or in immediate danger, contact local emergency services.',
  crisisLink: { label: 'Crisis resources', href: '/crisis' }
};

export const whenToPause = {
  quick10s: 'If you feel lightheaded or dizzy, stop and breathe normally.',
  short1to3: 'If emotions intensify, open your eyes and ground yourself.',
  long3to10: 'If you feel overwhelmed, pause and use grounding (5-4-3-2-1).'
};

export const gentleExits = {
  beginner: 'It\'s okay to stop here.',
  standard: 'You can pause whenever you need.',
  deep: 'Knowing when to stop is a valuable skill.'
};

export function pick(seed, list) {
  if (!list || list.length === 0) return '';
  const hash = typeof seed === 'string' 
    ? seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    : seed;
  return list[Math.abs(hash) % list.length];
}

export function buildTierCopy({ routeKey, tier, level = 'standard' }) {
  const tierLabels = {
    quick10s: { beginner: '10 seconds', standard: '10-second reset', deep: 'Micro-regulation (10s)' },
    short1to3: { beginner: '1–3 minutes', standard: '1–3 minute practice', deep: 'Short practice (1–3 min)' },
    long3to10: { beginner: '3–10 minutes', standard: '3–10 minute practice', deep: 'Deeper practice (3–10 min)' }
  };

  const seed = `${routeKey}-${tier}`;
  return {
    title: tierLabels[tier]?.[level] || tierLabels[tier]?.standard,
    consent: pick(seed + '-consent', wellnessMicrocopy.consent[level]),
    pacing: pick(seed + '-pacing', wellnessMicrocopy.pacing[level]),
    whenToPause: whenToPause[tier],
    gentleExit: gentleExits[level],
    encouragement: pick(seed + '-encourage', wellnessMicrocopy.encouragement[level])
  };
}

export function getWellnessCopy(category, level = 'standard', seed = 0) {
  const list = wellnessMicrocopy[category]?.[level];
  if (!list) return '';
  return pick(seed, list);
}

export default {
  wellnessMicrocopy,
  safetyFooter,
  whenToPause,
  gentleExits,
  pick,
  buildTierCopy,
  getWellnessCopy
};
