/**
 * ============================================================================
 * QUOTE BLOCK COMPONENT
 * ============================================================================
 * 
 * Rotating inspirational quotes with gentle animations
 * Brand Colors: #8fbf9f (sage), #f4c7c3 (rose), #2f5d5d (teal), #eac33b (gold)
 * 
 * Usage:
 *   <QuoteBlock quotes={[...]} interval={8000} />
 *   <QuoteBlock variant="centered" />
 *   <QuoteBlock variant="card" />
 * ============================================================================
 */

import { useState, useEffect } from "react";
import { Quote, Heart, Sparkles } from "lucide-react";

const defaultQuotes = [
  { 
    text: "You are worthy of the love you so freely give to others.", 
    author: "Self-Love Reminder" 
  },
  { 
    text: "Healing is not linear. Every step forward counts, even the small ones.", 
    author: "Growth Wisdom" 
  },
  { 
    text: "Your sensitivity is not a weakness—it is your greatest strength.", 
    author: "Gentle Truth" 
  },
  { 
    text: "Today, choose yourself. Tomorrow, choose yourself again.", 
    author: "Daily Intention" 
  },
  { 
    text: "The love you seek is already within you, waiting to be discovered.", 
    author: "Inner Light" 
  }
];

export default function QuoteBlock({ 
  quotes = defaultQuotes, 
  interval = 8000,
  variant = "default",
  showIcon = true,
  className = ""
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % quotes.length);
        setIsAnimating(false);
      }, 500);
    }, interval);

    return () => clearInterval(timer);
  }, [quotes.length, interval]);

  const currentQuote = quotes[currentIndex];

  if (variant === "card") {
    return (
      <div 
        className={`relative p-8 rounded-3xl overflow-hidden ${className}`}
        style={{ 
          background: 'linear-gradient(135deg, rgba(143, 191, 159, 0.1), rgba(244, 199, 195, 0.15))',
          border: '1px solid rgba(143, 191, 159, 0.2)'
        }}
        data-component="QuoteBlock"
        data-variant="card"
        data-testid="quote-block-card"
        role="region"
        aria-label="Inspirational quote"
        aria-live="polite"
      >
        <div 
          className="absolute top-0 left-0 right-0 h-1"
          style={{ background: 'linear-gradient(90deg, #8fbf9f, #eac33b, #f4c7c3)' }}
          aria-hidden="true"
        />
        
        {showIcon && (
          <div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6"
            style={{ background: 'linear-gradient(135deg, #eac33b, #d4a84b)' }}
          >
            <Quote className="w-6 h-6" style={{ color: '#2f5d5d' }} aria-hidden="true" />
          </div>
        )}
        
        <blockquote 
          className={`transition-all duration-500 ${isAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}
        >
          <p 
            className="text-xl md:text-2xl font-serif italic leading-relaxed mb-4"
            style={{ color: '#2f5d5d' }}
          >
            "{currentQuote.text}"
          </p>
          <footer 
            className="flex items-center gap-2 text-sm font-medium"
            style={{ color: '#3a3a3a', opacity: 0.7 }}
          >
            <Heart className="w-4 h-4" style={{ color: '#f4c7c3' }} aria-hidden="true" />
            <cite style={{ fontStyle: 'normal' }}>{currentQuote.author}</cite>
          </footer>
        </blockquote>

        <div className="flex gap-2 mt-6" role="tablist" aria-label="Quote navigation">
          {quotes.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className="w-2 h-2 rounded-full transition-all"
              style={{ 
                background: i === currentIndex ? '#eac33b' : 'rgba(47, 93, 93, 0.2)',
                transform: i === currentIndex ? 'scale(1.3)' : 'scale(1)'
              }}
              role="tab"
              aria-selected={i === currentIndex}
              aria-label={`Quote ${i + 1} of ${quotes.length}`}
              data-testid={`quote-dot-${i}`}
            />
          ))}
        </div>
      </div>
    );
  }

  if (variant === "centered") {
    return (
      <div 
        className={`text-center py-12 px-6 ${className}`}
        data-component="QuoteBlock"
        data-variant="centered"
        data-testid="quote-block-centered"
        role="region"
        aria-label="Inspirational quote"
        aria-live="polite"
      >
        {showIcon && (
          <Sparkles 
            className="w-8 h-8 mx-auto mb-6" 
            style={{ color: '#eac33b' }} 
            aria-hidden="true" 
          />
        )}
        
        <blockquote 
          className={`max-w-2xl mx-auto transition-all duration-500 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
        >
          <p 
            className="text-2xl md:text-3xl lg:text-4xl font-serif italic leading-relaxed mb-6"
            style={{ color: '#2f5d5d' }}
          >
            "{currentQuote.text}"
          </p>
          <footer 
            className="text-sm font-medium uppercase tracking-wider"
            style={{ color: '#8fbf9f' }}
          >
            <cite style={{ fontStyle: 'normal' }}>— {currentQuote.author}</cite>
          </footer>
        </blockquote>

        <div className="flex justify-center gap-3 mt-8" role="tablist" aria-label="Quote navigation">
          {quotes.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className="w-3 h-3 rounded-full transition-all"
              style={{ 
                background: i === currentIndex ? '#eac33b' : 'rgba(143, 191, 159, 0.3)',
                boxShadow: i === currentIndex ? '0 0 12px rgba(234, 195, 59, 0.5)' : 'none'
              }}
              role="tab"
              aria-selected={i === currentIndex}
              aria-label={`Quote ${i + 1}`}
              data-testid={`quote-dot-${i}`}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`flex items-start gap-4 p-6 ${className}`}
      data-component="QuoteBlock"
      data-variant="default"
      data-testid="quote-block-default"
      role="region"
      aria-label="Inspirational quote"
      aria-live="polite"
    >
      {showIcon && (
        <div 
          className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center"
          style={{ background: 'rgba(234, 195, 59, 0.15)' }}
        >
          <Quote className="w-5 h-5" style={{ color: '#eac33b' }} aria-hidden="true" />
        </div>
      )}
      
      <blockquote 
        className={`flex-1 transition-all duration-500 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}
      >
        <p 
          className="text-lg font-serif italic leading-relaxed mb-2"
          style={{ color: '#2f5d5d' }}
        >
          "{currentQuote.text}"
        </p>
        <footer 
          className="text-xs font-medium"
          style={{ color: '#3a3a3a', opacity: 0.6 }}
        >
          <cite style={{ fontStyle: 'normal' }}>{currentQuote.author}</cite>
        </footer>
      </blockquote>
    </div>
  );
}

export { defaultQuotes };
