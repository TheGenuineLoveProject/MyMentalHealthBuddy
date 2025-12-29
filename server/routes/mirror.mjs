// server/routes/mirror.mjs
import express from "express";
import OpenAI from "openai";
import rateLimit from "express-rate-limit";

const router = express.Router();

// Rate limiting for mirror API - 20 requests per minute per IP
const mirrorLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { ok: false, error: "Too many requests. Please wait a moment before reflecting again." },
  standardHeaders: true,
  legacyHeaders: false,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL || undefined,
});

function safeTrim(s) {
  return String(s ?? "").replace(/\s+/g, " ").trim();
}

function clamp(s, n = 900) {
  const t = safeTrim(s);
  return t.length > n ? t.slice(0, n).trimEnd() + "…" : t;
}

function buildLocalReflection(inputRaw) {
  const input = clamp(inputRaw, 420);
  const lines = [
    `Here's a gentle mirror of what I'm hearing:`,
    ``,
    `• You shared: "${input}"`,
    ``,
    `It makes sense to feel this way — your system is trying to protect you.`,
    `You don't have to fix everything right now. One kind step is enough.`,
    ``,
    `Try this next (pick ONE):`,
    `1) Take 3 slow breaths (inhale 4, exhale 6).`,
    `2) Write one honest sentence: "Right now I feel ___ and I need ___."`,
    `3) Place a hand on your chest and say: "I'm here. I can take one kind step."`,
    ``,
    `A gentle question:`,
    `If the part of you that feels this way could speak without being judged, what would it say?`,
  ];
  return lines.join("\n");
}

const WISDOM_FRAMEWORKS = [
  { name: "Socratic Inquiry", prompt: "Ask 2-3 gentle questions that invite deeper self-examination without judgment." },
  { name: "Cognitive Reframe", prompt: "Offer one alternative perspective that expands rather than dismisses the feeling." },
  { name: "Somatic Awareness", prompt: "Guide attention to body sensations with a simple grounding exercise." },
  { name: "Values Clarification", prompt: "Gently explore what core value might be connected to this experience." },
  { name: "Compassionate Witness", prompt: "Reflect back what was shared with warmth, validation, and understanding." },
];

function selectFramework(text) {
  const lower = text.toLowerCase();
  if (lower.includes("anxious") || lower.includes("worry") || lower.includes("nervous"))
    return WISDOM_FRAMEWORKS[2]; // Somatic
  if (lower.includes("confused") || lower.includes("understand") || lower.includes("why"))
    return WISDOM_FRAMEWORKS[0]; // Socratic
  if (lower.includes("stuck") || lower.includes("trapped") || lower.includes("can't"))
    return WISDOM_FRAMEWORKS[1]; // Cognitive Reframe
  if (lower.includes("purpose") || lower.includes("meaning") || lower.includes("should"))
    return WISDOM_FRAMEWORKS[3]; // Values
  return WISDOM_FRAMEWORKS[4]; // Compassionate Witness (default)
}

async function generateAIReflection(text, mode = "gentle") {
  const apiKey = process.env.OPENAI_API_KEY || process.env.AI_INTEGRATIONS_OPENAI_API_KEY;
  if (!apiKey) return null;

  const framework = selectFramework(text);
  
  const systemPrompts = {
    gentle: `You are a gentle journaling reflection companion for The Genuine Love Project.
Your role is to offer warm, non-judgmental reflections that honor the user's experience.
Framework for this response: ${framework.name}
${framework.prompt}

Guidelines:
- Never diagnose, prescribe, or give medical advice
- Use "I notice..." or "I'm hearing..." language
- Keep responses 6-10 sentences
- End with one gentle invitation or question
- Be trauma-informed: avoid pushing, let user lead
- Use warm but not saccharine language`,

    deep: `You are a wisdom synthesis companion offering deeper intellectual reflection.
Framework: ${framework.name}
${framework.prompt}

Guidelines:
- Draw from philosophical traditions (Stoic, Buddhist, existential) without naming them
- Invite meta-cognition: thinking about thinking
- Offer one pattern observation and one reframe
- Ask one question that invites growth
- Keep it grounded and practical, not abstract`,

    somatic: `You are a body-based reflection guide.
Help the user notice physical sensations connected to their experience.
${framework.prompt}

Guidelines:
- Guide attention to breath, posture, or tension
- Normalize body responses to emotions
- Offer one simple grounding practice
- Keep it gentle and permission-based`,
  };

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompts[mode] || systemPrompts.gentle },
        { role: "user", content: `Here's what I'm sitting with today:\n\n${text}` },
      ],
      max_tokens: 400,
      temperature: 0.7,
    });

    return {
      reflection: response.choices[0]?.message?.content || null,
      framework: framework.name,
      tokens: response.usage?.total_tokens || 0,
    };
  } catch (err) {
    console.error("Mirror AI error:", err.message);
    return null;
  }
}

function extractInsightCards(text, reflection) {
  const cards = [];
  
  const emotionPatterns = {
    anxiety: ["anxious", "worried", "nervous", "stressed", "overwhelmed"],
    sadness: ["sad", "down", "depressed", "lonely", "empty"],
    anger: ["angry", "frustrated", "irritated", "resentful"],
    confusion: ["confused", "lost", "uncertain", "unsure"],
    hope: ["hope", "better", "grateful", "thankful", "progress"],
  };
  
  const lower = text.toLowerCase();
  let primaryEmotion = "reflection";
  for (const [emotion, keywords] of Object.entries(emotionPatterns)) {
    if (keywords.some(k => lower.includes(k))) {
      primaryEmotion = emotion;
      break;
    }
  }

  cards.push({
    id: "emotional-landscape",
    title: "Emotional Landscape",
    subtitle: "What's present right now",
    body: `Primary theme detected: ${primaryEmotion}. This is information, not judgment. Emotions are data about what matters to you.`,
    badge: "Awareness",
    cta: "What does this emotion want you to know?",
  });

  cards.push({
    id: "pattern-recognition",
    title: "Pattern Recognition",
    subtitle: "Wisdom synthesis",
    body: `When you wrote "${text.slice(0, 60)}...", you may be touching on a recurring theme. Noticing patterns is the first step toward conscious choice.`,
    badge: "Insight",
    cta: "Does this connect to something familiar?",
  });

  cards.push({
    id: "next-step",
    title: "Gentle Next Step",
    subtitle: "One kind action",
    body: primaryEmotion === "anxiety" 
      ? "Try box breathing: inhale 4 counts, hold 4, exhale 4, hold 4. Repeat 3 times."
      : primaryEmotion === "sadness"
      ? "Place a hand on your heart. Say: 'This is hard. I'm allowed to feel this.'"
      : "Write one sentence: 'What I really need right now is...'",
    badge: "Practice",
    cta: "Choose when you're ready",
  });

  return cards;
}

router.post("/", mirrorLimiter, async (req, res) => {
  try {
    const text = safeTrim(req.body?.text);
    const mode = req.body?.mode || "gentle";

    if (text.length < 10) {
      return res.status(400).json({
        ok: false,
        error: "Please write a little more (at least ~10 characters).",
        mode: "validation",
        title: "Gentle Mirror",
        note: "Journaling support only — not medical advice.",
      });
    }

    const aiResult = await generateAIReflection(text, mode);
    const reflection = aiResult?.reflection || buildLocalReflection(text);
    const responseMode = aiResult ? "ai" : "local_fallback";
    const insightCards = extractInsightCards(text, reflection);

    return res.json({
      ok: true,
      reflection,
      mode: responseMode,
      framework: aiResult?.framework || "Compassionate Witness",
      insightCards,
      title: "Gentle Mirror",
      note: "Journaling support only — not medical advice.",
      tokens: aiResult?.tokens || 0,
    });
  } catch (e) {
    console.error("Mirror error:", e.message);
    return res.json({
      ok: true,
      reflection: buildLocalReflection(req.body?.text),
      mode: "local_fallback",
      insightCards: [],
      title: "Gentle Mirror",
      note: "Journaling support only — not medical advice.",
    });
  }
});

router.get("/frameworks", (_req, res) => {
  res.json({
    ok: true,
    frameworks: WISDOM_FRAMEWORKS.map(f => f.name),
    description: "Available reflection frameworks for deeper wisdom synthesis",
  });
});

export default router;
