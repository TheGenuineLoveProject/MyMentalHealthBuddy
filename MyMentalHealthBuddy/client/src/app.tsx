import { useEffect, useState } from "react";

export default function App() {
  const [status, setStatus] = useState<string>("checking...");

  useEffect(() => {
    fetch("/api/status")
      .then(r => r.json())
      .then(j => setStatus(j.message ?? "ok"))
      .catch(() => setStatus("backend not reachable"));
  }, []);

  return (
    <main role="main" style={{ padding: 24 }}>
      <h1>Frontend OK</h1>
      <p aria-live="polite">Backend status: {status}</p>
      <a href="/healthz" target="_blank" rel="noreferrer">Check /healthz</a>
    </main>
  );
}