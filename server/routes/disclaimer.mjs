import express from "express";

const router = express.Router();

router.get("/", (_req, res) => {
  res.json({
    ok: true,
    type: "clinical_disclaimer",
    disclaimer:
      "This platform provides educational wellness support only. It is not medical advice, therapy, diagnosis, crisis care, legal advice, or a substitute for a licensed professional.",
    professionalSupport:
      "For personal medical, mental health, legal, or safety concerns, contact a licensed clinician, qualified professional, emergency service, or crisis hotline."
  });
});

export default router;
