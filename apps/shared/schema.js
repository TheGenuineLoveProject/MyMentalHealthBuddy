import { z } from "zod";
export const insertJournalSchema = z.object({
    userId: z.string(),
    title: z.string().nullable().optional(),
    content: z.string().min(1, "Content is required"),
    mood: z.string().nullable().optional(),
    tags: z.array(z.string()).nullable().optional(),
    isPrivate: z.boolean().optional().default(false)
});
export const insertMoodEntrySchema = z.object({
    userId: z.string(),
    mood: z.string().min(1, "Mood is required"),
    intensity: z.number().min(1).max(10),
    notes: z.string().nullable().optional(),
    activities: z.array(z.string()).nullable().optional(),
    triggers: z.array(z.string()).nullable().optional()
});
export const healingRequestSchema = z.object({
    message: z.string().min(1, "Message is required")
});
export const insertCrisisResourceSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    country: z.string().min(2).max(2),
    phoneNumber: z.string().nullable().optional(),
    website: z.string().url().nullable().optional(),
    type: z.string().min(1),
    isActive: z.boolean().optional().default(true),
    priority: z.number().nullable().optional()
});
