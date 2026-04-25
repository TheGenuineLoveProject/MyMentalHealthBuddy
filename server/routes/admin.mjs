// server/routes/admin.mjs
import { Router } from "express";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { logger } from "../utils/logger.mjs";
import { JWT_SECRET as ACCESS_SECRET } from "../config/secrets.mjs";
import { diagnoseHealthReport, PROMPT_VERSION as AI_PROMPT_VERSION } from "../lib/healAI.mjs";
import {
  getSchedulerState,
  resumeScheduler,
  pauseScheduler,
} from "../lib/healScheduler.mjs";

const router = Router();
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

function requireAuth(req, res, next) {
  const header = req.headers?.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) return res.status(401).json({ ok: false, message: "Unauthorized." });

  try {
    req.user = jwt.verify(token, ACCESS_SECRET);
    return next();
  } catch (_e) {
    return res.status(401).json({ ok: false, message: "Unauthorized." });
  }
}

// Admin token verification endpoint
router.post("/verify-token", (req, res) => {
  const { token } = req.body;
  
  if (!ADMIN_TOKEN) {
    logger.warn("[Admin] ADMIN_TOKEN not configured");
    return res.status(500).json({ success: false, message: "Admin access not configured" });
  }
  
  if (!token) {
    return res.status(400).json({ success: false, message: "Token required" });
  }
  
  // Timing-safe comparison to prevent timing attacks
  const tokenBuffer = Buffer.from(token);
  const adminBuffer = Buffer.from(ADMIN_TOKEN);
  
  if (tokenBuffer.length !== adminBuffer.length) {
    logger.info("[Admin] Invalid token attempt", { ip: req.ip });
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
  
  if (!crypto.timingSafeEqual(tokenBuffer, adminBuffer)) {
    logger.info("[Admin] Invalid token attempt", { ip: req.ip });
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
  
  logger.info("[Admin] Successful admin authentication", { ip: req.ip });
  
  // Generate a short-lived admin session token
  const sessionToken = jwt.sign(
    { role: "admin", timestamp: Date.now() },
    ACCESS_SECRET,
    { expiresIn: "4h" }
  );
  
  return res.json({ 
    success: true, 
    message: "Admin access granted",
    sessionToken 
  });
});

// Verify admin session endpoint
router.get("/verify-session", (req, res) => {
  const header = req.headers?.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ valid: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, ACCESS_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ valid: false, message: "Not an admin session" });
    }
    return res.json({ valid: true, role: "admin" });
  } catch (err) {
    return res.status(401).json({ valid: false, message: "Invalid or expired token" });
  }
});

// Example admin stats endpoint used by tests
router.get("/stats", requireAuth, (_req, res) => {
  res.json({ ok: true, stats: { status: "healthy" } });
});

// Admin health endpoint for dashboard
const startTime = Date.now();
router.get("/health", async (_req, res) => {
  try {
    const db = (await import("../db/client.mjs")).default;
    const { sql } = await import("drizzle-orm");
    const { isConfigured } = await import("../utils/aiClient.mjs");
    
    let dbConnected = false;
    let dbLatency = null;
    
    if (process.env.DATABASE_URL) {
      try {
        const dbStart = Date.now();
        await db.execute(sql`SELECT 1`);
        dbConnected = true;
        dbLatency = Date.now() - dbStart;
      } catch (dbErr) {
        logger.warn("Admin health DB probe failed", { error: dbErr?.message || dbErr });
        dbConnected = false;
      }
    }

    const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
    const days = Math.floor(uptimeSeconds / 86400);
    const hours = Math.floor((uptimeSeconds % 86400) / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const secs = uptimeSeconds % 60;
    const uptimeFormatted = [
      days > 0 && `${days}d`,
      hours > 0 && `${hours}h`,
      minutes > 0 && `${minutes}m`,
      `${secs}s`
    ].filter(Boolean).join(" ");

    res.json({
      status: dbConnected ? "healthy" : "degraded",
      environment: process.env.NODE_ENV || "development",
      version: process.env.npm_package_version || "2.0.0",
      database: { 
        status: dbConnected ? "connected" : "disconnected",
        latencyMs: dbLatency 
      },
      ai: { 
        status: isConfigured() ? "healthy" : "unavailable",
        available: isConfigured() 
      },
      uptime: {
        seconds: uptimeSeconds,
        formatted: uptimeFormatted,
        startedAt: new Date(startTime).toISOString(),
      },
      memory: {
        heapUsedMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        heapTotalMB: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        rssMB: Math.round(process.memoryUsage().rss / 1024 / 1024),
      },
      services: {
        stripe: { configured: !!process.env.STRIPE_SECRET_KEY },
        openai: { configured: !!(process.env.OPENAI_API_KEY || process.env.AI_INTEGRATIONS_OPENAI_API_KEY) },
        sentry: { configured: !!process.env.SENTRY_DSN },
        resend: { configured: !!process.env.RESEND_API_KEY },
      }
    });
  } catch (error) {
    logger.error("Admin health check error", { error: error?.message || error });
    res.status(500).json({ status: "unhealthy", error: "Health probe failed" });
  }
});

// Admin deep-health endpoint — surfaces the heal-360 report + heal-watch streak
// for the Command Center health dashboard.  Read-only; never re-runs probes
// (probes are run by `scripts/heal-360.mjs` or `scripts/heal-watch.mjs`).
router.get("/health-deep", async (_req, res) => {
  try {
    const fs = await import("node:fs");
    const REPORT_PATH = "docs/health-check-result.json";
    const WATCH_PATH = "docs/health-watch-status.json";

    let report = null;
    let reportError = null;
    if (fs.existsSync(REPORT_PATH)) {
      try { report = JSON.parse(fs.readFileSync(REPORT_PATH, "utf8")); }
      catch (e) { reportError = e?.message || String(e); }
    } else {
      reportError = "No heal-360 report yet — run `node scripts/heal-360.mjs` or `bash scripts/heal-all.sh`.";
    }

    let watch = null;
    if (fs.existsSync(WATCH_PATH)) {
      try { watch = JSON.parse(fs.readFileSync(WATCH_PATH, "utf8")); } catch { /* ignore */ }
    }

    // Summarize for UI without sending the entire raw report.  Verdict
    // resolution mirrors GET /health-deep/metrics for cross-endpoint
    // consistency: prefer the report's canonical `overallStatus`, fall back
    // to legacy `verdict`, then a totals-derived computation.
    const totals = report?.totals || { pass: 0, warn: 0, fail: 0, total: 0 };
    const categories = report?.categories || null;
    const checks = Array.isArray(report?.checks) ? report.checks : [];
    const _passN = Number(totals.pass) || 0;
    const _warnN = Number(totals.warn) || 0;
    const _failN = Number(totals.fail) || 0;
    const _computedVerdict =
      _failN > 0 ? "NEEDS_REPAIR" :
      _warnN > 0 ? "DEGRADED" :
      (_passN > 0 || Number(totals.total) > 0) ? "HEALTHY" : "UNKNOWN";
    const verdict = report?.overallStatus || report?.verdict || _computedVerdict;

    const nonPass = checks
      .filter(c => c.status !== "pass")
      .map(c => ({
        name: c.name,
        status: c.status,
        message: c.message || null,
        hint: c.hint || null,
      }));

    res.json({
      ok: true,
      verdict,
      totals,
      categories,
      reportTimestamp: report?.timestamp || null,
      reportPath: REPORT_PATH,
      reportError,
      nonPass,
      watch: watch ? {
        latest: watch.latest || null,
        streak: watch.streak || null,
        updatedAt: watch.updatedAt || null,
        sampleCount: Array.isArray(watch.samples) ? watch.samples.length : 0,
      } : null,
      probeHistory: _probeHistory.slice(0, PROBE_HISTORY_MAX),
      selfHealHistory: _selfHealHistory.slice(0, SELF_HEAL_HISTORY_MAX),
      aiHistory: _aiHistory.slice(0, AI_HISTORY_MAX),
      scheduler: getSchedulerState(),
    });
  } catch (error) {
    logger.error("Admin health-deep error", { error: error?.message || error });
    res.status(500).json({ ok: false, error: "Deep health probe failed" });
  }
});

// Admin-triggered re-probe.  Spawns `node scripts/heal-360.mjs` as a child
// process; heal-360 is read-only, so this is safe to expose to admins.
// Returns the verdict + totals after the probe completes (typically <2s).
// A simple 30s in-memory cooldown prevents accidental rapid re-probes.
//
// Each successful run is appended to a small in-memory ring buffer
// (`_probeHistory`, last 10 runs) so the admin dashboard can show recent
// re-probe activity without persisting to the database.  History is
// surfaced on the GET /api/admin/health-deep response under `probeHistory`.
let _lastProbeAt = 0;
const _probeHistory = []; // [{ at, verdict, exitCode, totals, durationMs, actorId }]
const PROBE_HISTORY_MAX = 10;

router.post("/health-deep/run", async (req, res) => {
  const now = Date.now();
  const COOLDOWN_MS = 30_000;
  const since = now - _lastProbeAt;
  if (since < COOLDOWN_MS) {
    return res.status(429).json({
      ok: false,
      error: "Probe cooldown active",
      retryAfterMs: COOLDOWN_MS - since,
    });
  }
  _lastProbeAt = now;

  try {
    const { spawn } = await import("node:child_process");
    const fs = await import("node:fs");
    const REPORT_PATH = "docs/health-check-result.json";

    const probeStartedAt = Date.now();
    const exitCode = await new Promise((resolve) => {
      const child = spawn("node", ["scripts/heal-360.mjs"], {
        stdio: ["ignore", "ignore", "ignore"],
      });
      const timer = setTimeout(() => {
        try { child.kill("SIGTERM"); } catch { /* ignore */ }
        resolve(124); // timeout
      }, 30_000);
      child.on("error", () => { clearTimeout(timer); resolve(3); });
      child.on("close", (code) => { clearTimeout(timer); resolve(code ?? 3); });
    });
    const durationMs = Date.now() - probeStartedAt;

    let totals = null;
    let timestamp = null;
    if (fs.existsSync(REPORT_PATH)) {
      try {
        const j = JSON.parse(fs.readFileSync(REPORT_PATH, "utf8"));
        totals = j.totals || null;
        timestamp = j.timestamp || null;
      } catch { /* report unreadable */ }
    }

    const verdict =
      exitCode === 0 ? "HEALTHY" :
      exitCode === 1 ? "DEGRADED" :
      exitCode === 2 ? "NEEDS_REPAIR" :
      exitCode === 124 ? "TIMEOUT" : "INTERNAL_ERROR";

    // Append to ring buffer (newest first)
    _probeHistory.unshift({
      at: new Date().toISOString(),
      verdict,
      exitCode,
      totals,
      durationMs,
      actorId: req.user?.id || null,
    });
    while (_probeHistory.length > PROBE_HISTORY_MAX) _probeHistory.pop();

    logger.info("Admin re-probe completed", { verdict, exitCode, totals, durationMs });
    res.json({ ok: true, verdict, exitCode, totals, durationMs, reportTimestamp: timestamp });
  } catch (error) {
    logger.error("Admin re-probe error", { error: error?.message || error });
    res.status(500).json({ ok: false, error: "Re-probe failed" });
  }
});

// Admin-triggered self-heal.  Spawns `node scripts/heal-self.mjs --silent`
// (which itself runs heal-360 → safe-only heal-repair → re-probe and persists
// docs/health-self-status.json).  heal-self NEVER passes --apply-destructive,
// so this remains within the safe-only contract.
//
// Cooldown is longer (60s) because heal-self does more work than a probe and
// can trigger `npm run build`.  Timeout is 90s for the same reason.  Each run
// appends to `_selfHealHistory` (in-memory ring buffer, last 10).
let _lastSelfHealAt = 0;
const _selfHealHistory = [];
const SELF_HEAL_HISTORY_MAX = 10;

router.post("/health-deep/self-heal", async (req, res) => {
  const now = Date.now();
  const COOLDOWN_MS = 60_000;
  const since = now - _lastSelfHealAt;
  if (since < COOLDOWN_MS) {
    return res.status(429).json({
      ok: false,
      error: "Self-heal cooldown active",
      retryAfterMs: COOLDOWN_MS - since,
    });
  }
  _lastSelfHealAt = now;

  try {
    const { spawn } = await import("node:child_process");
    const fs = await import("node:fs");
    const STATUS_PATH = "docs/health-self-status.json";

    const startedAt = Date.now();
    const exitCode = await new Promise((resolve) => {
      const child = spawn("node", ["scripts/heal-self.mjs", "--silent"], {
        stdio: ["ignore", "ignore", "ignore"],
      });
      const timer = setTimeout(() => {
        try { child.kill("SIGTERM"); } catch { /* ignore */ }
        resolve(124);
      }, 90_000);
      child.on("error", () => { clearTimeout(timer); resolve(3); });
      child.on("close", (code) => { clearTimeout(timer); resolve(code ?? 3); });
    });
    const durationMs = Date.now() - startedAt;

    // Freshness guard — only trust the status file if its timestamp is at
    // or after our run start, otherwise we might surface a stale outcome
    // from a crashed previous run (architect-recommended hardening).
    let status = null;
    if (fs.existsSync(STATUS_PATH)) {
      try {
        const parsed = JSON.parse(fs.readFileSync(STATUS_PATH, "utf8"));
        const statusAt = parsed?.timestamp ? Date.parse(parsed.timestamp) : 0;
        if (Number.isFinite(statusAt) && statusAt >= startedAt) {
          status = parsed;
        }
      } catch { /* unreadable */ }
    }

    let outcome;
    if (exitCode === 124) outcome = "TIMEOUT";
    else if (status?.outcome) outcome = status.outcome;
    else outcome = "STALE_STATUS";

    _selfHealHistory.unshift({
      at: new Date().toISOString(),
      outcome,
      exitCode,
      before: status?.before || null,
      after: status?.after || null,
      durationMs,
      actorId: req.user?.id || null,
    });
    while (_selfHealHistory.length > SELF_HEAL_HISTORY_MAX) _selfHealHistory.pop();

    logger.info("Admin self-heal completed", { outcome, exitCode, durationMs });
    res.json({
      ok: true,
      outcome,
      exitCode,
      durationMs,
      before: status?.before || null,
      after: status?.after || null,
    });
  } catch (error) {
    logger.error("Admin self-heal error", { error: error?.message || error });
    res.status(500).json({ ok: false, error: "Self-heal failed" });
  }
});

// AI-Assisted Health Diagnosis.  Reads the latest health-360 report from
// docs/health-check-result.json, sends a slim digest to Perplexity, and
// returns a structured remediation plan.  Admin-only, observability-layer.
// 60s cooldown + 30s timeout.  Last 5 results retained in `_aiHistory`.
let _lastAiAnalyzeAt = 0;
const _aiHistory = [];
const AI_HISTORY_MAX = 5;

router.post("/health-deep/ai-analyze", async (req, res) => {
  const now = Date.now();
  const COOLDOWN_MS = 60_000;
  const since = now - _lastAiAnalyzeAt;
  if (since < COOLDOWN_MS) {
    return res.status(429).json({
      ok: false,
      error: "AI analysis cooldown active",
      retryAfterMs: COOLDOWN_MS - since,
    });
  }
  _lastAiAnalyzeAt = now;

  try {
    const fs = await import("node:fs");
    const REPORT_PATH = "docs/health-check-result.json";
    if (!fs.existsSync(REPORT_PATH)) {
      return res.status(409).json({
        ok: false,
        error: "No health probe report available. Trigger a re-probe first.",
      });
    }

    let report = null;
    try {
      report = JSON.parse(fs.readFileSync(REPORT_PATH, "utf8"));
    } catch {
      return res.status(500).json({ ok: false, error: "Health report unreadable" });
    }

    const startedAt = Date.now();
    const result = await diagnoseHealthReport(report, { timeoutMs: 30_000 });
    const durationMs = Date.now() - startedAt;

    if (!result.ok) {
      logger.warn("Admin AI diagnosis failed", { error: result.error, durationMs });
      return res.status(502).json({ ok: false, error: result.error });
    }

    _aiHistory.unshift({
      at: new Date().toISOString(),
      diagnosis: result.diagnosis,
      model: result.model,
      promptVersion: AI_PROMPT_VERSION,
      safetyFiltered: !!result.safetyFiltered,
      durationMs,
      reportVerdict: report?.verdict || null,
      actorId: req.user?.id || null,
    });
    while (_aiHistory.length > AI_HISTORY_MAX) _aiHistory.pop();

    logger.info("Admin AI diagnosis completed", {
      model: result.model,
      durationMs,
      severity: result.diagnosis?.overall_severity,
    });
    res.json({
      ok: true,
      diagnosis: result.diagnosis,
      model: result.model,
      durationMs,
      usage: result.usage,
    });
  } catch (error) {
    logger.error("Admin AI diagnosis error", { error: error?.message || error });
    res.status(500).json({ ok: false, error: "AI analysis failed" });
  }
});

// Scheduler control surface (admin-only).  Lets the operator resume an
// auto-paused scheduler or manually pause it for maintenance.  Cannot
// enable the scheduler from here — that's gated by HEAL_AUTO_ENABLED env.
router.post("/health-deep/scheduler/resume", (req, res) => {
  resumeScheduler();
  logger.info("Admin resumed heal-scheduler", { actorId: req.user?.id || null });
  res.json({ ok: true, scheduler: getSchedulerState() });
});

router.post("/health-deep/scheduler/pause", (req, res) => {
  const reason = (req.body?.reason && String(req.body.reason).slice(0, 200)) || "Manually paused by admin";
  pauseScheduler(reason);
  logger.info("Admin paused heal-scheduler", { reason, actorId: req.user?.id || null });
  res.json({ ok: true, scheduler: getSchedulerState() });
});

// =====================================================================
// Declarative alert-rule registry.  Each rule is a pure function of a
// snapshot.  Severity convention: critical pages, warning is investigative,
// info is contextual.  Rules are evaluated by /alerts and surfaced as a
// `mmhb_alert_firing{rule,severity}` gauge in /metrics for Prometheus
// consumption.  `_alertSince` records the first observed firing per rule
// so the dashboard can show an accurate "since" timestamp.
// =====================================================================
const ALERT_RULES = [
  {
    id: "scheduler.consecutive_fails",
    name: "Scheduler consecutive failures",
    severity: "critical",
    description: "Background self-heal scheduler hit ≥3 consecutive failed outcomes (auto-paused).",
    evaluate: (s) => {
      const v = Number(s.scheduler?.consecutiveFails) || 0;
      return { firing: v >= 3, value: v, threshold: 3, message: `consecutiveFails=${v}` };
    },
  },
  {
    id: "watch.needs_repair_present",
    name: "Watch reports NEEDS_REPAIR samples",
    severity: "critical",
    description: "Recent heal-watch window contains one or more NEEDS_REPAIR samples.",
    evaluate: (s) => {
      const v = Number(s.watch?.streak?.needsRepair) || 0;
      return { firing: v >= 1, value: v, threshold: 1, message: `needsRepair=${v}` };
    },
  },
  {
    id: "probe.has_failures",
    name: "Latest probe has failing checks",
    severity: "critical",
    description: "The latest health probe shows totals.fail > 0.",
    evaluate: (s) => {
      const v = Number(s.probe?.totals?.fail) || 0;
      return { firing: v > 0, value: v, threshold: 1, message: `fail=${v}` };
    },
  },
  {
    id: "watch.degraded_streak",
    name: "Watch sustained DEGRADED streak",
    severity: "warning",
    description: "Recent heal-watch window contains ≥5 DEGRADED samples.",
    evaluate: (s) => {
      const v = Number(s.watch?.streak?.degraded) || 0;
      return { firing: v >= 5, value: v, threshold: 5, message: `degraded=${v}` };
    },
  },
  {
    id: "selfheal.high_mttr",
    name: "Self-heal MTTR exceeds budget",
    severity: "warning",
    description: "Mean time to repair (REPAIRED_TO_HEALTHY) exceeds 60 seconds.",
    evaluate: (s) => {
      const v = Number(s.selfheal?.mttrMs) || 0;
      return { firing: v > 60000, value: v, threshold: 60000, message: `mttrMs=${v}` };
    },
  },
  {
    id: "probe.stale",
    name: "Latest probe is stale",
    severity: "warning",
    description: "Latest health-check-result.json is older than 1 hour.",
    evaluate: (s) => {
      const ts = s.probe?.timestamp ? new Date(s.probe.timestamp).getTime() : null;
      const ageMs = ts && Number.isFinite(ts) ? Date.now() - ts : null;
      const limit = 60 * 60 * 1000;
      const firing = ageMs !== null && ageMs > limit;
      return {
        firing,
        value: ageMs ?? -1,
        threshold: limit,
        message: firing ? `age=${Math.round(ageMs / 60000)}m` : "fresh",
      };
    },
  },
  {
    id: "ai.safety_filter_spike",
    name: "AI diagnosis safety-filter spike",
    severity: "info",
    description: "More than 50% of recent AI diagnoses triggered the destructive-language post-filter (min 3 calls).",
    evaluate: (s) => {
      const arr = Array.isArray(s.aiHistory) ? s.aiHistory : [];
      const total = arr.length;
      const filtered = arr.filter((a) => a?.safetyFiltered).length;
      const ratio = total > 0 ? filtered / total : 0;
      const firing = total >= 3 && ratio > 0.5;
      return { firing, value: filtered, threshold: total, message: `filtered=${filtered}/${total}` };
    },
  },
  {
    id: "process.recently_started",
    name: "Process recently started",
    severity: "info",
    description: "Process uptime < 5 minutes — alert signals may not yet be representative.",
    evaluate: () => {
      const u = process.uptime();
      const firing = u < 300;
      return { firing, value: Math.round(u), threshold: 300, message: `uptime=${Math.round(u)}s` };
    },
  },
];

const _alertSince = new Map(); // ruleId -> ISO timestamp first observed firing

function evaluateAlerts(state) {
  const now = new Date().toISOString();
  const alerts = ALERT_RULES.map((rule) => {
    let result;
    try {
      result = rule.evaluate(state) || {};
    } catch (e) {
      result = { firing: false, value: -1, threshold: -1, message: `evalError:${e?.message || "unknown"}` };
    }
    if (result.firing) {
      if (!_alertSince.has(rule.id)) _alertSince.set(rule.id, now);
    } else {
      _alertSince.delete(rule.id);
    }
    return {
      id: rule.id,
      name: rule.name,
      severity: rule.severity,
      description: rule.description,
      firing: !!result.firing,
      since: result.firing ? _alertSince.get(rule.id) : null,
      value: result.value ?? null,
      threshold: result.threshold ?? null,
      message: result.message || "",
    };
  });
  const firing = alerts.filter((a) => a.firing);
  return {
    evaluatedAt: now,
    alerts,
    summary: {
      total: alerts.length,
      firing: firing.length,
      critical: firing.filter((a) => a.severity === "critical").length,
      warning: firing.filter((a) => a.severity === "warning").length,
      info: firing.filter((a) => a.severity === "info").length,
    },
  };
}

async function gatherAlertState() {
  const fs = await import("node:fs");
  let report = null;
  try {
    if (fs.existsSync("docs/health-check-result.json")) {
      report = JSON.parse(fs.readFileSync("docs/health-check-result.json", "utf8"));
    }
  } catch { /* ignore */ }
  let watch = null;
  try {
    if (fs.existsSync("docs/health-watch-status.json")) {
      watch = JSON.parse(fs.readFileSync("docs/health-watch-status.json", "utf8"));
    }
  } catch { /* ignore */ }
  const successful = _selfHealHistory.filter(
    (r) => r?.outcome === "REPAIRED_TO_HEALTHY" && Number.isFinite(r?.durationMs)
  );
  const mttrMs = successful.length > 0
    ? Math.round(successful.reduce((sum, r) => sum + r.durationMs, 0) / successful.length)
    : 0;
  return {
    probe: report,
    watch,
    scheduler: getSchedulerState(),
    selfheal: { mttrMs },
    aiHistory: _aiHistory,
  };
}

// SLI / Prometheus-style metrics endpoint.  Admin-only (protected by the
// mount-level chain).  Default format is Prometheus text v0.0.4; pass
// `?format=json` for a structured payload.  Read-only, derives entirely
// from in-memory ring buffers + the latest persisted probe/watch files.
router.get("/health-deep/metrics", async (req, res) => {
  try {
    const fs = await import("node:fs");
    const wantJson = String(req.query?.format || "").toLowerCase() === "json";

    let report = null;
    try {
      if (fs.existsSync("docs/health-check-result.json")) {
        report = JSON.parse(fs.readFileSync("docs/health-check-result.json", "utf8"));
      }
    } catch { /* ignore */ }

    let watch = null;
    try {
      if (fs.existsSync("docs/health-watch-status.json")) {
        watch = JSON.parse(fs.readFileSync("docs/health-watch-status.json", "utf8"));
      }
    } catch { /* ignore */ }

    const sched = getSchedulerState();

    // MTTR — mean duration of self-heal runs that actually repaired to healthy.
    const successful = _selfHealHistory.filter(
      (r) => r?.outcome === "REPAIRED_TO_HEALTHY" && Number.isFinite(r?.durationMs)
    );
    const mttrMs = successful.length > 0
      ? Math.round(successful.reduce((sum, r) => sum + r.durationMs, 0) / successful.length)
      : 0;

    // Probe uptime% — share of admin-triggered probes in the ring buffer
    // that returned HEALTHY.  Rough proxy; not a true SLO.
    const probeUptimePct = _probeHistory.length > 0
      ? Math.round((100 * _probeHistory.filter((p) => p?.verdict === "HEALTHY").length) / _probeHistory.length)
      : 0;

    // Watch streak shape: { window, healthy, degraded, needsRepair, internalError }
    // `window` is the consecutive-sample length covered by the breakdown.
    const watchStreak = watch?.streak || {};
    const watchStreakLength = Number(watchStreak?.window) || 0;
    const watchSamples = Array.isArray(watch?.samples) ? watch.samples.length : 0;
    const lastHeal = _selfHealHistory[0];

    // Verdict: prefer the report's canonical `overallStatus`; fall back to
    // totals-derived resolution mirroring the GET /health-deep computation.
    const totalsObj = report?.totals || { pass: 0, warn: 0, fail: 0 };
    const passN = Number(totalsObj.pass) || 0;
    const warnN = Number(totalsObj.warn) || 0;
    const failN = Number(totalsObj.fail) || 0;
    const computedVerdict =
      failN > 0 ? "NEEDS_REPAIR" :
      warnN > 0 ? "DEGRADED" :
      passN > 0 ? "HEALTHY" : "UNKNOWN";
    const rawVerdict = report?.overallStatus || report?.verdict || computedVerdict;
    // Defensive: normalize + allowlist so an unexpected future enum value
    // (e.g. "warning", "ok") doesn't produce an all-zero one-hot block.
    const VERDICT_ALLOWED = new Set(["HEALTHY", "DEGRADED", "NEEDS_REPAIR", "INTERNAL_ERROR", "UNKNOWN"]);
    const normalized = String(rawVerdict || "").toUpperCase();
    const verdict = VERDICT_ALLOWED.has(normalized) ? normalized : "UNKNOWN";

    const data = {
      verdict,
      pass: passN,
      warn: warnN,
      fail: failN,
      uptimeSeconds: Math.round(process.uptime()),
      probeUptimePct,
      probeRunsTotal: _probeHistory.length,
      selfHealRunsTotal: _selfHealHistory.length,
      mttrMs,
      lastHealOutcome: lastHeal?.outcome || "none",
      aiDiagnosesTotal: _aiHistory.length,
      aiSafetyFilteredTotal: _aiHistory.filter((a) => a?.safetyFiltered).length,
      aiPromptVersion: AI_PROMPT_VERSION,
      schedulerEnabled: sched.enabled ? 1 : 0,
      schedulerPaused: sched.pausedReason ? 1 : 0,
      schedulerRunsTotal: sched.totalRuns || 0,
      schedulerConsecutiveFails: sched.consecutiveFails || 0,
      watchStreakLength,
      watchSamples,
    };

    // Evaluate alert rules once per scrape.  Both formats include alert
    // signals so Prometheus + dashboard share a single source of truth.
    const alertEval = evaluateAlerts({
      probe: report,
      watch,
      scheduler: sched,
      selfheal: { mttrMs },
      aiHistory: _aiHistory,
    });

    if (wantJson) {
      return res.json({
        ok: true,
        ...data,
        alerts: alertEval.summary,
        generatedAt: new Date().toISOString(),
      });
    }

    res.setHeader("Content-Type", "text/plain; version=0.0.4; charset=utf-8");
    const lines = [];
    const renderMetric = (name, help, type, samples) => {
      lines.push(`# HELP mmhb_${name} ${help}`);
      lines.push(`# TYPE mmhb_${name} ${type}`);
      for (const s of samples) {
        lines.push(`mmhb_${name}${s.labels || ""} ${s.value}`);
      }
    };

    renderMetric("health_pass_total", "Number of passing checks in the latest probe", "gauge", [{ value: data.pass }]);
    renderMetric("health_warn_total", "Number of warning checks in the latest probe", "gauge", [{ value: data.warn }]);
    renderMetric("health_fail_total", "Number of failing checks in the latest probe", "gauge", [{ value: data.fail }]);

    renderMetric(
      "health_verdict",
      "Current health verdict (one-hot)",
      "gauge",
      ["HEALTHY", "DEGRADED", "NEEDS_REPAIR", "INTERNAL_ERROR", "UNKNOWN"].map((v) => ({
        labels: `{verdict="${v}"}`,
        value: data.verdict === v ? 1 : 0,
      }))
    );

    renderMetric("uptime_seconds", "Process uptime in seconds", "counter", [{ value: data.uptimeSeconds }]);
    renderMetric("probe_uptime_percent", "Percent of recent admin-triggered probes returning HEALTHY", "gauge", [{ value: data.probeUptimePct }]);
    renderMetric("probe_runs_total", "Number of admin-triggered probes in the ring buffer", "counter", [{ value: data.probeRunsTotal }]);
    renderMetric("selfheal_runs_total", "Number of admin-triggered self-heal runs in the ring buffer", "counter", [{ value: data.selfHealRunsTotal }]);
    renderMetric("selfheal_mttr_ms", "Mean time to repair across REPAIRED_TO_HEALTHY self-heals", "gauge", [{ value: data.mttrMs }]);
    renderMetric(
      "selfheal_last_outcome",
      "Latest self-heal outcome (one-hot)",
      "gauge",
      [
        "ALREADY_HEALTHY", "REPAIRED_TO_HEALTHY", "REPAIRED_TO_DEGRADED",
        "STILL_NEEDS_REPAIR", "REPAIR_FAILED", "DRY_RUN", "STALE_STATUS",
        "TIMEOUT", "INTERNAL_ERROR", "none",
      ].map((o) => ({ labels: `{outcome="${o}"}`, value: data.lastHealOutcome === o ? 1 : 0 }))
    );

    renderMetric("ai_diagnoses_total", "Number of admin-triggered AI diagnoses in the ring buffer", "counter", [{ value: data.aiDiagnosesTotal }]);
    renderMetric("ai_safety_filtered_total", "Number of AI diagnoses that triggered the destructive-language filter", "counter", [{ value: data.aiSafetyFilteredTotal }]);
    renderMetric("ai_prompt_version_info", "AI diagnosis prompt version (label-only)", "gauge",
      [{ labels: `{version="${data.aiPromptVersion}"}`, value: 1 }]);

    renderMetric("scheduler_enabled", "Background heal scheduler is enabled (0/1)", "gauge", [{ value: data.schedulerEnabled }]);
    renderMetric("scheduler_paused", "Background heal scheduler is paused (0/1)", "gauge", [{ value: data.schedulerPaused }]);
    renderMetric("scheduler_runs_total", "Total background self-heal runs since process start", "counter", [{ value: data.schedulerRunsTotal }]);
    renderMetric("scheduler_consecutive_fails", "Current consecutive failed-outcome count", "gauge", [{ value: data.schedulerConsecutiveFails }]);

    renderMetric("watch_streak", "Current heal-watch streak window length (consecutive samples covered)", "gauge", [{ value: data.watchStreakLength }]);
    renderMetric(
      "watch_streak_kind",
      "Heal-watch streak breakdown by verdict kind across the current window",
      "gauge",
      [
        { labels: `{kind="healthy"}`,       value: Number(watchStreak?.healthy) || 0 },
        { labels: `{kind="degraded"}`,      value: Number(watchStreak?.degraded) || 0 },
        { labels: `{kind="needsRepair"}`,   value: Number(watchStreak?.needsRepair) || 0 },
        { labels: `{kind="internalError"}`, value: Number(watchStreak?.internalError) || 0 },
      ]
    );
    renderMetric("watch_samples", "Number of samples in the heal-watch ring buffer", "gauge", [{ value: data.watchSamples }]);

    // Alert rule firing state — one labeled sample per rule.  Always emits
    // 0/1 explicitly so Prometheus has a stable label set even when no
    // rule is firing.  Rule IDs come from a hardcoded registry so labels
    // are safe (no injection).
    renderMetric(
      "alert_firing",
      "Whether a declarative alert rule is currently firing (0/1)",
      "gauge",
      alertEval.alerts.map((a) => ({
        labels: `{rule="${a.id}",severity="${a.severity}"}`,
        value: a.firing ? 1 : 0,
      }))
    );
    renderMetric(
      "alerts_firing_total",
      "Total alert rules currently firing across all severities",
      "gauge",
      [{ value: alertEval.summary.firing }]
    );

    res.send(lines.join("\n") + "\n");
  } catch (error) {
    logger.error("Admin health-deep metrics error", { error: error?.message || error });
    if (String(req.query?.format || "").toLowerCase() === "json") {
      return res.status(500).json({ ok: false, error: "Metrics generation failed" });
    }
    res.status(500).set("Content-Type", "text/plain").send("# error generating metrics\n");
  }
});

// Declarative alert evaluator surface.  Returns the full rule registry
// with current firing state + a roll-up summary.  Read-only.
router.get("/health-deep/alerts", async (_req, res) => {
  try {
    const state = await gatherAlertState();
    const evaluated = evaluateAlerts(state);
    res.json({ ok: true, ...evaluated });
  } catch (error) {
    logger.error("Admin health-deep alerts error", { error: error?.message || error });
    res.status(500).json({ ok: false, error: "Alerts evaluation failed" });
  }
});

// Diagnostic-bundle export.  Returns a single downloadable JSON document
// containing the latest probe, watch, scheduler state, all in-memory ring
// buffers, derived stats (MTTR), and current alert evaluation.  Useful for
// offline analysis, support handoffs, and post-incident review.  Admin-only.
router.get("/health-deep/export", async (req, res) => {
  try {
    const fs = await import("node:fs");

    let report = null;
    let reportError = null;
    try {
      if (fs.existsSync("docs/health-check-result.json")) {
        report = JSON.parse(fs.readFileSync("docs/health-check-result.json", "utf8"));
      }
    } catch (e) {
      reportError = e?.message || "parse error";
    }

    let watch = null;
    let watchError = null;
    try {
      if (fs.existsSync("docs/health-watch-status.json")) {
        watch = JSON.parse(fs.readFileSync("docs/health-watch-status.json", "utf8"));
      }
    } catch (e) {
      watchError = e?.message || "parse error";
    }

    const successful = _selfHealHistory.filter(
      (r) => r?.outcome === "REPAIRED_TO_HEALTHY" && Number.isFinite(r?.durationMs)
    );
    const mttrMs = successful.length > 0
      ? Math.round(successful.reduce((sum, r) => sum + r.durationMs, 0) / successful.length)
      : 0;

    const sched = getSchedulerState();
    const alertEval = evaluateAlerts({
      probe: report,
      watch,
      scheduler: sched,
      selfheal: { mttrMs },
      aiHistory: _aiHistory,
    });

    const bundle = {
      manifest: {
        schemaVersion: "1",
        bundleType: "mmhb-health-diagnostic",
        generatedAt: new Date().toISOString(),
        generatedBy: { actorRole: req.user?.role || null, ip: req.ip || null },
        promptVersion: AI_PROMPT_VERSION,
        nodeVersion: process.version,
        uptimeSeconds: Math.round(process.uptime()),
      },
      probe: report,
      probeError: reportError,
      watch,
      watchError,
      scheduler: sched,
      ringBuffers: {
        probeHistory: _probeHistory.slice(),
        selfHealHistory: _selfHealHistory.slice(),
        aiHistory: _aiHistory.slice(),
      },
      derived: { mttrMs },
      alerts: alertEval,
    };

    const ts = new Date().toISOString().replace(/[:.]/g, "-");
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="mmhb-health-bundle-${ts}.json"`);
    res.send(JSON.stringify(bundle, null, 2));
  } catch (error) {
    logger.error("Admin health-deep export error", { error: error?.message || error });
    res.status(500).json({ ok: false, error: "Export failed" });
  }
});

router.get("/diagnostics", async (_req, res) => {
  try {
    const db = (await import("../db/client.mjs")).default;
    const { sql } = await import("drizzle-orm");
    
    const dbStats = { users: 0, messages: 0, reflections: 0, moods: 0 };
    const envVars = {};

    // Check environment variables (presence only, not values)
    const envChecks = [
      'DATABASE_URL',
      'OPENAI_API_KEY',
      'AI_INTEGRATIONS_OPENAI_API_KEY',
      'STRIPE_SECRET_KEY',
      'STRIPE_PUBLISHABLE_KEY',
      'SENTRY_DSN',
      'RESEND_API_KEY',
      'ADMIN_TOKEN',
      'SESSION_SECRET'
    ];
    
    envChecks.forEach(key => {
      envVars[key] = !!process.env[key];
    });

    if (process.env.DATABASE_URL) {
      try {
        const [usersResult, messagesResult, reflectionsResult, moodsResult] = await Promise.all([
          db.execute(sql`SELECT COUNT(*)::int as count FROM users`),
          db.execute(sql`SELECT COUNT(*)::int as count FROM ai_messages`),
          db.execute(sql`SELECT COUNT(*)::int as count FROM reflections`),
          db.execute(sql`SELECT COUNT(*)::int as count FROM moods`),
        ]);
        dbStats.users = usersResult.rows?.[0]?.count || 0;
        dbStats.messages = messagesResult.rows?.[0]?.count || 0;
        dbStats.reflections = reflectionsResult.rows?.[0]?.count || 0;
        dbStats.moods = moodsResult.rows?.[0]?.count || 0;
      } catch (e) {
        logger.error("DB stats query error", { error: e?.message || e });
      }
    }

    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      node: {
        version: process.version,
        platform: process.platform,
      },
      database: dbStats,
      envVars,
      memory: {
        heapUsedMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        heapTotalMB: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        rssMB: Math.round(process.memoryUsage().rss / 1024 / 1024),
        externalMB: Math.round(process.memoryUsage().external / 1024 / 1024),
      },
    });
  } catch (error) {
    logger.error("Diagnostics error", { error: error?.message || error });
    res.status(500).json({ error: "Failed to gather diagnostics" });
  }
});


// Health check endpoint for admin daily tools monitoring
router.get("/", (req, res) => {
  res.json({ ok: true, module: "admin", status: "operational", timestamp: new Date().toISOString() });
});

export default router;