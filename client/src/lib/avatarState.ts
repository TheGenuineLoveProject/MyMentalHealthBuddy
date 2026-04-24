/**
 * avatarState.ts — MMHB Buddy Engine: state model + visual contract.
 *
 * Pure logic only. No fetch, no AI, no business logic.
 * Drives <BuddyAvatar /> visuals from server-resolved emotional state.
 */

export type BuddyState =
  | "calm"
  | "sad"
  | "anxious"
  | "overwhelmed"
  | "encouraged"
  | "crisis"
  | "celebrate";

export const BUDDY_STATES: readonly BuddyState[] = [
  "calm",
  "sad",
  "anxious",
  "overwhelmed",
  "encouraged",
  "crisis",
  "celebrate",
] as const;

/**
 * Motion vocabulary (v1.1).
 * Semantic, healing-domain names — chosen to communicate intent to both the
 * visual renderer and a future hardware adapter.
 *
 *   idle       — gentle baseline breath (calm)
 *   slow_glow  — slow rocking with deepened heart glow (sad)
 *   breathing  — pronounced slow inhale/exhale to coax the nervous system (anxious)
 *   grounding  — long, deliberate scale pulse (overwhelmed)
 *   warm_glow  — subtle rise with warm halo (encouraged)
 *   steady     — motionless, present (crisis)
 *   sparkle    — joyful bounce with extra glow (celebrate)
 */
export type BuddyMotion =
  | "idle"
  | "slow_glow"
  | "breathing"
  | "grounding"
  | "warm_glow"
  | "steady"
  | "sparkle";

export interface BuddyVisualOutput {
  state: BuddyState;
  eyeColor: string;
  heartColor: string;
  /** Heart-pulse cadence in ms (one full breath cycle) */
  heartPulse: number;
  /** Body micro-motion descriptor (semantic, healing-domain vocabulary) */
  motion: BuddyMotion;
  /** Optional copy hint for tooltips / aria-labels */
  label: string;
}

/**
 * BuddyOutput — public, spec-canonical alias of BuddyVisualOutput.
 * Use this name in new code; BuddyVisualOutput is kept for backward compat.
 */
export type BuddyOutput = BuddyVisualOutput;

// VISUAL_MAP — v1.2 (polished, emotionally-safe, non-clinical).
// Color and cadence choices are deliberate:
//   - Crisis is GREEN and SLOW. Never red, never fast — emotionally safe and
//     grounded, not alarming. Calm presence is the safety message.
//   - Anxious pulses SLOWLY (4400ms) so the visual itself coaches the user
//     toward a slower breath, instead of mirroring their distress.
//   - Sad uses a soft purple heart glow, not blue, per healing-domain spec.
//   - Overwhelmed eyes are dimmed (low-opacity) so the visual feels held,
//     not flooded.
//   - Celebrate uses warm gold (heart) with green eyes — joyful but never
//     overstimulating.
const VISUAL_MAP: Record<BuddyState, BuddyVisualOutput> = {
  calm: {
    state: "calm",
    eyeColor: "#6FE3B0",
    heartColor: "#7FD8A8",
    heartPulse: 5200,
    motion: "idle",
    label: "Calm and present",
  },
  sad: {
    state: "sad",
    eyeColor: "#9D8FCC",
    heartColor: "#B19CD9",
    heartPulse: 6800,
    motion: "slow_glow",
    label: "Holding sadness gently",
  },
  anxious: {
    state: "anxious",
    eyeColor: "#8FF0BC",
    heartColor: "#7FD8A8",
    heartPulse: 4400,
    motion: "breathing",
    label: "Noticing anxious energy — slow breath together",
  },
  overwhelmed: {
    state: "overwhelmed",
    eyeColor: "#5DA88E",
    heartColor: "#5DA88E",
    heartPulse: 4800,
    motion: "grounding",
    label: "Feeling overwhelmed — grounding together",
  },
  encouraged: {
    state: "encouraged",
    eyeColor: "#7AE2A6",
    heartColor: "#5DDB94",
    heartPulse: 4400,
    motion: "warm_glow",
    label: "Steady and encouraged",
  },
  crisis: {
    state: "crisis",
    eyeColor: "#6FE3B0",
    heartColor: "#7FD8A8",
    heartPulse: 5800,
    motion: "steady",
    label: "Crisis support — you are safe with me",
  },
  celebrate: {
    state: "celebrate",
    eyeColor: "#7AE2A6",
    heartColor: "#FFD75A",
    heartPulse: 3600,
    motion: "sparkle",
    label: "Celebrating with you",
  },
};

/**
 * resolveBuddyState — coerces arbitrary input into a valid BuddyState.
 * Accepts a state string, an object with `.state`, or free-text intent.
 * Defaults to "calm". This is a *fallback* resolver — the server is the
 * canonical source of truth for state during a conversation turn.
 */
export function resolveBuddyState(input: unknown): BuddyState {
  if (!input) return "calm";

  let candidate: string | undefined;
  if (typeof input === "string") candidate = input;
  else if (typeof input === "object" && input !== null) {
    const obj = input as Record<string, unknown>;
    candidate =
      (typeof obj.state === "string" && obj.state) ||
      (typeof obj.text === "string" && obj.text) ||
      undefined;
  }

  const normalized = String(candidate || "")
    .toLowerCase()
    .trim();

  if ((BUDDY_STATES as readonly string[]).includes(normalized)) {
    return normalized as BuddyState;
  }

  // Lightweight free-text fallback (server is canonical)
  if (/\b(suicid|kill myself|end it|self.?harm|hurt myself)\b/.test(normalized)) return "crisis";
  if (/\b(overwhelm|too much|can'?t cope|breaking down|drowning)\b/.test(normalized)) return "overwhelmed";
  if (/\b(anxious|panic|worried|nervous|scared|afraid)\b/.test(normalized)) return "anxious";
  if (/\b(sad|down|depressed|grief|lonely|empty|cry)\b/.test(normalized)) return "sad";
  if (/\b(yay|great|amazing|won|achieved|celebrate|proud)\b/.test(normalized)) return "celebrate";
  if (/\b(better|hopeful|stronger|encouraged|grateful|thankful)\b/.test(normalized)) return "encouraged";

  return "calm";
}

/**
 * getBuddyVisualOutput — pure mapper from BuddyState to visual contract.
 */
export function getBuddyVisualOutput(state: BuddyState): BuddyVisualOutput {
  return VISUAL_MAP[state] ?? VISUAL_MAP.calm;
}

export const BUDDY_IDLE_RESET_MS = 60_000;
