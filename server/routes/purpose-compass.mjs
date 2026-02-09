import { Router } from "express";

const router = Router();

// Purpose Frameworks - 8 meaning-finding systems
const PURPOSE_FRAMEWORKS = [
  { id: "ikigai", name: "Ikigai", origin: "Japan", components: ["What you love", "What you're good at", "What the world needs", "What you can be paid for"], description: "Find the intersection of passion, mission, vocation, and profession", questions: ["What activities make time disappear?", "What do others ask for your help with?", "What problems do you wish someone would solve?"] },
  { id: "hedgehog", name: "Hedgehog Concept", origin: "Jim Collins", components: ["Passion", "Best in World", "Economic Engine"], description: "Find where deep passion, unique talent, and economic sustainability meet", questions: ["What are you deeply passionate about?", "What could you potentially be best in the world at?", "What drives your economic engine?"] },
  { id: "golden-circle", name: "Golden Circle", origin: "Simon Sinek", components: ["Why", "How", "What"], description: "Start with why you exist, then how you do it, then what you do", questions: ["Why does your work matter beyond money?", "What principles guide how you operate?", "What specific outcomes do you create?"] },
  { id: "life-domains", name: "Life Domains", origin: "Positive Psychology", components: ["Work", "Love", "Play", "Health", "Spirit"], description: "Balance purpose across five essential life areas", questions: ["Is your energy distributed well across domains?", "Which domain needs more attention?", "How do your domains support each other?"] },
  { id: "hero-journey-purpose", name: "Hero's Journey Purpose", origin: "Joseph Campbell", components: ["Call to Adventure", "Special World", "Return with Elixir"], description: "Frame your life as a heroic narrative of transformation", questions: ["What adventure is calling you?", "What transformation are you undergoing?", "What gift will you bring back?"] },
  { id: "logotherapy", name: "Will to Meaning", origin: "Viktor Frankl", components: ["Creative Values", "Experiential Values", "Attitudinal Values"], description: "Find meaning through creation, experience, and attitude toward suffering", questions: ["What can you contribute or create?", "What beauty or love can you experience?", "What stance will you take toward unavoidable suffering?"] },
  { id: "self-determination", name: "Self-Determination Theory", origin: "Deci & Ryan", components: ["Autonomy", "Competence", "Relatedness"], description: "Fulfill basic psychological needs for intrinsic motivation", questions: ["Do you have genuine choice in your life?", "Are you growing in mastery?", "Are you connected to others?"] },
  { id: "eulogy-virtues", name: "Eulogy Virtues", origin: "David Brooks", components: ["Resume Virtues", "Eulogy Virtues"], description: "Prioritize character virtues over achievement credentials", questions: ["What would you want said at your eulogy?", "Which virtues are you developing?", "How do you want to be remembered?"] }
];

// Life Design Exercises - 15 practical tools
const LIFE_DESIGN_EXERCISES = [
  { id: "odyssey-plans", name: "Odyssey Plans", duration: "60-90 min", description: "Design three alternative five-year life paths", output: "Three detailed life scenarios with confidence and resource ratings" },
  { id: "energy-audit", name: "Energy Engagement Audit", duration: "30 min", description: "Log activities and rate engagement/energy for a week", output: "Heat map of energizing vs draining activities" },
  { id: "good-time-journal", name: "Good Time Journal", duration: "Daily 5 min", description: "Track moments of flow, play, and peak engagement", output: "Pattern recognition of optimal conditions" },
  { id: "workview-lifeview", name: "Workview/Lifeview", duration: "45 min each", description: "Write philosophies of work and life, then integrate them", output: "Two 250-word manifestos showing coherence" },
  { id: "prototyping", name: "Life Design Prototyping", duration: "Varies", description: "Test life hypotheses through small experiments", output: "Validated learning about potential paths" },
  { id: "mind-mapping-purpose", name: "Purpose Mind Map", duration: "30 min", description: "Radially explore connections from central purpose question", output: "Visual map of meaning connections" },
  { id: "values-sort", name: "Values Card Sort", duration: "20 min", description: "Rank 50+ values to identify your core five", output: "Prioritized values hierarchy" },
  { id: "legacy-letter", name: "Legacy Letter", duration: "60 min", description: "Write a letter from your future self to current self", output: "Guidance document from imagined future" },
  { id: "ideal-ordinary-day", name: "Ideal Ordinary Day", duration: "30 min", description: "Describe your perfect average Tuesday in detail", output: "Concrete vision of daily flourishing" },
  { id: "regret-minimization", name: "Regret Minimization Framework", duration: "15 min", description: "Project to age 80 and ask what you'd regret not doing", output: "Decision clarity for big choices" },
  { id: "fear-setting", name: "Fear Setting", duration: "45 min", description: "Define fears, prevention, repair, and costs of inaction", output: "Three-column analysis of worst cases" },
  { id: "personal-board", name: "Personal Board of Directors", duration: "30 min", description: "Identify 5-7 advisors for different life domains", output: "Support network map" },
  { id: "contribution-inventory", name: "Contribution Inventory", duration: "30 min", description: "List all ways you've positively impacted others", output: "Evidence of existing meaningful impact" },
  { id: "peak-experiences", name: "Peak Experience Analysis", duration: "45 min", description: "Analyze your top 10 life moments for common threads", output: "Pattern of what creates meaning for you" },
  { id: "anti-vision", name: "Anti-Vision", duration: "20 min", description: "Describe the life you definitely don't want", output: "Clarity on boundaries and dealbreakers" }
];

// Meaning Dimensions - 6 sources of meaning
const MEANING_DIMENSIONS = [
  { id: "purpose", name: "Purpose", description: "Goals and direction that provide motivation", cultivated_through: ["Goal-setting", "Vision work", "Future planning"], deficit_signs: ["Aimlessness", "Lack of motivation", "Drifting"] },
  { id: "coherence", name: "Coherence", description: "Sense that life makes sense and fits together", cultivated_through: ["Narrative work", "Values alignment", "Integration practices"], deficit_signs: ["Confusion", "Fragmentation", "Cognitive dissonance"] },
  { id: "significance", name: "Significance", description: "Feeling that your life matters and has worth", cultivated_through: ["Contribution", "Recognition", "Legacy work"], deficit_signs: ["Worthlessness", "Invisibility", "Futility"] },
  { id: "belonging", name: "Belonging", description: "Connection to people, places, or communities", cultivated_through: ["Community engagement", "Relationship investment", "Cultural participation"], deficit_signs: ["Isolation", "Alienation", "Loneliness"] },
  { id: "transcendence", name: "Transcendence", description: "Connection to something larger than self", cultivated_through: ["Spiritual practice", "Nature immersion", "Awe experiences"], deficit_signs: ["Nihilism", "Emptiness", "Self-centeredness"] },
  { id: "growth", name: "Growth", description: "Continuous development and becoming", cultivated_through: ["Learning", "Challenge-seeking", "Reflection"], deficit_signs: ["Stagnation", "Boredom", "Complacency"] }
];

// Routes
router.get("/frameworks", (_req, res) => {
  res.json({ success: true, data: PURPOSE_FRAMEWORKS });
});

router.get("/frameworks/:id", (req, res) => {
  const framework = PURPOSE_FRAMEWORKS.find(f => f.id === req.params.id);
  if (!framework) {
    return res.status(404).json({ success: false, error: "Framework not found" });
  }
  res.json({ success: true, data: framework });
});

router.get("/exercises", (_req, res) => {
  res.json({ success: true, data: LIFE_DESIGN_EXERCISES });
});

router.get("/exercises/:id", (req, res) => {
  const exercise = LIFE_DESIGN_EXERCISES.find(e => e.id === req.params.id);
  if (!exercise) {
    return res.status(404).json({ success: false, error: "Exercise not found" });
  }
  res.json({ success: true, data: exercise });
});

router.get("/meaning-dimensions", (_req, res) => {
  res.json({ success: true, data: MEANING_DIMENSIONS });
});

router.get("/daily-purpose", (_req, res) => {
  const today = new Date();
  const frameworkIndex = today.getDate() % PURPOSE_FRAMEWORKS.length;
  const exerciseIndex = today.getDate() % LIFE_DESIGN_EXERCISES.length;
  
  res.json({
    success: true,
    data: {
      date: today.toISOString().split('T')[0],
      frameworkFocus: PURPOSE_FRAMEWORKS[frameworkIndex],
      suggestedExercise: LIFE_DESIGN_EXERCISES[exerciseIndex],
      reflection: PURPOSE_FRAMEWORKS[frameworkIndex].questions[0]
    }
  });
});


// Health check endpoint for admin daily tools monitoring
router.get("/", (req, res) => {
  res.json({ ok: true, module: "purpose-compass", status: "operational", timestamp: new Date().toISOString() });
});

export default router;
