import { twMerge } from "tailwind-merge";

export function TextInput({ type, className, value, onChange, placeholder }) {
  return (
    <input
      className={twMerge(
        "bg-neutral-300 dark:bg-neutral-800",
        "h-12 p-4 gap-2 flex rounded-md",
        "font-medium text-base cursor-text",
        "focus:outline-1 outline-primary dark:outline-secondary hover:opacity-80",
        className
      )}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}
