// server/routes/practices.mjs
// Contemplative and Growth Practices
import express from "express";

const router = express.Router();

// ============================================================================
// CONTEMPLATIVE PRACTICES
// ============================================================================
const CONTEMPLATIVE_PRACTICES = [
  {
    id: 1,
    name: "Mindful Breathing",
    tradition: "Buddhist",
    duration: "5-20 minutes",
    description: "Anchor attention on the natural breath to cultivate present-moment awareness.",
    instructions: [
      "Find a comfortable seated position",
      "Close your eyes or soften your gaze",
      "Notice the natural rhythm of your breath",
      "When the mind wanders, gently return to the breath",
      "Don't try to change the breath—just notice it"
    ],
    benefits: ["Reduced anxiety", "Improved focus", "Emotional regulation"],
    difficulty: "Beginner"
  },
  {
    id: 2,
    name: "Body Scan",
    tradition: "MBSR (Mindfulness-Based Stress Reduction)",
    duration: "15-45 minutes",
    description: "Systematically move attention through the body to develop somatic awareness.",
    instructions: [
      "Lie down or sit comfortably",
      "Begin at the top of your head",
      "Slowly move attention through each body part",
      "Notice sensations without trying to change them",
      "Breathe into any areas of tension"
    ],
    benefits: ["Body awareness", "Tension release", "Mind-body connection"],
    difficulty: "Beginner"
  },
  {
    id: 3,
    name: "Loving-Kindness (Metta)",
    tradition: "Buddhist",
    duration: "10-30 minutes",
    description: "Cultivate unconditional goodwill toward self and others through phrases of intention.",
    instructions: [
      "Begin with yourself: 'May I be happy, may I be healthy, may I be at peace'",
      "Extend to a loved one",
      "Extend to a neutral person",
      "Extend to a difficult person",
      "Extend to all beings everywhere"
    ],
    benefits: ["Increased compassion", "Reduced self-criticism", "Improved relationships"],
    difficulty: "Intermediate"
  },
  {
    id: 4,
    name: "Lectio Divina",
    tradition: "Christian Contemplative",
    duration: "20-40 minutes",
    description: "Sacred reading practice that moves from reading to meditation to prayer to contemplation.",
    instructions: [
      "Lectio: Read a passage slowly",
      "Meditatio: Reflect on a word or phrase that stands out",
      "Oratio: Respond in prayer or dialogue",
      "Contemplatio: Rest in silent presence"
    ],
    benefits: ["Deeper text engagement", "Spiritual insight", "Inner stillness"],
    difficulty: "Intermediate"
  },
  {
    id: 5,
    name: "Centering Prayer",
    tradition: "Christian Contemplative",
    duration: "20 minutes",
    description: "Consent to the presence and action of the divine within through a sacred word.",
    instructions: [
      "Choose a sacred word (e.g., 'peace', 'love', 'Jesus')",
      "Sit quietly and introduce the word as a symbol of consent",
      "When thoughts arise, gently return to the word",
      "At the end, remain in silence for 2-3 minutes"
    ],
    benefits: ["Surrender", "Deep peace", "Spiritual transformation"],
    difficulty: "Advanced"
  },
  {
    id: 6,
    name: "Zazen (Sitting Meditation)",
    tradition: "Zen Buddhism",
    duration: "25-40 minutes",
    description: "Just sitting—allowing everything to be as it is without manipulation.",
    instructions: [
      "Sit in proper posture (spine straight, chin tucked)",
      "Eyes slightly open, gazing downward",
      "Breathe naturally",
      "Let thoughts come and go like clouds",
      "Return to 'just sitting' when you notice distraction"
    ],
    benefits: ["Insight", "Equanimity", "Direct experience of reality"],
    difficulty: "Advanced"
  },
  {
    id: 7,
    name: "Walking Meditation",
    tradition: "Buddhist/Various",
    duration: "10-30 minutes",
    description: "Bring mindful attention to the experience of walking.",
    instructions: [
      "Choose a path (10-30 paces)",
      "Walk slowly, noticing each component of a step",
      "Feel the lifting, moving, placing of each foot",
      "At the end, pause, turn mindfully, and return",
      "Coordinate with breath if helpful"
    ],
    benefits: ["Grounding", "Body awareness", "Moving meditation option"],
    difficulty: "Beginner"
  },
  {
    id: 8,
    name: "Examen (Ignatian)",
    tradition: "Jesuit",
    duration: "15-20 minutes",
    description: "Review the day with gratitude, attention to movements of the heart, and intention.",
    instructions: [
      "Give thanks for the day",
      "Ask for light to see clearly",
      "Review the day: Where did you feel alive? Where drained?",
      "Acknowledge any failures with self-compassion",
      "Look ahead to tomorrow with intention"
    ],
    benefits: ["Self-awareness", "Gratitude", "Daily reflection"],
    difficulty: "Beginner"
  }
];

// ============================================================================
// GROWTH PRACTICES
// ============================================================================
const GROWTH_PRACTICES = [
  {
    id: 1,
    name: "Morning Pages",
    source: "Julia Cameron (The Artist's Way)",
    duration: "20-30 minutes",
    description: "Write three pages of stream-of-consciousness first thing in the morning.",
    instructions: [
      "Write immediately upon waking",
      "Write three pages by hand",
      "Don't edit, censor, or stop",
      "Write whatever comes to mind",
      "Don't reread them immediately"
    ],
    benefits: ["Cleared mental clutter", "Creative unblocking", "Self-discovery"],
    frequency: "Daily"
  },
  {
    id: 2,
    name: "Weekly Review",
    source: "David Allen (GTD) / Stoic practices",
    duration: "60-90 minutes",
    description: "Systematically review the past week and plan the next.",
    instructions: [
      "Collect: Gather loose papers, notes, thoughts",
      "Process: Clarify what each item means",
      "Review: Check all projects and lists",
      "Reflect: What went well? What to improve?",
      "Plan: Set intentions for next week"
    ],
    benefits: ["Clarity", "Control", "Intentional living"],
    frequency: "Weekly"
  },
  {
    id: 3,
    name: "Deliberate Practice Session",
    source: "Anders Ericsson",
    duration: "45-90 minutes",
    description: "Focused practice at the edge of your abilities with immediate feedback.",
    instructions: [
      "Identify a specific sub-skill to improve",
      "Set a clear goal for the session",
      "Practice at the edge of your ability",
      "Get immediate feedback (self or external)",
      "Adjust based on feedback and repeat"
    ],
    benefits: ["Skill development", "Mastery", "Competitive advantage"],
    frequency: "Daily or several times weekly"
  },
  {
    id: 4,
    name: "Negative Visualization (Premeditatio Malorum)",
    source: "Stoicism",
    duration: "5-10 minutes",
    description: "Briefly imagine losing what you have to appreciate it and prepare for setbacks.",
    instructions: [
      "Choose something you value",
      "Imagine it being taken away",
      "Feel the loss briefly",
      "Return to the present with renewed appreciation",
      "Consider how you would cope if it happened"
    ],
    benefits: ["Gratitude", "Resilience", "Reduced anxiety about loss"],
    frequency: "Daily or as needed"
  },
  {
    id: 5,
    name: "Interstitial Journaling",
    source: "Tony Stubblebine",
    duration: "1-2 minutes per entry",
    description: "Journal briefly between tasks to capture insights and intentions.",
    instructions: [
      "Before switching tasks, pause",
      "Note the time",
      "Write 1-3 sentences about what you did or noticed",
      "Set intention for the next task",
      "Move on"
    ],
    benefits: ["Continuous reflection", "Productivity awareness", "Idea capture"],
    frequency: "Throughout the day"
  },
  {
    id: 6,
    name: "Annual Life Review",
    source: "Various",
    duration: "2-4 hours",
    description: "Deep review of the past year and intentional planning for the next.",
    instructions: [
      "Review: What happened each month?",
      "Celebrate: What were the highlights?",
      "Learn: What were the challenges and lessons?",
      "Release: What are you letting go of?",
      "Envision: What do you want next year to look like?",
      "Commit: What are your key intentions?"
    ],
    benefits: ["Perspective", "Closure", "Intentional direction"],
    frequency: "Annually"
  },
  {
    id: 7,
    name: "Maker/Manager Schedule",
    source: "Paul Graham",
    duration: "Full day structure",
    description: "Structure your day with long blocks for creative work and shorter blocks for meetings.",
    instructions: [
      "Identify your 'maker' hours (deep work)",
      "Protect 3-4 hour blocks for maker work",
      "Batch meetings and admin into manager blocks",
      "Avoid context switching during maker time",
      "Use buffer time between modes"
    ],
    benefits: ["Deep work capacity", "Creative output", "Reduced fragmentation"],
    frequency: "Daily structure"
  },
  {
    id: 8,
    name: "Spaced Repetition Review",
    source: "Cognitive science",
    duration: "15-30 minutes",
    description: "Review material at expanding intervals to optimize long-term retention.",
    instructions: [
      "Create flashcards or notes for key concepts",
      "Review new items daily",
      "Increase intervals: 1 day, 3 days, 1 week, 2 weeks, 1 month",
      "Focus on items you get wrong",
      "Use an SRS tool like Anki if desired"
    ],
    benefits: ["Long-term memory", "Efficient learning", "Knowledge accumulation"],
    frequency: "Daily, 15-30 minutes"
  }
];

// ============================================================================
// INTEGRATION RITUALS
// ============================================================================
const INTEGRATION_RITUALS = [
  {
    id: 1,
    name: "Morning Intention Ritual",
    duration: "10-15 minutes",
    components: ["Gratitude (3 things)", "Today's intention", "Today's focus question", "Body check-in"],
    description: "Start the day with clarity and presence"
  },
  {
    id: 2,
    name: "Evening Integration Ritual",
    duration: "10-15 minutes",
    components: ["What went well", "What I learned", "What I release", "Gratitude"],
    description: "Close the day with reflection and letting go"
  },
  {
    id: 3,
    name: "Transition Ritual",
    duration: "2-5 minutes",
    components: ["Three breaths", "Physical movement", "Clear intention for next activity"],
    description: "Mindfully shift between activities or roles"
  },
  {
    id: 4,
    name: "Weekly Wisdom Integration",
    duration: "30-60 minutes",
    components: ["Review insights from the week", "Extract 1-3 key learnings", "Apply to upcoming week"],
    description: "Consolidate learning into actionable wisdom"
  }
];

// ============================================================================
// API ENDPOINTS
// ============================================================================

// Contemplative Practices
router.get("/contemplative", (_req, res) => {
  res.json({
    ok: true,
    practices: CONTEMPLATIVE_PRACTICES,
    total: CONTEMPLATIVE_PRACTICES.length,
    traditions: [...new Set(CONTEMPLATIVE_PRACTICES.map(p => p.tradition))],
    description: "Meditation and contemplative practices from world traditions"
  });
});

router.get("/contemplative/:id", (req, res) => {
  const practice = CONTEMPLATIVE_PRACTICES.find(p => p.id === parseInt(req.params.id));
  if (!practice) return res.status(404).json({ ok: false, error: "Practice not found" });
  res.json({ ok: true, practice });
});

router.get("/contemplative/difficulty/:level", (req, res) => {
  const level = req.params.level.charAt(0).toUpperCase() + req.params.level.slice(1).toLowerCase();
  const practices = CONTEMPLATIVE_PRACTICES.filter(p => p.difficulty === level);
  res.json({ ok: true, practices, total: practices.length });
});

// Growth Practices
router.get("/growth", (_req, res) => {
  res.json({
    ok: true,
    practices: GROWTH_PRACTICES,
    total: GROWTH_PRACTICES.length,
    description: "Practices for personal and professional development"
  });
});

router.get("/growth/:id", (req, res) => {
  const practice = GROWTH_PRACTICES.find(p => p.id === parseInt(req.params.id));
  if (!practice) return res.status(404).json({ ok: false, error: "Practice not found" });
  res.json({ ok: true, practice });
});

// Integration Rituals
router.get("/rituals", (_req, res) => {
  res.json({
    ok: true,
    rituals: INTEGRATION_RITUALS,
    total: INTEGRATION_RITUALS.length,
    description: "Structured rituals for integrating wisdom into daily life"
  });
});

// Daily Practice Recommendation
router.get("/daily", (_req, res) => {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const dayOfWeek = new Date().getDay();
  
  // Rotate through practices
  const contemplative = CONTEMPLATIVE_PRACTICES[dayOfYear % CONTEMPLATIVE_PRACTICES.length];
  const growth = GROWTH_PRACTICES[dayOfYear % GROWTH_PRACTICES.length];
  
  // Morning and evening rituals
  const morning = INTEGRATION_RITUALS.find(r => r.name.includes("Morning"));
  const evening = INTEGRATION_RITUALS.find(r => r.name.includes("Evening"));
  
  res.json({
    ok: true,
    daily: {
      contemplativePractice: contemplative,
      growthPractice: growth,
      morningRitual: morning,
      eveningRitual: evening,
      weeklyNote: dayOfWeek === 0 ? "Sunday: Consider a longer contemplative session" : 
                  dayOfWeek === 6 ? "Saturday: Great day for annual/weekly review" : null
    },
    dayOfYear,
    dayOfWeek,
    title: "Daily Practice Recommendation"
  });
});

// Complete practice library
router.get("/all", (_req, res) => {
  res.json({
    ok: true,
    contemplative: CONTEMPLATIVE_PRACTICES,
    growth: GROWTH_PRACTICES,
    rituals: INTEGRATION_RITUALS,
    totals: {
      contemplative: CONTEMPLATIVE_PRACTICES.length,
      growth: GROWTH_PRACTICES.length,
      rituals: INTEGRATION_RITUALS.length,
      total: CONTEMPLATIVE_PRACTICES.length + GROWTH_PRACTICES.length + INTEGRATION_RITUALS.length
    }
  });
});


// Health check endpoint for admin daily tools monitoring
router.get("/", (req, res) => {
  res.json({ ok: true, module: "practices", status: "operational", timestamp: new Date().toISOString() });
});

export default router;
