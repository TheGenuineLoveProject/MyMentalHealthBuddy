import { useState, useRef, useEffect } from "react";
import { Palette, Pencil, Trash2, Download, Undo, Redo, Sparkles, Heart, Save, RotateCcw } from "lucide-react";
import { useGamification } from "../context/GamificationContext.jsx";

const COLORS = [
  "#1F2937", "#DC2626", "#EA580C", "#D97706", "#CA8A04",
  "#65A30D", "#16A34A", "#0D9488", "#0891B2", "#0284C7",
  "#2563EB", "#4F46E5", "#7C3AED", "#9333EA", "#C026D3",
  "#DB2777", "#E11D48", "#F8FAFC", "#94A3B8", "#475569",
];

const BRUSH_SIZES = [
  { size: 4, name: "Fine" },
  { size: 8, name: "Small" },
  { size: 16, name: "Medium" },
  { size: 32, name: "Large" },
  { size: 48, name: "Extra Large" },
];

const ART_PROMPTS = [
  { emoji: "🌈", prompt: "Draw something that represents hope", theme: "Hope" },
  { emoji: "💪", prompt: "Create an image of your inner strength", theme: "Strength" },
  { emoji: "🌱", prompt: "Illustrate personal growth", theme: "Growth" },
  { emoji: "☀️", prompt: "Capture a happy memory", theme: "Joy" },
  { emoji: "🦋", prompt: "Draw your transformation", theme: "Change" },
  { emoji: "🏔️", prompt: "Visualize overcoming a challenge", theme: "Resilience" },
  { emoji: "🌊", prompt: "Express your emotions as waves", theme: "Feelings" },
  { emoji: "🔮", prompt: "Illustrate your future self", theme: "Vision" },
];

export default function CreativeExpression() {
  const { recordSession } = useGamification();
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState(COLORS[0]);
  const [brushSize, setBrushSize] = useState(BRUSH_SIZES[2].size);
  const [currentPrompt, setCurrentPrompt] = useState(ART_PROMPTS[0]);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [sessionTime, setSessionTime] = useState(0);
  const [artworkSaved, setArtworkSaved] = useState(false);
  const startTimeRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvas.offsetWidth * 2;
    canvas.height = 400 * 2;
    canvas.style.width = `${canvas.offsetWidth}px`;
    canvas.style.height = "400px";

    const context = canvas.getContext("2d");
    context.scale(2, 2);
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = color;
    context.lineWidth = brushSize;
    context.fillStyle = "#FFFFFF";
    context.fillRect(0, 0, canvas.width, canvas.height);
    contextRef.current = context;

    saveState();
  }, []);

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = color;
      contextRef.current.lineWidth = brushSize;
    }
  }, [color, brushSize]);

  useEffect(() => {
    if (!startTimeRef.current) {
      startTimeRef.current = Date.now();
    }

    const interval = setInterval(() => {
      setSessionTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const imageData = canvas.toDataURL();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(imageData);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      loadState(history[newIndex]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      loadState(history[newIndex]);
    }
  };

  const loadState = (dataUrl) => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (!canvas || !context) return;

    const img = new Image();
    img.onload = () => {
      context.clearRect(0, 0, canvas.width / 2, canvas.height / 2);
      context.drawImage(img, 0, 0, canvas.width / 2, canvas.height / 2);
    };
    img.src = dataUrl;
  };

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    if (isDrawing) {
      contextRef.current.closePath();
      setIsDrawing(false);
      saveState();
    }
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvasRef.current.getBoundingClientRect();
    const offsetX = touch.clientX - rect.left;
    const offsetY = touch.clientY - rect.top;
    
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const handleTouchMove = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvasRef.current.getBoundingClientRect();
    const offsetX = touch.clientX - rect.left;
    const offsetY = touch.clientY - rect.top;
    
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (!canvas || !context) return;

    context.fillStyle = "#FFFFFF";
    context.fillRect(0, 0, canvas.width / 2, canvas.height / 2);
    saveState();
  };

  const downloadArtwork = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `creative-expression-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleSaveSession = async () => {
    await recordSession("creative_expression", sessionTime, {
      prompt: currentPrompt.theme,
    });
    setArtworkSaved(true);
    setTimeout(() => setArtworkSaved(false), 3000);
  };

  const randomPrompt = () => {
    const filtered = ART_PROMPTS.filter(p => p.theme !== currentPrompt.theme);
    setCurrentPrompt(filtered[Math.floor(Math.random() * filtered.length)]);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6" data-testid="creative-expression">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full mb-4">
          <Palette className="w-5 h-5 text-pink-400" />
          <span className="text-pink-300 font-medium">Creative Expression</span>
        </div>
        <h2 className="text-2xl font-bold text-[var(--text)]">Art Therapy</h2>
        <p className="text-[var(--text-secondary)] mt-2">
          Express your emotions through creative art
        </p>
      </div>

      <div className="bg-gradient-to-r from-pink-900/20 to-purple-900/20 rounded-xl p-4 border border-pink-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{currentPrompt.emoji}</span>
            <div>
              <h3 className="font-semibold text-white">{currentPrompt.theme}</h3>
              <p className="text-sm text-slate-300" data-testid="text-prompt">{currentPrompt.prompt}</p>
            </div>
          </div>
          <button
            onClick={randomPrompt}
            className="p-2 bg-pink-600/30 rounded-lg hover:bg-pink-600/50 transition-colors"
            data-testid="button-new-prompt"
            aria-label="Get new prompt"
          >
            <RotateCcw className="w-5 h-5 text-pink-300" />
          </button>
        </div>
      </div>

      <div className="bg-[var(--surface)] rounded-2xl p-4 border border-[var(--border)]">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="flex items-center gap-1 p-1 bg-slate-800/50 rounded-lg">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-6 h-6 rounded-full transition-all ${
                  color === c ? "ring-2 ring-offset-2 ring-offset-slate-800 ring-pink-500" : ""
                }`}
                style={{ backgroundColor: c }}
                data-testid={`button-color-${c.replace("#", "")}`}
                aria-label={`Select color ${c}`}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-sm text-[var(--text-secondary)] mr-2">
            <Pencil className="w-4 h-4 inline mr-1" />
            Brush:
          </span>
          {BRUSH_SIZES.map((brush) => (
            <button
              key={brush.size}
              onClick={() => setBrushSize(brush.size)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                brushSize === brush.size
                  ? "bg-pink-600 text-white"
                  : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50"
              }`}
              data-testid={`button-brush-${brush.size}`}
            >
              {brush.name}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl overflow-hidden shadow-inner mb-4">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseUp={finishDrawing}
            onMouseMove={draw}
            onMouseLeave={finishDrawing}
            onTouchStart={handleTouchStart}
            onTouchEnd={finishDrawing}
            onTouchMove={handleTouchMove}
            className="w-full cursor-crosshair touch-none"
            data-testid="canvas-drawing"
            aria-label="Drawing canvas"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={undo}
              disabled={historyIndex <= 0}
              className="p-2 bg-slate-700/50 rounded-lg hover:bg-slate-600/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="button-undo"
              aria-label="Undo"
            >
              <Undo className="w-5 h-5 text-slate-300" />
            </button>
            <button
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className="p-2 bg-slate-700/50 rounded-lg hover:bg-slate-600/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="button-redo"
              aria-label="Redo"
            >
              <Redo className="w-5 h-5 text-slate-300" />
            </button>
            <button
              onClick={clearCanvas}
              className="p-2 bg-red-600/30 rounded-lg hover:bg-red-600/50 transition-colors"
              data-testid="button-clear"
              aria-label="Clear canvas"
            >
              <Trash2 className="w-5 h-5 text-red-400" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--text-secondary)]" data-testid="text-session-time">
              {formatTime(sessionTime)}
            </span>
            <button
              onClick={downloadArtwork}
              className="p-2 bg-violet-600/30 rounded-lg hover:bg-violet-600/50 transition-colors"
              data-testid="button-download"
              aria-label="Download artwork"
            >
              <Download className="w-5 h-5 text-violet-400" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[var(--surface)] rounded-xl p-4 text-center">
          <Palette className="w-6 h-6 text-pink-400 mx-auto mb-2" />
          <div className="text-xl font-bold text-[var(--text)]" data-testid="text-strokes">
            {historyIndex}
          </div>
          <div className="text-sm text-[var(--text-secondary)]">Strokes Made</div>
        </div>
        <div className="bg-[var(--surface)] rounded-xl p-4 text-center">
          <Sparkles className="w-6 h-6 text-amber-400 mx-auto mb-2" />
          <div className="text-xl font-bold text-[var(--text)]">
            +{Math.floor(sessionTime / 60) * 15 + 25}
          </div>
          <div className="text-sm text-[var(--text-secondary)]">XP Available</div>
        </div>
      </div>

      <button
        onClick={handleSaveSession}
        disabled={artworkSaved}
        className={`w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
          artworkSaved
            ? "bg-emerald-600 text-white"
            : "bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:shadow-lg hover:shadow-pink-500/25"
        }`}
        data-testid="button-save-session"
      >
        {artworkSaved ? (
          <>
            <Heart className="w-5 h-5" />
            Session Saved!
          </>
        ) : (
          <>
            <Save className="w-5 h-5" />
            Complete & Earn XP
          </>
        )}
      </button>

      <div className="bg-gradient-to-r from-pink-900/20 to-purple-900/20 rounded-xl p-4 border border-pink-500/20">
        <h4 className="font-medium text-pink-300 mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Art Therapy Benefits
        </h4>
        <ul className="text-sm text-[var(--text-secondary)] space-y-1">
          <li>• Reduces stress and anxiety through creative expression</li>
          <li>• Helps process difficult emotions non-verbally</li>
          <li>• Increases self-awareness and mindfulness</li>
          <li>• Boosts self-esteem through creative accomplishment</li>
        </ul>
      </div>
    </div>
  );
}
