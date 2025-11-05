import TodoList from "../components/TodoList";
import TimeTracker from "../components/Timetracker";
import TimeHistory from "../components/TimeHistory";
import RegisterButton from "../components/RegisterButton";
import WeatherWidget from "../components/WeatherWidget";
import ThemeToggle from "../components/ThemeToggle";

export function HomePage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col items-center justify-center">
      <div className="fixed top-4 right-4">
        <ThemeToggle />
      </div>

      <h1 className="text-6xl mb-6">Bonjour</h1>

      <div className="rounded-xl p-4 bg-[var(--card)] shadow mb-6">
        <p className="text-[var(--muted)]">Hello thème 👋</p>
      </div>

      <div className="flex w-full max-w-5xl gap-6">
        <div className="flex flex-col items-start gap-4">
          <div className="scale-75">
            <TimeTracker />
          </div>
          <TimeHistory />
          <RegisterButton />
          <WeatherWidget />
        </div>

        <div className="flex-1 flex justify-end items-center pr-4">
          <TodoList />
        </div>
      </div>
    </div>
  );
}
