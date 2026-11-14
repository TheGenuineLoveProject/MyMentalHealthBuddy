import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { createServer, request } from "node:http";
import { fileURLToPath } from "node:url";
import test from "node:test";

const projectRoot = fileURLToPath(new URL("../../", import.meta.url));
const preload = new URL("../../server/observability/preload.mjs", import.meta.url);
const tracing = new URL("../../server/observability/tracing.mjs", import.meta.url);
const parentTraceId = "11111111111111111111111111111111";
const parentSpanId = "2222222222222222";

// The preload runs before this code loads Express or HTTP. The real HTTP
// instrumentation must create the incoming span and inject outbound context.
const childSource = `
  const { createRequire } = await import('node:module');
  const require = createRequire(import.meta.url);
  const express = require('express');
  const http = require('node:http');
  const { context, trace, isSpanContextValid } = require('@opentelemetry/api');
  const { getTracingState } = await import(${JSON.stringify(tracing.href)});
  const app = express();
  const server = http.createServer(app);
  function activeContext() {
    const spanContext = trace.getSpan(context.active())?.spanContext();
    return spanContext && isSpanContextValid(spanContext) ? spanContext : null;
  }
  app.get('/downstream', (req, res) => {
    res.json({ context: activeContext(), traceparent: req.headers.traceparent || null });
  });
  app.get('/entry', (_req, res) => {
    const entryContext = activeContext();
    const outgoing = http.get({
      hostname: '127.0.0.1', port: server.address().port,
      path: '/downstream', agent: false,
    }, response => {
      let body = '';
      response.setEncoding('utf8');
      response.on('data', chunk => {
        body += chunk;
        if (body.length > 16384) outgoing.destroy(new Error('Oversized downstream response'));
      });
      response.on('end', () => {
        clearTimeout(timeout);
        try {
          res.json({ ok: response.statusCode === 200, entryContext,
            downstream: JSON.parse(body), tracingState: getTracingState() });
        } catch (error) { res.status(500).json({ error: error.message }); }
      });
      response.on('error', error => outgoing.destroy(error));
    });
    const timeout = setTimeout(() => outgoing.destroy(new Error('Downstream timeout')), 2000);
    outgoing.on('error', error => {
      clearTimeout(timeout);
      if (!res.headersSent) res.status(500).json({ error: error.message });
    });
  });
  // The production preload already registered its SIGTERM SDK shutdown hook.
  // Close only this synthetic app; process exit then waits for the SDK flush.
  process.once('SIGTERM', () => {
    server.closeAllConnections();
    server.close();
  });
  server.listen(0, '127.0.0.1', () => {
    console.log('TRACING_SMOKE_READY=' + JSON.stringify({ port: server.address().port }));
  });
`;

function bounded(promise, milliseconds, message) {
  let timer;
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error(message)), milliseconds);
    }),
  ]).finally(() => clearTimeout(timer));
}

function requestEntry(port) {
  return new Promise((resolve, reject) => {
    const req = request({
      hostname: "127.0.0.1", port, path: "/entry", agent: false,
      headers: { traceparent: `00-${parentTraceId}-${parentSpanId}-01` },
    });
    const timer = setTimeout(() => req.destroy(new Error("Entry request timed out")), 3000);
    req.on("error", error => { clearTimeout(timer); reject(error); });
    req.on("response", res => {
      let body = "";
      res.setEncoding("utf8");
      res.on("data", chunk => {
        body += chunk;
        if (body.length > 65536) req.destroy(new Error("Oversized entry response"));
      });
      res.on("error", error => { clearTimeout(timer); reject(error); });
      res.on("end", () => {
        clearTimeout(timer);
        try { resolve({ status: res.statusCode, body: JSON.parse(body) }); }
        catch (error) { reject(error); }
      });
    });
    req.end();
  });
}

async function exercise(disabled) {
  const exports = [];
  let stopping = false;
  const collector = createServer((req, res) => {
    const chunks = [];
    let bytes = 0;
    req.on("data", chunk => {
      bytes += chunk.length;
      if (bytes > 1048576) req.destroy(new Error("Oversized OTLP payload"));
      else chunks.push(chunk);
    });
    req.on("error", () => {});
    req.on("end", () => {
      exports.push({ path: req.url, type: req.headers["content-type"],
        body: Buffer.concat(chunks).toString("utf8"), duringShutdown: stopping });
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end("{}");
    });
  });
  let child;
  let exited;
  try {
    collector.listen(0, "127.0.0.1");
    await bounded(once(collector, "listening"), 2000, "Collector failed to start");
    let output = "";
    let readyResolve;
    let readyReject;
    const ready = new Promise((resolve, reject) => { readyResolve = resolve; readyReject = reject; });
    child = spawn(process.execPath, ["--import", preload.href, "--input-type=module", "--eval", childSource], {
      cwd: projectRoot,
      // Literal fixture environment: no application, provider, cloud, proxy,
      // credential, NODE_OPTIONS, or inherited telemetry configuration.
      env: {
        NODE_ENV: "test",
        OTEL_DISABLED: disabled ? "true" : "false",
        OTEL_SERVICE_NAME: "mmhb-offline-tracing-smoke",
        OTEL_DEPLOYMENT_ENVIRONMENT: "offline-test",
        OTEL_EXPORTER_OTLP_ENDPOINT: `http://127.0.0.1:${collector.address().port}`,
        OTEL_METRICS_EXPORTER: "none",
        OTEL_LOGS_EXPORTER: "none",
        OTEL_NODE_RESOURCE_DETECTORS: "env,process",
        OTEL_NODE_ENABLED_INSTRUMENTATIONS: "http,express",
        OTEL_TRACES_SAMPLER: "always_on",
        OTEL_PROPAGATORS: "tracecontext",
        OTEL_BSP_SCHEDULE_DELAY: "60000",
        OTEL_BSP_EXPORT_TIMEOUT: "2000",
        OTEL_EXPORTER_OTLP_TIMEOUT: "2000",
      },
      stdio: ["ignore", "pipe", "pipe"],
    });
    exited = new Promise(resolve => {
      child.once("error", error => { readyReject(error); resolve({ error, output }); });
      child.once("close", (code, signal) => {
        readyReject(new Error(`Tracing child exited before readiness: ${output}`));
        resolve({ code, signal, output });
      });
    });
    const capture = chunk => {
      output += chunk;
      if (output.length > 65536) {
        readyReject(new Error("Tracing child exceeded output limit"));
        child.kill("SIGKILL");
        return;
      }
      const match = output.match(/TRACING_SMOKE_READY=(\{[^\n]+\})/);
      if (match) readyResolve(JSON.parse(match[1]));
    };
    child.stdout.on("data", capture);
    child.stderr.on("data", capture);
    const { port } = await bounded(ready, 10000, "Tracing child startup timed out");
    const response = await requestEntry(port);
    const beforeShutdown = exports.length;
    stopping = true;
    assert.ok(child.kill("SIGTERM"), "Tracing child must accept the shutdown signal");
    const exit = await bounded(exited, 5000, "Tracing child did not exit after SDK shutdown");
    assert.equal(exit.code, 0, exit.output);
    return { response, exports, beforeShutdown, output: exit.output };
  } finally {
    try {
      if (child && child.exitCode === null && child.signalCode === null) child.kill("SIGKILL");
      if (exited) await bounded(exited, 2000, "Tracing child could not be reaped");
    } finally {
      collector.closeAllConnections();
      await bounded(new Promise(resolve => collector.close(resolve)), 2000, "Collector cleanup timed out");
    }
  }
}

test("enabled preload propagates active HTTP context and exports to loopback on shutdown", { timeout: 22000 }, async () => {
  const result = await exercise(false);
  assert.equal(result.response.status, 200);
  const { ok, entryContext, downstream, tracingState } = result.response.body;
  assert.equal(ok, true);
  assert.equal(tracingState.enabled, true, result.output);
  assert.equal(tracingState.reason, "started");
  assert.equal(tracingState.exporter, "otlp-http");
  assert.deepEqual(tracingState.errors, []);
  assert.equal(entryContext?.traceId, parentTraceId);
  assert.match(entryContext?.spanId || "", /^[a-f0-9]{16}$/);
  assert.notEqual(entryContext.spanId, "0000000000000000");
  assert.notEqual(entryContext.spanId, parentSpanId);
  assert.equal(downstream.context?.traceId, parentTraceId);
  assert.notEqual(downstream.context?.spanId, entryContext.spanId);
  assert.match(downstream.traceparent || "", new RegExp(`^00-${parentTraceId}-[a-f0-9]{16}-01$`));
  assert.equal(result.beforeShutdown, 0, "Batch should flush through the production shutdown hook");
  assert.match(result.output, /tracing shutdown complete \(SIGTERM\)/);
  assert.ok(result.exports.length > 0, "SDK shutdown must export a trace payload");
  assert.ok(result.exports.every(payload => payload.duringShutdown && payload.path === "/v1/traces"));
  const spans = result.exports.flatMap(payload => {
    assert.match(payload.type || "", /^application\/json/);
    const body = JSON.parse(payload.body);
    return (body.resourceSpans || []).flatMap(resource =>
      (resource.scopeSpans || []).flatMap(scope => scope.spans || []));
  });
  assert.ok(spans.some(span => span.traceId === parentTraceId), "Collector must receive the synthetic request trace");
});

test("disabled preload serves HTTP without active tracing or collector exports", { timeout: 22000 }, async () => {
  const result = await exercise(true);
  assert.equal(result.response.status, 200);
  const { ok, entryContext, downstream, tracingState } = result.response.body;
  assert.equal(ok, true);
  assert.equal(tracingState.enabled, false);
  assert.equal(tracingState.reason, "OTEL_DISABLED=true");
  assert.deepEqual(tracingState.errors, []);
  assert.equal(entryContext, null);
  assert.equal(downstream.context, null);
  assert.equal(downstream.traceparent, null);
  assert.equal(result.exports.length, 0);
});
