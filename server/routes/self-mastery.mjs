import { Router } from "express";

const router = Router();

// Self-Mastery Disciplines - 20 comprehensive practices
const MASTERY_DISCIPLINES = [
  { id: "stoic-discipline", name: "Stoic Daily Practice", category: "Ancient Wisdom", description: "Morning reflection, evening review, negative visualization", difficulty: "intermediate", duration: "20-30 min" },
  { id: "deep-work", name: "Deep Work Protocol", category: "Focus Mastery", description: "4-hour focused concentration blocks with strategic rest", difficulty: "advanced", duration: "4 hours" },
  { id: "deliberate-practice", name: "Deliberate Practice Framework", category: "Skill Development", description: "Structured improvement at the edge of competence", difficulty: "advanced", duration: "1-2 hours" },
  { id: "habit-stacking", name: "Habit Architecture", category: "Behavioral Design", description: "Chain positive behaviors using environmental design", difficulty: "beginner", duration: "varies" },
  { id: "energy-management", name: "Energy Mastery System", category: "Physical Foundation", description: "Optimize sleep, nutrition, movement, recovery cycles", difficulty: "intermediate", duration: "daily" },
  { id: "attention-training", name: "Attention Cultivation", category: "Focus Mastery", description: "Single-pointed concentration and open awareness practices", difficulty: "advanced", duration: "30-60 min" },
  { id: "emotional-mastery", name: "Emotional Intelligence Lab", category: "Inner Work", description: "Recognition, regulation, and strategic expression of emotions", difficulty: "intermediate", duration: "15-30 min" },
  { id: "shadow-integration", name: "Shadow Work Protocol", category: "Inner Work", description: "Identify and integrate unconscious patterns and projections", difficulty: "advanced", duration: "45-90 min" },
  { id: "decision-framework", name: "Decision Making Mastery", category: "Cognitive Excellence", description: "Systematic approaches to high-stakes choices", difficulty: "intermediate", duration: "varies" },
  { id: "learning-acceleration", name: "Accelerated Learning System", category: "Skill Development", description: "Meta-learning strategies for rapid skill acquisition", difficulty: "intermediate", duration: "varies" },
  { id: "creativity-practice", name: "Daily Creative Practice", category: "Creativity", description: "Generative exercises to maintain creative edge", difficulty: "beginner", duration: "15-30 min" },
  { id: "resilience-training", name: "Antifragility Protocol", category: "Mental Toughness", description: "Systematic stress inoculation and recovery", difficulty: "advanced", duration: "varies" },
  { id: "mindfulness-mastery", name: "Contemplative Mastery", category: "Inner Work", description: "Progressive meditation from stability to insight", difficulty: "all levels", duration: "20-60 min" },
  { id: "communication-mastery", name: "Eloquence Training", category: "Interpersonal", description: "Clarity, persuasion, active listening, difficult conversations", difficulty: "intermediate", duration: "varies" },
  { id: "time-mastery", name: "Temporal Architecture", category: "Productivity", description: "Strategic time blocking, energy matching, constraint leverage", difficulty: "intermediate", duration: "planning: 30 min" },
  { id: "purpose-alignment", name: "Purpose Calibration", category: "Direction", description: "Values clarification, mission refinement, goal alignment", difficulty: "intermediate", duration: "weekly: 1 hour" },
  { id: "integrity-practice", name: "Integrity Strengthening", category: "Character", description: "Word-deed alignment, promise keeping, truth-telling practice", difficulty: "advanced", duration: "ongoing" },
  { id: "humility-practice", name: "Intellectual Humility", category: "Character", description: "Actively seeking disconfirming evidence and blind spots", difficulty: "advanced", duration: "ongoing" },
  { id: "gratitude-mastery", name: "Gratitude Deepening", category: "Wellbeing", description: "Progressive appreciation from surface to profound", difficulty: "beginner", duration: "10-15 min" },
  { id: "service-orientation", name: "Contribution Practice", category: "Purpose", description: "Daily acts of service and impact measurement", difficulty: "beginner", duration: "varies" }
];

// Mastery Archetypes - 8 paths
const MASTERY_ARCHETYPES = [
  { id: "warrior", name: "The Warrior", focus: "Discipline & Action", traits: ["Courage", "Discipline", "Strategic Thinking", "Resilience"], practices: ["Physical training", "Challenge confrontation", "Strategic planning"] },
  { id: "sage", name: "The Sage", focus: "Wisdom & Understanding", traits: ["Contemplation", "Pattern Recognition", "Synthesis", "Teaching"], practices: ["Deep reading", "Meditation", "Knowledge integration"] },
  { id: "creator", name: "The Creator", focus: "Innovation & Expression", traits: ["Imagination", "Originality", "Craft Mastery", "Vision"], practices: ["Daily creation", "Skill refinement", "Inspiration gathering"] },
  { id: "healer", name: "The Healer", focus: "Restoration & Care", traits: ["Compassion", "Presence", "Attunement", "Transformation"], practices: ["Active listening", "Self-healing", "Service to others"] },
  { id: "leader", name: "The Leader", focus: "Vision & Influence", traits: ["Vision Casting", "Inspiration", "Accountability", "Empowerment"], practices: ["Team development", "Strategic communication", "Culture building"] },
  { id: "explorer", name: "The Explorer", focus: "Discovery & Adventure", traits: ["Curiosity", "Adaptability", "Openness", "Risk Tolerance"], practices: ["Novel experiences", "Boundary pushing", "Learning journeys"] },
  { id: "craftsperson", name: "The Craftsperson", focus: "Excellence & Precision", traits: ["Attention to Detail", "Patience", "Standards", "Mastery"], practices: ["Deliberate practice", "Quality focus", "Continuous refinement"] },
  { id: "mystic", name: "The Mystic", focus: "Transcendence & Connection", traits: ["Inner Awareness", "Surrender", "Unity", "Depth"], practices: ["Contemplative practice", "Nature connection", "Silence retreats"] }
];

// Growth Principles - 12 universal laws
const GROWTH_PRINCIPLES = [
  { id: "edge-practice", name: "Practice at the Edge", description: "Growth happens at the boundary of comfort and challenge", application: "Consistently work slightly beyond current capability" },
  { id: "compound-effect", name: "The Compound Effect", description: "Small consistent actions create exponential results over time", application: "Focus on daily 1% improvements" },
  { id: "deliberate-struggle", name: "Embrace Productive Struggle", description: "Difficulty is the signal of learning, not failure", application: "Seek out and sit with challenging material" },
  { id: "feedback-integration", name: "Rapid Feedback Integration", description: "Learning accelerates with tight feedback loops", application: "Seek immediate feedback and adjust quickly" },
  { id: "rest-recovery", name: "Strategic Recovery", description: "Growth consolidates during rest, not effort", application: "Build recovery periods into growth cycles" },
  { id: "model-excellence", name: "Model Excellence", description: "Study masters to accelerate your own path", application: "Analyze and internalize patterns of the great" },
  { id: "environment-design", name: "Environment Shapes Behavior", description: "Design environments that make excellence the default", application: "Remove friction for good habits, add friction for bad" },
  { id: "identity-leverage", name: "Identity-Based Change", description: "Behavior flows from identity; change identity first", application: "Ask 'What would the person I want to become do?'" },
  { id: "constraint-creativity", name: "Constraints Enable Creativity", description: "Limitations force innovation and focus", application: "Embrace constraints as creative catalysts" },
  { id: "teaching-learning", name: "Teaching Deepens Learning", description: "To truly know, teach; to truly master, mentor", application: "Share knowledge as you acquire it" },
  { id: "plateau-breakthrough", name: "Plateaus Precede Breakthroughs", description: "Apparent stagnation often precedes rapid growth", application: "Persist through plateaus with faith in the process" },
  { id: "integration-practice", name: "Integration Before Addition", description: "Master fundamentals before adding complexity", application: "Deepen existing skills before acquiring new ones" }
];

// Routes
router.get("/disciplines", (_req, res) => {
  res.json({ success: true, data: MASTERY_DISCIPLINES });
});

router.get("/disciplines/:id", (req, res) => {
  const discipline = MASTERY_DISCIPLINES.find(d => d.id === req.params.id);
  if (!discipline) {
    return res.status(404).json({ success: false, error: "Discipline not found" });
  }
  res.json({ success: true, data: discipline });
});

router.get("/archetypes", (_req, res) => {
  res.json({ success: true, data: MASTERY_ARCHETYPES });
});

router.get("/archetypes/:id", (req, res) => {
  const archetype = MASTERY_ARCHETYPES.find(a => a.id === req.params.id);
  if (!archetype) {
    return res.status(404).json({ success: false, error: "Archetype not found" });
  }
  res.json({ success: true, data: archetype });
});

router.get("/principles", (_req, res) => {
  res.json({ success: true, data: GROWTH_PRINCIPLES });
});

router.get("/daily-focus", (_req, res) => {
  const today = new Date();
  const dayIndex = today.getDate() % MASTERY_DISCIPLINES.length;
  const discipline = MASTERY_DISCIPLINES[dayIndex];
  const principle = GROWTH_PRINCIPLES[today.getDate() % GROWTH_PRINCIPLES.length];
  
  res.json({
    success: true,
    data: {
      date: today.toISOString().split('T')[0],
      focusDiscipline: discipline,
      guidingPrinciple: principle,
      reflection: `How will you apply "${discipline.name}" today, guided by "${principle.name}"?`
    }
  });
});


// Health check endpoint for admin daily tools monitoring
router.get("/", (req, res) => {
  res.json({ ok: true, module: "self-mastery", status: "operational", timestamp: new Date().toISOString() });
});

export default router;
