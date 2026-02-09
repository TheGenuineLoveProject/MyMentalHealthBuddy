import { Router } from "express";

const router = Router();

// Emotion Families - 8 primary emotions with nuances
const EMOTION_FAMILIES = [
  { id: "joy", name: "Joy", family: "Pleasant High Energy", nuances: ["Happiness", "Elation", "Contentment", "Pride", "Amusement", "Gratitude", "Hope", "Inspiration"], functions: "Signal reward, motivate approach, build resources", regulation: ["Savoring", "Gratitude practice", "Sharing with others"] },
  { id: "sadness", name: "Sadness", family: "Unpleasant Low Energy", nuances: ["Grief", "Melancholy", "Disappointment", "Loneliness", "Nostalgia", "Despair"], functions: "Signal loss, elicit support, promote reflection", regulation: ["Self-compassion", "Social support", "Meaning-making"] },
  { id: "anger", name: "Anger", family: "Unpleasant High Energy", nuances: ["Frustration", "Irritation", "Resentment", "Rage", "Indignation", "Contempt"], functions: "Signal boundary violation, mobilize for action", regulation: ["Pause and breathe", "Identify underlying need", "Assertive expression"] },
  { id: "fear", name: "Fear", family: "Unpleasant High Energy", nuances: ["Anxiety", "Worry", "Panic", "Terror", "Apprehension", "Nervousness"], functions: "Signal threat, prepare for danger, focus attention", regulation: ["Grounding", "Reality testing", "Gradual exposure"] },
  { id: "disgust", name: "Disgust", family: "Unpleasant", nuances: ["Revulsion", "Aversion", "Contempt", "Moral disgust", "Self-disgust"], functions: "Signal contamination, enforce boundaries", regulation: ["Distancing", "Values clarification", "Self-compassion"] },
  { id: "surprise", name: "Surprise", family: "Neutral High Energy", nuances: ["Amazement", "Astonishment", "Startle", "Confusion", "Wonder"], functions: "Signal unexpected event, orient attention", regulation: ["Curiosity", "Information seeking", "Pause to process"] },
  { id: "love", name: "Love", family: "Pleasant", nuances: ["Affection", "Caring", "Compassion", "Tenderness", "Longing", "Adoration"], functions: "Signal attachment, promote bonding, motivate care", regulation: ["Expression", "Presence", "Loving-kindness practice"] },
  { id: "shame", name: "Shame", family: "Self-Conscious", nuances: ["Embarrassment", "Humiliation", "Guilt", "Inadequacy", "Self-consciousness"], functions: "Signal social violation, motivate repair", regulation: ["Self-compassion", "Distinguishing guilt from shame", "Repair actions"] }
];

// Emotional Intelligence Skills - 15 EQ competencies
const EQ_COMPETENCIES = [
  { id: "self-awareness", name: "Emotional Self-Awareness", domain: "Self-Awareness", description: "Recognize and understand your own emotions", practices: ["Emotion labeling", "Body scanning", "Journaling"] },
  { id: "accurate-self-assessment", name: "Accurate Self-Assessment", domain: "Self-Awareness", description: "Know your strengths and limitations", practices: ["360 feedback", "Reflection", "Seeking input"] },
  { id: "self-confidence", name: "Self-Confidence", domain: "Self-Awareness", description: "Trust in your worth and capabilities", practices: ["Success inventory", "Positive self-talk", "Risk-taking"] },
  { id: "emotional-self-control", name: "Emotional Self-Control", domain: "Self-Management", description: "Manage disruptive emotions effectively", practices: ["Pause technique", "Reframing", "Grounding"] },
  { id: "transparency", name: "Transparency", domain: "Self-Management", description: "Display honesty and integrity", practices: ["Values alignment", "Authentic expression", "Admitting mistakes"] },
  { id: "adaptability", name: "Adaptability", domain: "Self-Management", description: "Flexibility in handling change", practices: ["Reframing change", "Experimentation", "Letting go"] },
  { id: "achievement", name: "Achievement Orientation", domain: "Self-Management", description: "Drive to improve and meet standards", practices: ["Goal setting", "Progress tracking", "Celebrating wins"] },
  { id: "initiative", name: "Initiative", domain: "Self-Management", description: "Readiness to act on opportunities", practices: ["First mover practice", "Proactive planning", "Bias to action"] },
  { id: "optimism", name: "Optimism", domain: "Self-Management", description: "See the upside in events and future", practices: ["Benefit finding", "Hope cultivation", "Possibility thinking"] },
  { id: "empathy", name: "Empathy", domain: "Social Awareness", description: "Sense others' emotions and perspectives", practices: ["Active listening", "Perspective-taking", "Emotional mirroring"] },
  { id: "organizational-awareness", name: "Organizational Awareness", domain: "Social Awareness", description: "Read group dynamics and politics", practices: ["Observing patterns", "Stakeholder mapping", "Cultural attunement"] },
  { id: "service", name: "Service Orientation", domain: "Social Awareness", description: "Anticipate and meet others' needs", practices: ["Needs assessment", "Proactive help", "Follow-through"] },
  { id: "inspirational-leadership", name: "Inspirational Leadership", domain: "Relationship Management", description: "Guide and motivate with compelling vision", practices: ["Vision articulation", "Storytelling", "Modeling"] },
  { id: "influence", name: "Influence", domain: "Relationship Management", description: "Wield a range of persuasive tactics", practices: ["Building rapport", "Finding common ground", "Compelling arguments"] },
  { id: "conflict-management", name: "Conflict Management", domain: "Relationship Management", description: "Resolve disagreements constructively", practices: ["De-escalation", "Interest-based negotiation", "Mediation"] }
];

// Regulation Strategies - 12 evidence-based techniques
const REGULATION_STRATEGIES = [
  { id: "situation-selection", name: "Situation Selection", timing: "Before", description: "Choose to enter or avoid situations", example: "Declining invitations that trigger anxiety" },
  { id: "situation-modification", name: "Situation Modification", timing: "Before", description: "Change aspects of the situation", example: "Bringing a friend to a challenging event" },
  { id: "attentional-deployment", name: "Attentional Deployment", timing: "During", description: "Direct attention within a situation", example: "Focusing on friendly faces during a speech" },
  { id: "cognitive-reappraisal", name: "Cognitive Reappraisal", timing: "During", description: "Change how you interpret the situation", example: "Viewing criticism as helpful feedback" },
  { id: "response-modulation", name: "Response Modulation", timing: "After", description: "Change physiological or behavioral response", example: "Deep breathing to calm racing heart" },
  { id: "acceptance", name: "Acceptance", timing: "During/After", description: "Allow emotions without trying to change them", example: "Acknowledging grief without fighting it" },
  { id: "distraction", name: "Healthy Distraction", timing: "During", description: "Temporarily shift focus to something else", example: "Going for a walk when overwhelmed" },
  { id: "self-compassion", name: "Self-Compassion", timing: "After", description: "Treat yourself with kindness", example: "Speaking to yourself as you would a friend" },
  { id: "expression", name: "Expressive Writing", timing: "After", description: "Write about emotional experiences", example: "Journaling about difficult feelings" },
  { id: "social-support", name: "Social Support Seeking", timing: "Any", description: "Connect with supportive others", example: "Calling a trusted friend" },
  { id: "problem-solving", name: "Problem-Focused Coping", timing: "After", description: "Address the source of distress", example: "Creating an action plan for a stressor" },
  { id: "mindfulness", name: "Mindful Observation", timing: "During", description: "Notice emotions without reactivity", example: "Observing anxiety sensations with curiosity" }
];

// Routes
router.get("/families", (_req, res) => {
  res.json({ success: true, data: EMOTION_FAMILIES });
});

router.get("/families/:id", (req, res) => {
  const family = EMOTION_FAMILIES.find(f => f.id === req.params.id);
  if (!family) {
    return res.status(404).json({ success: false, error: "Emotion family not found" });
  }
  res.json({ success: true, data: family });
});

router.get("/competencies", (_req, res) => {
  res.json({ success: true, data: EQ_COMPETENCIES });
});

router.get("/competencies/:id", (req, res) => {
  const competency = EQ_COMPETENCIES.find(c => c.id === req.params.id);
  if (!competency) {
    return res.status(404).json({ success: false, error: "Competency not found" });
  }
  res.json({ success: true, data: competency });
});

router.get("/regulation", (_req, res) => {
  res.json({ success: true, data: REGULATION_STRATEGIES });
});

router.get("/daily-eq", (_req, res) => {
  const today = new Date();
  const emotionIndex = today.getDate() % EMOTION_FAMILIES.length;
  const competencyIndex = today.getDate() % EQ_COMPETENCIES.length;
  
  res.json({
    success: true,
    data: {
      date: today.toISOString().split('T')[0],
      emotionFocus: EMOTION_FAMILIES[emotionIndex],
      competencyPractice: EQ_COMPETENCIES[competencyIndex],
      reflection: `Notice when you experience ${EMOTION_FAMILIES[emotionIndex].name.toLowerCase()} today. What triggers it? How does it feel in your body?`
    }
  });
});


// Health check endpoint for admin daily tools monitoring
router.get("/", (req, res) => {
  res.json({ ok: true, module: "emotional-mastery", status: "operational", timestamp: new Date().toISOString() });
});

export default router;
