import express from "express";

export function createTestApp() {
  const app = express();
  app.use(express.json());

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "API is running" });
  });

  app.post("/api/auth/signup", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }
    res.status(201).json({ id: "u1", email });
  });

  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }
    res.json({ token: "mock-jwt-token", user: { id: "u1", email } });
  });

  app.get("/api/mood", (req, res) => {
    res.json([{ id: "m1", score: 7, note: "Good day" }]);
  });

  app.post("/api/mood", (req, res) => {
    const { score, note } = req.body;
    res.status(201).json({ id: "m2", score, note });
  });

  app.get("/api/journal", (req, res) => {
    res.json([{ id: "j1", title: "Test", content: "Test content" }]);
  });

  app.post("/api/journal", (req, res) => {
    const { title, content } = req.body;
    res.status(201).json({ id: "j2", title, content });
  });

  app.post("/api/ai/chat", (req, res) => {
    res.json({ response: "I'm here to help you." });
  });

  return app;
}
