/**
 * Phase 16 — Reflective Memory Layer
 *
 * Consent state machine. Memory writes are GATED on consent.
 *
 * States:
 *   "unset"    — never asked; default. WRITES BLOCKED.
 *   "granted"  — user explicitly opted in. Writes allowed.
 *   "declined" — user explicitly opted out. Writes blocked, store stays empty.
 *   "revoked"  — user previously granted, then revoked. Writes blocked AND
 *                store is wiped on transition (handled by memoryStore reducer).
 *
 * Re-consent requirement: any change to retention policy or allowed-field
 * list bumps `CONSENT_POLICY_VERSION` and forces re-consent (granted →
 * unset on version mismatch).
 */

export type ConsentState = "unset" | "granted" | "declined" | "revoked";

export const CONSENT_STATES: ReadonlyArray<ConsentState> = [
  "unset",
  "granted",
  "declined",
  "revoked",
];

/**
 * Bump this whenever `allowedMemoryFields.ts` or `memoryRetentionRules.ts`
 * changes in a way that materially affects what Lumi remembers or for how
 * long. Existing consent is invalidated on bump.
 */
export const CONSENT_POLICY_VERSION = "1.0.0-2026-05-13";

export type ConsentRecord = {
  state: ConsentState;
  /** ISO-8601 timestamp the consent was last set. */
  setAt: string | null;
  /** Policy version at time of consent. Re-consent required if mismatched. */
  policyVersion: string | null;
};

export const INITIAL_CONSENT: ConsentRecord = {
  state: "unset",
  setAt: null,
  policyVersion: null,
};

/**
 * Single source of truth: are writes currently permitted?
 *
 * Returns true iff:
 *   - state === "granted", AND
 *   - the policy version matches the current one.
 *
 * Anything else returns false. There is no "implicit" consent path.
 */
export function isWriteAllowed(consent: ConsentRecord): boolean {
  if (consent.state !== "granted") return false;
  if (consent.policyVersion !== CONSENT_POLICY_VERSION) return false;
  return true;
}

/**
 * Validate a consent transition. Returns true iff the transition is one
 * the user could legitimately make from a UI affordance. The store's
 * reducer enforces this — illegal transitions are rejected silently
 * rather than throwing (defensive against host bugs).
 */
export function isLegalConsentTransition(
  from: ConsentState,
  to: ConsentState,
): boolean {
  const legal: Record<ConsentState, ReadonlyArray<ConsentState>> = {
    unset: ["granted", "declined"],
    granted: ["revoked"],
    declined: ["unset", "granted"],
    revoked: ["unset", "granted"],
  };
  return legal[from].includes(to);
}

/**
 * Was the consent issued under the current policy? Used to surface a
 * "your settings changed — please re-confirm" prompt in the settings UI.
 */
export function needsReconsent(consent: ConsentRecord): boolean {
  return (
    consent.state === "granted" &&
    consent.policyVersion !== CONSENT_POLICY_VERSION
  );
}
