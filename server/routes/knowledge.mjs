// server/routes/knowledge.mjs
// Knowledge Synthesis and Meta-Learning System
import express from "express";

const router = express.Router();

// ============================================================================
// CONCEPT MAPPING FRAMEWORKS
// ============================================================================
const CONCEPT_FRAMEWORKS = [
  {
    id: 1,
    name: "Zettelkasten Method",
    origin: "Niklas Luhmann",
    description: "Atomic note-taking system where each note contains one idea and links to others.",
    principles: [
      "One idea per note (atomic notes)",
      "Link notes to each other",
      "Use your own words",
      "Create structure through linking, not folders",
      "Let emergence happen"
    ],
    practicalSteps: [
      "Capture a single idea in your own words",
      "Assign a unique identifier",
      "Link to related existing notes",
      "Add to an index or entry point",
      "Review and refine connections over time"
    ],
    benefits: ["Non-linear thinking", "Serendipitous discovery", "Long-term knowledge building"]
  },
  {
    id: 2,
    name: "PARA Method",
    origin: "Tiago Forte",
    description: "Organize information by actionability: Projects, Areas, Resources, Archives.",
    principles: [
      "Projects: Short-term efforts with deadlines",
      "Areas: Long-term responsibilities to maintain",
      "Resources: Topics of ongoing interest",
      "Archives: Inactive items from other categories"
    ],
    practicalSteps: [
      "List all your projects (finite, with outcomes)",
      "Identify areas of responsibility",
      "Collect resources by topic",
      "Archive what's no longer active",
      "Review and reorganize regularly"
    ],
    benefits: ["Action-oriented", "Reduces overwhelm", "Cross-platform compatible"]
  },
  {
    id: 3,
    name: "Evergreen Notes",
    origin: "Andy Matuschak",
    description: "Develop notes over time like evergreen trees—always growing, always relevant.",
    principles: [
      "Notes should be concept-oriented",
      "Notes should be densely linked",
      "Notes should be written for your future self",
      "Notes should evolve over time"
    ],
    practicalSteps: [
      "Write about concepts, not sources",
      "Use full sentences as note titles",
      "Link liberally to other notes",
      "Revisit and refine regularly",
      "Let structure emerge from links"
    ],
    benefits: ["Compound learning", "Original thinking", "Durable knowledge"]
  },
  {
    id: 4,
    name: "Feynman Technique",
    origin: "Richard Feynman",
    description: "Learn by teaching—if you can't explain it simply, you don't understand it.",
    principles: [
      "Choose a concept to learn",
      "Teach it to a child (or imagine doing so)",
      "Identify gaps in your explanation",
      "Return to source material to fill gaps",
      "Simplify and use analogies"
    ],
    practicalSteps: [
      "Write the concept name at the top of a page",
      "Explain it in simple language below",
      "Note where you get stuck",
      "Go back and study those parts",
      "Repeat until fluid"
    ],
    benefits: ["Deep understanding", "Reveals knowledge gaps", "Transferable explanations"]
  },
  {
    id: 5,
    name: "Mind Mapping",
    origin: "Tony Buzan",
    description: "Radial visual thinking tool that mirrors how the brain makes associations.",
    principles: [
      "Start with a central concept",
      "Branch out with key themes",
      "Use images and colors",
      "Keep branches short (1-3 words)",
      "Make connections between branches"
    ],
    practicalSteps: [
      "Place main topic in center",
      "Draw main branches for key themes",
      "Add sub-branches for details",
      "Use colors to group related ideas",
      "Draw connections between distant branches"
    ],
    benefits: ["Visual overview", "Creative associations", "Memory enhancement"]
  }
];

// ============================================================================
// LEARNING PRINCIPLES
// ============================================================================
const LEARNING_PRINCIPLES = [
  {
    id: 1,
    name: "Desirable Difficulties",
    source: "Robert Bjork",
    principle: "Learning that feels harder in the moment leads to better long-term retention.",
    examples: ["Spaced practice", "Interleaving", "Retrieval practice", "Varied conditions"],
    application: "Resist the temptation to make learning feel easy. Embrace productive struggle."
  },
  {
    id: 2,
    name: "Spacing Effect",
    source: "Hermann Ebbinghaus",
    principle: "Distributed practice over time beats massed practice (cramming).",
    examples: ["Review after 1 day, 3 days, 1 week, 2 weeks, 1 month", "SRS systems like Anki"],
    application: "Schedule review sessions with increasing intervals between them."
  },
  {
    id: 3,
    name: "Testing Effect",
    source: "Roediger & Karpicke",
    principle: "Retrieving information strengthens memory more than re-reading.",
    examples: ["Flashcards", "Practice tests", "Writing from memory", "Teaching others"],
    application: "Test yourself frequently instead of passively reviewing material."
  },
  {
    id: 4,
    name: "Interleaving",
    source: "Doug Rohrer",
    principle: "Mixing different topics or problem types improves learning and transfer.",
    examples: ["Alternate between math problem types", "Mix vocabulary with grammar", "Switch between skills"],
    application: "Instead of blocking practice (AAABBBCCC), interleave (ABCABCABC)."
  },
  {
    id: 5,
    name: "Elaboration",
    source: "Cognitive Psychology",
    principle: "Connecting new information to existing knowledge deepens understanding.",
    examples: ["Asking 'why' and 'how'", "Creating analogies", "Relating to personal experience"],
    application: "For each new concept, ask: How does this connect to what I already know?"
  },
  {
    id: 6,
    name: "Dual Coding",
    source: "Allan Paivio",
    principle: "Combining verbal and visual information enhances memory.",
    examples: ["Diagrams with labels", "Mental imagery", "Sketchnotes", "Infographics"],
    application: "Create visual representations of verbal concepts and vice versa."
  },
  {
    id: 7,
    name: "Generation Effect",
    source: "Norman Slamecka",
    principle: "Information you generate yourself is better remembered than information you read.",
    examples: ["Completing sentences", "Solving problems before seeing solutions", "Predicting outcomes"],
    application: "Try to answer questions before looking up answers."
  },
  {
    id: 8,
    name: "Metacognitive Monitoring",
    source: "John Flavell",
    principle: "Awareness of your own learning process improves learning outcomes.",
    examples: ["Self-testing", "Confidence calibration", "Study planning", "Reflection journals"],
    application: "Regularly ask: What do I know? What don't I know? How should I study?"
  }
];

// ============================================================================
// KNOWLEDGE SYNTHESIS PROMPTS
// ============================================================================
const SYNTHESIS_PROMPTS = {
  connection: [
    "How does this concept relate to something you learned last week?",
    "What's the opposite of this idea, and what can you learn from that contrast?",
    "If you had to explain this to someone from a completely different field, what metaphor would you use?",
    "What questions does this new knowledge raise for you?",
    "How does this change or refine your previous understanding?"
  ],
  application: [
    "What decision in your life could this knowledge improve?",
    "If you applied this idea for 30 days, what would change?",
    "What's one small experiment you could run to test this concept?",
    "Who in your life would benefit from knowing this?",
    "What problem does this knowledge help you solve?"
  ],
  integration: [
    "What patterns do you notice across different things you're learning?",
    "What's the underlying principle that connects these ideas?",
    "If you had to create a unified theory from your recent learning, what would it be?",
    "What contradictions exist in what you're learning, and how might they be resolved?",
    "What would a master of this domain do differently than a beginner?"
  ],
  creation: [
    "What original idea emerges from combining these concepts?",
    "What would you add to this body of knowledge?",
    "What's missing from the standard understanding of this topic?",
    "If you were to write a book about this, what would be your unique angle?",
    "What creative project could express this understanding?"
  ]
};

// ============================================================================
// INTELLECTUAL VIRTUES
// ============================================================================
const INTELLECTUAL_VIRTUES = [
  {
    name: "Intellectual Humility",
    definition: "Recognizing the limits of one's knowledge and being open to correction.",
    practices: ["Actively seek criticism", "Say 'I don't know' when you don't", "Update beliefs with new evidence"],
    antidote_to: "Arrogance, overconfidence, closed-mindedness"
  },
  {
    name: "Intellectual Courage",
    definition: "Willingness to pursue truth even when it's uncomfortable or unpopular.",
    practices: ["Voice dissenting views respectfully", "Examine taboo questions", "Follow arguments where they lead"],
    antidote_to: "Cowardice, conformity, groupthink"
  },
  {
    name: "Intellectual Autonomy",
    definition: "Thinking for oneself rather than deferring uncritically to authority.",
    practices: ["Form your own views", "Question experts respectfully", "Take responsibility for your beliefs"],
    antidote_to: "Gullibility, unthinking deference, intellectual dependence"
  },
  {
    name: "Intellectual Empathy",
    definition: "Ability to understand views different from your own from the inside.",
    practices: ["Steelman opposing views", "Ask clarifying questions", "Imagine believing what others believe"],
    antidote_to: "Strawmanning, dismissiveness, tribalism"
  },
  {
    name: "Intellectual Perseverance",
    definition: "Willingness to struggle with difficult problems without giving up.",
    practices: ["Set aside time for hard problems", "Tolerate ambiguity", "Return to unresolved questions"],
    antidote_to: "Laziness, impatience, superficiality"
  },
  {
    name: "Intellectual Integrity",
    definition: "Holding yourself to the same standards you hold others.",
    practices: ["Apply your own criteria to your beliefs", "Acknowledge when you're wrong", "Be consistent"],
    antidote_to: "Hypocrisy, motivated reasoning, double standards"
  },
  {
    name: "Love of Truth",
    definition: "Genuine desire to understand reality, not just to win arguments or feel right.",
    practices: ["Seek truth even when inconvenient", "Value accuracy over comfort", "Celebrate being corrected"],
    antidote_to: "Wishful thinking, confirmation bias, tribalism"
  }
];

// ============================================================================
// API ENDPOINTS
// ============================================================================

// Concept Mapping Frameworks
router.get("/concepts", (_req, res) => {
  res.json({
    ok: true,
    frameworks: CONCEPT_FRAMEWORKS,
    total: CONCEPT_FRAMEWORKS.length,
    description: "Knowledge organization and concept mapping systems"
  });
});

router.get("/concepts/:id", (req, res) => {
  const framework = CONCEPT_FRAMEWORKS.find(f => f.id === parseInt(req.params.id));
  if (!framework) return res.status(404).json({ ok: false, error: "Framework not found" });
  res.json({ ok: true, framework });
});

// Learning Principles
router.get("/learning", (_req, res) => {
  res.json({
    ok: true,
    principles: LEARNING_PRINCIPLES,
    total: LEARNING_PRINCIPLES.length,
    description: "Evidence-based learning principles from cognitive science"
  });
});

router.get("/learning/:id", (req, res) => {
  const principle = LEARNING_PRINCIPLES.find(p => p.id === parseInt(req.params.id));
  if (!principle) return res.status(404).json({ ok: false, error: "Principle not found" });
  res.json({ ok: true, principle });
});

// Synthesis Prompts
router.get("/synthesis", (_req, res) => {
  res.json({
    ok: true,
    categories: Object.keys(SYNTHESIS_PROMPTS),
    prompts: SYNTHESIS_PROMPTS,
    totalPrompts: Object.values(SYNTHESIS_PROMPTS).flat().length,
    description: "Prompts for synthesizing and integrating knowledge"
  });
});

router.get("/synthesis/:category", (req, res) => {
  const category = req.params.category.toLowerCase();
  const prompts = SYNTHESIS_PROMPTS[category];
  if (!prompts) return res.status(404).json({ ok: false, error: "Category not found", available: Object.keys(SYNTHESIS_PROMPTS) });
  res.json({ ok: true, category, prompts, total: prompts.length });
});

router.get("/synthesis/:category/random", (req, res) => {
  const category = req.params.category.toLowerCase();
  const prompts = SYNTHESIS_PROMPTS[category];
  if (!prompts) return res.status(404).json({ ok: false, error: "Category not found" });
  const prompt = prompts[Math.floor(Math.random() * prompts.length)];
  res.json({ ok: true, category, prompt });
});

// Intellectual Virtues
router.get("/virtues", (_req, res) => {
  res.json({
    ok: true,
    virtues: INTELLECTUAL_VIRTUES,
    total: INTELLECTUAL_VIRTUES.length,
    description: "Intellectual virtues for becoming a better thinker"
  });
});

// Daily Knowledge Practice
router.get("/daily", (_req, res) => {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  
  const framework = CONCEPT_FRAMEWORKS[dayOfYear % CONCEPT_FRAMEWORKS.length];
  const principle = LEARNING_PRINCIPLES[dayOfYear % LEARNING_PRINCIPLES.length];
  const virtue = INTELLECTUAL_VIRTUES[dayOfYear % INTELLECTUAL_VIRTUES.length];
  const allPrompts = Object.values(SYNTHESIS_PROMPTS).flat();
  const prompt = allPrompts[dayOfYear % allPrompts.length];
  
  res.json({
    ok: true,
    daily: {
      conceptFramework: { name: framework.name, description: framework.description },
      learningPrinciple: { name: principle.name, principle: principle.principle },
      intellectualVirtue: { name: virtue.name, definition: virtue.definition },
      synthesisPrompt: prompt,
      integrationChallenge: `Today, use "${principle.name}" to deepen your understanding of something. Practice "${virtue.name}" as you learn.`
    },
    dayOfYear,
    title: "Daily Knowledge Practice"
  });
});

// Complete library
router.get("/all", (_req, res) => {
  res.json({
    ok: true,
    conceptFrameworks: CONCEPT_FRAMEWORKS,
    learningPrinciples: LEARNING_PRINCIPLES,
    synthesisPrompts: SYNTHESIS_PROMPTS,
    intellectualVirtues: INTELLECTUAL_VIRTUES,
    totals: {
      concepts: CONCEPT_FRAMEWORKS.length,
      principles: LEARNING_PRINCIPLES.length,
      prompts: Object.values(SYNTHESIS_PROMPTS).flat().length,
      virtues: INTELLECTUAL_VIRTUES.length
    }
  });
});


// Health check endpoint for admin daily tools monitoring
router.get("/", (req, res) => {
  res.json({ ok: true, module: "knowledge", status: "operational", timestamp: new Date().toISOString() });
});

export default router;
