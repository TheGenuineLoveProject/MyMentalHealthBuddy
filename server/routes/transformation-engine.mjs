import { Router } from "express";

const router = Router();

// Transformation Stages - 7 phases of change
const TRANSFORMATION_STAGES = [
  { id: "awakening", name: "Awakening", description: "Recognition that change is needed", duration: "Days to weeks", signs: ["Dissatisfaction with status quo", "Glimpses of possibility", "Initial curiosity"], challenges: ["Denial", "Comfort of familiar"], supports: ["Crisis or catalyst", "Inspiring examples", "Safe exploration"] },
  { id: "preparation", name: "Preparation", description: "Building readiness for change", duration: "Weeks to months", signs: ["Gathering information", "Building support", "Setting intentions"], challenges: ["Analysis paralysis", "Fear of commitment"], supports: ["Clear vision", "Incremental steps", "Community"] },
  { id: "initiation", name: "Initiation", description: "Taking first concrete steps", duration: "Days to weeks", signs: ["Taking action", "Facing fears", "Crossing thresholds"], challenges: ["Initial resistance", "Doubt and setbacks"], supports: ["Ritual and ceremony", "Accountability", "Quick wins"] },
  { id: "descent", name: "Descent", description: "Deep work with shadows and wounds", duration: "Months", signs: ["Old patterns surfacing", "Emotional processing", "Identity questioning"], challenges: ["Overwhelm", "Desire to retreat"], supports: ["Skilled guidance", "Self-compassion", "Faith in process"] },
  { id: "ordeal", name: "Ordeal", description: "Facing the core challenge", duration: "Variable", signs: ["Peak difficulty", "Testing of resolve", "Death of old self"], challenges: ["Giving up", "Regression"], supports: ["Inner resources", "Community support", "Larger purpose"] },
  { id: "integration", name: "Integration", description: "Synthesizing learnings into new self", duration: "Months to years", signs: ["New behaviors stabilizing", "Identity reforming", "Wisdom emerging"], challenges: ["Premature closure", "Inconsistency"], supports: ["Practice and repetition", "Reflection", "Celebration of growth"] },
  { id: "mastery", name: "Return with Gift", description: "Giving back and teaching others", duration: "Ongoing", signs: ["Teaching capability", "Service orientation", "Continued growth"], challenges: ["Stagnation", "Ego inflation"], supports: ["Continued learning", "Humility practices", "New challenges"] }
];

// Healing Modalities - 15 evidence-based approaches
const HEALING_MODALITIES = [
  { id: "somatic-experiencing", name: "Somatic Experiencing", category: "Body-Based", origin: "Peter Levine", mechanism: "Release trapped survival energy through titrated body awareness", applications: ["Trauma", "Anxiety", "Chronic tension"] },
  { id: "ifs", name: "Internal Family Systems", category: "Parts Work", origin: "Richard Schwartz", mechanism: "Healing through compassionate dialogue with inner parts", applications: ["Complex trauma", "Inner conflict", "Self-sabotage"] },
  { id: "emdr", name: "EMDR", category: "Processing", origin: "Francine Shapiro", mechanism: "Bilateral stimulation to reprocess traumatic memories", applications: ["PTSD", "Phobias", "Disturbing memories"] },
  { id: "act", name: "Acceptance & Commitment Therapy", category: "Cognitive-Behavioral", origin: "Steven Hayes", mechanism: "Psychological flexibility through acceptance and values-based action", applications: ["Anxiety", "Depression", "Chronic pain"] },
  { id: "cbt", name: "Cognitive Behavioral Therapy", category: "Cognitive-Behavioral", origin: "Aaron Beck", mechanism: "Changing thoughts to change feelings and behaviors", applications: ["Depression", "Anxiety", "Phobias"] },
  { id: "dbt", name: "Dialectical Behavior Therapy", category: "Cognitive-Behavioral", origin: "Marsha Linehan", mechanism: "Balancing acceptance with change, emotional regulation skills", applications: ["BPD", "Self-harm", "Emotional dysregulation"] },
  { id: "polyvagal", name: "Polyvagal Exercises", category: "Nervous System", origin: "Stephen Porges", mechanism: "Regulating the autonomic nervous system through targeted exercises", applications: ["Anxiety", "Dissociation", "Social difficulty"] },
  { id: "mindfulness", name: "Mindfulness-Based Interventions", category: "Contemplative", origin: "Jon Kabat-Zinn", mechanism: "Present-moment awareness to reduce reactivity", applications: ["Stress", "Chronic pain", "Rumination"] },
  { id: "narrative", name: "Narrative Therapy", category: "Meaning-Making", origin: "Michael White", mechanism: "Reauthoring life stories to reclaim agency", applications: ["Identity issues", "Trauma", "Depression"] },
  { id: "attachment", name: "Attachment-Based Therapy", category: "Relational", origin: "John Bowlby", mechanism: "Healing through corrective relational experiences", applications: ["Attachment wounds", "Relationship patterns", "Developmental trauma"] },
  { id: "expressive", name: "Expressive Arts Therapy", category: "Creative", origin: "Various", mechanism: "Processing through creative expression", applications: ["Trauma", "Grief", "Emotional expression"] },
  { id: "breathwork", name: "Therapeutic Breathwork", category: "Body-Based", origin: "Various traditions", mechanism: "Altered states through conscious breathing patterns", applications: ["Anxiety", "Trauma release", "Emotional processing"] },
  { id: "compassion-focused", name: "Compassion-Focused Therapy", category: "Emotion-Focused", origin: "Paul Gilbert", mechanism: "Developing self-compassion to counter shame and self-criticism", applications: ["Shame", "Self-criticism", "Depression"] },
  { id: "existential", name: "Existential Therapy", category: "Meaning-Making", origin: "Viktor Frankl, Irvin Yalom", mechanism: "Finding meaning through confronting existential givens", applications: ["Existential crises", "Meaning vacuum", "Death anxiety"] },
  { id: "psychedelic-assisted", name: "Psychedelic-Assisted Therapy", category: "Emerging", origin: "Various researchers", mechanism: "Facilitated altered states for deep processing", applications: ["Treatment-resistant depression", "PTSD", "End-of-life anxiety"] }
];

// Shadow Work Archetypes - 12 common shadows
const SHADOW_ARCHETYPES = [
  { id: "victim", name: "The Victim", light: "Healthy boundaries and self-protection", shadow: "Chronic helplessness and blame", integration: "Reclaiming personal power while honoring vulnerability" },
  { id: "rescuer", name: "The Rescuer", light: "Genuine compassion and service", shadow: "Enabling, control through helping", integration: "Empowering others rather than creating dependence" },
  { id: "perfectionist", name: "The Perfectionist", light: "Excellence and high standards", shadow: "Paralysis, shame, never enough", integration: "Progress over perfection, self-compassion" },
  { id: "people-pleaser", name: "The People Pleaser", light: "Consideration and harmony", shadow: "Self-abandonment, resentment", integration: "Authentic expression with relational awareness" },
  { id: "controller", name: "The Controller", light: "Leadership and organization", shadow: "Rigidity, anxiety about uncertainty", integration: "Trust and letting go while maintaining agency" },
  { id: "rebel", name: "The Rebel", light: "Authenticity and independence", shadow: "Destructive opposition, isolation", integration: "Constructive challenge of unjust systems" },
  { id: "martyr", name: "The Martyr", light: "Sacrifice and dedication", shadow: "Suffering as identity, manipulation through guilt", integration: "Generous giving from overflow, not depletion" },
  { id: "saboteur", name: "The Saboteur", light: "Protection from harm", shadow: "Self-destruction near success", integration: "Conscious risk-taking while honoring fears" },
  { id: "critic", name: "The Inner Critic", light: "Discernment and improvement", shadow: "Harsh judgment, perfectionism", integration: "Constructive feedback with kindness" },
  { id: "addict", name: "The Addict", light: "Capacity for passion and dedication", shadow: "Compulsive escape, numbing", integration: "Healthy attachment and presence with discomfort" },
  { id: "tyrant", name: "The Tyrant", light: "Decisive action and boundaries", shadow: "Domination, cruelty, abuse of power", integration: "Firm leadership with compassion" },
  { id: "avoider", name: "The Avoider", light: "Choosing battles wisely", shadow: "Chronic avoidance, passivity", integration: "Courageous engagement with difficulty" }
];

// Routes
router.get("/stages", (_req, res) => {
  res.json({ success: true, data: TRANSFORMATION_STAGES });
});

router.get("/stages/:id", (req, res) => {
  const stage = TRANSFORMATION_STAGES.find(s => s.id === req.params.id);
  if (!stage) {
    return res.status(404).json({ success: false, error: "Stage not found" });
  }
  res.json({ success: true, data: stage });
});

router.get("/modalities", (_req, res) => {
  res.json({ success: true, data: HEALING_MODALITIES });
});

router.get("/modalities/:id", (req, res) => {
  const modality = HEALING_MODALITIES.find(m => m.id === req.params.id);
  if (!modality) {
    return res.status(404).json({ success: false, error: "Modality not found" });
  }
  res.json({ success: true, data: modality });
});

router.get("/shadow-archetypes", (_req, res) => {
  res.json({ success: true, data: SHADOW_ARCHETYPES });
});

router.get("/shadow-archetypes/:id", (req, res) => {
  const archetype = SHADOW_ARCHETYPES.find(a => a.id === req.params.id);
  if (!archetype) {
    return res.status(404).json({ success: false, error: "Shadow archetype not found" });
  }
  res.json({ success: true, data: archetype });
});

router.get("/daily-transformation", (_req, res) => {
  const today = new Date();
  const stageIndex = today.getDate() % TRANSFORMATION_STAGES.length;
  const shadowIndex = today.getDate() % SHADOW_ARCHETYPES.length;
  
  res.json({
    success: true,
    data: {
      date: today.toISOString().split('T')[0],
      focusStage: TRANSFORMATION_STAGES[stageIndex],
      shadowToExplore: SHADOW_ARCHETYPES[shadowIndex],
      inquiry: `What part of you resonates with the ${SHADOW_ARCHETYPES[shadowIndex].name}? How might you begin integrating its gift?`
    }
  });
});

export default router;
