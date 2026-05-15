/**
 * Phase 16 — Reflective Memory Layer
 *
 * Zustand store with audit trail. Hosts MUST NOT call store mutators
 * directly — use `memoryRouter.{writeMemory, resetMemory, setConsent}`
 * for the audited public path. The barrel does not re-export raw mutators.
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  ALLOWED_MEMORY_FIELDS,
  type AllowedMemoryField,
  type MemoryValueShape,
} from "./allowedMemoryFields";
import {
  INITIAL_CONSENT,
  type ConsentRecord,
} from "../safety/memoryConsentRules";
import {
  isExpired,
  expiresAtFor,
} from "../safety/memoryRetentionRules";

/** A single memory entry with retention metadata. */
export type MemoryEntry<F extends AllowedMemoryField = AllowedMemoryField> = {
  field: F;
  value: MemoryValueShape[F];
  /** ms-since-epoch when this entry was written. */
  writtenAtMs: number;
  /** ms-since-epoch when this entry expires. */
  expiresAtMs: number;
};

/** Audit entry — logged on every state-changing operation. */
export type AuditEntry = {
  id: string;
  /** ms-since-epoch. */
  atMs: number;
  kind:
    | "write"
    | "reset"
    | "consent_granted"
    | "consent_declined"
    | "consent_revoked"
    | "auto_pruned"
    | "rejected_unknown_field"
    | "rejected_invalid_value"
    | "rejected_forbidden_content"
    | "rejected_no_consent";
  field?: AllowedMemoryField | string;
  reasonHint?: string;
};

/** Audit log itself is capped — never grows unbounded. */
export const MAX_AUDIT_ENTRIES = 200;

export type MemoryState = {
  consent: ConsentRecord;
  /** field-keyed map of live entries. Pruned on read. */
  entries: Partial<Record<AllowedMemoryField, MemoryEntry>>;
  audit: ReadonlyArray<AuditEntry>;
};

export type MemoryActions = {
  /** INTERNAL — see file header. */
  _setConsent: (next: ConsentRecord) => void;
  /** INTERNAL — see file header. */
  _putEntry: <F extends AllowedMemoryField>(field: F, value: MemoryValueShape[F], nowMs: number) => void;
  /** INTERNAL — see file header. */
  _appendAudit: (entry: AuditEntry) => void;
  /** INTERNAL — see file header. */
  _pruneExpired: (nowMs: number) => void;
  /** Public — wipes ALL memory + audit. Sole permitted from-host write API. */
  reset: () => void;
};

const initialState: MemoryState = {
  consent: INITIAL_CONSENT,
  entries: {},
  audit: [],
};

let auditSeq = 0;
function nextAuditId(): string {
  auditSeq += 1;
  return `audit-${Date.now().toString(36)}-${auditSeq}`;
}

export function makeAuditEntry(kind: AuditEntry["kind"], opts: { field?: string; reasonHint?: string } = {}): AuditEntry {
  return {
    id: nextAuditId(),
    atMs: Date.now(),
    kind,
    field: opts.field,
    reasonHint: opts.reasonHint,
  };
}

// v5.8.80: persist consent + entries (NOT audit — audit is ephemeral
// diagnostic, would grow unbounded across reloads and bloat localStorage).
// Without this, `lastSessionAt` evaporates on every reload and the entire
// continuity contract (30-day retention, welcome-back tiering, consent
// durability) is meaningless. Architect-flagged primary functional gap
// in P6 Path B v5.8.80 review.
export const useMemoryStore = create<MemoryState & MemoryActions>()(
  persist(
    (set) => ({
  ...initialState,

  _setConsent(next) {
    set((s) => {
      // Revocation wipes the store atomically with the state change.
      if (next.state === "revoked" || next.state === "declined") {
        return { ...s, consent: next, entries: {} };
      }
      return { ...s, consent: next };
    });
  },

  _putEntry(field, value, nowMs) {
    set((s) => ({
      ...s,
      entries: {
        ...s.entries,
        [field]: {
          field,
          value,
          writtenAtMs: nowMs,
          expiresAtMs: expiresAtFor(field, nowMs),
        } as MemoryEntry,
      },
    }));
  },

  _appendAudit(entry) {
    set((s) => {
      const next = [...s.audit, entry];
      if (next.length > MAX_AUDIT_ENTRIES) {
        next.splice(0, next.length - MAX_AUDIT_ENTRIES);
      }
      return { ...s, audit: next };
    });
  },

  _pruneExpired(nowMs) {
    set((s) => {
      let changed = false;
      const next: Partial<Record<AllowedMemoryField, MemoryEntry>> = {};
      for (const f of ALLOWED_MEMORY_FIELDS) {
        const e = s.entries[f];
        if (!e) continue;
        if (isExpired(e.expiresAtMs, nowMs)) {
          changed = true;
          continue;
        }
        next[f] = e;
      }
      if (!changed) return s;
      return { ...s, entries: next };
    });
  },

  reset() {
    set(() => ({ ...initialState, audit: [makeAuditEntry("reset")] }));
  },
}),
    {
      name: "mmhb-lumi-memory-v1",
      storage: createJSONStorage(() => localStorage),
      // Persist consent + entries only. Audit stays in-memory: it's
      // diagnostic, capped at MAX_AUDIT_ENTRIES per session, and persisting
      // it would (a) bloat localStorage and (b) leak rejection metadata
      // (e.g. forbidden-pattern category hints) across reloads.
      partialize: (s) => ({ consent: s.consent, entries: s.entries }),
      version: 1,
    },
  ),
);

// ─── Selectors (INTERNAL — module-private) ──────────────────────────────────
// External callers MUST use the read-only hooks exported from
// `runtime/memoryHooks.ts` (re-exported from the barrel). These selectors
// are intentionally not re-exported from `index.ts` so the raw store
// (which carries mutators) is unreachable from outside the module.

export function selectConsent(s: MemoryState): ConsentRecord {
  return s.consent;
}

export function selectRawEntries(s: MemoryState): Partial<Record<AllowedMemoryField, MemoryEntry>> {
  return s.entries;
}

export function selectAudit(s: MemoryState): ReadonlyArray<AuditEntry> {
  return s.audit;
}
