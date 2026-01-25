#!/usr/bin/env node
/**
 * Wellness Shell Auto-Apply Script
 * 
 * DRY-RUN by default. Set DRY_RUN=0 to apply changes.
 * Creates .bak copies before modifying files.
 * 
 * Usage:
 *   DRY_RUN=1 node scripts/applyWellnessShell.mjs  (preview only)
 *   DRY_RUN=0 node scripts/applyWellnessShell.mjs  (apply changes)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PAGES_DIR = path.join(ROOT, 'client', 'src', 'pages');
const BACKUP_DIR = path.join(ROOT, '.wellness-backups');

const DRY_RUN = process.env.DRY_RUN !== '0';

// Directories to EXCLUDE from wellness shell wrapping
const EXCLUDED_DIRS = [
  'auth',
  'admin',
  'legal',
  'account',
  'generated',
  'landing',
  'marketing',
  'dashboard',
];

// Files to EXCLUDE (exact names without extension)
const EXCLUDED_FILES = [
  'Admin',
  'Analytics',
  'Blog',
  'BlogEditor',
  'BlogIndex',
  'BlogPost',
  'Crisis',
  'CrisisPage',
  'Home',
  'HomePage',
  'Landing',
  'LandingPage',
  'CanvaLanding',
  '404',
  '_autopilot',
];

// Required wellness components
const REQUIRED_COMPONENTS = {
  BenefitsBlock: 'BenefitsBlock|BenefitBlock',
  SafetyFooter: 'SafetyFooter|SafetyFooterStrip',
  ClarityCard: 'ClarityCard',
  ExamplesAccordion: 'ExamplesAccordion',
  ConsentStrip: 'ConsentStrip|consent',
  CrisisLink: '/crisis|CRISIS_PATH',
};

// Collect all page files
function collectPageFiles(dir, baseDir = dir) {
  const files = [];
  
  if (!fs.existsSync(dir)) return files;
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(baseDir, fullPath);
    
    if (entry.isDirectory()) {
      // Skip excluded directories
      if (EXCLUDED_DIRS.includes(entry.name)) {
        continue;
      }
      files.push(...collectPageFiles(fullPath, baseDir));
    } else if (entry.isFile() && /\.(jsx|tsx)$/.test(entry.name)) {
      // Skip excluded files
      const baseName = entry.name.replace(/\.(jsx|tsx)$/, '');
      if (EXCLUDED_FILES.includes(baseName)) {
        continue;
      }
      // Skip module CSS files
      if (entry.name.endsWith('.module.css')) {
        continue;
      }
      files.push({ fullPath, relativePath, baseName });
    }
  }
  
  return files;
}

// Check what components a file is missing
function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const missing = [];
  const present = [];
  
  for (const [name, pattern] of Object.entries(REQUIRED_COMPONENTS)) {
    const regex = new RegExp(pattern, 'i');
    if (regex.test(content)) {
      present.push(name);
    } else {
      missing.push(name);
    }
  }
  
  // Check if already using WellnessPageShell
  const usesShell = /WellnessPageShell/.test(content);
  
  return {
    missing,
    present,
    usesShell,
    needsWork: missing.length > 0 && !usesShell,
  };
}

// Categorize files by status
function categorizeFiles(files) {
  const categories = {
    complete: [],      // Has all components
    usesShell: [],     // Already using WellnessPageShell
    needsWork: [],     // Missing components, needs wrapping
    partial: [],       // Some components present, some missing
    skipped: [],       // Excluded files
  };
  
  for (const file of files) {
    const analysis = analyzeFile(file.fullPath);
    file.analysis = analysis;
    
    if (analysis.usesShell) {
      categories.usesShell.push(file);
    } else if (analysis.missing.length === 0) {
      categories.complete.push(file);
    } else if (analysis.present.length === 0) {
      categories.needsWork.push(file);
    } else {
      categories.partial.push(file);
    }
  }
  
  return categories;
}

// Print report
function printReport(categories) {
  const total = Object.values(categories).reduce((sum, arr) => sum + arr.length, 0);
  
  console.log('\n' + '='.repeat(70));
  console.log('🧘 WELLNESS SHELL ANALYSIS REPORT');
  console.log('='.repeat(70));
  console.log(`\n📁 Pages Directory: ${PAGES_DIR}`);
  console.log(`📊 Total Wellness Pages Scanned: ${total}`);
  console.log(`🔒 DRY RUN MODE: ${DRY_RUN ? 'ON (no changes will be made)' : 'OFF (changes will be applied)'}`);
  
  console.log('\n' + '-'.repeat(70));
  console.log('📋 SUMMARY BY STATUS');
  console.log('-'.repeat(70));
  
  console.log(`\n✅ Already using WellnessPageShell: ${categories.usesShell.length}`);
  if (categories.usesShell.length > 0 && categories.usesShell.length <= 10) {
    categories.usesShell.forEach(f => console.log(`   - ${f.relativePath}`));
  }
  
  console.log(`\n✅ Complete (all components present): ${categories.complete.length}`);
  if (categories.complete.length > 0 && categories.complete.length <= 10) {
    categories.complete.forEach(f => console.log(`   - ${f.relativePath}`));
  }
  
  console.log(`\n⚠️  Partial (some components missing): ${categories.partial.length}`);
  categories.partial.slice(0, 15).forEach(f => {
    console.log(`   - ${f.relativePath}`);
    console.log(`     ✓ Has: ${f.analysis.present.join(', ') || 'none'}`);
    console.log(`     ✗ Missing: ${f.analysis.missing.join(', ')}`);
  });
  if (categories.partial.length > 15) {
    console.log(`   ... and ${categories.partial.length - 15} more`);
  }
  
  console.log(`\n❌ Needs Work (no wellness components): ${categories.needsWork.length}`);
  categories.needsWork.slice(0, 15).forEach(f => {
    console.log(`   - ${f.relativePath}`);
  });
  if (categories.needsWork.length > 15) {
    console.log(`   ... and ${categories.needsWork.length - 15} more`);
  }
  
  console.log('\n' + '-'.repeat(70));
  console.log('📂 EXCLUDED DIRECTORIES (non-wellness)');
  console.log('-'.repeat(70));
  EXCLUDED_DIRS.forEach(d => console.log(`   - ${d}/`));
  
  console.log('\n' + '-'.repeat(70));
  console.log('📄 EXCLUDED FILES (non-wellness)');
  console.log('-'.repeat(70));
  EXCLUDED_FILES.slice(0, 10).forEach(f => console.log(`   - ${f}`));
  if (EXCLUDED_FILES.length > 10) {
    console.log(`   ... and ${EXCLUDED_FILES.length - 10} more`);
  }
  
  console.log('\n' + '='.repeat(70));
  console.log('📈 ACTION PLAN');
  console.log('='.repeat(70));
  
  const actionable = categories.partial.length + categories.needsWork.length;
  console.log(`\n🎯 Pages that would be modified: ${actionable}`);
  console.log(`   - Partial (add missing components): ${categories.partial.length}`);
  console.log(`   - Needs Work (add full shell): ${categories.needsWork.length}`);
  
  if (DRY_RUN) {
    console.log('\n💡 To apply changes, run:');
    console.log('   DRY_RUN=0 node scripts/applyWellnessShell.mjs');
    console.log('\n   Or use npm script:');
    console.log('   npm run patch:wellness');
  } else {
    console.log('\n⚡ Changes will be applied...');
  }
  
  console.log('\n' + '='.repeat(70) + '\n');
  
  return actionable;
}

// Create backup of a file
function backupFile(filePath) {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
  
  const relativePath = path.relative(PAGES_DIR, filePath);
  const backupPath = path.join(BACKUP_DIR, relativePath + '.bak');
  const backupDir = path.dirname(backupPath);
  
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  fs.copyFileSync(filePath, backupPath);
  return backupPath;
}

// Main execution
async function main() {
  console.log('\n🧘 Wellness Shell Auto-Apply Script');
  console.log(`   Mode: ${DRY_RUN ? 'DRY RUN (preview only)' : 'LIVE (applying changes)'}`);
  
  // Collect files
  const files = collectPageFiles(PAGES_DIR);
  console.log(`   Found ${files.length} page files to analyze...`);
  
  // Categorize
  const categories = categorizeFiles(files);
  
  // Print report
  const actionable = printReport(categories);
  
  // If not dry run, apply changes
  if (!DRY_RUN && actionable > 0) {
    console.log('\n⚡ Applying changes...');
    console.log('   Creating backups in .wellness-backups/\n');
    
    let modified = 0;
    
    // For now, just create backups and log what would happen
    // Full implementation would add imports and wrap JSX
    for (const file of [...categories.partial, ...categories.needsWork]) {
      const backupPath = backupFile(file.fullPath);
      console.log(`   📦 Backed up: ${file.relativePath}`);
      console.log(`      → ${path.relative(ROOT, backupPath)}`);
      modified++;
    }
    
    console.log(`\n✅ Created ${modified} backup files.`);
    console.log('   Note: Full JSX wrapping is a Phase 2 feature.');
    console.log('   Manual review recommended for complex pages.');
  }
  
  // Write report to file
  const reportPath = path.join(ROOT, 'reports', 'wellness-shell-analysis.md');
  const reportDir = path.dirname(reportPath);
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }
  
  const reportContent = generateMarkdownReport(categories);
  fs.writeFileSync(reportPath, reportContent);
  console.log(`📄 Report saved to: ${reportPath}\n`);
}

// Generate markdown report
function generateMarkdownReport(categories) {
  const total = Object.values(categories).reduce((sum, arr) => sum + arr.length, 0);
  const timestamp = new Date().toISOString();
  
  let md = `# Wellness Shell Analysis Report\n\n`;
  md += `Generated: ${timestamp}\n\n`;
  md += `## Summary\n\n`;
  md += `| Status | Count |\n`;
  md += `|--------|-------|\n`;
  md += `| Using WellnessPageShell | ${categories.usesShell.length} |\n`;
  md += `| Complete (all components) | ${categories.complete.length} |\n`;
  md += `| Partial (some missing) | ${categories.partial.length} |\n`;
  md += `| Needs Work (no components) | ${categories.needsWork.length} |\n`;
  md += `| **Total** | **${total}** |\n\n`;
  
  md += `## Pages Needing Work\n\n`;
  
  if (categories.partial.length > 0) {
    md += `### Partial (Missing Some Components)\n\n`;
    for (const file of categories.partial) {
      md += `- \`${file.relativePath}\`\n`;
      md += `  - Has: ${file.analysis.present.join(', ') || 'none'}\n`;
      md += `  - Missing: ${file.analysis.missing.join(', ')}\n`;
    }
    md += '\n';
  }
  
  if (categories.needsWork.length > 0) {
    md += `### Needs Full Shell\n\n`;
    for (const file of categories.needsWork) {
      md += `- \`${file.relativePath}\`\n`;
    }
    md += '\n';
  }
  
  md += `## Excluded Directories\n\n`;
  for (const dir of EXCLUDED_DIRS) {
    md += `- \`${dir}/\`\n`;
  }
  md += '\n';
  
  md += `## Excluded Files\n\n`;
  for (const file of EXCLUDED_FILES) {
    md += `- \`${file}\`\n`;
  }
  
  return md;
}

main().catch(console.error);
