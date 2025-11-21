import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { TextInput } from "../components/TextInput";
import { createEmployee } from "../api/users";
import { SelectArea } from "../components/SelectArea";
import { useTranslation } from "react-i18next";

export default function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    firstname: "",
    email: "",
    password: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ok, setOk] = useState(null);

  const bind = (k) => ({
    value: form[k],
    onChange: (e) => setForm((f) => ({ ...f, [k]: e.target.value })),
  });

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);
    setOk(null);

    if (
      !form.email ||
      !form.password ||
      !form.firstname ||
      !form.name ||
      !form.role
    ) {
      setLoading(false);
      setError(t("register.errors.missingFields"));
      return;
    }

    try {
      await createEmployee({
        name: form.name.trim(),
        firstname: form.firstname.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: form.role,
      });

      setOk(t("register.success"));
      setTimeout(() => navigate("/home", { replace: true }), 800);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-full flex flex-col items-center justify-center bg-neutral-100 dark:bg-neutral-950">
      <div className="bg-neutral-200 dark:bg-neutral-900 rounded-2xl p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-4">{t("register.title")}</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <TextInput
            type="text"
            placeholder={t("register.name")}
            {...bind("name")}
            required
          />
          <TextInput
            type="text"
            placeholder={t("register.firstname")}
            {...bind("firstname")}
            required
          />
          <TextInput
            type="email"
            placeholder={t("register.email")}
            autoComplete="off"
            {...bind("email")}
            required
          />
          <TextInput
            type="password"
            placeholder={t("register.password")}
            autoComplete="new-password"
            {...bind("password")}
            required
          />

          <SelectArea {...bind("role")} required>
            <option value="">{t("register.selectRole")}</option>
            <option value="employe">{t("register.roles.employe")}</option>
            <option value="manager">{t("register.roles.manager")}</option>
          </SelectArea>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {ok && <p className="text-green-600 text-sm">{ok}</p>}

          <Button type="submit" disabled={loading}>
            {loading ? t("register.loading") : t("register.submit")}
          </Button>
        </form>
      </div>
    </div>
  );
}
