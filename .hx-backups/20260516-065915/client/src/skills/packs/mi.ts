import { registerSkillPack, SkillPack, Skill } from "../skillRegistry";

export interface MIPrompt {
  id: string;
  category: "open" | "affirm" | "reflect" | "summarize";
  level: "beginner" | "intermediate" | "advanced";
  prompt: string;
  followUp?: string;
}

export const oarsPrompts: MIPrompt[] = [
  {
    id: "open-1",
    category: "open",
    level: "beginner",
    prompt: "What brings you here today?",
    followUp: "Tell me more about that."
  },
  {
    id: "open-2",
    category: "open",
    level: "beginner",
    prompt: "What's been on your mind lately?",
    followUp: "How has that been affecting you?"
  },
  {
    id: "open-3",
    category: "open",
    level: "intermediate",
    prompt: "What would you like to be different in your life?",
    followUp: "What would that change mean for you?"
  },
  {
    id: "affirm-1",
    category: "affirm",
    level: "beginner",
    prompt: "You showed real courage by acknowledging that.",
  },
  {
    id: "affirm-2",
    category: "affirm",
    level: "intermediate",
    prompt: "It sounds like you've been working hard on this.",
  },
  {
    id: "affirm-3",
    category: "affirm",
    level: "advanced",
    prompt: "Your persistence through challenges shows your commitment to growth.",
  },
  {
    id: "reflect-1",
    category: "reflect",
    level: "beginner",
    prompt: "It sounds like you're feeling...",
  },
  {
    id: "reflect-2",
    category: "reflect",
    level: "intermediate",
    prompt: "On one hand you feel... and on the other...",
  },
  {
    id: "reflect-3",
    category: "reflect",
    level: "advanced",
    prompt: "What I'm hearing is that this connects to something deeper for you.",
  },
  {
    id: "summarize-1",
    category: "summarize",
    level: "beginner",
    prompt: "Let me see if I understand what you've shared...",
  },
  {
    id: "summarize-2",
    category: "summarize",
    level: "intermediate",
    prompt: "So far you've mentioned several important things...",
  }
];

export interface RulerAssessment {
  question: string;
  scale: string;
  followUp: string;
}

export const importanceRuler: RulerAssessment = {
  question: "On a scale of 0-10, how important is it for you to make this change?",
  scale: "0 = not at all important, 10 = extremely important",
  followUp: "Why did you choose that number and not a lower one?"
};

export const confidenceRuler: RulerAssessment = {
  question: "On a scale of 0-10, how confident are you that you could make this change?",
  scale: "0 = not at all confident, 10 = extremely confident",
  followUp: "What would help you move up one number on that scale?"
};

export const changeTalkPrompts = [
  "What concerns you about staying where you are?",
  "What might be some advantages of making this change?",
  "What gives you hope that change is possible?",
  "What small step might you take first?"
];

const miSkills: Skill[] = [
  {
    id: "mi-open-questions",
    name: "Open Questions",
    description: "Ask questions that invite exploration and cannot be answered with yes/no",
    category: "mi",
    level: "beginner",
    safetyNote: "These prompts are educational tools, not professional counseling"
  },
  {
    id: "mi-affirmations",
    name: "Affirmations",
    description: "Recognize and acknowledge the person's strengths and efforts",
    category: "mi",
    level: "beginner",
    safetyNote: "Affirmations support self-reflection, not therapy"
  },
  {
    id: "mi-reflections",
    name: "Reflective Listening",
    description: "Mirror back what you hear to deepen understanding",
    category: "mi",
    level: "intermediate",
    safetyNote: "Practice reflecting your own thoughts first"
  },
  {
    id: "mi-summaries",
    name: "Summarizing",
    description: "Gather key points together to create clarity",
    category: "mi",
    level: "intermediate",
    safetyNote: "Summarizing helps organize your own understanding"
  },
  {
    id: "mi-rulers",
    name: "Importance & Confidence Rulers",
    description: "Use scales to explore motivation and self-efficacy",
    category: "mi",
    level: "advanced",
    safetyNote: "These are self-reflection tools, not diagnostic measures"
  }
];

export const miPack: SkillPack = {
  id: "mi",
  name: "Motivational Interviewing Basics",
  description: "Evidence-informed communication skills that support self-exploration and change talk",
  skills: miSkills,
  safetyNote: "These are educational wellness tools. They do not replace professional counseling or therapy."
};

registerSkillPack(miPack);

export function getOarsPromptsByCategory(category: MIPrompt["category"]): MIPrompt[] {
  return oarsPrompts.filter(p => p.category === category);
}

export function getOarsPromptsByLevel(level: MIPrompt["level"]): MIPrompt[] {
  return oarsPrompts.filter(p => p.level === level);
}
