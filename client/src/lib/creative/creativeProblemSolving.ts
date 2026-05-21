export interface CreativeProblem {
  id: string;
  title: string;
  description: string;
  constraints: string[];
  assumptions: string[];
  reframings: ProblemReframe[];
  ideas: Idea[];
  selectedSolution: string;
  timestamp: string;
}

export interface ProblemReframe {
  original: string;
  reframed: string;
  technique: string;
}

export interface Idea {
  id: string;
  description: string;
  technique: string;
  feasibility: 1 | 2 | 3 | 4 | 5;
  novelty: 1 | 2 | 3 | 4 | 5;
  appeal: 1 | 2 | 3 | 4 | 5;
  notes: string;
}

export interface CreativeProfile {
  problems: CreativeProblem[];
  favoriteTools: string[];
  insightLog: { date: string; insight: string }[];
}

export const CREATIVE_TECHNIQUES = {
  divergent: [
    {
      name: "SCAMPER",
      description: "Substitute, Combine, Adapt, Modify, Put to other uses, Eliminate, Reverse",
      prompts: [
        "What can you substitute?",
        "What can you combine?",
        "What can you adapt from elsewhere?",
        "What can you modify, magnify, or minimize?",
        "What other uses could this have?",
        "What can you eliminate?",
        "What if you reversed the order or relationship?"
      ]
    },
    {
      name: "Random Entry",
      description: "Use random words or images to spark new connections",
      prompts: [
        "Pick a random word. How does it connect to your problem?",
        "What if your solution had to include this unrelated element?",
        "Force a connection between your problem and something completely different."
      ]
    },
    {
      name: "Assumption Reversal",
      description: "List assumptions and systematically reverse them",
      prompts: [
        "What are you assuming must be true?",
        "What if the opposite were true?",
        "Which assumption, if wrong, changes everything?"
      ]
    },
    {
      name: "Analogy Thinking",
      description: "Find solutions in other domains",
      prompts: [
        "How does nature solve this problem?",
        "What industry has solved a similar problem?",
        "If this were a different type of problem entirely, what would the solution be?"
      ]
    }
  ],
  convergent: [
    {
      name: "Six Thinking Hats",
      description: "Evaluate from multiple perspectives systematically",
      hats: [
        { color: "white", focus: "Facts and information" },
        { color: "red", focus: "Feelings and intuition" },
        { color: "black", focus: "Caution and risks" },
        { color: "yellow", focus: "Benefits and value" },
        { color: "green", focus: "Creativity and alternatives" },
        { color: "blue", focus: "Process and meta-thinking" }
      ]
    },
    {
      name: "PMI Analysis",
      description: "Plus, Minus, Interesting evaluation",
      prompts: [
        "What are the positive aspects?",
        "What are the negative aspects?",
        "What is interesting or worth exploring further?"
      ]
    },
    {
      name: "Weighted Criteria",
      description: "Score ideas against prioritized criteria",
      prompts: [
        "What criteria matter most for success?",
        "How does each idea score against these criteria?",
        "What trade-offs are you willing to make?"
      ]
    }
  ]
} as const;

export const STORAGE_KEY = "glp_creative_problems";

export function loadCreativeProfile(): CreativeProfile {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) { console.error(e); }
  return { problems: [], favoriteTools: [], insightLog: [] };
}

export function saveCreativeProfile(profile: CreativeProfile): void {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(profile)); } catch (err) { console.warn("[storage-safe-write]", err); }
}
