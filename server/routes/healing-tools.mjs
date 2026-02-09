import { Router } from "express";

const router = Router();

const WISDOM_LADDERS = {
  "1min": {
    duration: 1,
    prompt: "Take one conscious breath. Notice what you're carrying right now.",
    reflection: "Even a single breath can shift your state."
  },
  "5min": {
    duration: 5,
    steps: [
      "Pause and ground yourself (30 seconds)",
      "Name one feeling present right now (1 minute)",
      "Ask: What does this feeling need? (2 minutes)", 
      "Choose one small, kind action (1 minute)",
      "Set an intention for the next hour (30 seconds)"
    ],
    reflection: "Five minutes of presence creates ripples through your entire day."
  },
  "15min": {
    duration: 15,
    steps: [
      "Settle into stillness - notice body, breath, thoughts (3 minutes)",
      "Review your day/week without judgment (3 minutes)",
      "Identify one pattern that's asking for attention (3 minutes)",
      "Explore: What would wisdom say about this? (3 minutes)",
      "Craft one commitment to yourself (3 minutes)"
    ],
    reflection: "Fifteen minutes of intentional reflection can reshape your trajectory."
  }
};

const MICRO_COURAGE_STEPS = [
  { id: "acknowledge", prompt: "Name the fear or resistance you're facing right now.", insight: "Naming creates distance between you and the fear." },
  { id: "shrink", prompt: "What's the smallest possible version of this action?", insight: "Tiny steps bypass the threat response." },
  { id: "timer", prompt: "Can you commit to just 2 minutes?", insight: "The hardest part is starting." },
  { id: "witness", prompt: "Imagine someone you respect watching you take this step.", insight: "We often find courage for others before ourselves." },
  { id: "celebrate", prompt: "Notice and acknowledge what you just did.", insight: "Small wins build momentum for larger ones." }
];

const REFLECTION_MIRRORS = [
  { category: "awareness", prompt: "What am I avoiding looking at?", insight: "Avoidance often points to what needs attention." },
  { category: "awareness", prompt: "What story am I telling myself about this situation?", insight: "Stories shape reality more than facts." },
  { category: "agency", prompt: "Where do I have more power than I'm acknowledging?", insight: "Powerlessness is often a protective story." },
  { category: "agency", prompt: "What's one thing I could do differently tomorrow?", insight: "Small changes compound over time." },
  { category: "relationships", prompt: "Who in my life am I not seeing clearly?", insight: "Our projections reveal our own unmet needs." },
  { category: "relationships", prompt: "What boundary would serve me and others?", insight: "Healthy boundaries protect love, not walls against it." },
  { category: "meaning", prompt: "What matters most to me right now?", insight: "Clarity of values simplifies decisions." },
  { category: "meaning", prompt: "What would I regret not doing?", insight: "Regret often points toward our deepest desires." }
];

const PATTERN_THEMES = [
  { theme: "avoidance", description: "Patterns of avoiding discomfort", questions: ["What do I repeatedly put off?", "What conversations do I avoid?"] },
  { theme: "control", description: "Attempts to control uncontrollable things", questions: ["Where am I trying to control outcomes?", "What would letting go look like?"] },
  { theme: "people-pleasing", description: "Prioritizing others' needs over your own", questions: ["Whose approval am I seeking?", "What do I actually want?"] },
  { theme: "perfectionism", description: "All-or-nothing thinking patterns", questions: ["Where is 'good enough' sufficient?", "What am I afraid of if I fail?"] },
  { theme: "scarcity", description: "Beliefs about lack and limitation", questions: ["What do I believe I can't have?", "Is this a fact or a belief?"] },
  { theme: "protection", description: "Self-protective behaviors that may no longer serve", questions: ["What am I protecting myself from?", "Is this protection still needed?"] }
];

const VALUES_COMPASS = [
  { value: "authenticity", description: "Being true to yourself", actions: ["Speak your truth in one conversation today", "Notice when you're performing vs being genuine"] },
  { value: "growth", description: "Continuous learning and development", actions: ["Read/learn something new for 15 minutes", "Reflect on a recent mistake as a lesson"] },
  { value: "connection", description: "Deep relationships with others", actions: ["Reach out to someone you've been meaning to contact", "Give someone your full, undivided attention"] },
  { value: "courage", description: "Acting despite fear", actions: ["Do one thing that scares you slightly", "Share something vulnerable with someone you trust"] },
  { value: "compassion", description: "Kindness toward self and others", actions: ["Offer help to someone who needs it", "Speak to yourself as you would a dear friend"] },
  { value: "creativity", description: "Expressing and creating", actions: ["Make something, even imperfectly", "Approach a routine task in a new way"] },
  { value: "integrity", description: "Alignment between values and actions", actions: ["Keep a promise you made to yourself", "Admit a mistake without defensiveness"] },
  { value: "presence", description: "Full engagement with the moment", actions: ["Put away devices for one hour", "Do one activity with complete attention"] },
  { value: "service", description: "Contributing to others and the world", actions: ["Help someone without expecting anything in return", "Consider how your work serves others"] },
  { value: "wisdom", description: "Understanding and insight", actions: ["Sit with a question without rushing to answer", "Seek advice from someone wiser"] }
];

const EMOTION_TRANSLATIONS = {
  anger: { need: "boundaries, respect, or justice", requests: ["I need you to respect my time", "I need to feel heard before we problem-solve"] },
  sadness: { need: "comfort, connection, or acknowledgment of loss", requests: ["I need some time to process", "I need you to just be with me, not fix anything"] },
  fear: { need: "safety, reassurance, or information", requests: ["I need to understand what's happening", "I need support while I face this"] },
  shame: { need: "acceptance, belonging, or self-compassion", requests: ["I need you to know I'm struggling", "I need to feel like I still belong"] },
  loneliness: { need: "connection, presence, or being seen", requests: ["I need more time together", "I need you to really see how I'm doing"] },
  frustration: { need: "progress, control, or understanding", requests: ["I need to feel like we're moving forward", "I need help removing this obstacle"] },
  anxiety: { need: "predictability, preparation, or support", requests: ["I need to talk through what might happen", "I need help making a plan"] },
  overwhelm: { need: "space, support, or prioritization", requests: ["I need help deciding what matters most", "I need some tasks taken off my plate"] }
};

const BOUNDARY_SCRIPTS = [
  { situation: "Saying no to requests", script: "I appreciate you thinking of me. I need to decline this time to honor my current commitments.", followUp: "Pause after saying no. You don't owe an explanation." },
  { situation: "Addressing crossed boundaries", script: "When [behavior], I feel [emotion]. I need [what you need]. Can we find a way forward?", followUp: "Stay calm and repeat if needed. The first time may not land." },
  { situation: "Ending conversations", script: "I need to wrap up now. Let's continue this at [specific time] if needed.", followUp: "Practice leaving gracefully without guilt." },
  { situation: "Protecting your time", script: "I'm focusing on [priority] right now. I can look at this on [day/time].", followUp: "Guard your peak energy hours." },
  { situation: "Setting emotional limits", script: "I care about you and I'm not in a place to hold this right now. Can we revisit when [condition]?", followUp: "Your capacity fluctuates. That's normal." }
];

const REPAIR_STEPS = [
  { step: 1, name: "Pause", description: "Wait until both people are calm. Repair doesn't work when flooded.", prompt: "Are you both ready to reconnect?" },
  { step: 2, name: "Acknowledge", description: "Name what happened without defensiveness.", prompt: "What did you do or say that may have hurt them?" },
  { step: 3, name: "Empathize", description: "Try to understand their experience, even if you don't agree.", prompt: "What might they have felt when that happened?" },
  { step: 4, name: "Take Responsibility", description: "Own your part, without excuses or justifications.", prompt: "What can you genuinely apologize for?" },
  { step: 5, name: "Make Amends", description: "Ask what would help them feel better.", prompt: "What would repair look like for them?" },
  { step: 6, name: "Commit to Change", description: "Identify what you'll do differently next time.", prompt: "What pattern led to this and how will you interrupt it?" }
];

router.get("/wisdom-ladder", (req, res) => {
  const { duration } = req.query;
  if (duration && WISDOM_LADDERS[duration]) {
    res.json({ ok: true, ladder: WISDOM_LADDERS[duration] });
  } else {
    res.json({ ok: true, ladders: WISDOM_LADDERS });
  }
});

router.get("/micro-courage", (req, res) => {
  res.json({ ok: true, steps: MICRO_COURAGE_STEPS });
});

router.post("/reflection-mirror", (req, res) => {
  const { category } = req.body;
  let prompts = REFLECTION_MIRRORS;
  if (category) {
    prompts = REFLECTION_MIRRORS.filter(m => m.category === category);
  }
  const selected = prompts[Math.floor(Math.random() * prompts.length)];
  res.json({ ok: true, mirror: selected });
});

router.get("/patterns", (req, res) => {
  res.json({ ok: true, patterns: PATTERN_THEMES });
});

router.get("/patterns/summary", (req, res) => {
  const summary = PATTERN_THEMES.map(p => ({
    theme: p.theme,
    description: p.description,
    questionCount: p.questions.length
  }));
  res.json({ ok: true, summary });
});

router.get("/values-compass", (req, res) => {
  res.json({ ok: true, values: VALUES_COMPASS });
});

router.post("/values-compass/select", (req, res) => {
  const { values } = req.body;
  if (!values || !Array.isArray(values) || values.length === 0) {
    return res.status(400).json({ ok: false, error: "Select at least one value" });
  }
  const selected = VALUES_COMPASS.filter(v => values.includes(v.value));
  const dailyActions = selected.flatMap(v => v.actions.map(a => ({ value: v.value, action: a })));
  res.json({ ok: true, selectedValues: selected, dailyActions });
});

router.get("/emotion-translator", (req, res) => {
  res.json({ ok: true, emotions: Object.keys(EMOTION_TRANSLATIONS).map(e => ({ emotion: e, ...EMOTION_TRANSLATIONS[e] })) });
});

router.post("/emotion-translator/translate", (req, res) => {
  const { emotion } = req.body;
  if (!emotion || !EMOTION_TRANSLATIONS[emotion.toLowerCase()]) {
    return res.status(400).json({ ok: false, error: "Unknown emotion", available: Object.keys(EMOTION_TRANSLATIONS) });
  }
  const translation = EMOTION_TRANSLATIONS[emotion.toLowerCase()];
  res.json({ ok: true, emotion, need: translation.need, requests: translation.requests });
});

router.get("/boundary-builder", (req, res) => {
  res.json({ ok: true, scripts: BOUNDARY_SCRIPTS });
});

router.get("/repair-guide", (req, res) => {
  res.json({ ok: true, steps: REPAIR_STEPS });
});


// Health check endpoint for admin daily tools monitoring
router.get("/", (req, res) => {
  res.json({ ok: true, module: "healing-tools", status: "operational", timestamp: new Date().toISOString() });
});

export default router;
