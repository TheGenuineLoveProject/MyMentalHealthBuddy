/**
 * Wellness Microcopy Library
 * Single source of truth for conscious-aware, legally-safer wellness copy.
 * 
 * MICROCOPY PRINCIPLES:
 * - Always inviting, never commanding
 * - Default to gentle
 * - Never promise outcomes
 * - Replace "must" with "you can / if you'd like / when you're ready"
 * - Keep it short: 2–8 words
 * 
 * COPY SAFETY RULES:
 * - Never: "cures", "treats", "heals", "guarantees", "clinically proven"
 * - Allowed: "may help", "some people find", "often used for", "you might notice"
 * - Always: choice language, consent cues, pause/stop options
 * 
 * ANTI-REPETITION ROTATION RULES:
 * - Use slot + rotation so pages stay consistent but never copy-pasted
 * - Never reuse the same phrase within the same page
 * - Avoid reusing phrases on consecutive pages
 * - Use pickSlot(category, level, seed) for deterministic selection
 * 
 * SLOTS PER PAGE:
 * - CTA_PRIMARY_SLOT, CTA_SECONDARY_SLOT, CONSENT_SLOT
 * - VALIDATION_SLOT, SUCCESS_SLOT, ERROR_SLOT
 */

export const LOCKED_CANONICAL_PHRASES = {
  consent: [
    "You're in control.",
    "Pause or stop anytime.",
    "Switch to something gentler."
  ],
  safety: [
    "Educational support — not medical advice.",
    "If you're in crisis, visit /crisis."
  ],
  progress: [
    "Small steps count.",
    "Consistency over intensity.",
    "You're allowed to go slowly."
  ],
  errors: [
    "Nothing is broken.",
    "Let's try that again."
  ],
  welcomeBack: [
    "You're welcome back anytime.",
    "Skip today. You're still welcome here."
  ]
};

export const wellnessMicrocopy = {
  consent: {
    beginner: [
      "You're in control.",
      'Only if it feels okay.',
      'You choose what to try.',
      'Skip anything that doesn\'t fit.',
      'It\'s always your choice.',
      'Try what feels right for you.'
    ],
    intermediate: [
      "Pause or stop anytime.",
      'Participate at your own comfort level.',
      'Modify or skip anything that doesn\'t work for you.',
      'Your body knows what it needs.',
      'There\'s no right way to do this.',
      'Honor what feels true for you.'
    ],
    advanced: [
      "Switch to something gentler.",
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
    intermediate: [
      'Move at whatever pace feels right.',
      'There\'s no hurry here.',
      'Let yourself settle in gradually.',
      'Take all the time you need.',
      'This isn\'t a race.'
    ],
    advanced: [
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
    intermediate: [
      'Notice the weight of your body where you sit or stand.',
      'Feel the surface beneath you.',
      'Orient to your surroundings.',
      'Let gravity hold you.',
      'Anchor into the present moment.'
    ],
    advanced: [
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
    intermediate: [
      'Whatever arises is valid.',
      'This is a learning process.',
      'Every experience is useful information.',
      'Challenges are part of growth.',
      'Progress isn\'t always linear.'
    ],
    advanced: [
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
    intermediate: [
      'You can pause or stop at any point.',
      'Return to this whenever you\'re ready.',
      'Taking a break is always an option.',
      'Step away if you need to.',
      'There\'s no obligation to finish.'
    ],
    advanced: [
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
    intermediate: [
      'If you feel overwhelmed, pause and ground yourself.',
      'Support is available if you need it.',
      'Seeking help is a strength.',
      'You deserve care and support.',
      'Professional resources exist for harder moments.'
    ],
    advanced: [
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
    intermediate: [
      'What shifted during the practice?',
      'Notice any changes in your body or mind.',
      'What would you like to remember?',
      'What felt supportive?',
      'What might you try differently next time?'
    ],
    advanced: [
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
    intermediate: [
      'Showing up is the foundation.',
      'Every practice builds on the last.',
      'Your effort matters.',
      'Growth happens in small moments.',
      'You\'re building something valuable.'
    ],
    advanced: [
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
    intermediate: [
      'This will be here when you\'re ready.',
      'Return whenever it feels right.',
      'Sometimes timing matters.',
      'Give yourself permission to come back later.',
      'There\'s no deadline for wellness.'
    ],
    advanced: [
      'Timing affects receptivity to practice.',
      'What doesn\'t land today may resonate later.',
      'Building practice over time is sustainable.',
      'Your readiness will fluctuate naturally.',
      'Returning after a break often brings fresh perspective.'
    ]
  },

  emotionalValidation: {
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
  },

  supportSafety: {
    beginner: [
      'If this feels too much, pause.',
      'Try grounding first.',
      'Switch to the softer version.',
      'Want a calmer step?',
      'Let\'s slow it down.'
    ],
    intermediate: [
      'Take a breath first.',
      'Your safety matters most.',
      'If you feel overwhelmed, stop.',
      'You deserve support.',
      'Help is always allowed.'
    ],
    advanced: [
      'Recognizing thresholds supports sustainability.',
      'Titration prevents overwhelm.',
      'Support-seeking is adaptive behavior.',
      'Safety is the foundation of growth.',
      'Resource access is part of the practice.'
    ]
  },

  journalingPrompts: {
    beginner: [
      'What do I need?',
      'What feels heavy?',
      'What feels true?',
      'What can I release?',
      'What would help today?'
    ],
    intermediate: [
      'What\'s one small win?',
      'What\'s one kind thought?',
      'What do I want next?',
      'What\'s one safe step?',
      'What do I want to remember?'
    ],
    advanced: [
      'What patterns am I noticing?',
      'What needs my attention?',
      'What am I learning about myself?',
      'What would my future self appreciate?',
      'What supports my wellbeing?'
    ]
  },

  tierSelectors: {
    beginner: [
      'Simple',
      'Explain like I\'m new',
      'Show the quick version',
      'Keep it gentle',
      'Basics only'
    ],
    intermediate: [
      'Standard',
      'Explain with examples',
      'Show the steps',
      'Show the "why"',
      'Include context'
    ],
    advanced: [
      'Advanced',
      'Explain the science (gently)',
      'Show the "how"',
      'Include evidence',
      'Full detail'
    ]
  },

  boundaries: {
    beginner: [
      'What would self-respect look like here?',
      'What\'s a "good enough" boundary for today?',
      'You can care and still say no.',
      'Your needs matter too.',
      'It\'s okay to protect your energy.'
    ],
    intermediate: [
      'Boundaries are a form of self-care.',
      'Saying no creates space for what matters.',
      'You can set limits without explanation.',
      'Clear boundaries support healthy connection.',
      'Your capacity has limits—and that\'s human.'
    ],
    advanced: [
      'Boundaries regulate the nervous system.',
      'Limit-setting is an adaptive skill.',
      'Relational boundaries protect your window of tolerance.',
      'Self-advocacy supports sustainable wellbeing.',
      'Boundaries are communication, not rejection.'
    ]
  },

  progress: {
    beginner: [
      'Small progress counts.',
      'Consistency over intensity.',
      'Even one honest sentence is growth.',
      'You showed up. That matters.',
      'Tiny steps add up.'
    ],
    intermediate: [
      'Progress isn\'t always visible.',
      'Showing up repeatedly builds momentum.',
      'Your effort compounds over time.',
      'Growth often happens in small increments.',
      'You\'re further along than you think.'
    ],
    advanced: [
      'Neuroplasticity responds to repeated practice.',
      'Incremental change creates lasting shifts.',
      'Sustainable progress prioritizes consistency.',
      'Non-linear progress is still progress.',
      'Your baseline is quietly shifting.'
    ]
  },

  privacy: {
    beginner: [
      'Your reflections belong to you.',
      'You can delete entries anytime.',
      'This stays private.',
      'Only you see this.',
      'Your data, your choice.'
    ],
    intermediate: [
      'We collect only what we need to run the experience.',
      'Your journal entries are yours to manage.',
      'Delete or export anytime—no questions.',
      'Privacy is built into everything we make.',
      'You control what stays and what goes.'
    ],
    advanced: [
      'Data minimization guides our architecture.',
      'Your entries are private to your account.',
      'We never sell your personal data.',
      'Transparency about data practices is a priority.',
      'Full data export is always available.'
    ]
  },

  nonAddictiveProgress: {
    beginner: [
      'Consistency over intensity.',
      'Gentle momentum is still momentum.',
      'Skip days are allowed.',
      'Small is valid.',
      'Rest is part of the process.'
    ],
    intermediate: [
      'Sustainable practice beats intense bursts.',
      'Missing a day doesn\'t break anything.',
      'Your rhythm matters more than streaks.',
      'Kindness to yourself supports lasting change.',
      'There\'s no penalty for taking breaks.'
    ],
    advanced: [
      'Non-pressuring progress supports intrinsic motivation.',
      'Shame-free language maintains engagement.',
      'Opt-out-first design respects autonomy.',
      'Sustainable habit loops prioritize wellbeing over metrics.',
      'Self-paced growth outperforms performance pressure.'
    ]
  },

  consentControl: {
    beginner: [
      'You\'re in charge here.',
      'Pause, skip, or stop anytime.',
      'Choose the gentlest option that still feels supportive.',
      'No pressure. Small is valid.',
      'Your comfort matters.'
    ],
    intermediate: [
      'You decide what feels right.',
      'Every step is optional.',
      'Trust your own timing.',
      'Opt out whenever you need to.',
      'Your boundaries are respected here.'
    ],
    advanced: [
      'Autonomy is central to this practice.',
      'Self-determination supports lasting change.',
      'Consent-based interaction protects your wellbeing.',
      'You are the expert on your own experience.',
      'Agency is built into every feature.'
    ]
  },

  encouragementNonClinical: {
    beginner: [
      'That makes sense.',
      'You\'re not alone in this.',
      'Let\'s aim for one kind step.',
      'Even one honest sentence counts.',
      'You\'re doing something meaningful.'
    ],
    intermediate: [
      'Your effort is valuable.',
      'This is real work you\'re doing.',
      'Small wins add up.',
      'You\'re building something lasting.',
      'Progress isn\'t always visible—but it\'s happening.'
    ],
    advanced: [
      'Intentional reflection supports integration.',
      'Consistent practice shapes new patterns.',
      'Your awareness is itself a form of growth.',
      'Each session contributes to cumulative change.',
      'You\'re developing lasting internal resources.'
    ]
  }
};

export const ctaPrimary = {
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

export const ctaSecondary = {
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

export const emptyStates = {
  beginner: [
    'Nothing saved yet',
    'Start with one note',
    'Your space is ready',
    'Try one small entry',
    'No pressure—begin anytime'
  ],
  intermediate: [
    'Your drafts live here',
    'We\'ll keep it simple',
    'This will build over time',
    'One step creates progress',
    'You can return later'
  ],
  advanced: [
    'Your practice history will appear here',
    'Entries accumulate insights over time',
    'Begin building your pattern data',
    'Track your journey from here',
    'Your progress starts with one entry'
  ]
};

export const successStates = {
  beginner: [
    'Saved gently',
    'Nice work',
    'That counts',
    'You did it',
    'Small progress matters'
  ],
  intermediate: [
    'Logged for later',
    'One step completed',
    'You showed up today',
    'This is a strong start',
    'Keep going only if you want'
  ],
  advanced: [
    'Practice recorded successfully',
    'Your data has been saved',
    'Entry added to your journey',
    'Progress documented',
    'Insight captured'
  ]
};

export const errorStates = {
  beginner: [
    'Something didn\'t save',
    'Try again gently',
    'Let\'s retry that',
    'No worries—one more time',
    'Check your connection'
  ],
  intermediate: [
    'We didn\'t catch that input',
    'Please try a shorter entry',
    'That didn\'t load—refresh',
    'We\'ll fix this soon',
    'Thanks for your patience'
  ],
  advanced: [
    'An error occurred during processing',
    'The request could not be completed',
    'Please verify your input and retry',
    'This may be a temporary issue',
    'Contact support if this persists'
  ]
};

export const safetyFooter = {
  disclaimer: 'Educational support — not medical advice.',
  emergency: 'If you feel unsafe or in immediate danger, contact local emergency services.',
  crisisLink: { label: 'Crisis resources', href: '/crisis' },
  crisisHotline: { label: '988 Suicide & Crisis Lifeline', phone: '988' },
  textLine: { label: 'Crisis Text Line', text: 'HOME to 741741' }
};

export const whenToPause = {
  quick10s: 'If you feel lightheaded or dizzy, stop and breathe normally.',
  short1to3: 'If emotions intensify, open your eyes and ground yourself.',
  long3to10: 'If you feel overwhelmed, pause and use grounding (5-4-3-2-1).'
};

export const gentleExits = {
  beginner: 'It\'s okay to stop here.',
  intermediate: 'You can pause whenever you need.',
  advanced: 'Knowing when to stop is a valuable skill.'
};

export function pick(seed, list) {
  if (!list || list.length === 0) return '';
  const hash = typeof seed === 'string' 
    ? seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    : seed;
  return list[Math.abs(hash) % list.length];
}

export function buildTierCopy({ routeKey, tier, level = 'intermediate' }) {
  const tierLabels = {
    quick10s: { beginner: '10 seconds', intermediate: '10-second reset', advanced: 'Micro-regulation (10s)' },
    short1to3: { beginner: '1–3 minutes', intermediate: '1–3 minute practice', advanced: 'Short practice (1–3 min)' },
    long3to10: { beginner: '3–10 minutes', intermediate: '3–10 minute practice', advanced: 'Extended practice (3–10 min)' }
  };

  const seed = `${routeKey}-${tier}`;
  return {
    title: tierLabels[tier]?.[level] || tierLabels[tier]?.intermediate,
    consent: pick(seed + '-consent', wellnessMicrocopy.consent[level]),
    pacing: pick(seed + '-pacing', wellnessMicrocopy.pacing[level]),
    whenToPause: whenToPause[tier],
    gentleExit: gentleExits[level],
    encouragement: pick(seed + '-encourage', wellnessMicrocopy.encouragement[level])
  };
}

export function getWellnessCopy(category, level = 'intermediate', seed = 0) {
  const list = wellnessMicrocopy[category]?.[level];
  if (!list) return '';
  return pick(seed, list);
}

export function pickSlot(category, level = 'intermediate', seed = '') {
  const categories = {
    ctaPrimary,
    ctaSecondary,
    emptyStates,
    successStates,
    errorStates,
    ...wellnessMicrocopy
  };
  
  const list = categories[category]?.[level] || categories[category]?.intermediate;
  if (!list) return '';
  return pick(seed || category, list);
}

export const MONETIZATION_LADDER = {
  free: {
    label: "Free",
    includes: ["Daily reset", "Crisis routing", "Basic cards"],
    description: "Start exploring at your own pace"
  },
  plus: {
    label: "Plus",
    includes: ["Full prompt library", "Card packs", "Gentle challenges"],
    description: "Go deeper without pressure"
  },
  premium: {
    label: "Premium",
    includes: ["Identity pathways", "Audio reflections", "Creator tools"],
    description: "Build lasting change"
  },
  products: {
    label: "Products",
    includes: ["Journaling packs", "Guided journals", "Micro-courses"],
    description: "Educational resources (not therapy)"
  }
};

export default {
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
  getWellnessCopy,
  LOCKED_CANONICAL_PHRASES,
  MONETIZATION_LADDER
};
