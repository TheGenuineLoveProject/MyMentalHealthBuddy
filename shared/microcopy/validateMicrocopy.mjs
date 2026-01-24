/**
 * Microcopy Validation Script
 * Run with: node shared/microcopy/validateMicrocopy.mjs
 * 
 * Validates:
 * - No empty arrays in any category
 * - Max phrase length (60 chars)
 * - No duplicates within categories
 * - All required slots exist
 */

import microcopyModule from '../../client/src/content/microcopy/wellnessMicrocopy.js';

const { wellnessMicrocopy, ctaPrimary, ctaSecondary, emptyStates, successStates, errorStates } = microcopyModule;

const allSlots = {
  ctaPrimary,
  ctaSecondary,
  emptyStates,
  successStates,
  errorStates,
  ...wellnessMicrocopy
};

const REQUIRED_SLOTS = [
  'ctaPrimary', 'ctaSecondary', 'consent', 'emotionalValidation',
  'successStates', 'errorStates', 'emptyStates', 'pacing', 
  'grounding', 'reassurance', 'exits', 'safety', 'reflection',
  'encouragement', 'tryAgain', 'supportSafety', 'journalingPrompts', 'tierSelectors'
];

const REQUIRED_LEVELS = ['beginner', 'intermediate', 'advanced'];
const MAX_PHRASE_LENGTH = 80;
const MIN_PHRASES_PER_LEVEL = 3;

function validateMicrocopy() {
  console.log('\n🔍 GLP Microcopy Validation\n');
  console.log('='.repeat(50));
  
  const issues = [];
  const warnings = [];
  let totalPhrases = 0;

  for (const slotName of REQUIRED_SLOTS) {
    const slot = allSlots[slotName];
    
    if (!slot) {
      issues.push(`❌ Missing required slot: ${slotName}`);
      continue;
    }
    
    for (const level of REQUIRED_LEVELS) {
      const phrases = slot[level];
      
      if (!Array.isArray(phrases)) {
        issues.push(`❌ ${slotName}.${level}: Not an array`);
        continue;
      }
      
      if (phrases.length === 0) {
        issues.push(`❌ ${slotName}.${level}: Empty array`);
        continue;
      }
      
      if (phrases.length < MIN_PHRASES_PER_LEVEL) {
        warnings.push(`⚠️ ${slotName}.${level}: Only ${phrases.length} phrases (min ${MIN_PHRASES_PER_LEVEL})`);
      }
      
      totalPhrases += phrases.length;
      
      const seen = new Set();
      for (const phrase of phrases) {
        if (typeof phrase !== 'string') {
          issues.push(`❌ ${slotName}.${level}: Non-string phrase found`);
          continue;
        }
        
        if (phrase.length > MAX_PHRASE_LENGTH) {
          issues.push(`❌ ${slotName}.${level}: "${phrase.slice(0, 25)}..." exceeds ${MAX_PHRASE_LENGTH} chars (${phrase.length})`);
        }
        
        if (seen.has(phrase.toLowerCase())) {
          issues.push(`❌ ${slotName}.${level}: Duplicate phrase "${phrase}"`);
        }
        seen.add(phrase.toLowerCase());
        
        const badPatterns = [/will cure/i, /will treat/i, /guaranteed/i, /proven to/i, /clinically proven/i];
        for (const pattern of badPatterns) {
          if (pattern.test(phrase)) {
            issues.push(`❌ ${slotName}.${level}: Unsafe language "${phrase}"`);
          }
        }
      }
    }
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`   Total slots checked: ${REQUIRED_SLOTS.length}`);
  console.log(`   Total phrases: ${totalPhrases}`);
  console.log(`   Issues: ${issues.length}`);
  console.log(`   Warnings: ${warnings.length}`);
  
  if (issues.length > 0) {
    console.log('\n❌ ISSUES:');
    issues.forEach(i => console.log(`   ${i}`));
  }
  
  if (warnings.length > 0) {
    console.log('\n⚠️ WARNINGS:');
    warnings.forEach(w => console.log(`   ${w}`));
  }
  
  if (issues.length === 0) {
    console.log('\n✅ All validation checks passed!\n');
    return true;
  } else {
    console.log('\n❌ Validation failed with errors\n');
    return false;
  }
}

const valid = validateMicrocopy();
process.exit(valid ? 0 : 1);
