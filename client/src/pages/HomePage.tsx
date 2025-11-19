export default function HomePage() {
  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1>Welcome to MyMentalHealthBuddy 💚</h1>
      <p>Your AI-powered mental well-being companion.</p>

      <ul style={{ marginTop: "20px", lineHeight: "30px" }}>
        <li><a href="/mood">Mood Tracker</a></li>
        <li><a href="/journal">Journal</a></li>
        <li><a href="/ai">AI Buddy</a></li>
      </ul>
    </div>
  );
}