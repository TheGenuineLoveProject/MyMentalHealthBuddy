import fetch from "node-fetch";

const BASE = "http://localhost:5000";

async function test(endpoint) {
  try {
    const res = await fetch(BASE + endpoint);
    const text = await res.text();
    console.log(`✔️  ${endpoint}`, res.status, text.slice(0, 80));
  } catch (err) {
    console.error(`❌  ${endpoint}`, err.message);
  }
}

(async () => {
  console.log("\n=== ROUTE TEST START ===\n");

  await test("/auth/ping");
  await test("/mood/ping");
  await test("/journal/ping");
  await test("/content/ping");
  await test("/analytics/ping");
  await test("/billing/ping");
  await test("/stripe/ping");
  await test("/ai/ping");

  console.log("\n=== ROUTE TEST COMPLETE ===\n");
})();