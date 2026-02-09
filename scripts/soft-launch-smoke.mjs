const BASE = process.env.BASE_URL || "http://localhost:5000";

const ROUTES = [
  { path: "/", name: "Homepage" },
  { path: "/pricing", name: "Pricing" },
  { path: "/blog", name: "Blog" },
  { path: "/newsletter", name: "Newsletter" },
  { path: "/crisis", name: "Crisis Resources" },
  { path: "/about", name: "About" },
  { path: "/faq", name: "FAQ" },
  { path: "/contact", name: "Contact" },
  { path: "/privacy", name: "Privacy" },
  { path: "/terms", name: "Terms" },
  { path: "/api/health", name: "API Health", expectJson: true },
];

async function run() {
  console.log(`\n  Soft Launch Smoke Test`);
  console.log(`  Base: ${BASE}\n`);

  let passed = 0;
  let failed = 0;
  const failures = [];

  for (const route of ROUTES) {
    try {
      const res = await fetch(`${BASE}${route.path}`, {
        redirect: "follow",
        headers: { "Accept": "text/html,application/json" },
      });

      if (res.status >= 200 && res.status < 400) {
        if (route.expectJson) {
          const data = await res.json();
          if (data.status === "healthy" || data.ok) {
            console.log(`  PASS  ${route.path}  (${res.status}) ${route.name}`);
            passed++;
          } else {
            console.log(`  FAIL  ${route.path}  (${res.status}) ${route.name} — unhealthy response`);
            failed++;
            failures.push(route.path);
          }
        } else {
          console.log(`  PASS  ${route.path}  (${res.status}) ${route.name}`);
          passed++;
        }
      } else {
        console.log(`  FAIL  ${route.path}  (${res.status}) ${route.name}`);
        failed++;
        failures.push(route.path);
      }
    } catch (err) {
      console.log(`  FAIL  ${route.path}  (error) ${route.name} — ${err.message}`);
      failed++;
      failures.push(route.path);
    }
  }

  console.log(`\n  Results: ${passed} passed, ${failed} failed`);

  if (failed > 0) {
    console.log(`  Failed routes: ${failures.join(", ")}`);
    console.log(`\n  STATUS: FAIL\n`);
    process.exit(1);
  } else {
    console.log(`\n  STATUS: PASS\n`);
    process.exit(0);
  }
}

run();
