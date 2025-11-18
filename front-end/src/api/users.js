const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";
const JSON_HEADERS = { "Content-Type": "application/json" };

function authHeader() {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function readError(res, defaultMsg) {
  const text = await res.text().catch(() => null);
  try {
    const json = text ? JSON.parse(text) : null;
    throw new Error(json?.msg || defaultMsg);
  } catch {
    throw new Error(text || defaultMsg);
  }
}

function isNumeric(str) {
  return typeof str === "string" && /^\d+$/.test(str.trim());
}
function isEmail(str) {
  return typeof str === "string" && /\S+@\S+\.\S+/.test(str.trim());
}

export async function getCurrentUser() {
  const res = await fetch(`${BASE_URL}/user`, { headers: { ...authHeader() } });
  if (!res.ok) return readError(res, "Erreur GET /user");
  return res.json();
}

export async function getMyTodos() {
  const res = await fetch(`${BASE_URL}/user/todos`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) return readError(res, "Erreur GET /user/todos");
  return res.json();
}

export async function createEmployee(payload) {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({
      name: payload.name,
      firstname: payload.firstname,
      email: payload.email,
      password: payload.password,
      role: payload.role,
    }),
  });
  if (!res.ok) return readError(res, "Échec de création de l'employé.");
  return res.json();
}

export async function getUserByIdOrEmail(identifier) {
  const id = String(identifier ?? "").trim();
  if (!isNumeric(id) && !isEmail(id)) {
    throw new Error("Saisir un ID numérique ou un email valide.");
  }
  const res = await fetch(`${BASE_URL}/users/${encodeURIComponent(id)}`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) return readError(res, "Erreur récupération utilisateur");
  return res.json();
}

export async function getUser(id) {
  return getUserByIdOrEmail(String(id));
}

export async function updateUser(id, data) {
  const payload = {
    email: data.email,
    password: data.password ?? "",
    name: data.name,
    firstname: data.firstname,
    currentPassword: data.currentPassword,
  };

  if (
    payload.email == null ||
    payload.name == null ||
    payload.firstname == null ||
    payload.password == null
  ) {
    throw new Error("email, password, name et firstname sont requis.");
  }

  if (!payload.currentPassword || !payload.currentPassword.trim()) {
    throw new Error("Le mot de passe actuel est requis.");
  }

  const res = await fetch(`${BASE_URL}/users/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { ...authHeader(), ...JSON_HEADERS },
    body: JSON.stringify(payload),
  });

  if (!res.ok) return readError(res, "Erreur PUT utilisateur");
  return res.json();
}

export async function deleteUser(id) {
  const res = await fetch(`${BASE_URL}/users/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { ...authHeader() },
  });
  if (!res.ok) return readError(res, "Erreur DELETE utilisateur");
  return true;
}
