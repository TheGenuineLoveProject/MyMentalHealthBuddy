// RESTORE PACK v8 — Minimal, Stable Backend
// ESM-only, no bcryptjs, Replit-friendly

import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

// ────────────────────────────────────────────
// BASIC APP SETUP
// ────────────────────────────────────────────

const app = express();

// Replit uses PORT env sometimes; we default to 5000
const PORT = process.env.PORT || 5000;

// Trust Replit proxy (for correct protocol / IP)
app.set("trust proxy", 1);

// Core middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })
);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true
  })
);

app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// ────────────────────────────────────────────
// HEALTH CHECK
// ────────────────────────────────────────────

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    env: process.env.NODE_ENV || "development",
    time: new Date().toISOString()
  });
});

// ────────────────────────────────────────────
// AI CHAT (SAFE, OPTIONAL OPENAI)
// ────────────────────────────────────────────

let openai = null;

if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
}

app.post("/api/ai/chat", async (req, res) => {
  const { message } = req.body || {};

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Missing 'message' in request body." });
  }

  // If OpenAI is not configured, return a gentle fallback
  if (!openai) {
    return res.json({
      reply:
        "AI isn’t fully configured yet, but I’m here with you. 💛 Your feelings matter, and you’re not alone."
    });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are MyMentalHealthBuddy, a gentle, trauma-informed companion. You are NOT a therapist. You offer short, warm, non-clinical emotional support, always encouraging users to seek professional help in emergencies."
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 200,
      temperature: 0.7
    });

    const reply =
      completion.choices?.[0]?.message?.content ||
      "I’m here with you and I care about what you’re going through. 💛";

    res.json({ reply });
  } catch (err) {
    console.error("AI chat error:", err);
    res.status(500).json({
      error: "AI error",
      fallback:
        "Something went wrong on the tech side, but your emotions are still valid. If you’re in crisis, please reach out to local emergency services or a trusted professional."
    });
  }
});

// ────────────────────────────────────────────
// SIMPLE IN-MEMORY MOOD ENDPOINTS (PLACEHOLDER)
// ────────────────────────────────────────────

const inMemoryMoodLog = [];

app.post("/api/mood", (req, res) => {
  const { score, note } = req.body || {};

  const entry = {
    id: inMemoryMoodLog.length + 1,
    score: typeof score === "number" ? score : null,
    note: typeof note === "string" ? note : "",
    createdAt: new Date().toISOString()
  };

  inMemoryMoodLog.push(entry);

  res.status(201).json({
    saved: true,
    entry
  });
});

app.get("/api/mood", (req, res) => {
  res.json({
    items: inMemoryMoodLog
  });
});

// ────────────────────────────────────────────
// FALLBACK 404 HANDLER
// ────────────────────────────────────────────

app.use((req, res) => {
  res.status(404).json({
    error: "Not found",
    path: req.originalUrl
  });
});

// ────────────────────────────────────────────
// START SERVER
// ────────────────────────────────────────────

app.listen(PORT, "0.0.0.0", () => {
  console.log("🧠 RESTORE PACK v8 server online");
  console.log(`🚀 Listening on http://0.0.0.0:${PORT}`);
});