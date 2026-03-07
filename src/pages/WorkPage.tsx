import { useState } from "react";
import { useStore, WorkTask } from "@/context/StoreContext";
import { Plus, Trash2, Check, X, Briefcase, ChevronRight, Calendar, Repeat, Megaphone, Scroll, Crown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { format, startOfWeek, addDays, isSameDay, parseISO } from "date-fns";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";
import { SuccessAnimation } from "@/components/SuccessAnimation";

export default function WorkPage() {
  const { state, dispatch } = useStore();
  const [showAdd, setShowAdd] = useState(false);
  const [selectedTask, setSelectedTask] = useState<WorkTask | null>(null);
  const [successType, setSuccessType] = useState<"work" | "work_add" | null>(null);
  
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    date: format(new Date(), "yyyy-MM-dd"),
    isRoutine: false,
  });

  const [selectedDay, setSelectedDay] = useState(new Date());

  // Generate days of the current week (Sunday to Saturday)
  const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startOfCurrentWeek, i));

  // Filter tasks
  const routineTasks = state.workTasks.filter(t => t.isRoutine && !t.completed);
  const scheduledTasks = state.workTasks.filter(t => 
    !t.isRoutine && 
    !t.completed && 
    t.date && 
    isSameDay(parseISO(t.date), selectedDay)
  );
  
  const completedTasks = state.workTasks.filter(t => t.completed);
  const decreeTask = state.workTasks.find(t => t.isDecree && !t.completed);

  const handleAddTask = () => {
    if (!newTask.title) return;

    dispatch({
      type: "ADD_WORK_TASK",
      payload: {
        id: crypto.randomUUID(),
        title: newTask.title,
        description: newTask.description,
        completed: false,
        date: newTask.isRoutine ? undefined : newTask.date,
        isRoutine: newTask.isRoutine,
        isDecree: false,
      },
    });
    setShowAdd(false);
    setNewTask({ 
      title: "", 
      description: "", 
      date: format(new Date(), "yyyy-MM-dd"), 
      isRoutine: false 
    });
    setSuccessType("work_add");
  };

  const handleCompleteTask = (id: string) => {
    const isDecree = state.workTasks.find(t => t.id === id)?.isDecree;
    
    dispatch({ type: "COMPLETE_WORK_TASK", payload: id });
    setSelectedTask(null);
    setSuccessType("work");
    
    confetti({
      particleCount: isDecree ? 300 : 150,
      spread: isDecree ? 100 : 70,
      origin: { y: 0.6 },
      colors: isDecree ? ["#FFD700", "#FFA500", "#FFFFFF"] : ["#1368ce", "#ffffff"],
    });
  };

  const toggleDecree = (id: string) => {
    dispatch({ type: "TOGGLE_DECREE", payload: id });
    // Update selected task immediately to reflect changes in modal
    if (selectedTask && selectedTask.id === id) {
      setSelectedTask({ ...selectedTask, isDecree: !selectedTask.isDecree });
    }
  };

  return (
    <div className="p-4 pt-8 pb-24 space-y-6">
      <SuccessAnimation 
        type={successType || "work"} 
        isVisible={!!successType} 
        onComplete={() => setSuccessType(null)} 
        stats={successType === "work" ? "Intellect +1" : "Task Added"}
      />

      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-[#1368ce]">Dept. of Labor</h1>
          <p className="text-gray-500 font-bold">Official Duties & Tasks</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-[#1368ce] text-white p-3 rounded-xl shadow-md active:scale-95 transition-transform border-b-4 border-[#0e4b96] active:border-b-0 active:translate-y-1"
        >
          <Plus className="w-6 h-6" />
        </button>
      </header>

      {/* Government Decree Section */}
      {decreeTask && (
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-[#fff8e1] border-4 border-[#d4af37] rounded-3xl p-6 shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-[#d4af37]" />
          <div className="absolute -right-4 -top-4 text-[#d4af37]/10 transform rotate-12">
            <Crown className="w-32 h-32" />
          </div>
          
          <div className="relative z-10 text-center space-y-3">
            <div className="inline-flex items-center gap-2 bg-[#d4af37] text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-sm">
              <Megaphone className="w-3 h-3" /> Official Decree
            </div>
            
            <h3 className="font-black text-2xl text-[#8a6d0b] leading-tight">
              "{decreeTask.title}"
            </h3>
            
            <p className="text-[#bfa043] text-xs font-bold uppercase">By Order of the Mayor</p>
            
            <button
              onClick={() => handleCompleteTask(decreeTask.id)}
              className="w-full mt-2 bg-[#d4af37] hover:bg-[#c49f27] text-white py-3 rounded-xl font-black shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2 border-b-4 border-[#a6851f] active:border-b-0 active:translate-y-1"
            >
              <Check className="w-5 h-5" />
              Complete Decree
            </button>
          </div>
        </motion.div>
      )}

      {/* Week Day Selector */}
      <div className="flex justify-between bg-white p-2 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
        {weekDays.map((day) => {
          const isSelected = isSameDay(day, selectedDay);
          const isToday = isSameDay(day, new Date());
          return (
            <button
              key={day.toString()}
              onClick={() => setSelectedDay(day)}
              className={cn(
                "flex flex-col items-center justify-center w-12 h-16 rounded-xl transition-all min-w-[48px]",
                isSelected 
                  ? "bg-[#1368ce] text-white shadow-md scale-105" 
                  : "text-gray-400 hover:bg-gray-50",
                isToday && !isSelected && "bg-blue-50 text-[#1368ce] border border-blue-100"
              )}
            >
              <span className="text-[10px] font-bold uppercase">{format(day, "EEE")}</span>
              <span className={cn("text-lg font-black", isSelected ? "text-white" : "text-gray-700")}>
                {format(day, "d")}
              </span>
            </button>
          );
        })}
      </div>

      {/* Routine / Everyday Tasks */}
      <div className="space-y-4">
        <h2 className="font-black text-xl text-gray-700 flex items-center gap-2">
          <Repeat className="w-5 h-5 text-orange-500" />
          Everyday Routine <span className="text-sm bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">{routineTasks.length}</span>
        </h2>
        
        {routineTasks.length === 0 ? (
          <div className="text-center py-6 opacity-50 border-2 border-dashed border-gray-200 rounded-2xl">
            <p className="font-bold text-gray-400 text-sm">No routine tasks.</p>
          </div>
        ) : (
          routineTasks.map((task) => (
            <motion.div
              key={task.id}
              layout
              onClick={() => setSelectedTask(task)}
              className={cn(
                "bg-white p-4 rounded-2xl shadow-md border-l-8 flex justify-between items-center cursor-pointer active:scale-[0.98] transition-transform group",
                task.isDecree ? "border-[#d4af37] bg-[#fffdf5]" : "border-orange-400"
              )}
            >
              <div>
                <h3 className="font-black text-lg text-gray-800 line-clamp-1">{task.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="bg-orange-100 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Routine</span>
                  {task.isDecree && (
                    <span className="bg-[#fff8e1] text-[#d4af37] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                      <Crown className="w-3 h-3" /> Decree
                    </span>
                  )}
                  {task.description && (
                    <p className="text-gray-400 text-xs font-bold line-clamp-1">{task.description}</p>
                  )}
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-orange-500 transition-colors" />
            </motion.div>
          ))
        )}
      </div>

      {/* Scheduled Tasks for Selected Day */}
      <div className="space-y-4">
        <h2 className="font-black text-xl text-gray-700 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#1368ce]" />
          {format(selectedDay, "EEEE")}'s Tasks <span className="text-sm bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">{scheduledTasks.length}</span>
        </h2>

        {scheduledTasks.length === 0 ? (
          <div className="text-center py-12 opacity-50">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="font-bold text-gray-400">No tasks for {format(selectedDay, "EEEE")}.</p>
            <button onClick={() => {
              setNewTask(prev => ({ ...prev, date: format(selectedDay, "yyyy-MM-dd"), isRoutine: false }));
              setShowAdd(true);
            }} className="text-[#1368ce] text-sm font-bold mt-2 hover:underline">Add a task?</button>
          </div>
        ) : (
          scheduledTasks.map((task) => (
            <motion.div
              key={task.id}
              layout
              onClick={() => setSelectedTask(task)}
              className={cn(
                "bg-white p-4 rounded-2xl shadow-md border-l-8 flex justify-between items-center cursor-pointer active:scale-[0.98] transition-transform group",
                task.isDecree ? "border-[#d4af37] bg-[#fffdf5]" : "border-[#1368ce]"
              )}
            >
              <div>
                <h3 className="font-black text-lg text-gray-800 line-clamp-1">{task.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  {task.isDecree && (
                    <span className="bg-[#fff8e1] text-[#d4af37] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                      <Crown className="w-3 h-3" /> Decree
                    </span>
                  )}
                  {task.description && (
                    <p className="text-gray-400 text-xs font-bold line-clamp-1">{task.description}</p>
                  )}
                </div>
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
                <div>
                  <h3 className="font-bold text-gray-500 line-through decoration-gray-400">{task.title}</h3>
                  <div className="flex gap-2">
                    {task.isRoutine && <span className="text-[10px] font-bold text-orange-400 uppercase">Routine</span>}
                    {task.isDecree && <span className="text-[10px] font-bold text-[#d4af37] uppercase">Decree Fulfilled</span>}
                  </div>
                </div>
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
              <div className={cn("p-6 flex justify-between items-start shrink-0", selectedTask.isDecree ? "bg-[#d4af37]" : "bg-[#1368ce]")}>
                <div>
                  <h3 className="text-white font-black text-2xl leading-tight pr-4">{selectedTask.title}</h3>
                  {selectedTask.isRoutine && (
                     <span className="inline-block mt-2 bg-white/20 text-white text-xs font-bold px-2 py-1 rounded-full mr-2">Everyday Routine</span>
                  )}
                  {!selectedTask.isRoutine && selectedTask.date && (
                     <span className="inline-block mt-2 bg-white/20 text-white text-xs font-bold px-2 py-1 rounded-full mr-2">
                        {format(parseISO(selectedTask.date), "EEEE, MMM d")}
                     </span>
                  )}
                  {selectedTask.isDecree && (
                    <span className="inline-flex items-center gap-1 mt-2 bg-white text-[#d4af37] text-xs font-black px-2 py-1 rounded-full uppercase">
                      <Crown className="w-3 h-3" /> Official Decree
                    </span>
                  )}
                </div>
                <button onClick={() => setSelectedTask(null)} className="text-white/80 hover:text-white bg-white/10 p-2 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1 space-y-4">
                {/* Decree Toggle Button */}
                <button
                  onClick={() => toggleDecree(selectedTask.id)}
                  className={cn(
                    "w-full py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 border-2 transition-all",
                    selectedTask.isDecree
                      ? "bg-gray-100 text-gray-400 border-gray-200"
                      : "bg-[#fff8e1] text-[#d4af37] border-[#d4af37] hover:bg-[#fffdf5]"
                  )}
                >
                  {selectedTask.isDecree ? (
                    <>
                      <X className="w-4 h-4" /> Revoke Decree
                    </>
                  ) : (
                    <>
                      <Scroll className="w-4 h-4" /> Issue as Decree
                    </>
                  )}
                </button>

                <div>
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Description</h4>
                  <div className="bg-gray-50 p-4 rounded-2xl border-2 border-gray-100 min-h-[100px]">
                    <p className="text-gray-700 font-medium whitespace-pre-wrap leading-relaxed">
                      {selectedTask.description || <span className="text-gray-400 italic">No description provided.</span>}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-100 shrink-0 space-y-3">
                <button
                  onClick={() => handleCompleteTask(selectedTask.id)}
                  className={cn(
                    "w-full text-white py-4 rounded-2xl font-black text-lg shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2 border-b-4 active:border-b-0 active:translate-y-1",
                    selectedTask.isDecree ? "bg-[#d4af37] border-[#a6851f]" : "bg-[#1368ce] border-[#0e4b96]"
                  )}
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
                
                {/* Routine Toggle */}
                <div className="flex items-center gap-3 bg-orange-50 p-3 rounded-xl border border-orange-100">
                  <div className={cn(
                    "w-10 h-6 rounded-full p-1 transition-colors cursor-pointer",
                    newTask.isRoutine ? "bg-orange-500" : "bg-gray-300"
                  )} onClick={() => setNewTask({ ...newTask, isRoutine: !newTask.isRoutine })}>
                    <div className={cn(
                      "w-4 h-4 bg-white rounded-full shadow-sm transition-transform",
                      newTask.isRoutine ? "translate-x-4" : "translate-x-0"
                    )} />
                  </div>
                  <span className="text-sm font-bold text-gray-700">Everyday Routine Task</span>
                </div>

                {!newTask.isRoutine && (
                  <div>
                    <label className="block text-sm font-bold text-gray-500 mb-1">Date</label>
                    <input
                      type="date"
                      value={newTask.date}
                      onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
                      className="w-full p-3 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-[#1368ce] focus:outline-none font-bold"
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-bold text-gray-500 mb-1">Description</label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="w-full p-3 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-[#1368ce] focus:outline-none font-medium h-24 resize-none"
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
