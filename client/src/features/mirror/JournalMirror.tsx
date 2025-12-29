// client/src/features/mirror/JournalMirror.tsx
import React, { useMemo, useState } from "react";

type MirrorResponse = {
  ok?: boolean;
  reflection?: string; // server text response
  mode?: "local" | "ai" | string;
  title?: string;
  note?: string; // disclaimer note
  error?: string;
};

type Props = {
  /** Optional prefill */
  initialText?: string;
  /** Called when a reflection is returned (used by MirrorPage to build InsightCards) */
  onReflection?: (reflectionText: string, raw?: MirrorResponse) => void;
  /** Optional label/title override */
  title?: string;
  /** Optional className */
  className?: string;
};

function safeTrim(s: string) {
  return (s ?? "").replace(/\s+/g, " ").trim();
}

export default function JournalMirror({
  initialText = "",
  onReflection,
  title = "Gentle Mirror",
  className = "",
}: Props) {
  const [text, setText] = useState<string>(initialText);
  const [loading, setLoading] = useState(false);
  const [reflection, setReflection] = useState<string>("");
  const [mode, setMode] = useState<string>("");
  const [error, setError] = useState<string>("");

  const canSubmit = useMemo(
    () => safeTrim(text).length >= 10 && !loading,
    [text, loading]
  );

  async function runMirror() {
    setError("");
    setReflection("");
    setMode("");

    const input = safeTrim(text);
    if (input.length < 10) {
      setError("Please write a little more (at least ~10 characters).");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/mirror", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });

      const data: MirrorResponse = await res
        .json()
        .catch(() => ({} as MirrorResponse));

      if (!res.ok || data.ok === false) {
        throw new Error(data.error || `Request failed (${res.status})`);
      }

      const out = (data.reflection || "").trim();
      setReflection(out);
      setMode(String(data.mode || ""));

      // Tell parent (MirrorPage) so it can build InsightCards
      if (out && onReflection) onReflection(out, data);
    } catch (e: any) {
      setError(e?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function clearAll() {
    setError("");
    setReflection("");
    setMode("");
    setText("");
  }

  return (
    <section className={`w-full ${className}`}>
      <div className="rounded-2xl border border-white/10 bg-black/20 p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white/90">{title}</h2>
            <p className="text-sm text-white/60">
              This is a reflection tool for journaling support — not medical
              advice or diagnosis.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={clearAll}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 hover:bg-white/10"
            >
              Clear
            </button>

            <button
              type="button"
              disabled={!canSubmit}
              onClick={runMirror}
              className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black disabled:opacity-50"
            >
              {loading ? "Reflecting…" : "Reflect"}
            </button>
          </div>
        </div>

        <label className="block">
          <span className="mb-2 block text-sm text-white/70">
            Write what’s on your mind
          </span>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder='Example: "I want to feel calmer and trust myself again…"'
            className="min-h-[140px] w-full resize-y rounded-2xl border border-white/10 bg-black/30 p-4 text-white placeholder:text-white/30 outline-none focus:border-white/25"
          />
        </label>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-white/45">
            Tip: try 3–6 honest sentences. You can be messy. You don’t have to
            be perfect.
          </p>
          <p className="text-xs text-white/45">
            {safeTrim(text).length} chars
            {mode ? ` • mode: ${mode}` : ""}
          </p>
        </div>

        {error ? (
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        {reflection ? (
          <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white/80">
                Reflection
              </h3>
              <button
                type="button"
                className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/70 hover:bg-white/10"
                onClick={() => navigator.clipboard?.writeText(reflection)}
              >
                Copy
              </button>
            </div>

            <pre className="whitespace-pre-wrap text-sm leading-relaxed text-white/80">
              {reflection}
            </pre>

            <div className="mt-3 text-xs text-white/45">
              If you feel unsafe or at risk of harming yourself or someone else,
              please seek immediate help (local emergency services).
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}