#!/usr/bin/env node
/**
 * Incomplete Pages Scanner
 * 
 * Scans the codebase for:
 * - TODO, FIXME, "coming soon", placeholder lorem ipsum
 * - Empty React components returning null
 * - Routes missing BenefitsBlock, /crisis, or pause/stop language
 * - Missing SafetyFooter imports
 * 
 * Usage: npm run scan:incomplete
 * Output: reports/incomplete-pages.md
 * 
 * NON-DESTRUCTIVE: This script only reads files, never modifies them.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const SCAN_DIRS = ['client/src', 'server'];
const EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx', '.mjs'];

const PATTERNS = {
  todo: /\b(TODO|FIXME|XXX|HACK)\b/gi,
  comingSoon: /\b(coming soon|placeholder|lorem ipsum|lorem\s+ipsum)\b/gi,
  emptyComponent: /return\s+(null|<>\s*<\/>|<React\.Fragment\s*\/>)\s*;?\s*\}/g,
};

const WELLNESS_CHECKS = {
  benefitsBlock: /BenefitsBlock|benefits=\{/,
  crisisLink: /\/crisis|CrisisNotice|SafetyFooter/i,
  consentLanguage: /(pause|stop)\s*(or|and)\s*(stop|pause)\s*anytime|opt[\s-]?out|only\s+do\s+what\s+feels\s+safe/i,
  safetyFooter: /SafetyFooter|PersistentDisclaimer|CrisisNotice/,
};

const WELLNESS_ROUTES = [
  '/tools', '/wisdom', '/wisdom-practices', '/wisdom-synthesis', '/daily-wisdom',
  '/advanced', '/mastery', '/ritual', '/guided-journaling', '/insight-cards',
  '/journal', '/mood', '/check-in', '/tracker', '/wellness',
  '/healing', '/trauma', '/resilience', '/perception', '/self-worth',
  '/alignment', '/values', '/boundaries', '/reflection', '/gratitude',
  '/permaculture', '/philosophy', '/metacognition', '/creativity',
  '/foresight', '/systems', '/collective', '/contemplative', '/ethical',
  '/existential', '/embodiment', '/narrative', '/relational', '/neuro',
  '/socio', '/praxis', '/post-trauma', '/self-mastery', '/spiritual',
  '/relationship', '/cognitive', '/emotional', '/life-purpose', '/mind-body',
  '/social', '/peak-performance', '/personal-growth', '/psychological-safety',
  '/consciousness', '/human-potential', '/life-design', '/holistic'
];

const WELLNESS_PAGE_PATTERNS = [
  /Page\.jsx$/,
  /Tool\.jsx$/,
  /Guide\.jsx$/,
  /Practice\.jsx$/,
  /Wellness/,
  /Healing/,
  /Wisdom/,
  /Mastery/,
  /Reflection/,
  /Journal/,
  /Tracker/,
  /Alignment/,
];

function isWellnessPage(filePath, content) {
  const relativePath = path.relative(rootDir, filePath);
  
  if (!relativePath.includes('/pages/')) {
    return false;
  }
  
  for (const pattern of WELLNESS_PAGE_PATTERNS) {
    if (pattern.test(relativePath)) {
      return true;
    }
  }
  
  for (const route of WELLNESS_ROUTES) {
    const routePattern = new RegExp(`path=["']${route}["']|Route.*${route}`, 'i');
    if (routePattern.test(content)) {
      return true;
    }
  }
  
  const wellnessKeywords = /wellness|healing|trauma|self-care|mindfulness|reflection|journaling|emotional|mental health|crisis/i;
  if (wellnessKeywords.test(content)) {
    return true;
  }
  
  return false;
}

const issues = {
  todos: [],
  comingSoon: [],
  emptyComponents: [],
  missingBenefitsBlock: [],
  missingCrisisLink: [],
  missingConsentLanguage: [],
  missingSafetyFooter: [],
};

function getAllFiles(dir, files = []) {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!['node_modules', '.git', 'dist', 'build', '.next'].includes(entry.name)) {
          getAllFiles(fullPath, files);
        }
      } else if (EXTENSIONS.some(ext => entry.name.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  } catch (err) {
    console.warn(`Could not read directory: ${dir}`);
  }
  return files;
}

function scanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const relativePath = path.relative(rootDir, filePath);
    const lines = content.split('\n');
    const isWellness = isWellnessPage(filePath, content);

    lines.forEach((line, idx) => {
      const lineNum = idx + 1;

      const todoMatch = line.match(PATTERNS.todo);
      if (todoMatch) {
        issues.todos.push({
          file: relativePath,
          line: lineNum,
          match: todoMatch[0],
          context: line.trim().substring(0, 100),
        });
      }

      const comingSoonMatch = line.match(PATTERNS.comingSoon);
      if (comingSoonMatch) {
        issues.comingSoon.push({
          file: relativePath,
          line: lineNum,
          match: comingSoonMatch[0],
          context: line.trim().substring(0, 100),
        });
      }
    });

    const emptyMatch = content.match(PATTERNS.emptyComponent);
    if (emptyMatch) {
      issues.emptyComponents.push({
        file: relativePath,
        count: emptyMatch.length,
      });
    }

    if (isWellness) {
      if (!WELLNESS_CHECKS.benefitsBlock.test(content)) {
        issues.missingBenefitsBlock.push({ file: relativePath });
      }
      if (!WELLNESS_CHECKS.crisisLink.test(content)) {
        issues.missingCrisisLink.push({ file: relativePath });
      }
      if (!WELLNESS_CHECKS.consentLanguage.test(content)) {
        issues.missingConsentLanguage.push({ file: relativePath });
      }
      if (!WELLNESS_CHECKS.safetyFooter.test(content)) {
        issues.missingSafetyFooter.push({ file: relativePath });
      }
    }
  } catch (err) {
    console.warn(`Could not read file: ${filePath}`);
  }
}

function generateReport() {
  const timestamp = new Date().toISOString().split('T')[0];
  let report = `# Incomplete Pages Report\n\n`;
  report += `Generated: ${timestamp}\n\n`;
  report += `---\n\n`;

  const totalIssues = 
    issues.todos.length + 
    issues.comingSoon.length + 
    issues.emptyComponents.length +
    issues.missingBenefitsBlock.length +
    issues.missingCrisisLink.length +
    issues.missingConsentLanguage.length +
    issues.missingSafetyFooter.length;

  report += `## Summary\n\n`;
  report += `| Category | Count |\n`;
  report += `|----------|-------|\n`;
  report += `| TODOs/FIXMEs | ${issues.todos.length} |\n`;
  report += `| Coming Soon/Placeholders | ${issues.comingSoon.length} |\n`;
  report += `| Empty Components | ${issues.emptyComponents.length} |\n`;
  report += `| Missing BenefitsBlock (wellness) | ${issues.missingBenefitsBlock.length} |\n`;
  report += `| Missing Crisis Link (wellness) | ${issues.missingCrisisLink.length} |\n`;
  report += `| Missing Consent Language (wellness) | ${issues.missingConsentLanguage.length} |\n`;
  report += `| Missing SafetyFooter (wellness) | ${issues.missingSafetyFooter.length} |\n`;
  report += `| **Total Issues** | **${totalIssues}** |\n\n`;

  report += `## Detection Criteria\n\n`;
  report += `Wellness pages are detected by:\n`;
  report += `- Location in \`/pages/\` directory\n`;
  report += `- Filename patterns: *Page.jsx, *Tool.jsx, *Guide.jsx, *Practice.jsx\n`;
  report += `- Content keywords: wellness, healing, trauma, self-care, mindfulness, etc.\n`;
  report += `- Route patterns matching known wellness routes\n\n`;

  report += `Consent language must include:\n`;
  report += `- "Pause or stop anytime" OR\n`;
  report += `- "Opt-out" OR\n`;
  report += `- "Only do what feels safe"\n\n`;

  if (issues.todos.length > 0) {
    report += `## TODOs & FIXMEs\n\n`;
    issues.todos.forEach(({ file, line, match, context }) => {
      report += `- **${file}:${line}** - \`${match}\`\n`;
      report += `  \`${context}\`\n`;
    });
    report += `\n`;
  }

  if (issues.comingSoon.length > 0) {
    report += `## Coming Soon / Placeholders\n\n`;
    issues.comingSoon.forEach(({ file, line, match, context }) => {
      report += `- **${file}:${line}** - \`${match}\`\n`;
      report += `  \`${context}\`\n`;
    });
    report += `\n`;
  }

  if (issues.emptyComponents.length > 0) {
    report += `## Empty Components\n\n`;
    issues.emptyComponents.forEach(({ file, count }) => {
      report += `- **${file}** - ${count} instance(s)\n`;
    });
    report += `\n`;
  }

  if (issues.missingBenefitsBlock.length > 0) {
    report += `## Wellness Pages Missing BenefitsBlock\n\n`;
    issues.missingBenefitsBlock.forEach(({ file }) => {
      report += `- ${file}\n`;
    });
    report += `\n`;
  }

  if (issues.missingCrisisLink.length > 0) {
    report += `## Wellness Pages Missing Crisis Link\n\n`;
    issues.missingCrisisLink.forEach(({ file }) => {
      report += `- ${file}\n`;
    });
    report += `\n`;
  }

  if (issues.missingConsentLanguage.length > 0) {
    report += `## Wellness Pages Missing Consent Language\n\n`;
    report += `Required: "Pause or stop anytime", "opt-out", or "only do what feels safe"\n\n`;
    issues.missingConsentLanguage.forEach(({ file }) => {
      report += `- ${file}\n`;
    });
    report += `\n`;
  }

  if (issues.missingSafetyFooter.length > 0) {
    report += `## Wellness Pages Missing SafetyFooter\n\n`;
    issues.missingSafetyFooter.forEach(({ file }) => {
      report += `- ${file}\n`;
    });
    report += `\n`;
  }

  report += `---\n\n`;
  report += `*This report was generated by scripts/scanIncomplete.mjs*\n`;
  report += `*Run \`npm run scan:incomplete\` to regenerate.*\n`;

  return report;
}

function main() {
  console.log('🔍 Scanning for incomplete pages...\n');

  let allFiles = [];
  for (const dir of SCAN_DIRS) {
    const fullDir = path.join(rootDir, dir);
    if (fs.existsSync(fullDir)) {
      allFiles = allFiles.concat(getAllFiles(fullDir));
    }
  }

  console.log(`📁 Found ${allFiles.length} files to scan\n`);

  for (const file of allFiles) {
    scanFile(file);
  }

  const report = generateReport();

  const reportsDir = path.join(rootDir, 'reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const reportPath = path.join(reportsDir, 'incomplete-pages.md');
  fs.writeFileSync(reportPath, report);

  console.log('📊 Results:\n');
  console.log(`   TODOs/FIXMEs: ${issues.todos.length}`);
  console.log(`   Coming Soon/Placeholders: ${issues.comingSoon.length}`);
  console.log(`   Empty Components: ${issues.emptyComponents.length}`);
  console.log(`   Missing BenefitsBlock: ${issues.missingBenefitsBlock.length}`);
  console.log(`   Missing Crisis Link: ${issues.missingCrisisLink.length}`);
  console.log(`   Missing Consent Language: ${issues.missingConsentLanguage.length}`);
  console.log(`   Missing SafetyFooter: ${issues.missingSafetyFooter.length}`);
  console.log(`\n✅ Report saved to: ${reportPath}\n`);
}

main();
