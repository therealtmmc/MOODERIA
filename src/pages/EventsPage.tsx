import { useState } from "react";
import { useStore, Event } from "@/context/StoreContext";
import { Plus, Trash2, X, Calendar as CalendarIcon, Clock } from "lucide-react";
import { Calendar } from "@/components/Calendar";
import { motion, AnimatePresence } from "motion/react";
import { format, parseISO, isAfter, startOfDay } from "date-fns";
import { cn } from "@/lib/utils";

export default function EventsPage() {
  const { state, dispatch } = useStore();
  const [showAdd, setShowAdd] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    title: "",
    date: format(new Date(), "yyyy-MM-dd"),
    time: "12:00",
    description: "",
  });

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.time) return;

    dispatch({
      type: "ADD_EVENT",
      payload: {
        id: crypto.randomUUID(),
        title: newEvent.title,
        date: newEvent.date,
        time: newEvent.time,
        description: newEvent.description,
      } as Event,
    });
    setShowAdd(false);
    setNewEvent({
      title: "",
      date: format(new Date(), "yyyy-MM-dd"),
      time: "12:00",
      description: "",
    });
  };

  const calendarEvents = state.events.map((e) => ({
    date: e.date,
    dot: true,
    color: "bg-green-100 text-green-800", // Light green background for event days
  }));

  const upcomingEvents = state.events
    .filter((e) => isAfter(parseISO(e.date), startOfDay(new Date())) || e.date === format(new Date(), "yyyy-MM-dd"))
    .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());

  return (
    <div className="p-4 pt-8 pb-24 space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-[#26890c]">Events</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-[#26890c] text-white p-2 rounded-xl shadow-md active:scale-95 transition-transform border-b-4 border-[#1a5e08] active:border-b-0 active:translate-y-1"
        >
          <Plus className="w-6 h-6" />
        </button>
      </header>

      <div className="bg-white p-4 rounded-3xl shadow-xl border-b-8 border-gray-200">
        <Calendar events={calendarEvents} />
      </div>

      <div className="space-y-4">
        <h2 className="font-black text-xl text-gray-700 flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-[#26890c]" />
          Upcoming
        </h2>
        
        {upcomingEvents.length === 0 ? (
          <div className="text-center py-8 opacity-50">
            <p className="font-bold">No upcoming events.</p>
          </div>
        ) : (
          upcomingEvents.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-4 rounded-2xl shadow-md border-l-8 border-[#26890c] flex justify-between items-center"
            >
              <div>
                <h3 className="font-black text-lg">{event.title}</h3>
                <div className="flex items-center gap-2 text-sm font-bold text-gray-400">
                  <span className="flex items-center gap-1">
                    <CalendarIcon className="w-3 h-3" /> {format(parseISO(event.date), "MMM d")}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {event.time}
                  </span>
                </div>
              </div>
              <button
                onClick={() => dispatch({ type: "DELETE_EVENT", payload: event.id })}
                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </motion.div>
          ))
        )}
      </div>

      {/* Add Event Modal */}
      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border-4 border-[#26890c]"
            >
              <div className="bg-[#26890c] p-4 flex justify-between items-center">
                <h3 className="text-white font-black text-xl">New Event</h3>
                <button onClick={() => setShowAdd(false)} className="text-white/80 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-500 mb-1">Event Title</label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="w-full p-3 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-[#26890c] focus:outline-none font-bold"
                    placeholder="e.g., Birthday Party"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-500 mb-1">Date</label>
                    <input
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      className="w-full p-3 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-[#26890c] focus:outline-none font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-500 mb-1">Time</label>
                    <input
                      type="time"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                      className="w-full p-3 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-[#26890c] focus:outline-none font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-500 mb-1">Description (Optional)</label>
                  <textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    className="w-full p-3 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-[#26890c] focus:outline-none font-bold resize-none h-24"
                    placeholder="Details..."
                  />
                </div>

                <button
                  onClick={handleAddEvent}
                  disabled={!newEvent.title || !newEvent.date || !newEvent.time}
                  className="w-full mt-4 bg-[#26890c] text-white py-3 rounded-xl font-black shadow-md active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100"
                >
                  Add Event
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
