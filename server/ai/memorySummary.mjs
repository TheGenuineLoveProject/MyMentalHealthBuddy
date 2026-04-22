// server/ai/memorySummary.mjs

import fs from "fs";
import path from "path";

const SUMMARY_DIR = path.resolve("data/memory-summary");

function ensureDir() {
	if (!fs.existsSync(SUMMARY_DIR)) {
		fs.mkdirSync(SUMMARY_DIR, { recursive: true });
	}
}

function getFile(userId) {
	return path.join(SUMMARY_DIR, `${userId}.txt`);
}

export function loadSummary(userId) {
	try {
		ensureDir();
		const file = getFile(userId);
		if (!fs.existsSync(file)) return "";
		return fs.readFileSync(file, "utf-8");
	} catch {
		return "";
	}
}

export function saveSummary(userId, summary) {
	try {
		ensureDir();
		const file = getFile(userId);
		fs.writeFileSync(file, summary);
	} catch (err) {
		console.warn("Summary save failed:", err.message);
	}
}