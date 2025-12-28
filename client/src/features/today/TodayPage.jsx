import { useMemo, useState } from "react";

const INSIGHTS = [
  {
    title: "Gentle Precision",
    body:
      "You don't need to fix your whole life today. Pick one small kind action, do it with full presence, and let that be enough."
  },
  {
    title: "Clarity Without Pressure",
    body:
      "When your mind gets loud, return to one true sentence: "I can take the next right step softly.""
  },
  {
    title: "Nervous System First",
    body:
      "Before you solve anything, help your body feel safe: inhale 4, exhale 6, five times. Then decide."
  },
  {
    title: "Self-Respect is a Skill",
    body:
      "A boundary is not rejection. It's a clear instruction to reality: this is how I care for myself."
  }
];

function pickDailyIndex() {
  const now = new Date();
  const key = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  return hash % INSIGHTS.length;
}

export default function TodayPage() {
  const insight = useMemo(() => INSIGHTS[pickDailyIndex()], []);
  const [saved, setSaved] = useState(false);

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="rounded-2xl border bg-white/60 p-6 shadow-sm">
        <p className="text-xs uppercase tracking-wider text-neutral-500">Today's Insight</p>
        <h1 className="mt-2 text-2xl font-semibold text-neutral-900">{insight.title}</h1>
        <p className="mt-4 text-neutral-700 leading-relaxed">{insight.body}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            data-testid="button-copy-insight"
            className="rounded-xl border px-4 py-2 text-sm hover:bg-neutral-50"
            onClick={() => {
              navigator.clipboard?.writeText(`${insight.title}\n\n${insight.body}`);
              setSaved(true);
              setTimeout(() => setSaved(false), 1200);
            }}
          >
            {saved ? "Copied ✓" : "Copy"}
          </button>

          <a
            data-testid="link-write-journal"
            className="rounded-xl bg-neutral-900 px-4 py-2 text-sm text-white hover:opacity-90"
            href="/journal"
          >
            Write from this
          </a>

          <a 
            data-testid="link-check-state"
            className="rounded-xl border px-4 py-2 text-sm hover:bg-neutral-50" 
            href="/state"
          >
            Check your state
          </a>
        </div>
      </div>
    </div>
  );
}
