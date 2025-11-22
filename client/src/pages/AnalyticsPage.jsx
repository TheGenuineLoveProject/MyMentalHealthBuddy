// client/src/pages/AnalyticsPage.jsx

import React, { useEffect, useState } from "react";

function getToken() {
  return localStorage.getItem("token");
}

export default function AnalyticsPage() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    setToken(getToken());
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h1>Analytics</h1>
      <p>Current token: {token || "No token stored"}</p>
    </div>
  );
}