/**
 * Ethical NLP Patterns Library
 * Educational, non-manipulative, consent-based
 * 
 * Used ONLY for: self-talk reframing, goal clarity, language awareness, identity reinforcement
 * 
 * GUARDRAILS:
 * - No hypnosis
 * - No embedded commands
 * - No coercive persuasion
 * - No subconscious claims
 */

export const nlpPatterns = {
  futurePacing: {
    description: "Gentle visualization of positive outcomes",
    patterns: [
      "If this worked, what would be different?",
      "Imagine yourself three months from now, having practiced this regularly. What do you notice?",
      "What would your future self thank you for today?",
      "Picture a moment when this feels natural. What does that look like?",
      "How might you feel after taking this step?",
      "What would change if this became easier over time?"
    ]
  },
  
  identityStatements: {
    description: "Positive self-identification for growth mindset",
    patterns: [
      "I'm someone who practices self-compassion.",
      "I'm learning to honor my needs.",
      "I'm becoming someone who sets boundaries with love.",
      "I choose to be kind to myself, especially when it's hard.",
      "I'm building a life that reflects my values.",
      "I'm someone who takes small, meaningful steps.",
      "I'm worthy of the care I give others.",
      "I'm learning that rest is productive."
    ]
  },
  
  reframing: {
    description: "Alternative perspectives on challenging situations",
    patterns: [
      "Another way to look at this might be…",
      "What if this is information, not failure?",
      "What would a compassionate friend say about this?",
      "Is there a gentler story you could tell about this?",
      "What would change if you saw this as practice, not performance?",
      "What if 'not yet' is different from 'never'?",
      "How might this look from a place of curiosity instead of judgment?"
    ]
  },
  
  anchoringPresence: {
    description: "Grounding in the present moment",
    patterns: [
      "Right now, in this moment, you are safe.",
      "Take a breath. You're here. That's enough.",
      "Notice where your feet meet the ground.",
      "What's one thing you can see, hear, or feel right now?",
      "This moment is manageable. You don't have to solve everything."
    ]
  },
  
  languageAwareness: {
    description: "Noticing and shifting limiting language",
    shifts: [
      { from: "I have to", to: "I choose to" },
      { from: "I can't", to: "I'm learning to" },
      { from: "I should", to: "I could" },
      { from: "I always fail", to: "I'm still figuring this out" },
      { from: "I'm broken", to: "I'm healing" },
      { from: "It's impossible", to: "It's unfamiliar" },
      { from: "I'm not enough", to: "I'm growing" },
      { from: "I'm a mess", to: "I'm human" }
    ]
  },
  
  valuesElicitation: {
    description: "Connecting actions to core values",
    patterns: [
      "What value does this connect to for you?",
      "What matters most about this?",
      "If you were living fully aligned with your values, what would you do?",
      "What does your wisest self know about this?",
      "What would honor both your needs and your values here?"
    ]
  },
  
  resourcefulStates: {
    description: "Accessing inner resources",
    patterns: [
      "Think of a time you felt calm and capable. What was present?",
      "What strength have you used before that could help now?",
      "Who in your life (real or imagined) would offer wise support?",
      "What would you tell a friend in this situation?",
      "What does your body know about finding calm?"
    ]
  }
};

export const affirmationTemplates = {
  morning: [
    "Today, I choose {value} over perfection.",
    "I give myself permission to {action} without guilt.",
    "I'm allowed to take up space and have needs.",
    "My worth isn't measured by my productivity.",
    "I trust myself to handle what comes."
  ],
  challenge: [
    "This is hard, and I can do hard things.",
    "I don't have to be perfect to be worthy.",
    "Struggle is part of growth, not evidence of failure.",
    "I can ask for help when I need it.",
    "My feelings are valid, even when they're uncomfortable."
  ],
  evening: [
    "I did enough today.",
    "I release what I couldn't control.",
    "Tomorrow is a fresh start.",
    "I'm proud of myself for {accomplishment}.",
    "Rest is a gift I give myself."
  ]
};

export const reflectionCards = {
  identity: [
    { prompt: "I am someone who...", examples: ["shows up for myself", "practices patience", "honors my needs"] },
    { prompt: "I'm learning to...", examples: ["trust my instincts", "set loving boundaries", "rest without guilt"] },
    { prompt: "I choose to...", examples: ["respond rather than react", "prioritize my wellbeing", "speak kindly to myself"] }
  ],
  growth: [
    { prompt: "One thing I'm proud of:", examples: ["showing up today", "asking for help", "trying something new"] },
    { prompt: "Something I'm releasing:", examples: ["the need to be perfect", "old stories about myself", "others' expectations"] },
    { prompt: "What I'm cultivating:", examples: ["patience", "self-trust", "inner peace"] }
  ]
};

export function getLanguageShift(limitingPhrase) {
  const shifts = nlpPatterns.languageAwareness.shifts;
  const match = shifts.find(s => limitingPhrase.toLowerCase().includes(s.from.toLowerCase()));
  return match ? match.to : null;
}

export function getRandomPattern(category) {
  const categoryData = nlpPatterns[category];
  if (!categoryData) return null;
  const patterns = categoryData.patterns || categoryData.shifts;
  return patterns[Math.floor(Math.random() * patterns.length)];
}

export function generateAffirmation(timeOfDay, values = {}) {
  const templates = affirmationTemplates[timeOfDay] || affirmationTemplates.morning;
  let affirmation = templates[Math.floor(Math.random() * templates.length)];
  
  Object.entries(values).forEach(([key, value]) => {
    affirmation = affirmation.replace(`{${key}}`, value);
  });
  
  return affirmation;
}

export default {
  patterns: nlpPatterns,
  affirmations: affirmationTemplates,
  cards: reflectionCards,
  getShift: getLanguageShift,
  random: getRandomPattern,
  generate: generateAffirmation
};
