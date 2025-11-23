import { useTranslation } from "react-i18next";
import { TextInput } from "./TextInput";
import { Button } from "./Button";
import { useTimer } from "../context/TimerContext";

function formatDuration(ms) {
  const totalSeconds = Math.floor((ms || 0) / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(
    s
  ).padStart(2, "0")}`;
}

function TimeTracker() {
  const { t } = useTranslation();

  const {
    isRunning,
    elapsedTime,
    note,
    setNote,
    handleStart,
    handleStop,
    handleReset,
  } = useTimer();

  return (
    <div className="flex flex-col items-start justify-start w-full gap-2">
      <h2 className="text-base text-neutral-500">{t("timeTracker.title")}</h2>

      <div className="w-full flex flex-wrap gap-2 items-start">
        <p className="text-lg font-mono p-3">{formatDuration(elapsedTime)}</p>

        <TextInput
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={t("timeTracker.placeholder")}
          className="flex-1 min-w-[200px]"
        />
      </div>

      <div className="flex justify-center gap-2 w-full">
        {!isRunning ? (
          <Button onClick={handleStart} className="flex-1">
            {t("timeTracker.start")}
          </Button>
        ) : (
          <Button
            onClick={handleStop}
            className="flex-1 bg-red-200 dark:bg-red-600 text-red-600 dark:text-red-200"
          >
            {t("timeTracker.stop")}
          </Button>
        )}

        <Button
          onClick={handleReset}
          className="flex-1 bg-neutral-300 dark:bg-neutral-600 text-neutral-600 dark:text-neutral-300"
        >
          {t("timeTracker.reset")}
        </Button>
      </div>
    </div>
  );
}

export default TimeTracker;
