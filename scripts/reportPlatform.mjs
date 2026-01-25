#!/usr/bin/env node
/**
 * reportPlatform.mjs - Human-triggered platform report generator
 * Prints a clean report summary for humans
 * 
 * Usage: node scripts/reportPlatform.mjs [--markdown] [--full]
 * 
 * GUARDRAILS:
 * - Read-only: Never modifies source files
 * - Reads scan results from .scan-results.json
 * - Outputs human-readable summary
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SCAN_RESULTS_PATH = path.join(ROOT, "scripts/.scan-results.json");

const args = process.argv.slice(2);
const markdown = args.includes("--markdown");
const full = args.includes("--full");

function loadScanResults() {
  if (!fs.existsSync(SCAN_RESULTS_PATH)) {
    console.error("❌ No scan results found. Run 'npm run platform:scan' first.");
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(SCAN_RESULTS_PATH, "utf8"));
}

function formatMarkdown(data) {
  const { summary, filesWithIssues, timestamp } = data;
  
  let output = `# Platform Health Report\n\n`;
  output += `**Generated:** ${new Date(timestamp).toLocaleString()}\n\n`;
  
  output += `## Summary\n\n`;
  output += `| Metric | Count |\n`;
  output += `|--------|-------|\n`;
  output += `| Total files | ${summary.totalFiles} |\n`;
  output += `| Wellness pages | ${summary.wellnessPages} |\n`;
  output += `| Generated pages | ${summary.generatedPages} |\n`;
  output += `| With SEO | ${summary.withSEO} |\n`;
  output += `| With Disclaimer | ${summary.withDisclaimer} |\n`;
  output += `| With SafetyFooter | ${summary.withSafetyFooter} |\n`;
  output += `| With Benefits | ${summary.withBenefits} |\n`;
  output += `| With MI Patterns | ${summary.withMI} |\n`;
  output += `| **Issues found** | **${summary.issuesFound}** |\n\n`;

  if (filesWithIssues && filesWithIssues.length > 0) {
    output += `## Files with Issues\n\n`;
    for (const file of filesWithIssues) {
      output += `### ${file.path}\n`;
      output += `- Issues: ${file.issues.join(", ")}\n`;
      output += `- SEO: ${file.hasSEO ? "✅" : "❌"}\n`;
      output += `- Safety: ${file.hasDisclaimer || file.hasSafetyFooter ? "✅" : "❌"}\n`;
      output += `- Benefits: ${file.hasBenefitsBlock ? "✅" : "❌"}\n\n`;
    }
  }

  output += `## Coverage Rates\n\n`;
  const seoRate = ((summary.withSEO / summary.wellnessPages) * 100).toFixed(1);
  const safetyRate = (((summary.withDisclaimer + summary.withSafetyFooter) / summary.wellnessPages) * 100).toFixed(1);
  output += `- SEO Coverage: ${seoRate}%\n`;
  output += `- Safety Coverage: ${safetyRate}%\n`;

  return output;
}

function formatConsole(data) {
  const { summary, filesWithIssues, timestamp } = data;
  
  console.log("\n╔══════════════════════════════════════════════════════════════╗");
  console.log("║           PLATFORM HEALTH REPORT                             ║");
  console.log("╚══════════════════════════════════════════════════════════════╝\n");
  
  console.log(`📅 Generated: ${new Date(timestamp).toLocaleString()}\n`);
  
  console.log("📊 METRICS");
  console.log("─────────────────────────────────────");
  console.log(`  Total files:        ${summary.totalFiles}`);
  console.log(`  Wellness pages:     ${summary.wellnessPages}`);
  console.log(`  Generated pages:    ${summary.generatedPages}`);
  console.log(`  With SEO:           ${summary.withSEO}`);
  console.log(`  With Disclaimer:    ${summary.withDisclaimer}`);
  console.log(`  With SafetyFooter:  ${summary.withSafetyFooter}`);
  console.log(`  With Benefits:      ${summary.withBenefits}`);
  console.log(`  With MI Patterns:   ${summary.withMI}`);
  console.log(`  Issues found:       ${summary.issuesFound}`);
  console.log("");

  const seoRate = ((summary.withSEO / summary.wellnessPages) * 100).toFixed(1);
  const safetyRate = (((summary.withDisclaimer + summary.withSafetyFooter) / summary.wellnessPages) * 100).toFixed(1);
  
  console.log("📈 COVERAGE RATES");
  console.log("─────────────────────────────────────");
  console.log(`  SEO:     ${seoRate}% ${seoRate >= 90 ? "✅" : "⚠️"}`);
  console.log(`  Safety:  ${safetyRate}% ${safetyRate >= 90 ? "✅" : "⚠️"}`);
  console.log("");

  if (filesWithIssues && filesWithIssues.length > 0) {
    console.log("🔧 FILES NEEDING ATTENTION");
    console.log("─────────────────────────────────────");
    
    const limit = full ? filesWithIssues.length : Math.min(15, filesWithIssues.length);
    for (let i = 0; i < limit; i++) {
      const file = filesWithIssues[i];
      console.log(`  ${i + 1}. ${file.path}`);
      console.log(`     └─ ${file.issues.join(", ")}`);
    }
    
    if (!full && filesWithIssues.length > 15) {
      console.log(`  ... and ${filesWithIssues.length - 15} more (use --full to see all)`);
    }
    console.log("");
  } else {
    console.log("✅ All files passing checks!\n");
  }

  console.log("💡 NEXT STEPS");
  console.log("─────────────────────────────────────");
  if (summary.issuesFound > 0) {
    console.log("  1. Run: npm run platform:patch   (apply safe patches)");
    console.log("  2. Run: npm run platform:scan    (re-scan to verify)");
    console.log("  3. Manual review of remaining issues\n");
  } else {
    console.log("  Platform is in good shape! 🎉\n");
  }
}

function main() {
  const data = loadScanResults();
  
  if (markdown) {
    console.log(formatMarkdown(data));
  } else {
    formatConsole(data);
  }
}

main();
