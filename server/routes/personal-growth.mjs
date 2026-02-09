import express from "express";

const router = express.Router();

router.get("/self-improvement", (req, res) => {
  res.json({
    pillars: [
      {
        pillar: "Physical Vitality",
        areas: ["Exercise", "Nutrition", "Sleep", "Recovery"],
        keyPractices: [
          "30+ minutes movement daily",
          "Whole foods diet",
          "7-9 hours quality sleep",
          "Stress management and rest"
        ]
      },
      {
        pillar: "Mental Clarity",
        areas: ["Focus", "Learning", "Creativity", "Problem-solving"],
        keyPractices: [
          "Daily reading or learning",
          "Meditation practice",
          "Journaling for clarity",
          "Limiting information overload"
        ]
      },
      {
        pillar: "Emotional Intelligence",
        areas: ["Self-awareness", "Self-regulation", "Empathy", "Social skills"],
        keyPractices: [
          "Daily emotion check-ins",
          "Pause before reacting",
          "Active listening practice",
          "Expressing needs clearly"
        ]
      },
      {
        pillar: "Spiritual Connection",
        areas: ["Purpose", "Values", "Meaning", "Transcendence"],
        keyPractices: [
          "Define core values",
          "Connect to something larger",
          "Practice gratitude",
          "Serve others"
        ]
      },
      {
        pillar: "Relational Health",
        areas: ["Family", "Friends", "Community", "Mentorship"],
        keyPractices: [
          "Quality time with loved ones",
          "Nurture deep friendships",
          "Contribute to community",
          "Seek and offer mentorship"
        ]
      }
    ],
    frameworks: [
      {
        name: "Kaizen",
        principle: "Continuous improvement through small daily steps",
        application: "Make 1% improvements every day"
      },
      {
        name: "CANI",
        origin: "Tony Robbins",
        meaning: "Constant And Never-ending Improvement",
        application: "Commit to growth in all life areas"
      },
      {
        name: "Wheel of Life",
        areas: ["Career", "Finance", "Health", "Relationships", "Personal Growth", "Fun", "Physical Environment", "Contribution"],
        application: "Rate each area 1-10, focus on lowest areas"
      }
    ]
  });
});

router.get("/character-development", (req, res) => {
  res.json({
    virtues: {
      cardinalVirtues: [
        { virtue: "Prudence", description: "Practical wisdom, good judgment", practices: ["Reflect before acting", "Seek wise counsel", "Consider long-term consequences"] },
        { virtue: "Justice", description: "Giving each their due, fairness", practices: ["Keep promises", "Treat others fairly", "Stand up for what's right"] },
        { virtue: "Fortitude", description: "Courage, endurance, persistence", practices: ["Face fears directly", "Persist through difficulty", "Maintain convictions under pressure"] },
        { virtue: "Temperance", description: "Moderation, self-control, balance", practices: ["Practice delayed gratification", "Moderate pleasures", "Balance work and rest"] }
      ],
      additionalVirtues: [
        { virtue: "Honesty", description: "Truthfulness in word and deed" },
        { virtue: "Humility", description: "Accurate self-assessment, openness to learning" },
        { virtue: "Compassion", description: "Caring concern for others' suffering" },
        { virtue: "Gratitude", description: "Appreciation for what one has received" },
        { virtue: "Integrity", description: "Alignment of actions with values" },
        { virtue: "Patience", description: "Ability to wait calmly, endure difficulty" }
      ]
    },
    characterStrengths: {
      source: "VIA Character Strengths (Peterson & Seligman)",
      categories: [
        {
          category: "Wisdom",
          strengths: ["Creativity", "Curiosity", "Judgment", "Love of Learning", "Perspective"]
        },
        {
          category: "Courage",
          strengths: ["Bravery", "Perseverance", "Honesty", "Zest"]
        },
        {
          category: "Humanity",
          strengths: ["Love", "Kindness", "Social Intelligence"]
        },
        {
          category: "Justice",
          strengths: ["Teamwork", "Fairness", "Leadership"]
        },
        {
          category: "Temperance",
          strengths: ["Forgiveness", "Humility", "Prudence", "Self-Regulation"]
        },
        {
          category: "Transcendence",
          strengths: ["Appreciation of Beauty", "Gratitude", "Hope", "Humor", "Spirituality"]
        }
      ],
      application: "Identify your top 5 signature strengths and use them daily"
    }
  });
});

router.get("/growth-mindset", (req, res) => {
  res.json({
    framework: {
      origin: "Carol Dweck",
      fixedMindset: {
        beliefs: [
          "Intelligence is fixed and unchangeable",
          "Avoid challenges to prevent failure",
          "Effort is pointless if you're not naturally talented",
          "Criticism is personal attack",
          "Others' success threatens me"
        ],
        language: ["I can't do this", "I'm not smart enough", "This is too hard", "I give up"]
      },
      growthMindset: {
        beliefs: [
          "Intelligence can be developed through effort",
          "Challenges are opportunities to grow",
          "Effort is the path to mastery",
          "Criticism helps me improve",
          "Others' success inspires me"
        ],
        language: ["I can't do this yet", "What can I learn from this?", "This is challenging and interesting", "I'll try a different approach"]
      },
      shiftingPractices: [
        { from: "I'm not good at this", to: "What am I missing?" },
        { from: "I give up", to: "I'll use different strategies" },
        { from: "This is too hard", to: "This will take time and effort" },
        { from: "I made a mistake", to: "Mistakes help me learn" },
        { from: "I'll never be that smart", to: "I will learn how to do this" }
      ]
    },
    complementaryMindsets: [
      { mindset: "Abundance Mindset", belief: "There is enough for everyone", opposite: "Scarcity mindset" },
      { mindset: "Learner Mindset", belief: "Every situation teaches something", opposite: "Knower mindset" },
      { mindset: "Antifragile Mindset", belief: "I grow stronger from challenges", opposite: "Fragile mindset" },
      { mindset: "Creator Mindset", belief: "I create my circumstances", opposite: "Victim mindset" }
    ]
  });
});

router.get("/self-discipline", (req, res) => {
  res.json({
    framework: {
      definition: "The ability to control impulses, emotions, and behaviors to achieve long-term goals",
      pillars: [
        {
          pillar: "Clarity of Purpose",
          practices: ["Define clear, compelling goals", "Connect daily actions to larger vision", "Review goals regularly"]
        },
        {
          pillar: "Environment Design",
          practices: ["Remove temptations", "Add friction to bad habits", "Create supportive structures"]
        },
        {
          pillar: "Routine and Ritual",
          practices: ["Establish consistent daily routines", "Create start-of-day rituals", "Build keystone habits"]
        },
        {
          pillar: "Energy Management",
          practices: ["Protect sleep", "Exercise regularly", "Manage decision fatigue"]
        },
        {
          pillar: "Accountability",
          practices: ["Public commitments", "Tracking progress", "Accountability partners"]
        }
      ]
    },
    techniques: [
      {
        name: "Temptation Bundling",
        description: "Pair something you want with something you need to do",
        example: "Only listen to favorite podcast while exercising"
      },
      {
        name: "Implementation Intentions",
        description: "Pre-decide when and where you'll do specific behaviors",
        format: "When X happens, I will do Y"
      },
      {
        name: "Commitment Devices",
        description: "Lock yourself into future behavior",
        examples: ["Prepaying for classes", "Website blockers", "Social accountability"]
      },
      {
        name: "The 10-Minute Rule",
        description: "Commit to doing something for just 10 minutes",
        principle: "Starting is often the hardest part"
      }
    ],
    willpowerScience: {
      insight: "Willpower is like a muscle - it can be depleted but also strengthened",
      strategies: [
        "Make important decisions early in day",
        "Reduce number of daily decisions",
        "Build habits to reduce reliance on willpower",
        "Rest and recover to restore willpower"
      ]
    }
  });
});

router.get("/life-stages", (req, res) => {
  res.json({
    eriksonStages: [
      { stage: "Trust vs Mistrust", age: "0-1", virtue: "Hope", task: "Develop basic trust in caregivers" },
      { stage: "Autonomy vs Shame", age: "1-3", virtue: "Will", task: "Develop sense of personal control" },
      { stage: "Initiative vs Guilt", age: "3-6", virtue: "Purpose", task: "Begin asserting control and power" },
      { stage: "Industry vs Inferiority", age: "6-12", virtue: "Competence", task: "Develop sense of competence" },
      { stage: "Identity vs Confusion", age: "12-18", virtue: "Fidelity", task: "Develop sense of self" },
      { stage: "Intimacy vs Isolation", age: "18-40", virtue: "Love", task: "Form intimate relationships" },
      { stage: "Generativity vs Stagnation", age: "40-65", virtue: "Care", task: "Create and nurture things that outlast us" },
      { stage: "Integrity vs Despair", age: "65+", virtue: "Wisdom", task: "Reflect on life with sense of fulfillment" }
    ],
    seasonOfLife: {
      spring: { age: "0-25", focus: "Learning, exploration, identity formation" },
      summer: { age: "25-50", focus: "Achievement, building, contributing" },
      autumn: { age: "50-75", focus: "Harvesting, mentoring, legacy" },
      winter: { age: "75+", focus: "Wisdom, reflection, completion" }
    },
    transitions: [
      { transition: "Leaving Home", tasks: ["Develop independence", "Form adult identity", "Establish direction"] },
      { transition: "Entering Adult World", tasks: ["Build life structure", "Establish occupation", "Form relationships"] },
      { transition: "Midlife Transition", tasks: ["Reassess life structure", "Integrate neglected parts", "Find renewed meaning"] },
      { transition: "Late Adult Transition", tasks: ["Accept mortality", "Review life", "Prepare for end-of-life"] }
    ]
  });
});

router.get("/daily", (req, res) => {
  const practices = [
    "Identify one small improvement you can make today in any life area",
    "Practice one virtue intentionally today - choose courage, patience, or kindness",
    "Notice when you have a fixed mindset thought and reframe it to growth mindset",
    "Review your core values - is today's planned activity aligned with them?",
    "What character strength can you apply to today's biggest challenge?"
  ];
  res.json({
    practice: practices[Math.floor(Math.random() * practices.length)],
    theme: "Personal Growth"
  });
});


// Health check endpoint for admin daily tools monitoring
router.get("/", (req, res) => {
  res.json({ ok: true, module: "personal-growth", status: "operational", timestamp: new Date().toISOString() });
});

export default router;
