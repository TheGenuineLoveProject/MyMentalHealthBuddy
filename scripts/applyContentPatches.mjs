#!/usr/bin/env node
/**
 * applyContentPatches.mjs - Human-triggered content patcher
 * Applies small, safe, idempotent content upgrades (benefits + MI blocks) ONLY where missing
 * 
 * Usage: node scripts/applyContentPatches.mjs [--dry-run] [--verbose]
 * 
 * GUARDRAILS:
 * - Idempotent: Running twice will not duplicate content
 * - Only modifies files in allowlist folders
 * - Never overwrites brand logo assets
 * - Never adds copyrighted text
 * - Backs up files before patching
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const BACKUP_DIR = path.join(ROOT, "scripts/.patch-backups");

const ALLOWLIST_FOLDERS = [
  "client/src/pages",
  "client/src/components",
  "client/src/legal"
];

const BRAND_ASSETS = [
  /logo/i,
  /brand\//,
  /\.png$/,
  /\.jpg$/,
  /\.jpeg$/,
  /\.svg$/,
  /\.ico$/
];

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const verbose = args.includes("--verbose");

function log(...msgs) {
  console.log(...msgs);
}

function vlog(...msgs) {
  if (verbose) console.log(...msgs);
}

function isAllowed(filePath) {
  const rel = path.relative(ROOT, filePath);
  
  if (BRAND_ASSETS.some(p => p.test(rel))) {
    return false;
  }
  
  return ALLOWLIST_FOLDERS.some(folder => rel.startsWith(folder));
}

function walk(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(p));
    else if (/\.(tsx|jsx)$/.test(entry.name)) out.push(p);
  }
  return out;
}

function backup(filePath) {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
  const rel = path.relative(ROOT, filePath).replace(/\//g, "__");
  const backupPath = path.join(BACKUP_DIR, `${rel}.${Date.now()}.bak`);
  fs.copyFileSync(filePath, backupPath);
  return backupPath;
}

const PATCHES = [
  {
    name: "add-disclaimer-to-page",
    description: "Adds 18+ disclaimer to wellness pages missing safety elements",
    applicable: (content, filePath) => {
      const isWellnessPage = /Page\.(tsx|jsx)$/.test(filePath);
      const hasDisclaimer = /18\+|Adults.*18|educational.*wellness/i.test(content);
      const hasSafetyFooter = /SafetyFooter|SafetyNotice/.test(content);
      return isWellnessPage && !hasDisclaimer && !hasSafetyFooter;
    },
    apply: (content) => {
      const disclaimer = `\n      <p className="text-center text-sm opacity-70 py-4">\n        Adults 18+ only. Educational wellness tools, not medical care.\n      </p>`;
      
      const closingPatterns = [
        /(<\/div>\s*)\);?\s*\}?\s*$/,
        /(<\/>\s*)\);?\s*\}?\s*$/
      ];
      
      for (const pattern of closingPatterns) {
        if (pattern.test(content)) {
          return content.replace(pattern, (match, closing) => {
            return disclaimer + "\n    " + match;
          });
        }
      }
      
      return null;
    }
  },
  {
    name: "add-seo-import",
    description: "Adds SEO component import to pages missing it",
    applicable: (content, filePath) => {
      const isPage = /Page\.(tsx|jsx)$/.test(filePath);
      const hasSEOImport = /import\s*{\s*SEO\s*}/.test(content);
      const hasSEOUsage = /<SEO\s/.test(content);
      return isPage && !hasSEOImport && !hasSEOUsage;
    },
    apply: (content) => {
      if (/^import/.test(content)) {
        const firstImportEnd = content.indexOf("\n");
        if (firstImportEnd > 0) {
          return content.slice(0, firstImportEnd + 1) + 
                 `import { SEO } from "@/components/SEO";\n` + 
                 content.slice(firstImportEnd + 1);
        }
      }
      return `import { SEO } from "@/components/SEO";\n` + content;
    }
  },
  {
    name: "ensure-benefits-block-import",
    description: "Adds BenefitsBlock import to generated pages missing it",
    applicable: (content, filePath) => {
      const isGenerated = filePath.includes("/generated/");
      const hasBenefitsImport = /import\s*{\s*BenefitsBlock\s*}/.test(content) || 
                                 /BenefitsBlock/.test(content);
      const hasWellnessShell = /WellnessPageShell/.test(content);
      return isGenerated && !hasBenefitsImport && !hasWellnessShell;
    },
    apply: (content) => {
      if (/^import/.test(content)) {
        const lastImportMatch = content.match(/^import[^;]+;/gm);
        if (lastImportMatch) {
          const lastImport = lastImportMatch[lastImportMatch.length - 1];
          const lastImportIdx = content.lastIndexOf(lastImport) + lastImport.length;
          return content.slice(0, lastImportIdx) + 
                 `\nimport { BenefitsBlock } from "@/components/wellness/BenefitsBlock";` + 
                 content.slice(lastImportIdx);
        }
      }
      return `import { BenefitsBlock } from "@/components/wellness/BenefitsBlock";\n` + content;
    }
  }
];

function applyPatches() {
  log("\n🔧 Content Patcher - Human-Triggered\n");
  
  if (dryRun) {
    log("🏃 DRY RUN MODE - No files will be modified\n");
  }
  
  log("Scanning allowlist folders:", ALLOWLIST_FOLDERS.join(", "));
  log("");

  const stats = {
    filesScanned: 0,
    filesPatched: 0,
    patchesApplied: 0,
    skipped: 0,
    errors: []
  };

  const patchLog = [];

  for (const folder of ALLOWLIST_FOLDERS) {
    const fullPath = path.join(ROOT, folder);
    const files = walk(fullPath);

    for (const file of files) {
      if (!isAllowed(file)) {
        vlog(`  [skip:protected] ${path.relative(ROOT, file)}`);
        stats.skipped++;
        continue;
      }

      stats.filesScanned++;
      let content = fs.readFileSync(file, "utf8");
      let modified = false;
      const appliedPatches = [];

      for (const patch of PATCHES) {
        try {
          if (patch.applicable(content, file)) {
            const result = patch.apply(content);
            if (result && result !== content) {
              content = result;
              modified = true;
              appliedPatches.push(patch.name);
              stats.patchesApplied++;
            }
          }
        } catch (err) {
          stats.errors.push({ file: path.relative(ROOT, file), patch: patch.name, error: err.message });
        }
      }

      if (modified) {
        const rel = path.relative(ROOT, file);
        patchLog.push({ file: rel, patches: appliedPatches });
        
        if (!dryRun) {
          const backupPath = backup(file);
          fs.writeFileSync(file, content, "utf8");
          vlog(`  [patched] ${rel} (backup: ${path.basename(backupPath)})`);
        } else {
          vlog(`  [would patch] ${rel}: ${appliedPatches.join(", ")}`);
        }
        
        stats.filesPatched++;
      }
    }
  }

  log("\n📊 PATCH SUMMARY");
  log("═══════════════════════════════════════");
  log(`Files scanned:    ${stats.filesScanned}`);
  log(`Files patched:    ${stats.filesPatched}`);
  log(`Patches applied:  ${stats.patchesApplied}`);
  log(`Skipped:          ${stats.skipped}`);
  log(`Errors:           ${stats.errors.length}`);
  log("");

  if (patchLog.length > 0) {
    log("📝 CHANGES MADE" + (dryRun ? " (DRY RUN)" : ""));
    log("───────────────────────────────────────");
    for (const item of patchLog) {
      log(`  ${item.file}`);
      log(`    └─ ${item.patches.join(", ")}`);
    }
    log("");
  }

  if (stats.errors.length > 0) {
    log("❌ ERRORS");
    log("───────────────────────────────────────");
    for (const err of stats.errors) {
      log(`  ${err.file}: ${err.patch} - ${err.error}`);
    }
    log("");
  }

  if (dryRun) {
    log("💡 To apply changes, run without --dry-run\n");
  } else if (stats.filesPatched > 0) {
    log("✅ Patches applied! Run 'npm run platform:scan' to verify.\n");
    log(`💾 Backups saved to: ${path.relative(ROOT, BACKUP_DIR)}\n`);
  } else {
    log("✅ No patches needed - all files already up to date!\n");
  }

  const output = {
    timestamp: new Date().toISOString(),
    dryRun,
    stats,
    patchLog
  };

  fs.writeFileSync(
    path.join(ROOT, "scripts/.patch-results.json"),
    JSON.stringify(output, null, 2)
  );

  process.exit(stats.errors.length > 0 ? 1 : 0);
}

applyPatches();
