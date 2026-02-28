import { useState, useEffect } from "react";
import { useStore, Routine } from "@/context/StoreContext";
import { Plus, Bell, Trash2, X, Check, Clock, Calendar as CalendarIcon, AlertTriangle, Briefcase, BookOpen, Heart, Coffee, Layers } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { format, isAfter, parse, addMinutes } from "date-fns";
import confetti from "canvas-confetti";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CATEGORIES = [
  { id: "Health", label: "Health", icon: Heart, color: "bg-red-100 text-red-600" },
  { id: "Work", label: "Work", icon: Briefcase, color: "bg-blue-100 text-blue-600" },
  { id: "Learning", label: "Learning", icon: BookOpen, color: "bg-yellow-100 text-yellow-600" },
  { id: "Self-care", label: "Self-care", icon: Coffee, color: "bg-purple-100 text-purple-600" },
  { id: "Other", label: "Other", icon: Layers, color: "bg-gray-100 text-gray-600" },
];

export default function RoutinePage() {
  const { state, dispatch } = useStore();
  const [showAdd, setShowAdd] = useState(false);
  const [showAlarmReminder, setShowAlarmReminder] = useState(false);
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null); // For "Done" popup
  const [selectedDay, setSelectedDay] = useState<string>(format(new Date(), "EEE")); // Default to today: "Mon", "Tue"...
  
  const [newRoutine, setNewRoutine] = useState<Partial<Routine>>({
    name: "",
    startTime: "08:00",
    endTime: "08:30",
    days: [],
    active: true,
    category: "Other",
  });

  // Filter routines for the selected day
  const dayRoutines = state.routines.filter(r => r.days.includes(selectedDay));
  
  // Sort by start time
  dayRoutines.sort((a, b) => a.startTime.localeCompare(b.startTime));

  const isDoneToday = (routine: Routine) => {
    const today = format(new Date(), "yyyy-MM-dd");
    return routine.lastCompletedDate === today;
  };

  const todoRoutines = dayRoutines.filter(r => !isDoneToday(r));
  const doneRoutines = dayRoutines.filter(r => isDoneToday(r));

  // Progress Calculation
  const totalDayRoutines = dayRoutines.length;
  const completedDayRoutines = doneRoutines.length;
  const progressPercentage = totalDayRoutines > 0 ? (completedDayRoutines / totalDayRoutines) * 100 : 0;

  // Check for Perfect Day
  useEffect(() => {
    if (totalDayRoutines > 0 && completedDayRoutines === totalDayRoutines) {
       // Could trigger a small confetti here if it just happened
    }
  }, [completedDayRoutines, totalDayRoutines]);

  const handleAddRoutine = () => {
    if (!newRoutine.name || !newRoutine.startTime || !newRoutine.endTime || newRoutine.days?.length === 0) return;

    dispatch({
      type: "ADD_ROUTINE",
      payload: {
        id: crypto.randomUUID(),
        name: newRoutine.name,
        startTime: newRoutine.startTime,
        endTime: newRoutine.endTime,
        days: newRoutine.days || [],
        active: true,
        streak: 0,
        category: newRoutine.category,
      } as Routine,
    });
    setShowAdd(false);
    setShowAlarmReminder(true); // Show reminder after adding
    setNewRoutine({ name: "", startTime: "08:00", endTime: "08:30", days: [], active: true, category: "Other" });
  };

  const toggleDay = (day: string) => {
    const currentDays = newRoutine.days || [];
    if (currentDays.includes(day)) {
      setNewRoutine({ ...newRoutine, days: currentDays.filter((d) => d !== day) });
    } else {
      setNewRoutine({ ...newRoutine, days: [...currentDays, day] });
    }
  };

  const handleCompleteRoutine = (routine: Routine) => {
    const now = new Date();
    const today = format(now, "yyyy-MM-dd");
    
    dispatch({ 
      type: "COMPLETE_ROUTINE", 
      payload: { id: routine.id, date: today } 
    });
    setSelectedRoutine(null);
    
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#1368ce", "#ffffff"],
    });
  };

  const getCategoryIcon = (cat?: string) => {
    const category = CATEGORIES.find(c => c.id === cat) || CATEGORIES[4];
    const Icon = category.icon;
    return <div className={cn("p-2 rounded-full", category.color)}><Icon className="w-4 h-4" /></div>;
  };

  return (
    <div className="p-4 pt-8 pb-24 space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-[#1368ce]">Routine</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-[#1368ce] text-white p-2 rounded-xl shadow-md active:scale-95 transition-transform border-b-4 border-[#0e4b96] active:border-b-0 active:translate-y-1"
        >
          <Plus className="w-6 h-6" />
        </button>
      </header>

      {/* Day Selector & Progress */}
      <div className="bg-white p-4 rounded-2xl shadow-sm space-y-4">
        <div className="flex justify-between overflow-x-auto pb-2">
          {DAYS.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={cn(
                "px-3 py-2 rounded-xl text-sm font-black transition-all min-w-[3rem] flex flex-col items-center gap-1",
                selectedDay === day
                  ? "bg-[#1368ce] text-white shadow-md"
                  : "text-gray-400 hover:bg-gray-100"
              )}
            >
              <span>{day}</span>
            </button>
          ))}
        </div>
        
        {/* Horizontal Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-bold text-gray-400 uppercase">
            <span>Daily Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              className={cn(
                "h-full rounded-full transition-all duration-500",
                progressPercentage === 100 ? "bg-green-500" : "bg-[#1368ce]"
              )}
            />
          </div>
          {progressPercentage === 100 && totalDayRoutines > 0 && (
            <p className="text-center text-xs font-black text-green-600 mt-1 animate-pulse">
              🎉 Perfect Day! All routines done!
            </p>
          )}
        </div>
      </div>

      <div className="space-y-8">
        {/* To Do Section */}
        <div className="space-y-4">
          <h2 className="font-black text-xl text-gray-700 flex items-center gap-2">
            To Do <span className="text-sm bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">{todoRoutines.length}</span>
          </h2>
          
          {todoRoutines.length === 0 && doneRoutines.length === 0 ? (
             <div className="text-center py-8 opacity-50">
               <p className="font-bold">No routines for {selectedDay}.</p>
             </div>
          ) : todoRoutines.length === 0 ? (
             <div className="text-center py-4 opacity-50">
               <p className="text-sm font-bold">All caught up!</p>
             </div>
          ) : (
            todoRoutines.map((routine) => (
              <motion.div
                key={routine.id}
                layout
                onClick={() => setSelectedRoutine(routine)}
                className="bg-white p-4 rounded-2xl shadow-md border-l-8 border-[#1368ce] flex justify-between items-center transition-all cursor-pointer active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  {getCategoryIcon(routine.category)}
                  <div>
                    <h3 className="font-black text-lg">{routine.name}</h3>
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {routine.startTime} - {routine.endTime}
                      </span>
                      <span>•</span>
                      <span className="text-[#eb6123] flex items-center gap-1">
                        🔥 {routine.streak || 0}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch({ type: "DELETE_ROUTINE", payload: routine.id });
                    }}
                    className="p-2 text-gray-300 hover:text-red-500 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Done Section */}
        {doneRoutines.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-black text-xl text-gray-700 flex items-center gap-2">
              Work Done <span className="text-sm bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{doneRoutines.length}</span>
            </h2>
            
            {doneRoutines.map((routine) => (
              <motion.div
                key={routine.id}
                layout
                className="bg-green-50 p-4 rounded-2xl shadow-sm border-l-8 border-green-500 flex justify-between items-center opacity-80"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-green-100 text-green-600">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-green-800 flex items-center gap-2 line-through decoration-green-600/50">
                      {routine.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm font-bold text-green-600/60">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {routine.startTime} - {routine.endTime}
                      </span>
                      <span>•</span>
                      <span className="text-[#eb6123] flex items-center gap-1">
                        🔥 {routine.streak || 0}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch({ type: "DELETE_ROUTINE", payload: routine.id });
                    }}
                    className="p-2 text-gray-300 hover:text-red-500 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Alarm Reminder Popup */}
      <AnimatePresence>
        {showAlarmReminder && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border-4 border-[#eb6123] p-6 text-center space-y-6"
            >
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                <Bell className="w-8 h-8 text-[#eb6123]" />
              </div>
              
              <div>
                <h3 className="text-xl font-black text-gray-800 mb-2">Set Your Alarm!</h3>
                <p className="text-gray-600 font-medium leading-relaxed">
                  Also set it on your alarm app so that you will be notified! 
                  <br/><br/>
                  <span className="text-[#eb6123] font-bold">Remember:</span> You have a <span className="font-black">5 min countdown</span> to mark the routine as done, or you'll lose a streak! 🔥
                </p>
              </div>

              <button
                onClick={() => setShowAlarmReminder(false)}
                className="w-full bg-[#eb6123] text-white py-3 rounded-xl font-black shadow-md active:scale-95 transition-transform"
              >
                Got it!
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Routine Modal */}
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
                <h3 className="text-white font-black text-xl">New Routine</h3>
                <button onClick={() => setShowAdd(false)} className="text-white/80 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-500 mb-1">Task Name</label>
                  <input
                    type="text"
                    value={newRoutine.name}
                    onChange={(e) => setNewRoutine({ ...newRoutine, name: e.target.value })}
                    className="w-full p-3 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-[#1368ce] focus:outline-none font-bold"
                    placeholder="e.g., Morning Yoga"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-500 mb-1">Start Time</label>
                    <input
                      type="time"
                      value={newRoutine.startTime}
                      onChange={(e) => setNewRoutine({ ...newRoutine, startTime: e.target.value })}
                      className="w-full p-3 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-[#1368ce] focus:outline-none font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-500 mb-1">End Time</label>
                    <input
                      type="time"
                      value={newRoutine.endTime}
                      onChange={(e) => setNewRoutine({ ...newRoutine, endTime: e.target.value })}
                      className="w-full p-3 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-[#1368ce] focus:outline-none font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-500 mb-1">Category</label>
                    <select
                      value={newRoutine.category}
                      // @ts-ignore
                      onChange={(e) => setNewRoutine({ ...newRoutine, category: e.target.value })}
                      className="w-full p-3 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-[#1368ce] focus:outline-none font-bold text-sm"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-500 mb-2">Repeat Days</label>
                  <div className="flex justify-between">
                    {DAYS.map((day) => (
                      <button
                        key={day}
                        onClick={() => toggleDay(day)}
                        className={cn(
                          "w-8 h-8 rounded-full text-[10px] font-black flex items-center justify-center transition-all",
                          newRoutine.days?.includes(day)
                            ? "bg-[#1368ce] text-white shadow-md scale-110"
                            : "bg-gray-100 text-gray-400"
                        )}
                      >
                        {day[0]}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleAddRoutine}
                  disabled={!newRoutine.name || !newRoutine.startTime || !newRoutine.endTime || newRoutine.days?.length === 0}
                  className="w-full mt-4 bg-[#1368ce] text-white py-3 rounded-xl font-black shadow-md active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100"
                >
                  Create Routine
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
