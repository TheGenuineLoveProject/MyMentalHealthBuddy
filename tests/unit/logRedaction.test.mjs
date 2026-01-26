// tests/unit/logRedaction.test.mjs
// Unit tests for log redaction utilities

import { describe, it, expect } from "vitest";
import { redactString, redactObject, hasPII, createSafeLogData } from "../../server/utils/logRedaction.mjs";

describe("Log Redaction Utilities", () => {
  describe("redactString", () => {
    it("should redact email addresses", () => {
      const input = "Contact user@example.com for help";
      const result = redactString(input);
      expect(result).toBe("Contact [EMAIL_REDACTED] for help");
      expect(result).not.toContain("user@example.com");
    });

    it("should redact SSN patterns", () => {
      const input = "SSN: 123-45-6789";
      const result = redactString(input);
      expect(result).toBe("SSN: [SSN_REDACTED]");
    });

    it("should redact credit card numbers", () => {
      const input = "Card: 4111-1111-1111-1111";
      const result = redactString(input);
      expect(result).toBe("Card: [CARD_REDACTED]");
    });

    it("should redact phone numbers", () => {
      const input = "Call 555-123-4567";
      const result = redactString(input);
      expect(result).toBe("Call [PHONE_REDACTED]");
    });

    it("should redact password fields", () => {
      const input = 'password: "mySecret123"';
      const result = redactString(input);
      expect(result).toContain("[REDACTED]");
      expect(result).not.toContain("mySecret123");
    });

    it("should handle non-string input", () => {
      expect(redactString(123)).toBe(123);
      expect(redactString(null)).toBe(null);
      expect(redactString(undefined)).toBe(undefined);
    });
  });

  describe("redactObject", () => {
    it("should redact sensitive fields by name", () => {
      const input = {
        username: "john",
        password: "secret123",
        email: "john@example.com",
      };
      const result = redactObject(input);
      expect(result.username).toBe("john");
      expect(result.password).toBe("[REDACTED]");
      expect(result.email).toBe("[EMAIL_REDACTED]");
    });

    it("should handle nested objects", () => {
      const input = {
        user: {
          name: "John",
          credentials: {
            apiKey: "sk-12345",
            token: "jwt-token",
          },
        },
      };
      const result = redactObject(input);
      expect(result.user.name).toBe("John");
      expect(result.user.credentials.apiKey).toBe("[REDACTED]");
      expect(result.user.credentials.token).toBe("[REDACTED]");
    });

    it("should handle arrays", () => {
      const input = [{ email: "a@b.com" }, { email: "c@d.com" }];
      const result = redactObject(input);
      expect(result[0].email).toBe("[EMAIL_REDACTED]");
      expect(result[1].email).toBe("[EMAIL_REDACTED]");
    });

    it("should handle null and undefined", () => {
      expect(redactObject(null)).toBe(null);
      expect(redactObject(undefined)).toBe(undefined);
    });

    it("should limit recursion depth", () => {
      let deep = { value: "test" };
      for (let i = 0; i < 15; i++) {
        deep = { nested: deep };
      }
      const result = redactObject(deep);
      expect(result).toBeDefined();
    });
  });

  describe("hasPII", () => {
    it("should detect email addresses", () => {
      expect(hasPII("Contact test@example.com")).toBe(true);
    });

    it("should detect SSN", () => {
      expect(hasPII("SSN 123-45-6789")).toBe(true);
    });

    it("should detect credit cards", () => {
      expect(hasPII("Card 4111111111111111")).toBe(true);
    });

    it("should return false for clean text", () => {
      expect(hasPII("Hello world")).toBe(false);
    });

    it("should handle non-string input", () => {
      expect(hasPII(12345)).toBe(false);
    });
  });

  describe("createSafeLogData", () => {
    it("should create safe log data from object", () => {
      const input = {
        action: "login",
        email: "user@example.com",
        password: "secret",
      };
      const result = createSafeLogData(input);
      expect(result.action).toBe("login");
      expect(result.email).toBe("[EMAIL_REDACTED]");
      expect(result.password).toBe("[REDACTED]");
    });
  });
});
