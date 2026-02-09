#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

let passed = true;
let issues = [];

console.log('── SEO Audit ──\n');

const indexPath = path.join(ROOT, 'content/blog/index.json');
if (!fs.existsSync(indexPath)) {
  console.log('  ✗ content/blog/index.json not found');
  passed = false;
} else {
  const posts = JSON.parse(fs.readFileSync(indexPath, 'utf8'));

  for (const post of posts) {
    const missing = [];
    if (!post.title) missing.push('title');
    if (!post.summary) missing.push('summary/description');
    if (!post.slug) missing.push('slug (canonical URL)');

    if (missing.length > 0) {
      console.log(`  ✗ ${post.slug || 'unknown'}: missing ${missing.join(', ')}`);
      issues.push({ slug: post.slug, missing });
    } else {
      console.log(`  ✓ ${post.slug}: title, description, canonical URL present`);
    }
  }

  if (issues.length > 0) {
    passed = false;
  }
}

const postsDir = path.join(ROOT, 'content/blog/posts');
if (fs.existsSync(postsDir)) {
  const mdFiles = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
  for (const file of mdFiles) {
    const content = fs.readFileSync(path.join(postsDir, file), 'utf8');
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (fmMatch) {
      const fm = fmMatch[1];
      if (!fm.includes('title:')) {
        console.log(`  ⚠ ${file}: frontmatter missing title`);
      }
      if (!fm.includes('summary:') && !fm.includes('excerpt:')) {
        console.log(`  ⚠ ${file}: frontmatter missing summary/excerpt`);
      }
    }
  }
}

console.log(`\n══════════════════════════════════════`);
console.log(passed ? 'SEO_AUDIT: PASS' : `SEO_AUDIT: FAIL (${issues.length} post(s) missing meta)`);
console.log('══════════════════════════════════════\n');
process.exit(passed ? 0 : 1);
