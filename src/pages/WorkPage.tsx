import { useState } from "react";
import { useStore, WorkTask } from "@/context/StoreContext";
import { Plus, Trash2, Check, X, Briefcase, ChevronRight, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { format } from "date-fns";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";
import { SuccessAnimation } from "@/components/SuccessAnimation";

export default function WorkPage() {
  const { state, dispatch } = useStore();
  const [showAdd, setShowAdd] = useState(false);
  const [selectedTask, setSelectedTask] = useState<WorkTask | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
  });

  const activeTasks = state.workTasks.filter(t => !t.completed);
  const completedTasks = state.workTasks.filter(t => t.completed);

  const handleAddTask = () => {
    if (!newTask.title) return;

    dispatch({
      type: "ADD_WORK_TASK",
      payload: {
        id: crypto.randomUUID(),
        title: newTask.title,
        description: newTask.description,
        completed: false,
      },
    });
    setShowAdd(false);
    setNewTask({ title: "", description: "" });
  };

  const handleCompleteTask = (id: string) => {
    dispatch({ type: "COMPLETE_WORK_TASK", payload: id });
    setSelectedTask(null);
    setShowSuccess(true);
    
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#1368ce", "#ffffff"],
    });
  };

  return (
    <div className="p-4 pt-8 pb-24 space-y-6">
      <SuccessAnimation 
        type="work" 
        isVisible={showSuccess} 
        onComplete={() => setShowSuccess(false)} 
      />

      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-[#1368ce]">Work</h1>
          <p className="text-gray-500 font-bold">Get things done</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-[#1368ce] text-white p-3 rounded-xl shadow-md active:scale-95 transition-transform border-b-4 border-[#0e4b96] active:border-b-0 active:translate-y-1"
        >
          <Plus className="w-6 h-6" />
        </button>
      </header>

      {/* Active Tasks */}
      <div className="space-y-4">
        <h2 className="font-black text-xl text-gray-700 flex items-center gap-2">
          To Do <span className="text-sm bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">{activeTasks.length}</span>
        </h2>

        {activeTasks.length === 0 ? (
          <div className="text-center py-12 opacity-50">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="font-bold text-gray-400">No tasks yet.</p>
            <button onClick={() => setShowAdd(true)} className="text-[#1368ce] text-sm font-bold mt-2 hover:underline">Add a task?</button>
          </div>
        ) : (
          activeTasks.map((task) => (
            <motion.div
              key={task.id}
              layout
              onClick={() => setSelectedTask(task)}
              className="bg-white p-4 rounded-2xl shadow-md border-l-8 border-[#1368ce] flex justify-between items-center cursor-pointer active:scale-[0.98] transition-transform group"
            >
              <div>
                <h3 className="font-black text-lg text-gray-800 line-clamp-1">{task.title}</h3>
                {task.description && (
                  <p className="text-gray-400 text-xs font-bold line-clamp-1 mt-1">{task.description}</p>
                )}
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#1368ce] transition-colors" />
            </motion.div>
          ))
        )}
      </div>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div className="space-y-4 pt-4 border-t-2 border-dashed border-gray-200">
          <h2 className="font-black text-xl text-gray-700 flex items-center gap-2">
            Done <span className="text-sm bg-green-100 text-green-600 px-2 py-0.5 rounded-full">{completedTasks.length}</span>
          </h2>
          
          {completedTasks.map((task) => (
            <motion.div
              key={task.id}
              layout
              className="bg-gray-50 p-4 rounded-2xl border-2 border-gray-100 flex justify-between items-center opacity-60"
            >
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-1 rounded-full text-green-600">
                  <Check className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-gray-500 line-through decoration-gray-400">{task.title}</h3>
              </div>
              <button
                onClick={() => dispatch({ type: "DELETE_WORK_TASK", payload: task.id })}
                className="text-gray-300 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Task Detail Modal */}
      <AnimatePresence>
        {selectedTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden border-4 border-[#1368ce] flex flex-col max-h-[80vh]"
            >
              <div className="bg-[#1368ce] p-6 flex justify-between items-start shrink-0">
                <h3 className="text-white font-black text-2xl leading-tight pr-4">{selectedTask.title}</h3>
                <button onClick={() => setSelectedTask(null)} className="text-white/80 hover:text-white bg-white/10 p-2 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Description</h4>
                    <div className="bg-gray-50 p-4 rounded-2xl border-2 border-gray-100 min-h-[100px]">
                      <p className="text-gray-700 font-medium whitespace-pre-wrap leading-relaxed">
                        {selectedTask.description || <span className="text-gray-400 italic">No description provided.</span>}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-100 shrink-0 space-y-3">
                <button
                  onClick={() => handleCompleteTask(selectedTask.id)}
                  className="w-full bg-[#1368ce] text-white py-4 rounded-2xl font-black text-lg shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2 border-b-4 border-[#0e4b96] active:border-b-0 active:translate-y-1"
                >
                  <Check className="w-6 h-6" />
                  Mark as Done
                </button>
                
                <button
                  onClick={() => {
                    if(confirm("Delete this task?")) {
                        dispatch({ type: "DELETE_WORK_TASK", payload: selectedTask.id });
                        setSelectedTask(null);
                    }
                  }}
                  className="w-full text-red-400 font-bold text-sm py-2 hover:bg-red-50 rounded-xl transition-colors"
                >
                  Delete Task
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Task Modal */}
      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border-4 border-[#1368ce]"
            >
              <div className="bg-[#1368ce] p-4 flex justify-between items-center">
                <h3 className="text-white font-black text-xl">New Task</h3>
                <button onClick={() => setShowAdd(false)} className="text-white/80 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-500 mb-1">Title</label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full p-3 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-[#1368ce] focus:outline-none font-bold"
                    placeholder="e.g., Finish Report"
                    autoFocus
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-500 mb-1">Description</label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="w-full p-3 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-[#1368ce] focus:outline-none font-medium h-32 resize-none"
                    placeholder="Add details..."
                  />
                </div>

                <button
                  onClick={handleAddTask}
                  disabled={!newTask.title}
                  className="w-full mt-4 bg-[#1368ce] text-white py-3 rounded-xl font-black shadow-md active:scale-95 transition-transform disabled:opacity-50"
                >
                  Add Task
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
