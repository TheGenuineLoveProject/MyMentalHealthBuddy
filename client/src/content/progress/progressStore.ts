type Win = { id: string; routeKey: string; note?: string; createdAt: number };

const WINS_KEY = "glp:wins:v1";
const STREAK_KEY = "glp:streak:v1";

function read<T>(key: string, fallback: T): T {
  try {
    if (typeof window === 'undefined') return fallback;
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function dayStamp(ts: number) {
  const d = new Date(ts);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export function addWin(routeKey: string, note?: string) {
  const wins = read<Win[]>(WINS_KEY, []);
  const win: Win = { 
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, 
    routeKey, 
    note, 
    createdAt: Date.now() 
  };
  wins.unshift(win);
  write(WINS_KEY, wins.slice(0, 200));
  bumpStreak();
}

export function listWins(limit = 25): Win[] {
  return read<Win[]>(WINS_KEY, []).slice(0, limit);
}

export function getStreak(): { current: number; lastDay: string | null } {
  return read(STREAK_KEY, { current: 0, lastDay: null });
}

export function bumpStreak() {
  const s = getStreak();
  const today = dayStamp(Date.now());

  if (s.lastDay === today) return;

  const y = new Date();
  y.setDate(y.getDate() - 1);
  const yesterday = dayStamp(y.getTime());

  const next = {
    current: s.lastDay === yesterday ? s.current + 1 : 1,
    lastDay: today,
  };

  write(STREAK_KEY, next);
}

export function resetStreak() {
  write(STREAK_KEY, { current: 0, lastDay: null });
}

export function clearWins() {
  write(WINS_KEY, []);
}
