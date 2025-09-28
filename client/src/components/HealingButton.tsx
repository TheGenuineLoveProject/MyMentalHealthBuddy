import React from 'react';

const HealingButton = () => {
  const triggerHealing = async () => {
    await fetch('/api/trigger/healing');
    alert('Platform healing and optimization has started!');
  };

  return (
    <button onClick={triggerHealing} className="bg-green-500 text-white px-4 py-2 rounded">
      🧠 Heal Platform
    </button>
  );
};

export default HealingButton;