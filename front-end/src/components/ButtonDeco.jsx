import { useNavigate } from "react-router-dom";
import { Button } from "./Button";
import { useTranslation } from "react-i18next";

export default function ButtonDeco() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = () => {
    const ok = window.confirm(t("logout.confirm"));
    if (!ok) return;

    localStorage.removeItem("access_token");
    localStorage.removeItem("user");

    window.dispatchEvent(new Event("auth-changed"));

    navigate("/login", { replace: true });
  };

  return (
    <Button
      onClick={handleLogout}
      className="rounded-lg px-4 py-2 hover transition bg-red-200 dark:bg-red-600 text-red-600 dark:text-red-200"
    >
      {t("logout.button")}
    </Button>
  );
}
