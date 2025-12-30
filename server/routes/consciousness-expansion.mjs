// server/routes/consciousness-expansion.mjs
// Advanced consciousness and awareness expansion API

import express from "express";
const router = express.Router();

const AWARENESS_PRACTICES = [
  {
    id: "witness-consciousness",
    name: "Witness Consciousness",
    description: "Develop the observer perspective that watches thoughts without attachment",
    tradition: "Advaita Vedanta",
    duration: "15-30 min",
    steps: [
      "Sit comfortably and close your eyes",
      "Notice thoughts arising like clouds in the sky",
      "Ask: 'Who is aware of these thoughts?'",
      "Rest in the space of pure awareness",
      "Let thoughts come and go without engagement"
    ],
    benefits: ["Detachment from mental noise", "Inner peace", "Clarity of perception"]
  },
  {
    id: "open-awareness",
    name: "Open Awareness Meditation",
    description: "Expand awareness to include all sensory experience without focus",
    tradition: "Tibetan Buddhism",
    duration: "20-40 min",
    steps: [
      "Begin with eyes slightly open, soft gaze",
      "Allow awareness to be like the sky - vast and open",
      "Include all sounds, sensations, thoughts",
      "Don't focus on any one object",
      "Rest in panoramic awareness"
    ],
    benefits: ["Expanded perception", "Reduced reactivity", "Present-moment awareness"]
  },
  {
    id: "self-inquiry",
    name: "Self-Inquiry (Atma Vichara)",
    description: "Direct investigation into the nature of the self",
    tradition: "Ramana Maharshi",
    duration: "20-60 min",
    steps: [
      "Ask yourself: 'Who am I?'",
      "When thoughts arise, ask: 'To whom does this thought occur?'",
      "Trace the I-thought back to its source",
      "Rest in the silence between thoughts",
      "Repeat until the sense of separate self dissolves"
    ],
    benefits: ["Self-realization", "Liberation from ego", "Direct experience of being"]
  },
  {
    id: "nondual-awareness",
    name: "Nondual Recognition",
    description: "Recognize the unity of subject and object",
    tradition: "Kashmir Shaivism",
    duration: "15-30 min",
    steps: [
      "Notice something in your visual field",
      "Notice the awareness that perceives it",
      "Recognize: perceiver and perceived arise together",
      "Rest in the nondual ground of experience",
      "Let this recognition pervade all experience"
    ],
    benefits: ["Unity consciousness", "End of separation", "Spontaneous freedom"]
  }
];

const CONSCIOUSNESS_STATES = [
  {
    id: "waking",
    name: "Waking Consciousness",
    description: "Ordinary everyday awareness focused on external world",
    characteristics: ["Subject-object duality", "Logical thinking", "Time-bound perception"],
    practices: ["Mindfulness", "Present-moment awareness"]
  },
  {
    id: "dream",
    name: "Dream Consciousness",
    description: "Internal awareness during sleep with symbolic content",
    characteristics: ["Fluid logic", "Symbolic meaning", "Timelessness"],
    practices: ["Dream journaling", "Lucid dreaming"]
  },
  {
    id: "deep-sleep",
    name: "Deep Sleep Consciousness",
    description: "Formless awareness without content",
    characteristics: ["No thoughts", "No objects", "Pure rest"],
    practices: ["Yoga Nidra", "Sleep yoga"]
  },
  {
    id: "turiya",
    name: "Turiya (The Fourth)",
    description: "Witness consciousness present in all states",
    characteristics: ["Unchanging awareness", "Beyond time", "Self-luminous"],
    practices: ["Self-inquiry", "Nondual meditation"]
  },
  {
    id: "turiyatita",
    name: "Turiyatita (Beyond the Fourth)",
    description: "Complete integration where witness dissolves into oneness",
    characteristics: ["No separate witness", "Spontaneous presence", "Sahaja (natural) state"],
    practices: ["Surrender", "Grace"]
  }
];

const PERCEPTION_EXERCISES = [
  {
    id: "sensory-clarity",
    name: "Sensory Clarity Training",
    description: "Sharpen the precision of sensory awareness",
    duration: "10-20 min",
    instructions: [
      "Choose one sense (hearing, seeing, feeling)",
      "Notice subtle aspects you normally miss",
      "Label each sensation: location, intensity, quality",
      "Notice how sensations change moment to moment",
      "Expand to include multiple senses"
    ]
  },
  {
    id: "gap-awareness",
    name: "Gap Awareness",
    description: "Notice the space between thoughts",
    duration: "10-15 min",
    instructions: [
      "Watch for the end of one thought",
      "Before the next thought arises, notice the gap",
      "Rest in that gap as long as possible",
      "The gap is pure awareness without content",
      "Let gaps expand naturally"
    ]
  },
  {
    id: "figure-ground",
    name: "Figure-Ground Reversal",
    description: "Shift attention from content to context",
    duration: "15-20 min",
    instructions: [
      "Notice an object (figure) in your awareness",
      "Now shift attention to the space around it (ground)",
      "Notice how both arise in awareness",
      "Let awareness itself become the focus",
      "Rest as the space in which everything appears"
    ]
  }
];

const INTEGRAL_STAGES = [
  {
    id: "archaic",
    name: "Archaic",
    color: "Infrared",
    description: "Basic survival instincts and sensorimotor intelligence"
  },
  {
    id: "magic",
    name: "Magic",
    color: "Magenta",
    description: "Animistic thinking, tribal bonds, magical causation"
  },
  {
    id: "mythic",
    name: "Mythic",
    color: "Red/Amber",
    description: "Conformist rules, traditional authority, absolute truth"
  },
  {
    id: "rational",
    name: "Rational",
    color: "Orange",
    description: "Scientific thinking, individual achievement, progress"
  },
  {
    id: "pluralistic",
    name: "Pluralistic",
    color: "Green",
    description: "Multiple perspectives, equality, consensus, feelings"
  },
  {
    id: "integral",
    name: "Integral",
    color: "Teal",
    description: "Systems thinking, integration of all stages, both/and logic"
  },
  {
    id: "super-integral",
    name: "Super-Integral",
    color: "Turquoise",
    description: "Global holistic awareness, cosmic consciousness"
  }
];

router.get("/awareness-practices", (req, res) => {
  res.json({ success: true, data: AWARENESS_PRACTICES });
});

router.get("/states", (req, res) => {
  res.json({ success: true, data: CONSCIOUSNESS_STATES });
});

router.get("/perception-exercises", (req, res) => {
  res.json({ success: true, data: PERCEPTION_EXERCISES });
});

router.get("/integral-stages", (req, res) => {
  res.json({ success: true, data: INTEGRAL_STAGES });
});

router.get("/all", (req, res) => {
  res.json({
    success: true,
    data: {
      awarenessPractices: AWARENESS_PRACTICES,
      consciousnessStates: CONSCIOUSNESS_STATES,
      perceptionExercises: PERCEPTION_EXERCISES,
      integralStages: INTEGRAL_STAGES
    }
  });
});

export default router;
