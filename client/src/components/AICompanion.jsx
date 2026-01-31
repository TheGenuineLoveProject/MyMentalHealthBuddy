import React, { useState } from 'react';

export default function AICompanion() {
  const [chatOpen, setChatOpen] = useState(false);
  const [conversation, setConversation] = useState([
    { role: 'ai', text: '💖 Hello beautiful soul. What are you feeling today?' }
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;

    setConversation([...conversation, { role: 'user', text: input }]);
    setInput('');

    setTimeout(() => {
      setConversation(prev => [
        ...prev,
        {
          role: 'ai',
          text: '🌿 I honor your feelings. Let’s breathe together and find peace in this moment.'
        }
      ]);
    }, 1200);
  };

  return (
    <div className="fixed bottom-24 left-6 z-50">
      {chatOpen && (
        <div className="w-80 bg-softWhite border border-metallicGold rounded-xl p-4 shadow-lg backdrop-blur-lg animate-fade-in">
          <div className="h-64 overflow-y-auto space-y-3 text-sm font-sans">
            {conversation.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg ${
                  msg.role === 'ai' ? 'bg-sageGreen text-white' : 'bg-dustyRose text-charcoal'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="mt-3 flex">
            <input
              className="flex-1 px-3 py-2 border border-deepTeal rounded-md"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Speak from the heart..."
            />
            <button
              onClick={sendMessage}
              className="ml-2 px-3 py-2 rounded-md bg-metallicGold text-white shadow-glow hover:scale-105"
            >
              💌
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setChatOpen(!chatOpen)}
        className="rounded-full p-3 bg-sageGreen text-white shadow-glow animate-float"
      >
        🧘‍♀️
      </button>
    </div>
  );
}