const BASE = process.env.BASE_URL || "http://localhost:5000";

let passed = 0;
let failed = 0;
const failures = [];

function log(status, name, detail = "") {
  const icon = status === "PASS" ? "\x1b[32mPASS\x1b[0m" : "\x1b[31mFAIL\x1b[0m";
  console.log(`  [${icon}] ${name}${detail ? " — " + detail : ""}`);
  if (status === "PASS") passed++;
  else { failed++; failures.push(name + (detail ? ": " + detail : "")); }
}

async function checkEndpoint(name, url, opts = {}) {
  try {
    const fetchHeaders = { "Accept": "application/json" };
    if (opts.body) fetchHeaders["Content-Type"] = "application/json";

    const res = await fetch(`${BASE}${url}`, {
      method: opts.method || "GET",
      headers: fetchHeaders,
      body: opts.body ? JSON.stringify(opts.body) : undefined,
    });

    if (opts.expectStatus && res.status !== opts.expectStatus) {
      log("FAIL", name, `expected ${opts.expectStatus}, got ${res.status}`);
      return null;
    }
    if (!opts.expectStatus && !res.ok && !opts.allowFail) {
      log("FAIL", name, `status ${res.status}`);
      return null;
    }

    const text = await res.text();
    let data = null;
    try { data = JSON.parse(text); } catch { data = text; }

    if (opts.validate) {
      const result = opts.validate(data, res.status);
      if (result === true) log("PASS", name);
      else log("FAIL", name, typeof result === "string" ? result : "validation failed");
      return data;
    }
    log("PASS", name);
    return data;
  } catch (err) {
    log("FAIL", name, err.message);
    return null;
  }
}

async function run() {
  console.log(`\n  Admin Pipeline Smoke Test`);
  console.log(`  Base: ${BASE}\n`);

  console.log("  --- Public Endpoints ---");

  await checkEndpoint("GET /api/health", "/api/health", {
    validate: (d) => d && typeof d === "object" ? true : "no health data",
  });

  await checkEndpoint("GET /api/blog (public list)", "/api/blog", {
    validate: (d) => d && d.ok === true ? true : "unexpected response shape",
  });

  await checkEndpoint("GET /api/blog/rss (RSS feed)", "/api/blog/rss", {
    validate: (_d, status) => status === 200 ? true : "bad status",
  });

  await checkEndpoint("POST /api/analytics/event", "/api/analytics/event", {
    method: "POST",
    body: { event_name: "smoke_test", event_category: "test", path: "/smoke-test" },
    validate: (d) => d?.ok === true ? true : "event not accepted",
  });

  await checkEndpoint("POST /api/analytics/event (missing name → 400)", "/api/analytics/event", {
    method: "POST",
    body: { event_category: "test" },
    expectStatus: 400,
    validate: (d, status) => status === 400 ? true : "should reject missing event_name",
  });

  console.log("\n  --- Auth-Protected Endpoints (expect 401 without token) ---");

  await checkEndpoint("GET /api/blog/admin (no token → 401)", "/api/blog/admin", {
    expectStatus: 401,
    validate: (_d, status) => status === 401 ? true : "should require auth",
  });

  await checkEndpoint("GET /api/blog/admin/stats (no token → 401)", "/api/blog/admin/stats", {
    expectStatus: 401,
    validate: (_d, status) => status === 401 ? true : "should require auth",
  });

  await checkEndpoint("POST /api/blog/admin/create (no token → 401)", "/api/blog/admin/create", {
    method: "POST", expectStatus: 401,
    body: { title: "Test", content: "Test content" },
    validate: (_d, status) => status === 401 ? true : "should require auth",
  });

  await checkEndpoint("POST /api/blog/admin/:id/submit (no token → 401)", "/api/blog/admin/fake-id/submit", {
    method: "POST", expectStatus: 401,
    validate: (_d, status) => status === 401 ? true : "should require auth",
  });

  await checkEndpoint("POST /api/blog/admin/:id/approve (no token → 401)", "/api/blog/admin/fake-id/approve", {
    method: "POST", expectStatus: 401,
    validate: (_d, status) => status === 401 ? true : "should require auth",
  });

  await checkEndpoint("POST /api/blog/admin/:id/publish (no token → 401)", "/api/blog/admin/fake-id/publish", {
    method: "POST", expectStatus: 401,
    validate: (_d, status) => status === 401 ? true : "should require auth",
  });

  await checkEndpoint("GET /api/admin/publishing/recommendations (no token → 401 or 404)", "/api/admin/publishing/recommendations", {
    allowFail: true,
    validate: (_d, status) => status === 401 || status === 403 || status === 404 ? true : "should require auth (got " + status + ")",
  });

  console.log("\n  --- Content Safety Validator (unit check) ---");

  try {
    const { validatePublishingContent } = await import("../shared/publishingRules.mjs");

    const clean = validatePublishingContent("A Gentle Reminder", "Nurturing your inner self", "You are worthy of love and kindness. Remember to breathe deeply and find your center in this moment. Growth takes time and patience.");
    if (clean.valid) log("PASS", "Clean content passes validation");
    else log("FAIL", "Clean content passes validation", "marked invalid: " + clean.errors.join(", "));

    const medical = validatePublishingContent("Cure Your Anxiety", "Quick fix for anxiety", "This technique will cure your depression and treat all symptoms. It is a guaranteed solution for everyone.");
    if (!medical.valid && medical.errors.length > 0) log("PASS", "Medical claims blocked");
    else log("FAIL", "Medical claims blocked", "should have flagged medical claims");

    const urgency = validatePublishingContent("Last Chance Offer", "Act now", "Don't miss out! Act now before time runs out. This is your last chance to sign up for our special program.");
    if (!urgency.valid && urgency.errors.length > 0) log("PASS", "Urgency manipulation blocked");
    else log("FAIL", "Urgency manipulation blocked", "should have flagged urgency");

    const pathologizing = validatePublishingContent("Fix Yourself", "Help for the broken", "You're broken and damaged. If you don't fix yourself now you'll never get better. You should be ashamed.");
    if (!pathologizing.valid && pathologizing.errors.length > 0) log("PASS", "Pathologizing language blocked");
    else log("FAIL", "Pathologizing language blocked", "should have flagged pathologizing");

    const sensitive = validatePublishingContent("Healing from Trauma", "A reflection on recovery", "After experiencing suicidal thoughts, here is what helped me recover and find a path forward through my darkest moments.");
    if (sensitive.warnings.length > 0) log("PASS", "Sensitive topics warn about crisis links");
    else log("FAIL", "Sensitive topics warn about crisis links", "should have warned about crisis resources");

    const tooShort = validatePublishingContent("Hi", "", "Short");
    if (!tooShort.valid) log("PASS", "Too-short content rejected");
    else log("FAIL", "Too-short content rejected", "should reject very short content");
  } catch (err) {
    log("FAIL", "Content safety validator import", err.message);
  }

  console.log(`\n  Results: ${passed} passed, ${failed} failed`);
  if (failures.length > 0) {
    console.log("  Failures:");
    failures.forEach(f => console.log(`    - ${f}`));
  }
  console.log("");

  process.exit(failed > 0 ? 1 : 0);
}

run();
