#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const SCAN_DIRS = ['client/src', 'server', 'shared'];
const IGNORE_PATTERNS = [/node_modules/, /dist/, /\.git/, /_quarantine/, /\.test\./, /\.spec\./];
const OUTPUT_DIR = 'reports/dup-scan';

function hashFile(filePath) {
  try {
    const content = fs.readFileSync(filePath);
    return crypto.createHash('sha256').update(content).digest('hex');
  } catch {
    return null;
  }
}

function walkDir(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (IGNORE_PATTERNS.some(p => p.test(fullPath))) continue;
    
    if (entry.isDirectory()) {
      walkDir(fullPath, files);
    } else if (/\.(jsx?|tsx?|mjs|cjs)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

function extractExports(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const exports = [];
    
    const defaultMatch = content.match(/export\s+default\s+(?:function\s+)?(\w+)/);
    if (defaultMatch) exports.push({ type: 'default', name: defaultMatch[1] });
    
    const namedMatches = content.matchAll(/export\s+(?:const|let|var|function|class)\s+(\w+)/g);
    for (const m of namedMatches) {
      exports.push({ type: 'named', name: m[1] });
    }
    
    return exports;
  } catch {
    return [];
  }
}

function runDupScan() {
  console.log('🔍 Running duplicate file scan...\n');
  
  const allFiles = [];
  for (const dir of SCAN_DIRS) {
    allFiles.push(...walkDir(dir));
  }
  
  const hashMap = new Map();
  const exportMap = new Map();
  const duplicates = { byHash: [], byExport: [] };
  
  for (const file of allFiles) {
    const hash = hashFile(file);
    if (hash) {
      if (!hashMap.has(hash)) hashMap.set(hash, []);
      hashMap.get(hash).push(file);
    }
    
    const exports = extractExports(file);
    for (const exp of exports) {
      const key = `${exp.type}:${exp.name}`;
      if (!exportMap.has(key)) exportMap.set(key, []);
      exportMap.get(key).push(file);
    }
  }
  
  for (const [hash, files] of hashMap) {
    if (files.length > 1) {
      duplicates.byHash.push({
        hash: hash.substring(0, 12),
        files,
        severity: 'HIGH',
        recommendation: 'CONSOLIDATE'
      });
    }
  }
  
  for (const [key, files] of exportMap) {
    if (files.length > 1 && !key.includes('index')) {
      duplicates.byExport.push({
        export: key,
        files,
        severity: files.length > 2 ? 'HIGH' : 'MEDIUM',
        recommendation: 'REVIEW'
      });
    }
  }
  
  const report = {
    timestamp: new Date().toISOString(),
    scannedFiles: allFiles.length,
    duplicates,
    summary: {
      hashDuplicates: duplicates.byHash.length,
      exportDuplicates: duplicates.byExport.length,
      highSeverity: duplicates.byHash.filter(d => d.severity === 'HIGH').length +
                   duplicates.byExport.filter(d => d.severity === 'HIGH').length
    }
  };
  
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUTPUT_DIR, 'latest.json'), JSON.stringify(report, null, 2));
  
  console.log(`📊 Scanned ${allFiles.length} files`);
  console.log(`   Hash duplicates: ${report.summary.hashDuplicates}`);
  console.log(`   Export duplicates: ${report.summary.exportDuplicates}`);
  console.log(`   High severity: ${report.summary.highSeverity}`);
  console.log(`\n📁 Report: ${OUTPUT_DIR}/latest.json`);
  
  return report.summary.highSeverity === 0;
}

const passed = runDupScan();
process.exit(passed ? 0 : 1);
