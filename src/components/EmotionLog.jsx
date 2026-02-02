export default function EmotionLog({ onSelect }) {
      const moods = [
        { label: "Calm", color: "bg-green-300" },
        { label: "Grateful", color: "bg-yellow-300" },
        { label: "Anxious", color: "bg-blue-300" },
        { label: "Sad", color: "bg-indigo-300" },
        { label: "Joyful", color: "bg-pink-300" }
      ];

      export default function EmotionLog({ selectedMood, setSelectedMood }) {
        return (
          <div className="flex gap-3 flex-wrap justify-center">
            {moods.map(mood => (
              <button
                key={mood.label}
                onClick={() => setSelectedMood(mood)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition
                  ${selectedMood?.label === mood.label
                    ? "ring-4 ring-white scale-105"
                    : "opacity-80 hover:opacity-100"}
                  ${mood.color}`}
              >
                {mood.label}
              </button>
            ))}
          </div>
        );
      }