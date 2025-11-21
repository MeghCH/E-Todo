import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import TodoItem from "./TodoItem";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Button } from "./Button";
import { TextInput } from "./TextInput";
import { SelectArea } from "./SelectArea";

import { listTodos, createTodo, deleteTodo, updateTodo } from "../api/todos";

const STATUSES = ["not_started", "todo", "in_progress", "done"];

const STATUS_TO_DB = {
  not_started: "not started",
  todo: "todo",
  in_progress: "in progress",
  done: "done",
};

const STATUS_FROM_DB = {
  "not started": "not_started",
  todo: "todo",
  "in progress": "in_progress",
  done: "done",
};

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const isValidDate = (s) => DATE_RE.test(s);
const cmpDate = (a, b) => (a || "").localeCompare(b || "");
const getValue = (v) => (typeof v === "string" ? v : v?.target?.value ?? "");

export default function TodoList() {
  const { t } = useTranslation();

  const [todos, setTodos] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [status, setStatus] = useState("not_started");

  const [sortBy, setSortBy] = useState("manual");
  const [errorKey, setErrorKey] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await listTodos();

        const normalized = data.map((t) => ({
          ...t,
          status: STATUS_FROM_DB[t.status] ?? "not_started",
        }));

        setTodos(normalized);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const handleAdd = async () => {
    setErrorKey(null);

    if (!title.trim() || !description.trim() || !createdAt || !dueTime) {
      setErrorKey("todo.errors.required");
      return;
    }
    if (!isValidDate(createdAt)) {
      setErrorKey("todo.errors.createdAt");
      return;
    }
    if (!isValidDate(dueTime)) {
      setErrorKey("todo.errors.dueTime");
      return;
    }
    if (cmpDate(dueTime, createdAt) < 0) {
      setErrorKey("todo.errors.dueBeforeCreate");
      return;
    }

    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        created_at: createdAt,
        due_time: dueTime || null,
        status: STATUS_TO_DB[status] ?? "not started",
      };

      const newTodoFromApi = await createTodo(payload);

      const normalized = {
        ...newTodoFromApi,
        status: STATUS_FROM_DB[newTodoFromApi.status] ?? "not_started",
      };

      setTodos((prev) => [...prev, normalized]);
      setTitle("");
      setDescription("");
      setCreatedAt("");
      setDueTime("");
      setStatus("not_started");
    } catch (e) {
      console.error(e);
      setErrorKey("todo.errors.create");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateStatus = async (id, nextStatus) => {
    try {
      const updatedFromApi = await updateTodo(id, {
        status: STATUS_TO_DB[nextStatus] ?? "not_started",
      });

      const normalized = {
        ...updatedFromApi,
        status: STATUS_FROM_DB[updatedFromApi.status] ?? "not_started",
      };

      setTodos((prev) => prev.map((t) => (t.id === id ? normalized : t)));
    } catch (e) {
      console.error(e);
    }
  };

  const displayTodos = useMemo(() => {
    if (sortBy === "manual") return todos;
    const copy = [...todos];
    if (sortBy === "due_time") {
      copy.sort((a, b) => cmpDate(a.due_time, b.due_time));
    } else if (sortBy === "status") {
      const order = { not_started: 0, todo: 1, in_progress: 2, done: 3 };
      copy.sort((a, b) => (order[a.status] ?? 99) - (order[b.status] ?? 99));
    }
    return copy;
  }, [todos, sortBy]);

  function handleOnDragEnd(result) {
    if (!result.destination || sortBy !== "manual") return;
    const newItems = Array.from(todos);
    const [moved] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, moved);
    setTodos(newItems);
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <h2 className="text-base text-neutral-500">{t("todo.title")}</h2>

      <div className="bg-neutral-200 dark:bg-neutral-900 p-1 rounded-lg">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 flex flex-col gap-2">
            <TextInput
              value={title}
              onChange={(v) => setTitle(getValue(v))}
              placeholder={t("todo.fields.title")}
              className="rounded-md px-3 py-2"
            />

            <TextInput
              value={description}
              onChange={(v) => setDescription(getValue(v))}
              placeholder={t("todo.fields.description")}
              className="rounded-md px-3 py-2 bg-white dark:bg-neutral-800 outline-none"
            />

            <div className="flex flex-col sm:flex-row gap-2">
              <TextInput
                type="date"
                value={createdAt}
                onChange={(v) => setCreatedAt(getValue(v))}
                className="rounded-md px-3 py-2 flex-1"
                aria-label={t("todo.fields.createdAt")}
              />

              <TextInput
                type="date"
                value={dueTime}
                onChange={(v) => setDueTime(getValue(v))}
                className="rounded-md px-3 py-2 flex-1"
                aria-label={t("todo.fields.dueTime")}
              />

              <SelectArea
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="rounded-md px-3 py-2 cursor-pointer"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {t(`todo.status.${s}`)}
                  </option>
                ))}
              </SelectArea>
            </div>
          </div>
        </div>

        {errorKey && <p className="text-red-600 text-sm mt-2">{t(errorKey)}</p>}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="text-sm text-gray-500">{t("todo.sortLabel")}</label>
        <SelectArea
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded-md px-3 py-1.5 w-full sm:w-auto"
        >
          <option value="manual">{t("todo.sort.manual")}</option>
          <option value="due_time">{t("todo.sort.due_time")}</option>
          <option value="status">{t("todo.sort.status")}</option>
        </SelectArea>
        <Button
          onClick={handleAdd}
          className="px-4 py-2 w-full sm:w-auto sm:self-end"
        >
          {t("todo.add")}
        </Button>
      </div>

      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="todos">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex flex-col gap-2"
            >
              {displayTodos.map((task, index) => (
                <Draggable
                  key={task.id}
                  draggableId={String(task.id)}
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
                        deleteTask={() => handleDelete(task.id)}
                        updateStatus={handleUpdateStatus}
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
