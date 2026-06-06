import { useEffect, useMemo, useState } from "react";
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

function useLocalStorage<T>(key: string, initial: T): [T, (v: T) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value]);
  return [value, setValue];
}

const OARS_PROMPTS = [
  { type: "Open", prompt: "What matters most to you about this?" },
  { type: "Affirm", prompt: "What strength have you already shown?" },
  { type: "Reflect", prompt: "If your best friend said this, what would you hear beneath the words?" },
  { type: "Summary", prompt: "In one sentence, what are you choosing next?" },
];

export function ModulesPanel({ routeKey }: { routeKey: string }) {
  const meta = useMemo(() => getRouteMeta(routeKey), [routeKey]);
  const modules = meta.modules || [];

  const storageKey = `glp:modules:${routeKey}`;
  const [data, setData] = useLocalStorage(storageKey, {
    importance: 6,
    confidence: 5,
    tinyStep: "",
    whyNow: "",
    whenWhere: "",
    obstacle: "",
    ifThen: "",
  });
  const [copied, setCopied] = useState(false);

  if (!modules.length) return null;

  const updateField = <K extends keyof typeof data>(key: K, value: (typeof data)[K]) => {
    setData({ ...data, [key]: value });
  };

  const cardText =
    `Infinity-Heart Win ✨\n\n` +
    `Page: ${meta.title}\n` +
    `Tiny step: ${data.tinyStep || "I will take one small step today."}\n` +
    `Importance: ${data.importance}/10 • Confidence: ${data.confidence}/10\n\n` +
    `mymentalhealthbuddy.com`;

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

      {/* MI with OARS + Rulers + If-Then */}
      {modules.includes("mi") && (
        <div className="mt-5 rounded-xl border border-[rgba(255,255,255,0.08)] p-4" data-testid="module-mi">
          <h3 className="font-semibold">Motivational Interviewing (MI)</h3>
          <p className="text-sm opacity-80 mt-1">A gentle way to strengthen change without pressure.</p>

          {/* OARS Prompts */}
          <div className="mt-4 rounded-lg border border-[rgba(255,255,255,0.08)] p-3">
            <div className="text-sm font-medium mb-2">OARS Prompts</div>
            <ul className="grid gap-2 text-sm opacity-90">
              {OARS_PROMPTS.map((o) => (
                <li key={o.type}>
                  <span className="font-medium">{o.type}:</span> {o.prompt}
                </li>
              ))}
            </ul>
          </div>

          {/* Importance + Confidence Sliders */}
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Importance: {data.importance}/10</label>
              <input
                type="range"
                min={0}
                max={10}
                value={data.importance}
                onChange={(e) => updateField("importance", clamp(Number(e.target.value)))}
                className="w-full"
                data-testid="slider-importance"
              />
              <p className="text-sm opacity-80 mt-2">Why is it a {data.importance} and not lower?</p>
            </div>

            <div>
              <label className="text-sm font-medium">Confidence: {data.confidence}/10</label>
              <input
                type="range"
                min={0}
                max={10}
                value={data.confidence}
                onChange={(e) => updateField("confidence", clamp(Number(e.target.value)))}
                className="w-full"
                data-testid="slider-confidence"
              />
              <p className="text-sm opacity-80 mt-2">What would move you one point higher?</p>
            </div>
          </div>

          {/* Why Now */}
          <div className="mt-4">
            <label className="text-sm font-medium">Why now?</label>
            <textarea
              value={data.whyNow}
              onChange={(e) => updateField("whyNow", e.target.value)}
              placeholder="Because... (one honest reason is enough)"
              className="mt-2 w-full rounded-lg border border-[rgba(255,255,255,0.12)] bg-transparent p-3 min-h-[70px]"
            />
          </div>

          {/* Tiny Next Step */}
          <div className="mt-4">
            <label className="text-sm font-medium">One tiny next step</label>
            <input
              value={data.tinyStep}
              onChange={(e) => updateField("tinyStep", e.target.value)}
              placeholder="Example: 2 minutes of breathing after I brush my teeth"
              className="mt-2 w-full rounded-lg border border-[rgba(255,255,255,0.12)] bg-transparent p-3"
            />
            <p className="text-xs opacity-70 mt-2">
              Keep it small enough to succeed on your hardest day.
            </p>
          </div>

          {/* When + Where */}
          <div className="mt-4">
            <label className="text-sm font-medium">When + Where</label>
            <input
              value={data.whenWhere}
              onChange={(e) => updateField("whenWhere", e.target.value)}
              placeholder="Example: Tonight at 8pm on my bed"
              className="mt-2 w-full rounded-lg border border-[rgba(255,255,255,0.12)] bg-transparent p-3"
            />
          </div>

          {/* Obstacle */}
          <div className="mt-4">
            <label className="text-sm font-medium">What might get in the way?</label>
            <input
              value={data.obstacle}
              onChange={(e) => updateField("obstacle", e.target.value)}
              placeholder="Example: I feel tired and scroll my phone"
              className="mt-2 w-full rounded-lg border border-[rgba(255,255,255,0.12)] bg-transparent p-3"
            />
          </div>

          {/* If-Then Plan */}
          <div className="mt-4">
            <label className="text-sm font-medium">If-Then Plan</label>
            <input
              value={data.ifThen}
              onChange={(e) => updateField("ifThen", e.target.value)}
              placeholder="If I start scrolling, then I put the phone down for 60 seconds and breathe."
              className="mt-2 w-full rounded-lg border border-[rgba(255,255,255,0.12)] bg-transparent p-3"
            />
            <p className="text-xs opacity-70 mt-2">
              This supports habits. No perfection required.
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
            A non-substance, modern "12 practices" path for mind–body–soul consistency.
          </p>

          <div className="mt-3 text-sm opacity-90">
            Today's practice idea: <span className="font-medium">{TWELVE_PRACTICES[0].title}</span>
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

      {/* Safety disclaimer */}
      <div className="mt-4 text-xs opacity-70 leading-relaxed">
        These are educational self-reflection tools for adults (18+). They support skill-building and habit practice.
        They are not medical advice and not a substitute for licensed care.
      </div>
    </section>
  );
}
