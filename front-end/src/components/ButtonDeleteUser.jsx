import { deleteUser } from "../api/users";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "./Button";

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
      className="bg-red-600 text-white rounded px-4 py-2 hover:bg-red-700"
    >
      Supprimer l’utilisateur
    </Button>
  );
}

export default ButtonDeleteUser;
