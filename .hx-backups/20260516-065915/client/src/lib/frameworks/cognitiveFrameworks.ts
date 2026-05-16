export interface CognitiveFramework {
  id: string;
  name: string;
  category: "philosophy" | "psychology" | "systems" | "decision" | "creativity" | "metacognition";
  description: string;
  steps: string[];
  question: string;
  source: string;
  difficulty: "foundational" | "intermediate" | "advanced";
}

export const COGNITIVE_FRAMEWORKS: CognitiveFramework[] = [
  {
    id: "first-principles",
    name: "First Principles Thinking",
    category: "decision",
    description: "Break down complex problems to their fundamental truths and rebuild from there.",
    steps: [
      "Identify the problem or belief you're examining",
      "Break it down to its most basic components",
      "Question every assumption—what do you know to be absolutely true?",
      "Rebuild your understanding from these foundational truths"
    ],
    question: "What fundamental truths remain when you strip away all assumptions?",
    source: "Aristotle / Elon Musk",
    difficulty: "intermediate"
  },
  {
    id: "inversion",
    name: "Inversion",
    category: "decision",
    description: "Instead of asking how to succeed, ask what would guarantee failure—then avoid those things.",
    steps: [
      "Define what you want to achieve",
      "Invert: What would guarantee failure?",
      "List all the ways you could fail",
      "Systematically avoid each failure mode"
    ],
    question: "What would absolutely guarantee the opposite of what you want?",
    source: "Charlie Munger / Carl Jacobi",
    difficulty: "foundational"
  },
  {
    id: "second-order",
    name: "Second-Order Thinking",
    category: "systems",
    description: "Consider not just immediate consequences, but the consequences of consequences.",
    steps: [
      "Identify the immediate effect of a decision",
      "Ask: And then what? What happens next?",
      "Continue asking 'and then what?' at least 3 times",
      "Map out the cascade of effects"
    ],
    question: "What happens after what happens next?",
    source: "Howard Marks",
    difficulty: "intermediate"
  },
  {
    id: "hanlon-razor",
    name: "Hanlon's Razor",
    category: "psychology",
    description: "Never attribute to malice what can be explained by ignorance, overwhelm, or different priorities.",
    steps: [
      "Notice when you assume someone acted with bad intent",
      "Generate alternative explanations: incompetence, busy, stressed, different values",
      "Consider which explanation is most likely given what you know",
      "Respond to the most charitable interpretation"
    ],
    question: "What explanation doesn't require assuming bad intent?",
    source: "Robert J. Hanlon",
    difficulty: "foundational"
  },
  {
    id: "steel-man",
    name: "Steel-Manning",
    category: "philosophy",
    description: "Argue against the strongest version of an opposing position, not the weakest.",
    steps: [
      "Identify the opposing viewpoint",
      "Ask: What's the best possible argument for this position?",
      "Strengthen their argument beyond how they presented it",
      "Only then formulate your response"
    ],
    question: "What's the strongest form of the argument you disagree with?",
    source: "Philosophical tradition",
    difficulty: "advanced"
  },
  {
    id: "regret-minimization",
    name: "Regret Minimization Framework",
    category: "decision",
    description: "Project yourself to age 80 and ask which choice minimizes lifetime regret.",
    steps: [
      "Imagine yourself at 80 years old, looking back on your life",
      "Consider the decision you're facing today",
      "Ask: Which choice would I regret NOT taking?",
      "Let that answer guide your present decision"
    ],
    question: "At 80, which choice would you regret not taking?",
    source: "Jeff Bezos",
    difficulty: "foundational"
  },
  {
    id: "circle-of-concern",
    name: "Circle of Concern vs. Control",
    category: "psychology",
    description: "Distinguish between what worries you and what you can actually influence.",
    steps: [
      "List everything currently on your mind",
      "Draw two circles: outer (concern) and inner (control)",
      "Place each item in the appropriate circle",
      "Focus energy only on the inner circle"
    ],
    question: "What can you actually influence right now?",
    source: "Stephen Covey",
    difficulty: "foundational"
  },
  {
    id: "via-negativa",
    name: "Via Negativa",
    category: "philosophy",
    description: "Improve by subtraction rather than addition. What should you stop doing?",
    steps: [
      "List what you're currently doing in a life area",
      "Instead of adding, ask: What should I remove?",
      "Identify what's causing more harm than good",
      "Subtract before you add"
    ],
    question: "What would improve your life by its absence?",
    source: "Nassim Taleb / Apophatic theology",
    difficulty: "intermediate"
  },
  {
    id: "map-territory",
    name: "Map vs. Territory",
    category: "metacognition",
    description: "Your mental model of reality is not reality itself. Where is your map wrong?",
    steps: [
      "Identify a belief you hold strongly",
      "Recognize this is your map, not the territory",
      "Look for evidence that contradicts your map",
      "Update your map based on new territory data"
    ],
    question: "Where might your mental map differ from reality?",
    source: "Alfred Korzybski",
    difficulty: "advanced"
  },
  {
    id: "emergence",
    name: "Emergent Properties Thinking",
    category: "systems",
    description: "Complex systems produce behaviors that can't be predicted from individual parts.",
    steps: [
      "Identify the system you're analyzing",
      "List the individual components",
      "Notice: What properties exist in the whole that don't exist in the parts?",
      "Work with the emergent properties, not just the components"
    ],
    question: "What properties emerge from the interaction of parts?",
    source: "Systems Theory",
    difficulty: "advanced"
  },
  {
    id: "pre-mortem",
    name: "Pre-Mortem Analysis",
    category: "decision",
    description: "Before starting, imagine the project has failed. What went wrong?",
    steps: [
      "Imagine the project/decision is 6 months in the future and has failed",
      "Write the story of how it failed",
      "Identify the most likely failure modes from your story",
      "Build safeguards against each failure mode now"
    ],
    question: "If this fails, what will have been the cause?",
    source: "Gary Klein",
    difficulty: "intermediate"
  },
  {
    id: "paradox-integration",
    name: "Paradox Integration",
    category: "philosophy",
    description: "Instead of choosing between opposites, find how both can be true simultaneously.",
    steps: [
      "Identify the apparent contradiction or dilemma",
      "Instead of either/or, ask: How might both be true?",
      "Look for a higher-level synthesis that contains both",
      "Hold the tension without resolving it prematurely"
    ],
    question: "How might both opposing truths be valid?",
    source: "Dialectical thinking / Ken Wilber",
    difficulty: "advanced"
  }
];

export function getFrameworksByCategory(category: CognitiveFramework["category"]): CognitiveFramework[] {
  return COGNITIVE_FRAMEWORKS.filter(f => f.category === category);
}

export function getFrameworksByDifficulty(difficulty: CognitiveFramework["difficulty"]): CognitiveFramework[] {
  return COGNITIVE_FRAMEWORKS.filter(f => f.difficulty === difficulty);
}

export function getRandomFramework(): CognitiveFramework {
  return COGNITIVE_FRAMEWORKS[Math.floor(Math.random() * COGNITIVE_FRAMEWORKS.length)];
}

export function getDailyFramework(): CognitiveFramework {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return COGNITIVE_FRAMEWORKS[dayOfYear % COGNITIVE_FRAMEWORKS.length];
}
