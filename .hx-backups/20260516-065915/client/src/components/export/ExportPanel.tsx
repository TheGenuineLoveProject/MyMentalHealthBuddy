import { useState } from "react";
import {
  downloadMarkdown,
  downloadJSON,
  getReflectionCount,
  exportToMarkdown,
} from "@/lib/export/reflectionExport";

export default function ExportPanel() {
  const [preview, setPreview] = useState<string | null>(null);
  const count = getReflectionCount();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Export Your Reflections</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Your data belongs to you. Export everything anytime.
        </p>
      </div>

      <div className="rounded-xl border p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">{count} Reflections Saved</div>
            <div className="text-sm text-muted-foreground">
              All stored locally in your browser
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          onClick={downloadMarkdown}
          disabled={count === 0}
          className="rounded-xl border p-4 text-left hover:bg-muted disabled:opacity-50"
          data-testid="button-export-markdown"
        >
          <div className="font-medium">Markdown (.md)</div>
          <div className="text-sm text-muted-foreground">
            Human-readable format, works with Obsidian, Notion, etc.
          </div>
        </button>

        <button
          onClick={downloadJSON}
          disabled={count === 0}
          className="rounded-xl border p-4 text-left hover:bg-muted disabled:opacity-50"
          data-testid="button-export-json"
        >
          <div className="font-medium">JSON (.json)</div>
          <div className="text-sm text-muted-foreground">
            Machine-readable format for backup or data portability
          </div>
        </button>
      </div>

      <button
        onClick={() => setPreview(preview ? null : exportToMarkdown())}
        disabled={count === 0}
        className="text-sm underline underline-offset-4 disabled:opacity-50"
        data-testid="button-preview-export"
      >
        {preview ? "Hide Preview" : "Preview Export"}
      </button>

      {preview && (
        <div className="rounded-xl border bg-muted/30 p-4 max-h-80 overflow-auto">
          <pre className="text-xs whitespace-pre-wrap font-mono">{preview}</pre>
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center">
        We never train on your data. You are the sole owner.
      </p>
    </div>
  );
}
