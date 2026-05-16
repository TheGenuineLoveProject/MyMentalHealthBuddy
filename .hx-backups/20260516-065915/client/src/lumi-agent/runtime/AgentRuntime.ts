/**
 * Phase 36 — AgentRuntime.
 *
 * Adapter pattern: this runtime never imports an LLM SDK. The host
 * passes a `chatFn` callback that does the actual model call. This
 * keeps the module zero-dependency and provider-agnostic.
 *
 * Hardened path: every user message and every model response is run
 * through `evaluateGuardrails` BEFORE being shown to the user.
 */

import { LUMI_SYSTEM_PROMPT } from "../prompts/lumiSystemPrompt";
import {
  evaluateGuardrails,
  type SafetyGuardrail,
} from "../prompts/lumiSafetyGuardrails";

export type AgentMessageRole = "system" | "user" | "assistant";

export interface AgentMessage {
  readonly id: string;
  readonly role: AgentMessageRole;
  readonly content: string;
  readonly timestamp: string;
}

export interface AgentChatRequest {
  readonly systemPrompt: string;
  readonly messages: ReadonlyArray<AgentMessage>;
  readonly temperature: number;
  readonly maxTokens: number;
  readonly timeoutMs: number;
  readonly signal?: AbortSignal;
}

export type AgentChatFn = (req: AgentChatRequest) => Promise<string>;

export interface AgentSendResult {
  readonly userMessage: AgentMessage;
  readonly assistantMessage: AgentMessage;
  readonly crisisTriggered: boolean;
  readonly redirectedBy?: SafetyGuardrail;
}

export interface AgentRuntimeOptions {
  readonly chatFn: AgentChatFn;
  readonly model?: string;
  readonly temperature?: number;
  readonly maxTokens?: number;
  readonly timeoutMs?: number;
  readonly fallbackMessage?: string;
}

export const DEFAULT_FALLBACK_MESSAGE =
  "I'm having trouble responding. Please try again or reach out to 988 if you need immediate support.";

function makeId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `msg-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function makeMessage(role: AgentMessageRole, content: string): AgentMessage {
  return { id: makeId(), role, content, timestamp: new Date().toISOString() };
}

export class AgentRuntime {
  private messages: AgentMessage[] = [];
  private readonly chatFn: AgentChatFn;
  private readonly temperature: number;
  private readonly maxTokens: number;
  private readonly timeoutMs: number;
  private readonly fallbackMessage: string;

  constructor(opts: AgentRuntimeOptions) {
    this.chatFn = opts.chatFn;
    this.temperature = Math.min(Math.max(opts.temperature ?? 0.5, 0), 0.7);
    this.maxTokens = Math.min(Math.max(opts.maxTokens ?? 150, 1), 150);
    this.timeoutMs = Math.min(Math.max(opts.timeoutMs ?? 10_000, 1), 10_000);
    this.fallbackMessage = opts.fallbackMessage ?? DEFAULT_FALLBACK_MESSAGE;
  }

  getMessages(): ReadonlyArray<AgentMessage> {
    return this.messages.slice();
  }

  clear(): void {
    this.messages = [];
  }

  async sendMessage(userText: string): Promise<AgentSendResult> {
    if (!userText || !userText.trim()) {
      throw new Error("[lumi-agent] userText is required");
    }

    const userMessage = makeMessage("user", userText);
    this.messages = [...this.messages, userMessage];

    // Pre-LLM guardrail evaluation.
    const inboundMatches = evaluateGuardrails(userText);
    const blocking = inboundMatches.find((m) => m.guardrail.action === "block");
    if (blocking) {
      const assistantMessage = makeMessage("assistant", blocking.guardrail.message);
      this.messages = [...this.messages, assistantMessage];
      return { userMessage, assistantMessage, crisisTriggered: false, redirectedBy: blocking.guardrail };
    }
    const redirecting = inboundMatches.find((m) => m.guardrail.action === "redirect");
    if (redirecting) {
      const assistantMessage = makeMessage("assistant", redirecting.guardrail.message);
      this.messages = [...this.messages, assistantMessage];
      const crisisTriggered = redirecting.guardrail.category === "self-harm";
      return { userMessage, assistantMessage, crisisTriggered, redirectedBy: redirecting.guardrail };
    }

    // Call host-provided LLM with hard timeout. AbortController signals
    // cooperative cancellation to providers that honor it; the additional
    // Promise.race against an explicit timer-reject enforces a wall-clock
    // ceiling even when the host `chatFn` ignores `AbortSignal`
    // (architect-flagged in v5.8.64 review).
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout> | null = null;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timer = setTimeout(() => {
        controller.abort();
        reject(new Error(`[lumi-agent] chatFn exceeded ${this.timeoutMs}ms`));
      }, this.timeoutMs);
    });
    let modelText: string;
    try {
      modelText = await Promise.race([
        this.chatFn({
          systemPrompt: LUMI_SYSTEM_PROMPT,
          messages: this.messages,
          temperature: this.temperature,
          maxTokens: this.maxTokens,
          timeoutMs: this.timeoutMs,
          signal: controller.signal,
        }),
        timeoutPromise,
      ]);
    } catch {
      const assistantMessage = makeMessage("assistant", this.fallbackMessage);
      this.messages = [...this.messages, assistantMessage];
      return { userMessage, assistantMessage, crisisTriggered: false };
    } finally {
      if (timer !== null) clearTimeout(timer);
    }

    if (!modelText || !modelText.trim()) {
      const assistantMessage = makeMessage("assistant", this.fallbackMessage);
      this.messages = [...this.messages, assistantMessage];
      return { userMessage, assistantMessage, crisisTriggered: false };
    }

    // Post-LLM guardrail evaluation on response.
    const outboundMatches = evaluateGuardrails(modelText);
    const outboundRedirect = outboundMatches.find(
      (m) => m.guardrail.action === "redirect" || m.guardrail.action === "block",
    );
    if (outboundRedirect) {
      const assistantMessage = makeMessage("assistant", outboundRedirect.guardrail.message);
      this.messages = [...this.messages, assistantMessage];
      const crisisTriggered = outboundRedirect.guardrail.category === "self-harm";
      return {
        userMessage,
        assistantMessage,
        crisisTriggered,
        redirectedBy: outboundRedirect.guardrail,
      };
    }

    const assistantMessage = makeMessage("assistant", modelText.trim());
    this.messages = [...this.messages, assistantMessage];
    return { userMessage, assistantMessage, crisisTriggered: false };
  }
}
