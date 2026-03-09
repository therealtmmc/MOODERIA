import { useStore } from "@/context/StoreContext";
import { Check, Plus } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export function TaskComponent() {
  const { state, dispatch } = useStore();
  const [title, setTitle] = useState("");

  const addTask = () => {
    if (!title) return;
    dispatch({ type: "ADD_TASK", payload: { id: crypto.randomUUID(), title, completed: false } });
    setTitle("");
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.01, rotate: 1 }}
      className="bg-white rounded-[2.5rem] shadow-[0_10px_30px_rgba(0,0,0,0.1)] p-8 border-4 border-black/5 mt-6 transition-transform"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-emerald-100 rounded-xl border-2 border-emerald-200 flex items-center justify-center text-xl shadow-inner rotate-[-5deg]">
          📋
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tight text-gray-800">Daily Tasks</h2>
      </div>

      <div className="flex gap-3 mb-8">
        <input 
          value={title} 
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
          className="flex-grow px-6 py-4 rounded-2xl border-4 border-gray-100 bg-gray-50 font-bold text-gray-700 outline-none focus:border-purple-300 focus:bg-white transition-colors"
          placeholder="What needs to be done? ✨"
        />
        <motion.button 
          whileHover={{ scale: 1.05, rotate: 5 }}
          whileTap={{ scale: 0.95, rotate: -5 }}
          onClick={addTask} 
          className="bg-purple-600 text-white px-6 rounded-2xl border-b-4 border-purple-800 shadow-lg flex items-center justify-center"
        >
          <Plus className="w-6 h-6" />
        </motion.button>
      </div>

      <ul className="space-y-3">
        <AnimatePresence>
          {state.tasks.map(task => (
            <motion.li 
              key={task.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, x: -20 }}
              whileHover={{ scale: 1.02, x: 5 }}
              className={cn(
                "flex items-center gap-4 p-4 rounded-2xl border-2 transition-colors cursor-pointer",
                task.completed ? "bg-gray-50 border-gray-100" : "bg-white border-gray-200 shadow-sm hover:border-purple-200"
              )}
              onClick={() => dispatch({ type: "TOGGLE_TASK", payload: task.id })}
            >
              <motion.button 
                whileTap={{ scale: 0.8 }}
                className={cn(
                  "w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-colors shadow-inner",
                  task.completed ? "bg-emerald-500 border-emerald-600" : "bg-gray-100 border-gray-300"
                )}
              >
                {task.completed && <Check className="text-white w-5 h-5" />}
              </motion.button>
              <span className={cn(
                "font-bold text-lg transition-all",
                task.completed ? "line-through text-gray-400" : "text-gray-700"
              )}>
                {task.title}
              </span>
            </motion.li>
          ))}
        </AnimatePresence>
        {state.tasks.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-gray-400 font-bold border-4 border-dashed border-gray-100 rounded-3xl"
          >
            No tasks yet. Add one to start your day! 🚀
          </motion.div>
        )}
      </ul>
    </motion.div>
  );
}
