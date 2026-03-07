import { useStore } from "@/context/StoreContext";
import { Check, Plus } from "lucide-react";
import { useState } from "react";

export function TaskComponent() {
  const { state, dispatch } = useStore();
  const [title, setTitle] = useState("");

  const addTask = () => {
    if (!title) return;
    dispatch({ type: "ADD_TASK", payload: { id: crypto.randomUUID(), title, completed: false } });
    setTitle("");
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100 mt-6">
      <h2 className="text-xl font-bold mb-4">Daily Tasks</h2>
      <div className="flex gap-2 mb-4">
        <input 
          value={title} 
          onChange={(e) => setTitle(e.target.value)}
          className="flex-grow p-2 rounded-lg border border-gray-200"
          placeholder="New task..."
        />
        <button onClick={addTask} className="bg-indigo-600 text-white p-2 rounded-lg"><Plus /></button>
      </div>
      <ul className="space-y-2">
        {state.tasks.map(task => (
          <li key={task.id} className="flex items-center gap-2">
            <button onClick={() => dispatch({ type: "TOGGLE_TASK", payload: task.id })} className={`w-6 h-6 rounded-full border ${task.completed ? "bg-green-500" : "border-gray-300"}`}>
              {task.completed && <Check className="text-white w-4 h-4" />}
            </button>
            <span className={task.completed ? "line-through text-gray-500" : ""}>{task.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
