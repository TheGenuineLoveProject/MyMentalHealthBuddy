import { useState, useRef } from "react";
import { Heart, Share2, Download, Copy, Check } from "lucide-react";

const CARD_THEMES = [
  { id: "sage", bg: "linear-gradient(135deg, #6B8E23 0%, #8FBC8F 100%)", text: "#fff" },
  { id: "rose", bg: "linear-gradient(135deg, #D4A5A5 0%, #E8C4C4 100%)", text: "#4A4A4A" },
  { id: "gold", bg: "linear-gradient(135deg, #C9A227 0%, #E8D59E 100%)", text: "#3D3D3D" },
  { id: "calm", bg: "linear-gradient(135deg, #87CEEB 0%, #B0E0E6 100%)", text: "#2F4F4F" },
  { id: "dusk", bg: "linear-gradient(135deg, #9370DB 0%, #DDA0DD 100%)", text: "#fff" },
];

export default function ReflectionCard({
  reflection = "",
  date = new Date().toLocaleDateString(),
  theme = "sage",
  className = "",
  editable = false,
  onSave,
}) {
  const [selectedTheme, setSelectedTheme] = useState(theme);
  const [text, setText] = useState(reflection);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef(null);

  const currentTheme = CARD_THEMES.find(t => t.id === selectedTheme) || CARD_THEMES[0];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className={`${className}`} data-testid="reflection-card-container">
      <div
        ref={cardRef}
        className="relative rounded-2xl p-6 shadow-lg min-h-[280px] flex flex-col justify-between"
        style={{ background: currentTheme.bg }}
        data-testid="reflection-card"
      >
        <div className="absolute top-4 right-4 opacity-20">
          <Heart className="w-8 h-8" style={{ color: currentTheme.text }} />
        </div>
        
        <div className="flex-1 flex items-center justify-center py-8">
          {editable ? (
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full bg-transparent text-center text-lg leading-relaxed resize-none border-none focus:outline-none focus:ring-0"
              style={{ color: currentTheme.text }}
              placeholder="Write your reflection here..."
              rows={4}
              maxLength={200}
              data-testid="reflection-input"
            />
          ) : (
            <p 
              className="text-lg text-center leading-relaxed font-medium italic"
              style={{ color: currentTheme.text }}
            >
              "{text || "Your reflection will appear here"}"
            </p>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <span 
            className="text-xs opacity-70"
            style={{ color: currentTheme.text }}
          >
            {date}
          </span>
          
          <div className="flex items-center gap-1 opacity-80">
            <Heart className="w-3 h-3" style={{ color: currentTheme.text }} />
            <span 
              className="text-xs font-medium"
              style={{ color: currentTheme.text }}
            >
              The Genuine Love Project
            </span>
          </div>
        </div>
      </div>
      
      {editable && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm text-slate-600 dark:text-slate-400">Theme:</span>
            {CARD_THEMES.map(t => (
              <button
                key={t.id}
                onClick={() => setSelectedTheme(t.id)}
                className={`w-6 h-6 rounded-full border-2 transition-transform ${
                  selectedTheme === t.id ? "scale-125 border-slate-400" : "border-transparent"
                }`}
                style={{ background: t.bg }}
                aria-label={`${t.id} theme`}
                data-testid={`theme-${t.id}`}
              />
            ))}
          </div>
          
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              data-testid="button-copy-reflection"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy Text"}
            </button>
            
            {onSave && (
              <button
                onClick={() => onSave({ text, theme: selectedTheme })}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--glp-sage)] text-white rounded-lg text-sm hover:opacity-90 transition-opacity"
                data-testid="button-save-card"
              >
                <Heart className="w-4 h-4" />
                Save Card
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export { CARD_THEMES };
