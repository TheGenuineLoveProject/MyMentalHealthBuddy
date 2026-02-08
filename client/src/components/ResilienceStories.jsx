import { useState, useEffect } from "react";
import { BookOpen, Heart, Plus, Trash2, Star, Calendar, ChevronDown, ChevronUp, Sparkles, Edit3, Save, X } from "lucide-react";

const STORY_PROMPTS = [
  "Tell about a time you overcame something difficult...",
  "Describe a moment when you surprised yourself with your strength...",
  "What's a challenge you faced that made you who you are today?",
  "Share a time when things seemed impossible, but you kept going...",
  "Recall a moment when you chose courage over comfort...",
  "What's a failure that taught you something valuable?",
  "Describe a time someone's kindness helped you through...",
  "What's your greatest comeback story?",
];

const REFLECTION_QUESTIONS = [
  "What strength did you discover in yourself?",
  "Who or what supported you through this?",
  "What would you tell someone going through something similar?",
  "How has this experience shaped who you are today?",
  "What are you most proud of about how you handled this?",
];

export default function ResilienceStories({ onXpEarned }) {
  const [stories, setStories] = useState(() => {
    const saved = localStorage.getItem("resilienceStories");
    return saved ? JSON.parse(saved) : [];
  });
  const [isWriting, setIsWriting] = useState(false);
  const [currentStory, setCurrentStory] = useState({
    title: "",
    content: "",
    strength: "",
    reflection: "",
  });
  const [expandedStory, setExpandedStory] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [currentPrompt, setCurrentPrompt] = useState(
    STORY_PROMPTS[Math.floor(Math.random() * STORY_PROMPTS.length)]
  );

  useEffect(() => {
    localStorage.setItem("resilienceStories", JSON.stringify(stories));
  }, [stories]);

  const startNewStory = () => {
    setCurrentStory({ title: "", content: "", strength: "", reflection: "" });
    setIsWriting(true);
    setCurrentPrompt(STORY_PROMPTS[Math.floor(Math.random() * STORY_PROMPTS.length)]);
  };

  const saveStory = () => {
    if (!currentStory.content.trim()) return;

    const story = {
      id: editingId || Date.now().toString(),
      ...currentStory,
      title: currentStory.title || "My Resilience Story",
      date: new Date().toISOString(),
      isFavorite: false,
    };

    if (editingId) {
      setStories(stories.map(s => s.id === editingId ? story : s));
    } else {
      setStories([story, ...stories]);
      if (onXpEarned) onXpEarned("Resilience Story", 180);
    }

    setIsWriting(false);
    setEditingId(null);
    setCurrentStory({ title: "", content: "", strength: "", reflection: "" });
  };

  const editStory = (story) => {
    setCurrentStory({
      title: story.title,
      content: story.content,
      strength: story.strength || "",
      reflection: story.reflection || "",
    });
    setEditingId(story.id);
    setIsWriting(true);
  };

  const deleteStory = (id) => {
    if (window.confirm("Are you sure you want to delete this story?")) {
      setStories(stories.filter(s => s.id !== id));
    }
  };

  const toggleFavorite = (id) => {
    setStories(stories.map(s => 
      s.id === id ? { ...s, isFavorite: !s.isFavorite } : s
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (isWriting) {
    return (
      <div 
        className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-2xl overflow-hidden border border-slate-700/50"
        data-testid="resilience-story-editor"
      >
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center">
                <Edit3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {editingId ? "Edit Your Story" : "Write Your Story"}
                </h2>
                <p className="text-slate-400 text-sm">Share a moment of resilience</p>
              </div>
            </div>
            <button
              onClick={() => {
                setIsWriting(false);
                setEditingId(null);
              }}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-gradient-to-r from-rose-900/30 to-pink-900/30 p-4 rounded-xl border border-rose-500/20">
            <p className="text-rose-200 italic">
              <Sparkles className="w-4 h-4 inline mr-2" />
              {currentPrompt}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Story Title (optional)
            </label>
            <input
              type="text"
              value={currentStory.title}
              onChange={(e) => setCurrentStory({ ...currentStory, title: e.target.value })}
              placeholder="Give your story a title..."
              className="w-full p-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:border-rose-500/50 focus:outline-none"
              data-testid="input-story-title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Your Story
            </label>
            <textarea
              value={currentStory.content}
              onChange={(e) => setCurrentStory({ ...currentStory, content: e.target.value })}
              placeholder="Share your experience... What happened? How did you feel? What did you do?"
              rows={6}
              className="w-full p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:border-rose-500/50 focus:outline-none resize-none"
              data-testid="textarea-story-content"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              What strength did you discover? (optional)
            </label>
            <input
              type="text"
              value={currentStory.strength}
              onChange={(e) => setCurrentStory({ ...currentStory, strength: e.target.value })}
              placeholder="e.g., perseverance, courage, self-compassion..."
              className="w-full p-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:border-rose-500/50 focus:outline-none"
              data-testid="input-story-strength"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Reflection: {REFLECTION_QUESTIONS[Math.floor(Math.random() * REFLECTION_QUESTIONS.length)]}
            </label>
            <textarea
              value={currentStory.reflection}
              onChange={(e) => setCurrentStory({ ...currentStory, reflection: e.target.value })}
              placeholder="Take a moment to reflect..."
              rows={3}
              className="w-full p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:border-rose-500/50 focus:outline-none resize-none"
              data-testid="textarea-story-reflection"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={saveStory}
              disabled={!currentStory.content.trim()}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 rounded-xl font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="button-save-story"
            >
              <Save className="w-5 h-5" />
              Save Story
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-2xl overflow-hidden border border-slate-700/50"
      data-testid="resilience-stories"
    >
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Resilience Stories</h2>
              <p className="text-slate-400 text-sm">Moments of strength you've recorded</p>
            </div>
          </div>
          
          <button
            onClick={startNewStory}
            className="flex items-center gap-2 px-4 py-2 bg-rose-600/80 hover:bg-rose-600 rounded-lg text-white transition-colors"
            data-testid="button-new-story"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">New Story</span>
          </button>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2 text-slate-400">
            <BookOpen className="w-4 h-4" />
            <span>{stories.length} stories</span>
          </div>
          <div className="flex items-center gap-2 text-amber-400">
            <Star className="w-4 h-4" />
            <span>{stories.filter(s => s.isFavorite).length} favorites</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        {stories.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-slate-600" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No Stories Yet</h3>
            <p className="text-slate-400 mb-6 max-w-sm mx-auto">
              Resilience stories are reminders of your strength. 
              Start documenting moments that matter to you.
            </p>
            <button
              onClick={startNewStory}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 rounded-xl font-semibold text-white"
              data-testid="button-write-first-story"
            >
              <Edit3 className="w-5 h-5" />
              Write Your First Story
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {stories.map((story) => {
              const isExpanded = expandedStory === story.id;
              return (
                <div
                  key={story.id}
                  className={`bg-slate-800/30 rounded-xl border transition-all ${
                    story.isFavorite ? "border-amber-500/30" : "border-slate-700/50"
                  }`}
                >
                  <button
                    onClick={() => setExpandedStory(isExpanded ? null : story.id)}
                    className="w-full text-left p-4"
                    data-testid={`story-${story.id}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-white">{story.title}</h3>
                          {story.isFavorite && <Star className="w-4 h-4 text-amber-400 fill-amber-400" />}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Calendar className="w-3 h-3" />
                          {formatDate(story.date)}
                          {story.strength && (
                            <>
                              <span className="mx-1">•</span>
                              <span className="text-rose-400">{story.strength}</span>
                            </>
                          )}
                        </div>
                        {!isExpanded && (
                          <p className="text-slate-400 text-sm mt-2 line-clamp-2">
                            {story.content}
                          </p>
                        )}
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-slate-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-500" />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-4">
                      <p className="text-slate-300 whitespace-pre-wrap">{story.content}</p>
                      
                      {story.reflection && (
                        <div className="bg-slate-900/50 p-3 rounded-lg">
                          <p className="text-sm text-slate-400 italic">
                            <Sparkles className="w-3 h-3 inline mr-1" />
                            Reflection: {story.reflection}
                          </p>
                        </div>
                      )}

                      <div className="flex gap-2 pt-2 border-t border-slate-700/50">
                        <button
                          onClick={() => toggleFavorite(story.id)}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                            story.isFavorite 
                              ? "bg-amber-600/30 text-amber-300" 
                              : "bg-slate-700/50 text-slate-400 hover:bg-slate-700"
                          }`}
                        >
                          <Star className={`w-4 h-4 ${story.isFavorite ? "fill-amber-400" : ""}`} />
                          {story.isFavorite ? "Favorited" : "Favorite"}
                        </button>
                        <button
                          onClick={() => editStory(story)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-slate-700/50 text-slate-400 hover:bg-slate-700 rounded-lg text-sm transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => deleteStory(story.id)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-900/30 text-red-400 hover:bg-red-900/50 rounded-lg text-sm transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-700/50 bg-slate-900/30">
        <p className="text-center text-sm text-slate-500">
          <Heart className="w-4 h-4 inline mr-1 text-rose-400" />
          "Within our wounds lies our wisdom, within our scars lies our strength."
        </p>
      </div>
    </div>
  );
}
