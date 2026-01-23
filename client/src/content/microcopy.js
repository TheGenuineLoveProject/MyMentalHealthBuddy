/**
 * Trauma-Informed Microcopy Library
 * Centralized text snippets for consistent, permission-based language across wellness pages.
 * 
 * Usage: Each route selects by deterministic hash to avoid repetition while staying stable.
 */

export const microcopy = {
  permission: [
    "Go at your pace. You can pause anytime.",
    "If this feels like too much, you can stop and come back later.",
    "There's nothing to prove here—small is enough.",
    "You're in charge. Change or skip any step."
  ],

  choiceLanguage: [
    "If you can…",
    "If it helps…",
    "If not, that's okay.",
    "You can try a smaller version."
  ],

  safety: [
    "Need immediate support? Visit Crisis Resources.",
    "If you feel unsafe right now, go to Crisis Resources."
  ],

  whatToExpect: [
    "You might notice a softer breath, a tiny bit of space, or nothing at all—any outcome is okay.",
    "This is a practice, not a test. Subtle changes count.",
    "If your mind wanders, that's normal. Just return gently."
  ],

  tierLabels: {
    beginner: [
      "10-second reset",
      "Quick reset (10s)",
      "10s grounding"
    ],
    intermediate: [
      "1–3 minute practice",
      "Short practice (1–3 min)",
      "Steady practice (1–3 min)"
    ],
    advanced: [
      "3–10 minute practice",
      "Deeper practice (3–10 min)",
      "Longer practice (3–10 min)"
    ]
  },

  cta: {
    beginner: [
      "Start 10-second reset",
      "Do the quick reset",
      "Begin (10 seconds)"
    ],
    intermediate: [
      "Start 1–3 minute practice",
      "Try the short practice",
      "Begin the 1–3 minute version"
    ],
    advanced: [
      "Start 3–10 minute practice",
      "Try the longer practice",
      "Begin the deeper version"
    ]
  },

  stopNotes: [
    "You can pause, stop, or switch to the 10-second reset anytime.",
    "If you get overwhelmed, stop and return to your feet or your breath.",
    "Reset option: do one exhale, then decide what's next.",
    "Shorter counts. Stopping counts. Coming back counts."
  ],

  bodyCues: [
    "Feel your feet on the floor.",
    "Let your jaw unclench (even a little).",
    "Drop your shoulders one millimeter.",
    "Notice where your body touches the chair.",
    "Place a hand on your chest or belly—only if that feels okay."
  ],

  breathCues: [
    "Breathe normally and simply notice it.",
    "Let your exhale be a little longer than your inhale.",
    "No need to breathe 'right'—just breathe.",
    "If breath focus feels hard, switch to feeling your feet."
  ],

  groundingCues: [
    "Name 3 things you can see.",
    "Press your toes down and release.",
    "Notice 2 sounds—near, then far.",
    "Rub thumb and fingertips together slowly.",
    "Look around and find one calming color."
  ],

  emotionLanguage: {
    naming: [
      "What's here right now?",
      "If you had to pick one word, what fits best?",
      "Where do you feel it in your body (if you can tell)?"
    ],
    normalize: [
      "It makes sense to feel this.",
      "Your body is doing its best to protect you.",
      "We're just noticing—no fixing required."
    ]
  },

  reframeCues: [
    "Is there a kinder sentence you could try?",
    "What would you say to a friend in this moment?",
    "What's one small step that doesn't cost too much energy?",
    "Can you trade 'always' for 'sometimes'?"
  ],

  reflectionPrompts: [
    "What helped, even 1%?",
    "What felt too much (so we can adjust next time)?",
    "What do you want to remember from this?",
    "What's one gentle thing you'll do next?"
  ],

  closers: [
    "You did enough for today.",
    "Notice one thing that feels slightly easier.",
    "Take one last look around—remind your body you're here, now.",
    "If you want, drink water or stretch."
  ],

  navigation: {
    nextStep: [
      "If you want another option, try…",
      "Next gentle step: …",
      "Prefer something quieter? Try…"
    ],
    returnLinks: [
      "Back to Wellness Hub",
      "Choose another practice"
    ]
  }
};

/**
 * Simple deterministic hash function for route-based selection.
 * Returns a stable index for any route string.
 */
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

/**
 * Get a deterministic item from an array based on route.
 * @param {string} route - The route path (e.g., "/breathing")
 * @param {Array} arr - The array to select from
 * @param {number} offset - Optional offset for variety within same route
 * @returns {string} - The selected item
 */
export function pickByRoute(route, arr, offset = 0) {
  if (!arr || arr.length === 0) return '';
  const index = (simpleHash(route) + offset) % arr.length;
  return arr[index];
}

/**
 * Get complete microcopy set for a wellness route.
 * Returns deterministic, consistent selections for all categories.
 * @param {string} route - The route path
 * @returns {Object} - Complete microcopy selections for the route
 */
export function getMicrocopyForRoute(route) {
  return {
    permission: pickByRoute(route, microcopy.permission, 0),
    whatToExpect: pickByRoute(route, microcopy.whatToExpect, 1),
    safety: pickByRoute(route, microcopy.safety, 2),
    stopNote: pickByRoute(route, microcopy.stopNotes, 3),
    bodyCue: pickByRoute(route, microcopy.bodyCues, 4),
    breathCue: pickByRoute(route, microcopy.breathCues, 5),
    groundingCue: pickByRoute(route, microcopy.groundingCues, 6),
    closer: pickByRoute(route, microcopy.closers, 7),
    tierLabels: {
      beginner: pickByRoute(route, microcopy.tierLabels.beginner, 8),
      intermediate: pickByRoute(route, microcopy.tierLabels.intermediate, 9),
      advanced: pickByRoute(route, microcopy.tierLabels.advanced, 10)
    },
    cta: {
      beginner: pickByRoute(route, microcopy.cta.beginner, 11),
      intermediate: pickByRoute(route, microcopy.cta.intermediate, 12),
      advanced: pickByRoute(route, microcopy.cta.advanced, 13)
    },
    reflection: pickByRoute(route, microcopy.reflectionPrompts, 14),
    navigation: {
      nextStep: pickByRoute(route, microcopy.navigation.nextStep, 15),
      returnLink: pickByRoute(route, microcopy.navigation.returnLinks, 16)
    }
  };
}

/**
 * Generate microcopy seed map for all wellness routes.
 * Useful for auditing and ensuring variety.
 * @param {string[]} routes - Array of route paths
 * @returns {Object} - Map of route → microcopy selections
 */
export function generateMicropySeedMap(routes) {
  const map = {};
  routes.forEach(route => {
    map[route] = getMicrocopyForRoute(route);
  });
  return map;
}

export default microcopy;
