import { useTranslation } from "react-i18next";
import { SelectArea } from "./SelectArea";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <SelectArea
      value={i18n.language}
      onChange={(e) => i18n.changeLanguage(e.target.value)}
      className="p-2 rounded-lg bg-neutral-300 dark:bg-neutral-800 text-neutral-900 dark:text-white cursor-pointer"
    >
      <option value="fr">🇫🇷 Fr</option>
      <option value="en">🇬🇧 En</option>
      <option value="de">🇩🇪 De</option>
      <option value="es">🇪🇸 Es</option>
    </SelectArea>
  );
}
