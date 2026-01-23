/**
 * ============================================================================
 * CATEGORY ORDER - Single Source of Truth for A→Z Category Mapping
 * ============================================================================
 * 
 * This file defines the canonical ordering of route categories used by:
 * - Page generator (scripts/gen-pages.mjs)
 * - Route verification (scripts/verify-routes-manifest.mjs)
 * - Design playbook
 * - Route configuration
 * 
 * ============================================================================
 */

/**
 * A→L Category Order
 * Each entry maps a letter (A-L) to a category name.
 */
export const CATEGORY_ORDER = [
  { letter: "A", category: "Landing & Marketing" },
  { letter: "B", category: "Authentication" },
  { letter: "C", category: "Dashboard & Core" },
  { letter: "D", category: "Wellness & Healing Tools" },
  { letter: "E", category: "Advanced & Mastery Tools" },
  { letter: "F", category: "Content & Learning" },
  { letter: "G", category: "Community & Social" },
  { letter: "H", category: "Support & Resources" },
  { letter: "I", category: "Legal & Policy" },
  { letter: "J", category: "Account & Settings" },
  { letter: "K", category: "Admin" },
  { letter: "L", category: "System & Utility" }
];

/**
 * Ordered list of valid letters (A-L)
 */
export const ORDERED_LETTERS = CATEGORY_ORDER.map(c => c.letter);

/**
 * Map of letter → category for quick lookup
 */
const letterToCategory = Object.fromEntries(
  CATEGORY_ORDER.map(c => [c.letter, c.category])
);

/**
 * Map of category → letter for reverse lookup (case-insensitive)
 */
const categoryToLetter = Object.fromEntries(
  CATEGORY_ORDER.map(c => [c.category.toLowerCase(), c.letter])
);

/**
 * Flexible category lookup - handles partial matches and aliases
 */
const categoryAliases = {
  'landing': 'Landing & Marketing',
  'marketing': 'Landing & Marketing',
  'auth': 'Authentication',
  'core': 'Dashboard & Core',
  'dashboard': 'Dashboard & Core',
  'wellness': 'Wellness & Healing Tools',
  'healing': 'Wellness & Healing Tools',
  'advanced': 'Advanced & Mastery Tools',
  'mastery': 'Advanced & Mastery Tools',
  'content': 'Content & Learning',
  'learning': 'Content & Learning',
  'community': 'Community & Social',
  'social': 'Community & Social',
  'support': 'Support & Resources',
  'resources': 'Support & Resources',
  'legal': 'Legal & Policy',
  'policy': 'Legal & Policy',
  'account': 'Account & Settings',
  'settings': 'Account & Settings',
  'admin': 'Admin',
  'system': 'System & Utility',
  'utility': 'System & Utility'
};

/**
 * Get category name by letter.
 * @param {string} letter - Single uppercase letter (A-L)
 * @returns {string} Category name
 * @throws {Error} If letter is invalid
 */
export function getCategoryByLetter(letter) {
  const normalized = letter?.toUpperCase?.();
  if (!normalized || !letterToCategory[normalized]) {
    throw new Error(
      `Invalid category letter: "${letter}". Valid letters: ${ORDERED_LETTERS.join(', ')}`
    );
  }
  return letterToCategory[normalized];
}

/**
 * Get letter by category name (case-insensitive, supports aliases).
 * @param {string} category - Category name or alias
 * @returns {string} Letter (A-L)
 * @throws {Error} If category is invalid
 */
export function getLetterByCategory(category) {
  const normalized = category?.toLowerCase?.();
  
  // Try direct match first
  if (categoryToLetter[normalized]) {
    return categoryToLetter[normalized];
  }
  
  // Try alias lookup
  const aliasedCategory = categoryAliases[normalized];
  if (aliasedCategory) {
    return categoryToLetter[aliasedCategory.toLowerCase()];
  }
  
  const validCategories = CATEGORY_ORDER.map(c => c.category).join(', ');
  throw new Error(
    `Invalid category: "${category}". Valid categories: ${validCategories}`
  );
}

/**
 * Resolve category name from alias or partial match.
 * @param {string} input - Category name, alias, or partial match
 * @returns {string} Canonical category name
 */
export function resolveCategory(input) {
  const normalized = input?.toLowerCase?.();
  
  // Try alias first
  if (categoryAliases[normalized]) {
    return categoryAliases[normalized];
  }
  
  // Try exact match (case-insensitive)
  const exactMatch = CATEGORY_ORDER.find(
    c => c.category.toLowerCase() === normalized
  );
  if (exactMatch) {
    return exactMatch.category;
  }
  
  // Try partial match
  const partialMatch = CATEGORY_ORDER.find(
    c => c.category.toLowerCase().includes(normalized)
  );
  if (partialMatch) {
    return partialMatch.category;
  }
  
  return null;
}

/**
 * Get all categories in a letter range (inclusive).
 * @param {string} fromLetter - Start letter (A-L)
 * @param {string} toLetter - End letter (A-L)
 * @returns {Array<{letter: string, category: string}>} Categories in range
 * @throws {Error} If letters are invalid or out of order
 */
export function getCategoriesInRange(fromLetter, toLetter) {
  const from = fromLetter?.toUpperCase?.();
  const to = toLetter?.toUpperCase?.();

  if (!from || !letterToCategory[from]) {
    throw new Error(
      `Invalid --from letter: "${fromLetter}". Valid letters: ${ORDERED_LETTERS.join(', ')}`
    );
  }

  if (!to || !letterToCategory[to]) {
    throw new Error(
      `Invalid --to letter: "${toLetter}". Valid letters: ${ORDERED_LETTERS.join(', ')}`
    );
  }

  const fromIndex = ORDERED_LETTERS.indexOf(from);
  const toIndex = ORDERED_LETTERS.indexOf(to);

  if (fromIndex > toIndex) {
    throw new Error(
      `Invalid range: --from=${from} must be <= --to=${to}. ` +
      `${from} (index ${fromIndex}) comes after ${to} (index ${toIndex})`
    );
  }

  return CATEGORY_ORDER.slice(fromIndex, toIndex + 1);
}

/**
 * Check if a letter is valid.
 * @param {string} letter - Letter to check
 * @returns {boolean}
 */
export function isValidLetter(letter) {
  return ORDERED_LETTERS.includes(letter?.toUpperCase?.());
}

/**
 * Check if a category is valid (case-insensitive, supports aliases).
 * @param {string} category - Category to check
 * @returns {boolean}
 */
export function isValidCategory(category) {
  const normalized = category?.toLowerCase?.();
  return categoryToLetter.hasOwnProperty(normalized) || 
         categoryAliases.hasOwnProperty(normalized);
}

/**
 * Get all categories as an array of category names.
 * @returns {string[]}
 */
export function getAllCategories() {
  return CATEGORY_ORDER.map(c => c.category);
}

/**
 * Get category info for display purposes.
 * @returns {Array<{letter: string, category: string}>}
 */
export function getCategoryInfo() {
  return CATEGORY_ORDER.map(c => ({
    letter: c.letter,
    category: c.category
  }));
}

/**
 * Print category order as formatted table (for CLI output).
 */
export function printCategoryTable() {
  console.log('\n╔════════════════════════════════════════════════╗');
  console.log('║         CATEGORY ORDER (A→L)                   ║');
  console.log('╠════════════════════════════════════════════════╣');
  CATEGORY_ORDER.forEach(({ letter, category }) => {
    const padded = category.padEnd(35);
    console.log(`║  ${letter}  │  ${padded}║`);
  });
  console.log('╚════════════════════════════════════════════════╝\n');
}
