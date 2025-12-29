import express from "express";

const router = express.Router();

const POST_TRAUMATIC_GROWTH_DOMAINS = [
  {
    domain: "Personal Strength",
    description: "Discovering inner resources you didn't know you had.",
    examples: ["Increased self-reliance", "Confidence in handling difficulties", "Knowing you can survive"],
    cultivation: "Reflect on how you've grown stronger through challenges."
  },
  {
    domain: "New Possibilities",
    description: "Seeing new paths and opportunities that weren't visible before.",
    examples: ["New interests", "Career changes", "Different priorities", "New roles"],
    cultivation: "Stay open to unexpected directions your life might take."
  },
  {
    domain: "Relating to Others",
    description: "Deeper and more meaningful relationships.",
    examples: ["Greater compassion", "Closer relationships", "Willingness to be vulnerable", "Appreciation for others"],
    cultivation: "Allow others to support you and offer support in return."
  },
  {
    domain: "Appreciation of Life",
    description: "Enhanced gratitude for everyday experiences.",
    examples: ["Changed priorities", "Appreciation for each day", "Not taking things for granted", "Presence"],
    cultivation: "Practice gratitude and savor simple pleasures."
  },
  {
    domain: "Spiritual/Existential Change",
    description: "Deeper sense of meaning, purpose, or spirituality.",
    examples: ["Stronger faith", "Greater sense of purpose", "Understanding of existence", "Connection to something larger"],
    cultivation: "Explore questions of meaning and purpose."
  }
];

const REINTEGRATION_PHASES = [
  {
    phase: "Stabilization",
    description: "Establishing safety and basic functioning.",
    tasks: ["Physical safety", "Basic self-care", "Sleep and nutrition", "Reducing acute symptoms"],
    signs_of_progress: ["Feeling safer", "More consistent routines", "Less overwhelming symptoms"]
  },
  {
    phase: "Processing",
    description: "Working through traumatic memories and emotions.",
    tasks: ["Telling your story", "Emotional expression", "Making sense of what happened", "Grief work"],
    signs_of_progress: ["Memories less intrusive", "Able to discuss without overwhelm", "Beginning to find meaning"]
  },
  {
    phase: "Reconnection",
    description: "Rebuilding life and relationships.",
    tasks: ["Renewed relationships", "New activities and goals", "Contribution to others", "Identity reconstruction"],
    signs_of_progress: ["Engaged in meaningful activities", "Connected relationships", "Sense of future"]
  },
  {
    phase: "Integration",
    description: "Incorporating the experience into your life story.",
    tasks: ["Coherent narrative", "Acceptance", "Post-traumatic growth", "Helping others"],
    signs_of_progress: ["Trauma is part of story, not whole story", "Growth recognized", "Able to help others"]
  }
];

const HEALING_MODALITIES = [
  {
    modality: "Trauma-Focused CBT",
    description: "Cognitive restructuring of trauma-related thoughts.",
    focus: "Thoughts and beliefs",
    suitable_for: "Processing specific traumatic events"
  },
  {
    modality: "EMDR",
    description: "Bilateral stimulation to process traumatic memories.",
    focus: "Memory processing",
    suitable_for: "Single-incident trauma, PTSD"
  },
  {
    modality: "Somatic Experiencing",
    description: "Body-based approach to release stored trauma.",
    focus: "Nervous system regulation",
    suitable_for: "Developmental trauma, chronic stress"
  },
  {
    modality: "Internal Family Systems",
    description: "Working with internal parts carrying trauma.",
    focus: "Parts and self",
    suitable_for: "Complex trauma, dissociation"
  },
  {
    modality: "Narrative Therapy",
    description: "Reauthoring life stories and externalizing problems.",
    focus: "Life narrative",
    suitable_for: "Identity reconstruction, meaning-making"
  },
  {
    modality: "Mindfulness-Based Approaches",
    description: "Present-moment awareness and acceptance.",
    focus: "Awareness and acceptance",
    suitable_for: "Anxiety, depression, chronic pain"
  }
];

const RESILIENCE_BUILDERS = [
  { factor: "Social Support", description: "Strong relationships and community.", practice: "Reach out, accept help, give support." },
  { factor: "Meaning-Making", description: "Finding purpose in adversity.", practice: "Ask 'What can I learn?' 'How can this help others?'" },
  { factor: "Self-Compassion", description: "Kindness toward yourself in suffering.", practice: "Treat yourself as you would a good friend." },
  { factor: "Hope", description: "Belief that things can improve.", practice: "Set small goals, notice progress, connect with hopeful people." },
  { factor: "Flexibility", description: "Ability to adapt to changing circumstances.", practice: "Practice accepting what you cannot change." },
  { factor: "Spiritual Resources", description: "Connection to something larger than self.", practice: "Engage with your spiritual tradition or explore new practices." }
];

router.get("/growth-domains", (_req, res) => {
  res.json({ ok: true, domains: POST_TRAUMATIC_GROWTH_DOMAINS });
});

router.get("/reintegration", (_req, res) => {
  res.json({ ok: true, phases: REINTEGRATION_PHASES });
});

router.get("/modalities", (_req, res) => {
  res.json({ ok: true, modalities: HEALING_MODALITIES });
});

router.get("/resilience", (_req, res) => {
  res.json({ ok: true, factors: RESILIENCE_BUILDERS });
});

router.get("/daily", (_req, res) => {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  
  const domain = POST_TRAUMATIC_GROWTH_DOMAINS[dayOfYear % POST_TRAUMATIC_GROWTH_DOMAINS.length];
  const phase = REINTEGRATION_PHASES[dayOfYear % REINTEGRATION_PHASES.length];
  const resilience = RESILIENCE_BUILDERS[dayOfYear % RESILIENCE_BUILDERS.length];
  
  res.json({
    ok: true,
    daily: {
      growthDomain: domain,
      reintegrationPhase: phase,
      resilienceFactor: resilience,
      healingPrompt: `Today, reflect on "${domain.domain}": ${domain.description}`,
      resiliencePractice: `Build "${resilience.factor}": ${resilience.practice}`
    }
  });
});

export default router;
