import { Router } from "express";

const router = Router();

router.get("/health", (_req, res) => res.json({ ok: true }));


// Health check endpoint for admin daily tools monitoring
router.get("/", (req, res) => {
  res.json({ ok: true, module: "api", status: "operational", timestamp: new Date().toISOString() });
});

export default router;
export { router };