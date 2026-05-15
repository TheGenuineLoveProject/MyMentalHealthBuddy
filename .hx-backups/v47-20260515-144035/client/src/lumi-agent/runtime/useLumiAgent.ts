/**
 * Phase 36 — React hook for Lumi agent.
 *
 * Manages message history locally. Crisis triggered state is exposed
 * to the host so the host can mount the lumi-crisis CrisisPanel.
 */

import { useCallback, useMemo, useRef, useState } from "react";
import {
  AgentRuntime,
  type AgentChatFn,
  type AgentMessage,
} from "./AgentRuntime";

export interface UseLumiAgentConfig {
  readonly chatFn: AgentChatFn;
  readonly model?: string;
  readonly temperature?: number;
  readonly maxTokens?: number;
  readonly timeoutMs?: number;
  readonly fallbackMessage?: string;
  readonly onCrisisDetected?: () => void;
}

export interface UseLumiAgentApi {
  readonly messages: ReadonlyArray<AgentMessage>;
  readonly send: (userText: string) => Promise<void>;
  readonly clear: () => void;
  readonly isLoading: boolean;
  readonly error: Error | null;
  readonly crisisTriggered: boolean;
}

export function useLumiAgent(config: UseLumiAgentConfig): UseLumiAgentApi {
  const runtimeRef = useRef<AgentRuntime | null>(null);
  if (runtimeRef.current === null) {
    runtimeRef.current = new AgentRuntime({
      chatFn: config.chatFn,
      model: config.model,
      temperature: config.temperature,
      maxTokens: config.maxTokens,
      timeoutMs: config.timeoutMs,
      fallbackMessage: config.fallbackMessage,
    });
  }
  const [messages, setMessages] = useState<ReadonlyArray<AgentMessage>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [crisisTriggered, setCrisisTriggered] = useState(false);

  const send = useCallback(
    async (userText: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await runtimeRef.current!.sendMessage(userText);
        setMessages(runtimeRef.current!.getMessages());
        if (result.crisisTriggered) {
          setCrisisTriggered(true);
          if (config.onCrisisDetected) config.onCrisisDetected();
        }
      } catch (e) {
        setError(e instanceof Error ? e : new Error(String(e)));
      } finally {
        setIsLoading(false);
      }
    },
    [config],
  );

  const clear = useCallback(() => {
    runtimeRef.current!.clear();
    setMessages([]);
    setCrisisTriggered(false);
    setError(null);
  }, []);

  return useMemo(
    () => ({ messages, send, clear, isLoading, error, crisisTriggered }),
    [messages, send, clear, isLoading, error, crisisTriggered],
  );
}
