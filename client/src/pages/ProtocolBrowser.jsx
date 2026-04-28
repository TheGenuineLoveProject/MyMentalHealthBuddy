import { useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  BookOpen, Clock, Calendar, ShieldAlert, Filter, ArrowRight,
  Loader2, ArrowLeft, AlertTriangle, Sparkles,
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import SEO from "@/components/SEO";
import SafetyFooter from "@/components/ui/SafetyFooter";

const EVIDENCE_LABEL = {
  high: "High evidence",
  medium: "Moderate evidence",
  emerging: "Emerging",
};

function ProtocolCard({ protocol, onStart, isStarting }) {
  return (
    <article
      className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition-shadow"
      data-testid={`card-protocol-${protocol.code}`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 dark:bg-indigo-900/40 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 dark:text-indigo-200">
          {protocol.modality}
        </span>
        {protocol.humanRequired && (
          <span
            className="inline-flex items-center gap-1 rounded-full bg-rose-100 dark:bg-rose-900/40 px-2.5 py-0.5 text-xs font-semibold text-rose-700 dark:text-rose-200"
            title="This protocol requires a human therapist"
          >
            <ShieldAlert className="h-3 w-3" aria-hidden /> Therapist required
          </span>
        )}
      </div>
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100" data-testid={`text-protocol-name-${protocol.code}`}>
        {protocol.name}
      </h3>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 line-clamp-3">{protocol.description}</p>

      <dl className="mt-3 grid grid-cols-3 gap-2 text-xs text-slate-600 dark:text-slate-300">
        <div className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" aria-hidden />
          <span>{protocol.durationWeeks} weeks</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" aria-hidden />
          <span>{protocol.sessionsPerWeek}/week</span>
        </div>
        <div className="flex items-center gap-1">
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          <span>{EVIDENCE_LABEL[protocol.evidenceLevel] || protocol.evidenceLevel}</span>
        </div>
      </dl>

      {protocol.targetSymptoms?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {protocol.targetSymptoms.slice(0, 4).map((s) => (
            <span
              key={s}
              className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs text-slate-600 dark:text-slate-300"
            >
              {s.replace(/_/g, " ")}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center justify-end">
        <button
          type="button"
          onClick={() => onStart(protocol)}
          disabled={protocol.humanRequired || isStarting}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed"
          data-testid={`button-start-protocol-${protocol.code}`}
        >
          {isStarting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
          Start protocol <ArrowRight className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </article>
  );
}

export default function ProtocolBrowser() {
  const [, navigate] = useLocation();
  const [modalityFilter, setModalityFilter] = useState("all");
  const [evidenceFilter, setEvidenceFilter] = useState("all");
  const [startingId, setStartingId] = useState(null);

  const { data, isLoading, error } = useQuery({ queryKey: ["/api/protocols"] });

  const protocols = data?.protocols || [];
  const modalities = useMemo(() => {
    const set = new Set(protocols.map((p) => p.modality));
    return ["all", ...Array.from(set).sort()];
  }, [protocols]);

  const filtered = useMemo(() => {
    return protocols.filter((p) => {
      if (modalityFilter !== "all" && p.modality !== modalityFilter) return false;
      if (evidenceFilter !== "all" && p.evidenceLevel !== evidenceFilter) return false;
      return true;
    });
  }, [protocols, modalityFilter, evidenceFilter]);

  const startMutation = useMutation({
    mutationFn: async (protocolId) => apiRequest("POST", "/api/protocols/start", { protocolId }),
    onSuccess: (resp) => {
      queryClient.invalidateQueries({ queryKey: ["/api/protocols"] });
      const sid = resp?.sessionId || resp?.session?.id;
      if (sid) navigate(`/protocols/session/${sid}`);
    },
    onSettled: () => setStartingId(null),
  });

  function handleStart(protocol) {
    if (protocol.humanRequired) return;
    setStartingId(protocol.id);
    startMutation.mutate(protocol.id);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      <SEO
        title="Therapeutic Protocols | MyMentalHealthBuddy"
        description="Browse evidence-informed therapeutic protocols. Educational only — not a substitute for licensed care."
      />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100" data-testid="link-back-dashboard">
            <ArrowLeft className="h-4 w-4" aria-hidden /> Back to dashboard
          </Link>
          <Link href="/crisis" className="inline-flex items-center gap-1 text-sm font-medium text-rose-700 dark:text-rose-300 hover:underline" data-testid="link-crisis-header">
            <AlertTriangle className="h-4 w-4" aria-hidden /> Crisis support
          </Link>
        </div>

        <header className="mb-6">
          <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 mb-2">
            <BookOpen className="h-5 w-5" aria-hidden />
            <span className="text-sm font-semibold uppercase tracking-wider">Protocol Library</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100" data-testid="text-page-title">
            Evidence-informed therapeutic protocols.
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300 max-w-3xl">
            Walk through structured, gentle protocols at your own pace. You can pause anytime.
            Educational only — not therapy or diagnosis.
          </p>
        </header>

        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3">
          <Filter className="h-4 w-4 text-slate-500 dark:text-slate-400" aria-hidden />
          <label className="text-sm text-slate-700 dark:text-slate-200">
            Modality
            <select
              value={modalityFilter}
              onChange={(e) => setModalityFilter(e.target.value)}
              className="ml-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 py-1 text-sm"
              data-testid="select-modality-filter"
            >
              {modalities.map((m) => (
                <option key={m} value={m}>{m === "all" ? "All modalities" : m}</option>
              ))}
            </select>
          </label>
          <label className="text-sm text-slate-700 dark:text-slate-200">
            Evidence
            <select
              value={evidenceFilter}
              onChange={(e) => setEvidenceFilter(e.target.value)}
              className="ml-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 py-1 text-sm"
              data-testid="select-evidence-filter"
            >
              <option value="all">All evidence levels</option>
              <option value="high">High</option>
              <option value="medium">Moderate</option>
              <option value="emerging">Emerging</option>
            </select>
          </label>
          <span className="ml-auto text-xs text-slate-500 dark:text-slate-400" data-testid="text-protocol-count">
            {filtered.length} of {protocols.length} protocols
          </span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16" role="status">
            <Loader2 className="h-6 w-6 animate-spin text-indigo-500" aria-hidden />
            <span className="sr-only">Loading protocols…</span>
          </div>
        ) : error ? (
          <p className="rounded-xl border border-rose-300 bg-rose-50 dark:bg-rose-900/30 p-4 text-sm text-rose-700 dark:text-rose-200" role="alert" data-testid="text-protocols-error">
            Could not load protocols. Please try again later.
          </p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400" data-testid="text-protocols-empty">
            No protocols match the selected filters.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((p) => (
              <ProtocolCard
                key={p.id}
                protocol={p}
                onStart={handleStart}
                isStarting={startingId === p.id}
              />
            ))}
          </div>
        )}

        {startMutation.isError && (
          <p className="mt-4 text-sm text-rose-600 dark:text-rose-300" role="alert" data-testid="text-start-error">
            Could not start that protocol. Please try again.
          </p>
        )}

        <SafetyFooter />
      </div>
    </div>
  );
}
