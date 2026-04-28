// server/ai/v2/agentWorkingMemory.mjs
// MMHB CONSCIOUSNESS OS v2.0 — Prompt 3.1 extension: Redis working memory.
//
// Spec ref: Part III §3.1 (Continuity), Part II §2.5 (cross-process
// shared scratchpad for synthetic employees).
//
// Design contract:
//   • Optional Redis tier that lives ALONGSIDE the existing HOT/WARM/COLD
//     memory in agentMemory.mjs. It is never required.
//   • If REDIS_URL is unset OR ioredis is unavailable OR connection
//     fails, this module falls back to an in-process Map with the same
//     surface API. Falling back is logged once at first call and is
//     never an error.
//   • All keys are prefixed with `mmhb:v2:wm:` to keep the namespace
//     isolated from other Redis users.
//   • Stored values are JSON. Failed serialization returns null; the
//     caller never sees an exception.
//   • Default TTL is 30 minutes. Values are short-lived working
//     scratchpads, not durable storage.

const KEY_PREFIX = "mmhb:v2:wm:";
const DEFAULT_TTL_SECONDS = 30 * 60;
const MAX_VALUE_BYTES = 32 * 1024;

let backendPromise = null;
let backendReady = null;

// Fallback in-process store: Map<fullKey, { value, expiresAt }>
const fallbackStore = new Map();
const FALLBACK_MAX_KEYS = 500;

// Stale-read guard: if a Redis WRITE just failed and we wrote to fallback
// instead, we must serve subsequent READs of that same key from fallback
// for a short window — otherwise Redis recovery would surface stale data
// while the fresh value sits in the local Map. Map<fullKey, expiresAt>.
const fallbackPreferUntil = new Map();
const FALLBACK_PREFER_WINDOW_MS = 60 * 1000; // 60 seconds

function markFallbackPreferred(fullK) {
  fallbackPreferUntil.set(fullK, Date.now() + FALLBACK_PREFER_WINDOW_MS);
  // Cap the prefer-list at 1000 entries to bound memory.
  if (fallbackPreferUntil.size > 1000) {
    const overflow = fallbackPreferUntil.size - 1000;
    let i = 0;
    for (const k of fallbackPreferUntil.keys()) {
      if (i++ >= overflow) break;
      fallbackPreferUntil.delete(k);
    }
  }
}

function isFallbackPreferred(fullK) {
  const until = fallbackPreferUntil.get(fullK);
  if (!until) return false;
  if (until < Date.now()) {
    fallbackPreferUntil.delete(fullK);
    return false;
  }
  return true;
}

function fullKey(agentId, scope, key) {
  return `${KEY_PREFIX}${agentId || "system"}:${scope || "global"}:${String(key).slice(0, 80)}`;
}

function safeStringify(val) {
  try {
    const s = JSON.stringify(val);
    if (s.length > MAX_VALUE_BYTES) return null;
    return s;
  } catch {
    return null;
  }
}

function safeParse(s) {
  if (typeof s !== "string") return null;
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}

async function ensureBackend() {
  if (backendReady) return backendReady;
  if (!backendPromise) {
    backendPromise = (async () => {
      const url = process.env.REDIS_URL || process.env.UPSTASH_REDIS_URL || null;
      if (!url) {
        console.log("[agentWorkingMemory] REDIS_URL not set — using in-process fallback store.");
        return { kind: "fallback" };
      }
      try {
        const mod = await import("ioredis");
        const Redis = mod?.default || mod;
        const client = new Redis(url, {
          lazyConnect: true,
          maxRetriesPerRequest: 1,
          enableOfflineQueue: false,
          connectTimeout: 1500,
        });
        client.on("error", (err) => {
          // Suppress noisy reconnect errors; module already runs in
          // graceful-degradation mode.
          if (process.env.AGENT_WM_DEBUG === "1") {
            console.warn("[agentWorkingMemory] redis error:", err?.message || err);
          }
        });
        await client.connect();
        await client.ping();
        console.log("[agentWorkingMemory] Redis connected; working memory using Redis backend.");
        return { kind: "redis", client };
      } catch (err) {
        console.warn(
          "[agentWorkingMemory] Redis unavailable (",
          err?.message || err,
          ") — using in-process fallback store."
        );
        return { kind: "fallback" };
      }
    })();
  }
  backendReady = await backendPromise;
  return backendReady;
}

function pruneFallback() {
  const now = Date.now();
  for (const [k, v] of fallbackStore.entries()) {
    if (v.expiresAt && v.expiresAt < now) fallbackStore.delete(k);
  }
  if (fallbackStore.size > FALLBACK_MAX_KEYS) {
    const overflow = fallbackStore.size - FALLBACK_MAX_KEYS;
    let i = 0;
    for (const k of fallbackStore.keys()) {
      if (i++ >= overflow) break;
      fallbackStore.delete(k);
    }
  }
}

export async function wmWrite(agentId, scope, key, value, ttlSeconds = DEFAULT_TTL_SECONDS) {
  const k = fullKey(agentId, scope, key);
  const payload = safeStringify({ v: value, t: Date.now() });
  if (payload === null) {
    return { ok: false, reason: "value_too_large_or_unserializable" };
  }
  const backend = await ensureBackend();
  if (backend.kind === "redis") {
    try {
      await backend.client.set(k, payload, "EX", Math.max(1, Math.min(ttlSeconds | 0, 24 * 60 * 60)));
      // Successful Redis write: clear any prefer-fallback flag so reads
      // resume going to Redis (the source of truth in clustered envs).
      fallbackPreferUntil.delete(k);
      return { ok: true, backend: "redis" };
    } catch (err) {
      // On Redis failure, write to the in-process fallback AND mark this
      // key as "prefer fallback" for a short window. Without this flag,
      // a recovering Redis would serve stale (or empty) data on the next
      // read while the fresh value sits unread in the local Map.
      pruneFallback();
      fallbackStore.set(k, { value: payload, expiresAt: Date.now() + ttlSeconds * 1000 });
      markFallbackPreferred(k);
      return { ok: true, backend: "fallback", redisError: err?.message || "set_failed" };
    }
  }
  pruneFallback();
  fallbackStore.set(k, { value: payload, expiresAt: Date.now() + ttlSeconds * 1000 });
  return { ok: true, backend: "fallback" };
}

export async function wmRead(agentId, scope, key) {
  const k = fullKey(agentId, scope, key);
  const backend = await ensureBackend();

  // If a recent Redis write failed for this key, the freshest copy lives
  // in the local fallback. Serve it from there until the prefer window
  // expires or the next successful Redis write clears the flag.
  if (backend.kind === "redis" && isFallbackPreferred(k)) {
    pruneFallback();
    const entry = fallbackStore.get(k);
    if (entry && (!entry.expiresAt || entry.expiresAt >= Date.now())) {
      const parsed = safeParse(entry.value);
      return parsed?.v ?? null;
    }
    // Fall through to Redis if fallback expired in the meantime.
  }

  if (backend.kind === "redis") {
    try {
      const raw = await backend.client.get(k);
      if (raw) {
        const parsed = safeParse(raw);
        return parsed?.v ?? null;
      }
      // Redis returned no value — try fallback as a last resort in case a
      // very recent write went there.
    } catch {
      // fall through to fallback read
    }
  }
  pruneFallback();
  const entry = fallbackStore.get(k);
  if (!entry) return null;
  if (entry.expiresAt && entry.expiresAt < Date.now()) {
    fallbackStore.delete(k);
    return null;
  }
  const parsed = safeParse(entry.value);
  return parsed?.v ?? null;
}

export async function wmDelete(agentId, scope, key) {
  const k = fullKey(agentId, scope, key);
  const backend = await ensureBackend();
  if (backend.kind === "redis") {
    try {
      await backend.client.del(k);
    } catch {
      /* ignore */
    }
  }
  fallbackStore.delete(k);
  return { ok: true };
}

export async function workingMemoryStatus() {
  const backend = await ensureBackend();
  pruneFallback();
  return {
    backend: backend.kind,
    redisConfigured: !!(process.env.REDIS_URL || process.env.UPSTASH_REDIS_URL),
    fallbackKeys: fallbackStore.size,
    keyPrefix: KEY_PREFIX,
    defaultTtlSeconds: DEFAULT_TTL_SECONDS,
    maxValueBytes: MAX_VALUE_BYTES,
    fallbackMaxKeys: FALLBACK_MAX_KEYS,
  };
}
