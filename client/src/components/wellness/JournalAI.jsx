import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "../../lib/queryClient";
import { Sparkles, Send, Heart, RefreshCw, Wind, Loader2 } from "lucide-react";

const BREATHING_EXERCISES = [
  {
    name: "Box Breathing",
    steps: ["Breathe in for 4 seconds", "Hold for 4 seconds", "Breathe out for 4 seconds", "Hold for 4 seconds"],
    duration: "2 minutes",
  },
  {
    name: "4-7-8 Relaxation",
    steps: ["Breathe in for 4 seconds", "Hold for 7 seconds", "Breathe out slowly for 8 seconds"],
    duration: "3 minutes",
  },
  {
    name: "Grounding Breath",
    steps: ["Take a deep breath", "Notice 5 things you can see", "Exhale slowly", "Notice 4 things you can touch"],
    duration: "5 minutes",
  },
];

const SUPPORTIVE_PROMPTS = [
  "What would you like to explore about how you're feeling?",
  "Share what's on your heart right now.",
  "Tell me about what's bringing this emotion forward.",
  "What does this feeling need from you today?",
];

export default function JournalAI({ emotionEntry, className = "" }) {
  const [userInput, setUserInput] = useState(emotionEntry?.content || "");
  const [aiResponse, setAiResponse] = useState(null);
  const [showBreathing, setShowBreathing] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);

  const [error, setError] = useState("");

  const chatMutation = useMutation({
    mutationFn: (message) => apiRequest("POST", "/api/ai/chat", { message }),
    onSuccess: (data) => {
      setAiResponse(data);
      setError("");
    },
    onError: (err) => {
      setError(err.message || "Unable to connect with AI companion. Please try again.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    
    const contextMessage = emotionEntry?.emotion
      ? `I'm feeling ${emotionEntry.emotion}. ${userInput}`
      : userInput;
    
    chatMutation.mutate(contextMessage);
  };

  const handleSuggestion = (suggestion) => {
    setUserInput(suggestion);
  };

  const randomPrompt = SUPPORTIVE_PROMPTS[Math.floor(Math.random() * SUPPORTIVE_PROMPTS.length)];

  return (
    <div className={`journal-ai-container ${className}`} data-testid="journal-ai">
      <div className="bg-softWhite dark:bg-gray-800 rounded-xl shadow-lg border border-sageGreen/20 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-sageGreen/20 dark:border-gray-700 bg-gradient-to-r from-deepTeal/10 to-softWhite">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-deepTeal to-sageGreen flex items-center justify-center sacred-pulse">
              <Sparkles className="w-5 h-5 text-softWhite" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-semibold text-deepTeal dark:text-white">Compassionate AI Companion</h2>
              <p className="font-sans text-sm text-deepTeal/70 dark:text-gray-400">A gentle space for reflection and support</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {emotionEntry && (
            <div className="p-4 rounded-xl bg-sageGreen/10 border border-sageGreen/20">
              <p className="font-sans text-sm text-deepTeal dark:text-gray-300">
                <span className="font-medium">Current feeling:</span>{" "}
                <span className="capitalize">{emotionEntry.emotion}</span>
              </p>
              {emotionEntry.content && (
                <p className="mt-2 font-sans text-sm text-deepTeal/80 dark:text-gray-200 italic">"{emotionEntry.content}"</p>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="ai-input" className="block font-sans text-sm font-medium text-deepTeal dark:text-gray-300 mb-2">
                {randomPrompt}
              </label>
              <textarea
                id="ai-input"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Write openly about what you're experiencing..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-sageGreen/30 dark:border-gray-600 bg-softWhite dark:bg-gray-700 text-deepTeal dark:text-white placeholder-deepTeal/40 font-sans focus:ring-2 focus:ring-deepTeal focus:border-transparent resize-none transition"
                data-testid="ai-input"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {["I need to process this", "I'm not sure what I'm feeling", "I'd like some comfort"].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleSuggestion(suggestion)}
                  className="px-3 py-1.5 rounded-full font-sans text-xs font-medium bg-sageGreen/10 dark:bg-gray-700 text-deepTeal dark:text-gray-300 hover:bg-sageGreen/20 dark:hover:bg-gray-600 transition"
                  data-testid={`suggestion-${suggestion.slice(0, 10)}`}
                >
                  {suggestion}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={chatMutation.isPending || !userInput.trim()}
              className="w-full py-3 px-4 rounded-xl font-sans font-semibold text-softWhite transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 bg-gradient-to-r from-deepTeal to-sageGreen hover:shadow-lg"
              data-testid="submit-ai"
            >
              {chatMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  Reflecting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" aria-hidden="true" />
                  Share with AI Companion
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="p-4 rounded-xl bg-dustyRose/20 dark:bg-red-900/20 border border-dustyRose/40 dark:border-red-800 flex items-start gap-3" data-testid="ai-error">
              <AlertCircle className="w-5 h-5 text-dustyRose flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-sans text-sm text-dustyRose dark:text-red-300">{error}</p>
                <button 
                  onClick={() => setError("")}
                  className="font-sans text-xs text-dustyRose/80 dark:text-red-400 underline mt-1 hover:text-dustyRose"
                  data-testid="dismiss-error"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {aiResponse && (
            <div className="space-y-4" data-testid="ai-response">
              <div className="p-5 rounded-xl bg-gradient-to-br from-softWhite to-sageGreen/10 border border-sageGreen/20">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--glp-teal)] flex items-center justify-center flex-shrink-0">
                    <Heart className="w-4 h-4 text-white" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                      {aiResponse.reply || aiResponse.message || "Thank you for sharing. I see you. Would you like a breathing exercise?"}
                    </p>
                    
                    {aiResponse.isCrisis && aiResponse.resources && (
                      <div className="mt-4 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                        <p className="font-medium text-red-700 dark:text-red-400 mb-2">Support Resources:</p>
                        <ul className="space-y-1">
                          {aiResponse.resources.map((resource, idx) => (
                            <li key={idx} className="text-sm text-red-600 dark:text-red-300">
                              <strong>{resource.name}:</strong> {resource.contact}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowBreathing(!showBreathing)}
                className="w-full py-3 px-4 rounded-xl font-medium text-[var(--glp-sage-deep)] bg-[var(--glp-sage-10)] hover:bg-[var(--glp-sage-20)] transition flex items-center justify-center gap-2 border border-[var(--glp-sage-20)]"
                data-testid="toggle-breathing"
              >
                <Wind className="w-4 h-4" aria-hidden="true" />
                {showBreathing ? "Hide" : "Try a"} Breathing Exercise
              </button>
            </div>
          )}

          {showBreathing && (
            <div className="space-y-4" data-testid="breathing-exercises">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Choose an exercise:</h3>
              <div className="grid gap-3">
                {BREATHING_EXERCISES.map((exercise) => (
                  <button
                    key={exercise.name}
                    type="button"
                    onClick={() => setSelectedExercise(selectedExercise?.name === exercise.name ? null : exercise)}
                    className={`p-4 rounded-xl text-left transition border ${
                      selectedExercise?.name === exercise.name
                        ? "border-[var(--glp-teal)] bg-[var(--glp-teal-10)]"
                        : "border-gray-200 dark:border-gray-600 hover:border-[var(--glp-sage)] hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                    data-testid={`exercise-${exercise.name.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900 dark:text-white">{exercise.name}</span>
                      <span className="text-xs text-gray-500">{exercise.duration}</span>
                    </div>
                    {selectedExercise?.name === exercise.name && (
                      <ol className="mt-3 space-y-2">
                        {exercise.steps.map((step, idx) => (
                          <li key={idx} className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-[var(--glp-teal)] text-white text-xs flex items-center justify-center flex-shrink-0">
                              {idx + 1}
                            </span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              setAiResponse(null);
              setUserInput("");
              setShowBreathing(false);
              setSelectedExercise(null);
            }}
            className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center justify-center gap-2 transition"
            data-testid="reset-conversation"
          >
            <RefreshCw className="w-3 h-3" aria-hidden="true" />
            Start a new reflection
          </button>
        </div>
      </div>

      <p className="mt-4 text-xs text-center text-gray-400 dark:text-gray-500">
        This AI companion offers supportive reflections, not professional advice.{" "}
        <a href="/crisis" className="underline hover:text-gray-600">Need immediate help?</a>
      </p>
    </div>
  );
}
