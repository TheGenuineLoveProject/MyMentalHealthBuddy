// server/lib/healScheduler.mjs
// Background self-heal scheduler.  Opt-in via HEAL_AUTO_ENABLED=true.
//
// Periodically spawns `node scripts/heal-self.mjs --silent` (which itself
// runs heal-360 → safe-only heal-repair → re-probe).  Never invokes
// `--apply-destructive`.  Auto-pauses after N consecutive *failed* outcomes
// so a stuck environment cannot trigger a tight repair loop.
//
// Outcome classification (intentional):
//   GOOD     — ALREADY_HEALTHY, REPAIRED_TO_HEALTHY                  (resets streak)
//   PARTIAL  — REPAIRED_TO_DEGRADED, DRY_RUN                         (does NOT advance streak — partial progress, not failure)
//   FAIL     — REPAIR_FAILED, STILL_NEEDS_REPAIR, TIMEOUT,
//              STALE_STATUS, INTERNAL_ERROR (anything else)          (advances streak; pauses at PAUSE_AFTER_FAILS)
//
// State is kept in-memory (admin GET surfaces it) and also persisted to
// `docs/health-scheduler-status.json` for off-process inspection.
//
// Singleton.  Safe to call startScheduler() multiple times — extra calls
// are no-ops.  Honors process SIGTERM/SIGINT for clean shutdown.

import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { logger } from "../utils/logger.mjs";

const STATE_PATH = "docs/health-scheduler-status.json";
const STATUS_FILE = "docs/health-self-status.json";
const HISTORY_MAX = 48;                  // ~24h at 30-min interval
const DEFAULT_INTERVAL_MS = 30 * 60 * 1000;
const MIN_INTERVAL_MS = 5 * 60 * 1000;   // floor at 5 min so we never DoS the box
const HEAL_TIMEOUT_MS = 120_000;         // 2 min — generous for npm-build
const PAUSE_AFTER_FAILS = 3;

const GOOD_OUTCOMES = new Set(["ALREADY_HEALTHY", "REPAIRED_TO_HEALTHY"]);
const PARTIAL_OUTCOMES = new Set(["REPAIRED_TO_DEGRADED", "DRY_RUN"]);

const state = {
  enabled: false,
  intervalMs: DEFAULT_INTERVAL_MS,
  startedAt: null,
  lastRunAt: null,
  nextRunAt: null,
  inFlight: false,
  pausedReason: null,
  consecutiveFails: 0,
  totalRuns: 0,
  history: [],   // newest-first
};

let timer = null;
let currentChild = null;
let signalsBound = false;

function persist() {
  try {
    const dir = path.dirname(STATE_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(STATE_PATH, JSON.stringify({
      enabled: state.enabled,
      intervalMs: state.intervalMs,
      startedAt: state.startedAt,
      lastRunAt: state.lastRunAt,
      nextRunAt: state.nextRunAt,
      pausedReason: state.pausedReason,
      consecutiveFails: state.consecutiveFails,
      totalRuns: state.totalRuns,
      history: state.history,
    }, null, 2));
  } catch (err) {
    logger.warn?.("[heal-scheduler] persist failed", { error: err?.message });
  }
}

function readSelfHealStatusFresh(runStartedAt) {
  // Freshness guard — only trust the status file if its timestamp is at
  // or after our run start, otherwise we might surface a stale outcome
  // from a crashed previous run.
  try {
    if (!fs.existsSync(STATUS_FILE)) return null;
    const status = JSON.parse(fs.readFileSync(STATUS_FILE, "utf8"));
    const statusAt = status?.timestamp ? Date.parse(status.timestamp) : 0;
    if (Number.isFinite(statusAt) && statusAt >= runStartedAt) return status;
  } catch { /* ignore */ }
  return null;
}

function runOnce() {
  if (state.inFlight) return;
  if (state.pausedReason) return;
  if (!state.enabled) return;

  state.inFlight = true;
  const startedAt = Date.now();

  let child;
  try {
    child = spawn("node", ["scripts/heal-self.mjs", "--silent"], {
      stdio: ["ignore", "ignore", "ignore"],
    });
  } catch (err) {
    state.inFlight = false;
    logger.error?.("[heal-scheduler] spawn failed", { error: err?.message });
    return;
  }
  currentChild = child;

  const killTimer = setTimeout(() => {
    try { child.kill("SIGTERM"); } catch { /* ignore */ }
  }, HEAL_TIMEOUT_MS);

  child.on("error", () => { /* close handler will run */ });
  child.on("close", (code) => {
    clearTimeout(killTimer);
    currentChild = null;
    state.inFlight = false;
    state.totalRuns += 1;
    const finishedAt = Date.now();
    state.lastRunAt = new Date(finishedAt).toISOString();
    state.nextRunAt = new Date(finishedAt + state.intervalMs).toISOString();

    const status = readSelfHealStatusFresh(startedAt);
    let outcome;
    if (code === 124) outcome = "TIMEOUT";
    else if (status?.outcome) outcome = status.outcome;
    else outcome = "STALE_STATUS";

    if (GOOD_OUTCOMES.has(outcome)) {
      state.consecutiveFails = 0;
    } else if (!PARTIAL_OUTCOMES.has(outcome)) {
      state.consecutiveFails += 1;
      if (state.consecutiveFails >= PAUSE_AFTER_FAILS) {
        state.pausedReason = `Auto-paused after ${PAUSE_AFTER_FAILS} consecutive non-healthy outcomes (last: ${outcome}).  Resume from the admin Health Dashboard.`;
        logger.warn?.("[heal-scheduler] auto-paused", { outcome, totalRuns: state.totalRuns });
      }
    }

    state.history.unshift({
      at: state.lastRunAt,
      outcome,
      exitCode: code,
      before: status?.before || null,
      after: status?.after || null,
      durationMs: finishedAt - startedAt,
    });
    while (state.history.length > HISTORY_MAX) state.history.pop();

    persist();
  });
}

function bindSignalsOnce() {
  if (signalsBound) return;
  signalsBound = true;
  const cleanup = () => {
    try { stopScheduler(); } catch { /* ignore */ }
  };
  process.once("SIGTERM", cleanup);
  process.once("SIGINT", cleanup);
}

/**
 * Start the scheduler if HEAL_AUTO_ENABLED=true.  Idempotent.
 * Returns true if the scheduler is now enabled, false otherwise.
 */
export function startScheduler({ intervalMs } = {}) {
  if (process.env.HEAL_AUTO_ENABLED !== "true") return false;
  if (state.enabled) return true;

  let resolved = Number(process.env.HEAL_AUTO_INTERVAL_MS) || intervalMs || DEFAULT_INTERVAL_MS;
  if (resolved < MIN_INTERVAL_MS) resolved = MIN_INTERVAL_MS;
  state.intervalMs = resolved;

  state.enabled = true;
  state.startedAt = new Date().toISOString();
  state.nextRunAt = new Date(Date.now() + state.intervalMs).toISOString();

  timer = setInterval(runOnce, state.intervalMs);
  if (timer.unref) timer.unref();   // don't keep the event loop alive on its own
  bindSignalsOnce();
  persist();
  logger.info?.("[heal-scheduler] started", { intervalMs: state.intervalMs });
  return true;
}

/** Stop the scheduler and kill any in-flight child process. */
export function stopScheduler() {
  if (!state.enabled && !timer) return;
  state.enabled = false;
  if (timer) { clearInterval(timer); timer = null; }
  if (currentChild) {
    try { currentChild.kill("SIGTERM"); } catch { /* ignore */ }
    currentChild = null;
  }
  persist();
  logger.info?.("[heal-scheduler] stopped");
}

/** Clear the pausedReason and reset failure counter so the loop resumes. */
export function resumeScheduler() {
  state.pausedReason = null;
  state.consecutiveFails = 0;
  if (state.enabled) {
    state.nextRunAt = new Date(Date.now() + state.intervalMs).toISOString();
  }
  persist();
}

/** Manually pause without clearing enabled state (e.g. for maintenance). */
export function pauseScheduler(reason = "Manually paused") {
  state.pausedReason = reason;
  persist();
}

/** Read-only snapshot of scheduler state.  Returns history copy, not ref. */
export function getSchedulerState() {
  return {
    enabled: state.enabled,
    intervalMs: state.intervalMs,
    startedAt: state.startedAt,
    lastRunAt: state.lastRunAt,
    nextRunAt: state.nextRunAt,
    inFlight: state.inFlight,
    pausedReason: state.pausedReason,
    consecutiveFails: state.consecutiveFails,
    totalRuns: state.totalRuns,
    history: state.history.slice(0, HISTORY_MAX),
  };
}
