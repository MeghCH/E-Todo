import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "../components/LoginForm";
import { login, logout } from "../api/auth";
import { useTranslation } from "react-i18next";

export function LoginPage() {
  const { t } = useTranslation();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit({ email, password }) {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const data = await login({ email, password });

      if (!data?.token) {
        throw new Error(t("loginPage.errors.missingToken"));
      }

      const me = data.user;
      if (!me) {
        throw new Error(t("loginPage.errors.missingUser"));
      }

      localStorage.setItem("access_token", data.token);
      localStorage.setItem("user", JSON.stringify(me));

      window.dispatchEvent(new Event("auth-changed"));

      const role = me.role;

      if (role === "manager") {
        navigate("/home", { replace: true });
      } else {
        navigate("/employe", { replace: true });
      }
    } catch (e) {
      logout?.();
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      window.dispatchEvent(new Event("auth-changed"));

      setError(e?.message || t("loginPage.errors.default"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="size-full flex flex-col items-center justify-center p-4">
      <LoginForm
        headline={t("loginPage.title")}
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
      />
    </div>
  );
}
