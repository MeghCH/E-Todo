import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark-mode", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <button
      onClick={() => setDark((v) => !v)}
      className="px-3 py-2 rounded-lg bg-[var(--card)] text-[var(--text)] border border-white/10 hover:opacity-90 transition"
      title="Basculer le thème"
    >
      {dark ? "Clair" : "Sombre"}
    </button>
  );
}
