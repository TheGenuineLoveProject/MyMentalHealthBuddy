import express from "express";

const router = express.Router();

const PATTERN_RECOGNITION = [
  {
    pattern: "Cyclical Recurrence",
    description: "Recognizing recurring themes across time, cultures, and domains.",
    application: "History, personal development, organizational change",
    question: "What patterns keep repeating in this situation?"
  },
  {
    pattern: "Polarity Dynamics",
    description: "Understanding how opposites create creative tension and balance.",
    application: "Decision-making, conflict resolution, strategic planning",
    question: "What opposing forces are at play here?"
  },
  {
    pattern: "Emergence Properties",
    description: "Seeing how complex behaviors arise from simple interactions.",
    application: "Systems thinking, innovation, social dynamics",
    question: "What new properties emerge from these interactions?"
  },
  {
    pattern: "Threshold Effects",
    description: "Identifying tipping points where gradual change becomes transformation.",
    application: "Change management, habit formation, social movements",
    question: "What threshold might trigger a phase transition?"
  },
  {
    pattern: "Nested Systems",
    description: "Perceiving how systems contain and are contained by other systems.",
    application: "Organizational design, ecology, personal identity",
    question: "What larger system contains this, and what smaller systems compose it?"
  },
  {
    pattern: "Feedback Amplification",
    description: "Tracking how small signals can be amplified or dampened.",
    application: "Communication, learning, market dynamics",
    question: "How might this signal be amplified or suppressed?"
  }
];

const INSIGHT_EXTRACTION = [
  {
    method: "Cross-Domain Mapping",
    description: "Transfer insights from one field to illuminate another.",
    steps: ["Identify core principle in source domain", "Abstract to general form", "Apply to target domain", "Adapt for context"],
    example: "Applying evolutionary biology principles to business strategy"
  },
  {
    method: "Paradox Resolution",
    description: "Find deeper truth that reconciles apparent contradictions.",
    steps: ["Identify the paradox clearly", "Examine assumptions underlying each side", "Seek higher-level synthesis", "Test integrated understanding"],
    example: "Resolving 'change vs. stability' into 'dynamic equilibrium'"
  },
  {
    method: "Edge Case Analysis",
    description: "Examine extreme cases to reveal hidden principles.",
    steps: ["Push parameters to extremes", "Observe behavior at limits", "Extract boundary conditions", "Infer underlying structure"],
    example: "What happens when resources are unlimited? Zero?"
  },
  {
    method: "Historical Triangulation",
    description: "Compare similar situations across different eras and cultures.",
    steps: ["Identify analogous historical situations", "Note commonalities and differences", "Extract timeless principles", "Apply to present context"],
    example: "Comparing technological transitions across centuries"
  },
  {
    method: "First Principles Decomposition",
    description: "Break complex phenomena into fundamental truths.",
    steps: ["Identify assumptions", "Question each assumption", "Reduce to irreducible facts", "Rebuild understanding from basics"],
    example: "What do we know to be absolutely true about this?"
  }
];

const WISDOM_THEMES = [
  {
    theme: "Impermanence",
    description: "All phenomena arise, persist, and pass away.",
    traditions: ["Buddhism", "Stoicism", "Heraclitean philosophy"],
    practical_wisdom: "Hold lightly; adapt continuously; appreciate the present."
  },
  {
    theme: "Interconnection",
    description: "All things exist in relationship; nothing exists independently.",
    traditions: ["Systems thinking", "Indigenous wisdom", "Ecology"],
    practical_wisdom: "Consider ripple effects; nurture relationships; think holistically."
  },
  {
    theme: "Balance",
    description: "Extremes tend toward their opposites; middle paths often prove wisest.",
    traditions: ["Taoism", "Aristotelian ethics", "Ayurveda"],
    practical_wisdom: "Avoid extremes; seek dynamic equilibrium; practice moderation."
  },
  {
    theme: "Growth Through Adversity",
    description: "Challenges and suffering can catalyze profound development.",
    traditions: ["Stoicism", "Existentialism", "Trauma-informed psychology"],
    practical_wisdom: "Reframe obstacles as teachers; build antifragility; find meaning in difficulty."
  },
  {
    theme: "Self-Knowledge",
    description: "Understanding oneself is foundational to wisdom.",
    traditions: ["Socratic philosophy", "Depth psychology", "Contemplative traditions"],
    practical_wisdom: "Examine assumptions; acknowledge shadows; cultivate self-awareness."
  },
  {
    theme: "Service",
    description: "Genuine fulfillment often comes through contribution to others.",
    traditions: ["Karma yoga", "Servant leadership", "Effective altruism"],
    practical_wisdom: "Expand circle of concern; give without attachment; find purpose in helping."
  },
  {
    theme: "Present-Moment Awareness",
    description: "Reality exists only in the present; past and future are mental constructs.",
    traditions: ["Mindfulness", "Phenomenology", "Zen Buddhism"],
    practical_wisdom: "Practice presence; reduce rumination; engage fully with now."
  },
  {
    theme: "Acceptance",
    description: "Peace comes from accepting what is before trying to change it.",
    traditions: ["Stoicism", "ACT therapy", "Serenity traditions"],
    practical_wisdom: "Distinguish controllable from uncontrollable; release resistance; work with reality."
  }
];

const INTEGRATION_PRACTICES = [
  {
    practice: "Wisdom Journaling",
    description: "Daily reflection on insights and their application.",
    prompts: ["What wisdom emerged today?", "How did I apply past insights?", "What remains unintegrated?"]
  },
  {
    practice: "Teaching to Learn",
    description: "Solidify understanding by explaining to others.",
    method: "Share insights with someone; their questions reveal your gaps."
  },
  {
    practice: "Embodiment Practice",
    description: "Translate intellectual understanding into lived experience.",
    method: "Choose one insight; design a daily micro-practice to embody it."
  },
  {
    practice: "Contradiction Dialogue",
    description: "Actively engage with perspectives that challenge your views.",
    method: "Seek out opposing views; steelman them; find partial truths."
  },
  {
    practice: "Synthesis Meditation",
    description: "Contemplative integration of diverse learnings.",
    method: "Hold multiple insights in awareness; allow connections to emerge organically."
  }
];

router.get("/patterns", (_req, res) => {
  res.json({ ok: true, patterns: PATTERN_RECOGNITION });
});

router.get("/extraction", (_req, res) => {
  res.json({ ok: true, methods: INSIGHT_EXTRACTION });
});

router.get("/themes", (_req, res) => {
  res.json({ ok: true, themes: WISDOM_THEMES });
});

router.get("/integration", (_req, res) => {
  res.json({ ok: true, practices: INTEGRATION_PRACTICES });
});

router.get("/daily", (_req, res) => {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  
  const pattern = PATTERN_RECOGNITION[dayOfYear % PATTERN_RECOGNITION.length];
  const extraction = INSIGHT_EXTRACTION[dayOfYear % INSIGHT_EXTRACTION.length];
  const theme = WISDOM_THEMES[dayOfYear % WISDOM_THEMES.length];
  const integration = INTEGRATION_PRACTICES[dayOfYear % INTEGRATION_PRACTICES.length];
  
  res.json({
    ok: true,
    daily: {
      patternFocus: pattern,
      extractionMethod: extraction,
      wisdomTheme: theme,
      integrationPractice: integration,
      synthesisPrompt: `Today, look for the "${pattern.pattern}" pattern: ${pattern.question}`,
      themeReflection: `Contemplate "${theme.theme}": ${theme.practical_wisdom}`
    }
  });
});

export default router;
