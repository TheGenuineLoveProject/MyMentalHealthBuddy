import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";

export default function Dashboard() {
  const { token, logout } = useAuth();
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setMessage(data.message));
  }, [token]);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>{message}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}