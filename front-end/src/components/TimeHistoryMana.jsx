import { useEffect, useState } from "react";
import { getAllTimeHistories } from "../api/timer";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { fr, enUS, de, es } from "date-fns/locale";

function formatDuration(ms) {
  const totalSeconds = Math.floor((ms || 0) / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(
    s
  ).padStart(2, "0")}`;
}

export default function TimeHistoryMana() {
  const { t, i18n } = useTranslation();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const localeMap = { fr, en: enUS, de, es };

  useEffect(() => {
    (async () => {
      try {
        const data = await getAllTimeHistories();
        setSessions(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p>{t("timeHistoryMana.loading")}</p>;
  if (!sessions.length) return <p>{t("timeHistoryMana.noData")}</p>;

  return (
    <div className="flex flex-col items-start justify-start w-full gap-2">
      <h1 className="text-base text-neutral-500">
        {t("timeHistoryMana.title")}
      </h1>

      <div className="flex flex-col gap-3 w-full">
        {sessions.map((s) => (
          <div
            key={s.id}
            className="bg-neutral-300 dark:bg-neutral-800 p-4 rounded-lg flex flex-col"
          >
            <p className="text-sm text-neutral-500 mb-1">
              {s.userName ??
                `${t("timeHistoryMana.employee")} ${
                  s.userId ?? t("timeHistoryMana.unknown")
                }`}
            </p>

            <p className="font-mono">
              {t("timeHistoryMana.start")} :{" "}
              {s.start
                ? format(new Date(s.start), "Pp", {
                    locale: localeMap[i18n.language] || fr,
                  })
                : t("timeHistoryMana.none")}
            </p>

            <p className="font-mono">
              {t("timeHistoryMana.end")} :{" "}
              {s.end
                ? format(new Date(s.end), "Pp", {
                    locale: localeMap[i18n.language] || fr,
                  })
                : t("timeHistoryMana.none")}
            </p>

            <p className="font-semibold">
              {t("timeHistoryMana.duration")} :{" "}
              {typeof s.durationMs === "number"
                ? formatDuration(s.durationMs)
                : t("timeHistoryMana.none")}
            </p>

            {s.note && (
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                {t("timeHistoryMana.note")} : {s.note}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
