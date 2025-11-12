import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { TextInput } from "../components/TextInput";
import { createEmployee } from "../api/users";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    firstname: "",
    email: "",
    password: "",
    date: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ok, setOk] = useState(null);

  useEffect(() => {
    let user = null;
    try {
      const raw = localStorage.getItem("user");
      if (raw) user = JSON.parse(raw);
    } catch {}
    if (!user || user.role !== "manager") {
      navigate("/employe");
    }
  }, [navigate]);

  function bind(key) {
    return {
      value: form[key],
      onChange: (e) => setForm((f) => ({ ...f, [key]: e.target.value })),
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOk(null);

    if (!form.email || !form.password || !form.firstname || !form.name) {
      setLoading(false);
      setError("Champs requis manquants.");
      return;
    }

    try {
      const data = await createEmployee({
        name: form.name.trim(),
        firstname: form.firstname.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        date: form.date || null,
      });

      setOk("Employé créé avec succès.");

      setTimeout(() => navigate("/home"), 800);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="h-full flex flex-col items-center justify-center bg-neutral-100 dark:bg-neutral-950">
      <div className="bg-neutral-200 dark:bg-neutral-900 rounded-2xl p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
          Créer un compte
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <TextInput
            type="text"
            placeholder="Nom"
            className="rounded-lg p-2"
            {...bind("name")}
          />
          <TextInput
            type="text"
            placeholder="Prénom"
            className="rounded-lg p-2"
            {...bind("firstname")}
          />
          <TextInput
            type="email"
            placeholder="Email"
            className="rounded-lg p-2"
            {...bind("email")}
          />
          <TextInput
            type="password"
            placeholder="Mot de passe"
            className="rounded-lg p-2"
            {...bind("password")}
          />
          <TextInput
            type="date"
            placeholder="Date"
            className="rounded-lg p-2"
            {...bind("date")}
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {ok && <p className="text-green-600 text-sm">{ok}</p>}

          <Button type="submit" disabled={loading} className="rounded-lg p-2">
            {loading ? "Création..." : "S'inscrire"}
          </Button>
        </form>
      </div>
    </div>
  );
}
