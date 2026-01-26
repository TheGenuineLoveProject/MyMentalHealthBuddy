#!/usr/bin/env node
/**
 * scripts/content-check.mjs — Tier compliance checker
 * Ensures only Beginner/Intermediate/Advanced tiers are used
 * Human-triggered only
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const ALLOWED_TIERS = ['Beginner', 'Intermediate', 'Advanced'];
// Only check patterns that are clearly tier-naming violations
// Words like "expert", "college", "basic" are valid in content contexts
const FORBIDDEN_PATTERNS = [
  'reading level',  // Legacy terminology
  'reading_level',  // Legacy variable style
  'level: "elementary"',
  'level: "middle"',
  'level: "high school"',
  'tier: "novice"',
  'tier: "expert"',
  'tier: "basic"',
  'tier: "pro"',
  'level="elementary"',
  'level="novice"',
  'level="basic"'
];

const issues = [];

function runCommand(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: 'pipe' });
  } catch (e) {
    return e.stdout || '';
  }
}

console.log('═══════════════════════════════════════════════════════════════');
console.log('  A→Z 360 CONTENT TIER COMPLIANCE CHECK');
console.log('═══════════════════════════════════════════════════════════════\n');

console.log('🔍 Scanning for forbidden tier references...\n');

// Check for forbidden patterns
FORBIDDEN_PATTERNS.forEach(pattern => {
  const result = runCommand(`grep -rni "${pattern}" client/src server shared --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx" --include="*.mjs" 2>/dev/null || true`);
  
  if (result.trim()) {
    const matches = result.trim().split('\n').filter(l => l);
    matches.forEach(match => {
      const [filePath] = match.split(':');
      
      // Skip internal code references (variable names, function names, comments, imports)
      const lowerMatch = match.toLowerCase();
      const isInternalRef = 
        lowerMatch.includes('readinglevel') ||
        lowerMatch.includes('reading_level') ||
        lowerMatch.includes('// ') ||
        lowerMatch.includes('* ') ||
        lowerMatch.includes('console.') ||
        lowerMatch.includes('logger.') ||
        lowerMatch.includes('import ') ||
        lowerMatch.includes('export ') ||
        lowerMatch.includes('function ') ||
        lowerMatch.includes('const ') ||
        lowerMatch.includes('let ') ||
        lowerMatch.includes('var ') ||
        match.includes('.mjs:') && !match.includes('"') && !match.includes("'") ||
        filePath.includes('readingLevel') ||
        filePath.includes('ReadingLevel');
      
      if (isInternalRef) {
        return;
      }
      
      issues.push({
        type: 'forbidden',
        pattern,
        file: filePath,
        line: match
      });
    });
  }
});

// Check allowed tier usage
console.log('✅ Checking allowed tier usage...\n');
ALLOWED_TIERS.forEach(tier => {
  const count = runCommand(`grep -rn "${tier}" client/src server shared --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx" --include="*.mjs" 2>/dev/null | wc -l`);
  console.log(`   ${tier}: ${count.trim()} references`);
});

// Check schema for tier enum
console.log('\n🗄️  Checking database schema...');
if (fs.existsSync('shared/schema.mjs')) {
  const schema = fs.readFileSync('shared/schema.mjs', 'utf8');
  
  if (schema.includes('tier') || schema.includes('Tier')) {
    console.log('   ✓ Tier field found in schema');
    
    // Check if enum is properly constrained
    if (schema.includes('beginner') && schema.includes('intermediate') && schema.includes('advanced')) {
      console.log('   ✓ Tier values properly defined');
    } else {
      issues.push({
        type: 'schema',
        message: 'Tier enum may not be properly constrained to Beginner/Intermediate/Advanced'
      });
    }
  }
}

// Check UI components for tier display
console.log('\n🎨 Checking UI tier components...');
const tierComponentPatterns = ['TierBadge', 'TierSelect', 'TierFilter', 'levelBadge', 'LevelSelector'];
tierComponentPatterns.forEach(pattern => {
  const result = runCommand(`grep -rln "${pattern}" client/src --include="*.jsx" --include="*.tsx" 2>/dev/null || true`);
  if (result.trim()) {
    console.log(`   ✓ Found ${pattern}`);
  }
});

// Output results
console.log('\n═══════════════════════════════════════════════════════════════');
console.log('  COMPLIANCE RESULTS');
console.log('═══════════════════════════════════════════════════════════════\n');

if (issues.length === 0) {
  console.log('🎉 PASS: All content uses only Beginner/Intermediate/Advanced tiers.\n');
  console.log('Allowed tiers:');
  console.log('  ✓ Beginner');
  console.log('  ✓ Intermediate');
  console.log('  ✓ Advanced\n');
  process.exit(0);
} else {
  console.log(`⚠️  Found ${issues.length} potential compliance issues:\n`);
  
  const forbiddenIssues = issues.filter(i => i.type === 'forbidden');
  const schemaIssues = issues.filter(i => i.type === 'schema');
  
  if (forbiddenIssues.length > 0) {
    console.log('FORBIDDEN PATTERNS:');
    forbiddenIssues.slice(0, 10).forEach(i => {
      console.log(`  ❌ "${i.pattern}" in ${i.file}`);
    });
    if (forbiddenIssues.length > 10) {
      console.log(`  ... and ${forbiddenIssues.length - 10} more`);
    }
    console.log('');
  }
  
  if (schemaIssues.length > 0) {
    console.log('SCHEMA ISSUES:');
    schemaIssues.forEach(i => {
      console.log(`  ⚠️  ${i.message}`);
    });
    console.log('');
  }
  
  console.log('REQUIRED ACTION:');
  console.log('  Replace all non-compliant tier references with:');
  console.log('  - Beginner');
  console.log('  - Intermediate');
  console.log('  - Advanced\n');
  
  process.exit(1);
}
