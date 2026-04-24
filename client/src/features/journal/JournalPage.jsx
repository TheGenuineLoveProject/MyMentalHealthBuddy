import { useMemo, useState } from "react";
import { PROMPT_SETS } from "./PromptLibrary";
import BuddyPanel from "@/components/avatar/BuddyPanel";

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
      {/* MMHB Buddy v2.0 — friction-reducing companion for the journaling
          surface. State is `calm` (the page itself doesn't infer emotion;
          the user controls what they write). Smaller (88px) than /start so
          Buddy stays supportive, not centerpiece. Visual-only — no fetch,
          no AI, no profile/streak/paywall logic per BuddyPanel contract. */}
      <BuddyPanel
        state="calm"
        title="Buddy is here while you write"
        subtitle="No pressure — just gentle company."
        surface="journal"
        size={88}
        className="mb-6"
        data-testid="panel-buddy-journal"
      />
      <div className="rounded-2xl border bg-white/60 p-6 shadow-sm">
        <p className="text-xs uppercase tracking-wider text-neutral-500">Journal</p>
        <h1 className="mt-2 text-2xl font-semibold text-neutral-900">Write with care and clarity</h1>
        <p className="mt-3 text-neutral-700">
          These prompts are designed to be thoughtful and supportive — no pressure to "fix" yourself.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              data-testid={`button-category-${c.key}`}
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
              <button 
                data-testid="button-new-prompt"
                className="rounded-xl border px-3 py-1 text-sm hover:bg-neutral-50" 
                onClick={randomPrompt}
              >
                New prompt
              </button>
              <button
                data-testid="button-copy-prompt"
                className="rounded-xl border px-3 py-1 text-sm hover:bg-neutral-50"
                onClick={() => navigator.clipboard?.writeText(prompt)}
              >
                Copy
              </button>
            </div>
          </div>

          <div className="mt-3 text-neutral-800" data-testid="text-current-prompt">{prompt}</div>

          <textarea
            data-testid="input-journal-text"
            className="mt-4 w-full rounded-xl border p-3 text-sm outline-none focus:ring-2 focus:ring-neutral-200"
            rows={8}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write gently. You can start with one sentence."
          />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <a 
            data-testid="link-back-today"
            className="rounded-xl border px-4 py-2 text-sm hover:bg-neutral-50" 
            href="/today"
          >
            Back to Today's Insight
          </a>
          <a 
            data-testid="link-check-state"
            className="rounded-xl border px-4 py-2 text-sm hover:bg-neutral-50" 
            href="/state"
          >
            Check State
          </a>
        </div>
      </div>
    </div>
  );
}
