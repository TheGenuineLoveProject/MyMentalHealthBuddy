/**
 * useBuddy.ts — MMHB Buddy Engine client hook.
 *
 * Owns Buddy conversation state, exposes send(), and resets visual state to
 * "calm" after BUDDY_IDLE_RESET_MS of inactivity.
 *
 * Talks ONLY to POST /api/buddy. Server is canonical for `state`.
 * Falls back to client-side resolveBuddyState() if the server omits it.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import {
  type BuddyState,
  resolveBuddyState,
  BUDDY_IDLE_RESET_MS,
} from "@/lib/avatarState";

export interface BuddyMessage {
  id: string;
  role: "user" | "buddy";
  text: string;
  state?: BuddyState;
  ts: number;
}

export interface UseBuddyResult {
  state: BuddyState;
  messages: BuddyMessage[];
  isSending: boolean;
  error: string | null;
  send: (text: string) => Promise<void>;
  reset: () => void;
}

const newId = () =>
  (typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `m_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`);

export function useBuddy(): UseBuddyResult {
  const [state, setState] = useState<BuddyState>("calm");
  const [messages, setMessages] = useState<BuddyMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const armIdleReset = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      setState((prev) => (prev === "crisis" ? prev : "calm"));
    }, BUDDY_IDLE_RESET_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, []);

  const send = useCallback(
    async (text: string) => {
      const trimmed = String(text || "").trim();
      if (!trimmed || isSending) return;

      setError(null);
      setIsSending(true);

      const userMsg: BuddyMessage = {
        id: newId(),
        role: "user",
        text: trimmed,
        ts: Date.now(),
      };
      setMessages((m) => [...m, userMsg]);

      try {
        const res = await fetch("/api/buddy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({ message: trimmed }),
        });

        const data = await res.json().catch(() => ({} as Record<string, unknown>));

        if (!res.ok || data?.ok === false) {
          const msg =
            (typeof data?.error === "string" && data.error) ||
            (typeof data?.message === "string" && data.message) ||
            `Request failed (${res.status})`;
          throw new Error(msg);
        }

        const replyText =
          (typeof data?.text === "string" && data.text) ||
          "I'm here with you.";
        const nextState: BuddyState = resolveBuddyState(data?.state ?? replyText);

        const buddyMsg: BuddyMessage = {
          id: newId(),
          role: "buddy",
          text: replyText,
          state: nextState,
          ts: Date.now(),
        };
        setMessages((m) => [...m, buddyMsg]);
        setState(nextState);
        armIdleReset();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Connection error.";
        setError(msg);
      } finally {
        setIsSending(false);
      }
    },
    [isSending, armIdleReset],
  );

  const reset = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    setState("calm");
    setMessages([]);
    setError(null);
  }, []);

  return { state, messages, isSending, error, send, reset };
}

export default useBuddy;
