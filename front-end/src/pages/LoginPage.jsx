import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "../components/LoginForm";
import { login } from "../api/auth";

export function LoginPage() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit({ email, password }) {
    setLoading(true);
    setError(null);
    try {
      const data = await login({ email, password });

      if (data.token) {
        localStorage.setItem("access_token", data.token);
      }

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      const role = data.user?.role;
      if (role === "manager") {
        navigate("/home");
      } else {
        navigate("/employe"); 
      }
    } catch (e) {
      setError(e?.message || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="size-full flex flex-col items-center justify-center p-4">
      <LoginForm
        headline="LOG IN"
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
      />
    </div>
  );
}
