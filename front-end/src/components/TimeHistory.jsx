import { useEffect, useState, useMemo } from "react";
import { Button } from "./Button";
import { RiDeleteBinFill } from "@remixicon/react";
import { getTimeHistory, deleteSession, clearAllSessions } from "../api/timer";
import { useTranslation } from "react-i18next";

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
  const totalSeconds = Math.floor((ms || 0) / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(
    s
  ).padStart(2, "0")}`;
}

function toCSV(rows, t) {
  const header = [
    t("timeHistory.start"),
    t("timeHistory.end"),
    t("timeHistory.durationFull"),
    t("timeHistory.durationMs"),
    t("timeHistory.note"),
  ];
  const lines = rows.map((r) => [
    r.start ? new Date(r.start).toISOString() : "",
    r.end ? new Date(r.end).toISOString() : "",
    formatDuration(r.durationMs),
    r.durationMs ?? "",
    (r.note || "").replaceAll('"', '""'),
  ]);
  return [header, ...lines]
    .map((cols) => cols.map((v) => `"${String(v)}"`).join(","))
    .join("\n");
}

export default function TimeHistory() {
  const { t, i18n } = useTranslation();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);

  const sortByEndDesc = (arr) =>
    [...arr].sort((a, b) => (b.end ?? 0) - (a.end ?? 0));

  useEffect(() => {
    setSessions(sortByEndDesc(loadSessions()));

    const onUpdate = () => setSessions(sortByEndDesc(loadSessions()));
    window.addEventListener("tt:sessions-updated", onUpdate);

    (async () => {
      try {
        setLoading(true);
        const server = await getTimeHistory();
        if (Array.isArray(server)) {
          saveSessions(server);
          setSessions(sortByEndDesc(server));
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

  const formatLocaleDate = (date, part) => {
    if (!date) return "-";
    return new Date(date).toLocaleString(i18n.language, {
      ...(part === "date"
        ? { weekday: "short", month: "short", day: "numeric" }
        : { hour: "2-digit", minute: "2-digit" }),
    });
  };

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
      alert(t("timeHistory.deleteServerError"));
    }
  };

  const handleClear = async () => {
    const ok = window.confirm(t("timeHistory.confirmClear"));
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
      alert(t("timeHistory.clearServerError"));
    }
  };

  const handleExport = () => {
    const csv = toCSV(sessions, t);
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
          {t("timeHistory.title")} {loading ? t("timeHistory.sync") : ""}
        </h2>
        <p className="text-base font-mono flex gap-2 items-center">
          <span className="text-sm opacity-25 flex-1">
            {t("timeHistory.total")}
          </span>
          {formatDuration(totalMs)}
        </p>
      </div>

      {sessions.length === 0 ? (
        <p className="text-sm">{t("timeHistory.noSessions")}</p>
      ) : (
        <ul className="flex flex-col gap-0.5 w-full">
          {sessions.map((s) => (
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
                  title={t("timeHistory.delete")}
                  aria-label={t("timeHistory.delete")}
                >
                  <RiDeleteBinFill size={14} />
                </Button>
              </div>

              <div className="flex w-full flex-col text-sm mt-2">
                <p className="flex w-full items-center gap-4">
                  <span className="opacity-50 capitalize">
                    {formatLocaleDate(s.start, "date")}
                  </span>
                  <span className="font-mono">
                    {formatLocaleDate(s.start, "time")}
                  </span>
                </p>
                <p className="flex w-full items-center gap-4">
                  <span className="opacity-50 capitalize">
                    {formatLocaleDate(s.end, "date")}
                  </span>
                  <span className="font-mono">
                    {formatLocaleDate(s.end, "time")}
                  </span>
                </p>
              </div>

              {s.note && (
                <div className="mt-2 text-xs opacity-50">
                  {t("timeHistory.note")}: {s.note}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="w-full flex gap-2 items-center">
        <Button
          onClick={handleExport}
          className="flex-1 bg-neutral-300 dark:bg-neutral-600 text-neutral-600 dark:text-neutral-300"
        >
          {t("timeHistory.export")}
        </Button>
        <Button onClick={handleClear}>{t("timeHistory.clear")}</Button>
      </div>
    </div>
  );
}
