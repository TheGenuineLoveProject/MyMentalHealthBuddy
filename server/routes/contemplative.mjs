import express from "express";

const router = express.Router();

const MEDITATION_PRACTICES = [
  {
    practice: "Breath Awareness",
    tradition: "Universal",
    description: "Focus attention on the natural rhythm of breathing.",
    duration: "5-20 minutes",
    instruction: "Sit comfortably. Notice the breath at the nostrils, chest, or belly. When mind wanders, gently return."
  },
  {
    practice: "Body Scan",
    tradition: "MBSR/Mindfulness",
    description: "Systematically move attention through the body.",
    duration: "10-45 minutes",
    instruction: "Start at feet, slowly move attention upward, noticing sensations without judgment."
  },
  {
    practice: "Loving-Kindness (Metta)",
    tradition: "Buddhism",
    description: "Cultivate goodwill toward self and others.",
    duration: "10-30 minutes",
    instruction: "Send wishes of happiness, health, safety, and ease to self, loved ones, neutral people, difficult people, and all beings."
  },
  {
    practice: "Open Awareness",
    tradition: "Dzogchen/Mahamudra",
    description: "Rest in spacious awareness without focusing on any object.",
    duration: "10-30 minutes",
    instruction: "Allow awareness to be open to all experience without grasping or pushing away."
  },
  {
    practice: "Contemplative Inquiry",
    tradition: "Advaita/Zen",
    description: "Direct investigation of the nature of experience.",
    duration: "10-30 minutes",
    instruction: "Ask 'Who am I?' or 'What is aware?' and rest in the inquiry."
  },
  {
    practice: "Walking Meditation",
    tradition: "Buddhism",
    description: "Bring mindful attention to the act of walking.",
    duration: "10-30 minutes",
    instruction: "Walk slowly, attending to each step: lifting, moving, placing."
  },
  {
    practice: "Centering Prayer",
    tradition: "Christian Mysticism",
    description: "Consent to God's presence through interior silence.",
    duration: "20 minutes",
    instruction: "Choose a sacred word. Sit, introduce word, return gently when thoughts arise."
  },
  {
    practice: "Zazen",
    tradition: "Zen Buddhism",
    description: "Simply sitting in alert, upright posture with open awareness.",
    duration: "25-40 minutes",
    instruction: "Sit upright. Eyes slightly open. Just sit, neither grasping nor rejecting experience."
  }
];

const CONTEMPLATIVE_QUESTIONS = [
  {
    category: "Self-Inquiry",
    questions: [
      "What remains constant through all my changing experiences?",
      "Who is the one aware of these thoughts?",
      "What is my deepest aspiration?",
      "What am I defending that no longer serves me?"
    ]
  },
  {
    category: "Meaning & Purpose",
    questions: [
      "What would I do if I knew I could not fail?",
      "What will matter in ten years? A hundred years?",
      "Whose life would I be proud to have lived?",
      "What is my unique gift to the world?"
    ]
  },
  {
    category: "Relationships",
    questions: [
      "What would it take to fully forgive?",
      "How can I be of greater service to others?",
      "What am I withholding from my relationships?",
      "Who has shaped my understanding of love?"
    ]
  },
  {
    category: "Mortality & Finitude",
    questions: [
      "If I had one year to live, what would I prioritize?",
      "What do I want to have said with my life?",
      "What remains undone that I would regret?",
      "How does awareness of death change this moment?"
    ]
  },
  {
    category: "Gratitude & Wonder",
    questions: [
      "What am I taking for granted today?",
      "What miracle is happening right now?",
      "What gift arrived disguised as difficulty?",
      "What beauty have I overlooked?"
    ]
  }
];

const MINDFULNESS_EXERCISES = [
  {
    exercise: "STOP Practice",
    description: "Brief pause to return to presence.",
    steps: ["Stop what you're doing", "Take a breath", "Observe your experience", "Proceed with awareness"]
  },
  {
    exercise: "Five Senses Check",
    description: "Ground yourself through sensory awareness.",
    steps: ["Notice 5 things you see", "4 things you hear", "3 things you feel", "2 things you smell", "1 thing you taste"]
  },
  {
    exercise: "Mindful Eating",
    description: "Bring full attention to the experience of eating.",
    steps: ["Look at the food", "Notice smells", "Take small bites", "Chew slowly", "Notice flavors and textures"]
  },
  {
    exercise: "Loving-Kindness Phrases",
    description: "Repeat phrases of goodwill.",
    phrases: ["May I be happy", "May I be healthy", "May I be safe", "May I live with ease"]
  },
  {
    exercise: "RAIN Practice",
    description: "Work with difficult emotions mindfully.",
    steps: ["Recognize what is happening", "Allow the experience", "Investigate with kindness", "Nurture with self-compassion"]
  }
];

const WISDOM_TRADITIONS = [
  {
    tradition: "Stoicism",
    core_insight: "Focus on what you can control; accept what you cannot.",
    daily_practice: "Morning premeditation of challenges; evening reflection."
  },
  {
    tradition: "Buddhism",
    core_insight: "Suffering arises from attachment; liberation through letting go.",
    daily_practice: "Meditation, ethical conduct, wisdom cultivation."
  },
  {
    tradition: "Taoism",
    core_insight: "Flow with nature's way; act through non-action.",
    daily_practice: "Simplify, harmonize with natural rhythms, reduce forcing."
  },
  {
    tradition: "Advaita Vedanta",
    core_insight: "The individual self and ultimate reality are one.",
    daily_practice: "Self-inquiry, discrimination between real and unreal."
  },
  {
    tradition: "Contemplative Christianity",
    core_insight: "Divine presence dwells within; access through silent prayer.",
    daily_practice: "Lectio Divina, Centering Prayer, contemplative reading."
  },
  {
    tradition: "Sufism",
    core_insight: "The heart is the gateway to divine love.",
    daily_practice: "Dhikr (remembrance), poetry, whirling, heart practices."
  }
];

router.get("/meditation", (_req, res) => {
  res.json({ ok: true, practices: MEDITATION_PRACTICES });
});

router.get("/inquiry", (_req, res) => {
  res.json({ ok: true, questions: CONTEMPLATIVE_QUESTIONS });
});

router.get("/mindfulness", (_req, res) => {
  res.json({ ok: true, exercises: MINDFULNESS_EXERCISES });
});

router.get("/traditions", (_req, res) => {
  res.json({ ok: true, traditions: WISDOM_TRADITIONS });
});

router.get("/daily", (_req, res) => {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  
  const meditation = MEDITATION_PRACTICES[dayOfYear % MEDITATION_PRACTICES.length];
  const category = CONTEMPLATIVE_QUESTIONS[dayOfYear % CONTEMPLATIVE_QUESTIONS.length];
  const exercise = MINDFULNESS_EXERCISES[dayOfYear % MINDFULNESS_EXERCISES.length];
  const tradition = WISDOM_TRADITIONS[dayOfYear % WISDOM_TRADITIONS.length];
  const question = category.questions[dayOfYear % category.questions.length];
  
  res.json({
    ok: true,
    daily: {
      meditationPractice: meditation,
      contemplativeQuestion: question,
      mindfulnessExercise: exercise,
      wisdomTradition: tradition,
      morningPrompt: `Begin with "${meditation.practice}": ${meditation.instruction}`,
      eveningReflection: `Contemplate: "${question}"`
    }
  });
});


// Health check endpoint for admin daily tools monitoring
router.get("/", (req, res) => {
  res.json({ ok: true, module: "contemplative", status: "operational", timestamp: new Date().toISOString() });
});

export default router;
