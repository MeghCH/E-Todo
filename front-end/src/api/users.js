const BASE_URL =
  import.meta?.env?.VITE_API_BASE_URL ||
  process.env.REACT_APP_API_BASE_URL ||
  "http://localhost:3000";

const JSON_HEADERS = { "Content-Type": "application/json" };

function authHeader() {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// PUBLIC

export async function register(credentials) {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(credentials),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || "Erreur d'inscription");
  }
  const data = await res.json();
  if (data?.token) localStorage.setItem("access_token", data.token);
  if (data?.user) localStorage.setItem("user", JSON.stringify(data.user));
  return data;
}

// PROTEGE

export async function getMe() {
  const res = await fetch(`${BASE_URL}/api/user`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error("Erreur GET /user");
  return res.json();
}

export async function getMyTodos() {
  const res = await fetch(`${BASE_URL}/api/user/todos`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error("Erreur GET /user/todos");
  return res.json();
}

export async function createEmployee(payload) {
  const res = await fetch(`${BASE_URL}/api/users`, {
    method: "POST",
    headers: { ...authHeader(), ...JSON_HEADERS },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || "Échec de création de l'employé.");
  }
  return res.json();
}

export async function getUser(id) {
  const res = await fetch(`${BASE_URL}/api/users/${encodeURIComponent(id)}`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error("Erreur GET utilisateur");
  return res.json();
}

export async function getUserByIdOrEmail(idOrEmail) {
  const res = await fetch(
    `${BASE_URL}/api/users/${encodeURIComponent(idOrEmail)}`,
    { headers: { ...authHeader() } }
  );
  if (!res.ok) throw new Error("Erreur récupération utilisateur");
  return res.json();
}

export async function updateUser(id, data) {
  const res = await fetch(`${BASE_URL}/api/users/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { ...authHeader(), ...JSON_HEADERS },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erreur PUT utilisateur");
  return res.json();
}

export async function deleteUser(id) {
  const res = await fetch(`${BASE_URL}/api/users/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error("Erreur DELETE utilisateur");
  return true;
}
