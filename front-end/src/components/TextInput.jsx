import { twMerge } from "tailwind-merge";

export function TextInput({ className, type = "text", ...props }) {
  return (
    <input
      type={type}
      {...props}
      className={twMerge(
        "bg-neutral-300 dark:bg-neutral-800",
        "h-12 p-4 gap-2 flex rounded-md",
        "font-medium text-base cursor-text",
        "focus:outline-1 outline-primary dark:outline-secondary hover:opacity-80",
        className
      )}
    />
  );
}
