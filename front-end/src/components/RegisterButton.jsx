import { useNavigate } from "react-router-dom";
import { Button } from "./Button";
import { RiUserAddLine } from "@remixicon/react";

export default function RegisterButton() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/register");
  };

  return (
    <Button
      onClick={handleClick}
      className="px-3 bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white cursor-pointer"
    >
      <RiUserAddLine size={24} />
    </Button>
  );
}
