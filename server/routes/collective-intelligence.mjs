import express from "express";

const router = express.Router();

const COLLECTIVE_WISDOM_PRINCIPLES = [
  {
    principle: "Diversity of Thought",
    description: "Collective intelligence requires genuinely different perspectives.",
    application: "Actively seek out viewpoints that challenge consensus.",
    pitfall: "Groupthink emerges when diversity is suppressed."
  },
  {
    principle: "Independent Thinking",
    description: "Individual contributions should not be influenced by others' opinions initially.",
    application: "Gather input before sharing conclusions.",
    pitfall: "Anchoring effects distort collective judgment."
  },
  {
    principle: "Decentralized Knowledge",
    description: "Relevant expertise is distributed across many people.",
    application: "Create structures for distributed contribution.",
    pitfall: "Centralized control limits information aggregation."
  },
  {
    principle: "Effective Aggregation",
    description: "Individual inputs must be combined through appropriate mechanisms.",
    application: "Design aggregation methods suited to the decision type.",
    pitfall: "Poor aggregation destroys valuable input diversity."
  },
  {
    principle: "Psychological Safety",
    description: "People must feel safe to share minority opinions.",
    application: "Actively protect and encourage dissent.",
    pitfall: "Fear silences important perspectives."
  }
];

const WISDOM_SYNTHESIS_METHODS = [
  {
    method: "Delphi Process",
    description: "Structured rounds of anonymous expert input with feedback.",
    steps: ["Gather initial responses", "Share anonymized summary", "Allow revision", "Iterate to convergence"],
    use: "Forecasting, policy planning, complex problem-solving"
  },
  {
    method: "Wisdom Council",
    description: "Randomly selected group speaks on behalf of the whole.",
    steps: ["Random selection", "Facilitated deep dialogue", "Consensus statement", "Community response"],
    use: "Community decision-making, policy input, organizational direction"
  },
  {
    method: "Open Space Technology",
    description: "Self-organizing around topics that matter most.",
    steps: ["State theme", "Participants propose sessions", "Self-organize into groups", "Synthesize insights"],
    use: "Conference design, community engagement, innovation"
  },
  {
    method: "World Café",
    description: "Cross-pollination of ideas through rotating conversations.",
    steps: ["Set up café tables", "Pose questions", "Rotate participants", "Harvest collective insights"],
    use: "Strategic planning, community building, knowledge sharing"
  },
  {
    method: "Appreciative Inquiry",
    description: "Focus on what works to design positive futures.",
    phases: ["Discover (what gives life)", "Dream (what might be)", "Design (what should be)", "Destiny (what will be)"],
    use: "Organizational development, positive change, strength-based planning"
  }
];

const CROWD_WISDOM_TYPES = [
  {
    type: "Prediction Markets",
    description: "Aggregate distributed knowledge through betting mechanisms.",
    accuracy: "Often outperforms expert panels for factual questions.",
    limitation: "Less effective for normative or values-based questions."
  },
  {
    type: "Deliberative Polling",
    description: "Informed opinions through structured learning and discussion.",
    accuracy: "Produces more thoughtful, nuanced positions.",
    limitation: "Resource-intensive; requires skilled facilitation."
  },
  {
    type: "Citizen Assemblies",
    description: "Randomly selected groups make policy recommendations.",
    accuracy: "High legitimacy and often innovative solutions.",
    limitation: "Implementation depends on political will."
  },
  {
    type: "Stigmergic Coordination",
    description: "Indirect coordination through environmental signals.",
    accuracy: "Scales well; enables emergent intelligence.",
    limitation: "Requires well-designed feedback mechanisms."
  }
];

const SYNTHESIS_FRAMEWORKS = [
  {
    framework: "Polarity Mapping",
    description: "Hold tensions between complementary values rather than choosing sides.",
    poles: ["Individual ↔ Collective", "Stability ↔ Change", "Analysis ↔ Action"],
    practice: "Identify the upsides and downsides of each pole; seek dynamic balance."
  },
  {
    framework: "Integral Theory",
    description: "Include all perspectives in a coherent framework.",
    quadrants: ["Interior Individual", "Exterior Individual", "Interior Collective", "Exterior Collective"],
    practice: "Ensure any analysis includes all four quadrants."
  },
  {
    framework: "Dialectical Synthesis",
    description: "Move beyond thesis and antithesis to higher integration.",
    process: ["Identify opposing positions", "Find truth in each", "Synthesize into transcendent understanding"],
    practice: "Seek the 'and' rather than the 'or'."
  },
  {
    framework: "Consilience",
    description: "Knowledge across disciplines should form coherent whole.",
    domains: ["Sciences", "Humanities", "Arts", "Spiritual traditions", "Indigenous wisdom"],
    practice: "Test insights against multiple knowledge traditions."
  }
];

const EMERGENT_INTELLIGENCE = [
  {
    phenomenon: "Swarm Intelligence",
    description: "Simple agents following local rules create complex collective behavior.",
    examples: ["Ant colonies", "Bird flocking", "Immune systems"],
    insight: "Intelligence can emerge without central control."
  },
  {
    phenomenon: "Distributed Cognition",
    description: "Thinking extends beyond individual brains into environment and tools.",
    examples: ["Pilot-cockpit systems", "Scientific teams", "Cultural knowledge"],
    insight: "Mind is not contained in the skull."
  },
  {
    phenomenon: "Collective Memory",
    description: "Groups remember what individuals cannot.",
    examples: ["Oral traditions", "Institutional knowledge", "Cultural practices"],
    insight: "Wisdom accumulates across generations."
  },
  {
    phenomenon: "Network Effects",
    description: "Value increases with participation.",
    examples: ["Languages", "Markets", "Social movements"],
    insight: "Connection amplifies individual contribution."
  }
];

router.get("/principles", (_req, res) => {
  res.json({ ok: true, principles: COLLECTIVE_WISDOM_PRINCIPLES });
});

router.get("/synthesis", (_req, res) => {
  res.json({ ok: true, methods: WISDOM_SYNTHESIS_METHODS });
});

router.get("/crowd-wisdom", (_req, res) => {
  res.json({ ok: true, types: CROWD_WISDOM_TYPES });
});

router.get("/frameworks", (_req, res) => {
  res.json({ ok: true, frameworks: SYNTHESIS_FRAMEWORKS });
});

router.get("/emergence", (_req, res) => {
  res.json({ ok: true, phenomena: EMERGENT_INTELLIGENCE });
});

router.get("/daily", (_req, res) => {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  
  const principle = COLLECTIVE_WISDOM_PRINCIPLES[dayOfYear % COLLECTIVE_WISDOM_PRINCIPLES.length];
  const method = WISDOM_SYNTHESIS_METHODS[dayOfYear % WISDOM_SYNTHESIS_METHODS.length];
  const framework = SYNTHESIS_FRAMEWORKS[dayOfYear % SYNTHESIS_FRAMEWORKS.length];
  const emergence = EMERGENT_INTELLIGENCE[dayOfYear % EMERGENT_INTELLIGENCE.length];
  
  res.json({
    ok: true,
    daily: {
      wisdomPrinciple: principle,
      synthesisMethod: method,
      integrativeFramework: framework,
      emergentPattern: emergence,
      collectivePrompt: `Consider: "${principle.principle}" - ${principle.description}`,
      synthesisChallenge: `Apply "${method.method}" to a group challenge you're facing.`
    }
  });
});


// Health check endpoint for admin daily tools monitoring
router.get("/", (req, res) => {
  res.json({ ok: true, module: "collective-intelligence", status: "operational", timestamp: new Date().toISOString() });
});

export default router;
