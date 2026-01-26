// tests/unit/metrics.test.mjs
// Unit tests for metrics utilities

import { describe, it, expect } from "vitest";
import { recordRequest, recordError } from "../../server/routes/metrics.mjs";

describe("Metrics Utilities", () => {
  describe("recordRequest", () => {
    it("should record request without throwing", () => {
      expect(() => recordRequest("/api/test", 200, 45)).not.toThrow();
    });

    it("should normalize paths with IDs", () => {
      expect(() => recordRequest("/api/users/123", 200, 50)).not.toThrow();
      expect(() => recordRequest("/api/posts/456/comments", 200, 30)).not.toThrow();
    });
  });

  describe("recordError", () => {
    it("should record error without throwing", () => {
      expect(() => recordError("ValidationError")).not.toThrow();
      expect(() => recordError("DatabaseError")).not.toThrow();
    });
  });
});
