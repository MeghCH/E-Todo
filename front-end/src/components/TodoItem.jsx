import { Button } from "./Button";
import { SelectArea } from "./SelectArea";
import { RiDeleteBinFill } from "@remixicon/react";

function formatDate(isoLike) {
  if (!isoLike) return "";
  try {
    const d = new Date(isoLike);
    return d.toLocaleDateString();
  } catch {
    return isoLike;
  }
}

const STATUS_LABELS = {
  not_started: "Non démarré",
  todo: "À faire",
  in_progress: "En cours",
  done: "Terminé",
};

function statusStyle(status) {
  switch (status) {
    case "done":
      return "bg-green-200 text-emerald-700 border-emerald-400";
    case "in_progress":
      return "bg-blue-200 text-blue-700 border-blue-400";
    case "todo":
      return "bg-amber-200 text-amber-700 border-amber-400";
    default:
      return "bg-gray-100 text-gray-700 border-gray-400";
  }
}

function TodoItem({ task, deleteTask, updateStatus }) {
  const overdue =
    task.due_time &&
    task.status !== "done" &&
    new Date(task.due_time) < new Date();

  return (
    <div
      className={`flex items-start justify-between gap-3 border rounded-md p-3 ${
        overdue ? "border-red-300" : "border-neutral-700"
      } bg-neutral-200 dark:bg-neutral-800`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="font-semibold">{task.title}</span>
          <span
            className={`px-2 py-0.5 rounded-lg border ${statusStyle(
              task.status
            )}`}
          >
            {STATUS_LABELS[task.status]}
          </span>
          <span
            className={`px-2 py-0.5 rounded-lg ${
              overdue
                ? "bg-red-50 text-red-700 border-red-200"
                : "bg-neutral-100 dark:bg-neutral-700"
            }`}
          >
            Échéance : {formatDate(task.due_time)}
          </span>
        </div>

        <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">
          {task.description}
        </p>

        <div className="mt-2 text-xs text-gray-500">
          Créée : {formatDate(task.created_at)}
        </div>
      </div>

      <div className="flex flex-col items-end gap-2 shrink-0">
        <SelectArea
          value={task.status}
          onChange={(e) => updateStatus(task.id, e.target.value)}
          className="rounded-md px-2 py-1 text-sm bg-neutral-300 dark:bg-neutral-700"
        >
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </SelectArea>

        <Button
          onClick={deleteTask}
          className="size-6 p-0 bg-red-200 dark:bg-red-600 text-red-600 dark:text-red-200"
          title="Supprimer"
        >
          <RiDeleteBinFill size={14} />
        </Button>
      </div>
    </div>
  );
}

export default TodoItem;
