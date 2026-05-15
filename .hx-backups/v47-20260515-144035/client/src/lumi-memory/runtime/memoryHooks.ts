/**
 * Phase 16 — Reflective Memory Layer
 *
 * Public read-only hooks. ALL external (host-app) memory reads MUST come
 * through these. The raw Zustand store (which carries internal mutators)
 * is intentionally NOT re-exported from the barrel; this file is the
 * ONLY public read surface.
 *
 * Pruning is applied at the read boundary — UI surfaces never see expired
 * entries, even if a write/router call has not yet pruned them.
 */

import { useMemo } from "react";
import {
  useMemoryStore,
  selectConsent,
  selectRawEntries,
  selectAudit,
  type MemoryEntry,
  type AuditEntry,
} from "../state/memoryStore";
import {
  ALLOWED_MEMORY_FIELDS,
  type AllowedMemoryField,
} from "../state/allowedMemoryFields";
import { isExpired } from "../safety/memoryRetentionRules";
import type { ConsentRecord } from "../safety/memoryConsentRules";

/** Consent record (read-only). */
export function useMemoryConsent(): ConsentRecord {
  return useMemoryStore(selectConsent);
}

/**
 * Live (non-expired) memory entries. Pruning happens *in the selector* —
 * pure, no setState. The underlying store will lazy-prune the next time
 * `writeMemory`/`readMemory`/`resetMemory` is called.
 */
export function useMemoryLiveEntries(
  nowMs?: number,
): Partial<Record<AllowedMemoryField, MemoryEntry>> {
  const raw = useMemoryStore(selectRawEntries);
  const now = nowMs ?? Date.now();
  return useMemo(() => {
    const out: Partial<Record<AllowedMemoryField, MemoryEntry>> = {};
    for (const f of ALLOWED_MEMORY_FIELDS) {
      const e = raw[f];
      if (!e) continue;
      if (isExpired(e.expiresAtMs, now)) continue;
      out[f] = e;
    }
    return out;
  }, [raw, now]);
}

/** Audit log (read-only). */
export function useMemoryAudit(): ReadonlyArray<AuditEntry> {
  return useMemoryStore(selectAudit);
}
