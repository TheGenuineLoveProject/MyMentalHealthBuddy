#!/usr/bin/env node
/**
 * heal-self.mjs — Closed-loop autonomous safe self-healing.
 *
 * Pipeline:
 *   1. Run scripts/heal-360.mjs            (fresh probe)
 *   2. If verdict is HEALTHY → exit 0      (nothing to do)
 *   3. Otherwise, invoke scripts/heal-repair.mjs --apply
 *      (SAFE recipes only — destructive recipes still need
 *      explicit `--apply-destructive`, which heal-self never passes)
 *   4. Re-run scripts/heal-360.mjs         (verify recovery)
 *   5. Emit a single-line summary + structured JSON to
 *      docs/health-self-status.json (latest only — overwrites)
 *
 * This is the "fully autonomous" tier of the self-heal stack:
 *   heal-360       → probe (read-only)
 *   heal-watch     → continuous probe loop (read-only)
 *   heal-cron      → scheduled probe (read-only, syslog/NDJSON)
 *   heal-repair    → manual fix prescriber (DRY-RUN by default)
 *   heal-self      → closed loop: probe → safe-repair → re-probe ← THIS
 *
 * Safety contract:
 *   • NEVER passes --apply-destructive. Only safe recipes execute.
 *   • Never touches `/api/ai/chat`, `server/ai/*`, `BuddyAvatar.tsx`,
 *     or `/start` internals (those are the platform's locked surfaces;
 *     heal-repair's recipe registry is already restricted accordingly).
 *   • Stdout is one syslog-style line; full detail goes to the JSON file.
 *   • Exit codes match Nagios convention (0/1/2/3).
 *
 * Usage:
 *   node scripts/heal-self.mjs                  # closed-loop, safe-only
 *   node scripts/heal-self.mjs --dry            # probe + show what would repair, don't apply
 *   node scripts/heal-self.mjs --json           # full JSON to stdout
 *   node scripts/heal-self.mjs --silent         # status file only, no stdout
 */

import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";

const args = process.argv.slice(2);
const DRY = args.includes("--dry");
const JSON_OUT = args.includes("--json");
const SILENT = args.includes("--silent");

const STATUS_PATH = "docs/health-self-status.json";
const REPORT_PATH = "docs/health-check-result.json";
const HOST = os.hostname() || "unknown";
const PROC = "mmhb-self";

function readReport() {
  try {
    if (!fs.existsSync(REPORT_PATH)) return null;
    return JSON.parse(fs.readFileSync(REPORT_PATH, "utf8"));
  } catch { return null; }
}

function verdictFor(exit) {
  if (exit === 0) return "HEALTHY";
  if (exit === 1) return "DEGRADED";
  if (exit === 2) return "NEEDS_REPAIR";
  return "INTERNAL_ERROR";
}

function spawnCapture(cmd, argv) {
  return new Promise((resolve) => {
    let stdout = "";
    let stderr = "";
    const child = spawn(cmd, argv, { stdio: ["ignore", "pipe", "pipe"] });
    child.stdout.on("data", (b) => { stdout += b.toString(); });
    child.stderr.on("data", (b) => { stderr += b.toString(); });
    child.on("error", (err) => resolve({ exit: 3, stdout, stderr: stderr + (err?.message || ""), error: err?.message }));
    child.on("close", (exit) => resolve({ exit: exit ?? 3, stdout, stderr }));
  });
}

async function probe() {
  const r = await spawnCapture("node", ["scripts/heal-360.mjs"]);
  return { exit: r.exit, verdict: verdictFor(r.exit), report: readReport() };
}

async function repairSafe() {
  // SAFE only — never pass --apply-destructive from heal-self.
  const argv = DRY ? [] : ["--apply"];
  return spawnCapture("node", ["scripts/heal-repair.mjs", ...argv]);
}

function syslogLine(rec) {
  const t = rec.after?.report?.totals || {};
  const total = t.total ?? ((t.pass || 0) + (t.warn || 0) + (t.fail || 0));
  const parts = [
    rec.timestamp,
    HOST,
    `${PROC}[${process.pid}]:`,
    rec.outcome,
    `before=${rec.before.verdict}`,
    `after=${rec.after.verdict}`,
    `repaired=${rec.repaired}`,
    `pass=${t.pass || 0}`,
    `warn=${t.warn || 0}`,
    `fail=${t.fail || 0}`,
    `total=${total}`,
  ];
  if (DRY) parts.push("mode=dry");
  return parts.join(" ");
}

function exitForOutcome(outcome) {
  if (outcome === "ALREADY_HEALTHY" || outcome === "REPAIRED_TO_HEALTHY") return 0;
  if (outcome === "REPAIRED_TO_DEGRADED" || outcome === "DRY_RUN")        return 1;
  if (outcome === "REPAIR_FAILED" || outcome === "STILL_NEEDS_REPAIR")    return 2;
  return 3;
}

async function main() {
  const startedAt = new Date().toISOString();

  // 1. Pre-probe
  const before = await probe();

  let repairResult = null;
  let after = before;
  let outcome = "ALREADY_HEALTHY";
  let repaired = false;

  if (before.verdict === "HEALTHY") {
    outcome = "ALREADY_HEALTHY";
  } else if (DRY) {
    repairResult = await repairSafe(); // shows planned repairs, applies nothing
    outcome = "DRY_RUN";
  } else {
    // 2. Apply safe repairs
    repairResult = await repairSafe();
    repaired = true;
    // 3. Re-probe
    after = await probe();
    if (after.verdict === "HEALTHY") {
      outcome = "REPAIRED_TO_HEALTHY";
    } else if (after.verdict === "DEGRADED" && before.verdict === "NEEDS_REPAIR") {
      outcome = "REPAIRED_TO_DEGRADED";
    } else if (after.verdict === before.verdict) {
      outcome = "STILL_NEEDS_REPAIR";
    } else if (repairResult.exit !== 0) {
      outcome = "REPAIR_FAILED";
    } else {
      outcome = "STILL_NEEDS_REPAIR";
    }
  }

  const record = {
    timestamp: new Date().toISOString(),
    startedAt,
    host: HOST,
    pid: process.pid,
    mode: DRY ? "dry" : "apply-safe",
    outcome,
    repaired,
    before: { verdict: before.verdict, exit: before.exit, totals: before.report?.totals || null },
    after: { verdict: after.verdict, exit: after.exit, totals: after.report?.totals || null, report: after.report ? { timestamp: after.report.timestamp, totals: after.report.totals } : null },
    repair: repairResult ? {
      exit: repairResult.exit,
      stdoutTail: (repairResult.stdout || "").split("\n").slice(-20).join("\n"),
      stderrTail: (repairResult.stderr || "").split("\n").slice(-10).join("\n"),
    } : null,
  };

  // Persist latest
  try {
    fs.mkdirSync("docs", { recursive: true });
    fs.writeFileSync(STATUS_PATH, JSON.stringify(record, null, 2));
  } catch { /* best effort */ }

  if (!SILENT) {
    if (JSON_OUT) process.stdout.write(JSON.stringify(record) + "\n");
    else process.stdout.write(syslogLine(record) + "\n");
  }

  process.exit(exitForOutcome(outcome));
}

main().catch((e) => {
  const ts = new Date().toISOString();
  process.stderr.write(`${ts} ${HOST} ${PROC}[${process.pid}]: INTERNAL_ERROR error="${(e?.message || e).toString().replace(/"/g, '\\"')}"\n`);
  process.exit(3);
});
