export type FlagKey =
  | "showSearch"
  | "showRecommendations"
  | "showTinyStep"
  | "showTrustCenter"
  | "showProgressDashboard"
  | "enableExperiments";

const KEY = "glp:flags:v1";

const DEFAULTS: Record<FlagKey, boolean> = {
  showSearch: true,
  showRecommendations: true,
  showTinyStep: true,
  showTrustCenter: true,
  showProgressDashboard: true,
  enableExperiments: false,
};

function read(): Record<string, boolean> {
  try {
    if (typeof window === 'undefined') return {};
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

function write(v: Record<string, boolean>) {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEY, JSON.stringify(v));
  } catch {}
}

export function getFlag(key: FlagKey): boolean {
  const overrides = read();
  if (key in overrides) return overrides[key];
  return DEFAULTS[key] ?? false;
}

export function setFlag(key: FlagKey, value: boolean) {
  const current = read();
  current[key] = value;
  write(current);
}

export function resetFlags() {
  try {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(KEY);
  } catch {}
}

export function getAllFlags(): Record<FlagKey, boolean> {
  const overrides = read();
  return Object.keys(DEFAULTS).reduce((acc, key) => {
    const k = key as FlagKey;
    acc[k] = k in overrides ? overrides[k] : DEFAULTS[k];
    return acc;
  }, {} as Record<FlagKey, boolean>);
}

export function listFlagKeys(): FlagKey[] {
  return Object.keys(DEFAULTS) as FlagKey[];
}
