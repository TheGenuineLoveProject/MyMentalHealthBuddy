// server/utils/validation.mjs
// Input validation utilities using Zod

import { z } from "zod";

export const emailSchema = z.string().email("Invalid email format").max(255, "Email too long");

export const passwordSchema = z.string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password too long");

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string().max(100, "Name too long").optional()
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required")
});

export const moodSchema = z.object({
  mood: z.number().int().min(1, "Mood must be at least 1").max(10, "Mood cannot exceed 10"),
  notes: z.string().max(1000, "Notes too long").optional()
});

export const journalSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  content: z.string().min(1, "Content is required").max(10000, "Content too long"),
  mood: z.number().int().min(1).max(10).optional()
});

export const chatMessageSchema = z.object({
  message: z.string().min(1, "Message cannot be empty").max(4000, "Message too long")
});

export function validate(schema, data) {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = result.error.errors.map(e => ({
      field: e.path.join('.'),
      message: e.message
    }));
    return { valid: false, errors };
  }
  return { valid: true, data: result.data };
}

export function validateMiddleware(schema) {
  return (req, res, next) => {
    const result = validate(schema, req.body);
    if (!result.valid) {
      return res.status(400).json({
        ok: false,
        error: "Validation failed",
        validationErrors: result.errors,
        timestamp: new Date().toISOString()
      });
    }
    req.validatedBody = result.data;
    next();
  };
}
