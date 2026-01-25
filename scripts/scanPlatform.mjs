#!/usr/bin/env node
/**
 * scanPlatform.mjs - Human-triggered platform scanner
 * Finds incomplete pages & missing safety elements
 * 
 * Usage: node scripts/scanPlatform.mjs [--json] [--verbose]
 * 
 * GUARDRAILS:
 * - Read-only: Never modifies files
 * - Scans only allowlist folders
 * - Outputs structured results to .scan-results.json
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

const ALLOWLIST_FOLDERS = [
  "client/src/pages",
  "client/src/components",
  "client/src/legal"
];

const SAFETY_PATTERNS = {
  seo: [/<SEO\s/, /import\s*{\s*SEO\s*}/],
  disclaimer: [/18\+/, /Adults.*18/i, /educational.*wellness/i, /not.*medical.*care/i],
  safetyFooter: [/SafetyFooter/, /SafetyNotice/],
  benefitsBlock: [/BenefitsBlock/, /benefits\s*=\s*\[/, /WellnessPageShell/],
  miPatterns: [/motivational/i, /strengths.*based/i, /getMiPrompt/, /MIPromptCard/]
};

const DISALLOWED_PATTERNS = [
  { name: "TODO", pattern: /\bTODO\b/i },
  { name: "lorem", pattern: /\blorem ipsum\b/i },
  { name: "placeholder-text", pattern: /["'`]placeholder["'`]|placeholder text|placeholder content/i },
  { name: "stub-return", pattern: /return\s+null\s*;\s*\/\/\s*(stub|todo|placeholder)/i }
];

const EXCLUSIONS = [
  /\.test\./,
  /\.spec\./,
  /index\.(ts|js|tsx|jsx)$/,
  /Admin\.jsx$/,
  /Analytics\.jsx$/,
  /ContentAdminDashboard/
];

const args = process.argv.slice(2);
const jsonOutput = args.includes("--json");
const verbose = args.includes("--verbose");

function log(...msgs) {
  if (!jsonOutput) console.log(...msgs);
}

function walk(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(p));
    else if (/\.(tsx|jsx|ts|js)$/.test(entry.name)) out.push(p);
  }
  return out;
}

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const relativePath = path.relative(ROOT, filePath);

  const results = {
    path: relativePath,
    hasSEO: SAFETY_PATTERNS.seo.some(p => p.test(content)),
    hasDisclaimer: SAFETY_PATTERNS.disclaimer.some(p => p.test(content)),
    hasSafetyFooter: SAFETY_PATTERNS.safetyFooter.some(p => p.test(content)),
    hasBenefitsBlock: SAFETY_PATTERNS.benefitsBlock.some(p => p.test(content)),
    hasMIPatterns: SAFETY_PATTERNS.miPatterns.some(p => p.test(content)),
    isGenerated: relativePath.includes("/generated/"),
    isWellnessPage: /Page\.(tsx|jsx)$/.test(filePath) || relativePath.includes("/generated/"),
    disallowed: DISALLOWED_PATTERNS.filter(d => d.pattern.test(content)).map(d => d.name),
    issues: []
  };

  if (results.isWellnessPage) {
    if (!results.hasSEO) results.issues.push("missing-seo");
    if (!results.hasDisclaimer && !results.hasSafetyFooter) results.issues.push("missing-safety");
    if (!results.hasBenefitsBlock && results.isGenerated) results.issues.push("missing-benefits");
  }

  if (results.disallowed.length > 0) {
    results.issues.push(`contains-disallowed: ${results.disallowed.join(", ")}`);
  }

  return results;
}

function runScan() {
  log("\n🔍 Platform Scanner - Human-Triggered Audit\n");
  log("Scanning folders:", ALLOWLIST_FOLDERS.join(", "));
  log("");

  const allResults = [];
  const summary = {
    totalFiles: 0,
    wellnessPages: 0,
    generatedPages: 0,
    withSEO: 0,
    withDisclaimer: 0,
    withSafetyFooter: 0,
    withBenefits: 0,
    withMI: 0,
    issuesFound: 0,
    issuesByType: {
      "missing-seo": [],
      "missing-safety": [],
      "missing-benefits": [],
      "contains-disallowed": []
    }
  };

  for (const folder of ALLOWLIST_FOLDERS) {
    const fullPath = path.join(ROOT, folder);
    const files = walk(fullPath);

    for (const file of files) {
      const relativePath = path.relative(ROOT, file);

      if (EXCLUSIONS.some(ex => ex.test(relativePath))) {
        if (verbose) log(`  [skip] ${relativePath}`);
        continue;
      }

      const result = scanFile(file);
      allResults.push(result);

      summary.totalFiles++;
      if (result.isWellnessPage) summary.wellnessPages++;
      if (result.isGenerated) summary.generatedPages++;
      if (result.hasSEO) summary.withSEO++;
      if (result.hasDisclaimer) summary.withDisclaimer++;
      if (result.hasSafetyFooter) summary.withSafetyFooter++;
      if (result.hasBenefitsBlock) summary.withBenefits++;
      if (result.hasMIPatterns) summary.withMI++;

      for (const issue of result.issues) {
        summary.issuesFound++;
        const key = issue.startsWith("contains-disallowed") ? "contains-disallowed" : issue;
        if (summary.issuesByType[key]) {
          summary.issuesByType[key].push(result.path);
        }
      }

      if (verbose) {
        const status = result.issues.length === 0 ? "✓" : "⚠";
        log(`  [${status}] ${result.path}`);
        if (result.issues.length > 0) {
          log(`      Issues: ${result.issues.join(", ")}`);
        }
      }
    }
  }

  const output = {
    timestamp: new Date().toISOString(),
    summary,
    filesWithIssues: allResults.filter(r => r.issues.length > 0),
    allResults: verbose ? allResults : undefined
  };

  if (jsonOutput) {
    console.log(JSON.stringify(output, null, 2));
  } else {
    log("\n📊 SCAN SUMMARY");
    log("═══════════════════════════════════════");
    log(`Total files scanned:    ${summary.totalFiles}`);
    log(`Wellness pages:         ${summary.wellnessPages}`);
    log(`Generated pages:        ${summary.generatedPages}`);
    log(`With SEO:               ${summary.withSEO}`);
    log(`With Disclaimer:        ${summary.withDisclaimer}`);
    log(`With SafetyFooter:      ${summary.withSafetyFooter}`);
    log(`With Benefits:          ${summary.withBenefits}`);
    log(`With MI Patterns:       ${summary.withMI}`);
    log(`Issues found:           ${summary.issuesFound}`);
    log("");

    if (summary.issuesFound > 0) {
      log("📋 ISSUES BY TYPE");
      log("───────────────────────────────────────");
      for (const [type, files] of Object.entries(summary.issuesByType)) {
        if (files.length > 0) {
          log(`\n${type} (${files.length}):`);
          files.slice(0, 10).forEach(f => log(`  - ${f}`));
          if (files.length > 10) log(`  ... and ${files.length - 10} more`);
        }
      }
    } else {
      log("✅ No issues found!");
    }
    log("");
  }

  fs.writeFileSync(
    path.join(ROOT, "scripts/.scan-results.json"),
    JSON.stringify(output, null, 2)
  );
  log("Results saved to: scripts/.scan-results.json\n");

  process.exit(summary.issuesFound > 0 ? 2 : 0);
}

runScan();
