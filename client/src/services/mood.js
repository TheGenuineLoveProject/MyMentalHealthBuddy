// client/src/services/mood.js

const API_BASE = import.meta.env.VITE_API_URL || 'https://my-mental-health-buddy.replit.app';

export async function getMood() {
  try {
    const res = await fetch(`${API_BASE}/api/mood`);
    if (!res.ok) throw new Error('Failed to fetch mood data');
    return await res.json();
  } catch (err) {
    console.error('Error in getMood:', err);
    return { error: true, message: err.message };
  }
}

export async function saveMood(entry) {
  try {
    const res = await fetch(`${API_BASE}/api/mood`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry)
    });
    if (!res.ok) throw new Error('Failed to save mood entry');
    return await res.json();
  } catch (err) {
    console.error('Error in saveMood:', err);
    return { error: true, message: err.message };
  }
}