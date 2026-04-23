// server/utils/usageCounter.mjs
// File-backed per-identity usage counter with daily rollover.
// Identity = dbUserId for authed users, x-guest-id for guests.

import fs from "fs";
import path from "path";
import { withLock } from "./asyncLock.mjs";

const DIR = path.resolve("data/usage");

function ensureDir() {
  if (!fs.existsSync(DIR)) fs.mkdirSync(DIR, { recursive: true });
}

function sanitize(id) {
  return String(id || "anonymous").replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 64);
}

function getFile(id) {
  return path.join(DIR, `${sanitize(id)}.json`);
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function emptyUsage() {
  return {
    successfulSessions: 0,
    dailySessions: 0,
    lastDay: todayStr(),
  };
}

export function readUsage(id) {
  try {
    ensureDir();
    const file = getFile(id);
    if (!fs.existsSync(file)) return emptyUsage();
    const data = JSON.parse(fs.readFileSync(file, "utf-8"));
    const today = todayStr();
    if (data.lastDay !== today) {
      data.dailySessions = 0;
      data.lastDay = today;
    }
    return {
      successfulSessions: Number(data.successfulSessions) || 0,
      dailySessions: Number(data.dailySessions) || 0,
      lastDay: data.lastDay || today,
    };
  } catch {
    return emptyUsage();
  }
}

export async function incrementSuccessfulSession(id) {
  // Serialize per-identity to prevent lost-update races on concurrent
  // requests from the same user (read-modify-write on a JSON file).
  return withLock(`usage:${id}`, async () => {
    try {
      const data = readUsage(id);
      data.successfulSessions += 1;
      data.dailySessions += 1;
      ensureDir();
      fs.writeFileSync(getFile(id), JSON.stringify(data, null, 2));
      return data;
    } catch {
      return emptyUsage();
    }
  });
}
