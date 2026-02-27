import { useState } from "react";
import { useStore, Routine } from "@/context/StoreContext";
import { Plus, Bell, Trash2, X, Check, Clock, Calendar as CalendarIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function RoutinePage() {
  const { state, dispatch } = useStore();
  const [showAdd, setShowAdd] = useState(false);
  const [newRoutine, setNewRoutine] = useState<Partial<Routine>>({
    name: "",
    time: "08:00",
    days: [],
    active: true,
  });

  const handleAddRoutine = () => {
    if (!newRoutine.name || !newRoutine.time || newRoutine.days?.length === 0) return;

    dispatch({
      type: "ADD_ROUTINE",
      payload: {
        id: crypto.randomUUID(),
        name: newRoutine.name,
        time: newRoutine.time,
        days: newRoutine.days || [],
        active: true,
      } as Routine,
    });
    setShowAdd(false);
    setNewRoutine({ name: "", time: "08:00", days: [], active: true });
  };

  const toggleDay = (day: string) => {
    const currentDays = newRoutine.days || [];
    if (currentDays.includes(day)) {
      setNewRoutine({ ...newRoutine, days: currentDays.filter((d) => d !== day) });
    } else {
      setNewRoutine({ ...newRoutine, days: [...currentDays, day] });
    }
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

      <div className="space-y-4">
        {state.routines.length === 0 ? (
          <div className="text-center py-12 opacity-50">
            <p className="text-xl font-bold">No routines yet!</p>
            <p className="text-sm">Add one to get started.</p>
          </div>
        ) : (
          state.routines.map((routine) => (
            <motion.div
              key={routine.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "bg-white p-4 rounded-2xl shadow-md border-l-8 flex justify-between items-center transition-all",
                routine.active ? "border-[#1368ce]" : "border-gray-300 opacity-70"
              )}
            >
              <div>
                <h3 className={cn("font-black text-lg", !routine.active && "line-through text-gray-400")}>
                  {routine.name}
                </h3>
                <div className="flex items-center gap-2 text-sm font-bold text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {routine.time}
                  </span>
                  <span>•</span>
                  <span className="uppercase text-[10px] tracking-wide">
                    {routine.days.join(", ")}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => dispatch({ type: "TOGGLE_ROUTINE", payload: routine.id })}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    routine.active ? "text-[#1368ce] bg-blue-50" : "text-gray-400 bg-gray-100"
                  )}
                >
                  <Bell className={cn("w-5 h-5", routine.active && "fill-current")} />
                </button>
                <button
                  onClick={() => dispatch({ type: "DELETE_ROUTINE", payload: routine.id })}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

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
                
                <div>
                  <label className="block text-sm font-bold text-gray-500 mb-1">Time</label>
                  <input
                    type="time"
                    value={newRoutine.time}
                    onChange={(e) => setNewRoutine({ ...newRoutine, time: e.target.value })}
                    className="w-full p-3 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-[#1368ce] focus:outline-none font-bold"
                  />
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
                  disabled={!newRoutine.name || !newRoutine.time || newRoutine.days?.length === 0}
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
