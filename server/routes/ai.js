import express from "express";
import { AI_EMPLOYEES } from "../core/ai-employees.mjs";
const router = express.Router();

router.get("/status", (_, res) => {
  res.json(AI_EMPLOYEES.map(e => ({
    ...e,
    last_run: new Date().toISOString(),
    status: "✅ Active"
  })));
});

export default router;