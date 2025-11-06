import { Button } from "./Button";

function formatDate(isoLike) {
  if (!isoLike) return null;
  try {
    const d = new Date(isoLike);

    return d.toLocaleDateString();
  } catch {
    return isoLike;
  }
}

function priorityStyles(priority) {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-700 border-red-300";
    case "low":
      return "bg-emerald-100 text-emerald-700 border-emerald-300";
    default:
      return "bg-amber-100 text-amber-700 border-amber-300";
  }
}

function TodoItem({ task, deleteTask, toggleCompleted }) {
  const overdue =
    task.due &&
    !task.completed &&
    new Date(task.due) < new Date(new Date().toDateString());

  return (
    <div
      className={`flex items-center justify-between gap-3 border rounded-md p-3 ${
        overdue ? "border-red-300" : "border-neutral-700"
      }`}
    >
      <div className="flex items-center gap-3 min-w-0 ">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => toggleCompleted(task.id)}
          className="w-4 h-4 accent-green-400 cursor-pointer focus:ring-2 focus:ring-green-200 rounded"
        />
        <div className="flex flex-col min-w-0">
          <span
            className={`truncate bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white cursor-pointer"
 ${task.completed ? "line-through text-gray-400" : "text-gray-800"}`}
          >
            {task.text}
          </span>
          <div className="flex items-center gap-2 text-sm">
            {task.due && (
              <span
                className={`px-2 py-0.5 rounded-full border ${
                  overdue
                    ? "bg-red-50 text-red-700 border-red-200"
                    : "bg-gray-50 text-gray-600 border-gray-200"
                }`}
              >
                Échéance : {formatDate(task.due)}
              </span>
            )}
            <span
              className={`px-2 py-0.5 rounded-full border ${priorityStyles(
                task.priority
              )}`}
            >
              Priorité :{" "}
              {task.priority === "high"
                ? "Haute"
                : task.priority === "low"
                ? "Faible"
                : "Moyenne"}
            </span>
          </div>
        </div>
      </div>

      <Button onClick={() => deleteTask(task.id)} className="px-3 py-2">
        Supprimer
      </Button>
    </div>
  );
}

export default TodoItem;
