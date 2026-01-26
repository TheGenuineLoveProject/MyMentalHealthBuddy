#!/usr/bin/env node
/**
 * dedupe-plan.mjs - Generate deduplication plan from scan results
 * Does NOT modify code - only creates a plan in decisions.md
 */

import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { basename, dirname } from 'path';

const SCAN_FILE = 'docs/duplicates/scan-latest.json';
const DECISIONS_FILE = 'docs/duplicates/decisions.md';

async function main() {
  if (!existsSync(SCAN_FILE)) {
    console.log('⚠️  No scan results found. Run "npm run dup-scan" first.');
    process.exit(0);
  }
  
  const scanData = JSON.parse(await readFile(SCAN_FILE, 'utf-8'));
  
  const decisions = [
    '# Duplicate Decisions',
    '',
    `> Generated from scan: ${scanData.timestamp}`,
    '',
    '## Format',
    '',
    '```',
    '## Group: <identifier>',
    '- **Keep**: <path>',
    '- **Duplicates**: <paths>',
    '- **Action**: KEEP | REDIRECT | QUARANTINE',
    '- **Import redirects**: <list>',
    '- **Notes**: <reason>',
    '```',
    '',
    '---',
    '',
    '## Proposed Decisions',
    ''
  ];
  
  let groupId = 1;
  
  // Process exact duplicates
  for (const group of scanData.exactDuplicates) {
    const files = group.files.sort((a, b) => {
      // Prefer files in src over backup dirs
      const aInSrc = a.path.includes('src/') || a.path.includes('client/') || a.path.includes('server/');
      const bInSrc = b.path.includes('src/') || b.path.includes('client/') || b.path.includes('server/');
      if (aInSrc && !bInSrc) return -1;
      if (!aInSrc && bInSrc) return 1;
      // Prefer shorter paths
      return a.path.length - b.path.length;
    });
    
    const keeper = files[0];
    const duplicates = files.slice(1);
    
    decisions.push(
      `### Group ${groupId}: Exact Duplicate`,
      `- **Keep**: \`${keeper.path}\``,
      `- **Duplicates**: ${duplicates.map(f => `\`${f.path}\``).join(', ')}`,
      `- **Action**: QUARANTINE`,
      `- **Import redirects**: Update imports from duplicates to keeper`,
      `- **Risk**: ${group.maxRisk}`,
      ''
    );
    groupId++;
  }
  
  // Process shadow copies
  if (scanData.shadowCopies.length > 0) {
    decisions.push(
      '## Shadow Copies (Auto-Quarantine)',
      '',
      'The following files are in backup/old/copy directories and should be quarantined:',
      ''
    );
    
    for (const file of scanData.shadowCopies) {
      decisions.push(`- \`${file.path}\` (Risk: ${file.riskScore})`);
    }
    decisions.push('');
  }
  
  decisions.push(
    '---',
    '',
    '_Run "npm run dedupe-safe" to apply quarantine actions._',
    '',
    `_Last updated: ${new Date().toISOString()}_`
  );
  
  await mkdir('docs/duplicates', { recursive: true });
  await writeFile(DECISIONS_FILE, decisions.join('\n'));
  
  console.log('✅ Deduplication plan generated');
  console.log(`   Exact duplicate groups: ${scanData.exactDuplicates.length}`);
  console.log(`   Shadow copies: ${scanData.shadowCopies.length}`);
  console.log(`\n📄 Review: ${DECISIONS_FILE}`);
}

main().catch(console.error);
