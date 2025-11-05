import { useState, useEffect } from "react";

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
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, startTime]);

  const handleStart = () => {
    const now = Date.now();
    setIsRunning(true);
    setStartTime(now - elapsedTime);
  };

  const handleStop = () => {
    if (!isRunning || startTime == null) {
      setIsRunning(false);
      return;
    }
    const end = Date.now();
    const duration = end - startTime;

    const sessions = loadSessions();
    sessions.push({
      id:
        crypto.randomUUID?.() ||
        `${end}-${Math.random().toString(36).slice(2)}`,
      start: startTime,
      end,
      durationMs: duration,
      note: note.trim() || null,
    });
    saveSessions(sessions);

    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setElapsedTime(0);
    setStartTime(null);
  };

  return (
    <div className="flex items-start justify-start">
      <div className="shadow-md rounded-2xl p-6 text-center border border-orange-200 bg-white/80 backdrop-blur">
        <h1 className="text-2xl font-bold text-orange-500 mb-4 drop-shadow-sm">
          Pointeuse
        </h1>

        <p className="text-5xl font-mono text-gray-800 mb-6">
          {formatDuration(elapsedTime)}
        </p>

        <div className="mb-6">
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Note / Tâche / Projet (optionnel)"
            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        <div className="flex justify-center gap-3">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="px-5 py-2 bg-green-500 text-white font-semibold rounded-md shadow hover:bg-green-600 transition"
            >
              Commencer
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="px-5 py-2 bg-red-500 text-white font-semibold rounded-md shadow hover:bg-red-600 transition"
            >
              Arrêter & Enregistrer
            </button>
          )}

          <button
            onClick={handleReset}
            className="px-5 py-2 border border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-100 transition"
          >
            Réinitialiser
          </button>
        </div>
      </div>
    </div>
  );
}

export default TimeTracker;
