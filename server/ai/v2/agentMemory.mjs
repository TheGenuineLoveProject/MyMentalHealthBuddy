// server/ai/v2/agentMemory.mjs
// MMHB CONSCIOUSNESS OS v2.0 — Prompt 3.1: Three-tier agent memory.
//
// Spec ref: Part III §3.1 (Continuity), Part II §2.5 (Synthetic Employee
// Registry — every agent retains decision context for review).
//
// Tier matrix:
//   HOT  — in-process Map (TTL + max entries). Per (agentId, scope) key.
//          Survives only the current node process; cleared on restart.
//   WARM — last N rows from agent_decisions (created in v2.0 Phase 0)
//          where agentId matches. Read-only; this module never writes
//          to the DB. The orchestrator owns writes.
//   COLD — long-horizon lakehouse export. Deferred to v2.0 Phase 4
//          (S3/Parquet pipeline). Returns an explicit availability flag.
//
// Locked files (orchestrator.mjs, memory.mjs, profileStore.mjs,
// responsePolicy.mjs, crisis logic) are NEVER imported here.
// This is a parallel v2 surface that lives alongside v1 memory.

import { db, schema } from "../../db.mjs";
import { eq, desc } from "drizzle-orm";

const { agentDecisions } = schema;

const HOT_TTL_MS = 10 * 60 * 1000; // 10 min
const HOT_MAX_ENTRIES = 1000;
const HOT_PER_KEY_MAX = 20;

// Map<key, { items: Array<{ts, payload}>, expiresAt }>
const hot = new Map();

function hotKey(agentId, scope) {
  return `${agentId || "system"}::${scope || "global"}`;
}

function pruneHot() {
  const now = Date.now();
  for (const [k, v] of hot.entries()) {
    if (v.expiresAt < now) hot.delete(k);
  }
  if (hot.size > HOT_MAX_ENTRIES) {
    // Drop oldest insertion order (Map preserves it)
    const overflow = hot.size - HOT_MAX_ENTRIES;
    let i = 0;
    for (const k of hot.keys()) {
      if (i++ >= overflow) break;
      hot.delete(k);
    }
  }
}

export function rememberHot(agentId, scope, payload) {
  pruneHot();
  const k = hotKey(agentId, scope);
  const existing = hot.get(k);
  const items = existing?.items || [];
  items.push({ ts: Date.now(), payload });
  if (items.length > HOT_PER_KEY_MAX) items.shift();
  hot.set(k, { items, expiresAt: Date.now() + HOT_TTL_MS });
}

export function recallHot(agentId, scope, limit = 5) {
  pruneHot();
  const k = hotKey(agentId, scope);
  const entry = hot.get(k);
  if (!entry) return [];
  return entry.items.slice(-Math.max(1, Math.min(limit, HOT_PER_KEY_MAX)));
}

export async function recallWarm(agentId, limit = 5) {
  if (!agentId) return [];
  const safeLimit = Math.max(1, Math.min(Number(limit) || 5, 25));
  const rows = await db
    .select({
      id: agentDecisions.id,
      decisionType: agentDecisions.decisionType,
      outcome: agentDecisions.outcome,
      confidence: agentDecisions.confidence,
      priorityEscalated: agentDecisions.priorityEscalated,
      createdAt: agentDecisions.createdAt,
    })
    .from(agentDecisions)
    .where(eq(agentDecisions.agentId, agentId))
    .orderBy(desc(agentDecisions.createdAt))
    .limit(safeLimit);
  return rows;
}

export function recallCold(/* agentId, query */) {
  return {
    tier: "cold",
    available: false,
    note: "Lakehouse export deferred to v2.0 Phase 4 (S3/Parquet pipeline).",
  };
}

export function memoryStats() {
  pruneHot();
  let totalItems = 0;
  for (const v of hot.values()) totalItems += v.items.length;
  return {
    hot: {
      keys: hot.size,
      items: totalItems,
      ttlMs: HOT_TTL_MS,
      maxEntries: HOT_MAX_ENTRIES,
      perKeyMax: HOT_PER_KEY_MAX,
    },
    warm: { source: "agent_decisions", note: "read-only via recallWarm()" },
    cold: { available: false },
  };
}

export function clearHot() {
  hot.clear();
}
