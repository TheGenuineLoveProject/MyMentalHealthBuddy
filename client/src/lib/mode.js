/* File: client/src/lib/mode.js */
export function setUIMode(mode) {
  const root = document.documentElement;
  if (!mode || mode === "default") root.removeAttribute("data-mode");
  else root.setAttribute("data-mode", mode);
  try { localStorage.setItem("glp-mode", mode || "default"); } catch {}
}

export function initUIMode() {
  try {
    const saved = localStorage.getItem("glp-mode");
    if (saved && saved !== "default") document.documentElement.setAttribute("data-mode", saved);
  } catch {}
}