// server/routes/dialectics.mjs
// Advanced Dialectical Reasoning and Philosophical Inquiry System
import express from "express";

const router = express.Router();

// ============================================================================
// DIALECTICAL INQUIRY FRAMEWORKS
// ============================================================================
const DIALECTICAL_METHODS = [
  {
    id: 1,
    name: "Socratic Elenchus",
    origin: "Ancient Greece (Socrates)",
    description: "Systematic questioning to expose contradictions and arrive at clearer understanding.",
    steps: [
      "State your belief or claim clearly",
      "Explore the implications of that belief",
      "Identify contradictions or tensions",
      "Refine the belief based on what you've discovered",
      "Repeat until you reach a more coherent position"
    ],
    sampleQuestions: [
      "What do you mean by that term?",
      "What evidence supports this belief?",
      "What would be the consequences if everyone held this view?",
      "Can you think of a counterexample?",
      "How would you respond to someone who disagreed?"
    ],
    applicationDomains: ["Ethics", "Beliefs", "Definitions", "Values clarification"]
  },
  {
    id: 2,
    name: "Hegelian Dialectic",
    origin: "19th Century Germany (Hegel)",
    description: "Movement through thesis, antithesis, and synthesis to reach higher understanding.",
    steps: [
      "Thesis: State your initial position",
      "Antithesis: Articulate the opposing or negating position",
      "Synthesis: Find a higher truth that transcends both",
      "The synthesis becomes the new thesis for further inquiry"
    ],
    sampleQuestions: [
      "What is the strongest counter-position?",
      "What truth does the opposition contain?",
      "What higher perspective includes both views?",
      "What assumptions do both sides share?"
    ],
    applicationDomains: ["Conflicting ideas", "Historical analysis", "Ideological tensions"]
  },
  {
    id: 3,
    name: "Steelmanning",
    origin: "Contemporary rhetoric",
    description: "Constructing the strongest possible version of an opposing argument before responding.",
    steps: [
      "Identify the opposing view",
      "State it more clearly than its proponents might",
      "Add the strongest supporting evidence",
      "Engage with this strongest version",
      "Only then formulate your response"
    ],
    sampleQuestions: [
      "What would the most intelligent advocate of this position say?",
      "What evidence would they cite?",
      "What are the strongest versions of their reasoning?",
      "What legitimate concerns motivate this view?"
    ],
    applicationDomains: ["Debates", "Conflict resolution", "Policy analysis"]
  },
  {
    id: 4,
    name: "Negative Theology (Apophatic Method)",
    origin: "Mystical traditions (Pseudo-Dionysius)",
    description: "Understanding by eliminating what something is NOT, approaching truth through negation.",
    steps: [
      "Begin with your subject of inquiry",
      "State what it is NOT",
      "Continue eliminating false attributes",
      "What remains points toward truth that exceeds description"
    ],
    sampleQuestions: [
      "What is this definitely not?",
      "What false assumptions am I making?",
      "What would be a misunderstanding of this?",
      "What categories fail to capture this?"
    ],
    applicationDomains: ["Abstract concepts", "Self-understanding", "Mystery and uncertainty"]
  },
  {
    id: 5,
    name: "Phenomenological Reduction",
    origin: "20th Century (Husserl)",
    description: "Bracketing assumptions to examine direct experience without presuppositions.",
    steps: [
      "Epoché: Suspend all theoretical assumptions",
      "Describe what appears exactly as it appears",
      "Note the structures of experience itself",
      "Distinguish between the experience and your interpretations"
    ],
    sampleQuestions: [
      "What am I actually experiencing right now?",
      "What assumptions am I projecting onto this?",
      "If I had no theories, what would I notice?",
      "What is the structure of this experience itself?"
    ],
    applicationDomains: ["Self-inquiry", "Emotional awareness", "Perceptual clarity"]
  },
  {
    id: 6,
    name: "Deconstruction",
    origin: "Post-structuralism (Derrida)",
    description: "Exposing hidden assumptions and binaries that structure thinking.",
    steps: [
      "Identify a binary opposition (e.g., good/bad, mind/body)",
      "Note which term is privileged",
      "Show how each term depends on its opposite",
      "Reveal what the opposition excludes or hides"
    ],
    sampleQuestions: [
      "What binary is operating here?",
      "Which side is assumed to be better?",
      "How does each term define the other?",
      "What third option is excluded?"
    ],
    applicationDomains: ["Cultural analysis", "Language", "Hidden assumptions"]
  }
];

// ============================================================================
// EPISTEMOLOGICAL FRAMEWORKS
// ============================================================================
const EPISTEMOLOGICAL_FRAMEWORKS = [
  {
    id: 1,
    name: "Empiricism",
    core: "Knowledge comes from sensory experience",
    strengths: ["Grounded in observation", "Testable", "Builds cumulative knowledge"],
    limitations: ["Can't access non-observable truths", "Subject to perceptual errors", "Induction problem"],
    keyQuestion: "What evidence from experience supports this?",
    practicalUse: "When evaluating claims about the physical world"
  },
  {
    id: 2,
    name: "Rationalism",
    core: "Knowledge comes from reason and logical deduction",
    strengths: ["Reveals necessary truths", "Independent of particular experiences", "Mathematical certainty possible"],
    limitations: ["May not connect to reality", "Premises must be justified", "Limited scope"],
    keyQuestion: "What can be logically deduced from first principles?",
    practicalUse: "When analyzing logical consistency and implications"
  },
  {
    id: 3,
    name: "Pragmatism",
    core: "Truth is what works in practice",
    strengths: ["Action-oriented", "Flexible", "Focused on consequences"],
    limitations: ["May overlook theoretical truth", "What 'works' can be subjective", "Short-term vs long-term"],
    keyQuestion: "What difference does believing this make in practice?",
    practicalUse: "When making decisions under uncertainty"
  },
  {
    id: 4,
    name: "Constructivism",
    core: "Knowledge is constructed through social and cognitive processes",
    strengths: ["Accounts for perspective", "Explains cultural variation", "Highlights active role of knower"],
    limitations: ["Risk of relativism", "Hard to evaluate competing constructions", "May undermine shared truth"],
    keyQuestion: "How was this knowledge constructed and by whom?",
    practicalUse: "When examining cultural or historical claims"
  },
  {
    id: 5,
    name: "Critical Realism",
    core: "Reality exists independently but our access to it is mediated",
    strengths: ["Balances realism and constructivism", "Accounts for error and revision", "Stratified ontology"],
    limitations: ["Complex", "Hard to verify 'real' structures", "Requires inference"],
    keyQuestion: "What underlying structures might explain these observed patterns?",
    practicalUse: "When investigating causes behind phenomena"
  },
  {
    id: 6,
    name: "Phenomenology",
    core: "Knowledge begins with direct experience",
    strengths: ["First-person rigor", "Reveals structures of consciousness", "Attends to lived experience"],
    limitations: ["Subjective", "Hard to generalize", "Bracketing assumptions is difficult"],
    keyQuestion: "What is the structure of this experience as it appears?",
    practicalUse: "When exploring subjective experience and meaning"
  },
  {
    id: 7,
    name: "Bayesian Epistemology",
    core: "Beliefs are probabilities updated by evidence",
    strengths: ["Quantifiable", "Accounts for prior knowledge", "Formally rigorous"],
    limitations: ["Priors can be arbitrary", "Not all knowledge is probabilistic", "Computation can be complex"],
    keyQuestion: "How should this evidence update my probability estimate?",
    practicalUse: "When updating beliefs based on new information"
  },
  {
    id: 8,
    name: "Virtue Epistemology",
    core: "Knowledge depends on intellectual virtues of the knower",
    strengths: ["Character-centered", "Explains why we trust some sources", "Integrates ethics and epistemology"],
    limitations: ["Virtues are hard to specify", "May be circular", "Cultural variation"],
    keyQuestion: "What intellectual virtues would help me know this better?",
    practicalUse: "When developing as a thinker and evaluating sources"
  }
];

// ============================================================================
// DECISION-MAKING FRAMEWORKS
// ============================================================================
const DECISION_FRAMEWORKS = [
  {
    id: 1,
    name: "Expected Value Analysis",
    description: "Multiply probability of each outcome by its value and choose the highest",
    steps: ["List possible outcomes", "Estimate probability of each", "Assign value to each", "Calculate EV = Σ(probability × value)", "Choose highest EV"],
    bestFor: "Repeatable decisions with quantifiable outcomes",
    limitation: "Doesn't account for variance, risk aversion, or rare events"
  },
  {
    id: 2,
    name: "Minimax Regret",
    description: "Minimize the maximum regret you might experience",
    steps: ["Identify alternatives", "For each, identify worst-case regret", "Choose the option with the smallest worst-case regret"],
    bestFor: "One-time high-stakes decisions where you want to avoid the worst outcome",
    limitation: "May be overly conservative and miss upside"
  },
  {
    id: 3,
    name: "Satisficing",
    description: "Choose the first option that meets your minimum criteria",
    steps: ["Define minimum acceptable criteria", "Evaluate options in order", "Select the first that passes all criteria"],
    bestFor: "Time-limited decisions with many acceptable options",
    limitation: "May miss better options that come later"
  },
  {
    id: 4,
    name: "Weighted Decision Matrix",
    description: "Score options across weighted criteria",
    steps: ["List decision criteria", "Weight each by importance (total = 100%)", "Score each option on each criterion", "Calculate weighted sum", "Choose highest score"],
    bestFor: "Complex decisions with multiple factors to balance",
    limitation: "Weights and scores can be subjective"
  },
  {
    id: 5,
    name: "Pre-Mortem Analysis",
    description: "Imagine the decision failed and work backward to understand why",
    steps: ["Assume you made the decision and it failed spectacularly", "List all the reasons it might have failed", "Address the most likely failure modes before deciding"],
    bestFor: "High-stakes decisions where failure is costly",
    limitation: "Can induce excessive caution"
  },
  {
    id: 6,
    name: "Reversibility Test",
    description: "Prefer decisions that can be undone or adjusted",
    steps: ["Classify decision as reversible or irreversible", "For reversible: decide fast and iterate", "For irreversible: decide slow and gather more data"],
    bestFor: "Matching decision speed to decision stakes",
    limitation: "Some decisions seem reversible but have hidden lock-in"
  },
  {
    id: 7,
    name: "10/10/10 Rule",
    description: "Consider how you'll feel about this decision in 10 minutes, 10 months, and 10 years",
    steps: ["Articulate the decision", "Ask: How will I feel about this in 10 minutes?", "In 10 months?", "In 10 years?", "Use temporal distance to gain perspective"],
    bestFor: "Decisions clouded by short-term emotion",
    limitation: "Hard to accurately predict future feelings"
  },
  {
    id: 8,
    name: "Values-Based Decision Making",
    description: "Align decisions with your core values",
    steps: ["Clarify your 3-5 core values", "For each option, assess alignment with each value", "Choose the option most aligned with what matters most"],
    bestFor: "Life decisions where authenticity matters",
    limitation: "Values can conflict; requires clarity about priorities"
  }
];

// ============================================================================
// PHILOSOPHICAL INQUIRY PROMPTS
// ============================================================================
const INQUIRY_PROMPTS = {
  ethics: [
    "What would a person of integrity do in this situation?",
    "Am I treating others as ends in themselves, not merely as means?",
    "What character trait does this action cultivate or erode?",
    "If everyone did this, what world would we live in?",
    "What obligations do I have that I haven't acknowledged?",
    "Am I rationalizing what I want to do, or reasoning toward what I should do?"
  ],
  meaning: [
    "What makes this activity meaningful rather than merely pleasurable?",
    "If I knew I had one year left, how would I spend my time?",
    "What am I contributing that will outlast me?",
    "What suffering would I be willing to endure for this?",
    "What would I do if I had nothing to prove?",
    "What story am I living, and do I want to keep living it?"
  ],
  knowledge: [
    "How would I know if I were wrong about this?",
    "What would change my mind?",
    "Am I seeking truth or seeking to confirm what I already believe?",
    "What am I most confident about that might be mistaken?",
    "What do I know by experience vs. by assumption?",
    "What question am I afraid to ask honestly?"
  ],
  self: [
    "Who am I when no one is watching?",
    "What do I keep doing despite knowing better?",
    "What part of myself am I rejecting or hiding?",
    "What would I do if I weren't afraid?",
    "What am I pretending not to know?",
    "If I described myself honestly, what would I say?"
  ],
  reality: [
    "What do I take for granted that others question?",
    "What framework am I using to interpret this experience?",
    "What would remain true regardless of my beliefs about it?",
    "How might this look from a completely different perspective?",
    "What am I not seeing because of how I'm looking?",
    "What exists here beyond what I can measure or describe?"
  ],
  action: [
    "What is the smallest step I could take right now?",
    "What am I waiting for permission to do?",
    "What would I do if I trusted myself?",
    "What resistance am I experiencing, and what is it protecting?",
    "Am I acting from fear or from love?",
    "What would courage look like in this situation?"
  ]
};

// ============================================================================
// COGNITIVE BIASES REFERENCE
// ============================================================================
const COGNITIVE_BIASES = [
  { name: "Confirmation Bias", description: "Seeking information that confirms existing beliefs", antidote: "Actively seek disconfirming evidence" },
  { name: "Availability Heuristic", description: "Judging likelihood by how easily examples come to mind", antidote: "Ask: Is this really common, or just memorable?" },
  { name: "Anchoring", description: "Over-relying on the first piece of information encountered", antidote: "Generate multiple reference points before deciding" },
  { name: "Sunk Cost Fallacy", description: "Continuing because of past investment, not future value", antidote: "Ask: If I were starting fresh, would I choose this?" },
  { name: "Fundamental Attribution Error", description: "Attributing others' behavior to character, not situation", antidote: "Consider what situational factors might explain behavior" },
  { name: "Dunning-Kruger Effect", description: "Overestimating competence in areas where you're a novice", antidote: "Seek feedback from experts; calibrate confidence to evidence" },
  { name: "Hindsight Bias", description: "Believing past events were predictable after knowing the outcome", antidote: "Document predictions before outcomes are known" },
  { name: "Optimism Bias", description: "Overestimating the likelihood of positive outcomes for yourself", antidote: "Use base rates; compare to others in similar situations" },
  { name: "Loss Aversion", description: "Feeling losses more strongly than equivalent gains", antidote: "Reframe in terms of total portfolio, not individual decisions" },
  { name: "Bandwagon Effect", description: "Adopting beliefs because others hold them", antidote: "Ask: Would I believe this if I were the only one who did?" },
  { name: "Projection Bias", description: "Assuming future-you will feel the same as current-you", antidote: "Recall how your preferences have changed in the past" },
  { name: "Scope Insensitivity", description: "Failing to scale emotional response to magnitude of problem", antidote: "Force yourself to think about actual numbers and proportions" }
];

// ============================================================================
// API ENDPOINTS
// ============================================================================

// Dialectical Methods
router.get("/methods", (_req, res) => {
  res.json({
    ok: true,
    methods: DIALECTICAL_METHODS,
    total: DIALECTICAL_METHODS.length,
    description: "Frameworks for rigorous reasoning and philosophical inquiry"
  });
});

router.get("/methods/:id", (req, res) => {
  const method = DIALECTICAL_METHODS.find(m => m.id === parseInt(req.params.id));
  if (!method) return res.status(404).json({ ok: false, error: "Method not found" });
  res.json({ ok: true, method });
});

// Epistemological Frameworks
router.get("/epistemology", (_req, res) => {
  res.json({
    ok: true,
    frameworks: EPISTEMOLOGICAL_FRAMEWORKS,
    total: EPISTEMOLOGICAL_FRAMEWORKS.length,
    description: "Ways of knowing and evaluating knowledge claims"
  });
});

router.get("/epistemology/:id", (req, res) => {
  const framework = EPISTEMOLOGICAL_FRAMEWORKS.find(f => f.id === parseInt(req.params.id));
  if (!framework) return res.status(404).json({ ok: false, error: "Framework not found" });
  res.json({ ok: true, framework });
});

// Decision Frameworks
router.get("/decisions", (_req, res) => {
  res.json({
    ok: true,
    frameworks: DECISION_FRAMEWORKS,
    total: DECISION_FRAMEWORKS.length,
    description: "Structured approaches to making better decisions"
  });
});

router.get("/decisions/:id", (req, res) => {
  const framework = DECISION_FRAMEWORKS.find(f => f.id === parseInt(req.params.id));
  if (!framework) return res.status(404).json({ ok: false, error: "Framework not found" });
  res.json({ ok: true, framework });
});

// Inquiry Prompts
router.get("/prompts", (_req, res) => {
  res.json({
    ok: true,
    categories: Object.keys(INQUIRY_PROMPTS),
    prompts: INQUIRY_PROMPTS,
    totalPrompts: Object.values(INQUIRY_PROMPTS).flat().length,
    description: "Philosophical questions for deep self-inquiry"
  });
});

router.get("/prompts/:category", (req, res) => {
  const category = req.params.category.toLowerCase();
  const prompts = INQUIRY_PROMPTS[category];
  if (!prompts) return res.status(404).json({ ok: false, error: "Category not found", available: Object.keys(INQUIRY_PROMPTS) });
  res.json({ ok: true, category, prompts, total: prompts.length });
});

router.get("/prompts/:category/random", (req, res) => {
  const category = req.params.category.toLowerCase();
  const prompts = INQUIRY_PROMPTS[category];
  if (!prompts) return res.status(404).json({ ok: false, error: "Category not found" });
  const prompt = prompts[Math.floor(Math.random() * prompts.length)];
  res.json({ ok: true, category, prompt });
});

// Cognitive Biases
router.get("/biases", (_req, res) => {
  res.json({
    ok: true,
    biases: COGNITIVE_BIASES,
    total: COGNITIVE_BIASES.length,
    description: "Common cognitive biases and their antidotes"
  });
});

// Daily Dialectical Practice
router.get("/daily", (_req, res) => {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  
  const method = DIALECTICAL_METHODS[dayOfYear % DIALECTICAL_METHODS.length];
  const allPrompts = Object.values(INQUIRY_PROMPTS).flat();
  const prompt = allPrompts[dayOfYear % allPrompts.length];
  const bias = COGNITIVE_BIASES[dayOfYear % COGNITIVE_BIASES.length];
  
  res.json({
    ok: true,
    daily: {
      method: { name: method.name, description: method.description, firstStep: method.steps[0] },
      inquiryPrompt: prompt,
      biasToWatch: bias,
      integrationPrompt: `Today, use "${method.name}" to explore: "${prompt}". Watch for "${bias.name}" as you think.`
    },
    dayOfYear,
    title: "Daily Dialectical Practice"
  });
});

// Synthesis endpoint - combines multiple frameworks
router.get("/synthesis", (_req, res) => {
  const randomMethod = DIALECTICAL_METHODS[Math.floor(Math.random() * DIALECTICAL_METHODS.length)];
  const randomEpist = EPISTEMOLOGICAL_FRAMEWORKS[Math.floor(Math.random() * EPISTEMOLOGICAL_FRAMEWORKS.length)];
  const randomDecision = DECISION_FRAMEWORKS[Math.floor(Math.random() * DECISION_FRAMEWORKS.length)];
  const categories = Object.keys(INQUIRY_PROMPTS);
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  const randomPrompt = INQUIRY_PROMPTS[randomCategory][Math.floor(Math.random() * INQUIRY_PROMPTS[randomCategory].length)];
  
  res.json({
    ok: true,
    synthesis: {
      dialecticalMethod: randomMethod,
      epistemologicalLens: randomEpist,
      decisionFramework: randomDecision,
      inquiryPrompt: { category: randomCategory, prompt: randomPrompt },
      integrationGuide: `Apply ${randomMethod.name} to explore "${randomPrompt}" through the lens of ${randomEpist.name}. If a decision emerges, evaluate it using ${randomDecision.name}.`
    },
    title: "Intellectual Synthesis",
    description: "Cross-domain integration for rigorous thinking"
  });
});


// Health check endpoint for admin daily tools monitoring
router.get("/", (req, res) => {
  res.json({ ok: true, module: "dialectics", status: "operational", timestamp: new Date().toISOString() });
});

export default router;
