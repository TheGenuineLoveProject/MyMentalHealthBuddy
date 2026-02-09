#!/usr/bin/env node
/**
 * scripts/test-utm.mjs — UTM builder unit test
 */

import { buildUtmUrl, UTM_DEFAULTS } from '../shared/utm.mjs';

let passed = 0;
let failed = 0;

function assert(label, actual, expected) {
  if (actual === expected) {
    console.log(`  ✓ ${label}`);
    passed++;
  } else {
    console.log(`  ✗ ${label}`);
    console.log(`    expected: ${expected}`);
    console.log(`    got:      ${actual}`);
    failed++;
  }
}

console.log('── UTM Builder Tests ──\n');

const t1 = buildUtmUrl('/blog');
assert('Internal path with defaults',
  t1,
  '/blog?utm_source=glp&utm_medium=owned&utm_campaign=publishing'
);

const t2 = buildUtmUrl('https://genuineloveproject.com/pricing', { content: 'hero-cta' });
assert('Absolute URL with content param',
  t2,
  'https://genuineloveproject.com/pricing?utm_source=glp&utm_medium=owned&utm_campaign=publishing&utm_content=hero-cta'
);

const t3 = buildUtmUrl('/newsletter', { source: 'email', medium: 'newsletter', campaign: 'weekly-01' });
assert('Custom source/medium/campaign',
  t3,
  '/newsletter?utm_source=email&utm_medium=newsletter&utm_campaign=weekly-01'
);

const t4 = buildUtmUrl('/blog?tag=reflection', { content: 'sidebar' });
assert('Path with existing query params',
  t4,
  '/blog?tag=reflection&utm_source=glp&utm_medium=owned&utm_campaign=publishing&utm_content=sidebar'
);

const t5 = buildUtmUrl('/pricing');
assert('No PII in default output',
  t5.includes('email') || t5.includes('userId') ? 'contains PII' : 'no PII',
  'no PII'
);

assert('Defaults exist', UTM_DEFAULTS.source, 'glp');

console.log(`\n── Results: ${passed} passed, ${failed} failed ──`);
console.log(failed === 0 ? 'UTM_TEST: PASS' : 'UTM_TEST: FAIL');
process.exit(failed > 0 ? 1 : 0);
