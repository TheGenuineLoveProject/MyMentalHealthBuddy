import { Router } from "express";

const router = Router();

const HEALING_MODALITIES = [
  {
    id: "somatic-release",
    name: "Somatic Release Protocol",
    category: "Body-Based",
    description: "Trauma-informed body awareness techniques for releasing stored tension",
    duration: "15-30 min",
    intensity: "gentle",
    techniques: [
      { name: "Body Scan Awareness", steps: ["Find a comfortable position", "Close eyes and breathe deeply", "Systematically notice sensations from feet to crown", "Acknowledge without judgment", "Release with each exhale"] },
      { name: "Pendulation", steps: ["Identify area of discomfort", "Shift attention to a neutral or pleasant area", "Gently oscillate attention between both", "Notice the body's natural self-regulation", "Allow settling to occur naturally"] },
      { name: "Grounding Touch", steps: ["Place both feet firmly on ground", "Feel the support beneath you", "Place hands on heart and belly", "Breathe into the contact points", "Affirm safety in present moment"] }
    ],
    contraindications: ["Active dissociation", "Acute trauma within 48 hours"],
    evidenceBasis: "Polyvagal Theory, Somatic Experiencing"
  },
  {
    id: "cognitive-reframe",
    name: "Cognitive Reframing Lab",
    category: "Mind-Based",
    description: "Advanced thought pattern analysis and restructuring",
    duration: "20-45 min",
    intensity: "moderate",
    techniques: [
      { name: "Thought Record 2.0", steps: ["Capture automatic thought", "Identify cognitive distortion type", "Examine evidence for/against", "Generate balanced alternative", "Rate belief shift"] },
      { name: "Socratic Self-Inquiry", steps: ["State the troubling belief", "Ask: What evidence supports this?", "Ask: What evidence contradicts this?", "Ask: What would I tell a friend?", "Synthesize balanced perspective"] },
      { name: "Perspective Rotation", steps: ["Write situation from your view", "Rewrite from compassionate observer", "Rewrite from future healed self", "Rewrite from wise mentor figure", "Integrate insights"] }
    ],
    contraindications: ["Severe depression", "Active crisis state"],
    evidenceBasis: "Cognitive Behavioral Therapy, REBT"
  },
  {
    id: "emotional-alchemy",
    name: "Emotional Alchemy Process",
    category: "Emotion-Based",
    description: "Transform difficult emotions into growth catalysts",
    duration: "25-40 min",
    intensity: "deep",
    techniques: [
      { name: "RAIN Practice", steps: ["Recognize the emotion present", "Allow it to be there without resistance", "Investigate with kindness and curiosity", "Nurture yourself with self-compassion"] },
      { name: "Emotion Mapping", steps: ["Name the primary emotion", "Identify secondary emotions beneath", "Locate where each lives in body", "Assign color/texture/temperature", "Dialogue with the emotion"] },
      { name: "Transmutation Ritual", steps: ["Fully feel the difficult emotion", "Ask: What is this protecting?", "Thank it for its intention", "Ask: What do I truly need?", "Channel energy toward that need"] }
    ],
    contraindications: ["Emotional flooding", "Without therapeutic support for complex trauma"],
    evidenceBasis: "IFS, Focusing, Tara Brach's RAIN"
  },
  {
    id: "narrative-healing",
    name: "Narrative Reconstruction",
    category: "Story-Based",
    description: "Reauthor your life story with agency and meaning",
    duration: "30-60 min",
    intensity: "deep",
    techniques: [
      { name: "Unique Outcomes Mining", steps: ["Identify dominant problem story", "Search for exceptions to this story", "Expand on these unique outcomes", "Connect them into alternative narrative", "Anchor new story with evidence"] },
      { name: "Re-membering Conversations", steps: ["Identify significant life figure", "Write what they saw in you", "Imagine their voice encouraging you", "Let their perspective inform present", "Carry their wisdom forward"] },
      { name: "Future Self Letter", steps: ["Choose timeframe (1yr, 5yr, 10yr)", "Write as your healed future self", "Include specific achievements", "Describe how you overcame", "Offer advice to present self"] }
    ],
    contraindications: ["Active grief within first month", "Unprocessed major trauma"],
    evidenceBasis: "Narrative Therapy, Post-Traumatic Growth research"
  },
  {
    id: "attachment-repair",
    name: "Attachment Repair Protocol",
    category: "Relational",
    description: "Heal attachment wounds and build secure relating",
    duration: "30-45 min",
    intensity: "deep",
    techniques: [
      { name: "Ideal Parent Protocol", steps: ["Recall a childhood moment needing support", "Imagine ideal parents responding", "Let yourself receive their attunement", "Notice body sensations of being held", "Internalize the experience"] },
      { name: "Parts Work Dialogue", steps: ["Identify a protective part", "Thank it for its role", "Ask when it first appeared", "Discover what it protects", "Negotiate new arrangement"] },
      { name: "Earned Security Building", steps: ["Identify current secure relationships", "Practice vulnerability in small doses", "Notice and savor positive responses", "Build evidence of safety", "Generalize learning gradually"] }
    ],
    contraindications: ["Without therapeutic support", "Active relationship crisis"],
    evidenceBasis: "Attachment Theory, IFS, EMDR"
  },
  {
    id: "meaning-making",
    name: "Meaning-Making Laboratory",
    category: "Existential",
    description: "Find purpose and meaning in suffering and life transitions",
    duration: "40-60 min",
    intensity: "philosophical",
    techniques: [
      { name: "Logotherapy Questions", steps: ["What does life expect from me right now?", "What unique contribution can only I make?", "How can this suffering be transformed?", "What values am I being called to embody?", "What legacy am I creating?"] },
      { name: "Values Excavation", steps: ["List 10 peak experiences", "Identify common themes", "Distill into 5 core values", "Rank by importance", "Create values-aligned goals"] },
      { name: "Mortality Meditation", steps: ["Contemplate life's finite nature", "Ask: If I had one year, what changes?", "Identify what truly matters", "Release what doesn't serve", "Commit to what remains"] }
    ],
    contraindications: ["Suicidal ideation", "Acute existential crisis without support"],
    evidenceBasis: "Logotherapy, Existential Psychology, Terror Management Theory"
  },
  {
    id: "nervous-system-reset",
    name: "Nervous System Reset",
    category: "Physiological",
    description: "Regulate the autonomic nervous system for calm and resilience",
    duration: "10-25 min",
    intensity: "gentle",
    techniques: [
      { name: "Vagal Toning", steps: ["Humming or chanting for 2 minutes", "Cold water splash on face", "Slow exhale breathing (4-7-8)", "Gentle neck stretches", "Social engagement (eye contact, smile)"] },
      { name: "Orienting Response", steps: ["Slowly look around the room", "Name 5 things you see", "Notice colors, textures, shapes", "Feel your body's response", "Allow settling"] },
      { name: "Co-Regulation Practice", steps: ["Think of a calm person", "Imagine their presence with you", "Borrow their regulated state", "Let your nervous system attune", "Thank them internally"] }
    ],
    contraindications: ["None - universally safe"],
    evidenceBasis: "Polyvagal Theory, Trauma-Sensitive Yoga"
  },
  {
    id: "shadow-integration",
    name: "Shadow Integration Work",
    category: "Depth Psychology",
    description: "Reclaim disowned parts of self for wholeness",
    duration: "45-60 min",
    intensity: "deep",
    techniques: [
      { name: "3-2-1 Shadow Process", steps: ["Face it: Describe the quality that triggers you in 3rd person", "Talk to it: Address it directly in 2nd person", "Be it: Speak as this quality in 1st person", "Integrate: Own this as part of yourself", "Find its gift"] },
      { name: "Golden Shadow Mining", steps: ["Identify someone you greatly admire", "List their admirable qualities", "Recognize these exist in you", "Find evidence of these in your life", "Actively develop these qualities"] },
      { name: "Dream Figure Dialogue", steps: ["Recall a vivid dream figure", "Write a dialogue with them", "Ask what message they bring", "Discover what part of you they represent", "Integrate their wisdom"] }
    ],
    contraindications: ["Fragile ego structure", "Without psychological support"],
    evidenceBasis: "Jungian Psychology, Integral Theory"
  },
  {
    id: "self-compassion-cultivation",
    name: "Self-Compassion Cultivation",
    category: "Heart-Based",
    description: "Develop unconditional kindness toward yourself",
    duration: "15-30 min",
    intensity: "gentle",
    techniques: [
      { name: "Self-Compassion Break", steps: ["Acknowledge: This is a moment of suffering", "Common humanity: Suffering is part of life", "Self-kindness: May I be kind to myself", "Physical gesture of comfort", "Breathe and receive"] },
      { name: "Compassionate Letter", steps: ["Write to yourself as to a dear friend", "Acknowledge the struggle with kindness", "Validate your feelings", "Offer encouragement", "Sign with love"] },
      { name: "Loving-Kindness Meditation", steps: ["Begin with self: May I be happy, healthy, safe, at ease", "Extend to loved one", "Extend to neutral person", "Extend to difficult person", "Extend to all beings"] }
    ],
    contraindications: ["None - universally beneficial"],
    evidenceBasis: "Kristin Neff's Self-Compassion research, Buddhist psychology"
  },
  {
    id: "grief-processing",
    name: "Grief Processing Protocol",
    category: "Loss-Based",
    description: "Honor and process grief in all its forms",
    duration: "30-45 min",
    intensity: "deep",
    techniques: [
      { name: "Continuing Bonds", steps: ["Write to the person/thing you've lost", "Share what you wish they knew", "Ask them questions", "Imagine their response", "Find ways to carry them forward"] },
      { name: "Grief Ritual Creation", steps: ["Choose a meaningful object or place", "Create a simple ceremony", "Speak what needs to be said", "Make an offering or release", "Mark the transition"] },
      { name: "Dual Process Oscillation", steps: ["Acknowledge loss-oriented grief", "Identify restoration-oriented activities", "Allow natural oscillation between both", "Neither force nor avoid either", "Trust the process"] }
    ],
    contraindications: ["Complicated grief without support", "Within 48 hours of loss"],
    evidenceBasis: "Continuing Bonds Theory, Dual Process Model"
  },
  {
    id: "inner-child-healing",
    name: "Inner Child Healing",
    category: "Parts Work",
    description: "Reconnect with and heal wounded younger parts",
    duration: "30-45 min",
    intensity: "deep",
    techniques: [
      { name: "Safe Place Visualization", steps: ["Create a safe inner sanctuary", "Invite your inner child to join you", "Let them know you're here now", "Ask what they need", "Provide it symbolically"] },
      { name: "Timeline Healing", steps: ["Identify a difficult childhood memory", "Enter the scene as your adult self", "Comfort your younger self", "Give them what they needed", "Bring them to present safety"] },
      { name: "Reparenting Practice", steps: ["List unmet childhood needs", "Choose one to address today", "Give yourself this now", "Notice the healing response", "Repeat regularly"] }
    ],
    contraindications: ["Severe dissociation", "Complex trauma without support"],
    evidenceBasis: "IFS, Schema Therapy, Developmental Trauma research"
  },
  {
    id: "forgiveness-process",
    name: "Forgiveness Liberation",
    category: "Relational",
    description: "Release resentment for your own freedom",
    duration: "45-60 min",
    intensity: "deep",
    techniques: [
      { name: "REACH Model", steps: ["Recall the hurt objectively", "Empathize with offender's humanity", "Altruistic gift of forgiveness", "Commit to forgive publicly or privately", "Hold onto forgiveness when doubts arise"] },
      { name: "Ho'oponopono", steps: ["I'm sorry", "Please forgive me", "Thank you", "I love you", "Repeat with sincerity"] },
      { name: "Self-Forgiveness Ritual", steps: ["Acknowledge the action or inaction", "Understand your context and limitations", "Make amends where possible", "Commit to different future", "Release and move forward"] }
    ],
    contraindications: ["Ongoing abuse", "Pressure to forgive prematurely"],
    evidenceBasis: "Worthington's REACH model, Hawaiian healing traditions"
  }
];

const HEALING_JOURNEYS = [
  { id: "anxiety-relief", name: "Anxiety Relief Journey", modalities: ["nervous-system-reset", "somatic-release", "cognitive-reframe"], duration: "7 days" },
  { id: "trauma-recovery", name: "Trauma Recovery Path", modalities: ["somatic-release", "attachment-repair", "inner-child-healing", "narrative-healing"], duration: "30 days" },
  { id: "grief-healing", name: "Grief Healing Journey", modalities: ["grief-processing", "self-compassion-cultivation", "meaning-making"], duration: "21 days" },
  { id: "self-worth", name: "Self-Worth Restoration", modalities: ["shadow-integration", "inner-child-healing", "self-compassion-cultivation"], duration: "14 days" },
  { id: "relationship-repair", name: "Relationship Repair", modalities: ["attachment-repair", "forgiveness-process", "emotional-alchemy"], duration: "21 days" }
];

router.get("/modalities", (_req, res) => {
  res.json({
    success: true,
    data: HEALING_MODALITIES.map(m => ({
      id: m.id,
      name: m.name,
      category: m.category,
      description: m.description,
      duration: m.duration,
      intensity: m.intensity
    })),
    total: HEALING_MODALITIES.length
  });
});

router.get("/modalities/:id", (req, res) => {
  const modality = HEALING_MODALITIES.find(m => m.id === req.params.id);
  if (!modality) {
    return res.status(404).json({ success: false, error: "Modality not found" });
  }
  res.json({ success: true, data: modality });
});

router.get("/journeys", (_req, res) => {
  res.json({
    success: true,
    data: HEALING_JOURNEYS,
    total: HEALING_JOURNEYS.length
  });
});

router.get("/journeys/:id", (req, res) => {
  const journey = HEALING_JOURNEYS.find(j => j.id === req.params.id);
  if (!journey) {
    return res.status(404).json({ success: false, error: "Journey not found" });
  }
  const fullModalities = journey.modalities.map(id => HEALING_MODALITIES.find(m => m.id === id));
  res.json({ success: true, data: { ...journey, modalities: fullModalities } });
});

router.get("/categories", (_req, res) => {
  const categories = [...new Set(HEALING_MODALITIES.map(m => m.category))];
  res.json({
    success: true,
    data: categories.map(cat => ({
      name: cat,
      count: HEALING_MODALITIES.filter(m => m.category === cat).length,
      modalities: HEALING_MODALITIES.filter(m => m.category === cat).map(m => m.id)
    }))
  });
});

router.post("/recommend", (req, res) => {
  const { symptoms: _symptoms, preferences } = req.body;
  const recommendations = HEALING_MODALITIES.filter(m => {
    if (preferences?.intensity && m.intensity !== preferences.intensity) return false;
    return true;
  }).slice(0, 5);
  
  res.json({
    success: true,
    data: {
      recommendations,
      personalizedJourney: HEALING_JOURNEYS[0],
      message: "Based on your needs, we recommend starting with gentle nervous system regulation."
    }
  });
});

export default router;
