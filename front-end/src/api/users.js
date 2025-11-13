const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

const JSON_HEADERS = { "Content-Type": "application/json" };

function authHeader() {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleError(res, defaultMsg) {
  const text = await res.text().catch(() => null);

  try {
    const json = text ? JSON.parse(text) : null;
    const msg = json?.msg || defaultMsg;
    throw new Error(msg);
  } catch {
    throw new Error(text || defaultMsg);
  }
}

// PUBLIC

export async function login(credentials) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(credentials),
  });

  if (!res.ok) {
    return handleError(res, "Erreur login");
  }

  const data = await res.json();
  if (data?.token) localStorage.setItem("access_token", data.token);
  if (data?.user) localStorage.setItem("user", JSON.stringify(data.user));
  return data;
}

// PROTEGE

export async function getMe() {
  const res = await fetch(`${BASE_URL}/user`, {
    headers: { ...authHeader() },
  });

  if (!res.ok) {
    return handleError(res, "Erreur GET /user");
  }

  return res.json();
}

export async function getMyTodos() {
  const res = await fetch(`${BASE_URL}/user/todos`, {
    headers: { ...authHeader() },
  });

  if (!res.ok) {
    return handleError(res, "Erreur GET /user/todos");
  }

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
    }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.msg || "Échec de création de l'employé.");
  }

  return data;
}

export async function getUser(id) {
  const res = await fetch(`${BASE_URL}/users/${encodeURIComponent(id)}`, {
    headers: { ...authHeader() },
  });

  if (!res.ok) {
    return handleError(res, "Erreur GET utilisateur");
  }

  return res.json();
}

export async function getUserByIdOrEmail(idOrEmail) {
  const res = await fetch(
    `${BASE_URL}/users/${encodeURIComponent(idOrEmail)}`,
    { headers: { ...authHeader() } }
  );

  if (!res.ok) {
    return handleError(res, "Erreur récupération utilisateur");
  }

  return res.json();
}

export async function updateUser(id, data) {
  const res = await fetch(`${BASE_URL}/users/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { ...authHeader(), ...JSON_HEADERS },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    return handleError(res, "Erreur PUT utilisateur");
  }

  return res.json();
}

export async function deleteUser(id) {
  const res = await fetch(`${BASE_URL}/users/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { ...authHeader() },
  });

  if (!res.ok) {
    return handleError(res, "Erreur DELETE utilisateur");
  }

  return true;
}
