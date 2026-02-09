// server/routes/spiritual-intelligence.mjs
// Spiritual Intelligence API - Comprehensive spiritual growth and transcendence tools

import express from "express";
const router = express.Router();

// Spiritual Practices Catalog
const spiritualPractices = {
  meditation: [
    { name: "Loving-Kindness (Metta)", tradition: "Buddhist", focus: "Compassion cultivation", duration: "10-30 min", level: "Beginner" },
    { name: "Vipassana", tradition: "Buddhist", focus: "Insight through observation", duration: "20-60 min", level: "Intermediate" },
    { name: "Transcendental Meditation", tradition: "Vedic", focus: "Mantra-based stillness", duration: "20 min", level: "Beginner" },
    { name: "Centering Prayer", tradition: "Christian Contemplative", focus: "Divine presence", duration: "20 min", level: "Beginner" },
    { name: "Sufi Dhikr", tradition: "Islamic Mysticism", focus: "Remembrance of God", duration: "15-45 min", level: "Intermediate" },
    { name: "Zazen", tradition: "Zen Buddhism", focus: "Just sitting, pure awareness", duration: "25-40 min", level: "Advanced" },
    { name: "Yoga Nidra", tradition: "Tantric Yoga", focus: "Conscious sleep, deep relaxation", duration: "30-60 min", level: "Beginner" },
    { name: "Walking Meditation", tradition: "Buddhist/Contemplative", focus: "Mindful movement", duration: "15-30 min", level: "Beginner" }
  ],
  contemplation: [
    { name: "Lectio Divina", tradition: "Christian Monastic", focus: "Sacred reading and reflection", steps: ["Read", "Reflect", "Respond", "Rest"] },
    { name: "Koan Practice", tradition: "Zen Buddhism", focus: "Breaking through logical mind", examples: ["What is the sound of one hand clapping?", "What was your original face before your parents were born?"] },
    { name: "Self-Inquiry (Atma Vichara)", tradition: "Advaita Vedanta", focus: "Tracing 'I' to its source", keyQuestion: "Who am I?" },
    { name: "Examen", tradition: "Ignatian Spirituality", focus: "Daily review with gratitude", steps: ["Give thanks", "Ask for light", "Review day", "Face shortcomings", "Resolve"] }
  ],
  breathwork: [
    { name: "Pranayama", tradition: "Yogic", techniques: ["Alternate Nostril (Nadi Shodhana)", "Breath of Fire (Kapalabhati)", "Victorious Breath (Ujjayi)"] },
    { name: "Holotropic Breathwork", tradition: "Transpersonal Psychology", focus: "Non-ordinary states of consciousness" },
    { name: "Box Breathing", tradition: "Modern/Military", pattern: "4-4-4-4 inhale-hold-exhale-hold" },
    { name: "Wim Hof Method", tradition: "Modern", focus: "Cold exposure + controlled hyperventilation" }
  ]
};

// Stages of Spiritual Development
const developmentalStages = {
  wilber: [
    { stage: "Archaic", description: "Basic survival consciousness", color: "Infrared" },
    { stage: "Magic", description: "Animistic, cause-effect confusion", color: "Magenta" },
    { stage: "Mythic", description: "Traditional, rule-based, conformist", color: "Amber" },
    { stage: "Rational", description: "Scientific, individualistic, achievement", color: "Orange" },
    { stage: "Pluralistic", description: "Relativistic, egalitarian, sensitive", color: "Green" },
    { stage: "Integral", description: "Systems thinking, both/and, integrating perspectives", color: "Teal" },
    { stage: "Super-Integral", description: "Kosmocentric, unity consciousness", color: "Turquoise" }
  ],
  fowler: [
    { stage: 0, name: "Primal Faith", age: "0-2", description: "Pre-linguistic trust and mutuality" },
    { stage: 1, name: "Intuitive-Projective", age: "2-6", description: "Fantasy-filled, imitative faith" },
    { stage: 2, name: "Mythic-Literal", age: "7-12", description: "Literal interpretation, narrative" },
    { stage: 3, name: "Synthetic-Conventional", age: "Teen", description: "Conformist, interpersonally oriented" },
    { stage: 4, name: "Individuative-Reflective", age: "Young adult", description: "Personal meaning-making, critical reflection" },
    { stage: 5, name: "Conjunctive", age: "Mid-life+", description: "Integration of opposites, symbolic depth" },
    { stage: 6, name: "Universalizing", age: "Rare", description: "Incarnation of universal compassion" }
  ]
};

// Sacred Texts and Teachings
const sacredWisdom = {
  universal: [
    { teaching: "The Golden Rule", essence: "Treat others as you wish to be treated", traditions: "Universal" },
    { teaching: "Non-attachment", essence: "Freedom from clinging to outcomes", traditions: "Buddhist, Hindu, Stoic" },
    { teaching: "Divine Love", essence: "Unconditional love as the highest principle", traditions: "Christian, Sufi, Bhakti" },
    { teaching: "Unity of Being", essence: "All is One, separation is illusion", traditions: "Advaita, Sufi, Kabbalistic" },
    { teaching: "Present Moment Awareness", essence: "Now is the only real time", traditions: "Zen, Eckhart Tolle, Mindfulness" }
  ],
  perennialTruths: [
    "There is a transcendent Reality beyond ordinary perception",
    "This Reality can be directly experienced through practice",
    "Human beings possess a divine spark or Buddha-nature",
    "The path involves purification, illumination, and union",
    "Compassion and wisdom are inseparable",
    "Ego-transcendence leads to liberation and peace"
  ]
};

// Spiritual Intelligence Domains (based on research)
const sqDomains = [
  {
    domain: "Critical Existential Thinking",
    description: "Capacity to contemplate meaning, purpose, and existential questions",
    practices: ["Philosophical inquiry", "Death meditation", "Life review"],
    indicators: ["Comfort with ambiguity", "Meaning-making capacity", "Philosophical depth"]
  },
  {
    domain: "Personal Meaning Production",
    description: "Ability to derive meaning from experiences and construct life purpose",
    practices: ["Journaling", "Values clarification", "Purpose mapping"],
    indicators: ["Clear sense of purpose", "Coherent life narrative", "Value-aligned action"]
  },
  {
    domain: "Transcendent Awareness",
    description: "Recognition of dimensions beyond the material and mundane",
    practices: ["Meditation", "Nature immersion", "Awe practices"],
    indicators: ["Peak experiences", "Sense of interconnection", "Ego-transcendence"]
  },
  {
    domain: "Conscious State Expansion",
    description: "Ability to access and navigate expanded states of consciousness",
    practices: ["Breathwork", "Deep meditation", "Flow activities"],
    indicators: ["State flexibility", "Integration of experiences", "Equanimity"]
  }
];

// GET /api/spiritual-intelligence/practices
router.get("/practices", (_req, res) => {
  res.json({
    ok: true,
    data: spiritualPractices,
    description: "Comprehensive catalog of spiritual practices across traditions"
  });
});

// GET /api/spiritual-intelligence/development
router.get("/development", (_req, res) => {
  res.json({
    ok: true,
    data: developmentalStages,
    models: ["Ken Wilber's Integral Stages", "James Fowler's Stages of Faith"],
    description: "Models of spiritual and faith development"
  });
});

// GET /api/spiritual-intelligence/wisdom
router.get("/wisdom", (_req, res) => {
  res.json({
    ok: true,
    data: sacredWisdom,
    description: "Universal teachings and perennial truths across traditions"
  });
});

// GET /api/spiritual-intelligence/domains
router.get("/domains", (_req, res) => {
  res.json({
    ok: true,
    data: sqDomains,
    description: "Four domains of Spiritual Intelligence (SQ)"
  });
});

// POST /api/spiritual-intelligence/practice-recommendation
router.post("/practice-recommendation", (req, res) => {
  const { intention, experienceLevel, timeAvailable: _timeAvailable, tradition } = req.body;

  const levelMap = { beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" };
  const level = levelMap[experienceLevel] || "Beginner";

  const recommendations = [];

  spiritualPractices.meditation.forEach(p => {
    if (p.level === level || level === "Advanced") {
      if (!tradition || p.tradition.toLowerCase().includes(tradition.toLowerCase())) {
        recommendations.push({ type: "meditation", ...p });
      }
    }
  });

  spiritualPractices.contemplation.forEach(p => {
    if (!tradition || p.tradition.toLowerCase().includes(tradition.toLowerCase())) {
      recommendations.push({ type: "contemplation", ...p });
    }
  });

  res.json({
    ok: true,
    data: {
      intention: intention || "general spiritual growth",
      level,
      recommendations: recommendations.slice(0, 5),
      guidance: "Start with shorter sessions and gradually increase duration. Consistency matters more than intensity."
    }
  });
});

// GET /api/spiritual-intelligence/random-teaching
router.get("/random-teaching", (_req, res) => {
  const teachings = sacredWisdom.universal;
  const random = teachings[Math.floor(Math.random() * teachings.length)];
  
  res.json({
    ok: true,
    data: random,
    reflection: "How might this teaching apply to your current life situation?"
  });
});


// Health check endpoint for admin daily tools monitoring
router.get("/", (req, res) => {
  res.json({ ok: true, module: "spiritual-intelligence", status: "operational", timestamp: new Date().toISOString() });
});

export default router;
