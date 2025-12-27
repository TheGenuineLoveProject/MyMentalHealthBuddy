import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Admin() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("/api/admin/stats", {
      credentials: "include",
    })
      .then(r => r.json())
      .then(setStats)
      .catch(console.error);
  }, []);

  if (user?.role !== "admin") {
    return (
      <div style={{ padding: 24 }}>
        <h2>Access Denied</h2>
        <p>You must be an administrator to view this page.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <h1 data-testid="text-admin-title">Admin Dashboard</h1>
      {!stats ? (
        <p>Loading statistics...</p>
      ) : (
        <ul>
          <li data-testid="text-total-users">Total users: {stats.users}</li>
          <li data-testid="text-audit-logs">Total audit logs: {stats.auditLogs}</li>
        </ul>
      )}
    </div>
  );
}
