#!/usr/bin/env node
// scripts/integration-score.mjs
// Updates /docs/integrations.md with current batch completion status

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const docsDir = join(__dirname, '..', 'docs');

function countStatus(content) {
  const completed = (content.match(/\| ✅/g) || []).length;
  const inProgress = (content.match(/\| 🟡/g) || []).length;
  const locked = (content.match(/\| 🔒/g) || []).length;
  const notStarted = (content.match(/\| ❌/g) || []).length;
  return { completed, inProgress, locked, notStarted };
}

function updateIntegrations() {
  const integrationsPath = join(docsDir, 'integrations.md');
  
  if (!existsSync(integrationsPath)) {
    console.log('⚠️  integrations.md not found');
    return;
  }

  const batches = [
    { file: 'integration-batches/integration-001-050.md', range: '001-050' },
    { file: 'integration-batches/integration-051-100.md', range: '051-100' },
    { file: 'integration-batches/integration-101-150.md', range: '101-150' },
  ];

  console.log('\\n📊 Integration Score Summary\\n');
  console.log('| Batch | Completed | In Progress | Locked |');
  console.log('|-------|-----------|-------------|--------|');

  let totalCompleted = 0;
  let totalInProgress = 0;

  for (const batch of batches) {
    const batchPath = join(docsDir, batch.file);
    if (existsSync(batchPath)) {
      const content = readFileSync(batchPath, 'utf-8');
      const stats = countStatus(content);
      totalCompleted += stats.completed;
      totalInProgress += stats.inProgress;
      console.log(`| ${batch.range} | ${stats.completed} | ${stats.inProgress} | ${stats.locked} |`);
    }
  }

  console.log('');
  console.log(`Total Completed: ${totalCompleted}`);
  console.log(`Total In Progress: ${totalInProgress}`);
  console.log('');

  // Update timestamp in integrations.md
  let integrationsContent = readFileSync(integrationsPath, 'utf-8');
  const now = new Date().toISOString().split('T')[0];
  
  if (!integrationsContent.includes('Last Updated:')) {
    integrationsContent += `\\n---\\n\\n_Last Updated: ${now}_\\n`;
    writeFileSync(integrationsPath, integrationsContent);
  }

  console.log('✅ Integration score updated');
}

updateIntegrations();
