import { useEffect, useState } from "react";
import { RiEyeFill, RiEyeOffFill } from "@remixicon/react";
import { useTranslation } from "react-i18next";

export default function ButtonDaltonien() {
  const { t } = useTranslation();
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
      className="size-12 hover:opacity-80 flex justify-center items-center rounded-lg bg-neutral-300 dark:bg-neutral-800 text-neutral-900 dark:text-white cursor-pointer"
      title={t("daltonien.title")}
      aria-pressed={isActive}
      aria-label={isActive ? t("daltonien.disable") : t("daltonien.enable")}
    >
      {isActive ? <RiEyeOffFill size={22} /> : <RiEyeFill size={22} />}
    </button>
  );
}
