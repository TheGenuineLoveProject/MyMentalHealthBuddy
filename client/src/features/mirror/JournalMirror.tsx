import { useMemo, useState } from "react";

export default function JournalingMirror() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [reflection, setReflection] = useState("");
  const [error, setError] = useState("");
  const [enableAI, setEnableAI] = useState(false);

  const canSubmit = useMemo(
    () => text.trim().length >= 3 && !loading,
    [text, loading]
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setReflection("");
    setLoading(true);

    try {
      const res = await fetch("/api/mirror", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim(), enableAI }),
      });

      const data = await res.json().catch(() => ({} as any));

      if (!res.ok || data?.ok === false) {
        throw new Error(data?.error || "Mirror request failed.");
      }

      setReflection(String(data?.reflection || ""));
    } catch (err: any) {
      setError(err?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl p-4">
      <h1 className="text-2xl font-semibold">Journaling Mirror</h1>
      <p className="mt-2 opacity-80">
        A gentle mirror for your words — not medical advice, not diagnosis.
      </p>

      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write what you're carrying right now..."
          className="w-full min-h-[160px] rounded-md border p-3 bg-transparent"
        />

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={!canSubmit}
            className="rounded-md border px-4 py-2 disabled:opacity-50"
          >
            {loading ? "Reflecting..." : "Reflect"}
          </button>

          <label className="flex items-center gap-2 text-sm opacity-80">
            <input
              type="checkbox"
              checked={enableAI}
              onChange={(e) => setEnableAI(e.target.checked)}
            />
            Enable AI reflection (optional)
          </label>
        </div>

        {error ? (
          <div className="rounded-md border p-3 text-sm">
            <b>Oops:</b> {error}
          </div>
        ) : null}

        {reflection ? (
          <div className="rounded-md border p-3 whitespace-pre-wrap">
            {reflection}
          </div>
        ) : null}
      </form>
    </div>
  );
}
