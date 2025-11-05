function TodoItem({ task, deleteTask, toggleCompleted }) {
  return (
    <div className="flex items-center gap-2 mb-1.5">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => toggleCompleted(task.id)}
        className="w-4 h-4 accent-blue-500 cursor-pointer focus:ring-2 focus:ring-blue-300 rounded"
      />
      <span
        className={
          task.completed ? "line-through text-gray-400" : "text-gray-800"
        }
      >
        {task.text}
      </span>

      <button
        onClick={() => deleteTask(task.id)}
        className="px-4 py-2 border border-orange-400 text-orange-500 font-semibold rounded-md hover:bg-orange-400 hover:text-white transition duration-200"
      >
        Supprimer
      </button>
    </div>
  );
}
export default TodoItem;
