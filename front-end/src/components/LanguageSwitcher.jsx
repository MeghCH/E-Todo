import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <select
      value={i18n.language}
      onChange={(e) => i18n.changeLanguage(e.target.value)}
      className="p-2 rounded"
    >
      <option value="fr">🇫🇷 Fr</option>
      <option value="en">🇬🇧 En</option>
      <option value="de">🇩🇪 De</option>
      <option value="es">🇪🇸 Es</option>
    </select>
  );
}
