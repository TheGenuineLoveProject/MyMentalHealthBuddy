import { useToast, type ToastVariant } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

const VARIANT_ACCENT: Record<ToastVariant, string> = {
  default: "rgb(143,191,159)",
  success: "rgb(143,191,159)",
  destructive: "#C4787A",
};

interface ToastItemProps {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  onDismiss: (id: string) => void;
}

function ToastItem({ id, title, description, variant = "default", onDismiss }: ToastItemProps) {
  const [phase, setPhase] = useState<"enter" | "visible" | "exit">("enter");

  useEffect(() => {
    const enterRaf = requestAnimationFrame(() => setPhase("visible"));
    const exitTimer = window.setTimeout(() => setPhase("exit"), 3000);
    const removeTimer = window.setTimeout(() => onDismiss(id), 3150);
    return () => {
      cancelAnimationFrame(enterRaf);
      window.clearTimeout(exitTimer);
      window.clearTimeout(removeTimer);
    };
  }, [id, onDismiss]);

  const accent = VARIANT_ACCENT[variant];

  const baseStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.92)",
    color: "rgb(22,58,54)",
    borderLeft: `4px solid ${accent}`,
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    transition: "opacity 200ms ease-out, transform 200ms ease-out",
    opacity: phase === "visible" ? 1 : 0,
    transform:
      phase === "enter"
        ? "translateY(20px)"
        : phase === "exit"
        ? "translateY(-20px)"
        : "translateY(0)",
  };

  return (
    <div
      role={variant === "destructive" ? "alert" : "status"}
      aria-live={variant === "destructive" ? "assertive" : "polite"}
      className="pointer-events-auto rounded-2xl shadow-lg px-4 py-3 flex items-start gap-3"
      style={baseStyle}
      data-testid={`toast-${id}`}
    >
      <div className="flex-1 min-w-0">
        {title && (
          <div className="font-medium text-sm leading-snug" data-testid={`toast-title-${id}`}>
            {title}
          </div>
        )}
        {description && (
          <div className="text-sm opacity-80 mt-0.5 leading-snug" data-testid={`toast-desc-${id}`}>
            {description}
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(id)}
        aria-label="Dismiss notification"
        className="opacity-60 hover:opacity-100 transition-opacity shrink-0 mt-0.5"
        data-testid={`button-dismiss-toast-${id}`}
      >
        <X size={16} />
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const { toasts, dismiss } = useToast();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed bottom-24 right-4 flex flex-col gap-2 w-full max-w-[320px]"
      style={{ zIndex: 60 }}
      data-testid="toast-container"
    >
      {toasts.map((t) => (
        <ToastItem
          key={t.id}
          id={t.id}
          title={t.title}
          description={t.description}
          variant={t.variant}
          onDismiss={dismiss}
        />
      ))}
    </div>
  );
}
