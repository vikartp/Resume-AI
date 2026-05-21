const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("resumeai_token");
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: authHeaders(),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(error.detail || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function apiPost<T>(path: string, body?: FormData | object): Promise<T> {
  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  let fetchBody: BodyInit | undefined;

  if (body instanceof FormData) {
    fetchBody = body;
  } else if (body) {
    headers["Content-Type"] = "application/json";
    fetchBody = JSON.stringify(body);
  }

  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers,
    body: fetchBody,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(error.detail || `HTTP ${res.status}`);
  }
  return res.json();
}

export function getLoginUrl(): string {
  return `${API_URL}/api/auth/login`;
}

export function getPdfDownloadUrl(sessionId: string): string {
  const token = getToken();
  return `${API_URL}/api/resume/${sessionId}/pdf?token=${token}`;
}

export function setToken(token: string) {
  localStorage.setItem("resumeai_token", token);
}

export function clearToken() {
  localStorage.removeItem("resumeai_token");
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
