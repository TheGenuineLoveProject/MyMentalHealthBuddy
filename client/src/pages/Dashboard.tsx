import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [mood, setMood] = useState(null);
  const [journalPreview, setJournalPreview] = useState([]);
  const [loading, setLoading] = useState(true);

  // Base URL automatically works in Replit
  const API = "/api";

  useEffect(() => {
    async function fetchData() {
      try {
        const [userRes, moodRes, journalRes] = await Promise.all([
          fetch(`${API}/auth/me`),
          fetch(`${API}/mood/latest`),
          fetch(`${API}/journal/recent`)
        ]);

        const userData = await userRes.json();
        const moodData = await moodRes.json();
        const journalData = await journalRes.json();

        setUser(userData);
        setMood(moodData);
        setJournalPreview(journalData);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <div className="p-6 text-lg">Loading Dashboard…</div>;

  return (
    <div className="p-6 space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">
          Hello{user ? `, ${user.name}` : ""} 👋
        </h1>
        <p className="text-gray-600">
          Here is your healing overview for today.
        </p>
      </div>

      {/* MOOD */}
      <section className="p-4 bg-white/20 rounded-xl shadow">
        <h2 className="text-xl font-semibold">Your Mood</h2>
        <p className="mt-2 text-lg">
          {mood?.emoji ? mood.emoji : "No mood tracked yet."}
        </p>
        <Link to="/mood" className="text-blue-500 underline text-sm">
          Update mood →
        </Link>
      </section>

      {/* JOURNAL */}
      <section className="p-4 bg-white/20 rounded-xl shadow">
        <h2 className="text-xl font-semibold">Recent Journal Entries</h2>

        {journalPreview.length === 0 ? (
          <p className="mt-2 text-gray-600">No entries yet.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {journalPreview.map((entry) => (
              <li
                key={entry.id}
                className="p-3 bg-white/60 rounded border border-gray-200"
              >
                <p className="font-medium">{entry.title}</p>
                <p className="text-gray-600 text-sm truncate">
                  {entry.content}
                </p>
              </li>
            ))}
          </ul>
        )}

        <Link to="/journal" className="text-blue-500 underline text-sm">
          Open journal →
        </Link>
      </section>

      {/* AI THERAPY */}
      <section className="p-4 bg-white/20 rounded-xl shadow">
        <h2 className="text-xl font-semibold">AI Therapist</h2>
        <p className="mt-2 text-gray-600">
          Need support? Talk to your AI therapist anytime.
        </p>
        <Link to="/chat" className="text-blue-500 underline text-sm">
          Start a session →
        </Link>
      </section>

      {/* ANALYTICS */}
      <section className="p-4 bg-white/20 rounded-xl shadow">
        <h2 className="text-xl font-semibold">Analytics Preview</h2>
        <p className="mt-2 text-gray-600">
          Visualize how your moods, habits, and journaling evolve.
        </p>
        <Link to="/analytics" className="text-blue-500 underline text-sm">
          See full insights →
        </Link>
      </section>
    </div>
  );
}