import express from "express";

const router = express.Router();

const CREATIVE_TECHNIQUES = [
  {
    name: "SCAMPER",
    description: "Systematic creativity through modification of existing ideas.",
    prompts: [
      "Substitute: What can be replaced?",
      "Combine: What can be merged?",
      "Adapt: What can be borrowed from elsewhere?",
      "Modify: What can be changed in form or quality?",
      "Put to other uses: What else could this be used for?",
      "Eliminate: What can be removed?",
      "Reverse/Rearrange: What if we flip or reorder?"
    ]
  },
  {
    name: "Six Thinking Hats",
    description: "Parallel thinking through distinct perspectives.",
    hats: [
      { color: "White", focus: "Facts and information" },
      { color: "Red", focus: "Emotions and intuition" },
      { color: "Black", focus: "Critical judgment and risks" },
      { color: "Yellow", focus: "Optimism and benefits" },
      { color: "Green", focus: "Creativity and alternatives" },
      { color: "Blue", focus: "Process and organization" }
    ]
  },
  {
    name: "Random Entry",
    description: "Use random stimuli to trigger new associations.",
    method: "Select a random word, image, or object and force connections to your challenge.",
    examples: ["Random word generator", "Dictionary page flip", "Museum visit", "Nature walk observations"]
  },
  {
    name: "Morphological Analysis",
    description: "Systematic combination of problem dimensions.",
    steps: ["List problem dimensions", "Generate options for each dimension", "Combine options systematically", "Evaluate promising combinations"]
  },
  {
    name: "Reverse Brainstorming",
    description: "Generate ideas by considering how to cause the problem.",
    steps: ["Ask: How could we cause or worsen this problem?", "Generate negative ideas freely", "Reverse each negative idea into a positive solution"]
  },
  {
    name: "Assumption Reversal",
    description: "Challenge fundamental assumptions about the problem.",
    method: "List all assumptions about the situation, then systematically reverse or question each one."
  },
  {
    name: "Analogical Thinking",
    description: "Transfer solutions from one domain to another.",
    prompts: ["How does nature solve this?", "How do other industries handle this?", "What if this were a [different domain] problem?"]
  },
  {
    name: "Bisociation",
    description: "Combine two unrelated matrices of thought to create novel ideas.",
    method: "Take concepts from different domains and force unexpected connections."
  }
];

const PROBLEM_FRAMING = [
  {
    name: "Problem Reframing",
    description: "View the same challenge from multiple angles.",
    frames: [
      "User perspective: What does the user actually need?",
      "System perspective: What would the ideal system look like?",
      "Time perspective: How would this look in 10 years?",
      "Constraint removal: What if we had unlimited resources?",
      "Opposite perspective: What if we tried to fail?"
    ]
  },
  {
    name: "Five Whys",
    description: "Drill down to root causes through repeated questioning.",
    method: "Ask 'Why?' five times to move from symptoms to fundamental causes."
  },
  {
    name: "How Might We",
    description: "Reframe challenges as opportunity questions.",
    template: "How might we [action] for [user] so that [outcome]?"
  },
  {
    name: "Challenge Mapping",
    description: "Break complex challenges into manageable sub-challenges.",
    steps: ["State the main challenge", "Identify sub-challenges", "Prioritize by impact and tractability", "Address sequentially"]
  }
];

const IDEATION_PRINCIPLES = [
  {
    principle: "Defer Judgment",
    description: "Separate idea generation from evaluation to maximize creative output."
  },
  {
    principle: "Go for Quantity",
    description: "Generate many ideas before selecting; quality emerges from quantity."
  },
  {
    principle: "Build on Ideas",
    description: "Use 'Yes, and...' to extend and combine ideas rather than critique."
  },
  {
    principle: "Seek Wild Ideas",
    description: "Encourage seemingly impossible ideas; they often lead to breakthrough innovations."
  },
  {
    principle: "Stay Visual",
    description: "Sketch, diagram, and prototype to make abstract ideas concrete."
  },
  {
    principle: "One Conversation",
    description: "Focus group attention on one idea at a time for deeper exploration."
  }
];

const CREATIVE_BLOCKS = [
  {
    block: "Perfectionism",
    description: "Fear of producing imperfect work inhibits starting.",
    solution: "Embrace 'good enough' first drafts; iterate toward excellence."
  },
  {
    block: "Functional Fixedness",
    description: "Seeing objects only in their conventional uses.",
    solution: "Practice seeing multiple uses for everyday objects."
  },
  {
    block: "Fear of Failure",
    description: "Avoiding risk to prevent potential failure.",
    solution: "Reframe failures as learning experiments; celebrate productive failures."
  },
  {
    block: "Expertise Trap",
    description: "Deep expertise can create tunnel vision.",
    solution: "Seek input from beginners and adjacent fields."
  },
  {
    block: "Premature Closure",
    description: "Settling on first adequate solution.",
    solution: "Set minimum idea quotas before evaluating."
  }
];

router.get("/techniques", (_req, res) => {
  res.json({ ok: true, techniques: CREATIVE_TECHNIQUES });
});

router.get("/framing", (_req, res) => {
  res.json({ ok: true, frameworks: PROBLEM_FRAMING });
});

router.get("/principles", (_req, res) => {
  res.json({ ok: true, principles: IDEATION_PRINCIPLES });
});

router.get("/blocks", (_req, res) => {
  res.json({ ok: true, blocks: CREATIVE_BLOCKS });
});

router.get("/daily", (_req, res) => {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  
  const technique = CREATIVE_TECHNIQUES[dayOfYear % CREATIVE_TECHNIQUES.length];
  const frame = PROBLEM_FRAMING[dayOfYear % PROBLEM_FRAMING.length];
  const principle = IDEATION_PRINCIPLES[dayOfYear % IDEATION_PRINCIPLES.length];
  const block = CREATIVE_BLOCKS[dayOfYear % CREATIVE_BLOCKS.length];
  
  res.json({
    ok: true,
    daily: {
      technique,
      framingMethod: frame,
      principle,
      blockToWatch: block,
      creativityChallenge: `Apply "${technique.name}" to a current challenge: ${technique.description}`
    }
  });
});


// Health check endpoint for admin daily tools monitoring
router.get("/", (req, res) => {
  res.json({ ok: true, module: "creativity", status: "operational", timestamp: new Date().toISOString() });
});

export default router;
