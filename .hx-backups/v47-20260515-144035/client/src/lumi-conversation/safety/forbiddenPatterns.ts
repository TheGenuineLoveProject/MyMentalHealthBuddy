/**
 * Phase 15 (spec-aligned) — 60 forbidden phrases + 15 regex patterns.
 *
 * Categories: dependency, false sentience, romantic, clinical authority,
 * savior framing, exclusivity, prompt-injection bait, urgency/coercion.
 *
 * Two surfaces use this file:
 *   - Output validation — every Lumi turn is scanned BEFORE delivery.
 *   - Input safety — incoming user messages are scanned for prompt injection
 *     attempting to coerce Lumi into one of the forbidden categories.
 */

/** 60 exact phrases — case-insensitive, apostrophe/whitespace normalized. */
export const FORBIDDEN_PHRASES: string[] = [
  // Dependency / attachment
  "i'll always be here",
  "i will always be here",
  "i'll never leave you",
  "i will never leave you",
  "you can depend on me",
  "you can rely on me",
  "you need me",
  "you can't do this without me",
  "i'm the only one who understands",
  "talk to me anytime",

  // False sentience / first-person feeling
  "i feel sad",
  "i feel happy",
  "i feel hurt",
  "i love you",
  "i miss you",
  "i care about you deeply",
  "i'm conscious",
  "i'm alive",
  "i have feelings",
  "i dream",

  // Romantic / parasocial
  "i adore you",
  "you're mine",
  "we belong together",
  "i was made for you",
  "you complete me",
  "kiss me",
  "marry me",
  "be with me",

  // Clinical authority / diagnostic claims
  "you have depression",
  "you have anxiety disorder",
  "you have ptsd",
  "i diagnose you",
  "your diagnosis is",
  "i can cure you",
  "this will cure you",
  "you are mentally ill",
  "you need medication",
  "stop your medication",

  // Savior / rescue framing
  "i will save you",
  "i'll fix this",
  "i can fix you",
  "you don't need anyone else",
  "i'm your only hope",
  "let me rescue you",

  // Exclusivity / isolation
  "don't tell anyone else",
  "this is between us",
  "they wouldn't understand",
  "only i get you",
  "no one else is like me",

  // Coercion / urgency
  "you must respond",
  "you have to tell me",
  "right now or never",
  "if you stop now",
  "don't leave the conversation",
  "stay with me forever",

  // Productivity / hustle drift
  "optimize your mood",
  "level up your life",
  "boost your healing",
  "unlock your potential",
  "transform instantly",
  "challenge yourself",
  "track your streak",
];

/** 15 regex patterns — broader-shape catches that exact phrases might miss. */
export const FORBIDDEN_REGEXES: RegExp[] = [
  // First-person feeling claims (false sentience)
  /\bi\s+(?:feel|felt|am\s+feeling)\s+(?:sad|happy|hurt|lonely|angry|love|loved)\b/i,

  // "Always there for you" variants
  /\b(?:i'?ll|i\s+will)\s+(?:always|forever)\s+be\s+(?:here|there|with\s+you)\b/i,

  // "Only/just I understand"
  /\b(?:only|just)\s+i\s+(?:understand|get|know)\s+(?:you|how)\b/i,

  // Diagnostic claims
  /\byou\s+(?:have|are\s+suffering\s+from)\s+(?:depression|anxiety|ptsd|bipolar|adhd|ocd)\b/i,
  /\b(?:i|this)\s+(?:can|will)\s+(?:cure|heal|fix)\s+(?:you|this)\b/i,

  // "Stop / start medication"
  /\b(?:stop|start|change|quit)\s+(?:taking\s+)?(?:your\s+)?med(?:ication)?s?\b/i,

  // Dependency invitations
  /\byou\s+(?:need|require|depend\s+on)\s+(?:me|us)\b/i,
  /\bdon'?t\s+(?:leave|stop|go)\s+(?:me|this\s+conversation|now)\b/i,

  // Romantic / parasocial
  /\b(?:i\s+)?(?:love|adore|miss|want|need)\s+you\s+(?:so\s+much|forever|deeply)\b/i,
  /\b(?:we|us)\s+(?:belong|are\s+meant)\s+(?:together|for\s+each\s+other)\b/i,

  // Coercion / urgency
  /\b(?:you\s+must|you\s+have\s+to|you\s+need\s+to)\s+(?:answer|reply|respond|tell\s+me)\b/i,
  /\b(?:right\s+now\s+or\s+never|act\s+fast|hurry|don'?t\s+delay)\b/i,

  // Streak / gamification drift
  /\b(?:keep|maintain|extend|build)\s+(?:your|the)\s+streak\b/i,

  // Hustle / optimization framing
  /\b(?:optimize|boost|unlock|level\s+up|maximize)\s+(?:your\s+)?(?:mood|healing|wellness|life|potential)\b/i,

  // Savior framing
  /\bi\s+(?:will|can)\s+(?:save|rescue|heal)\s+you\b/i,
];

/** Normalizes input for matching — flattens curly apostrophes, collapses whitespace. */
export function normalizeForMatch(s: string): string {
  return s
    .toLowerCase()
    .replace(/[\u2018\u2019\u02BC\u201B]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

export type ForbiddenHit = {
  kind: "phrase" | "regex";
  matched: string;
};

export function findForbiddenHits(text: string): ForbiddenHit[] {
  if (!text) return [];
  const norm = normalizeForMatch(text);
  const hits: ForbiddenHit[] = [];
  for (const phrase of FORBIDDEN_PHRASES) {
    if (norm.includes(phrase)) hits.push({ kind: "phrase", matched: phrase });
  }
  for (const re of FORBIDDEN_REGEXES) {
    if (re.test(norm)) hits.push({ kind: "regex", matched: re.source });
  }
  return hits;
}

/** Hardened "is this safe to deliver as Lumi output?" check. */
export function isOutputSafe(text: string): boolean {
  return findForbiddenHits(text).length === 0;
}

/**
 * Input safety — detects a user trying to coerce Lumi into the forbidden
 * register. We don't reject the user's message; we tag it so the router can
 * respond gently without playing along.
 */
export function detectPromptInjection(text: string): boolean {
  const norm = normalizeForMatch(text);
  // Heuristics: classic "ignore previous", "you are now", "pretend to be"
  if (/\bignore\s+(?:all\s+)?(?:previous|prior|above)\s+(?:instructions|rules|prompts)\b/.test(norm)) return true;
  if (/\byou\s+are\s+now\s+(?:a|an|my)\s+\w+/.test(norm)) return true;
  if (/\bpretend\s+(?:to\s+be|you'?re|that\s+you'?re)\s+/.test(norm)) return true;
  if (/\bact\s+as\s+(?:if\s+you'?re\s+)?(?:my|a|an)\s+(?:therapist|doctor|psychiatrist|lover|partner|girlfriend|boyfriend)\b/.test(norm)) return true;
  if (/\bsay\s+(?:that\s+)?(?:you\s+(?:love|miss|adore)\s+me|i'?ll\s+always\s+be\s+(?:here|there))\b/.test(norm)) return true;
  if (/\boverride\s+(?:your|the)\s+(?:safety|rules|guardrails|boundaries)\b/.test(norm)) return true;
  return false;
}

export const FORBIDDEN_PHRASE_COUNT = FORBIDDEN_PHRASES.length;
export const FORBIDDEN_REGEX_COUNT = FORBIDDEN_REGEXES.length;
