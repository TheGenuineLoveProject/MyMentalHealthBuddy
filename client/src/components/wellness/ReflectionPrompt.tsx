import { useState } from "react";
import { reflectionPrompts } from "@/data/reflectionPrompts";

export function ReflectionPrompt() {
  const [prompt] = useState(
    () => reflectionPrompts[Math.floor(Math.random() * reflectionPrompts.length)]
  );
  const [entry, setEntry] = useState("");

  return (
    <div className="rounded-xl border p-4 bg-white/60 backdrop-blur">
      <h3 className="text-lg font-semibold mb-2">Daily Reflection</h3>
      <p className="text-sm text-muted-foreground mb-3">{prompt}</p>

      <textarea
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
        placeholder="Write freely…"
        className="w-full min-h-[120px] rounded-md border p-2 text-sm"
      />

      <div className="mt-3 text-right">
        <button
          disabled={!entry.trim()}
          className="px-4 py-2 rounded-md bg-primary text-white disabled:opacity-50"
        >
          Save Reflection
        </button>
      </div>
    </div>
  );
}