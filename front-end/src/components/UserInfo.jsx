import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getCurrentUser } from "../api/users";

export default function UserInfo() {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await getCurrentUser();
        setUser(data);
      } catch {
        setError(t("userInfo.error"));
      }
    })();
  }, []);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!user) return <p>{t("common.loading")}</p>;

  return (
    <div className="size-full p-6 rounded-2xl bg-neutral-200 dark:bg-neutral-900 shadow-md">
      <h2 className="font-semibold text-lg text-center mb-3">
        {t("userInfo.title")}
      </h2>

      <div className="flex flex-col gap-2 text-sm">
        <p>
          <strong>{t("userInfo.name")} </strong>{" "}
          {user?.name ?? t("common.dash")}
        </p>
        <p>
          <strong>{t("userInfo.firstname")} </strong>{" "}
          {user?.firstname ?? t("common.dash")}
        </p>
        <p>
          <strong>{t("userInfo.email")} </strong>{" "}
          {user?.email ?? t("common.dash")}
        </p>
        <p>
          <strong>{t("userInfo.id")} </strong> {user?.id ?? t("common.dash")}
        </p>
      </div>
    </div>
  );
}
