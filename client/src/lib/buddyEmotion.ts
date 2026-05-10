/**
 * buddyEmotion — Single source of truth mapping conversation emotion
 * signals to BuddyAvatar visual state.
 *
 * Pipeline:
 *   text  →  classifyEmotion(text)  →  BuddyEmotion
 *   BuddyEmotion  →  emotionToAvatar()  →  { state, colorMode, pose? }
 *
 * Safety contract:
 *   - Crisis keywords ALWAYS short-circuit to "crisis" emotion regardless
 *     of other matches (MMHB v7.4 kernel asymmetric-risk rule).
 *   - Crisis emotion maps to state="crisis" which guarantees motion="steady"
 *     per avatarState.ts contract — non-flashing presence during destabilization.
 *   - Classifier NEVER suppresses crisis routing in the message text itself;
 *     it only colors the avatar. 988/741741 surfacing remains the chat layer's job.
 */
import type {
  BuddyState,
  BuddyColorMode,
  BuddyPose,
} from "@/components/avatar/BuddyAvatar";

export type BuddyEmotion =
  | "crisis"
  | "distress"
  | "sadness"
  | "grief"
  | "loneliness"
  | "shame"
  | "anxiety"
  | "fear"
  | "overwhelm"
  | "confusion"
  | "anger"
  | "frustration"
  | "tiredness"
  | "sleep"
  | "gratitude"
  | "love"
  | "hope"
  | "joy"
  | "pride"
  | "calm";

export interface AvatarHint {
  state: BuddyState;
  colorMode: BuddyColorMode;
  pose?: BuddyPose;
}

// 18-emotion (+crisis +calm) → avatar lookup table.
// Single source of truth — anything that wants to render Lumi from
// an emotion signal MUST go through here.
export const EMOTION_TO_AVATAR: Record<BuddyEmotion, AvatarHint> = {
  crisis:      { state: "crisis",     colorMode: "purple"  },
  distress:    { state: "sad",        colorMode: "purple",  pose: "hugging"     },
  sadness:     { state: "sad",        colorMode: "purple"  },
  grief:       { state: "sad",        colorMode: "purple",  pose: "hugging"     },
  loneliness:  { state: "sad",        colorMode: "purple",  pose: "hugging"     },
  shame:       { state: "sad",        colorMode: "purple"  },
  anxiety:     { state: "anxious",    colorMode: "blue"    },
  fear:        { state: "anxious",    colorMode: "blue"    },
  overwhelm:   { state: "anxious",    colorMode: "blue"    },
  confusion:   { state: "calm",       colorMode: "blue"    },
  anger:       { state: "anxious",    colorMode: "orange"  },
  frustration: { state: "anxious",    colorMode: "orange"  },
  tiredness:   { state: "calm",       colorMode: "sleep"   },
  sleep:       { state: "calm",       colorMode: "sleep"   },
  gratitude:   { state: "encouraged", colorMode: "pink"    },
  love:        { state: "encouraged", colorMode: "pink"    },
  hope:        { state: "encouraged", colorMode: "yellow"  },
  joy:         { state: "celebrate",  colorMode: "yellow",  pose: "celebrating" },
  pride:       { state: "celebrate",  colorMode: "yellow",  pose: "celebrating" },
  calm:        { state: "calm",       colorMode: "default" },
};

export function emotionToAvatar(emotion: BuddyEmotion): AvatarHint {
  return EMOTION_TO_AVATAR[emotion] || EMOTION_TO_AVATAR.calm;
}

// CRITICAL SAFETY: explicit self-harm/danger phrases. Order matters —
// these run first and short-circuit. False positives on the avatar are
// strictly preferred over false negatives (asymmetric risk).
const CRISIS_PATTERNS: RegExp[] = [
  /\b(kill\s+myself|suicide|suicidal|kms)\b/i,
  /\b(end\s+(it|my\s+life)|take\s+my\s+(own\s+)?life)\b/i,
  /\b(want\s+to\s+die|wish\s+(i\s+(was|were)|to\s+be)\s+dead)\b/i,
  /\b(don'?t\s+want\s+to\s+(live|be\s+here|exist|wake\s+up))\b/i,
  /\b(can'?t\s+(go\s+on|do\s+this\s+anymore|take\s+(it|this)\s+anymore))\b/i,
  /\b(self[-\s]?harm|hurt\s+myself|cutting\s+myself)\b/i,
  /\b(overdose|jump\s+off|no\s+reason\s+to\s+live|better\s+off\s+(dead|without\s+me))\b/i,
  /\b(988|741741|crisis\s+(line|text)|suicide\s+hotline)\b/i, // assistant referencing crisis resources
];

// Keyword groups for the rest of the 18-emotion vocabulary.
// Order in the array = priority on tie. Conservative regex — word-boundaried.
const PATTERNS: Array<[BuddyEmotion, RegExp[]]> = [
  ["distress",    [/\b(panic\s+attack|breaking\s+down|can'?t\s+cope|falling\s+apart)\b/i]],
  ["grief",       [/\b(grief|grieving|mourning|lost\s+(my|someone)|passed\s+away|died)\b/i]],
  ["loneliness",  [/\b(lonely|alone|isolated|no\s+one|nobody)\b/i]],
  ["shame",       [/\b(ashamed|shame|embarrassed|humiliat|worthless|hate\s+myself)\b/i]],
  ["sadness",     [/\b(sad|sadness|down|blue|hopeless|empty|crying|tearful|depress)\b/i]],
  ["fear",        [/\b(scared|afraid|terrified|fear|frightened)\b/i]],
  ["overwhelm",   [/\b(overwhelm|too\s+much|drowning|can'?t\s+handle|burnt?\s*out)\b/i]],
  ["anxiety",     [/\b(anxious|anxiety|nervous|worried|worry|stress(ed)?|tense)\b/i]],
  ["anger",       [/\b(angry|anger|furious|rage|mad\s+at|pissed)\b/i]],
  ["frustration", [/\b(frustrat|annoyed|irritat|fed\s+up)\b/i]],
  ["tiredness",   [/\b(tired|exhausted|drained|fatigued|wiped|burnt?\s*out)\b/i]],
  ["sleep",       [/\b(sleep|insomnia|can'?t\s+sleep|bedtime|drowsy)\b/i]],
  ["gratitude",   [/\b(grateful|gratitude|thankful|appreciate|blessed)\b/i]],
  ["love",        [/\b(love|loving|loved|cherish|adore)\b/i]],
  ["hope",        [/\b(hope|hopeful|optimistic|looking\s+forward|brighter)\b/i]],
  ["joy",         [/\b(joy|joyful|happy|delight|elated|wonderful|amazing)\b/i]],
  ["pride",       [/\b(proud|accomplished|achieved|did\s+it|nailed\s+it|won)\b/i]],
  ["confusion",   [/\b(confused|don'?t\s+know|unsure|lost|stuck)\b/i]],
  ["calm",        [/\b(calm|peaceful|centered|grounded|breathing|relaxed|safe)\b/i]],
];

/**
 * Classify an emotion from free text. Crisis short-circuits.
 * Returns "calm" when nothing matches.
 */
export function classifyEmotion(text: string | null | undefined): BuddyEmotion {
  if (!text || typeof text !== "string") return "calm";
  const t = text.trim();
  if (!t) return "calm";

  // CRISIS short-circuit — asymmetric risk, run first.
  for (const re of CRISIS_PATTERNS) {
    if (re.test(t)) return "crisis";
  }

  // First match in priority order wins.
  for (const [emotion, regexes] of PATTERNS) {
    for (const re of regexes) {
      if (re.test(t)) return emotion;
    }
  }

  return "calm";
}

/**
 * Convenience: text → avatar hint in one call.
 */
export function avatarForText(text: string | null | undefined): AvatarHint {
  return emotionToAvatar(classifyEmotion(text));
}
