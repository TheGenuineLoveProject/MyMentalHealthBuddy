/**
 * readingLevels.js - Reading Level System Constants & Helpers
 * 
 * Features:
 * - Three levels: kids (simple), standard (warm), deep (explanatory)
 * - SSR-safe localStorage handling
 * - URL query support (?level=kids|standard|deep)
 * - Fallback chain: URL > localStorage > route default > standard
 */

export const READING_LEVELS = ['kids', 'standard', 'deep'];

export const READING_LEVEL_META = {
  kids: {
    label: 'Kids',
    description: 'Simple words, short sentences',
    aria: 'Kids mode: very simple, easy-to-understand language'
  },
  standard: {
    label: 'Standard',
    description: 'Warm and grounded',
    aria: 'Standard mode: warm, grounded language with moderate detail'
  },
  deep: {
    label: 'Deep',
    description: 'Frameworks and definitions',
    aria: 'Deep mode: detailed explanations with frameworks and definitions'
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
    
    if (value.standard !== undefined) {
      return value.standard;
    }
    
    for (const lvl of READING_LEVELS) {
      if (value[lvl] !== undefined) {
        return value[lvl];
      }
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
 * @param {object} bullets - { kids: [...], standard: [...], deep: [...] }
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
  
  if (Array.isArray(bullets.standard)) {
    return bullets.standard;
  }
  
  for (const lvl of READING_LEVELS) {
    if (Array.isArray(bullets[lvl])) {
      return bullets[lvl];
    }
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
