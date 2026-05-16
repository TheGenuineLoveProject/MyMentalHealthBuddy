import { useCallback, useEffect, useMemo, useState } from "react";
import { LUMI_THEMES, DEFAULT_THEME, STORAGE_KEY } from "../data/lumiThemes";

/**
 * @typedef {(typeof LUMI_THEMES)[number]} LumiTheme
 */

function readStoredTheme() {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return DEFAULT_THEME;
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && LUMI_THEMES.some((t) => t.id === stored)) {
      return stored;
    }
  } catch {
    /* swallow — fall through to default */
  }
  return DEFAULT_THEME;
}

function findTheme(id) {
  return LUMI_THEMES.find((t) => t.id === id) || LUMI_THEMES[0];
}

function applyThemeToDocument(theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  // CSS variables that lumi-mascot.css and lumi-tokens.css can read.
  root.style.setProperty("--lumi-primary", theme.primary);
  root.style.setProperty("--lumi-accent", theme.accent);
  root.style.setProperty("--lumi-filter", theme.filter);

  // Body class — strip previous lumi-theme-* before adding the new one so
  // exactly one theme class is ever present.
  const body = document.body;
  if (!body) return;
  const toRemove = [];
  body.classList.forEach((c) => {
    if (c.startsWith("lumi-theme-")) toRemove.push(c);
  });
  toRemove.forEach((c) => body.classList.remove(c));
  body.classList.add(`lumi-theme-${theme.id}`);
}

/**
 * useLumiTheme
 * ------------
 * Owns the persisted Lumi color theme. Reads from localStorage on mount,
 * exposes the full theme object, and applies CSS variables + body class
 * to the document whenever the theme changes.
 *
 * Returns:
 *   - themeId    string                 Active theme id.
 *   - theme      LumiTheme              Active theme object (full record).
 *   - setThemeId (id: string) => void   Setter — validates id, persists,
 *                                       applies CSS variables + body class.
 */
export function useLumiTheme() {
  const [themeId, setThemeIdState] = useState(() => readStoredTheme());

  const theme = useMemo(() => findTheme(themeId), [themeId]);

  // Apply on every change AND on first mount, so SSR-rendered HTML or a
  // post-hydration theme rehydration both end up with the right CSS state.
  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  const setThemeId = useCallback((nextId) => {
    if (!LUMI_THEMES.some((t) => t.id === nextId)) {
      // Silently no-op for unknown ids — never write garbage to storage.
      return;
    }
    setThemeIdState(nextId);
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, nextId);
      } catch {
        /* quota / private mode — visual change still applies in-memory */
      }
    }
  }, []);

  return { themeId, theme, setThemeId };
}

export default useLumiTheme;
