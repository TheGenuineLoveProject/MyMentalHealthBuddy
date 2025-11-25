// server/services/aiHandler.mjs
// Thin wrapper around aiService for routes or other callers.

import { askAI } from "./aiService.mjs";

export async function handleAIChat(message) {
  return askAI(message);
}

export default { handleAIChat };

// We do NOT import schema here anymore.
// No more: import * as schema from "../shared/schema.mjs";

// Core AI employee handler
export async function runAIEmployee(req, res) {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message required." });
    }

    const stream = await client.chat.completions.create({
      model: process.env.AI_MODEL || "gpt-5.1",
      stream: true,
      messages: [
        {
          role: "system",
          content:
            process.env.AI_SYSTEM_PROMPT ||
            "You are a calming mental-health buddy.",
        },
        { role: "user", content: message },
      ],
    });

    res.setHeader("Content-Type", "text/event-stream");

    for await (const chunk of stream) {
      const token = chunk.choices?.[0]?.delta?.content || "";
      if (token) {
        res.write(`data:${token}\n\n`);
      }
    }

    res.end();
  } catch (err) {
    console.error("AI-Employee error:", err);
    res.status(500).json({ error: "AI error" });
  }
}