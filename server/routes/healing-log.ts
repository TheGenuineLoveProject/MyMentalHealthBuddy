import { Router } from "express";
import { startHealing } from "../../src/utils/startHealing.js";

const router = Router();

router.get("/stream-healing", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  function logStream(message: string) {
    res.write(`data: ${message}\n\n`);
  }

  try {
    await startHealing({ log: logStream });
    logStream("✅ Healing complete!");
  } catch (err) {
    logStream("❌ Healing failed: " + err);
  }

  res.end();
});

export default router;
