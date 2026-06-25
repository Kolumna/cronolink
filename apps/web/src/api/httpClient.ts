const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

let accessToken: string | null = null;
let refreshPromise: Promise<string | null> | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

async function refreshAccessToken(): Promise<string | null> {
  try {
    const res = await fetch(`${API_URL}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!res.ok) return null;

    const data = await res.json();
    setAccessToken(data.token);
    return data.token;
  } catch {
    return null;
  }
}

export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const doFetch = (token: string | null) =>
    fetch(`${API_URL}${path}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

  let res = await doFetch(accessToken);

  if (res.status === 401 && path !== '/api/auth/refresh') {
    if (!refreshPromise) refreshPromise = refreshAccessToken();
    const newToken = await refreshPromise;
    refreshPromise = null;

    if (newToken) res = await doFetch(newToken);
  }

  return res;
}
