import express from "express";

const router = express.Router();

const SCENARIO_PLANNING_METHODS = [
  {
    name: "Three Horizons Framework",
    description: "Navigate between declining present, emerging future, and transformative vision.",
    horizons: [
      { horizon: "H1", focus: "Business as usual—optimize current systems", timeframe: "0-3 years" },
      { horizon: "H2", focus: "Emerging innovations—bridge old and new", timeframe: "3-10 years" },
      { horizon: "H3", focus: "Transformative vision—seeds of the future", timeframe: "10-30 years" }
    ],
    application: "Strategic planning, innovation portfolios, organizational transformation"
  },
  {
    name: "Scenario Cross-Matrix",
    description: "Generate four futures from two critical uncertainties.",
    steps: ["Identify key driving forces", "Select two most impactful uncertainties", "Create 2x2 matrix of extreme outcomes", "Develop narrative for each quadrant"],
    application: "Strategic foresight, risk management, policy development"
  },
  {
    name: "Causal Layered Analysis",
    description: "Unpack futures at four levels of depth.",
    layers: [
      { layer: "Litany", description: "Surface events, headlines, quantitative data" },
      { layer: "Systemic Causes", description: "Social, economic, political structures" },
      { layer: "Worldview", description: "Deep cultural and cognitive frames" },
      { layer: "Myth/Metaphor", description: "Unconscious narratives and archetypes" }
    ],
    application: "Deep futures analysis, cultural transformation, paradigm shifts"
  },
  {
    name: "Backcasting",
    description: "Work backward from a desired future to identify pathways.",
    steps: ["Define ideal future state", "Identify key milestones", "Map backward from each milestone", "Identify leverage points and interventions"],
    application: "Sustainability planning, goal achievement, systemic change"
  },
  {
    name: "Wild Card Analysis",
    description: "Prepare for low-probability, high-impact events.",
    categories: ["Technological disruption", "Geopolitical shifts", "Environmental cascades", "Social movements", "Black swan events"],
    application: "Risk preparedness, resilience planning, strategic agility"
  }
];

const ETHICAL_FORESIGHT = [
  {
    principle: "Intergenerational Justice",
    description: "Consider impacts on future generations who cannot advocate for themselves.",
    question: "How would the seventh generation view this decision?",
    practice: "Include future generations as stakeholders in planning"
  },
  {
    principle: "Precautionary Principle",
    description: "When potential harm is severe, act cautiously despite uncertainty.",
    question: "What irreversible harms might we be risking?",
    practice: "Identify worst-case scenarios and create safeguards"
  },
  {
    principle: "Distributed Benefits",
    description: "Ensure positive futures are accessible to all, not just the privileged.",
    question: "Who might be left behind in this future scenario?",
    practice: "Map stakeholder impacts across socioeconomic dimensions"
  },
  {
    principle: "Adaptive Capacity",
    description: "Build systems that can evolve with changing circumstances.",
    question: "How can we preserve optionality for future decision-makers?",
    practice: "Design for reversibility and course correction"
  },
  {
    principle: "Ecological Integration",
    description: "Recognize humanity as embedded within natural systems.",
    question: "How does this future align with ecological limits?",
    practice: "Include environmental metrics in all scenario evaluations"
  }
];

const FUTURES_WHEEL = {
  description: "Map cascading consequences of a change or trend.",
  steps: [
    "Place the change/trend at the center",
    "Identify first-order direct consequences",
    "For each first-order effect, identify second-order effects",
    "Continue to third-order and beyond",
    "Identify feedback loops and interactions"
  ],
  categories: ["Economic", "Social", "Technological", "Environmental", "Political", "Psychological"]
};

const WEAK_SIGNALS = [
  {
    domain: "Technology",
    signals: ["Emerging research breakthroughs", "Patent filings", "Startup investments", "Academic papers"],
    scanningMethod: "Monitor arXiv, patent databases, VC funding patterns"
  },
  {
    domain: "Society",
    signals: ["Subculture movements", "Behavioral shifts", "Language evolution", "Art and media themes"],
    scanningMethod: "Ethnographic observation, social media analysis, cultural trend tracking"
  },
  {
    domain: "Environment",
    signals: ["Ecosystem changes", "Species behavior shifts", "Climate data anomalies", "Resource availability"],
    scanningMethod: "Scientific monitoring, indigenous knowledge, satellite data"
  },
  {
    domain: "Economy",
    signals: ["New business models", "Value system shifts", "Employment pattern changes", "Consumption trends"],
    scanningMethod: "Economic indicators, market research, labor statistics"
  },
  {
    domain: "Governance",
    signals: ["Policy experiments", "Regulatory changes", "Civic innovation", "Power structure shifts"],
    scanningMethod: "Policy tracking, civic tech monitoring, political analysis"
  }
];

const FUTURES_LITERACY = [
  {
    competency: "Anticipation",
    description: "Capacity to systematically explore possible futures.",
    development: "Practice scenario building and horizon scanning regularly."
  },
  {
    competency: "Temporal Empathy",
    description: "Ability to imagine lives and perspectives across time.",
    development: "Write letters to/from future selves and generations."
  },
  {
    competency: "Uncertainty Navigation",
    description: "Comfort with ambiguity and multiple possible outcomes.",
    development: "Practice holding multiple scenarios simultaneously without premature closure."
  },
  {
    competency: "Systems Perception",
    description: "See interconnections, feedback loops, and emergent properties.",
    development: "Map systems, trace causal chains, identify leverage points."
  },
  {
    competency: "Agency Orientation",
    description: "Belief in capacity to shape futures through present action.",
    development: "Identify and act on leverage points within your sphere of influence."
  }
];

router.get("/scenarios", (_req, res) => {
  res.json({ ok: true, methods: SCENARIO_PLANNING_METHODS });
});

router.get("/ethics", (_req, res) => {
  res.json({ ok: true, principles: ETHICAL_FORESIGHT });
});

router.get("/wheel", (_req, res) => {
  res.json({ ok: true, wheel: FUTURES_WHEEL });
});

router.get("/signals", (_req, res) => {
  res.json({ ok: true, signals: WEAK_SIGNALS });
});

router.get("/literacy", (_req, res) => {
  res.json({ ok: true, competencies: FUTURES_LITERACY });
});

router.get("/daily", (_req, res) => {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  
  const scenario = SCENARIO_PLANNING_METHODS[dayOfYear % SCENARIO_PLANNING_METHODS.length];
  const ethic = ETHICAL_FORESIGHT[dayOfYear % ETHICAL_FORESIGHT.length];
  const literacy = FUTURES_LITERACY[dayOfYear % FUTURES_LITERACY.length];
  const signalDomain = WEAK_SIGNALS[dayOfYear % WEAK_SIGNALS.length];
  
  res.json({
    ok: true,
    daily: {
      scenarioMethod: scenario,
      ethicalPrinciple: ethic,
      literacyFocus: literacy,
      signalScanning: signalDomain,
      foresightPrompt: `Apply "${scenario.name}" to a challenge you're facing: ${scenario.description}`,
      ethicalCheck: ethic.question
    }
  });
});


// Health check endpoint for admin daily tools monitoring
router.get("/", (req, res) => {
  res.json({ ok: true, module: "foresight", status: "operational", timestamp: new Date().toISOString() });
});

export default router;
