import { Router } from "express";

const router = Router();

const PEAK_PERFORMANCE = [
  {
    id: "flow-state",
    name: "Flow State Activation",
    category: "Performance",
    description: "Systematic approach to entering and maintaining flow",
    triggers: [
      { trigger: "Clear Goals", description: "Know exactly what you're trying to achieve" },
      { trigger: "Immediate Feedback", description: "Know if you're succeeding moment to moment" },
      { trigger: "Challenge-Skill Balance", description: "Task slightly exceeds current ability (4%)" },
      { trigger: "Complete Concentration", description: "Single-pointed attention on the task" },
      { trigger: "Sense of Control", description: "Feel capable of handling challenges" }
    ],
    protocol: [
      "Choose task with clear outcome",
      "Remove all distractions (phone, notifications)",
      "Set timer for 90-120 minute block",
      "Begin with 5 minutes of focused breathing",
      "Enter task with full presence",
      "Notice flow emerging around 15-20 minutes",
      "Ride the wave until natural completion",
      "Rest and integrate after"
    ],
    blockers: ["Multitasking", "Interruptions", "Perfectionism", "Anxiety", "Boredom"]
  },
  {
    id: "ultradian-rhythm",
    name: "Ultradian Performance Cycles",
    category: "Energy Management",
    description: "Work with 90-minute biological rhythms for sustained excellence",
    science: "Brain oscillates between high and low alertness every 90-120 minutes",
    protocol: [
      "Plan work in 90-minute blocks",
      "Take 20-minute breaks between blocks",
      "Do 3-4 blocks maximum per day for deep work",
      "Use breaks for movement, nature, or rest",
      "Track your peak performance windows",
      "Schedule demanding work during peaks"
    ]
  },
  {
    id: "pre-performance-routine",
    name: "Elite Pre-Performance Routine",
    category: "Preparation",
    description: "Consistent ritual before high-stakes moments",
    components: [
      { phase: "Physical", actions: ["Movement/stretch", "Power posing", "Deep breathing"] },
      { phase: "Mental", actions: ["Visualization of success", "Affirmation recitation", "Focus cue word"] },
      { phase: "Emotional", actions: ["Gratitude moment", "Connect to purpose", "Generate optimal arousal"] },
      { phase: "Environmental", actions: ["Remove distractions", "Prepare tools", "Create sacred space"] }
    ]
  }
];

const HABIT_MASTERY = [
  {
    id: "habit-loop",
    name: "Habit Loop Engineering",
    description: "Understand and redesign behavioral patterns",
    components: [
      { element: "Cue", description: "Trigger that initiates behavior", examples: ["Time", "Location", "Emotion", "Other people", "Preceding action"] },
      { element: "Craving", description: "Motivational force behind habit", examples: ["Relief from discomfort", "Pleasure seeking", "Identity expression"] },
      { element: "Response", description: "The actual behavior/habit", examples: ["The action you take"] },
      { element: "Reward", description: "Satisfaction that reinforces habit", examples: ["Dopamine release", "Sense of accomplishment", "Social approval"] }
    ],
    redesignProcess: [
      "Identify the routine you want to change",
      "Experiment with different rewards",
      "Isolate the cue (time, place, emotion, people, preceding action)",
      "Have a plan: When [CUE], I will [NEW ROUTINE] because [REWARD]"
    ]
  },
  {
    id: "identity-habits",
    name: "Identity-Based Habit Formation",
    description: "Change behavior by changing who you believe you are",
    levels: [
      { level: 1, name: "Outcomes", description: "What you get (results)", example: "I want to lose 20 pounds" },
      { level: 2, name: "Processes", description: "What you do (habits)", example: "I go to the gym 4x/week" },
      { level: 3, name: "Identity", description: "What you believe (deepest)", example: "I am a fit person" }
    ],
    protocol: [
      "Decide who you want to become",
      "Prove it with small wins",
      "Each action is a vote for your identity",
      "Ask: 'What would a [desired identity] do?'"
    ]
  },
  {
    id: "habit-stacking",
    name: "Advanced Habit Stacking",
    description: "Chain new behaviors to existing routines",
    formula: "After I [CURRENT HABIT], I will [NEW HABIT]",
    examples: [
      "After I pour my morning coffee, I will meditate for 2 minutes",
      "After I sit down at my desk, I will write my top 3 priorities",
      "After I close my laptop at night, I will journal for 5 minutes",
      "After I brush my teeth, I will do 10 pushups"
    ],
    advanced: [
      "Create morning and evening stack routines",
      "Use temptation bundling (pair want with need)",
      "Add implementation intentions (when, where, how)"
    ]
  },
  {
    id: "environment-design",
    name: "Environment Design Mastery",
    description: "Make good habits inevitable and bad habits impossible",
    principles: [
      { principle: "Visibility", good: "Make cues obvious", bad: "Hide triggers" },
      { principle: "Accessibility", good: "Reduce friction for good", bad: "Add friction for bad" },
      { principle: "Default", good: "Make excellence the default", bad: "Require effort for vice" }
    ],
    examples: [
      "Put phone in another room while working",
      "Lay out gym clothes the night before",
      "Keep healthy snacks at eye level",
      "Delete social media apps from phone",
      "Use website blockers during deep work"
    ]
  }
];

const DISCIPLINE_SYSTEMS = [
  {
    id: "morning-protocol",
    name: "Elite Morning Protocol",
    duration: "60-90 min",
    phases: [
      { time: "0:00", action: "Wake without snooze", purpose: "Honor commitment to self" },
      { time: "0:05", action: "Hydrate + cold exposure", purpose: "Activate nervous system" },
      { time: "0:15", action: "Movement (yoga/exercise)", purpose: "Energize body" },
      { time: "0:35", action: "Meditation", purpose: "Center mind" },
      { time: "0:50", action: "Journaling/reflection", purpose: "Set intention" },
      { time: "1:00", action: "Learning (reading/course)", purpose: "Feed mind" },
      { time: "1:15", action: "Priority planning", purpose: "Align action with goals" }
    ]
  },
  {
    id: "evening-protocol",
    name: "Elite Evening Protocol",
    duration: "45-60 min",
    phases: [
      { time: "-1:00", action: "Digital sunset", purpose: "Protect sleep" },
      { time: "-0:45", action: "Evening review", purpose: "Capture wins and lessons" },
      { time: "-0:30", action: "Preparation for tomorrow", purpose: "Reduce morning friction" },
      { time: "-0:15", action: "Gratitude practice", purpose: "End day with appreciation" },
      { time: "-0:05", action: "Wind-down ritual", purpose: "Signal rest to body" }
    ]
  },
  {
    id: "weekly-review",
    name: "Weekly Strategic Review",
    duration: "60-90 min",
    sections: [
      { section: "Clear", actions: ["Process inbox", "Review calendar", "Empty head of open loops"] },
      { section: "Reflect", actions: ["Review last week's wins", "Analyze failures", "Check goal progress"] },
      { section: "Plan", actions: ["Set weekly priorities", "Schedule deep work blocks", "Prepare for known challenges"] }
    ]
  }
];

const MENTAL_MODELS = [
  { id: "first-principles", name: "First Principles Thinking", description: "Break down problems to fundamental truths and build up", application: "When facing complex problems, ask 'What do I know to be absolutely true?'" },
  { id: "inversion", name: "Inversion", description: "Consider the opposite; think about what to avoid", application: "Instead of 'How do I succeed?', ask 'How would I guarantee failure?'" },
  { id: "second-order", name: "Second-Order Thinking", description: "Consider the consequences of consequences", application: "Ask 'And then what?' repeatedly to see downstream effects" },
  { id: "pareto", name: "Pareto Principle (80/20)", description: "80% of results come from 20% of efforts", application: "Identify the vital few activities that drive most outcomes" },
  { id: "opportunity-cost", name: "Opportunity Cost", description: "Every choice means giving up alternatives", application: "When deciding, consider what you're NOT doing" },
  { id: "reversibility", name: "Reversibility", description: "Distinguish between reversible and irreversible decisions", application: "Move fast on reversible decisions, slow on irreversible" },
  { id: "margin-safety", name: "Margin of Safety", description: "Build in buffer for the unexpected", application: "Plan for things to take longer and cost more" },
  { id: "circle-competence", name: "Circle of Competence", description: "Know what you know and what you don't", application: "Stay within expertise or explicitly acknowledge when venturing out" },
  { id: "compound-interest", name: "Compound Interest", description: "Small consistent gains accumulate exponentially", application: "Focus on 1% daily improvements over quick wins" },
  { id: "hanlon-razor", name: "Hanlon's Razor", description: "Don't attribute to malice what can be explained by incompetence", application: "Assume good intent when others disappoint" }
];

const FOCUS_MASTERY = [
  {
    id: "attention-types",
    name: "Types of Attention",
    types: [
      { type: "Focused", description: "Concentrated on single task", when: "Deep work, learning, creating" },
      { type: "Open", description: "Broad awareness, receptive", when: "Brainstorming, rest, nature" },
      { type: "Sustained", description: "Maintained over time", when: "Long projects, study sessions" },
      { type: "Selective", description: "Filter relevant from irrelevant", when: "Noisy environments, busy days" }
    ]
  },
  {
    id: "attention-training",
    name: "Attention Training Protocol",
    exercises: [
      { exercise: "Single-Point Focus", description: "Focus on breath for increasing durations", progression: "2 min → 5 min → 10 min → 20 min" },
      { exercise: "Object Meditation", description: "Hold attention on single object (candle, flower)", duration: "10-20 min" },
      { exercise: "Digital Fasting", description: "Extended periods without screens", progression: "1 hour → 4 hours → full day" },
      { exercise: "Monotasking", description: "One thing at a time, always", practice: "No tabs, no music, no distractions" }
    ]
  }
];

router.get("/peak-performance", (_req, res) => {
  res.json({ success: true, data: PEAK_PERFORMANCE });
});

router.get("/habit-mastery", (_req, res) => {
  res.json({ success: true, data: HABIT_MASTERY });
});

router.get("/discipline", (_req, res) => {
  res.json({ success: true, data: DISCIPLINE_SYSTEMS });
});

router.get("/mental-models", (_req, res) => {
  res.json({ success: true, data: MENTAL_MODELS });
});

router.get("/focus", (_req, res) => {
  res.json({ success: true, data: FOCUS_MASTERY });
});

router.get("/all", (_req, res) => {
  res.json({
    success: true,
    data: {
      peakPerformance: PEAK_PERFORMANCE,
      habitMastery: HABIT_MASTERY,
      discipline: DISCIPLINE_SYSTEMS,
      mentalModels: MENTAL_MODELS,
      focus: FOCUS_MASTERY
    },
    summary: {
      totalProtocols: PEAK_PERFORMANCE.length + HABIT_MASTERY.length + DISCIPLINE_SYSTEMS.length + MENTAL_MODELS.length + FOCUS_MASTERY.length,
      categories: ["Peak Performance", "Habit Mastery", "Discipline Systems", "Mental Models", "Focus Mastery"]
    }
  });
});

export default router;
