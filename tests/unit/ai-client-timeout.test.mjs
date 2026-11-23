import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../server/utils/logger.mjs", () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

const messages = [{ role: "user", content: "Synthetic fixture message" }];
const successful = () => new Response(JSON.stringify({
  choices: [{ message: { content: "Synthetic reply" } }],
  usage: { prompt_tokens: 3, completion_tokens: 2, total_tokens: 5 },
}), { headers: { "content-type": "application/json" } });
const failure = status => new Response(JSON.stringify({ error: { message: "Synthetic denied" } }), {
  status, headers: { "content-type": "application/json" },
});

beforeEach(() => {
  vi.resetModules();
  vi.useFakeTimers();
  vi.spyOn(Math, "random").mockReturnValue(0);
  vi.stubEnv("AI_INTEGRATIONS_OPENAI_API_KEY", "synthetic-integration-key");
  vi.stubEnv("OPENAI_API_KEY", "synthetic-fallback-key");
  vi.stubEnv("AI_INTEGRATIONS_OPENAI_BASE_URL", "https://fixture.invalid/v1");
  for (const name of ["OPENAI_BASE_URL", "OPENAI_ORG_ID", "OPENAI_PROJECT_ID", "OPENAI_WEBHOOK_SECRET", "OPENAI_LOG"]) {
    vi.stubEnv(name, undefined);
  }
});
afterEach(() => { vi.clearAllTimers(); vi.useRealTimers(); vi.restoreAllMocks(); vi.unstubAllEnvs(); });

async function fixture(fetch) {
  const api = await import("../../server/utils/aiClient.mjs");
  const client = api.getOpenAIClient();
  // This is the installed official SDK; only its transport is synthetic.
  if (client) client.fetch = vi.fn(fetch);
  return { ...api, client };
}

describe("retained OpenAI wrapper deadline and retry contract", () => {
  it("preserves configured client precedence, payload and success envelope, without SDK retries or leftover timers", async () => {
    const f = await fixture(async () => successful());
    const create = vi.spyOn(f.client.chat.completions, "create");
    const result = await f.chatCompletion({ messages, model: "synthetic-model", temperature: 0.4, maxTokens: 71 });
    expect(result).toEqual({ success: true, content: "Synthetic reply", usage: {
      prompt_tokens: 3, completion_tokens: 2, total_tokens: 5,
    } });
    expect(f.client.apiKey).toBe("synthetic-integration-key");
    expect(f.client.baseURL).toBe("https://fixture.invalid/v1");
    expect(create.mock.calls[0][0]).toEqual({ messages, model: "synthetic-model", temperature: 0.4, max_tokens: 71 });
    expect(create.mock.calls[0][1]).toMatchObject({ timeout: 15000, maxRetries: 0, signal: expect.any(AbortSignal) });
    expect(f.client.fetch).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(0);
  });

  it.each(["headers", "body"])("aborts hanging %s and waits for transport settlement without retrying the legacy deadline", async phase => {
    let active = 0;
    let aborted = 0;
    const f = await fixture(async (_url, options) => {
      active++;
      if (phase === "headers") return new Promise((_resolve, reject) => {
        options.signal.addEventListener("abort", () => {
          aborted++;
          setTimeout(() => { active--; reject(new DOMException("Synthetic abort", "AbortError")); }, 25);
        }, { once: true });
      });
      return new Response(new ReadableStream({ start(body) {
        options.signal.addEventListener("abort", () => {
          aborted++;
          setTimeout(() => { active--; body.error(new DOMException("Synthetic abort", "AbortError")); }, 25);
        }, { once: true });
      } }), { headers: { "content-type": "application/json" } });
    });
    let settled = false;
    const pending = f.chatCompletion({ messages }).then(result => { settled = true; return result; });
    await vi.advanceTimersByTimeAsync(15000);
    expect(aborted).toBe(1);
    expect(settled).toBe(false);
    await vi.advanceTimersByTimeAsync(25);
    expect(await pending).toMatchObject({ success: false, error: "Request timed out after 15000ms", isCircuitOpen: false });
    expect(active).toBe(0);
    expect(f.client.fetch).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("rejects transport success received after the deadline instead of reporting it as successful", async () => {
    const f = await fixture((_url, options) => new Promise(resolve => {
      options.signal.addEventListener("abort", () => setTimeout(() => resolve(successful()), 25), { once: true });
    }));
    const pending = f.chatCompletion({ messages });
    await vi.advanceTimersByTimeAsync(15025);
    expect(await pending).toMatchObject({ success: false, error: "Request timed out after 15000ms" });
    expect(f.client.fetch).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(0);
  });

  it.each([429, 500, 502, 503, 504])("preserves four application attempts and exponential backoff for status %s", async status => {
    const starts = [];
    const f = await fixture(async () => { starts.push(Date.now()); return failure(status); });
    const pending = f.chatCompletion({ messages });
    await vi.runAllTimersAsync();
    expect(await pending).toMatchObject({ success: false, error: `${status} Synthetic denied` });
    expect(f.client.fetch).toHaveBeenCalledTimes(4);
    expect(starts.map(time => time - starts[0])).toEqual([0, 1000, 3000, 7000]);
    expect(f.getCircuitBreakerStatus().failureCount).toBe(1);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("returns a successful retry through the existing therapy envelope", async () => {
    let attempts = 0;
    const f = await fixture(async () => ++attempts === 1 ? failure(503) : successful());
    const pending = f.sendTherapyMessage({ messages });
    await vi.runAllTimersAsync();
    expect(await pending).toMatchObject({ ok: true, message: "Synthetic reply", raw: { success: true } });
    expect(attempts).toBe(2);
    expect(f.getCircuitBreakerStatus().failureCount).toBe(0);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("does not retry permanent failures and preserves circuit opening/recovery", async () => {
    const f = await fixture(async () => failure(401));
    for (let index = 0; index < 5; index++) {
      expect(await f.chatCompletion({ messages })).toMatchObject({ success: false, error: "401 Synthetic denied" });
    }
    expect(f.client.fetch).toHaveBeenCalledTimes(5);
    expect(await f.chatCompletion({ messages })).toMatchObject({
      success: false, error: "Service temporarily unavailable", isCircuitOpen: true,
    });
    expect(f.client.fetch).toHaveBeenCalledTimes(5);
    await vi.advanceTimersByTimeAsync(30000);
    f.client.fetch.mockImplementation(async () => successful());
    expect((await f.chatCompletion({ messages })).success).toBe(true);
    expect(f.getCircuitBreakerStatus().state).toBe("HALF_OPEN");
    expect((await f.chatCompletion({ messages })).success).toBe(true);
    expect(f.getCircuitBreakerStatus().state).toBe("CLOSED");
    expect(vi.getTimerCount()).toBe(0);
  });

  it("uses fallback key when integration key is absent and clears timers on synchronous client failure", async () => {
    vi.stubEnv("AI_INTEGRATIONS_OPENAI_API_KEY", undefined);
    const f = await fixture(async () => successful());
    expect(f.client.apiKey).toBe("synthetic-fallback-key");
    vi.spyOn(f.client.chat.completions, "create").mockImplementation(() => { throw Error("Synthetic synchronous failure"); });
    expect(await f.chatCompletion({ messages })).toMatchObject({ success: false, error: "Synthetic synchronous failure" });
    expect(f.client.fetch).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("preserves missing-client behavior without making requests", async () => {
    vi.stubEnv("AI_INTEGRATIONS_OPENAI_API_KEY", undefined);
    vi.stubEnv("OPENAI_API_KEY", undefined);
    const f = await fixture(() => { throw Error("No request expected"); });
    expect(f.client).toBe(null);
    expect(await f.chatCompletion({ messages })).toEqual({ success: false, error: "OpenAI not configured", isCircuitOpen: false });
    expect(await f.sendTherapyMessage({ messages })).toEqual({ ok: false, error: "OpenAI not configured", message: "AI is currently unavailable.", isCircuitOpen: false });
    expect(vi.getTimerCount()).toBe(0);
  });
});
