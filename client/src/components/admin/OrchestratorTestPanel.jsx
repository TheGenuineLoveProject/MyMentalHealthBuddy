/**
 * MMHB CONSCIOUSNESS OS v2.0 — Prompt 3.1
 * Orchestrator Test Panel (admin-only)
 *
 * Shadow-mode interface for invoking the v2 agent orchestrator from the
 * Command Center. Renders the full reasoning trace, decision attribution,
 * and 3-tier memory snapshot. Educational/operations only — does NOT
 * generate any user-facing chat content.
 *
 * Locked-file posture:
 *   • This component never imports from server/ai/orchestrator.mjs or
 *     any locked v1 surface; it speaks only to /api/admin/consciousness/*.
 *   • Read-only display of trace.steps and outcome JSON (no PII echoed
 *     since the orchestrator stores only an FNV hash of input).
 */

import { useEffect, useState, useCallback } from "react";

const TOKEN_KEY = "mmhb_token";
const SESSION_TOKEN_KEY = "adminSessionToken";

function getAuthHeaders() {
  const headers = { "Content-Type": "application/json" };
  try {
    const jwt = localStorage.getItem(TOKEN_KEY);
    if (jwt) headers.Authorization = `Bearer ${jwt}`;
    const sess = sessionStorage.getItem(SESSION_TOKEN_KEY);
    if (sess) headers["x-admin-session"] = sess;
  } catch {
    /* storage unavailable */
  }
  return headers;
}

const INTENT_PRESETS = [
  { value: "general", label: "General routing" },
  { value: "reflection", label: "Reflection / clinical" },
  { value: "education", label: "Education / discernment" },
  { value: "monitor", label: "Operations monitor" },
  { value: "safety", label: "Safety probe (no crisis text)" },
];

const SAMPLE_INPUTS = [
  "I have been struggling to focus today and want to try a grounding exercise.",
  "Can you suggest an educational lesson about cognitive distortions?",
  "Run a synthetic ops check across registered agents.",
];

export default function OrchestratorTestPanel() {
  const [intent, setIntent] = useState("general");
  const [agentKey, setAgentKey] = useState("");
  const [input, setInput] = useState(SAMPLE_INPUTS[0]);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [memory, setMemory] = useState(null);

  const refreshMemory = useCallback(async () => {
    try {
      const r = await fetch("/api/admin/consciousness/orchestrator/memory", {
        headers: getAuthHeaders(),
        credentials: "include",
      });
      if (!r.ok) {
        setMemory(null);
        return;
      }
      const j = await r.json();
      setMemory(j?.stats || null);
    } catch {
      setMemory(null);
    }
  }, []);

  useEffect(() => {
    refreshMemory();
  }, [refreshMemory]);

  async function handleInvoke(e) {
    e?.preventDefault?.();
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const r = await fetch("/api/admin/consciousness/orchestrator/invoke", {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify({
          intent,
          agentKey: agentKey.trim() || undefined,
          input: input.trim(),
        }),
      });
      const j = await r.json();
      if (!r.ok || !j?.ok) {
        setError(j?.error || `HTTP ${r.status}`);
      } else {
        setResult(j.result);
      }
    } catch (err) {
      setError(err?.message || "request failed");
    } finally {
      setBusy(false);
      refreshMemory();
    }
  }

  const trace = result?.trace;
  const outcome = result?.outcome;

  return (
    <section
      className="v28-card rounded-2xl p-6 mb-6"
      aria-labelledby="orchestrator-test-heading"
      data-testid="panel-orchestrator-test"
      style={{ border: "1px solid var(--glp-border-soft)" }}
    >
      <header className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3
            id="orchestrator-test-heading"
            className="text-xl font-semibold mb-1"
            style={{ color: "var(--glp-sage-deep)" }}
          >
            v2.0 Orchestrator — Shadow Test
          </h3>
          <p className="text-sm" style={{ color: "var(--glp-text-muted)" }}>
            Invoke the additive v2 agent orchestrator. Every call is appended
            to <code>agent_decisions</code> with full reasoning trace
            (CAD-4). Locked v1 chat orchestrator is never touched.
          </p>
        </div>
        <button
          type="button"
          onClick={refreshMemory}
          className="text-xs px-3 py-1.5 rounded-lg border"
          style={{ borderColor: "var(--glp-border-soft)", color: "var(--glp-sage-deep)" }}
          data-testid="button-orchestrator-memory-refresh"
          aria-label="Refresh memory stats"
        >
          Refresh memory
        </button>
      </header>

      <form onSubmit={handleInvoke} className="grid gap-3 mb-4" data-testid="form-orchestrator-invoke">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="text-sm">
            <span className="block mb-1" style={{ color: "var(--glp-text-muted)" }}>
              Intent
            </span>
            <select
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
              className="w-full rounded-lg px-3 py-2 border bg-white/60"
              style={{ borderColor: "var(--glp-border-soft)" }}
              data-testid="select-orchestrator-intent"
              aria-label="Routing intent"
            >
              {INTENT_PRESETS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="block mb-1" style={{ color: "var(--glp-text-muted)" }}>
              Agent key (optional — overrides intent routing)
            </span>
            <input
              type="text"
              value={agentKey}
              onChange={(e) => setAgentKey(e.target.value)}
              placeholder="e.g. crisis-response-v1"
              className="w-full rounded-lg px-3 py-2 border bg-white/60"
              style={{ borderColor: "var(--glp-border-soft)" }}
              data-testid="input-orchestrator-agent-key"
              aria-label="Agent key override"
              maxLength={80}
            />
          </label>
        </div>
        <label className="text-sm">
          <span className="block mb-1" style={{ color: "var(--glp-text-muted)" }}>
            Input (4000 chars max — never echoed to disk; only an FNV hash is recorded)
          </span>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={3}
            maxLength={4000}
            className="w-full rounded-lg px-3 py-2 border bg-white/60 font-mono text-sm"
            style={{ borderColor: "var(--glp-border-soft)" }}
            data-testid="textarea-orchestrator-input"
            aria-label="Orchestrator input text"
          />
        </label>
        <div className="flex flex-wrap gap-2 items-center">
          <button
            type="submit"
            disabled={busy || !input.trim()}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
            style={{ background: "var(--glp-sage-deep)" }}
            data-testid="button-orchestrator-invoke"
            aria-label="Invoke orchestrator"
          >
            {busy ? "Routing…" : "Invoke orchestrator"}
          </button>
          {SAMPLE_INPUTS.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setInput(s)}
              className="text-xs px-3 py-1.5 rounded-md border"
              style={{ borderColor: "var(--glp-border-soft)", color: "var(--glp-text-muted)" }}
              data-testid={`button-orchestrator-sample-${i}`}
              aria-label={`Use sample input ${i + 1}`}
            >
              Sample {i + 1}
            </button>
          ))}
        </div>
      </form>

      {error && (
        <div
          role="alert"
          className="rounded-lg px-3 py-2 mb-3 text-sm"
          style={{ background: "var(--glp-error-soft, #fde2e2)", color: "var(--glp-error-deep, #7a1f1f)" }}
          data-testid="text-orchestrator-error"
        >
          {error}
        </div>
      )}

      {memory && (
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4 text-xs"
          data-testid="grid-orchestrator-memory"
        >
          <div className="rounded-lg px-3 py-2 border" style={{ borderColor: "var(--glp-border-soft)" }}>
            <div style={{ color: "var(--glp-text-muted)" }}>Hot keys</div>
            <div className="text-base font-semibold" data-testid="text-mem-hot-keys">{memory.hot?.keys ?? 0}</div>
          </div>
          <div className="rounded-lg px-3 py-2 border" style={{ borderColor: "var(--glp-border-soft)" }}>
            <div style={{ color: "var(--glp-text-muted)" }}>Hot items</div>
            <div className="text-base font-semibold" data-testid="text-mem-hot-items">{memory.hot?.items ?? 0}</div>
          </div>
          <div className="rounded-lg px-3 py-2 border" style={{ borderColor: "var(--glp-border-soft)" }}>
            <div style={{ color: "var(--glp-text-muted)" }}>Hot TTL</div>
            <div className="text-base font-semibold" data-testid="text-mem-hot-ttl">
              {Math.round((memory.hot?.ttlMs ?? 0) / 60000)}m
            </div>
          </div>
          <div className="rounded-lg px-3 py-2 border" style={{ borderColor: "var(--glp-border-soft)" }}>
            <div style={{ color: "var(--glp-text-muted)" }}>Cold tier</div>
            <div className="text-base font-semibold" data-testid="text-mem-cold-status">
              {memory.cold?.available ? "online" : "deferred"}
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="rounded-xl p-4 border" style={{ borderColor: "var(--glp-border-soft)", background: "rgba(255,255,255,0.5)" }} data-testid="block-orchestrator-result">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <div>
              <div className="text-xs uppercase tracking-wide mb-1" style={{ color: "var(--glp-text-muted)" }}>
                Decision
              </div>
              <div className="text-sm font-mono" data-testid="text-orchestrator-decision-id">
                {result.decisionId || "—"}
              </div>
              <div className="text-xs mt-1" style={{ color: "var(--glp-text-muted)" }}>
                Type: <span data-testid="text-orchestrator-decision-type">{result.decisionType}</span>
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide mb-1" style={{ color: "var(--glp-text-muted)" }}>
                Selected agent
              </div>
              <div className="text-sm" data-testid="text-orchestrator-selected-agent">
                {result.selectedAgent
                  ? `${result.selectedAgent.key} (${result.selectedAgent.division} · ${result.selectedAgent.status})`
                  : "system sentinel (no domain agent matched)"}
              </div>
            </div>
          </div>

          <div className="mb-3">
            <div className="text-xs uppercase tracking-wide mb-1" style={{ color: "var(--glp-text-muted)" }}>
              Outcome
            </div>
            <pre
              className="text-xs whitespace-pre-wrap font-mono p-3 rounded-md max-h-48 overflow-auto"
              style={{ background: "rgba(0,0,0,0.04)" }}
              data-testid="pre-orchestrator-outcome"
            >
              {JSON.stringify(outcome, null, 2)}
            </pre>
          </div>

          <div>
            <div className="text-xs uppercase tracking-wide mb-1" style={{ color: "var(--glp-text-muted)" }}>
              Trace ({trace?.steps?.length || 0} steps · {trace?.latencyMs ?? "?"}ms{trace?.priorityEscalated ? " · priority-escalated" : ""})
            </div>
            <ol className="space-y-1 text-xs" data-testid="list-orchestrator-trace">
              {(trace?.steps || []).map((step, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 px-2 py-1 rounded-md"
                  style={{ background: "rgba(0,0,0,0.02)" }}
                  data-testid={`item-orchestrator-trace-${i}`}
                >
                  <span className="font-mono" style={{ color: "var(--glp-sage-deep)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-mono">{step.stage}</span>
                  <span style={{ color: "var(--glp-text-muted)" }}>
                    {Object.entries(step)
                      .filter(([k]) => k !== "stage")
                      .map(([k, v]) => `${k}=${typeof v === "object" ? JSON.stringify(v) : String(v)}`)
                      .join(" · ")}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </section>
  );
}
