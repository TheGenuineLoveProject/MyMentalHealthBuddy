#!/usr/bin/env node

import { execSync } from 'child_process';

const RESET = '\x1b[0m';
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const BOLD = '\x1b[1m';

function run(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf-8', timeout: 15000 }).trim();
  } catch {
    return '';
  }
}

function check(label, pass, detail) {
  const icon = pass ? `${GREEN}PASS${RESET}` : `${RED}FAIL${RESET}`;
  console.log(`  [${icon}] ${label}`);
  if (detail) console.log(`         ${YELLOW}${detail}${RESET}`);
  return pass;
}

console.log(`\n${BOLD}${CYAN}Git Commit Signing Verification${RESET}\n`);

let score = 0;
let total = 0;

total++;
const gpgFormat = run('git config --get gpg.format');
score += check(
  'Signing format configured',
  !!gpgFormat,
  gpgFormat ? `Format: ${gpgFormat}` : 'Run: git config --global gpg.format ssh'
) ? 1 : 0;

total++;
const signingKey = run('git config --get user.signingkey');
score += check(
  'Signing key configured',
  !!signingKey,
  signingKey ? `Key: ${signingKey}` : 'Run: git config --global user.signingkey <path-to-key>'
) ? 1 : 0;

total++;
const autoSign = run('git config --get commit.gpgsign');
score += check(
  'Auto-sign commits enabled',
  autoSign === 'true',
  autoSign === 'true' ? 'Enabled' : 'Run: git config --global commit.gpgsign true'
) ? 1 : 0;

total++;
const tagSign = run('git config --get tag.gpgsign');
score += check(
  'Auto-sign tags enabled',
  tagSign === 'true',
  tagSign === 'true' ? 'Enabled' : 'Run: git config --global tag.gpgsign true'
) ? 1 : 0;

total++;
const userName = run('git config --get user.name');
score += check(
  'Git user.name configured',
  !!userName,
  userName ? `Name: ${userName}` : 'Run: git config --global user.name "Your Name"'
) ? 1 : 0;

total++;
const userEmail = run('git config --get user.email');
score += check(
  'Git user.email configured',
  !!userEmail,
  userEmail ? `Email: ${userEmail}` : 'Run: git config --global user.email "you@example.com"'
) ? 1 : 0;

const recentCommits = run('git log --format="%H %G?" -5 2>/dev/null');
if (recentCommits) {
  console.log(`\n${BOLD}Recent Commit Signing Status:${RESET}`);
  const lines = recentCommits.split('\n').filter(Boolean);
  for (const line of lines) {
    const [hash, status] = line.split(' ');
    const short = hash.substring(0, 8);
    const signed = status === 'G' || status === 'U' || status === 'X' || status === 'Y';
    const label = signed ? `${GREEN}Signed${RESET}` : `${YELLOW}Unsigned${RESET}`;
    console.log(`  ${short} ${label} (${status})`);
  }
}

console.log(`\n${BOLD}Score: ${score}/${total}${RESET}`);

if (score === total) {
  console.log(`${GREEN}All checks passed. Future commits will be signed.${RESET}\n`);
} else {
  console.log(`${YELLOW}Some checks need attention. See instructions above.${RESET}`);
  console.log(`${CYAN}Full guide: docs/GIT_GOVERNANCE.md${RESET}\n`);
}

process.exit(score === total ? 0 : 1);
