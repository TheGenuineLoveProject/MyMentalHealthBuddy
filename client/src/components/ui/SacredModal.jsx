import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

export default function SacredModal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  className = ''
}) {
  const [isExiting, setIsExiting] = useState(false);
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-4xl'
  };

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      
      setTimeout(() => {
        modalRef.current?.focus();
      }, 100);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsExiting(false);
      onClose();
      previousActiveElement.current?.focus();
    }, 200);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen && !isExiting) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop ${isExiting ? 'opacity-0' : ''}`}
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
        transition: 'opacity 0.2s ease'
      }}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      data-testid="modal-backdrop"
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className={`
          relative w-full ${sizeClasses[size]} 
          bg-card rounded-2xl shadow-xl 
          border border-border/50
          ${isExiting ? 'modal-exit' : 'modal-content'}
          ${className}
        `}
        data-testid="modal-content"
      >
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 pb-4 border-b border-border/30">
            {title && (
              <h2 
                id="modal-title"
                className="text-xl font-serif text-foreground"
                data-testid="text-modal-title"
              >
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Close modal"
                data-testid="button-modal-close"
              >
                <X className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
              </button>
            )}
          </div>
        )}

        <div className="p-6" data-testid="container-modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}

export function AffirmationModal({ isOpen, onClose, affirmation }) {
  return (
    <SacredModal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      className="text-center"
    >
      <div className="py-8 px-4">
        <div className="text-4xl mb-6">🌸</div>
        <p 
          className="text-xl font-serif text-foreground leading-relaxed italic"
          data-testid="text-affirmation"
        >
          "{affirmation}"
        </p>
        <button
          onClick={onClose}
          className="mt-8 px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium btn-sacred-pulse"
          data-testid="button-affirmation-close"
        >
          Embrace This Truth
        </button>
      </div>
    </SacredModal>
  );
}
