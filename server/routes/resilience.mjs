import express from "express";

const router = express.Router();

const RESILIENCE_FACTORS = [
  {
    factor: "Self-Efficacy",
    description: "Belief in your ability to handle challenges and achieve goals.",
    practices: ["Set and achieve small goals", "Reflect on past successes", "Develop new skills progressively"],
    affirmation: "I have overcome challenges before, and I can do so again."
  },
  {
    factor: "Social Connection",
    description: "Meaningful relationships that provide support and belonging.",
    practices: ["Nurture close relationships", "Ask for help when needed", "Offer support to others"],
    affirmation: "I am connected to people who care about me."
  },
  {
    factor: "Meaning & Purpose",
    description: "Sense that life has significance and direction.",
    practices: ["Clarify personal values", "Contribute to something larger than self", "Find meaning in adversity"],
    affirmation: "My life has purpose, even in difficult times."
  },
  {
    factor: "Emotional Regulation",
    description: "Ability to manage and modulate emotional responses.",
    practices: ["Practice mindfulness", "Name emotions precisely", "Use healthy coping strategies"],
    affirmation: "I can experience difficult emotions without being overwhelmed."
  },
  {
    factor: "Optimism",
    description: "Realistic hope that situations can improve.",
    practices: ["Challenge catastrophic thinking", "Identify silver linings", "Focus on what you can control"],
    affirmation: "This difficulty is temporary, and things can get better."
  },
  {
    factor: "Adaptability",
    description: "Flexibility in responding to changing circumstances.",
    practices: ["Embrace uncertainty", "Develop multiple strategies", "Learn from setbacks"],
    affirmation: "I can adapt to new situations and find my way forward."
  },
  {
    factor: "Problem-Solving",
    description: "Capacity to analyze situations and generate solutions.",
    practices: ["Break problems into manageable parts", "Generate multiple options", "Take incremental action"],
    affirmation: "I can figure out solutions, one step at a time."
  },
  {
    factor: "Self-Care",
    description: "Maintaining physical and mental health foundations.",
    practices: ["Prioritize sleep", "Move your body regularly", "Nourish with healthy food"],
    affirmation: "Taking care of myself builds my capacity to handle challenges."
  }
];

const COPING_STRATEGIES = [
  {
    category: "Problem-Focused Coping",
    description: "Strategies that address the source of stress directly.",
    strategies: [
      "Information gathering",
      "Action planning",
      "Resource mobilization",
      "Skill development",
      "Boundary setting"
    ]
  },
  {
    category: "Emotion-Focused Coping",
    description: "Strategies that manage emotional responses to stress.",
    strategies: [
      "Mindfulness and acceptance",
      "Reframing and perspective-taking",
      "Emotional expression",
      "Self-compassion practices",
      "Relaxation techniques"
    ]
  },
  {
    category: "Meaning-Focused Coping",
    description: "Strategies that find or create meaning in difficult situations.",
    strategies: [
      "Benefit finding",
      "Values clarification",
      "Goal revision",
      "Spiritual practices",
      "Legacy reflection"
    ]
  },
  {
    category: "Social Coping",
    description: "Strategies that leverage relationships for support.",
    strategies: [
      "Seeking emotional support",
      "Seeking practical help",
      "Sharing experiences",
      "Joining support groups",
      "Professional consultation"
    ]
  }
];

const POST_TRAUMATIC_GROWTH = [
  {
    domain: "Personal Strength",
    description: "Discovering inner resources you didn't know you had.",
    reflection: "What strengths have emerged through this difficulty?"
  },
  {
    domain: "New Possibilities",
    description: "Opening to new paths and opportunities.",
    reflection: "What new directions might be possible because of this experience?"
  },
  {
    domain: "Relating to Others",
    description: "Deepening connections and compassion.",
    reflection: "How have my relationships changed or deepened?"
  },
  {
    domain: "Appreciation of Life",
    description: "Enhanced gratitude for what matters.",
    reflection: "What do I appreciate more now than before?"
  },
  {
    domain: "Spiritual Development",
    description: "Deepening existential or spiritual understanding.",
    reflection: "How has my understanding of life's meaning evolved?"
  }
];

const STRESS_INOCULATION = [
  {
    phase: "Conceptualization",
    description: "Understand stress and your response patterns.",
    activities: ["Identify stress triggers", "Map physical and emotional responses", "Recognize early warning signs"]
  },
  {
    phase: "Skill Acquisition",
    description: "Learn and practice coping techniques.",
    activities: ["Relaxation training", "Cognitive restructuring", "Problem-solving skills", "Social skills"]
  },
  {
    phase: "Application Practice",
    description: "Apply skills in graduated real-world situations.",
    activities: ["Visualization rehearsal", "Role-playing", "Graduated exposure", "Real-life practice"]
  }
];

const PSYCHOLOGICAL_FLEXIBILITY = [
  {
    process: "Acceptance",
    description: "Willingness to experience difficult thoughts and feelings.",
    practice: "Notice and allow difficult experiences without struggling against them."
  },
  {
    process: "Cognitive Defusion",
    description: "Creating distance from unhelpful thoughts.",
    practice: "Notice thoughts as mental events rather than literal truths."
  },
  {
    process: "Present-Moment Awareness",
    description: "Flexible attention to the here and now.",
    practice: "Bring attention to current experience with openness and curiosity."
  },
  {
    process: "Self-as-Context",
    description: "A stable sense of self that transcends experiences.",
    practice: "Access the observing self that witnesses all experiences."
  },
  {
    process: "Values Clarification",
    description: "Knowing what truly matters to you.",
    practice: "Identify and connect with your deepest values."
  },
  {
    process: "Committed Action",
    description: "Taking effective action guided by values.",
    practice: "Take small, values-consistent steps even when it's hard."
  }
];

router.get("/factors", (_req, res) => {
  res.json({ ok: true, factors: RESILIENCE_FACTORS });
});

router.get("/coping", (_req, res) => {
  res.json({ ok: true, strategies: COPING_STRATEGIES });
});

router.get("/growth", (_req, res) => {
  res.json({ ok: true, domains: POST_TRAUMATIC_GROWTH });
});

router.get("/inoculation", (_req, res) => {
  res.json({ ok: true, phases: STRESS_INOCULATION });
});

router.get("/flexibility", (_req, res) => {
  res.json({ ok: true, processes: PSYCHOLOGICAL_FLEXIBILITY });
});

router.get("/daily", (_req, res) => {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  
  const factor = RESILIENCE_FACTORS[dayOfYear % RESILIENCE_FACTORS.length];
  const coping = COPING_STRATEGIES[dayOfYear % COPING_STRATEGIES.length];
  const growth = POST_TRAUMATIC_GROWTH[dayOfYear % POST_TRAUMATIC_GROWTH.length];
  const flexibility = PSYCHOLOGICAL_FLEXIBILITY[dayOfYear % PSYCHOLOGICAL_FLEXIBILITY.length];
  
  res.json({
    ok: true,
    daily: {
      resilienceFactor: factor,
      copingCategory: coping,
      growthDomain: growth,
      flexibilityProcess: flexibility,
      affirmation: factor.affirmation,
      practice: `Strengthen "${factor.factor}" today by: ${factor.practices[dayOfYear % factor.practices.length]}`
    }
  });
});


// Health check endpoint for admin daily tools monitoring
router.get("/", (req, res) => {
  res.json({ ok: true, module: "resilience", status: "operational", timestamp: new Date().toISOString() });
});

export default router;
