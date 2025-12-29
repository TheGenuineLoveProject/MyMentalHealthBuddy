import express from "express";

const router = express.Router();

const EXECUTION_FRAMEWORKS = [
  {
    framework: "Getting Things Done (GTD)",
    creator: "David Allen",
    core_principle: "Capture everything, clarify meaning, organize by context, review regularly.",
    steps: ["Capture", "Clarify", "Organize", "Reflect", "Engage"],
    application: "Reduce cognitive load by externalizing all commitments."
  },
  {
    framework: "Deep Work Protocol",
    creator: "Cal Newport",
    core_principle: "Extended periods of distraction-free concentration on cognitively demanding tasks.",
    steps: ["Schedule blocks", "Eliminate distractions", "Embrace boredom", "Quit social media", "Drain the shallows"],
    application: "Produce rare and valuable work through intense focus."
  },
  {
    framework: "Implementation Intentions",
    creator: "Peter Gollwitzer",
    core_principle: "If-then planning dramatically increases follow-through.",
    steps: ["Identify goal", "Specify when/where/how", "Create if-then statement", "Rehearse mentally"],
    application: "Pre-decide responses to anticipated situations."
  },
  {
    framework: "Atomic Habits",
    creator: "James Clear",
    core_principle: "Small changes compound into remarkable results.",
    steps: ["Make it obvious", "Make it attractive", "Make it easy", "Make it satisfying"],
    application: "Design your environment and identity for consistent behavior."
  },
  {
    framework: "WOOP",
    creator: "Gabriele Oettingen",
    core_principle: "Mental contrasting with implementation intentions.",
    steps: ["Wish", "Outcome", "Obstacle", "Plan"],
    application: "Balance positive thinking with realistic obstacle planning."
  },
  {
    framework: "Pomodoro Technique",
    creator: "Francesco Cirillo",
    core_principle: "Timeboxed work intervals with regular breaks.",
    steps: ["Choose task", "Set 25-min timer", "Work until timer rings", "Take 5-min break", "Every 4 pomodoros take longer break"],
    application: "Maintain focus and prevent burnout through structured intervals."
  }
];

const CREATIVITY_TO_ACTION = [
  {
    phase: "Ideation",
    activities: ["Brainstorming", "Mind mapping", "SCAMPER", "Random input"],
    output: "Multiple creative options",
    trap: "Getting stuck in endless possibility"
  },
  {
    phase: "Selection",
    activities: ["Evaluation criteria", "Feasibility analysis", "Impact assessment", "Gut check"],
    output: "Chosen direction",
    trap: "Analysis paralysis"
  },
  {
    phase: "Planning",
    activities: ["Break into steps", "Identify resources", "Set milestones", "Anticipate obstacles"],
    output: "Actionable roadmap",
    trap: "Over-planning, under-executing"
  },
  {
    phase: "Execution",
    activities: ["First action", "Daily progress", "Course correction", "Momentum building"],
    output: "Tangible results",
    trap: "Perfectionism, giving up"
  },
  {
    phase: "Completion",
    activities: ["Final push", "Quality check", "Shipping", "Celebration"],
    output: "Finished product",
    trap: "Endless tweaking, fear of judgment"
  },
  {
    phase: "Reflection",
    activities: ["What worked", "What didn't", "Lessons learned", "Next iteration"],
    output: "Wisdom for future projects",
    trap: "Skipping this phase"
  }
];

const RESISTANCE_PATTERNS = [
  { pattern: "Procrastination", description: "Delaying important tasks.", antidote: "Start with 2-minute version, build momentum." },
  { pattern: "Perfectionism", description: "Waiting for perfect conditions or output.", antidote: "Ship imperfect work, iterate." },
  { pattern: "Fear of Failure", description: "Avoiding action due to potential negative outcomes.", antidote: "Reframe failure as learning, reduce stakes." },
  { pattern: "Fear of Success", description: "Unconscious sabotage of potential achievement.", antidote: "Explore beliefs about visibility, worthiness." },
  { pattern: "Imposter Syndrome", description: "Feeling unqualified despite evidence.", antidote: "Document accomplishments, normalize doubt." },
  { pattern: "Shiny Object Syndrome", description: "Constantly chasing new ideas.", antidote: "Commit to finishing before starting new." }
];

const ACCOUNTABILITY_SYSTEMS = [
  { system: "Accountability Partner", description: "Regular check-ins with a peer.", benefit: "Social commitment, external perspective" },
  { system: "Public Commitment", description: "Announcing goals publicly.", benefit: "Reputation stakes, community support" },
  { system: "Habit Tracker", description: "Visual record of daily consistency.", benefit: "Don't break the chain motivation" },
  { system: "Implementation Review", description: "Weekly review of progress and plans.", benefit: "Course correction, celebration" },
  { system: "Mastermind Group", description: "Peer group for mutual support and challenge.", benefit: "Collective wisdom, diverse perspectives" }
];

router.get("/execution", (_req, res) => {
  res.json({ ok: true, frameworks: EXECUTION_FRAMEWORKS });
});

router.get("/creativity-pipeline", (_req, res) => {
  res.json({ ok: true, phases: CREATIVITY_TO_ACTION });
});

router.get("/resistance", (_req, res) => {
  res.json({ ok: true, patterns: RESISTANCE_PATTERNS });
});

router.get("/accountability", (_req, res) => {
  res.json({ ok: true, systems: ACCOUNTABILITY_SYSTEMS });
});

router.get("/daily", (_req, res) => {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  
  const framework = EXECUTION_FRAMEWORKS[dayOfYear % EXECUTION_FRAMEWORKS.length];
  const phase = CREATIVITY_TO_ACTION[dayOfYear % CREATIVITY_TO_ACTION.length];
  const resistance = RESISTANCE_PATTERNS[dayOfYear % RESISTANCE_PATTERNS.length];
  
  res.json({
    ok: true,
    daily: {
      executionFramework: framework,
      creativePhase: phase,
      resistancePattern: resistance,
      praxisPrompt: `Today, apply "${framework.framework}": ${framework.core_principle}`,
      actionStep: `Check if you're in the "${phase.phase}" phase: ${phase.output}`
    }
  });
});

export default router;
