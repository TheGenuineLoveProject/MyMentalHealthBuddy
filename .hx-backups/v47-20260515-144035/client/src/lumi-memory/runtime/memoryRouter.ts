/**
 * Phase 16 — Reflective Memory Layer
 *
 * MEMORY ROUTER — the SINGLE hardened public write path for memory.
 *
 * Every write goes through the following pipeline; failure at ANY step
 * results in a logged audit entry and `RouterDecision.kind: "rejected"`:
 *
 *   1. Field allow-list check          → rejected_unknown_field
 *   2. Per-field shape validation      → rejected_invalid_value
 *   3. Forbidden content scan          → rejected_forbidden_content
 *   4. Consent gate                    → rejected_no_consent
 *   5. Prune expired                   (best-effort, never blocks)
 *   6. Persist + audit                 → accepted
 *
 * Order matters: cheap checks first; consent check is LAST among the
 * rejection gates so the audit log records *what* was rejected with the
 * most specific reason hint, even if consent would also have blocked it.
 */

import {
  isAllowedField,
  isAllowedValue,
  type AllowedMemoryField,
  type MemoryValueShape,
} from "../state/allowedMemoryFields";
import {
  findForbiddenHits,
} from "../safety/forbiddenMemoryPatterns";
import {
  isWriteAllowed,
  isLegalConsentTransition,
  CONSENT_POLICY_VERSION,
  type ConsentState,
} from "../safety/memoryConsentRules";
import {
  useMemoryStore,
  makeAuditEntry,
} from "../state/memoryStore";

export type RouterDecision =
  | { kind: "accepted"; field: AllowedMemoryField }
  | { kind: "rejected"; field: string; reason:
      | "unknown_field"
      | "invalid_value"
      | "forbidden_content"
      | "no_consent";
      detail?: string;
    };

/**
 * Public write path. Validates → audits → persists. Returns a decision.
 */
export function writeMemory<F extends AllowedMemoryField>(
  field: F | string,
  value: unknown,
  nowMs: number = Date.now(),
): RouterDecision {
  const store = useMemoryStore.getState();

  if (!isAllowedField(field)) {
    store._appendAudit(makeAuditEntry("rejected_unknown_field", { field, reasonHint: "field not in allow-list" }));
    return { kind: "rejected", field, reason: "unknown_field" };
  }

  const fld = field as AllowedMemoryField;

  if (!isAllowedValue(fld, value)) {
    store._appendAudit(makeAuditEntry("rejected_invalid_value", { field: fld, reasonHint: "value did not match allowed shape" }));
    return { kind: "rejected", field, reason: "invalid_value" };
  }

  const hits = findForbiddenHits(value);
  if (hits.length > 0) {
    store._appendAudit(makeAuditEntry("rejected_forbidden_content", {
      field: fld,
      reasonHint: `forbidden category: ${hits.map((h) => h.category).join(", ")}`,
    }));
    return { kind: "rejected", field, reason: "forbidden_content", detail: hits[0]?.category };
  }

  if (!isWriteAllowed(store.consent)) {
    store._appendAudit(makeAuditEntry("rejected_no_consent", { field: fld, reasonHint: `consent state: ${store.consent.state}` }));
    return { kind: "rejected", field, reason: "no_consent" };
  }

  // All gates passed — prune then persist.
  store._pruneExpired(nowMs);
  store._putEntry(fld, value as MemoryValueShape[F], nowMs);
  store._appendAudit(makeAuditEntry("write", { field: fld }));
  return { kind: "accepted", field: fld };
}

/**
 * Read live memory. Always prunes expired entries first so callers see
 * only what the user would consider "still remembered".
 */
export function readMemory(nowMs: number = Date.now()): Partial<MemoryValueShape> {
  // Prune first, then re-read state — the previous getState() snapshot is
  // stale immediately after the prune call.
  useMemoryStore.getState()._pruneExpired(nowMs);
  const fresh = useMemoryStore.getState();
  const out: Partial<MemoryValueShape> = {};
  for (const [k, e] of Object.entries(fresh.entries)) {
    if (e) out[k as AllowedMemoryField] = e.value as never;
  }
  return out;
}

/**
 * Public consent transition. Enforces legal-transition table. Returns
 * true iff the transition was applied.
 */
export function setConsent(next: ConsentState): boolean {
  const store = useMemoryStore.getState();
  const from = store.consent.state;
  if (from === next) return false;
  if (!isLegalConsentTransition(from, next)) return false;

  const setAt = new Date().toISOString();
  store._setConsent({
    state: next,
    setAt,
    policyVersion: next === "granted" ? CONSENT_POLICY_VERSION : store.consent.policyVersion,
  });

  if (next === "granted") store._appendAudit(makeAuditEntry("consent_granted"));
  else if (next === "declined") store._appendAudit(makeAuditEntry("consent_declined"));
  else if (next === "revoked") store._appendAudit(makeAuditEntry("consent_revoked"));

  return true;
}

/**
 * Public reset — wipes ALL memory and audit history immediately.
 * Equivalent to calling `useMemoryStore.getState().reset()` but routed
 * through the public API so callers always go through one entry point.
 */
export function resetMemory(): void {
  useMemoryStore.getState().reset();
}
