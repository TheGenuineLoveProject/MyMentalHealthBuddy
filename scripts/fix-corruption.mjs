#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';

const corruptedFiles = [
  'server/ai/employee.ts',
  'server/ai/learning-engine.ts',
  'server/ai/monitoring-system.ts',
  'server/ai.ts',
  'server/auth/index.ts',
  'server/auth/jwt.ts',
  'server/auth/passport.ts',
  'server/config.ts',
  'server/lib/ai-employees/quantum-evolution-engine.ts',
  'server/lib/ai-employees/unified-healing-system.ts',
  'server/lib/database-optimizer.ts',
  'server/lib/master-healing-integration.ts',
  'server/lib/openai-advanced.ts',
  'server/lib/ultimate-performance-optimizer.ts',
  'server/middleware/advanced-security.ts',
  'server/middleware/errorHandler.ts',
  'server/middleware/monitoring.ts',
  'server/middleware/optimization.ts',
  'server/middleware/rateLimiter.ts',
  'server/middleware/security.ts',
  'server/routes/ai-orchestrator.ts',
  'server/routes/ai.ts',
  'server/routes/auth/ai.ts',
  'server/routes/auth/index.ts',
  'server/routes/auth.ts',
  'server/routes/billing.ts',
  'server/routes/healing-log.ts',
  'server/routes/healing.ts',
  'server/routes/heal.ts',
  'server/routes/index.ts',
  'server/routes/mental-health.ts',
  'server/routes/mood.ts',
  'server/routes/MyMentalHealthBuddy/server/routes/healing-log.ts',
  'server/routes/openai.ts',
  'server/routes.ts',
  'server/routes/tts.ts',
  'server/services/stripe-optimized.ts',
  'server/storage.ts',
  'server/stripe.ts',
  'server/verification/platform-verification.ts',
  'server/vite.ts'
];

let totalFixed = 0;
let totalFiles = 0;

console.log('🔧 PECAS v1100^ - Automated Corruption Repair\n');
console.log(`📋 Processing ${corruptedFiles.length} files...\n`);

corruptedFiles.forEach((filePath) => {
  try {
    let content = readFileSync(filePath, 'utf-8');
    const originalContent = content;
    let fileFixed = 0;

    // Fix pattern 1: "words" -> "words"
    content = content.replace(/"([a-z]+)"([a-z])"/g, (match, p1, p2) => {
      fileFixed++;
      return `"${p1}${p2}"`;
    });

    // Fix pattern 2: Remove erroneous semicolons after closing braces/parens
    content = content.replace(/\}\);$/gm, '})');
    content = content.replace(/\{;$/gm, '{');
    content = content.replace(/\);$/gm, ')');

    // Fix pattern 3: Remove semicolons after function declarations
    content = content.replace(/^(export )?function [^{]+\{;$/gm, (match) => {
      return match.replace(/;$/, '');
    });

    // Fix pattern 4: Remove semicolons at end of comments
    content = content.replace(/\/\/ .+;$/gm, (match) => {
      return match.replace(/;$/, '');
    });

    if (content !== originalContent) {
      writeFileSync(filePath, content, 'utf-8');
      totalFixed += fileFixed;
      totalFiles++;
      console.log(`✅ ${filePath} - Fixed ${fileFixed} issues`);
    } else {
      console.log(`⏭️  ${filePath} - No issues found`);
    }
  } catch (err) {
    console.error(`❌ ${filePath} - Error: ${err.message}`);
  }
});

console.log(`\n🎉 REPAIR COMPLETE!`);
console.log(`📊 Total files processed: ${corruptedFiles.length}`);
console.log(`✅ Files repaired: ${totalFiles}`);
console.log(`🔧 Total fixes applied: ${totalFixed}`);
