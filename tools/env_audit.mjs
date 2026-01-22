#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const REQUIRED_VARS = [
  { name: 'DATABASE_URL', required: true, description: 'PostgreSQL connection string' },
  { name: 'SESSION_SECRET', required: true, description: 'Express session secret' },
  { name: 'GITHUB_CLIENT_ID', required: false, description: 'GitHub OAuth client ID' },
  { name: 'GITHUB_CLIENT_SECRET', required: false, description: 'GitHub OAuth client secret' },
  { name: 'ADMIN_TOKEN', required: false, description: 'Admin authentication token' },
  { name: 'OPENAI_API_KEY', required: false, description: 'OpenAI API key for AI features' },
  { name: 'STRIPE_SECRET_KEY', required: false, description: 'Stripe secret key for payments' },
  { name: 'STRIPE_PUBLISHABLE_KEY', required: false, description: 'Stripe publishable key' },
  { name: 'SENTRY_DSN', required: false, description: 'Sentry error tracking DSN' },
];

function checkEnvVars() {
  console.log('== Environment Variable Audit ==\n');
  
  let passed = 0;
  let failed = 0;
  let optional = 0;
  
  for (const v of REQUIRED_VARS) {
    const value = process.env[v.name];
    const exists = value !== undefined && value !== '';
    
    if (v.required) {
      if (exists) {
        console.log(`✓ ${v.name} (required) - SET`);
        passed++;
      } else {
        console.log(`✗ ${v.name} (required) - MISSING`);
        failed++;
      }
    } else {
      if (exists) {
        console.log(`✓ ${v.name} (optional) - SET`);
        optional++;
      } else {
        console.log(`- ${v.name} (optional) - not set`);
      }
    }
  }
  
  console.log(`\n== Summary ==`);
  console.log(`Required: ${passed}/${REQUIRED_VARS.filter(v => v.required).length} set`);
  console.log(`Optional: ${optional}/${REQUIRED_VARS.filter(v => !v.required).length} set`);
  
  if (failed > 0) {
    console.log(`\n⚠ WARNING: ${failed} required environment variable(s) missing`);
    console.log('Some features may not work without them.');
  } else {
    console.log('\n✓ PASS: All required environment variables are set');
  }
}

function checkEnvExample() {
  const envExamplePath = path.join(ROOT, '.env.example');
  
  if (fs.existsSync(envExamplePath)) {
    console.log('\n✓ .env.example exists');
  } else {
    console.log('\n- .env.example not found (optional)');
  }
}

function checkEnvChecklist() {
  const checklistPath = path.join(ROOT, 'ENV_CHECKLIST.md');
  
  if (fs.existsSync(checklistPath)) {
    console.log('✓ ENV_CHECKLIST.md exists');
  } else {
    console.log('- ENV_CHECKLIST.md not found (optional)');
  }
}

checkEnvVars();
checkEnvExample();
checkEnvChecklist();

console.log('\n== Env Audit Complete ==');
