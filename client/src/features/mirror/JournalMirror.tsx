import { useMemo, useState } from "react";

interface JournalMirrorProps {
  onReflectionComplete?: (data: {
    inputText: string;
    reflection: string;
    mode: string;
  }) => void;
  initialText?: string;
}

export default function JournalMirror({
  onReflectionComplete,
  initialText = "",
}: JournalMirrorProps) {
  const [text, setText] = useState(initialText);
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reflection, setReflection] = useState("");
  const [error, setError] = useState("");
  const [enableAI, setEnableAI] = useState(false);

  const canSubmit = useMemo(
    () => consent && text.trim().length >= 8 && !loading,
    [consent, text, loading]
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setReflection("");
    setLoading(true);

    if (!consent) {
      setError("Please check the consent box to continue.");
      setLoading(false);
      return;
    }

    if (text.trim().length < 8) {
      setError("Please write a little more so the mirror can reflect it clearly.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/mirror", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim(), enableAI }),
      });

      const data = await res.json().catch(() => ({} as Record<string, unknown>));

      if (!res.ok || data?.ok === false) {
        throw new Error(
          (data?.error as string) || (data?.message as string) || "Mirror request failed."
        );
      }

      const reflectionText = String(data?.reflection || "");
      const mode = String(data?.mode || "local");
      setReflection(reflectionText);

      onReflectionComplete?.({
        inputText: text.trim(),
        reflection: reflectionText,
        mode,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setText("");
    setReflection("");
    setError("");
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-black/10 p-5">
      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block">
          <span className="text-sm opacity-80">Write what's true for you</span>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={7}
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 p-3 outline-none"
            placeholder="Example: I've been carrying a lot. I want to feel calmer and steadier..."
            data-testid="input-journal-text"
          />
          <div className="mt-2 flex items-center justify-between text-xs opacity-70">
            <span>{Math.min(text.length, 5000)} characters</span>
            <button
              type="button"
              onClick={handleClear}
              className="underline underline-offset-2"
              data-testid="button-clear"
            >
              Clear
            </button>
          </div>
        </label>

        <div className="rounded-xl border border-white/10 bg-black/10 p-3 space-y-2">
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1"
              data-testid="checkbox-consent"
            />
            <span>
              I understand this is a reflection tool for journaling support,
              not medical or crisis help, and I can ignore anything that
              doesn't feel accurate.
            </span>
          </label>

          <label className="flex items-center gap-2 text-sm opacity-90">
            <input
              type="checkbox"
              checked={enableAI}
              onChange={(e) => setEnableAI(e.target.checked)}
              data-testid="checkbox-enable-ai"
            />
            <span>Optional: use AI-powered reflection (bounded, safe tone)</span>
          </label>
        </div>

        {error && (
          <div
            className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm"
            data-testid="text-error"
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-medium disabled:opacity-40"
          data-testid="button-submit"
        >
          {loading ? "Reflecting..." : "Reflect my words"}
        </button>
      </form>

      {reflection && (
        <section className="mt-6">
          <h2 className="text-lg font-semibold">Your reflection</h2>
          <div
            className="mt-3 whitespace-pre-wrap rounded-2xl border border-white/10 bg-black/10 p-5 text-sm leading-relaxed"
            data-testid="text-reflection"
          >
            {reflection}
          </div>
          <p className="mt-3 text-xs opacity-70">
            If you feel unsafe or in immediate danger, contact local emergency
            services. If you're in the U.S., you can call/text <strong>988</strong>.
          </p>
        </section>
      )}
    </div>
  );
}
