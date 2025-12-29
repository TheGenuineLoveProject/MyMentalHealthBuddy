import express from "express";

const router = express.Router();

const METACOGNITIVE_STRATEGIES = [
  {
    name: "Think-Aloud Protocol",
    description: "Verbalize your thought process while solving problems to make thinking visible.",
    application: "Problem-solving, debugging, decision-making",
    steps: ["State the problem", "Verbalize each reasoning step", "Identify stuck points", "Articulate solutions"]
  },
  {
    name: "Self-Questioning",
    description: "Ask yourself strategic questions before, during, and after learning.",
    application: "Reading comprehension, study sessions, skill acquisition",
    questions: ["What do I already know?", "What am I trying to accomplish?", "Am I making progress?", "What would I do differently?"]
  },
  {
    name: "Calibration Practice",
    description: "Regularly assess your confidence against actual performance to improve judgment.",
    application: "Test preparation, predictions, estimates",
    method: "Make predictions with confidence percentages, then track accuracy over time"
  },
  {
    name: "Error Analysis",
    description: "Systematically analyze mistakes to identify patterns and root causes.",
    application: "Learning from failure, skill improvement",
    categories: ["Careless errors", "Conceptual gaps", "Strategy failures", "Time management issues"]
  },
  {
    name: "Pre-Mortem Analysis",
    description: "Imagine a project has failed and work backward to identify potential causes.",
    application: "Project planning, risk assessment",
    prompt: "Assume this endeavor failed completely. What went wrong?"
  },
  {
    name: "Cognitive Load Monitoring",
    description: "Track mental effort and adjust strategies when overwhelmed.",
    application: "Complex learning, multitasking decisions",
    signals: ["Difficulty concentrating", "Frequent re-reading", "Confusion buildup", "Fatigue"]
  }
];

const THINKING_BIASES = [
  {
    name: "Confirmation Bias",
    description: "Tendency to search for information that confirms existing beliefs.",
    antidote: "Actively seek disconfirming evidence; steelman opposing views.",
    question: "What would change my mind about this?"
  },
  {
    name: "Availability Heuristic",
    description: "Overweighting easily recalled examples when making judgments.",
    antidote: "Seek base rates and statistical data before relying on memory.",
    question: "Am I overweighting memorable examples?"
  },
  {
    name: "Dunning-Kruger Effect",
    description: "Novices overestimate competence; experts underestimate it.",
    antidote: "Seek feedback from knowledgeable others; embrace uncertainty.",
    question: "What might I be missing due to inexperience?"
  },
  {
    name: "Sunk Cost Fallacy",
    description: "Continuing investments due to past costs rather than future value.",
    antidote: "Evaluate decisions based only on future costs and benefits.",
    question: "If starting fresh today, would I make this choice?"
  },
  {
    name: "Anchoring Bias",
    description: "Over-relying on the first piece of information encountered.",
    antidote: "Generate independent estimates before considering others' numbers.",
    question: "Am I being unduly influenced by an initial reference point?"
  },
  {
    name: "Fundamental Attribution Error",
    description: "Attributing others' behavior to character while excusing our own by circumstance.",
    antidote: "Consider situational factors for others; personality factors for self.",
    question: "What circumstances might explain this person's behavior?"
  },
  {
    name: "Hindsight Bias",
    description: "Believing past events were predictable after knowing the outcome.",
    antidote: "Document predictions before outcomes; review prediction accuracy.",
    question: "Would I really have predicted this beforehand?"
  },
  {
    name: "Planning Fallacy",
    description: "Underestimating time, costs, and risks of future actions.",
    antidote: "Use reference class forecasting; add significant buffers.",
    question: "How long did similar projects actually take?"
  }
];

const REFLECTION_FRAMEWORKS = [
  {
    name: "Gibbs Reflective Cycle",
    stages: ["Description", "Feelings", "Evaluation", "Analysis", "Conclusion", "Action Plan"],
    use: "Deep reflection on specific experiences"
  },
  {
    name: "What? So What? Now What?",
    stages: ["What happened?", "Why does it matter?", "What will I do next?"],
    use: "Quick reflection after events"
  },
  {
    name: "Kolb's Learning Cycle",
    stages: ["Concrete Experience", "Reflective Observation", "Abstract Conceptualization", "Active Experimentation"],
    use: "Learning from experience"
  },
  {
    name: "ORID Framework",
    stages: ["Objective (What?)", "Reflective (Feelings?)", "Interpretive (Meaning?)", "Decisional (Action?)"],
    use: "Facilitated group reflection"
  },
  {
    name: "After Action Review",
    stages: ["What was supposed to happen?", "What actually happened?", "Why the difference?", "What to sustain/improve?"],
    use: "Team learning from projects"
  }
];

const SELF_AWARENESS_TOOLS = [
  {
    name: "Johari Window",
    description: "Framework for understanding self-awareness through known/unknown dimensions.",
    quadrants: ["Open (known to self and others)", "Blind (unknown to self, known to others)", "Hidden (known to self, hidden from others)", "Unknown (unknown to all)"]
  },
  {
    name: "Values Clarification",
    description: "Identify and prioritize core personal values.",
    method: "Rank values, examine conflicts, align decisions with priorities"
  },
  {
    name: "Strengths Inventory",
    description: "Systematic identification of natural abilities and developed skills.",
    categories: ["Natural talents", "Learned skills", "Knowledge domains", "Character strengths"]
  },
  {
    name: "Emotional Granularity",
    description: "Develop nuanced vocabulary for emotional states.",
    benefit: "Better emotional regulation through precise identification"
  },
  {
    name: "Identity Mapping",
    description: "Map the various roles and identities you hold.",
    dimensions: ["Professional", "Relational", "Personal", "Aspirational"]
  }
];

router.get("/strategies", (_req, res) => {
  res.json({ ok: true, strategies: METACOGNITIVE_STRATEGIES });
});

router.get("/biases", (_req, res) => {
  res.json({ ok: true, biases: THINKING_BIASES });
});

router.get("/reflection", (_req, res) => {
  res.json({ ok: true, frameworks: REFLECTION_FRAMEWORKS });
});

router.get("/self-awareness", (_req, res) => {
  res.json({ ok: true, tools: SELF_AWARENESS_TOOLS });
});

router.get("/daily", (_req, res) => {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  
  const strategy = METACOGNITIVE_STRATEGIES[dayOfYear % METACOGNITIVE_STRATEGIES.length];
  const bias = THINKING_BIASES[dayOfYear % THINKING_BIASES.length];
  const reflection = REFLECTION_FRAMEWORKS[dayOfYear % REFLECTION_FRAMEWORKS.length];
  
  res.json({
    ok: true,
    daily: {
      strategy,
      biasToWatch: bias,
      reflectionMethod: reflection,
      practicePrompt: `Today, practice "${strategy.name}": ${strategy.description}`,
      biasCheck: `Watch for "${bias.name}" by asking: "${bias.question}"`
    }
  });
});

export default router;
