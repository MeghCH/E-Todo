const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

function authHeader() {
  const t = localStorage.getItem("access_token");
  return t ? { Authorization: `Bearer ${t}` } : {};
}

function handleError(res, fallbackMsg) {
  return res
    .json()
    .catch(() => null)
    .then((err) => {
      const msg = err?.msg || err?.message || fallbackMsg;
      throw new Error(msg);
    });
}

function handleAuthFailure(status) {
  if (status === 401 || status === 403) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
  }
}

export async function startTimer(data) {
  const res = await fetch(`${BASE_URL}/timer/start`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(data ?? {}),
  });

  if (!res.ok) {
    handleAuthFailure(res.status);
    return handleError(res, "Erreur lors du démarrage du timer");
  }

  return res.json();
}

export async function stopTimer() {
  const res = await fetch(`${BASE_URL}/timer/stop`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
  });

  if (!res.ok) {
    handleAuthFailure(res.status);
    return handleError(res, "Erreur lors de l'arrêt du timer");
  }

  return res.json();
}

export async function getTimeHistory() {
  const res = await fetch(`${BASE_URL}/timer`, {
    headers: { ...authHeader() },
  });

  if (!res.ok) {
    handleAuthFailure(res.status);
    return handleError(res, "Erreur historique timer");
  }

  return res.json();
}

export async function deleteSession(id) {
  const res = await fetch(`${BASE_URL}/timer/${encodeURIComponent(id)}`, {
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
  const res = await fetch(`${BASE_URL}/timer`, {
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
  const res = await fetch(`${BASE_URL}/timer/all`, {
    headers: { ...authHeader() },
  });

  if (!res.ok) {
    handleAuthFailure(res.status);
    return handleError(res, "Erreur récupération historique complet");
  }

  return res.json();
}
