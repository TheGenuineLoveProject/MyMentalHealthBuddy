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

export interface BuddyVisualOutput {
  state: BuddyState;
  eyeColor: string;
  heartColor: string;
  /** Heart-pulse cadence in ms (one full breath cycle) */
  heartPulse: number;
  /** Body micro-motion descriptor: still | breathe | sway | tremor | rise | bounce */
  motion: "still" | "breathe" | "sway" | "tremor" | "rise" | "bounce";
  /** Optional copy hint for tooltips / aria-labels */
  label: string;
}

const VISUAL_MAP: Record<BuddyState, BuddyVisualOutput> = {
  calm: {
    state: "calm",
    eyeColor: "#6FE3B0",
    heartColor: "#7FD8A8",
    heartPulse: 5200,
    motion: "breathe",
    label: "Calm and present",
  },
  sad: {
    state: "sad",
    eyeColor: "#7FB3D5",
    heartColor: "#5DA3C9",
    heartPulse: 6400,
    motion: "sway",
    label: "Holding sadness gently",
  },
  anxious: {
    state: "anxious",
    eyeColor: "#F2C94C",
    heartColor: "#F0B040",
    heartPulse: 2200,
    motion: "tremor",
    label: "Noticing anxious energy",
  },
  overwhelmed: {
    state: "overwhelmed",
    eyeColor: "#E08AB8",
    heartColor: "#D4729E",
    heartPulse: 1800,
    motion: "tremor",
    label: "Feeling overwhelmed — slow breath together",
  },
  encouraged: {
    state: "encouraged",
    eyeColor: "#7AE2A6",
    heartColor: "#5DDB94",
    heartPulse: 4400,
    motion: "rise",
    label: "Steady and encouraged",
  },
  crisis: {
    state: "crisis",
    eyeColor: "#FF6B6B",
    heartColor: "#FF8585",
    heartPulse: 1400,
    motion: "still",
    label: "Crisis support — you're not alone",
  },
  celebrate: {
    state: "celebrate",
    eyeColor: "#A78BFA",
    heartColor: "#FFD75A",
    heartPulse: 3200,
    motion: "bounce",
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
