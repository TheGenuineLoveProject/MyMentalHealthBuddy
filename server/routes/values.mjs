import express from "express";

const router = express.Router();

const CORE_VALUES = [
  { value: "Authenticity", description: "Being true to yourself in all circumstances.", question: "Am I being genuine right now?" },
  { value: "Growth", description: "Continuous learning and self-improvement.", question: "How am I growing today?" },
  { value: "Connection", description: "Deep, meaningful relationships with others.", question: "Am I truly present with others?" },
  { value: "Service", description: "Contributing to others' well-being.", question: "How am I helping others?" },
  { value: "Creativity", description: "Expressing unique ideas and making things.", question: "What am I creating?" },
  { value: "Freedom", description: "Independence and self-determination.", question: "Am I making free choices?" },
  { value: "Wisdom", description: "Deep understanding and good judgment.", question: "What wisdom am I cultivating?" },
  { value: "Courage", description: "Acting despite fear.", question: "What am I afraid to do that matters?" },
  { value: "Compassion", description: "Caring for the suffering of self and others.", question: "How am I responding to suffering?" },
  { value: "Justice", description: "Fairness and standing against wrong.", question: "Am I acting with integrity?" },
  { value: "Beauty", description: "Appreciation of aesthetics and art.", question: "What beauty am I noticing?" },
  { value: "Adventure", description: "New experiences and exploration.", question: "What adventure awaits?" },
  { value: "Peace", description: "Inner calm and harmony.", question: "Am I at peace within?" },
  { value: "Excellence", description: "Striving for high quality in endeavors.", question: "Am I doing my best?" },
  { value: "Love", description: "Deep affection and care.", question: "Am I leading with love?" }
];

const VALUES_EXERCISES = [
  {
    exercise: "Eulogy Values",
    description: "What would you want said about you at your funeral?",
    prompt: "Write the eulogy you'd want someone to give. What values emerge?"
  },
  {
    exercise: "Peak Experience",
    description: "Recall a moment when you felt fully alive.",
    prompt: "What values were you honoring in that moment?"
  },
  {
    exercise: "Anger Reveals Values",
    description: "What makes you angry points to what you value.",
    prompt: "What injustice or violation makes you most upset? What value is being threatened?"
  },
  {
    exercise: "Role Models",
    description: "People you admire embody values you care about.",
    prompt: "Who do you most admire? What qualities do they have that you value?"
  },
  {
    exercise: "Desert Island",
    description: "If you could only keep three values, which would they be?",
    prompt: "Force yourself to choose your top three non-negotiable values."
  },
  {
    exercise: "Value-Action Gap",
    description: "Notice where behavior doesn't align with stated values.",
    prompt: "Where is there a gap between what you say you value and how you act?"
  }
];

const PURPOSE_FRAMEWORKS = [
  {
    framework: "Ikigai",
    elements: ["What you love", "What you're good at", "What the world needs", "What you can be paid for"],
    intersection: "The sweet spot where all four elements overlap.",
    reflection: "Where do these four circles intersect for you?"
  },
  {
    framework: "Hedgehog Concept",
    origin: "Jim Collins",
    elements: ["What you're passionate about", "What you can be best at", "What drives your economic engine"],
    reflection: "What could you be uniquely excellent at?"
  },
  {
    framework: "Golden Circle",
    origin: "Simon Sinek",
    elements: ["Why (purpose)", "How (process)", "What (product)"],
    reflection: "What is your WHY?"
  },
  {
    framework: "Life Domains",
    domains: ["Health", "Relationships", "Work", "Play", "Personal Growth", "Spirituality", "Environment"],
    reflection: "How aligned are you in each domain with your values?"
  }
];

const MEANING_MAKERS = [
  { source: "Creation", description: "Making something valuable.", examples: ["Art", "Business", "Ideas", "Children"] },
  { source: "Experience", description: "Encountering beauty, truth, or love.", examples: ["Nature", "Art", "Relationships", "Flow states"] },
  { source: "Attitude", description: "Choosing one's stance toward suffering.", examples: ["Courage in adversity", "Finding growth in pain", "Choosing hope"] },
  { source: "Contribution", description: "Giving to something beyond yourself.", examples: ["Service", "Mentoring", "Legacy", "Community"] },
  { source: "Belonging", description: "Being part of something larger.", examples: ["Family", "Community", "Movement", "Tradition"] }
];

router.get("/core", (_req, res) => {
  res.json({ ok: true, values: CORE_VALUES });
});

router.get("/exercises", (_req, res) => {
  res.json({ ok: true, exercises: VALUES_EXERCISES });
});

router.get("/purpose", (_req, res) => {
  res.json({ ok: true, frameworks: PURPOSE_FRAMEWORKS });
});

router.get("/meaning", (_req, res) => {
  res.json({ ok: true, sources: MEANING_MAKERS });
});

router.get("/daily", (_req, res) => {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  
  const value = CORE_VALUES[dayOfYear % CORE_VALUES.length];
  const exercise = VALUES_EXERCISES[dayOfYear % VALUES_EXERCISES.length];
  const meaning = MEANING_MAKERS[dayOfYear % MEANING_MAKERS.length];
  
  res.json({
    ok: true,
    daily: {
      valueOfTheDay: value,
      valuesExercise: exercise,
      meaningSource: meaning,
      reflectionPrompt: `Today's value is "${value.value}": ${value.question}`,
      practicalExercise: `Try "${exercise.exercise}": ${exercise.prompt}`
    }
  });
});


// Health check endpoint for admin daily tools monitoring
router.get("/", (req, res) => {
  res.json({ ok: true, module: "values", status: "operational", timestamp: new Date().toISOString() });
});

export default router;
