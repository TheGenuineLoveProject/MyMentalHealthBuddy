import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';

const BENEFITS = [
  'Deeper therapeutic tools',
  'Personalized insights & analytics',
  'Unlimited tool history',
  'Advanced breathing patterns',
  'Priority AI companion responses',
];

export default function UpsellModal({ isOpen, onClose, toolName }) {
  const [visible, setVisible] = useState(false);
  const [, navigate] = useLocation();
  const dismissBtnRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setVisible(true), 50);
      // Move focus to the safest dismiss action so keyboard users can
      // exit immediately without navigating to the upgrade CTA.
      setTimeout(() => {
        if (dismissBtnRef.current) dismissBtnRef.current.focus();
      }, 60);
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: 'rgba(44,53,49,0.5)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)'
      }}
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClose();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label="Close upsell dialog"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="rounded-2xl max-w-md w-full p-8 shadow-xl"
        style={{
          background: '#faf9f7',
          border: '1px solid #e4f0e8',
          transform: visible ? 'scale(1)' : 'scale(0.95)',
          opacity: visible ? 1 : 0,
          transition: 'all 0.3s ease'
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="upsell-title"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div
            className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #2f5d5d, #5a8585)' }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <h2 id="upsell-title" className="font-serif text-2xl font-medium text-[#3a3a3a] mb-2">
            Unlock your full potential
          </h2>
          <p className="text-[#6B7B6E] text-sm">
            You've completed <strong>{toolName}</strong>. Ready for more?
          </p>
        </div>

        {/* Benefits */}
        <ul className="space-y-3 mb-6">
          {BENEFITS.map(b => (
            <li key={b} className="flex items-center gap-3 text-sm text-[#3a3a3a]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8FBF9F" strokeWidth="2.5">
                <path d="M5 13l4 4L19 7"/>
              </svg>
              {b}
            </li>
          ))}
        </ul>

        {/* Pricing */}
        <div
          className="rounded-xl p-4 mb-6 text-center"
          style={{ background: '#f4f9f6', border: '1px solid #c9e1d1' }}
        >
          <span className="font-serif text-3xl font-medium text-[#2f5d5d]">$9.99</span>
          <span className="text-[#6B7B6E] text-sm ml-2">one-time</span>
          <p className="text-xs text-[#9CA5A0] mt-1">No subscription. No hidden fees.</p>
        </div>

        {/* CTAs */}
        <button
          onClick={() => navigate('/register')}
          className="w-full py-3 rounded-lg font-medium text-white transition-all hover:brightness-105 mb-3"
          style={{ background: 'linear-gradient(135deg, #2f5d5d, #5a8585)' }}
        >
          Upgrade to Pro
        </button>
        <button
          ref={dismissBtnRef}
          onClick={onClose}
          className="w-full py-3 rounded-lg text-sm text-[#6B7B6E] hover:text-[#3a3a3a] transition-colors"
        >
          Continue with free tools
        </button>

        {/* Trust */}
        <p className="text-center text-xs text-[#9CA5A0] mt-4">
          100% of proceeds support free mental health access.
        </p>
      </div>
    </div>
  );
}
