import { useNavigate } from "react-router-dom";
import { RiInformationLine } from "@remixicon/react";
import { useTranslation } from "react-i18next";

export default function ButtonUserInfo() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/users/view");
  };

  return (
    <button
      onClick={handleClick}
      className="size-12 hover:opacity-80 flex justify-center items-center rounded-lg bg-neutral-300 dark:bg-neutral-800 text-neutral-900 dark:text-white cursor-pointer"
      title={t("buttonUserInfo.title")}
    >
      <RiInformationLine size={24} />
    </button>
  );
}
