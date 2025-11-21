import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getCurrentUser, updateUser } from "../api/users";
import { Button } from "./Button";
import { TextInput } from "./TextInput";
import ButtonDeleteUser from "./ButtonDeleteUser";

export default function UserEdit() {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [msgKey, setMsgKey] = useState(null);
  const [msgType, setMsgType] = useState(null);
  const [loading, setLoading] = useState(true);

  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await getCurrentUser();
        setUser({
          id: data.id,
          firstname: data.firstname,
          name: data.name,
          email: data.email,
        });
      } catch {
        setMsgKey("userEdit.loadError");
        setMsgType("error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleUpdate = async () => {
    if (!user?.id) return;
    setMsgKey(null);
    setMsgType(null);

    if (!currentPassword.trim()) {
      setMsgKey("userEdit.mustEnterCurrentPassword");
      setMsgType("error");
      return;
    }

    try {
      const updated = await updateUser(user.id, {
        firstname: user.firstname.trim(),
        name: user.name.trim(),
        email: user.email.trim().toLowerCase(),
        password: newPassword.trim(),
        currentPassword: currentPassword.trim(),
      });

      setUser({
        id: updated.id,
        firstname: updated.firstname,
        name: updated.name,
        email: updated.email,
      });
      setNewPassword("");
      setCurrentPassword("");
      localStorage.setItem("user", JSON.stringify(updated));
      setMsgKey("userEdit.updateSuccess");
      setMsgType("success");
    } catch (err) {
      console.error(err);
      setMsgKey("userEdit.updateError");
      setMsgType("error");
    }
  };

  if (loading) return <p className="p-4">{t("userEdit.loading")}</p>;
  if (!user && msgKey) return <p className="p-4 text-red-600">{t(msgKey)}</p>;

  return (
    <div className="size-full max-w-md mx-auto p-6 flex flex-col gap-3 bg-neutral-200 dark:bg-neutral-900 rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-2 text-center">
        {t("userEdit.title")}
      </h2>

      <TextInput
        type="text"
        value={user?.name ?? ""}
        onChange={(e) => setUser({ ...user, name: e.target.value })}
        placeholder={t("userEdit.namePlaceholder")}
      />

      <TextInput
        type="text"
        value={user?.firstname ?? ""}
        onChange={(e) => setUser({ ...user, firstname: e.target.value })}
        placeholder={t("userEdit.firstnamePlaceholder")}
      />

      <TextInput
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder={t("userEdit.newPasswordPlaceholder")}
      />

      <TextInput
        type="email"
        value={user?.email ?? ""}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
        placeholder={t("userEdit.emailPlaceholder")}
      />

      <TextInput
        type="password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        placeholder={t("userEdit.currentPasswordPlaceholder")}
      />

      <Button onClick={handleUpdate} className="rounded px-4 py-2 mt-2">
        {t("userEdit.submit")}
      </Button>

      <ButtonDeleteUser>{t("userEdit.deleteAccount")}</ButtonDeleteUser>

      {msgKey && (
        <p
          className={`mt-2 text-sm ${
            msgType === "error" ? "text-red-500" : "text-green-600"
          }`}
        >
          {t(msgKey)}
        </p>
      )}
    </div>
  );
}
