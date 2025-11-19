// Analytics Service — Tracks page views & events
const API_BASE = '/api/analytics';

export async function trackEvent(eventName, data = {}) {
  try {
    const res = await fetch(`${API_BASE}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventName, data })
    });
    return await res.json();
  } catch (err) {
    console.error('Analytics Error:', err);
    return null;
  }
}

export async function getStats() {
  try {
    const res = await fetch(`${API_BASE}/stats`);
    return await res.json();
  } catch (err) {
    console.error('Analytics Stats Error:', err);
    return null;
  }
}