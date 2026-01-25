import { useState, useEffect, useRef, useCallback } from "react";
import { AlertTriangle, Heart, ExternalLink } from "lucide-react";

const STORAGE_KEY = "glp_age_confirmed";

interface AgeConfirmationModalProps {
  onConfirm?: () => void;
}

export function AgeConfirmationModal({ onConfirm }: AgeConfirmationModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const confirmed = localStorage.getItem(STORAGE_KEY);
    if (!confirmed) {
      setIsOpen(true);
      setTimeout(() => {
        setIsVisible(true);
        confirmButtonRef.current?.focus();
      }, 50);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleConfirm = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setIsVisible(false);
    setTimeout(() => {
      setIsOpen(false);
      onConfirm?.();
    }, 300);
  };

  const handleDecline = () => {
    window.location.href = "https://www.google.com";
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Tab" && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-modal-title"
      aria-describedby="age-modal-description"
      data-testid="modal-age-confirmation"
    >
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        aria-hidden="true"
        data-testid="modal-overlay"
      />
      
      <div 
        ref={modalRef}
        className={`relative w-full max-w-md bg-background rounded-2xl shadow-2xl border border-[hsl(var(--sage-200))] dark:border-[hsl(var(--sage-700))] transition-transform duration-300 ${isVisible ? "scale-100" : "scale-95"}`}
      >
        <div className="p-6 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-[hsl(var(--sage-100))] dark:bg-[hsl(var(--sage-800))] flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 text-[hsl(var(--sage-600))]" aria-hidden="true" />
          </div>
          
          <h2 id="age-modal-title" className="text-xl font-semibold mb-3 text-foreground">
            Welcome to The Genuine Love Project
          </h2>
          
          <p id="age-modal-description" className="text-muted-foreground mb-4 leading-relaxed">
            This platform offers <strong>educational self-reflection tools</strong> for adults 
            seeking personal growth and emotional wellness.
          </p>
          
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div className="text-left text-sm">
                <p className="text-amber-800 dark:text-amber-200 font-medium mb-1">
                  Important Notice
                </p>
                <p className="text-amber-700 dark:text-amber-300">
                  This is <strong>not therapy or medical advice</strong>. Content is for educational 
                  purposes only. If you're in crisis, please seek professional help.
                </p>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mb-6">
            By continuing, you confirm you are <strong>18 years or older</strong> and 
            understand this is educational content.
          </p>
          
          <div className="flex flex-col gap-3">
            <button
              ref={confirmButtonRef}
              type="button"
              onClick={handleConfirm}
              className="w-full py-3 px-4 rounded-lg bg-[hsl(var(--sage-600))] hover:bg-[hsl(var(--sage-700))] text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[hsl(var(--sage-400))] focus:ring-offset-2"
              data-testid="button-confirm-age"
            >
              I am 18+ and I understand
            </button>
            
            <button
              type="button"
              onClick={handleDecline}
              className="w-full py-2 px-4 rounded-lg text-muted-foreground hover:text-foreground transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--sage-400))] focus:ring-offset-2"
              data-testid="button-decline-age"
            >
              I am under 18 — exit
            </button>
          </div>
          
          <div className="mt-6 pt-4 border-t border-[hsl(var(--sage-200))] dark:border-[hsl(var(--sage-700))]">
            <a 
              href="/crisis" 
              className="inline-flex items-center gap-1 text-sm text-[hsl(var(--sage-600))] hover:underline focus:outline-none focus:ring-2 focus:ring-[hsl(var(--sage-400))] rounded"
              data-testid="link-crisis"
            >
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
              Need immediate support? Visit crisis resources
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgeConfirmationModal;
