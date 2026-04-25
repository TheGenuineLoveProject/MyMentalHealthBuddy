import { useState } from "react";
import { Palette, Sparkles, TreePine, Lock, Check } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const PALETTE_OPTIONS = [
  { id: "sage",   label: "Sage",   swatch: "linear-gradient(135deg, #7FD8A8 0%, #2D5040 100%)" },
  { id: "rose",   label: "Rose",   swatch: "linear-gradient(135deg, #F4A6B5 0%, #B86A7C 100%)" },
  { id: "gold",   label: "Gold",   swatch: "linear-gradient(135deg, #FFD75A 0%, #B8902F 100%)" },
  { id: "sky",    label: "Sky",    swatch: "linear-gradient(135deg, #A8D5F2 0%, #4A7AA8 100%)" },
  { id: "violet", label: "Violet", swatch: "linear-gradient(135deg, #C9A9E8 0%, #6F4D9C 100%)" },
  { id: "dawn",   label: "Dawn",   swatch: "linear-gradient(135deg, #FFD9B5 0%, #C97755 60%, #6E5A8C 100%)" },
];

const ACCESSORY_OPTIONS = [
  { id: "none",    label: "None",    glyph: "·" },
  { id: "star",    label: "Star",    glyph: "✦" },
  { id: "heart",   label: "Heart",   glyph: "♡" },
  { id: "leaf",    label: "Leaf",    glyph: "❋" },
  { id: "moon",    label: "Moon",    glyph: "☾" },
  { id: "sun",     label: "Sun",     glyph: "☀" },
  { id: "feather", label: "Feather", glyph: "⌇" },
];

const THEME_OPTIONS = [
  { id: "meadow", label: "Meadow", description: "Open grass, soft light." },
  { id: "forest", label: "Forest", description: "Tall trees, dappled shade." },
  { id: "ocean",  label: "Ocean",  description: "Steady tide, salt air." },
  { id: "dawn",   label: "Dawn",   description: "First light, warm hush." },
  { id: "dusk",   label: "Dusk",   description: "Lavender hour, slow breath." },
  { id: "cosmos", label: "Cosmos", description: "Quiet stars, vast hold." },
];

/**
 * CustomizerPanel — gentle, consent-based sanctuary picker.
 *
 * - Optimistic local update + PATCH /api/peacescape/state.
 * - Guests see a soft locked state with a path to /login (no nag).
 * - All choices are visual-only labels validated server-side against allowlists.
 * - No telemetry beyond the underlying network request.
 */
export default function CustomizerPanel({
  authenticated = false,
  initialPalette = "sage",
  initialAccessory = "none",
  initialTheme = "meadow",
  onChange,
}) {
  const [palette, setPalette] = useState(initialPalette);
  const [accessory, setAccessory] = useState(initialAccessory);
  const [theme, setTheme] = useState(initialTheme);
  const [savingField, setSavingField] = useState(null);
  const [savedField, setSavedField] = useState(null);
  const [error, setError] = useState(null);

  async function save(field, value) {
    if (!authenticated) {
      // Guest — change locally only; let parent reflect, but never call API.
      onChange?.({ field, value, optimistic: true, persisted: false });
      return;
    }
    setSavingField(field);
    setError(null);
    try {
      const res = await apiRequest("PATCH", "/api/peacescape/state", { [field]: value });
      const data = await res.json();
      if (data?.ok) {
        setSavedField(field);
        setTimeout(() => setSavedField((f) => (f === field ? null : f)), 1400);
        onChange?.({ field, value, optimistic: false, persisted: true, scape: data.scape, stage: data.stage });
      } else {
        throw new Error(data?.message || "Couldn't save your sanctuary.");
      }
    } catch (e) {
      setError(e?.message || "Couldn't save your sanctuary.");
    } finally {
      setSavingField(null);
    }
  }

  function selectPalette(id) {
    setPalette(id);
    save("palette", id);
  }
  function selectAccessory(id) {
    setAccessory(id);
    save("accessory", id);
  }
  function selectTheme(id) {
    setTheme(id);
    save("theme", id);
  }

  return (
    <section
      className="rounded-3xl p-6 md:p-8"
      style={{
        background: "var(--glp-paper)",
        boxShadow: "0 10px 40px -20px rgba(45, 80, 60, 0.18)",
        border: "1px solid var(--glp-sage-10)",
      }}
      aria-labelledby="customizer-title"
      data-testid="panel-customizer"
    >
      <div className="flex items-center gap-3 mb-2">
        <Palette className="h-5 w-5" style={{ color: "var(--glp-sage-deep)" }} aria-hidden="true" />
        <h2 id="customizer-title" className="text-2xl font-bold" style={{ color: "var(--glp-sage-deep)" }}>
          Make this sanctuary yours
        </h2>
      </div>
      <p className="text-sm mb-6 italic" style={{ color: "var(--glp-ink)", opacity: 0.75 }}>
        Three small, optional choices. Change them anytime. Nothing here is a commitment.
      </p>

      {!authenticated && (
        <div
          className="rounded-2xl p-4 mb-6 flex items-start gap-3"
          style={{ background: "var(--glp-sage-10)", border: "1px solid var(--glp-sage-20)" }}
          data-testid="notice-customizer-locked"
        >
          <Lock className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: "var(--glp-sage-deep)" }} aria-hidden="true" />
          <p className="text-sm" style={{ color: "var(--glp-sage-deep)" }}>
            You can preview choices freely. <a href="/login" className="underline font-semibold" data-testid="link-customizer-login">Sign in</a> to remember your sanctuary.
          </p>
        </div>
      )}

      {error && (
        <div className="rounded-xl px-4 py-3 mb-4 text-sm" role="alert" style={{ background: "var(--glp-rose-15, #fde8ec)", color: "#7a3344" }} data-testid="status-customizer-error">
          {error}
        </div>
      )}

      {/* Palette */}
      <div className="mb-7">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--glp-sage-deep)" }}>
            Palette
          </h3>
          {savedField === "palette" && (
            <span className="text-xs flex items-center gap-1" style={{ color: "var(--glp-sage-deep)" }} data-testid="status-saved-palette">
              <Check className="h-3 w-3" /> saved
            </span>
          )}
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {PALETTE_OPTIONS.map((p) => {
            const active = palette === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => selectPalette(p.id)}
                disabled={savingField === "palette"}
                className="rounded-2xl p-2 transition-all focus:outline-none focus:ring-2 focus:ring-offset-1"
                style={{
                  background: active ? "var(--glp-sage-10)" : "transparent",
                  border: active ? "2px solid var(--glp-sage-deep)" : "2px solid var(--glp-sage-10)",
                  cursor: savingField === "palette" ? "wait" : "pointer",
                }}
                aria-pressed={active}
                aria-label={`Palette ${p.label}${active ? " (selected)" : ""}`}
                data-testid={`button-palette-${p.id}`}
              >
                <div
                  className="w-full aspect-square rounded-xl mb-1.5"
                  style={{ background: p.swatch, boxShadow: "inset 0 -4px 12px rgba(0,0,0,0.10)" }}
                  aria-hidden="true"
                />
                <div className="text-xs font-medium text-center" style={{ color: "var(--glp-sage-deep)" }}>
                  {p.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Accessory */}
      <div className="mb-7">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--glp-sage-deep)" }}>
            Accessory
          </h3>
          {savedField === "accessory" && (
            <span className="text-xs flex items-center gap-1" style={{ color: "var(--glp-sage-deep)" }} data-testid="status-saved-accessory">
              <Check className="h-3 w-3" /> saved
            </span>
          )}
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {ACCESSORY_OPTIONS.map((a) => {
            const active = accessory === a.id;
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => selectAccessory(a.id)}
                disabled={savingField === "accessory"}
                className="rounded-xl p-2 transition-all focus:outline-none focus:ring-2"
                style={{
                  background: active ? "var(--glp-sage-10)" : "transparent",
                  border: active ? "2px solid var(--glp-sage-deep)" : "2px solid var(--glp-sage-10)",
                  cursor: savingField === "accessory" ? "wait" : "pointer",
                }}
                aria-pressed={active}
                aria-label={`Accessory ${a.label}${active ? " (selected)" : ""}`}
                data-testid={`button-accessory-${a.id}`}
              >
                <div className="text-2xl text-center select-none" style={{ color: "var(--glp-sage-deep)" }} aria-hidden="true">
                  {a.glyph}
                </div>
                <div className="text-[10px] font-medium text-center mt-1" style={{ color: "var(--glp-sage-deep)", opacity: 0.8 }}>
                  {a.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Theme */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--glp-sage-deep)" }}>
            Sanctuary theme
          </h3>
          {savedField === "theme" && (
            <span className="text-xs flex items-center gap-1" style={{ color: "var(--glp-sage-deep)" }} data-testid="status-saved-theme">
              <Check className="h-3 w-3" /> saved
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {THEME_OPTIONS.map((t) => {
            const active = theme === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => selectTheme(t.id)}
                disabled={savingField === "theme"}
                className="rounded-2xl p-3 text-left transition-all focus:outline-none focus:ring-2"
                style={{
                  background: active ? "var(--glp-sage-10)" : "transparent",
                  border: active ? "2px solid var(--glp-sage-deep)" : "2px solid var(--glp-sage-10)",
                  cursor: savingField === "theme" ? "wait" : "pointer",
                }}
                aria-pressed={active}
                aria-label={`Theme ${t.label}${active ? " (selected)" : ""}`}
                data-testid={`button-theme-${t.id}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <TreePine className="h-3.5 w-3.5" style={{ color: "var(--glp-sage-deep)" }} aria-hidden="true" />
                  <span className="text-sm font-semibold" style={{ color: "var(--glp-sage-deep)" }}>{t.label}</span>
                </div>
                <p className="text-xs" style={{ color: "var(--glp-ink)", opacity: 0.7 }}>{t.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-xs italic mt-6 text-center" style={{ color: "var(--glp-ink)", opacity: 0.6 }}>
        <Sparkles className="inline h-3 w-3 mr-1" aria-hidden="true" />
        Your sanctuary remembers you, never the other way around.
      </p>
    </section>
  );
}
