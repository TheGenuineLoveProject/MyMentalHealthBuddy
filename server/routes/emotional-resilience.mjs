import express from "express";

const router = express.Router();

const STRESS_MANAGEMENT_TECHNIQUES = [
  {
    id: "physiological-sigh",
    name: "Physiological Sigh",
    category: "immediate",
    duration: "30 seconds",
    description: "Double inhale followed by long exhale - fastest way to calm the nervous system",
    steps: [
      "Inhale through the nose",
      "Take a second, shorter inhale on top of the first",
      "Exhale slowly through the mouth for as long as possible",
      "Repeat 1-3 times"
    ],
    science: "Reinflates collapsed lung alveoli and activates parasympathetic system",
    effectivenessScore: 9
  },
  {
    id: "box-breathing",
    name: "Box Breathing (Navy SEAL technique)",
    category: "regulation",
    duration: "4-5 minutes",
    description: "Equal-length inhale, hold, exhale, hold pattern",
    steps: [
      "Inhale for 4 seconds",
      "Hold for 4 seconds",
      "Exhale for 4 seconds",
      "Hold for 4 seconds",
      "Repeat for 4-5 minutes"
    ],
    science: "Balances sympathetic and parasympathetic nervous system",
    effectivenessScore: 8
  },
  {
    id: "cognitive-reframing",
    name: "Cognitive Reframing",
    category: "mindset",
    duration: "2-5 minutes",
    description: "Transform stress interpretation from threat to challenge",
    steps: [
      "Notice your stress response",
      "Label the emotion: 'I'm feeling stressed'",
      "Ask: 'What's another way to see this situation?'",
      "Reframe: 'This is my body preparing me to perform'",
      "Focus on what you can control"
    ],
    keyInsight: "Stress response is adaptive - it's your interpretation that matters",
    effectivenessScore: 8
  },
  {
    id: "progressive-relaxation",
    name: "Progressive Muscle Relaxation",
    category: "physical",
    duration: "10-15 minutes",
    description: "Systematically tense and release muscle groups",
    steps: [
      "Start with feet - tense for 5 seconds, release",
      "Move up through calves, thighs, abdomen",
      "Continue to chest, arms, hands",
      "Finish with shoulders, neck, face",
      "Notice the contrast between tension and relaxation"
    ],
    benefits: ["Releases physical tension", "Interrupts stress cycle", "Improves body awareness"],
    effectivenessScore: 7
  },
  {
    id: "cold-exposure",
    name: "Cold Water Exposure",
    category: "hormetic",
    duration: "30 seconds - 3 minutes",
    description: "Brief cold exposure to build stress resilience",
    implementation: [
      "End shower with 30-60 seconds of cold water",
      "Breathe slowly and stay calm",
      "Gradually increase duration over time",
      "Optional: cold plunge or ice bath"
    ],
    science: "Activates norepinephrine, builds stress inoculation",
    caution: "Start gradually; consult doctor if health conditions exist",
    effectivenessScore: 8
  }
];

const EMOTIONAL_AGILITY = {
  principles: [
    {
      name: "Showing Up",
      description: "Face your emotions with curiosity rather than avoidance",
      practices: [
        "Turn toward difficult feelings instead of away",
        "Name the emotion specifically (not just 'bad')",
        "Notice where you feel it in your body"
      ]
    },
    {
      name: "Stepping Out",
      description: "Create space between stimulus and response",
      practices: [
        "Notice: 'I am having the thought that...'",
        "Observe emotions as passing weather, not identity",
        "Use the metaphor: emotions are data, not directives"
      ]
    },
    {
      name: "Walking Your Why",
      description: "Connect daily choices to core values",
      practices: [
        "Clarify what truly matters to you",
        "Ask: 'Is this action moving me toward my values?'",
        "Make values-based choices, not emotion-driven ones"
      ]
    },
    {
      name: "Moving On",
      description: "Take small, values-aligned actions",
      practices: [
        "Identify the smallest step you can take",
        "Build tiny habits aligned with who you want to be",
        "Embrace 'good enough' over perfectionism"
      ]
    }
  ],
  source: "Based on Susan David's Emotional Agility framework"
};

const INNER_STRENGTH_BUILDERS = [
  {
    id: "antifragility",
    name: "Building Antifragility",
    concept: "Systems that gain from disorder - becoming stronger through stress",
    practices: [
      "Embrace voluntary discomfort (cold, exercise, fasting)",
      "Seek out manageable challenges",
      "View setbacks as training opportunities",
      "Build redundancy in critical areas of life",
      "Avoid overprotection that leads to fragility"
    ],
    source: "Nassim Taleb's concept"
  },
  {
    id: "post-traumatic-growth",
    name: "Post-Traumatic Growth",
    concept: "Positive psychological change after struggle",
    domains: [
      "New possibilities - seeing new paths in life",
      "Personal strength - 'I survived, I can handle more'",
      "Relating to others - deeper connections",
      "Appreciation of life - gratitude for small things",
      "Spiritual/existential change - new meaning"
    ],
    enablers: ["Deliberate rumination", "Meaning-making", "Social support", "Self-disclosure"]
  },
  {
    id: "psychological-flexibility",
    name: "Psychological Flexibility",
    concept: "Ability to stay present and change behavior in service of values",
    components: [
      "Acceptance - willingness to experience difficult emotions",
      "Defusion - unhooking from unhelpful thoughts",
      "Present moment - mindful awareness",
      "Self-as-context - observer perspective",
      "Values - knowing what matters",
      "Committed action - doing what works"
    ],
    source: "Acceptance and Commitment Therapy (ACT)"
  },
  {
    id: "self-compassion",
    name: "Self-Compassion Practice",
    concept: "Treating yourself with the kindness you'd offer a good friend",
    components: [
      {
        name: "Self-kindness",
        versus: "Self-judgment",
        practice: "Speak to yourself gently when suffering"
      },
      {
        name: "Common humanity",
        versus: "Isolation",
        practice: "Remember suffering is part of shared human experience"
      },
      {
        name: "Mindfulness",
        versus: "Over-identification",
        practice: "Acknowledge pain without being consumed by it"
      }
    ],
    source: "Kristin Neff's research"
  }
];

const EMOTIONAL_REGULATION_STRATEGIES = [
  {
    id: "rain",
    name: "RAIN Practice",
    description: "Four-step process for working with difficult emotions",
    steps: [
      { letter: "R", meaning: "Recognize", action: "What is happening inside me right now?" },
      { letter: "A", meaning: "Allow", action: "Let the experience be there, just as it is" },
      { letter: "I", meaning: "Investigate", action: "What does this feeling need? What is it trying to tell me?" },
      { letter: "N", meaning: "Non-identification", action: "This feeling is not who I am" }
    ]
  },
  {
    id: "name-it-tame-it",
    name: "Name It to Tame It",
    description: "Affect labeling reduces emotional intensity",
    practice: [
      "Notice the emotion arising",
      "Put a specific name to it (angry, disappointed, embarrassed)",
      "Say it silently or out loud: 'I'm feeling...'",
      "Notice how naming creates distance"
    ],
    science: "Activates prefrontal cortex, reduces amygdala reactivity"
  },
  {
    id: "opposite-action",
    name: "Opposite Action",
    description: "Act opposite to the emotion's urge when the emotion doesn't fit the facts",
    examples: [
      { emotion: "Fear", urge: "Avoid", opposite: "Approach" },
      { emotion: "Anger", urge: "Attack", opposite: "Gently avoid or be kind" },
      { emotion: "Sadness", urge: "Withdraw", opposite: "Get active, reach out" },
      { emotion: "Shame", urge: "Hide", opposite: "Share with trusted person" }
    ],
    source: "Dialectical Behavior Therapy (DBT)"
  },
  {
    id: "wise-mind",
    name: "Wise Mind",
    description: "Balance between emotional mind and reasonable mind",
    practice: [
      "Notice if you're in emotional mind (feelings drive decisions)",
      "Notice if you're in reasonable mind (logic only, ignoring feelings)",
      "Ask: 'What would wise mind say?'",
      "Wise mind integrates emotion and reason"
    ],
    source: "Dialectical Behavior Therapy (DBT)"
  }
];

router.get("/stress-management", (_req, res) => {
  res.json({
    techniques: STRESS_MANAGEMENT_TECHNIQUES,
    categories: ["immediate", "regulation", "mindset", "physical", "hormetic"],
    quickTip: "The Physiological Sigh is the fastest evidence-based way to calm down in real-time"
  });
});

router.get("/emotional-agility", (_req, res) => {
  res.json({
    framework: EMOTIONAL_AGILITY,
    keyInsight: "Emotions are data, not directives. Feel them, learn from them, but don't let them drive the bus."
  });
});

router.get("/inner-strength", (_req, res) => {
  res.json({
    builders: INNER_STRENGTH_BUILDERS,
    insight: "Resilience isn't about avoiding adversity - it's about building the capacity to transform it into growth"
  });
});

router.get("/regulation-strategies", (_req, res) => {
  res.json({
    strategies: EMOTIONAL_REGULATION_STRATEGIES,
    recommendation: "Start with 'Name It to Tame It' - it's simple and immediately effective"
  });
});

router.get("/resilience-quotient", (_req, res) => {
  res.json({
    domains: [
      {
        name: "Emotional Awareness",
        description: "Ability to recognize and understand your emotions",
        buildingBlocks: ["Mindfulness practice", "Emotion journaling", "Body scan meditation"]
      },
      {
        name: "Stress Recovery",
        description: "How quickly you return to baseline after stress",
        buildingBlocks: ["Regular exercise", "Quality sleep", "Breathwork practice"]
      },
      {
        name: "Cognitive Flexibility",
        description: "Ability to adapt thinking to new situations",
        buildingBlocks: ["Reframing practice", "Multiple perspective taking", "Learning new skills"]
      },
      {
        name: "Social Connection",
        description: "Quality of supportive relationships",
        buildingBlocks: ["Nurturing close relationships", "Community involvement", "Asking for help"]
      },
      {
        name: "Purpose and Meaning",
        description: "Sense of direction and significance",
        buildingBlocks: ["Values clarification", "Goal setting", "Contributing to others"]
      }
    ],
    insight: "Resilience is not a fixed trait - it's a set of skills that can be developed with practice"
  });
});


// Health check endpoint for admin daily tools monitoring
router.get("/", (req, res) => {
  res.json({ ok: true, module: "emotional-resilience", status: "operational", timestamp: new Date().toISOString() });
});

export default router;
