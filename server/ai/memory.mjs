// server/ai/memory.mjs

import fs from "fs";
import path from "path";
import { loadSummary, saveSummary } from "./memorySummary.mjs";

const MEMORY_DIR = path.resolve("data/memory");

// ensure directory exists
function ensureDir() {
	if (!fs.existsSync(MEMORY_DIR)) {
		fs.mkdirSync(MEMORY_DIR, { recursive: true });
	}
}

// resolve file per user
function getFile(userId) {
	return path.join(MEMORY_DIR, `${userId}.json`);
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
export function saveMemory(userId, message, reply) {
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

		// keep memory bounded (last 20 messages)
		history = history.slice(-20);

		fs.writeFileSync(file, JSON.stringify(history, null, 2));
	} catch (err) {
		console.warn("Memory save failed:", err.message);
	}
}