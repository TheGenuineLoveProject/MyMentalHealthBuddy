import express from "express";
import { requireAuth, requireAdmin } from "../middleware/auth.mjs";
import {
  getKernelVersion,
  runKernelHealthChecks,
  validatePromptSpec,
  getSchema,
} from "../engine/prompt-os/kernel-bridge.mjs";

const router = express.Router();

router.get("/version", (_req, res) => {
  res.json(getKernelVersion());
});

router.get("/health", requireAuth, requireAdmin, (_req, res) => {
  const result = runKernelHealthChecks();
  res.json(result);
});

router.post("/validate", requireAuth, requireAdmin, (req, res) => {
  const { moduleSpec } = req.body || {};
  const result = validatePromptSpec(moduleSpec);
  res.json(result);
});

router.get("/schema", requireAuth, requireAdmin, (_req, res) => {
  res.json(getSchema());
});

export default router;
