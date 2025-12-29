import express from "express";

const router = express.Router();

const COMPASSIONATE_SYSTEMS = [
  {
    name: "Trauma-Informed Systems Design",
    description: "Design systems that recognize and heal collective trauma rather than perpetuate it.",
    principles: [
      "Safety: Ensure physical, emotional, and psychological safety for all participants",
      "Trustworthiness: Build transparent, consistent, and reliable systems",
      "Choice: Maximize agency and self-determination within structures",
      "Collaboration: Share power and decision-making authentically",
      "Empowerment: Build on strengths and support growth"
    ],
    application: "Organizational design, policy development, community building"
  },
  {
    name: "Compassionate Feedback Loops",
    description: "Design feedback mechanisms that promote healing rather than shame.",
    elements: [
      "Feedback focuses on behavior, not identity",
      "Acknowledges context and constraints",
      "Offers concrete pathways forward",
      "Creates psychological safety for receiving feedback",
      "Recognizes growth and effort"
    ],
    application: "Performance systems, educational assessment, relationship communication"
  },
  {
    name: "Collective Healing Frameworks",
    description: "Address systemic harm through community-based approaches.",
    stages: [
      "Truth-telling: Create space for naming harm",
      "Acknowledgment: Validate experiences without defensiveness",
      "Accountability: Accept responsibility for harm caused",
      "Repair: Take concrete action to address damage",
      "Transformation: Change systems to prevent recurrence"
    ],
    application: "Restorative justice, organizational healing, community reconciliation"
  },
  {
    name: "Interconnection Mapping",
    description: "Visualize how individual healing connects to collective transformation.",
    levels: [
      "Individual: Personal healing and growth",
      "Relational: Healing in close relationships",
      "Communal: Healing within local communities",
      "Societal: Systemic and cultural transformation",
      "Ecological: Reconnection with natural world"
    ],
    application: "Strategic planning, intervention design, impact assessment"
  }
];

const SYSTEMIC_INTERVENTIONS = [
  {
    level: "Upstream",
    description: "Address root causes before harm occurs.",
    examples: ["Early childhood support", "Economic justice policies", "Environmental protection"],
    compassion_principle: "Prevent suffering before it begins"
  },
  {
    level: "Midstream",
    description: "Intervene during emerging challenges.",
    examples: ["Crisis intervention", "Conflict mediation", "Early warning systems"],
    compassion_principle: "Respond quickly to reduce harm duration"
  },
  {
    level: "Downstream",
    description: "Support healing after harm has occurred.",
    examples: ["Trauma therapy", "Restorative practices", "Recovery support"],
    compassion_principle: "Help those already suffering find healing"
  }
];

const HEALING_NARRATIVES = [
  {
    archetype: "The Wounded Healer",
    description: "Those who transform their own suffering into service.",
    integration: "Personal pain becomes wisdom for helping others."
  },
  {
    archetype: "The Witness",
    description: "Those who hold space for others' stories without trying to fix.",
    integration: "Presence and validation enable healing."
  },
  {
    archetype: "The Bridge Builder",
    description: "Those who connect divided groups through shared humanity.",
    integration: "Empathy across difference creates collective healing."
  },
  {
    archetype: "The Truth Teller",
    description: "Those who name uncomfortable realities with compassion.",
    integration: "Honest acknowledgment enables genuine transformation."
  },
  {
    archetype: "The Gardener",
    description: "Those who cultivate conditions for organic growth.",
    integration: "Patient nurturing creates lasting change."
  }
];

const EMPATHY_SCALES = [
  {
    scale: "Self-Compassion",
    description: "Kindness toward oneself in moments of suffering.",
    practice: "Treat yourself as you would a good friend."
  },
  {
    scale: "Interpersonal Empathy",
    description: "Feeling with others in close relationships.",
    practice: "Listen to understand, not to respond."
  },
  {
    scale: "Community Compassion",
    description: "Care for the wellbeing of one's local community.",
    practice: "Ask: Who in my community might be struggling?"
  },
  {
    scale: "Global Empathy",
    description: "Concern for all humanity regardless of distance.",
    practice: "Connect daily actions to global impacts."
  },
  {
    scale: "Ecological Compassion",
    description: "Care extending to all living beings and systems.",
    practice: "Recognize interdependence with all life."
  },
  {
    scale: "Temporal Compassion",
    description: "Empathy for past and future generations.",
    practice: "Honor ancestors; protect descendants."
  }
];

const COMPASSION_PRACTICES = [
  {
    practice: "Tonglen",
    description: "Tibetan practice of breathing in suffering and breathing out relief.",
    instruction: "Inhale difficulty, transform it internally, exhale peace and wellbeing."
  },
  {
    practice: "Loving-Kindness (Metta)",
    description: "Systematic cultivation of goodwill toward all beings.",
    instruction: "Extend wishes for happiness, health, safety, and ease in expanding circles."
  },
  {
    practice: "Just Like Me",
    description: "Recognition of shared humanity with all people.",
    instruction: "When encountering difficulty with someone, reflect: 'Just like me, this person wants to be happy.'"
  },
  {
    practice: "Compassionate Witnessing",
    description: "Being fully present with suffering without fixing.",
    instruction: "Offer your presence without judgment, advice, or attempts to change."
  },
  {
    practice: "Self-Compassion Break",
    description: "Three-step practice for moments of difficulty.",
    instruction: "Acknowledge suffering, remember common humanity, offer kindness to yourself."
  }
];

router.get("/frameworks", (_req, res) => {
  res.json({ ok: true, frameworks: COMPASSIONATE_SYSTEMS });
});

router.get("/interventions", (_req, res) => {
  res.json({ ok: true, interventions: SYSTEMIC_INTERVENTIONS });
});

router.get("/narratives", (_req, res) => {
  res.json({ ok: true, narratives: HEALING_NARRATIVES });
});

router.get("/scales", (_req, res) => {
  res.json({ ok: true, scales: EMPATHY_SCALES });
});

router.get("/practices", (_req, res) => {
  res.json({ ok: true, practices: COMPASSION_PRACTICES });
});

router.get("/daily", (_req, res) => {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  
  const framework = COMPASSIONATE_SYSTEMS[dayOfYear % COMPASSIONATE_SYSTEMS.length];
  const narrative = HEALING_NARRATIVES[dayOfYear % HEALING_NARRATIVES.length];
  const scale = EMPATHY_SCALES[dayOfYear % EMPATHY_SCALES.length];
  const practice = COMPASSION_PRACTICES[dayOfYear % COMPASSION_PRACTICES.length];
  
  res.json({
    ok: true,
    daily: {
      systemsFramework: framework,
      healingArchetype: narrative,
      empathyScale: scale,
      compassionPractice: practice,
      integrationPrompt: `Today, explore the "${narrative.archetype}" in yourself: ${narrative.integration}`,
      practiceInstruction: `Practice "${practice.practice}": ${practice.instruction}`
    }
  });
});

export default router;
