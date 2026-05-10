#!/usr/bin/env node
/**
 * checkSchemaDrift.mjs — Schema-source-of-truth guardrail.
 *
 * WHY THIS EXISTS
 * ───────────────
 * The MMHB workspace has multiple files containing Drizzle `pgTable(...)`
 * definitions:
 *   - shared/schema.mjs                    (CANONICAL, 78 tables, 46 importers)
 *   - db/schema.ts                         (legacy stub, 9 importers)
 *   - server/db/schema/*.{js,mjs}          (server-internal duplicates)
 *   - database/schema/*.ts                 (currently empty, but drizzle.config.ts
 *                                           points here for migration generation)
 *
 * If the *same* table is declared in two places with *different* column sets,
 * the app code compiles, migrations apply, and queries silently hit columns
 * the runtime doesn't know about. This script detects that drift before it
 * ships.
 *
 * WHAT IT DOES
 * ────────────
 *   1. Scans every workspace file outside node_modules / dist / .git for
 *      `pgTable("<name>", { ... })` definitions.
 *   2. Extracts the column-key set from each definition (best-effort text
 *      parse — column keys are `identifier:` at the top level of the object
 *      literal).
 *   3. For any table name defined in >1 file, compares the column-key sets.
 *   4. Exit 1 on drift, 0 on clean. Always prints a report.
 *
 * USAGE
 * ─────
 *   node scripts/checkSchemaDrift.mjs            # human report
 *   node scripts/checkSchemaDrift.mjs --json     # machine-readable
 *
 * LIMITATIONS
 * ───────────
 *   - Text-based parse: doesn't catch type/constraint drift, only column
 *     existence. That's intentional — types vary legitimately across files
 *     (text vs varchar) but missing columns are unambiguously bugs.
 *   - shared/schema.mjs is treated as the source of truth: any table only
 *     defined there is "clean"; any table defined elsewhere MUST also exist
 *     in shared/schema.mjs with a superset of its columns.
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const CANONICAL = "shared/schema.mjs";
const SCAN_DIRS = ["shared", "server", "db", "database", "client/src"];
const IGNORE = /node_modules|\.git|dist|client\/dist|\.cache|\.local|\.archive|\.backups/;
const FILE_EXT = /\.(mjs|cjs|js|ts|tsx)$/;
const JSON_OUT = process.argv.includes("--json");

function walk(dir, out = []) {
  let entries;
  try { entries = readdirSync(dir); } catch { return out; }
  for (const name of entries) {
    const full = join(dir, name);
    if (IGNORE.test(full)) continue;
    let s;
    try { s = statSync(full); } catch { continue; }
    if (s.isDirectory()) walk(full, out);
    else if (FILE_EXT.test(name)) out.push(full);
  }
  return out;
}

/**
 * Find every `pgTable("name", { … })` block in src and return
 * { name, columns:Set<string>, file, line }[].
 *
 * Uses a manual scan (regex can't handle nested {}). For each match of
 * `pgTable(`, find the table-name string literal, then walk the chars to
 * locate the matching closing brace of the column-spec object literal,
 * then extract top-level `identifier:` tokens.
 */
function extractTables(src, file) {
  const out = [];
  const re = /pgTable\s*\(\s*["'`]([^"'`]+)["'`]\s*,\s*\{/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    const name = m[1];
    const startObj = re.lastIndex - 1; // index of the opening '{'
    let depth = 1;
    let i = startObj + 1;
    let inStr = null;
    let inLine = false;
    let inBlock = false;
    while (i < src.length && depth > 0) {
      const c = src[i];
      const next = src[i + 1];
      if (inLine) { if (c === "\n") inLine = false; i++; continue; }
      if (inBlock) { if (c === "*" && next === "/") { inBlock = false; i += 2; continue; } i++; continue; }
      if (inStr) {
        if (c === "\\") { i += 2; continue; }
        if (c === inStr) inStr = null;
        i++; continue;
      }
      if (c === "/" && next === "/") { inLine = true; i += 2; continue; }
      if (c === "/" && next === "*") { inBlock = true; i += 2; continue; }
      if (c === '"' || c === "'" || c === "`") { inStr = c; i++; continue; }
      if (c === "{") depth++;
      else if (c === "}") depth--;
      i++;
    }
    const objBody = src.slice(startObj + 1, i - 1);
    // Top-level "identifier: typename(" detected by depth=0 within objBody.
    // We capture both the column key AND its drizzle type (uuid, serial, text,
    // varchar, timestamp, integer, boolean, jsonb, ...) so type drift on the
    // same column name is detected, not just missing columns. The serial-vs-uuid
    // landmine on a primary key compiles fine but corrupts the runtime — that's
    // exactly what this catches.
    const cols = new Map(); // colName -> type
    let d = 0, sStr = null, sLine = false, sBlock = false;
    let tokStart = -1;
    for (let j = 0; j < objBody.length; j++) {
      const c = objBody[j];
      const n = objBody[j + 1];
      if (sLine) { if (c === "\n") sLine = false; continue; }
      if (sBlock) { if (c === "*" && n === "/") { sBlock = false; j++; } continue; }
      if (sStr) {
        if (c === "\\") { j++; continue; }
        if (c === sStr) sStr = null;
        continue;
      }
      if (c === "/" && n === "/") { sLine = true; j++; continue; }
      if (c === "/" && n === "*") { sBlock = true; j++; continue; }
      if (c === '"' || c === "'" || c === "`") { sStr = c; continue; }
      if (c === "{" || c === "[" || c === "(") d++;
      else if (c === "}" || c === "]" || c === ")") d--;
      if (d === 0) {
        if (/[A-Za-z_$]/.test(c) && tokStart === -1) tokStart = j;
        else if (tokStart !== -1 && !/[A-Za-z0-9_$]/.test(c)) {
          // Skip whitespace, then check for ':'
          let k = j;
          while (k < objBody.length && /\s/.test(objBody[k])) k++;
          if (objBody[k] === ":") {
            const colName = objBody.slice(tokStart, j);
            // Find the type identifier after the colon: skip whitespace, then read identifier up to '('
            let p = k + 1;
            while (p < objBody.length && /\s/.test(objBody[p])) p++;
            let typeStart = p;
            while (p < objBody.length && /[A-Za-z0-9_$]/.test(objBody[p])) p++;
            const colType = objBody.slice(typeStart, p) || "<unknown>";
            cols.set(colName, colType);
          }
          tokStart = -1;
        }
      } else {
        tokStart = -1;
      }
    }
    const lineNo = src.slice(0, m.index).split("\n").length;
    out.push({ name, columns: cols, file: relative(ROOT, file), line: lineNo });
  }
  return out;
}

const files = SCAN_DIRS.flatMap((d) => walk(join(ROOT, d)));
const allTables = [];
for (const f of files) {
  let src;
  try { src = readFileSync(f, "utf8"); } catch { continue; }
  if (!src.includes("pgTable")) continue;
  allTables.push(...extractTables(src, f));
}

// Group by table name
const byName = new Map();
for (const t of allTables) {
  if (!byName.has(t.name)) byName.set(t.name, []);
  byName.get(t.name).push(t);
}

// Detect drift
const issues = [];
for (const [name, defs] of byName) {
  if (defs.length === 1) continue;
  const canonical = defs.find((d) => d.file === CANONICAL);
  if (!canonical) {
    issues.push({
      kind: "missing_canonical",
      table: name,
      message: `Table "${name}" is defined in ${defs.length} file(s) but NOT in ${CANONICAL} — canonical source is missing this table.`,
      defs,
    });
    continue;
  }
  for (const d of defs) {
    if (d.file === CANONICAL) continue;
    const missing = [...d.columns.keys()].filter((c) => !canonical.columns.has(c));
    const typeMismatches = [];
    for (const [col, type] of d.columns) {
      const canonType = canonical.columns.get(col);
      if (canonType && canonType !== type) {
        typeMismatches.push(`${col} (${d.file}=${type}, ${CANONICAL}=${canonType})`);
      }
    }
    if (missing.length) {
      issues.push({
        kind: "missing_columns",
        table: name,
        message: `Table "${name}" in ${d.file}:${d.line} declares columns NOT present in ${CANONICAL}: ${missing.join(", ")}`,
        defs: [canonical, d],
      });
    }
    if (typeMismatches.length) {
      issues.push({
        kind: "type_drift",
        table: name,
        message: `Table "${name}" in ${d.file}:${d.line} has TYPE drift vs ${CANONICAL}: ${typeMismatches.join("; ")}`,
        defs: [canonical, d],
      });
    }
  }
}

const report = {
  totalFilesScanned: files.length,
  filesWithTables: new Set(allTables.map((t) => t.file)).size,
  totalTableDefinitions: allTables.length,
  uniqueTableNames: byName.size,
  duplicatedTables: [...byName.entries()].filter(([, v]) => v.length > 1).length,
  issues,
};

if (JSON_OUT) {
  console.log(
    JSON.stringify(
      report,
      (k, v) => (v instanceof Map ? Object.fromEntries(v) : v instanceof Set ? [...v] : v),
      2,
    ),
  );
} else {
  console.log("Schema Drift Check (scripts/checkSchemaDrift.mjs)");
  console.log("─".repeat(60));
  console.log(`  Files scanned:            ${report.totalFilesScanned}`);
  console.log(`  Files with pgTable defs:  ${report.filesWithTables}`);
  console.log(`  Total pgTable defs:       ${report.totalTableDefinitions}`);
  console.log(`  Unique table names:       ${report.uniqueTableNames}`);
  console.log(`  Duplicated table names:   ${report.duplicatedTables}`);
  console.log("");
  if (!issues.length) {
    console.log("  \u2713 No drift detected.");
    process.exit(0);
  }
  console.log(`  \u2717 ${issues.length} drift issue(s):`);
  console.log("");
  for (const i of issues) {
    console.log(`  [${i.kind}] ${i.message}`);
    if (i.defs) for (const d of i.defs) console.log(`     - ${d.file}:${d.line}  cols=${[...d.columns].map(([k, v]) => `${k}:${v}`).join(",")}`);
    console.log("");
  }
  process.exit(1);
}
