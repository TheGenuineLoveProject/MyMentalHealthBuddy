export function hasExited(child) {
  return !child || !child.pid || child.exitCode !== null || child.signalCode !== null;
}

async function waitForExit(child, timeoutMs) {
  if (hasExited(child)) return true;
  return new Promise(resolve => {
    const finish = exited => {
      clearTimeout(timer);
      child.removeListener("exit", onExit);
      resolve(exited);
    };
    const onExit = () => finish(true);
    const timer = setTimeout(() => finish(false), timeoutMs);
    child.once("exit", onExit);
    if (hasExited(child)) finish(true);
  });
}

export async function stopChild(child, {
  graceMs = 10000, killMs = 5000, signal = name => child.kill(name),
} = {}) {
  if (hasExited(child)) return;
  signal("SIGTERM");
  if (await waitForExit(child, graceMs)) return;
  signal("SIGKILL");
  if (!await waitForExit(child, killMs)) throw new Error("Child shutdown timeout");
}
