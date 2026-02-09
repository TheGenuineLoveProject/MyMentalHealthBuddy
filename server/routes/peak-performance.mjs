import express from "express";

const router = express.Router();

router.get("/flow-states", (req, res) => {
  res.json({
    framework: {
      origin: "Mihaly Csikszentmihalyi",
      definition: "Optimal state of consciousness where we perform and feel our best",
      characteristics: [
        "Complete absorption in activity",
        "Merging of action and awareness",
        "Loss of self-consciousness",
        "Sense of control",
        "Altered perception of time",
        "Intrinsic motivation",
        "Clear goals and immediate feedback"
      ],
      conditions: [
        { condition: "Challenge-skill balance", description: "Challenge slightly exceeds current skill level" },
        { condition: "Clear goals", description: "Know exactly what you're trying to achieve" },
        { condition: "Immediate feedback", description: "Know how well you're doing in real-time" },
        { condition: "Deep focus", description: "Eliminate distractions, single-task" }
      ]
    },
    triggers: {
      psychological: [
        { trigger: "Intensely focused attention", practice: "Remove distractions, time-box focus periods" },
        { trigger: "Clear goals", practice: "Define specific outcomes before starting" },
        { trigger: "Immediate feedback", practice: "Create feedback loops" },
        { trigger: "Challenge/skill ratio", practice: "Stretch 4% beyond comfort zone" }
      ],
      environmental: [
        { trigger: "High consequences", practice: "Add stakes to activities" },
        { trigger: "Rich environment", practice: "Novelty, complexity, unpredictability" },
        { trigger: "Deep embodiment", practice: "Physical engagement enhances mental flow" }
      ],
      social: [
        { trigger: "Serious concentration", practice: "Everyone fully engaged" },
        { trigger: "Shared clear goals", practice: "Unified direction" },
        { trigger: "Good communication", practice: "Constant feedback loop" },
        { trigger: "Equal participation", practice: "Everyone contributes" },
        { trigger: "Risk", practice: "Failure has consequences" },
        { trigger: "Familiarity", practice: "Common language, shared knowledge" },
        { trigger: "Blending egos", practice: "Group over individual" },
        { trigger: "Sense of control", practice: "Autonomy and choice" },
        { trigger: "Close listening", practice: "Full attention to others" },
        { trigger: "Always say yes", practice: "Build on ideas" }
      ],
      creative: [
        { trigger: "Pattern recognition", practice: "Connect disparate ideas" },
        { trigger: "Risk taking", practice: "Pursue novel approaches" }
      ]
    },
    flowCycle: [
      { phase: "Struggle", description: "Loading phase - information gathering, frustration normal" },
      { phase: "Release", description: "Let go, take your mind off the problem" },
      { phase: "Flow", description: "Peak performance state" },
      { phase: "Recovery", description: "Consolidation and rest" }
    ]
  });
});

router.get("/mental-models", (req, res) => {
  res.json({
    categories: [
      {
        category: "Decision Making",
        models: [
          { name: "Second-Order Thinking", description: "Consider consequences of consequences" },
          { name: "Inversion", description: "Solve problems by thinking backward" },
          { name: "Occam's Razor", description: "Simplest explanation is often best" },
          { name: "Hanlon's Razor", description: "Assume ignorance before malice" },
          { name: "Regret Minimization", description: "Choose based on future regret avoidance" }
        ]
      },
      {
        category: "Systems Thinking",
        models: [
          { name: "Feedback Loops", description: "Outputs become inputs that reinforce or balance" },
          { name: "Bottlenecks", description: "System limited by narrowest constraint" },
          { name: "Emergence", description: "Whole is greater than sum of parts" },
          { name: "Leverage Points", description: "Small changes with big effects" },
          { name: "Pareto Principle", description: "80% of results from 20% of causes" }
        ]
      },
      {
        category: "Problem Solving",
        models: [
          { name: "First Principles", description: "Break down to fundamental truths and rebuild" },
          { name: "Abstraction Laddering", description: "Move up for 'why', down for 'how'" },
          { name: "Reframing", description: "Change the problem definition" },
          { name: "Working Backward", description: "Start from desired end state" }
        ]
      },
      {
        category: "Learning",
        models: [
          { name: "Circle of Competence", description: "Know and stay within your expertise" },
          { name: "Dunning-Kruger", description: "Beginners overestimate, experts underestimate" },
          { name: "Spacing Effect", description: "Distributed practice beats massed practice" },
          { name: "Deliberate Practice", description: "Focused work at edge of ability" }
        ]
      }
    ]
  });
});

router.get("/goal-systems", (req, res) => {
  res.json({
    frameworks: [
      {
        name: "SMART Goals",
        components: [
          { letter: "S", meaning: "Specific", question: "What exactly will you accomplish?" },
          { letter: "M", meaning: "Measurable", question: "How will you know when it's done?" },
          { letter: "A", meaning: "Achievable", question: "Is it realistic with effort?" },
          { letter: "R", meaning: "Relevant", question: "Does it align with broader goals?" },
          { letter: "T", meaning: "Time-bound", question: "When will you achieve it?" }
        ]
      },
      {
        name: "OKRs (Objectives and Key Results)",
        origin: "Andy Grove, Intel",
        structure: {
          objective: "Qualitative, inspirational, time-bound goal",
          keyResults: "3-5 measurable outcomes that indicate objective completion"
        },
        example: {
          objective: "Become a more effective communicator",
          keyResults: [
            "Give 3 presentations with positive feedback",
            "Complete advanced writing course",
            "Have difficult conversation successfully with 2 colleagues"
          ]
        }
      },
      {
        name: "12-Week Year",
        origin: "Brian Moran",
        principle: "Treat 12 weeks as a year to increase urgency",
        components: [
          "Define 1-3 goals for the 12 weeks",
          "Break into weekly milestones",
          "Plan and review weekly",
          "Score execution, not just results"
        ]
      },
      {
        name: "Implementation Intentions",
        origin: "Peter Gollwitzer",
        format: "When [situation], I will [behavior]",
        examples: [
          "When I wake up, I will meditate for 10 minutes",
          "When I feel stressed, I will take 3 deep breaths",
          "When I finish dinner, I will review my daily goals"
        ],
        effectiveness: "Doubles to triples success rate of goals"
      }
    ],
    processVsOutcome: {
      outcomeGoals: "Focus on result you want to achieve",
      processGoals: "Focus on actions you'll take consistently",
      recommendation: "Set outcome goals for direction, process goals for daily action"
    }
  });
});

router.get("/energy-management", (req, res) => {
  res.json({
    framework: {
      name: "Energy Management (Tony Schwartz)",
      principle: "Manage energy, not just time",
      dimensions: [
        {
          dimension: "Physical",
          fuels: ["Sleep", "Nutrition", "Exercise", "Rest"],
          practices: [
            "7-9 hours quality sleep",
            "Eat for sustained energy, not spikes",
            "Move body for 30+ minutes daily",
            "Take breaks every 90 minutes"
          ]
        },
        {
          dimension: "Emotional",
          fuels: ["Positive emotions", "Self-confidence", "Self-control", "Empathy"],
          practices: [
            "Practice gratitude daily",
            "Savor positive experiences",
            "Respond vs react to challenges",
            "Connect with others meaningfully"
          ]
        },
        {
          dimension: "Mental",
          fuels: ["Focus", "Realistic optimism", "Time management", "Creativity"],
          practices: [
            "Single-task on important work",
            "Reduce interruptions and distractions",
            "Take mental breaks for renewal",
            "Engage in learning and growth"
          ]
        },
        {
          dimension: "Spiritual",
          fuels: ["Purpose", "Meaning", "Values alignment", "Commitment"],
          practices: [
            "Connect work to larger purpose",
            "Live by core values",
            "Allocate time to what matters most",
            "Contribute to something beyond self"
          ]
        }
      ]
    },
    ultradian: {
      name: "Ultradian Rhythms",
      description: "90-120 minute performance cycles throughout day",
      application: [
        "Work in 90-minute focused blocks",
        "Take 15-20 minute renewal breaks",
        "Align demanding work with peak energy",
        "Schedule creative work when fresh"
      ]
    },
    recovery: {
      types: [
        { type: "Micro", duration: "Minutes", examples: ["Deep breaths", "Stretch", "Walk"] },
        { type: "Meso", duration: "Hours", examples: ["Lunch break", "Nap", "Exercise"] },
        { type: "Macro", duration: "Days", examples: ["Weekends off", "Vacations", "Sabbaticals"] }
      ]
    }
  });
});

router.get("/habits", (req, res) => {
  res.json({
    frameworks: [
      {
        name: "Habit Loop (Charles Duhigg)",
        components: [
          { component: "Cue", description: "Trigger that initiates the behavior" },
          { component: "Routine", description: "The behavior itself" },
          { component: "Reward", description: "Benefit that reinforces the habit" }
        ],
        changing: "Keep cue and reward, change routine"
      },
      {
        name: "Four Laws of Behavior Change (James Clear)",
        laws: [
          { law: "Make it obvious", tactics: ["Implementation intention", "Habit stacking", "Environment design"] },
          { law: "Make it attractive", tactics: ["Temptation bundling", "Join culture where behavior is norm", "Create motivation ritual"] },
          { law: "Make it easy", tactics: ["Reduce friction", "Two-minute rule", "Automate"] },
          { law: "Make it satisfying", tactics: ["Immediate reward", "Track progress", "Never miss twice"] }
        ],
        inversion: "To break bad habits, invert the laws: make it invisible, unattractive, difficult, unsatisfying"
      },
      {
        name: "Tiny Habits (BJ Fogg)",
        components: [
          "Anchor: After I [current habit]",
          "Tiny Behavior: I will [new tiny habit]",
          "Celebration: I will feel [positive emotion]"
        ],
        principle: "Start incredibly small, scale up after consistency"
      }
    ],
    keystoneHabits: {
      definition: "Habits that trigger positive cascades in other areas",
      examples: [
        { habit: "Exercise", cascades: ["Better eating", "More energy", "Improved mood", "Better sleep"] },
        { habit: "Making bed", cascades: ["Sense of accomplishment", "Tidier room", "Better sleep hygiene"] },
        { habit: "Planning tomorrow", cascades: ["Better prioritization", "Less stress", "More productivity"] }
      ]
    }
  });
});

router.get("/productivity", (req, res) => {
  res.json({
    systems: [
      {
        name: "Getting Things Done (GTD)",
        origin: "David Allen",
        steps: [
          { step: "Capture", action: "Collect everything that has your attention" },
          { step: "Clarify", action: "Process what each item means and what to do" },
          { step: "Organize", action: "Put items in appropriate lists/calendars" },
          { step: "Reflect", action: "Review regularly to stay current" },
          { step: "Engage", action: "Take action with confidence" }
        ],
        twoMinuteRule: "If it takes less than 2 minutes, do it now"
      },
      {
        name: "Time Blocking",
        description: "Assign specific time blocks to specific tasks",
        variations: [
          { name: "Task batching", description: "Group similar tasks together" },
          { name: "Day theming", description: "Dedicate days to categories of work" },
          { name: "Time boxing", description: "Fixed time limits for tasks" }
        ]
      },
      {
        name: "Eat the Frog",
        origin: "Brian Tracy",
        principle: "Do your most important/difficult task first thing",
        benefits: ["Builds momentum", "Reduces procrastination", "Ensures priorities done"]
      },
      {
        name: "Eisenhower Matrix",
        quadrants: [
          { q: 1, urgent: true, important: true, action: "Do first" },
          { q: 2, urgent: false, important: true, action: "Schedule" },
          { q: 3, urgent: true, important: false, action: "Delegate" },
          { q: 4, urgent: false, important: false, action: "Eliminate" }
        ]
      }
    ],
    focusTechniques: [
      {
        name: "Pomodoro Technique",
        steps: ["Work 25 minutes", "Break 5 minutes", "After 4 pomodoros, break 15-30 minutes"]
      },
      {
        name: "Deep Work",
        origin: "Cal Newport",
        principles: [
          "Work deeply in uninterrupted blocks",
          "Embrace boredom (train focus)",
          "Quit social media (or use intentionally)",
          "Drain the shallows (limit low-value work)"
        ]
      }
    ]
  });
});

router.get("/daily", (req, res) => {
  const practices = [
    "Identify your one most important task for today and protect time to work on it first",
    "Set a 90-minute focus block with no distractions for your most challenging work",
    "Before a challenging task, consciously set a clear goal and intention",
    "Track your energy levels throughout the day and notice your peak performance windows",
    "Review your habits - is there one tiny improvement you could make today?"
  ];
  res.json({
    practice: practices[Math.floor(Math.random() * practices.length)],
    theme: "Peak Performance"
  });
});


// Health check endpoint for admin daily tools monitoring
router.get("/", (req, res) => {
  res.json({ ok: true, module: "peak-performance", status: "operational", timestamp: new Date().toISOString() });
});

export default router;
