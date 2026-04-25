#!/usr/bin/env node
/**
 * heal-cron.mjs — Single-shot heal probe for cron / systemd / Replit always-on
 *
 * Designed for unattended scheduled execution.  Behaviour differs from
 * heal-watch's `--once` in three operationally-important ways:
 *
 *   1. Output is a SINGLE syslog-style line on stdout, suitable for piping
 *      into rsyslog / journalctl / a log aggregator without parsing JSON.
 *   2. A rolling daily NDJSON history file at `docs/health-cron-YYYYMMDD.log`
 *      (one JSON object per line) is appended on every run.  Files older
 *      than RETENTION_DAYS (default 30) are removed automatically.
 *   3. Exit code maps cleanly to standard Nagios-style monitoring:
 *        0 = OK         (HEALTHY)
 *        1 = WARNING    (DEGRADED)
 *        2 = CRITICAL   (NEEDS_REPAIR)
 *        3 = UNKNOWN    (probe could not run)
 *
 * Usage:
 *   node scripts/heal-cron.mjs                           # run once, syslog line + NDJSON append
 *   node scripts/heal-cron.mjs --retention=7             # keep last 7 days of NDJSON
 *   node scripts/heal-cron.mjs --silent                  # no stdout (still appends NDJSON)
 *   node scripts/heal-cron.mjs --json                    # full JSON to stdout instead of syslog line
 *
 * Crontab example (every 5 min):
 *   * /5 * * * *  cd /path/to/app && /usr/bin/env node scripts/heal-cron.mjs >> /var/log/mmhb-heal.log 2>&1
 */

import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const args = process.argv.slice(2);
const SILENT = args.includes("--silent");
const JSON_OUT = args.includes("--json");
const retentionArg = args.find(a => a.startsWith("--retention="));
const RETENTION_DAYS = retentionArg ? Math.max(1, parseInt(retentionArg.split("=")[1], 10) || 30) : 30;

const REPORT_PATH = "docs/health-check-result.json";
const HOST = os.hostname() || "unknown";
const PROC = "mmhb-heal";

function ymd(d = new Date()) {
  return [d.getUTCFullYear(), String(d.getUTCMonth() + 1).padStart(2, "0"), String(d.getUTCDate()).padStart(2, "0")].join("");
}
function ndjsonPath() { return `docs/health-cron-${ymd()}.log`; }

function statusFor(exit) {
  if (exit === 0) return { name: "OK",       verdict: "HEALTHY",      severity: "info" };
  if (exit === 1) return { name: "WARNING",  verdict: "DEGRADED",     severity: "warn" };
  if (exit === 2) return { name: "CRITICAL", verdict: "NEEDS_REPAIR", severity: "error" };
  return            { name: "UNKNOWN",  verdict: "INTERNAL_ERROR", severity: "error" };
}

function runProbe() {
  return new Promise((resolve) => {
    const child = spawn("node", ["scripts/heal-360.mjs"], { stdio: ["ignore", "ignore", "ignore"] });
    child.on("error", (err) => resolve({ exit: 3, error: err?.message || String(err) }));
    child.on("close", (exit) => {
      let totals = null;
      let timestamp = null;
      try {
        if (fs.existsSync(REPORT_PATH)) {
          const j = JSON.parse(fs.readFileSync(REPORT_PATH, "utf8"));
          totals = j.totals || null;
          timestamp = j.timestamp || null;
        }
      } catch (_e) { /* ignore — surface in record */ }
      resolve({ exit: exit ?? 3, totals, timestamp });
    });
  });
}

/** Remove NDJSON files older than RETENTION_DAYS (UTC-day window). */
function rotateOldLogs() {
  try {
    if (!fs.existsSync("docs")) return;
    const cutoffMs = Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000;
    for (const f of fs.readdirSync("docs")) {
      const m = /^health-cron-(\d{8})\.log$/.exec(f);
      if (!m) continue;
      const y = m[1].slice(0, 4), mo = m[1].slice(4, 6), d = m[1].slice(6, 8);
      const fileMs = Date.UTC(+y, +mo - 1, +d);
      if (fileMs < cutoffMs) {
        try { fs.unlinkSync(path.join("docs", f)); } catch { /* best effort */ }
      }
    }
  } catch { /* best effort */ }
}

function appendNdjson(record) {
  try {
    fs.mkdirSync("docs", { recursive: true });
    fs.appendFileSync(ndjsonPath(), JSON.stringify(record) + "\n");
  } catch { /* best effort */ }
}

/**
 * Produce a syslog-style line.  Format:
 *   <timestamp> <host> <proc>[<pid>]: <verdict> pass=<N> warn=<N> fail=<N> total=<N> [error=...]
 * Designed to be greppable and easy for log aggregators to parse.
 */
function syslogLine(record) {
  const t = record.totals || {};
  const total = t.total ?? ((t.pass || 0) + (t.warn || 0) + (t.fail || 0));
  const parts = [
    record.timestamp,
    HOST,
    `${PROC}[${process.pid}]:`,
    record.status.verdict,
    `pass=${t.pass || 0}`,
    `warn=${t.warn || 0}`,
    `fail=${t.fail || 0}`,
    `total=${total}`,
  ];
  if (record.error) parts.push(`error="${record.error.replace(/"/g, '\\"')}"`);
  return parts.join(" ");
}

async function main() {
  rotateOldLogs();
  const startedAt = new Date().toISOString();
  const r = await runProbe();
  const status = statusFor(r.exit);
  const record = {
    timestamp: new Date().toISOString(),
    startedAt,
    host: HOST,
    pid: process.pid,
    status,
    exitCode: r.exit,
    totals: r.totals,
    reportTimestamp: r.timestamp,
    error: r.error || null,
  };

  appendNdjson(record);

  if (!SILENT) {
    if (JSON_OUT) {
      process.stdout.write(JSON.stringify(record) + "\n");
    } else {
      process.stdout.write(syslogLine(record) + "\n");
    }
  }

  process.exit(r.exit);
}

main().catch((e) => {
  // Match cron-friendly behaviour: emit a single line + exit 3 on internal failure
  const ts = new Date().toISOString();
  process.stderr.write(`${ts} ${HOST} ${PROC}[${process.pid}]: UNKNOWN error="${(e?.message || e).toString().replace(/"/g, '\\"')}"\n`);
  process.exit(3);
});
