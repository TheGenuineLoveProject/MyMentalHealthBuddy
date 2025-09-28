// HealingButton.tsx
import React, { useState } from 'react';

const HealingButton = () => {
  const [isHealing, setIsHealing] = useState(false);
  const [log, setLog] = useState('');

  const runHealing = async () => {
    setIsHealing(true);
    try {
      const response = await fetch('/api/heal'); // <-- Make sure this matches your backend route
      const result = await response.text();
      alert(result); // Success or error
      setLog(result);
    } catch (err) {
      alert('Healing failed.');
      setLog('Healing failed.');
    }
    setIsHealing(false);
  };

  return (
    <div style={{ padding: '1rem', background: '#f9f9f9', borderRadius: '8px' }}>
      <button
        onClick={runHealing}
        disabled={isHealing}
        style={{
          backgroundColor: '#4CAF50',
          color: 'white',
          padding: '12px 24px',
          fontSize: '16px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
      >
        {isHealing ? 'Healing...' : '💚 Run Healing'}
      </button>
      <pre style={{ marginTop: '1rem', color: '#333', fontSize: '0.9rem' }}>
        {log}
      </pre>
    </div>
  );
};

export default HealingButton;