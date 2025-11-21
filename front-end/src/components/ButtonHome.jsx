import { useNavigate } from "react-router-dom";
import { Button } from "./Button";
import { RiHome3Line } from "@remixicon/react";

export default function ButtonHome() {
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
    <Button
      onClick={goHome}
      className="px-3 bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white cursor-pointer"
    >
      <RiHome3Line size={24} />
    </Button>
  );
}
