#!/usr/bin/env node
import fs from "fs";
import express from "express";

const router = express.Router();
const CONTROL_FILE = "config/ai-control.json";
const LOG_DIR = "logs/ai";

router.get("/api/ai/employees", (req, res) => {
  const control = fs.existsSync(CONTROL_FILE)
    ? JSON.parse(fs.readFileSync(CONTROL_FILE, "utf8"))
    : { paused: false, overrides: {} };
  const logs = fs
    .readdirSync(LOG_DIR)
    .filter(f => f.endsWith(".log"))
    .map(f => ({
      file: f,
      lines: fs.readFileSync(`${LOG_DIR}/${f}`, "utf8").split("\n").slice(-10),
    }));
  res.json({ control, logs });
});

router.post("/api/ai/pause", (req, res) => {
  fs.writeFileSync(
    CONTROL_FILE,
    JSON.stringify({ paused: true }, null, 2)
  );
  res.json({ status: "paused" });
});

router.post("/api/ai/resume", (req, res) => {
  fs.writeFileSync(
    CONTROL_FILE,
    JSON.stringify({ paused: false }, null, 2)
  );
  res.json({ status: "resumed" });
});

export default router;