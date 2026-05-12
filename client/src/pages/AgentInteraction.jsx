import { useMemo, useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Cpu, ArrowLeft, AlertTriangle, Loader2, Sparkles, Database,
  ShieldCheck, ChevronDown, ChevronRight, Lock,
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/context/AuthContext.jsx";
import SEO from "@/components/SEO";
import SafetyFooter from "@/components/ui/SafetyFooter";

function StatusDot({ status }) {
  const map = {
    active: "bg-emerald-500",
    paused: "bg-amber-500",
    stopped: "bg-rose-500",
    draft: "bg-slate-400",
  };
  return <span className={`inline-block h-2.5 w-2.5 rounded-full ${map[status] || map.draft}`} aria-hidden />;
}

function AgentRow({ agent, expanded, onToggle, onInvoke, isInvoking }) {
  return (
    <div className="rounded-2xl v28-card overflow-hidden" data-testid={`row-agent-${agent.agentKey}`}>
      <button
        type="button"
        onClick={() => onToggle(agent.id)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/60"
        aria-expanded={expanded}
        data-testid={`button-toggle-agent-${agent.agentKey}`}
      >
        <div className="flex items-center gap-3">
          <StatusDot status={agent.status} />
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{agent.agentKey}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {agent.agentRole} · {agent.division || "no division"} · v{agent.version}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {agent.killSwitch && (
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 dark:bg-rose-900/40 px-2 py-0.5 text-xs font-semibold text-rose-700 dark:text-rose-200">
              <Lock className="h-3 w-3" aria-hidden /> Kill switch
            </span>
          )}
          {expanded ? <ChevronDown className="h-4 w-4 text-slate-400" /> : <ChevronRight className="h-4 w-4 text-slate-400" />}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-slate-200 dark:border-slate-700 p-4 space-y-3 bg-slate-50/60 dark:bg-slate-900/40">
          <dl className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <dt className="text-slate-500 dark:text-slate-400">Status</dt>
              <dd className="text-slate-800 dark:text-slate-100 font-medium">{agent.status}</dd>
            </div>
            <div>
              <dt className="text-slate-500 dark:text-slate-400">Daily token budget</dt>
              <dd className="text-slate-800 dark:text-slate-100 font-medium">{agent.budgetTokensDaily ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-slate-500 dark:text-slate-400">Supervisor</dt>
              <dd className="text-slate-800 dark:text-slate-100 font-medium">{agent.humanSupervisorId || "unassigned"}</dd>
            </div>
            <div>
              <dt className="text-slate-500 dark:text-slate-400">Updated</dt>
              <dd className="text-slate-800 dark:text-slate-100 font-medium">{agent.updatedAt ? new Date(agent.updatedAt).toLocaleString() : "—"}</dd>
            </div>
          </dl>
          <button
            type="button"
            onClick={() => onInvoke(agent)}
            disabled={isInvoking || agent.killSwitch}
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed"
            data-testid={`button-invoke-agent-${agent.agentKey}`}
          >
            {isInvoking && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
            <Sparkles className="h-4 w-4" aria-hidden /> Use this agent
          </button>
        </div>
      )}
    </div>
  );
}

function InvocationConsole({ selectedAgent, onClear }) {
  const [intent, setIntent] = useState("");
  const [input, setInput] = useState("");
  const [response, setResponse] = useState(null);

  const mutation = useMutation({
    mutationFn: async () =>
      apiRequest("POST", "/api/admin/consciousness/orchestrator/invoke", {
        agentKey: selectedAgent.agentKey,
        intent: intent.trim() || undefined,
        input: input.trim(),
      }),
    onSuccess: (resp) => setResponse(resp),
  });

  function submit(e) {
    e.preventDefault();
    if (input.trim().length === 0) return;
    setResponse(null);
    mutation.mutate();
  }

  return (
    <section
      aria-label="Invocation console"
      className="rounded-2xl v28-card p-5 shadow-sm"
      data-testid="section-invocation-console"
    >
      <header className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Invoke <span className="text-indigo-600 dark:text-indigo-300">{selectedAgent.agentKey}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Admin-only orchestrator invocation. All decisions are audit-logged.
          </p>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100"
          data-testid="button-clear-agent"
        >
          Clear selection
        </button>
      </header>

      <form onSubmit={submit} className="space-y-3">
        <label className="block text-xs">
          <span className="text-slate-700 dark:text-slate-200 font-medium">Intent (optional)</span>
          <input
            type="text"
            value={intent}
            onChange={(e) => setIntent(e.target.value)}
            placeholder="e.g. summarize_session, plan_protocol"
            className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
            data-testid="input-intent"
          />
        </label>
        <label className="block text-xs">
          <span className="text-slate-700 dark:text-slate-200 font-medium">Input</span>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={5}
            required
            maxLength={8000}
            placeholder="Provide the message or context for the agent…"
            className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm font-mono"
            data-testid="textarea-input"
          />
        </label>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={mutation.isPending || input.trim().length === 0}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed"
            data-testid="button-invoke-submit"
          >
            {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
            Invoke
          </button>
        </div>
      </form>

      {mutation.isError && (
        <p className="mt-3 text-sm text-rose-600 dark:text-rose-300" role="alert" data-testid="text-invoke-error">
          Invocation failed: {mutation.error?.message || "unknown error"}
        </p>
      )}

      {response && (
        <div
          className="mt-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-4"
          role="status"
          aria-live="polite"
          data-testid="status-invoke-response"
        >
          <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Response</p>
          <pre className="text-xs text-slate-800 dark:text-slate-100 whitespace-pre-wrap break-words max-h-96 overflow-auto">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </section>
  );
}

function MemoryPanel() {
  const { data, isLoading } = useQuery({ queryKey: ["/api/admin/consciousness/orchestrator/memory"] });

  if (isLoading) return <p className="text-sm text-slate-500 dark:text-slate-400">Loading memory stats…</p>;
  const stats = data?.stats || data?.memory || data;
  if (!stats) return <p className="text-sm text-slate-500 dark:text-slate-400">No memory stats available.</p>;

  return (
    <pre
      className="text-xs text-slate-700 dark:text-slate-200 whitespace-pre-wrap break-words bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 p-3 max-h-72 overflow-auto"
      data-testid="text-memory-stats"
    >
      {JSON.stringify(stats, null, 2)}
    </pre>
  );
}

export default function AgentInteraction() {
  const { user } = useAuth() || {};
  const [expandedId, setExpandedId] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);

  const isAdmin = user?.role === "admin" || user?.role === "owner" || user?.is_admin === true;

  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/admin/consciousness/agents"],
    enabled: isAdmin,
  });

  const agents = useMemo(() => data?.agents || [], [data]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <p className="text-slate-700 dark:text-slate-200">Please sign in to access agent controls.</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen v28-paper-bg">
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <Lock className="h-10 w-10 text-rose-500 mx-auto mb-3" aria-hidden />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100" data-testid="text-not-authorized">
            Admin access required.
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            This console is restricted to operators of MyMentalHealthBuddy.
          </p>
          <Link href="/dashboard" className="mt-4 inline-flex items-center gap-1 text-indigo-600 hover:underline">
            <ArrowLeft className="h-4 w-4" aria-hidden /> Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen v28-paper-bg">
      <SEO title="Agent Console | MyMentalHealthBuddy Admin" description="Orchestrator invocation console (admin only)." />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/admin" className="inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100" data-testid="link-back-admin">
            <ArrowLeft className="h-4 w-4" aria-hidden /> Back to admin
          </Link>
          <Link href="/crisis" className="inline-flex items-center gap-1 text-sm font-medium text-rose-700 dark:text-rose-300 hover:underline" data-testid="link-crisis-header">
            <AlertTriangle className="h-4 w-4" aria-hidden /> Crisis support
          </Link>
        </div>

        <header className="mb-6">
          <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 mb-2">
            <Cpu className="h-5 w-5" aria-hidden />
            <span className="text-sm font-semibold uppercase tracking-wider">Agent Orchestrator</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100" data-testid="text-page-title">
            Consciousness OS · Agent Console
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300 max-w-3xl flex items-start gap-2">
            <ShieldCheck className="h-5 w-5 mt-0.5 text-emerald-600" aria-hidden />
            <span>All invocations are audit-logged. Crisis safety modules and response policy are read-only.</span>
          </p>
        </header>

        {isLoading ? (
          <div className="flex items-center justify-center py-16" role="status">
            <Loader2 className="h-6 w-6 animate-spin text-indigo-500" aria-hidden />
            <span className="sr-only">Loading agents…</span>
          </div>
        ) : error ? (
          <p className="rounded-xl border border-rose-300 bg-rose-50 dark:bg-rose-900/30 p-4 text-sm text-rose-700 dark:text-rose-200" role="alert" data-testid="text-agents-error">
            Could not load agents.
          </p>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            <section aria-label="Registered agents" className="lg:col-span-2 space-y-2" data-testid="section-agents">
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">
                Registered agents ({agents.length})
              </h2>
              {agents.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400" data-testid="text-agents-empty">
                  No agents registered yet.
                </p>
              ) : (
                agents.map((a) => (
                  <AgentRow
                    key={a.id}
                    agent={a}
                    expanded={expandedId === a.id}
                    onToggle={(id) => setExpandedId((cur) => (cur === id ? null : id))}
                    onInvoke={setSelectedAgent}
                    isInvoking={false}
                  />
                ))
              )}
            </section>

            <aside className="space-y-4">
              {selectedAgent ? (
                <InvocationConsole selectedAgent={selectedAgent} onClear={() => setSelectedAgent(null)} />
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-900/40 p-5 text-sm text-slate-500 dark:text-slate-400" data-testid="text-no-agent-selected">
                  Expand an agent and choose &quot;Use this agent&quot; to invoke it.
                </div>
              )}

              <section
                aria-label="Memory stats"
                className="rounded-2xl v28-card p-4"
                data-testid="section-memory"
              >
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 mb-2">
                  <Database className="h-4 w-4" aria-hidden /> Orchestrator memory
                </h3>
                <MemoryPanel />
              </section>
            </aside>
          </div>
        )}

        <SafetyFooter />
      </div>
    </div>
  );
}
