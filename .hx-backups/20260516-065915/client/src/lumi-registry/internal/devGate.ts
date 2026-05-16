/**
 * Vite + SSR-safe dev gate.
 *
 * `import.meta.env.DEV` is the canonical Vite signal in the browser.
 * `process.env.NODE_ENV === "development"` is the canonical Node/SSR
 * signal. We check both — either one being true means "show dev
 * affordances", and both being absent (e.g. an obscure runner) defaults
 * to false so production behaviour wins.
 */

export function isDevEnvironment(): boolean {
  // Vite browser runtime — preferred.
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const meta = import.meta as any;
    if (meta && meta.env && typeof meta.env.DEV === "boolean") {
      return meta.env.DEV === true;
    }
  } catch {
    /* import.meta unavailable — fall through */
  }
  // Node / SSR / Jest / Vitest.
  try {
    if (typeof process !== "undefined" && process.env && process.env.NODE_ENV === "development") {
      return true;
    }
  } catch {
    /* process unavailable — fall through */
  }
  return false;
}
