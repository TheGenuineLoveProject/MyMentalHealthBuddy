#!/usr/bin/env node
/**
 * heal-repair.mjs — Active self-repair (DRY-RUN by default)
 *
 * Reads docs/health-check-result.json (produced by heal-360) and prescribes
 * — or with --apply, executes — safe repair actions for known WARN/FAIL
 * signatures.
 *
 * Default mode is DRY-RUN: prints planned actions only, never modifies state.
 * Pass --apply to actually execute. Destructive actions (e.g. db:push --force)
 * additionally require --apply-destructive.
 *
 * Usage:
 *   node scripts/heal-repair.mjs                       # dry-run, prescribe only
 *   node scripts/heal-repair.mjs --apply               # apply SAFE fixes only
 *   node scripts/heal-repair.mjs --apply --apply-destructive   # apply all incl. db push
 *
 * Exit codes:
 *   0 = nothing to do, or all attempted fixes succeeded
 *   1 = some fixes were skipped (need flag) or failed
 *   2 = no health report found / unable to read
 */

import { execSync } from "node:child_process";
import fs from "node:fs";

const C = {
  reset: "\x1b[0m", bold: "\x1b[1m", dim: "\x1b[2m",
  green: "\x1b[32m", red: "\x1b[31m", yellow: "\x1b[33m",
  blue: "\x1b[34m", cyan: "\x1b[36m", mag: "\x1b[35m",
};

const args = new Set(process.argv.slice(2));
const APPLY = args.has("--apply");
const APPLY_DESTRUCTIVE = args.has("--apply-destructive");
const REPORT_PATH = "docs/health-check-result.json";

function banner(label) {
  console.log(`\n${C.cyan}${C.bold}${"─".repeat(64)}${C.reset}`);
  console.log(`${C.cyan}${C.bold}  ${label}${C.reset}`);
  console.log(`${C.cyan}${C.bold}${"─".repeat(64)}${C.reset}`);
}

function loadReport() {
  if (!fs.existsSync(REPORT_PATH)) {
    console.error(`${C.red}✗ No health report found at ${REPORT_PATH}${C.reset}`);
    console.error(`${C.dim}  Run \`node scripts/heal-360.mjs\` first to generate one.${C.reset}`);
    process.exit(2);
  }
  try {
    return JSON.parse(fs.readFileSync(REPORT_PATH, "utf8"));
  } catch (e) {
    console.error(`${C.red}✗ Could not parse ${REPORT_PATH}: ${e.message}${C.reset}`);
    process.exit(2);
  }
}

// ────────────────────────────────────────────────────────────────────────
// Repair recipe registry
//
// Each recipe has:
//   - matches(check): does this check need this repair?
//   - destructive: does it require --apply-destructive?
//   - command: the shell command to run when applying
//   - describe(check): human-readable plan
// ────────────────────────────────────────────────────────────────────────
const RECIPES = [
  {
    id: "db-push-missing-tables",
    destructive: true,
    matches: (c) =>
      c.name.startsWith("database/table ") &&
      (c.status === "warn" || c.status === "fail") &&
      /missing/i.test(c.message || ""),
    describe: (c) => `Bootstrap missing DB table from Drizzle schema (${c.name.replace("database/table ", "")})`,
    command: "npm run db:push -- --force",
    // Only run ONCE even if multiple table-missing checks match
    runOnce: true,
  },
  {
    id: "build-output-missing",
    destructive: false,
    matches: (c) =>
      c.name === "filesystem/build output" &&
      (c.status === "warn" || c.status === "fail"),
    describe: () => "Run production build (`npm run build`) to generate dist/",
    command: "npm run build",
    runOnce: true,
  },
];

// Fixes that cannot be auto-applied (informational only)
const MANUAL_HINTS = [
  {
    matches: (c) => c.name.startsWith("env/") && c.status !== "pass" && c.hint,
    describe: (c) => `${c.name.replace("env/", "")}: ${c.hint}`,
    action: "Set the secret in Replit Secrets (never commit values)",
  },
  {
    matches: (c) => c.name.startsWith("runtime/") && c.status !== "pass",
    describe: (c) => `${c.name}: ${c.message}`,
    action: "Restart the workflow `Start application` and rerun heal-360",
  },
];

// ────────────────────────────────────────────────────────────────────────
// Main
// ────────────────────────────────────────────────────────────────────────
function main() {
  console.log(`${C.bold}${C.blue}╔══════════════════════════════════════════════════════════════╗${C.reset}`);
  console.log(`${C.bold}${C.blue}║      MMHB heal-repair — Active Self-Repair                   ║${C.reset}`);
  console.log(`${C.bold}${C.blue}║      Mode: ${APPLY ? (APPLY_DESTRUCTIVE ? "APPLY (incl. destructive)   " : "APPLY (safe only)            ") : "DRY-RUN (prescribe only)     "}                  ║${C.reset}`);
  console.log(`${C.bold}${C.blue}╚══════════════════════════════════════════════════════════════╝${C.reset}`);

  const report = loadReport();
  const allChecks = (report.checks || []).filter(c => c.status !== "pass");

  if (allChecks.length === 0) {
    console.log(`\n${C.green}${C.bold}✓ Health report shows all green — nothing to repair.${C.reset}\n`);
    process.exit(0);
  }

  console.log(`\n${C.dim}Source report: ${REPORT_PATH} (${report.timestamp || "unknown timestamp"})${C.reset}`);
  console.log(`${C.dim}Non-pass checks: ${allChecks.length}${C.reset}`);

  // ── Phase 1: identify recipes to run ─────────────────────────────────
  banner("Repair Plan");
  const planned = [];
  const skipped = [];
  const seenRecipes = new Set();

  for (const check of allChecks) {
    let matched = false;
    for (const recipe of RECIPES) {
      if (!recipe.matches(check)) continue;
      matched = true;
      if (recipe.runOnce && seenRecipes.has(recipe.id)) {
        // already planned via another check — just note
        console.log(`  ${C.dim}↳ ${check.name}: covered by recipe '${recipe.id}'${C.reset}`);
        break;
      }
      seenRecipes.add(recipe.id);
      const willRun = APPLY && (!recipe.destructive || APPLY_DESTRUCTIVE);
      const tag = recipe.destructive
        ? `${C.yellow}[destructive]${C.reset}`
        : `${C.green}[safe]${C.reset}`;
      console.log(`  ${tag} ${recipe.describe(check)}`);
      console.log(`    ${C.dim}command: ${recipe.command}${C.reset}`);
      if (willRun) {
        planned.push({ recipe, check });
        console.log(`    ${C.green}→ will execute${C.reset}`);
      } else {
        const reason = !APPLY ? "DRY-RUN" :
                       recipe.destructive && !APPLY_DESTRUCTIVE ? "needs --apply-destructive" :
                       "skipped";
        skipped.push({ recipe, check, reason });
        console.log(`    ${C.yellow}→ skipped (${reason})${C.reset}`);
      }
      break;
    }
    if (!matched) {
      // Try manual hints
      for (const hint of MANUAL_HINTS) {
        if (hint.matches(check)) {
          console.log(`  ${C.mag}[manual]${C.reset} ${hint.describe(check)}`);
          console.log(`    ${C.dim}action: ${hint.action}${C.reset}`);
          skipped.push({ recipe: { id: "manual" }, check, reason: "manual-only" });
          break;
        }
      }
    }
  }

  if (planned.length === 0 && skipped.length === 0) {
    console.log(`  ${C.dim}(no recipes or manual hints matched the non-pass checks)${C.reset}`);
  }

  // ── Phase 2: execute ──────────────────────────────────────────────────
  if (planned.length > 0) {
    banner("Executing Repairs");
    let failed = 0;
    for (const { recipe } of planned) {
      console.log(`\n${C.cyan}▶ Running: ${recipe.command}${C.reset}`);
      try {
        execSync(recipe.command, { stdio: "inherit" });
        console.log(`${C.green}  ✓ ${recipe.id} succeeded${C.reset}`);
      } catch (e) {
        console.log(`${C.red}  ✗ ${recipe.id} failed (exit ${e.status ?? "?"})${C.reset}`);
        failed++;
      }
    }
    if (failed > 0) {
      console.log(`\n${C.red}${C.bold}✗ ${failed} of ${planned.length} repair(s) failed${C.reset}`);
      console.log(`${C.dim}  Re-run \`node scripts/heal-360.mjs\` to see updated state.${C.reset}\n`);
      process.exit(1);
    }
    console.log(`\n${C.green}${C.bold}✓ All ${planned.length} attempted repair(s) succeeded${C.reset}`);
    console.log(`${C.dim}  Re-run \`node scripts/heal-360.mjs\` to verify the platform is now green.${C.reset}\n`);
    process.exit(0);
  }

  // ── No-execute paths ──────────────────────────────────────────────────
  banner("Summary");
  if (!APPLY) {
    console.log(`${C.yellow}DRY-RUN complete.${C.reset} ${skipped.length} action(s) prescribed.`);
    console.log(`${C.dim}Run again with \`--apply\` to execute safe fixes,${C.reset}`);
    console.log(`${C.dim}or \`--apply --apply-destructive\` to also execute destructive ones.${C.reset}\n`);
    process.exit(skipped.length > 0 ? 1 : 0);
  }

  // APPLY mode but everything was destructive-only or manual
  const destructiveSkipped = skipped.filter(s => s.reason === "needs --apply-destructive").length;
  const manualSkipped = skipped.filter(s => s.reason === "manual-only").length;
  console.log(`${C.yellow}APPLY mode: nothing eligible to auto-execute.${C.reset}`);
  if (destructiveSkipped > 0) {
    console.log(`  ${C.yellow}${destructiveSkipped} destructive fix(es) skipped — re-run with --apply-destructive to execute${C.reset}`);
  }
  if (manualSkipped > 0) {
    console.log(`  ${C.mag}${manualSkipped} item(s) require manual action${C.reset}`);
  }
  console.log("");
  process.exit(skipped.length > 0 ? 1 : 0);
}

main();
