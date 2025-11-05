import { useEffect, useState, useMemo } from "react";

function loadSessions() {
  try {
    return JSON.parse(localStorage.getItem("tt_sessions")) || [];
  } catch {
    return [];
  }
}

function saveSessions(sessions) {
  localStorage.setItem("tt_sessions", JSON.stringify(sessions));
  window.dispatchEvent(new Event("tt:sessions-updated"));
}

function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(
    s
  ).padStart(2, "0")}`;
}

function toCSV(rows) {
  const header = ["Début", "Fin", "Durée (hh:mm:ss)", "Durée (ms)", "Note"];
  const lines = rows.map((r) => [
    new Date(r.start).toISOString(),
    new Date(r.end).toISOString(),
    formatDuration(r.durationMs),
    r.durationMs,
    (r.note || "").replaceAll('"', '""'),
  ]);
  const csv = [header, ...lines]
    .map((cols) => cols.map((v) => `"${String(v)}"`).join(","))
    .join("\n");
  return csv;
}

export default function TimeHistory() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    setSessions(loadSessions().sort((a, b) => b.end - a.end));
    const onUpdate = () => {
      setSessions(loadSessions().sort((a, b) => b.end - a.end));
    };
    window.addEventListener("tt:sessions-updated", onUpdate);
    return () => window.removeEventListener("tt:sessions-updated", onUpdate);
  }, []);

  const totalMs = useMemo(
    () => sessions.reduce((sum, s) => sum + (s.durationMs || 0), 0),
    [sessions]
  );

  const handleDelete = (id) => {
    const next = sessions.filter((s) => s.id !== id);
    setSessions(next);
    saveSessions(next);
  };

  const handleClear = () => {
    setSessions([]);
    saveSessions([]);
  };

  const handleExport = () => {
    const csv = toCSV(sessions);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `timetracker_export_${new Date()
      .toISOString()
      .slice(0, 19)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-3xl bg-white/80 backdrop-blur rounded-2xl border border-gray-200 shadow p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold text-gray-800">Historique</h2>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="px-3 py-1.5 text-sm bg-gray-800 text-white rounded-md hover:bg-black transition"
          >
            Export CSV
          </button>
          <button
            onClick={handleClear}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition"
          >
            Vider
          </button>
        </div>
      </div>

      <div className="text-sm text-gray-600 mb-4">
        Total: <span className="font-semibold">{formatDuration(totalMs)}</span>
      </div>

      {sessions.length === 0 ? (
        <p className="text-gray-500 text-sm">
          Aucune session enregistrée pour le moment.
        </p>
      ) : (
        <ul className="divide-y divide-gray-200 max-h-96 overflow-auto pr-1">
          {sessions.map((s) => (
            <li
              key={s.id}
              className="py-3 flex items-start justify-between gap-3"
            >
              <div>
                <div className="text-gray-900 font-medium">
                  {formatDuration(s.durationMs)}
                </div>
                <div className="text-gray-600">
                  {new Date(s.start).toLocaleString("fr-FR")} →{" "}
                  {new Date(s.end).toLocaleString("fr-FR")}
                </div>
                {s.note && (
                  <div className="text-gray-700 mt-1">
                    <span className="text-xs uppercase tracking-wide text-gray-500">
                      Note:&nbsp;
                    </span>
                    {s.note}
                  </div>
                )}
              </div>

              <button
                onClick={() => handleDelete(s.id)}
                className="text-xs px-2 py-1 border border-red-300 text-red-600 rounded-md hover:bg-red-50"
              >
                Supprimer
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
