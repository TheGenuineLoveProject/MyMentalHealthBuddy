/**
 * Phase 32 — CBT Session Engine (opt-in, in-memory by default).
 *
 * All session state lives client-side. Sessions are ephemeral unless the
 * host explicitly persists `getSessionHistory()`. No server transmission
 * of session content (governance: privacy-first).
 */

export type CBTWorksheetType = "thoughtRecord" | "behavioralActivation" | "cognitiveDefusion";
export type CBTSessionStatus = "in-progress" | "completed" | "abandoned";

export interface CBTSession {
  readonly id: string;
  readonly userId: string;
  readonly worksheetType: CBTWorksheetType;
  readonly worksheetId: string;
  readonly status: CBTSessionStatus;
  readonly startedAt: string;
  readonly completedAt?: string;
}

function makeId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `cbt-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * In-memory engine. Hosts wanting persistence wrap `getSessionHistory()`
 * + `replaceSessions()` with their own storage layer (e.g. localStorage,
 * IndexedDB) — never sent server-side without explicit user opt-in.
 */
export class CBTSessionEngine {
  private sessions: CBTSession[] = [];

  startSession(userId: string, worksheetType: CBTWorksheetType, worksheetId: string): CBTSession {
    if (!userId) throw new Error("userId is required");
    if (!worksheetId) throw new Error("worksheetId is required");
    const session: CBTSession = {
      id: makeId(),
      userId,
      worksheetType,
      worksheetId,
      status: "in-progress",
      startedAt: new Date().toISOString(),
    };
    this.sessions = [...this.sessions, session];
    return session;
  }

  submitWorksheet(sessionId: string): CBTSession {
    return this.transition(sessionId, "completed");
  }

  abandonSession(sessionId: string): CBTSession {
    return this.transition(sessionId, "abandoned");
  }

  getSessionHistory(userId?: string): ReadonlyArray<CBTSession> {
    return userId ? this.sessions.filter((s) => s.userId === userId) : this.sessions.slice();
  }

  /** Replace all sessions (used by host persistence layer on hydrate). */
  replaceSessions(sessions: ReadonlyArray<CBTSession>): void {
    this.sessions = sessions.slice();
  }

  /** Wipe all sessions (consent-revoke flow). */
  clear(): void {
    this.sessions = [];
  }

  private transition(sessionId: string, next: CBTSessionStatus): CBTSession {
    const idx = this.sessions.findIndex((s) => s.id === sessionId);
    if (idx === -1) throw new Error(`session ${sessionId} not found`);
    const current = this.sessions[idx]!;
    if (current.status !== "in-progress") {
      throw new Error(`session ${sessionId} is already ${current.status}`);
    }
    const updated: CBTSession = {
      ...current,
      status: next,
      completedAt: new Date().toISOString(),
    };
    this.sessions = [...this.sessions.slice(0, idx), updated, ...this.sessions.slice(idx + 1)];
    return updated;
  }
}
