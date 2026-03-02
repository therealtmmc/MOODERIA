import { useState, useEffect } from "react";
import { useStore } from "@/context/StoreContext";
import { format, isYesterday, parseISO } from "date-fns";
import { Smile, Frown, Meh, Heart, CloudLightning, Zap, Coffee, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

const MOODS = [
  { label: "Happy", icon: Smile, color: "bg-yellow-400" },
  { label: "Sad", icon: Frown, color: "bg-blue-400" },
  { label: "Neutral", icon: Meh, color: "bg-gray-400" },
  { label: "Loved", icon: Heart, color: "bg-pink-400" },
  { label: "Angry", icon: CloudLightning, color: "bg-red-500" },
  { label: "Energetic", icon: Zap, color: "bg-orange-400" },
  { label: "Tired", icon: Coffee, color: "bg-stone-500" },
  { label: "Calm", icon: Moon, color: "bg-indigo-400" },
];

export function DailyMoodPopup() {
  const { state, dispatch } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const today = format(new Date(), "yyyy-MM-dd");

  useEffect(() => {
    // Check if mood is already logged for today
    const hasLoggedToday = state.moods.some((m) => m.date === today);
    if (!hasLoggedToday) {
      // Small delay for better UX on load
      const timer = setTimeout(() => setIsOpen(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [state.moods, today]);

  const handleSelectMood = (moodLabel: string) => {
    const lastDate = state.lastMoodDate ? parseISO(state.lastMoodDate) : null;
    const wasYesterday = lastDate && isYesterday(lastDate);

    if (wasYesterday) {
      dispatch({ type: "INCREMENT_STREAK" });
    } else if (state.lastMoodDate !== today) {
      // If not today and not yesterday, reset (unless it's the first time)
      if (state.lastMoodDate) {
        dispatch({ type: "RESET_STREAK" });
        dispatch({ type: "INCREMENT_STREAK" }); // Start at 1
      } else {
         dispatch({ type: "INCREMENT_STREAK" }); // First ever
      }
    }

    dispatch({
      type: "ADD_MOOD",
      payload: {
        id: crypto.randomUUID(),
        date: today,
        mood: moodLabel,
        note: "",
      },
    });
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden border-4 border-[#46178f]"
          >
            <div className="bg-[#46178f] p-6 text-center">
              <h2 className="text-2xl font-black text-white">Daily Check-in</h2>
              <p className="text-white/80 font-bold">How are you feeling today?</p>
            </div>
            
            <div className="p-6 grid grid-cols-2 gap-4">
              {MOODS.map((mood) => (
                <button
                  key={mood.label}
                  onClick={() => handleSelectMood(mood.label)}
                  className={cn(
                    "flex flex-col items-center justify-center p-4 rounded-2xl transition-transform active:scale-95 border-b-4 border-black/10",
                    mood.color
                  )}
                >
                  <mood.icon className="w-8 h-8 text-white drop-shadow-md mb-2" />
                  <span className="font-black text-white text-sm uppercase tracking-wide shadow-black drop-shadow-sm">
                    {mood.label}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
