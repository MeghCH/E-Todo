import { useNavigate } from "react-router-dom";
import { Button } from "./Button";

export default function ButtonUserInfo() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/users/view");
  };

  return (
    <Button onClick={handleClick} className="px-3">
      Info utilisateur
    </Button>
  );
}
