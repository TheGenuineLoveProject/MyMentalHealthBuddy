import { z } from 'zod';

export const zChatMessage = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().min(1)
});

export const zChatRequest = z.object({
  model: z.string().optional(),
  messages: z.array(zChatMessage).min(1),
  tools: z.array(z.string()).optional()
});