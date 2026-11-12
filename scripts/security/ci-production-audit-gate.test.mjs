import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

// Optional baseline path lets the same regressions demonstrate the old failure.
const gate = process.env.AUDIT_GATE_UNDER_TEST ||
  fileURLToPath(new URL("./ci-production-audit-gate.mjs", import.meta.url));

function report(vulnerabilities = {}) {
  const counts = { info: 0, low: 0, moderate: 0, high: 0, critical: 0, total: 0 };
  for (const item of Object.values(vulnerabilities)) {
    counts[item.severity]++;
    counts.total++;
  }
  return { auditReportVersion: 2, vulnerabilities, metadata: { vulnerabilities: counts } };
}

function finding(severity) {
  return { name: "fixture", severity, via: [{ severity, url: "https://example.test/advisory" }] };
}

function run(value, { raw = false, args } = {}) {
  const cwd = mkdtempSync(join(tmpdir(), "mmhb-audit-gate-"));
  try {
    const path = join(cwd, "audit.json");
    writeFileSync(path, raw ? value : JSON.stringify(value));
    return spawnSync(process.execPath, [gate, ...(args || ["--audit-json", path])], {
      cwd, encoding: "utf8", timeout: 5000,
    });
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
}

function denied(result, reason) {
  assert.ifError(result.error);
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stderr, /SECURITY_AUDIT_GATE=DENY/);
  assert.doesNotMatch(result.stdout, /SECURITY_AUDIT_GATE=ALLOW/);
  if (reason) assert.ok(result.stderr.includes(`SECURITY_AUDIT_REASON=${reason}`), result.stderr);
}

test("valid clean npm v2 report passes", () => {
  const result = run(report());
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /SECURITY_AUDIT_REASON=NO_HIGH_OR_CRITICAL_FINDINGS/);
});

for (const severity of ["info", "low", "moderate"]) {
  test(`valid ${severity} finding preserves existing high/critical policy`, () => {
    const result = run(report({ fixture: finding(severity) }));
    assert.equal(result.status, 0, result.stderr);
  });
}

for (const severity of ["high", "critical"]) {
  test(`valid non-router ${severity} finding remains blocked`, () => {
    denied(run(report({ fixture: finding(severity) })), "NON_ROUTER_HIGH_CRITICAL_FINDING_PRESENT");
  });
}

const invalid = [
  ["array vulnerability collection", () => ({ vulnerabilities: [] })],
  ["array collection in otherwise complete report", () => ({ ...report(), vulnerabilities: [] })],
  ["null report", () => null],
  ["array report", () => []],
  ["empty object", () => ({})],
  ["unsupported report version", () => ({ ...report(), auditReportVersion: 3 })],
  ["missing report version", () => { const r = report(); delete r.auditReportVersion; return r; }],
  ["missing metadata", () => { const r = report(); delete r.metadata; return r; }],
  ["array metadata", () => ({ ...report(), metadata: [] })],
  ["npm error accompanying empty findings", () => ({ ...report(), error: { code: "EAUDIT", detail: "SECRET_FIXTURE" } })],
  ["null finding", () => ({ ...report(), vulnerabilities: { fixture: null } })],
  ["missing severity", () => { const r = report({ fixture: finding("high") }); delete r.vulnerabilities.fixture.severity; return r; }],
  ["unknown severity", () => ({ ...report(), vulnerabilities: { fixture: finding("severe") } })],
  ["array severity", () => { const r = report({ fixture: finding("low") }); r.vulnerabilities.fixture.severity = ["low"]; return r; }],
  ["missing via", () => { const r = report({ fixture: finding("low") }); delete r.vulnerabilities.fixture.via; return r; }],
  ["empty via", () => { const r = report({ fixture: finding("low") }); r.vulnerabilities.fixture.via = []; return r; }],
  ["malformed advisory severity", () => { const r = report({ fixture: finding("low") }); r.vulnerabilities.fixture.via[0].severity = "severe"; return r; }],
  ["array advisory severity", () => { const r = report({ fixture: finding("low") }); r.vulnerabilities.fixture.via[0].severity = ["low"]; return r; }],
  ["invalid causal entry", () => { const r = report({ fixture: finding("low") }); r.vulnerabilities.fixture.via = [null]; return r; }],
  ["missing referenced finding", () => { const r = report({ fixture: finding("low") }); r.vulnerabilities.fixture.via = ["absent"]; return r; }],
  ["understated summary", () => { const r = report({ fixture: finding("high") }); r.metadata.vulnerabilities.high = 0; return r; }],
  ["hidden finding reported only in summary", () => { const r = report(); r.metadata.vulnerabilities.high = 1; return r; }],
  ["string count", () => { const r = report(); r.metadata.vulnerabilities.high = "0"; return r; }],
  ["missing count", () => { const r = report(); delete r.metadata.vulnerabilities.critical; return r; }],
  ["negative count", () => { const r = report(); r.metadata.vulnerabilities.low = -1; return r; }],
  ["inconsistent total", () => { const r = report(); r.metadata.vulnerabilities.total = 1; return r; }],
];

for (const [name, input] of invalid) {
  test(`rejects ${name}`, () => {
    const result = run(input());
    denied(result);
    assert.doesNotMatch(result.stdout + result.stderr, /SECRET_FIXTURE/);
  });
}

test("rejects invalid JSON", () => denied(run("{", { raw: true }), "INVALID_AUDIT_JSON"));
test("rejects missing file", () => denied(run({}, { args: ["--audit-json", "missing.json"] }), "INVALID_AUDIT_JSON"));
test("rejects missing CLI path", () => denied(run({}, { args: ["--audit-json"] }), "MISSING_AUDIT_JSON_PATH"));
test("rejects unknown CLI argument", () => denied(run({}, { args: ["--unknown"] }), "UNKNOWN_ARGUMENT"));

test("valid transitive low finding preserves policy", () => {
  const r = report({ dependency: finding("low"), parent: { severity: "low", via: ["dependency"] } });
  assert.equal(run(r).status, 0);
});

test("rejects low aggregate hiding a critical advisory", () => {
  const r = report({ fixture: { severity: "low", via: finding("critical").via } });
  denied(run(r), "AUDIT_SEVERITY_MISMATCH");
});

test("preserves differing severities across referenced packages", () => {
  const r = report({
    parent: { severity: "low", via: ["dependency"] },
    dependency: finding("moderate"),
  });
  assert.equal(run(r).status, 0);
});

test("existing severe-finding policy rejects unresolved cycles", () => {
  const r = report({
    parent: { severity: "high", via: ["dependency"] },
    dependency: { severity: "high", via: ["parent"] },
  });
  denied(run(r), "VULNERABILITY_GRAPH_CYCLE");
});
