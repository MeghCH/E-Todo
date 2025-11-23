import { RiMoonFill, RiSunFill } from "@remixicon/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function ThemeToggle() {
  const { t } = useTranslation();
  const [isDark, setIsDark] = useState(false);

  const handleChange = (newValue) => {
    document.body.classList.toggle("dark", newValue);
    localStorage.setItem("theme", newValue ? "dark" : "light");
    setIsDark(newValue);
  };

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) {
      const savedIsDark = saved === "dark";
      handleChange(savedIsDark);
    } else {
      const prefer = window.matchMedia("(prefers-color-scheme: dark)").matches;
      handleChange(prefer);
    }
  }, []);

  return (
    <button
      onClick={() => handleChange(!isDark)}
      className="size-12 hover:opacity-80 flex justify-center items-center rounded-lg bg-neutral-300 dark:bg-neutral-800 text-neutral-900 dark:text-white cursor-pointer"
      title={t("themeToggle.title")}
    >
      {isDark ? <RiSunFill /> : <RiMoonFill />}
    </button>
  );
}
