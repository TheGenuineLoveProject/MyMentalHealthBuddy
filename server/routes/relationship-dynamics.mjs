// server/routes/relationship-dynamics.mjs
// Relationship Dynamics API - Comprehensive interpersonal intelligence and connection tools

import express from "express";
const router = express.Router();

// Attachment Styles (Bowlby/Ainsworth)
const attachmentStyles = [
  {
    style: "Secure",
    percentage: "~55%",
    characteristics: ["Comfortable with intimacy", "Trusts others", "Good communication", "Healthy boundaries"],
    inRelationships: "Seeks closeness, handles conflict constructively, supports partner's independence",
    healingPath: "Already healthy; continue self-awareness and growth"
  },
  {
    style: "Anxious-Preoccupied",
    percentage: "~20%",
    characteristics: ["Fear of abandonment", "Needs reassurance", "Highly attuned to partner", "May be clingy"],
    inRelationships: "Seeks high closeness, sensitive to rejection, may escalate in conflict",
    healingPath: "Self-soothing skills, secure base internalization, communication about needs"
  },
  {
    style: "Dismissive-Avoidant",
    percentage: "~25%",
    characteristics: ["Values independence", "Uncomfortable with intimacy", "Self-reliant", "May seem distant"],
    inRelationships: "Needs space, withdraws under stress, difficulty expressing emotions",
    healingPath: "Vulnerability practice, recognizing need for connection, gradual opening"
  },
  {
    style: "Fearful-Avoidant",
    percentage: "~5%",
    characteristics: ["Desires intimacy but fears it", "Unpredictable responses", "May have trauma history"],
    inRelationships: "Push-pull dynamics, difficulty trusting, emotional volatility",
    healingPath: "Trauma therapy, building safety in relationships, earned security"
  }
];

// Love Languages (Gary Chapman)
const loveLanguages = [
  { language: "Words of Affirmation", expressions: ["Verbal compliments", "Encouragement", "Kind words", "Written notes"], warning: "Harsh criticism deeply wounds" },
  { language: "Acts of Service", expressions: ["Helping with tasks", "Taking initiative", "Easing burdens", "Practical support"], warning: "Laziness or broken commitments hurt deeply" },
  { language: "Receiving Gifts", expressions: ["Thoughtful presents", "Symbols of love", "Gift of presence", "Remembered preferences"], warning: "Forgotten occasions or careless gifts wound" },
  { language: "Quality Time", expressions: ["Undivided attention", "Shared activities", "Deep conversations", "Eye contact"], warning: "Distractions or postponements feel like rejection" },
  { language: "Physical Touch", expressions: ["Holding hands", "Hugs", "Physical presence", "Appropriate touch"], warning: "Physical neglect or abuse is devastating" }
];

// Gottman's Four Horsemen (Relationship Predictors)
const fourHorsemen = [
  {
    horseman: "Criticism",
    description: "Attacking partner's character rather than specific behavior",
    example: "You never think about me. You're so selfish.",
    antidote: "Gentle Start-Up",
    antidoteExample: "I felt overlooked when you made plans without asking. Could we discuss schedules together?"
  },
  {
    horseman: "Contempt",
    description: "Disrespect, mockery, sarcasm, eye-rolling, name-calling",
    example: "You're pathetic. I can't believe I married you.",
    antidote: "Build Culture of Appreciation",
    antidoteExample: "I appreciate when you help with dinner. It means a lot to me."
  },
  {
    horseman: "Defensiveness",
    description: "Victimizing self, making excuses, counter-attacking",
    example: "It's not my fault! You're the one who always...",
    antidote: "Take Responsibility",
    antidoteExample: "You're right, I should have told you. I apologize."
  },
  {
    horseman: "Stonewalling",
    description: "Withdrawing, shutting down, refusing to engage",
    example: "*Silence, leaving the room, tuning out*",
    antidote: "Physiological Self-Soothing",
    antidoteExample: "I'm feeling overwhelmed. Can we take a 20-minute break and continue?"
  }
];

// Healthy Relationship Patterns
const healthyPatterns = {
  communication: [
    "Use 'I' statements instead of 'You' accusations",
    "Practice active listening without interrupting",
    "Validate feelings before problem-solving",
    "Schedule regular check-ins for relationship health",
    "Express appreciation daily"
  ],
  boundaries: [
    "Know and communicate your non-negotiables",
    "Respect partner's need for space and autonomy",
    "Say 'no' without guilt when needed",
    "Distinguish between healthy and toxic patterns",
    "Protect individual identity within partnership"
  ],
  conflictResolution: [
    "Take breaks when flooded (20+ minutes)",
    "Seek to understand before being understood",
    "Find the underlying need beneath the position",
    "Repair attempts: humor, affection, de-escalation",
    "Accept influence from your partner"
  ],
  intimacy: [
    "Emotional vulnerability creates connection",
    "Small moments of connection matter most",
    "Turn toward bids for attention",
    "Maintain curiosity about your partner",
    "Share dreams and support each other's goals"
  ]
};

// Relationship Types and Dynamics
const relationshipTypes = {
  romantic: ["Dating", "Committed Partnership", "Marriage", "Long-distance", "Open/Polyamorous"],
  familial: ["Parent-Child", "Siblings", "Extended Family", "Chosen Family"],
  friendship: ["Casual", "Close", "Best Friends", "Work Friends", "Online Friends"],
  professional: ["Colleagues", "Mentor-Mentee", "Manager-Report", "Client-Provider"]
};

// Conflict Styles (Thomas-Kilmann)
const conflictStyles = [
  { style: "Competing", description: "Win-lose, assertive but uncooperative", bestFor: "Emergencies, defending rights" },
  { style: "Collaborating", description: "Win-win, both assertive and cooperative", bestFor: "Important issues, long-term relationships" },
  { style: "Compromising", description: "Partial win, moderate assertiveness and cooperation", bestFor: "Temporary solutions, time pressure" },
  { style: "Avoiding", description: "Lose-lose, unassertive and uncooperative", bestFor: "Trivial issues, cooling down period" },
  { style: "Accommodating", description: "Lose-win, unassertive but cooperative", bestFor: "Preserving harmony, when you're wrong" }
];

// GET /api/relationship-dynamics/attachment-styles
router.get("/attachment-styles", (_req, res) => {
  res.json({
    ok: true,
    data: attachmentStyles,
    note: "Attachment styles are not fixed. Earned secure attachment is possible through healing and healthy relationships."
  });
});

// GET /api/relationship-dynamics/love-languages
router.get("/love-languages", (_req, res) => {
  res.json({
    ok: true,
    data: loveLanguages,
    tip: "Most people have a primary and secondary love language. Learn your partner's to show love effectively."
  });
});

// GET /api/relationship-dynamics/four-horsemen
router.get("/four-horsemen", (_req, res) => {
  res.json({
    ok: true,
    data: fourHorsemen,
    source: "Dr. John Gottman's research predicts divorce with 93.6% accuracy based on these patterns."
  });
});

// GET /api/relationship-dynamics/healthy-patterns
router.get("/healthy-patterns", (_req, res) => {
  res.json({
    ok: true,
    data: healthyPatterns,
    principle: "Healthy relationships require intentional cultivation, not just the absence of problems."
  });
});

// GET /api/relationship-dynamics/conflict-styles
router.get("/conflict-styles", (_req, res) => {
  res.json({
    ok: true,
    data: conflictStyles,
    insight: "All styles have value; effectiveness depends on context. Flexibility is key."
  });
});

// POST /api/relationship-dynamics/analyze-pattern
router.post("/analyze-pattern", (req, res) => {
  const { situation, yourResponse, partnerResponse, recurringIssue } = req.body;

  const analysis = {
    situation: situation || "Not specified",
    potentialDynamics: [],
    recommendations: []
  };

  if (yourResponse?.includes("withdraw") || yourResponse?.includes("silent")) {
    analysis.potentialDynamics.push("Possible stonewalling or avoidant pattern");
    analysis.recommendations.push("Practice communicating need for breaks rather than disappearing");
  }

  if (partnerResponse?.includes("blame") || partnerResponse?.includes("attack")) {
    analysis.potentialDynamics.push("Possible criticism pattern from partner");
    analysis.recommendations.push("Use soft start-up and express feelings without counter-attack");
  }

  if (recurringIssue) {
    analysis.potentialDynamics.push("Recurring conflict may indicate unaddressed core need");
    analysis.recommendations.push("Explore the dream within the conflict - what deeper need is unmet?");
  }

  analysis.recommendations.push(
    "Consider couples counseling for entrenched patterns",
    "Daily appreciation rituals build positive sentiment override",
    "20:1 positive to negative ratio during conflict is healthy"
  );

  res.json({
    ok: true,
    data: analysis
  });
});

// GET /api/relationship-dynamics/repair-strategies
router.get("/repair-strategies", (_req, res) => {
  const strategies = [
    { strategy: "Take responsibility", example: "I was wrong. I'm sorry." },
    { strategy: "Use humor", example: "We're doing it again, aren't we? *smile*" },
    { strategy: "Physical affection", example: "Can I hold your hand while we talk?" },
    { strategy: "Appreciate", example: "I know you're trying. I see that." },
    { strategy: "Find common ground", example: "We both want the same thing here." },
    { strategy: "De-escalate", example: "Let me start over. That came out wrong." },
    { strategy: "Yield to win", example: "You have a point. Tell me more." },
    { strategy: "Take a break", example: "I need 20 minutes. I promise to come back." }
  ];

  res.json({
    ok: true,
    data: strategies,
    note: "Repair attempts are the secret weapon of emotionally intelligent couples."
  });
});

export default router;
