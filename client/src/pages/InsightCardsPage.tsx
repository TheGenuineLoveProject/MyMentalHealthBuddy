import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft, Lightbulb, Tag, Search, Trash2, Plus, Filter, Calendar, Star, Bookmark } from "lucide-react";

const STORAGE_KEY = "glp_insight_cards";

interface InsightCard {
  id: string;
  content: string;
  source: string;
  tags: string[];
  theme: string;
  starred: boolean;
  date: string;
}

interface InsightLibrary {
  cards: InsightCard[];
  themes: string[];
}

const SUGGESTED_THEMES = [
  "Self-Compassion",
  "Boundaries",
  "Growth",
  "Relationships",
  "Purpose",
  "Resilience",
  "Presence",
  "Acceptance"
];

const SUGGESTED_TAGS = [
  "daily wisdom",
  "personal insight",
  "book quote",
  "therapy session",
  "meditation",
  "conversation",
  "dream",
  "observation"
];

const loadLibrary = (): InsightLibrary => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return { cards: [], themes: SUGGESTED_THEMES };
};

const saveLibrary = (library: InsightLibrary) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(library));
};

export default function InsightCardsPage() {
  const [library, setLibrary] = useState<InsightLibrary>(loadLibrary);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showStarredOnly, setShowStarredOnly] = useState(false);
  
  const [newCard, setNewCard] = useState({
    content: "",
    source: "",
    tags: "",
    theme: SUGGESTED_THEMES[0]
  });

  const addCard = () => {
    if (!newCard.content.trim()) return;
    
    const card: InsightCard = {
      id: `card-${Date.now()}`,
      content: newCard.content.trim(),
      source: newCard.source.trim(),
      tags: newCard.tags.split(",").map(t => t.trim().toLowerCase()).filter(Boolean),
      theme: newCard.theme,
      starred: false,
      date: new Date().toISOString()
    };

    const updated = { ...library, cards: [card, ...library.cards] };
    setLibrary(updated);
    saveLibrary(updated);
    setNewCard({ content: "", source: "", tags: "", theme: SUGGESTED_THEMES[0] });
    setShowForm(false);
  };

  const deleteCard = (id: string) => {
    const updated = { ...library, cards: library.cards.filter(c => c.id !== id) };
    setLibrary(updated);
    saveLibrary(updated);
  };

  const toggleStar = (id: string) => {
    const updated = {
      ...library,
      cards: library.cards.map(c => c.id === id ? { ...c, starred: !c.starred } : c)
    };
    setLibrary(updated);
    saveLibrary(updated);
  };

  const filteredCards = library.cards.filter(card => {
    const matchesSearch = !searchTerm || 
      card.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.tags.some(t => t.includes(searchTerm.toLowerCase()));
    const matchesTheme = !selectedTheme || card.theme === selectedTheme;
    const matchesStarred = !showStarredOnly || card.starred;
    return matchesSearch && matchesTheme && matchesStarred;
  });

  const themeCounts = library.cards.reduce((acc, card) => {
    acc[card.theme] = (acc[card.theme] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen hero-gradient">
      <div className="content-wrapper py-8">
        <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <Link 
            href="/atlas" 
            className="inline-flex items-center gap-2 text-body-sm text-[var(--sage-500)] hover:text-[var(--teal-600)] mb-4 transition" 
            data-testid="link-back"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Atlas
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="icon-container icon-xl icon-gradient-gold">
              <Lightbulb className="h-8 w-8" />
            </div>
            <h1 className="text-display-lg text-teal" data-testid="text-insight-title">
              Insight Cards
            </h1>
          </div>
          <p className="text-lead">
            Collect and organize your wisdom. Save insights, tag themes, build your personal library.
          </p>
        </header>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="card-bordered text-center">
            <div className="icon-container icon-md icon-soft-gold mx-auto mb-2">
              <Lightbulb className="h-5 w-5" />
            </div>
            <div className="text-heading-lg text-teal" data-testid="text-total-cards">{library.cards.length}</div>
            <p className="text-caption">Total Cards</p>
          </div>
          <div className="card-bordered text-center">
            <div className="icon-container icon-md icon-soft-sage mx-auto mb-2">
              <Star className="h-5 w-5" />
            </div>
            <div className="text-heading-lg text-teal" data-testid="text-starred-count">{library.cards.filter(c => c.starred).length}</div>
            <p className="text-caption">Starred</p>
          </div>
          <div className="card-bordered text-center">
            <div className="icon-container icon-md icon-soft-blush mx-auto mb-2">
              <Tag className="h-5 w-5" />
            </div>
            <div className="text-heading-lg text-teal" data-testid="text-themes-count">{Object.keys(themeCounts).length}</div>
            <p className="text-caption">Themes Used</p>
          </div>
          <div className="card-bordered text-center">
            <div className="icon-container icon-md icon-soft-teal mx-auto mb-2">
              <Calendar className="h-5 w-5" />
            </div>
            <div className="text-heading-lg text-teal" data-testid="text-this-week">
              {library.cards.filter(c => {
                const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
                return new Date(c.date).getTime() > weekAgo;
              }).length}
            </div>
            <p className="text-caption">This Week</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sage-400" />
            <input
              type="text"
              placeholder="Search insights or tags..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-sage-200 text-teal-700 placeholder:text-sage-400 focus:ring-2 focus:ring-sage-400/50 focus:outline-none"
              data-testid="input-search"
            />
          </div>
          
          <button
            onClick={() => setShowStarredOnly(!showStarredOnly)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all ${
              showStarredOnly ? "bg-gold-100 border border-gold-300 text-gold-700" : "bg-sage-50 border border-sage-200 text-sage-600 hover:bg-sage-100"
            }`}
            data-testid="button-toggle-starred"
          >
            <Star className="h-4 w-4" />
            Starred
          </button>

          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-premium flex items-center gap-2 px-4 py-2.5"
            data-testid="button-add-card"
          >
            <Plus className="h-4 w-4" />
            Add Insight
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedTheme(null)}
            className={`px-3 py-1.5 rounded-full text-sm transition-all ${
              !selectedTheme ? "bg-sage-200 text-teal-700" : "bg-sage-50 border border-sage-200 text-sage-600 hover:bg-sage-100"
            }`}
            data-testid="button-filter-all"
          >
            All
          </button>
          {SUGGESTED_THEMES.map(theme => (
            <button
              key={theme}
              onClick={() => setSelectedTheme(selectedTheme === theme ? null : theme)}
              className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                selectedTheme === theme ? "bg-gold-100 border border-gold-300 text-gold-700" : "bg-sage-50 border border-sage-200 text-sage-600 hover:bg-sage-100"
              }`}
              data-testid={`button-filter-${theme.toLowerCase().replace(/\s/g, '-')}`}
            >
              {theme} {themeCounts[theme] ? `(${themeCounts[theme]})` : ""}
            </button>
          ))}
        </div>

        {showForm && (
          <div className="card-bordered mb-6 space-y-4">
            <h3 className="text-heading-sm text-teal">Add New Insight</h3>
            <textarea
              value={newCard.content}
              onChange={e => setNewCard({ ...newCard, content: e.target.value })}
              placeholder="Write your insight, quote, or wisdom..."
              className="w-full h-32 px-4 py-3 rounded-lg bg-white border border-sage-200 text-teal-700 placeholder:text-sage-400 focus:ring-2 focus:ring-sage-400/50 focus:outline-none resize-none"
              data-testid="textarea-insight-content"
            />
            <div className="grid md:grid-cols-3 gap-4">
              <input
                type="text"
                value={newCard.source}
                onChange={e => setNewCard({ ...newCard, source: e.target.value })}
                placeholder="Source (optional)"
                className="px-4 py-2.5 rounded-lg bg-white border border-sage-200 text-teal-700 placeholder:text-sage-400 focus:ring-2 focus:ring-sage-400/50 focus:outline-none"
                data-testid="input-insight-source"
              />
              <input
                type="text"
                value={newCard.tags}
                onChange={e => setNewCard({ ...newCard, tags: e.target.value })}
                placeholder="Tags (comma separated)"
                className="px-4 py-2.5 rounded-lg bg-white border border-sage-200 text-teal-700 placeholder:text-sage-400 focus:ring-2 focus:ring-sage-400/50 focus:outline-none"
                data-testid="input-insight-tags"
              />
              <select
                value={newCard.theme}
                onChange={e => setNewCard({ ...newCard, theme: e.target.value })}
                className="px-4 py-2.5 rounded-lg bg-white border border-sage-200 text-teal-700 focus:ring-2 focus:ring-sage-400/50 focus:outline-none"
                data-testid="select-insight-theme"
              >
                {SUGGESTED_THEMES.map(theme => (
                  <option key={theme} value={theme}>{theme}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={addCard}
                disabled={!newCard.content.trim()}
                className="btn-premium px-5 py-2.5 disabled:opacity-40 disabled:cursor-not-allowed"
                data-testid="button-save-insight"
              >
                Save Insight
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-5 py-2.5 rounded-lg bg-sage-50 border border-sage-200 text-sage-700 hover:bg-sage-100 transition-all"
                data-testid="button-cancel-insight"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {filteredCards.length === 0 ? (
          <div className="text-center py-16">
            <Bookmark className="h-12 w-12 mx-auto mb-4 text-sage-300" />
            <p className="text-body-sm">No insights yet. Start collecting your wisdom.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filteredCards.map(card => (
              <div
                key={card.id}
                className="card-bordered hover:shadow-md transition-all group"
                data-testid={`card-insight-${card.id}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs px-2 py-1 rounded-full bg-gold-100 border border-gold-200 text-gold-700">
                    {card.theme}
                  </span>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => toggleStar(card.id)}
                      className={`p-1.5 rounded-lg ${card.starred ? "text-gold-500" : "text-sage-400 hover:text-gold-500"}`}
                      data-testid={`button-star-${card.id}`}
                    >
                      <Star className="h-4 w-4" fill={card.starred ? "currentColor" : "none"} />
                    </button>
                    <button
                      onClick={() => deleteCard(card.id)}
                      className="p-1.5 rounded-lg text-sage-400 hover:text-blush-500"
                      data-testid={`button-delete-${card.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="text-body text-teal-700 leading-relaxed mb-3" data-testid={`text-content-${card.id}`}>
                  "{card.content}"
                </p>
                {card.source && (
                  <p className="text-body-sm text-sage-500 mb-3">— {card.source}</p>
                )}
                {card.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {card.tags.map(tag => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-sage-100 border border-sage-200 text-sage-600">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-caption mt-3">
                  {new Date(card.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
