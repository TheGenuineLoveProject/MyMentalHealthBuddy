/**
 * Phase 16 — Reflective Memory Layer
 *
 * Continuity engine. Pure functions that derive gentle, consensual
 * continuity affordances from live memory. NEVER writes; never narrates
 * absent memory ("I see you've struggled with X" — forbidden by spec).
 *
 * Used by: greeting renderer, pacing picker, optional UI hint surface.
 */

import type { MemoryValueShape } from "../state/allowedMemoryFields";

export type Greeting = {
  text: string;
  tone: "warm" | "neutral" | "minimal";
  /** True iff this greeting reflects a remembered preference. */
  fromMemory: boolean;
};

export type Pacing = "slow" | "medium" | "flexible";

export type ContinuityHint =
  | { kind: "preferred-tool"; tool: string }
  | { kind: "welcome-back"; daysSinceLast: number }
  | { kind: "session-hint"; hint: string };

const NEUTRAL_GREETING: Greeting = {
  text: "Hi. Take your time.",
  tone: "neutral",
  fromMemory: false,
};

const WARM_GREETING: Greeting = {
  text: "Hi — it's good to be here with you. No pressure, no rush.",
  tone: "warm",
  fromMemory: true,
};

const MINIMAL_GREETING: Greeting = {
  text: "Hi.",
  tone: "minimal",
  fromMemory: true,
};

const NEUTRAL_REMEMBERED: Greeting = {
  text: "Hi. We can go at the pace you'd like.",
  tone: "neutral",
  fromMemory: true,
};

/**
 * Build a greeting from live memory. With no memory, returns a neutral
 * greeting that does NOT reference any continuity ("welcome back" with
 * no actual prior session is forbidden).
 */
export function buildGreeting(memory: Partial<MemoryValueShape>): Greeting {
  const tone = memory.preferredGreetingTone;
  if (!tone) return NEUTRAL_GREETING;
  switch (tone) {
    case "warm":
      return WARM_GREETING;
    case "minimal":
      return MINIMAL_GREETING;
    case "neutral":
    default:
      return NEUTRAL_REMEMBERED;
  }
}

/**
 * Pacing picker. Defaults to "flexible" (least committed) when no memory.
 */
export function pickPacing(memory: Partial<MemoryValueShape>): Pacing {
  return memory.preferredPacing ?? "flexible";
}

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Build a small list of OPTIONAL UI hints. Capped at 3. Never includes
 * narrative or vulnerability-derived content.
 */
export function buildHints(
  memory: Partial<MemoryValueShape>,
  nowMs: number = Date.now(),
): ContinuityHint[] {
  const hints: ContinuityHint[] = [];

  if (memory.preferredTools && memory.preferredTools.length > 0) {
    hints.push({ kind: "preferred-tool", tool: memory.preferredTools[0]! });
  }

  if (memory.lastSessionAt) {
    const last = Date.parse(memory.lastSessionAt);
    if (!Number.isNaN(last)) {
      const days = Math.floor((nowMs - last) / DAY_MS);
      if (days >= 0 && days <= 30) {
        hints.push({ kind: "welcome-back", daysSinceLast: days });
      }
    }
  }

  if (memory.ephemeralSessionHint) {
    hints.push({ kind: "session-hint", hint: memory.ephemeralSessionHint });
  }

  return hints.slice(0, 3);
}
