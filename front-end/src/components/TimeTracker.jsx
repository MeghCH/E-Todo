import { useState, useEffect } from "react";
import { TextInput } from "./TextInput";
import { Button } from "./Button";
import { startTimer, stopTimer, getTimeHistory } from "../api/timer";

function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(
    s
  ).padStart(2, "0")}`;
}

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

function TimeTracker() {
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [note, setNote] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const server = await getTimeHistory();
        if (Array.isArray(server) && server.length) saveSessions(server);
      } catch {}
    })();
  }, []);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(
        () => setElapsedTime(Date.now() - startTime),
        1000
      );
    }
    return () => clearInterval(interval);
  }, [isRunning, startTime]);

  const handleStart = async () => {
    const now = Date.now();
    setIsRunning(true);
    setStartTime(now - elapsedTime);

    try {
      const res = await startTimer(note.trim() || null);

      if (res?.startedAt) {
        setStartTime(new Date(res.startedAt).getTime());
        setElapsedTime(Date.now() - new Date(res.startedAt).getTime());
      }
    } catch {}
  };

  const handleStop = async () => {
    if (!isRunning || startTime == null) {
      setIsRunning(false);
      return;
    }
    const end = Date.now();
    const duration = end - startTime;

    const sessions = loadSessions();
    const localSession = {
      id:
        crypto.randomUUID?.() ||
        `${end}-${Math.random().toString(36).slice(2)}`,
      start: startTime,
      end,
      durationMs: duration,
      note: note.trim() || null,
    };
    saveSessions([...sessions, localSession]);

    setIsRunning(false);

    try {
      const saved = await stopTimer();

      const updated = loadSessions().map((s) =>
        s.id === localSession.id ? saved : s
      );
      saveSessions(updated);
    } catch {}
  };

  const handleReset = () => {
    setIsRunning(false);
    setElapsedTime(0);
    setStartTime(null);
  };

  return (
    <div className="flex flex-col items-start justify-start w-full gap-2">
      <h2 className="text-base text-neutral-500">Pointeuse</h2>

      <div className="w-full flex gap-2 items-center">
        <p className="text-lg font-mono p-3">{formatDuration(elapsedTime)}</p>

        <TextInput
          value={note}
          onChange={setNote}
          placeholder="Note / Tâche / Projet"
          className="flex-1"
        />
      </div>

      <div className="flex justify-center gap-2 w-full">
        {!isRunning ? (
          <Button onClick={handleStart} className="flex-1">
            Commencer
          </Button>
        ) : (
          <Button
            onClick={handleStop}
            className="flex-1 bg-red-200 dark:bg-red-600 text-red-600 dark:text-red-200"
          >
            Enregistrer
          </Button>
        )}

        <Button
          onClick={handleReset}
          className="flex-1 bg-neutral-300 dark:bg-neutral-600 text-neutral-600 dark:text-neutral-300"
        >
          Réinitialiser
        </Button>
      </div>
    </div>
  );
}

export default TimeTracker;
