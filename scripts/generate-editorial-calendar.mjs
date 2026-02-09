#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const isDryRun = process.argv.includes('--dry-run');

const PILLARS = [
  'EMOTIONAL_LITERACY', 'SELF_COMPASSION', 'BOUNDARIES', 'HEALING_PRACTICES',
  'VALUES_AND_MEANING', 'NERVOUS_SYSTEM', 'RELATIONSHIPS', 'DAILY_RITUALS',
  'REFLECTION_PROMPTS', 'COMMUNITY_AND_SUPPORT', 'GROWTH_AND_MASTERY', 'PLATFORM_ORIENTATION',
];

const TITLE_STUBS = {
  EMOTIONAL_LITERACY: ['Naming What You Feel', 'The Feeling Wheel', 'Beyond Happy or Sad'],
  SELF_COMPASSION: ['Being Kind to Yourself', 'The Inner Critic', 'Permission to Rest'],
  BOUNDARIES: ['Saying No With Love', 'Boundaries Are Not Walls', 'Honoring Your Limits'],
  HEALING_PRACTICES: ['A Simple Grounding Practice', 'Body Scan Basics', 'Breathwork for Beginners'],
  VALUES_AND_MEANING: ['What Matters Most', 'Living With Purpose', 'Your Values Compass'],
  NERVOUS_SYSTEM: ['Understanding Your Stress Response', 'Window of Tolerance', 'Co-Regulation'],
  RELATIONSHIPS: ['Listening Before Responding', 'Repair After Conflict', 'Safe Connection'],
  DAILY_RITUALS: ['Morning Check-In', 'Evening Wind-Down', 'The One-Minute Reset'],
  REFLECTION_PROMPTS: ['What Am I Carrying?', 'What Do I Need Today?', 'Where Am I Growing?'],
  COMMUNITY_AND_SUPPORT: ['You Are Not Alone', 'Community Note', 'Shared Humanity'],
  GROWTH_AND_MASTERY: ['Progress Over Perfection', 'Deepening Awareness', 'Integration Practice'],
  PLATFORM_ORIENTATION: ['How to Use This Space', 'What This Is (and Isn\'t)', 'Getting Started'],
};

console.log('── Editorial Calendar Generator ──\n');

const entries = [];
const today = new Date();
let pillarIdx = 0;

for (let day = 0; day < 28; day++) {
  const date = new Date(today.getTime() + day * 86400000);
  const dateStr = date.toISOString().split('T')[0];

  const blogPillar = PILLARS[pillarIdx % PILLARS.length];
  const stubs = TITLE_STUBS[blogPillar];
  const titleStub = stubs[day % stubs.length];

  if (day % 2 === 0) {
    entries.push({
      date: dateStr,
      channel: 'blog',
      pillar: blogPillar,
      title: titleStub,
      slug: null,
      draft_id: null,
      status: 'planned',
      notes: 'Auto-generated draft stub',
    });
    pillarIdx++;
  }

  const socialPillar = PILLARS[(pillarIdx + day) % PILLARS.length];
  const socialStubs = TITLE_STUBS[socialPillar];
  entries.push({
    date: dateStr,
    channel: 'social',
    pillar: socialPillar,
    title: socialStubs[day % socialStubs.length],
    slug: null,
    draft_id: null,
    status: 'planned',
    notes: 'Social post suggestion',
  });

  if (day % 7 === 0) {
    const nlPillar = PILLARS[(pillarIdx + 3) % PILLARS.length];
    entries.push({
      date: dateStr,
      channel: 'newsletter',
      pillar: nlPillar,
      title: `Weekly Digest — Week of ${dateStr}`,
      slug: null,
      draft_id: null,
      status: 'planned',
      notes: 'Weekly newsletter draft',
    });
  }
}

console.log(`  Generated ${entries.length} entries over 28 days`);
console.log('');
console.log('  Date       | Type       | Pillar               | Title');
console.log('  ' + '-'.repeat(70));

for (const e of entries.slice(0, 20)) {
  console.log(`  ${e.date} | ${e.channel.padEnd(10)} | ${e.pillar.substring(0, 20).padEnd(20)} | ${e.title.substring(0, 40)}`);
}
if (entries.length > 20) {
  console.log(`  ... and ${entries.length - 20} more entries`);
}

if (!isDryRun) {
  const calPath = path.join(ROOT, 'content/publishing/calendar/editorial_calendar.json');
  const dir = path.dirname(calPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(calPath, JSON.stringify(entries, null, 2));
  console.log(`\n  ✓ Written to content/publishing/calendar/editorial_calendar.json`);
} else {
  console.log('\n  [DRY RUN] No files written');
}

console.log('\n══════════════════════════════════════');
console.log('EDITORIAL_CALENDAR: PASS');
console.log('══════════════════════════════════════\n');
