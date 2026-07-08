import express from "express";

const router = express.Router();

router.get("/", (_req, res) => {
  res.json({
    ok: true,
    type: "crisis_support",
    message:
      "If you are in immediate danger or may hurt yourself or someone else, call 911 or local emergency services now. In the U.S. and Canada, call or text 988 for the Suicide & Crisis Lifeline.",
    lifeline: "988",
    disclaimer:
      "This platform is not a replacement for emergency care, therapy, medical care, legal advice, or a licensed professional."
  });
});

export default router;
