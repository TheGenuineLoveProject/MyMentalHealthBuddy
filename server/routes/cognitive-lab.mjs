import express from "express";

const router = express.Router();

const MENTAL_MODELS_LIBRARY = [
  { name: "Inversion", category: "Problem Solving", description: "Approach problems backward—instead of asking how to succeed, ask how to fail and avoid that." },
  { name: "First Principles", category: "Problem Solving", description: "Break down complex problems into basic elements and reassemble from the ground up." },
  { name: "Second-Order Thinking", category: "Decision Making", description: "Consider the consequences of the consequences of your decisions." },
  { name: "Probabilistic Thinking", category: "Decision Making", description: "Estimate likelihoods rather than thinking in certainties." },
  { name: "Hanlon's Razor", category: "Understanding Others", description: "Never attribute to malice what can be explained by ignorance or error." },
  { name: "Circle of Competence", category: "Self-Awareness", description: "Know the boundaries of your expertise and stay within them for important decisions." },
  { name: "Map vs. Territory", category: "Reality Testing", description: "The model is not the reality; all maps have limitations." },
  { name: "Opportunity Cost", category: "Economics", description: "Every choice means giving up the next best alternative." },
  { name: "Margin of Safety", category: "Risk Management", description: "Build buffers to account for uncertainty and error." },
  { name: "Pareto Principle", category: "Prioritization", description: "Roughly 80% of effects come from 20% of causes." },
  { name: "Compound Interest", category: "Growth", description: "Small consistent gains accumulate exponentially over time." },
  { name: "Survivorship Bias", category: "Critical Thinking", description: "We see the winners but not the many who failed using similar strategies." },
  { name: "Regression to the Mean", category: "Statistics", description: "Extreme performances tend to be followed by more average ones." },
  { name: "Antifragility", category: "Resilience", description: "Some things benefit from shocks and volatility." },
  { name: "Leverage", category: "Efficiency", description: "Small inputs can create outsized outputs through the right mechanisms." },
  { name: "Network Effects", category: "Systems", description: "Value increases as more people participate in the network." },
  { name: "Feedback Loops", category: "Systems", description: "Outputs become inputs, creating cycles of reinforcement or balance." },
  { name: "Entropy", category: "Physics", description: "Systems naturally tend toward disorder without energy input." },
  { name: "Activation Energy", category: "Change", description: "Initial energy required to start a process is often higher than maintaining it." },
  { name: "Dunbar's Number", category: "Social", description: "Humans can maintain about 150 stable relationships." },
  { name: "Reciprocity", category: "Social", description: "People tend to return the kind of treatment they receive." },
  { name: "Occam's Razor", category: "Logic", description: "Among competing explanations, prefer the simplest one." },
  { name: "Falsifiability", category: "Science", description: "A claim must be testable and potentially provable false to be meaningful." },
  { name: "The Lindy Effect", category: "Prediction", description: "Things that have lasted a long time are likely to last longer." },
  { name: "Via Negativa", category: "Wisdom", description: "Sometimes removing the bad is more effective than adding the good." }
];

const THINKING_TOOLS = [
  {
    tool: "Decision Matrix",
    purpose: "Systematic comparison of options against weighted criteria.",
    steps: ["List options", "Define criteria", "Weight importance", "Score each option", "Calculate weighted totals"]
  },
  {
    tool: "Pre-Mortem",
    purpose: "Anticipate failures before they happen.",
    steps: ["Imagine project failed", "Brainstorm causes", "Prioritize risks", "Create preventive actions"]
  },
  {
    tool: "Five Whys",
    purpose: "Drill down to root causes.",
    steps: ["State the problem", "Ask 'Why?'", "Repeat 4 more times", "Address root cause"]
  },
  {
    tool: "Thought Experiment",
    purpose: "Explore scenarios impossible in reality.",
    steps: ["Define parameters", "Imagine consequences", "Draw insights", "Apply to real decisions"]
  },
  {
    tool: "Steelmanning",
    purpose: "Strengthen opposing arguments to test your own.",
    steps: ["State opposing view", "Find strongest version", "Engage with that version", "Update your position"]
  },
  {
    tool: "Scenario Planning",
    purpose: "Prepare for multiple possible futures.",
    steps: ["Identify uncertainties", "Create distinct scenarios", "Develop strategies for each", "Find robust options"]
  }
];

const COGNITIVE_BIASES = [
  { bias: "Anchoring", description: "Over-relying on first information encountered.", antidote: "Generate independent estimates before exposure." },
  { bias: "Availability", description: "Overweighting easily recalled examples.", antidote: "Seek base rates and systematic data." },
  { bias: "Confirmation", description: "Favoring information that confirms existing beliefs.", antidote: "Actively seek disconfirming evidence." },
  { bias: "Sunk Cost", description: "Continuing due to past investment rather than future value.", antidote: "Evaluate based only on future costs/benefits." },
  { bias: "Hindsight", description: "Believing past events were predictable.", antidote: "Record predictions before outcomes." },
  { bias: "Dunning-Kruger", description: "Novices overestimate competence.", antidote: "Seek expert feedback regularly." },
  { bias: "Fundamental Attribution", description: "Overweighting personality vs. situation for others' behavior.", antidote: "Consider situational factors." },
  { bias: "Status Quo", description: "Preferring current state over change.", antidote: "Evaluate options as if starting fresh." },
  { bias: "Optimism", description: "Underestimating risks and difficulties.", antidote: "Use reference class forecasting." },
  { bias: "Groupthink", description: "Conforming to group opinion.", antidote: "Assign devil's advocate role." }
];

const REASONING_FRAMEWORKS = [
  {
    framework: "Bayesian Reasoning",
    description: "Update beliefs proportionally to evidence strength.",
    application: "Probability estimation, belief updating, hypothesis testing"
  },
  {
    framework: "Dialectical Reasoning",
    description: "Synthesize opposing viewpoints into higher understanding.",
    application: "Complex debates, policy analysis, philosophical inquiry"
  },
  {
    framework: "Analogical Reasoning",
    description: "Transfer insights from familiar to unfamiliar domains.",
    application: "Problem solving, teaching, innovation"
  },
  {
    framework: "Causal Reasoning",
    description: "Distinguish correlation from causation.",
    application: "Research design, policy evaluation, troubleshooting"
  },
  {
    framework: "Counterfactual Reasoning",
    description: "Consider what would have happened under different conditions.",
    application: "Learning from experience, strategic planning, regret minimization"
  }
];

router.get("/models", (_req, res) => {
  res.json({ ok: true, models: MENTAL_MODELS_LIBRARY });
});

router.get("/tools", (_req, res) => {
  res.json({ ok: true, tools: THINKING_TOOLS });
});

router.get("/biases", (_req, res) => {
  res.json({ ok: true, biases: COGNITIVE_BIASES });
});

router.get("/reasoning", (_req, res) => {
  res.json({ ok: true, frameworks: REASONING_FRAMEWORKS });
});

router.get("/daily", (_req, res) => {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  
  const model = MENTAL_MODELS_LIBRARY[dayOfYear % MENTAL_MODELS_LIBRARY.length];
  const tool = THINKING_TOOLS[dayOfYear % THINKING_TOOLS.length];
  const bias = COGNITIVE_BIASES[dayOfYear % COGNITIVE_BIASES.length];
  const framework = REASONING_FRAMEWORKS[dayOfYear % REASONING_FRAMEWORKS.length];
  
  res.json({
    ok: true,
    daily: {
      mentalModel: model,
      thinkingTool: tool,
      biasToWatch: bias,
      reasoningFramework: framework,
      practicePrompt: `Apply the "${model.name}" model today: ${model.description}`,
      biasAlert: `Watch for "${bias.bias}" bias. Antidote: ${bias.antidote}`
    }
  });
});


// Health check endpoint for admin daily tools monitoring
router.get("/", (req, res) => {
  res.json({ ok: true, module: "cognitive-lab", status: "operational", timestamp: new Date().toISOString() });
});

export default router;
