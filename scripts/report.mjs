#!/usr/bin/env node
/**
 * scripts/report.mjs — Prioritized checklist report
 * Outputs a prioritized list of remaining tasks
 * Human-triggered only
 */

import fs from 'fs';
import { execSync } from 'child_process';

function runCommand(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: 'pipe' });
  } catch (e) {
    return e.stdout || '';
  }
}

function checkExists(path) {
  return fs.existsSync(path);
}

function checkContains(file, pattern) {
  if (!fs.existsSync(file)) return false;
  const content = fs.readFileSync(file, 'utf8');
  return content.includes(pattern);
}

console.log('═══════════════════════════════════════════════════════════════');
console.log('  A→Z 360 PRIORITIZED CHECKLIST');
console.log('═══════════════════════════════════════════════════════════════\n');

const checklist = [];

// PRIORITY 1: App runs
console.log('🔍 Checking Priority 1: App Runs...');
checklist.push({
  priority: 1,
  category: 'App Runs',
  items: [
    { name: 'Server entry exists', done: checkExists('server/index.mjs') },
    { name: 'Client entry exists', done: checkExists('client/src/App.jsx') || checkExists('client/src/App.tsx') },
    { name: 'Port binding configured', done: checkContains('server/index.mjs', '0.0.0.0') }
  ]
});

// PRIORITY 2: Build passes
console.log('🔍 Checking Priority 2: Build...');
const buildResult = runCommand('npm run build 2>&1');
checklist.push({
  priority: 2,
  category: 'Build',
  items: [
    { name: 'Build passes', done: buildResult.includes('built in') }
  ]
});

// PRIORITY 3: Database
console.log('🔍 Checking Priority 3: Database...');
checklist.push({
  priority: 3,
  category: 'Database',
  items: [
    { name: 'Schema file exists', done: checkExists('shared/schema.mjs') },
    { name: 'Drizzle config exists', done: checkExists('drizzle.config.ts') },
    { name: 'Users table defined', done: checkContains('shared/schema.mjs', 'users') },
    { name: 'Journals table defined', done: checkContains('shared/schema.mjs', 'journal') }
  ]
});

// PRIORITY 4: Auth
console.log('🔍 Checking Priority 4: Auth...');
checklist.push({
  priority: 4,
  category: 'Auth',
  items: [
    { name: 'Auth routes exist', done: checkExists('server/routes/auth.mjs') || checkExists('server/routes/account.mjs') },
    { name: 'Login endpoint', done: checkContains('server/routes/auth.mjs', 'login') || checkContains('server/routes/account.mjs', 'login') },
    { name: 'Register endpoint', done: checkContains('server/routes/auth.mjs', 'register') || checkContains('server/routes/account.mjs', 'register') }
  ]
});

// PRIORITY 5: Stripe
console.log('🔍 Checking Priority 5: Billing...');
checklist.push({
  priority: 5,
  category: 'Billing',
  items: [
    { name: 'Stripe routes exist', done: checkExists('server/routes/stripeWebhook.mjs') || checkExists('server/billing/stripeCustomer.mjs') },
    { name: 'Webhook handler', done: checkContains('server/routes/stripeWebhook.mjs', 'webhook') || checkContains('server/index.mjs', 'stripe') }
  ]
});

// PRIORITY 6: AI Safety
console.log('🔍 Checking Priority 6: AI Safety...');
checklist.push({
  priority: 6,
  category: 'AI Safety',
  items: [
    { name: 'AI routes exist', done: checkExists('server/routes/ai.mjs') },
    { name: 'Crisis detection', done: checkContains('server/routes/ai.mjs', 'crisis') || checkContains('server/ai/crisis.mjs', 'crisis') }
  ]
});

// PRIORITY 7: Admin
console.log('🔍 Checking Priority 7: Admin...');
checklist.push({
  priority: 7,
  category: 'Admin',
  items: [
    { name: 'Admin routes exist', done: checkExists('server/routes/admin.mjs') },
    { name: 'Health dashboard', done: checkExists('client/src/pages/admin/HealthDashboard.jsx') }
  ]
});

// PRIORITY 8: Publishing
console.log('🔍 Checking Priority 8: Publishing...');
checklist.push({
  priority: 8,
  category: 'Publishing',
  items: [
    { name: 'Blog pages exist', done: checkExists('client/src/pages/Blog.jsx') || checkExists('client/src/pages/BlogIndex.jsx') },
    { name: 'SEO component', done: checkExists('client/src/components/SEO.tsx') || checkExists('client/src/components/SEO.jsx') },
    { name: 'Sitemap exists', done: checkExists('client/public/sitemap.xml') || checkExists('public/sitemap.xml') }
  ]
});

// PRIORITY 9: CI/CD + Docs
console.log('🔍 Checking Priority 9: CI/CD + Docs...');
checklist.push({
  priority: 9,
  category: 'CI/CD + Docs',
  items: [
    { name: 'GitHub Actions', done: checkExists('.github/workflows/ci.yml') },
    { name: 'README.md', done: checkExists('README.md') },
    { name: 'DISCLAIMER.md', done: checkExists('DISCLAIMER.md') },
    { name: 'PRIVACY.md', done: checkExists('PRIVACY.md') },
    { name: 'SECURITY.md', done: checkExists('SECURITY.md') }
  ]
});

// Output report
console.log('\n═══════════════════════════════════════════════════════════════');
console.log('  PRIORITIZED CHECKLIST REPORT');
console.log('═══════════════════════════════════════════════════════════════\n');

let totalDone = 0;
let totalItems = 0;

checklist.forEach(section => {
  const done = section.items.filter(i => i.done).length;
  const total = section.items.length;
  totalDone += done;
  totalItems += total;
  
  const status = done === total ? '✅' : done > 0 ? '🟡' : '❌';
  console.log(`${status} PRIORITY ${section.priority}: ${section.category} (${done}/${total})`);
  
  section.items.forEach(item => {
    console.log(`   ${item.done ? '✓' : '○'} ${item.name}`);
  });
  console.log('');
});

console.log('═══════════════════════════════════════════════════════════════');
console.log(`  TOTAL: ${totalDone}/${totalItems} items complete (${Math.round(totalDone/totalItems*100)}%)`);
console.log('═══════════════════════════════════════════════════════════════\n');

// Find next action
const incomplete = checklist.find(s => s.items.some(i => !i.done));
if (incomplete) {
  const nextItem = incomplete.items.find(i => !i.done);
  console.log(`⏭️  NEXT ACTION: Priority ${incomplete.priority} — ${incomplete.category}`);
  console.log(`   → ${nextItem.name}\n`);
} else {
  console.log('🎉 ALL ITEMS COMPLETE! Platform is ready.\n');
}

process.exit(totalDone === totalItems ? 0 : 1);
