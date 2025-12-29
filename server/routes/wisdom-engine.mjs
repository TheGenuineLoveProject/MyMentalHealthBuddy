import { Router } from "express";

const router = Router();

const WISDOM_PATTERNS = [
  {
    id: "paradox-integration",
    name: "Paradox Integration",
    description: "The deepest wisdom often holds opposites in creative tension",
    insights: [
      "Strength comes from acknowledging vulnerability",
      "Control emerges from surrender",
      "Speed comes from slowing down",
      "Clarity emerges from embracing confusion",
      "Connection deepens through healthy separation"
    ],
    practicePrompt: "What opposing truths are you struggling to hold simultaneously?"
  },
  {
    id: "temporal-wisdom",
    name: "Temporal Wisdom",
    description: "Understanding the relationship between past, present, and future",
    insights: [
      "The past informs but doesn't determine",
      "The future is created in present choices",
      "Regret about the past and anxiety about the future both steal the present",
      "Pattern recognition across time reveals life themes",
      "Each moment contains eternity"
    ],
    practicePrompt: "How does your relationship with time affect your peace?"
  },
  {
    id: "relational-truth",
    name: "Relational Truth",
    description: "We exist in relationship - isolation is illusion",
    insights: [
      "You are shaped by every interaction",
      "Others mirror parts of yourself",
      "Boundaries are bridges, not walls",
      "Giving and receiving are one movement",
      "We heal in relationship what was wounded in relationship"
    ],
    practicePrompt: "What are your relationships teaching you about yourself?"
  },
  {
    id: "growth-edge",
    name: "Growth Edge Recognition",
    description: "Growth happens at the edge of comfort",
    insights: [
      "Discomfort signals potential growth",
      "Resistance often points to importance",
      "What you avoid has power over you",
      "Small consistent edge-pushing beats dramatic leaps",
      "The obstacle is the way"
    ],
    practicePrompt: "What are you avoiding that contains your growth?"
  },
  {
    id: "acceptance-change",
    name: "Acceptance-Change Dialectic",
    description: "The paradox of accepting what is while working for change",
    insights: [
      "Acceptance is not resignation",
      "Change requires accepting where you are",
      "Fighting reality prevents transformation",
      "Radical acceptance enables radical change",
      "Both acceptance and change are needed simultaneously"
    ],
    practicePrompt: "What do you need to accept in order to change?"
  }
];

const WISDOM_TRADITIONS = [
  {
    id: "stoicism",
    name: "Stoic Wisdom",
    coreTeachings: [
      "Focus on what you can control",
      "Virtue is the highest good",
      "Perceive events without judgment",
      "Prepare for adversity (premeditatio malorum)",
      "Live according to nature and reason"
    ],
    keyPractices: ["Morning reflection", "Evening review", "Negative visualization", "Voluntary discomfort"],
    representatives: ["Marcus Aurelius", "Epictetus", "Seneca"]
  },
  {
    id: "buddhism",
    name: "Buddhist Wisdom",
    coreTeachings: [
      "Life contains suffering (dukkha)",
      "Suffering comes from attachment",
      "Liberation is possible",
      "The Eightfold Path leads to liberation",
      "All phenomena are impermanent"
    ],
    keyPractices: ["Meditation", "Mindfulness", "Loving-kindness", "Right action"],
    representatives: ["The Buddha", "Thich Nhat Hanh", "Dalai Lama"]
  },
  {
    id: "taoism",
    name: "Taoist Wisdom",
    coreTeachings: [
      "The Tao that can be named is not the eternal Tao",
      "Wu wei - effortless action",
      "Yin and Yang - complementary opposites",
      "Naturalness and simplicity",
      "The soft overcomes the hard"
    ],
    keyPractices: ["Flow with nature", "Embrace simplicity", "Practice non-action", "Cultivate stillness"],
    representatives: ["Lao Tzu", "Chuang Tzu"]
  },
  {
    id: "existentialism",
    name: "Existentialist Wisdom",
    coreTeachings: [
      "Existence precedes essence",
      "Radical freedom implies radical responsibility",
      "Authenticity over conformity",
      "Meaning is created, not found",
      "Confronting mortality enables living fully"
    ],
    keyPractices: ["Authentic choice", "Confronting anxiety", "Creating meaning", "Living decisively"],
    representatives: ["Kierkegaard", "Sartre", "Camus", "Heidegger"]
  },
  {
    id: "depth-psychology",
    name: "Depth Psychology Wisdom",
    coreTeachings: [
      "The unconscious shapes conscious life",
      "Shadow integration enables wholeness",
      "Dreams are messages from the psyche",
      "Complexes carry autonomous energy",
      "Individuation is life's purpose"
    ],
    keyPractices: ["Dream work", "Active imagination", "Shadow integration", "Archetypal awareness"],
    representatives: ["Jung", "Hillman", "Marie-Louise von Franz"]
  }
];

const UNIVERSAL_THEMES = [
  { theme: "Suffering as teacher", description: "Difficulty as the curriculum of growth" },
  { theme: "Interconnection", description: "The fundamental relatedness of all things" },
  { theme: "Impermanence", description: "All things arise and pass away" },
  { theme: "Present moment", description: "Now as the only point of power" },
  { theme: "Self-knowledge", description: "The examined life as foundational" },
  { theme: "Virtue", description: "Character as the basis of good life" },
  { theme: "Balance", description: "The middle way in all things" },
  { theme: "Meaning", description: "Purpose as essential to thriving" }
];

const DAILY_WISDOM = [
  { quote: "The obstacle is the way.", source: "Marcus Aurelius (adapted)", theme: "Stoic reframe" },
  { quote: "Before enlightenment, chop wood, carry water. After enlightenment, chop wood, carry water.", source: "Zen saying", theme: "Present moment" },
  { quote: "We suffer more in imagination than in reality.", source: "Seneca", theme: "Anxiety dissolution" },
  { quote: "The wound is the place where the Light enters you.", source: "Rumi", theme: "Transformation through pain" },
  { quote: "You must be the change you wish to see in the world.", source: "Gandhi", theme: "Personal responsibility" },
  { quote: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", source: "Emerson", theme: "Inner resources" },
  { quote: "The only way out is through.", source: "Robert Frost", theme: "Facing difficulty" },
  { quote: "In the middle of difficulty lies opportunity.", source: "Einstein", theme: "Reframe" },
  { quote: "He who has a why to live can bear almost any how.", source: "Nietzsche", theme: "Meaning" },
  { quote: "The unexamined life is not worth living.", source: "Socrates", theme: "Self-knowledge" },
  { quote: "What you resist persists.", source: "Jung", theme: "Acceptance" },
  { quote: "Be kind, for everyone you meet is fighting a hard battle.", source: "Plato (attributed)", theme: "Compassion" },
  { quote: "The mind is everything. What you think you become.", source: "Buddha", theme: "Mind training" },
  { quote: "To thine own self be true.", source: "Shakespeare", theme: "Authenticity" },
  { quote: "Life can only be understood backwards; but it must be lived forwards.", source: "Kierkegaard", theme: "Time" }
];

router.get("/patterns", (_req, res) => {
  res.json({
    success: true,
    data: WISDOM_PATTERNS,
    total: WISDOM_PATTERNS.length
  });
});

router.get("/patterns/:id", (req, res) => {
  const pattern = WISDOM_PATTERNS.find(p => p.id === req.params.id);
  if (!pattern) {
    return res.status(404).json({ success: false, error: "Pattern not found" });
  }
  res.json({ success: true, data: pattern });
});

router.get("/traditions", (_req, res) => {
  res.json({
    success: true,
    data: WISDOM_TRADITIONS,
    total: WISDOM_TRADITIONS.length
  });
});

router.get("/traditions/:id", (req, res) => {
  const tradition = WISDOM_TRADITIONS.find(t => t.id === req.params.id);
  if (!tradition) {
    return res.status(404).json({ success: false, error: "Tradition not found" });
  }
  res.json({ success: true, data: tradition });
});

router.get("/themes", (_req, res) => {
  res.json({
    success: true,
    data: UNIVERSAL_THEMES,
    total: UNIVERSAL_THEMES.length
  });
});

router.get("/daily", (_req, res) => {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  const wisdom = DAILY_WISDOM[dayOfYear % DAILY_WISDOM.length];
  
  res.json({
    success: true,
    data: {
      ...wisdom,
      date: today.toISOString().split('T')[0],
      reflection: `How does "${wisdom.quote}" apply to your life today?`
    }
  });
});

router.post("/synthesize", (req, res) => {
  const { challenge, preferences } = req.body;
  
  const relevantPatterns = WISDOM_PATTERNS.slice(0, 2);
  const relevantTradition = WISDOM_TRADITIONS[Math.floor(Math.random() * WISDOM_TRADITIONS.length)];
  const relevantWisdom = DAILY_WISDOM[Math.floor(Math.random() * DAILY_WISDOM.length)];
  
  res.json({
    success: true,
    data: {
      challenge: challenge || "General life navigation",
      synthesis: {
        patterns: relevantPatterns.map(p => ({ name: p.name, insight: p.insights[0] })),
        tradition: { name: relevantTradition.name, teaching: relevantTradition.coreTeachings[0] },
        quote: relevantWisdom,
        integration: "Consider how these perspectives together illuminate your situation."
      },
      practiceRecommendation: relevantPatterns[0].practicePrompt
    }
  });
});

router.get("/cross-tradition/:theme", (req, res) => {
  const theme = UNIVERSAL_THEMES.find(t => t.theme.toLowerCase().includes(req.params.theme.toLowerCase()));
  
  if (!theme) {
    return res.status(404).json({ success: false, error: "Theme not found" });
  }
  
  const perspectives = WISDOM_TRADITIONS.map(t => ({
    tradition: t.name,
    teaching: t.coreTeachings[0],
    practice: t.keyPractices[0]
  }));
  
  res.json({
    success: true,
    data: {
      theme: theme.theme,
      description: theme.description,
      crossTraditionPerspectives: perspectives
    }
  });
});

export default router;
