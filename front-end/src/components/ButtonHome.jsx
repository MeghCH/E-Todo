import { useNavigate } from "react-router-dom";
import { RiHome3Line } from "@remixicon/react";
import { useTranslation } from "react-i18next";

export default function ButtonHome() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  let user = null;
  try {
    const raw = localStorage.getItem("user");
    if (raw) user = JSON.parse(raw);
  } catch {
    user = null;
  }

  const goHome = () => {
    if (user?.role === "manager") {
      navigate("/home");
    } else if (user?.role === "employe") {
      navigate("/employe");
    } else {
      navigate("/login");
    }
  };

  return (
    <button
      onClick={goHome}
      className="size-12 hover:opacity-80 flex justify-center items-center rounded-lg bg-neutral-300 dark:bg-neutral-800 text-neutral-900 dark:text-white cursor-pointer"
      title={t("home.title")}
    >
      <RiHome3Line size={24} />
    </button>
  );
}
