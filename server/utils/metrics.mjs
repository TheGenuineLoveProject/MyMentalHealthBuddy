const counters = {};
const startedAt = Date.now();

function increment(name, tags = {}) {
  try {
    const plan = tags.plan || "unknown";
    const key = `${name}:${plan}`;
    counters[key] = (counters[key] || 0) + 1;
  } catch (_) {
  }
}

function getSummary() {
  const summary = {};
  for (const [key, count] of Object.entries(counters)) {
    const [name, plan] = key.split(":");
    if (!summary[name]) summary[name] = { total: 0, byPlan: {} };
    summary[name].total += count;
    summary[name].byPlan[plan] = count;
  }
  return {
    counters: summary,
    uptimeSeconds: Math.floor((Date.now() - startedAt) / 1000),
    collectedSince: new Date(startedAt).toISOString(),
  };
}

function reset() {
  for (const key of Object.keys(counters)) {
    delete counters[key];
  }
}

export { increment, getSummary, reset };
