export type ChatMessage = { role: 'user'|'assistant'|'system'; content: string };
export type ChatRequest = { model?: string; messages: ChatMessage[]; tools?: string[] };
export type ChatResponse = { id: string; reply: string; usedTools: string[]; meta: Record<string, unknown> };
export type JournalEntry = { id: string; userId: string; content: string; mood?: string; createdAt: string };