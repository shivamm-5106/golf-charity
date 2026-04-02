const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export async function api(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.errors?.[0]?.message || 'Request failed');
  return data;
}

export function authHeaders(token) {
  return { Authorization: `Bearer ${token}` };
}

export function jsonAuthHeaders(token) {
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
}
