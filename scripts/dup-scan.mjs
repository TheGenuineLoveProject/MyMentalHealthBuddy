#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { walkFiles } from "./_lib_walk.mjs";
import { sha256File } from "./_lib_hash.mjs";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "reports", "dup-scan");
const OUT_JSON = path.join(OUT_DIR, "latest.json");

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function main() {
  ensureDir(OUT_DIR);

  const exts = [".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".json", ".md"];
  const files = walkFiles(ROOT, { exts });

  const byHash = new Map();
  for (const f of files) {
    let h;
    try {
      h = sha256File(f);
    } catch {
      continue;
    }
    if (!byHash.has(h)) byHash.set(h, []);
    byHash.get(h).push(path.relative(ROOT, f));
  }

  const clusters = [];
  for (const [hash, list] of byHash.entries()) {
    if (list.length >= 2) clusters.push({ hash, files: list.sort() });
  }
  clusters.sort((a, b) => b.files.length - a.files.length);

  const high = clusters.filter(c => c.files.length >= 3);
  const medium = clusters.filter(c => c.files.length === 2);

  const report = {
    generatedAt: new Date().toISOString(),
    root: ROOT,
    totals: { scannedFiles: files.length, duplicateClusters: clusters.length },
    severity: {
      high: high.length,
      medium: medium.length,
      low: 0,
    },
    clusters,
  };

  fs.writeFileSync(OUT_JSON, JSON.stringify(report, null, 2));

  console.log("dup-scan:", report.totals);
  if (report.severity.high > 0) {
    console.log("dup-scan: HIGH duplicates found (3+ identical files).");
    process.exitCode = 2;
  } else if (report.severity.medium > 0) {
    console.log("dup-scan: MEDIUM duplicates found (2 identical files).");
    process.exitCode = 1;
  } else {
    console.log("dup-scan: PASS (no identical duplicates).");
  }
}

main();
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
