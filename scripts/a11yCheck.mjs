#!/usr/bin/env node
/**
 * Accessibility Smoke Check (P165)
 * Basic DOM checks for accessibility compliance
 * 
 * Usage: npm run a11y:check
 */

import fs from 'fs';
import path from 'path';

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
};

const PASS = `${COLORS.green}✓${COLORS.reset}`;
const FAIL = `${COLORS.red}✗${COLORS.reset}`;
const WARN = `${COLORS.yellow}!${COLORS.reset}`;

let passCount = 0;
let warnCount = 0;
let failCount = 0;

function log(icon, message, detail = '') {
  console.log(`  ${icon} ${message}${detail ? ` - ${detail}` : ''}`);
}

function scanFile(filePath, content) {
  const issues = [];
  
  const imgMatches = content.match(/<img[^>]*>/gi) || [];
  for (const img of imgMatches) {
    if (!img.includes('alt=')) {
      issues.push({ type: 'error', msg: 'Image missing alt attribute', file: filePath });
    }
  }
  
  const buttonMatches = content.match(/<button[^>]*>[\s\S]*?<\/button>/gi) || [];
  for (const btn of buttonMatches) {
    if (!btn.includes('aria-label') && btn.match(/<button[^>]*>\s*<[^/]/)) {
      if (!btn.includes('>') || btn.replace(/<[^>]*>/g, '').trim().length === 0) {
        issues.push({ type: 'warn', msg: 'Button may need aria-label (icon-only)', file: filePath });
      }
    }
  }
  
  if (content.includes('onClick') && content.includes('<div') && !content.includes('role=')) {
    issues.push({ type: 'warn', msg: 'Clickable div may need role="button"', file: filePath });
  }
  
  if (content.includes('focus-visible') || content.includes('focus:ring')) {
    passCount++;
  }
  
  return issues;
}

function scanDirectory(dir) {
  const issues = [];
  
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory() && !entry.name.includes('node_modules')) {
        issues.push(...scanDirectory(fullPath));
      } else if (entry.name.endsWith('.jsx') || entry.name.endsWith('.tsx')) {
        try {
          const content = fs.readFileSync(fullPath, 'utf-8');
          issues.push(...scanFile(fullPath, content));
        } catch (e) {
          // Skip unreadable files
        }
      }
    }
  } catch (e) {
    // Skip unreadable directories
  }
  
  return issues;
}

function checkTokens() {
  const tokensPath = 'client/src/styles/tokens.css';
  if (fs.existsSync(tokensPath)) {
    const content = fs.readFileSync(tokensPath, 'utf-8');
    
    if (content.includes('focus-visible') || content.includes('focus:ring')) {
      log(PASS, 'Focus ring styles defined in tokens');
      passCount++;
    } else {
      log(WARN, 'Focus ring styles may need to be added to tokens');
      warnCount++;
    }
    
    if (content.includes('prefers-reduced-motion')) {
      log(PASS, 'Reduced motion support in tokens');
      passCount++;
    } else {
      log(WARN, 'Consider adding prefers-reduced-motion support');
      warnCount++;
    }
  }
}

function checkSkipLink() {
  const skipLinkPath = 'client/src/components/SkipToContent.jsx';
  if (fs.existsSync(skipLinkPath)) {
    log(PASS, 'Skip to content link exists');
    passCount++;
  } else {
    log(WARN, 'Skip to content link not found');
    warnCount++;
  }
}

async function main() {
  console.log('\n♿ Accessibility Smoke Check');
  console.log('─'.repeat(50));
  
  console.log('\n📋 Component checks:');
  checkSkipLink();
  checkTokens();
  
  console.log('\n📋 Scanning components for issues:');
  const issues = scanDirectory('client/src');
  
  const errors = issues.filter(i => i.type === 'error');
  const warnings = issues.filter(i => i.type === 'warn');
  
  if (errors.length > 0) {
    log(FAIL, `${errors.length} accessibility errors found`);
    errors.slice(0, 5).forEach(e => console.log(`     - ${e.msg} in ${e.file}`));
    failCount += errors.length;
  } else {
    log(PASS, 'No critical accessibility errors');
    passCount++;
  }
  
  if (warnings.length > 0) {
    log(WARN, `${warnings.length} accessibility warnings`);
    warnCount += warnings.length;
  }
  
  console.log('\n' + '─'.repeat(50));
  console.log(`\n📊 Accessibility Summary`);
  console.log(`  ${PASS} Passed: ${passCount}`);
  console.log(`  ${WARN} Warnings: ${warnCount}`);
  console.log(`  ${FAIL} Errors: ${failCount}`);
  
  if (failCount === 0) {
    console.log(`\n${COLORS.green}✅ Accessibility smoke check passed!${COLORS.reset}\n`);
    process.exit(0);
  } else {
    console.log(`\n${COLORS.red}❌ ${failCount} accessibility error(s)${COLORS.reset}\n`);
    process.exit(1);
  }
}

main().catch(console.error);
