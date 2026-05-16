/**
 * Phase 32 — React hook wrapper around `CBTSessionEngine`.
 *
 * Each hook instance owns its own engine reference (per-userId scope).
 * Stats are derived, not stored — no analytics persisted server-side.
 */

import { useCallback, useMemo, useRef, useState } from "react";
import {
  CBTSessionEngine,
  type CBTSession,
  type CBTWorksheetType,
} from "./CBTSessionEngine";

export interface CBTSessionStats {
  readonly totalCompleted: number;
  readonly totalAbandoned: number;
  readonly avgCompletionTimeMs: number;
  readonly mostUsedWorksheet: CBTWorksheetType | null;
}

export interface UseCBTSessionApi {
  readonly sessions: ReadonlyArray<CBTSession>;
  readonly startNew: (worksheetType: CBTWorksheetType, worksheetId: string) => CBTSession;
  readonly submit: (sessionId: string) => CBTSession;
  readonly abandon: (sessionId: string) => CBTSession;
  readonly stats: CBTSessionStats;
}

function computeStats(sessions: ReadonlyArray<CBTSession>): CBTSessionStats {
  const completed = sessions.filter((s) => s.status === "completed");
  const abandoned = sessions.filter((s) => s.status === "abandoned");
  let avgCompletionTimeMs = 0;
  if (completed.length > 0) {
    const total = completed.reduce((sum, s) => {
      if (!s.completedAt) return sum;
      return sum + (new Date(s.completedAt).getTime() - new Date(s.startedAt).getTime());
    }, 0);
    avgCompletionTimeMs = total / completed.length;
  }
  const counts = new Map<CBTWorksheetType, number>();
  for (const s of sessions) counts.set(s.worksheetType, (counts.get(s.worksheetType) ?? 0) + 1);
  let mostUsed: CBTWorksheetType | null = null;
  let mostCount = 0;
  for (const [type, c] of counts) {
    if (c > mostCount) {
      mostCount = c;
      mostUsed = type;
    }
  }
  return {
    totalCompleted: completed.length,
    totalAbandoned: abandoned.length,
    avgCompletionTimeMs,
    mostUsedWorksheet: mostUsed,
  };
}

export function useCBTSession(userId: string): UseCBTSessionApi {
  const engineRef = useRef<CBTSessionEngine | null>(null);
  if (engineRef.current === null) engineRef.current = new CBTSessionEngine();
  const [sessions, setSessions] = useState<ReadonlyArray<CBTSession>>([]);

  const refresh = useCallback(() => {
    setSessions(engineRef.current!.getSessionHistory(userId));
  }, [userId]);

  const startNew = useCallback(
    (worksheetType: CBTWorksheetType, worksheetId: string) => {
      const s = engineRef.current!.startSession(userId, worksheetType, worksheetId);
      refresh();
      return s;
    },
    [refresh, userId],
  );

  const submit = useCallback(
    (sessionId: string) => {
      const s = engineRef.current!.submitWorksheet(sessionId);
      refresh();
      return s;
    },
    [refresh],
  );

  const abandon = useCallback(
    (sessionId: string) => {
      const s = engineRef.current!.abandonSession(sessionId);
      refresh();
      return s;
    },
    [refresh],
  );

  const stats = useMemo(() => computeStats(sessions), [sessions]);

  return { sessions, startNew, submit, abandon, stats };
}
