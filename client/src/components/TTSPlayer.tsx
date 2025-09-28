import { useEffect, useState } from 'react';

export default function TTSPlayer({ text }: { text: string }) {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    const speak = async () => {
      const res = await fetch('/api/tts', {
        method: 'POST',
        body: JSON.stringify({ text }),
        headers: { 'Content-Type': 'application/json' },
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = new Audio(url);
      setAudio(a);
    };
    speak();
  }, [text]);

  return <button onClick={() => audio?.play()}>🔊 Play Voice</button>;
}