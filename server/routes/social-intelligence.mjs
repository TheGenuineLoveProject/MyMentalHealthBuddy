import express from "express";

const router = express.Router();

router.get("/emotional-literacy", (req, res) => {
  res.json({
    framework: {
      name: "Emotional Literacy",
      description: "The ability to identify, understand, and express emotions effectively",
      levels: [
        {
          level: 1,
          name: "Recognition",
          skills: ["Identify basic emotions in self", "Notice body sensations linked to emotions"],
          practices: ["Emotion check-ins", "Body scanning", "Mood tracking"]
        },
        {
          level: 2,
          name: "Understanding",
          skills: ["Connect emotions to triggers", "Understand emotional patterns"],
          practices: ["Trigger journaling", "Pattern mapping", "Root cause analysis"]
        },
        {
          level: 3,
          name: "Expression",
          skills: ["Articulate emotions accurately", "Share feelings appropriately"],
          practices: ["I-statements", "Feelings vocabulary expansion", "Emotional disclosure"]
        },
        {
          level: 4,
          name: "Regulation",
          skills: ["Manage emotional intensity", "Choose responses"],
          practices: ["RAIN technique", "Opposite action", "Distress tolerance"]
        },
        {
          level: 5,
          name: "Transformation",
          skills: ["Use emotions as information", "Transmute emotional energy"],
          practices: ["Emotional alchemy", "Shadow integration", "Values alignment"]
        }
      ],
      coreEmotions: [
        { emotion: "Joy", function: "Signals well-being and connection", opposite: "Sadness" },
        { emotion: "Sadness", function: "Signals loss and need for support", opposite: "Joy" },
        { emotion: "Fear", function: "Signals danger and need for safety", opposite: "Anger" },
        { emotion: "Anger", function: "Signals boundary violation and need for change", opposite: "Fear" },
        { emotion: "Disgust", function: "Signals something toxic to reject", opposite: "Trust" },
        { emotion: "Surprise", function: "Signals unexpected events requiring attention", opposite: "Anticipation" }
      ]
    }
  });
});

router.get("/empathy-development", (req, res) => {
  res.json({
    types: [
      {
        type: "Cognitive Empathy",
        description: "Understanding another's perspective mentally",
        skills: ["Perspective-taking", "Theory of mind", "Understanding context"],
        practices: [
          "Ask 'What might they be thinking?'",
          "Consider their background and experiences",
          "Imagine their internal dialogue"
        ]
      },
      {
        type: "Affective Empathy",
        description: "Feeling what another person feels",
        skills: ["Emotional resonance", "Mirroring", "Sensitivity"],
        practices: [
          "Notice your body's response to others' emotions",
          "Allow yourself to be moved",
          "Practice presence without trying to fix"
        ]
      },
      {
        type: "Compassionate Empathy",
        description: "Feeling moved to help",
        skills: ["Action orientation", "Appropriate response", "Sustainable caring"],
        practices: [
          "Ask 'How can I help?'",
          "Offer practical support",
          "Balance giving with self-care"
        ]
      }
    ],
    empathyBlockers: [
      { blocker: "Judgment", remedy: "Practice curiosity instead of evaluation" },
      { blocker: "Advice-giving", remedy: "Listen to understand, not to fix" },
      { blocker: "One-upping", remedy: "Keep focus on the other person" },
      { blocker: "Dismissing", remedy: "Validate before problem-solving" },
      { blocker: "Self-referencing", remedy: "Return attention to their experience" }
    ],
    exercises: [
      {
        name: "Empathy Interview",
        description: "Deep listening practice",
        steps: [
          "Ask open questions about their experience",
          "Reflect back what you hear",
          "Ask about feelings, not just facts",
          "Avoid offering solutions",
          "Thank them for sharing"
        ]
      },
      {
        name: "Perspective Rotation",
        description: "See situation from multiple angles",
        steps: [
          "Describe situation from your perspective",
          "Physically move to different chair",
          "Describe from other person's perspective",
          "Move to observer position",
          "Describe from neutral observer"
        ]
      }
    ]
  });
});

router.get("/communication-mastery", (req, res) => {
  res.json({
    frameworks: [
      {
        name: "Nonviolent Communication (NVC)",
        origin: "Marshall Rosenberg",
        components: [
          { step: "Observation", description: "Describe what happened without judgment" },
          { step: "Feeling", description: "Share your emotions" },
          { step: "Need", description: "Identify the underlying need" },
          { step: "Request", description: "Make a clear, doable request" }
        ],
        example: "When I see dishes in the sink (observation), I feel frustrated (feeling) because I need order in shared spaces (need). Would you be willing to wash your dishes within an hour of using them? (request)"
      },
      {
        name: "DEAR MAN",
        origin: "DBT (Dialectical Behavior Therapy)",
        purpose: "Assertive communication to get what you want",
        steps: [
          { letter: "D", meaning: "Describe", action: "Describe the situation factually" },
          { letter: "E", meaning: "Express", action: "Express your feelings using I-statements" },
          { letter: "A", meaning: "Assert", action: "Assert what you want clearly" },
          { letter: "R", meaning: "Reinforce", action: "Reinforce by explaining benefits" },
          { letter: "M", meaning: "Mindful", action: "Stay focused on goal, ignore distractions" },
          { letter: "A", meaning: "Appear confident", action: "Maintain eye contact, steady voice" },
          { letter: "N", meaning: "Negotiate", action: "Be willing to give to get" }
        ]
      },
      {
        name: "GIVE",
        origin: "DBT",
        purpose: "Maintain relationships while communicating",
        components: [
          { letter: "G", meaning: "Gentle", action: "No attacks, threats, or judgments" },
          { letter: "I", meaning: "Interested", action: "Show genuine interest in the other" },
          { letter: "V", meaning: "Validate", action: "Acknowledge their feelings and perspective" },
          { letter: "E", meaning: "Easy manner", action: "Use humor, be light-hearted when appropriate" }
        ]
      }
    ],
    activeListening: {
      principles: [
        "Give full attention - put away distractions",
        "Show you're listening - nod, make sounds",
        "Provide feedback - paraphrase, ask questions",
        "Defer judgment - hear fully before responding",
        "Respond appropriately - honest, respectful"
      ],
      reflectionTypes: [
        { type: "Simple reflection", example: "You're feeling overwhelmed" },
        { type: "Amplified reflection", example: "You're completely exhausted and can't take anymore" },
        { type: "Double-sided reflection", example: "On one hand... and on the other..." },
        { type: "Reflection with feeling", example: "It sounds frustrating when..." }
      ]
    }
  });
});

router.get("/social-dynamics", (req, res) => {
  res.json({
    groupDynamics: {
      stages: [
        { stage: "Forming", characteristics: "Polite, uncertain, dependent on leader" },
        { stage: "Storming", characteristics: "Conflict, competition, resistance" },
        { stage: "Norming", characteristics: "Cohesion, agreement on rules, trust building" },
        { stage: "Performing", characteristics: "High productivity, autonomy, flexibility" },
        { stage: "Adjourning", characteristics: "Completion, reflection, transition" }
      ],
      roles: [
        { role: "Initiator", function: "Proposes ideas and actions" },
        { role: "Information seeker", function: "Asks for clarification" },
        { role: "Opinion giver", function: "Offers values and beliefs" },
        { role: "Coordinator", function: "Clarifies relationships among ideas" },
        { role: "Harmonizer", function: "Reduces tension, reconciles differences" },
        { role: "Gatekeeper", function: "Keeps communication channels open" },
        { role: "Standard setter", function: "Expresses group standards" }
      ]
    },
    influenceStrategies: [
      {
        strategy: "Reciprocity",
        principle: "People tend to return favors",
        application: "Give before asking"
      },
      {
        strategy: "Social Proof",
        principle: "People look to others for guidance",
        application: "Show what others are doing"
      },
      {
        strategy: "Authority",
        principle: "People defer to experts",
        application: "Establish credibility"
      },
      {
        strategy: "Liking",
        principle: "People say yes to those they like",
        application: "Find common ground, give compliments"
      },
      {
        strategy: "Scarcity",
        principle: "Rare things are more valuable",
        application: "Highlight unique benefits"
      },
      {
        strategy: "Commitment",
        principle: "People honor commitments",
        application: "Get small yeses before big asks"
      }
    ]
  });
});

router.get("/conflict-resolution", (req, res) => {
  res.json({
    styles: [
      { style: "Competing", description: "Win-lose, assertive", bestFor: "Emergencies, unpopular decisions" },
      { style: "Collaborating", description: "Win-win, problem-solving", bestFor: "Complex issues, building commitment" },
      { style: "Compromising", description: "Split the difference", bestFor: "Equal power, time pressure" },
      { style: "Avoiding", description: "Postpone or withdraw", bestFor: "Trivial issues, cooling off needed" },
      { style: "Accommodating", description: "Yield to other", bestFor: "You're wrong, relationship priority" }
    ],
    resolutionProcess: [
      { step: 1, action: "Prepare", details: "Clarify the issue, identify interests, consider solutions" },
      { step: 2, action: "Initiate", details: "Choose time and place, state intention to resolve" },
      { step: 3, action: "Listen", details: "Understand their perspective fully before responding" },
      { step: 4, action: "Express", details: "Share your perspective using I-statements" },
      { step: 5, action: "Find common ground", details: "Identify shared interests and goals" },
      { step: 6, action: "Generate options", details: "Brainstorm solutions without judging" },
      { step: 7, action: "Agree on solution", details: "Choose option that meets key interests" },
      { step: 8, action: "Follow up", details: "Check if solution is working, adjust if needed" }
    ],
    difficultConversations: {
      framework: "Difficult Conversations (Stone, Patton, Heen)",
      threeConversations: [
        { name: "What Happened", shift: "From certainty to curiosity about their story" },
        { name: "Feelings", shift: "From dismissing to acknowledging emotions" },
        { name: "Identity", shift: "From defending to exploring what's at stake" }
      ],
      approach: [
        "Start from the third story (neutral observer)",
        "Share your purpose and invite them to help",
        "Explore their story, then share yours",
        "Problem-solve together"
      ]
    }
  });
});

router.get("/boundary-setting", (req, res) => {
  res.json({
    types: [
      { type: "Physical", examples: ["Personal space", "Touch", "Privacy needs"] },
      { type: "Emotional", examples: ["Not taking on others' emotions", "Sharing limits"] },
      { type: "Time", examples: ["How you spend time", "Saying no to requests"] },
      { type: "Sexual", examples: ["Consent", "Comfort levels", "Expectations"] },
      { type: "Material", examples: ["Possessions", "Money", "Lending"] },
      { type: "Digital", examples: ["Response times", "Social media", "Availability"] }
    ],
    principles: [
      "Boundaries are about your behavior, not controlling others",
      "No is a complete sentence",
      "You can set boundaries and still be kind",
      "Discomfort when setting boundaries is normal",
      "Boundaries can be flexible without being weak"
    ],
    settingBoundaries: [
      { step: 1, action: "Identify", details: "Notice where you feel resentment, exhaustion, or violation" },
      { step: 2, action: "Clarify", details: "Define what you need and what behavior is acceptable" },
      { step: 3, action: "Communicate", details: "State boundary clearly, directly, calmly" },
      { step: 4, action: "Enforce", details: "Follow through with consequences consistently" }
    ],
    scripts: [
      { situation: "Saying no", script: "I'm not able to do that, but thank you for thinking of me." },
      { situation: "Limiting discussion", script: "I'm not comfortable discussing that topic." },
      { situation: "Declining invitation", script: "That doesn't work for me, but I hope you have a great time." },
      { situation: "Ending conversation", script: "I need to go now. Let's talk again soon." }
    ]
  });
});

router.get("/daily", (req, res) => {
  const practices = [
    "Practice one act of genuine curiosity about someone else's experience today",
    "Notice your automatic judgments about others and gently question them",
    "Reflect back what someone shares with you before responding",
    "Practice saying no to one thing you don't want to do",
    "Express appreciation to someone specifically for something they did"
  ];
  res.json({
    practice: practices[Math.floor(Math.random() * practices.length)],
    theme: "Social Intelligence"
  });
});

export default router;
