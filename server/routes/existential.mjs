import express from "express";

const router = express.Router();

const EXISTENTIAL_THEMES = [
  {
    theme: "Mortality",
    description: "Awareness of death as the fundamental human condition.",
    existential_question: "How does knowing I will die shape how I should live?",
    insights: [
      "Death gives life urgency and meaning",
      "Authentic living requires accepting mortality",
      "Legacy is one response to finitude"
    ],
    practices: ["Memento mori meditation", "Write your eulogy", "Death contemplation"]
  },
  {
    theme: "Freedom",
    description: "The burden and gift of radical choice.",
    existential_question: "What do I do with my freedom?",
    insights: [
      "We are condemned to be free (Sartre)",
      "Freedom brings responsibility",
      "Bad faith is fleeing from freedom"
    ],
    practices: ["Examine self-imposed limitations", "Take responsibility for choices", "Embrace uncertainty"]
  },
  {
    theme: "Meaning",
    description: "The search for significance in an indifferent universe.",
    existential_question: "What makes my life meaningful?",
    insights: [
      "Meaning is created, not discovered",
      "Multiple sources of meaning exist",
      "Meaning can be found in suffering"
    ],
    practices: ["Values clarification", "Purpose journaling", "Meaning-making in adversity"]
  },
  {
    theme: "Isolation",
    description: "The unbridgeable gap between self and other.",
    existential_question: "How do I connect despite fundamental aloneness?",
    insights: [
      "We are ultimately alone in our experience",
      "Connection requires authentic self-revelation",
      "Solitude can be transformative"
    ],
    practices: ["Deep listening", "Authentic self-disclosure", "Contemplative solitude"]
  },
  {
    theme: "Authenticity",
    description: "Living according to one's own values rather than external expectations.",
    existential_question: "Am I living my own life or someone else's?",
    insights: [
      "Authenticity requires self-knowledge",
      "Social pressure toward conformity is constant",
      "Authenticity is a ongoing practice, not achievement"
    ],
    practices: ["Values inventory", "Question inherited beliefs", "Express true preferences"]
  },
  {
    theme: "Absurdity",
    description: "The conflict between human desire for meaning and the universe's silence.",
    existential_question: "How do I respond to life's inherent absurdity?",
    insights: [
      "Absurdity arises from meaning-seeking in meaningless universe",
      "One must imagine Sisyphus happy (Camus)",
      "Create meaning despite the absurd"
    ],
    practices: ["Embrace paradox", "Find joy in struggle", "Create without hope of reward"]
  }
];

const EXISTENTIAL_PHILOSOPHERS = [
  {
    philosopher: "Søren Kierkegaard",
    key_insight: "Truth is subjectivity—authentic existence requires passionate commitment.",
    core_concept: "Leap of Faith",
    question: "What would you commit to even without certainty?"
  },
  {
    philosopher: "Friedrich Nietzsche",
    key_insight: "Eternal recurrence—live as if you'd live the same life forever.",
    core_concept: "Will to Power / Amor Fati",
    question: "Would you choose to live this exact life again?"
  },
  {
    philosopher: "Martin Heidegger",
    key_insight: "Being-toward-death awakens authentic existence.",
    core_concept: "Dasein / Authentic Existence",
    question: "How does awareness of death change your priorities?"
  },
  {
    philosopher: "Jean-Paul Sartre",
    key_insight: "Existence precedes essence—we define ourselves through choices.",
    core_concept: "Radical Freedom / Bad Faith",
    question: "What are you choosing to be right now?"
  },
  {
    philosopher: "Albert Camus",
    key_insight: "Revolt, freedom, and passion as responses to the absurd.",
    core_concept: "The Absurd / Revolt",
    question: "How do you create meaning despite life's absurdity?"
  },
  {
    philosopher: "Simone de Beauvoir",
    key_insight: "Freedom is achieved through engagement with others.",
    core_concept: "Situated Freedom / Ethics of Ambiguity",
    question: "How does your freedom depend on the freedom of others?"
  },
  {
    philosopher: "Viktor Frankl",
    key_insight: "The last human freedom is choosing one's attitude.",
    core_concept: "Logotherapy / Will to Meaning",
    question: "What meaning can you find in your suffering?"
  }
];

const LIFE_QUESTIONS = [
  "If you knew you had one year to live, what would you prioritize?",
  "What would you attempt if you knew you could not fail?",
  "What truth are you avoiding?",
  "What would the best version of yourself do right now?",
  "What regret do you not want to have at the end of your life?",
  "If no one would ever know, what would you do differently?",
  "What are you defending that no longer serves you?",
  "What would you do if you weren't afraid?",
  "What legacy do you want to leave?",
  "What is the one thing you've always wanted to do but haven't?"
];

const MEANING_SOURCES = [
  { source: "Contribution", description: "Adding value to others' lives or the world." },
  { source: "Creation", description: "Bringing something new into existence." },
  { source: "Connection", description: "Deep relationships and love." },
  { source: "Growth", description: "Developing skills, knowledge, or character." },
  { source: "Experience", description: "Savoring beauty, joy, and aliveness." },
  { source: "Transcendence", description: "Connecting to something larger than self." },
  { source: "Understanding", description: "Seeking truth and wisdom." },
  { source: "Service", description: "Helping those in need." }
];

router.get("/themes", (_req, res) => {
  res.json({ ok: true, themes: EXISTENTIAL_THEMES });
});

router.get("/philosophers", (_req, res) => {
  res.json({ ok: true, philosophers: EXISTENTIAL_PHILOSOPHERS });
});

router.get("/questions", (_req, res) => {
  res.json({ ok: true, questions: LIFE_QUESTIONS });
});

router.get("/meaning", (_req, res) => {
  res.json({ ok: true, sources: MEANING_SOURCES });
});

router.get("/daily", (_req, res) => {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  
  const theme = EXISTENTIAL_THEMES[dayOfYear % EXISTENTIAL_THEMES.length];
  const philosopher = EXISTENTIAL_PHILOSOPHERS[dayOfYear % EXISTENTIAL_PHILOSOPHERS.length];
  const question = LIFE_QUESTIONS[dayOfYear % LIFE_QUESTIONS.length];
  const meaning = MEANING_SOURCES[dayOfYear % MEANING_SOURCES.length];
  
  res.json({
    ok: true,
    daily: {
      existentialTheme: theme,
      philosopher,
      lifeQuestion: question,
      meaningSource: meaning,
      contemplationPrompt: `Today, explore "${theme.theme}": ${theme.existential_question}`,
      philosopherWisdom: `${philosopher.philosopher} asks: "${philosopher.question}"`
    }
  });
});

export default router;
