// server/routes/healing-modalities.mjs
// Comprehensive healing modalities and therapeutic approaches API

import express from "express";
const router = express.Router();

const THERAPEUTIC_MODALITIES = [
  {
    id: "cbt",
    name: "Cognitive Behavioral Therapy (CBT)",
    description: "Identify and change negative thought patterns",
    principles: [
      "Thoughts influence feelings and behaviors",
      "Cognitive distortions can be identified and challenged",
      "Behavioral changes reinforce cognitive shifts"
    ],
    techniques: [
      "Thought records",
      "Cognitive restructuring",
      "Behavioral activation",
      "Exposure therapy"
    ],
    bestFor: ["Anxiety", "Depression", "Phobias", "OCD"]
  },
  {
    id: "dbt",
    name: "Dialectical Behavior Therapy (DBT)",
    description: "Balance acceptance and change for emotional regulation",
    principles: [
      "Dialectical thinking (both/and vs either/or)",
      "Mindfulness as foundation",
      "Validation plus change"
    ],
    techniques: [
      "Distress tolerance",
      "Emotion regulation",
      "Interpersonal effectiveness",
      "TIPP skills"
    ],
    bestFor: ["BPD", "Self-harm", "Emotional dysregulation", "Relationship issues"]
  },
  {
    id: "emdr",
    name: "EMDR (Eye Movement Desensitization & Reprocessing)",
    description: "Process traumatic memories through bilateral stimulation",
    principles: [
      "Trauma gets stuck in the nervous system",
      "Bilateral stimulation facilitates processing",
      "Adaptive information processing"
    ],
    techniques: [
      "Bilateral eye movements",
      "Resource installation",
      "Targeting protocol",
      "Future template"
    ],
    bestFor: ["PTSD", "Trauma", "Phobias", "Anxiety"]
  },
  {
    id: "ifs",
    name: "Internal Family Systems (IFS)",
    description: "Work with internal parts from Self leadership",
    principles: [
      "Mind is naturally multiple",
      "All parts have positive intent",
      "Self is the healing agent",
      "Unburdening liberates parts"
    ],
    techniques: [
      "Parts detection",
      "Unblending",
      "Working with exiles and protectors",
      "Unburdening"
    ],
    bestFor: ["Complex trauma", "Self-criticism", "Inner conflict", "Relationship patterns"]
  },
  {
    id: "somatic-experiencing",
    name: "Somatic Experiencing",
    description: "Release trauma stored in the body",
    principles: [
      "Trauma is in the body, not the event",
      "Completion of thwarted responses",
      "Titration and pendulation"
    ],
    techniques: [
      "Tracking body sensations",
      "Resourcing",
      "Titration",
      "Discharge"
    ],
    bestFor: ["Shock trauma", "Chronic tension", "Dissociation", "Anxiety"]
  },
  {
    id: "act",
    name: "Acceptance & Commitment Therapy (ACT)",
    description: "Psychological flexibility through mindfulness and values",
    principles: [
      "Acceptance vs avoidance",
      "Cognitive defusion",
      "Values-driven action",
      "Present moment awareness"
    ],
    techniques: [
      "Defusion exercises",
      "Values clarification",
      "Committed action",
      "The Observer Self"
    ],
    bestFor: ["Chronic pain", "Anxiety", "Depression", "Life transitions"]
  }
];

const SOMATIC_PRACTICES = [
  {
    id: "body-scan",
    name: "Progressive Body Scan",
    description: "Systematic awareness of body sensations",
    duration: "15-30 min",
    steps: [
      "Lie down comfortably",
      "Bring attention to feet, notice sensations",
      "Slowly move attention up through body",
      "Notice without judgment or changing",
      "Complete at top of head"
    ]
  },
  {
    id: "tremoring",
    name: "Neurogenic Tremoring (TRE)",
    description: "Activate natural tremor mechanism for stress release",
    duration: "15-20 min",
    steps: [
      "Perform activation exercises (wall sit, etc.)",
      "Lie on back, allow tremors to arise",
      "Let tremors spread through body",
      "Observe without controlling",
      "Stop when complete"
    ]
  },
  {
    id: "vagal-toning",
    name: "Vagal Toning",
    description: "Activate the parasympathetic nervous system",
    duration: "5-10 min",
    steps: [
      "Cold water on face or neck",
      "Humming or singing",
      "Gargling",
      "Deep slow breathing",
      "Social engagement"
    ]
  },
  {
    id: "orienting",
    name: "Orienting Response",
    description: "Ground in present environment through senses",
    duration: "3-5 min",
    steps: [
      "Slowly look around the room",
      "Name 5 things you see",
      "Notice colors, shapes, textures",
      "Feel your body in space",
      "Notice you are safe here and now"
    ]
  }
];

const ENERGY_HEALING = [
  {
    id: "reiki",
    name: "Reiki",
    origin: "Japan",
    description: "Universal life force energy channeling for healing",
    principles: ["Just for today: no anger, no worry, be grateful, work diligently, be kind"]
  },
  {
    id: "acupuncture",
    name: "Acupuncture/Acupressure",
    origin: "Traditional Chinese Medicine",
    description: "Balance chi/qi through meridian points",
    principles: ["Chi flows through meridians", "Blockages cause disease", "Points access energy flow"]
  },
  {
    id: "chakra",
    name: "Chakra Balancing",
    origin: "Hindu/Yogic traditions",
    description: "Harmonize the seven main energy centers",
    chakras: [
      { name: "Root", location: "Base of spine", theme: "Safety, grounding" },
      { name: "Sacral", location: "Lower abdomen", theme: "Creativity, pleasure" },
      { name: "Solar Plexus", location: "Upper abdomen", theme: "Power, will" },
      { name: "Heart", location: "Center of chest", theme: "Love, connection" },
      { name: "Throat", location: "Throat", theme: "Expression, truth" },
      { name: "Third Eye", location: "Between eyebrows", theme: "Intuition, wisdom" },
      { name: "Crown", location: "Top of head", theme: "Spirituality, unity" }
    ]
  }
];

const SELF_CARE_TOOLKIT = [
  {
    id: "grounding",
    name: "5-4-3-2-1 Grounding",
    description: "Use senses to ground in present moment",
    steps: ["5 things you see", "4 things you feel", "3 things you hear", "2 things you smell", "1 thing you taste"]
  },
  {
    id: "tipp",
    name: "TIPP Skills (DBT)",
    description: "Rapidly change body chemistry in crisis",
    steps: ["Temperature (cold water)", "Intense exercise", "Paced breathing", "Paired muscle relaxation"]
  },
  {
    id: "rain",
    name: "RAIN Meditation",
    description: "Self-compassion practice for difficult emotions",
    steps: ["Recognize what's happening", "Allow experience to be", "Investigate with kindness", "Nurture with self-compassion"]
  },
  {
    id: "please",
    name: "PLEASE Skills (DBT)",
    description: "Physical self-care to reduce vulnerability",
    steps: ["Physical illness (treat)", "Licit drugs only", "Eating balanced", "Avoid mood-altering substances", "Sleep", "Exercise"]
  }
];

router.get("/modalities", (req, res) => {
  res.json({ success: true, data: THERAPEUTIC_MODALITIES });
});

router.get("/somatic", (req, res) => {
  res.json({ success: true, data: SOMATIC_PRACTICES });
});

router.get("/energy-healing", (req, res) => {
  res.json({ success: true, data: ENERGY_HEALING });
});

router.get("/self-care", (req, res) => {
  res.json({ success: true, data: SELF_CARE_TOOLKIT });
});

router.get("/all", (req, res) => {
  res.json({
    success: true,
    data: {
      therapeuticModalities: THERAPEUTIC_MODALITIES,
      somaticPractices: SOMATIC_PRACTICES,
      energyHealing: ENERGY_HEALING,
      selfCareToolkit: SELF_CARE_TOOLKIT
    }
  });
});

export default router;
