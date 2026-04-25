#!/usr/bin/env node
/**
 * heal-watch.mjs — Rolling self-heal watch loop
 *
 * Runs `scripts/heal-360.mjs` every N seconds (default 300 = 5 min) and
 * persists a rolling status file at `docs/health-watch-status.json` plus
 * a compact one-line status to stdout per cycle.  Read-only; never repairs.
 * Pair with `scripts/heal-repair.mjs --apply` (manually invoked) to act on
 * any FAIL/WARN signatures it surfaces.
 *
 * Designed for:
 *   • a long-running terminal tab during dev
 *   • a Replit always-on workflow
 *   • a cron / systemd timer (single-shot mode via --once)
 *
 * Usage:
 *   node scripts/heal-watch.mjs                # loop every 5 min
 *   node scripts/heal-watch.mjs --interval=60  # loop every 60 sec
 *   node scripts/heal-watch.mjs --once         # one cycle, then exit
 *   node scripts/heal-watch.mjs --quiet        # suppress per-cycle stdout (still writes file)
 *
 * Exit codes (single-shot via --once):
 *   0 = HEALTHY      (heal-360 exit 0)
 *   1 = DEGRADED     (heal-360 exit 1)
 *   2 = NEEDS_REPAIR (heal-360 exit 2)
 *   3 = INTERNAL_ERROR (could not run probe)
 *
 * Loop mode runs forever until SIGINT / SIGTERM, writing a snapshot
 * to disk each cycle so other tools (admin UI, CI, etc.) can read the
 * latest verdict without re-running probes.
 */

import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const ONCE = args.includes("--once");
const QUIET = args.includes("--quiet");
const intervalArg = args.find(a => a.startsWith("--interval="));
const INTERVAL_SEC = intervalArg ? Math.max(10, parseInt(intervalArg.split("=")[1], 10) || 300) : 300;

const STATUS_PATH = "docs/health-watch-status.json";
const REPORT_PATH = "docs/health-check-result.json";
const HISTORY_LIMIT = 50;

const C = {
  reset: "\x1b[0m", dim: "\x1b[2m",
  green: "\x1b[32m", yellow: "\x1b[33m", red: "\x1b[31m",
  cyan: "\x1b[36m", bold: "\x1b[1m",
};

function ts() { return new Date().toISOString(); }
function ensureDocsDir() { fs.mkdirSync("docs", { recursive: true }); }

function statusFor(exit) {
  if (exit === 0) return "HEALTHY";
  if (exit === 1) return "DEGRADED";
  if (exit === 2) return "NEEDS_REPAIR";
  return "INTERNAL_ERROR";
}

function colorFor(status) {
  return {
    HEALTHY: C.green,
    DEGRADED: C.yellow,
    NEEDS_REPAIR: C.red,
    INTERNAL_ERROR: C.red,
  }[status] || C.dim;
}

/** Run heal-360 once; resolve with { exit, totals, timestamp } */
function runProbe() {
  return new Promise((resolve) => {
    const child = spawn("node", ["scripts/heal-360.mjs"], { stdio: ["ignore", "ignore", "ignore"] });
    child.on("error", (err) => resolve({ exit: 3, error: err?.message || String(err) }));
    child.on("close", (exit) => {
      // Read totals from the report heal-360 just wrote
      let totals = null;
      let timestamp = null;
      try {
        if (fs.existsSync(REPORT_PATH)) {
          const j = JSON.parse(fs.readFileSync(REPORT_PATH, "utf8"));
          totals = j.totals || null;
          timestamp = j.timestamp || null;
        }
      } catch (_e) { /* report unreadable; surface in status anyway */ }
      resolve({ exit: exit ?? 3, totals, timestamp });
    });
  });
}

/** Append a sample to the rolling history file (truncated to HISTORY_LIMIT) */
function persistStatus(sample) {
  ensureDocsDir();
  let prior = { samples: [] };
  if (fs.existsSync(STATUS_PATH)) {
    try { prior = JSON.parse(fs.readFileSync(STATUS_PATH, "utf8")); } catch { prior = { samples: [] }; }
  }
  const samples = Array.isArray(prior.samples) ? prior.samples : [];
  samples.push(sample);
  while (samples.length > HISTORY_LIMIT) samples.shift();

  // Compute summary streak from latest 10 samples
  const last10 = samples.slice(-10);
  const counts = last10.reduce((acc, s) => {
    acc[s.status] = (acc[s.status] || 0) + 1;
    return acc;
  }, {});

  const out = {
    latest: sample,
    streak: {
      window: last10.length,
      healthy: counts.HEALTHY || 0,
      degraded: counts.DEGRADED || 0,
      needsRepair: counts.NEEDS_REPAIR || 0,
      internalError: counts.INTERNAL_ERROR || 0,
    },
    samples,
    updatedAt: ts(),
  };
  fs.writeFileSync(STATUS_PATH, JSON.stringify(out, null, 2));
}

async function cycle() {
  const startedAt = ts();
  const r = await runProbe();
  const status = statusFor(r.exit);
  const sample = {
    startedAt,
    finishedAt: ts(),
    status,
    exitCode: r.exit,
    totals: r.totals,
    reportTimestamp: r.timestamp,
    error: r.error || null,
  };
  persistStatus(sample);

  if (!QUIET) {
    const col = colorFor(status);
    const t = r.totals || { pass: 0, warn: 0, fail: 0 };
    const total = t.total ?? ((t.pass || 0) + (t.warn || 0) + (t.fail || 0));
    console.log(
      `${C.dim}[${sample.finishedAt}]${C.reset} ` +
      `${col}${C.bold}${status.padEnd(13)}${C.reset} ` +
      `${C.green}✓ ${t.pass || 0}${C.reset}  ` +
      `${C.yellow}⚠ ${t.warn || 0}${C.reset}  ` +
      `${C.red}✗ ${t.fail || 0}${C.reset}  ` +
      `${C.dim}(${total} checks · status → ${STATUS_PATH})${C.reset}`
    );
    if (r.error) console.log(`  ${C.red}error: ${r.error}${C.reset}`);
  }

  return sample;
}

async function main() {
  if (!QUIET) {
    console.log(`${C.cyan}${C.bold}heal-watch${C.reset} ${C.dim}— rolling self-heal probe${C.reset}`);
    console.log(`${C.dim}  mode:     ${ONCE ? "single-shot (--once)" : `loop every ${INTERVAL_SEC}s`}${C.reset}`);
    console.log(`${C.dim}  status:   ${path.resolve(STATUS_PATH)}${C.reset}`);
    console.log(`${C.dim}  report:   ${path.resolve(REPORT_PATH)} (written by heal-360)${C.reset}`);
    console.log("");
  }

  if (ONCE) {
    const s = await cycle();
    process.exit(s.exitCode);
  }

  // ── Loop mode ────────────────────────────────────────────────────────
  let stopping = false;
  const stop = (sig) => {
    if (stopping) return;
    stopping = true;
    if (!QUIET) console.log(`\n${C.cyan}heal-watch stopping (${sig})${C.reset}`);
    process.exit(0);
  };
  process.on("SIGINT", () => stop("SIGINT"));
  process.on("SIGTERM", () => stop("SIGTERM"));

  while (!stopping) {
    try { await cycle(); } catch (e) {
      if (!QUIET) console.error(`${C.red}cycle failed: ${e?.message || e}${C.reset}`);
    }
    await new Promise((r) => setTimeout(r, INTERVAL_SEC * 1000));
  }
}

main().catch((e) => {
  console.error(`heal-watch fatal: ${e?.message || e}`);
  process.exit(3);
});
