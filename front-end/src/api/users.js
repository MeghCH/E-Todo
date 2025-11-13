const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

const JSON_HEADERS = { "Content-Type": "application/json" };

function authHeader() {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// PUBLIC

export async function login(credentials) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(credentials),
  });
  if (!res.ok) throw new Error("Erreur login");
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
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: payload.name,
      firstname: payload.firstname,
      email: payload.email,
      password: payload.password,
      date: payload.date ?? null,
    }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.msg || "Échec de création de l'employé.");
  }

  return data;
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
