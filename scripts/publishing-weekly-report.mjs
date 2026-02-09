#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

console.log('── Publishing Weekly Report ──\n');

const calPath = path.join(ROOT, 'content/publishing/calendar/editorial_calendar.json');
const draftsPath = path.join(ROOT, 'content/publishing/newsletter/drafts.json');
const signalsPath = path.join(ROOT, 'logs/signals.jsonl');

const calendar = fs.existsSync(calPath) ? JSON.parse(fs.readFileSync(calPath, 'utf8')) : [];
const drafts = fs.existsSync(draftsPath) ? JSON.parse(fs.readFileSync(draftsPath, 'utf8')) : [];

let events = [];
if (fs.existsSync(signalsPath)) {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const lines = fs.readFileSync(signalsPath, 'utf8').trim().split('\n').filter(Boolean);
  for (const line of lines) {
    try {
      const ev = JSON.parse(line);
      if (ev.ts >= sevenDaysAgo) events.push(ev);
    } catch {}
  }
}

console.log('  Calendar entries:', calendar.length);
console.log('  Newsletter drafts:', drafts.length);
console.log('  Signal events (7d):', events.length);

const pillarCounts = {};
for (const ev of events) {
  if (ev.metadata?.pillar) {
    pillarCounts[ev.metadata.pillar] = (pillarCounts[ev.metadata.pillar] || 0) + 1;
  }
}

const ctaCounts = {};
for (const ev of events) {
  if (ev.eventType === 'cta_click' && ev.metadata?.target) {
    ctaCounts[ev.metadata.target] = (ctaCounts[ev.metadata.target] || 0) + 1;
  }
}

console.log('\n  -- Pillar Performance --');
if (Object.keys(pillarCounts).length > 0) {
  const sorted = Object.entries(pillarCounts).sort((a, b) => b[1] - a[1]);
  console.log('  Best performing:', sorted[0][0], `(${sorted[0][1]} events)`);
  console.log('  Lowest performing:', sorted[sorted.length - 1][0], `(${sorted[sorted.length - 1][1]} events)`);
} else {
  console.log('  No pillar data yet — events will populate as users engage');
}

console.log('\n  -- CTA Performance --');
if (Object.keys(ctaCounts).length > 0) {
  const sorted = Object.entries(ctaCounts).sort((a, b) => b[1] - a[1]);
  console.log('  Top CTA:', sorted[0][0], `(${sorted[0][1]} clicks)`);
  if (sorted.length > 1) {
    console.log('  Underperforming CTA:', sorted[sorted.length - 1][0], `(${sorted[sorted.length - 1][1]} clicks)`);
  }
} else {
  console.log('  No CTA data yet');
}

console.log('\n  -- Suggested Next 7 Days --');
const pillars = ['EMOTIONAL_LITERACY', 'SELF_COMPASSION', 'BOUNDARIES', 'HEALING_PRACTICES', 'VALUES_AND_MEANING', 'NERVOUS_SYSTEM', 'RELATIONSHIPS'];
const today = new Date();
for (let i = 0; i < 7; i++) {
  const d = new Date(today.getTime() + i * 86400000);
  const dateStr = d.toISOString().split('T')[0];
  const pillar = pillars[i % pillars.length];
  const channel = i === 0 ? 'newsletter' : i % 3 === 0 ? 'blog' : 'social';
  console.log(`  ${dateStr} | ${channel.padEnd(10)} | ${pillar}`);
}

console.log('\n══════════════════════════════════════');
console.log('WEEKLY_REPORT: PASS');
console.log('══════════════════════════════════════\n');
