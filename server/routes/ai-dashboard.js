import express from "express";

const router = express.Router();

// Simple placeholder route
router.get("/", (req, res) => {
  res.json({
    message: "AI Dashboard route is working ✅",
    timestamp: new Date().toISOString(),
  });
});

export default router;