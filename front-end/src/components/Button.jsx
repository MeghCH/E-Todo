import { twMerge } from "tailwind-merge";

export function Button({ children, className, onClick }) {
  return (
    <button
      className={twMerge(
        "bg-primary text-secondary dark:bg-secondary dark:text-primary",
        "h-12 p-2 gap-2 hover:opacity-80 flex items-center justify-center rounded-md",
        "font-bold text-base cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
