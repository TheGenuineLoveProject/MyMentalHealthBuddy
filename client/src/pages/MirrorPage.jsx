import React, { useMemo, useState } from "react";

// If you already have shared brand tokens/components, keep this simple for now.
// Later we can swap in shadcn/ui cards, buttons, etc.

export default function MirrorPage() {
  const [text, setText] = useState("");
  const [consent, setConsent] = useState(false);
  const [enableAI, setEnableAI] = useState(false); // optional toggle
  const [loading, setLoading] = useState(false);
  const [reflection, setReflection] = useState("");
  const [error, setError] = useState("");

  const canSubmit = useMemo(() => {
    return consent && text.trim().length >= 8 && !loading;
  }, [consent, text, loading]);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setReflection("");

    if (!consent) {
      setError("Please check the consent box to continue.");
      return;
    }
    if (text.trim().length < 8) {
      setError("Please write a little more so the mirror can reflect it clearly.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/mirror", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: text.trim(),
          enableAI: !!enableAI, // backend can ignore if not implemented
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          data?.error ||
            data?.message ||
            "Something went wrong. Please try again."
        );
      }

      // Your backend screenshots show it returns { ok: true, reflection: ... }
      setReflection(data?.reflection || "");
    } catch (err) {
      setError(err?.message || "Could not reach the mirror endpoint.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <header className="mb-6">
          <h1 className="text-3xl font-semibold leading-tight">
            Journaling Mirror
          </h1>
          <p className="mt-2 text-sm opacity-80">
            A gentle reflection of your own words — not advice, not diagnosis,
            not authority.
          </p>
        </header>

        <div className="rounded-2xl border border-white/10 bg-black/10 p-5">
          <form onSubmit={onSubmit} className="space-y-4">
            <label className="block">
              <span className="text-sm opacity-80">Write what’s true for you</span>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={7}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 p-3 outline-none"
                placeholder="Example: I’ve been carrying a lot. I want to feel calmer and steadier..."
              />
              <div className="mt-2 flex items-center justify-between text-xs opacity-70">
                <span>{Math.min(text.length, 5000)} characters</span>
                <button
                  type="button"
                  onClick={() => {
                    setText("");
                    setReflection("");
                    setError("");
                  }}
                  className="underline underline-offset-2"
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
                />
                <span>
                  I understand this is a reflection tool for journaling support,
                  not medical or crisis help, and I can ignore anything that
                  doesn’t feel accurate.
                </span>
              </label>

              <label className="flex items-center gap-2 text-sm opacity-90">
                <input
                  type="checkbox"
                  checked={enableAI}
                  onChange={(e) => setEnableAI(e.target.checked)}
                />
                <span>
                  Optional: use AI-powered reflection (bounded, safe tone)
                </span>
              </label>
            </div>

            {error ? (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-medium disabled:opacity-40"
            >
              {loading ? "Reflecting..." : "Reflect my words"}
            </button>
          </form>
        </div>

        <section className="mt-6">
          <h2 className="text-lg font-semibold">Your reflection</h2>

          <div className="mt-3 whitespace-pre-wrap rounded-2xl border border-white/10 bg-black/10 p-5 text-sm leading-relaxed">
            {reflection
              ? reflection
              : "When you submit, your reflection will appear here."}
          </div>

          <p className="mt-3 text-xs opacity-70">
            If you feel unsafe or in immediate danger, contact local emergency
            services. If you’re in the U.S., you can call/text <strong>988</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}