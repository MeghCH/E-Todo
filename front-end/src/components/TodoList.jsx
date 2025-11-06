import { useState, useMemo } from "react";
import TodoItem from "./TodoItem";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Button } from "./Button";
import { TextInput } from "./TextInput";
import { SelectArea } from "./SelectArea";

const PRIORITIES = [
  { value: "high", label: "Haute" },
  { value: "medium", label: "Moyenne" },
  { value: "low", label: "Faible" },
];

function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [due, setDue] = useState("");
  const [priority, setPriority] = useState("medium");
  const [sortBy, setSortBy] = useState("manual");

  function addTask() {
    const trimmed = text.trim();
    if (!trimmed) return;

    const newTask = {
      id: String(Date.now()),
      text: trimmed,
      completed: false,
      due: due || null,
      priority,
      createdAt: Date.now(),
    };

    setTasks((prev) => [...prev, newTask]);
    setText("");
    setDue("");
    setPriority("medium");
  }

  function deleteTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function toggleCompleted(id) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  const displayTasks = useMemo(() => {
    if (sortBy === "manual") return tasks;

    const copy = [...tasks];
    if (sortBy === "date") {
      copy.sort((a, b) => {
        if (!a.due && !b.due) return 0;
        if (!a.due) return 1;
        if (!b.due) return -1;
        return new Date(a.due) - new Date(b.due);
      });
    } else if (sortBy === "priority") {
      const score = { high: 0, medium: 1, low: 2 };
      copy.sort((a, b) => score[a.priority] - score[b.priority]);
    }
    return copy;
  }, [tasks, sortBy]);

  function handleOnDragEnd(result) {
    if (!result.destination) return;
    if (sortBy !== "manual") return;

    const newTasks = Array.from(tasks);
    const [moved] = newTasks.splice(result.source.index, 1);
    newTasks.splice(result.destination.index, 0, moved);
    setTasks(newTasks);
  }

  return (
    <div className="flex flex-col items-start justify-start w-full gap-2">
      <h2 className="text-base text-neutral-500">Todo List</h2>

      <div className="flex flex-col md:flex-row gap-2 items-stretch md:items-end">
        <div className="flex-1 flex gap-2">
          <TextInput
            value={text}
            onChange={setText}
            placeholder="Nouvelle tâche…"
            className="flex-1 rounded-md px-3 py-2"
          />

          <TextInput
            type="date"
            value={due}
            onChange={setDue}
            className=" rounded-md px-3 py-2 cursor-pointer"
            aria-label="Date d'échéance"
          />
          <SelectArea
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="rounded-md px-3 py-2 cursor-pointer"
            aria-label="Priorité"
          >
            {PRIORITIES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </SelectArea>
        </div>
        <Button onClick={addTask} className="px-4 py-2">
          Ajouter
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <label className="text-sm text-gray-500">Tri :</label>
        <SelectArea
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded-md px-3 py-1.5"
        >
          <option value="manual">Manuel (Drag & Drop)</option>
          <option value="date">Par date</option>
          <option value="priority">Par priorité</option>
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
                  key={task.id}
                  draggableId={task.id}
                  index={index}
                  isDragDisabled={sortBy !== "manual"}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`p-2 rounded-md transition ${
                        snapshot.isDragging
                          ? "bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white cursor-pointer"
                          : "bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white cursor-pointer"
                      }`}
                    >
                      <TodoItem
                        task={task}
                        deleteTask={deleteTask}
                        toggleCompleted={toggleCompleted}
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
