// HealingButton.tsx
import React, { useState } from 'react';

const HealingButton = () => {
  const [isHealing, setIsHealing] = useState(false);
  const [log, setLog] = useState('');

  const handleHeal = async () => {
    setIsHealing(true);
    setLog('');

    try {
      const response = await fetch('/api/healing/run-healing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      
      if (result.status) {
        setLog(`✅ ${result.status}`);
      } else {
        setLog('❌ Healing failed.');
      }
    } catch (err) {
      setLog('❌ Healing failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }

    setIsHealing(false);
  };

  return (
    <div style={{ padding: '1rem', background: '#f9f9f9', borderRadius: '8px' }}>
      <button
        onClick={handleHeal}
        disabled={isHealing}
        style={{
          backgroundColor: '#4CAF50',
          color: 'white',
          padding: '12px 24px',
          border: 'none',
          borderRadius: '4px',
          cursor: isHealing ? 'not-allowed' : 'pointer',
          fontWeight: 'bold',
          opacity: isHealing ? 0.6 : 1
        }}
      >
        {isHealing ? 'Healing...' : '💚 Run Healing'}
      </button>

      {log && (
        <pre style={{ marginTop: '1rem', color: '#333', fontSize: '0.9rem' }}>
          {log}
        </pre>
      )}
    </div>
  );
};

export default HealingButton;