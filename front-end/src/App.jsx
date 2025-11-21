import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { EmployeHomePage } from "./pages/EmployeHomePage";
import RegisterPage from "./pages/RegisterPage";
import ThemeToggle from "./components/ThemeToggle";
import ColorSwitch from "./components/ColorSwitch";
import RegisterButton from "./components/RegisterButton";
import WeatherWidget from "./components/WeatherWidget";
import UserInfoPage from "./pages/UserInfoPage";
import ButtonDeco from "./components/ButtonDeco";
import ButtonUserInfo from "./components/ButtonUserInfo";
import ButtonHome from "./components/ButtonHome";
import PrivateRoutes from "./components/PrivateRoutes";
import ManagerRoutes from "./components/ManagerRoutes";
import { useEffect, useMemo, useState } from "react";
import { getCurrentUser } from "./api/users";
import ButtonDaltonien from "./components/ButtonDaltonien";
import LanguageSwitcher from "./components/LanguageSwitcher";

function Layout() {
  const location = useLocation();

  const isLoginPage = location.pathname === "/login";

  const readUserFromStorage = () => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  };

  const [me, setMe] = useState(() => readUserFromStorage());

  useEffect(() => {
    const ensureMe = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setMe(null);
        return;
      }
      if (!me) {
        try {
          const user = await getCurrentUser();
          localStorage.setItem("user", JSON.stringify(user));
          setMe(user);
        } catch {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
          setMe(null);
        }
      }
    };
    ensureMe();
  }, []);

  useEffect(() => {
    const syncFromStorage = () => {
      const u = readUserFromStorage();
      setMe(u);
    };

    window.addEventListener("storage", syncFromStorage);
    window.addEventListener("auth-changed", syncFromStorage);

    return () => {
      window.removeEventListener("storage", syncFromStorage);
      window.removeEventListener("auth-changed", syncFromStorage);
    };
  }, []);

  const isManager = useMemo(() => me?.role === "manager", [me]);

  return (
    <div className="font-inter bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-white w-full h-screen overflow-auto lg:overflow-hidden">
      <div className="fixed top-2 right-2 flex gap-1">
        <ThemeToggle />
        <ButtonDaltonien />
        <LanguageSwitcher />
        <ColorSwitch className="flex [@media(max-width:750px)]:hidden" />
        {!isLoginPage && <ButtonDeco />}
      </div>

      <div className="fixed top-2 left-2 flex gap-1">
        {!isLoginPage && <ButtonHome />}
        {!isLoginPage && <ButtonUserInfo />}
        {isManager && <RegisterButton />}
        <div className="hidden lg:block">
          <WeatherWidget />
        </div>
      </div>

      <div className="pt-14 size-full">
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />

          <Route
            path="/home"
            element={
              <PrivateRoutes>
                <ManagerRoutes>
                  <HomePage />
                </ManagerRoutes>
              </PrivateRoutes>
            }
          />
          <Route
            path="/employe"
            element={
              <PrivateRoutes>
                <EmployeHomePage />
              </PrivateRoutes>
            }
          />
          <Route
            path="/users/view"
            element={
              <PrivateRoutes>
                <UserInfoPage />
              </PrivateRoutes>
            }
          />

          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/register"
            element={
              <PrivateRoutes>
                <ManagerRoutes>
                  <RegisterPage />
                </ManagerRoutes>
              </PrivateRoutes>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return <Layout />;
}
