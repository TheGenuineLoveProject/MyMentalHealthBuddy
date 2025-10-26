import { z } from "zod";

export interface User {
  id: string;
  username: string;
  email: string | null;
  password: string;
  name: string | null;
  role: string;
  isActive: boolean;
  createdAt: Date;
  lastLogin: Date | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  subscriptionTier: string;
  subscriptionStatus: string;
  subscriptionEndDate: Date | null;
  profileImage: string | null;
  preferences: Record<string, any>;
}

export interface InsertUser {
  username: string;
  email?: string | null;
  password: string;
  name?: string | null;
}

export interface HealingMessage {
  id: string;
  userId: string | null;
  sessionId: string | null;
  userMessage: string;
  aiResponse: string;
  emotion: string | null;
  sentiment: string | null;
  timestamp: Date;
  tokensUsed: number | null;
  isHelpful: boolean | null;
  tags: string[] | null;
}

export interface InsertHealingMessage {
  userId: string | null;
  sessionId: string | null;
  userMessage: string;
  aiResponse: string;
  emotion?: string | null;
  sentiment?: string | null;
  tokensUsed?: number | null;
  isHelpful?: boolean | null;
  tags?: string[] | null;
}

export interface SelectJournal {
  id: string;
  userId: string;
  title: string;
  content: string;
  mood: string | null;
  tags: string[] | null;
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface InsertJournal {
  userId: string;
  title: string;
  content: string;
  mood?: string | null;
  tags?: string[] | null;
  isPrivate?: boolean;
}

export interface SelectMoodEntry {
  id: string;
  userId: string;
  moodLevel: number;
  emotions: string[] | null;
  note: string | null;
  activities: string[] | null;
  sleep: number | null;
  exercise: number | null;
  socialInteraction: number | null;
  stress: number | null;
  createdAt: Date;
}

export interface InsertMoodEntry {
  userId: string;
  moodLevel: number;
  emotions?: string[] | null;
  note?: string | null;
  activities?: string[] | null;
  sleep?: number | null;
  exercise?: number | null;
  socialInteraction?: number | null;
  stress?: number | null;
}

export interface SelectCrisisResource {
  id: string;
  name: string;
  description: string;
  country: string;
  phoneNumber: string | null;
  website: string | null;
  type: string;
  isActive: boolean;
}

export interface InsertCrisisResource {
  name: string;
  description: string;
  country: string;
  phoneNumber?: string | null;
  website?: string | null;
  type: string;
  isActive?: boolean;
}

export const insertJournalSchema = z.object({
  userId: z.string(),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  mood: z.string().nullable().optional(),
  tags: z.array(z.string()).nullable().optional(),
  isPrivate: z.boolean().optional().default(false)
});

export const insertMoodEntrySchema = z.object({
  userId: z.string(),
  moodLevel: z.number().min(1).max(10),
  emotions: z.array(z.string()).nullable().optional(),
  note: z.string().nullable().optional(),
  activities: z.array(z.string()).nullable().optional(),
  sleep: z.number().min(0).max(24).nullable().optional(),
  exercise: z.number().min(0).nullable().optional(),
  socialInteraction: z.number().min(1).max(10).nullable().optional(),
  stress: z.number().min(1).max(10).nullable().optional()
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
  isActive: z.boolean().optional().default(true)
});
