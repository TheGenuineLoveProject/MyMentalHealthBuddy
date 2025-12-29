import express from "express";

const router = express.Router();

const AFFECTIVE_NEUROSCIENCE_SYSTEMS = [
  {
    system: "SEEKING",
    description: "Curiosity, exploration, and anticipatory excitement.",
    neurotransmitters: ["Dopamine"],
    activation_signs: ["Curiosity", "Enthusiasm", "Forward momentum", "Interest"],
    cultivation: "Explore new ideas, set meaningful goals, pursue what fascinates you.",
    shadow: "Addictive seeking, inability to be present"
  },
  {
    system: "RAGE",
    description: "Frustration when goals are blocked.",
    neurotransmitters: ["Glutamate", "Substance P"],
    activation_signs: ["Frustration", "Anger", "Irritation", "Assertiveness"],
    cultivation: "Set healthy boundaries, address frustrations constructively.",
    shadow: "Destructive anger, chronic hostility"
  },
  {
    system: "FEAR",
    description: "Threat detection and avoidance.",
    neurotransmitters: ["Norepinephrine", "CRH"],
    activation_signs: ["Anxiety", "Vigilance", "Freeze response", "Avoidance"],
    cultivation: "Build safety, gradual exposure, develop courage.",
    shadow: "Chronic anxiety, paralysis, avoidance patterns"
  },
  {
    system: "PANIC/GRIEF",
    description: "Separation distress and social bonding.",
    neurotransmitters: ["Endogenous opioids", "Oxytocin"],
    activation_signs: ["Sadness", "Loneliness", "Longing", "Grief"],
    cultivation: "Nurture close relationships, allow grief to flow.",
    shadow: "Chronic depression, attachment disorders"
  },
  {
    system: "CARE",
    description: "Nurturing and maternal/paternal instincts.",
    neurotransmitters: ["Oxytocin", "Prolactin"],
    activation_signs: ["Tenderness", "Protectiveness", "Nurturing impulses"],
    cultivation: "Give and receive care, practice compassion.",
    shadow: "Codependency, self-neglect"
  },
  {
    system: "PLAY",
    description: "Social joy, rough-and-tumble, humor.",
    neurotransmitters: ["Endocannabinoids", "Dopamine"],
    activation_signs: ["Laughter", "Spontaneity", "Lightness", "Joy"],
    cultivation: "Make time for unstructured play, cultivate humor.",
    shadow: "Inability to be serious, escapism"
  },
  {
    system: "LUST",
    description: "Sexual desire and attraction.",
    neurotransmitters: ["Testosterone", "Estrogen", "Dopamine"],
    activation_signs: ["Attraction", "Desire", "Arousal"],
    cultivation: "Healthy sexuality, integration of desire and connection.",
    shadow: "Objectification, disconnection from intimacy"
  }
];

const BRAIN_REGIONS = [
  { region: "Prefrontal Cortex", function: "Executive function, planning, impulse control", practice: "Mindful pause before reacting" },
  { region: "Amygdala", function: "Threat detection, emotional memory", practice: "Breathing to calm fear response" },
  { region: "Hippocampus", function: "Memory consolidation, spatial navigation", practice: "Sleep, exercise, and learning new things" },
  { region: "Insula", function: "Interoception, empathy, self-awareness", practice: "Body awareness meditation" },
  { region: "Anterior Cingulate", function: "Error detection, emotional regulation", practice: "Notice and correct negative patterns" },
  { region: "Default Mode Network", function: "Self-reflection, mind-wandering, autobiographical thinking", practice: "Journaling and self-inquiry" }
];

const NEUROPLASTICITY_PRINCIPLES = [
  { principle: "Use It or Lose It", description: "Neural pathways strengthen with use, weaken without.", application: "Regularly practice desired skills and mindsets." },
  { principle: "Use It and Improve It", description: "Practice enhances neural efficiency.", application: "Deliberate practice builds mastery." },
  { principle: "Specificity", description: "Training is specific to the task practiced.", application: "Practice the exact skill you want to develop." },
  { principle: "Repetition Matters", description: "Sufficient repetition creates lasting change.", application: "Consistent daily practice over sporadic intense sessions." },
  { principle: "Intensity Matters", description: "Training intensity affects neuroplastic change.", application: "Challenge yourself appropriately for growth." },
  { principle: "Time Matters", description: "Different forms of plasticity occur at different times.", application: "Be patient with long-term changes." },
  { principle: "Salience Matters", description: "Meaningful experiences create stronger neural changes.", application: "Connect learning to personal meaning." },
  { principle: "Age Matters", description: "Plasticity changes across lifespan but never disappears.", application: "Lifelong learning is always possible." }
];

const MIND_BODY_PRACTICES = [
  { practice: "Vagal Toning", description: "Stimulate the vagus nerve to promote calm.", techniques: ["Cold exposure", "Singing/humming", "Deep breathing", "Social connection"] },
  { practice: "HRV Training", description: "Heart rate variability biofeedback for resilience.", techniques: ["Coherent breathing", "Positive emotion focus", "Biofeedback devices"] },
  { practice: "Somatic Experiencing", description: "Release stored trauma through body awareness.", techniques: ["Pendulation", "Titration", "Tracking sensations", "Completing defensive responses"] },
  { practice: "EMDR Principles", description: "Bilateral stimulation for processing difficult experiences.", techniques: ["Eye movements", "Tapping", "Auditory bilateral", "Resource installation"] }
];

router.get("/affective-systems", (_req, res) => {
  res.json({ ok: true, systems: AFFECTIVE_NEUROSCIENCE_SYSTEMS });
});

router.get("/brain-regions", (_req, res) => {
  res.json({ ok: true, regions: BRAIN_REGIONS });
});

router.get("/neuroplasticity", (_req, res) => {
  res.json({ ok: true, principles: NEUROPLASTICITY_PRINCIPLES });
});

router.get("/mind-body", (_req, res) => {
  res.json({ ok: true, practices: MIND_BODY_PRACTICES });
});

router.get("/daily", (_req, res) => {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  
  const system = AFFECTIVE_NEUROSCIENCE_SYSTEMS[dayOfYear % AFFECTIVE_NEUROSCIENCE_SYSTEMS.length];
  const region = BRAIN_REGIONS[dayOfYear % BRAIN_REGIONS.length];
  const principle = NEUROPLASTICITY_PRINCIPLES[dayOfYear % NEUROPLASTICITY_PRINCIPLES.length];
  
  res.json({
    ok: true,
    daily: {
      affectiveSystem: system,
      brainRegion: region,
      neuroplasticityPrinciple: principle,
      neuroPrompt: `Today, notice your "${system.system}" system: ${system.description}`,
      brainPractice: `Support your ${region.region}: ${region.practice}`
    }
  });
});

export default router;
