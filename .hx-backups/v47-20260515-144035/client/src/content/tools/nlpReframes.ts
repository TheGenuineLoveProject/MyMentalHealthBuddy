/**
 * NLP Reframing Toolkit (Safe Language Patterns)
 * Educational tool for self-talk and reframing
 * 
 * Usage: Import patterns for cognitive tools and reflection
 * Note: Educational only—no manipulation, no guarantees
 * Framed as "language patterns for self-talk and reframing"
 */

export interface ReframeTemplate {
  id: string;
  name: string;
  description: string;
  pattern: string;
  example: string;
  category: "labeling" | "reframe" | "future" | "interrupt";
}

export const REFRAME_TEMPLATES: ReframeTemplate[] = [
  {
    id: "thought-label",
    name: "Thought Labeling",
    description: "Name the type of thought to create distance from it",
    pattern: "I notice I'm having the thought that ___.",
    example: "I notice I'm having the thought that 'I'm not good enough.'",
    category: "labeling"
  },
  {
    id: "emotion-label",
    name: "Emotion Labeling",
    description: "Name the emotion to reduce its intensity",
    pattern: "This is ___. I'm feeling ___ because ___.",
    example: "This is anxiety. I'm feeling nervous because the meeting is tomorrow.",
    category: "labeling"
  },
  {
    id: "story-label",
    name: "Story Recognition",
    description: "Recognize when you're telling yourself a story vs. stating facts",
    pattern: "The facts are ___. The story I'm adding is ___.",
    example: "The facts are: I made a mistake. The story I'm adding is: Everyone thinks I'm incompetent.",
    category: "labeling"
  },
  {
    id: "both-and",
    name: "Both/And Reframe",
    description: "Hold two truths at once instead of either/or thinking",
    pattern: "It's true that ___, AND it's also true that ___.",
    example: "It's true that this is hard, AND it's also true that I've handled hard things before.",
    category: "reframe"
  },
  {
    id: "meaning-shift",
    name: "Meaning Shift",
    description: "Ask what else this could mean",
    pattern: "Another way to see this is ___.",
    example: "Another way to see this is as an opportunity to practice patience.",
    category: "reframe"
  },
  {
    id: "context-shift",
    name: "Context Shift",
    description: "Change the frame by changing the context",
    pattern: "In the context of ___, this might be ___.",
    example: "In the context of my whole life, this setback is one chapter, not the whole story.",
    category: "reframe"
  },
  {
    id: "compassion-reframe",
    name: "Compassion Reframe",
    description: "Apply the same kindness you'd offer a friend",
    pattern: "If a friend told me this, I would say ___.",
    example: "If a friend told me this, I would say: 'You're doing your best in a hard situation.'",
    category: "reframe"
  },
  {
    id: "resource-focus",
    name: "Resource Focus",
    description: "Shift attention to what's working or available",
    pattern: "Even though ___, I still have ___.",
    example: "Even though I feel stuck, I still have support from people who care.",
    category: "reframe"
  },
  {
    id: "future-30",
    name: "30-Day Future Pace",
    description: "Imagine yourself 30 days from now with consistent practice",
    pattern: "In 30 days, if I keep ___, I might notice ___.",
    example: "In 30 days, if I keep practicing gratitude, I might notice more ease in my days.",
    category: "future"
  },
  {
    id: "future-self",
    name: "Future Self Wisdom",
    description: "Ask what your future self would advise",
    pattern: "If I look back on this moment in 1 year, I'll probably ___.",
    example: "If I look back on this moment in 1 year, I'll probably see it as a turning point.",
    category: "future"
  },
  {
    id: "desired-outcome",
    name: "Desired Outcome Focus",
    description: "Shift from problem to desired state",
    pattern: "What I want instead is ___. One step toward that is ___.",
    example: "What I want instead is peace. One step toward that is taking 3 deep breaths right now.",
    category: "future"
  },
  {
    id: "pattern-interrupt-breath",
    name: "Breath Interrupt",
    description: "Use breath to break a thought spiral",
    pattern: "Pause. Breathe in for 4, hold for 4, out for 6. Then ask: What's true right now?",
    example: "Pause. Breathe. What's true right now? I'm safe in this moment.",
    category: "interrupt"
  },
  {
    id: "pattern-interrupt-ground",
    name: "Grounding Interrupt",
    description: "Use physical sensations to return to the present",
    pattern: "Feel your feet. Feel your hands. Name 3 things you can see right now.",
    example: "Feet on floor. Hands on desk. I see: lamp, plant, window.",
    category: "interrupt"
  },
  {
    id: "pattern-interrupt-name",
    name: "Name It to Tame It",
    description: "Naming the emotion activates the thinking brain",
    pattern: "This is ___. It will pass. I've felt this before and I'm still here.",
    example: "This is fear. It will pass. I've felt this before and I'm still here.",
    category: "interrupt"
  },
  {
    id: "pattern-interrupt-curious",
    name: "Curiosity Interrupt",
    description: "Shift from judgment to curiosity",
    pattern: "Interesting. I wonder why ___ ? Let me get curious instead of critical.",
    example: "Interesting. I wonder why I'm reacting so strongly? Let me get curious.",
    category: "interrupt"
  }
];

export function getReframesByCategory(category: ReframeTemplate["category"]): ReframeTemplate[] {
  return REFRAME_TEMPLATES.filter(t => t.category === category);
}

export function getRandomReframe(): ReframeTemplate {
  return REFRAME_TEMPLATES[Math.floor(Math.random() * REFRAME_TEMPLATES.length)];
}

export function getRandomReframeByCategory(category: ReframeTemplate["category"]): ReframeTemplate {
  const templates = getReframesByCategory(category);
  return templates[Math.floor(Math.random() * templates.length)];
}

export function getAllCategories(): { category: ReframeTemplate["category"]; label: string; description: string }[] {
  return [
    { category: "labeling", label: "Thought Labeling", description: "Name thoughts and emotions to create distance" },
    { category: "reframe", label: "Reframe Templates", description: "Shift perspective with new frames" },
    { category: "future", label: "Future Pacing", description: "Connect to your desired future" },
    { category: "interrupt", label: "Pattern Interrupts", description: "Break unhelpful thought spirals" }
  ];
}

export const SAFE_NLP_DISCLAIMER = 
  "These are language patterns for self-reflection and reframing. " +
  "They are educational tools, not therapy. Use what resonates with you.";
