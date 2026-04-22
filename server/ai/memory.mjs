// server/ai/memory.mjs

import fs from "fs";
import path from "path";
import { saveSummary } from "./memorySummary.mjs";
import { summarizeWithAI } from "./summarizer.mjs";
import { extractProfile } from "./profileExtractor.mjs";
import { loadProfile, saveProfile, mergeProfiles } from "./profileStore.mjs";
import { withLock } from "../utils/asyncLock.mjs";

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
        // Per-user lock: this function does read → modify (across awaits for
        // summarization + profile extraction) → write. Without serializing,
        // two concurrent requests from the same user can read identical state
        // and the second write clobbers the first.
        return withLock(`memory:${userId}`, async () => {
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

                        // Profile extraction: every 2 turns once we have ≥4 messages of material.
                        // Runs BEFORE the summarizer trims history so it sees the full conversation.
                        // Failures are isolated — they must not affect memory persistence.
                        if (openai && history.length >= 4 && history.length % 4 === 0) {
                                try {
                                        const fresh = await extractProfile({ openai, history });
                                        if (fresh) {
                                                const existing = loadProfile(userId);
                                                const merged = mergeProfiles(existing, fresh);
                                                saveProfile(userId, merged);
                                        }
                                } catch (err) {
                                        console.warn("Profile extraction failed:", err.message);
                                }
                        }

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
        });
}
