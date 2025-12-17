// client/src/components/CanvaPanel.tsx
// Simple Canva integration panel for The Genuine Love Project.
// Shows Canva workspace link with a gentle explanation.

import { ExternalLink, Palette } from "lucide-react";

export default function CanvaPanel() {
  const CANVA_URL = "https://www.canva.com";

  return (
    <section
      className="rounded-2xl border border-violet-200 bg-violet-50/80 p-4 shadow-sm"
      aria-label="Design space (Canva)"
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full flex items-center justify-center bg-violet-100 border border-violet-200 flex-shrink-0">
          <Palette className="w-5 h-5 text-violet-600" aria-hidden="true" />
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-sm text-violet-900 mb-1">
            Design space (Canva)
          </h3>
          <p className="text-xs text-violet-800 mb-3 leading-relaxed">
            This opens your Canva design workspace in a new tab where you can
            create and refine visuals, dashboards, and wellness layouts.
          </p>

          <a
            href={CANVA_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-700 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-400"
            data-testid="link-canva"
          >
            <ExternalLink className="w-4 h-4" aria-hidden="true" />
            Open Canva workspace
          </a>
        </div>
      </div>
    </section>
  );
}
