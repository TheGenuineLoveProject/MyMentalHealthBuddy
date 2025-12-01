import React from "react";
import { Link } from "wouter";

export default function Home() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome to MyMentalHealthBuddy</h1>
      <p>Your daily companion for wellness, healing, and mental clarity.</p>

      <div style={{ marginTop: "1rem" }}>
        <Link href="/dashboard">Go to Dashboard</Link>
      </div>
    </div>
  );
}