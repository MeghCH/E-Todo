const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";
const JSON_HEADERS = { "Content-Type": "application/json" };

function authHeader() {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function readError(res, fallback) {
  const txt = await res.text().catch(() => null);
  try {
    const json = txt ? JSON.parse(txt) : null;
    throw new Error(json?.msg || fallback);
  } catch {
    throw new Error(txt || fallback);
  }
}

export async function listTodos() {
  const r = await fetch(`${BASE_URL}/todos`, { headers: { ...authHeader() } });
  if (!r.ok) return readError(r, "Erreur listTodos");
  return r.json();
}

export async function getTodo(id) {
  const r = await fetch(`${BASE_URL}/todos/${encodeURIComponent(id)}`, {
    headers: { ...authHeader() },
  });
  if (!r.ok) return readError(r, "Erreur getTodo");
  return r.json();
}

export async function createTodo(payload) {
  const r = await fetch(`${BASE_URL}/todos`, {
    method: "POST",
    headers: { ...authHeader(), ...JSON_HEADERS },
    body: JSON.stringify(payload),
  });
  if (!r.ok) return readError(r, "Erreur createTodo");
  return r.json();
}

export async function updateTodo(id, updatedFields) {
  const r = await fetch(`${BASE_URL}/todos/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { ...authHeader(), ...JSON_HEADERS },
    body: JSON.stringify(updatedFields),
  });
  if (!r.ok) return readError(r, "Erreur updateTodo");
  return r.json();
}

export async function deleteTodo(id) {
  const r = await fetch(`${BASE_URL}/todos/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { ...authHeader() },
  });
  if (!r.ok) return readError(r, "Erreur deleteTodo");
  return true;
}
