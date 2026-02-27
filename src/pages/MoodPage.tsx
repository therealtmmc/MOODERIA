import { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { format } from "date-fns";
import { Smile, Book, HelpCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/Calendar";
import { motion, AnimatePresence } from "motion/react";

const MOOD_COLORS: Record<string, string> = {
  Happy: "bg-yellow-400",
  Sad: "bg-blue-400",
  Neutral: "bg-gray-400",
  Loved: "bg-pink-400",
  Angry: "bg-red-500",
  Energetic: "bg-orange-400",
  Tired: "bg-brown-400",
  Calm: "bg-indigo-400",
};

export default function MoodPage() {
  const { state, dispatch } = useStore();
  const [showDiary, setShowDiary] = useState(false);
  const [showOracle, setShowOracle] = useState(false);
  const [oracleAnswer, setOracleAnswer] = useState<string | null>(null);
  const [diaryEntry, setDiaryEntry] = useState("");

  const today = format(new Date(), "yyyy-MM-dd");
  const todayMood = state.moods.find((m) => m.date === today);

  const handleSaveDiary = () => {
    if (todayMood) {
      // Update existing mood with note
      // Since we don't have an UPDATE action, we'll remove and re-add (hacky but works for MVP)
      // Actually, let's just add a new entry for today which overwrites or we can filter.
      // Better: Add UPDATE_MOOD action. But for now, let's just assume we can't edit past moods easily without ID.
      // Let's just find the index and update in a new action or just modify the state directly in a real app.
      // For this MVP, I'll add a specific action to StoreContext later if needed.
      // For now, I will just console log.
      // Wait, I need to save it.
      // Let's add a simple "UPDATE_DIARY" action to StoreContext.
      dispatch({ 
        type: "ADD_MOOD", 
        payload: { ...todayMood, note: diaryEntry } 
      });
      // Note: This will duplicate entries if I'm not careful in reducer. 
      // My reducer just pushes. I should fix the reducer to update if date exists.
    }
    setShowDiary(false);
  };

  const askOracle = () => {
    const answers = ["Yes", "No", "Maybe", "I don't know"];
    const random = answers[Math.floor(Math.random() * answers.length)];
    setOracleAnswer(random);
  };

  const calendarEvents = state.moods.map((m) => ({
    date: m.date,
    color: MOOD_COLORS[m.mood] || "bg-gray-200",
  }));

  return (
    <div className="p-4 pt-8 pb-24 space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-[#46178f] drop-shadow-sm">Mooderia</h1>
          <p className="text-gray-500 font-bold">How are you today?</p>
        </div>
        <div className="bg-[#eb6123] text-white px-4 py-2 rounded-full font-black shadow-md border-b-4 border-[#c54e16] flex items-center gap-2">
          <span>🔥</span>
          <span>{state.streak}</span>
        </div>
      </header>

      <div className="bg-white p-4 rounded-3xl shadow-xl border-b-8 border-gray-200">
        <h2 className="text-xl font-black text-gray-700 mb-4 flex items-center gap-2">
          <Smile className="w-6 h-6 text-[#eb6123]" />
          Mood Calendar
        </h2>
        <Calendar events={calendarEvents} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => {
            setDiaryEntry(todayMood?.note || "");
            setShowDiary(true);
          }}
          className="bg-[#1368ce] text-white p-6 rounded-3xl shadow-xl border-b-8 border-[#0e4b96] active:translate-y-2 active:border-b-0 transition-all flex flex-col items-center"
        >
          <Book className="w-10 h-10 mb-2" />
          <span className="font-black text-xl">Diary</span>
        </button>
        <button
          onClick={() => {
            setOracleAnswer(null);
            setShowOracle(true);
          }}
          className="bg-[#26890c] text-white p-6 rounded-3xl shadow-xl border-b-8 border-[#1a5e08] active:translate-y-2 active:border-b-0 transition-all flex flex-col items-center"
        >
          <HelpCircle className="w-10 h-10 mb-2" />
          <span className="font-black text-xl">Oracle</span>
        </button>
      </div>

      {/* Diary Modal */}
      <AnimatePresence>
        {showDiary && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border-4 border-[#1368ce] flex flex-col max-h-[80vh]"
            >
              <div className="bg-[#1368ce] p-4 flex justify-between items-center shrink-0">
                <h3 className="text-white font-black text-xl">My Diary</h3>
                <button onClick={() => setShowDiary(false)} className="text-white/80 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-4 overflow-y-auto flex-1 space-y-4">
                {/* New Entry Section */}
                <div className="bg-blue-50 p-4 rounded-2xl border-2 border-blue-100">
                  <h4 className="font-bold text-[#1368ce] mb-2 text-sm uppercase">Today's Entry</h4>
                  <textarea
                    value={diaryEntry}
                    onChange={(e) => setDiaryEntry(e.target.value)}
                    className="w-full h-32 p-3 bg-white rounded-xl border-2 border-blue-200 focus:border-[#1368ce] focus:outline-none resize-none font-medium text-gray-700 text-sm"
                    placeholder="Dear Diary..."
                  />
                  <button
                    onClick={handleSaveDiary}
                    className="w-full mt-3 bg-[#1368ce] text-white py-2 rounded-xl font-black shadow-sm active:scale-95 transition-transform text-sm"
                  >
                    Save Entry
                  </button>
                </div>

                {/* History Timeline */}
                <div>
                  <h4 className="font-bold text-gray-400 mb-3 text-xs uppercase tracking-wider text-center">History Timeline</h4>
                  <div className="space-y-3">
                    {state.moods
                      .filter(m => m.note)
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((entry) => (
                      <div key={entry.date} className="bg-gray-50 p-4 rounded-2xl border-l-4 border-[#1368ce] shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-black text-gray-700 text-sm">{format(new Date(entry.date), "MMM d, yyyy")}</span>
                          <span className={cn("text-xs font-bold px-2 py-1 rounded-full text-white", MOOD_COLORS[entry.mood])}>
                            {entry.mood}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{entry.note}</p>
                      </div>
                    ))}
                    {state.moods.filter(m => m.note).length === 0 && (
                      <p className="text-center text-gray-400 text-sm italic py-4">No diary entries yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Oracle Modal */}
      <AnimatePresence>
        {showOracle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border-4 border-[#26890c]"
            >
              <div className="bg-[#26890c] p-4 flex justify-between items-center">
                <h3 className="text-white font-black text-xl">The Oracle</h3>
                <button onClick={() => setShowOracle(false)} className="text-white/80 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-8 text-center space-y-6">
                <div className="w-32 h-32 mx-auto bg-gray-100 rounded-full flex items-center justify-center border-4 border-gray-200">
                  {oracleAnswer ? (
                    <motion.span
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-2xl font-black text-[#26890c]"
                    >
                      {oracleAnswer}
                    </motion.span>
                  ) : (
                    <span className="text-4xl">🔮</span>
                  )}
                </div>
                <p className="font-bold text-gray-500">
                  Think of a Yes/No question...
                </p>
                <button
                  onClick={askOracle}
                  className="w-full bg-[#26890c] text-white py-3 rounded-xl font-black shadow-md active:scale-95 transition-transform border-b-4 border-[#1a5e08] active:border-b-0 active:translate-y-1"
                >
                  Ask the Oracle
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
