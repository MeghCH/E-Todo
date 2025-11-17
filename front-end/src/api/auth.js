const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";
const JSON_HEADERS = { "Content-Type": "application/json" };

async function readError(res, fallback) {
  const txt = await res.text().catch(() => null);
  try {
    const json = txt ? JSON.parse(txt) : null;
    throw new Error(json?.msg || fallback);
  } catch {
    throw new Error(txt || fallback);
  }
}

export async function login(payload) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(payload),
  });

  if (!res.ok) return readError(res, "Impossible de se connecter.");

  const data = await res.json();

  if (data?.token) {
    localStorage.setItem("access_token", data.token);
  }
  if (data?.user) {
    localStorage.setItem("user", JSON.stringify(data.user));
  }

  return data;
}

export async function register(payload) {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(payload),
  });

  if (!res.ok) return readError(res, "Échec de l'inscription.");

  const data = await res.json();

  if (data?.token) {
    localStorage.setItem("access_token", data.token);
  }
  if (data?.user) {
    localStorage.setItem("user", JSON.stringify(data.user));
  }

  return data;
}

export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
}
