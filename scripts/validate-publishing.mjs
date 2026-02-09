#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

let passed = true;

function check(label, ok) {
  console.log(ok ? `  ✓ ${label}` : `  ✗ ${label}`);
  if (!ok) passed = false;
}

console.log('── Publishing Registry Validation ──\n');

const regPath = path.join(ROOT, 'content/publishing/publishingRegistry.json');
if (!fs.existsSync(regPath)) {
  check('publishingRegistry.json exists', false);
  console.log('\nPUBLISHING_REGISTRY_VALIDATE: FAIL\n');
  process.exit(1);
}

let registry;
try {
  registry = JSON.parse(fs.readFileSync(regPath, 'utf8'));
  check('JSON valid', true);
} catch (e) {
  check('JSON valid', false);
  console.log('\nPUBLISHING_REGISTRY_VALIDATE: FAIL\n');
  process.exit(1);
}

const ids = registry.map(r => r.id);
const uniqueIds = new Set(ids);
check(`IDs unique (${ids.length} entries, ${uniqueIds.size} unique)`, ids.length === uniqueIds.size);

const blogSlugs = registry.filter(r => r.type === 'blog' && r.slug).map(r => r.slug);
const uniqueSlugs = new Set(blogSlugs);
check(`Blog slugs unique (${blogSlugs.length} slugs, ${uniqueSlugs.size} unique)`, blogSlugs.length === uniqueSlugs.size);

const ALLOWED_CTAS = ['/pricing', '/newsletter', '/blog', '/crisis', '/tools', '/journal', '/reflection', '/about'];
for (const item of registry) {
  if (item.primaryCta) {
    const isAllowed = ALLOWED_CTAS.some(a => item.primaryCta === a || item.primaryCta.startsWith(a + '/'));
    if (!isAllowed) {
      check(`CTA "${item.primaryCta}" for "${item.title}" is valid`, false);
    }
  }
}
check('All primaryCta routes are allowed', passed);

const VALID_STATUSES = ['idea', 'draft', 'review', 'approved', 'published', 'sent'];
for (const item of registry) {
  if (!VALID_STATUSES.includes(item.status)) {
    check(`Status "${item.status}" for "${item.title}" is valid`, false);
  }
}

console.log(`\n══════════════════════════════════════`);
console.log(passed ? 'PUBLISHING_REGISTRY_VALIDATE: PASS' : 'PUBLISHING_REGISTRY_VALIDATE: FAIL');
console.log('══════════════════════════════════════\n');
process.exit(passed ? 0 : 1);
