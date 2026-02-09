import express from "express";

const router = express.Router();

const SOMATIC_PRACTICES = [
  {
    practice: "Body Scan Awareness",
    description: "Systematically notice sensations throughout the body.",
    duration: "10-20 minutes",
    benefits: ["Stress reduction", "Interoceptive awareness", "Present-moment grounding"],
    instructions: "Starting at the feet, slowly move attention through each body part, noticing sensations without judgment."
  },
  {
    practice: "Grounding Techniques",
    description: "Connect with physical presence through sensory awareness.",
    duration: "1-5 minutes",
    benefits: ["Anxiety relief", "Dissociation prevention", "Immediate calming"],
    instructions: "Feel feet on ground, notice weight, press into surface, sense gravity."
  },
  {
    practice: "Breath Work (Pranayama)",
    description: "Conscious manipulation of breath patterns for various effects.",
    duration: "5-15 minutes",
    benefits: ["Nervous system regulation", "Energy modulation", "Mental clarity"],
    types: [
      { name: "Box Breathing", pattern: "4 count inhale, 4 hold, 4 exhale, 4 hold", effect: "Calming" },
      { name: "4-7-8 Breathing", pattern: "4 inhale, 7 hold, 8 exhale", effect: "Sleep/relaxation" },
      { name: "Energizing Breath", pattern: "Rapid rhythmic breathing", effect: "Activation" }
    ]
  },
  {
    practice: "Progressive Muscle Relaxation",
    description: "Systematically tense and release muscle groups.",
    duration: "15-20 minutes",
    benefits: ["Muscle tension release", "Stress relief", "Sleep improvement"],
    instructions: "Tense each muscle group for 5 seconds, then release and notice the difference."
  },
  {
    practice: "Mindful Movement",
    description: "Bring full attention to the body in motion.",
    duration: "10-30 minutes",
    benefits: ["Body-mind integration", "Kinesthetic awareness", "Presence"],
    forms: ["Walking meditation", "Yoga", "Tai Chi", "Qigong", "Dance"]
  },
  {
    practice: "Trauma-Sensitive Movement",
    description: "Gentle practices for reconnecting with the body after trauma.",
    duration: "10-20 minutes",
    benefits: ["Nervous system healing", "Safe embodiment", "Reclaiming body autonomy"],
    principles: ["Choice and control", "Slow and gentle", "No forcing", "Titration"]
  }
];

const NERVOUS_SYSTEM_STATES = [
  {
    state: "Ventral Vagal (Social Engagement)",
    description: "Safe, connected, and engaged with others.",
    physical_signs: ["Relaxed face", "Soft eyes", "Easy breathing", "Upright posture"],
    supports: ["Social connection", "Creativity", "Learning", "Healing"]
  },
  {
    state: "Sympathetic (Fight/Flight)",
    description: "Mobilized for action in response to perceived threat.",
    physical_signs: ["Increased heart rate", "Rapid breathing", "Muscle tension", "Alertness"],
    supports: ["Emergency response", "Quick action", "Physical performance"]
  },
  {
    state: "Dorsal Vagal (Freeze/Shutdown)",
    description: "Immobilized, disconnected, conserving energy.",
    physical_signs: ["Low energy", "Numbness", "Dissociation", "Collapsed posture"],
    supports: ["Extreme threat survival", "Conservation", "Withdrawal"]
  }
];

const REGULATION_STRATEGIES = [
  {
    strategy: "Orienting",
    description: "Look around slowly, noticing the environment.",
    mechanism: "Activates social engagement system through visual exploration."
  },
  {
    strategy: "Voo Sound",
    description: "Make a low 'voo' sound on exhale.",
    mechanism: "Stimulates vagus nerve through vocal vibration."
  },
  {
    strategy: "Cold Water",
    description: "Splash cold water on face or hold cold object.",
    mechanism: "Activates dive reflex, slowing heart rate."
  },
  {
    strategy: "Bilateral Stimulation",
    description: "Alternating left-right tapping or eye movements.",
    mechanism: "Facilitates processing and integration of experience."
  },
  {
    strategy: "Co-regulation",
    description: "Being with a calm, regulated person.",
    mechanism: "Nervous systems synchronize with each other."
  },
  {
    strategy: "Containment",
    description: "Gentle pressure through hugging, weighted blanket.",
    mechanism: "Deep pressure calms sympathetic activation."
  }
];

const INTEROCEPTION_EXERCISES = [
  {
    exercise: "Heartbeat Awareness",
    description: "Notice your heartbeat without touching pulse.",
    skill: "Internal heart rate perception"
  },
  {
    exercise: "Hunger/Satiety Tracking",
    description: "Rate hunger/fullness on a scale before and after eating.",
    skill: "Recognizing digestive signals"
  },
  {
    exercise: "Emotion Body Mapping",
    description: "Notice where in the body you feel different emotions.",
    skill: "Linking emotions to physical sensations"
  },
  {
    exercise: "Temperature Awareness",
    description: "Notice subtle temperature variations in different body parts.",
    skill: "Thermal interoception"
  },
  {
    exercise: "Breath Counting",
    description: "Count natural breaths without changing them.",
    skill: "Respiratory awareness"
  }
];

router.get("/somatic", (_req, res) => {
  res.json({ ok: true, practices: SOMATIC_PRACTICES });
});

router.get("/nervous-system", (_req, res) => {
  res.json({ ok: true, states: NERVOUS_SYSTEM_STATES });
});

router.get("/regulation", (_req, res) => {
  res.json({ ok: true, strategies: REGULATION_STRATEGIES });
});

router.get("/interoception", (_req, res) => {
  res.json({ ok: true, exercises: INTEROCEPTION_EXERCISES });
});

router.get("/daily", (_req, res) => {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  
  const somatic = SOMATIC_PRACTICES[dayOfYear % SOMATIC_PRACTICES.length];
  const regulation = REGULATION_STRATEGIES[dayOfYear % REGULATION_STRATEGIES.length];
  const interoception = INTEROCEPTION_EXERCISES[dayOfYear % INTEROCEPTION_EXERCISES.length];
  
  res.json({
    ok: true,
    daily: {
      somaticPractice: somatic,
      regulationStrategy: regulation,
      interoceptionExercise: interoception,
      bodyPrompt: `Today, try "${somatic.practice}": ${somatic.description}`,
      regulationTip: `For stress relief, use "${regulation.strategy}": ${regulation.description}`
    }
  });
});


// Health check endpoint for admin daily tools monitoring
router.get("/", (req, res) => {
  res.json({ ok: true, module: "embodiment", status: "operational", timestamp: new Date().toISOString() });
});

export default router;
