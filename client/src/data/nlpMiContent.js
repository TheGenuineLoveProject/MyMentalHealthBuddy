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
