// server/validation/schemas.mjs
// Centralized Zod validation schemas for API requests

import { z } from "zod";

// Auth schemas
export const registerSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password is too long"),
  name: z.string().max(255, "Name is too long").optional(),
});

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

// Mood schemas
export const createMoodSchema = z.object({
  rating: z
    .number()
    .int("Rating must be a whole number")
    .min(1, "Rating must be at least 1")
    .max(10, "Rating cannot exceed 10"),
  emotion: z.string().max(255, "Emotion is too long").optional().nullable(),
  content: z.string().max(5000, "Content is too long").optional().nullable(),
  score: z.number().int().min(1).max(10).optional().nullable(),
  energyLevel: z.number().int().min(1).max(10).optional().nullable(),
  sleepQuality: z.number().int().min(1).max(10).optional().nullable(),
  activities: z.union([
    z.array(z.string().max(100)),
    z.string().max(1000),
  ]).optional().nullable(),
  triggers: z.string().max(1000).optional().nullable(),
  weather: z.string().max(255).optional().nullable(),
  location: z.string().max(255).optional().nullable(),
});

export const updateMoodSchema = createMoodSchema.partial();

// Journal schemas
export const createJournalSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title is too long"),
  content: z
    .string()
    .min(1, "Content is required")
    .max(50000, "Content is too long"),
});

export const updateJournalSchema = createJournalSchema.partial().refine(
  (data) => data.title !== undefined || data.content !== undefined,
  { message: "At least one field (title or content) must be provided" }
);

// AI Chat schemas
export const chatMessageSchema = z.object({
  message: z
    .string()
    .min(1, "Message is required")
    .max(10000, "Message is too long"),
  sessionId: z.string().optional(),
});

// Helper function to validate request body
export function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.flatten();
      return res.status(400).json({
        ok: false,
        message: "Validation failed",
        errors: errors.fieldErrors,
      });
    }
    req.validatedBody = result.data;
    next();
  };
}
