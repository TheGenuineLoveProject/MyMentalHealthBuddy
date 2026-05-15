/**
 * Wellness Microcopy Library
 * Rotation-safe, trauma-informed, consent-based messaging
 * 
 * Usage: Import and use getMicrocopy(category) for rotation
 * Each category rotates through messages to avoid repetition
 */

export const wellnessMicrocopy = {
  consentControl: [
    "You're in charge here.",
    "Pause, skip, or stop anytime.",
    "Choose the gentlest option.",
    "There's no wrong way to do this.",
    "Take what serves you, leave the rest.",
    "This is your pace, not anyone else's.",
    "You can always come back later.",
    "No pressure to complete anything."
  ],

  encouragement: [
    "That makes sense.",
    "One kind step is enough.",
    "You're not alone.",
    "This is a good start.",
    "Small steps count.",
    "You're doing the work.",
    "Progress isn't always visible.",
    "Showing up is enough."
  ],

  boundaries: [
    "What would self-respect look like here?",
    "What's 'good enough' today?",
    "Where do you need more space?",
    "What would you say to protect your peace?",
    "What can you let go of right now?",
    "What's one thing you could delegate or decline?"
  ],

  progress: [
    "Consistency over intensity.",
    "Skip days are allowed.",
    "Rest is part of the process.",
    "You don't have to be perfect.",
    "Every pause is practice.",
    "Slow progress is still progress.",
    "You're building something lasting."
  ],

  errorsEmptyStates: [
    "Nothing is broken.",
    "Want a tiny start?",
    "There's nothing to fix here.",
    "This is a fresh beginning.",
    "Ready when you are.",
    "No rush. Take your time."
  ],

  miReadiness: [
    "On a 1–10 scale, how ready do you feel to try a small step?",
    "What would make this 1% easier?",
    "What matters most to you right now?",
    "What's one reason for and one reason against this change?"
  ],

  strengthsBased: [
    "What around you supports this?",
    "What in your environment makes this harder?",
    "What practical support would help this week?",
    "What's already working that you could build on?",
    "What strength got you through something similar before?"
  ],

  crisisReminders: [
    "If you're in crisis, visit /crisis",
    "Need immediate support? Visit /crisis",
    "Crisis resources available at /crisis"
  ],

  safetyFooter: "18+ only • Educational support — not medical advice • Pause/stop anytime • /crisis"
};

// Rotation state (persists within session)
const rotationState = {};

/**
 * Get a microcopy message with rotation to avoid repetition
 * @param {string} category - Category key from wellnessMicrocopy
 * @returns {string} Next message in rotation
 */
export function getMicrocopy(category) {
  const messages = wellnessMicrocopy[category];
  if (!messages || !Array.isArray(messages)) {
    console.warn(`Unknown microcopy category: ${category}`);
    return "";
  }

  if (!rotationState[category]) {
    rotationState[category] = 0;
  }

  const message = messages[rotationState[category]];
  rotationState[category] = (rotationState[category] + 1) % messages.length;
  
  return message;
}

/**
 * Get a random microcopy message (for one-time use)
 * @param {string} category - Category key from wellnessMicrocopy
 * @returns {string} Random message from category
 */
export function getRandomMicrocopy(category) {
  const messages = wellnessMicrocopy[category];
  if (!messages || !Array.isArray(messages)) {
    return "";
  }
  return messages[Math.floor(Math.random() * messages.length)];
}

/**
 * Get multiple messages from a category (for lists/variety)
 * @param {string} category - Category key
 * @param {number} count - Number of messages to return
 * @returns {string[]} Array of messages
 */
export function getMicrocopySet(category, count = 3) {
  const messages = wellnessMicrocopy[category];
  if (!messages || !Array.isArray(messages)) {
    return [];
  }
  
  const shuffled = [...messages].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, messages.length));
}

/**
 * Reset rotation for a specific category or all categories
 * @param {string|null} category - Category to reset, or null for all
 */
export function resetRotation(category = null) {
  if (category) {
    rotationState[category] = 0;
  } else {
    Object.keys(rotationState).forEach(key => {
      rotationState[key] = 0;
    });
  }
}

export default wellnessMicrocopy;
