import { registerSkillPack, SkillPack, Skill } from "../skillRegistry";

export interface ReframeTemplate {
  id: string;
  name: string;
  category: "perspective" | "language" | "time" | "identity" | "meaning";
  level: "beginner" | "intermediate" | "advanced";
  pattern: string;
  example: string;
  safetyNote: string;
}

export const reframeTemplates: ReframeTemplate[] = [
  {
    id: "reframe-1",
    name: "Alternative Perspective",
    category: "perspective",
    level: "beginner",
    pattern: "What if this situation could also mean...?",
    example: "'I failed' → 'What if this is information about what doesn't work for me?'",
    safetyNote: "Reframing is not about denying reality—acknowledge your feelings first"
  },
  {
    id: "reframe-2",
    name: "Future Self View",
    category: "time",
    level: "beginner",
    pattern: "How might my future self look back on this?",
    example: "'This is awful' → 'In a year, what might I learn from this experience?'",
    safetyNote: "Future thinking is for perspective, not to dismiss present feelings"
  },
  {
    id: "reframe-3",
    name: "Learning Lens",
    category: "meaning",
    level: "beginner",
    pattern: "What might this be teaching me?",
    example: "'I made a mistake' → 'What skill am I building through this experience?'",
    safetyNote: "Not everything needs a lesson—sometimes things are just hard"
  },
  {
    id: "reframe-4",
    name: "Both/And Thinking",
    category: "perspective",
    level: "intermediate",
    pattern: "What if both can be true at once?",
    example: "'I'm scared' → 'I can feel scared AND take small steps forward'",
    safetyNote: "Holding two truths requires practice—be patient with yourself"
  },
  {
    id: "reframe-5",
    name: "Context Expansion",
    category: "perspective",
    level: "intermediate",
    pattern: "What's the bigger picture here?",
    example: "'This day was terrible' → 'This was one difficult day in a longer journey'",
    safetyNote: "Zooming out is helpful, but validate the current experience first"
  },
  {
    id: "reframe-6",
    name: "Language Softening",
    category: "language",
    level: "beginner",
    pattern: "How can I say this more gently to myself?",
    example: "'I always mess up' → 'Sometimes I struggle with this'",
    safetyNote: "Softer language is not minimizing—it's being accurate"
  },
  {
    id: "reframe-7",
    name: "Growth Language",
    category: "language",
    level: "intermediate",
    pattern: "Add 'yet' or 'learning to' to fixed statements",
    example: "'I can't do this' → 'I'm learning to do this' or 'I can't do this yet'",
    safetyNote: "Growth mindset is a practice, not a requirement"
  },
  {
    id: "reframe-8",
    name: "Ownership Shift",
    category: "identity",
    level: "intermediate",
    pattern: "Separate behavior from identity",
    example: "'I'm a failure' → 'I experienced a setback'",
    safetyNote: "You are not your actions—this distinction takes practice"
  },
  {
    id: "reframe-9",
    name: "Possibility Opening",
    category: "language",
    level: "intermediate",
    pattern: "Replace 'can't' with 'what would it take to...'",
    example: "'I can't change' → 'What would it take for me to start shifting this?'",
    safetyNote: "Possibility thinking is exploratory, not prescriptive"
  },
  {
    id: "reframe-10",
    name: "Meaning Making",
    category: "meaning",
    level: "advanced",
    pattern: "What meaning might I choose to give this?",
    example: "'This happened to me' → 'What meaning serves my growth?'",
    safetyNote: "Meaning-making is personal—there's no right answer"
  },
  {
    id: "reframe-11",
    name: "Resource Lens",
    category: "perspective",
    level: "intermediate",
    pattern: "What resources do I have to handle this?",
    example: "'I'm overwhelmed' → 'What support, skills, or strengths can I draw on?'",
    safetyNote: "Acknowledging resources doesn't mean you have to handle everything alone"
  },
  {
    id: "reframe-12",
    name: "Compassionate Witness",
    category: "identity",
    level: "advanced",
    pattern: "What would a compassionate observer notice?",
    example: "'I'm weak' → 'Someone kind would see me doing my best in hard circumstances'",
    safetyNote: "Self-compassion may feel uncomfortable—that's normal"
  },
  {
    id: "reframe-13",
    name: "Exception Finding",
    category: "time",
    level: "intermediate",
    pattern: "When has this been different or better?",
    example: "'I never succeed' → 'When have I experienced even small success?'",
    safetyNote: "Exceptions don't invalidate struggles—they show complexity"
  },
  {
    id: "reframe-14",
    name: "Values Anchor",
    category: "meaning",
    level: "advanced",
    pattern: "How does this connect to what matters to me?",
    example: "'This is pointless' → 'How might this relate to my deeper values?'",
    safetyNote: "Not everything needs to be meaningful—some things just are"
  },
  {
    id: "reframe-15",
    name: "Temporary Language",
    category: "time",
    level: "beginner",
    pattern: "Add 'right now' or 'at this moment' to statements",
    example: "'I'm hopeless' → 'Right now, I'm feeling hopeless'",
    safetyNote: "Acknowledging the present doesn't guarantee change—but it opens space"
  }
];

const nlpSkills: Skill[] = [
  {
    id: "nlp-perspective",
    name: "Perspective Shifting",
    description: "See situations from different viewpoints",
    category: "nlp",
    level: "beginner",
    safetyNote: "Always validate feelings before shifting perspective"
  },
  {
    id: "nlp-language",
    name: "Language Patterns",
    description: "Use words that open possibility rather than close it",
    category: "nlp",
    level: "intermediate",
    safetyNote: "Language is a tool for self-reflection, not manipulation"
  },
  {
    id: "nlp-time",
    name: "Time Perspective",
    description: "View experiences through past, present, and future lenses",
    category: "nlp",
    level: "intermediate",
    safetyNote: "Time perspective is for insight, not avoiding present feelings"
  },
  {
    id: "nlp-identity",
    name: "Identity Flexibility",
    description: "Separate who you are from what you do",
    category: "nlp",
    level: "advanced",
    safetyNote: "Identity work is deep—proceed gently"
  },
  {
    id: "nlp-meaning",
    name: "Meaning Making",
    description: "Choose interpretations that support growth",
    category: "nlp",
    level: "advanced",
    safetyNote: "Meaning is personal—there are no right answers"
  }
];

export const nlpReframePack: SkillPack = {
  id: "nlp-reframe",
  name: "Safe Reframing Language",
  description: "Gentle language patterns that support new perspectives without manipulation or pressure",
  skills: nlpSkills,
  safetyNote: "These are educational tools for self-reflection. They do not replace professional support and should never be used to pressure yourself or others."
};

registerSkillPack(nlpReframePack);

export function getReframesByCategory(category: ReframeTemplate["category"]): ReframeTemplate[] {
  return reframeTemplates.filter(r => r.category === category);
}

export function getReframesByLevel(level: ReframeTemplate["level"]): ReframeTemplate[] {
  return reframeTemplates.filter(r => r.level === level);
}

export function getReframeById(id: string): ReframeTemplate | undefined {
  return reframeTemplates.find(r => r.id === id);
}
