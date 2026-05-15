import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { Search, X, FileText, HelpCircle, BookOpen, Newspaper, Wrench, ArrowRight } from "lucide-react";
import { searchContent } from "../content/searchIndex.ts";

const TYPE_ICONS = {
  Tool: Wrench,
  Guide: BookOpen,
  Term: FileText,
  "Q&A": HelpCircle,
  News: Newspaper,
  Resource: FileText,
};

const TYPE_COLORS = {
  Tool: "bg-[var(--teal-100)] text-[var(--teal-700)]",
  Guide: "bg-[var(--sage-100)] text-[var(--sage-700)]",
  Term: "bg-[var(--blush-100)] text-[var(--blush-700)]",
  "Q&A": "bg-[var(--gold-100)] text-[var(--gold-700)]",
  News: "bg-[var(--lavender-100)] text-[var(--lavender-700)]",
  Resource: "bg-[var(--sage-100)] text-[var(--sage-700)]",
};

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [, setLocation] = useLocation();
  const inputRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const searchResults = searchContent(query);
    setResults(searchResults);
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = useCallback((path) => {
    setLocation(path);
    setIsOpen(false);
    setQuery("");
  }, [setLocation]);

  const handleKeyNavigation = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      handleSelect(results[selectedIndex].path);
    }
  };

  const groupedResults = results.reduce((acc, item) => {
    if (!acc[item.type]) acc[item.type] = [];
    acc[item.type].push(item);
    return acc;
  }, {});

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        data-testid="button-global-search"
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--glp-sage)] transition text-[var(--text-2)] text-sm"
        aria-label="Open search (Ctrl+K)"
      >
        <Search className="w-4 h-4" aria-hidden="true" />
        <span className="hidden sm:inline">Search...</span>
        <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-xs font-mono bg-[var(--surface-3)] rounded border border-[var(--border)]">
          <span>⌘</span>K
        </kbd>
      </button>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setIsOpen(false);
          setQuery("");
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
      
      <div
        ref={modalRef}
        className="relative w-full max-w-xl bg-[var(--surface-1)] rounded-xl shadow-2xl border border-[var(--border)] overflow-hidden"
      >
        <div className="flex items-center gap-3 p-4 border-b border-[var(--border)]">
          <Search className="w-5 h-5 text-[var(--text-2)]" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyNavigation}
            placeholder="Search tools, guides, glossary, FAQ..."
            className="flex-1 bg-transparent text-[var(--text-1)] placeholder-[var(--text-3)] outline-none text-lg"
            data-testid="input-global-search"
            aria-label="Search query"
          />
          <button
            onClick={() => {
              setIsOpen(false);
              setQuery("");
            }}
            className="p-1 rounded hover:bg-[var(--surface-2)] transition"
            aria-label="Close search"
          >
            <X className="w-5 h-5 text-[var(--text-2)]" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {query && results.length === 0 && (
            <div className="p-8 text-center text-[var(--text-2)]">
              <p>No results found for "{query}"</p>
              <p className="text-sm mt-2">Try different keywords or browse the Healing Library</p>
            </div>
          )}

          {!query && (
            <div className="p-4 text-[var(--text-2)] text-sm">
              <p className="mb-3">Quick suggestions:</p>
              <div className="flex flex-wrap gap-2">
                {["breathing", "grounding", "sleep", "anxiety", "journal"].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1.5 rounded-full bg-[var(--surface-2)] hover:bg-[var(--surface-3)] transition text-[var(--text-1)]"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {Object.entries(groupedResults).map(([type, items]) => {
            const Icon = TYPE_ICONS[type] || FileText;
            return (
              <div key={type} className="border-b border-[var(--border)] last:border-b-0">
                <div className="px-4 py-2 text-xs font-medium text-[var(--text-2)] uppercase tracking-wide bg-[var(--surface-2)]">
                  {type}
                </div>
                {items.map((item, idx) => {
                  const globalIdx = results.indexOf(item);
                  const isSelected = globalIdx === selectedIndex;
                  return (
                    <button
                      key={item.path}
                      onClick={() => handleSelect(item.path)}
                      onMouseEnter={() => setSelectedIndex(globalIdx)}
                      className={`w-full flex items-start gap-3 p-4 text-left transition ${
                        isSelected ? "bg-[var(--glp-sage)]/10" : "hover:bg-[var(--surface-2)]"
                      }`}
                      data-testid={`search-result-${item.path.replace(/\//g, "-")}`}
                    >
                      <div className={`p-2 rounded-lg ${TYPE_COLORS[type]}`}>
                        <Icon className="w-4 h-4" aria-hidden="true" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-[var(--text-1)]">{item.title}</div>
                        <div className="text-sm text-[var(--text-2)] line-clamp-1">{item.description}</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-[var(--surface-3)] text-[var(--text-3)]">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      {isSelected && <ArrowRight className="w-4 h-4 text-[var(--glp-primary)] mt-1" aria-hidden="true" />}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between px-4 py-2 border-t border-[var(--border)] bg-[var(--surface-2)] text-xs text-[var(--text-3)]">
          <div className="flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 rounded bg-[var(--surface-3)] border border-[var(--border)]">↑↓</kbd>
            <span>navigate</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 rounded bg-[var(--surface-3)] border border-[var(--border)]">↵</kbd>
            <span>select</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 rounded bg-[var(--surface-3)] border border-[var(--border)]">esc</kbd>
            <span>close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
