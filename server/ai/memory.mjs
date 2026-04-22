// server/ai/memory.mjs

import fs from "fs";
import path from "path";
import { saveSummary } from "./memorySummary.mjs";
import { summarizeWithAI } from "./summarizer.mjs";

const MEMORY_DIR = path.resolve("data/memory");

// ensure directory exists
function ensureDir() {
        if (!fs.existsSync(MEMORY_DIR)) {
                fs.mkdirSync(MEMORY_DIR, { recursive: true });
        }
}

// resolve file per user (sanitize to prevent path traversal)
function getFile(userId) {
        const safeId = String(userId || "anonymous")
                .replace(/[^a-zA-Z0-9_-]/g, "_")
                .slice(0, 100) || "anonymous";
        return path.join(MEMORY_DIR, `${safeId}.json`);
}

/**
 * Load last N messages for context
 */
export function loadMemory(userId, limit = 6) {
        try {
                ensureDir();

                const file = getFile(userId);
                if (!fs.existsSync(file)) return [];

                const data = JSON.parse(fs.readFileSync(file, "utf-8"));

                return data.slice(-limit);
        } catch {
                return [];
        }
}

/**
 * Save interaction
 */
        export async function saveMemory(userId, message, reply, openai) {
        try {
                ensureDir();

                const file = getFile(userId);

                let history = [];
                if (fs.existsSync(file)) {
                        history = JSON.parse(fs.readFileSync(file, "utf-8"));
                }

                history.push(
                        { role: "user", content: message },
                        { role: "assistant", content: reply }
                );

                // trigger summarization if too large
                if (history.length > 12) {

                        const summary = await summarizeWithAI({
                          openai,
                          history
                        });
                        saveSummary(userId, summary);

                        // keep only last few messages
                        history = history.slice(-6);
                }

                fs.writeFileSync(file, JSON.stringify(history, null, 2));
        } catch (err) {
                console.warn("Memory save failed:", err.message);
        }
}
function summarizeHistory(history) {
        const lastMessages = history.slice(-12);

        const combined = lastMessages
                .map(m => `${m.role}: ${m.content}`)
                .join("\n");

        return `
User context summary:
- Emotional patterns: recurring stress/anxiety themes
- Topics discussed: ${combined.slice(0, 300)}
- Tone: user seeks support and understanding
`.trim();
}