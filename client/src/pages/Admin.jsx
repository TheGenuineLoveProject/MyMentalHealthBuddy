import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";

export default function Admin() {
  const { token, user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("/api/admin/stats", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(setStats);
  }, [token]);

  if (user?.role !== "admin") return <div style={{ padding: 24 }}>Forbidden</div>;

  return (
    <div style={{ padding: 24 }}>
      <h1>Admin Dashboard</h1>
      {!stats ? "Loading..." : (
        <ul>
          <li>Total users: {stats.users}</li>
          <li>Total audit logs: {stats.auditLogs}</li>
        </ul>
      )}
    </div>
  );
}