import { useState } from 'react';

export default function HealingChat() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    const res = await fetch('/api/healing-employee', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input }),
    });
    const data = await res.json();
    setMessages([...messages, `🧠 You: ${input}`, `💬 AI: ${data.response}`]);
    setInput('');
  };

  return (
    <div>
      <h2>💖 AI Healing Chat</h2>
      <div>{messages.map((m, i) => <p key={i}>{m}</p>)}</div>
      <input value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}