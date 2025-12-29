import express from "express";

const router = express.Router();

const ATTACHMENT_STYLES = [
  {
    style: "Secure",
    description: "Comfortable with intimacy and independence.",
    patterns: ["Trusts others easily", "Communicates needs clearly", "Handles conflict constructively"],
    growth_path: "Continue deepening connections while maintaining healthy boundaries.",
    affirmation: "I am worthy of love and capable of giving love."
  },
  {
    style: "Anxious-Preoccupied",
    description: "Seeks high levels of intimacy and approval.",
    patterns: ["Worries about relationship security", "Highly attuned to partner's moods", "May become overly dependent"],
    growth_path: "Develop self-soothing skills and build internal sense of worth.",
    affirmation: "My worth does not depend on others' approval."
  },
  {
    style: "Dismissive-Avoidant",
    description: "Values independence and self-sufficiency over closeness.",
    patterns: ["Keeps emotional distance", "Minimizes attachment needs", "May seem emotionally unavailable"],
    growth_path: "Practice vulnerability and allow interdependence.",
    affirmation: "It is safe to let others close to me."
  },
  {
    style: "Fearful-Avoidant",
    description: "Desires closeness but fears rejection.",
    patterns: ["Push-pull dynamics", "Difficulty trusting", "May sabotage relationships"],
    growth_path: "Heal past wounds and build secure connections gradually.",
    affirmation: "I can learn to trust again while protecting myself."
  }
];

const COMMUNICATION_SKILLS = [
  {
    skill: "Active Listening",
    description: "Fully attending to another person without planning your response.",
    techniques: ["Maintain eye contact", "Reflect back what you hear", "Ask clarifying questions", "Withhold judgment"],
    practice: "In your next conversation, focus entirely on understanding before responding."
  },
  {
    skill: "I-Statements",
    description: "Expressing feelings without blaming or criticizing.",
    formula: "I feel [emotion] when [situation] because [reason]. I would like [request].",
    example: "I feel worried when you come home late because I care about your safety. I'd appreciate a quick text.",
    practice: "Rephrase a recent complaint using the I-statement formula."
  },
  {
    skill: "Nonviolent Communication",
    description: "Marshall Rosenberg's framework for compassionate communication.",
    steps: ["Observation (facts)", "Feeling (emotions)", "Need (underlying need)", "Request (specific ask)"],
    practice: "Apply the four steps to a current interpersonal tension."
  },
  {
    skill: "Repair Attempts",
    description: "Efforts to de-escalate conflict and reconnect.",
    examples: ["Using humor", "Acknowledging fault", "Expressing appreciation", "Taking a break"],
    practice: "Identify repair attempts you and others make during disagreements."
  },
  {
    skill: "Boundary Setting",
    description: "Clearly communicating limits while maintaining respect.",
    components: ["Know your limits", "Communicate directly", "Be consistent", "Accept discomfort"],
    practice: "Identify one boundary you need to set or reinforce."
  },
  {
    skill: "Empathic Inquiry",
    description: "Asking questions that invite deeper sharing.",
    examples: ["What was that like for you?", "What do you need right now?", "How can I support you?"],
    practice: "Use empathic questions to deepen a conversation today."
  }
];

const RELATIONSHIP_PATTERNS = [
  { pattern: "Pursuer-Distancer", description: "One partner seeks closeness while the other withdraws.", antidote: "Pursuers soften, distancers engage." },
  { pattern: "Overfunctioner-Underfunctioner", description: "One takes excessive responsibility while the other takes too little.", antidote: "Balance responsibility and capability." },
  { pattern: "Critic-Defender", description: "One attacks while the other becomes defensive.", antidote: "Soften criticism, share vulnerability." },
  { pattern: "Rescuer-Victim", description: "One saves while the other feels helpless.", antidote: "Empower rather than rescue." },
  { pattern: "Merger-Separator", description: "One seeks fusion while the other needs space.", antidote: "Honor both togetherness and individuality." }
];

const LOVE_LANGUAGES = [
  { language: "Words of Affirmation", expression: "Verbal compliments, encouragement, and appreciation." },
  { language: "Quality Time", expression: "Undivided attention and shared activities." },
  { language: "Receiving Gifts", expression: "Thoughtful symbols of love and remembrance." },
  { language: "Acts of Service", expression: "Helpful actions that ease responsibilities." },
  { language: "Physical Touch", expression: "Physical presence, affection, and closeness." }
];

router.get("/attachment", (_req, res) => {
  res.json({ ok: true, styles: ATTACHMENT_STYLES });
});

router.get("/communication", (_req, res) => {
  res.json({ ok: true, skills: COMMUNICATION_SKILLS });
});

router.get("/patterns", (_req, res) => {
  res.json({ ok: true, patterns: RELATIONSHIP_PATTERNS });
});

router.get("/love-languages", (_req, res) => {
  res.json({ ok: true, languages: LOVE_LANGUAGES });
});

router.get("/daily", (_req, res) => {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  
  const skill = COMMUNICATION_SKILLS[dayOfYear % COMMUNICATION_SKILLS.length];
  const pattern = RELATIONSHIP_PATTERNS[dayOfYear % RELATIONSHIP_PATTERNS.length];
  const language = LOVE_LANGUAGES[dayOfYear % LOVE_LANGUAGES.length];
  
  res.json({
    ok: true,
    daily: {
      communicationSkill: skill,
      patternAwareness: pattern,
      loveLanguage: language,
      relationshipPrompt: `Today, practice "${skill.skill}": ${skill.description}`,
      connectionExercise: skill.practice
    }
  });
});

export default router;
