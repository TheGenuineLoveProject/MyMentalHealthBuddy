import { useState } from "react";
import { Heart, Smile, Frown, Meh, Cloud, Sun, Sparkles, Flame } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const EMOTIONS = [
  { id: "happy", label: "Happy", icon: Smile, color: "#fbbf24", bgClass: "bg-amber-100 dark:bg-amber-900/40" },
  { id: "calm", label: "Calm", icon: Sun, color: "#8fbf9f", bgClass: "bg-teal-100 dark:bg-teal-900/40" },
  { id: "grateful", label: "Grateful", icon: Sparkles, color: "#d4af37", bgClass: "bg-yellow-100 dark:bg-yellow-900/40" },
  { id: "hopeful", label: "Hopeful", icon: Heart, color: "#2f5d5d", bgClass: "bg-emerald-100 dark:bg-emerald-900/40" },
  { id: "neutral", label: "Neutral", icon: Meh, color: "#9ca3af", bgClass: "bg-gray-100 dark:bg-gray-800/40" },
  { id: "anxious", label: "Anxious", icon: Cloud, color: "#f4c7c3", bgClass: "bg-rose-100 dark:bg-rose-900/40" },
  { id: "sad", label: "Sad", icon: Frown, color: "#6b8cae", bgClass: "bg-blue-100 dark:bg-blue-900/40" },
  { id: "angry", label: "Frustrated", icon: Flame, color: "#ef4444", bgClass: "bg-red-100 dark:bg-red-900/40" }
];

export default function EmotionLog({ 
  onMoodSelect, 
  onJournalSave,
  initialMood = null,
  initialNote = "",
  className = "" 
}) {
  const [selectedMood, setSelectedMood] = useState(initialMood);
  const [journalNote, setJournalNote] = useState(initialNote);
  const [intensity, setIntensity] = useState(5);
  const [saved, setSaved] = useState(false);

  const handleMoodSelect = (moodId) => {
    setSelectedMood(moodId);
    setSaved(false);
    if (onMoodSelect) {
      onMoodSelect(moodId);
    }
  };

  const handleSave = () => {
    const entry = {
      mood: selectedMood,
      intensity,
      note: journalNote,
      timestamp: new Date().toISOString()
    };
    
    if (onJournalSave) {
      onJournalSave(entry);
    }
    
    try { localStorage.setItem(`glp_emotion_${new Date().toISOString().split('T')[0]}`, JSON.stringify(entry)); } catch (err) { console.warn("[storage-safe-write]", err); }
    setSaved(true);
  };

  const selectedEmotion = EMOTIONS.find(e => e.id === selectedMood);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-serif flex items-center gap-2">
          <Heart className="w-5 h-5 text-[#d4af37]" aria-hidden="true" />
          How are you feeling right now?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div 
          className="grid grid-cols-4 gap-2"
          role="radiogroup"
          aria-label="Select your current emotion"
        >
          {EMOTIONS.map((emotion) => {
            const IconComponent = emotion.icon;
            const isSelected = selectedMood === emotion.id;
            
            return (
              <button
                key={emotion.id}
                onClick={() => handleMoodSelect(emotion.id)}
                className={`
                  flex flex-col items-center gap-1 p-3 rounded-xl transition-all
                  ${isSelected ? `${emotion.bgClass} ring-2 ring-offset-1` : 'hover:bg-muted'}
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] focus-visible:ring-offset-2
                `}
                style={{ 
                  borderColor: isSelected ? emotion.color : 'transparent',
                  ringColor: isSelected ? emotion.color : undefined
                }}
                role="radio"
                aria-checked={isSelected}
                aria-label={emotion.label}
                data-testid={`emotion-${emotion.id}`}
              >
                <IconComponent 
                  className="w-6 h-6 transition-transform"
                  style={{ color: emotion.color }}
                  aria-hidden="true"
                />
                <span className="text-xs font-medium">{emotion.label}</span>
              </button>
            );
          })}
        </div>

        {selectedMood && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Intensity: {intensity}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={intensity}
                onChange={(e) => { setIntensity(Number(e.target.value)); setSaved(false); }}
                className="w-full accent-[#d4af37] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#d4af37]"
                aria-label="Emotion intensity"
                data-testid="input-intensity"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Mild</span>
                <span>Intense</span>
              </div>
            </div>

            <div>
              <label htmlFor="journal-note" className="text-sm font-medium mb-2 block">
                What's on your mind? (optional)
              </label>
              <Textarea
                id="journal-note"
                value={journalNote}
                onChange={(e) => { setJournalNote(e.target.value); setSaved(false); }}
                placeholder="Write freely... this is your safe space."
                rows={4}
                className="resize-none"
                data-testid="textarea-journal"
              />
            </div>

            <div className="flex items-center justify-between">
              {saved && (
                <span className="text-sm text-green-600 dark:text-green-400" role="status" aria-live="polite">
                  ✓ Saved
                </span>
              )}
              <Button 
                onClick={handleSave}
                disabled={!selectedMood}
                className="ml-auto bg-gradient-to-r from-[#d4af37] to-[#ffd700] text-white hover:opacity-90"
                data-testid="button-save-emotion"
              >
                Save Entry
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
