import { useState } from "react";

function TodoItem({ task, deleteTask, toggleCompleted }) {
  return (
    <div className="flex items-center gap-2 mb-1.5">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => toggleCompleted(task.id)}
      />
      <span className={task.completed ? "line-through" : ""}>{task.text}</span>
      <button
        className="font-bold text-white/80 w-20 h-7 bg-orange-400 rounded-sm"
        onClick={() => deleteTask(task.id)}
      >
        Supprimer
      </button>
    </div>
  );
}

function TodoList() {
  const [tasks, setTasks] = useState([]);

  const [text, setText] = useState("");

  function addTask(value) {
    const trimmed = value.trim();
    if (!trimmed) return;
    const newTask = { id: Date.now(), text: trimmed, completed: false };

    setTasks((prev) => [...prev, newTask]);
    setText("");
  }

  function deleteTask(id) {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }

  function toggleCompleted(id) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }

  return (
    <div className="todo-list">
      <div className="w-120 h-70 rounded-4xl shadow-lg flex flex-col gap-3 items-center justify-center bg-white">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
          {" "}
          ToDo List
        </h1>
        {tasks.map((task) => (
          <TodoItem
            key={task.id}
            task={task}
            deleteTask={deleteTask}
            toggleCompleted={toggleCompleted}
          />
        ))}

        <div className="mt-3">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Nouvelle tâche…"
          />
          <button onClick={() => addTask(text)}>Add</button>
        </div>
      </div>
    </div>
  );
}

export default TodoList;
