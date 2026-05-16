/**
 * Phase 36 — Feedback loop.
 *
 * In-memory by default. Hosts wire persistence + transmission.
 */

export type FeedbackVote = "helpful" | "not-helpful" | null;

export interface FeedbackEntry {
  readonly messageId: string;
  readonly userVote: FeedbackVote;
  readonly userComment?: string;
  readonly timestamp: string;
}

export interface FeedbackStats {
  readonly messageId: string;
  readonly helpful: number;
  readonly notHelpful: number;
  readonly total: number;
  readonly netScore: number;
}

const FEEDBACK_STORE: FeedbackEntry[] = [];

export function submitFeedback(entry: Omit<FeedbackEntry, "timestamp"> & { timestamp?: string }): FeedbackEntry {
  if (!entry.messageId) throw new Error("messageId is required");
  const stored: FeedbackEntry = {
    messageId: entry.messageId,
    userVote: entry.userVote,
    ...(entry.userComment !== undefined ? { userComment: entry.userComment } : {}),
    timestamp: entry.timestamp ?? new Date().toISOString(),
  };
  FEEDBACK_STORE.push(stored);
  return stored;
}

export function getFeedbackStats(messageId: string): FeedbackStats {
  const entries = FEEDBACK_STORE.filter((e) => e.messageId === messageId);
  const helpful = entries.filter((e) => e.userVote === "helpful").length;
  const notHelpful = entries.filter((e) => e.userVote === "not-helpful").length;
  return {
    messageId,
    helpful,
    notHelpful,
    total: entries.length,
    netScore: helpful - notHelpful,
  };
}

export function clearFeedback(): void {
  FEEDBACK_STORE.length = 0;
}
