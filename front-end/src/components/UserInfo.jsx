import { useEffect, useState } from "react";
import { getCurrentUser } from "../api/users";

export default function UserInfo() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await getCurrentUser();
        setUser(data);
      } catch {
        setError("Impossible de récupérer vos informations.");
      }
    })();
  }, []);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!user) return <p>Chargement…</p>;

  return (
    <div className="p-6 rounded-2xl bg-neutral-200 dark:bg-neutral-900 shadow-md">
      <h2 className="font-semibold text-lg text-center mb-3">
        Mes informations
      </h2>

      <div className="flex flex-col gap-2 text-sm">
        <p>
          <strong>Nom :</strong> {user.name ?? "—"}
        </p>
        <p>
          <strong>Prénom :</strong> {user.firstname ?? "—"}
        </p>
        <p>
          <strong>Email :</strong> {user.email ?? "—"}
        </p>
        <p>
          <strong>ID :</strong> {user.id ?? "—"}
        </p>
      </div>
    </div>
  );
}
