export default function MoodPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-green-700">Mood Tracker</h1>
      <p className="mt-2">Track your emotional state each day.</p>

      <div className="flex gap-4 mt-6">
        {["😊", "😐", "😔", "😡"].map(m => (
          <button key={m} className="text-4xl p-3 bg-white rounded shadow">
            {m}
          </button>
        ))}
      </div>
    </div>
  );
}