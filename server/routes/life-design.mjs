// server/routes/life-design.mjs
// Comprehensive life design and strategic living API

import express from "express";
const router = express.Router();

const LIFE_DOMAINS = [
  {
    id: "health",
    name: "Health & Vitality",
    description: "Physical energy, fitness, nutrition, sleep",
    questions: [
      "How is your energy level most days?",
      "What does optimal physical health look like for you?",
      "What habits support or undermine your vitality?"
    ],
    practices: ["Movement routine", "Sleep optimization", "Nutrition awareness", "Stress management"]
  },
  {
    id: "relationships",
    name: "Relationships",
    description: "Family, friends, romantic partnership, community",
    questions: [
      "Who are the most important people in your life?",
      "What kind of partner/friend/family member do you want to be?",
      "Where do your relationships need attention?"
    ],
    practices: ["Quality time", "Active listening", "Expressing appreciation", "Setting boundaries"]
  },
  {
    id: "work",
    name: "Work & Contribution",
    description: "Career, vocation, service, impact",
    questions: [
      "What work feels most meaningful to you?",
      "How do you want to contribute to the world?",
      "What would you do if money weren't a concern?"
    ],
    practices: ["Skill development", "Network building", "Value clarification", "Goal setting"]
  },
  {
    id: "wealth",
    name: "Wealth & Resources",
    description: "Financial freedom, abundance, stewardship",
    questions: [
      "What is your relationship with money?",
      "What does financial freedom mean to you?",
      "How do you want to use resources for good?"
    ],
    practices: ["Budgeting", "Investing", "Generosity", "Abundance mindset"]
  },
  {
    id: "growth",
    name: "Personal Growth",
    description: "Learning, development, becoming",
    questions: [
      "What are you currently learning?",
      "Who do you want to become?",
      "What edges are you growing?"
    ],
    practices: ["Reading", "Courses", "Coaching", "Deliberate practice"]
  },
  {
    id: "spirit",
    name: "Spirit & Meaning",
    description: "Purpose, transcendence, inner life",
    questions: [
      "What gives your life ultimate meaning?",
      "How do you connect with something greater?",
      "What does a rich inner life look like?"
    ],
    practices: ["Meditation", "Prayer", "Nature immersion", "Service"]
  }
];

const DESIGN_FRAMEWORKS = [
  {
    id: "ikigai",
    name: "Ikigai",
    origin: "Japan",
    description: "The intersection of passion, mission, vocation, and profession",
    components: [
      { name: "What you love", question: "What activities bring you joy?" },
      { name: "What you're good at", question: "What are your natural talents?" },
      { name: "What the world needs", question: "What problems can you solve?" },
      { name: "What you can be paid for", question: "What value can you offer?" }
    ],
    process: "Find the intersection of all four to discover your reason for being"
  },
  {
    id: "odyssey-planning",
    name: "Odyssey Planning",
    origin: "Stanford d.school",
    description: "Design multiple possible five-year life plans",
    components: [
      { name: "Plan A", description: "Your current path extended" },
      { name: "Plan B", description: "What you'd do if Plan A wasn't possible" },
      { name: "Plan C", description: "Your wild card life" }
    ],
    process: "Create dashboards for each plan rating resources, confidence, and coherence"
  },
  {
    id: "wheel-of-life",
    name: "Wheel of Life",
    origin: "Coaching tradition",
    description: "Assess satisfaction across life domains",
    components: LIFE_DOMAINS.map(d => ({ name: d.name, description: d.description })),
    process: "Rate each area 1-10, identify lowest scores, create action plans"
  },
  {
    id: "5am-club",
    name: "The 5AM Club Formula",
    origin: "Robin Sharma",
    description: "Victory hour morning routine",
    components: [
      { name: "Move (20 min)", description: "Exercise to prime your state" },
      { name: "Reflect (20 min)", description: "Meditate, journal, plan" },
      { name: "Grow (20 min)", description: "Learn something new" }
    ],
    process: "Wake at 5am, complete the 20/20/20 formula before the world wakes"
  }
];

const GOAL_SETTING_SYSTEMS = [
  {
    id: "okrs",
    name: "OKRs (Objectives & Key Results)",
    description: "Ambitious goals with measurable results",
    structure: {
      objective: "Qualitative, inspirational goal",
      keyResults: "3-5 measurable outcomes that indicate success"
    },
    example: {
      objective: "Become an exceptional public speaker",
      keyResults: [
        "Deliver 12 presentations to audiences of 50+",
        "Achieve average audience rating of 8+/10",
        "Complete professional speaking course"
      ]
    }
  },
  {
    id: "smart",
    name: "SMART Goals",
    description: "Specific, Measurable, Achievable, Relevant, Time-bound",
    structure: {
      specific: "What exactly will you accomplish?",
      measurable: "How will you know when it's done?",
      achievable: "Is it realistic with effort?",
      relevant: "Does it align with larger objectives?",
      timeBound: "When will it be complete?"
    },
    example: "I will lose 15 pounds by June 1st by exercising 4x/week and eating 2000 calories/day"
  },
  {
    id: "woop",
    name: "WOOP (Wish, Outcome, Obstacle, Plan)",
    description: "Mental contrasting for goal achievement",
    structure: {
      wish: "What do you want?",
      outcome: "What would achieving it feel like?",
      obstacle: "What internal obstacle might get in the way?",
      plan: "If [obstacle], then [action]"
    },
    example: {
      wish: "Exercise regularly",
      outcome: "Feel energized and confident",
      obstacle: "Too tired after work",
      plan: "If tired after work, then exercise for just 10 minutes"
    }
  }
];

const DECISION_MAKING = [
  {
    id: "regret-minimization",
    name: "Regret Minimization Framework",
    description: "Project yourself to age 80 and minimize regrets",
    creator: "Jeff Bezos",
    process: [
      "Imagine yourself at 80 years old",
      "Ask: 'Will I regret NOT doing this?'",
      "Minimize lifetime regrets, not short-term discomfort"
    ]
  },
  {
    id: "10-10-10",
    name: "10-10-10 Rule",
    description: "Consider impact across three time horizons",
    creator: "Suzy Welch",
    process: [
      "How will I feel about this in 10 minutes?",
      "How will I feel in 10 months?",
      "How will I feel in 10 years?"
    ]
  },
  {
    id: "reversibility",
    name: "Reversibility Analysis",
    description: "Distinguish one-way from two-way doors",
    creator: "Amazon",
    process: [
      "One-way doors: Irreversible - proceed carefully",
      "Two-way doors: Reversible - move fast, iterate",
      "Most decisions are two-way doors"
    ]
  }
];

router.get("/domains", (req, res) => {
  res.json({ success: true, data: LIFE_DOMAINS });
});

router.get("/frameworks", (req, res) => {
  res.json({ success: true, data: DESIGN_FRAMEWORKS });
});

router.get("/goal-systems", (req, res) => {
  res.json({ success: true, data: GOAL_SETTING_SYSTEMS });
});

router.get("/decision-making", (req, res) => {
  res.json({ success: true, data: DECISION_MAKING });
});

router.get("/all", (req, res) => {
  res.json({
    success: true,
    data: {
      lifeDomains: LIFE_DOMAINS,
      designFrameworks: DESIGN_FRAMEWORKS,
      goalSettingSystems: GOAL_SETTING_SYSTEMS,
      decisionMaking: DECISION_MAKING
    }
  });
});


// Health check endpoint for admin daily tools monitoring
router.get("/", (req, res) => {
  res.json({ ok: true, module: "life-design", status: "operational", timestamp: new Date().toISOString() });
});

export default router;
