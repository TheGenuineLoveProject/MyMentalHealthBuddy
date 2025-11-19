import { useEffect, useState } from "react";

export default function AIDashboard() {
  const [bots, setBots] = useState([]);
  useEffect(() => {
    fetch("/api/ai/status")
      .then(r => r.json())
      .then(setBots)
      .catch(() => setBots([]));
  }, []);

  return (
    <div style={{padding:20}}>
      <h1>🤖 AI Employee Dashboard</h1>
      <table border="1" cellPadding="8">
        <thead><tr><th>Role</th><th>Schedule</th><th>Last Run</th><th>Status</th></tr></thead>
        <tbody>
          {bots.map(b => (
            <tr key={b.role}>
              <td>{b.role}</td>
              <td>{b.schedule}</td>
              <td>{b.last_run}</td>
              <td>{b.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}