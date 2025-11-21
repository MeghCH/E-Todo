import { deleteUser } from "../api/users";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "./Button";
import { RiDeleteBinFill } from "@remixicon/react";
import { useTranslation } from "react-i18next";

function ButtonDeleteUser() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const onDelete = async () => {
    const ok = window.confirm(t("deleteUser.confirm"));
    if (!ok) return;
    try {
      await deleteUser(id);
      navigate("/");
    } catch (e) {
      console.error(e);
      alert(t("deleteUser.error"));
    }
  };

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
