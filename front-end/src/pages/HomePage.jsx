import TimeTracker from "../components/TimeTracker";
import TimeHistory from "../components/TimeHistory";
import TodoList from "../components/TodoList";

export function HomePage() {
  return (
    <div className="size-full flex p-2 gap-2">
      <div className="h-full flex flex-col items-start justify-start gap-4 rounded-2xl bg-neutral-200 dark:bg-neutral-900 w-96 p-4 overflow-auto">
        <TimeTracker />
        <div className="min-h-px bg-neutral-900 dark:bg-neutral-100 opacity-5 w-full" />
        <TimeHistory />
      </div>

      <div className="h-full flex-1 flex flex-col justify-start items-center bg-neutral-200 dark:bg-neutral-900 rounded-2xl p-4 overflow-auto">
        <TodoList />
      </div>
    </div>
  );
}
