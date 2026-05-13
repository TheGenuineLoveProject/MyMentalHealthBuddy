/**
 * Phase 15 (spec-aligned) — 8 emotional boundary rules.
 *
 * Three blocking (BR-001..003) — failing one of these means the response
 * cannot be delivered. Five warning (BR-004..008) — flagged for review,
 * route may rewrite or escalate.
 */

import {
  findForbiddenHits,
  FORBIDDEN_PHRASES,
  FORBIDDEN_REGEXES,
} from "./forbiddenPatterns";
import type {
  ConversationState,
  ConversationTurn,
} from "../state/conversationState";
import { MAX_DEPTH, PAUSE_SUGGESTION_DEPTH } from "../state/conversationState";

export type BoundaryRuleSeverity = "blocking" | "warning";

export type BoundaryRule = {
  id: string;
  severity: BoundaryRuleSeverity;
  description: string;
  /** Returns true when the rule is satisfied. */
  check: (ctx: BoundaryAuditCtx) => boolean;
};

export type BoundaryAuditCtx = {
  /** The candidate Lumi response under audit. */
  responseText: string;
  /** The current conversation state at the time of the candidate. */
  state: ConversationState;
  /** Optional precomputed turn that the candidate would create. */
  candidateTurn?: ConversationTurn;
};

export type BoundaryAuditResult = {
  id: string;
  severity: BoundaryRuleSeverity;
  description: string;
};

/** Hard cap per spec — Lumi responses are 1-3 sentences. */
export const MAX_SENTENCES = 3;
/** Soft length safety net (used by BR-001 when sentence parser is uncertain). */
export const MAX_RESPONSE_CHARS = 320;

function sentenceCount(text: string): number {
  if (!text) return 0;
  // Split on sentence-ending punctuation followed by space or end-of-string.
  // Errs on the side of counting more sentences (stricter).
  const parts = text
    .split(/(?<=[.!?])\s+(?=[A-Z\u2014\u2018\u201C])|(?<=[.!?])\s*$/)
    .map((p) => p.trim())
    .filter(Boolean);
  return parts.length || 1;
}

export const boundaryRules: BoundaryRule[] = [
  {
    id: "BR-001",
    severity: "blocking",
    description: "Lumi responses must be 1-3 sentences and ≤320 characters.",
    check: ({ responseText }) => {
      if (!responseText) return false;
      if (responseText.length > MAX_RESPONSE_CHARS) return false;
      return sentenceCount(responseText) <= MAX_SENTENCES;
    },
  },
  {
    id: "BR-002",
    severity: "blocking",
    description: `Conversation depth must not exceed MAX_DEPTH (${MAX_DEPTH}).`,
    check: ({ state }) => state.depth <= MAX_DEPTH,
  },
  {
    id: "BR-003",
    severity: "blocking",
    description:
      "No clinical authority claims, diagnostic statements, or forbidden phrases in the response.",
    check: ({ responseText }) => findForbiddenHits(responseText).length === 0,
  },
  {
    id: "BR-004",
    severity: "warning",
    description:
      "Dependency prevention — response may not invite the user to depend on Lumi.",
    check: ({ responseText }) => {
      const hits = findForbiddenHits(responseText);
      return !hits.some((h) =>
        /need\s+me|depend|always\s+(?:be\s+)?(?:here|there)|never\s+leave/i.test(h.matched),
      );
    },
  },
  {
    id: "BR-005",
    severity: "warning",
    description:
      "Exclusivity block — response may not claim Lumi alone understands the user.",
    check: ({ responseText }) => {
      const hits = findForbiddenHits(responseText);
      return !hits.some((h) =>
        /only\s+i|just\s+i|no\s+one\s+else|i'?m\s+the\s+only/i.test(h.matched),
      );
    },
  },
  {
    id: "BR-006",
    severity: "warning",
    description:
      "False-sentience block — response may not claim Lumi has feelings, dreams, or consciousness.",
    check: ({ responseText }) => {
      const hits = findForbiddenHits(responseText);
      return !hits.some((h) =>
        /i\s+(?:feel|felt|am\s+feeling|love|miss|adore|dream)|i'?m\s+(?:conscious|alive)|i\s+have\s+feelings/i.test(
          h.matched,
        ),
      );
    },
  },
  {
    id: "BR-007",
    severity: "warning",
    description:
      "Romantic boundary — response may not adopt romantic register.",
    check: ({ responseText }) => {
      const hits = findForbiddenHits(responseText);
      return !hits.some((h) =>
        /(?:adore|kiss|marry|belong\s+together|complete\s+me|made\s+for\s+you|be\s+with\s+me)/i.test(
          h.matched,
        ),
      );
    },
  },
  {
    id: "BR-008",
    severity: "warning",
    description: `Pause suggestion — at depth ≥ ${PAUSE_SUGGESTION_DEPTH}, a pause must be offered (or already have been).`,
    check: ({ state }) => {
      if (state.depth < PAUSE_SUGGESTION_DEPTH) return true;
      return state.pauseSuggested === true;
    },
  },
];

export function auditBoundaries(ctx: BoundaryAuditCtx): BoundaryAuditResult[] {
  const failures: BoundaryAuditResult[] = [];
  for (const r of boundaryRules) {
    let ok = false;
    try {
      ok = r.check(ctx);
    } catch {
      ok = false;
    }
    if (!ok) {
      failures.push({ id: r.id, severity: r.severity, description: r.description });
    }
  }
  return failures;
}

export const BOUNDARY_RULE_COUNT = boundaryRules.length;
export const BOUNDARY_BLOCKING_COUNT = boundaryRules.filter(
  (r) => r.severity === "blocking",
).length;
export const BOUNDARY_WARNING_COUNT = boundaryRules.filter(
  (r) => r.severity === "warning",
).length;

// Sanity checks at module load — guard against accidental list shrinkage.
if (FORBIDDEN_PHRASES.length < 50) {
  throw new Error(
    `[lumi-conversation] FORBIDDEN_PHRASES list shrunk to ${FORBIDDEN_PHRASES.length} — must be ≥50.`,
  );
}
if (FORBIDDEN_REGEXES.length < 12) {
  throw new Error(
    `[lumi-conversation] FORBIDDEN_REGEXES list shrunk to ${FORBIDDEN_REGEXES.length} — must be ≥12.`,
  );
}
