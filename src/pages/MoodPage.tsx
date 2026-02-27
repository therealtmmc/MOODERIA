import { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { format } from "date-fns";
import { Smile, Book, HelpCircle, X, Trash2 } from "lucide-react";
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
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const today = format(new Date(), "yyyy-MM-dd");
  const todayMood = state.moods.find((m) => m.date === today);

  const handleSaveDiary = () => {
    if (!selectedMood && !todayMood) return; // Should be disabled anyway

    const moodToSave = selectedMood || todayMood?.mood;
    
    if (moodToSave) {
      dispatch({ 
        type: "ADD_MOOD", 
        payload: { 
          date: today,
          mood: moodToSave,
          note: diaryEntry 
        } 
      });
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
            setSelectedMood(todayMood?.mood || null);
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

      {/* Diary Modal (Standard Version) */}
      <AnimatePresence>
        {showDiary && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-md h-[85vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col border-4 border-[#1368ce]"
            >
              <div className="bg-[#1368ce] p-4 flex justify-between items-center shrink-0 shadow-md z-20">
                <h3 className="text-white font-black text-xl">My Diary</h3>
                <button onClick={() => setShowDiary(false)} className="text-white/80 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto bg-gray-50 relative">
                {/* New Entry Section */}
                <div className="p-4 bg-white shadow-sm mb-4">
                  <h4 className="font-bold text-[#1368ce] mb-3 text-sm uppercase flex items-center gap-2">
                    <span>✍️</span> Today's Entry
                  </h4>
                  
                  {/* Mood Selector */}
                  <div className="mb-4">
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">How are you feeling?</label>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                      {Object.keys(MOOD_COLORS).map((mood) => {
                        const isSelected = selectedMood === mood;
                        return (
                          <button
                            key={mood}
                            onClick={() => setSelectedMood(mood)}
                            className={cn(
                              "px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border-2",
                              isSelected 
                                ? `${MOOD_COLORS[mood]} text-white border-transparent scale-105 shadow-md` 
                                : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200"
                            )}
                          >
                            {mood}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <textarea
                    value={diaryEntry}
                    onChange={(e) => setDiaryEntry(e.target.value)}
                    className="w-full h-32 p-3 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-[#1368ce] focus:outline-none resize-none font-medium text-gray-700 text-sm mb-3"
                    placeholder="Write about your day..."
                  />
                  
                  <button
                    onClick={handleSaveDiary}
                    disabled={!selectedMood}
                    className="w-full bg-[#1368ce] text-white py-3 rounded-xl font-black shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2 disabled:opacity-50 disabled:active:scale-100 disabled:cursor-not-allowed"
                  >
                    <span>Publish Entry</span>
                    <Book className="w-4 h-4" />
                  </button>
                </div>

                {/* Past Entries */}
                <div className="relative">
                  <div className="sticky top-0 bg-gray-50/95 backdrop-blur-sm p-4 border-b border-gray-200 z-10 flex justify-between items-center shadow-sm">
                    <h4 className="font-black text-gray-700 text-sm uppercase tracking-wider">Past Entries</h4>
                    {state.moods.some(m => m.note) && (
                      <button 
                        onClick={() => {
                          if(confirm("Delete all diary entries?")) {
                            dispatch({ type: "CLEAR_ALL_DIARY" });
                          }
                        }}
                        className="text-red-400 hover:text-red-600 p-1 rounded-md hover:bg-red-50 transition-colors"
                        title="Clear All"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="p-4 space-y-3 pb-8">
                    {state.moods
                      .filter(m => m.note)
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((entry) => (
                      <div key={entry.date} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 group">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <span className={cn("w-3 h-3 rounded-full", MOOD_COLORS[entry.mood])} />
                            <span className="font-bold text-gray-800 text-sm">{format(new Date(entry.date), "MMM d, yyyy")}</span>
                          </div>
                          <button
                            onClick={() => {
                              if(confirm("Delete this entry?")) {
                                dispatch({ type: "DELETE_DIARY", payload: entry.date });
                              }
                            }}
                            className="text-gray-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex gap-2 mb-2">
                           <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full text-white uppercase tracking-wider", MOOD_COLORS[entry.mood])}>
                              {entry.mood}
                           </span>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{entry.note}</p>
                      </div>
                    ))}
                    
                    {state.moods.filter(m => m.note).length === 0 && (
                      <div className="text-center py-8 opacity-50">
                        <p className="text-gray-400 text-sm font-bold">No entries yet.</p>
                      </div>
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
