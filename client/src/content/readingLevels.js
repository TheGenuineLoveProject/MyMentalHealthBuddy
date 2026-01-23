/**
 * readingLevels.js - Conscious-Aware Reading Level System
 * 
 * Features:
 * - Three levels: beginner (simple), standard (warm), deep (explanatory)
 * - SSR-safe localStorage handling
 * - URL query support (?level=beginner|standard|deep)
 * - Fallback chain: URL > localStorage > route default > standard
 * 
 * CONSCIOUS-AWARE DESIGN PRINCIPLES:
 * - Consent-led: user always chooses intensity; default is gentle
 * - Non-coercive: never push; always offer options ("you can", "if you'd like")
 * - Identity-safe: do not assume culture, gender, ability, belief, or background
 * - Non-pathologizing: avoid labeling people; avoid "fixing you" language
 * - Nervous-system respectful: slow motion, breathable spacing, no surprise intensity
 * - Trauma-aware: include pause/stop cues; offer grounding exits; link crisis resources
 * - Culturally humble: avoid universal claims; present practices as optional tools
 * - Legally safer: educational support only; no diagnosis, no medical/treatment claims
 * 
 * STRICT COPY RULES:
 * - Beginner: Sentences under 10 words, respectful + empowering (not childish)
 * - Standard: Paragraphs max 2 sentences, warm/grounded tone
 * - Deep: One short definition per section, gentle tone
 * 
 * AUTONOMY LANGUAGE:
 * - "You can try...", "If you'd like...", "Take what helps..."
 * - "It's okay to pause.", "Go at your pace."
 * - Avoid prescriptive "should" and moral framing
 * 
 * COPY SAFETY:
 * - Allowed: "may help", "some people find...", "often used for..."
 * - Never: "cures", "treats", "guarantees", "clinically proven"
 */

export const READING_LEVELS = ['beginner', 'standard', 'deep'];

export const READING_LEVEL_META = {
  beginner: {
    label: 'Beginner',
    description: 'Plain language, short sentences',
    aria: 'Beginner mode: clear, accessible language',
    copyRule: 'Sentences under 10 words, respectful and empowering'
  },
  standard: {
    label: 'Standard',
    description: 'Warm and grounded',
    aria: 'Standard mode: warm, grounded language with moderate detail',
    copyRule: 'Paragraphs max 2 sentences'
  },
  deep: {
    label: 'Deep',
    description: 'More context and definitions',
    aria: 'Deep mode: detailed explanations with definitions',
    copyRule: 'One short definition per section, gentle tone'
  }
};

export const STORAGE_KEY = 'glp_reading_level';

/**
 * Normalize input to a valid reading level
 * @param {string} input - Raw input value
 * @returns {string|null} - Valid level or null
 */
export function normalizeReadingLevel(input) {
  if (!input || typeof input !== 'string') return null;
  const normalized = input.toLowerCase().trim();
  return READING_LEVELS.includes(normalized) ? normalized : null;
}

/**
 * Get variant text for a field based on reading level
 * Handles both string values and { kids, standard, deep } objects
 * Fallback chain: requested level > standard > first available string
 * 
 * @param {string|object} value - String or variant object
 * @param {string} level - Target reading level
 * @returns {string} - Resolved text
 */
/**
 * Get variant text for a field based on reading level
 * Handles both string values and { beginner, standard, deep } objects
 * Also handles legacy { kids, standard, deep } format
 * Fallback chain: requested level > standard > first available string
 * 
 * @param {string|object} value - String or variant object
 * @param {string} level - Target reading level
 * @returns {string} - Resolved text
 */
export function getVariant(value, level) {
  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'object' && !Array.isArray(value)) {
    const normalizedLevel = normalizeReadingLevel(level) || 'standard';
    
    if (value[normalizedLevel] !== undefined) {
      return value[normalizedLevel];
    }
    
    if (normalizedLevel === 'beginner' && value.kids !== undefined) {
      return value.kids;
    }
    
    if (value.standard !== undefined) {
      return value.standard;
    }
    
    for (const lvl of READING_LEVELS) {
      if (value[lvl] !== undefined) {
        return value[lvl];
      }
    }
    
    if (value.kids !== undefined) {
      return value.kids;
    }
    
    const firstKey = Object.keys(value)[0];
    if (firstKey && typeof value[firstKey] === 'string') {
      return value[firstKey];
    }
  }

  return String(value);
}

/**
 * Get variant array for bullets/lists based on reading level
 * Handles { beginner, standard, deep } and legacy { kids, standard, deep }
 * @param {object} bullets - Variant object with arrays
 * @param {string} level - Target reading level
 * @returns {array} - Resolved array
 */
export function getBulletVariant(bullets, level) {
  if (!bullets || typeof bullets !== 'object') {
    return [];
  }

  if (Array.isArray(bullets)) {
    return bullets;
  }

  const normalizedLevel = normalizeReadingLevel(level) || 'standard';
  
  if (Array.isArray(bullets[normalizedLevel])) {
    return bullets[normalizedLevel];
  }
  
  if (normalizedLevel === 'beginner' && Array.isArray(bullets.kids)) {
    return bullets.kids;
  }
  
  if (Array.isArray(bullets.standard)) {
    return bullets.standard;
  }
  
  for (const lvl of READING_LEVELS) {
    if (Array.isArray(bullets[lvl])) {
      return bullets[lvl];
    }
  }
  
  if (Array.isArray(bullets.kids)) {
    return bullets.kids;
  }
  
  return [];
}

/**
 * Resolve reading level from multiple sources
 * Priority: URL query > localStorage > route default > 'standard'
 * SSR-safe: returns only from routeDefault or 'standard' during SSR
 * 
 * @param {object} options
 * @param {string} options.queryLevel - URL query parameter value
 * @param {string} options.storedLevel - localStorage value (pass null during SSR)
 * @param {string} options.routeDefault - Route-specific default
 * @returns {string} - Resolved reading level
 */
export function resolveReadingLevel({ queryLevel, storedLevel, routeDefault }) {
  const fromQuery = normalizeReadingLevel(queryLevel);
  if (fromQuery) return fromQuery;
  
  const fromStorage = normalizeReadingLevel(storedLevel);
  if (fromStorage) return fromStorage;
  
  const fromRoute = normalizeReadingLevel(routeDefault);
  if (fromRoute) return fromRoute;
  
  return 'standard';
}

/**
 * Get stored reading level from localStorage (SSR-safe)
 * @returns {string|null}
 */
export function getStoredReadingLevel() {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch (e) {
    return null;
  }
}

/**
 * Store reading level to localStorage (SSR-safe)
 * @param {string} level
 */
export function setStoredReadingLevel(level) {
  if (typeof window === 'undefined') return;
  const normalized = normalizeReadingLevel(level);
  if (!normalized) return;
  try {
    localStorage.setItem(STORAGE_KEY, normalized);
  } catch (e) {}
}
