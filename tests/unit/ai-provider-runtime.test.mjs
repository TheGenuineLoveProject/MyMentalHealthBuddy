import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import OpenAI from "openai";

const boundaries = vi.hoisted(() => ({ telemetry: vi.fn(), profile: vi.fn() }));
vi.mock("../../server/ai/aiTelemetry.mjs", () => ({ logAICall: boundaries.telemetry }));
vi.mock("../../server/ai/profileStore.mjs", () => ({ formatProfileForPrompt: boundaries.profile }));

let callAIProvider;
let transports;

beforeEach(async () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));
  vi.stubEnv("AI_MODEL", "gpt-4o-mini");
  vi.stubEnv("OPENAI_CUSTOM_HEADERS", "");
  vi.resetModules();
  boundaries.telemetry.mockReset();
  boundaries.profile.mockReset().mockReturnValue("Fixture profile");
  vi.spyOn(console, "warn").mockImplementation(() => {});
  ({ callAIProvider } = await import("@provider-under-test"));
  transports = [];
});

afterEach(async () => {
  // A failing baseline assertion must not leave synthetic pending requests or
  // retry timers behind. Cleanup fulfills only test transports; it sends nothing.
  transports.forEach(transport => transport.cleanup());
  await vi.advanceTimersByTimeAsync(0);
  vi.clearAllTimers();
  vi.useRealTimers();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

function completion(model, reply = "Fixture reply") {
  return {
    id: "chatcmpl_offline_fixture", object: "chat.completion", created: 1, model,
    choices: [{ index: 0, finish_reason: "stop", message: { role: "assistant", content: reply } }],
    usage: { prompt_tokens: 31, completion_tokens: 9, total_tokens: 40 },
  };
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status, headers: { "Content-Type": "application/json", "x-request-id": "req_offline_fixture" },
  });
}

function transportFixture(chooseStep = () => ({ kind: "ok" })) {
  const records = [];
  const active = new Set();
  let maximumActive = 0;
  let closing = false;
  const fetch = vi.fn((url, init) => {
    // This function replaces the SDK's network boundary completely. There is
    // no delegation to global fetch and no real application credential access.
    expect(String(url)).toBe("https://openai-offline.invalid/v1/chat/completions");
    const payload = JSON.parse(init.body);
    const record = { payload, signal: init.signal, retryHeader: new Headers(init.headers).get("x-stainless-retry-count"), startedAt: Date.now(), abortedAt: null, finish: null };
    records.push(record);
    active.add(record);
    maximumActive = Math.max(maximumActive, active.size);
    const step = closing ? { kind: "ok" } : chooseStep(record, records.length - 1);
    let onAbort;
    const release = () => {
      active.delete(record);
      if (onAbort) init.signal.removeEventListener("abort", onAbort);
    };
    if (step.kind === "ok") {
      release();
      return Promise.resolve(jsonResponse(completion(payload.model)));
    }
    if (step.kind === "http-error") {
      release();
      return Promise.resolve(jsonResponse({ error: { message: "Synthetic provider rejection", type: "fixture_error", code: "fixture_error" } }, step.status));
    }
    if (step.kind === "sdk-timeout") {
      release();
      // The real SDK classifies a fetch AbortError without a caller abort as
      // APIConnectionTimeoutError. No SDK method or error class is mocked.
      return Promise.reject(new DOMException("Synthetic SDK timeout", "AbortError"));
    }
    if (step.kind === "connection-error") {
      release();
      return Promise.reject(new TypeError("Synthetic connection failure"));
    }
    const aborted = finish => {
      record.abortedAt = Date.now();
      if (step.abortDelay) setTimeout(finish, step.abortDelay);
      else finish();
    };
    if (step.kind === "hang-body") {
      let streamController;
      const stream = new ReadableStream({ start(controller) { streamController = controller; } });
      record.finish = () => {
        release();
        streamController.enqueue(new TextEncoder().encode(JSON.stringify(completion(payload.model))));
        streamController.close();
        record.finish = null;
      };
      onAbort = () => aborted(() => {
        release();
        streamController.error(new DOMException("Synthetic body aborted", "AbortError"));
        record.finish = null;
      });
      init.signal.addEventListener("abort", onAbort, { once: true });
      return Promise.resolve(new Response(stream, { status: 200, headers: { "Content-Type": "application/json" } }));
    }
    return new Promise((resolve, reject) => {
      record.finish = () => { release(); resolve(jsonResponse(completion(payload.model))); record.finish = null; };
      onAbort = () => aborted(() => {
        release();
        if (step.kind === "late-success") resolve(jsonResponse(completion(payload.model, "Late output must be discarded")));
        else reject(new DOMException("Synthetic request aborted", "AbortError"));
        record.finish = null;
      });
      init.signal.addEventListener("abort", onAbort, { once: true });
    });
  });
  const transport = {
    records, active, fetch,
    get maximumActive() { return maximumActive; },
    cleanup() { closing = true; records.forEach(record => record.finish?.()); },
  };
  transports.push(transport);
  const client = new OpenAI({
    apiKey: "sk-test-offline-fixture-only", adminAPIKey: null,
    organization: null, project: null, webhookSecret: null,
    baseURL: "https://openai-offline.invalid/v1", logLevel: "off", fetch,
    // Leave SDK retry/timeout defaults intact: the application must override
    // them per request, including when handed an existing configured client.
  });
  const create = vi.spyOn(client.chat.completions, "create");
  return { client, create, transport };
}

async function flush() {
  await vi.advanceTimersByTimeAsync(0);
}

function expectSettled(f) {
  expect(f.transport.active.size).toBe(0);
  expect(f.transport.maximumActive).toBeLessThanOrEqual(1);
  expect(vi.getTimerCount()).toBe(0);
}

describe("provider transport deadline with actual OpenAI SDK", () => {
  it("preserves prompt construction, model controls, usage, and success envelope", async () => {
    const f = transportFixture();
    const result = await callAIProvider({
      openai: f.client, input: "Fixture input", route: "/fixture/chat", modelOverride: "gpt-4o", temperatureOverride: 0.4,
      summary: "Fixture summary", profile: { fixture: true }, modules: ["anxiety"], inferredStates: ["sadness"], policyMsg: "Fixture policy",
      toolPayload: { tool: { title: "Fixture exercise", type: "fixture" }, exercise: { intro: "Fixture intro", steps: ["First step", "Second step"], closing: "Fixture closing" } },
      history: [{ role: "user", content: "Prior input" }, { role: "assistant", content: "Prior reply" }, { role: "system", content: "Excluded history" }, { role: "user", content: null }],
      extraTelemetry: { purpose: "offline-test" },
    });
    expect(result).toEqual({ ok: true, modelUsed: "gpt-4o", latency: 0, reply: "Fixture reply" });
    const payload = f.transport.records[0].payload;
    expect(payload.model).toBe("gpt-4o");
    expect(payload.temperature).toBe(0.4);
    expect(payload.messages[0]).toEqual({ role: "system", content: "You are a supportive, emotionally intelligent assistant." });
    const systems = payload.messages.filter(message => message.role === "system").map(message => message.content);
    expect(systems[1]).toBe("Known user context:\nFixture summary");
    expect(systems[2]).toBe("Fixture profile");
    expect(systems[3]).toContain("Steps: First step | Second step");
    expect(systems[4]).toContain("anxiety regulation");
    expect(systems[5]).toContain("Possible emotional tones");
    expect(systems.at(-1)).toBe("Fixture policy");
    expect(payload.messages.slice(-3)).toEqual([{ role: "user", content: "Prior input" }, { role: "assistant", content: "Prior reply" }, { role: "user", content: "Fixture input" }]);
    expect(boundaries.telemetry).toHaveBeenCalledExactlyOnceWith({ route: "/fixture/chat", model: "gpt-4o", latencyMs: 0, inputTokens: 31, outputTokens: 9, success: true, extra: { purpose: "offline-test" } });
    expect(f.create.mock.calls[0][1]).toMatchObject({ timeout: 12000, maxRetries: 0, signal: expect.any(AbortSignal) });
    expectSettled(f);
  });

  it("aborts three timed-out primary attempts before returning the legacy failure", async () => {
    const f = transportFixture(() => ({ kind: "hang-headers" }));
    const pending = callAIProvider({ openai: f.client, input: "Fixture input" });
    await flush();
    await vi.advanceTimersByTimeAsync(36000);
    expect(await pending).toEqual({ ok: false, error: "AI timeout" });
    expect(f.create).toHaveBeenCalledTimes(3);
    expect(f.transport.records).toHaveLength(3);
    for (const record of f.transport.records) {
      expect(record.signal.aborted).toBe(true);
      expect(record.abortedAt - record.startedAt).toBe(12000);
    }
    expectSettled(f);
  });

  it("keeps the deadline through response-body parsing after headers arrive", async () => {
    const f = transportFixture(() => ({ kind: "hang-body" }));
    const pending = callAIProvider({ openai: f.client, input: "Fixture input" });
    await flush();
    await vi.advanceTimersByTimeAsync(36000);
    expect(await pending).toEqual({ ok: false, error: "AI timeout" });
    expect(f.transport.records).toHaveLength(3);
    expect(f.transport.records.every(record => record.signal.aborted)).toBe(true);
    expectSettled(f);
  });

  it("waits for asynchronous abort settlement before starting another attempt", async () => {
    const f = transportFixture(() => ({ kind: "hang-headers", abortDelay: 20 }));
    const pending = callAIProvider({ openai: f.client, input: "Fixture input" });
    await flush();
    for (let attempt = 0; attempt < 3; attempt++) {
      await vi.advanceTimersByTimeAsync(12000);
      expect(f.transport.records).toHaveLength(attempt + 1);
      expect(f.transport.records[attempt].signal.aborted).toBe(true);
      await vi.advanceTimersByTimeAsync(20);
    }
    expect(await pending).toEqual({ ok: false, error: "AI timeout" });
    expectSettled(f);
  });

  it("rejects a late success after deadline and accepts only the next attempt", async () => {
    const f = transportFixture((_record, index) => index === 0 ? { kind: "late-success", abortDelay: 20 } : { kind: "ok" });
    const pending = callAIProvider({ openai: f.client, input: "Fixture input" });
    await flush();
    await vi.advanceTimersByTimeAsync(12020);
    expect((await pending).reply).toBe("Fixture reply");
    expect(f.create).toHaveBeenCalledTimes(2);
    expectSettled(f);
  });

  it("keeps three primary attempts before the existing fallback model", async () => {
    const f = transportFixture(record => ({ kind: record.payload.model === "gpt-4o" ? "hang-headers" : "ok" }));
    const pending = callAIProvider({ openai: f.client, input: "Fixture input", modelOverride: "gpt-4o" });
    await flush();
    await vi.advanceTimersByTimeAsync(36000);
    expect(await pending).toEqual({ ok: true, modelUsed: "gpt-4o-mini", latency: 0, reply: "Fixture reply" });
    expect(f.transport.records.map(record => record.payload.model)).toEqual(["gpt-4o", "gpt-4o", "gpt-4o", "gpt-4o-mini"]);
    expectSettled(f);
  });

  it("exhausts both models with six bounded attempts and no lingering work", async () => {
    const f = transportFixture(() => ({ kind: "hang-headers" }));
    const pending = callAIProvider({ openai: f.client, input: "Fixture input", modelOverride: "gpt-4o" });
    await flush();
    await vi.advanceTimersByTimeAsync(72000);
    expect(await pending).toEqual({ ok: false, error: "AI timeout" });
    expect(f.transport.records.map(record => record.payload.model)).toEqual(["gpt-4o", "gpt-4o", "gpt-4o", "gpt-4o-mini", "gpt-4o-mini", "gpt-4o-mini"]);
    expect(boundaries.telemetry).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ model: "gpt-4o-mini", latencyMs: 72000, success: false, inputTokens: 0, outputTokens: 0 }));
    expectSettled(f);
  });

  it.each(["http-error", "connection-error"])("lets only the application retry a transient %s", async kind => {
    const f = transportFixture((_record, index) => index === 0 ? { kind, status: 503 } : { kind: "ok" });
    const pending = callAIProvider({ openai: f.client, input: "Fixture input" });
    await vi.runAllTimersAsync();
    expect((await pending).ok).toBe(true);
    expect(f.create).toHaveBeenCalledTimes(2);
    expect(f.transport.records).toHaveLength(2);
    expect(f.transport.records.map(record => record.retryHeader)).toEqual(["0", "0"]);
    expectSettled(f);
  });

  it("preserves non-timeout provider errors and the existing application retry count", async () => {
    const f = transportFixture(() => ({ kind: "http-error", status: 400 }));
    const result = await callAIProvider({ openai: f.client, input: "Fixture input" });
    expect(result).toEqual({ ok: false, error: "400 Synthetic provider rejection" });
    expect(f.create).toHaveBeenCalledTimes(3);
    expect(f.transport.records).toHaveLength(3);
    expectSettled(f);
  });

  it("normalizes actual SDK timeout errors to the existing AI timeout message", async () => {
    const f = transportFixture(() => ({ kind: "sdk-timeout" }));
    const pending = callAIProvider({ openai: f.client, input: "Fixture input" });
    await vi.runAllTimersAsync();
    expect(await pending).toEqual({ ok: false, error: "AI timeout" });
    expect(f.create).toHaveBeenCalledTimes(3);
    expect(f.transport.records).toHaveLength(3);
    expectSettled(f);
  });

  it("keeps the missing-client rejection unchanged without scheduling a deadline", async () => {
    await expect(callAIProvider({ openai: null, input: "Fixture input" })).rejects.toThrow("OpenAI client not available");
    expect(vi.getTimerCount()).toBe(0);
  });
});
