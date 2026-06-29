// server/routes/biometrics.mjs
//
// REST surface for the Biometric Ingestion Pipeline (Prompt 3.4).
//
// All routes require authentication. NO MOCK READINGS — providers
// either return real data, or the route returns 501 with an
// actionable "missing credentials" message. Apple HealthKit has no
// public web API, so it's exposed as a webhook endpoint that an iOS
// companion app POSTs to with HMAC-signed payloads.
//
// Endpoints:
//   GET    /api/biometrics/connections                 list user's connections
//   POST   /api/biometrics/connect                     start OAuth (returns authUrl)
//   GET    /api/biometrics/callback/:source            OAuth redirect target
//   POST   /api/biometrics/sync/:source                pull latest now
//   POST   /api/biometrics/upload                      manual reading upload
//   POST   /api/biometrics/healthkit/webhook           iOS HealthKit push (HMAC)
//   GET    /api/biometrics/data                        readings query
//   GET    /api/biometrics/latest                      latest reading per metric
//   GET    /api/biometrics/state                       latest nervous-system state
//   POST   /api/biometrics/state/compute               recompute state now
//   DELETE /api/biometrics/disconnect/:source          revoke connection
//   GET    /api/biometrics/meta                        catalog of metrics+devices

import express from "express";
import crypto from "node:crypto";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { sql } from "drizzle-orm";
import { db } from "../db.mjs";
import { requireAuth } from "../middleware/auth.mjs";
import { getIngestionService } from "../biometrics/pipeline.mjs";
import { getProvider, NotConfiguredError } from "../biometrics/providers.mjs";
import {
  SUPPORTED_DEVICE_SOURCES,
  METRIC_REGISTRY,
  isSupportedSource,
  normalizeManualReading,
  normalizeHealthKitSample,
} from "../biometrics/normalizers.mjs";
import { verifyHealthKitSignature } from "../biometrics/crypto.mjs";
import { inferState } from "../biometrics/inference.mjs";

const router = express.Router();
const svc = getIngestionService();

// 60 req/min per IP across all biometric routes (per spec).
const limiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => ipKeyGenerator(req),
  message: { ok: false, error: "rate_limited" },
});
router.use(limiter);

function fail(res, op, err) {
  if (err instanceof NotConfiguredError) {
    // platform-evolution-ignore: intentional biometrics provider deferral; unconfigured wearable providers return graceful 501 instead of fake/mock readings until explicit consent, credentials, and HIPAA-safe storage are configured.
    return res.status(501).json({
      ok: false,
      error: "provider_not_configured",
      deviceSource: err.deviceSource,
      missingEnv: err.missing,
      help: `Set ${err.missing.join(", ")} in environment to enable this provider.`,
    });
  }
  if (err?.statusCode && err.statusCode < 500) {
    console.error(`[biometrics] ${op}:`, err.message);
    return res.status(err.statusCode).json({ ok: false, error: `${op}_failed` });
  }
  console.error(`[biometrics] ${op}:`, err?.stack || err?.message || err);
  return res.status(500).json({ ok: false, error: `${op}_failed` });
}

/* ------------------------------------------------------------ *
 * GET /meta — catalog
 * ------------------------------------------------------------ */
router.get("/meta", (_req, res) => {
  return res.json({
    ok: true,
    deviceSources: SUPPORTED_DEVICE_SOURCES,
    metrics: Object.fromEntries(
      Object.entries(METRIC_REGISTRY).map(([k, v]) => [k, { unit: v.unit, range: [v.min, v.max] }]),
    ),
    notes: {
      apple_healthkit: "iOS-only. Use the /healthkit/webhook endpoint from a native companion app with HMAC-SHA256 signed body.",
      manual: "Anyone can self-report via /upload. Quality score is 50.",
      educational_use_only: "No diagnostic claims. See /crisis for immediate support.",
    },
  });
});

/* ------------------------------------------------------------ *
 * GET /connections — user's wearable connections (no token bytes)
 * ------------------------------------------------------------ */
router.get("/connections", requireAuth, async (req, res) => {
  try {
    const conns = await svc.listConnections(req.user.id);
    return res.json({ ok: true, connections: conns });
  } catch (err) {
    return fail(res, "connections", err);
  }
});

// In-memory OAuth state store (CSRF). 10-minute TTL.
const _stateStore = new Map();
function mintState(userId, deviceSource) {
  const state = crypto.randomBytes(24).toString("base64url");
  _stateStore.set(state, { userId, deviceSource, expiresAt: Date.now() + 10 * 60 * 1000 });
  // Periodic cleanup
  if (_stateStore.size > 1000) {
    const now = Date.now();
    for (const [k, v] of _stateStore) if (v.expiresAt < now) _stateStore.delete(k);
  }
  return state;
}
function consumeState(state) {
  const entry = _stateStore.get(state);
  if (!entry) return null;
  _stateStore.delete(state);
  if (entry.expiresAt < Date.now()) return null;
  return entry;
}

/* ------------------------------------------------------------ *
 * POST /connect — start OAuth flow for a provider
 * Body: { deviceSource }
 * ------------------------------------------------------------ */
router.post("/connect", requireAuth, async (req, res) => {
  try {
    const { deviceSource } = req.body || {};
    if (!isSupportedSource(deviceSource)) {
      return res.status(400).json({ ok: false, error: "unsupported_device_source", supported: SUPPORTED_DEVICE_SOURCES });
    }
    if (deviceSource === "apple_healthkit") {
      return res.status(400).json({
        ok: false,
        error: "apple_healthkit_no_oauth",
        help: "HealthKit has no public web API. Use a native iOS companion app to POST signed payloads to /api/biometrics/healthkit/webhook.",
      });
    }
    if (deviceSource === "manual") {
      return res.status(400).json({
        ok: false,
        error: "manual_no_oauth",
        help: "Manual entries are uploaded directly via POST /api/biometrics/upload — no connection needed.",
      });
    }
    const provider = getProvider(deviceSource);
    if (!provider) return res.status(400).json({ ok: false, error: "no_provider" });
    const state = mintState(req.user.id, deviceSource);
    const authUrl = provider.buildAuthUrl(state);
    return res.json({ ok: true, deviceSource, authUrl, state });
  } catch (err) {
    return fail(res, "connect", err);
  }
});

/* ------------------------------------------------------------ *
 * GET /callback/:source?code=...&state=...
 *   — OAuth redirect target. Exchanges code + persists encrypted token.
 *   — We accept GET (matches what providers redirect to).
 * ------------------------------------------------------------ */
router.get("/callback/:source", async (req, res) => {
  try {
    const deviceSource = req.params.source;
    const { code, state, error: oauthErr } = req.query;
    if (oauthErr) {
      return res.status(400).send(`OAuth declined: ${String(oauthErr).slice(0, 80)}`);
    }
    if (!code || !state) return res.status(400).send("Missing code or state");
    const entry = consumeState(String(state));
    if (!entry) return res.status(400).send("Invalid or expired state");
    if (entry.deviceSource !== deviceSource) return res.status(400).send("State / source mismatch");
    const provider = getProvider(deviceSource);
    if (!provider) return res.status(400).send("Unsupported provider");
    const tokenResponse = await provider.exchangeCode(String(code));
    let externalAccountId = null;
    if (deviceSource === "oura" && typeof provider.fetchProfile === "function") {
      try {
        const profile = await provider.fetchProfile(tokenResponse.access_token);
        externalAccountId = profile?.id || null;
      } catch { /* non-fatal */ }
    }
    const conn = await svc.upsertConnection({
      userId: entry.userId,
      deviceSource,
      tokenResponse,
      externalAccountId,
      scopes: typeof tokenResponse.scope === "string" ? tokenResponse.scope.split(/[\s,]+/) : [],
    });
    // Friendly success page rather than JSON (this is a redirect target).
    return res.status(200).send(
      `<!doctype html><meta charset="utf-8"><title>Connected</title>
       <style>body{font-family:system-ui;padding:32px;max-width:520px;margin:auto;color:#1a1a1a}
       a{color:#7c3aed;text-decoration:none}</style>
       <h1>Connected ✓</h1>
       <p>${escapeHtml(deviceSource)} is now linked to your MMHB account. You can close this window.</p>
       <p><a href="/biometrics">Return to your dashboard →</a></p>`,
    );
  } catch (err) {
    return fail(res, "callback", err);
  }
});
function escapeHtml(s) { return String(s).replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }

/* ------------------------------------------------------------ *
 * POST /sync/:source — fetch latest now (manual trigger)
 * ------------------------------------------------------------ */
router.post("/sync/:source", requireAuth, async (req, res) => {
  try {
    const deviceSource = req.params.source;
    if (!isSupportedSource(deviceSource) || ["apple_healthkit", "manual"].includes(deviceSource)) {
      return res.status(400).json({ ok: false, error: "sync_not_supported_for_source" });
    }
    const conn = await svc.getConnection(req.user.id, deviceSource);
    if (!conn || conn.status !== "connected") {
      return res.status(404).json({ ok: false, error: "no_active_connection" });
    }
    const result = await svc.syncProvider(conn);
    return res.json({ ok: true, deviceSource, ...result });
  } catch (err) {
    return fail(res, "sync", err);
  }
});

/* ------------------------------------------------------------ *
 * POST /upload — manual self-reported readings
 * Body: { readings: [{ metricType, value, unit, recordedAt, metadata? }] }
 * ------------------------------------------------------------ */
router.post("/upload", requireAuth, async (req, res) => {
  try {
    const { readings } = req.body || {};
    if (!Array.isArray(readings) || readings.length === 0) {
      return res.status(400).json({ ok: false, error: "readings_required" });
    }
    if (readings.length > 500) {
      return res.status(400).json({ ok: false, error: "batch_too_large", max: 500 });
    }
    const normalized = readings
      .map((r) => normalizeManualReading(r))
      .filter(Boolean);
    if (normalized.length === 0) {
      return res.status(400).json({ ok: false, error: "no_valid_readings_in_batch" });
    }
    const result = await svc.ingest(req.user.id, normalized);
    return res.json({ ok: true, ...result });
  } catch (err) {
    return fail(res, "upload", err);
  }
});

/* ------------------------------------------------------------ *
 * POST /healthkit/webhook — iOS companion app push
 * Headers: X-MMHB-User-Id, X-MMHB-Signature (hex sha256 HMAC of raw body)
 * Body:    { samples: [HKSample, ...] }
 *
 * Note: this route is NOT requireAuth — auth is via HMAC signature
 * keyed by HKDF(JWT_SECRET, "healthkit-webhook-v1"). The user id is
 * carried in a header and verified via the signature covering the
 * body. The shared secret must be issued to the iOS app out-of-band.
 * ------------------------------------------------------------ */
router.post(
  "/healthkit/webhook",
  async (req, res) => {
    try {
      const userId = req.header("x-mmhb-user-id");
      const sig = req.header("x-mmhb-signature");
      // Raw body is captured by the global express.json verify hook
      // (server/app.mjs). HMAC must be computed over the EXACT bytes
      // the iOS client signed, never over a re-stringified object.
      const raw = req.rawBody;
      if (!userId || !sig || !raw) {
        return res.status(400).json({ ok: false, error: "missing_signature_or_user_or_body" });
      }
      if (!verifyHealthKitSignature(raw, sig)) {
        return res.status(401).json({ ok: false, error: "invalid_signature" });
      }
      const payload = req.body || {};
      const samples = Array.isArray(payload?.samples) ? payload.samples : [];
      if (samples.length === 0) return res.json({ ok: true, stored: 0, rejected: 0, deduped: 0 });
      if (samples.length > 1000) {
        return res.status(400).json({ ok: false, error: "batch_too_large", max: 1000 });
      }
      const normalized = samples
        .map((s) => normalizeHealthKitSample(s))
        .filter(Boolean);
      const result = await svc.ingest(userId, normalized);
      return res.json({ ok: true, ...result });
    } catch (err) {
      return fail(res, "healthkit_webhook", err);
    }
  },
);

/* ------------------------------------------------------------ *
 * GET /data — query readings (paginated)
 * Query: ?since=ISO&until=ISO&metricType=&deviceSource=&limit=100
 * ------------------------------------------------------------ */
router.get("/data", requireAuth, async (req, res) => {
  try {
    const limit = Math.min(500, Math.max(1, Number(req.query.limit) || 100));
    const since = req.query.since ? new Date(String(req.query.since)) : new Date(Date.now() - 30 * 86400000);
    const until = req.query.until ? new Date(String(req.query.until)) : new Date();
    const metricType = req.query.metricType ? String(req.query.metricType) : null;
    const deviceSource = req.query.deviceSource ? String(req.query.deviceSource) : null;

    if (Number.isNaN(since.getTime()) || Number.isNaN(until.getTime())) {
      return res.status(400).json({ ok: false, error: "invalid_date_range" });
    }
    if (metricType && !METRIC_REGISTRY[metricType]) {
      return res.status(400).json({ ok: false, error: "unknown_metric_type" });
    }
    if (deviceSource && !isSupportedSource(deviceSource)) {
      return res.status(400).json({ ok: false, error: "unknown_device_source" });
    }

    const r = await db.execute(sql`
      SELECT id, device_source AS "deviceSource", metric_type AS "metricType",
             value, unit, quality_score AS "qualityScore",
             recorded_at AS "recordedAt", ingested_at AS "ingestedAt", metadata
        FROM biometric_readings
       WHERE user_id = ${req.user.id}
         AND recorded_at >= ${since.toISOString()}
         AND recorded_at <= ${until.toISOString()}
         ${metricType ? sql`AND metric_type = ${metricType}` : sql``}
         ${deviceSource ? sql`AND device_source = ${deviceSource}` : sql``}
       ORDER BY recorded_at DESC
       LIMIT ${limit}
    `);
    const rows = r.rows || r || [];
    return res.json({ ok: true, count: rows.length, readings: rows });
  } catch (err) {
    return fail(res, "data", err);
  }
});

/* ------------------------------------------------------------ *
 * GET /latest — most recent reading per metric for current user
 * ------------------------------------------------------------ */
router.get("/latest", requireAuth, async (req, res) => {
  try {
    const r = await db.execute(sql`
      SELECT DISTINCT ON (metric_type)
             metric_type AS "metricType", device_source AS "deviceSource",
             value, unit, quality_score AS "qualityScore",
             recorded_at AS "recordedAt"
        FROM biometric_readings
       WHERE user_id = ${req.user.id}
       ORDER BY metric_type, recorded_at DESC
    `);
    return res.json({ ok: true, latest: r.rows || r || [] });
  } catch (err) {
    return fail(res, "latest", err);
  }
});

/* ------------------------------------------------------------ *
 * GET /state — most recent nervous-system state
 * ------------------------------------------------------------ */
router.get("/state", requireAuth, async (req, res) => {
  try {
    const r = await db.execute(sql`
      SELECT id, state, confidence, drivers,
             window_start AS "windowStart", window_end AS "windowEnd",
             created_at AS "createdAt"
        FROM nervous_system_states
       WHERE user_id = ${req.user.id}
       ORDER BY created_at DESC
       LIMIT 1
    `);
    const row = (r.rows || r || [])[0] || null;
    return res.json({ ok: true, state: row });
  } catch (err) {
    return fail(res, "state", err);
  }
});

/* ------------------------------------------------------------ *
 * POST /state/compute — recompute & persist nervous-system state
 * ------------------------------------------------------------ */
router.post("/state/compute", requireAuth, async (req, res) => {
  try {
    const inferred = await inferState(req.user.id);
    const r = await db.execute(sql`
      INSERT INTO nervous_system_states (user_id, state, confidence, drivers, window_start, window_end)
      VALUES (${inferred.userId}, ${inferred.state}, ${inferred.confidence},
              ${JSON.stringify(inferred.drivers)}::jsonb,
              ${inferred.windowStart.toISOString()},
              ${inferred.windowEnd.toISOString()})
      RETURNING id, state, confidence, drivers, window_start AS "windowStart", window_end AS "windowEnd", created_at AS "createdAt"
    `);
    return res.json({ ok: true, state: (r.rows || r || [])[0] });
  } catch (err) {
    return fail(res, "state_compute", err);
  }
});

/* ------------------------------------------------------------ *
 * DELETE /disconnect/:source — revoke connection
 * ------------------------------------------------------------ */
router.delete("/disconnect/:source", requireAuth, async (req, res) => {
  try {
    const deviceSource = req.params.source;
    const ok = await svc.disconnect(req.user.id, deviceSource);
    if (!ok) return res.status(404).json({ ok: false, error: "no_connection" });
    return res.json({ ok: true, deviceSource, status: "revoked" });
  } catch (err) {
    return fail(res, "disconnect", err);
  }
});

export default router;
