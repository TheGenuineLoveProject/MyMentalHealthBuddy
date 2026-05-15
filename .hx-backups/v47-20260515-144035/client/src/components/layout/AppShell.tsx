import { ReactNode, useMemo, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import FigmaPanel from "../figma/FigmaPanel";

export default function AppShell({ children }: { children: ReactNode }) {
  const isDev = useMemo(() => import.meta.env.MODE !== "production", []);
  const figmaEnabled = Boolean(import.meta.env.VITE_FIGMA_EMBED_URL);

  const [showFigma, setShowFigma] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--gl-bg)] text-[var(--gl-text)]">
      <Header />

      {/* Dev-only Figma toggle */}
      {isDev && figmaEnabled && (
        <div className="mx-auto max-w-6xl px-4 pt-3">
          <button
            className="rounded border px-3 py-1 text-xs hover:opacity-80"
            onClick={() => setShowFigma((v) => !v)}
            type="button"
          >
            {showFigma ? "Hide" : "Show"} Figma Panel (dev)
          </button>
        </div>
      )}

      <main className="mx-auto max-w-6xl px-4 py-6">
        {children}
      </main>

      {/* Figma panel (dev-only overlay) */}
      {isDev && figmaEnabled && showFigma && (
        <div className="fixed inset-0 z-50 bg-black/40">
          <div className="absolute inset-4 rounded bg-white">
            <div className="flex items-center justify-between border-b p-2">
              <div className="text-sm font-semibold">Figma</div>
              <button
                className="rounded border px-2 py-1 text-xs"
                onClick={() => setShowFigma(false)}
                type="button"
              >
                Close
              </button>
            </div>
            <div className="h-[calc(100%-40px)]">
              <FigmaPanel />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}