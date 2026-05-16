/**
 * Phase 16 — Reflective Memory Layer
 *
 * Public barrel. Hosts MUST use `writeMemory`/`readMemory`/`setConsent`/
 * `resetMemory` from this barrel — raw store mutators are intentionally
 * NOT re-exported (they are documented as INTERNAL on the store type).
 *
 * Production import:
 *   import {
 *     MemorySettingsPanel,
 *     MemoryTransparencyView,
 *     MemoryResetButton,
 *     writeMemory,
 *     readMemory,
 *     setConsent,
 *     resetMemory,
 *     buildGreeting,
 *     pickPacing,
 *     buildHints,
 *   } from "@/lumi-memory";
 */

// Allowed-fields surface (read-only)
export {
  ALLOWED_MEMORY_FIELDS,
  ALLOWED_MEMORY_FIELD_COUNT,
  isAllowedField,
  isAllowedValue,
} from "./state/allowedMemoryFields";
export type {
  AllowedMemoryField,
  MemoryValueShape,
  MemoryValueOf,
} from "./state/allowedMemoryFields";

// Forbidden-patterns surface (read-only)
export {
  FORBIDDEN_CATEGORIES,
  FORBIDDEN_PATTERNS,
  findForbiddenHits,
  isMemoryContentSafe,
  normalizeForScan,
} from "./safety/forbiddenMemoryPatterns";
export type { ForbiddenCategory, ForbiddenHit } from "./safety/forbiddenMemoryPatterns";

// Consent surface
export {
  CONSENT_STATES,
  CONSENT_POLICY_VERSION,
  INITIAL_CONSENT,
  isWriteAllowed,
  isLegalConsentTransition,
  needsReconsent,
} from "./safety/memoryConsentRules";
export type { ConsentState, ConsentRecord } from "./safety/memoryConsentRules";

// Retention surface
export {
  RETENTION_DAYS,
  retentionMsFor,
  expiresAtFor,
  isExpired,
} from "./safety/memoryRetentionRules";

// Store types (read-only). The raw `useMemoryStore` and module-private
// selectors are intentionally NOT re-exported — external callers cannot
// reach store mutators. Use the hooks below for all reads.
export { MAX_AUDIT_ENTRIES } from "./state/memoryStore";
export type { MemoryEntry, AuditEntry, MemoryState } from "./state/memoryStore";

// Public read-only hooks (the ONLY external read surface).
export {
  useMemoryConsent,
  useMemoryLiveEntries,
  useMemoryAudit,
} from "./runtime/memoryHooks";

// Router — single hardened public write path.
export {
  writeMemory,
  readMemory,
  setConsent,
  resetMemory,
} from "./runtime/memoryRouter";
export type { RouterDecision } from "./runtime/memoryRouter";

// Continuity engine
export {
  buildGreeting,
  pickPacing,
  buildHints,
} from "./runtime/continuityEngine";
export type { Greeting, Pacing, ContinuityHint } from "./runtime/continuityEngine";

// Components
export { MemorySettingsPanel } from "./components/MemorySettingsPanel";
export type { MemorySettingsPanelProps } from "./components/MemorySettingsPanel";
export { MemoryResetButton } from "./components/MemoryResetButton";
export type { MemoryResetButtonProps } from "./components/MemoryResetButton";
export { MemoryTransparencyView } from "./components/MemoryTransparencyView";
export type { MemoryTransparencyViewProps } from "./components/MemoryTransparencyView";
