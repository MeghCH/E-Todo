import { deleteUser } from "../api/users";
import { useNavigate } from "react-router-dom";
import { Button } from "./Button";
import { RiDeleteBinFill } from "@remixicon/react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";

function ButtonDeleteUser() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const onDelete = async () => {
    if (!currentUser?.id) {
      alert(t("deleteUser.error"));
      return;
    }

    const ok = window.confirm(t("deleteUser.confirm"));
    if (!ok) return;

    try {
      await deleteUser(currentUser.id);
      logout();
      navigate("/login");
    } catch (e) {
      console.error(e);
      alert(t("deleteUser.error"));
    }
  };

  if (!currentUser) return null;

  return (
    <Button
      onClick={onDelete}
      className="rounded px-4 py-2 bg-red-200 dark:bg-red-600 text-red-600 dark:text-red-200"
      title={t("deleteUser.tooltip")}
    >
      <RiDeleteBinFill /> {t("deleteUser.button")}
    </Button>
  );
}

export default ButtonDeleteUser;
