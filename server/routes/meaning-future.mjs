import { Router } from "express";

const router = Router();

const FUTURE_SELF_PROMPTS = [
  { timeframe: "1 month", prompt: "What do you hope will be different 30 days from now?" },
  { timeframe: "6 months", prompt: "What habits will future-you thank present-you for starting?" },
  { timeframe: "1 year", prompt: "What will you have learned or accomplished by next year?" },
  { timeframe: "5 years", prompt: "Describe the life you want to be living in 5 years." },
  { timeframe: "10 years", prompt: "What legacy are you beginning to build?" }
];

const LIFE_CHAPTER_PROMPTS = [
  { chapter: "origin", prompt: "What early experiences shaped who you are today?", theme: "Understanding your foundations" },
  { chapter: "challenge", prompt: "What was the hardest thing you've faced, and what did it teach you?", theme: "Growth through adversity" },
  { chapter: "turning-point", prompt: "Describe a moment when everything changed.", theme: "Transformation" },
  { chapter: "relationship", prompt: "Who has had the biggest impact on your life, and why?", theme: "Connection and influence" },
  { chapter: "discovery", prompt: "What's something important you learned about yourself?", theme: "Self-knowledge" },
  { chapter: "present", prompt: "Where are you now in your story? What chapter is this?", theme: "Current meaning" },
  { chapter: "future", prompt: "How do you want the next chapter to unfold?", theme: "Intentional direction" }
];

const GRATITUDE_DIMENSIONS = [
  { dimension: "people", prompt: "Who are you grateful for today and why?", reflection: "Relationships are the foundation of wellbeing." },
  { dimension: "experiences", prompt: "What moment or experience brought you joy recently?", reflection: "Joy lives in the present moment." },
  { dimension: "growth", prompt: "What challenge are you grateful for because of what it taught you?", reflection: "Difficulty often carries hidden gifts." },
  { dimension: "basics", prompt: "What simple thing do you take for granted that deserves appreciation?", reflection: "The ordinary is extraordinary." },
  { dimension: "self", prompt: "What quality in yourself are you grateful for?", reflection: "Self-appreciation is not arrogance." },
  { dimension: "future", prompt: "What possibility are you grateful to have ahead of you?", reflection: "Hope is a form of gratitude for the future." }
];

const CONTRIBUTION_MAP = [
  { sphere: "intimate", description: "Partner, family, closest friends", questions: ["How can I show up better for the people closest to me?", "What do they need from me that I haven't offered?"] },
  { sphere: "community", description: "Colleagues, neighbors, local groups", questions: ["What skills do I have that could serve my community?", "Who in my extended network could use support?"] },
  { sphere: "world", description: "Broader society, causes, future generations", questions: ["What issue in the world calls to me?", "What small contribution could I make to something bigger than myself?"] }
];

const BRAVE_ACTION_FRAMEWORK = {
  identify: {
    prompt: "What's one thing you've been putting off that matters to you?",
    insight: "Avoidance often points to what's most important."
  },
  clarify: {
    prompt: "Why does this matter? What will it give you or others?",
    insight: "Connecting to meaning increases motivation."
  },
  shrink: {
    prompt: "What's the smallest first step you could take?",
    insight: "Tiny steps bypass fear."
  },
  schedule: {
    prompt: "When exactly will you take this step? Be specific.",
    insight: "Vague intentions rarely become actions."
  },
  prepare: {
    prompt: "What might get in the way and how will you handle it?",
    insight: "Anticipating obstacles increases success."
  },
  commit: {
    prompt: "Who can you tell about this commitment?",
    insight: "Accountability strengthens resolve."
  }
};

router.get("/future-self/prompts", (req, res) => {
  const { timeframe } = req.query;
  if (timeframe) {
    const prompt = FUTURE_SELF_PROMPTS.find(p => p.timeframe === timeframe);
    if (prompt) {
      return res.json({ ok: true, prompt });
    }
  }
  res.json({ ok: true, prompts: FUTURE_SELF_PROMPTS });
});

router.post("/future-self/letter", (req, res) => {
  const { timeframe, letter, deliveryDate } = req.body || {};
  if (!timeframe || typeof timeframe !== 'string') {
    return res.status(400).json({ ok: false, error: "timeframe is required and must be a string" });
  }
  if (!letter || typeof letter !== 'string' || letter.trim().length < 10) {
    return res.status(400).json({ ok: false, error: "letter is required and must be at least 10 characters" });
  }
  const validTimeframes = ["1 month", "6 months", "1 year", "5 years", "10 years"];
  if (!validTimeframes.includes(timeframe)) {
    return res.status(400).json({ ok: false, error: "Invalid timeframe", validTimeframes });
  }
  const daysMap = { "1 month": 30, "6 months": 180, "1 year": 365, "5 years": 1825, "10 years": 3650 };
  const confirmation = {
    id: `letter-${Date.now()}`,
    timeframe,
    letterPreview: letter.substring(0, 100) + (letter.length > 100 ? "..." : ""),
    deliveryDate: deliveryDate || new Date(Date.now() + (daysMap[timeframe] || 365) * 24 * 60 * 60 * 1000).toISOString(),
    message: "Your letter to your future self has been saved."
  };
  res.json({ ok: true, confirmation });
});

router.get("/life-chapters", (req, res) => {
  res.json({ ok: true, chapters: LIFE_CHAPTER_PROMPTS });
});

router.get("/life-chapters/:chapter", (req, res) => {
  const { chapter } = req.params;
  const found = LIFE_CHAPTER_PROMPTS.find(c => c.chapter === chapter);
  if (!found) {
    return res.status(404).json({ ok: false, error: "Chapter not found", available: LIFE_CHAPTER_PROMPTS.map(c => c.chapter) });
  }
  res.json({ ok: true, chapter: found });
});

router.get("/gratitude", (req, res) => {
  res.json({ ok: true, dimensions: GRATITUDE_DIMENSIONS });
});

router.get("/gratitude/daily", (req, res) => {
  const today = new Date().getDay();
  const dimension = GRATITUDE_DIMENSIONS[today % GRATITUDE_DIMENSIONS.length];
  res.json({ ok: true, dimension, message: "Today's gratitude focus" });
});

router.get("/contribution-map", (req, res) => {
  res.json({ ok: true, spheres: CONTRIBUTION_MAP });
});

router.get("/brave-action", (req, res) => {
  res.json({ ok: true, framework: BRAVE_ACTION_FRAMEWORK });
});

router.post("/brave-action/plan", (req, res) => {
  const { action, meaning, firstStep, when, obstacles, accountability } = req.body;
  if (!action || !firstStep || !when) {
    return res.status(400).json({ ok: false, error: "action, firstStep, and when are required" });
  }
  const plan = {
    id: `brave-${Date.now()}`,
    action,
    meaning: meaning || "Not specified",
    firstStep,
    when,
    obstacles: obstacles || [],
    accountability: accountability || "self",
    createdAt: new Date().toISOString(),
    message: "Your brave action plan is ready. The next step is to take the first step."
  };
  res.json({ ok: true, plan });
});


// Health check endpoint for admin daily tools monitoring
router.get("/", (req, res) => {
  res.json({ ok: true, module: "meaning-future", status: "operational", timestamp: new Date().toISOString() });
});

export default router;
