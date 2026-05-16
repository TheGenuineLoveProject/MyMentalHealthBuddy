/**
 * NLP Reframing Toolkit
 * Language patterns for self-talk and cognitive reframing
 * 
 * Usage: Educational tools for reflection and self-awareness
 * Constraint: Never claim to "reprogram" or "control" - use "explore," "notice," "consider"
 */

export interface ReframeTemplate {
  id: string;
  name: string;
  description: string;
  fromPattern: string;
  toPattern: string;
  example: {
    before: string;
    after: string;
  };
}

export interface ThoughtLabel {
  id: string;
  name: string;
  description: string;
  examples: string[];
}

export interface FuturePacingPrompt {
  id: string;
  timeframe: string;
  prompt: string;
  followUp: string;
}

export interface PatternInterrupt {
  id: string;
  name: string;
  technique: string;
  duration: string;
  steps: string[];
}

export const THOUGHT_LABELS: ThoughtLabel[] = [
  {
    id: "all-or-nothing",
    name: "All-or-Nothing Thinking",
    description: "Seeing things in black and white categories",
    examples: [
      "I always mess up",
      "Nothing ever works out",
      "Everyone is against me"
    ]
  },
  {
    id: "catastrophizing",
    name: "Catastrophizing",
    description: "Expecting the worst possible outcome",
    examples: [
      "This will be a complete disaster",
      "I'll never recover from this",
      "Everything is ruined"
    ]
  },
  {
    id: "mind-reading",
    name: "Mind Reading",
    description: "Assuming you know what others are thinking",
    examples: [
      "They think I'm incompetent",
      "She hates me",
      "They're judging me"
    ]
  },
  {
    id: "fortune-telling",
    name: "Fortune Telling",
    description: "Predicting negative outcomes without evidence",
    examples: [
      "I know I'll fail",
      "It won't work anyway",
      "They'll say no"
    ]
  },
  {
    id: "should-statements",
    name: "Should Statements",
    description: "Rigid rules about how things must be",
    examples: [
      "I should be further along by now",
      "I shouldn't feel this way",
      "They should know better"
    ]
  },
  {
    id: "personalization",
    name: "Personalization",
    description: "Taking responsibility for things outside your control",
    examples: [
      "It's all my fault",
      "If only I had...",
      "I caused this problem"
    ]
  },
  {
    id: "emotional-reasoning",
    name: "Emotional Reasoning",
    description: "Believing feelings are facts",
    examples: [
      "I feel stupid, so I must be stupid",
      "I feel guilty, so I must have done something wrong",
      "I feel overwhelmed, so this is impossible"
    ]
  },
  {
    id: "filtering",
    name: "Mental Filtering",
    description: "Focusing only on negatives while ignoring positives",
    examples: [
      "The whole day was ruined because of that one comment",
      "I can't stop thinking about the mistake",
      "Nothing good happened today"
    ]
  }
];

export const REFRAME_TEMPLATES: ReframeTemplate[] = [
  {
    id: "evidence-check",
    name: "Evidence Check",
    description: "Examine the facts supporting and contradicting the thought",
    fromPattern: "I believe ___",
    toPattern: "What evidence do I have for and against this?",
    example: {
      before: "I always fail at new things",
      after: "I can think of times I succeeded at new things. What's different about those situations?"
    }
  },
  {
    id: "friend-perspective",
    name: "Friend Perspective",
    description: "Consider what you'd say to a friend in this situation",
    fromPattern: "I'm so ___",
    toPattern: "If my friend said this about themselves, what would I tell them?",
    example: {
      before: "I'm so stupid for making that mistake",
      after: "If my friend made this mistake, I'd remind them that everyone makes mistakes and it's how we learn"
    }
  },
  {
    id: "spectrum-view",
    name: "Spectrum View",
    description: "Find the middle ground between extremes",
    fromPattern: "It's completely ___",
    toPattern: "On a scale of 0-100, where does this actually fall?",
    example: {
      before: "The presentation was a complete failure",
      after: "Some parts went well (the opening), some could improve (the Q&A). Maybe it's a 60/100."
    }
  },
  {
    id: "temporary-frame",
    name: "Temporary Frame",
    description: "Recognize that feelings and situations are temporary",
    fromPattern: "This will never ___",
    toPattern: "How might I feel about this in a week? A month? A year?",
    example: {
      before: "I'll never get over this",
      after: "This feels intense right now. In a month, what might be different?"
    }
  },
  {
    id: "learning-lens",
    name: "Learning Lens",
    description: "Reframe setbacks as opportunities for growth",
    fromPattern: "I failed at ___",
    toPattern: "What can this experience teach me?",
    example: {
      before: "I failed the interview",
      after: "This interview showed me I need to prepare more examples. What's one thing I can practice?"
    }
  },
  {
    id: "control-check",
    name: "Control Check",
    description: "Separate what you can and cannot influence",
    fromPattern: "I need to fix ___",
    toPattern: "What's within my control here? What isn't?",
    example: {
      before: "I need to make them understand",
      after: "I can express myself clearly. Their response is not something I can control."
    }
  }
];

export const FUTURE_PACING_PROMPTS: FuturePacingPrompt[] = [
  {
    id: "30-days",
    timeframe: "30 days",
    prompt: "If you keep practicing this one small thing for 30 days, what might be different?",
    followUp: "What's one sign you'd notice that things are shifting?"
  },
  {
    id: "90-days",
    timeframe: "90 days",
    prompt: "Imagine it's 90 days from now and you've made progress. What does that version of you know that you're still learning?",
    followUp: "What's one thing they'd tell you to focus on right now?"
  },
  {
    id: "1-year",
    timeframe: "1 year",
    prompt: "Picture yourself a year from now, having integrated these practices. How do you feel when you wake up?",
    followUp: "What's one thing that's become easier?"
  },
  {
    id: "best-case",
    timeframe: "Best possible outcome",
    prompt: "If everything went as well as it realistically could, what would that look like?",
    followUp: "What's one small step that moves you in that direction?"
  }
];

export const PATTERN_INTERRUPTS: PatternInterrupt[] = [
  {
    id: "54321-grounding",
    name: "5-4-3-2-1 Grounding",
    technique: "Sensory anchoring to present moment",
    duration: "2-3 minutes",
    steps: [
      "Name 5 things you can see",
      "Name 4 things you can touch",
      "Name 3 things you can hear",
      "Name 2 things you can smell",
      "Name 1 thing you can taste"
    ]
  },
  {
    id: "box-breath",
    name: "Box Breathing",
    technique: "Regulated breathing to activate calm",
    duration: "1-2 minutes",
    steps: [
      "Breathe in for 4 counts",
      "Hold for 4 counts",
      "Breathe out for 4 counts",
      "Hold for 4 counts",
      "Repeat 3-4 times"
    ]
  },
  {
    id: "cold-water",
    name: "Cold Water Reset",
    technique: "Physiological shift to interrupt rumination",
    duration: "30 seconds",
    steps: [
      "Run cold water over your hands",
      "Or splash cold water on your face",
      "Notice the sensation fully",
      "Take a slow breath"
    ]
  },
  {
    id: "movement-break",
    name: "Movement Break",
    technique: "Physical interruption of mental loops",
    duration: "1-2 minutes",
    steps: [
      "Stand up if you're sitting",
      "Shake out your hands and arms",
      "Roll your shoulders back",
      "Take 3 deep breaths",
      "Notice how your body feels now"
    ]
  }
];

export function getRandomThoughtLabel(): ThoughtLabel {
  return THOUGHT_LABELS[Math.floor(Math.random() * THOUGHT_LABELS.length)];
}

export function getRandomReframe(): ReframeTemplate {
  return REFRAME_TEMPLATES[Math.floor(Math.random() * REFRAME_TEMPLATES.length)];
}

export function getRandomFuturePacing(): FuturePacingPrompt {
  return FUTURE_PACING_PROMPTS[Math.floor(Math.random() * FUTURE_PACING_PROMPTS.length)];
}

export function getRandomPatternInterrupt(): PatternInterrupt {
  return PATTERN_INTERRUPTS[Math.floor(Math.random() * PATTERN_INTERRUPTS.length)];
}

export function getLabelById(id: string): ThoughtLabel | undefined {
  return THOUGHT_LABELS.find(label => label.id === id);
}

export function getReframeById(id: string): ReframeTemplate | undefined {
  return REFRAME_TEMPLATES.find(template => template.id === id);
}
