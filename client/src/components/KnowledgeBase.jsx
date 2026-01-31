import React, { useState } from 'react';
import lotusSVG from '../../public/lotus-guide.svg'; // update path if different

export default function KnowledgeBase() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '🌸 How can I support your healing today?' }
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');

    // Simulate AI Response
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `💫 Your healing journey is valid and beautiful. 🌟`
        }
      ]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-20 right-6 z-50">
      {isOpen && (
        <div className="w-80 bg-softWhite shadow-xl rounded-xl p-4 border border-metallicGold animate-fade-in">
          <div className="h-64 overflow-y-auto space-y-3 text-sm font-sans">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-lg ${
                  msg.role === 'assistant'
                    ? 'bg-sageGreen text-white'
                    : 'bg-dustyRose text-charcoal'
                }`}
              >
                {msg.content}
              </div>
            ))}
          </div>
          <div className="mt-2 flex">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask Lotus anything..."
              className="flex-1 px-3 py-2 border border-deepTeal rounded-lg"
            />
            <button
              onClick={sendMessage}
              className="ml-2 px-3 py-2 bg-metallicGold text-white rounded-lg shadow-glow hover:scale-105 transition"
            >
              ✨
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-50 animate-float"
      >
        <img
          src={lotusSVG}
          alt="Lotus AI"
          className="h-14 w-14 rounded-full drop-shadow-glow hover:scale-110 transition"
        />
      </button>
    </div>
  );
}