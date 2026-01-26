#!/usr/bin/env node
/**
 * scan-duplicates.mjs - Deep duplicate file scanner
 * Detects exact duplicates, near-duplicates, and shadow copies
 */

import { createHash } from 'crypto';
import { readdir, readFile, stat, writeFile, mkdir } from 'fs/promises';
import { join, basename, extname, relative } from 'path';
import { existsSync } from 'fs';

const SCAN_DIRS = ['client', 'server', 'shared', 'scripts'];
const EXTENSIONS = ['.js', '.ts', '.tsx', '.jsx', '.mjs', '.json', '.md', '.css'];
const IGNORE_DIRS = ['node_modules', 'dist', 'build', '.git', '.next', 'coverage'];
const SHADOW_DIRS = ['backup', 'old', 'copy', 'tmp', '_backup', '_old', '_copy'];
const HIGH_RISK_NAMES = ['index.ts', 'index.tsx', 'index.js', 'App.tsx', 'App.jsx', 'routes.ts', 'schema.ts', 'schema.mjs'];
const CRITICAL_DIRS = ['auth', 'stripe', 'openai', 'db', 'billing', 'ai'];

const results = {
  scannedFiles: 0,
  exactDuplicates: [],
  nearDuplicates: [],
  nameDuplicates: [],
  shadowCopies: [],
  riskyDirs: [],
  timestamp: new Date().toISOString()
};

function sha256(content) {
  return createHash('sha256').update(content).digest('hex');
}

function normalizeContent(content) {
  return content
    .replace(/\r\n/g, '\n')
    .replace(/\s+/g, ' ')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*/g, '')
    .trim();
}

function calculateRiskScore(filePath) {
  let score = 0;
  const path = filePath.toLowerCase();
  const name = basename(filePath);
  
  if (path.includes('src/') || path.includes('client/') || path.includes('server/')) score += 5;
  if (HIGH_RISK_NAMES.includes(name)) score += 4;
  if (CRITICAL_DIRS.some(d => path.includes(`/${d}/`))) score += 3;
  if (SHADOW_DIRS.some(d => path.includes(`/${d}/`))) score += 2;
  if (path.includes('dist/') || path.includes('build/') || path.includes('node_modules/')) score -= 3;
  
  return Math.max(0, score);
}

async function* walkDir(dir) {
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (IGNORE_DIRS.includes(entry.name)) continue;
      
      if (entry.isDirectory()) {
        if (SHADOW_DIRS.some(s => entry.name.toLowerCase().includes(s))) {
          results.riskyDirs.push(fullPath);
        }
        yield* walkDir(fullPath);
      } else if (entry.isFile() && EXTENSIONS.includes(extname(entry.name))) {
        yield fullPath;
      }
    }
  } catch (e) {
    // Skip inaccessible directories
  }
}

async function scanFiles() {
  const fileHashes = new Map();
  const fileNames = new Map();
  
  for (const scanDir of SCAN_DIRS) {
    if (!existsSync(scanDir)) continue;
    
    for await (const filePath of walkDir(scanDir)) {
      try {
        const content = await readFile(filePath, 'utf-8');
        const normalizedHash = sha256(normalizeContent(content));
        const rawHash = sha256(content);
        const fileName = basename(filePath);
        const riskScore = calculateRiskScore(filePath);
        
        results.scannedFiles++;
        
        const fileInfo = { path: filePath, normalizedHash, rawHash, riskScore };
        
        // Check for exact duplicates
        if (fileHashes.has(rawHash)) {
          const existing = fileHashes.get(rawHash);
          const group = results.exactDuplicates.find(g => g.hash === rawHash);
          if (group) {
            group.files.push(fileInfo);
          } else {
            results.exactDuplicates.push({
              hash: rawHash,
              files: [existing, fileInfo],
              maxRisk: Math.max(existing.riskScore, riskScore)
            });
          }
        } else {
          fileHashes.set(rawHash, fileInfo);
        }
        
        // Check for name duplicates
        if (fileNames.has(fileName)) {
          const existing = fileNames.get(fileName);
          if (!Array.isArray(existing)) {
            fileNames.set(fileName, [existing, fileInfo]);
          } else {
            existing.push(fileInfo);
          }
        } else {
          fileNames.set(fileName, fileInfo);
        }
        
        // Check for shadow copies
        if (SHADOW_DIRS.some(s => filePath.toLowerCase().includes(`/${s}/`))) {
          results.shadowCopies.push(fileInfo);
        }
      } catch (e) {
        // Skip unreadable files
      }
    }
  }
  
  // Process name duplicates
  for (const [name, files] of fileNames) {
    if (Array.isArray(files) && files.length > 1) {
      results.nameDuplicates.push({
        name,
        files,
        maxRisk: Math.max(...files.map(f => f.riskScore))
      });
    }
  }
  
  // Sort by risk
  results.exactDuplicates.sort((a, b) => b.maxRisk - a.maxRisk);
  results.nameDuplicates.sort((a, b) => b.maxRisk - a.maxRisk);
}

function generateMarkdown() {
  const lines = [
    '# Duplicate Scan Report',
    '',
    `**Scanned**: ${results.scannedFiles} files`,
    `**Timestamp**: ${results.timestamp}`,
    '',
    '## Summary',
    '',
    '| Type | Count |',
    '|------|-------|',
    `| Exact Duplicates | ${results.exactDuplicates.length} groups |`,
    `| Name Duplicates | ${results.nameDuplicates.length} groups |`,
    `| Shadow Copies | ${results.shadowCopies.length} files |`,
    `| Risky Directories | ${results.riskyDirs.length} |`,
    ''
  ];
  
  if (results.exactDuplicates.length > 0) {
    lines.push('## Exact Duplicates (Top 10)', '');
    for (const group of results.exactDuplicates.slice(0, 10)) {
      lines.push(`### Risk: ${group.maxRisk}`, '');
      for (const file of group.files) {
        lines.push(`- \`${file.path}\``);
      }
      lines.push('');
    }
  }
  
  if (results.nameDuplicates.length > 0) {
    lines.push('## Name Duplicates (Top 10)', '');
    for (const group of results.nameDuplicates.slice(0, 10)) {
      lines.push(`### ${group.name} (Risk: ${group.maxRisk})`, '');
      for (const file of group.files) {
        lines.push(`- \`${file.path}\``);
      }
      lines.push('');
    }
  }
  
  if (results.shadowCopies.length > 0) {
    lines.push('## Shadow Copies', '');
    for (const file of results.shadowCopies.slice(0, 10)) {
      lines.push(`- \`${file.path}\` (Risk: ${file.riskScore})`);
    }
    lines.push('');
  }
  
  if (results.riskyDirs.length > 0) {
    lines.push('## Risky Directories', '');
    for (const dir of results.riskyDirs) {
      lines.push(`- \`${dir}\``);
    }
    lines.push('');
  }
  
  lines.push('---', '', '_Generated by scan-duplicates.mjs_');
  
  return lines.join('\n');
}

async function main() {
  console.log('🔍 Scanning for duplicates...');
  
  await scanFiles();
  
  await mkdir('docs/duplicates', { recursive: true });
  
  const markdown = generateMarkdown();
  await writeFile('docs/duplicates/scan-latest.md', markdown);
  await writeFile('docs/duplicates/scan-latest.json', JSON.stringify(results, null, 2));
  
  console.log(`✅ Scan complete: ${results.scannedFiles} files`);
  console.log(`   Exact duplicates: ${results.exactDuplicates.length} groups`);
  console.log(`   Name duplicates: ${results.nameDuplicates.length} groups`);
  console.log(`   Shadow copies: ${results.shadowCopies.length} files`);
  
  if (results.exactDuplicates.length > 0 || results.shadowCopies.length > 0) {
    console.log('\n⚠️  Run "npm run dedupe-plan" to generate cleanup plan');
  }
}

main().catch(console.error);
