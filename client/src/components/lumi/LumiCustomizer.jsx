import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LUMI_THEMES } from "../../data/lumiThemes";
import { MASCOT_ASSETS } from "../../data/lumiAssets";
import { useLumiTheme } from "../../hooks/useLumiTheme";

const PREVIEW_HERO = MASCOT_ASSETS.default;

/**
 * LumiCustomizer
 * --------------
 * Modal that lets the user pick one of the nine Lumi themes. Live preview
 * applies the candidate theme's CSS filter to a hero image immediately;
 * the chosen theme isn't persisted until "Save My Lumi" is clicked.
 *
 * Behaviour:
 *  - Backdrop click + Escape key close the modal.
 *  - Save persists via useLumiTheme().setThemeId, then briefly shows
 *    "Saved!" before auto-closing after 2s.
 *  - The currently-saved theme (or, while interacting, the candidate
 *    theme) gets the .active border highlight.
 *
 * Props:
 *  - open        (bool)     whether the modal is mounted
 *  - onClose     (fn)       called when the user requests close
 */
export function LumiCustomizer({ open, onClose }) {
  const { themeId: savedThemeId, setThemeId } = useLumiTheme();
  const [candidateId, setCandidateId] = useState(savedThemeId);
  const [savedFlash, setSavedFlash] = useState(false);
  const flashTimerRef = useRef(null);
  const closeTimerRef = useRef(null);
  const dialogRef = useRef(null);

  // Reset candidate to the persisted value every time the modal opens.
  useEffect(() => {
    if (open) {
      setCandidateId(savedThemeId);
      setSavedFlash(false);
    }
    return () => {
      if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, [open, savedThemeId]);

  // Escape-to-close + restore focus on close.
  useEffect(() => {
    if (!open) return undefined;
    const handler = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", handler);
    // Move focus into the dialog for keyboard users.
    const t = setTimeout(() => {
      dialogRef.current?.focus();
    }, 0);
    return () => {
      document.removeEventListener("keydown", handler);
      clearTimeout(t);
    };
  }, [open, onClose]);

  const candidateTheme = useMemo(
    () => LUMI_THEMES.find((t) => t.id === candidateId) || LUMI_THEMES[0],
    [candidateId]
  );

  const handleSave = useCallback(() => {
    setThemeId(candidateId);
    setSavedFlash(true);
    if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    flashTimerRef.current = setTimeout(() => setSavedFlash(false), 2000);
    closeTimerRef.current = setTimeout(() => {
      onClose?.();
    }, 2000);
  }, [candidateId, setThemeId, onClose]);

  if (!open) return null;

  return (
    <div
      role="presentation"
      onClick={(e) => {
        // Backdrop click closes; clicks inside the dialog don't.
        if (e.target === e.currentTarget) onClose?.();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(20, 24, 30, 0.55)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
      data-testid="modal-lumi-customizer-backdrop"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lumi-customizer-title"
        tabIndex={-1}
        style={{
          width: "min(720px, 100%)",
          maxHeight: "90vh",
          overflow: "auto",
          background: "var(--lumi-stone-50, #faf8f5)",
          color: "var(--lumi-stone-900, #1c1c1c)",
          borderRadius: 20,
          padding: 24,
          boxShadow: "0 24px 80px rgba(0,0,0,0.35)",
        }}
        data-testid="modal-lumi-customizer"
      >
        <header style={{ marginBottom: 16 }}>
          <h2
            id="lumi-customizer-title"
            style={{
              margin: 0,
              fontFamily: "Fraunces, Playfair Display, serif",
              fontSize: 26,
              fontWeight: 600,
              color: "var(--lumi-sage-800, #234034)",
            }}
            data-testid="text-customizer-title"
          >
            Customize your Lumi
          </h2>
          <p
            style={{
              margin: "6px 0 0 0",
              fontSize: 14,
              color: "var(--lumi-stone-700, #555)",
            }}
          >
            Pick the color that feels most like home today. You can change it any time.
          </p>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(120px, 200px) 1fr",
            gap: 24,
            alignItems: "start",
          }}
          className="lumi-customizer-grid"
        >
          {/* ── Live preview ──────────────────────────────────────────── */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                width: "100%",
                aspectRatio: "1 / 1",
                borderRadius: 16,
                background:
                  "radial-gradient(circle at 50% 45%, var(--lumi-stone-100,#f0eee9) 0%, transparent 80%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "visible",
              }}
              data-testid="container-customizer-preview"
            >
              <img
                src={PREVIEW_HERO}
                alt={`Lumi preview in ${candidateTheme.name}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  filter: candidateTheme.filter || "none",
                  transition: "filter 200ms ease-out",
                }}
                data-testid="img-customizer-preview"
              />
            </div>
            <div
              style={{
                fontWeight: 600,
                color: "var(--lumi-sage-800, #234034)",
              }}
              data-testid="text-preview-theme-name"
            >
              {candidateTheme.name}
            </div>
            <div
              style={{
                fontSize: 12,
                color: "var(--lumi-stone-700, #555)",
                textAlign: "center",
              }}
            >
              {candidateTheme.description}
            </div>
          </div>

          {/* ── Swatch grid ───────────────────────────────────────────── */}
          <div
            role="radiogroup"
            aria-label="Choose a Lumi color theme"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 12,
            }}
            className="lumi-customizer-swatches"
            data-testid="grid-theme-swatches"
          >
            {LUMI_THEMES.map((t) => {
              const isActive = t.id === candidateId;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  title={t.description}
                  onClick={() => setCandidateId(t.id)}
                  className={isActive ? "active" : ""}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 6,
                    padding: 10,
                    background: "var(--lumi-stone-100, #f0eee9)",
                    border: isActive
                      ? "2px solid var(--lumi-amber-400, #f0a830)"
                      : "2px solid transparent",
                    borderRadius: 12,
                    cursor: "pointer",
                    transition: "border-color 160ms ease-out, transform 160ms ease-out",
                  }}
                  data-testid={`button-theme-${t.id}`}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: t.primary,
                      boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.4)",
                    }}
                  />
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      textAlign: "center",
                      color: "var(--lumi-sage-800, #234034)",
                    }}
                  >
                    {t.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <footer
          style={{
            marginTop: 24,
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
          }}
        >
          <button
            type="button"
            className="lumi-btn-ghost"
            onClick={onClose}
            data-testid="button-customizer-close"
          >
            Close
          </button>
          <button
            type="button"
            className="lumi-btn-primary"
            onClick={handleSave}
            data-testid="button-customizer-save"
          >
            {savedFlash ? "Saved!" : "Save My Lumi"}
          </button>
        </footer>
      </div>

      {/* Mobile responsive: 2-col swatch grid + smaller preview */}
      <style>{`
        @media (max-width: 640px) {
          .lumi-customizer-grid {
            grid-template-columns: 120px 1fr !important;
          }
          .lumi-customizer-swatches {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }
      `}</style>
    </div>
  );
}

export default LumiCustomizer;
