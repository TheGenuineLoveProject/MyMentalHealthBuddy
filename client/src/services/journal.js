const API_BASE = '/api/journal';

export async function createEntry(text) {
  try {
    const res = await fetch(`${API_BASE}/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    return await res.json();
  } catch (err) {
    console.error('Journal Create Error:', err);
    return null;
  }
}

export async function getEntries() {
  try {
    const res = await fetch(`${API_BASE}/entries`);
    return await res.json();
  } catch (err) {
    console.error('Journal Fetch Error:', err);
    return null;
  }
}