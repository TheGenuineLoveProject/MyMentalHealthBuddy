/**
 * NLP + Motivational Interviewing content engine — v5.7 (port of V18).
 *
 * Source-of-truth for emotionally calibrated copy across the 5 canonical
 * surfaces. Each page object follows the same shape so the renderer stays
 * one component instead of five.
 *
 * Techniques layered into every page (NEVER name them to the user):
 *  - Anchors          : repeated calm words (breathe, gentle, soft, safe)
 *  - Affirmations     : strength-based reflections of effort already shown
 *  - Open questions   : invite reflection, never demand an answer
 *  - Reflections      : mirror feeling so the user feels heard
 *  - Presuppositions  : assume the positive outcome the user wants
 *  - Embedded commands: hide a soft CTA inside a calm sentence
 *  - Sensory words    : visual / auditory / kinesthetic words tagged so the
 *                       renderer can highlight them with the same palette
 *
 * Governance: per MMHB v7.4 the framework names ABOVE never appear in the
 * UI. Section labels stay human ("A Gentle Question", "Lumi Reflects"...).
 *
 * Crisis routing is preserved at page level (CanvaLanding already mounts
 * SafetyFooter + /crisis links); this module never short-circuits crisis.
 */

export const SENSORY_KIND = {
  VISUAL: 'visual',
  AUDITORY: 'auditory',
  KINESTHETIC: 'kinesthetic',
};

const HOME = {
  path: '/',
  headline: "You don't have to figure this out alone.",
  subline:
    'A calm companion for gentle check-ins, emotional support, and quiet moments when you need someone there.',
  trustLine: 'Private. No judgment. Emotionally safe.',
  affirmation:
    "You're here. That already means something beautiful.",
  openQuestion: 'What would feeling supported look like for you today?',
  reflection:
    "Coming here — that's wisdom, not weakness. Whatever brought you, it's welcome.",
  presupposition:
    'As you explore, you will discover tools that feel right for the way you feel right now.',
  embeddedCommand: 'Allow yourself to take one gentle breath before you read on.',
  ctaPrimary: { label: 'Talk With Buddy', href: '/chat' },
  ctaSecondary: { label: 'Take a Calm Check-In', href: '/checkin' },
  sections: [
    {
      icon: 'Wind',
      title: 'A soft place to land',
      content:
        'No forms, no diagnosis, no pressure. Just a quiet space where you can breathe and feel heard.',
      sensoryWords: [
        { word: 'soft', kind: SENSORY_KIND.KINESTHETIC },
        { word: 'breathe', kind: SENSORY_KIND.KINESTHETIC },
        { word: 'heard', kind: SENSORY_KIND.AUDITORY },
      ],
    },
    {
      icon: 'Heart',
      title: 'A companion who listens',
      content:
        'Lumi remembers what matters to you and meets you where you are — gently, every time.',
      sensoryWords: [
        { word: 'listens', kind: SENSORY_KIND.AUDITORY },
        { word: 'gently', kind: SENSORY_KIND.KINESTHETIC },
      ],
    },
    {
      icon: 'Sparkles',
      title: 'Tools that feel kind',
      content:
        'Tiny exercises you can use in two minutes — designed to ease tension, not add to it.',
      sensoryWords: [
        { word: 'kind', kind: SENSORY_KIND.KINESTHETIC },
        { word: 'ease', kind: SENSORY_KIND.KINESTHETIC },
      ],
    },
    {
      icon: 'Shield',
      title: 'Safety that stays close',
      content:
        'If anything ever feels too heavy, crisis support is one calm tap away — always visible, always free.',
      sensoryWords: [
        { word: 'heavy', kind: SENSORY_KIND.KINESTHETIC },
        { word: 'visible', kind: SENSORY_KIND.VISUAL },
      ],
    },
  ],
};

const BREATHING = {
  path: '/tools/breathing',
  headline: 'Take a moment to breathe.',
  subline: "Three gentle breaths to soften the noise. Follow Lumi's rhythm — there's no wrong way.",
  trustLine: 'You can pause anytime.',
  affirmation: 'Choosing to breathe is already a small act of self-kindness.',
  openQuestion: 'Where in your body do you feel the most tension right now?',
  reflection: 'Whatever you noticed — that awareness is a gift. Let it stay soft.',
  presupposition: 'With each breath, you will feel a little more space inside.',
  embeddedCommand: 'Let your shoulders drop on the next slow exhale.',
  ctaPrimary: { label: 'Begin Breathing', href: '/tools/breathing' },
  ctaSecondary: { label: 'Return Home', href: '/' },
  sections: [],
};

const CHECKIN = {
  path: '/checkin',
  headline: 'How is your heart feeling right now?',
  subline: 'There are no wrong answers — only gentle awareness of where you are today.',
  trustLine: 'Private. No judgment. Emotionally safe.',
  affirmation: "Naming a feeling takes courage. You're doing it.",
  openQuestion: 'If your feeling had a color, what color would it be?',
  reflection: 'Whatever you choose, it makes sense. Feelings carry information, not verdicts.',
  presupposition: 'You will leave this check-in a little more connected to yourself.',
  embeddedCommand: 'Trust the first word that comes when you read the options.',
  ctaPrimary: { label: 'Start Check-In', href: '/checkin' },
  ctaSecondary: { label: 'Talk With Buddy', href: '/chat' },
  sections: [],
};

const CELEBRATION = {
  path: '/celebration',
  headline: 'You showed up today.',
  subline: 'Every time you pause to care for yourself, you build emotional resilience — quietly, on purpose.',
  trustLine: 'Small steps still count.',
  affirmation: 'Showing up is the practice. You are practicing.',
  openQuestion: 'What is one tiny thing you did today that took a little courage?',
  reflection: 'Even on heavy days, you keep coming back. That is its own kind of strength.',
  presupposition: 'You will look back and see how much these small moments mattered.',
  embeddedCommand: 'Take a slow breath and let yourself feel proud for a moment.',
  ctaPrimary: { label: 'See Your Growth', href: '/celebration' },
  ctaSecondary: { label: 'Talk With Buddy', href: '/chat' },
  sections: [],
};

const LUMI = {
  path: '/chat',
  headline: 'Hi. I am Lumi.',
  subline: "I'm here to listen — at your pace, in your words, without ever rushing you.",
  trustLine: 'Whatever you share stays between us.',
  affirmation: 'You can come as you are. Nothing needs to be polished first.',
  openQuestion: 'What is sitting on your heart right now — even if it feels small?',
  reflection: "Whatever you bring, I'll meet it gently. There is no wrong place to start.",
  presupposition: 'You will leave our conversation feeling a little lighter.',
  embeddedCommand: 'Type the first thing that comes — even one word is enough.',
  ctaPrimary: { label: 'Start Talking', href: '/chat' },
  ctaSecondary: { label: 'Take a Calm Breath', href: '/tools/breathing' },
  sections: [],
};

export const NLP_MI_PAGES = {
  '/': HOME,
  '/tools/breathing': BREATHING,
  '/checkin': CHECKIN,
  '/celebration': CELEBRATION,
  '/chat': LUMI,
};

export function getPageContent(path) {
  return NLP_MI_PAGES[path] || NLP_MI_PAGES['/'];
}

/**
 * Returns one affirmation drawn from across all 5 page objects.
 * Deterministic if a `seed` (0..1) is supplied, random otherwise — useful
 * for SSR-safe rendering or for "affirmation of the day" surfaces driven
 * by a date-derived seed.
 */
export function getRandomAffirmation(seed) {
  const pool = Object.values(NLP_MI_PAGES)
    .map((p) => p.affirmation)
    .filter(Boolean);
  if (pool.length === 0) return '';
  const r = typeof seed === 'number' ? Math.abs(seed) % 1 : Math.random();
  return pool[Math.floor(r * pool.length)];
}

/**
 * Maps a coarse emotion label to a compassionate, MI-style reflection.
 * Falls back to the home-page reflection when the emotion is unknown so
 * the surface never renders an empty string.
 */
const EMOTION_REFLECTIONS = {
  calm: 'Settling in like this — that takes practice. You are practicing.',
  joy: 'Letting joy land is its own kind of courage. You are letting it land.',
  love: 'Noticing love — for yourself or someone else — is a gentle, brave thing.',
  sad: 'Sadness is information, not a verdict. Whatever you feel is welcome here.',
  anxious: 'Anxiety often means you care deeply. Let your shoulders drop on the next exhale.',
  tired: "Tired is a message, not a flaw. Rest is part of the work.",
  overwhelmed: "When everything feels like a lot, even pausing here counts. You paused.",
  numb: "Numbness is the heart's way of catching its breath. There's no rush.",
  hopeful: 'Hope is a quiet kind of strength. You are carrying it.',
};

export function getReflection(emotion) {
  if (!emotion) return NLP_MI_PAGES['/'].reflection;
  const key = String(emotion).toLowerCase().trim();
  return EMOTION_REFLECTIONS[key] || NLP_MI_PAGES['/'].reflection;
}

/* ======================================================================
 * V20 — Motivational Interviewing enhancements (Phase 2 content layer)
 *
 * Three additional MI technique families layered onto the v5.7 base:
 *   - rollingWithResistance: honor user dismissals without pressure or guilt
 *   - developingDiscrepancy: gently surface the gap between caring for
 *     others vs. caring for self (used sparingly — never on first visit)
 *   - advancedAffirmations: deeper strength-based reflections used in
 *     ReturnLoop rotation for visit count >= 2
 *
 * Hard rule (per MMHB v7.4 Therapeutic Framework Reference Library):
 * framework names ("Motivational Interviewing", "MI", "rolling with
 * resistance", "developing discrepancy") NEVER leak to the user — these
 * keys exist only in source code.
 * ==================================================================== */
export const miEnhancements = {
  rollingWithResistance: [
    "No pressure at all. You'll know when you're ready.",
    "It's okay to take your time. There's no rush here.",
    "Some days are harder than others. That's completely normal.",
    "You don't have to have all the answers right now.",
  ],
  developingDiscrepancy: [
    "You give so much to others. What would it feel like to give a little to yourself?",
    "You show up everywhere else. What if you showed up here too?",
    "Your heart works so hard for everyone. When does it get to rest?",
  ],
  advancedAffirmations: [
    "You have a wisdom inside you that knows exactly what you need.",
    "The fact that you're here tells me you haven't given up on yourself.",
    "You've survived every hard day so far. That is not small.",
    "Your willingness to feel — that IS courage.",
    "You don't have to be perfect to be worthy of care.",
  ],
  advancedOpenQuestions: [
    "If your heart could speak right now, what would it say?",
    "What does 'feeling better' actually look like for you?",
    "When was the last time you truly felt at peace?",
    "What would you tell a friend who felt exactly how you feel?",
    "What tiny step feels possible right now — not perfect, just possible?",
  ],
};

/**
 * Returns one rolling-with-resistance message. Intended for surfaces
 * that honor a user dismissal (e.g. MicroWinPrompt close, modal X).
 */
export function getResistanceMessage(seed) {
  const pool = miEnhancements.rollingWithResistance;
  const r = typeof seed === 'number' ? Math.abs(seed) % 1 : Math.random();
  return pool[Math.floor(r * pool.length)];
}
