import { Router } from "express";

const router = Router();

const BREATHWORK_PROTOCOLS = [
  {
    id: "box-breathing",
    name: "Box Breathing",
    category: "Calming",
    description: "Military-grade stress reduction technique for nervous system regulation",
    duration: "5-10 min",
    pattern: { inhale: 4, holdIn: 4, exhale: 4, holdOut: 4 },
    benefits: ["Reduces cortisol", "Activates parasympathetic", "Improves focus"],
    guidance: [
      "Sit comfortably with spine straight",
      "Inhale slowly through nose for 4 counts",
      "Hold breath gently for 4 counts",
      "Exhale slowly through mouth for 4 counts",
      "Hold empty for 4 counts",
      "Repeat 4-8 cycles"
    ]
  },
  {
    id: "478-breathing",
    name: "4-7-8 Relaxation Breath",
    category: "Sleep & Anxiety",
    description: "Dr. Andrew Weil's natural tranquilizer for the nervous system",
    duration: "3-5 min",
    pattern: { inhale: 4, hold: 7, exhale: 8 },
    benefits: ["Natural sleep aid", "Reduces anxiety", "Lowers blood pressure"],
    guidance: [
      "Place tongue behind upper front teeth",
      "Exhale completely through mouth with whoosh",
      "Close mouth, inhale through nose for 4 counts",
      "Hold breath for 7 counts",
      "Exhale completely through mouth for 8 counts",
      "Repeat 4 cycles"
    ]
  },
  {
    id: "holotropic",
    name: "Holotropic Breathwork Light",
    category: "Transformational",
    description: "Adapted conscious breathing for emotional release and insight",
    duration: "20-30 min",
    pattern: { inhale: 2, exhale: 2, continuous: true },
    benefits: ["Emotional release", "Expanded awareness", "Trauma processing"],
    guidance: [
      "Lie down in safe, comfortable space",
      "Begin with normal breathing",
      "Gradually increase pace and depth",
      "Breathe continuously without pause",
      "Allow emotions and sensations to arise",
      "Return to normal breathing slowly"
    ],
    contraindications: ["Cardiovascular issues", "Pregnancy", "Recent surgery"]
  },
  {
    id: "wim-hof",
    name: "Wim Hof Method Basics",
    category: "Energizing",
    description: "Cold exposure breathing for resilience and immune function",
    duration: "15-20 min",
    pattern: { powerBreaths: 30, retention: "max", recovery: 15 },
    benefits: ["Increased energy", "Immune boost", "Mental clarity"],
    guidance: [
      "Take 30-40 deep power breaths",
      "On last exhale, hold breath as long as comfortable",
      "Take one deep recovery breath, hold 15 seconds",
      "Repeat 3-4 rounds",
      "Follow with cold exposure if desired"
    ],
    contraindications: ["Epilepsy", "High blood pressure", "Heart conditions"]
  }
];

const NERVOUS_SYSTEM_REGULATION = [
  {
    id: "vagal-toning",
    name: "Vagal Toning Exercises",
    category: "Polyvagal",
    description: "Stimulate the vagus nerve for calm and social engagement",
    techniques: [
      { name: "Cold Water Face Immersion", steps: ["Fill bowl with cold water", "Hold breath", "Immerse face 15-30 seconds", "Notice calming effect"], duration: "1 min" },
      { name: "Humming/Chanting", steps: ["Inhale deeply", "Exhale with audible 'om' or hum", "Feel vibration in chest and throat", "Repeat 5-10 times"], duration: "3 min" },
      { name: "Gargling", steps: ["Take sip of water", "Gargle vigorously 30 seconds", "Repeat 3 times daily"], duration: "2 min" },
      { name: "Ear Massage", steps: ["Gently massage outer ear", "Focus on tragus and concha", "Pull earlobes gently", "Massage behind ears"], duration: "2 min" }
    ]
  },
  {
    id: "window-tolerance",
    name: "Window of Tolerance Expansion",
    category: "Trauma-Informed",
    description: "Gradually expand capacity for emotional intensity",
    techniques: [
      { name: "Titration", steps: ["Touch into difficult emotion briefly", "Pull back to safety", "Resource with grounding", "Repeat with slightly more"], duration: "10 min" },
      { name: "Pendulation", steps: ["Notice area of activation", "Shift to neutral/pleasant area", "Oscillate between them", "Allow settling"], duration: "5 min" },
      { name: "Discharge", steps: ["Notice physical tension", "Allow natural movement", "Shake, tremble, stretch", "Complete the stress cycle"], duration: "5 min" }
    ]
  },
  {
    id: "co-regulation",
    name: "Co-Regulation Practices",
    category: "Relational",
    description: "Borrow nervous system regulation from safe others",
    techniques: [
      { name: "Eye Contact Practice", steps: ["Sit facing safe person", "Soft eye contact 2-3 minutes", "Notice safety in connection", "Share experience after"], duration: "5 min" },
      { name: "Synchronized Breathing", steps: ["Match breath with partner", "Inhale and exhale together", "Feel rhythm alignment", "Notice co-regulation"], duration: "5 min" },
      { name: "Safe Touch", steps: ["Request hand holding or hug", "Focus on warmth and pressure", "Breathe together", "Allow nervous system to settle"], duration: "varies" }
    ]
  }
];

const INNER_CHILD_HEALING = [
  {
    id: "inner-child-dialogue",
    name: "Inner Child Dialogue",
    description: "Compassionate communication with younger self",
    duration: "20-30 min",
    steps: [
      "Find quiet, safe space",
      "Close eyes and take deep breaths",
      "Visualize yourself at a young age",
      "Notice what this child needs",
      "Offer the words they needed to hear",
      "Provide comfort and reassurance",
      "Let adult self promise protection",
      "Bring child self into your heart"
    ],
    healingStatements: [
      "You are safe now",
      "It wasn't your fault",
      "You are worthy of love",
      "I will protect you",
      "Your feelings matter",
      "You are enough, exactly as you are"
    ]
  },
  {
    id: "reparenting",
    name: "Reparenting Practice",
    description: "Provide the parenting you needed but didn't receive",
    duration: "ongoing",
    principles: [
      { area: "Safety", practice: "Create consistent routines and boundaries" },
      { area: "Attunement", practice: "Notice and validate your own emotional states" },
      { area: "Comfort", practice: "Offer self-soothing when distressed" },
      { area: "Delight", practice: "Celebrate your existence and achievements" },
      { area: "Support", practice: "Encourage yourself through challenges" }
    ]
  },
  {
    id: "parts-integration",
    name: "Parts Integration Work",
    description: "IFS-inspired healing of fragmented self-parts",
    duration: "30-45 min",
    steps: [
      "Center in Self-energy (calm, curious, compassionate)",
      "Invite a protective part to share its story",
      "Listen without judgment",
      "Ask what it protects",
      "Thank it for its role",
      "Ask what it needs to feel safe",
      "Offer new arrangement",
      "Check for any exile parts needing attention"
    ]
  }
];

const SOMATIC_PRACTICES = [
  {
    id: "progressive-relaxation",
    name: "Progressive Muscle Relaxation",
    category: "Body-Based",
    duration: "15-20 min",
    sequence: ["feet", "calves", "thighs", "glutes", "abdomen", "chest", "hands", "arms", "shoulders", "neck", "face"],
    instructions: "Tense each muscle group for 5-7 seconds, then release completely. Notice the contrast."
  },
  {
    id: "body-scan-trauma",
    name: "Trauma-Sensitive Body Scan",
    category: "Body-Based",
    duration: "10-20 min",
    guidance: [
      "Move attention through body slowly",
      "Notice sensations without interpretation",
      "If intensity arises, pause and ground",
      "Skip areas that feel too activating",
      "End with whole-body awareness"
    ]
  },
  {
    id: "orienting",
    name: "Orienting to Safety",
    category: "Grounding",
    duration: "5 min",
    steps: [
      "Slowly turn head left, noticing environment",
      "Pause on anything pleasant or neutral",
      "Slowly turn head right, continuing to observe",
      "Let neck and shoulders relax",
      "Notice you are here, now, safe"
    ]
  }
];

const ENERGY_HEALING = [
  {
    id: "chakra-balancing",
    name: "Chakra Awareness & Balancing",
    category: "Subtle Energy",
    centers: [
      { name: "Root", location: "Base of spine", theme: "Safety & Grounding", color: "red" },
      { name: "Sacral", location: "Lower abdomen", theme: "Creativity & Emotion", color: "orange" },
      { name: "Solar Plexus", location: "Upper abdomen", theme: "Power & Will", color: "yellow" },
      { name: "Heart", location: "Center of chest", theme: "Love & Connection", color: "green" },
      { name: "Throat", location: "Throat", theme: "Expression & Truth", color: "blue" },
      { name: "Third Eye", location: "Forehead", theme: "Intuition & Wisdom", color: "indigo" },
      { name: "Crown", location: "Top of head", theme: "Spirit & Unity", color: "violet" }
    ],
    practice: "Visualize each center glowing with its color, breathing life and balance into each"
  },
  {
    id: "grounding-earth",
    name: "Earth Grounding Practice",
    category: "Nature Connection",
    duration: "10-20 min",
    steps: [
      "Stand barefoot on earth if possible",
      "Visualize roots growing from feet into ground",
      "Feel connection to earth's stability",
      "Draw up earth energy with each inhale",
      "Release tension down through roots on exhale"
    ]
  }
];

const HEALING_JOURNEYS = [
  {
    id: "forgiveness-process",
    name: "Radical Forgiveness Process",
    duration: "30-45 min",
    stages: [
      { stage: 1, name: "Tell the Story", action: "Write the grievance in full detail" },
      { stage: 2, name: "Feel the Feelings", action: "Allow all emotions without censorship" },
      { stage: 3, name: "Reframe the Story", action: "Consider higher purpose or learning" },
      { stage: 4, name: "Release", action: "Consciously choose to let go of resentment" },
      { stage: 5, name: "Integrate", action: "Express gratitude for the transformation" }
    ]
  },
  {
    id: "grief-honoring",
    name: "Grief Honoring Ritual",
    duration: "varies",
    elements: [
      "Create sacred space",
      "Light candle for what was lost",
      "Speak or write to the loss",
      "Allow tears and sounds",
      "Remember what was loved",
      "Thank what was for its gifts",
      "Release with intention",
      "Blow out candle when ready"
    ]
  },
  {
    id: "self-compassion",
    name: "Self-Compassion Practice",
    duration: "10-15 min",
    phrases: [
      "This is a moment of suffering",
      "Suffering is part of being human",
      "May I be kind to myself",
      "May I give myself the compassion I need"
    ],
    gesture: "Place hand on heart while speaking phrases"
  }
];

router.get("/breathwork", (_req, res) => {
  res.json({ success: true, data: BREATHWORK_PROTOCOLS });
});

router.get("/breathwork/:id", (req, res) => {
  const protocol = BREATHWORK_PROTOCOLS.find(p => p.id === req.params.id);
  if (!protocol) return res.status(404).json({ success: false, error: "Protocol not found" });
  res.json({ success: true, data: protocol });
});

router.get("/nervous-system", (_req, res) => {
  res.json({ success: true, data: NERVOUS_SYSTEM_REGULATION });
});

router.get("/inner-child", (_req, res) => {
  res.json({ success: true, data: INNER_CHILD_HEALING });
});

router.get("/somatic", (_req, res) => {
  res.json({ success: true, data: SOMATIC_PRACTICES });
});

router.get("/energy", (_req, res) => {
  res.json({ success: true, data: ENERGY_HEALING });
});

router.get("/journeys", (_req, res) => {
  res.json({ success: true, data: HEALING_JOURNEYS });
});

router.get("/all", (_req, res) => {
  res.json({
    success: true,
    data: {
      breathwork: BREATHWORK_PROTOCOLS,
      nervousSystem: NERVOUS_SYSTEM_REGULATION,
      innerChild: INNER_CHILD_HEALING,
      somatic: SOMATIC_PRACTICES,
      energy: ENERGY_HEALING,
      journeys: HEALING_JOURNEYS
    },
    summary: {
      totalProtocols: BREATHWORK_PROTOCOLS.length + NERVOUS_SYSTEM_REGULATION.length + INNER_CHILD_HEALING.length + SOMATIC_PRACTICES.length + ENERGY_HEALING.length + HEALING_JOURNEYS.length,
      categories: ["Breathwork", "Nervous System", "Inner Child", "Somatic", "Energy", "Journeys"]
    }
  });
});

export default router;
