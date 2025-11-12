import TimeTracker from "../components/TimeTracker";
import TimeHistory from "../components/TimeHistory";
import TodoList from "../components/TodoList";

export function EmployeHomePage() {
  return (
    <div className="size-full p-2 gap-2 flex flex-col lg:flex-row">
      <div
        className="
          h-auto lg:h-full lg:shrink-0
          flex flex-col items-start justify-start gap-4
          rounded-2xl bg-neutral-200 dark:bg-neutral-900
          w-full lg:w-96 p-4 overflow-auto
        "
      >
        <TimeTracker />
        <div className="min-h-px bg-neutral-900 dark:bg-neutral-100 opacity-5 w-full" />
        <TimeHistory />
      </div>

      <div
        className="
          h-auto lg:h-full
          w-full lg:flex-1
          flex flex-col justify-start items-center
          bg-neutral-200 dark:bg-neutral-900
          rounded-2xl p-4 overflow-auto
        "
      >
        <TodoList />
      </div>
    </div>
  );
}
