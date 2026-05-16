import { useState } from "react";
import { LotusGuide } from "./sacred";
import { X } from "lucide-react";

export default function FloatingLotusGuide({ initialMood = "calm" }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [mood] = useState(initialMood);

  return (
    <div 
      className="fixed bottom-6 right-6 z-50"
      role="complementary"
      aria-label="Floating wellness guide"
    >
      {isExpanded ? (
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 animate-in fade-in zoom-in-95 duration-300">
          <button
            onClick={() => setIsExpanded(false)}
            className="absolute -top-2 -right-2 w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            aria-label="Close lotus guide"
            data-testid="button-close-lotus"
          >
            <X className="w-4 h-4" />
          </button>
          <LotusGuide 
            mood={mood} 
            size={100} 
            showMessage={true} 
            animate={true}
          />
        </div>
      ) : (
        <button
          onClick={() => setIsExpanded(true)}
          className="w-16 h-16 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-lg backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#d4af37] animate-pulse-slow"
          aria-label="Open lotus wellness guide"
          data-testid="button-open-lotus"
        >
          <LotusGuide 
            mood={mood} 
            size={48} 
            showMessage={false} 
            animate={true}
          />
        </button>
      )}
      
      <style>{`
        @keyframes pulseSlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.4); }
          50% { box-shadow: 0 0 0 10px rgba(212, 175, 55, 0); }
        }
        .animate-pulse-slow { animation: pulseSlow 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
