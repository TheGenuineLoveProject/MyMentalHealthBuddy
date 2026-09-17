// Non-secret, per-browser authentication transition marker. This is NOT a credential
// or server-side revocation mechanism. A changed generation invalidates old replies.
export const AUTH_GENERATION_KEY = "mmhb_auth_generation";
const TOKEN_KEY = "mmhb_token";
let memoryGeneration = "";
let memoryOverride = false;
let counter = 0;

function read(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}

function generation() {
  if (memoryOverride) return memoryGeneration;
  const stored = read(AUTH_GENERATION_KEY);
  return stored ?? memoryGeneration;
}

export function advanceAuthGeneration() {
  // Uniqueness prevents old replies from becoming current after logout + login.
  // The fallback is only an event identifier, never a security token.
  const id = globalThis.crypto?.randomUUID?.()
    ?? `${Date.now()}-${++counter}-${Math.random().toString(36).slice(2)}`;
  memoryGeneration = id;
  try {
    localStorage.setItem(AUTH_GENERATION_KEY, id);
    memoryOverride = false;
  } catch {
    // Storage-disabled environments retain a same-document fence only.
    memoryOverride = true;
  }
  return id;
}

export function captureAuthState() {
  return { generation: generation(), token: read(TOKEN_KEY) };
}

export function isAuthGenerationCurrent(snapshot) {
  return Boolean(snapshot) && snapshot.generation === generation();
}

export function isAuthStateCurrent(snapshot) {
  return isAuthGenerationCurrent(snapshot) && snapshot.token === read(TOKEN_KEY);
}
