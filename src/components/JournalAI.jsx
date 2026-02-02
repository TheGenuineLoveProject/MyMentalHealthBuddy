// /src/components/JournalAI.jsx
import React, { useState } from 'react';
import { db, auth, setDoc, doc } from '../firebase/firebase';

const JournalAI = ({ onSubmit }) => {
  const [entry, setEntry] = useState('');
  const [mood, setMood] = useState('Calm');
  const [aiResponse, setAIResponse] = useState('');

  const handleSubmit = async () => {
    const response = `🧠 AI Reflection: You chose ${mood}. Thank you for your vulnerability. Keep honoring your emotions.`;
    setAIResponse(response);
    if (onSubmit) onSubmit({ mood, entry });
    setEntry('');
  };

  return (
    <div className="p-6 rounded-xl shadow-lg bg-white/80 backdrop-blur">
      <h2 className="text-2xl font-serif mb-4 text-gold">🌿 Daily Journal</h2>

      <select
        className="mb-4 px-4 py-2 border rounded"
        value={mood}
        onChange={(e) => setMood(e.target.value)}
      >
        {['Joyful', 'Sad', 'Calm', 'Anxious', 'Hopeful'].map((m) => (
          <option key={m}>{m}</option>
        ))}
      </select>

      <textarea
        className="w-full h-32 p-4 border rounded"
        placeholder="Write from the heart..."
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
      />

      <button
        className="mt-4 bg-gold text-white px-6 py-2 rounded shadow hover:scale-105 transition"
        onClick={handleSubmit}
      >
        Submit Entry
      </button>

      {aiResponse && (
        <p className="mt-4 italic text-deepTeal">{aiResponse}</p>
      )}
    </div>
  );
};

export default function JournalAI({ selectedDate, currentMood }) {
  const [entry, setEntry] = useState('');
  const [saved, setSaved] = useState(false);

export default function JournalAI({ mood }) {
    return (
      <div className="mt-6">
        <textarea
          placeholder={`Reflect on your ${mood?.label || "current"} state...`}
          className="w-full h-40 p-4 rounded-lg bg-white/80"
        />
        <p className="mt-2 text-sm italic text-gray-600">
          “You are allowed to grow gently.”
        </p>
      </div>
    );
  }
  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const date = selectedDate.toISOString().split('T')[0];
    await setDoc(doc(db, 'users', user.uid, 'journal', date), {
      entry,
      mood: currentMood,
      timestamp: new Date().toISOString()
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  const speakAffirmation = () => {
    const affirmation = "You are grounded. You are light. You are healing.";
    const utterance = new SpeechSynthesisUtterance(affirmation);
    utterance.voice = speechSynthesis.getVoices().find(v => v.lang.startsWith('en'));
    speechSynthesis.speak(utterance);
  };
  handleSave = async () => {
    // ...Firebase save logic
    speakAffirmation();  // 🔊 play voice after save
  };
  return (
    <div className="p-4 mt-4 bg-white rounded shadow space-y-2">
      <h3 className="text-xl font-bold">📝 Reflect on Your {currentMood} Day</h3>
      <textarea
        rows="4"
        className="w-full border border-gray-300 rounded p-2"
        placeholder="Write about your thoughts..."
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
      />
      <button
        onClick={handleSave}
        className="px-4 py-2 bg-deepTeal text-white rounded hover:bg-sageGreen transition"
      >
        Save Entry
      </button>
      {saved && <p className="text-green-600">Journal saved successfully!</p>}
    </div>
  );
}