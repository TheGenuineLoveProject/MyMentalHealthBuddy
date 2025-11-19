const API_BASE = '/api/health';

export async function systemHealth() {
  try {
    const res = await fetch(`${API_BASE}/status`);
    return await res.json();
  } catch (err) {
    console.error('Health Check Error:', err);
    return null;
  }
}