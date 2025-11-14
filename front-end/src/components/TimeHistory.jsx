import { useEffect, useState, useMemo } from "react";
import { Button } from "./Button";
import { RiDeleteBinFill } from "@remixicon/react";

import { getTimeHistory, deleteSession, clearAllSessions } from "../api/timer";

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSessions(loadSessions().sort((a, b) => b.end - a.end));

    const onUpdate = () => {
      setSessions(loadSessions().sort((a, b) => b.end - a.end));
    };
    window.addEventListener("tt:sessions-updated", onUpdate);

    (async () => {
      try {
        setLoading(true);
        const server = await getTimeHistory();
        if (Array.isArray(server)) {
          saveSessions(server);
          setSessions(server.sort((a, b) => b.end - a.end));
        }
      } catch {
      } finally {
        setLoading(false);
      }
    })();

    return () => window.removeEventListener("tt:sessions-updated", onUpdate);
  }, []);

  const totalMs = useMemo(
    () => sessions.reduce((sum, s) => sum + (s.durationMs || 0), 0),
    [sessions]
  );

  const handleDelete = async (id) => {
    const prev = sessions;
    const next = sessions.filter((s) => s.id !== id);
    setSessions(next);
    saveSessions(next);

    try {
      await deleteSession(id);
    } catch (e) {
      console.error(e);

      setSessions(prev);
      saveSessions(prev);
      alert("Suppression côté serveur impossible.");
    }
  };

  const handleClear = async () => {
    const ok = window.confirm("Tout supprimer ?");
    if (!ok) return;

    const prev = sessions;
    setSessions([]);
    saveSessions([]);

    try {
      await clearAllSessions();
    } catch (e) {
      console.error(e);
      setSessions(prev);
      saveSessions(prev);
      alert("Vidage côté serveur impossible.");
    }
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
    <div className="flex flex-col items-start justify-start w-full gap-2">
      <div className="flex items-center justify-between w-full">
        <h2 className="text-base text-neutral-500">
          Historique {loading ? "· sync…" : ""}
        </h2>
        <p className="text-base font-mono flex gap-2 items-center">
          <span className="text-sm opacity-25 flex-1">Total</span>
          {formatDuration(totalMs)}
        </p>
      </div>

      {sessions.length === 0 ? (
        <p className="text-sm">Aucune session enregistrée pour le moment.</p>
      ) : (
        <ul className="flex flex-col gap-0.5 w-full">
          {sessions.map((s) => {
            const startTimeCode = new Date(s.start);
            const endTimeCode = new Date(s.end);

            const startDate = startTimeCode.toLocaleDateString("fr-FR", {
              weekday: "short",
              month: "short",
              day: "numeric",
            });
            const startTime = startTimeCode.toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            });
            const endDate = endTimeCode.toLocaleDateString("fr-FR", {
              weekday: "short",
              month: "short",
              day: "numeric",
            });
            const endTime = endTimeCode.toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            });
            return (
              <li
                key={s.id}
                className="bg-neutral-300 dark:bg-neutral-800 w-full p-2 rounded-md"
              >
                <div className="w-full flex justify-between">
                  <div className="text-base font-mono">
                    {formatDuration(s.durationMs)}
                  </div>
                  <Button
                    onClick={() => handleDelete(s.id)}
                    className="size-6 p-0 bg-red-200 dark:bg-red-600 text-red-600 dark:text-red-200"
                    title="Supprimer"
                  >
                    <RiDeleteBinFill size={14} />
                  </Button>
                </div>
                <div className="flex w-full flex-col text-sm mt-2">
                  <p className="flex w-full items-center gap-4">
                    <span className="opacity-50 capitalize">{startDate}</span>
                    <span className="font-mono">{startTime}</span>
                  </p>
                  <p className="flex w-full items-center gap-4">
                    <span className="opacity-50 capitalize">{endDate}</span>
                    <span className="font-mono">{endTime}</span>
                  </p>
                </div>
                {s.note && (
                  <div className="mt-2 text-xs opacity-50">{`Note: ${s.note}`}</div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <div className="w-full flex gap-2 items-center">
        <Button
          onClick={handleExport}
          className="flex-1 bg-neutral-300 dark:bg-neutral-600 text-neutral-600 dark:text-neutral-300"
        >
          Export CSV
        </Button>
        <Button onClick={handleClear}>Vider</Button>
      </div>
    </div>
  );
}
