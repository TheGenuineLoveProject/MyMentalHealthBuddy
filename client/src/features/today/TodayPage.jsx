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
cat > client/src/features/state/StatePage.jsx <<'EOF'
import React, { useMemo, useState } from "react";

const STATE_DIMENSIONS = [
  { key: "energy", label: "Energy", hint: "low → steady → high" },
  { key: "clarity", label: "Clarity", hint: "foggy → present → sharp" },
  { key: "safety", label: "Safety", hint: "unsafe → okay → safe" },
  { key: "connection", label: "Connection", hint: "isolated → open → connected" },
  { key: "agency", label: "Agency", hint: "stuck → able → empowered" }
];

function scoreLabel(v) {
  if (v <= 2) return "Low / Tender";
  if (v <= 4) return "Neutral / Mixed";
  return "Steady / Strong";
}

function suggestionFromState(state) {
  const entries = Object.entries(state);
  const lowest = entries.sort((a, b) => a[1] - b[1])[0];
  const [k] = lowest;

  const map = {
    energy: "Try a body reset: water + small snack + 5 minutes of gentle movement.",
    clarity: "Try a clarity reset: write one sentence: “Right now, what matters most is…”",
    safety: "Try safety first: breathe out longer than you breathe in (exhale 6, inhale 4).",
    connection: "Try connection: send one low-pressure message: “Thinking of you—no need to respond fast.”",
    agency: "Try agency: pick ONE tiny step (2 minutes) and do it before thinking more."
  };
  return map[k] || "Be kind to yourself. Small steps count.";
}

export default function StatePage() {
  const [state, setState] = useState({
    energy: 3,
    clarity: 3,
    safety: 3,
    connection: 3,
    agency: 3
  });

  const summary = useMemo(() => {
    const avg =
      (state.energy + state.clarity + state.safety + state.connection + state.agency) / 5;
    return { avg: Math.round(avg * 10) / 10, suggestion: suggestionFromState(state) };
  }, [state]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="rounded-2xl border bg-white/60 p-6 shadow-sm">
        <p className="text-xs uppercase tracking-wider text-neutral-500">State Tracker</p>
        <h1 className="mt-2 text-2xl font-semibold text-neutral-900">
          How are you, as a whole system?
        </h1>
        <p className="mt-3 text-neutral-700">
          This is not “mood.” It’s your current internal conditions — so the app can support you with
          the right kind of care.
        </p>

        <div className="mt-6 space-y-5">
          {STATE_DIMENSIONS.map((d) => (
            <div key={d.key} className="rounded-xl border bg-white p-4">
              <div className="flex items-baseline justify-between gap-3">
                <div>
                  <div className="font-medium text-neutral-900">{d.label}</div>
                  <div className="text-sm text-neutral-500">{d.hint}</div>
                </div>
                <div className="text-sm text-neutral-700">{scoreLabel(state[d.key])}</div>
              </div>

              <input
                className="mt-3 w-full"
                type="range"
                min="1"
                max="5"
                value={state[d.key]}
                onChange={(e) => setState((s) => ({ ...s, [d.key]: Number(e.target.value) }))}
              />
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-xl bg-neutral-900 p-4 text-white">
          <div className="text-sm opacity-80">State average</div>
          <div className="text-2xl font-semibold">{summary.avg} / 5</div>
          <div className="mt-2 text-sm opacity-90">{summary.suggestion}</div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <a className="rounded-xl bg-white px-4 py-2 text-sm text-neutral-900 hover:bg-neutral-50" href="/journal">
            Journal from this state
          </a>
          <a className="rounded-xl border px-4 py-2 text-sm hover:bg-neutral-50" href="/today">
            Go to Today’s Insight
          </a>
        </div>
      </div>
    </div>
  );
}
EOF
cat > client/src/pages/Landing.jsx <<'EOF'
import React from "react";

function Pill({ children }) {
  return (
    <span className="rounded-full border bg-white/70 px-3 py-1 text-xs text-neutral-700">
      {children}
    </span>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-neutral-900" />
          <div className="leading-tight">
            <div className="font-semibold text-neutral-900">The Genuine Love Project</div>
            <div className="text-xs text-neutral-500">Care + clarity, without pressure.</div>
          </div>
        </div>

        <nav className="hidden items-center gap-6 text-sm text-neutral-700 md:flex">
          <a className="hover:text-neutral-900" href="/today">Today</a>
          <a className="hover:text-neutral-900" href="/state">State</a>
          <a className="hover:text-neutral-900" href="/journal">Journal</a>
          <a className="hover:text-neutral-900" href="/crisis">Support</a>
        </nav>

        <div className="flex items-center gap-2">
          <a className="rounded-xl border px-4 py-2 text-sm hover:bg-white" href="/login">
            Sign in
          </a>
          <a className="rounded-xl bg-neutral-900 px-4 py-2 text-sm text-white hover:opacity-90" href="/register">
            Start free
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-20 pt-10">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <div className="flex flex-wrap gap-2">
              <Pill>Evidence-informed</Pill>
              <Pill>Gentle, not clinical</Pill>
              <Pill>Privacy-first</Pill>
              <Pill>Progress you can feel</Pill>
            </div>

            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-neutral-900 md:text-5xl">
              A calm place to think clearly, feel supported, and grow—one real step at a time.
            </h1>

            <p className="mt-5 text-lg leading-relaxed text-neutral-700">
              The Genuine Love Project helps you map your inner state, reflect with care, and build
              sustainable habits—without shame, comparison, or pressure to “perform wellness.”
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a className="rounded-xl bg-neutral-900 px-5 py-3 text-sm text-white hover:opacity-90" href="/register">
                Begin your calm dashboard
              </a>
              <a className="rounded-xl border px-5 py-3 text-sm hover:bg-white" href="/today">
                See Today’s Insight
              </a>
            </div>

            <div className="mt-6 text-xs text-neutral-500">
              Not a crisis service. If you feel unsafe, please use the Support page for immediate help.
            </div>
          </div>

          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <div className="grid gap-4">
              <div className="rounded-2xl border bg-neutral-50 p-4">
                <div className="text-xs uppercase tracking-wider text-neutral-500">Today</div>
                <div className="mt-2 font-medium text-neutral-900">A single kind focus</div>
                <div className="mt-1 text-sm text-neutral-700">
                  Choose one small compassionate action. Do it fully. Let that be your win.
                </div>
              </div>

              <div className="rounded-2xl border bg-neutral-50 p-4">
                <div className="text-xs uppercase tracking-wider text-neutral-500">State</div>
                <div className="mt-2 font-medium text-neutral-900">Energy • Clarity • Safety</div>
                <div className="mt-1 text-sm text-neutral-700">
                  Track your inner conditions so support matches what you actually need.
                </div>
              </div>

              <div className="rounded-2xl border bg-neutral-50 p-4">
                <div className="text-xs uppercase tracking-wider text-neutral-500">Journal</div>
                <div className="mt-2 font-medium text-neutral-900">Prompts that feel human</div>
                <div className="mt-1 text-sm text-neutral-700">
                  Thoughtful questions that help you move forward without forcing conclusions.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
EOF
cat > client/src/features/journal/PromptLibrary.js <<'EOF'
export const PROMPT_SETS = {
  clarity: [
    "What is the smallest true sentence about what I’m feeling right now?",
    "If I could reduce this moment to one solvable piece, what is it?",
    "What do I know for sure—and what am I only guessing?"
  ],
  nervousSystem: [
    "Where in my body do I feel tension, and what might it be protecting?",
    "What would “safe enough” look like for the next 10 minutes?",
    "What would I do right now if I trusted I’m allowed to go slowly?"
  ],
  selfRespect: [
    "What boundary would be an act of love, not conflict?",
    "Where am I asking myself to shrink, and what is one honest alternative?",
    "What does self-respect look like in a 2-minute action today?"
  ],
  meaning: [
    "What part of me is trying to grow through this?",
    "If this struggle had a message, what might it be asking me to learn?",
    "What would “progress” look like that I can actually sustain?"
  ]
};
EOF
cat > client/src/features/journal/JournalPage.jsx <<'EOF'
import React, { useMemo, useState } from "react";
import { PROMPT_SETS } from "./PromptLibrary";

const CATEGORIES = [
  { key: "clarity", label: "Clarity" },
  { key: "nervousSystem", label: "Nervous System" },
  { key: "selfRespect", label: "Self-Respect" },
  { key: "meaning", label: "Meaning" }
];

export default function JournalPage() {
  const [category, setCategory] = useState("clarity");
  const prompts = useMemo(() => PROMPT_SETS[category] || [], [category]);
  const [prompt, setPrompt] = useState(prompts[0] || "");
  const [text, setText] = useState("");

  function randomPrompt() {
    const list = PROMPT_SETS[category] || [];
    const p = list[Math.floor(Math.random() * list.length)] || "";
    setPrompt(p);
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="rounded-2xl border bg-white/60 p-6 shadow-sm">
        <p className="text-xs uppercase tracking-wider text-neutral-500">Journal</p>
        <h1 className="mt-2 text-2xl font-semibold text-neutral-900">Write with care and clarity</h1>
        <p className="mt-3 text-neutral-700">
          These prompts are designed to be thoughtful and supportive — no pressure to “fix” yourself.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              className={
                "rounded-full border px-4 py-2 text-sm " +
                (category === c.key ? "bg-neutral-900 text-white" : "bg-white hover:bg-neutral-50")
              }
              onClick={() => {
                setCategory(c.key);
                const first = (PROMPT_SETS[c.key] || [])[0] || "";
                setPrompt(first);
                setText("");
              }}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-xl border bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="font-medium text-neutral-900">Prompt</div>
            <div className="flex gap-2">
              <button className="rounded-xl border px-3 py-1 text-sm hover:bg-neutral-50" onClick={randomPrompt}>
                New prompt
              </button>
              <button
                className="rounded-xl border px-3 py-1 text-sm hover:bg-neutral-50"
                onClick={() => navigator.clipboard?.writeText(prompt)}
              >
                Copy
              </button>
            </div>
          </div>

          <div className="mt-3 text-neutral-800">{prompt}</div>

          <textarea
            className="mt-4 w-full rounded-xl border p-3 text-sm outline-none focus:ring-2 focus:ring-neutral-200"
            rows={8}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write gently. You can start with one sentence."
          />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <a className="rounded-xl border px-4 py-2 text-sm hover:bg-neutral-50" href="/today">
            Back to Today’s Insight
          </a>
          <a className="rounded-xl border px-4 py-2 text-sm hover:bg-neutral-50" href="/state">
            Check State
          </a>
        </div>
      </div>
    </div>
  );
}
EOF