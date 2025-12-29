// server/routes/philosophy.mjs
// Philosophical Schools Navigator and Virtue Ethics Framework
import express from "express";

const router = express.Router();

// ============================================================================
// PHILOSOPHICAL SCHOOLS
// ============================================================================
const PHILOSOPHICAL_SCHOOLS = [
  {
    id: 1,
    name: "Stoicism",
    origin: "Ancient Greece/Rome (300 BCE - 200 CE)",
    founders: ["Zeno of Citium", "Epictetus", "Seneca", "Marcus Aurelius"],
    corePrinciples: [
      "Focus on what you can control",
      "Virtue is the only true good",
      "Emotions arise from judgments",
      "Live according to nature and reason",
      "Practice negative visualization"
    ],
    keyPractices: [
      "Morning reflection on potential challenges",
      "Evening review of actions",
      "Voluntary discomfort",
      "Memento mori (remembering death)",
      "View from above"
    ],
    modernApplications: ["Stress management", "Decision-making", "Emotional regulation", "Leadership"],
    keyTexts: ["Meditations", "Enchiridion", "Letters from a Stoic"],
    dailyQuestion: "What is within my control today, and what must I accept?"
  },
  {
    id: 2,
    name: "Buddhism",
    origin: "Ancient India (5th century BCE)",
    founders: ["Siddhartha Gautama (The Buddha)"],
    corePrinciples: [
      "Four Noble Truths: Suffering, its origin, cessation, and path",
      "Noble Eightfold Path",
      "Impermanence (anicca)",
      "Non-self (anatta)",
      "Dependent origination"
    ],
    keyPractices: [
      "Meditation (samatha and vipassana)",
      "Mindfulness in daily activities",
      "Ethical conduct (sila)",
      "Loving-kindness (metta)",
      "Right livelihood"
    ],
    modernApplications: ["Mindfulness", "Psychotherapy", "Pain management", "Well-being"],
    keyTexts: ["Dhammapada", "Heart Sutra", "Mindfulness in Plain English"],
    dailyQuestion: "What am I clinging to that causes unnecessary suffering?"
  },
  {
    id: 3,
    name: "Existentialism",
    origin: "19th-20th Century Europe",
    founders: ["Kierkegaard", "Nietzsche", "Heidegger", "Sartre", "Camus"],
    corePrinciples: [
      "Existence precedes essence",
      "Radical freedom and responsibility",
      "Authenticity vs. bad faith",
      "Confronting absurdity",
      "Creating meaning through choice"
    ],
    keyPractices: [
      "Taking responsibility for your choices",
      "Confronting anxiety rather than avoiding it",
      "Living authentically",
      "Creating personal meaning",
      "Embracing uncertainty"
    ],
    modernApplications: ["Psychotherapy", "Personal development", "Ethics", "Leadership"],
    keyTexts: ["Being and Nothingness", "The Myth of Sisyphus", "Man's Search for Meaning"],
    dailyQuestion: "Am I living authentically, or following a script written by others?"
  },
  {
    id: 4,
    name: "Taoism",
    origin: "Ancient China (6th century BCE)",
    founders: ["Lao Tzu", "Zhuangzi"],
    corePrinciples: [
      "The Tao that can be told is not the eternal Tao",
      "Wu wei (non-action/effortless action)",
      "Harmony with nature",
      "Yin and yang balance",
      "Simplicity and spontaneity"
    ],
    keyPractices: [
      "Meditation and stillness",
      "Going with the flow",
      "Embracing paradox",
      "Simplifying life",
      "Observing nature"
    ],
    modernApplications: ["Stress reduction", "Creativity", "Leadership", "Flow states"],
    keyTexts: ["Tao Te Ching", "Zhuangzi", "The Book of Chuang Tzu"],
    dailyQuestion: "Where am I forcing things instead of allowing them to unfold naturally?"
  },
  {
    id: 5,
    name: "Pragmatism",
    origin: "19th-20th Century America",
    founders: ["William James", "John Dewey", "Charles Peirce"],
    corePrinciples: [
      "Truth is what works in practice",
      "Ideas have practical consequences",
      "Meaning comes from effects",
      "Inquiry is problem-solving",
      "Experience is primary"
    ],
    keyPractices: [
      "Testing ideas through action",
      "Focusing on practical outcomes",
      "Continuous experimentation",
      "Learning from consequences",
      "Applying philosophy to life"
    ],
    modernApplications: ["Science", "Education", "Problem-solving", "Design thinking"],
    keyTexts: ["Pragmatism", "Democracy and Education", "How We Think"],
    dailyQuestion: "What practical difference does this belief make in my life?"
  },
  {
    id: 6,
    name: "Epicureanism",
    origin: "Ancient Greece (307 BCE)",
    founders: ["Epicurus"],
    corePrinciples: [
      "Pleasure (ataraxia) is the highest good",
      "Simple pleasures over excessive desires",
      "Freedom from fear and anxiety",
      "Friendship is essential",
      "Death is nothing to us"
    ],
    keyPractices: [
      "Cultivating simple pleasures",
      "Reducing unnecessary desires",
      "Building deep friendships",
      "Contemplating mortality without fear",
      "Living moderately"
    ],
    modernApplications: ["Well-being", "Minimalism", "Relationships", "Death acceptance"],
    keyTexts: ["Letter to Menoeceus", "Principal Doctrines", "Vatican Sayings"],
    dailyQuestion: "Am I pursuing genuine contentment or fleeting pleasures?"
  },
  {
    id: 7,
    name: "Confucianism",
    origin: "Ancient China (551-479 BCE)",
    founders: ["Confucius", "Mencius"],
    corePrinciples: [
      "Ren (benevolence/humaneness)",
      "Li (ritual propriety)",
      "Xiao (filial piety)",
      "Junzi (the exemplary person)",
      "Rectification of names"
    ],
    keyPractices: [
      "Cultivating virtue through practice",
      "Honoring relationships",
      "Continuous self-improvement",
      "Learning from classics",
      "Serving others"
    ],
    modernApplications: ["Ethics", "Leadership", "Education", "Family relationships"],
    keyTexts: ["Analects", "Mencius", "Great Learning"],
    dailyQuestion: "How can I better fulfill my responsibilities to others today?"
  },
  {
    id: 8,
    name: "Phenomenology",
    origin: "20th Century Europe",
    founders: ["Edmund Husserl", "Martin Heidegger", "Maurice Merleau-Ponty"],
    corePrinciples: [
      "Return to the things themselves",
      "Bracketing assumptions (epoché)",
      "Intentionality of consciousness",
      "Lived experience as primary",
      "Being-in-the-world"
    ],
    keyPractices: [
      "Careful attention to experience",
      "Suspending theoretical assumptions",
      "Describing rather than explaining",
      "Attending to embodiment",
      "Exploring the structures of consciousness"
    ],
    modernApplications: ["Psychology", "Qualitative research", "Mindfulness", "Therapy"],
    keyTexts: ["Being and Time", "Phenomenology of Perception", "Cartesian Meditations"],
    dailyQuestion: "What am I actually experiencing right now, prior to interpretation?"
  }
];

// ============================================================================
// VIRTUE ETHICS FRAMEWORK
// ============================================================================
const VIRTUE_ETHICS = {
  cardinal: [
    {
      name: "Prudence (Phronesis)",
      definition: "Practical wisdom—knowing what to do in particular situations",
      extremes: { deficiency: "Foolishness", excess: "Cunning" },
      practices: ["Deliberate carefully", "Learn from experience", "Seek wise counsel", "Consider consequences"],
      dailyPrompt: "What decision today requires careful deliberation about the right thing to do?"
    },
    {
      name: "Justice",
      definition: "Giving to each what is due",
      extremes: { deficiency: "Unfairness", excess: "Fanatical legalism" },
      practices: ["Treat people fairly", "Keep promises", "Respect rights", "Contribute to community"],
      dailyPrompt: "Am I giving others what they deserve—neither too much nor too little?"
    },
    {
      name: "Fortitude (Courage)",
      definition: "Facing fear and difficulty appropriately",
      extremes: { deficiency: "Cowardice", excess: "Recklessness" },
      practices: ["Face fears gradually", "Stand up for what's right", "Persist despite difficulty", "Take calculated risks"],
      dailyPrompt: "What am I avoiding out of fear that I should face?"
    },
    {
      name: "Temperance",
      definition: "Moderation in pleasures and desires",
      extremes: { deficiency: "Insensibility", excess: "Self-indulgence" },
      practices: ["Practice moderation", "Delay gratification", "Develop healthy habits", "Question cravings"],
      dailyPrompt: "Where in my life am I indulging too much or denying myself too much?"
    }
  ],
  intellectual: [
    { name: "Sophia", description: "Theoretical wisdom—understanding fundamental truths" },
    { name: "Episteme", description: "Scientific knowledge—systematic understanding" },
    { name: "Nous", description: "Intuition—grasping first principles" },
    { name: "Techne", description: "Craft knowledge—knowing how to make things" },
    { name: "Phronesis", description: "Practical wisdom—knowing what to do" }
  ],
  characterStrengths: [
    { category: "Wisdom", virtues: ["Creativity", "Curiosity", "Open-mindedness", "Love of learning", "Perspective"] },
    { category: "Courage", virtues: ["Bravery", "Persistence", "Integrity", "Vitality"] },
    { category: "Humanity", virtues: ["Love", "Kindness", "Social intelligence"] },
    { category: "Justice", virtues: ["Citizenship", "Fairness", "Leadership"] },
    { category: "Temperance", virtues: ["Forgiveness", "Humility", "Prudence", "Self-regulation"] },
    { category: "Transcendence", virtues: ["Appreciation of beauty", "Gratitude", "Hope", "Humor", "Spirituality"] }
  ]
};

// ============================================================================
// PHILOSOPHICAL QUESTIONS BY DOMAIN
// ============================================================================
const PHILOSOPHICAL_QUESTIONS = {
  metaphysics: [
    "What is the nature of reality?",
    "Do we have free will, or is everything determined?",
    "What is the relationship between mind and body?",
    "Does anything exist beyond the physical?",
    "What makes something the same thing over time?"
  ],
  epistemology: [
    "What can we know with certainty?",
    "How do we distinguish knowledge from belief?",
    "Are there limits to human understanding?",
    "What role does perception play in knowledge?",
    "How do we know other minds exist?"
  ],
  ethics: [
    "What makes an action right or wrong?",
    "Is morality objective or subjective?",
    "What do we owe to others?",
    "Can the ends justify the means?",
    "What is the good life?"
  ],
  aesthetics: [
    "What is beauty?",
    "Can art be objectively good or bad?",
    "What is the purpose of art?",
    "How does art affect us?",
    "Is nature beautiful in itself or do we make it so?"
  ],
  meaning: [
    "What is the meaning of life?",
    "Can life have meaning without God?",
    "Is suffering necessary for meaning?",
    "How do we create meaning?",
    "Does the universe have purpose?"
  ],
  self: [
    "What is the self?",
    "Am I the same person I was ten years ago?",
    "What makes me 'me'?",
    "Is there a true self beneath social roles?",
    "How do I become who I truly am?"
  ]
};

// ============================================================================
// API ENDPOINTS
// ============================================================================

// Philosophical Schools
router.get("/schools", (_req, res) => {
  res.json({
    ok: true,
    schools: PHILOSOPHICAL_SCHOOLS,
    total: PHILOSOPHICAL_SCHOOLS.length,
    description: "Major philosophical traditions and their practical applications"
  });
});

router.get("/schools/:id", (req, res) => {
  const school = PHILOSOPHICAL_SCHOOLS.find(s => s.id === parseInt(req.params.id));
  if (!school) return res.status(404).json({ ok: false, error: "School not found" });
  res.json({ ok: true, school });
});

router.get("/schools/search/:name", (req, res) => {
  const name = req.params.name.toLowerCase();
  const school = PHILOSOPHICAL_SCHOOLS.find(s => s.name.toLowerCase().includes(name));
  if (!school) return res.status(404).json({ ok: false, error: "School not found" });
  res.json({ ok: true, school });
});

// Virtue Ethics
router.get("/virtues", (_req, res) => {
  res.json({
    ok: true,
    virtueEthics: VIRTUE_ETHICS,
    description: "Classical virtue ethics framework for character development"
  });
});

router.get("/virtues/cardinal", (_req, res) => {
  res.json({
    ok: true,
    cardinalVirtues: VIRTUE_ETHICS.cardinal,
    total: VIRTUE_ETHICS.cardinal.length,
    description: "The four cardinal virtues from classical ethics"
  });
});

router.get("/virtues/strengths", (_req, res) => {
  res.json({
    ok: true,
    characterStrengths: VIRTUE_ETHICS.characterStrengths,
    total: VIRTUE_ETHICS.characterStrengths.reduce((sum, cat) => sum + cat.virtues.length, 0),
    description: "VIA character strengths from positive psychology"
  });
});

// Philosophical Questions
router.get("/questions", (_req, res) => {
  res.json({
    ok: true,
    categories: Object.keys(PHILOSOPHICAL_QUESTIONS),
    questions: PHILOSOPHICAL_QUESTIONS,
    totalQuestions: Object.values(PHILOSOPHICAL_QUESTIONS).flat().length,
    description: "Fundamental philosophical questions by domain"
  });
});

router.get("/questions/:category", (req, res) => {
  const category = req.params.category.toLowerCase();
  const questions = PHILOSOPHICAL_QUESTIONS[category];
  if (!questions) return res.status(404).json({ ok: false, error: "Category not found", available: Object.keys(PHILOSOPHICAL_QUESTIONS) });
  res.json({ ok: true, category, questions, total: questions.length });
});

router.get("/questions/:category/random", (req, res) => {
  const category = req.params.category.toLowerCase();
  const questions = PHILOSOPHICAL_QUESTIONS[category];
  if (!questions) return res.status(404).json({ ok: false, error: "Category not found" });
  const question = questions[Math.floor(Math.random() * questions.length)];
  res.json({ ok: true, category, question });
});

// Daily Philosophical Practice
router.get("/daily", (_req, res) => {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  
  const school = PHILOSOPHICAL_SCHOOLS[dayOfYear % PHILOSOPHICAL_SCHOOLS.length];
  const virtue = VIRTUE_ETHICS.cardinal[dayOfYear % VIRTUE_ETHICS.cardinal.length];
  const allQuestions = Object.values(PHILOSOPHICAL_QUESTIONS).flat();
  const question = allQuestions[dayOfYear % allQuestions.length];
  
  res.json({
    ok: true,
    daily: {
      philosophicalSchool: { 
        name: school.name, 
        dailyQuestion: school.dailyQuestion,
        keyPractice: school.keyPractices[dayOfYear % school.keyPractices.length]
      },
      cardinalVirtue: {
        name: virtue.name,
        dailyPrompt: virtue.dailyPrompt
      },
      contemplationQuestion: question,
      integrationChallenge: `Today, approach life through the lens of ${school.name}. Practice "${virtue.name}" and contemplate: "${question}"`
    },
    dayOfYear,
    title: "Daily Philosophical Practice"
  });
});

// Complete library
router.get("/all", (_req, res) => {
  res.json({
    ok: true,
    schools: PHILOSOPHICAL_SCHOOLS,
    virtueEthics: VIRTUE_ETHICS,
    questions: PHILOSOPHICAL_QUESTIONS,
    totals: {
      schools: PHILOSOPHICAL_SCHOOLS.length,
      cardinalVirtues: VIRTUE_ETHICS.cardinal.length,
      characterStrengths: VIRTUE_ETHICS.characterStrengths.reduce((sum, cat) => sum + cat.virtues.length, 0),
      questions: Object.values(PHILOSOPHICAL_QUESTIONS).flat().length
    }
  });
});

export default router;
