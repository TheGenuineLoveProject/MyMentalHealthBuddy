import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import {
  db,
  collection,
  addDoc,
  serverTimestamp
} from "../firebase/firebase";

import EmotionLog from "../components/EmotionLog";
import LotusGuide from "../sacred/LotusGuide";
import VoiceAffirmation from "../components/VoiceAffirmation";
import MoodTrendsChart from "../components/MoodTrendsChart";
import EmotionCalendar from "../components/EmotionCalendar";
import SacredBackground from "../sacred/SacredBackground";

export default function JournalPage() {
  const [mood, setMood] = useState(null);
  const [entries, setEntries] = useState([]);

  const affirmationMap = {
    Calm: "You are safe and grounded.",
    Joy: "Your joy is medicine.",
    Sad: "Your feelings are valid.",
    Anxious: "Breathe. You are supported.",
    Grateful: "Gratitude multiplies love.",
  };

  const handleMood = (selected) => {
    const entry = {
      mood: selected,
      date: new Date().toLocaleDateString(),
      value: Math.random() * 10,
    };
    setMood(selected);
    setEntries([...entries, entry]);
  };

  return (
    <div className="relative min-h-screen p-8">
      <SacredBackground mood={mood} />

      <h1 className="text-3xl font-playfair mb-4">
        Your Healing Journal
      </h1>

      <EmotionLog onSelect={handleMood} />

      {mood && (
        <>
          <VoiceAffirmation text={affirmationMap[mood]} />
          <MoodTrendsChart data={entries} />
          <EmotionCalendar entries={entries} />
        </>
      )}
    </div>
  );
}

export default function JournalPage() {
  const { user } = useAuth();
  const [selectedMood, setSelectedMood] = useState(null);
  const [entry, setEntry] = useState("");
  const [affirmation, setAffirmation] = useState("");

  const saveEntry = async () => {
    if (!user || !selectedMood || !entry) return;

    const affirmations = {
      Calm: "You are safe. Peace flows through you.",
      Grateful: "Your heart is open and full.",
      Anxious: "You are held. This moment will pass.",
      Sad: "Your feelings matter. Healing is happening.",
      Joyful: "Let this joy expand within you."
    };

    const text = affirmations[selectedMood.label];
    setAffirmation(text);

    await addDoc(collection(db, "journalEntries"), {
      uid: user.uid,
      mood: selectedMood.label,
      entry,
      createdAt: serverTimestamp()
    });

    setEntry("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-pink-100 p-6">
      <h1 className="text-3xl font-serif text-center mb-6">
        Healing Journal
      </h1>

      <EmotionLog
        selectedMood={selectedMood}
        setSelectedMood={setSelectedMood}
      />

      <textarea
        className="w-full max-w-2xl mx-auto block mt-6 p-4 rounded-xl shadow"
        rows={6}
        placeholder="Write what your heart wants to release..."
        value={entry}
        onChange={e => setEntry(e.target.value)}
      />

      <button
        onClick={saveEntry}
        className="block mx-auto mt-4 px-8 py-3 rounded-full
          bg-black text-white font-semibold hover:scale-105 transition"
      >
        Save & Receive Affirmation
      </button>

      {affirmation && <VoiceAffirmation text={affirmation} />}

      <LotusGuide message={affirmation || "Choose a mood and write freely."} />
    </div>
  );
}