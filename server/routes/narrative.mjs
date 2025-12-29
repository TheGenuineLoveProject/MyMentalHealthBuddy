import express from "express";

const router = express.Router();

const NARRATIVE_FRAMEWORKS = [
  {
    framework: "Hero's Journey",
    origin: "Joseph Campbell",
    stages: ["Ordinary World", "Call to Adventure", "Crossing the Threshold", "Tests and Allies", "Ordeal", "Reward", "Return"],
    reflection: "Where are you in your hero's journey right now?",
    application: "Map your current life transition to the archetypal stages."
  },
  {
    framework: "Redemption Narrative",
    description: "Stories of transformation where suffering leads to growth.",
    elements: ["Initial difficulty", "Struggle and meaning-making", "Positive transformation", "Wisdom gained"],
    reflection: "What growth has come from your challenges?",
    application: "Reframe hardships as chapters in your redemption story."
  },
  {
    framework: "Contamination Narrative",
    description: "Understanding how negative interpretations shape experience.",
    elements: ["Positive beginning", "Negative intrusion", "Lasting impact", "Meaning disruption"],
    reflection: "What stories of loss might need rewriting?",
    application: "Identify contamination narratives and explore alternative meanings."
  },
  {
    framework: "Agency Narrative",
    description: "Stories emphasizing personal choice and action.",
    elements: ["Challenge recognition", "Active decision", "Purposeful action", "Ownership of outcomes"],
    reflection: "How are you the author of your story, not just a character?",
    application: "Emphasize moments of choice and agency in your narrative."
  },
  {
    framework: "Communion Narrative",
    description: "Stories centered on connection, belonging, and love.",
    elements: ["Seeking connection", "Finding belonging", "Giving and receiving care", "Integration with others"],
    reflection: "How does connection feature in your life story?",
    application: "Highlight relationships and community in your narrative."
  },
  {
    framework: "Growth Narrative",
    description: "Stories of continuous learning and development.",
    elements: ["Initial state", "Challenges as lessons", "Incremental progress", "Evolved self"],
    reflection: "How has every experience contributed to who you're becoming?",
    application: "View your life as a learning journey with no failures, only lessons."
  }
];

const STORY_ELEMENTS = [
  { element: "Setting", question: "Where does your story take place?", purpose: "Context and atmosphere" },
  { element: "Character", question: "Who are you in this story?", purpose: "Identity and role" },
  { element: "Conflict", question: "What challenges do you face?", purpose: "Tension and growth catalyst" },
  { element: "Theme", question: "What is your story really about?", purpose: "Deeper meaning" },
  { element: "Plot", question: "What happens in your story?", purpose: "Events and sequence" },
  { element: "Resolution", question: "How does this chapter end?", purpose: "Integration and closure" }
];

const REAUTHORING_PROMPTS = [
  "If your life were a book, what would this chapter be called?",
  "What character strengths appear throughout your story?",
  "What would you title your autobiography?",
  "If you could write the next chapter, what would happen?",
  "What themes keep recurring in your life story?",
  "Who are the supporting characters who have helped you grow?",
  "What plot twist changed everything for you?",
  "If this challenge were a test in your hero's journey, what skill is it building?",
  "What would your future self say about this current chapter?",
  "How might you rewrite a painful chapter with new understanding?"
];

const ARCHETYPAL_FIGURES = [
  { archetype: "The Hero", shadow: "Arrogance", gift: "Courage to face the unknown" },
  { archetype: "The Mentor", shadow: "Manipulation", gift: "Wisdom to guide others" },
  { archetype: "The Threshold Guardian", shadow: "Obstruction", gift: "Testing readiness" },
  { archetype: "The Trickster", shadow: "Deception", gift: "Breaking rigid patterns" },
  { archetype: "The Shapeshifter", shadow: "Unreliability", gift: "Flexibility and growth" },
  { archetype: "The Shadow", shadow: "Destruction", gift: "Integration of rejected parts" },
  { archetype: "The Herald", shadow: "Alarm", gift: "Calling to adventure" },
  { archetype: "The Ally", shadow: "Dependency", gift: "Support and companionship" }
];

router.get("/frameworks", (_req, res) => {
  res.json({ ok: true, frameworks: NARRATIVE_FRAMEWORKS });
});

router.get("/elements", (_req, res) => {
  res.json({ ok: true, elements: STORY_ELEMENTS });
});

router.get("/prompts", (_req, res) => {
  res.json({ ok: true, prompts: REAUTHORING_PROMPTS });
});

router.get("/archetypes", (_req, res) => {
  res.json({ ok: true, archetypes: ARCHETYPAL_FIGURES });
});

router.get("/daily", (_req, res) => {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  
  const framework = NARRATIVE_FRAMEWORKS[dayOfYear % NARRATIVE_FRAMEWORKS.length];
  const prompt = REAUTHORING_PROMPTS[dayOfYear % REAUTHORING_PROMPTS.length];
  const archetype = ARCHETYPAL_FIGURES[dayOfYear % ARCHETYPAL_FIGURES.length];
  
  res.json({
    ok: true,
    daily: {
      narrativeFramework: framework,
      reauthoringPrompt: prompt,
      archetypeOfTheDay: archetype,
      storyQuestion: `Using the "${framework.framework}" lens: ${framework.reflection}`,
      journalPrompt: prompt
    }
  });
});

export default router;
