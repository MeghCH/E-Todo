import { deleteUser } from "../api/users";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "./Button";
import { RiDeleteBinFill } from "@remixicon/react";

function ButtonDeleteUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const onDelete = async () => {
    const ok = window.confirm("Supprimer définitivement cet utilisateur ?");
    if (!ok) return;
    try {
      await deleteUser(id);

      navigate("/");
    } catch (e) {
      console.error(e);
      alert("Suppression impossible.");
    }
  };

  return (
    <Button
      onClick={onDelete}
      className="rounded px-4 py-2 bg-red-200 dark:bg-red-600 text-red-600 dark:text-red-200"
      title="Supprimer l'utilisateur"
    >
      <RiDeleteBinFill /> Supprimer
    </Button>
  );
}

export default ButtonDeleteUser;
