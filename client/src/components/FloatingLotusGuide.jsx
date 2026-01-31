import React from 'react';
import lotusSVG from '../../public/lotus-guide.svg'; // update path accordingly

export default function FloatingLotusGuide() {
  return (
    <div className="fixed bottom-6 right-6 z-50 animate-float">
      <img
        src={lotusSVG}
        alt="Floating Lotus Guide"
        className="h-16 w-16 drop-shadow-glow cursor-pointer hover:scale-110 transition"
        title="Need help on your journey?"
        onClick={() => alert('Your Lotus Guide is here for you 💛')}
      />
    </div>
  );
}