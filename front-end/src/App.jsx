import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { EmployeHomePage } from "./pages/EmployeHomePage";
import { Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import ThemeToggle from "./components/ThemeToggle";
import ColorSwitch from "./components/ColorSwitch";
import RegisterButton from "./components/RegisterButton";
import WeatherWidget from "./components/WeatherWidget";

function App() {
  const isAdmin = true;

  return (
    <div className="bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-white w-full h-screen flex flex-col">
      <div className="fixed top-2 right-2 flex gap-1">
        <ThemeToggle />
        <ColorSwitch />
      </div>
      <div className="fixed top-2 left-2 flex gap-1">
        <WeatherWidget />
        {isAdmin ? <RegisterButton /> : null}
      </div>

      <div className="pt-14 size-full">
        <Routes>
          <Route path="/" element={<HomePage isAdmin={isAdmin} />} />
          <Route path="/employe" element={<EmployeHomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
