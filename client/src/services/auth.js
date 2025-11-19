const API_BASE = '/api/auth';

export async function login(email, password) {
  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return await res.json();
  } catch (err) {
    console.error('Login Error:', err);
    return null;
  }
}

export async function register(userData) {
  try {
    const res = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return await res.json();
  } catch (err) {
    console.error('Registration Error:', err);
    return null;
  }
}

export async function getProfile() {
  try {
    const res = await fetch(`${API_BASE}/profile`);
    return await res.json();
  } catch (err) {
    console.error('Profile Error:', err);
    return null;
  }
}