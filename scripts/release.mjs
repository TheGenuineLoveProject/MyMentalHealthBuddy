#!/usr/bin/env node
/**
 * scripts/release.mjs — Release management helper
 * Creates CHANGELOG entry + tag note locally (human-triggered)
 * Does NOT push or deploy automatically
 */

import fs from 'fs';
import { execSync } from 'child_process';

const args = process.argv.slice(2);
const version = args[0];

if (!version) {
  console.log('Usage: node scripts/release.mjs <version>');
  console.log('Example: node scripts/release.mjs 1.2.0');
  process.exit(1);
}

const versionRegex = /^\d+\.\d+\.\d+$/;
if (!versionRegex.test(version)) {
  console.error('Error: Version must be in semver format (e.g., 1.2.0)');
  process.exit(1);
}

console.log('═══════════════════════════════════════════════════════════════');
console.log(`  A→Z 360 RELEASE HELPER — v${version}`);
console.log('═══════════════════════════════════════════════════════════════\n');

const date = new Date().toISOString().split('T')[0];

// Get recent commits for changelog
let recentCommits = '';
try {
  recentCommits = execSync('git log --oneline -10', { encoding: 'utf8' });
} catch (e) {
  recentCommits = 'Unable to fetch git history';
}

// Create changelog entry
const changelogEntry = `
## [${version}] - ${date}

### Added
- [Document new features here]

### Changed
- [Document changes here]

### Fixed
- [Document bug fixes here]

### Recent Commits
\`\`\`
${recentCommits.trim()}
\`\`\`
`;

// Check if CHANGELOG.md exists
const changelogPath = 'CHANGELOG.md';
let changelogContent = '';

if (fs.existsSync(changelogPath)) {
  changelogContent = fs.readFileSync(changelogPath, 'utf8');
  
  // Insert new entry after the header
  const headerEnd = changelogContent.indexOf('\n## ');
  if (headerEnd > 0) {
    changelogContent = 
      changelogContent.slice(0, headerEnd) + 
      changelogEntry + 
      changelogContent.slice(headerEnd);
  } else {
    changelogContent += changelogEntry;
  }
} else {
  changelogContent = `# Changelog

All notable changes to The Genuine Love Project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
${changelogEntry}`;
}

fs.writeFileSync(changelogPath, changelogContent);
console.log(`✅ Updated ${changelogPath}`);

// Create release notes file
const releaseNotesPath = `docs/releases/v${version}.md`;
const releaseNotesDir = 'docs/releases';

if (!fs.existsSync(releaseNotesDir)) {
  fs.mkdirSync(releaseNotesDir, { recursive: true });
}

const releaseNotes = `# Release v${version}

**Date:** ${date}

## Overview
[Brief description of this release]

## What's New
- [Feature 1]
- [Feature 2]

## Bug Fixes
- [Fix 1]
- [Fix 2]

## Breaking Changes
- None

## Migration Guide
No migration required.

## Verification
\`\`\`bash
node scripts/verify.mjs
\`\`\`

## Deployment Notes
- Ensure all environment variables are configured
- Run \`npm run db:push\` if schema changes exist
- Restart the application after deployment

---
*The Genuine Love Project - Live in Genuine Love*
`;

fs.writeFileSync(releaseNotesPath, releaseNotes);
console.log(`✅ Created ${releaseNotesPath}`);

// Create git tag command (but don't execute)
console.log('\n📋 To complete the release, run:');
console.log(`   git add CHANGELOG.md ${releaseNotesPath}`);
console.log(`   git commit -m "Release v${version}"`);
console.log(`   git tag -a v${version} -m "Release v${version}"`);
console.log('   git push origin main --tags');

console.log('\n═══════════════════════════════════════════════════════════════');
console.log('  Release preparation complete. Review and push manually.');
console.log('═══════════════════════════════════════════════════════════════\n');
