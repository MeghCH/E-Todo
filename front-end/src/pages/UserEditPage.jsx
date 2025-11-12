import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUser, updateUser } from "../api/users";
import ButtonDeleteUser from "../components/ButtonDeleteUser";

export default function UserEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getUser(id);
        setUser(data);
      } catch (err) {
        console.error(err);
        setMessage("Erreur lors du chargement de l'utilisateur");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleUpdate = async () => {
    try {
      await updateUser(id, user);
      setMessage("Utilisateur mis à jour !");
    } catch (err) {
      console.error(err);
      setMessage("Erreur lors de la mise à jour");
    }
  };

  if (loading) return <p className="p-4">Chargement...</p>;
  if (!user) return <p className="p-4 text-red-600">{message}</p>;

  return (
    <div className="max-w-md mx-auto p-6 flex flex-col gap-3">
      <h2 className="text-xl font-semibold mb-2">
        Modifier l’utilisateur #{id}
      </h2>

      <input
        type="text"
        value={user.firstname}
        onChange={(e) => setUser({ ...user, firstname: e.target.value })}
        className="border rounded p-2"
        placeholder="Prénom"
      />
      <input
        type="text"
        value={user.name}
        onChange={(e) => setUser({ ...user, name: e.target.value })}
        className="border rounded p-2"
        placeholder="Nom"
      />
      <input
        type="email"
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
        className="border rounded p-2"
        placeholder="Email"
      />

      <button
        onClick={handleUpdate}
        className="bg-blue-600 text-white rounded px-4 py-2 mt-2 hover:bg-blue-700 transition"
      >
        Mettre à jour
      </button>

      <ButtonDeleteUser>Supprimer</ButtonDeleteUser>

      {message && <p className="text-gray-700 mt-2">{message}</p>}
    </div>
  );
}
