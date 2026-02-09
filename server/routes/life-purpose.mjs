import express from "express";

const router = express.Router();

const IKIGAI_FRAMEWORK = {
  name: "Ikigai",
  origin: "Japanese concept meaning 'reason for being'",
  fourCircles: [
    {
      name: "What you love",
      questions: [
        "What activities make you lose track of time?",
        "What would you do even if you weren't paid?",
        "What did you love doing as a child?",
        "What topics do you find yourself constantly reading about?"
      ]
    },
    {
      name: "What you're good at",
      questions: [
        "What do people consistently ask for your help with?",
        "What skills have you developed over years?",
        "What comes naturally to you that others struggle with?",
        "What have you been recognized or praised for?"
      ]
    },
    {
      name: "What the world needs",
      questions: [
        "What problems do you see that frustrate you?",
        "What would you change about your community?",
        "What injustices or inefficiencies bother you?",
        "What do you wish existed that doesn't?"
      ]
    },
    {
      name: "What you can be paid for",
      questions: [
        "What skills are currently valued in the market?",
        "What would people pay you to do?",
        "What could you build a business or career around?",
        "What problems are people already paying to solve?"
      ]
    }
  ],
  intersections: [
    { areas: ["love", "good at"], result: "Passion", risk: "May not be financially viable" },
    { areas: ["good at", "paid for"], result: "Profession", risk: "May lack fulfillment" },
    { areas: ["paid for", "world needs"], result: "Vocation", risk: "May lack personal passion" },
    { areas: ["world needs", "love"], result: "Mission", risk: "May not leverage your strengths" }
  ],
  centerMessage: "At the intersection of all four lies your Ikigai - your reason for being"
};

const VALUES_DISCOVERY = {
  coreValuesList: [
    { value: "Authenticity", description: "Being true to yourself" },
    { value: "Adventure", description: "New experiences and challenges" },
    { value: "Balance", description: "Harmony between life areas" },
    { value: "Compassion", description: "Caring for others' suffering" },
    { value: "Courage", description: "Acting despite fear" },
    { value: "Creativity", description: "Expressing original ideas" },
    { value: "Excellence", description: "Highest quality in endeavors" },
    { value: "Family", description: "Close bonds with relatives" },
    { value: "Freedom", description: "Independence and autonomy" },
    { value: "Growth", description: "Continuous learning and development" },
    { value: "Health", description: "Physical and mental wellbeing" },
    { value: "Honesty", description: "Truthfulness in all dealings" },
    { value: "Impact", description: "Making a difference" },
    { value: "Justice", description: "Fairness and equality" },
    { value: "Knowledge", description: "Understanding and wisdom" },
    { value: "Leadership", description: "Guiding and inspiring others" },
    { value: "Love", description: "Deep connection and affection" },
    { value: "Loyalty", description: "Faithfulness to commitments" },
    { value: "Peace", description: "Inner calm and harmony" },
    { value: "Service", description: "Contributing to others" },
    { value: "Spirituality", description: "Connection to something greater" },
    { value: "Success", description: "Achievement of goals" },
    { value: "Wealth", description: "Financial abundance" },
    { value: "Wisdom", description: "Deep understanding of life" }
  ],
  discoveryExercises: [
    {
      name: "Peak Experiences",
      instruction: "Recall 3-5 moments when you felt most alive, fulfilled, or proud. What values were you honoring in those moments?"
    },
    {
      name: "Anger Indicator",
      instruction: "What makes you angry or frustrated? Often anger points to a value being violated."
    },
    {
      name: "Admiration Analysis",
      instruction: "Who do you admire most? What qualities in them do you wish you had more of?"
    },
    {
      name: "Deathbed Test",
      instruction: "At the end of your life, what would you regret not doing or being?"
    },
    {
      name: "Values Sort",
      instruction: "From the core values list, pick your top 10, then narrow to 5, then to 3. These are your core values."
    }
  ]
};

const MISSION_CRAFTING = {
  templates: [
    {
      name: "Simple Statement",
      format: "I exist to [action] for [who] so they can [outcome]",
      example: "I exist to teach emotional intelligence for young people so they can navigate life's challenges with resilience"
    },
    {
      name: "Hedgehog Concept",
      format: "At the intersection of [passion], [talent], and [value creation]",
      example: "At the intersection of teaching, systems thinking, and helping organizations become more human"
    },
    {
      name: "Legacy Statement",
      format: "I will be remembered as someone who [contribution] and made [impact] in [domain]",
      example: "I will be remembered as someone who democratized access to mental health tools and made healing possible for millions"
    }
  ],
  refinementQuestions: [
    "Does this excite you when you read it?",
    "Would you be proud to share this with others?",
    "Does it align with your core values?",
    "Is it big enough to inspire but specific enough to guide?",
    "Will it still be meaningful in 10 years?"
  ]
};

const PURPOSE_FRAMEWORKS = [
  {
    id: "eulogy-exercise",
    name: "Eulogy Exercise",
    description: "Write the eulogy you'd want delivered at your funeral",
    prompts: [
      "What do you want people to say about your character?",
      "What impact did you have on others?",
      "What will you be remembered for?",
      "What mattered most about how you lived?"
    ],
    insight: "The gap between your current life and your desired eulogy reveals your purpose work"
  },
  {
    id: "odyssey-planning",
    name: "Odyssey Planning",
    description: "Design three radically different 5-year life plans",
    plans: [
      { name: "Plan A", description: "Your current path optimized" },
      { name: "Plan B", description: "What you'd do if Plan A were impossible" },
      { name: "Plan C", description: "What you'd do if money and others' opinions didn't matter" }
    ],
    evaluation: [
      "Resources - do you have what you need?",
      "Likability - how excited are you?",
      "Confidence - can you pull it off?",
      "Coherence - does it fit who you are?"
    ],
    source: "Designing Your Life by Burnett & Evans"
  },
  {
    id: "hero-journey",
    name: "Your Hero's Journey",
    description: "Map your life as a hero's journey to find meaning in your struggles",
    stages: [
      "Ordinary World - your starting point",
      "Call to Adventure - the challenge that called you",
      "Refusal of the Call - your initial resistance",
      "Meeting the Mentor - who guided you",
      "Crossing the Threshold - committing to change",
      "Tests and Allies - challenges and helpers",
      "The Ordeal - your greatest trial",
      "The Reward - what you gained",
      "The Return - bringing gifts back to others"
    ],
    insight: "Your past struggles contain clues to your unique purpose"
  },
  {
    id: "zone-of-genius",
    name: "Zone of Genius",
    description: "Find where your unique talents create maximum value",
    zones: [
      { name: "Zone of Incompetence", description: "Things you're not good at - delegate" },
      { name: "Zone of Competence", description: "Things you're okay at - minimize" },
      { name: "Zone of Excellence", description: "Things you're great at but don't love - be careful" },
      { name: "Zone of Genius", description: "Unique talents + love = maximum impact and fulfillment" }
    ],
    discovery: [
      "What work is so natural you can't imagine charging for it?",
      "What do you do that produces disproportionate results?",
      "When do you feel most in flow and alive?"
    ],
    source: "The Big Leap by Gay Hendricks"
  }
];

const MEANING_SOURCES = {
  threePathsToMeaning: [
    {
      path: "Creative Values",
      description: "What you give to the world through work or deeds",
      examples: ["Creating art", "Building businesses", "Raising children", "Solving problems"]
    },
    {
      path: "Experiential Values",
      description: "What you take from the world through experiences",
      examples: ["Love", "Beauty", "Nature", "Art", "Music", "Connection"]
    },
    {
      path: "Attitudinal Values",
      description: "The stance you take toward unavoidable suffering",
      examples: ["Finding meaning in illness", "Transforming tragedy", "Choosing courage over despair"]
    }
  ],
  source: "Viktor Frankl's logotherapy",
  coreInsight: "Life never ceases to have meaning. Even suffering can become meaningful through how we respond to it."
};

router.get("/ikigai", (_req, res) => {
  res.json({
    framework: IKIGAI_FRAMEWORK,
    instructions: "Spend time with each circle's questions. Your ikigai emerges at the intersection of all four."
  });
});

router.get("/values-discovery", (_req, res) => {
  res.json({
    content: VALUES_DISCOVERY,
    insight: "Your values are already there - these exercises help you discover them, not invent them"
  });
});

router.get("/mission-crafting", (_req, res) => {
  res.json({
    content: MISSION_CRAFTING,
    tip: "Your mission statement should make you feel both excited and slightly nervous - that's the sweet spot"
  });
});

router.get("/purpose-frameworks", (_req, res) => {
  res.json({
    frameworks: PURPOSE_FRAMEWORKS,
    recommendation: "Start with the Eulogy Exercise - it cuts through surface desires to what truly matters"
  });
});

router.get("/meaning-sources", (_req, res) => {
  res.json({
    content: MEANING_SOURCES,
    practicalAdvice: [
      "If struggling to find meaning, look at what you can give, not just what you can get",
      "Meaning often hides in your suffering - what has your pain taught you?",
      "Service to others is one of the most reliable sources of meaning"
    ]
  });
});

router.get("/purpose-assessment", (_req, res) => {
  res.json({
    questions: [
      { id: 1, text: "I have a clear sense of what I want to do with my life", domain: "clarity" },
      { id: 2, text: "My daily activities align with my long-term purpose", domain: "alignment" },
      { id: 3, text: "I know what my core values are", domain: "values" },
      { id: 4, text: "My work contributes to something larger than myself", domain: "contribution" },
      { id: 5, text: "I feel that my life has meaning and significance", domain: "meaning" },
      { id: 6, text: "I can articulate my unique gifts and talents", domain: "gifts" },
      { id: 7, text: "I actively work toward my life goals", domain: "action" },
      { id: 8, text: "I wake up feeling motivated and purposeful", domain: "energy" }
    ],
    scoring: "Rate each 1-10. Average below 5 suggests purpose exploration needed. Above 7 suggests strong purpose alignment.",
    nextSteps: {
      lowScore: "Begin with Values Discovery and Ikigai exercises",
      mediumScore: "Refine your mission statement and identify alignment gaps",
      highScore: "Focus on deepening impact and mentoring others"
    }
  });
});


// Health check endpoint for admin daily tools monitoring
router.get("/", (req, res) => {
  res.json({ ok: true, module: "life-purpose", status: "operational", timestamp: new Date().toISOString() });
});

export default router;
