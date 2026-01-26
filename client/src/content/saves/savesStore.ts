const KEY = "glp:saves:v1";

function read(): string[] {
  try {
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function write(v: string[]) {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEY, JSON.stringify(v));
  } catch {}
}

export function isSaved(routeKey: string): boolean {
  return read().includes(routeKey);
}

export function toggleSave(routeKey: string) {
  const v = read();
  if (v.includes(routeKey)) write(v.filter((x) => x !== routeKey));
  else write([routeKey, ...v].slice(0, 500));
}

export function listSaves(): string[] {
  return read();
}

export function clearSaves() {
  try {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(KEY);
  } catch {}
}
