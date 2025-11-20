import { useNavigate } from "react-router-dom";
import { Button } from "./Button";
import { RiInformationLine } from "@remixicon/react";

export default function ButtonUserInfo() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/users/view");
  };

  return (
    <Button
      onClick={handleClick}
      className="px-3 bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white cursor-pointer"
    >
      <RiInformationLine size={24} />
    </Button>
  );
}
