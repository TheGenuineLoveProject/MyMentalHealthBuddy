/**
 * Phase 23 — antiManipulationRules
 *
 * Regex detectors for language patterns the companion must NEVER produce:
 *  - Romantic / parasocial framing
 *  - Possessive language
 *  - Fake empathy / scripted-sympathy phrases
 *  - Emotional dependency creation
 */

export interface ManipulationCategory {
  readonly name: string;
  readonly patterns: ReadonlyArray<RegExp>;
}

export const MANIPULATION_CATEGORIES: ReadonlyArray<ManipulationCategory> = Object.freeze([
  {
    name: "romantic_language",
    patterns: [
      /\b(i\s+love\s+you|i'?m\s+in\s+love\s+with\s+you)\b/i,
      /\b(my\s+(love|darling|sweetheart|beloved))\b/i,
      /\b(kiss|cuddle|hold\s+you\s+close)\b/i,
      /\b(soulmate|destined\s+to\s+be|made\s+for\s+each\s+other)\b/i,
    ],
  },
  {
    name: "possessive_framing",
    patterns: [
      /\byou'?re\s+mine\b/i,
      /\bi\s+own\s+you\b/i,
      /\bdon'?t\s+leave\s+me\b/i,
      /\bi\s+can'?t\s+live\s+without\s+you\b/i,
      /\bonly\s+i\s+can\s+(help|understand|love)\s+you\b/i,
    ],
  },
  {
    name: "fake_empathy",
    patterns: [
      /\bi\s+know\s+exactly\s+how\s+you\s+feel\b/i,
      /\bi\s+understand\s+everything\s+you'?re\s+going\s+through\b/i,
      /\bi'?ve\s+felt\s+the\s+same\s+way\b/i,
      /\btrust\s+me,?\s+i\s+(get|know)\s+it\b/i,
    ],
  },
  {
    name: "dependency_creation",
    patterns: [
      /\byou\s+need\s+me\b/i,
      /\byou\s+can'?t\s+do\s+this\s+without\s+me\b/i,
      /\bcheck\s+in\s+with\s+me\s+(every|all)\s+(day|hour|moment)\b/i,
      /\bdon'?t\s+talk\s+to\s+(anyone|others)\s+about\s+this\b/i,
      /\bi'?m\s+the\s+only\s+one\s+who\b/i,
    ],
  },
]);

if (MANIPULATION_CATEGORIES.length < 4) {
  throw new Error(
    `[lumi-voice] MANIPULATION_CATEGORIES floor violated: ${MANIPULATION_CATEGORIES.length} < 4.`,
  );
}

export interface ManipulationHit {
  readonly category: string;
  readonly pattern: string;
}

export function findManipulationHits(text: string): ReadonlyArray<ManipulationHit> {
  if (typeof text !== "string" || text.length === 0) return [];
  const hits: ManipulationHit[] = [];
  for (const cat of MANIPULATION_CATEGORIES) {
    for (const pattern of cat.patterns) {
      if (pattern.test(text)) {
        hits.push({ category: cat.name, pattern: pattern.source });
      }
    }
  }
  return hits;
}

export function containsManipulativeLanguage(text: string): boolean {
  return findManipulationHits(text).length > 0;
}
