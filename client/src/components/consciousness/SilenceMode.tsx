import { useState } from "react";

interface Props {
  onSave?: (text: string) => void;
}

export default function SilenceMode({ onSave }: Props) {
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);

  function handleSave() {
    if (!text.trim()) return;

    const key = "glp_silence_entries";
    const existing = ((()=>{try{return JSON.parse(localStorage.getItem(key) || "[]");}catch(err){console.warn("[storage-safe-read]",err);return JSON.parse("[]");}})());
    const entry = {
      id: Date.now().toString(),
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };
    try { localStorage.setItem(key, JSON.stringify([entry, ...existing].slice(0, 100))); } catch (err) { console.warn("[storage-safe-write]", err); }

    setSaved(true);
    onSave?.(text.trim());
    setTimeout(() => {
      setText("");
      setSaved(false);
    }, 2000);
  }

  return (
    <div className="min-h-[400px] flex flex-col">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold">Silence Mode</h2>
        <p className="text-sm text-muted-foreground mt-1">
          No AI. No output. Just you and your thoughts.
        </p>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write freely. Nothing will be analyzed or reflected back. This is just for you."
        className="flex-1 w-full rounded-xl border p-4 text-lg leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 bg-transparent"
        data-testid="textarea-silence-mode"
      />

      <div className="flex items-center justify-between mt-4">
        <span className="text-sm text-muted-foreground">
          {text.length} characters
        </span>

        <div className="flex gap-2">
          <button
            onClick={() => setText("")}
            disabled={!text.trim()}
            className="rounded-lg border px-4 py-2 text-sm disabled:opacity-50"
          >
            Clear
          </button>
          <button
            onClick={handleSave}
            disabled={!text.trim()}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
            data-testid="button-save-silence"
          >
            {saved ? "Saved" : "Save Privately"}
          </button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center mt-4">
        Your words stay in your browser. We never see them.
      </p>
    </div>
  );
}
