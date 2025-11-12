import { useNavigate } from "react-router-dom";
import { Button } from "./Button";

export default function ButtonDeco() {
  const navigate = useNavigate();

  const handleLogout = () => {
    const ok = window.confirm("Voulez-vous vraiment vous déconnecter ?");
    if (!ok) return;

    localStorage.removeItem("access_token");
    localStorage.removeItem("user");

    navigate("/login", { replace: true });
  };

  return (
    <Button
      onClick={handleLogout}
      className="rounded px-4 py-2 hover transition"
    >
      Se déconnecter
    </Button>
  );
}
