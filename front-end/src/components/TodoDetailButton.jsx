import { useState } from "react";
import { getTodo } from "../api/todos";

export default function TodoDetailsButton({ id }) {
  const [todo, setTodo] = useState(null);

  const handleView = async () => {
    try {
      const data = await getTodo(id);
      setTodo(data);
      console.log("Todo récupérée :", data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <button onClick={handleView} className="bg-gray-300 px-2 py-1 rounded">
        Voir la tâche
      </button>

      {todo && (
        <div className="mt-3 border p-2 rounded bg-gray-100">
          <h3 className="font-bold">{todo.title}</h3>
          <p>{todo.description}</p>
          <p>Échéance : {todo.due_time}</p>
          <p>Statut : {todo.status}</p>
        </div>
      )}
    </div>
  );
}
