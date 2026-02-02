import EmotionLog from "./EmotionLog";
import JournalAI from "./JournalAI";
import EmotionCalendar from "./EmotionCalendar";
import { useState } from "react";

export default function WellnessDashboard() {
  const [mood, setMood] = useState(null);

  return (
    <div className="p-8 min-h-screen">
      <h1 className="text-3xl font-serif mb-6">
        Your Healing Dashboard
      </h1>

      <EmotionLog onSelect={setMood} />
      <JournalAI mood={mood} />
      <EmotionCalendar />
    </div>
  );
}