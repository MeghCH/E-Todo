import { useState } from "react";
import { getUserByIdOrEmail } from "../api/users";
import { Button } from "./Button";
import { TextInput } from "./TextInput";

export default function ViewUserInfo() {
  const [query, setQuery] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setError("");
    setUser(null);
    try {
      const data = await getUserByIdOrEmail(query);
      setUser(data);
    } catch (err) {
      setError("Utilisateur introuvable.");
    }
  };

  return (
    <div className="flex flex-col gap-2 max-w-sm mx-auto mt-6 p-4 rounded-2xl bg-neutral-200 dark:bg-neutral-900 shadow-md">
      <h2 className="font-semibold text-lg text-center">
        Rechercher un utilisateur
      </h2>

      <TextInput
        type="text"
        placeholder="ID ou email"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button onClick={handleSearch} className="rounded px-4 py-2">
        Rechercher
      </Button>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {user && (
        <div className="mt-3 p-3 bg-neutral-100 dark:bg-neutral-900 rounded-2xl">
          <p>
            <strong>Prénom :</strong> {user.firstname}
          </p>
          <p>
            <strong>Nom :</strong> {user.lastname}
          </p>
          <p>
            <strong>Email :</strong> {user.email}
          </p>
        </div>
      )}
    </div>
  );
}
