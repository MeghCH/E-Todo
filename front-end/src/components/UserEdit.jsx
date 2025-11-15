import { useEffect, useState } from "react";
import { getCurrentUser, updateUser } from "../api/users";
import { Button } from "./Button";
import { TextInput } from "./TextInput";
import ButtonDeleteUser from "./ButtonDeleteUser";

export default function UserEdit() {
  const [user, setUser] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await getCurrentUser();

        setUser({
          id: data.id,
          firstname: data.firstname,
          name: data.name,
          email: data.email,
        });
      } catch {
        setMsg("Erreur lors du chargement du profil");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleUpdate = async () => {
    if (!user?.id) return;
    setMsg("");

    if (!currentPassword.trim()) {
      setMsg(
        "Veuillez entrer votre mot de passe actuel pour modifier vos informations."
      );
      return;
    }

    try {
      const updated = await updateUser(user.id, {
        firstname: user.firstname.trim(),
        name: user.name.trim(),
        email: user.email.trim().toLowerCase(),
        password: newPassword.trim(),
        currentPassword: currentPassword.trim(),
      });

      setUser({
        id: updated.id,
        firstname: updated.firstname,
        name: updated.name,
        email: updated.email,
      });
      setNewPassword("");
      setCurrentPassword("");
      localStorage.setItem("user", JSON.stringify(updated));
      setMsg("Profil mis à jour !");
    } catch (err) {
      console.error(err);
      setMsg("Erreur lors de la mise à jour : mot de passe incorrect ?");
    }
  };

  if (loading) return <p className="p-4">Chargement…</p>;
  if (!user) return <p className="p-4 text-red-600">{msg}</p>;

  return (
    <div className="size-full max-w-md mx-auto p-6 flex flex-col gap-3 bg-neutral-200 dark:bg-neutral-900 rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-2 text-center">
        Modifier mon profil
      </h2>

      <TextInput
        type="text"
        value={user.firstname}
        onChange={(e) => setUser({ ...user, firstname: e.target.value })}
        placeholder="Nom"
      />

      <TextInput
        type="text"
        value={user.name}
        onChange={(e) => setUser({ ...user, name: e.target.value })}
        placeholder="Prénom"
      />

      <TextInput
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="Nouveau mot de passe (optionnel)"
      />

      <TextInput
        type="email"
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
        placeholder="Email"
      />

      <TextInput
        type="password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        placeholder="Mot de passe actuel (obligatoire)"
      />

      <Button onClick={handleUpdate} className="rounded px-4 py-2 mt-2">
        Mettre à jour
      </Button>

      <ButtonDeleteUser>Supprimer mon compte</ButtonDeleteUser>

      {msg && (
        <p
          className={`mt-2 text-sm ${
            msg.includes("Erreur") ? "text-red-500" : "text-green-600"
          }`}
        >
          {msg}
        </p>
      )}
    </div>
  );
}
