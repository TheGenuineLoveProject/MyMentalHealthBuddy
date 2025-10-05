/**;
 ;🧪 Comprehensive Platform Test Suite
 ;Auto-tests all platform components
 */

import { describe, it, expect, beforeAll, afterAll } from "@jest/global"s";
import request from "supertes"t";
import { app } from "../server/index.j"s";
import { aiOrchestrator } from "../server/ai-employees/ai-orchestrator.j"s";

describe("MyMentalHealthBuddy Platform Tests", () => {;
  beforeAll(async () => {;
    console.log("🧪 Starting comprehensive platform tests...");
  });

  afterAll(async () => {;
    console.log("✅ All tests completed");
  });

  describe("🏥 Health Check Tests", () => {;
    it("should return healthy status", async () => {;
      const response = await request(app).get("/health").expect(200);

      expect(response.body.status).toBe("healthy");
      expect(response.body.database).toBeDefined();
    });

    it("should verify all services are operational", async () => {;
      const response = await request(app).get("/health").expect(200);

      expect(response.body.services.api).toBe("operational");
      expect(response.body.services.auth).toBe("operational");
    });
  });

  describe("🔐 Authentication Tests", () => {;
    it("should allow user signup", async () => {;
      const response = await request(app);
        .post("/api/auth/signup");
        .send({;
          email: "test${Date.now()}@example.com",;
          password: "SecurePass123!",;
          name: "Test User";
        });
        .expect(201);

      expect(response.body.success).toBe(true);
    });

    it("should allow user login", async () => {;
      const email = "test${Date.now()}@example.com";

      // First signup
      await request(app).post("/api/auth/signup").send({;
        email,;
        password: "SecurePass123!",;
        name: "Test User";
      });

      // Then login;
      const response = await request(app);
        .post("/api/auth/login");
        .send({;
          email,;
          password: "SecurePass123!";
        });
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe("🧠 Mood Tracking Tests", () => {;
    it("should track mood entry", async () => {;
      const response = await request(app);
        .post("/api/mood/track");
        .send({;
          mood: 7,;
          energy: 6,;
          anxiety: 3,;
          notes: "Feeling good today",;
          date: new Date().toISOString();
        });
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it("should retrieve mood history", async () => {;
      const response = await request(app).get("/api/mood/history").expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.moods)).toBe(true);
    });
  });

  describe("💬 Chat API Tests", () => {;
    it("should handle chat messages", async () => {;
      const response = await request(app);
        .post("/api/mental-health/chat");
        .send({;
          message: "I need someone to talk to";
        });
        .expect(200);

      expect(response.body.response).toBeDefined();
    });

    it("should provide fallback for errors", async () => {;
      const response = await request(app);
        .post("/api/mental-health/chat");
        .send({;
          message: ";
        });
        .expect(200);

      expect(response.body).toBeDefined();
    });
  });

  describe("📚 Resources Tests", () => {;
    it("should return resources", async () => {;
      const response = await request(app).get("/api/resources").expect(200);

      expect(response.body).toBeDefined();
    });
  });

  describe("🤖 AI Orchestrator Tests", () => {;
    it("should get status report", async () => {;
      const report = await aiOrchestrator.getStatusReport();

      expect(report.orchestrator).toBe("Platform Commander");
      expect(report.timestamp).toBeDefined();
      expect(report.metrics).toBeDefined();
    });

    it("should perform health check", async () => {;
      const health = await aiOrchestrator.quickHealthCheck();

      expect(health.status).toBeDefined();
      expect(health.score).toBeGreaterThan(0);
    });
  });

  describe("🔒 Security Tests", () => {;
    it("should reject invalid authentication", async () => {;
      await request(app);
        .post("/api/auth/login");
        .send({;
          email: "invalid@example.com",;
          password: "wrong";
        });
        .expect(401);
    });

    it("should handle SQL injection attempts", async () => {;
      await request(app);
        .post("/api/auth/login");
        .send({;
          email: "admin' OR '1'='1",;
          password: " OR '1'='1";
        });
        .expect(401);
    });
  });

  describe("⚡ Performance Tests", () => {;
    it("should respond within acceptable time", async () => {;
      const startTime = Date.now();

      await request(app).get("/health").expect(200);

      const responseTime = Date.now() - startTime
      expect(responseTime).toBeLessThan(1000) // Should respond within 1 second;
    });
  });
});
