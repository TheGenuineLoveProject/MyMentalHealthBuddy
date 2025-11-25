import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from "lucide-react";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (type: ToastType, message: string, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((type: ToastType, message: string, duration = 4000) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setToasts((prev) => [...prev, { id, type, message, duration }]);

    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-label="Notifications"
      style={{
        position: "fixed",
        bottom: "1.5rem",
        right: "1.5rem",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        maxWidth: "400px",
        width: "100%",
      }}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const [isExiting, setIsExiting] = useState(false);

  const handleRemove = () => {
    setIsExiting(true);
    setTimeout(() => onRemove(toast.id), 200);
  };

  const config = {
    success: {
      bg: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
      border: "#86efac",
      color: "#166534",
      icon: <CheckCircle className="w-5 h-5" />,
    },
    error: {
      bg: "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)",
      border: "#fca5a5",
      color: "#991b1b",
      icon: <AlertCircle className="w-5 h-5" />,
    },
    warning: {
      bg: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
      border: "#fcd34d",
      color: "#92400e",
      icon: <AlertTriangle className="w-5 h-5" />,
    },
    info: {
      bg: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
      border: "#93c5fd",
      color: "#1e40af",
      icon: <Info className="w-5 h-5" />,
    },
  };

  const style = config[toast.type];

  return (
    <div
      role="alert"
      data-testid={`toast-${toast.type}`}
      style={{
        background: style.bg,
        border: `1px solid ${style.border}`,
        color: style.color,
        padding: "1rem 1.25rem",
        borderRadius: "var(--radius)",
        boxShadow: "var(--shadow-lg)",
        display: "flex",
        alignItems: "flex-start",
        gap: "0.75rem",
        animation: isExiting ? "slideOutRight 0.2s ease forwards" : "slideInLeft 0.3s ease forwards",
      }}
    >
      <span style={{ flexShrink: 0, marginTop: "2px" }}>{style.icon}</span>
      <p style={{ flex: 1, margin: 0, fontSize: "0.95rem", fontWeight: 500 }}>
        {toast.message}
      </p>
      <button
        onClick={handleRemove}
        aria-label="Dismiss notification"
        data-testid="button-dismiss-toast"
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: "0.25rem",
          color: style.color,
          opacity: 0.7,
          transition: "opacity 0.2s",
          flexShrink: 0,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.7"; }}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
