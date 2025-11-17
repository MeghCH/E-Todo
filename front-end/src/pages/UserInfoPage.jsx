import UserInfo from "../components/UserInfo";
import UserEdit from "../components/UserEdit";

export default function UserInfoPage() {
  return (
    <div className="size-full p-4 gap-4 flex flex-col overflow-auto">
      <div className="w-full mx-auto max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl p-4">
        <UserInfo />
      </div>

      <div className="h-auto w-full flex flex-col justify-start items-center bg-neutral-100 dark:bg-neutral-950 rounded-2xl p-4">
        <UserEdit />
      </div>
    </div>
  );
}
