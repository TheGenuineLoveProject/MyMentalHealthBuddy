// server/routes/human-potential.mjs
// Comprehensive human potential and peak performance API

import express from "express";
const router = express.Router();

const FLOW_STATE_TRIGGERS = [
  {
    id: "clear-goals",
    name: "Clear Goals",
    description: "Know exactly what you want to achieve",
    implementation: "Break down objectives into immediate, session, and ultimate goals"
  },
  {
    id: "immediate-feedback",
    name: "Immediate Feedback",
    description: "Know how well you're doing in real-time",
    implementation: "Create metrics and checkpoints to assess progress constantly"
  },
  {
    id: "challenge-skill-balance",
    name: "Challenge-Skill Balance",
    description: "Task difficulty should slightly exceed current ability",
    implementation: "Stay in the 4% stretch zone - not too easy, not too hard"
  },
  {
    id: "complete-concentration",
    name: "Complete Concentration",
    description: "Total focus on the task at hand",
    implementation: "Eliminate distractions, single-task, use time-boxing"
  },
  {
    id: "deep-embodiment",
    name: "Deep Embodiment",
    description: "Physical engagement and presence",
    implementation: "Move, gesture, stay physically active during cognitive work"
  },
  {
    id: "high-consequences",
    name: "High Consequences",
    description: "Stakes that demand attention",
    implementation: "Create accountability, public commitments, or financial stakes"
  },
  {
    id: "rich-environment",
    name: "Rich Environment",
    description: "Novelty, complexity, and unpredictability",
    implementation: "Change settings, introduce new elements, embrace uncertainty"
  },
  {
    id: "creativity-factor",
    name: "Creativity Factor",
    description: "Pattern recognition and linking ideas",
    implementation: "Combine disparate concepts, make unexpected connections"
  }
];

const PEAK_EXPERIENCES = [
  {
    id: "mastery-moment",
    name: "Mastery Moment",
    description: "When skill and challenge perfectly align",
    triggers: ["Years of practice", "High stakes", "Complete immersion"],
    characteristics: ["Effortless excellence", "Time distortion", "Unity with activity"]
  },
  {
    id: "creative-breakthrough",
    name: "Creative Breakthrough",
    description: "Sudden insight or illumination",
    triggers: ["Incubation period", "Relaxed attention", "Cross-domain thinking"],
    characteristics: ["Aha moment", "Certainty of rightness", "Energy surge"]
  },
  {
    id: "transcendent-connection",
    name: "Transcendent Connection",
    description: "Feeling of oneness with something greater",
    triggers: ["Nature immersion", "Deep meditation", "Selfless service"],
    characteristics: ["Ego dissolution", "Profound peace", "Cosmic perspective"]
  },
  {
    id: "athletic-zone",
    name: "Athletic Zone",
    description: "Perfect physical performance state",
    triggers: ["Optimal arousal", "Well-prepared", "Present focus"],
    characteristics: ["Automatic execution", "Heightened senses", "Invincibility feeling"]
  }
];

const HUMAN_CAPACITIES = [
  {
    id: "cognitive",
    name: "Cognitive Capacity",
    domains: ["Working memory", "Processing speed", "Pattern recognition", "Abstract reasoning"],
    enhancement: ["Sleep optimization", "Exercise", "Deliberate practice", "Meditation"]
  },
  {
    id: "emotional",
    name: "Emotional Capacity",
    domains: ["Self-awareness", "Regulation", "Empathy", "Social skills"],
    enhancement: ["Therapy", "Journaling", "Relationship practice", "Mindfulness"]
  },
  {
    id: "physical",
    name: "Physical Capacity",
    domains: ["Strength", "Endurance", "Flexibility", "Recovery"],
    enhancement: ["Progressive overload", "Periodization", "Nutrition", "Sleep"]
  },
  {
    id: "creative",
    name: "Creative Capacity",
    domains: ["Divergent thinking", "Originality", "Elaboration", "Flexibility"],
    enhancement: ["Cross-training", "Constraints", "Incubation", "Play"]
  },
  {
    id: "spiritual",
    name: "Spiritual Capacity",
    domains: ["Meaning-making", "Transcendence", "Purpose", "Connection"],
    enhancement: ["Contemplative practice", "Service", "Nature immersion", "Community"]
  }
];

const GROWTH_MINDSET_TOOLS = [
  {
    id: "yet-power",
    name: "The Power of Yet",
    description: "Add 'yet' to statements of limitation",
    example: "'I can't do this' becomes 'I can't do this yet'"
  },
  {
    id: "effort-praise",
    name: "Effort Over Talent",
    description: "Celebrate process and effort, not innate ability",
    example: "Focus on strategies used rather than natural gifts"
  },
  {
    id: "failure-learning",
    name: "Failure as Data",
    description: "Reframe failures as learning opportunities",
    example: "Ask 'What did this teach me?' after setbacks"
  },
  {
    id: "brain-plasticity",
    name: "Brain as Muscle",
    description: "Understand neuroplasticity - the brain grows with use",
    example: "Visualize neural connections strengthening with practice"
  },
  {
    id: "challenge-seeking",
    name: "Challenge Seeking",
    description: "Actively pursue difficult tasks",
    example: "Choose the harder option when given a choice"
  }
];

const SELF_ACTUALIZATION = {
  hierarchy: [
    { level: 1, name: "Physiological", needs: ["Food", "Water", "Shelter", "Sleep"] },
    { level: 2, name: "Safety", needs: ["Security", "Stability", "Health", "Resources"] },
    { level: 3, name: "Love/Belonging", needs: ["Friendship", "Intimacy", "Family", "Connection"] },
    { level: 4, name: "Esteem", needs: ["Respect", "Recognition", "Strength", "Freedom"] },
    { level: 5, name: "Self-Actualization", needs: ["Growth", "Creativity", "Purpose", "Meaning"] },
    { level: 6, name: "Self-Transcendence", needs: ["Service", "Unity", "Cosmic consciousness", "Altruism"] }
  ],
  characteristics: [
    "Acceptance of self, others, and nature",
    "Problem-centered rather than ego-centered",
    "Spontaneity and freshness of appreciation",
    "Need for privacy and detachment",
    "Autonomy and resistance to enculturation",
    "Continued freshness of appreciation",
    "Peak experiences",
    "Deep interpersonal relationships",
    "Democratic character structure",
    "Unhostile sense of humor",
    "Creativity"
  ]
};

router.get("/flow-triggers", (req, res) => {
  res.json({ success: true, data: FLOW_STATE_TRIGGERS });
});

router.get("/peak-experiences", (req, res) => {
  res.json({ success: true, data: PEAK_EXPERIENCES });
});

router.get("/capacities", (req, res) => {
  res.json({ success: true, data: HUMAN_CAPACITIES });
});

router.get("/growth-mindset", (req, res) => {
  res.json({ success: true, data: GROWTH_MINDSET_TOOLS });
});

router.get("/self-actualization", (req, res) => {
  res.json({ success: true, data: SELF_ACTUALIZATION });
});

router.get("/all", (req, res) => {
  res.json({
    success: true,
    data: {
      flowStateTriggers: FLOW_STATE_TRIGGERS,
      peakExperiences: PEAK_EXPERIENCES,
      humanCapacities: HUMAN_CAPACITIES,
      growthMindsetTools: GROWTH_MINDSET_TOOLS,
      selfActualization: SELF_ACTUALIZATION
    }
  });
});


// Health check endpoint for admin daily tools monitoring
router.get("/", (req, res) => {
  res.json({ ok: true, module: "human-potential", status: "operational", timestamp: new Date().toISOString() });
});

export default router;
