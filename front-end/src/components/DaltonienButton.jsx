import { RiEyeFill } from "@remixicon/react";
import { useEffect, useState } from "react";

export default function DaltonienButton() {
  const [isActive, setIsActive] = useState(false);

  const handleChange = (newValue) => {
    document.body.classList.toggle("daltonien", newValue);
    localStorage.setItem("daltonienMode", newValue ? "true" : "false");
    setIsActive(newValue);
  };

  useEffect(() => {
    const saved = localStorage.getItem("daltonienMode");
    if (saved) {
      const savedIsActive = saved === "true";
      handleChange(savedIsActive);
    }
  }, []);

  return (
    <button
      onClick={() => handleChange(!isActive)}
      className="size-12 hover:opacity-80 flex justify-center items-center rounded-lg bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white cursor-pointer"
      title="Mode daltonien"
    >
      <RiEyeFill />
    </button>
  );
}
