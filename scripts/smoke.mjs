// scripts/smoke.mjs
const BASE = process.env.SMOKE_BASE_URL || "http://127.0.0.1:5000";
await fetch(`${BASE}/api/health`)
await fetch(`${BASE}/api/mirror`, { ... })

async function hit(path, opts) {
  const res = await fetch(`${base}${path}`, opts);
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = { raw: text }; }
  return { ok: res.ok, status: res.status, json };
}

console.log("SMOKE: health");
console.log(await hit("/api/health"));

console.log("SMOKE: mirror");
console.log(
  await hit("/api/mirror", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: "I want to feel calmer and trust myself again.", enableAI: false }),
  })
);