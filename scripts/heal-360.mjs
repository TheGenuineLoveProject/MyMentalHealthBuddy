#!/usr/bin/env node
/**
 * heal-360.mjs — A→Z 360° Platform Self-Repair & Health Probe
 *
 * Unified, non-destructive health/repair pass across 5 categories:
 *   1. Filesystem & Build      (assets, build outputs, schema files present)
 *   2. Critical Env Coverage   (presence-only, NEVER values)
 *   3. Database & Schema       (live connect probe + table presence)
 *   4. Runtime API             (probes /api/health, /ready, /healthz on local server)
 *   5. Contract Gates          (8 Buddy + route contract gates)
 *
 * Each category emits PASS / WARN / FAIL with an actionable repair hint.
 * Final report is written to docs/health-check-result.json (preserves prior format
 * + adds new categorized fields).
 *
 * Exit codes:
 *   0 = all green (HEALTHY)
 *   1 = warnings only (DEGRADED but functional)
 *   2 = critical failures (NEEDS_REPAIR)
 *
 * Non-destructive: never modifies code, schema, or env. Pure read/probe.
 */

import { execSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import http from "node:http";

const C = {
  reset: "\x1b[0m",
  bold:  "\x1b[1m",
  dim:   "\x1b[2m",
  green: "\x1b[32m",
  red:   "\x1b[31m",
  yellow:"\x1b[33m",
  blue:  "\x1b[34m",
  cyan:  "\x1b[36m",
  mag:   "\x1b[35m",
};

const STATUS = { PASS: "PASS", WARN: "WARN", FAIL: "FAIL" };
const report = { startedAt: new Date().toISOString(), categories: {} };

function header(label) {
  const bar = "═".repeat(64);
  console.log(`\n${C.cyan}${bar}${C.reset}`);
  console.log(`${C.cyan}${C.bold}  ${label}${C.reset}`);
  console.log(`${C.cyan}${bar}${C.reset}`);
}

function emit(category, name, status, message, hint) {
  const icon = status === STATUS.PASS ? `${C.green}✓` :
               status === STATUS.WARN ? `${C.yellow}⚠` :
               `${C.red}✗`;
  console.log(`  ${icon}${C.reset} ${name}: ${C.dim}${message}${C.reset}`);
  if (hint && status !== STATUS.PASS) {
    console.log(`    ${C.mag}↳ repair: ${hint}${C.reset}`);
  }
  if (!report.categories[category]) report.categories[category] = { checks: [], pass: 0, warn: 0, fail: 0 };
  report.categories[category].checks.push({ name, status, message, hint: hint ?? null });
  report.categories[category][status.toLowerCase()]++;
}

function exists(p) {
  try { fs.accessSync(p); return true; } catch { return false; }
}

// ────────────────────────────────────────────────────────────────────────
// 1. Filesystem & Build
// ────────────────────────────────────────────────────────────────────────
function probeFilesystem() {
  header("1. Filesystem & Build Assets");
  const cat = "filesystem";

  const required = [
    { f: "package.json",                     name: "package.json" },
    { f: "server/index.mjs",                 name: "server entry (index.mjs)" },
    { f: "server/app.mjs",                   name: "server app (app.mjs)" },
    { f: "client/src/App.jsx",               name: "client App.jsx" },
    { f: "shared/schema.mjs",                name: "shared schema.mjs" },
    { f: "server/db/ensureSchema.mjs",       name: "ensureSchema bootstrap" },
    { f: "scripts/check-contract-routes.sh", name: "contract gate runner" },
  ];

  for (const { f, name } of required) {
    if (exists(f)) emit(cat, name, STATUS.PASS, "present");
    else emit(cat, name, STATUS.FAIL, "MISSING", `restore ${f} from git history (git log -- ${f})`);
  }

  // Optional: build directory (only WARN since dev mode doesn't need it)
  if (exists("dist") || exists("client/dist")) {
    emit(cat, "build output", STATUS.PASS, "found");
  } else {
    emit(cat, "build output", STATUS.WARN, "not built", "run `npm run build` before publishing");
  }

  // Counts
  try {
    const pageCount = execSync("find client/src/pages -type f \\( -name '*.jsx' -o -name '*.tsx' \\) | wc -l", { encoding: "utf8" }).trim();
    emit(cat, "client pages", parseInt(pageCount) > 0 ? STATUS.PASS : STATUS.FAIL,
         `${pageCount} pages`,
         parseInt(pageCount) > 0 ? null : "client/src/pages is empty — restore page modules");
  } catch (e) {
    emit(cat, "client pages", STATUS.WARN, "could not count", "check filesystem perms on client/src/pages");
  }

  try {
    const routeCount = execSync("ls server/routes/*.mjs 2>/dev/null | wc -l", { encoding: "utf8" }).trim();
    emit(cat, "server routes", parseInt(routeCount) > 0 ? STATUS.PASS : STATUS.FAIL,
         `${routeCount} route files`,
         parseInt(routeCount) > 0 ? null : "server/routes is empty — restore route modules");
  } catch {
    emit(cat, "server routes", STATUS.WARN, "could not count");
  }
}

// ────────────────────────────────────────────────────────────────────────
// 2. Critical Env Coverage (presence-only — NEVER values)
// ────────────────────────────────────────────────────────────────────────
function probeEnv() {
  header("2. Critical Env Coverage");
  const cat = "env";

  // CRITICAL — server fails to boot or core feature breaks
  const critical = [
    { k: "DATABASE_URL",  hint: "set DATABASE_URL — without it, server exits at boot" },
    { k: "JWT_SECRET",    hint: "set JWT_SECRET — required for auth + admin token sessions" },
  ];

  // IMPORTANT — feature degraded but server boots
  const important = [
    { k: "OPENAI_API_KEY", hint: "set OPENAI_API_KEY — Buddy AI chat falls back to library responses without it" },
    { k: "ADMIN_TOKEN",    hint: "set ADMIN_TOKEN — admin Command Center token-entry path requires it" },
  ];

  // OPTIONAL — purely additive
  const optional = [
    { k: "PERPLEXITY_API_KEY",  hint: "set for factual research mode (optional)" },
    { k: "GITHUB_CLIENT_ID",    hint: "set for GitHub OAuth (optional)" },
    { k: "GITHUB_CLIENT_SECRET",hint: "set for GitHub OAuth (optional)" },
    { k: "VITE_GA_MEASUREMENT_ID", hint: "set for Google Analytics in client (optional)" },
  ];

  for (const { k, hint } of critical) {
    const present = !!process.env[k];
    emit(cat, k, present ? STATUS.PASS : STATUS.FAIL,
         present ? "present (value not displayed)" : "MISSING",
         present ? null : hint);
  }
  for (const { k, hint } of important) {
    const present = !!process.env[k];
    emit(cat, k, present ? STATUS.PASS : STATUS.WARN,
         present ? "present" : "missing — feature degraded",
         present ? null : hint);
  }
  for (const { k, hint } of optional) {
    const present = !!process.env[k];
    emit(cat, k, present ? STATUS.PASS : STATUS.WARN,
         present ? "present" : "not set (optional)",
         present ? null : hint);
  }
}

// ────────────────────────────────────────────────────────────────────────
// 3. Database & Schema
// ────────────────────────────────────────────────────────────────────────
async function probeDatabase() {
  header("3. Database & Schema");
  const cat = "database";

  if (!process.env.DATABASE_URL) {
    emit(cat, "connection", STATUS.FAIL, "DATABASE_URL missing — skipping live probe", "set DATABASE_URL");
    return;
  }

  let pg;
  try {
    pg = (await import("pg")).default;
  } catch {
    emit(cat, "pg driver", STATUS.FAIL, "could not import 'pg'", "run `npm install pg`");
    return;
  }

  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL === "false" ? false : { rejectUnauthorized: false },
    connectionTimeoutMillis: 5000,
    max: 1,
  });

  try {
    const r = await pool.query("SELECT 1 AS ok");
    emit(cat, "live connection", r.rows?.[0]?.ok === 1 ? STATUS.PASS : STATUS.FAIL,
         "SELECT 1 succeeded");
  } catch (e) {
    emit(cat, "live connection", STATUS.FAIL, `connect failed: ${e.message}`,
         "verify DATABASE_URL host/port/credentials, check Neon/Postgres status");
    await pool.end().catch(() => {});
    return;
  }

  // Probe presence of expected core tables (subset that should always exist after ensureSchema)
  const expectedTables = ["users", "journals", "moods", "therapy_sessions"];
  try {
    const r = await pool.query(
      `SELECT table_name FROM information_schema.tables
       WHERE table_schema = 'public' AND table_name = ANY($1::text[])`,
      [expectedTables]
    );
    const found = new Set(r.rows.map(x => x.table_name));
    for (const t of expectedTables) {
      if (found.has(t)) emit(cat, `table ${t}`, STATUS.PASS, "exists");
      else emit(cat, `table ${t}`, STATUS.WARN, "missing",
                "run server (ensureSchema bootstraps on boot) or `npm run db:push --force`");
    }
  } catch (e) {
    emit(cat, "schema introspection", STATUS.WARN, e.message,
         "verify role has read access to information_schema");
  }

  await pool.end().catch(() => {});
}

// ────────────────────────────────────────────────────────────────────────
// 4. Runtime API
// ────────────────────────────────────────────────────────────────────────
function httpProbe(port, pathStr, timeoutMs = 3000) {
  return new Promise((resolve) => {
    const req = http.get({ host: "127.0.0.1", port, path: pathStr, timeout: timeoutMs }, (res) => {
      const chunks = [];
      res.on("data", c => chunks.push(c));
      res.on("end", () => resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString("utf8").slice(0, 200) }));
    });
    req.on("timeout", () => { req.destroy(); resolve({ status: 0, body: "timeout" }); });
    req.on("error", (e) => resolve({ status: 0, body: e.message }));
  });
}

async function probeRuntime() {
  header("4. Runtime API (live server probe)");
  const cat = "runtime";
  const port = process.env.PORT || 5000;

  const endpoints = [
    { path: "/api/health", okStatus: [200, 503], required: true,
      hint: "server health route may be misconfigured — check server/routes/health.mjs and server/app.mjs mount" },
    { path: "/ready",      okStatus: [200, 503], required: true,
      hint: "readiness gate not responding — check server/app.mjs /ready handler" },
    { path: "/healthz",    okStatus: [200, 503], required: false,
      hint: "k8s-style probe missing — non-critical" },
  ];

  for (const e of endpoints) {
    const r = await httpProbe(port, e.path);
    if (r.status === 0) {
      emit(cat, `GET ${e.path}`, e.required ? STATUS.WARN : STATUS.WARN,
           `no response (${r.body}) — server may not be running`,
           "start the workflow `Start application` and rerun");
    } else if (e.okStatus.includes(r.status)) {
      emit(cat, `GET ${e.path}`, STATUS.PASS, `HTTP ${r.status}`);
    } else {
      emit(cat, `GET ${e.path}`, STATUS.FAIL, `HTTP ${r.status}`, e.hint);
    }
  }
}

// ────────────────────────────────────────────────────────────────────────
// 5. Contract Gates (8 locked Buddy + route contracts)
// ────────────────────────────────────────────────────────────────────────
function probeContractGates() {
  header("5. Contract Gates (8 locked invariants)");
  const cat = "contracts";

  const script = "scripts/check-contract-routes.sh";
  if (!exists(script)) {
    emit(cat, "gate runner", STATUS.FAIL, `${script} missing`,
         "restore the gate runner from git history");
    return;
  }

  const r = spawnSync("bash", [script], { encoding: "utf8" });
  const out = (r.stdout || "") + (r.stderr || "");
  const passLines = out.split("\n").filter(l => /^PASS:/.test(l));
  const failLines = out.split("\n").filter(l => /^FAIL:/.test(l));

  if (r.status === 0 && passLines.length >= 8 && failLines.length === 0) {
    emit(cat, "all 8 gates", STATUS.PASS, `${passLines.length}/8 PASS`);
  } else {
    emit(cat, "gate suite", STATUS.FAIL,
         `exit=${r.status}, pass=${passLines.length}, fail=${failLines.length}`,
         "run `bash scripts/check-contract-routes.sh` to see which gate failed and why");
    for (const line of failLines.slice(0, 5)) {
      emit(cat, "  failure detail", STATUS.FAIL, line.replace(/^FAIL:\s*/, ""));
    }
  }
}

// ────────────────────────────────────────────────────────────────────────
// Main
// ────────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`${C.bold}${C.blue}╔══════════════════════════════════════════════════════════════╗${C.reset}`);
  console.log(`${C.bold}${C.blue}║      MMHB heal-360 — A→Z 360° Self-Repair Probe              ║${C.reset}`);
  console.log(`${C.bold}${C.blue}╚══════════════════════════════════════════════════════════════╝${C.reset}`);

  probeFilesystem();
  probeEnv();
  await probeDatabase();
  await probeRuntime();
  probeContractGates();

  // Roll-up
  let totalPass = 0, totalWarn = 0, totalFail = 0;
  for (const cat of Object.values(report.categories)) {
    totalPass += cat.pass; totalWarn += cat.warn; totalFail += cat.fail;
  }

  const overall = totalFail > 0 ? "NEEDS_REPAIR" :
                  totalWarn > 0 ? "DEGRADED"     : "HEALTHY";

  report.finishedAt = new Date().toISOString();
  report.totals = { pass: totalPass, warn: totalWarn, fail: totalFail };
  report.overallStatus = overall;

  console.log(`\n${C.bold}${C.cyan}════════════════════════ SUMMARY ════════════════════════${C.reset}`);
  console.log(`  ${C.green}PASS:${C.reset} ${totalPass}    ${C.yellow}WARN:${C.reset} ${totalWarn}    ${C.red}FAIL:${C.reset} ${totalFail}`);
  for (const [name, cat] of Object.entries(report.categories)) {
    const statusColor = cat.fail > 0 ? C.red : cat.warn > 0 ? C.yellow : C.green;
    console.log(`  ${statusColor}● ${name.padEnd(12)}${C.reset}  ${cat.pass} pass / ${cat.warn} warn / ${cat.fail} fail`);
  }

  const banner = overall === "HEALTHY"      ? `${C.green}${C.bold}✅ HEALTHY — all systems green${C.reset}` :
                 overall === "DEGRADED"     ? `${C.yellow}${C.bold}⚠ DEGRADED — functional with warnings${C.reset}` :
                                              `${C.red}${C.bold}✗ NEEDS_REPAIR — critical failures present${C.reset}`;
  console.log(`\n${banner}\n`);

  // Persist report — preserves prior runHealthCheck format + adds categorized data
  try {
    fs.mkdirSync("docs", { recursive: true });
    const flatChecks = [];
    for (const [name, cat] of Object.entries(report.categories)) {
      for (const c of cat.checks) {
        flatChecks.push({
          name: `${name}/${c.name}`,
          status: c.status === STATUS.PASS ? "pass" :
                  c.status === STATUS.WARN ? "warn" : "fail",
          message: c.message,
          hint: c.hint,
        });
      }
    }
    const persisted = {
      timestamp: report.finishedAt,
      tool: "heal-360",
      passed: totalPass,
      failed: totalFail + totalWarn,
      checks: flatChecks,
      overallStatus: overall,
      categories: report.categories,
      totals: report.totals,
    };
    fs.writeFileSync("docs/health-check-result.json", JSON.stringify(persisted, null, 2));
    console.log(`${C.dim}Report saved → docs/health-check-result.json${C.reset}\n`);
  } catch (e) {
    console.log(`${C.yellow}⚠ Could not persist report: ${e.message}${C.reset}`);
  }

  process.exit(overall === "HEALTHY" ? 0 : overall === "DEGRADED" ? 1 : 2);
}

main().catch((e) => {
  console.error(`${C.red}heal-360 crashed: ${e.message}${C.reset}`);
  console.error(e.stack);
  process.exit(2);
});
