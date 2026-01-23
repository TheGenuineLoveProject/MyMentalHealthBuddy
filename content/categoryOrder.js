/**
 * ============================================================================
 * CATEGORY ORDER - Single Source of Truth for A→Z Category Mapping
 * ============================================================================
 * 
 * This file defines the canonical ordering of route categories used by:
 * - Page generator (scripts/generate-pages.mjs)
 * - Design playbook
 * - Route configuration
 * 
 * ============================================================================
 */

/**
 * A→Z Category Order
 * Each entry maps a letter (A-M) to a category name.
 */
export const CATEGORY_ORDER = [
  { letter: "A", category: "Landing" },
  { letter: "B", category: "Authentication" },
  { letter: "C", category: "Dashboard & Core" },
  { letter: "D", category: "AI & Chat" },
  { letter: "E", category: "Wellness & Healing Tools" },
  { letter: "F", category: "Advanced & Mastery" },
  { letter: "G", category: "Content & Learning" },
  { letter: "H", category: "Community & Social" },
  { letter: "I", category: "Support & Resources" },
  { letter: "J", category: "Legal & Policy" },
  { letter: "K", category: "Account & Settings" },
  { letter: "L", category: "Admin" },
  { letter: "M", category: "System & Utility" }
];

/**
 * Ordered list of valid letters (A-M)
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
 * Get category name by letter.
 * @param {string} letter - Single uppercase letter (A-M)
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
 * Get letter by category name (case-insensitive).
 * @param {string} category - Category name
 * @returns {string} Letter (A-M)
 * @throws {Error} If category is invalid
 */
export function getLetterByCategory(category) {
  const normalized = category?.toLowerCase?.();
  if (!normalized || !categoryToLetter[normalized]) {
    const validCategories = CATEGORY_ORDER.map(c => c.category).join(', ');
    throw new Error(
      `Invalid category: "${category}". Valid categories: ${validCategories}`
    );
  }
  return categoryToLetter[normalized];
}

/**
 * Get all categories in a letter range (inclusive).
 * @param {string} fromLetter - Start letter (A-M)
 * @param {string} toLetter - End letter (A-M)
 * @returns {Array<{letter: string, category: string}>} Categories in range
 * @throws {Error} If letters are invalid or out of order
 */
export function getCategoriesInRange(fromLetter, toLetter) {
  const from = fromLetter?.toUpperCase?.();
  const to = toLetter?.toUpperCase?.();

  // Validate fromLetter
  if (!from || !letterToCategory[from]) {
    throw new Error(
      `Invalid --from letter: "${fromLetter}". Valid letters: ${ORDERED_LETTERS.join(', ')}`
    );
  }

  // Validate toLetter
  if (!to || !letterToCategory[to]) {
    throw new Error(
      `Invalid --to letter: "${toLetter}". Valid letters: ${ORDERED_LETTERS.join(', ')}`
    );
  }

  const fromIndex = ORDERED_LETTERS.indexOf(from);
  const toIndex = ORDERED_LETTERS.indexOf(to);

  // Validate order
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
 * Check if a category is valid (case-insensitive).
 * @param {string} category - Category to check
 * @returns {boolean}
 */
export function isValidCategory(category) {
  return categoryToLetter.hasOwnProperty(category?.toLowerCase?.());
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
