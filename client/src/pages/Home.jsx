export default function Home() {
  return (
    <div style={{ padding: "40px", fontSize: "22px" }}>
      <h1>MyMentalHealthBuddy</h1>
      <p>Select a section:</p>

      <ul>
        <li><a href="/dashboard">Dashboard</a></li>
        <li><a href="/journal">Journal</a></li>
        <li><a href="/mood">Mood Tracker</a></li>
        <li><a href="/ai">AI Chat</a></li>
        <li><a href="/analytics">Analytics</a></li>
        <li><a href="/auth">Login / Register</a></li>
      </ul>
    </div>
  );
}