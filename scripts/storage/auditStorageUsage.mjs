#!/usr/bin/env node
/**
 * auditStorageUsage.mjs — Phase H2.3 (AUDIT ONLY)
 *
 * Scans client/src ONLY for browser-storage usage and emits a classified
 * inventory as JSON + Markdown. This script changes NO runtime code, replaces
 * NO storage mechanism, adds NO library, and touches NO excluded domain.
 *
 * It is read-only over the source tree: it reads files and writes two report
 * artifacts under codex/storage/. Nothing else.
 *
 * Mechanisms detected:
 *   - localStorage / window.localStorage
 *   - sessionStorage / window.sessionStorage
 *   - indexedDB / window.indexedDB
 *   - document.cookie
 *
 * Classification per finding:
 *   - file, line, mechanism, snippet
 *   - likely domain (excluded domains flagged for awareness only)
 *   - risk level
 *   - protected/sensitive (security-relevant)
 *   - migration allowed (false for excluded domains)
 *
 * Usage: node scripts/storage/auditStorageUsage.mjs
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), "..", "..");
const SCAN_DIR = path.join(ROOT, "client", "src");
const OUT_DIR = path.join(ROOT, "codex", "storage");
const OUT_JSON = path.join(OUT_DIR, "storageUsageAudit.json");
const OUT_MD = path.join(OUT_DIR, "storageUsageAudit.md");

const FILE_EXT = new Set([".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs"]);

/** Mechanism matchers (ordered: more specific window.* forms first). */
const MECHANISMS = [
  { id: "window.localStorage", re: /window\.localStorage\b/, base: "localStorage" },
  { id: "window.sessionStorage", re: /window\.sessionStorage\b/, base: "sessionStorage" },
  { id: "window.indexedDB", re: /window\.indexedDB\b/, base: "indexedDB" },
  { id: "localStorage", re: /(?<!window\.)\blocalStorage\b/, base: "localStorage" },
  { id: "sessionStorage", re: /(?<!window\.)\bsessionStorage\b/, base: "sessionStorage" },
  { id: "indexedDB", re: /(?<!window\.)\bindexedDB\b/, base: "indexedDB" },
  { id: "document.cookie", re: /document\.cookie\b/, base: "cookie" },
];

/**
 * Domain inference from file path + line content.
 * Excluded domains (per H2.3 scope) are flagged migrationAllowed:false.
 * They are catalogued for AWARENESS ONLY — never targeted for change.
 */
const EXCLUDED_DOMAINS = new Set([
  "auth", "journal", "crisis", "healing", "chat", "billing", "dashboard", "admin",
]);

function inferDomain(relPath, line) {
  const p = relPath.toLowerCase();
  const l = line.toLowerCase();
  // Path-based (strongest signal)
  if (/(^|\/)(auth|login|signin|signup|session|token)/.test(p) || /authcontext/.test(p)) return "auth";
  if (/admin/.test(p) || /admin(session|verified)|feature_flags/.test(l)) return "admin";
  if (/(journal|reflection|reflect)/.test(p) || /reflection|journal/.test(l)) return "journal";
  if (/crisis/.test(p) || /crisis|988|741741/.test(l)) return "crisis";
  if (/(heal|wellness-?core|therapy)/.test(p)) return "healing";
  if (/chat|conversation|message/.test(p)) return "chat";
  if (/(billing|pricing|checkout|payment|subscription|stripe)/.test(p) || /billing|checkout|payment/.test(l)) return "billing";
  if (/dashboard/.test(p)) return "dashboard";
  // Content/keyword-based fallbacks (non-excluded)
  if (/reflection|journal/.test(l)) return "journal";
  if (/admin/.test(l)) return "admin";
  if (/(token|session)/.test(l)) return "auth";
  if (/theme|calm|a11y|mode|reading|appearance/.test(l)) return "ux-preferences";
  if (/(challenge|selfcare|self_care|habit|streak|wellness|ritual|goal)/.test(l)) return "wellness-progress";
  if (/(values_explorer|detox|worry|stress|sleep|compassion|monitor)/.test(l)) return "tools-monitors";
  if (/lumi/.test(p) || /lumi/.test(l)) return "lumi-ux";
  if (/analytics/.test(p) || /analytics|ga_|gtag/.test(l)) return "analytics";
  return "uncategorized";
}

/** Sensitivity: tokens / auth / admin verification are security-relevant. */
function isSensitive(domain, line) {
  const l = line.toLowerCase();
  if (domain === "auth" || domain === "admin" || domain === "billing") return true;
  if (/token|secret|password|verified|credential|session/.test(l)) return true;
  return false;
}

/** Risk level heuristic. */
function riskLevel({ domain, sensitive, mechanism, line }) {
  const l = line.toLowerCase();
  const guarded = /try|catch|typeof window|typeof localStorage|storage-safe/.test(l);
  if (sensitive) return "high";
  if (mechanism.base === "cookie") return "medium";
  if (mechanism.base === "indexedDB") return "medium";
  // Direct write/remove without obvious guard on same line → elevated
  if (/\.(set|remove)item\b/.test(l) && !guarded) return "medium";
  if (domain === "uncategorized") return "medium";
  return "low";
}

async function walk(dir, acc = []) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return acc;
  }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "node_modules" || e.name === ".git" || e.name === "dist") continue;
      await walk(full, acc);
    } else if (FILE_EXT.has(path.extname(e.name))) {
      acc.push(full);
    }
  }
  return acc;
}

function detectMechanism(line) {
  for (const m of MECHANISMS) {
    if (m.re.test(line)) return m;
  }
  return null;
}

async function main() {
  const files = await walk(SCAN_DIR);
  files.sort();

  const findings = [];
  for (const file of files) {
    const rel = path.relative(ROOT, file);
    let text;
    try {
      text = await fs.readFile(file, "utf8");
    } catch {
      continue;
    }
    const lines = text.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      const raw = lines[i];
      const mechanism = detectMechanism(raw);
      if (!mechanism) continue;
      const domain = inferDomain(rel, raw);
      const excluded = EXCLUDED_DOMAINS.has(domain);
      const sensitive = isSensitive(domain, raw);
      const risk = riskLevel({ domain, sensitive, mechanism, line: raw });
      findings.push({
        file: rel,
        line: i + 1,
        mechanism: mechanism.id,
        mechanismBase: mechanism.base,
        likelyDomain: domain,
        riskLevel: risk,
        protectedSensitive: sensitive,
        excludedDomain: excluded,
        migrationAllowed: !excluded,
        snippet: raw.trim().slice(0, 200),
      });
    }
  }

  // Aggregations
  const byMechanism = {};
  const byDomain = {};
  const byRisk = { high: 0, medium: 0, low: 0 };
  const filesSet = new Set();
  let sensitiveCount = 0;
  let migrationBlocked = 0;
  for (const f of findings) {
    byMechanism[f.mechanismBase] = (byMechanism[f.mechanismBase] || 0) + 1;
    byDomain[f.likelyDomain] = (byDomain[f.likelyDomain] || 0) + 1;
    if (byRisk[f.riskLevel] !== undefined) byRisk[f.riskLevel] += 1;
    filesSet.add(f.file);
    if (f.protectedSensitive) sensitiveCount += 1;
    if (!f.migrationAllowed) migrationBlocked += 1;
  }

  const report = {
    meta: {
      phase: "H2.3",
      mode: "AUDIT ONLY — no runtime change, no migration",
      generatedAt: new Date().toISOString(),
      scanRoot: path.relative(ROOT, SCAN_DIR),
      excludedDomains: [...EXCLUDED_DOMAINS].sort(),
      note: "Excluded-domain findings are catalogued for awareness only; migrationAllowed=false.",
    },
    summary: {
      filesScanned: files.length,
      filesWithFindings: filesSet.size,
      totalFindings: findings.length,
      byMechanism,
      byDomain,
      byRisk,
      sensitiveFindings: sensitiveCount,
      migrationBlockedFindings: migrationBlocked,
    },
    findings,
  };

  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.writeFile(OUT_JSON, JSON.stringify(report, null, 2) + "\n", "utf8");
  await fs.writeFile(OUT_MD, renderMarkdown(report), "utf8");

  // eslint-disable-next-line no-console
  console.log(
    `[auditStorageUsage] ${report.summary.totalFindings} findings across ` +
      `${report.summary.filesWithFindings}/${report.summary.filesScanned} files. ` +
      `Wrote ${path.relative(ROOT, OUT_JSON)} + ${path.relative(ROOT, OUT_MD)}.`
  );
}

function mdTableRow(cells) {
  return "| " + cells.map((c) => String(c).replace(/\|/g, "\\|")).join(" | ") + " |";
}

function renderMarkdown(report) {
  const { meta, summary, findings } = report;
  const lines = [];
  lines.push("# Storage Usage Audit — Phase H2.3 (AUDIT ONLY)");
  lines.push("");
  lines.push("> **Generated by** `scripts/storage/auditStorageUsage.mjs`. Do not hand-edit — re-run the script to refresh.");
  lines.push("> **Mode:** " + meta.mode + ".");
  lines.push("> **Scan root:** `" + meta.scanRoot + "` only.");
  lines.push("> **Generated at:** " + meta.generatedAt + ".");
  lines.push("> **Excluded domains (awareness only, migrationAllowed=false):** " + meta.excludedDomains.join(", ") + ".");
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push(mdTableRow(["Metric", "Value"]));
  lines.push(mdTableRow(["---", "---"]));
  lines.push(mdTableRow(["Files scanned", summary.filesScanned]));
  lines.push(mdTableRow(["Files with findings", summary.filesWithFindings]));
  lines.push(mdTableRow(["Total findings", summary.totalFindings]));
  lines.push(mdTableRow(["Sensitive findings", summary.sensitiveFindings]));
  lines.push(mdTableRow(["Migration-blocked (excluded domains)", summary.migrationBlockedFindings]));
  lines.push("");
  lines.push("### By mechanism");
  lines.push("");
  lines.push(mdTableRow(["Mechanism", "Findings"]));
  lines.push(mdTableRow(["---", "---"]));
  for (const k of Object.keys(summary.byMechanism).sort()) lines.push(mdTableRow([k, summary.byMechanism[k]]));
  lines.push("");
  lines.push("### By likely domain");
  lines.push("");
  lines.push(mdTableRow(["Domain", "Findings", "Migration allowed"]));
  lines.push(mdTableRow(["---", "---", "---"]));
  for (const k of Object.keys(summary.byDomain).sort()) {
    const blocked = meta.excludedDomains.includes(k) ? "no (excluded)" : "yes";
    lines.push(mdTableRow([k, summary.byDomain[k], blocked]));
  }
  lines.push("");
  lines.push("### By risk level");
  lines.push("");
  lines.push(mdTableRow(["Risk", "Findings"]));
  lines.push(mdTableRow(["---", "---"]));
  for (const k of ["high", "medium", "low"]) lines.push(mdTableRow([k, summary.byRisk[k] || 0]));
  lines.push("");
  lines.push("## Findings");
  lines.push("");
  lines.push(mdTableRow(["File", "Line", "Mechanism", "Domain", "Risk", "Sensitive", "Migration allowed", "Snippet"]));
  lines.push(mdTableRow(["---", "---", "---", "---", "---", "---", "---", "---"]));
  for (const f of findings) {
    lines.push(
      mdTableRow([
        f.file,
        f.line,
        f.mechanism,
        f.likelyDomain,
        f.riskLevel,
        f.protectedSensitive ? "yes" : "no",
        f.migrationAllowed ? "yes" : "no (excluded)",
        "`" + f.snippet.replace(/`/g, "'") + "`",
      ])
    );
  }
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("**Scope note:** This audit modifies no runtime code, replaces no storage mechanism, adds no library, and proposes no change to excluded domains. Crisis routing and business↔healing separation are unaffected. Companion governance docs live in `docs/governance/storage/`.");
  lines.push("");
  return lines.join("\n");
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("[auditStorageUsage] FAILED:", err);
  process.exit(1);
});
