import { twMerge } from "tailwind-merge";

export function SelectArea({
  className,
  value,
  onChange,
  placeholder,
  children,
  ...props
}) {
  return (
    <select
      {...props}
      className={twMerge(
        "bg-neutral-300 dark:bg-neutral-800",
        "h-12 p-4 gap-2 flex rounded-md",
        "font-medium text-base cursor-pointer",
        "focus:outline-1 outline-primary dark:outline-secondary hover:opacity-80",

        className
      )}
      aria-label={props["aria-label"] ?? placeholder ?? "Sélecteur"}
      value={value}
      onChange={onChange}
    >
      {children}
    </select>
  );
}
