import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-green-700">Welcome to MyMentalHealthBuddy 💚</h1>

      <p>Your AI-powered mental wellness companion.</p>

      <div className="grid grid-cols-1 gap-4">
        <Link className="bg-white p-4 shadow rounded" to="/mood">😊 Mood Tracker</Link>
        <Link className="bg-white p-4 shadow rounded" to="/journal">📖 Journal</Link>
        <Link className="bg-white p-4 shadow rounded" to="/ai">🤖 AI Buddy</Link>
      </div>
    </div>
  );
}