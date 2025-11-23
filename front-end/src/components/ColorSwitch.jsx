import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

const COLORS = {
  blue: {
    name: "blue",
    primary: "#d6e3ff",
    secondary: "#2e57ff",
    class: "bg-[#2e57ff]",
  },
  green: {
    name: "green",
    primary: "#d3f7d0",
    secondary: "#4caf50",
    class: "bg-[#4caf50]",
  },
  orange: {
    name: "orange",
    primary: "#ffe8c7",
    secondary: "#ff7b1c",
    class: "bg-[#ff7b1c]",
  },
  pink: {
    name: "pink",
    primary: "#ffd6e5",
    secondary: "#ff3366",
    class: "bg-[#ff3366]",
  },
  purple: {
    name: "purple",
    primary: "#e4d6ff",
    secondary: "#9b30ff",
    class: "bg-[#9b30ff]",
  },
};

function ColorButton({ color, seleted, onChange }) {
  const handleColorChange = () => {
    document.documentElement.style.setProperty("--primary", color.primary);
    document.documentElement.style.setProperty("--secondary", color.secondary);
    localStorage.setItem("color", color.name);
    onChange(color.name);
  };

  return (
    <button
      onClick={handleColorChange}
      className={twMerge(
        `size-8 rounded-full ${color.class} cursor-pointer hover:opacity-80`,
        seleted ? "border-2 border-neutral-500" : ""
      )}
    />
  );
}

export default function ColorSwitch({ className }) {
  const [currentColor, setCurrentColor] = useState("blue");

  useEffect(() => {
    let saved = localStorage.getItem("color");
    if (saved === null) {
      saved = "blue";
    }
    document.documentElement.style.setProperty(
      "--primary",
      COLORS[saved].primary
    );
    document.documentElement.style.setProperty(
      "--secondary",
      COLORS[saved].secondary
    );
    setCurrentColor(saved);
  }, []);

  return (
    <div
      className={twMerge(
        "bg-neutral-300 dark:bg-neutral-800 rounded-lg flex px-3 gap-3 items-center justify-center",
        className
      )}
    >
      <ColorButton
        color={COLORS.blue}
        seleted={currentColor == "blue"}
        onChange={setCurrentColor}
      />
      <ColorButton
        color={COLORS.green}
        seleted={currentColor == "green"}
        onChange={setCurrentColor}
      />
      <ColorButton
        color={COLORS.orange}
        seleted={currentColor == "orange"}
        onChange={setCurrentColor}
      />
      <ColorButton
        color={COLORS.pink}
        seleted={currentColor == "pink"}
        onChange={setCurrentColor}
      />
      <ColorButton
        color={COLORS.purple}
        seleted={currentColor == "purple"}
        onChange={setCurrentColor}
      />
    </div>
  );
}
