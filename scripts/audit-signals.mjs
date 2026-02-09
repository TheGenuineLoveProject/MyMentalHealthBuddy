#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

let passed = true;
let checks = [];

function check(label, condition) {
  if (condition) {
    console.log(`  ✓ ${label}`);
    checks.push({ label, ok: true });
  } else {
    console.log(`  ✗ ${label}`);
    checks.push({ label, ok: false });
    passed = false;
  }
}

console.log('── Signals Audit ──\n');

check('shared/utm.mjs exists', fs.existsSync(path.join(ROOT, 'shared/utm.mjs')));

const analyticsRoute = path.join(ROOT, 'server/routes/analytics.mjs');
if (fs.existsSync(analyticsRoute)) {
  const content = fs.readFileSync(analyticsRoute, 'utf8');
  check('/api/analytics/event endpoint exists', content.includes('router.post') && content.includes('/event'));
  check('Publishing events in allowlist', content.includes('blog_view') && content.includes('newsletter_signup_submit'));
  check('Rate limiting or validation present', content.includes('SAFE_EVENT_TYPES') || content.includes('rateLimit'));

  const forbidden = ['user_agent', 'fingerprint', 'ip_address', 'raw_ip'];
  const hasForbidden = forbidden.some(f => content.toLowerCase().includes(f));
  check('No forbidden tracking fields in analytics', !hasForbidden);
} else {
  check('Analytics route file exists', false);
}

check('Client trackSignalEvent helper exists',
  fs.existsSync(path.join(ROOT, 'client/src/utils/trackSignalEvent.js')) ||
  fs.existsSync(path.join(ROOT, 'client/src/utils/trackSignalEvent.ts'))
);

check('Admin publishing page exists',
  fs.existsSync(path.join(ROOT, 'client/src/pages/admin/AdminPublishing.jsx')) ||
  fs.existsSync(path.join(ROOT, 'client/src/pages/admin/AdminPublishing.tsx'))
);

check('Weekly report script exists',
  fs.existsSync(path.join(ROOT, 'scripts/publishing-weekly-report.mjs'))
);

check('UTM test script exists',
  fs.existsSync(path.join(ROOT, 'scripts/test-utm.mjs'))
);

console.log(`\n══════════════════════════════════════`);
console.log(passed ? 'SIGNALS_AUDIT: PASS' : `SIGNALS_AUDIT: FAIL`);
console.log('══════════════════════════════════════\n');
process.exit(passed ? 0 : 1);
