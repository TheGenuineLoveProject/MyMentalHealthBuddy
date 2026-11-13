import { describe, expect, it } from "vitest";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { hasExited, stopChild } from "../../scripts/qualification/process-lifecycle.mjs";

describe("disposable process cleanup", () => {
  it("recognizes an already signal-terminated child without waiting for a past event", async () => {
    const child = spawn(process.execPath, ["-e", "setInterval(() => {}, 1000)"], { stdio: "ignore" });
    const exited = once(child, "exit");
    child.kill("SIGTERM");
    await exited;
    expect(child.signalCode).toBe("SIGTERM");
    expect(child.exitCode).toBeNull();
    expect(hasExited(child)).toBe(true);
    await stopChild(child, { graceMs: 20, killMs: 1000 });
  }, 5000);

  it("stops a running child and observes completion", async () => {
    const child = spawn(process.execPath, ["-e", "setInterval(() => {}, 1000)"], { stdio: "ignore" });
    try {
      await stopChild(child, { graceMs: 1000, killMs: 1000 });
      expect(hasExited(child)).toBe(true);
    } finally { if (!hasExited(child)) child.kill("SIGKILL"); }
  }, 5000);

  it("bounds shutdown when a child ignores the graceful signal", async () => {
    const child = spawn(process.execPath, ["-e", "process.on('SIGTERM', () => {}); process.send('ready'); setInterval(() => {}, 1000)"], {
      stdio: ["ignore", "ignore", "ignore", "ipc"],
    });
    try {
      await once(child, "message");
      await stopChild(child, { graceMs: 20, killMs: 1000 });
      expect(child.signalCode).toBe("SIGKILL");
      expect(hasExited(child)).toBe(true);
    } finally { if (!hasExited(child)) child.kill("SIGKILL"); }
  }, 5000);

  it("escalates an isolated command group when its leader ignores SIGTERM", async () => {
    const child = spawn(process.execPath, ["-e", "process.on('SIGTERM', () => {}); process.send('ready'); setInterval(() => {}, 1000)"], {
      stdio: ["ignore", "ignore", "ignore", "ipc"], detached: true,
    });
    const signals = [];
    try {
      await once(child, "message");
      await stopChild(child, {
        graceMs: 20, killMs: 1000,
        signal: name => { signals.push(name); process.kill(-child.pid, name); },
      });
      expect(signals).toEqual(["SIGTERM", "SIGKILL"]);
      expect(child.signalCode).toBe("SIGKILL");
    } finally { if (!hasExited(child)) process.kill(-child.pid, "SIGKILL"); }
  }, 5000);
});
