import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { EmployeHomePage } from "./pages/EmployeHomePage";
import { RegisterPage } from "./pages/RegisterPage";
import { ThemeToggle } from "./components/ThemeToggle";
import { ColorSwitch } from "./components/ColorSwitch";
import { RegisterButton } from "./components/RegisterButton";
import { WeatherWidget } from "./components/WeatherWidget";

function Layout() {
  const location = useLocation();

  let user = null;
  try {
    const raw = localStorage.getItem("user");
    if (raw) user = JSON.parse(raw);
  } catch {
    user = null;
  }

  const isManager = user?.role === "manager";
  const isHomePage = location.pathname === "/home";

  return (
    <div className="bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-white w-full h-screen">
      <div className="fixed top-2 right-2 flex gap-1">
        <ThemeToggle />
        <ColorSwitch />
      </div>

      <div className="fixed top-2 left-2 flex gap-1">
        <WeatherWidget />

        {isManager && isHomePage ? <RegisterButton /> : null}
      </div>

      <div className="pt-14 size-full">
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/employe" element={<EmployeHomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
