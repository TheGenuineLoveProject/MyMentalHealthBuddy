import { useEffect, useMemo, useState } from "react";
import { Link, useRoute, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  ArrowLeft, AlertTriangle, Loader2, PauseCircle, CheckCircle2,
  ShieldAlert, Compass, ArrowRight, Lightbulb, Activity,
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import SEO from "@/components/SEO";
import SafetyFooter from "@/components/ui/SafetyFooter";

const NODE_BADGE = {
  PSYCHOED:     { label: "Psychoeducation", color: "bg-sky-100 dark:bg-sky-900/40 text-sky-800 dark:text-sky-200" },
  SKILL:        { label: "Skill", color: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200" },
  EXPERIENTIAL: { label: "Experiential", color: "bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200" },
  ASSESSMENT:   { label: "Check-in", color: "bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200" },
  GROUNDING:    { label: "Grounding", color: "bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-200" },
  HOMEWORK:     { label: "Practice", color: "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-200" },
  CRISIS_CHECK: { label: "Safety check", color: "bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-200" },
  BRANCH:       { label: "Branching", color: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200" },
};

function NodeBadge({ type }) {
  const meta = NODE_BADGE[type] || { label: type, color: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200" };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${meta.color}`}>
      <Compass className="h-3 w-3" aria-hidden /> {meta.label}
    </span>
  );
}

function StatusPill({ status }) {
  const map = {
    active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200",
    paused: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
    completed: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200",
    escalated: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200",
    abandoned: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${map[status] || map.active}`}
      data-testid="badge-session-status"
    >
      <Activity className="h-3 w-3" aria-hidden /> {status}
    </span>
  );
}

function ResponseInput({ node, onSubmit, isPending }) {
  const [text, setText] = useState("");
  const [choiceId, setChoiceId] = useState(null);

  const choices = node?.choices || node?.options || null;

  function submit(e) {
    e.preventDefault();
    if (choices && choices.length > 0) {
      if (!choiceId) return;
      onSubmit({ response: choiceId, choiceId });
    } else {
      if (text.trim().length === 0) return;
      onSubmit({ response: text.trim() });
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3" data-testid="form-node-response">
      {choices && choices.length > 0 ? (
        <fieldset className="space-y-2" disabled={isPending}>
          <legend className="text-sm font-medium text-slate-700 dark:text-slate-200">Choose one</legend>
          {choices.map((c) => {
            const id = c.id ?? c.value ?? c.label;
            const label = c.label ?? c.text ?? c.value ?? id;
            return (
              <label
                key={id}
                className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition-colors ${
                  choiceId === id
                    ? "border-indigo-400 bg-indigo-50 dark:bg-indigo-900/30"
                    : "border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500"
                }`}
                data-testid={`choice-node-${id}`}
              >
                <input
                  type="radio"
                  name="node-choice"
                  value={id}
                  checked={choiceId === id}
                  onChange={() => setChoiceId(id)}
                  className="mt-1 h-4 w-4 accent-indigo-600"
                />
                <span className="text-sm text-slate-800 dark:text-slate-100">{label}</span>
              </label>
            );
          })}
        </fieldset>
      ) : (
        <label className="block">
          <span className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Your reflection</span>
          <textarea
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={4000}
            placeholder="Type what comes up. There are no wrong answers."
            className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-3 text-sm text-slate-800 dark:text-slate-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            data-testid="textarea-node-response"
          />
        </label>
      )}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed"
          data-testid="button-submit-response"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
          Continue <ArrowRight className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </form>
  );
}

export default function ProtocolSession() {
  const [, params] = useRoute("/protocols/session/:id");
  const [, navigate] = useLocation();
  const sessionId = params?.id;

  const queryKey = ["/api/protocols/session", sessionId];
  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    enabled: !!sessionId,
  });

  const [advanceFeedback, setAdvanceFeedback] = useState(null);

  const respondMutation = useMutation({
    mutationFn: async (payload) =>
      apiRequest("POST", `/api/protocols/session/${sessionId}/respond`, payload),
    onSuccess: (resp) => {
      setAdvanceFeedback(resp);
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const progressMutation = useMutation({
    mutationFn: async () =>
      apiRequest("POST", `/api/protocols/session/${sessionId}/progress`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const pauseMutation = useMutation({
    mutationFn: async () =>
      apiRequest("POST", `/api/protocols/session/${sessionId}/pause`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const session = data?.session;
  const current = data?.current || data;
  const node = current?.node;
  const status = session?.status || current?.status || "active";
  const isEscalated = status === "escalated" || advanceFeedback?.escalated;

  useEffect(() => {
    if (isEscalated) {
      // Auto-soft-redirect to /crisis after 1.5s so the user reads the
      // safety message but is still moved to support resources.
      const t = setTimeout(() => navigate("/crisis"), 1500);
      return () => clearTimeout(t);
    }
  }, [isEscalated, navigate]);

  if (!sessionId) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-700 dark:text-slate-200">No session selected.</p>
        <Link href="/protocols" className="text-indigo-600 underline mt-2 inline-block">Browse protocols</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen v28-paper-bg">
      <SEO title="Protocol Session | MyMentalHealthBuddy" description="Active protocol session. Educational only." />
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/protocols" className="inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100" data-testid="link-back-protocols">
            <ArrowLeft className="h-4 w-4" aria-hidden /> Back to library
          </Link>
          <Link href="/crisis" className="inline-flex items-center gap-1 text-sm font-medium text-rose-700 dark:text-rose-300 hover:underline" data-testid="link-crisis-header">
            <AlertTriangle className="h-4 w-4" aria-hidden /> Crisis support
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16" role="status">
            <Loader2 className="h-6 w-6 animate-spin text-indigo-500" aria-hidden />
            <span className="sr-only">Loading session…</span>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-rose-300 bg-rose-50 dark:bg-rose-900/30 p-4 text-sm text-rose-700 dark:text-rose-200" role="alert" data-testid="text-session-error">
            Could not load session. <button type="button" onClick={() => refetch()} className="underline">Retry</button>
          </div>
        ) : isEscalated ? (
          <div
            className="rounded-2xl border border-rose-400 bg-rose-50 dark:bg-rose-900/30 p-6 text-rose-900 dark:text-rose-100"
            role="alert"
            aria-live="assertive"
            data-testid="status-session-escalated"
          >
            <ShieldAlert className="h-6 w-6 mb-2" aria-hidden />
            <h2 className="text-lg font-bold">Your safety comes first.</h2>
            <p className="mt-1 text-sm">
              Taking you to crisis resources now. You can return to this protocol anytime.
            </p>
            <Link href="/crisis" className="mt-3 inline-block rounded-xl bg-rose-600 text-white px-4 py-2 text-sm font-semibold hover:bg-rose-700" data-testid="link-go-crisis">
              Go to crisis support →
            </Link>
          </div>
        ) : (
          <article className="rounded-2xl v28-card shadow-sm p-6">
            <header className="flex items-center justify-between mb-4">
              <div className="space-y-1">
                {node?.type && <NodeBadge type={node.type} />}
                <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100" data-testid="text-node-title">
                  {node?.title || "Continue your protocol"}
                </h1>
              </div>
              <StatusPill status={status} />
            </header>

            {node?.body && (
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-4 mb-4">
                <p className="text-slate-800 dark:text-slate-100 leading-relaxed whitespace-pre-line" data-testid="text-node-body">
                  {node.body}
                </p>
              </div>
            )}

            {node?.instruction && (
              <p className="mb-4 text-sm text-slate-700 dark:text-slate-200 flex items-start gap-2">
                <Lightbulb className="h-4 w-4 mt-0.5 text-amber-500" aria-hidden />
                <span>{node.instruction}</span>
              </p>
            )}

            {current?.requiresResponse ? (
              <ResponseInput
                node={node}
                onSubmit={(payload) => respondMutation.mutate(payload)}
                isPending={respondMutation.isPending}
              />
            ) : status === "active" ? (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => progressMutation.mutate()}
                  disabled={progressMutation.isPending}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed"
                  data-testid="button-progress-node"
                >
                  {progressMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
                  Continue <ArrowRight className="h-4 w-4" aria-hidden />
                </button>
              </div>
            ) : status === "completed" ? (
              <div className="rounded-xl border border-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 p-4 text-emerald-900 dark:text-emerald-100" data-testid="status-session-complete">
                <CheckCircle2 className="h-5 w-5 mb-1" aria-hidden />
                <p className="font-semibold">Protocol complete.</p>
                <p className="text-sm mt-1">Take a moment to notice what shifted, however small.</p>
              </div>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">No further actions available.</p>
            )}

            {(respondMutation.isError || progressMutation.isError || pauseMutation.isError) && (
              <p className="mt-3 text-sm text-rose-600 dark:text-rose-300" role="alert" data-testid="text-mutation-error">
                Could not save your response. Please try again.
              </p>
            )}

            {status === "active" && (
              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-between">
                <button
                  type="button"
                  onClick={() => pauseMutation.mutate()}
                  disabled={pauseMutation.isPending}
                  className="inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
                  data-testid="button-pause-session"
                >
                  <PauseCircle className="h-4 w-4" aria-hidden /> Pause for now
                </button>
                <Link href="/protocols" className="text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100" data-testid="link-leave-session">
                  Leave session
                </Link>
              </div>
            )}
          </article>
        )}

        <SafetyFooter />
      </div>
    </div>
  );
}
