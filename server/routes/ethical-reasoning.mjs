import express from "express";

const router = express.Router();

const ETHICAL_FRAMEWORKS = [
  {
    framework: "Utilitarianism",
    description: "Actions are right if they promote the greatest happiness for the greatest number.",
    key_question: "What action produces the most overall well-being?",
    strengths: ["Impartial", "Outcome-focused", "Practical"],
    limitations: ["Can justify harm to minorities", "Difficulty measuring utility", "Ignores rights"]
  },
  {
    framework: "Deontology (Kantian Ethics)",
    description: "Actions are right if they follow universal moral duties, regardless of consequences.",
    key_question: "Could I will this action as a universal law?",
    strengths: ["Respects human dignity", "Provides clear duties", "Protects rights"],
    limitations: ["Rigid rules", "Conflicting duties", "Ignores context"]
  },
  {
    framework: "Virtue Ethics",
    description: "Focus on developing good character traits rather than following rules.",
    key_question: "What would a person of good character do?",
    strengths: ["Holistic", "Context-sensitive", "Character development"],
    limitations: ["Vague guidance", "Cultural variation", "No clear action guide"]
  },
  {
    framework: "Care Ethics",
    description: "Moral action arises from caring relationships and responsiveness to needs.",
    key_question: "How can I best respond to those who depend on me?",
    strengths: ["Relational focus", "Contextual", "Emotional intelligence"],
    limitations: ["Partiality concerns", "Scale limitations", "Gender associations"]
  },
  {
    framework: "Rights-Based Ethics",
    description: "All persons have fundamental rights that must be respected.",
    key_question: "Does this action violate anyone's fundamental rights?",
    strengths: ["Protects individuals", "Universal standards", "Clear boundaries"],
    limitations: ["Rights conflicts", "Negative rights focus", "Cultural variation"]
  },
  {
    framework: "Social Contract Theory",
    description: "Moral rules are those rational people would agree to for mutual benefit.",
    key_question: "Would rational people agree to this arrangement?",
    strengths: ["Democratic", "Self-interested foundation", "Practical"],
    limitations: ["Excludes non-contractors", "Hypothetical", "Status quo bias"]
  },
  {
    framework: "Pragmatic Ethics",
    description: "Moral judgments should be tested by their practical consequences.",
    key_question: "What works best in this situation?",
    strengths: ["Flexible", "Experimental", "Problem-focused"],
    limitations: ["Relativistic concerns", "Short-term focus", "Power dynamics"]
  },
  {
    framework: "Environmental Ethics",
    description: "Moral consideration extends to ecosystems, species, and future generations.",
    key_question: "How does this impact the broader web of life?",
    strengths: ["Long-term thinking", "Holistic", "Sustainability"],
    limitations: ["Anthropocentrism debates", "Practical trade-offs", "Value conflicts"]
  }
];

const MORAL_REASONING_TOOLS = [
  {
    tool: "The Veil of Ignorance",
    origin: "John Rawls",
    description: "Design systems as if you don't know your position in them.",
    application: "Choose policies not knowing if you'll be rich or poor, healthy or sick."
  },
  {
    tool: "The Universalizability Test",
    origin: "Immanuel Kant",
    description: "Ask if your action could become a universal law.",
    application: "If everyone did this, would the world still function?"
  },
  {
    tool: "The Newspaper Test",
    origin: "Business Ethics",
    description: "Would you be comfortable if this appeared on the front page?",
    application: "Consider how your action would look to the public."
  },
  {
    tool: "The Reversal Test",
    origin: "Moral Philosophy",
    description: "Consider how you would feel if roles were reversed.",
    application: "Put yourself in the affected party's shoes."
  },
  {
    tool: "The Loved One Test",
    origin: "Care Ethics",
    description: "Would you advise a loved one to do this?",
    application: "Apply the wisdom you'd give to someone you care about."
  },
  {
    tool: "The Precedent Test",
    origin: "Legal Ethics",
    description: "What precedent does this set for future cases?",
    application: "Consider long-term systemic implications."
  }
];

const ETHICAL_DILEMMAS = [
  {
    category: "Truth vs. Loyalty",
    description: "Telling the truth may harm someone you're loyal to.",
    example: "A friend asks for honest feedback that might hurt them.",
    considerations: ["Relationship preservation", "Growth through honesty", "Timing and context"]
  },
  {
    category: "Individual vs. Community",
    description: "Personal benefit may conflict with collective good.",
    example: "Using resources for personal gain vs. sharing with others.",
    considerations: ["Scale of impact", "Reciprocity", "Sustainability"]
  },
  {
    category: "Short-term vs. Long-term",
    description: "Immediate benefits may create future harms.",
    example: "Economic growth vs. environmental sustainability.",
    considerations: ["Discounting future", "Reversibility", "Intergenerational justice"]
  },
  {
    category: "Justice vs. Mercy",
    description: "Fair punishment may conflict with compassionate forgiveness.",
    example: "Enforcing rules vs. considering extenuating circumstances.",
    considerations: ["Deterrence", "Rehabilitation", "Context sensitivity"]
  },
  {
    category: "Autonomy vs. Paternalism",
    description: "Respecting choices vs. protecting from harm.",
    example: "Allowing risky decisions vs. intervening for someone's good.",
    considerations: ["Competence", "Harm to others", "Soft vs. hard paternalism"]
  }
];

const ETHICAL_DECISION_PROCESS = [
  { step: "Recognize", description: "Notice that an ethical issue is present." },
  { step: "Gather Facts", description: "Understand the situation fully before judging." },
  { step: "Identify Stakeholders", description: "Who is affected by this decision?" },
  { step: "Consider Options", description: "Generate multiple possible courses of action." },
  { step: "Apply Frameworks", description: "Test options against various ethical frameworks." },
  { step: "Decide", description: "Choose the action that best balances competing considerations." },
  { step: "Implement", description: "Act with integrity and transparency." },
  { step: "Reflect", description: "Learn from outcomes to improve future decisions." }
];

router.get("/frameworks", (_req, res) => {
  res.json({ ok: true, frameworks: ETHICAL_FRAMEWORKS });
});

router.get("/tools", (_req, res) => {
  res.json({ ok: true, tools: MORAL_REASONING_TOOLS });
});

router.get("/dilemmas", (_req, res) => {
  res.json({ ok: true, dilemmas: ETHICAL_DILEMMAS });
});

router.get("/process", (_req, res) => {
  res.json({ ok: true, process: ETHICAL_DECISION_PROCESS });
});

router.get("/daily", (_req, res) => {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  
  const framework = ETHICAL_FRAMEWORKS[dayOfYear % ETHICAL_FRAMEWORKS.length];
  const tool = MORAL_REASONING_TOOLS[dayOfYear % MORAL_REASONING_TOOLS.length];
  const dilemma = ETHICAL_DILEMMAS[dayOfYear % ETHICAL_DILEMMAS.length];
  
  res.json({
    ok: true,
    daily: {
      ethicalFramework: framework,
      reasoningTool: tool,
      dilemmaCategory: dilemma,
      reflectionPrompt: `Today, apply "${framework.framework}": ${framework.key_question}`,
      practicalExercise: `Use the "${tool.tool}": ${tool.application}`
    }
  });
});


// Health check endpoint for admin daily tools monitoring
router.get("/", (req, res) => {
  res.json({ ok: true, module: "ethical-reasoning", status: "operational", timestamp: new Date().toISOString() });
});

export default router;
