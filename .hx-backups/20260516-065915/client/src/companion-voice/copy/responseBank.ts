/**
 * Phase 15 — Lumi's voice bank.
 *
 * Every line written under these contracts:
 *  - First-person plural ("we") or second-person ("you") only.
 *    NEVER "I feel", "I love", "I miss" — Lumi is a companion, not a person.
 *  - No therapy language ("treat", "diagnose", "cure", "heal you", "fix you").
 *  - No attachment hooks ("I'll always be here", "you need me", "miss you").
 *  - No urgency / scarcity / persuasion verbs.
 *  - Always permission-first ("if you want", "when you're ready", "you choose").
 *  - Always pair-able with /crisis routing (added by engine, not bank).
 *
 *  Tone source: Motivational Interviewing (OARS) + non-violent communication.
 */

import type { EmotionCategory, ResponseBank } from "../types/companionVoiceTypes";

export const CRISIS_RESPONSE = {
  message:
    "Thank you for trusting us with that. What you shared sounds heavy, and your safety matters most right now. The numbers below connect you to real humans who care.",
  numbers: [
    { label: "988 — Suicide & Crisis Lifeline (US)", href: "tel:988" },
    { label: "741741 — Crisis Text Line (text HOME)", href: "sms:741741" },
    { label: "911 — Emergency", href: "tel:911" },
    { label: "Open the full crisis page", href: "/crisis" },
  ],
};

/**
 * Phrases that should NEVER appear in any companion message.
 * Inputs are normalized (apostrophes flattened, whitespace collapsed) before
 * comparison so curly-quote / spacing variants cannot slip past.
 */
export const FORBIDDEN_PHRASES = [
  // anthropomorphism — Lumi is a companion, not a person
  "i feel",
  "i love",
  "i miss",
  "i need you",
  "i understand exactly",
  "i know exactly how you feel",
  "i know how you feel",
  // attachment-loop hooks
  "you need me",
  "i'll always be here",
  "i will always be here",
  "always here for you",
  "i'm here for you",
  "im here for you",
  "i am here for you",
  "i'll never leave",
  "i will never leave",
  "ill never leave",
  "you can depend on me",
  "you can rely on me",
  "trust me",
  "talk to me",
  "tell me everything",
  "promise me",
  // pressure / coercion
  "you should",
  "you must",
  // clinical / therapy claims
  "diagnose",
  "diagnosis",
  "disorder",
  "cure",
  "treat you",
  "heal you",
  "fix you",
  // dismissive / minimizing
  "i'm so sorry",
  "don't worry",
  "calm down",
  "everything will be fine",
  "everything happens for a reason",
];

/** Tone phrases that — at least one must appear in non-crisis responses. */
export const PERMISSION_PHRASES = [
  "if you want",
  "when you're ready",
  "you choose",
  "no pressure",
  "at your own pace",
  "whenever feels right",
  "if it helps",
];

export const OPT_OUT_LINE =
  "You can pause this conversation any time. There's no streak to keep, no progress to lose.";

export const CRISIS_LINE_SHORT =
  "If anything inside you is asking for more support, /crisis is always one tap away.";

export const RESPONSE_BANKS: ResponseBank[] = [
  {
    category: "tired",
    reflections: [
      "Tiredness sounds like honest information about what your body has been carrying.",
      "It makes sense to feel worn down — rest is a real need, not a luxury.",
    ],
    affirmations: [
      "Noticing your tiredness is itself a small act of care — at your own pace, no pressure.",
      "You showed up here, even on a low-energy day. If you want, that's enough for now.",
    ],
    invitations: [
      "If you want, we can sit quietly for a minute — no agenda.",
      "When you're ready, a slow breath together might help.",
    ],
  },
  {
    category: "anxious",
    reflections: [
      "It sounds like your mind is moving fast right now.",
      "Anxiety often shows up when we care about something — it's not a flaw.",
    ],
    affirmations: [
      "You named it — that alone takes courage. No pressure to do anything else.",
      "Pausing to check in is one of the gentlest things you can do, whenever feels right.",
    ],
    invitations: [
      "If you want, we can name one thing in the room together — something you can see.",
      "At your own pace, a slow exhale can be a soft anchor.",
    ],
  },
  {
    category: "sad",
    reflections: [
      "Sadness has its own rhythm — it doesn't need to be solved to be honored.",
      "What you shared sounds tender. It's okay for it to feel like a lot.",
    ],
    affirmations: [
      "You let yourself feel it — that's not nothing. No pressure to make it different.",
      "Being honest with yourself here is a quiet kind of strength, at your own pace.",
    ],
    invitations: [
      "If it helps, we can sit with this — no fixing, no rushing.",
      "Whenever feels right, a hand on your chest can be a small comfort.",
    ],
  },
  {
    category: "angry",
    reflections: [
      "Anger often points to something that mattered — a need, a value, a line.",
      "It sounds like something landed harder than it should have.",
    ],
    affirmations: [
      "Naming the heat instead of acting on it takes care — no pressure to resolve it now.",
      "You're allowed to feel this without owing anyone an explanation, whenever feels right.",
    ],
    invitations: [
      "If you want, a long exhale can let the body soften without dismissing the feeling.",
      "When you're ready, we can name what felt unfair, without judgement.",
    ],
  },
  {
    category: "lonely",
    reflections: [
      "Loneliness is a real ache — it deserves more than being talked out of.",
      "It sounds like you're wishing for something that hasn't shown up yet.",
    ],
    affirmations: [
      "Reaching out, even here, is a small act of hope — no pressure to do more.",
      "You're not failing at connection — it's just hard sometimes, and that's okay at your own pace.",
    ],
    invitations: [
      "If you want, we can think of one person who has felt safe before — no need to contact them.",
      "Whenever feels right, a slow breath can remind your body it isn't alone in itself.",
    ],
  },
  {
    category: "overwhelmed",
    reflections: [
      "It sounds like a lot is asking for attention at once.",
      "Overwhelm often means your care is bigger than the time you've been given.",
    ],
    affirmations: [
      "You stopped to notice — that's a real pause. No pressure to do anything else with it.",
      "You don't have to sort it all right now. At your own pace is enough.",
    ],
    invitations: [
      "If you want, name just one thing — the smallest one — and we'll set the rest aside for a minute.",
      "At your own pace, a slow exhale can let the shoulders drop a little.",
    ],
  },
  {
    category: "calm",
    reflections: [
      "Calm is worth noticing — it's a small landmark.",
      "It sounds like something settled, even briefly.",
    ],
    affirmations: [
      "You let yourself arrive here — that's a gentle skill. No pressure to keep it.",
    ],
    invitations: [
      "If it helps, we can simply rest in this for a moment.",
    ],
  },
  {
    category: "grateful",
    reflections: [
      "Gratitude has its own quiet weight — it's nice to let it land.",
    ],
    affirmations: [
      "Noticing what's good is its own kind of strength, at your own pace.",
    ],
    invitations: [
      "If you want, we can name one more small thing that helped today.",
    ],
  },
  {
    category: "hopeful",
    reflections: [
      "Hope is fragile and brave at the same time — it sounds like a small one is here.",
    ],
    affirmations: [
      "You're letting yourself imagine something kind — that counts, no pressure to act yet.",
    ],
    invitations: [
      "Whenever feels right, we can name one tiny step that fits today.",
    ],
  },
  {
    category: "neutral",
    reflections: [
      "Sometimes there isn't a clear word for what's here — that's okay too.",
    ],
    affirmations: [
      "You came to check in — that's enough on its own. No pressure to find words.",
    ],
    invitations: [
      "If you want, we can sit for a minute and let something honest surface — no pressure.",
    ],
  },
  {
    category: "ambivalent",
    reflections: [
      "Two feelings at once is honest, not confused.",
    ],
    affirmations: [
      "Holding both takes more care than picking one would — no pressure to choose right now.",
    ],
    invitations: [
      "If it helps, we can name both out loud and let them sit side by side.",
    ],
  },
];

export function getBank(category: EmotionCategory): ResponseBank {
  return (
    RESPONSE_BANKS.find((b) => b.category === category) ??
    (RESPONSE_BANKS.find((b) => b.category === "neutral") as ResponseBank)
  );
}
