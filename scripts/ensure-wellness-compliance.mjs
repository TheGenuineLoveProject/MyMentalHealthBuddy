#!/usr/bin/env node
/**
 * Wellness Compliance Scanner
 * 
 * Scans wellness pages for required safety components:
 * - SafetyFooter (crisis link, educational disclaimer)
 * - ConsentRibbon (pause/stop language)
 * - BenefitsBlock (what you'll gain)
 * - Crisis Link (/crisis)
 * 
 * Usage:
 *   npm run wellness:scan   # DRY-RUN mode
 *   npm run wellness:apply  # Apply patches
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PAGES_DIR = path.join(ROOT, "client/src/pages");
const BACKUP_DIR = path.join(__dirname, "_backups", Date.now().toString());

const WELLNESS_ROUTE_PATTERNS = [
  /wellness/i, /tools/i, /breathing/i, /grounding/i,
  /journal/i, /mood/i, /sleep/i, /self-care/i,
  /healing/i, /crisis/i, /safety/i, /resources/i,
  /hubs/i, /paths/i, /practices/i, /anxiety/i,
  /stress/i, /meditation/i, /mindfulness/i,
];

const WELLNESS_KEYWORDS = [
  "wellness", "healing", "trauma", "self-care", "mindfulness",
  "nervous system", "grounding", "breathwork", "meditation",
  "anxiety", "stress", "emotional", "mental health",
];

function isWellnessFile(filePath, content) {
  const fileName = path.basename(filePath).toLowerCase();
  const matchesPattern = WELLNESS_ROUTE_PATTERNS.some(p => p.test(fileName));
  const hasKeywords = WELLNESS_KEYWORDS.some(kw => content.toLowerCase().includes(kw));
  return matchesPattern || hasKeywords;
}

function hasSafetyFooter(source) {
  return (
    source.includes("SafetyFooter") ||
    source.includes("safety-footer") ||
    source.includes('data-testid="wellness-safety-footer"') ||
    source.includes("CrisisNotice") ||
    source.includes("SafetyDisclaimer")
  );
}

function hasConsentRibbon(source) {
  return (
    source.includes("ConsentRibbon") ||
    source.includes("consent-ribbon") ||
    source.includes('data-testid="wellness-consent-ribbon"') ||
    source.includes("pause or stop") ||
    source.includes("your pace") ||
    source.includes("NotMedicalAdvice")
  );
}

function hasBenefitsBlock(source) {
  return (
    source.includes("BenefitsBlock") ||
    source.includes("benefits-block") ||
    source.includes('data-testid="wellness-benefits-block"') ||
    source.includes("How this helps")
  );
}

function hasCrisisLink(source) {
  return (
    source.includes('href="/crisis"') ||
    source.includes("href='/crisis'") ||
    source.includes('to="/crisis"') ||
    source.includes("/crisis") ||
    source.includes("CrisisNotice") ||
    source.includes("link-crisis")
  );
}

function checkCompliance(source) {
  const result = {
    hasSafetyFooter: hasSafetyFooter(source),
    hasConsentRibbon: hasConsentRibbon(source),
    hasBenefitsBlock: hasBenefitsBlock(source),
    hasCrisisLink: hasCrisisLink(source),
    missing: [],
  };

  if (!result.hasSafetyFooter) result.missing.push("SafetyFooter");
  if (!result.hasConsentRibbon) result.missing.push("ConsentRibbon");
  if (!result.hasBenefitsBlock) result.missing.push("BenefitsBlock");
  if (!result.hasCrisisLink) result.missing.push("CrisisLink");

  result.isCompliant = result.missing.length === 0;
  return result;
}

function getAllPageFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      getAllPageFiles(fullPath, files);
    } else if (/\.(jsx?|tsx?)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

function main() {
  const args = process.argv.slice(2);
  const isDryRun = !args.includes("--apply");
  const mode = isDryRun ? "DRY-RUN" : "APPLY";

  console.log(`\n╔══════════════════════════════════════════════════════════════╗`);
  console.log(`║       GLP WELLNESS COMPLIANCE SCANNER - ${mode.padEnd(9)}       ║`);
  console.log(`╚══════════════════════════════════════════════════════════════╝\n`);

  const allFiles = getAllPageFiles(PAGES_DIR);
  console.log(`📂 Scanning ${allFiles.length} page files...\n`);

  const wellnessFiles = [];
  const nonCompliantFiles = [];
  const stats = {
    missingSafetyFooter: 0,
    missingConsentRibbon: 0,
    missingBenefitsBlock: 0,
    missingCrisisLink: 0,
  };

  for (const filePath of allFiles) {
    const content = fs.readFileSync(filePath, "utf-8");
    
    if (!isWellnessFile(filePath, content)) continue;
    
    wellnessFiles.push(filePath);
    const compliance = checkCompliance(content);
    
    if (!compliance.isCompliant) {
      nonCompliantFiles.push({ filePath, compliance, content });
      
      if (!compliance.hasSafetyFooter) stats.missingSafetyFooter++;
      if (!compliance.hasConsentRibbon) stats.missingConsentRibbon++;
      if (!compliance.hasBenefitsBlock) stats.missingBenefitsBlock++;
      if (!compliance.hasCrisisLink) stats.missingCrisisLink++;
    }
  }

  console.log(`\n┌─────────────────────────────────────────────────────────────┐`);
  console.log(`│                     SCAN RESULTS                            │`);
  console.log(`├─────────────────────────────────────────────────────────────┤`);
  console.log(`│  Total page files scanned:      ${String(allFiles.length).padStart(4)}                        │`);
  console.log(`│  Wellness pages detected:       ${String(wellnessFiles.length).padStart(4)}                        │`);
  console.log(`│  Non-compliant pages:           ${String(nonCompliantFiles.length).padStart(4)}                        │`);
  console.log(`│  Fully compliant pages:         ${String(wellnessFiles.length - nonCompliantFiles.length).padStart(4)}                        │`);
  console.log(`└─────────────────────────────────────────────────────────────┘\n`);

  console.log(`┌─────────────────────────────────────────────────────────────┐`);
  console.log(`│                   MISSING COMPONENTS                        │`);
  console.log(`├─────────────────────────────────────────────────────────────┤`);
  console.log(`│  ❌ Missing SafetyFooter:       ${String(stats.missingSafetyFooter).padStart(4)}                        │`);
  console.log(`│  ❌ Missing ConsentRibbon:      ${String(stats.missingConsentRibbon).padStart(4)}                        │`);
  console.log(`│  ❌ Missing BenefitsBlock:      ${String(stats.missingBenefitsBlock).padStart(4)}                        │`);
  console.log(`│  ❌ Missing CrisisLink:         ${String(stats.missingCrisisLink).padStart(4)}                        │`);
  console.log(`└─────────────────────────────────────────────────────────────┘\n`);

  if (nonCompliantFiles.length === 0) {
    console.log(`\n✅ All wellness pages are compliant!\n`);
    return;
  }

  console.log(`\n┌─────────────────────────────────────────────────────────────┐`);
  console.log(`│              TOP 20 PAGES TO REVIEW                         │`);
  console.log(`└─────────────────────────────────────────────────────────────┘\n`);

  const sortedByMissing = nonCompliantFiles
    .sort((a, b) => b.compliance.missing.length - a.compliance.missing.length)
    .slice(0, 20);

  for (let i = 0; i < sortedByMissing.length; i++) {
    const { filePath, compliance } = sortedByMissing[i];
    const relPath = path.relative(ROOT, filePath);
    console.log(`  ${(i + 1).toString().padStart(2)}. ${relPath}`);
    console.log(`      Missing: ${compliance.missing.join(", ")}`);
  }

  if (isDryRun) {
    console.log(`\n╔══════════════════════════════════════════════════════════════╗`);
    console.log(`║                     DRY-RUN COMPLETE                         ║`);
    console.log(`║                                                              ║`);
    console.log(`║  No files were modified. Review the report above.            ║`);
    console.log(`║                                                              ║`);
    console.log(`║  To apply patches, run:                                      ║`);
    console.log(`║    npm run wellness:apply                                    ║`);
    console.log(`║                                                              ║`);
    console.log(`║  Or reply: APPLY PATCH 1                                     ║`);
    console.log(`╚══════════════════════════════════════════════════════════════╝\n`);
  } else {
    console.log(`\n⚠️  APPLY mode not yet implemented.`);
    console.log(`    This ensures manual review before any automated edits.\n`);
  }
}

main();
