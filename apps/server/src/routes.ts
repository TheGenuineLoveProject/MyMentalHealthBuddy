import type { Express } from "express";
import { storage } from "../storage.js";
import { 
  insertJournalSchema, 
  insertMoodEntrySchema,
  healingRequestSchema 
} from "../../shared/schema.js";
import { generateChatResponse } from "./openai.js";

export function registerRoutes(app: Express) {
  app.post("/api/chat", async (req, res) => {
    try {
      const parsed = healingRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() });
      }

      const userMessage = parsed.data.message;
      const sessionId = req.headers["x-session-id"] as string || `session-${Date.now()}`;

      const history = await storage.getHealingMessagesBySessionId(sessionId);
      const chatHistory = history.map(h => [
        { role: "user" as const, content: h.userMessage },
        { role: "assistant" as const, content: h.aiResponse }
      ]).flat();

      const aiResponse = await generateChatResponse(userMessage, chatHistory);

      const savedMessage = await storage.createHealingMessage({
        userId: null,
        sessionId,
        userMessage,
        aiResponse,
        emotion: null,
        sentiment: null,
        tokensUsed: null,
        isHelpful: null,
        tags: null
      });

      res.json({
        id: savedMessage.id,
        reply: aiResponse,
        sessionId
      });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ error: "Failed to process chat message" });
    }
  });

  app.get("/api/chat/history/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const messages = await storage.getHealingMessagesBySessionId(sessionId);
      res.json(messages);
    } catch (error) {
      console.error("Chat history error:", error);
      res.status(500).json({ error: "Failed to fetch chat history" });
    }
  });

  app.get("/api/journals", async (req, res) => {
    try {
      const userId = req.headers["x-user-id"] as string || "demo-user";
      const journals = await storage.getJournalsByUserId(userId);
      res.json(journals);
    } catch (error) {
      console.error("Get journals error:", error);
      res.status(500).json({ error: "Failed to fetch journals" });
    }
  });

  app.post("/api/journals", async (req, res) => {
    try {
      const userId = req.headers["x-user-id"] as string || "demo-user";
      const parsed = insertJournalSchema.safeParse({
        ...req.body,
        userId
      });

      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() });
      }

      const journal = await storage.createJournal(parsed.data);
      res.status(201).json(journal);
    } catch (error) {
      console.error("Create journal error:", error);
      res.status(500).json({ error: "Failed to create journal entry" });
    }
  });

  app.patch("/api/journals/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.headers["x-user-id"] as string || "demo-user";

      const existing = await storage.getJournalById(id);
      if (!existing) {
        return res.status(404).json({ error: "Journal entry not found" });
      }

      if (existing.userId !== userId) {
        return res.status(403).json({ error: "Not authorized to update this entry" });
      }

      const parsed = insertJournalSchema.partial().safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() });
      }

      const updated = await storage.updateJournal(id, parsed.data);
      res.json(updated);
    } catch (error) {
      console.error("Update journal error:", error);
      res.status(500).json({ error: "Failed to update journal entry" });
    }
  });

  app.delete("/api/journals/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.headers["x-user-id"] as string || "demo-user";

      const existing = await storage.getJournalById(id);
      if (!existing) {
        return res.status(404).json({ error: "Journal entry not found" });
      }

      if (existing.userId !== userId) {
        return res.status(403).json({ error: "Not authorized to delete this entry" });
      }

      await storage.deleteJournal(id);
      res.status(204).send();
    } catch (error) {
      console.error("Delete journal error:", error);
      res.status(500).json({ error: "Failed to delete journal entry" });
    }
  });

  app.get("/api/moods", async (req, res) => {
    try {
      const userId = req.headers["x-user-id"] as string || "demo-user";
      const moods = await storage.getMoodEntriesByUserId(userId);
      res.json(moods);
    } catch (error) {
      console.error("Get moods error:", error);
      res.status(500).json({ error: "Failed to fetch mood entries" });
    }
  });

  app.post("/api/moods", async (req, res) => {
    try {
      const userId = req.headers["x-user-id"] as string || "demo-user";
      const parsed = insertMoodEntrySchema.safeParse({
        ...req.body,
        userId
      });

      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() });
      }

      const moodEntry = await storage.createMoodEntry(parsed.data);
      res.status(201).json(moodEntry);
    } catch (error) {
      console.error("Create mood error:", error);
      res.status(500).json({ error: "Failed to create mood entry" });
    }
  });

  app.get("/api/crisis-resources", async (req, res) => {
    try {
      const country = (req.query.country as string) || "US";
      const resources = await storage.getCrisisResourcesByCountry(country);
      res.json(resources);
    } catch (error) {
      console.error("Get crisis resources error:", error);
      res.status(500).json({ error: "Failed to fetch crisis resources" });
    }
  });
}
