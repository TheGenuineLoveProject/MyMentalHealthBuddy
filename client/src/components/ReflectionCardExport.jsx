import { useState, useRef, useCallback, useEffect } from "react";
import { X, Download, Edit3, Quote, Heart, Footprints, ExternalLink } from 'lucide-react';

const VALUES_SUGGESTIONS = [
  "Authenticity", "Compassion", "Courage", "Growth", "Gratitude",
  "Honesty", "Kindness", "Peace", "Resilience", "Self-respect",
  "Patience", "Connection", "Boundaries", "Freedom", "Trust"
];

export default function ReflectionCardExport({ 
  isOpen, 
  onClose, 
  suggestedQuotes = [],
  source = "reflection"
}) {
  const [quote, setQuote] = useState("");
  const [value, setValue] = useState("");
  const [step, setStep] = useState("");
  const [consentChecked, setConsentChecked] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  const generateCard = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = 1080;
    const height = 1350;
    canvas.width = width;
    canvas.height = height;

    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#f8f6f3");
    gradient.addColorStop(0.5, "#faf9f7");
    gradient.addColorStop(1, "#f5f3ef");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "#e8e4df";
    ctx.lineWidth = 3;
    ctx.strokeRect(40, 40, width - 80, height - 80);

    ctx.fillStyle = "#6b9080";
    ctx.font = "bold 28px Georgia, serif";
    ctx.textAlign = "center";
    ctx.fillText("My Reflection", width / 2, 120);

    ctx.fillStyle = "#4a5568";
    ctx.font = "italic 42px Georgia, serif";
    ctx.textAlign = "center";
    
    const wrapText = (text, x, y, maxWidth, lineHeight) => {
      const words = text.split(" ");
      let line = "";
      let testLine = "";
      let lineCount = 0;
      
      for (let n = 0; n < words.length; n++) {
        testLine = line + words[n] + " ";
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
          ctx.fillText(line.trim(), x, y + (lineCount * lineHeight));
          line = words[n] + " ";
          lineCount++;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line.trim(), x, y + (lineCount * lineHeight));
      return lineCount + 1;
    };

    ctx.fillStyle = "#6b9080";
    ctx.font = "60px Georgia, serif";
    ctx.fillText('"', 100, 220);
    ctx.fillText('"', width - 100, 220);

    ctx.fillStyle = "#2d3748";
    ctx.font = "italic 36px Georgia, serif";
    const quoteLines = wrapText(quote || "Your meaningful quote here", width / 2, 280, width - 200, 50);

    const valueY = 280 + (quoteLines * 50) + 100;
    ctx.fillStyle = "#6b9080";
    ctx.font = "bold 24px Arial, sans-serif";
    ctx.fillText("VALUE I'M HONORING", width / 2, valueY);
    
    ctx.fillStyle = "#2d3748";
    ctx.font = "bold 40px Georgia, serif";
    ctx.fillText(value || "Your core value", width / 2, valueY + 55);

    const stepY = valueY + 140;
    ctx.fillStyle = "#6b9080";
    ctx.font = "bold 24px Arial, sans-serif";
    ctx.fillText("MY TINY STEP", width / 2, stepY);
    
    ctx.fillStyle = "#4a5568";
    ctx.font = "32px Georgia, serif";
    wrapText(step || "One small action I can take", width / 2, stepY + 50, width - 200, 42);

    ctx.fillStyle = "#a0aec0";
    ctx.font = "20px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Educational wellness tools only. Not medical advice.", width / 2, height - 120);
    ctx.fillText("If in crisis: mymentalhealthbuddy.com/crisis", width / 2, height - 90);

    ctx.fillStyle = "#6b9080";
    ctx.font = "bold 22px Arial, sans-serif";
    ctx.fillText("mymentalhealthbuddy.com", width / 2, height - 50);

    ctx.save();
    ctx.globalAlpha = 0.04;
    ctx.fillStyle = "#6b9080";
    ctx.font = "16px Arial, sans-serif";
    ctx.rotate(-Math.PI / 6);
    for (let y = -height; y < height * 2; y += 80) {
      for (let x = -width; x < width * 2; x += 280) {
        ctx.fillText("mymentalhealthbuddy.com", x, y);
      }
    }
    ctx.restore();

    const dataUrl = canvas.toDataURL("image/png");
    setImageUrl(dataUrl);
    setShowPreview(true);
  }, [quote, value, step]);

  const handleDownload = () => {
    if (!imageUrl || !consentChecked) return;
    
    const link = document.createElement("a");
    link.download = `reflection-card-${Date.now()}.png`;
    link.href = imageUrl;
    link.click();
  };

  const handleReset = () => {
    setShowPreview(false);
    setImageUrl(null);
    setConsentChecked(false);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="reflection-card-title"
    >
      <div className="bg-[var(--card)] rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
          <h2 id="reflection-card-title" className="text-lg font-semibold text-[var(--text)]">
            Create Reflection Card
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[var(--surface)] transition"
            aria-label="Close"
            data-testid="btn-close-reflection-card"
          >
            <X className="w-5 h-5 text-[var(--text-muted)]" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {!showPreview ? (
            <>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] mb-2">
                  <Quote className="w-4 h-4" />
                  Select or Write Your Quote
                </label>
                {suggestedQuotes.length > 0 && (
                  <div className="mb-3 space-y-2">
                    <p className="text-xs text-[var(--text-muted)]">Choose from your writing:</p>
                    {suggestedQuotes.slice(0, 4).map((suggestion, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setQuote(suggestion.slice(0, 200))}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm border transition ${
                          quote === suggestion.slice(0, 200)
                            ? "border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--text)]"
                            : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:bg-[var(--surface-hover)]"
                        }`}
                        data-testid={`btn-select-quote-${idx}`}
                      >
                        {suggestion.slice(0, 80)}{suggestion.length > 80 ? "..." : ""}
                      </button>
                    ))}
                    <p className="text-xs text-[var(--text-muted)] pt-1">Or write your own:</p>
                  </div>
                )}
                <textarea
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder="A meaningful sentence from your reflection..."
                  className="w-full h-24 px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
                  data-testid="input-quote"
                  maxLength={200}
                />
                <p className="text-xs text-[var(--text-muted)] mt-1">{quote.length}/200 characters</p>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] mb-2">
                  <Heart className="w-4 h-4" />
                  One Value You're Honoring
                </label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="e.g., Self-respect, Growth, Courage..."
                  className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  data-testid="input-value"
                  maxLength={50}
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {VALUES_SUGGESTIONS.slice(0, 8).map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setValue(v)}
                      className={`px-2.5 py-1 text-xs rounded-full transition ${
                        value === v 
                          ? "bg-[var(--primary)] text-white" 
                          : "bg-[var(--surface)] text-[var(--text-muted)] hover:bg-[var(--surface-hover)]"
                      }`}
                      data-testid={`btn-value-${v.toLowerCase()}`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] mb-2">
                  <Footprints className="w-4 h-4" />
                  One Tiny Step You Can Take
                </label>
                <input
                  type="text"
                  value={step}
                  onChange={(e) => setStep(e.target.value)}
                  placeholder="A small, doable action..."
                  className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  data-testid="input-step"
                  maxLength={100}
                />
              </div>

              <button
                onClick={generateCard}
                disabled={!quote.trim() || !value.trim() || !step.trim()}
                className="w-full py-3 rounded-xl font-medium bg-[var(--primary)] text-white hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                data-testid="btn-generate-preview"
              >
                <Edit3 className="w-4 h-4" />
                Preview Card
              </button>
            </>
          ) : (
            <>
              <div className="rounded-xl overflow-hidden border border-[var(--border)] shadow-lg">
                {imageUrl && (
                  <img 
                    src={imageUrl} 
                    alt="Your reflection card preview" 
                    className="w-full h-auto"
                    data-testid="img-preview"
                  />
                )}
              </div>

              <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/60">
                <p className="text-xs text-amber-700 mb-3">
                  <strong>Edit before sharing:</strong> Please review and personalize this card. Remove any private details you don't want to share.
                </p>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentChecked}
                    onChange={(e) => setConsentChecked(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-amber-300 text-[var(--primary)] focus:ring-[var(--primary)]"
                    data-testid="checkbox-consent"
                  />
                  <span className="text-sm text-[var(--text)]">
                    I've edited and reviewed this card. I consent to downloading it for personal sharing. I understand this is for educational wellness purposes only.
                  </span>
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="flex-1 py-3 rounded-xl font-medium bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--surface-hover)] transition flex items-center justify-center gap-2"
                  data-testid="btn-edit-card"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={handleDownload}
                  disabled={!consentChecked}
                  className="flex-1 py-3 rounded-xl font-medium bg-[var(--primary)] text-white hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  data-testid="btn-download-card"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </>
          )}

          <div className="p-3 rounded-lg bg-[var(--sage-50)] border border-[var(--sage-200)] text-xs text-[var(--sage-700)]">
            <p className="mb-1">Educational wellness tools only. Not medical advice or treatment.</p>
            <a 
              href="/crisis" 
              className="inline-flex items-center gap-1 text-[var(--primary)] hover:underline"
              data-testid="link-crisis"
            >
              Crisis resources <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
    </div>
  );
}
