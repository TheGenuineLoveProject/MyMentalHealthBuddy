import { useMemo, useState } from "react";
import { MI } from "../../content/modules/mi";
import { NLP } from "../../content/modules/nlp";
import { TWELVE_PRACTICES } from "../../content/modules/twelvePractices";
import { getRouteMeta } from "../../content/meta/routeMetaRegistry";

function clamp(n: number, min = 0, max = 10) {
  return Math.max(min, Math.min(max, n));
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function ModulesPanel({ routeKey }: { routeKey: string }) {
  const meta = useMemo(() => getRouteMeta(routeKey), [routeKey]);
  const modules = meta.modules || [];
  const [importance, setImportance] = useState(6);
  const [confidence, setConfidence] = useState(5);
  const [tinyStep, setTinyStep] = useState("");
  const [copied, setCopied] = useState(false);

  if (!modules.length) return null;

  const cardText =
    `Infinity-Heart Win ✨\n\n` +
    `Page: ${meta.title}\n` +
    `Tiny step: ${tinyStep || "I will take one small step today."}\n` +
    `Importance: ${importance}/10 • Confidence: ${confidence}/10\n\n` +
    `TheGenuineLoveProject.com`;

  return (
    <section 
      className="mt-8 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(0,0,0,0.18)] p-5"
      data-testid="section-modules-panel"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Support Modules</h2>
          <p className="text-sm opacity-80">
            Optional tools for this page — consistent everywhere, powered by the registry.
          </p>
        </div>
      </div>

      {/* MI */}
      {modules.includes("mi") && (
        <div className="mt-5 rounded-xl border border-[rgba(255,255,255,0.08)] p-4" data-testid="module-mi">
          <h3 className="font-semibold">Motivational Interviewing (MI)</h3>
          <p className="text-sm opacity-80 mt-1">A gentle way to strengthen change without pressure.</p>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Importance: {importance}/10</label>
              <input
                type="range"
                min={0}
                max={10}
                value={importance}
                onChange={(e) => setImportance(clamp(Number(e.target.value)))}
                className="w-full"
                data-testid="slider-importance"
              />
              <p className="text-sm opacity-80 mt-2">{MI.changeTalkPrompts[0]}</p>
            </div>

            <div>
              <label className="text-sm font-medium">Confidence: {confidence}/10</label>
              <input
                type="range"
                min={0}
                max={10}
                value={confidence}
                onChange={(e) => setConfidence(clamp(Number(e.target.value)))}
                className="w-full"
                data-testid="slider-confidence"
              />
              <p className="text-sm opacity-80 mt-2">{MI.changeTalkPrompts[2]}</p>
            </div>
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium">One tiny next step</label>
            <input
              value={tinyStep}
              onChange={(e) => setTinyStep(e.target.value)}
              placeholder="Example: I will do 2 minutes of grounding after lunch."
              className="mt-2 w-full rounded-lg border border-[rgba(255,255,255,0.12)] bg-transparent p-3"
            />
            <p className="text-xs opacity-70 mt-2">
              Tip: make it small + specific (when/where).
            </p>
          </div>
        </div>
      )}

      {/* NLP */}
      {modules.includes("nlp") && (
        <div className="mt-5 rounded-xl border border-[rgba(255,255,255,0.08)] p-4">
          <h3 className="font-semibold">NLP Reframe Prompts (safe self-talk)</h3>
          <p className="text-sm opacity-80 mt-1">Language templates for reframing — no manipulation, no guarantees.</p>

          <div className="mt-3 grid gap-3">
            <div className="text-sm opacity-90">• {NLP.labels[0]}</div>
            <div className="text-sm opacity-90">• {NLP.labels[1]}</div>
            <div className="text-sm opacity-90">• {NLP.futurePacing[0]}</div>
          </div>
        </div>
      )}

      {/* 12 Practices */}
      {modules.includes("12practices") && (
        <div className="mt-5 rounded-xl border border-[rgba(255,255,255,0.08)] p-4">
          <h3 className="font-semibold">12 Practices (daily growth)</h3>
          <p className="text-sm opacity-80 mt-1">
            A non-substance, modern “12 practices” path for mind–body–soul consistency.
          </p>

          <div className="mt-3 text-sm opacity-90">
            Today’s practice idea: <span className="font-medium">{TWELVE_PRACTICES[0].title}</span>
          </div>
          <div className="mt-2 text-sm opacity-80">{TWELVE_PRACTICES[0].prompt}</div>
        </div>
      )}

      {/* Infinity-Heart share card */}
      <div className="mt-5 rounded-xl border border-[rgba(255,255,255,0.08)] p-4">
        <h3 className="font-semibold">Infinity-Heart Share Card</h3>
        <p className="text-sm opacity-80 mt-1">Share a 2-minute win — gentle, no shame, no pressure.</p>

        <pre className="mt-3 whitespace-pre-wrap rounded-lg border border-[rgba(255,255,255,0.12)] bg-[rgba(0,0,0,0.22)] p-3 text-sm">
          {cardText}
        </pre>

        <div className="mt-3 flex items-center gap-3">
          <button
            className="rounded-lg border border-[rgba(255,255,255,0.15)] px-3 py-2 text-sm"
            onClick={async () => {
              const ok = await copyToClipboard(cardText);
              setCopied(ok);
              setTimeout(() => setCopied(false), 1200);
            }}
          >
            Copy
          </button>
          {copied && <span className="text-sm opacity-80">Copied ✓</span>}
        </div>
      </div>
    </section>
  );
}