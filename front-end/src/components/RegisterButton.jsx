import { useNavigate } from "react-router-dom";
import { Button } from "./Button";

export default function RegisterButton() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/register");
  };

  return (
    <Button onClick={handleClick} className="px-3">
      Ajouter un employer
    </Button>
  );
}
