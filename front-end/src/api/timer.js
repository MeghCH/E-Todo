const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function authHeader() {
  const t = localStorage.getItem("access_token");
  return t ? { Authorization: `Bearer ${t}` } : {};
}

function handleError(res, fallbackMsg) {
  return res
    .json()
    .catch(() => null)
    .then((err) => {
      const msg = err?.message || fallbackMsg;
      throw new Error(msg);
    });
}

function handleAuthFailure(status) {
  if (status === 401 || status === 403) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
  }
}

export async function startTimer(note) {
  const res = await fetch(`${BASE_URL}/api/timer/start`, {
    method: "POST",
    headers: { ...authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify({ note }),
  });
  if (!res.ok) {
    handleAuthFailure(res.status);
    return handleError(res, "Erreur démarrage timer");
  }
  return res.json();
}

export async function stopTimer() {
  const res = await fetch(`${BASE_URL}/api/timer/stop`, {
    method: "POST",
    headers: { ...authHeader() },
  });
  if (!res.ok) {
    handleAuthFailure(res.status);
    return handleError(res, "Erreur arrêt timer");
  }
  return res.json();
}

export async function getTimeHistory() {
  const res = await fetch(`${BASE_URL}/api/timer`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) {
    handleAuthFailure(res.status);
    return handleError(res, "Erreur historique timer");
  }
  return res.json();
}

export async function deleteSession(id) {
  const res = await fetch(`${BASE_URL}/api/timer/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { ...authHeader() },
  });
  if (!res.ok) {
    handleAuthFailure(res.status);
    return handleError(res, "Erreur suppression session");
  }
  return true;
}

export async function clearAllSessions() {
  const res = await fetch(`${BASE_URL}/api/timer`, {
    method: "DELETE",
    headers: { ...authHeader() },
  });
  if (!res.ok) {
    handleAuthFailure(res.status);
    return handleError(res, "Erreur vidage sessions");
  }
  return true;
}

export async function getAllTimeHistories() {
  const res = await fetch(`${BASE_URL}/api/timer/all`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) {
    handleAuthFailure(res.status);
    return handleError(res, "Erreur récupération historique complet");
  }
  return res.json();
}
