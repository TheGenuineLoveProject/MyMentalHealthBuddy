import { Router } from "express";

const router = Router();

const COGNITIVE_FRAMEWORKS = [
  {
    id: "first-principles",
    name: "First Principles Thinking",
    category: "Foundational Reasoning",
    description: "Break down complex problems to fundamental truths and build up from there",
    difficulty: "advanced",
    applications: ["Problem solving", "Innovation", "Decision making"],
    steps: [
      "Identify and define the problem clearly",
      "Break down the problem into basic elements",
      "Question every assumption",
      "Identify fundamental truths (first principles)",
      "Create new solutions from first principles",
      "Test and iterate"
    ],
    examples: [
      { context: "Elon Musk on batteries", insight: "Instead of accepting battery costs, ask: What are batteries made of? What's the commodity cost?" },
      { context: "Personal growth", insight: "Instead of 'I can't change', ask: What specifically prevents change? Is that truly unchangeable?" }
    ],
    practicePrompts: [
      "What assumptions am I making that I haven't questioned?",
      "If I had to rebuild this from scratch, what would remain essential?",
      "What would a beginner without my assumptions see differently?"
    ]
  },
  {
    id: "inversion",
    name: "Inversion Thinking",
    category: "Foundational Reasoning",
    description: "Approach problems backward - instead of how to succeed, ask how to fail",
    difficulty: "intermediate",
    applications: ["Risk management", "Goal setting", "Problem prevention"],
    steps: [
      "Define your goal or desired outcome",
      "Invert: What would guarantee failure?",
      "List all ways to fail comprehensively",
      "Invert again: How to avoid each failure mode?",
      "Create prevention strategies",
      "Act on the inverted insights"
    ],
    examples: [
      { context: "Building a great relationship", insight: "Ask: How would I destroy this relationship? Then do the opposite." },
      { context: "Career success", insight: "List: What would guarantee career failure? Avoid those systematically." }
    ],
    practicePrompts: [
      "What's the fastest way to fail at this goal?",
      "What would my worst enemy do if they wanted me to fail?",
      "What am I doing that's on my 'failure list'?"
    ]
  },
  {
    id: "second-order-thinking",
    name: "Second-Order Thinking",
    category: "Consequential Analysis",
    description: "Think beyond immediate consequences to the consequences of consequences",
    difficulty: "intermediate",
    applications: ["Long-term planning", "Policy analysis", "Life decisions"],
    steps: [
      "Identify the decision or action",
      "List all first-order consequences",
      "For each, ask: And then what?",
      "Map out second, third, nth order effects",
      "Identify unintended consequences",
      "Weigh short-term vs long-term tradeoffs"
    ],
    examples: [
      { context: "Taking a high-paying job", insight: "First: More money. Second: Less time. Third: Strained relationships. Fourth: Regret?" },
      { context: "Avoiding difficult conversation", insight: "First: Temporary peace. Second: Resentment builds. Third: Relationship deteriorates." }
    ],
    practicePrompts: [
      "What will happen as a result of this decision?",
      "And then what? (Ask 5 times)",
      "Who else will be affected and how will they respond?"
    ]
  },
  {
    id: "probabilistic-thinking",
    name: "Probabilistic Thinking",
    category: "Decision Science",
    description: "Think in probabilities rather than certainties for better calibration",
    difficulty: "advanced",
    applications: ["Risk assessment", "Forecasting", "Betting decisions"],
    steps: [
      "Identify what you're trying to predict",
      "Establish base rates (how often does this happen?)",
      "Identify factors that update the probability",
      "Assign confidence intervals, not point estimates",
      "Update beliefs with new information",
      "Track predictions to improve calibration"
    ],
    examples: [
      { context: "Career change", insight: "Not 'Will I succeed?' but 'What's my probability of success and what would update it?'" },
      { context: "Relationship", insight: "Not 'Will this work?' but 'Given X factors, what's the probability range?'" }
    ],
    practicePrompts: [
      "What's the base rate for this outcome?",
      "What evidence would make me more/less confident?",
      "Am I thinking in probabilities or false certainties?"
    ]
  },
  {
    id: "opportunity-cost",
    name: "Opportunity Cost Analysis",
    category: "Economic Thinking",
    description: "Every choice has a cost - what are you giving up?",
    difficulty: "beginner",
    applications: ["Time management", "Resource allocation", "Life choices"],
    steps: [
      "Identify the choice at hand",
      "List what you gain from this choice",
      "List what you must give up (alternatives)",
      "Quantify the alternatives if possible",
      "Compare: Is the gain worth the cost?",
      "Consider non-obvious opportunity costs"
    ],
    examples: [
      { context: "Watching 2 hours of TV", insight: "Opportunity cost: Could have exercised, learned something, connected with loved ones" },
      { context: "Staying in comfortable job", insight: "Opportunity cost: Growth, adventure, potentially higher fulfillment elsewhere" }
    ],
    practicePrompts: [
      "What am I saying no to when I say yes to this?",
      "What's the best alternative use of this resource?",
      "Am I considering invisible opportunity costs?"
    ]
  },
  {
    id: "systems-thinking",
    name: "Systems Thinking",
    category: "Complexity Science",
    description: "See interconnections, feedback loops, and emergent properties",
    difficulty: "advanced",
    applications: ["Understanding complex situations", "Organizational change", "Personal ecology"],
    steps: [
      "Identify the system boundaries",
      "Map the key elements and their relationships",
      "Identify feedback loops (reinforcing and balancing)",
      "Find leverage points (where small changes have big effects)",
      "Look for emergent properties",
      "Consider delays and non-linear effects"
    ],
    examples: [
      { context: "Stress management", insight: "Stress → poor sleep → worse decisions → more stress (reinforcing loop). Where to intervene?" },
      { context: "Habit change", insight: "New habit → small win → motivation → consistency → identity shift (reinforcing loop to harness)" }
    ],
    practicePrompts: [
      "What are the feedback loops in this situation?",
      "Where would a small change have the biggest impact?",
      "What emergent effects am I not seeing?"
    ]
  },
  {
    id: "steelmanning",
    name: "Steelmanning",
    category: "Argumentation",
    description: "Argue against the strongest version of opposing views, not the weakest",
    difficulty: "intermediate",
    applications: ["Debate", "Understanding others", "Self-examination"],
    steps: [
      "Identify the opposing viewpoint",
      "Find the best argument for that view",
      "Make it even stronger than proponents do",
      "Only then, critique the strongest version",
      "Update your own view based on insights",
      "Synthesize what's true in both positions"
    ],
    examples: [
      { context: "Political disagreement", insight: "Before critiquing, ask: What would the smartest, most charitable version of this view be?" },
      { context: "Personal beliefs", insight: "Can you argue better for the opposite of your beliefs than believers can?" }
    ],
    practicePrompts: [
      "What's the strongest argument against my position?",
      "How would the smartest proponent of the opposing view respond?",
      "What truth am I missing in the other perspective?"
    ]
  },
  {
    id: "via-negativa",
    name: "Via Negativa",
    category: "Subtractive Wisdom",
    description: "Improve by removing rather than adding",
    difficulty: "intermediate",
    applications: ["Lifestyle design", "Writing", "Product development"],
    steps: [
      "Identify what you want to improve",
      "List what's currently present",
      "Identify what's harmful or unnecessary",
      "Remove the negative before adding positive",
      "Observe the improvement from subtraction",
      "Only then consider additions"
    ],
    examples: [
      { context: "Health", insight: "Before adding supplements, remove: processed food, excess sugar, sedentary behavior" },
      { context: "Happiness", insight: "Before adding activities, remove: toxic relationships, energy drains, commitments that don't serve" }
    ],
    practicePrompts: [
      "What should I stop doing before I add new things?",
      "What's the downside I should eliminate first?",
      "What would I remove if I could only subtract, not add?"
    ]
  },
  {
    id: "occams-razor",
    name: "Occam's Razor",
    category: "Parsimony",
    description: "The simplest explanation is usually correct",
    difficulty: "beginner",
    applications: ["Problem diagnosis", "Theory selection", "Decision making"],
    steps: [
      "Generate multiple explanations for the observation",
      "Count the assumptions each explanation requires",
      "Favor explanations with fewer assumptions",
      "But don't oversimplify complex realities",
      "Test the simple explanation first",
      "Add complexity only when evidence demands"
    ],
    examples: [
      { context: "Friend not texting back", insight: "Simple: They're busy. Complex: They hate you, are plotting against you..." },
      { context: "Project failing", insight: "Simple: Poor planning. Complex: Conspiracy of incompetence and bad luck." }
    ],
    practicePrompts: [
      "What's the simplest explanation that accounts for the facts?",
      "Am I adding unnecessary complexity to my interpretation?",
      "What assumptions does my explanation require?"
    ]
  },
  {
    id: "hanlon-razor",
    name: "Hanlon's Razor",
    category: "Interpersonal Wisdom",
    description: "Never attribute to malice what can be explained by ignorance or incompetence",
    difficulty: "beginner",
    applications: ["Relationships", "Conflict resolution", "Workplace dynamics"],
    steps: [
      "Notice when you're attributing negative intent",
      "Ask: Could this be explained without malice?",
      "Consider: ignorance, mistake, different priorities",
      "Assume the charitable interpretation first",
      "Verify before escalating",
      "Respond to actions, not assumed intentions"
    ],
    examples: [
      { context: "Colleague taking credit", insight: "Possibly: They forgot you contributed, not deliberately stealing credit" },
      { context: "Partner forgetting anniversary", insight: "Possibly: Stressed and forgetful, not uncaring" }
    ],
    practicePrompts: [
      "Could this be explained without assuming bad intent?",
      "What would a charitable interpretation look like?",
      "Am I responding to actions or my assumptions about motives?"
    ]
  },
  {
    id: "regret-minimization",
    name: "Regret Minimization Framework",
    category: "Life Design",
    description: "Make decisions that minimize future regret",
    difficulty: "beginner",
    applications: ["Major life decisions", "Career choices", "Relationship decisions"],
    steps: [
      "Project yourself to age 80",
      "Look back at the decision from there",
      "Ask: Which choice would I regret not taking?",
      "Consider regrets of action vs inaction",
      "Choose to minimize lifetime regret",
      "Act accordingly"
    ],
    examples: [
      { context: "Leaving stable job for startup", insight: "At 80: Would I regret not trying? Probably. Would I regret trying and failing? Less likely." },
      { context: "Ending relationship", insight: "At 80: Would I regret staying in something unfulfilling? Or regret not giving it more time?" }
    ],
    practicePrompts: [
      "When I'm 80, what will I regret not doing?",
      "Is this a regret of action or inaction?",
      "What would my future self advise?"
    ]
  },
  {
    id: "circle-of-competence",
    name: "Circle of Competence",
    category: "Self-Knowledge",
    description: "Know what you know and operate primarily within that domain",
    difficulty: "intermediate",
    applications: ["Career focus", "Investment", "Self-awareness"],
    steps: [
      "Honestly assess what you truly understand",
      "Distinguish: genuine competence vs familiarity",
      "Define the boundaries of your circle",
      "Operate primarily within your circle",
      "Expand gradually at the edges",
      "Seek experts for outside-circle decisions"
    ],
    examples: [
      { context: "Investment", insight: "Buffett: I invest in what I understand. Banks confused me, so I avoided them." },
      { context: "Giving advice", insight: "Ask: Is this within my genuine expertise or am I extrapolating?" }
    ],
    practicePrompts: [
      "Is this within my circle of genuine competence?",
      "Am I confusing familiarity with true understanding?",
      "Who has this in their circle that I should consult?"
    ]
  },
  {
    id: "margin-of-safety",
    name: "Margin of Safety",
    category: "Risk Management",
    description: "Build buffers for the unexpected",
    difficulty: "beginner",
    applications: ["Planning", "Finance", "Health"],
    steps: [
      "Estimate what you need",
      "Add buffer for uncertainty (15-50%)",
      "Plan for worse-than-expected outcomes",
      "Build reserves before they're needed",
      "Don't optimize away all slack",
      "Prepare for Black Swans"
    ],
    examples: [
      { context: "Financial planning", insight: "Don't spend to the limit. Keep 6 months expenses as buffer." },
      { context: "Time management", insight: "If task takes 1 hour, schedule 1.5. Reality rarely runs ahead of schedule." }
    ],
    practicePrompts: [
      "What buffer am I building for the unexpected?",
      "Am I optimizing away all slack?",
      "What would happen if this went worse than expected?"
    ]
  },
  {
    id: "map-territory",
    name: "Map-Territory Distinction",
    category: "Epistemology",
    description: "The map is not the territory - our models aren't reality",
    difficulty: "advanced",
    applications: ["Critical thinking", "Belief updating", "Avoiding dogma"],
    steps: [
      "Identify your mental model of the situation",
      "Recognize: this is a map, not reality",
      "Ask: Where might my map be wrong?",
      "Look for evidence that doesn't fit the map",
      "Update the map when reality contradicts it",
      "Hold models lightly"
    ],
    examples: [
      { context: "Self-concept", insight: "Your identity is a map of yourself. When it doesn't fit reality, update the map." },
      { context: "Relationship expectations", insight: "Your model of your partner is not your partner. Notice the difference." }
    ],
    practicePrompts: [
      "Where might my mental model be inaccurate?",
      "What evidence would show my map is wrong?",
      "Am I confusing my map with the territory?"
    ]
  },
  {
    id: "antifragility",
    name: "Antifragility",
    category: "Systems Resilience",
    description: "Build systems that gain from disorder",
    difficulty: "advanced",
    applications: ["Career design", "Health", "Life strategy"],
    steps: [
      "Assess: Are you fragile, robust, or antifragile?",
      "Fragile: harmed by volatility",
      "Robust: unaffected by volatility", 
      "Antifragile: gains from volatility",
      "Design life to benefit from stressors",
      "Embrace bounded volatility, avoid catastrophic risk"
    ],
    examples: [
      { context: "Career", insight: "Fragile: One employer. Robust: Multiple skills. Antifragile: Skills that gain from change." },
      { context: "Health", insight: "Muscles are antifragile - stress makes them stronger. Design for beneficial stress." }
    ],
    practicePrompts: [
      "Does this system gain or lose from volatility?",
      "How can I make myself antifragile to this stressor?",
      "Am I avoiding all stress or embracing beneficial stress?"
    ]
  }
];

const THINKING_BIASES = [
  { id: "confirmation-bias", name: "Confirmation Bias", description: "Seeking information that confirms existing beliefs", antidote: "Actively seek disconfirming evidence" },
  { id: "availability-heuristic", name: "Availability Heuristic", description: "Overweighting easily recalled information", antidote: "Ask: Is this memorable or actually frequent?" },
  { id: "anchoring", name: "Anchoring Bias", description: "Over-relying on first piece of information", antidote: "Generate multiple reference points before deciding" },
  { id: "sunk-cost", name: "Sunk Cost Fallacy", description: "Continuing because of past investment", antidote: "Ask: Would I start this fresh today?" },
  { id: "hindsight", name: "Hindsight Bias", description: "Believing past events were predictable", antidote: "Record predictions before outcomes" },
  { id: "fundamental-attribution", name: "Fundamental Attribution Error", description: "Attributing others' behavior to character vs situation", antidote: "Consider situational factors first" },
  { id: "dunning-kruger", name: "Dunning-Kruger Effect", description: "Incompetence prevents recognizing incompetence", antidote: "Seek external calibration regularly" },
  { id: "survivorship-bias", name: "Survivorship Bias", description: "Focusing on winners, ignoring failures", antidote: "Study failures as much as successes" }
];

router.get("/frameworks", (_req, res) => {
  res.json({
    success: true,
    data: COGNITIVE_FRAMEWORKS.map(f => ({
      id: f.id,
      name: f.name,
      category: f.category,
      description: f.description,
      difficulty: f.difficulty
    })),
    total: COGNITIVE_FRAMEWORKS.length
  });
});

router.get("/frameworks/:id", (req, res) => {
  const framework = COGNITIVE_FRAMEWORKS.find(f => f.id === req.params.id);
  if (!framework) {
    return res.status(404).json({ success: false, error: "Framework not found" });
  }
  res.json({ success: true, data: framework });
});

router.get("/biases", (_req, res) => {
  res.json({
    success: true,
    data: THINKING_BIASES,
    total: THINKING_BIASES.length
  });
});

router.get("/categories", (_req, res) => {
  const categories = [...new Set(COGNITIVE_FRAMEWORKS.map(f => f.category))];
  res.json({
    success: true,
    data: categories.map(cat => ({
      name: cat,
      count: COGNITIVE_FRAMEWORKS.filter(f => f.category === cat).length,
      frameworks: COGNITIVE_FRAMEWORKS.filter(f => f.category === cat).map(f => ({ id: f.id, name: f.name }))
    }))
  });
});

router.post("/practice-session", (req, res) => {
  const { frameworkId, situation } = req.body;
  const framework = COGNITIVE_FRAMEWORKS.find(f => f.id === frameworkId);
  if (!framework) {
    return res.status(404).json({ success: false, error: "Framework not found" });
  }
  
  res.json({
    success: true,
    data: {
      framework: framework.name,
      situation: situation || "General practice",
      guidedSteps: framework.steps.map((step, i) => ({
        number: i + 1,
        instruction: step,
        prompt: framework.practicePrompts[i] || "Apply this step to your situation"
      })),
      reflectionQuestions: framework.practicePrompts
    }
  });
});


// Health check endpoint for admin daily tools monitoring
router.get("/", (req, res) => {
  res.json({ ok: true, module: "cognitive-mastery", status: "operational", timestamp: new Date().toISOString() });
});

export default router;
