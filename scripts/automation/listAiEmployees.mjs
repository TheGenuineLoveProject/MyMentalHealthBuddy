// scripts/automation/listAiEmployees.mjs
// List available AI employees based on docs/ai-employees/*.md

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

if (process.env.NODE_ENV === 'production') {
  console.log('❌ Automation disabled in production. Run this only in dev or staging.');
  process.exit(0);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..', '..');
const AI_EMPLOYEES_DIR = path.join(ROOT_DIR, 'docs', 'ai-employees');

async function listEmployees() {
  try {
    const entries = await fs.readdir(AI_EMPLOYEES_DIR, { withFileTypes: true });
    const files = entries
      .filter((e) => e.isFile() && e.name.endsWith('.md'))
      .map((e) => e.name);

    if (files.length === 0) {
      console.log('⚠️ No AI employee prompt files found in docs/ai-employees.');
      return;
    }

    console.log('🤖 Available AI Employees:\n');

    files.forEach((file) => {
      const base = file.replace('.md', '');
      console.log(`• ${base}`);
    });

    console.log('\nℹ️ To use one: open the .md file, copy the prompt, paste it into ChatGPT.');
  } catch (err) {
    console.log('⚠️ Could not read docs/ai-employees directory.');
    console.error(err.message);
  }
}

listEmployees().catch((err) => {
  console.error('❌ listAiEmployees.mjs failed:', err);
  process.exit(1);
});