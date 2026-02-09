import express from "express";

const router = express.Router();

const MEMORY_TECHNIQUES = [
  {
    id: "memory-palace",
    name: "Memory Palace (Method of Loci)",
    category: "spatial",
    description: "Associate information with familiar locations in an imagined space",
    howTo: [
      "Choose a familiar place (your home, a walking route)",
      "Identify distinct locations or objects within it",
      "Create vivid, exaggerated mental images linking each piece of information to a location",
      "Walk through the palace mentally to recall information"
    ],
    bestFor: ["Lists", "Speeches", "Sequential information", "Vocabulary"],
    difficulty: "intermediate",
    effectivenessScore: 9
  },
  {
    id: "spaced-repetition",
    name: "Spaced Repetition",
    category: "timing",
    description: "Review information at increasing intervals to maximize retention",
    howTo: [
      "Learn new material thoroughly on day 1",
      "Review after 1 day, then 3 days, then 7 days, then 14 days",
      "Adjust intervals based on difficulty and recall accuracy",
      "Use flashcard apps like Anki for automated scheduling"
    ],
    bestFor: ["Language learning", "Medical studies", "Any factual knowledge"],
    difficulty: "beginner",
    effectivenessScore: 10
  },
  {
    id: "chunking",
    name: "Chunking",
    category: "organization",
    description: "Group individual pieces of information into larger, meaningful units",
    howTo: [
      "Identify patterns or relationships in the information",
      "Group related items together (3-5 items per chunk)",
      "Create meaningful labels for each chunk",
      "Practice recalling chunks as units"
    ],
    bestFor: ["Phone numbers", "Codes", "Complex procedures", "Technical information"],
    difficulty: "beginner",
    effectivenessScore: 8
  },
  {
    id: "elaborative-interrogation",
    name: "Elaborative Interrogation",
    category: "understanding",
    description: "Ask 'why' and 'how' questions to deepen understanding and memory",
    howTo: [
      "For each new fact, ask 'Why is this true?'",
      "Generate explanations in your own words",
      "Connect new information to what you already know",
      "Create causal chains linking concepts"
    ],
    bestFor: ["Conceptual learning", "Science", "History", "Complex topics"],
    difficulty: "intermediate",
    effectivenessScore: 8
  },
  {
    id: "peg-system",
    name: "Peg System",
    category: "association",
    description: "Associate numbers with predetermined images to remember numbered lists",
    howTo: [
      "Learn a set of peg words (1=bun, 2=shoe, 3=tree...)",
      "Create vivid mental images linking each item to its peg",
      "The more absurd the image, the more memorable",
      "Walk through pegs in order to recall items"
    ],
    bestFor: ["Numbered lists", "Ordered sequences", "Speeches"],
    difficulty: "intermediate",
    effectivenessScore: 7
  },
  {
    id: "active-recall",
    name: "Active Recall",
    category: "practice",
    description: "Test yourself rather than passively reviewing material",
    howTo: [
      "Close your notes and try to recall information from memory",
      "Write down everything you can remember",
      "Check your notes and identify gaps",
      "Focus extra practice on missed items"
    ],
    bestFor: ["All types of learning", "Exam preparation", "Skill acquisition"],
    difficulty: "beginner",
    effectivenessScore: 9
  }
];

const FOCUS_STRATEGIES = [
  {
    id: "pomodoro-technique",
    name: "Pomodoro Technique",
    category: "time-boxing",
    description: "Work in focused 25-minute sessions with short breaks",
    implementation: {
      workDuration: 25,
      shortBreak: 5,
      longBreak: 15,
      sessionsBeforeLongBreak: 4
    },
    benefits: ["Prevents burnout", "Creates urgency", "Tracks productivity", "Maintains freshness"],
    variations: ["52/17 method", "90-minute focus blocks", "Custom intervals"],
    effectivenessScore: 8
  },
  {
    id: "time-blocking",
    name: "Time Blocking",
    category: "scheduling",
    description: "Assign specific time blocks to specific tasks or types of work",
    implementation: {
      steps: [
        "Review your tasks for the day/week",
        "Estimate time needed for each task",
        "Assign tasks to specific calendar blocks",
        "Protect blocks from interruptions",
        "Batch similar tasks together"
      ]
    },
    benefits: ["Reduces decision fatigue", "Prevents multitasking", "Creates accountability"],
    effectivenessScore: 9
  },
  {
    id: "environment-design",
    name: "Environment Design",
    category: "setup",
    description: "Optimize your physical and digital environment for focus",
    principles: [
      "Remove visible distractions",
      "Use website blockers during focus time",
      "Create a dedicated workspace",
      "Control lighting and temperature",
      "Use noise-canceling headphones or ambient sounds"
    ],
    tools: ["Cold Turkey", "Freedom", "Focus@Will", "Brain.fm"],
    effectivenessScore: 8
  },
  {
    id: "single-tasking",
    name: "Single-Tasking Protocol",
    category: "attention",
    description: "Complete one task fully before moving to the next",
    principles: [
      "Close all unrelated tabs and apps",
      "Turn off notifications",
      "Write down your single focus intention",
      "Resist the urge to switch tasks",
      "Capture interrupting thoughts for later"
    ],
    benefits: ["Deeper work", "Faster completion", "Reduced cognitive load"],
    effectivenessScore: 9
  },
  {
    id: "ultradian-rhythms",
    name: "Ultradian Rhythm Alignment",
    category: "biology",
    description: "Work with your body's natural 90-minute focus cycles",
    implementation: {
      cycleDuration: 90,
      restPeriod: 20,
      peakHours: "First 2-4 hours after waking",
      troughHours: "Early afternoon (2-4 PM)"
    },
    principles: [
      "Schedule demanding work during peak hours",
      "Take real breaks between cycles",
      "Don't force focus past natural limits",
      "Use troughs for routine tasks"
    ],
    effectivenessScore: 9
  }
];

const LEARNING_ACCELERATION = [
  {
    id: "feynman-technique",
    name: "Feynman Technique",
    category: "understanding",
    description: "Explain concepts in simple terms to identify gaps in understanding",
    steps: [
      "Choose a concept to learn",
      "Explain it as if teaching a 12-year-old",
      "Identify gaps where your explanation breaks down",
      "Go back to source material and fill the gaps",
      "Simplify and use analogies"
    ],
    whyItWorks: "Exposing the illusion of explanatory depth",
    effectivenessScore: 10
  },
  {
    id: "interleaving",
    name: "Interleaving",
    category: "practice",
    description: "Mix different topics or skills in a single study session",
    implementation: {
      wrong: "AAA BBB CCC (blocked practice)",
      right: "ABC ABC ABC (interleaved practice)"
    },
    benefits: [
      "Improves discrimination between concepts",
      "Builds more flexible knowledge",
      "Enhances long-term retention",
      "Better transfer to new situations"
    ],
    effectivenessScore: 8
  },
  {
    id: "deliberate-practice",
    name: "Deliberate Practice",
    category: "skill-building",
    description: "Focused practice on specific weaknesses with immediate feedback",
    elements: [
      "Clear, specific goals for each session",
      "Focus on areas just beyond current ability",
      "Immediate and informative feedback",
      "High number of repetitions",
      "Full concentration (not mindless repetition)"
    ],
    keyInsight: "10,000 hours only works if it's deliberate, not just experience",
    effectivenessScore: 10
  },
  {
    id: "pre-testing",
    name: "Pre-Testing Effect",
    category: "priming",
    description: "Take a test before learning to enhance subsequent learning",
    howTo: [
      "Before studying, attempt questions on the material",
      "Don't worry about getting answers wrong",
      "Failed retrieval attempts prime the brain for learning",
      "Then study the material normally"
    ],
    whyItWorks: "Creates a 'desirable difficulty' that enhances encoding",
    effectivenessScore: 7
  },
  {
    id: "dual-coding",
    name: "Dual Coding",
    category: "encoding",
    description: "Combine verbal and visual representations of information",
    implementation: [
      "Create diagrams for verbal information",
      "Add labels to visual information",
      "Draw concept maps",
      "Use infographics and visual summaries",
      "Sketch while listening to lectures"
    ],
    benefits: ["Two memory traces instead of one", "Better retrieval cues", "Deeper processing"],
    effectivenessScore: 8
  },
  {
    id: "generation-effect",
    name: "Generation Effect",
    category: "engagement",
    description: "Generate your own examples and explanations rather than reading provided ones",
    techniques: [
      "Create your own practice problems",
      "Write summaries without looking at notes",
      "Generate examples for abstract concepts",
      "Make predictions before reading",
      "Form questions while learning"
    ],
    whyItWorks: "Self-generated material is processed more deeply",
    effectivenessScore: 8
  }
];

const COGNITIVE_BIASES = [
  {
    id: "confirmation-bias",
    name: "Confirmation Bias",
    description: "Tendency to favor information that confirms existing beliefs",
    antidote: "Actively seek disconfirming evidence; steelman opposing views"
  },
  {
    id: "anchoring",
    name: "Anchoring Bias",
    description: "Over-relying on the first piece of information encountered",
    antidote: "Consider multiple reference points; delay forming initial judgments"
  },
  {
    id: "availability-heuristic",
    name: "Availability Heuristic",
    description: "Judging probability by how easily examples come to mind",
    antidote: "Seek base rate statistics; don't let vivid examples distort judgment"
  },
  {
    id: "dunning-kruger",
    name: "Dunning-Kruger Effect",
    description: "Novices overestimate ability; experts underestimate",
    antidote: "Seek feedback from experts; embrace 'I don't know'"
  },
  {
    id: "sunk-cost-fallacy",
    name: "Sunk Cost Fallacy",
    description: "Continuing investment because of past costs rather than future value",
    antidote: "Ask: 'If I were starting fresh, would I choose this?'"
  },
  {
    id: "hindsight-bias",
    name: "Hindsight Bias",
    description: "Believing past events were predictable after they occurred",
    antidote: "Keep decision journals; document reasoning before outcomes"
  }
];

router.get("/memory-techniques", (_req, res) => {
  res.json({
    techniques: MEMORY_TECHNIQUES,
    categories: ["spatial", "timing", "organization", "understanding", "association", "practice"],
    tip: "Start with Active Recall and Spaced Repetition - they have the strongest research support"
  });
});

router.get("/focus-strategies", (_req, res) => {
  res.json({
    strategies: FOCUS_STRATEGIES,
    categories: ["time-boxing", "scheduling", "setup", "attention", "biology"],
    recommendation: "Combine environment design with a time-boxing method for best results"
  });
});

router.get("/learning-acceleration", (_req, res) => {
  res.json({
    methods: LEARNING_ACCELERATION,
    categories: ["understanding", "practice", "skill-building", "priming", "encoding", "engagement"],
    goldenRule: "The Feynman Technique + Deliberate Practice = accelerated mastery"
  });
});

router.get("/cognitive-biases", (_req, res) => {
  res.json({
    biases: COGNITIVE_BIASES,
    insight: "Awareness of biases is the first step, but doesn't automatically fix them. Active countermeasures are required."
  });
});

router.get("/brain-health", (_req, res) => {
  res.json({
    pillars: [
      {
        area: "Sleep",
        importance: "Critical for memory consolidation and cognitive function",
        recommendations: ["7-9 hours", "Consistent schedule", "Cool, dark room", "No screens 1hr before bed"]
      },
      {
        area: "Exercise",
        importance: "Increases BDNF, improves blood flow to brain",
        recommendations: ["150 min moderate aerobic weekly", "Strength training", "Even walking helps"]
      },
      {
        area: "Nutrition",
        importance: "Brain needs proper fuel for optimal function",
        recommendations: ["Omega-3 fatty acids", "Antioxidant-rich foods", "Adequate hydration", "Minimize processed foods"]
      },
      {
        area: "Stress Management",
        importance: "Chronic stress damages hippocampus and impairs memory",
        recommendations: ["Regular meditation", "Nature exposure", "Social connection", "Purpose and meaning"]
      },
      {
        area: "Cognitive Challenge",
        importance: "Use it or lose it - neuroplasticity requires challenge",
        recommendations: ["Learn new skills", "Varied mental activities", "Avoid cognitive comfort zones"]
      }
    ]
  });
});


// Health check endpoint for admin daily tools monitoring
router.get("/", (req, res) => {
  res.json({ ok: true, module: "cognitive-enhancement", status: "operational", timestamp: new Date().toISOString() });
});

export default router;
