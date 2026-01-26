#!/usr/bin/env node
/**
 * plan-patches.mjs
 * Reads scan results and outputs a patch plan to console
 * Does NOT edit files - dry-run only
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCAN_RESULTS_PATH = join(__dirname, '.scan-results.json');

function loadScanResults() {
  if (!existsSync(SCAN_RESULTS_PATH)) {
    console.error('❌ Scan results not found at:', SCAN_RESULTS_PATH);
    console.log('Run npm run scan:platform first to generate scan results.');
    process.exit(1);
  }
  
  try {
    const content = readFileSync(SCAN_RESULTS_PATH, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('❌ Failed to parse scan results:', error.message);
    process.exit(1);
  }
}

function generatePatchPlan(scanResults) {
  const plan = {
    timestamp: new Date().toISOString(),
    dryRun: true,
    summary: {
      totalPatches: 0,
      byCategory: {
        seo: 0,
        safety: 0,
        benefits: 0,
        language: 0
      }
    },
    patches: []
  };

  const { issuesByType = {} } = scanResults.summary || {};

  if (issuesByType['missing-seo']?.length > 0) {
    for (const file of issuesByType['missing-seo']) {
      plan.patches.push({
        file,
        category: 'seo',
        actions: [
          'Import PageScaffold from @/components/layout/PageScaffold',
          'Wrap page content with PageScaffold',
          'Add routeKey prop matching route path'
        ]
      });
      plan.summary.byCategory.seo++;
      plan.summary.totalPatches++;
    }
  }

  if (issuesByType['missing-safety']?.length > 0) {
    for (const file of issuesByType['missing-safety']) {
      plan.patches.push({
        file,
        category: 'safety',
        actions: [
          'Import SafetyFooter from @/components/safety/SafetyFooter',
          'Add SafetyFooter at end of page',
          'Verify crisis link is accessible'
        ]
      });
      plan.summary.byCategory.safety++;
      plan.summary.totalPatches++;
    }
  }

  if (issuesByType['missing-benefits']?.length > 0) {
    for (const file of issuesByType['missing-benefits']) {
      plan.patches.push({
        file,
        category: 'benefits',
        actions: [
          'Import BenefitsBlock from @/components/marketing/BenefitsBlock',
          'Import getBenefitsForRoute from @/content/benefits/benefitsBank',
          'Add BenefitsBlock with route-specific benefits'
        ]
      });
      plan.summary.byCategory.benefits++;
      plan.summary.totalPatches++;
    }
  }

  if (issuesByType['contains-disallowed']?.length > 0) {
    for (const file of issuesByType['contains-disallowed']) {
      plan.patches.push({
        file,
        category: 'language',
        actions: [
          'Review file for forbidden terms',
          'Replace with safe language alternatives',
          'Verify educational framing'
        ]
      });
      plan.summary.byCategory.language++;
      plan.summary.totalPatches++;
    }
  }

  return plan;
}

function printPatchPlan(plan) {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║           PATCH PLAN (DRY RUN - NO FILES MODIFIED)         ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');
  
  console.log(`📅 Generated: ${plan.timestamp}`);
  console.log(`📊 Total patches needed: ${plan.summary.totalPatches}\n`);
  
  if (plan.summary.totalPatches === 0) {
    console.log('✅ No patches needed! All files are compliant.\n');
    return;
  }

  console.log('By Category:');
  console.log(`  • SEO:      ${plan.summary.byCategory.seo} files`);
  console.log(`  • Safety:   ${plan.summary.byCategory.safety} files`);
  console.log(`  • Benefits: ${plan.summary.byCategory.benefits} files`);
  console.log(`  • Language: ${plan.summary.byCategory.language} files`);
  console.log('');

  console.log('────────────────────────────────────────────────────────────');
  console.log('PROPOSED PATCHES:\n');

  for (const patch of plan.patches) {
    console.log(`📁 ${patch.file}`);
    console.log(`   Category: ${patch.category}`);
    console.log('   Actions:');
    for (const action of patch.actions) {
      console.log(`     → ${action}`);
    }
    console.log('');
  }

  console.log('────────────────────────────────────────────────────────────');
  console.log('⚠️  This is a DRY RUN. No files have been modified.');
  console.log('    Review the plan above and apply patches manually.\n');
}

function main() {
  console.log('\n🔍 Loading scan results...');
  const scanResults = loadScanResults();
  
  console.log('📋 Generating patch plan...');
  const plan = generatePatchPlan(scanResults);
  
  printPatchPlan(plan);
  
  console.log('JSON output:');
  console.log(JSON.stringify(plan, null, 2));
}

main();
