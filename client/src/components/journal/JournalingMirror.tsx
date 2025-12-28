import React, { useMemo, useState } from "react";
import { buildSafeMirrorPrompt } from "@/intelligence/safeMirrorPrompt";
import { safeTextOrFallback } from "@/safety/languageCheck";

type MirrorResult = {
  summary: string;
  themes: string[];
  questions: string[];
  closing: string;
};

function localMirrorFallback(text: string): MirrorResult {
  const trimmed = text.trim();
  const short = trimmed.length > 320 ? trimmed.slice(0, 320) + "…" : trimmed;

  return {
    summary: `Here is a gentle summary of what you wrote: “${short}”`,
    themes: [
      "What feels most important right now (in your words)",
      "What feels heavy vs. what feels supportive",
      "What you may be hoping for underneath it all",
    ],
    questions: [
      "You may ask: What part of this deserves kindness first?",
      "You may ask: What is one small support I can offer myself today?",
    ],
    closing: "Please ignore anything that doesn’t feel accurate or helpful.",
  };
}

export function JournalingMirror() {
  const [text, setText] = useState("");
  const [optIn, setOptIn] = useState(false);
  const [result, setResult] = useState<MirrorResult | null>(null);
  const [loading, setLoading] = useState(false);

  const safePlaceholder = useMemo(
    () =>
      "If it feels helpful, you can write a few lines here. This is your space — no pressure.",
    []
  );

  async function onMirror() {
    if (!optIn) {
      setResult({
        summary:
          "AI mirroring is optional. If you’d like, you can turn it on — or simply journal privately.",
        themes: [],
        questions: [],
        closing: "",
      });
      return;
    }

    const t = text.trim();
    if (!t) return;

    setLoading(true);
    try {
      // ✅ SAFE DEFAULT: local fallback (no API calls, no cost, no risk)
      // Later you can replace with a POST to your server route.
      // Example: await fetch("/api/ai/mirror", { ... })
      const mirrored = localMirrorFallback(t);

      setResult({
        summary: safeTextOrFallback(
          mirrored.summary,
          "Here is a gentle reflection. Please take only what feels true to you."
        ),
        themes: mirrored.themes,
        questions: mirrored.questions.map((q) =>
          safeTextOrFallback(q, "You may pause here and choose what feels supportive.")
        ),
        closing: mirrored.closing,
      });

      // For debugging / future server integration:
      // console.log(buildSafeMirrorPrompt(t));
      void buildSafeMirrorPrompt(t);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section style={{ padding: 16, border: "1px solid #e5e7eb", borderRadius: 12 }}>
      <h3>Journaling Mirror (optional)</h3>
      <p style={{ opacity: 0.8 }}>
        If you choose, the mirror can reflect your words back to you in a calm way. It does not give advice.
      </p>

      <label style={{ display: "flex", gap: 8, alignItems: "center", margin: "12px 0" }}>
        <input type="checkbox" checked={optIn} onChange={(e) => setOptIn(e.target.checked)} />
        <span>Enable mirroring for this entry (optional)</span>
      </label>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={safePlaceholder}
        rows={7}
        style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid #e5e7eb" }}
      />

      <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
        <button onClick={onMirror} disabled={loading || !text.trim()}>
          {loading ? "Reflecting…" : "Mirror my entry"}
        </button>
        <button
          onClick={() => {
            setText("");
            setResult(null);
          }}
          disabled={loading}
        >
          Clear
        </button>
      </div>

      {result && (
        <div style={{ marginTop: 16 }}>
          <h4>Gentle reflection</h4>
          <p>{result.summary}</p>

          {!!result.themes.length && (
            <>
              <h5>Key themes (in your language)</h5>
              <ul>
                {result.themes.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </>
          )}

          {!!result.questions.length && (
            <>
              <h5>Optional questions</h5>
              <ul>
                {result.questions.map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ul>
            </>
          )}

          {result.closing && <p style={{ opacity: 0.8 }}>{result.closing}</p>}
        </div>
      )}
    </section>
  );
}