#!/usr/bin/env bash
# MMHB only. Reads known source files and reports configuration classifications.
# No application imports, account lookups, network requests, sends or changes.
env -u NODE_OPTIONS -u NODE_PATH node --no-global-search-paths --input-type=module <<'MMHB_RECOVERY_EMAIL_CHECK'
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = fs.realpathSync('.');
const say = value => console.log(JSON.stringify(value));
const stop = code => { throw Object.assign(new Error(), { code }); };
const limits = {
  sourceFilesChanged: 0, databaseConnections: 0, accountRowsRead: 0,
  networkRequests: 0, emailsSent: 0, deploymentRuns: 0,
  productionEnvironmentVerified: false, accountExistenceVerified: false,
  providerKeyValidityVerified: false, senderDomainVerified: false,
  emailDeliveryVerified: false,
};
const read = name => {
  const full = path.join(root, name);
  const stat = fs.lstatSync(full);
  if (!stat.isFile() || fs.realpathSync(full) !== full || stat.size > 2097152)
    stop('SOURCE_FILE_NEEDS_REVIEW');
  return fs.readFileSync(full);
};
const expected = {
  'server/utils/email.mjs': '9a787e04026ec9225fca35420546d744fc78874958739eab76a0c9754fef7113',
  'server/routes/account.mjs': '65400980480646560bdfa2cea8a09ac9c02a383bde302647e15dd0becf778b97',
};

function classifySender(raw) {
  if (!raw) return 'MISSING';
  if (raw !== raw.trim() || /[\r\n]/.test(raw)) return 'FORMAT_NEEDS_REVIEW';
  const mailbox = (raw.match(/^[^<>]*<([^<>]+)>$/)?.[1] || raw).trim();
  if (!/^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(mailbox)) return 'FORMAT_NEEDS_REVIEW';
  const domain = mailbox.split('@')[1].toLowerCase();
  if (/(^|\.)(example\.(com|net|org)|invalid|test|localhost)$/.test(domain))
    return 'PLACEHOLDER';
  if (domain === 'resend.dev') return 'RESEND_TEST_DOMAIN';
  return 'CONFIGURED_NOT_VERIFIED';
}

function classifyBaseUrl(raw) {
  if (!raw) return 'MISSING';
  if (raw !== raw.trim()) return 'FORMAT_NEEDS_REVIEW';
  try {
    const url = new URL(raw);
    if (url.username || url.password || url.search || url.hash || url.pathname !== '/' || url.port)
      return 'FORMAT_NEEDS_REVIEW';
    if (url.protocol !== 'https:') return 'HTTPS_REQUIRED';
    return ['mymentalhealthbuddy.com', 'www.mymentalhealthbuddy.com'].includes(url.hostname)
      ? 'MMHB_HTTPS_ORIGIN' : 'OTHER_ORIGIN';
  } catch { return 'FORMAT_NEEDS_REVIEW'; }
}

try {
  if (JSON.parse(read('package.json')).name !== 'mymentalhealthbuddy') stop('WRONG_PROJECT');
  const sources = Object.entries(expected).map(([file, reviewedSha256]) => {
    const bytes = read(file);
    const sha256 = crypto.createHash('sha256').update(bytes).digest('hex');
    return { file, sha256, matchesReviewedCopy: sha256 === reviewedSha256 };
  });
  const env = process.env;
  const names = ['RESEND_API_KEY', 'RESEND_FROM_EMAIL', 'PUBLIC_APP_URL', 'APP_PUBLIC_URL',
    'FRONTEND_URL', 'REPLIT_DOMAINS', 'REPLIT_CONNECTORS_HOSTNAME', 'REPL_IDENTITY', 'WEB_REPL_RENEWAL'];
  const environmentPresent = Object.fromEntries(names.map(name => [name, Boolean(env[name]?.trim())]));
  const originNames = ['PUBLIC_APP_URL', 'APP_PUBLIC_URL', 'FRONTEND_URL'];
  const baseUrlSource = originNames.find(name => Boolean(env[name])) ||
    (env.REPLIT_DOMAINS ? 'REPLIT_DOMAINS' : 'REVIEWED_FALLBACK');
  // Preview only: use of this exact precedence by current source is confirmed
  // only when the account route matches the reviewed fingerprint above.
  const baseUrl = baseUrlSource === 'REVIEWED_FALLBACK' ? 'https://www.genuineloveproject.com'
    : baseUrlSource === 'REPLIT_DOMAINS' ? 'https://' + env.REPLIT_DOMAINS.split(',')[0]
    : env[baseUrlSource];
  say({ status: 'RECOVERY_EMAIL_CONFIG_REPORTED', context: 'workspace_process_environment',
    environmentPresent,
    apiKeyHasOuterWhitespace: Boolean(env.RESEND_API_KEY && env.RESEND_API_KEY !== env.RESEND_API_KEY.trim()),
    sender: classifySender(env.RESEND_FROM_EMAIL),
    resetLinkPreviewUnderReviewedPrecedence: {
      source: baseUrlSource, classification: classifyBaseUrl(baseUrl),
      currentSourceMatchesReviewedPrecedence: sources[1].matchesReviewedCopy,
    },
    sources, ...limits });
} catch (err) {
  const reason = /^[A-Z0-9_]{2,64}$/.test(err?.code || '') ? err.code : 'CHECK_FAILED';
  say({ status: 'STOP', reason, ...limits });
  process.exitCode = 1;
}
MMHB_RECOVERY_EMAIL_CHECK
