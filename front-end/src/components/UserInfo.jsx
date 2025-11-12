import { useState } from "react";
import { getUserByIdOrEmail } from "../api/users";

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
    <div className="flex flex-col gap-2 max-w-sm mx-auto mt-6 p-4 border rounded">
      <h2 className="font-semibold text-lg">Rechercher un utilisateur</h2>

      <input
        type="text"
        placeholder="ID ou email"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border rounded p-2"
      />
      <button
        onClick={handleSearch}
        className="bg-blue-600 text-white rounded px-4 py-2"
      >
        Rechercher
      </button>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {user && (
        <div className="mt-3 p-3 bg-gray-100 rounded">
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
