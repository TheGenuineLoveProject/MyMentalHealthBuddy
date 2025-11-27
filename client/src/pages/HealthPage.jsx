import React, { useEffect, useState } from "react";

export default function HealthPage() {
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => setResult(data));
  }, []);

  return (
    <div>
      <h1>Health Check</h1>
      <pre style={styles.pre}>{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
}

const styles = {
  pre: {
    padding: "20px",
    background: "#f4f4f4",
    borderRadius: "10px",
    fontSize: "14px"
  }
};