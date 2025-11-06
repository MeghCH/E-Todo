import { useState, useMemo } from "react";
import TodoItem from "./TodoItem";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Button } from "./Button";
import { TextInput } from "./TextInput";
import { SelectArea } from "./SelectArea";

const STATUSES = [
  { value: "not_started", label: "Non démarré" },
  { value: "todo", label: "À faire" },
  { value: "in_progress", label: "En cours" },
  { value: "done", label: "Terminé" },
];

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const isValidDate = (s) => DATE_RE.test(s);

const cmpDate = (a, b) => a.localeCompare(b);

const getValue = (v) => (typeof v === "string" ? v : v?.target?.value ?? "");

function TodoList() {
  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [status, setStatus] = useState("not_started");
  const [sortBy, setSortBy] = useState("manual");
  const [error, setError] = useState("");

  function addTask() {
    setError("");

    if (!title.trim() || !description.trim() || !createdAt || !dueTime) {
      setError("Tous les champs sont obligatoires.");
      return;
    }
    if (!isValidDate(createdAt)) {
      setError("La date de création est invalide (AAAA-MM-JJ).");
      return;
    }
    if (!isValidDate(dueTime)) {
      setError("La date d'échéance est invalide (AAAA-MM-JJ).");
      return;
    }
    if (cmpDate(dueTime, createdAt) < 0) {
      setError(
        "La date d'échéance doit être postérieure ou égale à la date de création."
      );
      return;
    }

    const newTask = {
      key: Math.random().toString(36).slice(2),
      title: title.trim(),
      description: description.trim(),
      created_at: createdAt,
      due_time: dueTime,
      status,
    };

    setTasks((prev) => [...prev, newTask]);
    setTitle("");
    setDescription("");
    setCreatedAt("");
    setDueTime("");
    setStatus("not_started");
  }

  
  function deleteTask(key) {
    setTasks((prev) => prev.filter((t) => t.key !== key));
  }

  function updateStatus(key, nextStatus) {
    setTasks((prev) =>
      prev.map((t) => (t.key === key ? { ...t, status: nextStatus } : t))
    );
  }

  const displayTasks = useMemo(() => {
    if (sortBy === "manual") return tasks;
    const copy = [...tasks];
    if (sortBy === "due_time") {
      copy.sort((a, b) => cmpDate(a.due_time ?? "", b.due_time ?? ""));
    } else if (sortBy === "status") {
      const order = { not_started: 0, todo: 1, in_progress: 2, done: 3 };
      copy.sort((a, b) => order[a.status] - order[b.status]);
    }
    return copy;
  }, [tasks, sortBy]);

  function handleOnDragEnd(result) {
    if (!result.destination || sortBy !== "manual") return;
    const newTasks = Array.from(tasks);
    const [moved] = newTasks.splice(result.source.index, 1);
    newTasks.splice(result.destination.index, 0, moved);
    setTasks(newTasks);
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <h2 className="text-base text-neutral-500">Todo List</h2>

      <div className="bg-neutral-200 dark:bg-neutral-900 p-4 rounded-lg">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 flex flex-col gap-2">
            <TextInput
              value={title}
              onChange={(v) => setTitle(getValue(v))}
              placeholder="Titre"
              className="rounded-md px-3 py-2"
            />

            <TextInput
              value={description}
              onChange={(v) => setDescription(getValue(v))}
              placeholder="Description"
              className="rounded-md px-3 py-2 bg-white dark:bg-neutral-800 outline-none"
            />

            <div className="flex flex-col sm:flex-row gap-2">
              <TextInput
                type="date"
                value={createdAt}
                onChange={(v) => setCreatedAt(getValue(v))}
                className="rounded-md px-3 py-2 flex-1"
                aria-label="Date de création"
              />

              <TextInput
                type="date"
                value={dueTime}
                onChange={(v) => setDueTime(getValue(v))}
                className="rounded-md px-3 py-2 flex-1"
                aria-label="Date d'échéance"
              />

              <SelectArea
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="rounded-md px-3 py-2 cursor-pointer"
              >
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </SelectArea>
            </div>
          </div>

          <Button onClick={addTask} className="px-4 py-2 self-end">
            Ajouter
          </Button>
        </div>

        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </div>

      <div className="flex items-center gap-3">
        <label className="text-sm text-gray-500">Trier par :</label>
        <SelectArea
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded-md px-3 py-1.5"
        >
          <option value="manual">Manuel (Drag & Drop)</option>
          <option value="due_time">Date d'échéance</option>
          <option value="status">Statut</option>
        </SelectArea>
      </div>

      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex flex-col gap-2"
            >
              {displayTasks.map((task, index) => (
                <Draggable
                  key={task.key}
                  draggableId={task.key}
                  index={index}
                  isDragDisabled={sortBy !== "manual"}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <TodoItem
                        task={task}
                        deleteTask={() => deleteTask(task.key)}
                        updateStatus={(next) => updateStatus(task.key, next)}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default TodoList;
