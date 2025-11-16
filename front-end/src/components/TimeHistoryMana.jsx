import { useEffect, useState } from "react";
import { getAllTimeHistories } from "../api/timer";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function TimeHistoryMana() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <p>Chargement…</p>;
  if (!sessions.length) return <p>Aucune session trouvée.</p>;

  return (
    <div className="flex flex-col items-start justify-start w-full gap-2">
      <h1 className="text-base text-neutral-500">Historique des employés</h1>

      <div className="flex flex-col gap-3 w-full">
        {sessions.map((s) => (
          <div
            key={s.id}
            className="bg-neutral-300 dark:bg-neutral-800 p-4 rounded-lg flex flex-col"
          >
            <p className="text-sm text-neutral-500 mb-1">
              {s.userName ?? `Employé ${s.userId ?? "inconnu"}`}
            </p>
            <p className="font-mono">
              Début :{" "}
              {s.start ? format(new Date(s.start), "Pp", { locale: fr }) : "—"}
            </p>
            <p className="font-mono">
              Fin :{" "}
              {s.end ? format(new Date(s.end), "Pp", { locale: fr }) : "—"}
            </p>
            <p className="font-semibold">
              Durée :{" "}
              {typeof s.durationMs === "number"
                ? (s.durationMs / 60000).toFixed(1) + " min"
                : "—"}
            </p>
            {s.note && (
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                Note : {s.note}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
