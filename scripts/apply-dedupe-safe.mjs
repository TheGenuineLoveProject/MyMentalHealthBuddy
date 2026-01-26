#!/usr/bin/env node
/**
 * apply-dedupe-safe.mjs - Safe deduplication (quarantine only, no deletion)
 * Moves shadow copies to _quarantine/ and creates restore script
 */

import { readFile, writeFile, mkdir, rename, appendFile } from 'fs/promises';
import { existsSync } from 'fs';
import { dirname, join } from 'path';

const SCAN_FILE = 'docs/duplicates/scan-latest.json';
const LOCKS_FILE = 'docs/duplicates/locks.md';
const QUARANTINE_DIR = '_quarantine';

async function ensureDir(dir) {
  await mkdir(dir, { recursive: true });
}

async function main() {
  if (!existsSync(SCAN_FILE)) {
    console.log('⚠️  No scan results found. Run "npm run dup-scan" first.');
    process.exit(0);
  }
  
  const scanData = JSON.parse(await readFile(SCAN_FILE, 'utf-8'));
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const quarantineBase = join(QUARANTINE_DIR, timestamp);
  
  const actions = [];
  const restoreCommands = [];
  
  // Quarantine shadow copies only
  for (const file of scanData.shadowCopies) {
    const srcPath = file.path;
    const destPath = join(quarantineBase, srcPath);
    
    if (existsSync(srcPath)) {
      try {
        await ensureDir(dirname(destPath));
        await rename(srcPath, destPath);
        actions.push({ action: 'quarantine', from: srcPath, to: destPath });
        restoreCommands.push(`mv "${destPath}" "${srcPath}"`);
        console.log(`📦 Quarantined: ${srcPath}`);
      } catch (e) {
        console.log(`⚠️  Could not quarantine: ${srcPath}`);
      }
    }
  }
  
  // Create restore script
  if (restoreCommands.length > 0) {
    const restoreScript = [
      '#!/bin/bash',
      '# Restore quarantined files',
      `# Quarantine timestamp: ${timestamp}`,
      '',
      ...restoreCommands,
      '',
      `echo "Restored ${restoreCommands.length} files"`
    ].join('\n');
    
    await writeFile('scripts/restore-quarantine.sh', restoreScript);
    console.log('\n📜 Restore script created: scripts/restore-quarantine.sh');
  }
  
  // Update locks.md with action log
  if (actions.length > 0) {
    const lockEntry = [
      '',
      `## Quarantine Actions (${timestamp})`,
      '',
      ...actions.map(a => `- \`${a.from}\` → \`${a.to}\``),
      ''
    ].join('\n');
    
    await appendFile(LOCKS_FILE, lockEntry);
  }
  
  console.log(`\n✅ Safe deduplication complete`);
  console.log(`   Quarantined: ${actions.length} files`);
  
  if (actions.length === 0) {
    console.log('   No shadow copies to quarantine.');
  }
}

main().catch(console.error);
