import { createContext, useState, useEffect, useContext } from "react";
import { startTimer, stopTimer, getTimeHistory } from "../api/timer";

const TimerContext = createContext();

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

export function TimerProvider({ children }) {
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
    if (isRunning && startTime != null) {
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
      const res = await startTimer({ note: note.trim() || null });

      if (res?.start) {
        setStartTime(res.start);
        setElapsedTime(Date.now() - res.start);
      }
    } catch {}
  };

  const handleStop = async () => {
    if (!isRunning || startTime == null) {
      setIsRunning(false);
      return;
    }
    setIsRunning(false);

    try {
      await stopTimer();
      const server = await getTimeHistory();
      saveSessions(server);
    } catch {}
  };

  const handleReset = () => {
    setIsRunning(false);
    setElapsedTime(0);
    setStartTime(null);
  };

  return (
    <TimerContext.Provider
      value={{
        isRunning,
        startTime,
        elapsedTime,
        note,
        setNote,
        handleStart,
        handleStop,
        handleReset,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  return useContext(TimerContext);
}
