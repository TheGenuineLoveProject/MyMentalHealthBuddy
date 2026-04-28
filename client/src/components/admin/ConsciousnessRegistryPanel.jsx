// client/src/components/admin/ConsciousnessRegistryPanel.jsx
// MMHB CONSCIOUSNESS OS v2.0 — Phase 0 admin surface.
// Read/write registry of synthetic AI employees + audit summary.
// Mirrors SOPMonitorPanel chrome (glass-premium card + dual-token fetch).

import { useState, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Brain, RefreshCw, ShieldCheck, Activity, AlertTriangle, Sparkles,
  PauseCircle, PlayCircle, PlusCircle, Eye, EyeOff,
} from "lucide-react";

const API_BASE = "/api/admin/consciousness";

function authHeaders() {
  const userToken = (typeof localStorage !== "undefined" && localStorage.getItem("mmhb_token")) || null;
  const sessToken = (typeof sessionStorage !== "undefined" && sessionStorage.getItem("adminSessionToken")) || null;
  return [userToken, sessToken].filter(Boolean);
}

async function authedFetch(url, init = {}) {
  const tokens = authHeaders();
  if (tokens.length === 0) {
    const res = await fetch(url, { credentials: "include", ...init });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return res.json();
  }
  let lastErr = null;
  for (const t of tokens) {
    const res = await fetch(url, {
      ...init,
      headers: {
        ...(init.headers || {}),
        "Content-Type": "application/json",
        Authorization: `Bearer ${t}`,
      },
      credentials: "include",
    });
    if (res.ok) return res.json();
    lastErr = new Error(`${res.status} ${res.statusText}`);
    if (res.status !== 401 && res.status !== 403) break;
  }
  throw lastErr || new Error("Request failed");
}

const DIVISION_LABELS = {
  clinical: "Clinical",
  safety: "Safety",
  operations: "Operations",
  research: "Research",
};

const STATUS_TONES = {
  draft:    { bg: "rgba(148,163,184,0.18)", fg: "#475569" },
  shadow:   { bg: "rgba(217,164,65,0.18)",  fg: "#8a6322" },
  active:   { bg: "var(--glp-sage-15)",     fg: "var(--glp-sage-deep)" },
  paused:   { bg: "rgba(217,82,108,0.18)",  fg: "#8a2240" },
  retired:  { bg: "rgba(100,116,139,0.18)", fg: "#334155" },
};

function StatusBadge({ status }) {
  const s = STATUS_TONES[status] || STATUS_TONES.draft;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize"
      style={{ background: s.bg, color: s.fg }}
      data-testid={`badge-agent-status-${status}`}
    >
      {status}
    </span>
  );
}

function SummaryTile({ icon: Icon, label, value, sub, accent = "sage" }) {
  const accentMap = {
    sage: { bg: "var(--glp-sage-15)", fg: "var(--glp-sage-deep)" },
    gold: { bg: "rgba(217,164,65,0.18)", fg: "#8a6322" },
    rose: { bg: "rgba(217,82,108,0.18)", fg: "#8a2240" },
    teal: { bg: "rgba(45,212,191,0.18)", fg: "#0f766e" },
  }[accent];
  return (
    <div className="glass-premium rounded-2xl p-4 flex items-start gap-3" data-testid={`tile-summary-${label.toLowerCase().replace(/\s+/g, "-")}`}>
      <div className="rounded-xl p-2.5" style={{ background: accentMap.bg, color: accentMap.fg }}>
        <Icon className="w-5 h-5" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="text-2xl font-serif" style={{ color: "var(--glp-ink)" }}>{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function ConsciousnessRegistryPanel() {
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [draft, setDraft] = useState({
    agentKey: "",
    agentRole: "",
    division: "operations",
    status: "draft",
    notes: "",
  });

  const summaryQ = useQuery({
    queryKey: [API_BASE, "summary"],
    queryFn: () => authedFetch(`${API_BASE}/summary`),
    refetchOnWindowFocus: false,
    staleTime: 30_000,
  });

  const agentsQ = useQuery({
    queryKey: [API_BASE, "agents"],
    queryFn: () => authedFetch(`${API_BASE}/agents`),
    refetchOnWindowFocus: false,
    staleTime: 30_000,
  });

  const createMutation = useMutation({
    mutationFn: (payload) =>
      authedFetch(`${API_BASE}/agents`, { method: "POST", body: JSON.stringify(payload) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_BASE, "agents"] });
      queryClient.invalidateQueries({ queryKey: [API_BASE, "summary"] });
      setShowCreate(false);
      setDraft({ agentKey: "", agentRole: "", division: "operations", status: "draft", notes: "" });
    },
  });

  const patchMutation = useMutation({
    mutationFn: ({ id, patch }) =>
      authedFetch(`${API_BASE}/agents/${id}`, { method: "PATCH", body: JSON.stringify(patch) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_BASE, "agents"] });
      queryClient.invalidateQueries({ queryKey: [API_BASE, "summary"] });
    },
  });

  const refresh = useCallback(() => {
    summaryQ.refetch();
    agentsQ.refetch();
  }, [summaryQ, agentsQ]);

  const summary = summaryQ.data;
  const agents = agentsQ.data?.agents || [];

  const groupedByDivision = useMemo(() => {
    const groups = { clinical: [], safety: [], operations: [], research: [] };
    for (const a of agents) {
      if (groups[a.division]) groups[a.division].push(a);
      else (groups[a.division] = []).push(a);
    }
    return groups;
  }, [agents]);

  return (
    <section
      className="glass-premium rounded-3xl p-6 space-y-6"
      data-testid="panel-consciousness-registry"
      aria-labelledby="consciousness-heading"
    >
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-3">
          <div
            className="rounded-xl p-2.5"
            style={{ background: "var(--glp-sage-15)", color: "var(--glp-sage-deep)" }}
          >
            <Brain className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <h3 id="consciousness-heading" className="text-xl font-serif" style={{ color: "var(--glp-ink)" }}>
              Consciousness OS — Synthetic Employee Registry
            </h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              Phase 0 foundation for v2.0. Persistent, auditable AI agents with kill-switch, lifecycle status, and a 24-hour decision &amp; score rollup. Educational only — no clinical advice.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={refresh}
            className="px-3 py-2 rounded-xl text-sm font-medium inline-flex items-center gap-2"
            style={{ background: "var(--glp-sage-15)", color: "var(--glp-sage-deep)" }}
            data-testid="button-consciousness-refresh"
            aria-label="Refresh consciousness registry"
          >
            <RefreshCw className={`w-4 h-4 ${summaryQ.isFetching || agentsQ.isFetching ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            type="button"
            onClick={() => setShowCreate((s) => !s)}
            className="px-3 py-2 rounded-xl text-sm font-medium inline-flex items-center gap-2"
            style={{ background: "var(--glp-ink)", color: "white" }}
            data-testid="button-consciousness-new-agent"
            aria-expanded={showCreate}
          >
            <PlusCircle className="w-4 h-4" />
            {showCreate ? "Close" : "New agent"}
          </button>
        </div>
      </header>

      {(summaryQ.isError || agentsQ.isError) && (
        <div
          className="rounded-2xl p-4 flex items-start gap-3"
          style={{ background: "rgba(217,82,108,0.10)", color: "#8a2240" }}
          role="alert"
          data-testid="alert-consciousness-error"
        >
          <AlertTriangle className="w-5 h-5 mt-0.5" />
          <div className="text-sm">
            Unable to load Consciousness data. Verify admin authentication is active and the
            <code className="mx-1 px-1.5 py-0.5 rounded bg-white/40">/api/admin/consciousness</code>
            mount is reachable.
          </div>
        </div>
      )}

      {summary?.ok && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" data-testid="grid-consciousness-summary">
          <SummaryTile
            icon={Sparkles}
            label="Agents"
            value={summary.agents?.total ?? 0}
            sub={`${summary.agents?.byStatus?.active || 0} active · ${summary.agents?.byStatus?.shadow || 0} shadow`}
            accent="sage"
          />
          <SummaryTile
            icon={Activity}
            label="Decisions 24h"
            value={summary.decisions?.last24h ?? 0}
            sub={`${summary.decisions?.unreviewed || 0} unreviewed · ${summary.decisions?.priorityEscalated || 0} priority`}
            accent="teal"
          />
          <SummaryTile
            icon={ShieldCheck}
            label="Scores 24h"
            value={summary.scores?.last24h ?? 0}
            sub={`${summary.scores?.severity?.high || 0} high · ${summary.scores?.severity?.medium || 0} med`}
            accent="gold"
          />
          <SummaryTile
            icon={PauseCircle}
            label="Kill-switch"
            value={summary.agents?.killSwitchActive ?? 0}
            sub="Agents currently disabled"
            accent="rose"
          />
        </div>
      )}

      {showCreate && (
        <form
          className="rounded-2xl p-4 space-y-3"
          style={{ background: "var(--glp-cream, #faf6ef)", border: "1px solid var(--glp-sage-15)" }}
          onSubmit={(e) => {
            e.preventDefault();
            createMutation.mutate(draft);
          }}
          data-testid="form-consciousness-create-agent"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm">
              <span className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Agent key</span>
              <input
                required
                pattern="^[a-z0-9][a-z0-9-]{1,78}[a-z0-9]$"
                value={draft.agentKey}
                onChange={(e) => setDraft({ ...draft, agentKey: e.target.value })}
                placeholder="crisis-response-v1"
                className="w-full rounded-lg border px-3 py-2 text-sm"
                data-testid="input-agent-key"
              />
            </label>
            <label className="text-sm">
              <span className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Role</span>
              <input
                required
                maxLength={120}
                value={draft.agentRole}
                onChange={(e) => setDraft({ ...draft, agentRole: e.target.value })}
                placeholder="Crisis Response Agent"
                className="w-full rounded-lg border px-3 py-2 text-sm"
                data-testid="input-agent-role"
              />
            </label>
            <label className="text-sm">
              <span className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Division</span>
              <select
                value={draft.division}
                onChange={(e) => setDraft({ ...draft, division: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 text-sm"
                data-testid="select-agent-division"
              >
                {Object.keys(DIVISION_LABELS).map((d) => (
                  <option key={d} value={d}>{DIVISION_LABELS[d]}</option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              <span className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Status</span>
              <select
                value={draft.status}
                onChange={(e) => setDraft({ ...draft, status: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 text-sm"
                data-testid="select-agent-status"
              >
                {["draft", "shadow", "active", "paused", "retired"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </label>
          </div>
          <label className="text-sm block">
            <span className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Notes (optional)</span>
            <textarea
              rows={2}
              maxLength={2000}
              value={draft.notes}
              onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
              className="w-full rounded-lg border px-3 py-2 text-sm"
              placeholder="What is this agent responsible for? Who supervises?"
              data-testid="input-agent-notes"
            />
          </label>
          {createMutation.isError && (
            <p className="text-xs" style={{ color: "#8a2240" }} data-testid="text-create-error">
              {createMutation.error?.message || "Create failed"}
            </p>
          )}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="px-3 py-2 rounded-xl text-sm"
              data-testid="button-create-cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-4 py-2 rounded-xl text-sm font-medium"
              style={{ background: "var(--glp-sage-deep)", color: "white", opacity: createMutation.isPending ? 0.6 : 1 }}
              data-testid="button-create-submit"
            >
              {createMutation.isPending ? "Saving…" : "Register agent"}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {Object.keys(DIVISION_LABELS).map((div) => {
          const list = groupedByDivision[div] || [];
          return (
            <div key={div} data-testid={`group-division-${div}`}>
              <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                {DIVISION_LABELS[div]} <span className="ml-1 opacity-70">({list.length})</span>
              </h4>
              {list.length === 0 ? (
                <p className="text-sm text-muted-foreground italic px-1">No agents registered.</p>
              ) : (
                <ul className="space-y-2">
                  {list.map((a) => (
                    <li
                      key={a.id}
                      className="rounded-2xl p-3 flex items-center justify-between gap-3 flex-wrap"
                      style={{ background: "rgba(255,255,255,0.55)", border: "1px solid var(--glp-sage-15)" }}
                      data-testid={`row-agent-${a.agentKey}`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <code className="text-xs px-1.5 py-0.5 rounded" style={{ background: "var(--glp-sage-15)", color: "var(--glp-sage-deep)" }}>
                            {a.agentKey}
                          </code>
                          <StatusBadge status={a.status} />
                          {a.killSwitch && (
                            <span
                              className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                              style={{ background: "rgba(217,82,108,0.18)", color: "#8a2240" }}
                              data-testid={`badge-killswitch-${a.agentKey}`}
                            >
                              <PauseCircle className="w-3 h-3" /> kill-switch
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-medium mt-1" style={{ color: "var(--glp-ink)" }}>
                          {a.agentRole}
                        </p>
                        {a.notes && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{a.notes}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => patchMutation.mutate({ id: a.id, patch: { killSwitch: !a.killSwitch } })}
                          disabled={patchMutation.isPending}
                          className="px-3 py-1.5 rounded-lg text-xs inline-flex items-center gap-1.5"
                          style={{
                            background: a.killSwitch ? "var(--glp-sage-15)" : "rgba(217,82,108,0.15)",
                            color: a.killSwitch ? "var(--glp-sage-deep)" : "#8a2240",
                          }}
                          data-testid={`button-toggle-killswitch-${a.agentKey}`}
                          aria-label={a.killSwitch ? "Re-enable agent" : "Engage kill-switch"}
                        >
                          {a.killSwitch ? <PlayCircle className="w-3.5 h-3.5" /> : <PauseCircle className="w-3.5 h-3.5" />}
                          {a.killSwitch ? "Enable" : "Kill"}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            patchMutation.mutate({
                              id: a.id,
                              patch: { status: a.status === "active" ? "paused" : "active" },
                            })
                          }
                          disabled={patchMutation.isPending}
                          className="px-3 py-1.5 rounded-lg text-xs inline-flex items-center gap-1.5"
                          style={{ background: "var(--glp-sage-15)", color: "var(--glp-sage-deep)" }}
                          data-testid={`button-toggle-status-${a.agentKey}`}
                        >
                          {a.status === "active" ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          {a.status === "active" ? "Pause" : "Activate"}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground">
        v2.0 Phase 0 · {agents.length} agent{agents.length === 1 ? "" : "s"} registered ·
        Locked AI orchestrator and crisis logic remain untouched · Kill-switch and status changes
        are append-only audit events.
      </p>
    </section>
  );
}
