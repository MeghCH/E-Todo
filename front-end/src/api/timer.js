const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

function authHeader() {
  const t = localStorage.getItem("access_token");
  return t ? { Authorization: `Bearer ${t}` } : {};
}

function handleAuthFailure(status) {
  if (status === 401 || status === 403) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
  }
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

function normalizeSession(row) {
  return {
    id: row.id,
    userId: row.user_id ?? row.userId ?? null,
    userName:
      row.userName ??
      (row.firstname && row.name ? `${row.firstname} ${row.name}` : null),
    start:
      row.start ?? (row.start_time ? new Date(row.start_time).getTime() : null),
    end: row.end ?? (row.end_time ? new Date(row.end_time).getTime() : null),
    durationMs:
      typeof row.durationMs === "number"
        ? row.durationMs
        : typeof row.duration === "number"
        ? row.duration * 1000
        : null,
    note: row.note ?? null,
  };
}

function normalizeArray(rows) {
  return Array.isArray(rows) ? rows.map(normalizeSession) : [];
}

export async function startTimer(data) {
  const body = data && typeof data === "object" ? data : { note: data ?? null };

  const res = await fetch(`${BASE_URL}/timer/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    handleAuthFailure(res.status);
    return readError(res, "Erreur lors du démarrage du timer");
  }

  const raw = await res.json();
  return normalizeSession(raw);
}

export async function stopTimer() {
  const res = await fetch(`${BASE_URL}/timer/stop`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
  });

  if (!res.ok) {
    handleAuthFailure(res.status);
    return readError(res, "Erreur lors de l'arrêt du timer");
  }

  const raw = await res.json();
  return normalizeSession(raw);
}

export async function getTimeHistory() {
  const res = await fetch(`${BASE_URL}/timer`, {
    headers: { ...authHeader() },
  });

  if (!res.ok) {
    handleAuthFailure(res.status);
    return readError(res, "Erreur historique timer");
  }

  const raw = await res.json();
  return normalizeArray(raw);
}

export async function deleteSession(id) {
  const res = await fetch(`${BASE_URL}/timer/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { ...authHeader() },
  });

  if (!res.ok) {
    handleAuthFailure(res.status);
    return readError(res, "Erreur suppression session");
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
    return readError(res, "Erreur vidage sessions");
  }

  return true;
}

export async function getAllTimeHistories() {
  const res = await fetch(`${BASE_URL}/timer/all`, {
    headers: { ...authHeader() },
  });

  if (!res.ok) {
    // handleAuthFailure(res.status);
    return readError(res, "Erreur récupération historique complet");
  }

  const raw = await res.json();
  return normalizeArray(raw);
}
